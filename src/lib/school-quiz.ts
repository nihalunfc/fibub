// "Check yourself" blocks for school (Learn) tools: a few fresh questions with random numbers, the answer checked
// in the browser and a worked answer to reveal. Nothing is stored or sent. Uses the shared .ax classes.
export type Question = { text: string; answer: number; unit?: string; tol?: number; work: string[]; hint?: string };

/** Fill `box` with `count` questions from `make` and a "New questions" button. */
export function mountQuiz(box: HTMLElement, make: () => Question, count = 4) {
  const parse = (s: string) => {
    const t = s.trim().replace(/[−–]/g, '-').replace(',', '.').replace(/\s+/g, '');
    return /^[-+]?(\d+\.?\d*|\.\d+)$/.test(t) ? Number(t) : NaN;
  };
  const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', text = '') => { const e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; };
  const render = () => {
    const list = el('ol', 'sq-list');
    list.style.cssText = 'margin:0;padding-left:22px;display:grid;gap:14px';
    for (let i = 0; i < count; i++) {
      const q = make(), li = el('li', 'sq-q');
      const p = el('p', 'sq-text', q.text); p.style.margin = '0 0 6px';
      const row = el('div', 'ax-row');
      const inp = el('input', 'sq-in'); inp.type = 'text'; inp.inputMode = 'decimal'; inp.setAttribute('aria-label', `Answer to question ${i + 1}`); inp.style.maxWidth = '140px';
      const unit = el('span', '', q.unit ?? '');
      const chk = el('button', 'btn small sq-check', 'Check'); chk.type = 'button';
      const show = el('button', 'btn secondary small sq-show', 'Show working'); show.type = 'button';
      const res = el('span', 'ax-pill sq-res'); res.hidden = true;
      row.append(inp, unit, chk, show, res);
      const work = el('div', 'sq-work ax-help'); work.hidden = true;
      for (const w of q.work) work.append(el('p', '', w));
      if (q.hint) work.append(el('p', '', q.hint));
      const tol = q.tol ?? Math.max(0.01, Math.abs(q.answer) * 0.01);
      const check = () => {
        const v = parse(inp.value);
        res.hidden = false;
        if (Number.isNaN(v)) { res.className = 'ax-pill warn sq-res'; res.textContent = 'Type a number'; return; }
        const ok = Math.abs(v - q.answer) <= tol;
        res.className = `ax-pill ${ok ? 'good' : 'bad'} sq-res`;
        res.textContent = ok ? 'Correct' : 'Not quite';
        if (!ok) work.hidden = false;
      };
      chk.addEventListener('click', check);
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
      show.addEventListener('click', () => { work.hidden = !work.hidden; });
      li.append(p, row, work);
      list.append(li);
    }
    const again = el('button', 'btn secondary small sq-new', 'New questions'); again.type = 'button';
    again.addEventListener('click', render);
    const foot = el('div', 'ax-row'); foot.style.marginTop = '12px'; foot.append(again);
    box.replaceChildren(list, foot);
  };
  render();
}

/** Random whole number from lo to hi inclusive; pick one item. */
export const randInt = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1));
export const pick = <T,>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)];
/** Round for a printed answer: 2 decimals at most, minus sign as −. */
export const r2 = (x: number) => Math.round(x * 100) / 100;
export const show = (x: number) => (Number.isFinite(x) ? String(r2(x)).replace('-', '−') : x > 0 ? '∞' : '−∞');
