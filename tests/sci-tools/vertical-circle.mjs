// #1338 circular motion: checked against v²/r and m v²/r by hand, the loop conditions u = √(5gr) and v_top = √(gr),
// and against an independent RK4 integration of the string pendulum θ'' = −(g/r) sin θ: the speed and tension
// along the way, and the angle where the string goes slack (T = 0), must match the formulas.
import { whirl, at, loop, questions } from '../../src/lib/sci/vertical-circle.ts';
export default async (check) => {
  const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e * Math.max(1, Math.abs(b)), g = 9.8;
  const h = whirl(0.5, 1, 5);
  check('vertical-circle: 0.5 kg at 5 m/s on 1 m: a = 25 m/s², F = 12.5 N, T = 2π/5 s', near(h.a, 25) && near(h.F, 12.5) && near(h.T, 2 * Math.PI / 5));
  const l = loop(8, 1, 0.5);
  check('vertical-circle: u = 8 m/s on 1 m loops: least u √49 = 7, v_top √24.8, T_top 7.5 N, T_bottom 36.9 N', l.kind === 'loops' && near(l.uMin, 7) && near(l.vTop, Math.sqrt(24.8)) && near(l.Ttop, 7.5) && near(l.Tbottom, 36.9));
  check('vertical-circle: exactly √(5gr) gives zero tension at the top', near(at(Math.sqrt(5 * g * 1.5), 1.5, 1, 180).T, 0, 1e-9) && loop(Math.sqrt(5 * g * 1.5), 1.5, 1).kind === 'loops');
  check('vertical-circle: u² ≤ 2gr only swings', loop(4, 1, 1).kind === 'swings' && near(loop(4, 1, 1).slack, Math.acos(1 - 16 / 19.6) * 180 / Math.PI));
  let bad = 0;
  for (const [u, r] of [[6, 1], [5.5, 0.8], [9, 2], [6.5, 1]]) {
    const L = loop(u, r, 1); if (L.kind !== 'slack') { bad++; continue; }
    let th = 0, om = u / r; const dt = 1e-5, fdd = (t) => -(g / r) * Math.sin(t);
    while (true) {
      const k1t = om, k1w = fdd(th), k2t = om + 0.5 * dt * k1w, k2w = fdd(th + 0.5 * dt * k1t), k3t = om + 0.5 * dt * k2w, k3w = fdd(th + 0.5 * dt * k2t), k4t = om + dt * k3w, k4w = fdd(th + dt * k3t);
      th += dt / 6 * (k1t + 2 * k2t + 2 * k3t + k4t); om += dt / 6 * (k1w + 2 * k2w + 2 * k3w + k4w);
      const T = om * om * r + g * Math.cos(th);
      if (Math.abs(th - Math.PI / 2) < 1e-4) { const a = at(u, r, 1, 90); if (!near(om * r, a.v, 1e-4)) bad++; }
      if (T < 0) { if (Math.abs(th * 180 / Math.PI - L.slack) > 0.01) bad++; break; }
      if (th > Math.PI) { bad++; break; }
    }
  }
  check('vertical-circle: slack angles and speeds match an independent RK4 pendulum integration', bad === 0);
  let seed = 23; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647); let ok = true;
  for (let i = 0; i < 300; i++) { const qs = questions(rnd); if (qs.length !== 4 || qs.some((x) => !Number.isFinite(x.ans) || x.ans <= 0)) ok = false; }
  check('vertical-circle: questions have positive finite answers', ok);
};
