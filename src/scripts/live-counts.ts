// The live per-tool table on /stats/: running totals from /api/counts joined to the tool list.
type Row = { id: string; n: string; k?: number; u: string };
const box = document.querySelector<HTMLElement>('[data-live-counts]');
if (box) {
  const fmt = (n: number) => n.toLocaleString('en');
  const set = (k: string, v: string) => { const el = box.querySelector(`[data-lc="${k}"]`); if (el) el.textContent = v; };
  const tbody = box.querySelector('tbody')!;
  Promise.all([fetch('/api/counts').then((r) => { if (!r.ok) throw r; return r.json(); }), fetch('/tools.json').then((r) => r.json())])
    .then(([c, tools]: [{ site: number; tools: Record<string, { v: number; u: number }> }, Row[]]) => {
      const rows = tools.map((t) => ({ ...t, v: c.tools[t.id]?.v ?? 0, uses: c.tools[t.id]?.u ?? 0 }));
      set('site', fmt(c.site));
      set('views', fmt(rows.reduce((s, r) => s + r.v, 0)));
      set('uses', fmt(rows.reduce((s, r) => s + r.uses, 0)));
      const rate = (r: { v: number; uses: number }) => (r.v ? r.uses / r.v : 0);
      const draw = (by: string) => {
        const key = by === 'u' ? (r: typeof rows[0]) => r.uses : by === 'r' ? rate : (r: typeof rows[0]) => r.v;
        const sorted = rows.slice().sort((a, b) => key(b) - key(a) || b.v - a.v || (a.k ?? 0) - (b.k ?? 0));
        tbody.replaceChildren(...sorted.map((r) => {
          const tr = document.createElement('tr');
          const td = (text: string, cls = '') => { const x = document.createElement('td'); x.textContent = text; if (cls) x.className = cls; return x; };
          const name = document.createElement('td'), a = document.createElement('a'), num = document.createElement('small');
          a.href = r.u; a.textContent = r.n; num.textContent = r.k ? ` #${r.k}` : '';
          name.append(a, num);
          tr.append(name, td(fmt(r.v), 'r'), td(fmt(r.uses), 'r'), td(r.v ? `${Math.round(rate(r) * 100)}%` : '–', 'r'));
          return tr;
        }));
        box.querySelectorAll<HTMLButtonElement>('[data-sort]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.sort === by)));
      };
      box.querySelectorAll<HTMLButtonElement>('[data-sort]').forEach((b) => b.addEventListener('click', () => draw(b.dataset.sort!)));
      draw('v');
    })
    .catch(() => { ['site', 'views', 'uses'].forEach((k) => set(k, '–')); box.querySelector<HTMLElement>('.lc-msg')!.hidden = false; });
}
