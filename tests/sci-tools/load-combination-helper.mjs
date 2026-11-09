// #651 load combination helper. Checked against an independent NumPy calculation (factor vectors times the
// load matrix for every sign of the reversible loads via itertools.product). Example loads and the example
// factor sets are made up, not from any code.
import * as LC from '../../src/lib/sci/eng-loadcomb.ts';
import { parseTable } from '../../src/lib/sci/num.ts';
const near = (a, b, t) => Number.isFinite(a) && Math.abs(a - b) <= t;
export default async (check) => {
  const L = LC.parseLoads(parseTable('Load, N (kN), M (kN·m), V (kN)\nD, 400, 35, 18\nL, 220, 28, 12\nS, 60, 8, 4\nW, ±40, ±95, ±42\nE, ±25, ±120, ±55'));
  check('loadcomb: parses effects, loads and ± marks', L.effects.length === 3 && L.loads.length === 5 && L.loads[3].rev.every(Boolean) && !L.loads[0].rev.some(Boolean) && L.loads[4].values[1] === 120);
  const C = LC.parseCombos(LC.PRESETS.factored, L.loads.map((l) => l.name));
  check('loadcomb: example set parsed (7 combinations)', C.length === 7 && C[1].terms.length === 3 && C[1].terms[0].f === 1.25);
  const r = LC.evaluate(L, C);
  const py = [[560.0, 49.0, 25.2], [860.0, 89.75, 42.5], [700.0, 69.75, 34.5], [666.0, 190.75, 87.3], [554.0, -75.25, -30.3], [535.0, 169.0, 79.0], [485.0, -71.0, -31.0], [416.0, 164.5, 75.0], [304.0, -101.5, -42.6], [385.0, 151.5, 71.2], [335.0, -88.5, -38.8]];
  check('loadcomb: 11 rows with reversible wind and earthquake (NumPy)', r.rows.length === 11 && r.rows.every((row, i) => row.values.every((v, e) => near(v, py[i][e], 1e-9))));
  check('loadcomb: maxima 860, 190.75, 87.3 in rows 1, 3, 3 (NumPy)', r.max.map((x) => x.row).join() === '1,3,3' && near(r.max[1].value, 190.75, 1e-9));
  check('loadcomb: minima 304, −101.5, −42.6 all in row 8 (NumPy)', r.min.map((x) => x.row).join() === '8,8,8' && near(r.min[2].value, -42.6, 1e-9));
  check('loadcomb: largest size of each effect', r.abs.map((x) => x.row).join() === '1,3,3');
  check('loadcomb: variant labels', r.rows[3].variant === 'W+' && r.rows[4].variant === 'W−' && r.rows[0].variant === '');
  const two = LC.evaluate(L, LC.parseCombos('Both: D + W + E', L.loads.map((l) => l.name)));
  check('loadcomb: two reversible loads give four sign cases (N 465 to 335)', two.rows.length === 4 && near(two.max[0].value, 465, 1e-9) && near(two.min[0].value, 335, 1e-9) && two.rows[0].combo === 'Both');
  const p = LC.parseCombos('1.2d+1.6L - 0.5S\n# note\n2 D', ['D', 'L', 'S']);
  check('loadcomb: lower-case names, minus terms, repeated loads, comments', p.length === 2 && p[0].terms[2].f === -0.5 && p[0].terms[0].load === 'D' && p[1].terms[0].f === 2);
  let msg = ''; try { LC.parseCombos('1.2D + 1.6X', ['D', 'L']); } catch (e) { msg = e.message; }
  check('loadcomb: unknown load explained', msg.includes('"X"') && msg.includes('not one of your loads'));
  msg = ''; try { LC.parseLoads(parseTable('Load, M\nD, 1\nD, 2')); } catch (e) { msg = e.message; }
  check('loadcomb: duplicate load explained', msg.includes('listed twice'));
  msg = ''; try { LC.parseLoads(parseTable('Load, M\nD, abc')); } catch (e) { msg = e.message; }
  check('loadcomb: bad number explained', msg.includes('not a number'));
  const lp = LC.parseLoads([['Load', 'M'], ['W', '+/-10'], ['X', '']]);
  check('loadcomb: "+/-" also marks reversible, blank is zero', lp.loads[0].rev[0] && lp.loads[0].values[0] === 10 && lp.loads[1].values[0] === 0);
};
