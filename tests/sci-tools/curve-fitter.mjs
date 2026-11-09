// #976 Curve fitter. Reference values from scipy.optimize.curve_fit (absolute_sigma=True for the weighted fits) and
// scipy.special.gammaincc / scipy.stats.chi2.sf on the tool's made-up example data, written for these tests.
import * as C from '../../src/lib/sci/phcurvefit.ts';
export default async (check) => {
  const rel = (a, b, t) => Math.abs(a / b - 1) <= t;
  const d = '0 111 10.5;1 116 10.8;2 72 8.5;3 71 8.4;4 65 8.1;5 47 6.9;6 40 6.3;7 31 5.6;8 34 5.8;9 23 4.8;10 30 5.5;11 20 4.5;12 17 4.1;13 13 3.6;14 13 3.6;15 17 4.1;16 17 4.1;17 12 3.5;18 17 4.1;19 16 4.0;20 11 3.3'.split(';').map((r) => r.split(' ').map(Number));
  const x = d.map((r) => r[0]), y = d.map((r) => r[1]), s = d.map((r) => r[2]), M = (id) => C.MODELS.find((m) => m.id === id);
  const fit = (id, sig, sc) => C.fitCurve(M(id).formula, x, y, M(id).guess(x, y), sig, sc);
  const dw = fit('decay', s);
  check('curvefit: weighted decay matches scipy', rel(dw.p[0], 109.48827, 1e-6) && rel(dw.p[1], 4.5554733, 1e-6) && rel(dw.p[2], 10.914007, 1e-6) && rel(dw.se[1], 0.51596884, 1e-6) && rel(dw.se[2], 2.0681161, 1e-6));
  check('curvefit: chi-square and p-value match scipy', rel(dw.chi2, 13.756227, 1e-7) && dw.dof === 18 && rel(dw.pValue, 0.74483858, 1e-7));
  const du = fit('decay');
  check('curvefit: unweighted decay matches scipy', rel(du.p[1], 4.8292451, 1e-6) && rel(du.se[0], 4.9224346, 1e-6) && du.chi2 === null);
  const ds = fit('decay', s, true);
  check('curvefit: scaled uncertainties are absolute × √(χ²/dof)', rel(ds.se[1], dw.se[1] * Math.sqrt(dw.redChi2), 1e-9));
  const ln = fit('line', s), q = fit('quad', s), cu = fit('cubic', s), g = fit('gauss', s);
  check('curvefit: line, quadratic, cubic, Gaussian chi-square match scipy', rel(ln.chi2, 112.05026, 1e-7) && rel(ln.pValue, 3.3353421e-15, 1e-6) && rel(q.pValue, 0.19860555, 1e-7) && rel(cu.chi2, 12.374027, 1e-7) && rel(g.chi2, 12.726607, 1e-7));
  check('curvefit: upper incomplete gamma matches scipy', [[1.5, 2.3, 0.20354208167936], [10, 3, 0.99889751186988], [10, 25, 0.00022147663824878], [0.5, 0.01, 0.887537083981715], [50, 70, 0.0051405024585059]].every(([a, xx, v]) => rel(C.gammaQ(a, xx), v, 1e-11)));
  check('curvefit: polyfit is exact on a polynomial', (() => { const xs = [0, 1, 2, 3, 4], c = C.polyfit(xs, xs.map((v) => 1 - 2 * v + 0.5 * v * v), 2); return Math.abs(c[0] - 1) < 1e-10 && Math.abs(c[1] + 2) < 1e-10 && Math.abs(c[2] - 0.5) < 1e-10; })());
  check('curvefit: formula parameters', C.formulaParams('A*exp(-x/tau) + c + pi').join() === 'A,tau,c' && C.formulaParams('a + b*x').join() === 'a,b');
  check('curvefit: sine guess and fit recover a made-up wave', (() => { const xs = [], ys = []; for (let i = 0; i < 40; i++) { xs.push(i * 0.25); ys.push(2 * Math.sin(2 * Math.PI * xs[i] / 3.3 + 0.4) + 1 + 0.1 * Math.sin(i * 7.1)); } const m = M('sine'), r = C.fitCurve(m.formula, xs, ys, m.guess(xs, ys)); return Math.abs(r.p[1] - 3.3) < 0.03 && Math.abs(r.p[0] - 2) < 0.05; })());
  check('curvefit: too few points refused', (() => { try { C.fitCurve('a+b*x+c*x^2', [1, 2, 3], [1, 2, 3], [0, 0, 0]); return false; } catch (e) { return /more than 3 points/.test(e.message); } })());
};
