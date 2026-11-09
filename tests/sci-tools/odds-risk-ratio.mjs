// #466 odds and risk ratios. Reference values from statsmodels 0.15 (Table2x2; StratifiedTable: oddsratio_pooled,
// logodds_pooled_se and confint, riskratio_pooled, test_null_odds, test_equal_odds with and without Tarone's
// adjustment), SciPy 1.18 (odds_ratio conditional, fisher_exact, chi2_contingency), mid-p limits from SciPy's
// nchypergeom_fisher, and the Greenland-Robins MH RR variance coded separately in numpy.
import * as O from '../../src/lib/sci/oddsratio.ts';

const near = (a, b, tol = 1e-8) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
export default async (check) => {
  const r = O.single(40, 60, 20, 80);
  check('or: OR 2.667 with Woolf limits (statsmodels)', near(r.or, 8 / 3) && near(r.orCI[0], 1.4165914476341082) && near(r.orCI[1], 5.019874377321415));
  check('or: RR 2 with log limits', near(r.rr, 2) && near(r.rrCI[0], 1.2630063644030507) && near(r.rrCI[1], 3.1670465903713527));
  check('or: conditional MLE and exact limits (scipy)', near(r.cmle, 2.653369550927306, 1e-7) && near(r.exactCI[0], 1.3576590312041374, 1e-7) && near(r.exactCI[1], 5.313204841770101, 1e-7));
  check('or: mid-p limits and p (scipy nchypergeom_fisher)', near(r.midpCI[0], 1.4154463975499187, 1e-7) && near(r.midpCI[1], 5.070310262890865, 1e-7) && near(r.midP, 0.0021453360599090893, 1e-7));
  check('or: chi-square, Yates and Fisher p (scipy)', near(r.chi.p, 0.0020282311484520832) && near(r.yates.p, 0.003370431447397714) && near(r.fisher.p, 0.0031918168259285756));
  check('or: risk difference', near(r.rd, 0.2) && near(r.rdCI[0], 0.07604099353908772));
  const z = O.single(0, 10, 5, 12);
  check('or: zero cell: OR 0, no Woolf limits, exact lower limit 0', z.or === 0 && Number.isNaN(z.orCI[0]) && z.exactCI[0] === 0 && z.exactCI[1] > 0);
  const S = [[12, 30, 8, 50], [20, 25, 10, 40], [35, 15, 25, 30]].map(([a, b, c, d], i) => ({ name: 's' + i, a, b, c, d }));
  const m = O.stratified(S);
  check('or: MH OR and RGB limits (statsmodels StratifiedTable)', near(m.or, 2.83866456913127) && near(m.seLogOR, 0.2632573901813901) && near(m.orCI[0], 1.694450866927026) && near(m.orCI[1], 4.7555327176023985));
  check('or: MH RR and Greenland-Robins limits', near(m.rr, 1.790838829968524) && near(m.rrCI[0], 1.3371399271877165) && near(m.rrCI[1], 2.398480256040397));
  check('or: MH chi-square (statsmodels test_null_odds)', near(m.mh, 16.055150874889463) && near(m.mhP, 0.00006152403766376202, 1e-6) && near(O.stratified(S, 0.95, true).mh, 15.056202941143077));
  check('or: Breslow-Day and Tarone (statsmodels test_equal_odds)', near(m.bd, 0.1296434268340793, 1e-7) && m.bdDf === 2 && near(m.bdP, 0.9372345448272, 1e-7) && near(m.tarone, 0.12964336341785418, 1e-7));
  check('or: crude table', m.crude.a === 67 && near(m.crude.or, 2.6710963455149503));
  // A stratum with a zero cell (statsmodels agrees: worst relative difference 5.5e-13 over four test sets).
  const S2 = [[2, 8, 1, 9], [6, 4, 2, 8], [15, 5, 3, 7], [1, 20, 0, 25]].map(([a, b, c, d], i) => ({ name: 's' + i, a, b, c, d }));
  const m2 = O.stratified(S2);
  check('or: strata with a zero cell still pool', Number.isFinite(m2.or) && m2.bdDf === 3 && Number.isFinite(m2.bdP));
};
