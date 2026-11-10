// #1335 collision lab: checked against hand-worked cases (2 kg at 4 m/s on 1 kg at rest, elastic: 4/3 and 16/3 m/s;
// perfectly inelastic), physical invariants (momentum kept, v2 − v1 = e(u1 − u2), KE kept for e = 1, equal
// elastic balls leave at 90°), and the separately written science-shelf collision maths (phcollision.ts) on
// 1000 random 1D and 2D cases.
import { collide1d, collide2d, questions } from '../../src/lib/sci/collision-lab.ts';
import { collide1D, collide2D } from '../../src/lib/sci/phcollision.ts';
export default async (check) => {
  const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e * Math.max(1, Math.abs(b));
  const r = collide1d(2, 4, 1, 0, 1);
  check('collision-lab: 2 kg at 4 m/s on 1 kg at rest, elastic: 1.333 and 5.333 m/s, 16 J kept', near(r.v1, 4 / 3) && near(r.v2, 16 / 3) && near(r.KE1, 16));
  const s = collide1d(3, 6, 1, 0, 0);
  check('collision-lab: stick together: 3 × 6 / 4 = 4.5 m/s, 54 → 40.5 J', near(s.v1, 4.5) && near(s.v2, 4.5) && near(s.lost, 13.5));
  const eq = collide1d(2, 5, 2, 0, 1);
  check('collision-lab: equal masses elastic: they swap speeds', near(eq.v1, 0) && near(eq.v2, 5));
  let seed = 13; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647); let bad = 0;
  for (let i = 0; i < 1000; i++) {
    const m1 = 0.5 + rnd() * 10, m2 = 0.5 + rnd() * 10, u1 = (rnd() - 0.5) * 20, u2 = (rnd() - 0.5) * 20, e = rnd(), o = collide1d(m1, u1, m2, u2, e), x = collide1D(m1, u1, m2, u2, e);
    if (!(near(o.v1, x.v1, 1e-9) && near(o.v2, x.v2, 1e-9) && near(o.p0, o.p1, 1e-9) && near(o.v2 - o.v1, e * (u1 - u2), 1e-9) && o.lost >= -1e-9)) bad++;
    const off = rnd() * 0.95, u = 0.5 + rnd() * 10, g = collide2d(m1, m2, u, e, off), y = collide2D(m1, [u, 0], m2, [0, 0], -Math.asin(off) * 180 / Math.PI, e);
    if (!(near(g.v1.x, y.v1[0], 1e-9) && near(g.v1.y, y.v1[1], 1e-9) && near(g.v2.x, y.v2[0], 1e-9) && near(g.v2.y, y.v2[1], 1e-9) && near(g.px, m1 * u, 1e-9) && Math.abs(g.py) < 1e-9 && g.lost >= -1e-9)) bad++;
    const q = collide2d(2, 2, u, 1, Math.max(0.05, off));
    if (!near(q.between, 90, 1e-7) || !near(q.KE1, q.KE0, 1e-9)) bad++;
  }
  check('collision-lab: 1000 random cases match phcollision.ts, keep momentum, obey e, never gain energy; equal elastic balls part at 90°', bad === 0);
  const h = collide2d(1, 1, 4, 1, 0.5);
  check('collision-lab: equal balls, half-radius offset: ball 2 at −30°, ball 1 at +60°', near(h.a2, -30) && near(h.a1, 60) && near(h.s2, 4 * Math.cos(Math.PI / 6)));
  let ok = true; for (let i = 0; i < 300; i++) { const qs = questions(rnd); if (qs.length !== 4 || qs.some((x) => !Number.isFinite(x.ans) || x.ans <= 0)) ok = false; }
  check('collision-lab: questions have positive finite answers', ok);
};
