// #951 spectrum peak fitter. Reference values from SciPy curve_fit (Poisson weights, absolute_sigma) on the same
// made-up spectrum, and NumPy polyfit for the energy calibration, written for these tests.
import { exampleSpectrum, fitPeaks, findPeaks, sumArea, calibrate, readSpectrum, smooth, FWHM } from '../../src/lib/sci/phpeak.ts';
export default async (check) => {
  const near = (a, b, r) => Math.abs(a - b) <= r * Math.max(1, Math.abs(b));
  const y = exampleSpectrum(), x = y.map((_, i) => i);
  check('peaks: made-up example spectrum is fixed (seeded)', y.length === 1024 && y.reduce((a, b) => a + b, 0) === exampleSpectrum().reduce((a, b) => a + b, 0) && y[180] > 900);
  const r = fitPeaks(x, y, 380, 460, [410, 425], 1);
  const sp = [93.97250910184721, -0.3378470860563707, 308.20489072695045, 410.58507481793896, 5.9676295357964015, 190.20836426074607, 425.9467599548759, 5.17437254624645];
  const ss = [1.6449729827247617, 0.05246169834420263, 7.494665387262901, 0.29991762291346935, 0.248654508659249, 7.771337170950005, 0.427440631412037, 0.31389724349849607];
  check('peaks: doublet on a linear background matches SciPy curve_fit (parameters)', r.ok && r.p.every((v, i) => near(v, sp[i], 2e-6)));
  check('peaks: doublet standard errors match SciPy (Poisson weights)', r.ok && r.se.every((v, i) => near(v, ss[i], 1e-4)) && near(r.chi2, 92.85864121338217, 1e-9));
  check('peaks: doublet net areas and their errors (SciPy covariance)', near(r.peaks[0].area, 4610.322593855727, 2e-6) && near(r.peaks[0].areaSe, 203.30559688730102, 1e-4) && near(r.peaks[1].area, 2467.045952379116, 2e-6) && near(r.peaks[1].areaSe, 186.25987434751224, 1e-4));
  const r2 = fitPeaks(x, y, 160, 200, [180], 1);
  check('peaks: single peak at channel 180 (SciPy)', near(r2.peaks[0].mu, 179.98706170621966, 1e-8) && near(r2.peaks[0].sigma, 3.97998209397673, 1e-6) && near(r2.peaks[0].area, 9006.748578303672, 1e-6) && near(r2.peaks[0].fwhm, 3.97998209397673 * 2.3548200450309493, 1e-6));
  check('peaks: summation area agrees with the fit within errors', (() => { const s = sumArea(y, 160, 200); return Math.abs(s.net - r2.peaks[0].area) < 2 * s.se; })());
  const found = findPeaks(y, 0, 1023, { width: 5 }).map((f) => f.i).sort((a, b) => a - b);
  check('peaks: peak finder finds the four made-up peaks (doublet as two)', found.length === 4 && [180, 410, 425, 700].every((c, i) => Math.abs(found[i] - c) <= 5));
  const cal = calibrate([[180, 300], [410, 662], [700, 1120]], 1), cal2 = calibrate([[180, 300], [410, 662], [700, 1120]], 2);
  check('peaks: linear and quadratic calibration (NumPy polyfit)', near(cal.c[0], 15.879234167894058, 1e-10) && near(cal.c[1], 1.5770250368188514, 1e-12) && Math.abs(cal2.f(410) - 662) < 1e-9 && Math.abs(cal2.f(700) - 1120) < 1e-9);
  check('peaks: reading pasted spectra', typeof readSpectrum([[1], [2]]) === 'string' && readSpectrum(Array.from({ length: 12 }, (_, i) => [i * 2, 5])).x[3] === 6 && typeof readSpectrum(Array.from({ length: 12 }, (_, i) => [5 - i, 5])) === 'string');
  check('peaks: errors for an empty or too narrow region', fitPeaks(x, y, 380, 460, [], 1).ok === false && fitPeaks(x, y, 400, 408, [404, 405], 2).ok === false);
  check('peaks: smoothing keeps the total of a flat line and FWHM = 2.3548 σ', smooth([3, 3, 3, 3, 3], 2).every((v) => v === 3) && near(FWHM, 2.3548200450309493, 1e-15));
};
