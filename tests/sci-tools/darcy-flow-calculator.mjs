// Darcy flow calculator: grain-size curve and Hazen K (blog: hazen-grain-size-hydraulic-conductivity-lab-comparison).
// Hand-worked: with 6 % passing 0.3 mm and 22 % passing 0.6 mm, d10 lies a quarter of the way up in log size,
// d10 = 0.3 × 2^0.25 = 0.356762 mm; Hazen with C = 100 gives K = 100 × (0.0356762 cm)² = 0.127279 cm/s = 110.0 m/day.
// Turned round, a lab K of 4.02 mm/s needs d10 = √(0.402 / 100) cm = 0.634 mm.
import * as DAR from '../../src/lib/sci/darcy.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const g = DAR.gradation([9.5, 4.75, 2.36, 1.18, 0.6, 0.3, 0.15], [100, 92, 75, 48, 22, 6, 1]);
  check('darcy: d10 a quarter of the way up in log size = 0.3 × 2^0.25 = 0.356762 mm', near(g.d10, 0.3 * 2 ** 0.25, 1e-12));
  check('darcy: Hazen K for that sand = 0.127279 cm/s (110.0 m/day)', near(DAR.hazen(g.d10, 100) * 100, 0.1272792, 1e-6) && near(DAR.hazen(g.d10, 100) * 86400, 109.97, 0.01));
  check('darcy: Hazen with d10 = 0.634 mm and C = 100 gives 4.02 mm/s', near(DAR.hazen(Math.sqrt(0.402 / 100) * 10, 100) * 1000, 4.02, 1e-9));
  const f = DAR.darcy(DAR.hazen(g.d10, 100), 0.5 / 100, 100, 0.3, 100);
  check('darcy: that K, gradient 0.005, porosity 0.3: 100 m in 54.6 days', near(f.time / 86400, 54.56, 0.01));
};
