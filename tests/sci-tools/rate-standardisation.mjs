// #463 rates and standardisation. Reference values from SciPy 1.18: gamma.ppf in the form R's epitools
// ageadjust.direct uses (Fay and Feuer 1997), chi2.ppf for exact Poisson limits, poisson.cdf/sf for the exact SMR
// test, and statsmodels proportion_confint for Wilson and Clopper-Pearson limits.
import * as R from '../../src/lib/sci/ratestd.ts';

const near = (a, b, tol = 1e-8) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
export default async (check) => {
  const rows = [['0-14', 3, 20000, 20000], ['15-44', 25, 45000, 40000], ['45-64', 60, 25000, 25000], ['65+', 140, 10000, 15000]].map(([name, events, pop, std]) => ({ name, events, pop, std }));
  const d = R.direct(rows);
  check('std: directly standardised rate 295.2 per 100 000', near(d.dsr, 295.2222222222222) && near(d.crude, 228));
  check('std: Fay-Feuer gamma limits (scipy gamma, epitools form)', near(d.ci[0], 257.4245117780716, 1e-7) && near(d.ci[1], 337.1824552704899, 1e-7));
  const n = R.direct(rows, 1e5, 0.95, 'normal');
  check('std: normal limits', near(n.ci[0], 256.1331943207065, 1e-7) && near(n.ci[1], 334.3112501237379, 1e-7) && near(n.se, 19.943748053456577));
  check('std: weights and expected cases', near(d.groups[3].weight, 0.15) && near(d.groups[3].expected, 210) && near(d.groups[3].rate, 1400));
  const z = R.direct([{ name: 'a', events: 0, pop: 500, std: 300 }, { name: 'b', events: 0, pop: 800, std: 500 }]);
  check('std: no events: rate 0, lower limit 0, finite upper limit', z.dsr === 0 && z.ci[0] === 0 && z.ci[1] > 0 && Number.isFinite(z.ci[1]));
  const ind = R.indirect([['0-14', 20000, 10], ['15-44', 45000, 50], ['45-64', 25000, 220], ['65+', 10000, 1200]].map(([name, pop, rate]) => ({ name, pop, rate })), 260);
  check('std: SMR 1.303 from 260 observed and 199.5 expected', near(ind.expected, 199.5) && near(ind.smr, 1.3032581453634084));
  check('std: SMR exact Poisson limits (scipy chi2)', near(ind.ci[0], 1.1496444982912342, 1e-7) && near(ind.ci[1], 1.4716814180071816, 1e-7));
  check('std: SMR exact two-sided p (scipy poisson)', near(ind.p / 4.716421056900414e-05, 1, 1e-6));
  check('std: SMR with no deaths', (() => { const r = R.indirect([{ name: 'a', pop: 1000, rate: 30 }, { name: 'b', pop: 2000, rate: 80 }], 0); return r.smr === 0 && r.ci[0] === 0 && near(r.ci[1], 3.6888794541139354 / 1.9); })());
  const c = R.crude(17, 5230.5, 'rate', 1000);
  check('std: incidence rate with exact Poisson limits', near(c.est, 3.250167288022178) && near(c.ci[0], 1.8933422176861252, 1e-7) && near(c.ci[1], 5.203832676781675, 1e-7));
  check('std: risk (Wilson) and prevalence (exact)', near(R.crude(45, 300, 'risk', 100).ci[0], 11.403246871185315, 1e-7) && near(R.crude(45, 300, 'prevalence', 100, 0.95, 'exact').ci[1], 19.55164406840253, 1e-7));
  check('std: Poisson tails', near(R.poissonTails(3, 2.5).le, 0.7575761331330659, 1e-9) && near(R.poissonTails(3, 2.5).ge, 0.4561868841166703, 1e-9));
};
