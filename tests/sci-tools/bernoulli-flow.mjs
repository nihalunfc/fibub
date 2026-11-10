// #1342 Bernoulli and Venturi: continuity and Bernoulli by hand; the Venturi meter run backwards returns the flow;
// Torricelli range 2√(hy) from the projectile time; draining level checked by stepping dh/dt = −(a/A)√(2gh).
import { venturi, flowFromDrop, torricelli, levelAfter, FLUIDS, questions } from '../../src/lib/sci/bernoulli.ts';
import { seeded } from '../../src/lib/sci/h4quiz.ts';
export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const v = venturi(0.1, 0.05, 2, 1000);
  check('bernoulli-flow: 10 cm to 5 cm at 2 m/s: 8 m/s, drop 30 kPa, 3.06 m of water', near(v.v2, 8, 1e-12) && near(v.dp, 30000, 1e-9) && near(v.hWater, 3.0612, 1e-4) && near(v.q, 0.015708, 1e-6));
  check('bernoulli-flow: Venturi meter returns the flow from the drop', near(flowFromDrop(0.1, 0.05, v.dp, 1000), v.q, 1e-12));
  const t = torricelli(0.8, 0.45, 1, 0.01);
  check('bernoulli-flow: Torricelli 0.8 m: 3.96 m/s, lands 1.2 m away', near(t.v, Math.sqrt(15.68), 1e-12) && near(t.range, 1.2, 1e-12) && near(t.rangeCheck, 1.2, 1e-12));
  check('bernoulli-flow: drain time (A/a)√(2h/g) = 4040.6 s for 1 m tank, 1 cm hole, 0.8 m', near(t.drain, 10000 * Math.sqrt(1.6 / 9.8), 1e-6) && near(levelAfter(0.8, t.drain, 1, 0.01), 0, 1e-12));
  let h = 0.8; const dt = 0.01; for (let s = 0; s < 1000 / dt; s++) h -= dt * 1e-4 * Math.sqrt(2 * 9.8 * Math.max(0, h));
  check('bernoulli-flow: level after 1000 s matches stepping the flow', near(levelAfter(0.8, 1000, 1, 0.01), h, 1e-5));
  let ok = true; const r = seeded(13); for (let i = 0; i < 200; i++) { const q = questions(r); if (q.length !== 4 || q.some((x) => !(x.ans > 0))) ok = false; }
  check('bernoulli-flow: questions', ok && FLUIDS.length === 2);
};
