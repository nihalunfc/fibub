// #974 Optical tweezers calibration. Reference values from scipy.signal.welch (boxcar, no overlap) and
// scipy.optimize.curve_fit (reweighted with sigma = model) on the same simulated record, written for these tests.
import * as T from '../../src/lib/sci/phtweezers.ts';
export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t, rel = (a, b, t) => Math.abs(a / b - 1) <= t;
  const Tk = 298.15, g = T.drag(0.89e-3, 0.5e-6), k = 2e-5, fs = 10000;
  check('tweezers: Stokes drag 6πηr', rel(g, 8.388052e-9, 1e-6));
  check('tweezers: Faxén correction at h = 2r', rel(T.drag(0.89e-3, 0.5e-6, 1e-6), g / (1 - 9 / 32 + 1 / 64 - 45 / 4096 - 1 / 512), 1e-12));
  const x = T.simulateBead(k, g, Tk, fs, 32768), s = T.psd(x, fs, 1024), b = T.block(s.f, s.P, 4);
  check('tweezers: spectrum frequencies and segments', s.segments === 32 && near(s.f[0], 9.765625, 1e-12) && s.f.length === 511 && b.f.length === 127);
  check('tweezers: Lorentzian integrates to kT/k', (() => { const fc = 300, D = 5e5; let sum = 0; for (let f = 0.05; f < 2e6; f += 0.1) sum += T.lorentz(f, fc, D) * 0.1; return rel(sum, D / (2 * Math.PI * fc), 1e-4); })());
  check('tweezers: aliased Lorentzian tends to the Lorentzian at high sampling', rel(T.lorentzAliased(100, 400, 5e5, 1e7), T.lorentz(100, 400, 5e5), 1e-5));
  const fa = T.fitPsd(b.f, b.P, { fmin: 10, fmax: 4000, nAvg: 128, aliased: true, fs }), fl = T.fitPsd(b.f, b.P, { fmin: 10, fmax: 4000, nAvg: 128 });
  check('tweezers: aliased fit matches scipy curve_fit', rel(fa.fc, 379.993524, 2e-6) && rel(fa.D, 491613.14, 2e-6));
  check('tweezers: plain Lorentzian fit matches scipy curve_fit', rel(fl.fc, 466.967144, 1e-4) && rel(fl.D, 635536.7, 1e-4));
  check('tweezers: aliased fit recovers the simulated trap', Math.abs(fa.fc - k / (2 * Math.PI * g)) < 2 * fa.seFc && Math.abs(fa.D - T.KB * Tk / g * 1e18) < 2 * fa.seD && fa.chi2 / fa.dof < 1.5);
  const eq = T.equipartition(x.map((v) => v * 1e-9), Tk);
  check('tweezers: equipartition matches numpy variance', rel(eq.variance * 1e18, 205.9344037, 1e-9) && rel(eq.k, 1.99889e-5, 1e-5));
  check('tweezers: too short a record is refused', (() => { try { T.psd([1, 2, 3], 100, 1024); return false; } catch { return true; } })());
};
