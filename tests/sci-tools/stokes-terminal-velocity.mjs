// #1343 terminal velocity: hand-worked v = 2r²(ρ−σ)g/9η, forces balance at terminal speed (weight = buoyancy +
// drag), speed curve checked against stepping m dv/dt = (ρ−σ)Vg − 6πηrv, and η back from the speed.
import { fall, speedAt, distanceAt, timeToFall, etaFromSpeed, BALLS, LIQUIDS, questions } from '../../src/lib/sci/stokes.ts';
import { seeded } from '../../src/lib/sci/h4quiz.ts';
export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const f = fall(1e-3, 7800, 1260, 1.4);
  check('stokes-terminal-velocity: 1 mm steel ball in glycerine: 1.017 cm/s, Re 0.018', near(f.vt, 2e-6 * 6540 * 9.8 / 12.6, 1e-15) && near(f.vt * 100, 1.0173, 1e-4) && near(f.re, 0.0183, 1e-4));
  check('stokes-terminal-velocity: at terminal speed weight = buoyancy + drag', near(f.weight, f.buoy + f.dragAtVt, 1e-15));
  const m = (4 / 3) * Math.PI * 1e-9 * 7800; let v = 0, s = 0; const dt = 1e-6;
  for (let t = 0; t < 0.004; t += dt) { const a = ((7800 - 1260) * (4 / 3) * Math.PI * 1e-9 * 9.8 - 6 * Math.PI * 1.4 * 1e-3 * v) / m; v += a * dt; s += v * dt; }
  check('stokes-terminal-velocity: speed and distance after 4 ms match stepping the equation', near(speedAt(f.vt, f.tau, 0.004), v, 1e-6) && near(distanceAt(f.vt, f.tau, 0.004), s, 1e-8));
  check('stokes-terminal-velocity: time to fall 10 cm ≈ 10 cm ÷ v (tau tiny)', near(timeToFall(f.vt, f.tau, 0.1), 0.1 / f.vt + f.tau, 1e-6));
  check('stokes-terminal-velocity: η back from the speed', near(etaFromSpeed(1e-3, 7800, 1260, f.vt), 1.4, 1e-12));
  check('stokes-terminal-velocity: a light ball in a dense liquid rises (negative v)', fall(1e-3, 1150, 1420, 10).vt < 0);
  let ok = true; const r = seeded(17); for (let i = 0; i < 200; i++) { const q = questions(r); if (q.length !== 4 || q.some((x) => !(x.ans > 0))) ok = false; }
  check('stokes-terminal-velocity: questions', ok && BALLS.length === 4 && LIQUIDS.length === 4);
};
