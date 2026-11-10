// #1371 inequality shader. One-variable answers checked against sympy.solve_univariate_inequality for the
// cases below; the half-plane overlap and its corners against shapely (intersection of the half-planes with
// the window) for the triangle x + y ≤ 6, x ≥ 0, y ≥ 0 and for an empty system.
import * as I from '../../src/lib/sci/school-ineq.ts';
export default async (check) => {
  const s1 = I.solve1(-2, 5, '>=', 1).sol;
  check('ineq: −2x + 5 ≥ 1 gives (−∞, 2] (sympy)', I.interval(s1) === '(−∞, 2]' && I.inWords(s1) === 'x ≤ 2');
  check('ineq: 3x − 4 < 11 gives x < 5', I.inWords(I.solve1(3, -4, '<', 11).sol) === 'x < 5');
  check('ineq: 4x > 3 gives (3/4, ∞)', I.interval(I.solve1(4, 0, '>', 3).sol) === '(3/4, ∞)');
  check('ineq: 0x + 2 < 5 is all reals, 0x + 2 > 5 none', I.solve1(0, 2, '<', 5).sol.kind === 'all' && I.solve1(0, 2, '>', 5).sol.kind === 'none');
  check('ineq: dividing by a negative turns the sign (step text)', I.solve1(-2, 5, '>=', 1).steps.some((s) => s.includes('turns round') && s.includes('x ≤ 2')));
  const d = I.solve2(-3, '<=', 2, 1, '<', 7).sol;
  check('ineq: −3 ≤ 2x + 1 < 7 gives [−2, 3) (sympy)', I.interval(d) === '[−2, 3)');
  const d2 = I.solve2(-3, '<', -2, 1, '<=', 7).sol;
  check('ineq: −3 < −2x + 1 ≤ 7 gives [−3, 2) (sympy)', I.interval(d2) === '[−3, 2)');
  check('ineq: 5 ≤ x ≤ 5 is {5}, 5 < x < 5 empty', I.interval(I.solve2(5, '<=', 1, 0, '<=', 5).sol) === '{5}' && I.solve2(5, '<', 1, 0, '<', 5).sol.kind === 'none');
  check('ineq: whole numbers in [−2, 3) are −2..2', I.integers(d, -10, 10).join() === '-2,-1,0,1,2');
  const hs = [{ a: 1, b: 1, op: '<=', c: 6 }, { a: 1, b: 0, op: '>=', c: 0 }, { a: 0, b: 1, op: '>=', c: 0 }];
  const poly = I.feasible(hs, -10, 10, -10, 10);
  const area = Math.abs(poly.reduce((s, p, i) => { const q = poly[(i + 1) % poly.length]; return s + p.x * q.y - q.x * p.y; }, 0)) / 2;
  check('ineq: triangle x + y ≤ 6, x, y ≥ 0 has area 18 (shapely)', Math.abs(area - 18) < 1e-9 && poly.length === 3);
  const cs = I.corners(hs, -10, 10, -10, 10).map((p) => `${p.x},${p.y}`).sort();
  check('ineq: corners (0,0), (0,6), (6,0)', cs.join(' ') === '0,0 0,6 6,0');
  check('ineq: x + y ≤ 2 and x + y ≥ 5 do not overlap', I.feasible([{ a: 1, b: 1, op: '<=', c: 2 }, { a: 1, b: 1, op: '>=', c: 5 }], -10, 10, -10, 10).length === 0);
  check('ineq: strict half-plane excludes its line', !I.inHalf({ a: 1, b: 1, op: '<', c: 2 }, 1, 1) && I.inHalf({ a: 1, b: 1, op: '<=', c: 2 }, 1, 1));
  check('ineq: text of 2x − y > 0', I.halfText({ a: 2, b: -1, op: '>', c: 0 }) === '2x − y > 0');
  check('ineq: nice(−2.5) = −5/2, nice(0.1) = 1/10', I.nice(-2.5) === '−5/2' && I.nice(0.1) === '1/10');
};
