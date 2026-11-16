// The "Solve my numbers" card for the mechanics Learn tools: a "What do you want to find?" choice, typed numbers with
// unit boxes, the answer in one sentence at the top, the working like a marked exam answer, one common mistake, and
// worked-example buttons. Maths in phys-a.ts. Nothing is stored or sent. Inputs have data-k="<problem>-<field>" so the
// shared Copy-link script can restore them; the answer block is aria-live so Copy result works.
import { readNumber } from './quiz';
import { sg, type Field, type Prob, type SolverSet } from './phys-a';

const CSS = `.ps{display:grid;gap:12px}.ps label{display:grid;gap:4px;font-size:14px;color:var(--muted)}
.ps-fields{display:grid;gap:10px;grid-template-columns:minmax(0,1fr)}@media(min-width:520px){.ps-fields{grid-template-columns:repeat(2,minmax(0,1fr))}}
.ps-f[hidden]{display:none}.ps-in{display:flex;gap:6px}.ps-in input{flex:1 1 90px;min-width:0;min-height:44px}.ps-in select{flex:0 0 auto;width:auto;min-width:76px;min-height:44px}
.ps select,.ps input{min-height:44px}.ps-hint{font-size:12px;color:var(--muted)}
.ps-out{border-left:4px solid var(--accent);padding:6px 0 6px 12px}.ps-ans{margin:0;font-size:18px;font-weight:650;color:var(--ink);overflow-wrap:anywhere}
.ps-ans.ps-bad{color:var(--bad);font-weight:600;font-size:16px}.ps-ans.ps-wait{color:var(--muted);font-weight:500;font-size:16px}
.ps-work{margin:8px 0 0;padding-left:20px;display:grid;gap:4px;font-size:15px;color:var(--ink);overflow-wrap:anywhere}
.ps-tip{margin:0;font-size:14px;color:var(--muted)}.ps-tip b{color:var(--ink)}.ps-pre{display:flex;flex-wrap:wrap;gap:8px}
.ps-pre button{min-height:44px;font:inherit;font-size:14px;padding:6px 12px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--ink);cursor:pointer}
.ps-pre button:hover{border-color:var(--accent)}.ps-cap{font-size:13px;color:var(--muted);margin:0}`;

export function mountSolver(host: HTMLElement, set: SolverSet) {
  if (!document.getElementById('ps-css')) { const st = document.createElement('style'); st.id = 'ps-css'; st.textContent = CSS; document.head.append(st); }
  host.classList.add('ps');
  const el = <K extends keyof HTMLElementTagNameMap>(t: K, c = '', x = '') => { const e = document.createElement(t); if (c) e.className = c; if (x) e.textContent = x; return e; };
  const pickL = el('label', '', 'What do you want to find?'), pick = el('select');
  pick.dataset.k = 'prob'; set.probs.forEach((p) => pick.append(new Option(p.label, p.id))); pickL.append(pick);
  const fields = el('div', 'ps-fields'), out = el('div', 'ps-out'), ans = el('p', 'ps-ans'), work = el('ol', 'ps-work'), tip = el('p', 'ps-tip');
  out.setAttribute('aria-live', 'polite'); out.append(ans, work);
  const preBox = el('div', 'ps-pre'), cap = el('p', 'ps-cap', 'Worked examples (tap one to fill in the numbers):');
  const wraps: Record<string, { w: HTMLElement; f: Field; i: HTMLInputElement | HTMLSelectElement; u?: HTMLSelectElement }[]> = {};
  for (const p of set.probs) {
    wraps[p.id] = p.fields.map((f) => {
      const w = el('label', 'ps-f'), name = el('span', '', f.label), row = el('div', 'ps-in');
      let i: HTMLInputElement | HTMLSelectElement, u: HTMLSelectElement | undefined;
      if (f.sel) { i = el('select'); f.sel.forEach((o, n) => (i as HTMLSelectElement).append(new Option(o, String(n)))); i.value = f.def; row.append(i); }
      else {
        i = el('input'); i.type = 'text'; i.inputMode = 'decimal'; i.value = f.def; i.autocomplete = 'off'; i.setAttribute('aria-label', f.label); row.append(i);
        if (f.units && f.units.length > 1) { u = el('select'); f.units.forEach(([n]) => u!.append(new Option(n, n))); u.dataset.k = `${p.id}-${f.k}-u`; u.setAttribute('aria-label', `${f.label} unit`); row.append(u); }
        else if (f.units) { const s = el('span', 'ps-hint', f.units[0][0]); s.style.alignSelf = 'center'; row.append(s); }
      }
      i.dataset.k = `${p.id}-${f.k}`;
      w.append(name, row); if (f.hint) w.append(el('span', 'ps-hint', f.hint));
      w.dataset.p = p.id; fields.append(w);
      return { w, f, i, u };
    });
  }
  set.presets.forEach((pr) => {
    const b = el('button', '', pr.label); b.type = 'button';
    b.addEventListener('click', () => {
      pick.value = pr.prob;
      for (const x of wraps[pr.prob]) {
        if (pr.v[x.f.k] !== undefined) x.i.value = pr.v[x.f.k];
        if (x.u) x.u.value = pr.u?.[x.f.k] ?? x.f.units![0][0];
      }
      render();
    });
    preBox.append(b);
  });
  host.append(pickL, fields, out, tip, cap, preBox);

  function render() {
    const prob: Prob = set.probs.find((p) => p.id === pick.value) ?? set.probs[0];
    for (const p of set.probs) wraps[p.id].forEach((x) => { x.w.hidden = p.id !== prob.id; });
    const vals: Record<string, number> = {}, conv: string[] = [];
    let msg = '';
    for (const x of wraps[prob.id]) {
      const f = x.f;
      if (f.sel) { vals[f.k] = Number(x.i.value); continue; }
      const raw = readNumber((x.i as HTMLInputElement).value);
      if (!Number.isFinite(raw)) { if (!msg) msg = (x.i as HTMLInputElement).value.trim() === '' ? `Type a number for "${f.label}".` : `"${(x.i as HTMLInputElement).value}" is not a number I can read in "${f.label}".`; continue; }
      const un = f.units?.find(([n]) => n === x.u?.value) ?? f.units?.[0], fac = un ? un[1] : 1, v = raw * fac;
      if (f.gt !== undefined && !(v > f.gt)) { if (!msg) msg = `"${f.label}" must be more than ${sg(f.gt)}.`; continue; }
      if (f.min !== undefined && v < f.min - 1e-12) { if (!msg) msg = `"${f.label}" cannot be less than ${sg(f.min)}.`; continue; }
      if (f.max !== undefined && v > f.max + 1e-12) { if (!msg) msg = `"${f.label}" cannot be more than ${sg(f.max)}.`; continue; }
      vals[f.k] = v;
      if (un && fac !== 1) conv.push(`${sg(raw)} ${un[0]} = ${sg(v)} ${(f.units!.find((q) => q[1] === 1) ?? ['SI units'])[0]}`);
    }
    tip.replaceChildren(); work.replaceChildren();
    if (msg) { ans.textContent = msg; ans.className = 'ps-ans ps-wait'; return; }
    let r;
    try { r = prob.solve(vals); } catch { r = { err: 'Those numbers do not give an answer. Check them.' }; }
    if ('err' in r) { ans.textContent = r.err; ans.className = 'ps-ans ps-bad'; return; }
    const ok = [r.ans, ...r.work].every((t) => !/NaN|Infinity/.test(t));
    if (!ok) { ans.textContent = 'Those numbers do not give an answer. Check them (nothing should be zero or negative that cannot be).'; ans.className = 'ps-ans ps-bad'; return; }
    ans.textContent = r.ans; ans.className = 'ps-ans';
    for (const t of [...(conv.length ? [`Convert to base units: ${conv.join('; ')}`] : []), ...r.work]) work.append(el('li', '', t));
    const b = el('b', '', 'Common mistake: '); tip.append(b, prob.tip);
  }
  host.addEventListener('input', render); host.addEventListener('change', render);
  render();
}
