// #301 mark-recapture: reference values from an independent Python implementation (NumPy/SciPy 1.x:
// scipy.stats.norm, chi2 and t quantiles), written separately from src/lib/sci/markrecap.ts.
import { twoSample, schnabel } from '../../src/lib/sci/markrecap.ts';
import { poissonCI, chi2Inv } from '../../src/lib/sci/ecoopt.ts';

export default async (check) => {
  const close = (a, b, rel = 1e-6) => Math.abs(a - b) <= rel * Math.max(1, Math.abs(b));
  const a = twoSample(120, 100, 18);
  check('mark-recapture: Lincoln-Petersen 666.67', close(a.lp, 666.6666667));
  check('mark-recapture: Chapman 642.21, Seber variance 14157.4', close(a.chapman, 642.2105263) && close(a.variance, 14157.40222));
  check('mark-recapture: log-normal 95 % limits 463.60 to 942.78', close(a.lo, 463.5965386) && close(a.hi, 942.7793257));
  const n = twoSample(120, 100, 18, 'normal'), p = twoSample(120, 100, 18, 'poisson');
  check('mark-recapture: normal limits 409.00 to 875.42', close(n.lo, 409.0044423) && close(n.hi, 875.4166103));
  check('mark-recapture: Poisson limits 414.01 to 1046.40', close(p.lo, 414.0060952, 1e-5) && close(p.hi, 1046.399899, 1e-5));
  const b = twoSample(50, 40, 3);
  check('mark-recapture: few recaptures flagged, log-normal 262.02 to 1166.90', !b.enough && close(b.chapman, 521.75) && close(b.lo, 262.022637) && close(b.hi, 1166.903524));
  check('mark-recapture: chi-square quantile matches SciPy (chi2.ppf(0.975, 10) = 20.4832)', close(chi2Inv(0.975, 10), 20.48317735));
  { const [lo, hi] = poissonCI(0); check('mark-recapture: Poisson limits for 0 are 0 to 3.689', lo === 0 && close(hi, 3.688879454)); }
  const s = schnabel([30, 35, 40, 32, 38].map((C, i) => ({ C, R: [0, 5, 11, 13, 19][i] })));
  check('mark-recapture: Schnabel ΣCM 10402, ΣR 48, N 216.71, adjusted 212.29', s.sumCM === 10402 && s.sumR === 48 && close(s.N, 216.7083333) && close(s.Nadj, 212.2857143));
  check('mark-recapture: Schnabel Poisson limits 163.45 to 293.91', s.method === 'poisson' && close(s.lo, 163.4479987, 1e-5) && close(s.hi, 293.9131207, 1e-5));
  const t = schnabel([60, 70, 80, 75, 90, 85].map((C, i) => ({ C, R: [0, 12, 25, 30, 45, 48][i] })));
  check('mark-recapture: Schnabel with ΣR ≥ 50 uses t limits 356.28 to 538.03', t.method === 't' && close(t.N, 428.6875) && close(t.lo, 356.2828635) && close(t.hi, 538.0265039));
  let threw = false; try { schnabel([{ C: 10, R: 2 }, { C: 5, R: 1 }]); } catch { threw = true; }
  check('mark-recapture: recaptures before any marks are rejected', threw);
};
