// #1459 one-one and onto tester. Ranges checked against sympy 1.14 function_range and crossings against
// sympy solveset for the ready-made functions on several domains.
import * as F from '../../src/lib/sci/school-r-functions.ts';
const P = Object.fromEntries(F.PRESETS.map((p) => [p.id, p]));
const I = (lo, hi, loC, hiC) => ({ lo, hi, loC, hiC });
const R = I(-Infinity, Infinity, false, false), P0 = I(0, Infinity, true, false), PP = I(0, Infinity, false, false);
const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
export default async (check) => {
  const rng = (id, d) => F.showSet(F.analyse(P[id], d, 'range').range);
  // sympy function_range results
  const want = [['lin', R, 'ℝ'], ['sq', R, '[0, ∞)'], ['sq', I(-1, 2, true, true), '[0, 4]'], ['cubic', I(1, Infinity, true, false), '[−2, ∞)'], ['abs', R, '[0, ∞)'], ['exp', R, '(0, ∞)'], ['ln', R, 'ℝ'], ['sin', I(-Math.PI / 2, Math.PI / 2, true, true), '[−1, 1]'], ['recip', R, '(−∞, 0) ∪ (0, ∞)'], ['sq', PP, '(0, ∞)']];
  for (const [id, d, r] of want) check(`functions: range of ${P[id].label} on ${F.show(d)} is ${r} (sympy)`, rng(id, d) === r);
  const v1 = F.analyse(P.sq, R, R);
  check('functions: x² on ℝ is not one-one (f(−1) = f(1)) and misses −1', !v1.oneOne && near(v1.pair[0], -1) && near(v1.pair[1], 1) && !v1.onto && v1.missed === -1);
  const v2 = F.analyse(P.sq, P0, P0); check('functions: x² from [0, ∞) to [0, ∞) is a bijection', v2.oneOne && v2.onto);
  check('functions: eˣ onto (0, ∞) but not onto [0, ∞) (0 missed)', F.analyse(P.exp, R, PP).onto && F.analyse(P.exp, R, P0).missed === 0);
  const v3 = F.analyse(P.recip, R, R); check('functions: 1/x one-one, not onto ℝ (0 missed)', v3.oneOne && !v3.onto && v3.missed === 0);
  check('functions: x³ one-one and onto ℝ; x³ − 3x onto but not one-one', F.analyse(P.cube, R, R).oneOne && F.analyse(P.cube, R, R).onto && F.analyse(P.cubic, R, R).onto && !F.analyse(P.cubic, R, R).oneOne);
  check('functions: sin on ℝ not one-one, sin on [−π/2, π/2] onto [−1, 1] bijective', !F.analyse(P.sin, R, I(-1, 1, true, true)).oneOne && F.analyse(P.sin, I(-Math.PI / 2, Math.PI / 2, true, true), I(-1, 1, true, true)).oneOne);
  const c0 = F.crossings(P.cubic, F.segments(P.cubic, R), 0);
  check('functions: y = 0 meets x³ − 3x at −√3, 0, √3 (sympy solveset)', c0.length === 3 && near(c0[0], -Math.sqrt(3)) && c0[1] === 0 && near(c0[2], Math.sqrt(3)));
  const c2 = F.crossings(P.sq, F.segments(P.sq, R), 2);
  check('functions: y = 2 meets x² at ±√2; y = 0 once; y = −1 never', c2.length === 2 && near(c2[1], Math.SQRT2) && F.crossings(P.sq, F.segments(P.sq, R), 0).length === 1 && F.crossings(P.sq, F.segments(P.sq, R), -1).length === 0);
  const own = F.numericPreset((x) => x * x - 2 * x, -3, 3), vo = F.analyse(own, I(-3, 3, true, true), 'range');
  check('functions: typed x² − 2x on [−3, 3]: turning point near 1, range [−1, 15]', near(own.turning(-3, 3)[0], 1, 1e-6) && F.showSet(vo.range) === '[−1, 15]' && !vo.oneOne);
  check('functions: π fractions shown as π/2, −π/6', F.niceNum(Math.PI / 2) === 'π/2' && F.niceNum(-Math.PI / 6) === '−π/6' && F.niceNum(Math.PI) === 'π');
};
