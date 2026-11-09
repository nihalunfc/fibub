// #1184 maxima and minima. Critical points, values and f″ checked against sympy 1.14 (solveset of f′ = 0,
// diff); the optimisation stories against sympy's solve of V′ = 0, A′ = 0 and S′ = 0.
import * as E from '../../src/lib/sci/school-extrema.ts';
import { readFn } from '../../src/lib/sci/school-calculus.ts';
const near = (a, b, t = 1e-8) => Number.isFinite(a) && Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
const SYM = {
  cubic: [[-1, 2, -6], [1, -2, 6]], quartic: [[-1.4142135623730951, -4, 16], [0, 0, -8], [1.4142135623730951, -4, 16]],
  sin: [[0.7853981633974483, 1.4142135623730951, -1.4142135623730951], [3.9269908169872414, -1.4142135623730951, 1.4142135623730951]],
  xex: [[1, 0.36787944117144233, -0.36787944117144233]], recip: [[-1, -2, -2], [1, 2, 2]],
};
export default async (check) => {
  for (const [id, pts] of Object.entries(SYM)) {
    const c = E.CURVES.find((k) => k.id === id), cp = E.criticalPoints(c.f, c.range[0], c.range[1], c.d, c.d2);
    check(`extrema: ${id} critical points, values and f″ match sympy`, cp.length === pts.length && cp.every((p, i) => near(p.x, pts[i][0]) && near(p.y, pts[i][1]) && near(p.d2, pts[i][2])));
    check(`extrema: ${id} both tests agree with the sign of f″`, cp.every((p) => p.first === (p.d2 < 0 ? 'max' : 'min') && p.second === p.first));
  }
  const fl = E.CURVES.find((k) => k.id === 'flat'), cf = E.criticalPoints(fl.f, -2, 2, fl.d, fl.d2);
  check('extrema: x³ has a stationary point at 0 that is neither', cf.length === 1 && Math.abs(cf[0].x) < 1e-9 && cf[0].first === 'neither' && cf[0].second === 'unknown');
  const q4 = E.CURVES.find((k) => k.id === 'quart4'), c4 = E.criticalPoints(q4.f, -1.6, 1.6, q4.d, q4.d2);
  check('extrema: x⁴ at 0: first test min, second test fails', c4.length === 1 && Math.abs(c4[0].x) < 1e-6 && c4[0].first === 'min' && c4[0].second === 'unknown');
  const g = readFn('x^3 - 6x^2 + 9x + 1'), cg = E.criticalPoints(g, -1, 5);
  check('extrema: typed x³ − 6x² + 9x + 1: max (1, 5), min (3, 1) numerically (sympy)', cg.length === 2 && near(cg[0].x, 1, 1e-7) && near(cg[0].y, 5, 1e-9) && cg[0].first === 'max' && near(cg[1].x, 3, 1e-7) && near(cg[1].y, 1, 1e-9) && cg[1].second === 'min');
  const ab = E.absolute(g, -1, 5, cg);
  check('extrema: absolute max 21 at 5 and min −15 at −1 (ends beat the turning points)', ab.max.x === 5 && near(ab.max.y, 21) && ab.min.x === -1 && near(ab.min.y, -15) && ab.candidates.length === 4);
  check('extrema: open box s/6, 2s³/27; V(5) = 2000 for s = 30 (sympy)', E.box.best(30) === 5 && near(E.box.bestV(30), 2000) && near(E.box.V(30, 5), 2000));
  check('extrema: fence L/4, L²/8 (sympy)', E.fence.best(100) === 25 && near(E.fence.bestA(100), 1250) && near(E.fence.A(100, 25), 1250));
  check('extrema: can V = 500: r = 4.30127, S = 348.734, h = 2r (sympy)', near(E.can.best(500), 4.301270069140498, 1e-12) && near(E.can.S(500, E.can.best(500)), 348.7342054528879, 1e-12) && near(E.can.h(500, E.can.best(500)), 8.602540138280997, 1e-12));
  const nb = E.criticalPoints(Math.exp, 0, 2);
  check('extrema: eˣ has no critical points', nb.length === 0);
};
