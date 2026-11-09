// #343 Fick cardiac output: O2 content and Fick principle checked against a Python rewrite; Poiseuille flow against
// SciPy quad integration of the parabolic velocity profile (an independent route); diffusion by hand.
import * as F from '../../src/lib/sci/fickco.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-8) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const ca = F.o2Content(15, 0.98, 95).total, cv = F.o2Content(15, 0.75, 40).total;
  check('fick: arterial and venous O2 content (1.34 × Hb × Sat + 0.0031 × PO2)', near(ca, 19.9925) && near(cv, 15.199));
  const r = F.fick(250, ca, cv, 70, 1.9);
  check('fick: cardiac output, stroke volume, index, delivery, extraction', near(r.co, 5.215395849) && near(r.sv, 74.50565498) && near(r.ci, 2.744945183) && near(r.do2, 1042.688015) && near(r.extraction, 0.2397649118));
  check('fick: PO2 from kPa and Hüfner 1.39', near(F.o2Content(14, 0.97, 12.7 * F.KPA_MMHG, 1.39).total, 19.17149928, 1e-6));
  check('fick: optional heart rate and BSA left out', F.fick(250, ca, cv).sv === null && F.fick(250, ca, cv).ci === null);
  const d = F.diffusion(2e-5, 1, 0.1, 1);
  check('fick: diffusion flux, rate and time x²/2D', near(d.flux, 2e-8, 1e-12) && near(d.rate, 2e-8, 1e-12) && near(d.time, 0.00025, 1e-12));
  const p = F.poiseuille(10, 1.5, 3.5, 10);
  check('fick: Poiseuille flow matches SciPy integral of the velocity profile', near(p.q, 7.572860550) && near(p.velocity, 107.1340613) && near(p.reynolds, 973.3894714) && near(p.resistance, 1.320504971) && near(p.shear, 9.999179056));
  check('fick: doubling the radius gives 16 times the flow', near(F.poiseuille(10, 3, 3.5, 10).q / p.q, 16));
};
