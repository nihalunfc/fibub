// The live part of /stats/: totals, charts and top lists, drawn from the public counters
// (/api/counts for the running totals, /api/days for the last 30 days). Charts are small inline SVG
// built here, so no chart library is loaded. Counts only: nothing about any visitor exists to show.
import { loadIndex } from './find';

type Counts = { site: number; pages: Record<string, number>; uses: Record<string, number> };
type Days = Record<string, { site: number; uses: Record<string, number> }>;
type Row = { id: string; n: string; u: string; cat: string; sub: string; v: number; use: number };

const NS = 'http://www.w3.org/2000/svg';
const fmt = (n: number) => n.toLocaleString('en');
const short = (n: number) => (n >= 1e6 ? `${+(n / 1e6).toFixed(1)}M` : n >= 1e4 ? `${+(n / 1e3).toFixed(0)}k` : n >= 1e3 ? `${+(n / 1e3).toFixed(1)}k` : String(n));
const $ = <T extends HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
function el(tag: string, attrs: Record<string, string | number> = {}, text?: string) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  if (text !== undefined) e.textContent = text;
  return e;
}
const svg = (w: number, h: number, label: string) => el('svg', { viewBox: `0 0 ${w} ${h}`, role: 'img', 'aria-label': label });

/** Horizontal bars: one row per item, a dark bar for `a` and a light bar for `b`. */
function barChart(host: HTMLElement, items: { label: string; a: number; b: number; href?: string }[], label: string) {
  const W = 480, rowH = 30, left = 118, right = 56, top = 4;
  const H = top + items.length * rowH + 4;
  const s = svg(W, H, label);
  const max = Math.max(1, ...items.map((i) => Math.max(i.a, i.b)));
  const scale = (n: number) => ((W - left - right) * n) / max;
  items.forEach((it, i) => {
    const y = top + i * rowH;
    const t = el('text', { x: left - 8, y: y + 14, 'text-anchor': 'end', class: 'lab' }, it.label.length > 18 ? it.label.slice(0, 17) + '…' : it.label);
    s.append(t);
    s.append(el('rect', { class: 'b1', x: left, y: y + 3, width: Math.max(2, scale(it.a)), height: 10, rx: 2 }));
    s.append(el('text', { x: left + Math.max(2, scale(it.a)) + 6, y: y + 12 }, short(it.a)));
    s.append(el('rect', { class: 'b2', x: left, y: y + 15, width: Math.max(2, scale(it.b)), height: 8, rx: 2 }));
    s.append(el('text', { x: left + Math.max(2, scale(it.b)) + 6, y: y + 23 }, short(it.b)));
  });
  host.replaceChildren(s);
}

/** A two-line chart over the days: `a` solid, `b` dashed, with a few date labels and gridlines. */
function lineChart(host: HTMLElement, days: string[], a: number[], b: number[]) {
  const W = 480, H = 220, l = 40, r = 10, t = 10, bt = 24;
  const s = svg(W, H, 'Page views and tool uses per day over the last 30 days');
  const max = Math.max(1, ...a, ...b);
  const x = (i: number) => l + ((W - l - r) * i) / Math.max(1, days.length - 1);
  const y = (n: number) => t + (H - t - bt) * (1 - n / max);
  for (let g = 0; g <= 4; g++) {
    const v = (max * g) / 4, yy = y(v);
    s.append(el('line', { class: 'grid', x1: l, x2: W - r, y1: yy, y2: yy }));
    s.append(el('text', { x: l - 6, y: yy + 4, 'text-anchor': 'end' }, short(Math.round(v))));
  }
  [0, 7, 14, 21, days.length - 1].forEach((i) => s.append(el('text', { x: x(i), y: H - 6, 'text-anchor': i === 0 ? 'start' : i === days.length - 1 ? 'end' : 'middle' }, days[i].slice(5))));
  const path = (vals: number[]) => vals.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  s.append(el('path', { class: 'l2', d: path(b) }), el('path', { class: 'l1', d: path(a) }));
  host.replaceChildren(s);
}

/** A list of tools, five at a time, with a button for the next five. */
function topList(title: string, rows: Row[]) {
  const box = document.createElement('section');
  box.className = 'cat';
  const h = document.createElement('h4');
  h.textContent = title;
  box.append(h);
  if (!rows.length) { const p = document.createElement('p'); p.className = 'none'; p.textContent = 'No use counted yet.'; box.append(p); return box; }
  const ol = document.createElement('ol');
  box.append(ol);
  let shown = 0;
  const more = document.createElement('button');
  more.type = 'button';
  const add = () => {
    for (const r of rows.slice(shown, shown + 5)) {
      const li = document.createElement('li'), a = document.createElement('a'), n = document.createElement('span');
      a.href = r.u; a.textContent = r.n;
      n.className = 'n'; n.textContent = `${fmt(r.use)} ${r.use === 1 ? 'use' : 'uses'} · ${fmt(r.v)} ${r.v === 1 ? 'view' : 'views'}`;
      li.append(a, n); ol.append(li);
    }
    shown = Math.min(rows.length, shown + 5);
    more.hidden = shown >= rows.length || shown >= 25;
    more.textContent = `Show 5 more (${shown} of ${Math.min(rows.length, 25)})`;
  };
  add();
  more.addEventListener('click', add);
  box.append(more);
  return box;
}

const byUse = (x: Row, y: Row) => y.use - x.use || y.v - x.v || x.n.localeCompare(y.n);

(async () => {
  const msg = $('.live-msg');
  try {
    const day = (off: number) => new Date(Date.now() - off * 86_400_000).toISOString().slice(0, 10);
    const [cRes, dRes, index] = await Promise.all([fetch('/api/counts'), fetch(`/api/days?from=${day(29)}&to=${day(0)}`), loadIndex()]);
    if (!cRes.ok) throw new Error('counts');
    const c = (await cRes.json()) as Counts;
    const d: Days = dRes.ok ? ((await dRes.json()) as Days) : {};
    const rows: Row[] = index.map((e) => {
      const [cat, sub] = e.p.split(' › ');
      return { id: e.id, n: e.n, u: e.u, cat: cat || 'Other', sub: sub || '', v: c.pages[e.u] ?? 0, use: c.uses[e.id] ?? 0 };
    });
    const totalUses = rows.reduce((n, r) => n + r.use, 0), toolViews = rows.reduce((n, r) => n + r.v, 0);
    const set = (k: string, t: string) => { $(`[data-k="${k}"]`).textContent = t; };
    set('site', fmt(c.site)); set('uses', fmt(totalUses)); set('used', fmt(rows.filter((r) => r.use > 0).length));
    set('rate', toolViews ? (totalUses / toolViews * 100).toFixed(1) : '0');

    // Last 30 days.
    const days = Array.from({ length: 30 }, (_, i) => day(29 - i));
    lineChart($('.chart-days'), days, days.map((x) => d[x]?.site ?? 0), days.map((x) => Object.values(d[x]?.uses ?? {}).reduce((n, v) => n + v, 0)));

    // Top 10 tools.
    const ranked = [...rows].sort(byUse).filter((r) => r.use > 0 || r.v > 0);
    const top = ranked.slice(0, 10);
    if (top.length) barChart($('.chart-top'), top.map((r) => ({ label: r.n, a: r.use, b: r.v })), 'The ten most used tools, with uses and page views');
    else $('.chart-top').textContent = 'Nothing counted yet.';

    // By area (shelf).
    const cats = new Map<string, Row[]>();
    for (const r of rows) cats.set(r.cat, [...(cats.get(r.cat) ?? []), r]);
    const catRows = [...cats].map(([name, list]) => ({ name, list: list.sort(byUse), use: list.reduce((n, r) => n + r.use, 0), v: list.reduce((n, r) => n + r.v, 0) })).sort((x, y) => y.use - x.use || y.v - x.v);
    barChart($('.chart-cats'), catRows.map((k) => ({ label: k.name, a: k.use, b: k.v })), 'Tool uses and page views by area');
    $('.cat-grid').replaceChildren(...catRows.map((k) => topList(k.name, k.list.filter((r) => r.use > 0 || r.v > 0))));

    // Science subjects.
    const subs = new Map<string, Row[]>();
    for (const r of rows) if (r.cat === 'Science' && r.sub) subs.set(r.sub, [...(subs.get(r.sub) ?? []), r]);
    const subRows = [...subs].map(([name, list]) => ({ name, list: list.sort(byUse).filter((r) => r.use > 0 || r.v > 0), use: list.reduce((n, r) => n + r.use, 0) })).filter((k) => k.list.length).sort((x, y) => y.use - x.use);
    if (subRows.length) { $('.sci-h').hidden = false; $('.sci-grid').replaceChildren(...subRows.map((k) => topList(k.name, k.list))); }

    msg.hidden = true;
    $('.live-body').hidden = false;
  } catch { msg.textContent = 'The live counts could not be loaded just now. Try again in a moment.'; }
})();
