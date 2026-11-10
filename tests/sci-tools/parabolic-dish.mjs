// #1380 Parabolic dish. Checked against the classical results: every ray parallel to the axis of x² = 4ay reflects
// through (0, a), and a ray from the focus leaves parallel to the axis; for a circle mirror of radius R a ray at
// height h crosses the axis at R − R/(2 cos θ) from the vertex, sin θ = h/R (R = 4, h = 3.8 gives −2.4051, i.e.
// 4.4051 below F, past the vertex; computed in Python). A 60 cm dish 6 cm deep has its focus 37.5 cm above the centre.
import { dishY, reflect, parabolaRay, circleRay, axisCrossing, fromFocus, focusFromDish, depthOf } from '../../src/lib/sci/parabolic-dish.ts';

export default async (check) => {
  const near = (x, y, t = 1e-9) => Math.abs(x - y) <= t * Math.max(1, Math.abs(y));
  check('dish: x² = 8y has y = 2 at x = 4', dishY(4, 2) === 2);
  check('reflect: off a flat floor (0, 1) a falling ray bounces straight up', reflect([0, -1], [0, 1]).join() === '0,1' && near(reflect([1, -1], [0, 2])[1], 1));
  const r = parabolaRay(3.8, 2);
  check('parabola: rim ray (x = 3.8, a = 2) crosses the axis at the focus 2', near(axisCrossing(r.hit, r.out), 2));
  const c = circleRay(3.8, 2);
  check('circle: R = 4, h = 3.8 crosses the axis at −2.4051 (R − R/(2 cos θ))', near(axisCrossing(c.hit, c.out), 4 - 4 / (2 * Math.cos(Math.asin(3.8 / 4))), 1e-9) && near(axisCrossing(c.hit, c.out), -2.405126, 1e-6) && circleRay(4, 2) === null);
  check('dish size: 60 wide, 6 deep → focus 37.5; depth back from focus', focusFromDish(60, 6) === 37.5 && near(depthOf(60, 37.5), 6));
  let ok = true;
  for (let i = 0; i < 300; i++) {
    const a = 0.2 + Math.random() * 8, x0 = (Math.random() * 2 - 1) * 10;
    if (Math.abs(x0) < 1e-6) continue;
    const p = parabolaRay(x0, a);
    if (!near(axisCrossing(p.hit, p.out), a, 1e-9)) ok = false;
    const f = fromFocus(x0, a);
    if (Math.abs(f[0]) > 1e-9 || !(f[1] > 0)) ok = false;
    const cr = circleRay(x0 * 0.199, a); // stays within the circle when |x0| < 2a·0.995
    if (cr && Math.abs(cr.hit[0]) > 1e-6) { const y = axisCrossing(cr.hit, cr.out), th = Math.asin(cr.hit[0] / (2 * a)); if (!near(y, 2 * a - a / Math.cos(th), 1e-9) || y > a + 1e-12) ok = false; }
  }
  check('300 random rays: parabola always through the focus; focus rays leave parallel; circle rays cross at or below F, as R − R/(2 cos θ)', ok);
};
