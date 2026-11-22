// Checks for the Statistics for analysts course maths (src/lib/stats/) against printed table values and
// reference results (scipy 1.18) for the worked examples in the lessons. Run with `node tests/stats.mjs`.
import * as D from '../src/lib/stats/dist.ts';
import * as S from '../src/lib/stats/tests.ts';

let fails = 0, n = 0;
const near = (got, want, tol, what) => { n++; if (!(Math.abs(got - want) <= tol)) { fails++; console.error(`✗ ${what}: got ${got}, want ${want}`); } };
const ok = (cond, what) => { n++; if (!cond) { fails++; console.error(`✗ ${what}`); } };

// Table values.
near(D.tInv(0.975, 10), 2.228138852, 1e-6, 't 0.975 df10');
near(D.tInv(0.975, 30), 2.042272456, 1e-6, 't 0.975 df30');
near(D.chi2Inv(0.95, 1), 3.841458821, 1e-6, 'chi2 0.95 df1');
near(D.chi2Inv(0.95, 5), 11.07049769, 1e-6, 'chi2 0.95 df5');
near(D.fInv(0.95, 2, 12), 3.885293835, 1e-6, 'F 0.95 (2,12)');
near(D.fInv(0.95, 3, 20), 3.098391212, 1e-6, 'F 0.95 (3,20)');
near(D.normalInv(0.975), 1.959963985, 1e-6, 'z 0.975');
near(D.normalInv(0.05), -1.644853627, 1e-6, 'z 0.05');
near(D.poissonPmf(2, 3), 0.2240418077, 1e-9, 'Poisson(3) P(2)');
near(D.binomPmf(3, 10, 0.5), 120 / 1024, 1e-12, 'Binomial(10, .5) P(3)');
near(D.binomCdf(3, 10, 0.3), 0.6496107184, 1e-9, 'Binomial(10, .3) P(≤3)');
near(D.ibeta(0.3, 2, 5), 0.579825, 1e-9, 'incomplete beta');
near(D.igamma(3, 2), 0.3233235838, 1e-9, 'incomplete gamma');
near(D.choose(10, 3), 120, 0, '10 choose 3');
near(D.expCdf(2, 0.5), 1 - Math.exp(-1), 1e-12, 'exponential');

// Groups used in the Module 6 examples.
const a = [6, 8, 4, 5, 3, 4], b = [8, 12, 9, 11, 6, 8], c = [13, 9, 11, 8, 7, 12];
const av = S.anova([a, b, c]);
near(av.f, 9.264705882, 1e-8, 'ANOVA F'); near(av.p, 0.002398777, 1e-7, 'ANOVA p');
const w = S.tTestTwo(a, b);
near(w.t, -3.464101615, 1e-8, 'Welch t'); near(w.df, 9.615384615, 1e-8, 'Welch df'); near(w.p, 0.006443866, 1e-7, 'Welch p');
near(S.tTestTwo(a, b, true).p, 0.006080848, 1e-7, 'pooled p');
const pr = S.tTestPaired(b, a);
near(pr.t, -6.92820323, 1e-7, 'paired t'); near(pr.p, 0.000961253, 1e-8, 'paired p');
near(S.tTestOne(c, 8).p, 0.093216321, 1e-7, 'one-sample p');
const ct = S.chiSquareTable([[20, 30], [40, 10]]);
near(ct.chi2, 16.66666667, 1e-7, 'chi-square table'); near(ct.p, 4.455709e-5, 1e-9, 'chi-square p');
const g = S.chiSquareGof([50, 30, 20], [40, 40, 20]);
near(g.chi2, 5, 1e-12, 'GOF chi2'); near(g.p, 0.082085, 1e-6, 'GOF p');
const mw = S.mannWhitney(a, c);
near(mw.U, 1.5, 1e-12, 'Mann-Whitney U'); near(mw.p, 0.010138895, 1e-6, 'Mann-Whitney p');
near(S.pearson(a, b).r, 0.765465545, 1e-8, 'Pearson r'); near(S.pearson(a, b).p, 0.076059167, 1e-7, 'Pearson p');
near(S.spearman(a, b).r, 0.720588235, 1e-8, 'Spearman rho');
near(S.skewness(c), 0, 1e-12, 'skew'); near(S.kurtosis(c), -1.875, 1e-9, 'kurtosis');
const rg = S.regress(a, b);
near(rg.b, 0.9375, 1e-12, 'slope'); near(rg.a, 4.3125, 1e-12, 'intercept'); near(rg.seB, 0.394047507, 1e-8, 'slope SE'); near(rg.r2, 0.5859375, 1e-12, 'R²');

// Lesson worked examples.
near(S.nPerGroupProportions(0.10, 0.12), 3841, 0, 'A/B sample size 10% → 12%');
const ab = S.propTest(200, 2000, 250, 2000);
near(ab.diff, 0.025, 1e-12, 'A/B diff'); ok(ab.p < 0.05 && ab.p > 0.005, `A/B p ${ab.p}`);
near(S.ciProportion(40, 200).wald.me, 1.959963985 * Math.sqrt(0.2 * 0.8 / 200), 1e-6, 'proportion margin');
near(S.nForProportion(0.03), 1068, 0, 'poll size ±3 points');
near(S.ciMean(50, 10, 25).me, 2.063898562 * 2, 1e-6, 'mean CI (t df24)');
near(S.bayesPositive(0.01, 0.9, 0.05), 0.009 / (0.009 + 0.0495), 1e-12, 'Bayes test');
near(S.expected([0, 100], [0.9, 0.1]).ev, 10, 1e-12, 'expected value');
const f5 = S.fiveNumber([1, 2, 3, 4, 5, 6, 7, 8, 100]);
ok(f5.outliers.length === 1 && f5.outliers[0] === 100, 'box plot outlier');
near(S.holm([0.01, 0.04, 0.03])[1], 0.06, 1e-12, 'Holm');
near(S.powerMeans(5, 10, 64), 0.807430419, 1e-4, 'power');
ok(S.srmTest([5100, 4900], [1, 1]).p > 0.04, 'SRM borderline');
near(S.controlLimits([10, 12, 11, 13, 12]).centre, 11.6, 1e-12, 'control centre');

if (fails) { console.error(`stats: ${fails} of ${n} checks failed`); process.exit(1); }
console.log(`stats: ${n} checks passed`);
