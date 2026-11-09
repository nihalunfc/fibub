// #905 collision calculator: checked against SymPy solutions of momentum conservation plus Newton's restitution law,
// in 1D and in 2D with the impulse along the line of centres.
import { collide1D, collide2D, fromMeasured, angleOf } from '../../src/lib/sci/phcollision.ts';
export default async (check) => {
  const near = (a, b, t = 1e-12) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const a = collide1D(2, 3, 1, -1, 0.6);
  check('collision: 1D e = 0.6 gives 0.86667 and 3.26667 (SymPy)', near(a.v1, 0.8666666666666666) && near(a.v2, 3.2666666666666666));
  check('collision: 1D momentum kept, energy lost (1 − e²)·μ·Δu²/2 = 3.41333 J', near(a.P1, a.P0) && near(a.lost, (1 - 0.36) * (2 / 3) * 16 / 2));
  { const b = collide1D(1, 5, 1, 0, 1); check('collision: equal masses, elastic: they swap speeds', near(b.v1, 0) && near(b.v2, 5) && near(b.lost, 0)); }
  { const c = collide1D(3, 4, 1, 0, 0); check('collision: perfectly inelastic: both 3 m/s, ¼ of the energy lost', near(c.v1, 3) && near(c.v2, 3) && near(c.lost / c.K0, 0.25)); }
  { const d = collide1D(1, 2, 1e9, 0, 0.8); check('collision: ball on a wall bounces back at e × speed', near(d.v1, -1.6, 1e-8)); }
  const s = collide2D(0.17, [2, 0], 0.17, [0, 0], 30, 1);
  check('collision: 2D equal balls, elastic, 30°: (0.5, −0.866) and (1.5, 0.866)', near(s.v1[0], 0.5) && near(s.v1[1], -0.8660254037844398) && near(s.v2[0], 1.5) && near(s.v2[1], 0.8660254037844398));
  check('collision: 2D equal elastic balls leave at 90° to each other', near(Math.abs(angleOf(s.v2) - angleOf(s.v1)), 90, 1e-10));
  const t = collide2D(2, [3, 1], 1, [-1, 0.5], 20, 0.6);
  check('collision: 2D e = 0.6 at 20° vs SymPy', near(t.v1[0], 1.0305142460482177) && near(t.v1[1], 0.2831658087502217) && near(t.v2[0], 2.9389715079035645) && near(t.v2[1], 1.9336683824995566));
  check('collision: 2D impulse 4.19177 N·s along the line of centres, momentum kept', near(Math.hypot(t.J[0], t.J[1]), 4.1917659251269) && near(t.P1[0], t.P0[0]) && near(t.P1[1], t.P0[1]));
  { const k = collide2D(2, [3, 1], 1, [-1, 0.5], 20, 0, true); check('collision: 2D sticking together moves at P/M', near(k.v1[0], 5 / 3) && near(k.v1[1], 2.5 / 3) && near(k.v2[0], k.v1[0])); }
  const m = fromMeasured(0.5, 0.8, 0.5, 0, 0.1, 0.62);
  check('collision: e from measured speeds (0.62 − 0.1)/0.8 = 0.65, momentum change −10 %', near(m.e, 0.65) && near(m.dPrel, -0.1));
};
