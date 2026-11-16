// "Solve my numbers" card for Learn tools (DOM part): builds the form from a spec in solvecore-b.ts, answers as you
// type, shows the working like an exam answer. Nothing is stored or sent. Styles: src/styles/solvecard-b.css.
import { evaluate, type SSpec, type SState, type SField } from './solvecore-b';

const mk = <K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', txt = '') => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; };

export function mountSolver(box: HTMLElement, spec: SSpec, ns = '') {
  const dk = (k: string) => (ns ? `${ns}-${k}` : k);
  box.classList.add('sv');
  const top = mk('div', 'sv-top');
  const findSel = mk('select'); findSel.dataset.k = dk('find'); findSel.setAttribute('aria-label', 'What to find');
  for (const [k, l] of spec.finds) findSel.add(new Option(l, k));
  const exSel = mk('select'); exSel.dataset.k = dk('example'); exSel.dataset.nokit = '1'; exSel.setAttribute('aria-label', 'Worked example');
  exSel.add(new Option('Choose an example...', ''));
  spec.presets.forEach((p, i) => exSel.add(new Option(p.name, String(i))));
  const l1 = mk('label'); l1.append('Find ', findSel); l1.hidden = spec.finds.length < 2; const l2 = mk('label'); l2.append('Example ', exSel);
  top.append(l1, l2);
  const grid = mk('div', 'sv-grid');
  const rows = new Map<string, { wrap: HTMLElement; field: SField; inp?: HTMLInputElement; unit?: HTMLSelectElement; sel?: HTMLSelectElement }>();
  for (const f of spec.fields) {
    const wrap = mk('label', 'sv-f'); wrap.append(mk('span', 'sv-l', f.label));
    const row: { wrap: HTMLElement; field: SField; inp?: HTMLInputElement; unit?: HTMLSelectElement; sel?: HTMLSelectElement } = { wrap, field: f };
    if (f.kind === 'choice') {
      const s = mk('select'); s.dataset.k = dk(f.k); for (const [v, l] of f.options ?? []) s.add(new Option(l, v)); s.value = f.def ?? (f.options?.[0]?.[0] ?? ''); row.sel = s; wrap.append(s);
    } else {
      const r = mk('span', 'sv-r');
      const inp = mk('input'); inp.type = 'text';
      inp.inputMode = f.neg || f.kind === 'list' ? 'text' : 'decimal'; inp.autocomplete = 'off'; inp.dataset.k = dk(f.k); inp.placeholder = f.ph ?? ''; inp.setAttribute('aria-label', f.label);
      inp.addEventListener('focus', () => inp.select());
      r.append(inp); row.inp = inp;
      if (f.units && f.units.length && !(f.units.length === 1 && f.units[0][0] === '')) {
        const u = mk('select'); u.dataset.k = dk(`${f.k}-unit`); u.setAttribute('aria-label', `${f.label}, unit`);
        f.units.forEach(([l], i) => u.add(new Option(l, l, i === 0, i === 0))); row.unit = u; r.append(u);
      }
      wrap.append(r);
    }
    rows.set(f.k, row); grid.append(wrap);
  }
  const clear = mk('button', 'btn secondary small sv-clear', 'Clear'); clear.type = 'button';
  const big = mk('p', 'ax-big sv-answer'); big.dataset.k = dk('answer'); big.setAttribute('aria-live', 'polite');
  const work = mk('ol', 'sv-work'); work.dataset.k = dk('working');
  const tip = mk('p', 'ax-help sv-tip');
  box.append(top, grid, mk('div', 'sv-actions'), big, work, tip);
  box.querySelector('.sv-actions')!.append(clear);

  const state = (): SState => {
    const text: Record<string, string> = {}, unit: Record<string, string> = {}, ch: Record<string, string> = {};
    for (const [k, r] of rows) { if (r.sel) ch[k] = r.sel.value; if (r.inp) text[k] = r.inp.value; if (r.unit) unit[k] = r.unit.value; }
    return { find: findSel.value, text, unit, ch };
  };
  const render = () => {
    const st = state(), ctx = { find: st.find, ch: st.ch };
    for (const [k, r] of rows) r.wrap.hidden = k === st.find || (r.field.show ? !r.field.show(ctx) : false);
    const out = evaluate(spec, st);
    big.classList.toggle('sv-bad', !!out.error);
    big.textContent = out.error ?? out.idle ?? out.answer ?? '';
    work.replaceChildren(...(out.error || out.idle ? [] : (out.lines ?? [])).map((t) => mk('li', '', t)));
    tip.textContent = out.error || out.idle ? '' : out.tip ?? ''; tip.hidden = !tip.textContent;
  };
  const apply = (i: number) => {
    const p = spec.presets[i]; if (!p) return;
    findSel.value = p.find;
    for (const [k, r] of rows) {
      if (r.sel) r.sel.value = p.ch?.[k] ?? r.field.def ?? r.sel.value;
      if (r.inp) { const v = p.vals[k]; r.inp.value = v === undefined ? '' : Array.isArray(v) ? v[0] : v; if (r.unit) r.unit.value = Array.isArray(v) ? v[1] : r.field.units?.[0]?.[0] ?? ''; }
    }
    render();
  };
  box.addEventListener('input', (e) => { if (e.target !== exSel) render(); });
  box.addEventListener('change', (e) => { if (e.target === exSel) { if (exSel.value !== '') apply(+exSel.value); } else render(); });
  clear.addEventListener('click', () => { for (const r of rows.values()) { if (r.inp) r.inp.value = ''; } exSel.value = ''; render(); });
  apply(0);
  return { render, apply };
}
