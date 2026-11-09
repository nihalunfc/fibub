// #691 calibration drift: regression, prediction interval, out-of-tolerance probability and the times found by
// root finding, checked against scipy.stats.linregress, scipy.stats.t and scipy.optimize.brentq.
import * as D from '../../src/lib/sci/eng-drift.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const d0 = D.parseDate(D.EXAMPLE[0][0]), t = D.EXAMPLE.map((r) => (D.parseDate(r[0]) - d0) / 365.25), e = D.EXAMPLE.map((r) => r[1]), tl = t[t.length - 1];
  check('drift: dates parse to days (leap year 2020)', D.parseDate('2020-03-01') - D.parseDate('2020-02-01') === 29 && D.isoDate(D.parseDate('2024-02-21')) === '2024-02-21' && Number.isNaN(D.parseDate('2024-13-01')));
  const f = D.driftFit(t, e);
  check('drift: slope, intercept, SE, s and R² match scipy linregress', near(f.slope, 0.03606270498583231, 1e-12) && near(f.intercept, 0.009760229193985698, 1e-12) && near(f.seSlope, 0.002208185069118189, 1e-10) && near(f.s, 0.010573342047780243, 1e-10) && near(f.r2, 0.9744258518164868, 1e-12));
  check('drift: slope p-value and 95 % CI match scipy', near(f.pSlope, 7.863256920243397e-7, 1e-6) && near(f.slopeCI[0], 0.030841177019390355, 1e-9) && near(f.slopeCI[1], 0.04128423295227427, 1e-9));
  const pi = D.predInterval(f, tl + 1);
  check('drift: 95 % prediction interval one year after the last calibration', near(pi[0], 0.1917737531512781, 1e-9) && near(pi[1], 0.25669789431526546, 1e-9));
  check('drift: probability out of ±0.25 one year on = 5.13 % (scipy.stats.t)', near(D.probOut(f, tl + 1, -0.25, 0.25), 0.05132883332164498, 1e-8));
  check('drift: fitted line reaches +0.25 at 6.6617 years', near(D.lineCrossing(f, -0.25, 0.25, tl), 6.661723542379739, 1e-12));
  check('drift: prediction band reaches +0.25 at 5.7758 years (brentq)', near(D.firstTime((x) => D.predInterval(f, x)[1] > 0.25, tl), 5.775833057716209, 1e-9));
  check('drift: 95 % reliability interval ends at 5.9409 years; 90 % with ±0.22 at 5.3210', near(D.firstTime((x) => D.probOut(f, x, -0.25, 0.25) > 0.05, tl), 5.9409332054106, 1e-9) && near(D.firstTime((x) => D.probOut(f, x, -0.22, 0.22) > 0.1, tl), 5.320982779114267, 1e-9));
  check('drift: a falling drift crosses the lower limit', near(D.lineCrossing({ ...f, slope: -0.1, intercept: 0 }, -0.25, 0.25, 0), 2.5, 1e-12));
  check('drift: drifting away from a one-sided limit never crosses', Number.isNaN(D.lineCrossing({ ...f, slope: -0.1 }, NaN, 0.25, 0)));
  check('drift: firstTime returns NaN when never reached', Number.isNaN(D.firstTime(() => false, 0, 5)));
};
