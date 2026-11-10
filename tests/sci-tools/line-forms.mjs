// #1378 Line forms. Hand-worked and checked in Python: A(−4, −1), B(2, 3) gives 2x − 3y + 5 = 0, slope 2/3,
// inclination 33.69°, normal form p = 5/√13 = 1.3868 at ω = 123.69°; with x + 2y − 6 = 0 the angle is
// atan(7/4) = 60.255° and they meet at (8/7, 17/7); P(5, −5) is 30/√13 = 8.3205 away with foot (5/13, 25/13).
import { through, slope, yIntercept, xIntercept, inclination, normalForm, angleBetween, parallel, perpendicular, distance, foot, meet } from '../../src/lib/sci/line-forms.ts';

export default async (check) => {
  const near = (x, y, t = 1e-9) => Math.abs(x - y) <= t * Math.max(1, Math.abs(y));
  const l = through([-4, -1], [2, 3]);
  check('lines: A(−4, −1), B(2, 3) is 2x − 3y + 5 = 0', l.a === 2 && l.b === -3 && l.c === 5);
  check('lines: slope 2/3, intercepts −5/2 and 5/3, inclination 33.69°', near(slope(l), 2 / 3) && near(xIntercept(l), -2.5) && near(yIntercept(l), 5 / 3) && near(inclination(l), 33.690067525979785));
  const nf = normalForm(l);
  check('lines: normal form p = 1.3868, ω = 123.69°', near(nf.p, 5 / Math.sqrt(13)) && near(nf.omega, 123.69006752597979));
  const v = through([3, -2], [3, 5]), h = through([-1, 4], [6, 4]);
  check('lines: vertical x = 3 and horizontal y = 4', v.a === 1 && v.b === 0 && v.c === -3 && slope(v) === Infinity && inclination(v) === 90 && h.a === 0 && h.b === 1 && h.c === -4 && Number.isNaN(xIntercept(h)));
  check('lines: same point gives no line; signs normalised', through([1, 1], [1, 1]) === null && through([2, 3], [-4, -1]).a === 2);
  const m = through([-6, 6], [6, 0]);
  check('angle: x + 2y − 6 = 0 against AB is 60.255°', m.a === 1 && m.b === 2 && m.c === -6 && near(angleBetween(l, m), 60.25511870305778));
  const M = meet(l, m);
  check('meet: (8/7, 17/7)', near(M[0], 8 / 7) && near(M[1], 17 / 7));
  check('parallel and perpendicular', parallel(l, through([0, 0], [3, 2])) && perpendicular(l, through([0, 0], [2, -3])) && meet(l, through([0, 0], [3, 2])) === null && near(angleBetween(v, h), 90));
  const F = foot(l, [5, -5]);
  check('distance: P(5, −5) is 8.3205 from AB, foot (5/13, 25/13)', near(distance(l, [5, -5]), 30 / Math.sqrt(13)) && near(F[0], 5 / 13) && near(F[1], 25 / 13));
  check('distance: 3x + 4y − 10 = 0 from (0, 0) is 2; normal form through the origin', near(distance({ a: 3, b: 4, c: -10 }, [0, 0]), 2) && normalForm(through([0, 0], [1, 1])).p === 0);
  let ok = true;
  for (let i = 0; i < 300; i++) {
    const R = () => [Math.round(Math.random() * 20 - 10), Math.round(Math.random() * 20 - 10)];
    const P = R(), Q = R(), X = R(); const L = through(P, Q); if (!L) continue;
    if (Math.abs(L.a * P[0] + L.b * P[1] + L.c) > 1e-9 || Math.abs(L.a * Q[0] + L.b * Q[1] + L.c) > 1e-9) ok = false;
    const f = foot(L, X), dd = Math.hypot(X[0] - f[0], X[1] - f[1]);
    if (!near(dd, distance(L, X), 1e-9) || Math.abs(L.a * f[0] + L.b * f[1] + L.c) > 1e-9) ok = false;
    const n = normalForm(L), w = n.omega * Math.PI / 180;
    if (Math.abs(P[0] * Math.cos(w) + P[1] * Math.sin(w) - n.p) > 1e-9 || n.p < 0) ok = false;
    if (L.b !== 0 && !near(Math.tan(inclination(L) * Math.PI / 180), slope(L), 1e-9)) ok = false;
  }
  check('300 random lines: both points on it; foot on the line at the given distance; normal form holds; tan θ = m', ok);
};
