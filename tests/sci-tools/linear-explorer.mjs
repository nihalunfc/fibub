// #1273 Linear function explorer. Checked against hand-worked lines (y = 2x − 3: zero 3/2, angle 63.43°;
// y = −x + 4: zero 4, angle 135°), Math.atan (as Python math.atan) for 1,000 slopes, and random point pairs.
import { zero, angleDeg, through, slopeText, table } from '../../src/lib/sci/linear-explorer.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  check('linear: zeros', zero(2, -3) === 1.5 && zero(-1, 4) === 4 && Number.isNaN(zero(0, 2)));
  check('linear: angles', near(angleDeg(2), 63.43494882292201) && near(angleDeg(-1), 135) && angleDeg(0) === 0 && near(angleDeg(Math.sqrt(3)), 60));
  let ok = true;
  for (let i = 0; i < 1000; i++) { const m = (Math.random() - 0.5) * 40, t = angleDeg(m); if (!(t >= 0 && t < 180) || !near(Math.tan((t * Math.PI) / 180), m, 1e-7 * Math.max(1, m * m))) ok = false; }
  check('linear: 1,000 random slopes round-trip through tan', ok);
  let ok2 = true;
  for (let i = 0; i < 500; i++) {
    const p = [Math.round(Math.random() * 20 - 10), Math.round(Math.random() * 20 - 10)], q = [p[0] + 1 + Math.round(Math.random() * 9), Math.round(Math.random() * 20 - 10)];
    const L = through(p, q); if (!near(L.m * p[0] + L.c, p[1], 1e-9) || !near(L.m * q[0] + L.c, q[1], 1e-9)) ok2 = false;
  }
  check('linear: line through two points passes through both', ok2 && through([3, 1], [3, 5]).vertical === 3 && through([1, 1], [1, 1]) === null);
  check('linear: slope fractions', slopeText(4, 2) === '2' && slopeText(3, -6) === '−1/2' && slopeText(-6, 4) === '−3/2' && slopeText(5, 0) === 'undefined');
  check('linear: table steps by m', table(2, -3, [0, 1, 2]).map((r) => r[1]).join() === '-3,-1,1');
};
