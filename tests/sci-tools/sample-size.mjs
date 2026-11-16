// #T32 Sample size: two-proportion power checked against R power.prop.test (pooled-variance normal approximation)
// and the unpooled (Wald) formula n = (z_a/2 + z_b)² (p1 q1 + p2 q2) / (p1 − p2)², which PASS and many trial protocols use.
import { powerProp, solveN, powerT } from '../../src/lib/sci/power.ts';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  // R: power.prop.test(p1 = 0.043, p2 = 0.01, power = 0.8)$n = 370.6893
  const n = solveN((m) => powerProp(m, 0.043, 0.01), 0.8, 1);
  check(`sample-size: 4.3 % vs 1.0 %, 80 % power: 370.689 per group (R power.prop.test); got ${n}`, near(n, 370.6893, 1e-3));
  // The unpooled formula gives 367.946, so 368 per group (736 in all), the figure in the radial artery occlusion trial protocol (PLOS ONE 2026, e0350563).
  const z = 1.959963984540054, zb = 0.8416212335729143, nW = (z + zb) ** 2 * (0.043 * 0.957 + 0.01 * 0.99) / 0.033 ** 2;
  check('sample-size: unpooled formula 367.946 per group, and the tool\'s pooled n is a little larger', near(nW, 367.946, 1e-3) && n > nW);
  check('sample-size: power with 368 per group is 0.797 (just under 80 %) by the pooled formula', near(powerProp(368, 0.043, 0.01), 0.79713, 1e-4));
  // R: power.prop.test(n = 50, p1 = 0.5, p2 = 0.75)$power = 0.7401659
  check('sample-size: power.prop.test n 50, 50 % vs 75 %: power 0.74017', near(powerProp(50, 0.5, 0.75), 0.7401659, 1e-5));
  // R: power.t.test(n = 20, delta = 1, sd = 1)$power = 0.8689528
  check('sample-size: power.t.test n 20 per group, d 1: power 0.86895', near(powerT(20, 1), 0.8689528, 1e-5));
};
