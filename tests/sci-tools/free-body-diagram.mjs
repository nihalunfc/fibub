// #1333 free-body diagram: every body's forces checked to add up to m a in the stated direction (an independent
// x-y vector sum) on 3000 random set-ups, and the textbook results for the Atwood machine, the table-and-pulley,
// the lift and two pushed blocks.
import { solve, net, questions } from '../../src/lib/sci/free-body.ts';
export default async (check) => {
  const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e * Math.max(1, Math.abs(b)), g = 9.8;
  const at = solve('atwood', { m1: 3, m2: 5, F: 0, angle: 0, mu: 0, liftA: 0 });
  check('free-body-diagram: Atwood 3 kg and 5 kg: a = 2g/8 = 2.45 m/s², T = 2·3·5·g/8 = 36.75 N', near(at.a, 2.45) && near(at.T, 36.75));
  const tb = solve('table', { m1: 4, m2: 2, F: 0, angle: 0, mu: 0.25, liftA: 0 });
  check('free-body-diagram: table 4 kg (μ 0.25) pulled by 2 kg: a = (2 − 1)g/6 = 1.633, T = 2(g − a)', near(tb.a, 9.8 / 6) && near(tb.T, 2 * (9.8 - 9.8 / 6)));
  check('free-body-diagram: table with too much friction stays still with T = m_B g', solve('table', { m1: 10, m2: 2, F: 0, angle: 0, mu: 0.5, liftA: 0 }).a === 0 && near(solve('table', { m1: 10, m2: 2, F: 0, angle: 0, mu: 0.5, liftA: 0 }).T, 19.6));
  check('free-body-diagram: lift 60 kg rising and speeding up at 2 m/s²: N = 60 × 11.8 = 708 N', near(solve('lift', { m1: 60, m2: 0, F: 0, angle: 0, mu: 0, liftA: 2 }).N, 708));
  check('free-body-diagram: free fall reads zero', near(solve('lift', { m1: 60, m2: 0, F: 0, angle: 0, mu: 0, liftA: -9.8 }).N, 0));
  const p2 = solve('push2', { m1: 2, m2: 3, F: 20, angle: 0, mu: 0, liftA: 0 });
  check('free-body-diagram: push 20 N on 2 kg + 3 kg: a = 4, contact = 12 N', near(p2.a, 4) && near(p2.contact, 12));
  const fl = solve('floor', { m1: 5, m2: 0, F: 30, angle: 30, mu: 0.2, liftA: 0 });
  check('free-body-diagram: pull 30 N at 30° on 5 kg, μ 0.2: N = 34 N, a = (25.98 − 6.8)/5 = 3.836', near(fl.N, 34) && near(fl.a, (30 * Math.cos(Math.PI / 6) - 6.8) / 5));
  const sl = solve('slope', { m1: 2, m2: 0, F: 0, angle: 30, mu: 0.2, liftA: 0 });
  check('free-body-diagram: slope 30°, μ 0.2: a = g(sin 30° − 0.2 cos 30°) = 3.203', near(sl.a, 9.8 * (0.5 - 0.2 * Math.cos(Math.PI / 6))));
  let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647); let bad = 0;
  for (let i = 0; i < 3000; i++) {
    const s = ['floor', 'slope', 'lift', 'push2', 'table', 'atwood'][i % 6];
    const p = { m1: 1 + Math.floor(rnd() * 20), m2: 1 + Math.floor(rnd() * 20), F: rnd() * 100, angle: rnd() * 60, mu: rnd(), liftA: -9.8 + rnd() * 14.8 };
    const o = solve(s, p); if (o.note) continue;
    for (const b of o.bodies) { const nf = net(b), r = b.aDir * Math.PI / 180; if (!(near(nf.x, b.m * b.a * Math.cos(r), 1e-9) && near(nf.y, b.m * b.a * Math.sin(r), 1e-9))) bad++; if (b.forces.some((x) => !(x.mag >= 0))) bad++; }
    if (o.friction !== undefined && o.friction > p.mu * (o.N ?? p.m1 * g) + 1e-9) bad++;
  }
  check('free-body-diagram: on 3000 random set-ups each body\'s forces add up to m a (x-y sum) and friction stays within μN', bad === 0);
  let ok = true; for (let i = 0; i < 300; i++) { const qs = questions(rnd); if (qs.length !== 4 || qs.some((x) => !Number.isFinite(x.ans) || x.ans <= 0)) ok = false; }
  check('free-body-diagram: questions have positive finite answers', ok);
};
