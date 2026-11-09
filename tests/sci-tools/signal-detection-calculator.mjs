// #721 Signal detection: checked against scipy.stats.norm (yes/no measures) and scipy.optimize.minimize
// (maximum likelihood ROC fit, same likelihood), with SEs from a finite-difference Hessian in numpy.
import { yesNo, roc, chi2Sf } from '../../src/lib/sci/sdt.ts';

export default async (check) => {
  const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  let r = yesNo({ hits: 42, misses: 8, fas: 12, crs: 38 }, 'none');
  check('sdt: d′ 1.700760 (scipy)', near(r.dprime, 1.70076045));
  check('sdt: c −0.144078, β 0.782672', near(r.c, -0.14407766) && near(r.beta, 0.78267199));
  check("sdt: A′ 0.875940, B″ −0.151515 (Grier)", near(r.aPrime, 0.87593985) && near(r.bDoublePrime, -0.15151515));
  check('sdt: SE of d′ 0.288362 (Gourevitch and Galanter)', near(r.se, 0.28836167));
  check('sdt: equal-variance Az Φ(d′/√2) 0.885438', near(r.azEqual, 0.88543815));
  r = yesNo({ hits: 42, misses: 8, fas: 12, crs: 38 }, 'loglinear');
  check('sdt: log-linear d′ 1.657419, c −0.138712', near(r.dprime, 1.65741856) && near(r.c, -0.13871229));
  r = yesNo({ hits: 50, misses: 0, fas: 5, crs: 45 }, 'half');
  check('sdt: 1/(2N) rule H = 0.99, d′ 3.607899', r.H === 0.99 && near(r.dprime, 3.60789944) && r.corrected);
  r = yesNo({ hits: 50, misses: 0, fas: 5, crs: 45 }, 'loglinear');
  check('sdt: log-linear with H = 1, d′ 3.571849', near(r.dprime, 3.57184891));
  check('sdt: no correction with H = 1 gives infinite d′', yesNo({ hits: 50, misses: 0, fas: 5, crs: 45 }, 'none').dprime === Infinity);
  r = yesNo({ hits: 30, misses: 20, fas: 35, crs: 15 }, 'none');
  check('sdt: below chance, A′ 0.401786 mirror form, β 1.111161', near(r.aPrime, 0.40178571) && near(r.beta, 1.11116117) && r.dprime < 0);
  let threw = false; try { yesNo({ hits: 0, misses: 0, fas: 3, crs: 4 }); } catch { threw = true; }
  check('sdt: no signal trials is an error', threw);

  const R = roc([38, 22, 14, 12, 8, 6], [4, 9, 14, 18, 25, 30]);
  check('roc: 5 points, trapezoid area 0.8055', R.points.length === 5 && near(R.areaTrap, 0.8055));
  check('roc: z-ROC least squares a 1.151493, b 0.818841 (numpy polyfit)', near(R.ls.a, 1.15149292) && near(R.ls.b, 0.8188406));
  check('roc: LS Az 0.813514', near(R.ls.az, 0.81351359));
  check('roc: ML a 1.152732, b 0.818377 (scipy.optimize)', near(R.ml.a, 1.1527317, 1e-5) && near(R.ml.b, 0.8183768, 1e-5));
  check('roc: ML Az 0.813825, log-likelihood −323.969440', near(R.ml.az, 0.81382494, 1e-5) && near(R.ml.logLik, -323.96944008, 1e-8));
  check('roc: ML criteria match', [1.77675701, 1.11158489, 0.6177136, 0.11339015, -0.51871103].every((v, i) => near(R.ml.criteria[i], v, 1e-5)));
  check('roc: SE a 0.16824, b 0.12633, Az 0.030486 (delta method)', near(R.ml.seA, 0.168241, 1e-3) && near(R.ml.seB, 0.126329, 1e-3) && near(R.ml.seAz, 0.0304858, 1e-3));
  check('roc: G² 0.23978 on 3 df, p 0.97092', near(R.ml.g2, 0.2397849, 1e-4) && R.ml.df === 3 && near(R.ml.p, 0.970925, 1e-4));
  check('roc: chi-square tails (scipy chi2.sf)', near(chi2Sf(10, 4), 0.040427682) && near(chi2Sf(0.5, 7), 0.99944648) && near(chi2Sf(30, 3), 1.38005703e-6, 1e-6));
  check('roc: two categories give one point and no ML fit', roc([30, 20], [10, 40]).ml === null);
};
