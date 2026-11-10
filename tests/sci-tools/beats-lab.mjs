// #1354 beats lab: the sum of two sines equals 2 cos(πΔf t) sin(2π f̄ t) (product formula), the envelope bounds the
// sum, and the fork puzzle's wax test picks the right candidate.
import { sum, envelope, beats, forkPuzzle, solvePuzzle, questions } from '../../src/lib/sci/beats.ts';
import { seeded } from '../../src/lib/sci/h4quiz.ts';
export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  let ok = true, env = true;
  for (let i = 0; i < 2000; i++) { const t = i * 3.7e-4, s = sum(256, 260, t); if (!near(s, 2 * Math.cos(Math.PI * -4 * t) * Math.sin(2 * Math.PI * 258 * t), 1e-9)) ok = false; if (Math.abs(sum(256, 260, t, 0.6)) > envelope(256, 260, t, 0.6) + 1e-9) env = false; }
  check('beats-lab: sin + sin = 2 cos(πΔf t) sin(2π f̄ t)', ok);
  check('beats-lab: the sum never leaves its envelope (unequal amplitudes too)', env && near(envelope(256, 260, 0), 2, 1e-12) && near(envelope(256, 260, 0.125), 0, 1e-6));
  const b = beats(256, 260);
  check('beats-lab: 256 and 260 Hz: 4 beats/s, 0.25 s, 258 Hz', b.fb === 4 && b.period === 0.25 && b.mean === 258);
  let pz = true;
  for (const f0 of [256, 320, 512]) for (const d of [-6, -5, -4, -3, -2, 2, 3, 4, 5, 6]) { const p = forkPuzzle(f0, f0 + d, 1), s = solvePuzzle(f0, p.before, p.after); if (s.pick !== f0 + d) pz = false; }
  check('beats-lab: wax test picks the right fork in every case (1 Hz of wax, 2 to 6 beats)', pz);
  let q = true; const r = seeded(29); for (let i = 0; i < 200; i++) { const qs = questions(r); if (qs.length !== 4 || qs.some((x) => !(x.ans > 0))) q = false; }
  check('beats-lab: questions', q);
};
