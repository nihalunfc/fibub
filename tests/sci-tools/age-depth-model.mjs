// #884 Age-depth model. References (made-up example core): numpy.interp (linear), scipy 1.16
// make_smoothing_spline(x, y, w = 1/σ², lam) for the spline and its derivative, brentq on scipy's χ² for the
// "fit within the errors" λ, scipy UnivariateSpline(w = 1/σ, s = n) for comparison (a different, knot-based spline:
// within 40 yr here), and an independent numpy Monte Carlo (default_rng(2026), 40,000 accepted draws, same reversal
// rejection and linear interpolation) for the median, 2.5 % and 97.5 % ages. Wider checks (scratch scripts):
// 5 cores incl. random ones with 15 and 40 dates: linear < 2e-12, spline vs make_smoothing_spline < 1e-10 (3e-6 at
// λ = 1e5), extrapolation and slopes the same, χ²-target λ to 1e-12 relative; Monte Carlo quantiles within 5 % of the
// envelope width of numpy's, acceptance rates alike.
import * as A from '../../src/lib/sci/agedepth.ts';
const R = {"D": [0, 20, 42, 100, 200, 226, 300, 440], "lin": [-60.0, 259.04761904761904, 610.0, 1553.6363636363635, 3280.0, 3150.0, 5398.461538461538, 8890.0], "sp50": [-59.86957779204158, 253.5431929684556, 597.3010238117314, 1495.6706223427182, 3120.722133873705, 3607.6871045677794, 5232.976714451438, 8727.976614683528], "sp50d": [15.677594389115981, 15.656726835842607, 15.585568479180385, 15.427981599669073, 17.899762976248844, 19.712972870563803, 23.51796609125324, 25.68894626715528], "lamN": 0.21245877923776504, "spN": [-60.005225133729255, 255.21588121454607, 611.3518993848692, 1544.4028456521594, 3168.169719809718, 3274.7962324283258, 5496.972177422102, 8885.790813387242], "us": [-60.00492871189883, 248.04212336246906, 611.6383573684417, 1541.9409835567262, 3158.0127436759926, 3269.0400036482242, 5510.373029335142, 8892.491940534444], "med": [-59.99709844816477, 259.0996011570221, 610.0870028109277, 1553.4531644260683, 3189.1265079681334, 3225.5905429684008, 5398.345111715541, 8889.744263156763], "lo": [-69.73827917699528, 221.64654024676415, 531.9872699022168, 1455.1643993425969, 3091.910830992477, 3132.014190617545, 5278.177265773696, 8652.768496262437], "hi": [-50.15682329353586, 296.85198098785594, 688.3370510694903, 1652.4044155230713, 3282.885917313068, 3321.4608161432348, 5517.658586039852, 9125.647793983837], "rmed": [15.955573183154197, 15.955573183154197, 16.40830081539106, 14.729120148774703, 1.0910525778404414, 38.315466187782, 19.39394393591169, 28.509273842375833], "acc": 40000.0};
const near = (a, b, t) => Math.abs(a - b) <= t;

export default async (check) => {
  const p = A.parseLevels(A.EXAMPLE), L = p.levels, x = L.map((l) => l.depth), y = L.map((l) => l.age), sd = L.map((l) => l.sd);
  check('age-depth: example read (header skipped, 10 dates)', L.length === 10 && !p.bad.length && L[0].label === 'core top (2010)');
  check('age-depth: linear interpolation as numpy.interp', R.D.every((d, i) => near(A.linearAt(x, y, d), R.lin[i], 1e-9)));
  check('age-depth: linear extrapolation carries the end rates on', near(A.linearAt(x, y, 480), 8890 + (8890 - 7210) / (440 - 381) * 40, 1e-9) && near(A.linearAt(x, y, -10), -60 - 670 / 42 * 10, 1e-9) && Number.isNaN(A.linearAt(x, y, 480, false)));
  const s50 = A.smoothingSpline(x, y, sd, 50);
  check('age-depth: smoothing spline (λ = 50) as scipy make_smoothing_spline', R.D.every((d, i) => near(A.splineAt(s50, d), R.sp50[i], 1e-7)));
  check('age-depth: spline slope as scipy derivative', R.D.every((d, i) => near(A.splineSlope(s50, d), R.sp50d[i], 1e-9)));
  const sN = A.splineForChi2(x, y, sd, 10);
  check('age-depth: χ² = n spline: same λ as scipy + brentq', near(sN.lambda / R.lamN, 1, 1e-8) && near(sN.chi2, 10, 1e-6));
  check('age-depth: χ² = n spline values as scipy', R.D.every((d, i) => near(A.splineAt(sN, d), R.spN[i], 1e-5)));
  check('age-depth: close to UnivariateSpline(s = n) (a different spline, within 40 yr)', R.D.every((d, i) => near(A.splineAt(sN, d), R.us[i], 40)));
  check('age-depth: S = 0 passes through every date', x.every((d, i) => near(A.splineAt(A.splineForChi2(x, y, sd, 0), d), y[i], 1e-9)));
  check('age-depth: a huge S gives the weighted straight line', A.splineForChi2(x, y, sd, 1e12).lambda === Infinity);
  // Monte Carlo against the independent numpy run (statistical agreement)
  const mc = A.monteCarlo(L, R.D, 8000, 1);
  const width = R.D.map((_, i) => R.hi[i] - R.lo[i]);
  check('age-depth: Monte Carlo median within 3 % of the envelope width of numpy', R.D.every((_, i) => near(mc.median[i], R.med[i], 0.03 * width[i])));
  check('age-depth: Monte Carlo 95 % envelope within 6 % of its width of numpy', R.D.every((_, i) => near(mc.lo[i], R.lo[i], 0.06 * width[i]) && near(mc.hi[i], R.hi[i], 0.06 * width[i])));
  check('age-depth: Monte Carlo deposition time (yr/cm) medians as numpy', R.D.every((_, i) => near(mc.rateMedian[i], R.rmed[i], 0.1 * Math.max(1, R.rmed[i]))));
  check('age-depth: every accepted draw has no age reversal', (() => { const G = R.D.length; for (let i = 0; i < mc.n; i++) for (let k = 1; k < G; k++) if (mc.ages[i * G + k] < mc.ages[i * G + k - 1] - 1e-9) return false; return true; })());
  check('age-depth: same seed, same answer', A.monteCarlo(L, R.D, 500, 7).median.join() === A.monteCarlo(L, R.D, 500, 7).median.join() && A.monteCarlo(L, R.D, 500, 8).median.join() !== A.monteCarlo(L, R.D, 500, 7).median.join());
  { const r = A.rng(42); let s = 0, s2 = 0; const n = 200000; for (let i = 0; i < n; i++) { const v = r.normal(); s += v; s2 += v * v; } check('age-depth: normal generator mean 0, sd 1', near(s / n, 0, 0.01) && near(Math.sqrt(s2 / n), 1, 0.01)); }
  check('age-depth: quantile as numpy (linear)', A.quantile([1, 2, 3, 4], 0.5) === 2.5 && near(A.quantile([1, 2, 3, 4, 10], 0.975), 9.4, 1e-12));
  // Flags: the bulk sediment date at 226 cm is too young for the curve
  const f = A.flagLevels(L, sN);
  check('age-depth: the 226 cm date is flagged, the others not', f.filter((v) => v.outlier).map((v) => v.level.depth).join() === '226');
  check('age-depth: a big reversal is flagged', A.flagLevels(A.parseLevels('0,0,10\n10,500,20\n20,300,20\n30,900,20').levels, A.splineForChi2([0, 10, 20, 30], [0, 500, 300, 900], [10, 20, 20, 20], 4)).map((v) => v.reversal).join() === 'false,true,true,false');
  // Parsing: duplicates merged, # lines left out, bad lines reported
  { const q = A.parseLevels('10,100,10\n10\t140\t30\n20;300;20\n# 40,2000,10,left out\nfoo bar\n50 700 40 twig'); check('age-depth: duplicates merged by error weighting, # left out, bad line found', q.levels.length === 3 && near(q.levels[0].age, 104, 1e-9) && near(q.levels[0].sd, 9.486832980505138, 1e-12) && q.left.length === 1 && q.bad.join() === '5' && q.levels[2].label === 'twig' && q.merged.length === 1); }
  check('age-depth: depth grid', A.depthGrid(0, 440).length === 177 && A.depthGrid(0, 10, 3).join() === '0,3,6,9,10');
};
