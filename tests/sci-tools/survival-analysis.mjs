// #467 survival analysis: Kaplan-Meier, log-rank and Cox regression, checked against Python's lifelines 0.30
// (KaplanMeierFitter, logrank_test, multivariate_logrank_test, CoxPHFitter) and statsmodels PHReg (ties='efron').
import { parseSurvival, kaplanMeier, logRank, coxPH, design, chi2Sf, survivalAt, atRiskAt } from '../../src/lib/sci/survival.ts';

// The tool's made-up example: 40 subjects, months, Control and Treatment, age.
const EX = `Months	Event	Group	Age
${'1 1 Control 64|35 0 Treatment 79|13 0 Control 53|10 0 Treatment 49|1 1 Control 78|5 1 Treatment 67|18 1 Control 67|27 0 Treatment 46|20 0 Control 45|2 1 Treatment 46|1 1 Control 75|12 0 Treatment 45|9 1 Control 79|14 1 Treatment 58|15 0 Control 58|16 0 Treatment 76|29 0 Control 69|7 1 Treatment 63|31 0 Control 55|5 1 Treatment 48|10 1 Control 77|15 1 Treatment 61|2 1 Control 69|14 0 Treatment 58|14 1 Control 68|12 0 Treatment 72|18 1 Control 57|20 0 Treatment 62|6 1 Control 45|21 0 Treatment 54|9 1 Control 63|35 0 Treatment 72|4 1 Control 74|17 0 Treatment 63|15 1 Control 48|29 0 Treatment 62|9 1 Control 52|27 1 Treatment 45|7 1 Control 68|32 0 Treatment 47'.split('|').map((r) => r.split(' ').join('\t')).join('\n')}`;
const THREE = '2.964,1,C;30.501,0,T;3.912,1,O;12.24,1,C;38.861,0,T;1.018,1,O;32.146,0,C;21.483,0,T;4.822,1,O;34.724,0,C;14.43,1,T;13.033,1,O;29.239,0,C;12.569,0,T;9.731,1,O;18.479,0,C;19.253,0,T;3.66,1,O;8.48,0,C;26.711,0,T;25.107,0,O;8.847,1,C;4.49,1,T;13.682,1,O;0.525,1,C;20.606,0,T;17.812,0,O;0.239,1,C;26.467,0,T;4.304,1,O;0.958,1,C;20.986,0,T;9.423,1,O;16.881,1,C;18.498,0,T;15.055,1,O;18.887,1,C;24.579,0,T;10.536,1,O;0.235,1,C;20.299,1,T;9.5,1,O;17.604,0,C';

export default async (check) => {
  const near = (a, b, tol) => Math.abs(a - b) <= tol;
  const ds = parseSurvival(EX);
  check('survival: example parsed (40 rows, 2 groups, age covariate)', ds.rows.length === 40 && ds.groups.join() === 'Control,Treatment' && ds.covNames.join() === 'Age' && !ds.skipped.length);
  const sub = (g) => ds.rows.filter((r) => r.g === g);
  const C = sub('Control'), Tr = sub('Treatment');
  const kc = kaplanMeier(C.map((r) => r.t), C.map((r) => r.e));
  const kt = kaplanMeier(Tr.map((r) => r.t), Tr.map((r) => r.e));
  const ka = kaplanMeier(ds.rows.map((r) => r.t), ds.rows.map((r) => r.e));
  // lifelines: Control S(5, 10, 20) = 0.75, 0.45, 0.2025; Treatment 0.85, 0.8, 0.671329.
  check('survival: KM Control S(5,10,20) = lifelines', near(survivalAt(kc, 5), 0.75, 1e-12) && near(survivalAt(kc, 10), 0.45, 1e-12) && near(survivalAt(kc, 20), 0.2025, 1e-12));
  check('survival: KM Treatment S(20) = 0.671329 (lifelines)', near(survivalAt(kt, 20), 0.67132867, 1e-8));
  const c10 = kc.steps.find((s) => s.t === 10);
  check('survival: log-log Greenwood CI at 10 = lifelines 0.231108 to 0.647090', near(c10.lo, 0.231108, 1e-6) && near(c10.hi, 0.64709, 1e-6));
  const p10 = kaplanMeier(C.map((r) => r.t), C.map((r) => r.e), 0.95, 'plain').steps.find((s) => s.t === 10);
  const l10 = kaplanMeier(C.map((r) => r.t), C.map((r) => r.e), 0.95, 'log').steps.find((s) => s.t === 10);
  check('survival: plain CI at 10 (Greenwood by hand 0.231968 to 0.668032)', near(p10.lo, 0.231967771, 1e-8) && near(p10.hi, 0.668032229, 1e-8));
  check('survival: log CI at 10 (by hand 0.277198 to 0.730525)', near(l10.lo, 0.277197852, 1e-8) && near(l10.hi, 0.730525141, 1e-8));
  // Control's curve is exactly 0.5 from month 9 to 10: R's survfit gives the midpoint 9.5; lifelines gives 10 only
  // because its log-sum makes S(9) = 0.5000000000000002.
  check('survival: medians and CIs (Control 9.5 [4, 18] as R; Treatment not reached [14, inf] as lifelines)', kc.median === 9.5 && kc.medianLo === 4 && kc.medianHi === 18 && kt.median === Infinity && kt.medianLo === 14 && kt.medianHi === Infinity);
  const a12 = ka.steps.find((s) => s.t === 12);
  check('survival: all subjects S(12) = 0.625, CI 0.456912 to 0.754252, median 18 [9, inf]', near(a12.S, 0.625, 1e-12) && near(a12.lo, 0.45691151, 1e-7) && near(a12.hi, 0.75425199, 1e-7) && ka.median === 18 && ka.medianLo === 9 && ka.medianHi === Infinity);
  check('survival: number at risk', atRiskAt(ds.rows.map((r) => r.t), 0) === 40 && atRiskAt(ds.rows.map((r) => r.t), 20) === 11 && kc.steps[0].atRisk === 20);
  const lr = logRank(ds.rows.map((r) => r.t), ds.rows.map((r) => r.e), ds.rows.map((r) => r.g));
  check(`survival: log-rank chi2 6.118604, p 0.0133766 (lifelines) got ${lr.chi2}`, near(lr.chi2, 6.1186036956935785, 1e-9) && near(lr.p, 0.013376642161567025, 1e-10) && lr.df === 1);
  const th = THREE.split(';').map((s) => s.split(','));
  const lr3 = logRank(th.map((r) => +r[0]), th.map((r) => +r[1]), th.map((r) => r[2]));
  check(`survival: 3-group log-rank chi2 12.524690, p 0.00190677 (lifelines multivariate_logrank_test) got ${lr3.chi2}`, near(lr3.chi2, 12.524690365011612, 1e-8) && near(lr3.p, 0.0019067688281320819, 1e-10) && lr3.df === 2);
  const d = design(ds, true, [0]);
  check('survival: design matrix (Treatment vs Control, Age)', d.names.join() === 'Treatment vs Control,Age' && d.X[1].join() === '1,79');
  const cx = coxPH(ds.rows.map((r) => r.t), ds.rows.map((r) => r.e), d.X, d.names);
  const [b1, b2] = cx.terms;
  check(`survival: Cox Efron coefficients = statsmodels PHReg (-1.08355282, 0.02211732) got ${b1.beta}, ${b2.beta}`, near(b1.beta, -1.08355282, 1e-7) && near(b2.beta, 0.02211732, 1e-7));
  check('survival: Cox SEs 0.46168607, 0.02065058', near(b1.se, 0.46168607, 1e-7) && near(b2.se, 0.02065058, 1e-7));
  check('survival: Cox HR 0.338391 (CI 0.136909 to 0.836386), p 0.018928', near(b1.hr, 0.33839114, 1e-6) && near(b1.lo, 0.13690871, 1e-6) && near(b1.hi, 0.83638626, 1e-6) && near(b1.p, 0.01892794, 1e-6) && near(b2.p, 0.28415733, 1e-6));
  check('survival: Cox log-likelihood -67.554399 and LR test 7.311547, p 0.0258415', near(cx.loglik, -67.55439852, 1e-6) && near(cx.lr, 7.311546664, 1e-6) && near(cx.lrP, 0.0258415057, 1e-7) && cx.converged && !cx.warning);
  const g1 = coxPH(ds.rows.map((r) => r.t), ds.rows.map((r) => r.e), design(ds, true, []).X, ['trt']);
  check('survival: Cox group only HR 0.334376, p 0.0174717 (statsmodels)', near(g1.terms[0].hr, 0.33437579, 1e-6) && near(g1.terms[0].p, 0.01747171, 1e-6));
  check('survival: chi-square tail = scipy', near(chi2Sf(30, 2) / 3.0590232050182594e-07, 1, 1e-9) && near(chi2Sf(100, 1) / 1.5239706048320995e-23, 1, 1e-6) && near(chi2Sf(3.84, 1), 0.05004352124870519, 1e-12) && near(chi2Sf(0.5, 5), 0.9921232932326296, 1e-12) && near(chi2Sf(12.5, 3), 0.005852662593326735, 1e-12));
  // Bad input and edge cases.
  let msg = ''; try { parseSurvival(''); } catch (e) { msg = e.message; }
  check('survival: empty paste message', msg.startsWith('Paste your data'));
  const sk = parseSurvival('t\te\n5\t1\nx\t1\n4\t2\n3\t0');
  check('survival: bad rows skipped with reasons', sk.rows.length === 2 && sk.skipped.length === 2 && sk.skipped[1].includes('not 1 or 0'));
  const words = parseSurvival('5,dead,A\n6,alive,B');
  check('survival: event words and comma data', words.rows[0].e === 1 && words.rows[1].e === 0 && words.groups.join() === 'A,B');
  const all = kaplanMeier([1, 2, 3], [1, 1, 1]);
  check('survival: curve reaching zero has no interval at 0', all.steps[2].S === 0 && Number.isNaN(all.steps[2].lo) && all.median === 2);
  msg = ''; try { logRank([1, 2], [1, 1], ['A', 'A']); } catch (e) { msg = e.message; }
  check('survival: log-rank needs two groups', msg.includes('two groups'));
  let sepOk = false; try { sepOk = !!coxPH([1, 2, 3, 4, 5, 6], [1, 1, 1, 1, 1, 1], [[1], [1], [1], [0], [0], [0]], ['x']).warning; } catch (e) { sepOk = e.message.includes('perfectly separates'); }
  check('survival: perfect separation warns or explains', sepOk);
  msg = ''; try { coxPH([1, 2, 3], [1, 1, 0], [[1], [1], [1]], ['x']); } catch (e) { msg = e.message; }
  check('survival: constant covariate message', msg.includes('same value for everyone'));
};
