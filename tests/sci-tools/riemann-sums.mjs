// #1182 Riemann sums to integral. Left, right, midpoint and trapezium sums checked against NumPy
// (sums on numpy.linspace grids, numpy.trapezoid); integrals, crossings and areas between curves against
// scipy.integrate.quad and scipy.optimize.brentq.
import * as SI from '../../src/lib/sci/school-integral.ts';
import * as SC from '../../src/lib/sci/school-calculus.ts';
const near = (a, b, t = 1e-9) => Number.isFinite(a) && Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
const all = (f, a, b, n) => ['left', 'right', 'mid', 'trap'].map((m) => SI.riemann(f, a, b, n, m).sum);
export default async (check) => {
  const sq = (x) => x * x;
  check('riemann: x² on [0, 2], n = 4: 1.75, 3.75, 2.625, 2.75 (NumPy)', all(sq, 0, 2, 4).every((v, i) => near(v, [1.75, 3.75, 2.625, 2.75][i], 1e-12)));
  check('riemann: x² on [0, 2], n = 100 (NumPy)', all(sq, 0, 2, 100).every((v, i) => near(v, [2.6268, 2.7068, 2.6666, 2.6668][i], 1e-10)));
  check('riemann: sin on [0, π], n = 7 (NumPy)', all(Math.sin, 0, Math.PI, 7).every((v, i) => near(v, [1.9663166787658921, 1.9663166787658921, 2.016884175944257, 1.9663166787658923][i], 1e-12)));
  check('riemann: eˣ on [−1, 1.5], n = 9 (NumPy)', all(Math.exp, -1, 1.5, 9).every((v, i) => near(v, [3.568865190809394, 4.711590087800123, 4.100613351403962, 4.140227639304758][i], 1e-12)));
  const r = SI.riemann(sq, 0, 2, 4, 'left');
  check('riemann: strips for the picture (4 strips of width 0.5, left heights)', r.strips.length === 4 && r.dx === 0.5 && r.strips[3].x0 === 1.5 && r.strips[3].h0 === 2.25);
  check("riemann: Simpson's rule for sin x / x on [0.5, 3] = 1.3555451 (scipy quad)", near(SI.simpson((x) => Math.sin(x) / x, 0.5, 3, 2000), 1.3555451099564015, 1e-10));
  check('riemann: preset antiderivatives give exact integrals (x² → 8/3, sin → 2 on [0, π])', near(SC.preset('x2').F(2) - SC.preset('x2').F(0), 8 / 3, 1e-14) && near(SC.preset('sin').F(Math.PI) - SC.preset('sin').F(0), 2, 1e-14));
  const g = (x) => 4 - x * x, h = (x) => x, c = SI.crossings(g, h, -10, 10, 4000);
  check('riemann: 4 − x² and x cross at −2.5615528 and 1.5615528 (brentq)', c.length === 2 && near(c[0], -2.5615528128088303, 1e-12) && near(c[1], 1.5615528128088303, 1e-12));
  check('riemann: area between 4 − x² and x = 11.6821326 (scipy quad)', near(SI.areaBetween(g, h, c[0], c[1]).area, 11.682132605916705, 1e-10));
  const sc = SI.areaBetween(Math.sin, Math.cos, 0, 2 * Math.PI);
  check('riemann: |sin − cos| on [0, 2π] = 4√2, signed 0, three pieces (scipy quad)', near(sc.area, 5.6568542494923815, 1e-10) && Math.abs(sc.signed) < 1e-10 && sc.pieces.length === 3 && sc.pieces[0].top === 'g');
  const cu = SI.areaBetween((x) => x ** 3 - x, () => 0, -1, 1);
  check('riemann: x³ − x and the axis on [−1, 1] = 0.5 in two pieces (scipy quad)', near(cu.area, 0.5, 1e-10) && cu.pieces.length === 2);
  check('riemann: midpoint error is about half the trapezium error, opposite sign', (() => { const e1 = SI.riemann(sq, 0, 2, 16, 'mid').sum - 8 / 3, e2 = SI.riemann(sq, 0, 2, 16, 'trap').sum - 8 / 3; return near(e2 / e1, -2, 1e-9); })());
};
