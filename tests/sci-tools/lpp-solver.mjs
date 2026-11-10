// #1475 LPP graphical solver. Optimum, status (optimal, unbounded, infeasible) checked against scipy linprog
// (HiGHS) for seven problems; corner points by hand.
import * as L from '../../src/lib/sci/school-r-lpp.ts';
const K = (a, b, op, c) => ({ a, b, op, c });
const furn = [K(2, 1, '<=', 20), K(1, 2, '<=', 16)], diet = [K(2, 1, '>=', 8), K(1, 3, '>=', 9)], mix = [K(1, 1, '<=', 50), K(1, 2, '>=', 40), K(3, 1, '<=', 90)];
const bestPts = (r) => r.corners.filter((c) => c.best).map((c) => c.p.join(',')).sort().join(' ');
const pts = (r) => r.corners.map((c) => c.p.join(',')).sort().join(' ');
export default async (check) => {
  const r1 = L.solve(furn, 50, 30, 'max');
  check('lpp: furniture max Z = 520 at (8, 4) (scipy linprog)', r1.status === 'optimal' && r1.best === 520 && bestPts(r1) === '8,4' && r1.bounded);
  check('lpp: furniture corners (0,0) (10,0) (8,4) (0,8)', pts(r1) === '0,0 0,8 10,0 8,4');
  const r2 = L.solve(diet, 4, 6, 'min');
  check('lpp: diet min Z = 24 at (3, 2), region unbounded (scipy linprog)', r2.status === 'optimal' && r2.best === 24 && bestPts(r2) === '3,2' && !r2.bounded && pts(r2) === '0,8 3,2 9,0');
  check('lpp: diet maximise has no maximum (scipy: unbounded)', L.solve(diet, 4, 6, 'max').status === 'unbounded');
  const r3 = L.solve(furn, 100, 50, 'max');
  check('lpp: Z = 100x + 50y ties at (10, 0) and (8, 4): Z = 1000 on the whole edge (scipy best 1000)', r3.best === 1000 && r3.many && bestPts(r3) === '10,0 8,4');
  check('lpp: x + y ≤ 2 and x + y ≥ 5 is infeasible (scipy)', L.solve([K(1, 1, '<=', 2), K(1, 1, '>=', 5)], 1, 1, 'max').status === 'infeasible');
  const r4 = L.solve(mix, 3, 2, 'min'), r5 = L.solve(mix, 3, 2, 'max');
  check('lpp: three constraints min Z = 40 at (0, 20), max Z = 120 at (20, 30) (scipy)', r4.best === 40 && bestPts(r4) === '0,20' && r5.best === 120 && bestPts(r5) === '20,30');
  check('lpp: minimising x + y on x + y ≥ 4 (unbounded region) has min 4 on an edge', (() => { const r = L.solve([K(1, 1, '>=', 4)], 1, 1, 'min'); return r.status === 'optimal' && r.best === 4 && r.many; })());
};
