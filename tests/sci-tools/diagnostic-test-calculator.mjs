// #461 diagnostic test calculator. Reference values from statsmodels 0.15 proportion_confint ('beta', 'wilson')
// and Table2x2, SciPy 1.18 (chi2, fisher_exact, odds_ratio conditional) and the Simel (1991) log formula in numpy.
import * as D from '../../src/lib/sci/diagtest.ts';
import * as E from '../../src/lib/sci/epistat.ts';

const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
export default async (check) => {
  const r = D.fromTable(84, 30, 16, 270, 'exact'), g = (k) => r.get(k);
  check('diag: sensitivity and Clopper-Pearson limits (statsmodels beta)', near(g('sens').est, 0.84) && near(g('sens').ci[0], 0.7532124025891377) && near(g('sens').ci[1], 0.9056897100260538));
  check('diag: specificity limits', near(g('spec').ci[0], 0.8603266926448977) && near(g('spec').ci[1], 0.9315083155089265));
  check('diag: PPV and NPV', near(g('ppv').est, 84 / 114) && near(g('ppv').ci[0], 0.6461059159872597) && near(g('npv').est, 270 / 286));
  check('diag: LR+ and LR− with log limits (Simel)', near(g('lrp').est, 8.4) && near(g('lrp').ci[0], 5.918865653811157) && near(g('lrp').ci[1], 11.921203170841775) && near(g('lrn').est, 0.1777777777777778) && near(g('lrn').ci[1], 0.27899665262398016));
  check('diag: DOR (statsmodels Table2x2)', near(g('dor').est, 47.25) && near(g('dor').ci[0], 24.56100060498164) && near(g('dor').ci[1], 90.89867859647279));
  check('diag: accuracy, prevalence, Youden', near(g('acc').est, 0.885) && near(g('prev').est, 0.25) && near(g('youden').est, 0.74));
  const w = D.fromTable(84, 30, 16, 270, 'wilson');
  check('diag: Wilson limits (statsmodels wilson)', near(w.get('sens').ci[0], 0.7557973061072976) && near(w.get('sens').ci[1], 0.8990471151119521) && near(w.get('npv').ci[0], 0.9110666999015986));
  check('diag: 90 % limits narrower', D.fromTable(84, 30, 16, 270, 'exact', 0.9).get('sens').ci[0] > 0.7532);
  const z = D.fromTable(5, 1, 0, 40, 'exact');
  check('diag: zero false negatives: sensitivity 1, upper limit 1, LR− 0 without limits', z.get('sens').est === 1 && z.get('sens').ci[1] === 1 && z.get('lrn').est === 0 && Number.isNaN(z.get('lrn').ci[0]));
  const f = D.fromRates(0.9, 0.95, 0.01);
  check('diag: from rates: PPV 15.4 %, NPV 99.89 %, LR+ 18', near(f.ppv, 9 / 58.5) && near(f.npv, 940.5 / 941.5) && near(f.lrp, 18) && near(f.tp, 9) && near(f.fp, 49.5));
  check('diag: Bayes post-test', near(D.postTest(0.25, 8.4), 0.7368421052631579) && D.postTest(0, 5) === 0 && D.postTest(1, 0.1) === 1 && near(D.postTest(0.5, 1), 0.5));
  // Fagan: the line through (left, pre) and (middle, LR) reaches the post-test value on the right.
  const pre = 0.2, lr = 6, post = D.postTest(pre, lr);
  check('diag: Fagan scales are collinear', near(2 * D.fagan.mid(lr) - D.fagan.left(pre), D.fagan.right(post), 1e-12));
  // Shared epi helpers.
  check('epistat: chi-square quantiles (scipy chi2.ppf)', near(E.chi2Inv(0.025, 10), 3.246972780236841, 1e-9) && near(E.chi2Inv(0.975, 22), 36.78071208403289, 1e-9) && near(E.chi2Inv(0.001, 1) / 1.5707971492624921e-06, 1, 1e-6));
  check('epistat: Garwood Poisson limits', near(E.poissonCI(5)[0], 1.6234863901184207, 1e-9) && near(E.poissonCI(5)[1], 11.66833207932267, 1e-9) && E.poissonCI(0)[0] === 0 && near(E.poissonCI(0)[1], 3.6888794541139354, 1e-9));
  check('epistat: Fisher exact p (scipy fisher_exact)', near(E.fisherExact(3, 1, 1, 3).p, 0.48571428571428565) && near(E.fisherExact(10, 2, 3, 15).p, 0.0005367241191434357, 1e-8) && near(E.fisherExact(20, 30, 25, 10).p, 0.007642524824437287, 1e-8));
  const x = E.exactOR(12, 5, 6, 20);
  check('epistat: conditional MLE OR and exact limits (scipy odds_ratio conditional)', near(x.or, 7.5465505869899525, 1e-7) && near(x.exact[0], 1.676713761015668, 1e-7) && near(x.exact[1], 40.493213022964966, 1e-7));
  check('epistat: chi-square 2x2 with Yates (scipy chi2_contingency)', near(E.chi2x2(10, 2, 3, 15).chi2, 13.031674208144796, 1e-6) && near(E.chi2x2(10, 2, 3, 15, true).chi2, 10.45814479638009, 1e-6));
};
