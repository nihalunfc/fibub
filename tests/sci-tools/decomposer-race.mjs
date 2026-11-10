// #1233 Decomposer race. Exponential decay M = M0 e^(−kt) and half-life ln2/k checked by hand; Q10 = 2 doubling;
// the model's teaching patterns (warmer, damper to 60%, worms → faster; too hot, waterlogged, frozen → slower; plastic
// never) checked here.
import { MATERIALS, rate, massLeft, halfLife, tempFactor, moistureFactor } from '../../src/lib/sci/decompose-j2.ts';

export default async (check) => {
  const near = (a, b, e) => Math.abs(a - b) <= e;
  const A = { material: 'leaves', temp: 30, moisture: 60, worms: true }, B = { material: 'leaves', temp: 15, moisture: 20, worms: false };
  check('decomposer: heap A rate 0.03 × 2 × 1 × 1.5 = 0.09/day, 6.72 g left after 30 days, half-life 7.70 days', near(rate(A), 0.09, 1e-12) && near(massLeft(A, 100, 30), 100 * Math.exp(-2.7), 1e-9) && near(massLeft(A, 100, 30), 6.72, 0.005) && near(halfLife(A), 7.70, 0.005));
  check('decomposer: heap B 0.03 × 2^(−0.5) × 1/3 = 0.00707/day, 80.9 g left after 30 days', near(rate(B), 0.03 * Math.SQRT1_2 / 3, 1e-12) && near(massLeft(B, 100, 30), 80.89, 0.01));
  const L = { material: 'leaves', temp: 20, moisture: 60, worms: false };
  check('decomposer: half the mass is left after one half-life, a quarter after two', near(massLeft(L, 100, halfLife(L)), 50, 1e-9) && near(massLeft(L, 100, 2 * halfLife(L)), 25, 1e-9));
  check('decomposer: Q10 = 2: twice as fast at 30 °C, half as fast at 10 °C, frozen at 0 °C', near(tempFactor(30), 2, 1e-12) && near(tempFactor(10), 0.5, 1e-12) && tempFactor(0) === 0 && tempFactor(50) < tempFactor(40) && tempFactor(60) === 0);
  check('decomposer: moisture best at 60%, none when dry, slower when waterlogged', moistureFactor(60) === 1 && moistureFactor(0) === 0 && moistureFactor(100) < moistureFactor(80) && moistureFactor(80) < 1 && moistureFactor(30) === 0.5);
  check('decomposer: worms speed it up 1.5×; peel faster than leaves faster than straw faster than paper; plastic never', near(rate({ ...L, worms: true }) / rate(L), 1.5, 1e-12) && MATERIALS.peel.k > MATERIALS.leaves.k && MATERIALS.leaves.k > MATERIALS.straw.k && MATERIALS.straw.k > MATERIALS.paper.k && massLeft({ ...L, material: 'plastic' }, 100, 365) === 100 && halfLife({ ...L, material: 'plastic' }) === Infinity);
};
