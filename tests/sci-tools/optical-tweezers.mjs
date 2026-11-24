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
  // The trap of Stilgoe et al. (2021), Micromachines 12(5): 570 (CC BY 4.0): omega_c = 6942 1/s on a 2 um bead,
  // which the paper quotes as about 118 pN/um. Water at 25 C (0.89 mPa s) is our assumption.
  {
    const g2 = T.drag(0.89e-3, 1e-6), wc = 6942, fc2 = wc / (2 * Math.PI), k2 = g2 * wc;
    check('tweezers: the paper’s trap is 116.5 pN/µm (drag 1.6776e-8 N·s/m, fc 1104.9 Hz)', rel(g2, 1.6776105e-8, 1e-6) && rel(fc2, 1104.853615, 1e-9) && rel(k2 * 1e6, 116.4597, 1e-5));
    const xp = T.simulateBead(k2, g2, Tk, 100000, 100000, 7), pp = T.psd(xp, 100000, 8192), bb = T.block(pp.f, pp.P, 4);
    const fitA = T.fitPsd(bb.f, bb.P, { fmin: 50, fmax: 20000, aliased: true, fs: 100000, nAvg: pp.segments * 4 });
    const fitP = T.fitPsd(bb.f, bb.P, { fmin: 50, fmax: 20000, nAvg: pp.segments * 4 });
    check(`tweezers: one simulated second of that trap gives fc 1111.9 Hz aliased and 1166.7 Hz plain (${fitA.fc.toFixed(1)}, ${fitP.fc.toFixed(1)})`, Math.abs(fitA.fc - 1111.9) < 0.1 && Math.abs(fitP.fc - 1166.7) < 0.1);
  }
  check('tweezers: too short a record is refused', (() => { try { T.psd([1, 2, 3], 100, 1024); return false; } catch { return true; } })());
};
