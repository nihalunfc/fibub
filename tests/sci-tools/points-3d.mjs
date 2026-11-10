// #1379 3D point plotter. Hand-worked and checked in Python: P(3, −2, 4), Q(−1, 2, 2) are 6 apart, |OP| = √29;
// (1, 2, 2) is 3 from the origin and (2, 3, 6) is 7; the octant order I to VIII is (+++), (−++), (−−+), (+−+),
// then the same with z < 0; R dividing (2, −3, 4), (8, 0, 10) in 1 : 2 is (4, −2, 6). The view keeps lengths in
// the plane of the screen (top view is the xy plane, front view the yz plane).
import { dist, octant, ROMAN, onWhat, section, midpoint, view } from '../../src/lib/sci/points-3d.ts';

export default async (check) => {
  const near = (x, y, t = 1e-9) => Math.abs(x - y) <= t * Math.max(1, Math.abs(y));
  check('3d: PQ = 6, |OP| = √29', dist([3, -2, 4], [-1, 2, 2]) === 6 && near(dist([0, 0, 0], [3, -2, 4]), Math.sqrt(29)));
  check('3d: (1, 2, 2) is 3 and (2, 3, 6) is 7 from the origin', dist([0, 0, 0], [1, 2, 2]) === 3 && dist([0, 0, 0], [2, 3, 6]) === 7);
  const octs = [[1, 1, 1], [-1, 1, 1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [-1, -1, -1], [1, -1, -1]].map(octant);
  check('octants: I to VIII in the school order', octs.join() === '1,2,3,4,5,6,7,8' && ROMAN[octant([3, -2, 4])] === 'IV' && octant([0, 1, 2]) === 0);
  check('on what: plane, axis, origin', onWhat([3, 4, 0]) === 'the xy plane' && onWhat([0, 4, 1]) === 'the yz plane' && onWhat([2, 0, 1]) === 'the zx plane' && onWhat([0, 0, 5]) === 'the z axis' && onWhat([0, 0, 0]) === 'the origin' && onWhat([1, 1, 1]) === '');
  const R = section([2, -3, 4], [8, 0, 10], 1, 2), E = section([1, 1, 1], [3, 3, 3], 3, 1, true);
  check('section: 1 : 2 gives (4, −2, 6); external 3 : 1 gives (4, 4, 4); midpoint', R.join() === '4,-2,6' && E.join() === '4,4,4' && midpoint([1, 2, 3], [3, 6, 9]).join() === '2,4,6');
  const top = view([2, 5, 7], 0, 90), front = view([2, 5, 7], 0, 0);
  check('view: top shows x and y, front shows y and z', near(top[0], 5) && near(top[1], -2) && near(front[0], 5) && near(front[1], 7) && near(front[2], 2));
  let ok = true;
  for (let i = 0; i < 300; i++) {
    const r = () => Math.random() * 12 - 6, A = [r(), r(), r()], B = [r(), r(), r()], yaw = Math.random() * 360, pitch = Math.random() * 180 - 90;
    const a = view(A, yaw, pitch), b = view(B, yaw, pitch);
    if (!near(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]), dist(A, B), 1e-9)) ok = false;
    const m = 0.5 + Math.random() * 4, n = 0.5 + Math.random() * 4, S = section(A, B, m, n);
    if (!near(dist(A, S) / dist(S, B), m / n, 1e-7) || !near(dist(A, S) + dist(S, B), dist(A, B), 1e-9)) ok = false;
  }
  check('300 random cases: the view is a rotation (keeps distances); R lies on PQ with PR : RQ = m : n', ok);
};
