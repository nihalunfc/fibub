// #1067 photoelectric-lab: checked against Python with the exact SI values of h, e and c.
import { photonEV, kmaxEV, stoppingV, thresholdFreq, thresholdNm, current, lineFit, freqFromNm, H, E_CHARGE } from '../../src/lib/sci/learnphoto.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  check('photo: hf at 7e14 Hz = 2.89497 eV', near(photonEV(7e14), 2.8949673878467013));
  check('photo: Cs (2.1 eV) at 7e14 Hz: K_max 0.79497 eV, V0 0.79497 V', near(kmaxEV(7e14, 2.1), 0.7949673878467012) && near(stoppingV(7e14, 2.1), 0.7949673878467012));
  check('photo: threshold Cs 5.0778e14 Hz, 590.40 nm', near(thresholdFreq(2.1), 507777740837832.8) && near(thresholdNm(2.1), 590.4009449200013));
  check('photo: 400 nm photon = 3.0996 eV (1240/λ rule)', near(photonEV(freqFromNm(400)), 3.099604960830007));
  check('photo: below threshold no current, any intensity', current(1, 4e14, 2.1, 1) === 0 && stoppingV(4e14, 2.1) === 0);
  check('photo: current falls to zero at −V0', current(-0.7949, 7e14, 2.1, 1) > 0 && current(-0.7951, 7e14, 2.1, 1) === 0);
  check('photo: saturation ∝ intensity', near(current(5, 7e14, 2.1, 0.5) * 2, current(5, 7e14, 2.1, 1)));
  check('photo: stopping voltage does not depend on intensity', current(-0.795, 7e14, 2.1, 0.2) === 0 && current(-0.795, 7e14, 2.1, 1) === 0);
  const fs = [6e14, 7e14, 8e14, 9e14], vs = fs.map((f) => stoppingV(f, 2.3)), fit = lineFit(fs, vs);
  check('photo: slope of V0 against f = h/e', near(fit.b * E_CHARGE, H, 1e-9));
  check('photo: intercept gives −φ/e', near(-fit.a, 2.3, 1e-9));
};
