// #1289 Solutions on a line. Checked against Python fractions.Fraction (axis crossings, y at x = 2, and the count of
// whole-number solutions on the −10..10 grid) for 399 random equations (two-variable-line.ref.json), and the
// guide's worked example 2x + 3y = 12.
import { readFileSync } from 'node:fs';
import { kind, test, yAt, xAt, intercepts, wholeSolutions, eqText, clip } from '../../src/lib/sci/line2v-l2.ts';
import { fracText } from '../../src/lib/sci/smath.ts';

export default async (check) => {
  const e = { a: 2, b: 3, c: 12 };
  check('line: 2x + 3y = 12 crosses at (6, 0) and (0, 4)', intercepts(e).x === 6 && intercepts(e).y === 4 && kind(e) === 'line');
  check('line: (1.5, 3) is a solution, (2, 3) is not', test(e, 1.5, 3).ok && !test(e, 2, 3).ok && test(e, 2, 3).lhs === 13);
  const w = wholeSolutions(e);
  check('line: 7 whole solutions from (−9, 10) to (9, −2)', w.length === 7 && w[0].join() === '-9,10' && w[6].join() === '9,-2');
  check('line: table values y(−2) = 16/3, y(3) = 2', fracText(12 - 2 * -2, 3) === '16/3' && yAt(e, 3) === 2);
  check('line: kinds', kind({ a: 0, b: 1, c: -3 }) === 'horizontal' && kind({ a: 1, b: 0, c: 4 }) === 'vertical' && kind({ a: 0, b: 0, c: 0 }) === 'everything' && kind({ a: 0, b: 0, c: 2 }) === 'nothing');
  check('line: equation text', eqText(e) === '2x + 3y = 12' && eqText({ a: 1, b: -1, c: 0 }) === 'x − y = 0' && eqText({ a: 0, b: 1, c: -3 }) === 'y = −3' && eqText({ a: -2, b: 1, c: 5 }) === '−2x + y = 5');
  const s = clip(e, 10);
  check('line: drawn from (−9, 10) to (10, −8/3)', s && s[0].join() === '-9,10' && s[1][0] === 10 && Math.abs(s[1][1] + 8 / 3) < 1e-12);
  check('line: x = 4 drawn top to bottom; x = 40 off the grid', clip({ a: 1, b: 0, c: 4 }, 10)[0][0] === 4 && clip({ a: 1, b: 0, c: 40 }, 10) === null && xAt({ a: 1, b: 0, c: 4 }, 7) === 4);
  const ref = JSON.parse(readFileSync(new URL('./two-variable-line.ref.json', import.meta.url), 'utf8'));
  let ok = 0;
  for (const r of ref) {
    const q = { a: r.a, b: r.b, c: r.c }, ws = wholeSolutions(q);
    const fx = r.a ? fracText(r.c, r.a).replace('−', '-') : null, fy = r.b ? fracText(r.c, r.b).replace('−', '-') : null;
    const y2 = r.b ? fracText(r.c - 2 * r.a, r.b).replace('−', '-') : null;
    if (ws.length === r.n && (r.n === 0 || ws[0].join() === r.first[0].join()) && fx === r.xi && fy === r.yi && y2 === r.y2 && ws.every(([x, y]) => test(q, x, y).ok)) ok++;
  }
  check(`random equations match Python Fraction (${ok}/${ref.length})`, ok === ref.length);
};
