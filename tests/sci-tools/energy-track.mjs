// #1025 energy track: the energy-based stepping checked against an independent force-based integration
// (s'' = −g sinφ − μ g cosφ sign v, velocity Verlet, 10 µs steps), against v = √(2gΔh), and the loop
// condition (h ≥ 2.5r, leaving angle cos θ = −2(h − r)/3r) against hand-worked values.
import { buildTrack, onTrack, startBall, advance, energies, loop, sAtX, questions } from '../../src/lib/sci/energy-track.ts';
export default async (check) => {
  const near = (a, b, e) => Math.abs(a - b) <= e;
  const tr = buildTrack([6, 1, 3, 0.5, 4]);
  check('energy-track: track passes through its points', near(onTrack(tr, sAtX(tr, 0)).y, 6, 1e-9) && near(onTrack(tr, sAtX(tr, 2.5)).y, 1, 1e-9) && near(onTrack(tr, sAtX(tr, 10)).y, 4, 1e-9));
  const e0 = 9.8 * 6;
  let b = startBall(0); const seen = [];
  for (let i = 0; i < 400; i++) { b = advance(tr, b, e0, 0, 0.01); seen.push(energies(tr, b, e0, 2)); }
  check('energy-track: no friction: KE + PE stays 117.6 J for a 2 kg ball', seen.every((e) => near(e.total, 117.6, 1e-6) && e.heat === 0));
  check('energy-track: speed at the lowest point = √(2gΔh)', seen.some((e) => e.y < 0.6 && near(Math.sqrt(2 * e.ke / 2), Math.sqrt(2 * 9.8 * (6 - e.y)), 1e-6)));
  // independent force-based integration
  const ind = (mu, T) => { let s = 1e-9, v = 0; const h = 1e-5; const acc = (s, v) => { const p = onTrack(tr, s); return -9.8 * p.sin - (Math.abs(v) > 1e-9 ? Math.sign(v) * mu * 9.8 * Math.abs(p.cos) : 0); };
    for (let t = 0; t < T; t += h) { const a = acc(s, v); s += v * h + 0.5 * a * h * h; const a2 = acc(s, v + a * h); v += 0.5 * (a + a2) * h; if (s < 0) { s = -s; v = -v; } if (s > tr.L) { s = 2 * tr.L - s; v = -v; } } return { s, v }; };
  for (const [mu, T] of [[0, 1.2], [0, 2.5], [0, 4], [0.1, 1.5], [0.1, 3]]) {
    let bb = startBall(1e-9); bb = advance(tr, bb, 9.8 * onTrack(tr, 1e-9).y, mu, T, 0.0001);
    const r = ind(mu, T);
    check(`energy-track: μ ${mu}, after ${T} s matches force integration (s ${bb.s.toFixed(3)} vs ${r.s.toFixed(3)} m)`, near(bb.s, r.s, 0.02) && near(bb.v * bb.dir, r.v, 0.03));
  }
  { let bb = startBall(0); for (let i = 0; i < 6000 && !bb.stopped; i++) bb = advance(tr, bb, e0, 0.15, 0.01); const e = energies(tr, bb, e0, 1);
    check(`energy-track: with friction the ball stops and the lost energy is heat (${e.heat.toFixed(2)} J)`, bb.stopped && near(e.total, 58.8, 1e-6) && e.heat > 20); }
  const l1 = loop(6, 2), l2 = loop(4, 2), l3 = loop(1.5, 2);
  check('energy-track: loop r 2 m from 6 m: round, v top √(2g·2) = 6.261 m/s, needs √(gr) = 4.427', l1.result === 'round' && near(l1.vTop, Math.sqrt(39.2), 1e-12) && near(l1.vNeedTop, Math.sqrt(19.6), 1e-12) && l1.hMin === 5);
  check('energy-track: from 4 m it leaves at θ = acos(−2/3) = 131.81°, 3.333 m up', l2.result === 'falls' && near(l2.leaveDeg, 131.8103149, 1e-6) && near(l2.leaveHeight, 10 / 3, 1e-12));
  { const v2 = l2.vLeave ** 2, c = Math.cos(l2.leaveDeg * Math.PI / 180); check('energy-track: where it leaves, the normal force is zero (v²/r = −g cosθ)', near(v2 / 2, -9.8 * c, 1e-9)); }
  check('energy-track: below the centre it just rolls back', l3.result === 'back');
  let seed = 4; const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647); let ok = true;
  for (let i = 0; i < 300; i++) for (const lv of [9, 11]) { const qs = questions(lv, r); if (qs.length !== 4 || qs.some((x) => !Number.isFinite(x.ans) || x.ans <= 0)) ok = false; }
  check('energy-track: questions have positive finite answers', ok);
};
