// #1049 Electromagnet builder. The coil's field at the end of the nail was checked against the finite-coil formula
// B = μ₀ n I L / (2 √(L² + a²)) evaluated independently in NumPy (50 turns, 1.2 A, L 8 cm, a 5 mm: 0.47032 mT
// without the core); the core factor, clip count and cells are labelled teaching models.
import * as E from '../../src/lib/sci/electromagnet.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-9) => Math.abs(a - b) <= r * Math.abs(b) + 1e-15;

export default async (check) => {
  check('em: current from cells and turns', near(E.current(2, 50), 1.2) && near(E.current(4, 100), 4 / 3) && near(E.current(2, 100), 6 / 7));
  check('em: field at the end matches the finite-coil formula', near(E.endField(50, 1.2, false), 4.703211972066312e-4, 2e-3));
  check('em: iron core multiplies the field by 100', near(E.endField(50, 1.2, true), 100 * E.endField(50, 1.2, false), 1e-12));
  check('em: clip counts (teaching model)', E.clips(E.endField(50, 1.2, true)) === 5 && E.clips(E.endField(50, 1.2, false)) === 0 && E.clips(E.endField(100, 4 / 3, true)) === 13 && E.clips(1) === 20);
  check('em: field doubles with turns × current', near(E.endField(100, 1, false), 2 * E.endField(50, 1, false), 1e-12) && near(E.endField(50, 2, false), 2 * E.endField(50, 1, false), 1e-12));
  check('em: compass with no current points north', E.needle(50, 0, true, 0.085, 0) === 0);
  check('em: reversed current swings the needle the other way', near(E.needle(50, -1.2, true, 0.085, 0), -E.needle(50, 1.2, true, 0.085, 0), 1e-12) && E.needle(50, 1.2, true, 0.085, 0) > 60);
  check('em: inside estimate μ0 n I', near(E.insideEstimate(50, 1.2, false), 1.25663706127e-6 * 625 * 1.2));
  let ok = true;
  for (let s = 1; s <= 40; s++) {
    for (const q of E.questions(seeded(s))) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) ok = false; if (!q.steps.join(' ').includes(String(Number(q.answer.toPrecision(3))))) ok = false; }
  }
  check('em: 40 seeded question sets check out', ok);
};
