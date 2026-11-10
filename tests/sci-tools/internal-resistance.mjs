// #1411 Internal resistance. Checked by hand (1.5 V, 0.5 Ω, 2.5 Ω: 0.5 A, 1.25 V, 0.625 W load, 0.125 W in r;
// maximum E²/4r = 1.125 W), by scanning R numerically for the power peak, and by fitting exact readings.
import * as C from '../../src/lib/sci/internal-resistance.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-9) => Math.abs(a - b) <= r * Math.max(1e-12, Math.abs(b));

export default async (check) => {
  const s = C.circuit(1.5, 0.5, 2.5);
  check('internal: worked example', near(s.I, 0.5) && near(s.V, 1.25) && near(s.Pload, 0.625) && near(s.Pr, 0.125) && near(s.eff, 5 / 6) && near(s.Pcell, s.Pload + s.Pr));
  const o = C.circuit(6, 1, Infinity);
  check('internal: open circuit reads E', o.I === 0 && o.V === 6);
  const sh = C.circuit(6, 1.5, 0);
  check('internal: short circuit', near(sh.I, 4) && Math.abs(sh.V) < 1e-12);
  let best = 0, bestR = 0;
  for (let R = 0; R <= 10; R += 0.001) { const p = C.circuit(9, 2, R).Pload; if (p > best) { best = p; bestR = R; } }
  check('internal: power peaks at R = r', Math.abs(bestR - 2) < 0.002 && near(best, C.maxPower(9, 2), 1e-6));
  const pts = [2.5, 1, 4, 0.2].map((R) => { const c = C.circuit(1.5, 0.5, R); return { I: c.I, V: c.V }; });
  const f = C.fitLine(pts);
  check('internal: fit gives back E and r', near(f.E, 1.5, 1e-9) && near(f.r, 0.5, 1e-9) && near(f.shortCircuit, 3, 1e-9));
  check('internal: fit needs two currents', C.fitLine([{ I: 1, V: 1 }]) === null && C.fitLine([{ I: 1, V: 1 }, { I: 1, V: 1.2 }]) === null);
  const noisy = C.fitLine([{ I: 0.2, V: 1.41 }, { I: 0.4, V: 1.29 }, { I: 0.6, V: 1.21 }, { I: 0.8, V: 1.09 }]);
  check('internal: least squares on scattered readings (numpy polyfit: slope −0.52, intercept 1.51)', near(noisy.E, 1.51, 1e-9) && near(noisy.r, 0.52, 1e-9));
  let ok = true;
  for (let sd = 1; sd <= 40; sd++) for (const q of C.questions(seeded(sd))) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) ok = false; if (!q.steps.join(' ').includes(String(Number(q.answer.toPrecision(3))))) ok = false; }
  check('internal: 40 seeded question sets check out', ok);
};
