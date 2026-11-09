// #937 Spectrometer calibration: peaks checked against scipy.signal.find_peaks + parabolic interpolation, the
// polynomial fits against numpy.polyfit, and recovery of the made-up example's known pixel-to-wavelength map.
import { profile, smooth, findPeaks, polyfit, polyval, plainCoeffs, calibrate, autoMatch, LINE_SETS, exampleProfile, EXAMPLE_MAP } from '../../src/lib/sci/phspec.ts';
export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const y = exampleProfile();
  const pk = findPeaks(y, 0.1, 4);
  const ref = [76.82504248931453, 172.5162571026626, 329.7748060060266, 492.3460802347943, 503.2273700013094, 594.2171968245599, 599.2511476094687, 693.6828657967508];
  check('spec: 8 peaks at SciPy find_peaks + parabola positions', pk.length === 8 && pk.every((p, i) => near(p.x, ref[i], 1e-9)));
  const L = LINE_SETS.cfl.lines.map((l) => l.nm);
  const m = autoMatch(pk.map((p) => p.x), L, 3, [300, 1100], pk.map((p) => p.height));
  check('spec: auto-match assigns all 8 lines in order', m.join(',') === '0,1,2,3,4,5,6,7');
  const px = pk.map((p) => p.x);
  const c1 = calibrate(px, L, 1), c2 = calibrate(px, L, 2), c3 = calibrate(px, L, 3);
  check('spec: linear fit vs numpy.polyfit', plainCoeffs(c1.fit).every((v, i) => near(v, [378.04057608608883, 0.3351036254131237][i], 1e-9)) && near(c1.rms, 0.7736929120887361, 1e-9));
  check('spec: quadratic fit vs numpy.polyfit', plainCoeffs(c2.fit).every((v, i) => near(v, [380.00240343064695, 0.31997521884140717, 2.0004647428230856e-5][i], [1e-8, 1e-10, 1e-13][i])) && near(c2.rms, 0.11745041315466381, 1e-9));
  check('spec: cubic fit vs numpy.polyfit', near(polyval(c3.fit, 500), 544.9881187368094, 1e-8) && near(c3.rms, 0.1311574781989006, 1e-9));
  check('spec: quadratic recovers the made-up map within 0.05 nm', [0, 250, 500, 750, 999].every((x) => near(polyval(c2.fit, x), EXAMPLE_MAP(x), 0.05)));
  check('spec: dispersion about 0.337 nm per pixel', near(c2.dispersion, 0.3373, 0.001));
  check('spec: polyfit exact on a cubic', (() => { const xs = [0, 1, 2, 3, 4, 7], f = polyfit(xs, xs.map((x) => 1 - 2 * x + 0.5 * x ** 3), 3); return plainCoeffs(f).every((v, i) => near(v, [1, -2, 0, 0.5][i], 1e-10)); })());
  // Profile from an RGBA image: 6 × 3 pixels, middle row bright at column 2.
  const w = 6, h = 3, d = new Uint8ClampedArray(w * h * 4);
  for (let x = 0; x < w; x++) for (let r = 0; r < h; r++) { const o = 4 * (r * w + x); d[o] = r === 1 && x === 2 ? 90 : 0; d[o + 1] = r === 1 && x === 2 ? 60 : 3; d[o + 2] = 0; d[o + 3] = 255; }
  check('spec: profile of one row (R+G+B)', profile(d, w, h, 1, 1).join(',') === '3,3,150,3,3,3');
  check('spec: profile averages rows and picks a channel', near(profile(d, w, h, 0, 2, false, 'r')[2], 30, 1e-12) && near(profile(d, w, h, 0, 2, false, 'g')[0], 3, 1e-12));
  check('spec: vertical spectrum profile runs down the rows', profile(d, w, h, 2, 2, true).join(',') === '3,150,3');
  check('spec: boxcar smoothing keeps the mean of a constant', smooth([2, 2, 2, 2], 3).every((v) => v === 2) && near(smooth([0, 3, 0], 3)[1], 1, 1e-15));
  check('spec: reversed spectrum (red on the left) also matches', (() => { const yr = [...y].reverse(), pr = findPeaks(yr, 0.1, 4), mr = autoMatch(pr.map((p) => p.x), L, 3, [300, 1100], pr.map((p) => p.height)); return mr.join(',') === '7,6,5,4,3,2,1,0'; })());
  check('spec: threshold drops weak peaks', findPeaks(y, 0.5, 4).length === 3);
  let msg = ''; try { calibrate([10, 20], [400, 500], 2); } catch (e) { msg = e.message; }
  check('spec: too few lines message', msg.includes('at least 3 matched lines'));
  check('spec: line sets are rounded to 0.1 nm', Object.values(LINE_SETS).every((s) => s.lines.every((l) => Math.abs(l.nm * 10 - Math.round(l.nm * 10)) < 1e-9)));
};
