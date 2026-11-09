// #472 drug-combination synergy. Reference numbers from an independent Python implementation (SciPy curve_fit Hill
// fits with multiple starts, brentq for the Loewe surface) on the example and 20 random matrices: Hill parameters
// agree to 3e-5 (relative), every Bliss / HSA / Loewe / CI cell to 3e-4.
import { analyse, fitHill, hill, hillInv, loeweExpected, parseMatrix } from '../../src/lib/sci/synergy.ts';
import { num } from '../../src/lib/sci/num.ts';

export default async (check) => {
  const near = (a, b, tol) => Number.isFinite(a) && Math.abs(a - b) <= tol;
  const A = [0, 0.1, 0.3, 1, 3, 10], B = [0, 1, 3, 10, 30, 100];
  const E = [[0, 7.4, 21, 45, 67.1, 84.4], [6.8, 18.3, 29.8, 54.9, 70.1, 89.8], [23.4, 35.3, 43.8, 62.1, 78.4, 90.9], [56.4, 65.6, 71.6, 78.7, 85.3, 94.8], [82, 83, 86.5, 90.7, 93.4, 95.5], [95.4, 97.6, 96.4, 96.6, 99.3, 100]];
  const r = analyse({ a: A, b: B, e: E }, 100);
  check('synergy: Hill fit drug A (top 100) vs curve_fit', near(r.hillA.ec50, 0.8163870817906538, 1e-6) && near(r.hillA.h, 1.1953368851710209, 1e-6));
  check('synergy: Hill fit drug B (top 100) vs curve_fit', near(r.hillB.ec50, 13.340567564466426, 1e-5) && near(r.hillB.h, 0.8844627462554148, 1e-6));
  check('synergy: Bliss and HSA summary', near(r.summary.bliss.mean, 2.30544, 1e-9) && near(r.summary.bliss.max, 6.2316, 1e-9) && near(r.summary.hsa.mean, 9.204, 1e-9));
  check('synergy: Loewe mean excess and CI geometric mean', near(r.summary.loewe.mean, 5.276144939880263, 1e-5) && near(r.summary.ci.geoMean, 0.6433999100569386, 1e-6) && r.summary.ci.n === 24 && r.summary.ci.syn === 22 && r.summary.ci.add === 2);
  const c = r.cells.find((x) => x.a === 0.3 && x.b === 3);
  check('synergy: one cell (0.3, 3): Bliss 39.486, Loewe 36.610, CI 0.7508', near(c.bliss, 39.486, 1e-9) && near(c.blissEx, 4.314, 1e-9) && near(c.hsaEx, 20.4, 1e-9) && near(c.loewe, 36.61010771, 1e-5) && near(c.ci, 0.75077722, 1e-6));
  const f = analyse({ a: A, b: B, e: E });
  check('synergy: free-top Hill fits vs curve_fit', near(f.hillA.emax, 99.72940503058149, 1e-4) && near(f.hillB.emax, 94.32102254081519, 1e-4) && near(f.hillB.ec50, 11.265974941621037, 1e-4) && near(f.summary.ci.geoMean, 0.6556968480018162, 1e-5) && f.summary.ci.n === 18);
  // Definitions: Bliss of 30 % and 50 % is 65 %; a Loewe-additive well has CI = 1; the same drug against itself is additive.
  const P = { ec50: 2, h: 1.5, emax: 100 }, Q = { ec50: 10, h: 0.8, emax: 100 };
  const eL = loeweExpected(1, 4, P, Q);
  check('synergy: CI = 1 on the Loewe surface', near(1 / hillInv(eL, P) + 4 / hillInv(eL, Q), 1, 1e-9));
  check('synergy: sham combination (drug with itself) is Loewe additive', near(loeweExpected(1, 3, P, P), hill(4, P), 1e-8));
  const s = analyse({ a: [0, 1, 2, 4, 8], b: [0, 1, 2, 4, 8], e: [0, 1, 2, 4, 8].map((x) => [0, 1, 2, 4, 8].map((y) => hill(x + y, P))) }, 100);
  check('synergy: sham matrix gives CI 1 and Loewe excess 0', near(s.summary.ci.geoMean, 1, 1e-4) && near(s.summary.loewe.mean, 0, 1e-3) && s.summary.bliss.mean < 0);
  const b1 = analyse({ a: [0, 1, 2, 3], b: [0, 1, 2, 3], e: [[0, 50, 70, 80], [30, 65, 79, 86], [50, 75, 85, 90], [60, 80, 88, 92]] }, 100);
  check('synergy: Bliss 0.3 + 0.5 − 0.15 = 0.65', near(b1.cells.find((x) => x.a === 1 && x.b === 1).bliss, 65, 1e-9));
  check('synergy: Hill inverse', near(hillInv(hill(3, P), P), 3, 1e-9) && Number.isNaN(hillInv(100, P)));
  // Parsing and bad input.
  const m = parseMatrix([['A\\B', '10', '0', '1'], ['1', '50', '20', '30'], ['0', '40', '0', '10'], ['2', '60', '35', '45']], num);
  check('synergy: matrix parsed and sorted', m.a.join() === '0,1,2' && m.b.join() === '0,1,10' && m.e[0].join() === '0,10,40' && m.e[1].join() === '20,30,50');
  const throws = (fn) => { try { fn(); return false; } catch { return true; } };
  check('synergy: bad matrices rejected', throws(() => analyse({ a: [1, 2, 3], b: [0, 1, 2], e: [[1, 2, 3], [1, 2, 3], [1, 2, 3]] })) && throws(() => parseMatrix([['x', '0', '1', '2'], ['0', '0', '5', '9'], ['1', '1000', '5', '9'], ['2', '4', '5', '9']], num)) && throws(() => fitHill([0, 1, 2], [0, 10, 20], 100)));
};
