// #1160 Distance and section formula. Checked by hand-worked examples (A(4, −3), B(8, 5) in 3 : 1 gives (7, 3);
// distance (1, 2)–(4, 6) = 5), and on random points: P lies on line AB with AP/PB = m/n, the centroid is 2 : 1
// along each median, and the area matches the shoelace sum.
import { distance, section, midpoint, centroid, triArea, ratioOnXAxis } from '../../src/lib/sci/coord-school.ts';

export default async (check) => {
  const near = (x, y, t = 1e-9) => Math.abs(x - y) <= t * Math.max(1, Math.abs(y));
  check('distance: (1, 2) to (4, 6) is 5', distance([1, 2], [4, 6]) === 5);
  const P = section([4, -3], [8, 5], 3, 1);
  check('section: A(4, −3), B(8, 5), 3 : 1 → (7, 3)', near(P[0], 7) && near(P[1], 3));
  const E = section([1, 1], [4, 4], 2, 1, true);
  check('external: (1, 1), (4, 4), 2 : 1 → (7, 7)', near(E[0], 7) && near(E[1], 7) && Number.isNaN(section([0, 0], [1, 1], 2, 2, true)[0]));
  check('midpoint and centroid', midpoint([2, 3], [6, -1]).join() === '4,1' && centroid([0, 0], [6, 0], [0, 9]).join() === '2,3');
  check('area: (0, 0), (4, 0), (0, 3) is 6; collinear is 0', triArea([0, 0], [4, 0], [0, 3]) === 6 && triArea([1, 1], [2, 2], [5, 5]) === 0);
  check('x axis: (−3, −4), (5, 6) divided in 2 : 3 (k = 2/3)', near(ratioOnXAxis([-3, -4], [5, 6]), 2 / 3) && near(section([-3, -4], [5, 6], 2, 3)[1], 0));
  let ok = true;
  for (let i = 0; i < 300; i++) {
    const R = () => [Math.random() * 20 - 10, Math.random() * 20 - 10];
    const A = R(), B = R(), C = R(), m = 0.5 + Math.random() * 5, n = 0.5 + Math.random() * 5;
    const S = section(A, B, m, n), AB = distance(A, B);
    if (!near(distance(A, S) + distance(S, B), AB, 1e-9) || !near(distance(A, S) / distance(S, B), m / n, 1e-7)) ok = false;
    const G = centroid(A, B, C), Mbc = midpoint(B, C), G2 = section(A, Mbc, 2, 1);
    if (!near(G[0], G2[0], 1e-9) || !near(G[1], G2[1], 1e-9)) ok = false;
    const shoelace = Math.abs((A[0] * B[1] - B[0] * A[1]) + (B[0] * C[1] - C[0] * B[1]) + (C[0] * A[1] - A[0] * C[1])) / 2;
    if (!near(triArea(A, B, C), shoelace, 1e-9)) ok = false;
  }
  check('300 random cases: P on AB with AP : PB = m : n; centroid 2 : 1 on the median; area = shoelace', ok);
};
