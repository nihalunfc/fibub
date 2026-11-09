// #560 hypothesis tests: every statistic and p-value checked against scipy 1.18.1 (scipy.stats ttest_1samp, ttest_ind,
// ttest_rel, f_oneway, levene, chisquare, chi2_contingency, fisher_exact, mannwhitneyu, wilcoxon, kruskal, shapiro,
// studentized_range, tukey_hsd) and statsmodels 0.15.0 pairwise_tukeyhsd, on random data made with numpy (seed 5).
import * as H from '../../src/lib/sci/hyptest.ts';
const R = {"x": [8.4, 7.35, 9.5, 10.84, 12.27, 10.22, 8.89, 8.43, 11.5, 13.27, 10.55, 7.53], "y": [9.13, 16.8, 12.61, 6.8, 11.75, 8.51, 10.11, 10.54, 9.86], "z": [12.38, 10.84, 9.53, 12.02, 13.07, 6.89, 10.36, 8.55, 10.57, 7.78], "t1": [0.7314936856274614, 11.0, 0.47977122435723624, 8.704813766583477, 11.08685290008319], "t1g": [0.23988561217861812, 9.158039996010318], "welch": [-0.7140436931753963, 12.99895657066559, 0.4878243280857347, -3.152241781073775, 1.586130669962666], "student_less": [-0.7584420645311081, 19.0, 0.22874602090802626, 1.0021922803385308], "paired": [-0.7520719688084077, 8.0, 0.4735518594668313, -5.285541808056096, 3.3499862525005413], "anova": [0.3137804919382227, 0.7332153692468967], "tukey": [[0.7830555555555545, 0.711369653966397, -1.6655327740136037, 3.2316438851247127], [0.30316666666666414, 0.9467113655271516, -2.074432955125842, 2.68076628845917], [-0.47988888888889036, 0.8879378664634254, -3.0312595160095186, 2.071481738231738]], "tukey_scipy": [0.711369653966397, 0.9467113655271504, 0.887937866463427], "levene": [0.21815954498021695, 0.805350873893673], "ptukey": [0.9228966891615896, 0.7259475189414756, 0.8592905512940334, 3.9582935609453846, 0.5434052749739361], "gof": [0.6599326599326599, 0.8825852195253506], "gof_eq": [4.32, 0.22891886433610517], "indep": [15.79861111111111, 0.0003710010906678793, 2], "yates": [4.886877828054299, 0.027061581911647092], "noyates": [6.651583710407239, 0.00990677301136375], "fisher": [8.0, 0.02532768703367614], "fisher_less": 0.9987453641600252, "fisher_greater": 0.012663843516838068, "fisher2": 0.48571428571428565, "mw_exact": [47.0, 0.651052971796006], "mw_exact_less": 0.325526485898003, "mw_asym": [47.0, 0.6441280160472187], "xt": [1, 2, 2, 3, 4, 4, 4, 5, 6, 7], "yt": [3, 4, 5, 5, 6, 7, 7, 8, 9], "mw_ties": [18.5, 0.032135716262669034], "mw_ties_g": 0.9869637658323629, "wx_exact": [18.0, 0.65234375], "wx_exact_g": 0.71484375, "d": [1, -2, 2, 3, 0, 4, 4, -1, 5, 6, 2, 3], "wx_approx": [5.5, 0.014145444224306167], "kw": [0.3478019762048835, 0.8403801011677816], "kw_ties": [5.100689558905639, 0.07805474968743664], "sw3": [[1.694, 1.304, 1.206], 0.8933794842039977, 0.36472758766240143], "sw11": [[1.239, 2.0, 0.781, 0.499, 1.243, 0.588, 0.642, 2.592, 1.284, 1.155, 4.061], 0.8149354944230683, 0.01479320378324864], "sw12": [[1.416, 2.033, 1.122, 1.082, 1.222, 5.523, 0.348, 2.157, 3.133, 0.992, 0.685, 3.462], 0.8569507106763868, 0.04477950604404653], "sw30": [[2.271, 0.539, 1.302, 0.662, 2.292, 1.738, 2.08, 2.336, 5.312, 1.839, 0.739, 2.915, 4.571, 0.402, 3.513, 4.149, 0.25, 1.092, 0.839, 1.334, 0.743, 3.479, 0.733, 1.825, 0.978, 5.666, 0.699, 4.07, 1.054, 2.651], 0.8964162718476693, 0.006871337191464682]};
export default async (check) => {
  const near = (a, b, tol = 1e-7) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const all = (mine, ref, tol) => mine.length === ref.length && mine.every((v, i) => near(v, ref[i], tol));
  const { x, y, z } = R, x9 = x.slice(0, 9);
  let r = H.tOne(x, 9.5); check('hyp: one-sample t, p and CI match scipy', all([r.t, r.df, r.p, ...r.ci], R.t1));
  r = H.tOne(x, 9.5, 'greater', 0.9); check('hyp: one-sided one-sample t and 90 % bound', all([r.p, r.ci[0]], R.t1g));
  r = H.tTwo(x, y); check("hyp: Welch's t, df, p and CI match scipy", all([r.t, r.df, r.p, ...r.ci], R.welch));
  r = H.tTwo(x, y, false, 'less'); check("hyp: Student's t one-sided matches scipy", all([r.t, r.df, r.p, r.ci[1]], R.student_less));
  r = H.tPaired(x9, y, 'two-sided', 0.99); check('hyp: paired t with 99 % CI matches scipy', all([r.t, r.df, r.p, ...r.ci], R.paired));
  r = H.anova([x, y, z]); check('hyp: one-way ANOVA F and p match scipy', all([r.F, r.p], R.anova));
  const tk = H.tukey([x, y, z]);
  check('hyp: Tukey HSD differences, p and intervals match statsmodels', tk.rows.every((w, i) => all([w.diff, w.p, w.lo, w.hi], R.tukey[i], 1e-6)));
  check('hyp: Tukey HSD p-values match scipy.stats.tukey_hsd', all(tk.rows.map((w) => w.p), R.tukey_scipy, 1e-6));
  check('hyp: studentized range cdf and quantile match scipy', all([H.ptukey(3.5, 3, 10), H.ptukey(4.2, 5, 2), H.ptukey(2.1, 2, 100), H.qtukey(0.95, 4, 20), H.ptukey(5, 10, 1)], R.ptukey, 1e-6));
  r = H.levene([x, y, z]); check('hyp: Levene (median) matches scipy', all([r.W, r.p], R.levene));
  r = H.chiGof([290, 105, 98, 35], [9, 3, 3, 1]); check('hyp: chi-square goodness of fit 9:3:3:1', all([r.chi2, r.p], R.gof));
  r = H.chiGof([18, 22, 30, 30]); check('hyp: chi-square goodness of fit, equal shares', all([r.chi2, r.p], R.gof_eq));
  r = H.chiIndep([[20, 15, 5], [10, 25, 25]]); check('hyp: chi-square independence 2 x 3', all([r.chi2, r.p, r.df], R.indep));
  r = H.chiIndep([[12, 5], [3, 10]]); check('hyp: 2 x 2 with Yates correction', all([r.chi2, r.p], R.yates));
  r = H.chiIndep([[12, 5], [3, 10]], false); check('hyp: 2 x 2 without correction', all([r.chi2, r.p], R.noyates));
  r = H.fisher2x2([[12, 5], [3, 10]]); check("hyp: Fisher's exact two-sided and odds ratio", all([r.or, r.p], R.fisher));
  check("hyp: Fisher's exact one-sided and symmetric table", all([H.fisher2x2([[12, 5], [3, 10]], 'less').p, H.fisher2x2([[12, 5], [3, 10]], 'greater').p, H.fisher2x2([[3, 1], [1, 3]]).p], [R.fisher_less, R.fisher_greater, R.fisher2]));
  r = H.mannWhitney(x, y, 'two-sided', 'exact'); check('hyp: Mann-Whitney exact', all([r.U1, r.p], R.mw_exact) && near(H.mannWhitney(x, y, 'less', 'exact').p, R.mw_exact_less));
  r = H.mannWhitney(x, y, 'two-sided', 'normal'); check('hyp: Mann-Whitney asymptotic', all([r.U1, r.p], R.mw_asym));
  r = H.mannWhitney(R.xt, R.yt); check('hyp: Mann-Whitney with ties (auto uses the normal approximation)', !r.exact && all([r.U1, r.p, H.mannWhitney(R.xt, R.yt, 'greater').p], [...R.mw_ties, R.mw_ties_g]));
  const d = x9.map((v, i) => v - y[i]);
  r = H.wilcoxon(d, 'two-sided', 'exact'); check('hyp: Wilcoxon signed-rank exact', all([r.W, r.p, H.wilcoxon(d, 'greater', 'exact').p], [...R.wx_exact, R.wx_exact_g]));
  r = H.wilcoxon(R.d); check('hyp: Wilcoxon with zeros and ties (normal approximation)', !r.exact && r.zeros === 1 && all([r.W, r.p], R.wx_approx));
  r = H.kruskal([x, y, z]); check('hyp: Kruskal-Wallis', all([r.H, r.p], R.kw));
  r = H.kruskal([R.xt, R.yt, [2, 2, 3, 9]]); check('hyp: Kruskal-Wallis with ties', all([r.H, r.p], R.kw_ties));
  for (const n of [3, 11, 12, 30]) { const [s, W, p] = R['sw' + n]; const w = H.shapiroWilk(s); check(`hyp: Shapiro-Wilk n = ${n} matches scipy`, all([w.W, w.p], [W, p], 1e-6)); }
  check('hyp: Hedges J for df 10 is 0.9227', near(H.hedgesJ(10), 0.92274, 1e-4));
  check('hyp: chi-square and normal tails', near(H.chi2Sf(3.841458820694124, 1), 0.05, 1e-9) && near(H.normSf(5), 2.866515718791939e-7, 1e-9));
  let threw = 0; for (const f of [() => H.tOne([1]), () => H.shapiroWilk([1, 1, 1]), () => H.chiIndep([[1, 2]]), () => H.mannWhitney([1, 2], [2, 3], 'two-sided', 'exact')]) { try { f(); } catch { threw++; } }
  check('hyp: bad input throws plain errors', threw === 4);
};
