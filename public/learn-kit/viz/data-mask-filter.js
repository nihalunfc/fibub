// Boolean-mask filtering in pandas: each condition makes a True/False column (the mask), & | ~ combine masks, and
// df[mask] keeps the True rows with their original index. Try: pick two conditions and switch & to | and see rows
// change; note that Python's `and` / `or` do not work here, you must use & and | with brackets.
import { canvas, text, row, choice, readout, title } from '../kit.js';
import { tbl } from './_data.js';

const D = [['Asha', 34, 'Pune', 72], ['Ben', 22, 'Delhi', 55], ['Chloe', 41, 'Pune', 88], ['Dev', 29, 'Kochi', 61], ['Esha', 25, 'Delhi', 93], ['Farid', 38, 'Kochi', 47], ['Gita', 31, 'Pune', 64], ['Hari', 45, 'Delhi', 70]];
const C = { none: ['(none)', () => true, ''], sc: ['score > 60', (r) => r[3] > 60, 'df.score > 60'], pune: ['city == "Pune"', (r) => r[2] === 'Pune', 'df.city == "Pune"'], young: ['age < 30', (r) => r[1] < 30, 'df.age < 30'], isin: ['city.isin(Pune, Kochi)', (r) => ['Pune', 'Kochi'].includes(r[2]), 'df.city.isin(["Pune","Kochi"])'] };
export default function (host) {
  let a = 'sc', b = 'pune', op = '&';
  const cv = canvas(host, { aspect: 1.0, max: 460, min: 340, label: 'A table with True/False mask columns and the rows kept' });
  const opts = Object.entries(C).map(([k, v]) => [k, v[0]]);
  const c1 = row(host); choice(c1, 'Mask A', opts.slice(1), a, (v) => { a = v; draw(); });
  const c2 = row(host); choice(c2, 'Mask B', opts, b, (v) => { b = v; draw(); });
  const c3 = row(host); choice(c3, 'Combine', [['&', 'A & B (and)'], ['|', 'A | B (or)'], ['~', '~A (not)']], op, (v) => { op = v; draw(); });
  const out = readout(host);
  const m = (r) => { const A = C[a][1](r), B = b === 'none' ? true : C[b][1](r); return op === '~' ? !A : op === '&' ? A && B : A || B; };
  function draw() {
    const expr = op === '~' ? `df[~(${C[a][2]})]` : b === 'none' ? `df[${C[a][2]}]` : `df[(${C[a][2]}) ${op} (${C[b][2]})]`;
    out.innerHTML = `<code>${expr}</code> keeps <b>${D.filter(m).length}</b> of ${D.length} rows. The index (0, 1, 2 ...) stays with the rows that survive.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'mask = True/False for every row', col);
    const rows = D.map((r, i) => { const A = C[a][1](r), B = b === 'none' ? '-' : C[b][1](r), M = m(r); return { c: [i, r[0], r[1], r[2], r[3], A ? 'T' : 'F', B === '-' ? '-' : B ? 'T' : 'F', M ? 'KEEP' : ''], bg: M ? col.soft : null, alpha: M ? 1 : 0.45, cc: [null, null, null, null, null, A ? col.good : col.bad, B === '-' ? col.muted : B ? col.good : col.bad, col.good], bold: M }; });
    tbl(ctx, col, 6, 40, ['i', 'name', 'age', 'city', 'score', 'A', 'B', 'mask'], rows, [w * 0.06, w * 0.17, w * 0.1, w * 0.15, w * 0.13, w * 0.08, w * 0.08, w * 0.18], { rh: 24, size: 11.5 });
    text(ctx, 'T = True, F = False. Dimmed rows are dropped.', 8, 40 + 24 * 9 + 14, { color: col.muted, size: 11 });
  };
  draw();
}
