// #1028 banked curve: forces checked against an independent x-y vector sum (gravity, normal and friction must
// add up to m v²/r towards the centre and nothing vertically), the safe range against the friction limit,
// and hand-worked examples.
import { forces, speeds, verdict, questions } from '../../src/lib/sci/banked.ts';
export default async (check) => {
  const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e * Math.max(1, Math.abs(b));
  const s = speeds(100, 0, 0.5);
  check('banked-curve: flat road, r 100 m, μ 0.5: v max = √(μ r g) = 22.136 m/s', near(s.vMax, Math.sqrt(490)) && s.vMin === 0 && s.ideal === 0);
  const t = speeds(100, 30, 0);
  check('banked-curve: 30° bank, r 100 m, no friction: v = √(r g tan 30°) = 23.79 m/s', near(t.ideal, Math.sqrt(980 * Math.tan(Math.PI / 6))) && near(t.vMin, t.ideal) && near(t.vMax, t.ideal));
  const u = speeds(50, 20, 0.4);
  check('banked-curve: 20° bank, r 50 m, μ 0.4: 0 to 23.35 m/s (vMin 0 because μ > tan 20°)', u.vMin === 0 && near(u.vMax, Math.sqrt(490 * (Math.sin(Math.PI / 9) + 0.4 * Math.cos(Math.PI / 9)) / (Math.cos(Math.PI / 9) - 0.4 * Math.sin(Math.PI / 9)))));
  const w = speeds(80, 35, 0.2);
  check('banked-curve: 35°, μ 0.2: slowest safe speed is above 0', w.vMin > 0 && w.vMin < w.ideal && w.ideal < w.vMax);
  check('banked-curve: at v max the friction needed equals μ', near(forces(w.vMax, 80, 35).muNeeded, 0.2, 1e-9) && near(forces(w.vMin, 80, 35).muNeeded, 0.2, 1e-9) && near(forces(w.ideal, 80, 35).f, 0, 1e-9));
  check('banked-curve: verdicts', verdict(w.vMax * 1.01, 80, 35, 0.2) === 'out' && verdict(w.vMin * 0.99, 80, 35, 0.2) === 'in' && verdict(w.ideal, 80, 35, 0.2) === 'safe');
  check('banked-curve: steep bank with high μ never skids out', speeds(50, 60, 0.7).vMax === Infinity);
  let seed = 8; const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647); let bad = 0;
  for (let i = 0; i < 500; i++) {
    const v = r() * 60, R = 10 + r() * 500, a = r() * 60, o = forces(v, R, a), th = a * Math.PI / 180;
    // normal points up and in: (−sinθ toward centre is +x?) take x toward the centre, y up
    const Nx = o.N * Math.sin(th), Ny = o.N * Math.cos(th), fx = o.f * Math.cos(th), fy = -o.f * Math.sin(th);
    if (!near(Nx + fx, v * v / R, 1e-9) || !near(Ny + fy - 9.8, 0, 1e-9) || o.N <= 0) bad++;
  }
  check('banked-curve: 500 random cases: forces add to m v²/r inwards and balance the weight', bad === 0);
  let ok = true; for (let i = 0; i < 300; i++) { const qs = questions(r); if (qs.length !== 4 || qs.some((x) => !Number.isFinite(x.ans) || x.ans <= 0)) ok = false; }
  check('banked-curve: questions have positive finite answers', ok);
};
