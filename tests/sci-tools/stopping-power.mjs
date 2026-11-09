// #948 Bethe-Bloch stopping power and CSDA range. Reference values from an independent Python implementation with
// SciPy quad (relative tolerance 1e-12) and brentq, written for these tests.
import { stopping, range, residual, braggCurve, straggled, straggleSigma, kin, cutEnergy, PROJECTILES as P, MATERIALS as M } from '../../src/lib/sci/phstop.ts';
export default async (check) => {
  const near = (a, b, r) => Math.abs(a - b) <= r * Math.abs(b);
  check('stopping: 100 MeV protons in water, S = 7.2904 MeV cm²/g (SciPy)', near(stopping(100, P.proton, M.water), 7.290407549171132, 1e-12));
  check('stopping: 10 MeV protons in water', near(stopping(10, P.proton, M.water), 45.94722425649685, 1e-12));
  check('stopping: CSDA range of 100 MeV protons in water 7.711 g/cm² (SciPy quad)', near(range(100, P.proton, M.water), 7.7106713053028715, 1e-7));
  check('stopping: ranges at 10 and 250 MeV', near(range(10, P.proton, M.water), 0.12129483619949777, 1e-7) && near(range(250, P.proton, M.water), 37.93106055762606, 1e-7));
  check('stopping: 5 MeV alpha in air (rough region, matches the same formula)', near(stopping(5, P.alpha, M.air), 793.1391562594765, 1e-12) && near(range(5, P.alpha, M.air) / M.air.rho, 3.016672751686366, 1e-7));
  check('stopping: 1 GeV muon in lead', near(stopping(1000, P.muon, M.lead), 1.3211345865698567, 1e-12) && near(range(1000, P.muon, M.lead), 798.9335664438597, 1e-7));
  check('stopping: 3 GeV carbon-12 ion in water (z² scaling)', near(stopping(3000, P.carbon, M.water), 140.1627347311321, 1e-12) && near(range(3000, P.carbon, M.water), 12.708093818877478, 1e-7));
  check('stopping: energy left after 5 g/cm² of water from 100 MeV (SciPy brentq)', near(residual(100, 5, P.proton, M.water), 55.82197284776496, 1e-6) && residual(100, 8, P.proton, M.water) === 0);
  const k = kin(938.272, 938.272);
  check('stopping: kinematics at T = M (γ = 2, β = √3/2)', near(k.gamma, 2, 1e-15) && near(k.beta, Math.sqrt(3) / 2, 1e-15));
  check('stopping: range is continuous at the 1 MeV/u cut', near(range(cutEnergy(P.proton) * 1.000001, P.proton, M.water), range(cutEnergy(P.proton), P.proton, M.water), 1e-5));
  const b = braggCurve(100, P.proton, M.water), peak = b.reduce((a, x) => (x.S > a.S ? x : a));
  check('stopping: Bragg curve starts at the surface and peaks near the end of the range', b[0].depth === 0 && peak.depth > 0.97 * range(100, P.proton, M.water) && peak.S > 5 * b[0].S);
  const R = range(100, P.proton, M.water), sg = straggleSigma(R, P.proton), zz = []; for (let i = 0; i <= 20000; i++) zz.push(R * 1.2 * i / 20000);
  const yy = straggled(b, R, sg, zz); let E = 0; for (let i = 1; i < zz.length; i++) E += (yy[i] + yy[i - 1]) / 2 * (zz[i] - zz[i - 1]);
  check('stopping: straggled Bragg curve deposits the beam energy (within 0.5 %) and peaks just before the range', Math.abs(E / 100 - 1) < 0.005 && near(sg, 0.012 * R, 1e-12) && (() => { let mi = 0; yy.forEach((v, i) => { if (v > yy[mi]) mi = i; }); return zz[mi] > R - 3 * sg && zz[mi] < R; })());
  check('stopping: no spread gives back the pristine curve', near(straggled(b, R, 0, [R / 2])[0], stopping(residual(100, R / 2, P.proton, M.water), P.proton, M.water), 0.01));
};
