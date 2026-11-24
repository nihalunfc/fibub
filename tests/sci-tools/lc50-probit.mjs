// #T151 LC50 probit analysis. These checks pin the tool against a published probit fit: Sunday and Ayi (2026),
// Temporal Toxicity Dynamics ... in Sub-Adult Clarias gariepinus, Research Square preprint
// doi:10.21203/rs.3.rs-10208580/v1 (CC BY 4.0, not peer reviewed). Its 96 h data are 4, 5, 10, 13 and 18 deaths of
// 30 fish at 6.18, 12.36, 18.54, 24.72 and 30.90 mg/L cadmium chloride in a fixed 1:2 mixture, with no control
// deaths. It reports slope 2.027 +- 0.496, LC50 28.100 mg/L (95 % limits 21.628 to 47.653), chi-square 2.085 and
// p = 0.555. The maximum-likelihood fit here reproduces all of those; the Fieller limits differ in the last digits
// from the package the authors used. The statsmodels and SciPy reference checks for this tool are in tests/sci.mjs.
import { fitQuantal, lcp } from '../../src/lib/sci/probit.ts';
export default async (check) => {
  const near = (a, b, t = 1e-7) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const deaths = [4, 5, 10, 13, 18];
  const mk = (cs) => [{ conc: 0, n: 30, r: 0 }, ...cs.map((c, i) => ({ conc: c, n: 30, r: deaths[i] }))];
  const f = fitQuantal(mk([6.18, 12.36, 18.54, 24.72, 30.9]), 'probit');
  const r = lcp(f, 0.5, 0.95);
  check('lc50: catfish mixture slope and intercept match the published fit',
    near(f.b, 2.0274518151, 1e-9) && near(f.a, -2.9371778308, 1e-9) && near(Math.sqrt(f.cov[1][1]), 0.5044024561, 1e-9));
  check('lc50: catfish mixture 96 h LC50 is the published 28.100 mg/L',
    near(r.conc, 28.0998587199, 1e-9) && near(r.lo, 21.6440783501, 1e-9) && near(r.hi, 47.9700347130, 1e-9));
  check('lc50: catfish mixture goodness of fit matches the published chi-square',
    f.df === 3 && near(f.chi2, 2.0849485395, 1e-9) && near(f.pChi, 0.5549637729, 1e-9) && !f.hetero && near(r.g, 0.2377658537, 1e-9));
  check('lc50: catfish LC10 and LC90 from the same fit',
    near(lcp(f, 0.1, 0.95).conc, 6.5554799713, 1e-9) && near(lcp(f, 0.9, 0.95).conc, 120.4491606315, 1e-9));
  // Tripling every concentration (the whole mixture, not just its cadmium chloride) leaves the slope alone and
  // multiplies the LC50 by three: 28.0999 x 3 = 84.2996.
  const t = fitQuantal(mk([18.54, 37.08, 55.62, 74.16, 92.7]), 'probit');
  check('lc50: a threefold concentration scale keeps the slope and triples the LC50',
    near(t.b, 2.0274518151, 1e-9) && near(lcp(t, 0.5, 0.95).conc, 84.2995761598, 1e-9));
};
