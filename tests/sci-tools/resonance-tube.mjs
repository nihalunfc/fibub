// #1355 resonance tube: speed of sound 331.3 m/s at 0 °C and 346.1 m/s at 25 °C; resonances are the loudness
// peaks; the first two lengths give back v and e exactly.
import { soundSpeed, endCorrection, resonances, loudness, fromLengths, FORKS, questions } from '../../src/lib/sci/resonance.ts';
import { seeded } from '../../src/lib/sci/h4quiz.ts';
export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t;
  check('resonance-tube: v at 0 °C 331.3, at 25 °C 346.1 m/s', near(soundSpeed(0), 331.3, 1e-12) && near(soundSpeed(25), 346.13, 0.01));
  const r = resonances(512, 25, 0.04);
  check('resonance-tube: 512 Hz, 25 °C, 4 cm tube: λ 67.6 cm, e 1.2 cm, L₁ 15.70 cm, L₂ 49.50 cm', near(r.lam, 0.67604, 1e-4) && near(r.e, 0.012, 1e-12) && near(r.lengths[0], 0.67604 / 4 - 0.012, 1e-4) && near(r.lengths[1] - r.lengths[0], r.lam / 2, 1e-12));
  check('resonance-tube: loudness is 1 at each resonance and small between', r.lengths.every((L) => near(loudness(512, 25, 0.04, L), 1, 1e-9)) && loudness(512, 25, 0.04, r.lengths[0] + r.lam / 4) < 0.07);
  const b = fromLengths(512, r.lengths[0], r.lengths[1]);
  check('resonance-tube: v and e back from L₁ and L₂', near(b.v, soundSpeed(25), 1e-9) && near(b.e, endCorrection(0.04), 1e-12));
  let ok = true; const g = seeded(31); for (let i = 0; i < 200; i++) { const q = questions(g); if (q.length !== 4 || q.some((x) => !(x.ans > 0))) ok = false; }
  check('resonance-tube: questions', ok && FORKS.length === 7);
};
