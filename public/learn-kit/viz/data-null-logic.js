// SQL's three-valued logic: TRUE, FALSE and UNKNOWN (what NULL makes of a comparison). Pick two inputs and AND / OR to
// see the answer in the truth table, then test five WHERE conditions on rows that include NULLs: WHERE keeps only TRUE.
// Try: x <> 5 versus NOT (x = 5) versus x <> 5 OR x IS NULL.
import { canvas, text, row, choice, readout, title } from '../kit.js';
import { tbl } from './_data.js';

const T = 'TRUE', F = 'FALSE', U = 'UNKNOWN';
const AND = (a, b) => (a === F || b === F ? F : a === U || b === U ? U : T), OR = (a, b) => (a === T || b === T ? T : a === U || b === U ? U : F);
const X = [3, 5, null, 8, null, 5];
const CONDS = { eq: ['x = 5', (x) => (x === null ? U : x === 5 ? T : F)], ne: ['x <> 5', (x) => (x === null ? U : x !== 5 ? T : F)], not: ['NOT (x = 5)', (x) => { const v = x === null ? U : x === 5 ? T : F; return v === T ? F : v === F ? T : U; }], isn: ['x IS NULL', (x) => (x === null ? T : F)], ne2: ['x <> 5 OR x IS NULL', (x) => OR(x === null ? U : x !== 5 ? T : F, x === null ? T : F)] };
export default function (host) {
  let a = T, b = U, op = 'AND', cd = 'ne';
  const cv = canvas(host, { aspect: 1.1, max: 470, min: 360, label: 'Truth table for TRUE, FALSE and UNKNOWN, and a WHERE test on rows with NULL' });
  const c1 = row(host);
  const V = [[T, 'TRUE'], [F, 'FALSE'], [U, 'NULL']];
  choice(c1, 'A', V, a, (v) => { a = v; draw(); }); choice(c1, 'B', V, b, (v) => { b = v; draw(); });
  const c2 = row(host); choice(c2, 'Operator', [['AND', 'AND'], ['OR', 'OR']], op, (v) => { op = v; draw(); });
  const c3 = row(host); choice(c3, 'WHERE', Object.entries(CONDS).map(([k, v]) => [k, v[0]]), cd, (v) => { cd = v; draw(); });
  const out = readout(host);
  const f = () => (op === 'AND' ? AND : OR);
  function draw() {
    const res = f()(a, b), kept = X.filter((x) => CONDS[cd][1](x) === T).length;
    out.innerHTML = `<b>${a === U ? 'NULL' : a} ${op} ${b === U ? 'NULL' : b} = ${res === U ? 'UNKNOWN' : res}.</b> <code>WHERE ${CONDS[cd][0]}</code> keeps ${kept} of 6 rows: only TRUE passes, so UNKNOWN rows (NULL) are dropped silently.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `Truth table: A ${op} B`, col);
    const vals = [T, F, U], cs = (v) => (v === T ? col.good : v === F ? col.bad : col.warn), cell = Math.min(60, (w - 90) / 3);
    ctx.save();
    vals.forEach((bv, j) => text(ctx, bv === U ? 'NULL' : bv, 70 + j * cell + cell / 2, 46, { color: col.muted, size: 10, align: 'center', fit: false }));
    vals.forEach((av, i) => {
      text(ctx, av === U ? 'NULL' : av, 62, 66 + i * 24, { color: col.muted, size: 10, align: 'right', fit: false });
      vals.forEach((bv, j) => { const r = f()(av, bv), on = av === a && bv === b; ctx.fillStyle = on ? col.soft : col.panel; ctx.fillRect(70 + j * cell, 54 + i * 24, cell - 2, 22); ctx.strokeStyle = on ? col.ink : col.line; ctx.lineWidth = on ? 2 : 1; ctx.strokeRect(70 + j * cell, 54 + i * 24, cell - 2, 22); text(ctx, r === U ? 'UNK' : r, 70 + j * cell + cell / 2 - 1, 65 + i * 24, { color: cs(r), size: 10.5, weight: 700, align: 'center', fit: false }); });
    });
    text(ctx, 'A', 10, 66, { color: col.muted, size: 11 }); text(ctx, 'B →', 10, 46, { color: col.muted, size: 11 });
    ctx.restore();
    text(ctx, `Rows tested: WHERE ${CONDS[cd][0]}`, 10, 144, { color: col.ink, size: 12, weight: 600 });
    const rows = X.map((x, i) => { const r = CONDS[cd][1](x); return { c: [i + 1, x === null ? 'NULL' : x, r === U ? 'UNKNOWN' : r, r === T ? 'kept' : 'dropped'], alpha: r === T ? 1 : 0.5, cc: [null, x === null ? col.bad : null, cs(r), r === T ? col.good : col.muted] }; });
    tbl(ctx, col, 10, 154, ['row', 'x', 'condition is', 'WHERE'], rows, [w * 0.12, w * 0.15, w * 0.38, w * 0.3], { rh: 22, size: 12 });
  };
  draw();
}
