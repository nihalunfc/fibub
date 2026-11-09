// #690 control charts and capability: limits, run-rule flags and capability indices checked against an
// independent NumPy/SciPy script (constants by SciPy integration and scipy.special.gammaln, run rules written
// separately, chi-square and normal quantiles from scipy.stats).
import * as C from '../../src/lib/sci/eng-cc.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const g = C.exampleVariables(), x = g.flat();
  check('cc: example is 25 subgroups of 5', g.length === 25 && g.every((s) => s.length === 5));
  const xr = C.xbarChart(g, 'xbar-r');
  check('cc: X̄-R limits match NumPy (X̄̄, UCL, LCL, R̄, UCL_R, σ = R̄/d2)', near(xr.main.cl, 500.23648) && near(xr.main.ucl[0], 500.83175755277585, 1e-12) && near(xr.main.lcl[0], 499.6412024472242, 1e-12) && near(xr.second.cl, 1.032) && near(xr.second.ucl[0], 2.1821631177389453, 1e-9) && xr.second.lcl[0] === 0 && near(xr.sigmaWithin, 0.4436936911621394, 1e-9));
  const xs = C.xbarChart(g, 'xbar-s');
  check('cc: X̄-S limits match NumPy (c4 from the gamma function)', near(xs.main.ucl[0], 500.84288039491554, 1e-12) && near(xs.second.cl, 0.4248586108901924, 1e-12) && near(xs.second.ucl[0], 0.8875287326188349, 1e-12) && near(xs.sigmaWithin, 0.45198416820458215, 1e-12));
  const im = C.imrChart(x);
  check('cc: I-MR limits match NumPy', near(im.main.ucl[0], 501.6670217854727, 1e-12) && near(im.second.cl, 0.5380645161290302, 1e-12) && near(im.second.ucl[0], 1.7576049165720549, 1e-9) && Number.isNaN(im.second.y[0]));
  const fl = (p, set) => JSON.stringify(C.runRules(p, set).map((v, i) => (v.length ? [i + 1, [...v].sort((a, b) => a - b)] : null)).filter(Boolean));
  check('cc: Western Electric flags on the X̄ chart match Python', fl(xr.main, 'we') === '[[8,[9]],[21,[1,5]],[22,[1,5,6]],[23,[5,6]],[24,[5,6]]]');
  check('cc: Nelson flags on the X̄ chart match Python', fl(xr.main, 'nelson') === '[[21,[1,5]],[22,[1,5,6]],[23,[5,6]],[24,[5,6,8]]]');
  check('cc: Nelson flags on the 125 individuals match Python', fl(im.main, 'nelson') === '[[50,[6]],[54,[2]],[100,[2]],[101,[2]],[102,[2]],[103,[2]],[104,[2]],[105,[2]],[106,[2,6]],[107,[2,5,6]],[108,[2]],[109,[2,5,6]],[110,[2]],[111,[2]],[112,[2]],[116,[6]],[117,[6]],[119,[6]],[120,[6]]]');
  const mk = (y) => ({ name: 't', y, cl: 0, ucl: y.map(() => 3), lcl: y.map(() => -3), sigma: y.map(() => 1) });
  check('cc: rule 3 flags 6 rising points (on the 6th)', fl(mk([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.45]), 'nelson').includes('[6,[3]]'));
  check('cc: rule 4 flags 14 alternating points', fl(mk(Array.from({ length: 14 }, (_, i) => (i % 2 ? 0.5 : -0.5))), 'nelson').includes('[14,[4]]'));
  check('cc: rule 7 flags 15 points hugging the centre line', fl(mk(Array.from({ length: 15 }, (_, i) => (i % 2 ? 0.2 : -0.3))), 'nelson').includes('[15,[4,7]]'));
  check('cc: limits-only set flags rule 1 only', fl(mk([0, 3.5, 2.5, 2.5, -4]), 'limits') === '[[2,[1]],[5,[1]]]');
  const d = C.exampleDefectives(), p = C.attributeChart('p', d.map((r) => r[0]), d.map((r) => r[1]));
  check('cc: p chart centre and limit match, lot 14 out of control', near(p.main.cl, 0.0398) && near(p.main.ucl[0], 0.08126948516680668, 1e-12) && p.main.lcl[0] === 0 && fl(p.main, 'nelson') === '[[14,[1]]]');
  const np = C.attributeChart('np', d.map((r) => r[0]), d.map((r) => r[1]));
  check('cc: np chart = n × p chart', near(np.main.cl, 200 * 0.0398) && near(np.main.ucl[0], 200 * 0.08126948516680668, 1e-12));
  const u = C.exampleDefects(), uu = C.attributeChart('u', u.map((r) => r[0]), u.map((r) => r[1]));
  check('cc: u chart with varying units matches NumPy', near(uu.main.cl, 1.0161290322580645) && [1.88911058, 1.92792852, 2.0853087].every((v, i) => Math.abs(uu.main.ucl[i] - v) < 1e-8) && uu.main.lcl[2] === 0 && fl(uu.main, 'nelson') === '[[21,[1]]]');
  const c = C.attributeChart('c', u.map((r) => r[0]), u.map(() => 1));
  check('cc: c chart matches NumPy', near(c.main.cl, 10.08) && near(c.main.ucl[0], 19.604704719832526, 1e-12) && near(c.main.lcl[0], 0.5552952801674742, 1e-12));
  let threw = false; try { C.attributeChart('np', [1, 2], [100, 120]); } catch { threw = true; }
  check('cc: np chart refuses varying sample sizes', threw);
  const cap = C.capability(x, xs.sigmaWithin, 498.5, 501.5, 0.95, 100);
  check('cc: Cp, Cpk, Pp, Ppk match NumPy', near(cap.Cp, 1.1062334373041234, 1e-12) && near(cap.Cpk, 0.9318320484684001, 1e-12) && near(cap.Pp, 0.9201112681304773, 1e-12) && near(cap.Ppk, 0.7750526596721993, 1e-12));
  check('cc: confidence intervals (chi-square for Cp/Pp, Bissell for Cpk/Ppk) match scipy.stats', near(cap.ci.Cp[0], 0.9530438772791828, 1e-9) && near(cap.ci.Cp[1], 1.25916968002921, 1e-9) && near(cap.ci.Cpk[0], 0.7900839120761075, 1e-9) && near(cap.ci.Pp[0], 0.8056593598092128, 1e-9) && near(cap.ci.Ppk[1], 0.887833099019746, 1e-9));
  check('cc: expected ppm outside the spec (within and overall)', Math.abs(cap.ppmWithin - 2652.0476622865394) < 1e-3 && Math.abs(cap.ppmOverall - 10729.677801485383) < 1e-3 && cap.ppmObserved === 0);
  const one = C.capability(x, im.sigmaWithin, NaN, 501.5);
  check('cc: one-sided spec gives Cpk = CPU and no Cp', Number.isNaN(one.Cp) && near(one.Cpk, one.CPU, 1e-15) && near(one.Cpk, 0.883245783488, 1e-10));
};
