// #1476 random variable builder. Means, variances and probabilities checked against scipy.stats (binom, hypergeom)
// and numpy (two dice).
import * as RV from '../../src/lib/sci/school-r-rv.ts';
const near = (a, b, t = 1e-12) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
export default async (check) => {
  const cases = [[RV.binomial(3, 0.5), 1.5, 0.75], [RV.binomial(4, 1 / 6), 0.6666666666666666, 0.5555555555555556], [RV.hypergeometric(10, 2, 3), 0.6, 0.37333333333333335], [RV.binomial(6, 0.3), 1.8, 1.26], [RV.binomial(20, 0.05), 1, 0.95], [RV.twoDice(), 7, 5.833333333333333]];
  cases.forEach(([d, m, v], i) => { const r = RV.moments(d); check(`random variable: case ${i + 1} mean ${m} and variance ${v.toFixed(4)} (scipy.stats)`, near(r.mean, m, 1e-12) && near(r.variance, v, 1e-12) && RV.problems(d).length === 0); });
  check('random variable: binomial(6, 0.3) P(X = 0..3) matches scipy', [0.117649, 0.302526, 0.324135, 0.18522].every((p, i) => near(RV.binomial(6, 0.3).p[i], p, 1e-9)));
  check('random variable: hypergeometric 10, 2, 3 gives 56/120, 56/120, 8/120', RV.hypergeometric(10, 2, 3).p.every((p, i) => near(p, [56, 56, 8][i] / 120)));
  check('random variable: bad tables are caught', RV.problems({ x: [0, 1], p: [0.5, 0.6] }).some((s) => s.includes('add to 1.1')) && RV.problems({ x: [0, 1], p: [-0.2, 1.2] }).length > 0 && RV.problems({ x: [1, 1], p: [0.5, 0.5] }).length === 1);
  check('random variable: C(10, 3) = 120, C(20, 10) = 184756', RV.choose(10, 3) === 120 && RV.choose(20, 10) === 184756);
  const s = RV.simulate(RV.twoDice(), 100000, 7);
  check(`random variable: 100 000 simulated dice sums average near 7 (${s.mean.toFixed(3)}) and the same seed repeats`, Math.abs(s.mean - 7) < 0.05 && Math.abs(s.variance - 35 / 6) < 0.1 && RV.simulate(RV.twoDice(), 1000, 3).mean === RV.simulate(RV.twoDice(), 1000, 3).mean);
};
