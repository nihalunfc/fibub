// #1341 hydraulic lift: Pascal's law checked by hand (garage lift: 1200 kg on a 40 cm piston needs 117.6 N on a
// 4 cm piston), work in = work out for random cases, and the stroke count.
import { lift, strokes, pistonArea, PRESETS, questions } from '../../src/lib/sci/hydraulic.ts';
import { seeded } from '../../src/lib/sci/h4quiz.ts';
export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  const g = lift(0.04, 0.4, 1200, 0.2);
  check('hydraulic-lift: garage lift: ratio 100, effort 117.6 N, pressure 93.58 kPa, rises 2 mm', near(g.ratio, 100, 1e-9) && near(g.effort, 117.6, 1e-9) && near(g.p, 117.6 / pistonArea(0.04), 1e-6) && near(g.p, 93583, 1) && near(g.x2, 0.002, 1e-12));
  let ok = true; const r = seeded(11);
  for (let i = 0; i < 500; i++) { const o = lift(0.01 + r() * 0.1, 0.05 + r() * 0.5, r() * 5000, r() * 0.5); if (!near(o.workIn, o.workOut, 1e-9 * Math.max(1, o.workIn)) || !near(o.load / o.a2, o.p, 1e-9 * o.p + 1e-12)) ok = false; }
  check('hydraulic-lift: 500 random cases: work in = work out, same pressure on both pistons', ok);
  check('hydraulic-lift: strokes: 10 cm strokes raise the garage lift 1 m in 1000 strokes', strokes(0.04, 0.4, 0.1, 1) === 1000 && strokes(0.015, 0.05, 0.1, 0.1) === 12);
  let qok = true; for (let i = 0; i < 200; i++) { const q = questions(r); if (q.length !== 4 || q.some((x) => !(x.ans > 0))) qok = false; }
  check('hydraulic-lift: presets and questions', qok && PRESETS.length === 3);
};
