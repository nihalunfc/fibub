// #653 retaining wall stability. Checked against an independent Python calculation written for these tests:
// Coulomb Ka by a trial-wedge maximisation (scipy.optimize), pressures integrated with scipy.integrate.quad,
// weights and lever arms from polygon areas and centroids (shoelace formula) of the wall and soil, and the
// bearing formulas. The example walls are made up.
import * as W from '../../src/lib/sci/eng-retwall.ts';
const rel = (a, b, t) => Number.isFinite(a) && Math.abs(a / b - 1) <= t;
const near = (a, b, t) => Number.isFinite(a) && Math.abs(a - b) <= t;
export default async (check) => {
  check('retwall: Rankine Ka level, φ 30° = 1/3', near(W.rankineKa(30), 1 / 3, 1e-12) && near(W.rankineKp(30), 3, 1e-12));
  check('retwall: Rankine Ka with 10° slope, φ 32° (trial wedge with δ = β: 0.320971)', near(W.rankineKa(32, 10), 0.32097099836890847, 1e-9) && near(W.coulombKa(32, 10, 10), 0.32097099836890847, 1e-9));
  check('retwall: Coulomb Ka φ 32°, δ 20°, β 10° (trial wedge 0.312568)', near(W.coulombKa(32, 20, 10), 0.3125678936414658, 1e-9));
  check('retwall: Coulomb with δ 0 equals Rankine (φ 30°)', near(W.coulombKa(30, 0, 0), 1 / 3, 1e-12));
  check('retwall: slope steeper than φ is not possible', Number.isNaN(W.rankineKa(30, 35)));
  const base = { H: 4, tTop: 0.3, tBot: 0.4, tb: 0.5, toe: 0.8, heel: 1.8, gc: 24, gamma: 18, gsat: 20, phi: 32, beta: 0, method: 'rankine', delta: 0, q: 10, hw: 0, uplift: false, mu: 0.5, Df: 0, usePassive: false };
  const a = W.retainingWall(base);
  check('retwall: example sliding 1.5813 and overturning 3.8557 (Python)', rel(a.fsSliding, 1.581305403885912, 1e-9) && rel(a.fsOverturning, 3.855729907556428, 1e-9));
  check('retwall: example R 196.8 kN, e 0.0952 m (Python)', rel(a.R, 196.8, 1e-12) && rel(a.e, 0.0951947086895899, 1e-9));
  check('retwall: example toe 78.09 and heel 53.11 kPa (Python)', rel(a.qToe, 78.08954578007418, 1e-9) && rel(a.qHeel, 53.11045421992579, 1e-9));
  check('retwall: example moments Mr 322.24, Mo 83.574 (Python)', rel(a.Mr, 322.24, 1e-12) && rel(a.Mo, 83.57431867011138, 1e-9) && rel(a.sumH, 56.53556851213417, 1e-9));
  const b = W.retainingWall({ ...base, beta: 10, method: 'coulomb', delta: 20, hw: 1.5, uplift: true, Df: 1, usePassive: true });
  check('retwall: Coulomb, slope, water, uplift, passive (Python: 1.79564, 2.79460)', rel(b.fsSliding, 1.7956360235020379, 1e-8) && rel(b.fsOverturning, 2.7945996500087302, 1e-8));
  check('retwall: same case bearing (Python: R 212.280, toe 82.377, heel 59.142)', rel(b.R, 212.27953979218123, 1e-9) && rel(b.qToe, 82.37748671234135, 1e-8) && rel(b.qHeel, 59.14220648244614, 1e-8) && rel(b.sumH, 70.41018501021729, 1e-8));
  const g = W.retainingWall({ ...base, H: 3, tTop: 0.5, tBot: 1.4, tb: 0, toe: 0, heel: 0, gc: 22, phi: 30, method: 'coulomb', delta: 20, q: 0, mu: 0.55 });
  check('retwall: gravity wall, no base projections (Python: 1.72404, 2.97398, toe 65.93)', rel(g.fsSliding, 1.7240407318829791, 1e-9) && rel(g.fsOverturning, 2.9739779491514384, 1e-9) && rel(g.qToe, 65.9274295441726, 1e-9));
  const c = W.retainingWall({ ...base, toe: 0.6, heel: 1.0 });
  check('retwall: resultant outside the middle third (Python: toe 143.65 kPa, heel 0)', c.e > c.B / 6 && rel(c.qToe, 143.65377019434112, 1e-9) && c.qHeel === 0 && rel(c.contact, 3 * c.xbar, 1e-12));
  const d = W.retainingWall({ ...base, toe: 0.3, heel: 0.4 });
  check('retwall: resultant outside the base tips over (Python: overturning 0.5425)', d.contact === 0 && d.qToe === Infinity && rel(d.fsOverturning, 0.5425111532044702, 1e-9));
  check('retwall: pressure diagram ends at K γ H', near(a.pressure[40].soil, a.K * 18 * 4, 1e-9) && a.pressure.length === 41);
};
