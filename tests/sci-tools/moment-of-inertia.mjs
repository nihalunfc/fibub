// #904 moment of inertia builder: every shape formula checked against SymPy volume integrals of a uniform density,
// and two composites (a rod-and-ball pendulum, a plate with a hole) against exact rational SymPy sums.
import { centralI, composite } from '../../src/lib/sci/phinertia.ts';
export default async (check) => {
  const near = (a, b, t = 1e-12) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const m = 2, L = 1.3, R = 0.4, h = 0.9, R1 = 0.2, R2 = 0.5, a = 0.6, b = 0.25;
  check('inertia: rod across mL²/12, along 0', near(centralI('rod', m, [L], 'across'), (m * L * L) / 12) && centralI('rod', m, [L], 'along') === 0);
  check('inertia: solid cylinder mR²/2 and m(3R² + h²)/12', near(centralI('cylinder', m, [R, h], 'along'), (m * R * R) / 2) && near(centralI('cylinder', m, [R, h], 'across'), (m * (3 * R * R + h * h)) / 12));
  check('inertia: thick tube m(R₁² + R₂²)/2 and m(3R₁² + 3R₂² + h²)/12', near(centralI('tube', m, [R1, R2, h], 'along'), (m * (R1 * R1 + R2 * R2)) / 2) && near(centralI('tube', m, [R1, R2, h], 'across'), (m * (3 * R1 * R1 + 3 * R2 * R2 + h * h)) / 12));
  check('inertia: ring mR² and mR²/2', near(centralI('ring', m, [R], 'along'), m * R * R) && near(centralI('ring', m, [R], 'across'), (m * R * R) / 2));
  check('inertia: solid sphere 2mR²/5, thin shell 2mR²/3', near(centralI('sphere', m, [R]), 0.4 * m * R * R) && near(centralI('shell', m, [R]), (2 / 3) * m * R * R));
  check('inertia: thick hollow sphere 2m(R₂⁵ − R₁⁵)/5(R₂³ − R₁³), and tends to the shell', near(centralI('hollowsphere', m, [R1, R2]), (2 * m * (R2 ** 5 - R1 ** 5)) / (5 * (R2 ** 3 - R1 ** 3))) && near(centralI('hollowsphere', m, [R2 * 0.999999, R2]), (2 / 3) * m * R2 * R2, 1e-5));
  check('inertia: box m(a² + b²)/12', near(centralI('box', m, [a, b]), (m * (a * a + b * b)) / 12));
  const pend = composite([{ shape: 'rod', m: 0.5, dims: [1], orient: 'across', x: 0.5, y: 0 }, { shape: 'sphere', m: 1, dims: [0.05], x: 1.05, y: 0 }]);
  check('inertia: rod and ball pendulum about the pivot 7621/6000 kg·m²', near(pend.I, 7621 / 6000) && near(pend.M, 1.5));
  check('inertia: pendulum centre of mass 0.86667 m, I about it 0.1435', near(pend.cx, 0.8666666666666667) && near(pend.Icm, 0.1435));
  const plate = composite([{ shape: 'box', m: 2, dims: [0.4, 0.3], x: 0, y: 0 }, { shape: 'cylinder', m: 0.2, dims: [0.05, 0.01], orient: 'along', x: 0.1, y: 0, hole: true }]);
  check('inertia: plate with a hole 0.0394167, centre of mass −0.011111, I_cm 0.0391944', near(plate.I, 0.03941666666666667) && near(plate.cx, -0.011111111111111112) && near(plate.Icm, 0.03919444444444444) && near(plate.M, 1.8));
  check('inertia: parallel axis I = I_cm + md² for a point offset in x and y', near(composite([{ shape: 'point', m: 3, dims: [], x: 0.3, y: 0.4 }]).I, 0.75));
};
