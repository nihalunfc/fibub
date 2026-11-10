// #1413 Galvanometer to ammeter and voltmeter. Checked by hand (G = 50 Ω, Ig = 1 mA: 2 A needs S = 0.0250125 Ω,
// 10 V needs R = 9950 Ω) and by the defining property: at the full range exactly Ig flows through the coil.
import * as G from '../../src/lib/sci/galvanometer.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-9) => Math.abs(a - b) <= r * Math.abs(b);

export default async (check) => {
  const S = G.shunt(50, 1e-3, 2);
  check('galv: shunt by hand', near(S, 0.05 / 1.999));
  check('galv: series by hand', G.seriesR(50, 1e-3, 10) === 9950 && G.voltmeterR(50, 9950) === 10000);
  check('galv: full range drives Ig through the coil', near(G.ammeterReading(50, 1e-3, S, 2).ig, 1e-3) && near(G.voltmeterReading(50, 1e-3, 9950, 10).ig, 1e-3));
  check('galv: half range is half scale', near(G.ammeterReading(50, 1e-3, S, 1).frac, 0.5) && near(G.voltmeterReading(50, 1e-3, 9950, 5).frac, 0.5));
  check('galv: current split adds up', near(G.ammeterReading(20, 5e-3, G.shunt(20, 5e-3, 5), 3.7).ig + G.ammeterReading(20, 5e-3, G.shunt(20, 5e-3, 5), 3.7).is, 3.7));
  check('galv: ammeter resistance = full-scale voltage / range', near(G.ammeterR(50, S), (1e-3 * 50) / 2));
  let ok = true;
  for (let s = 1; s <= 40; s++) for (const q of G.questions(seeded(s))) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) ok = false; if (!q.steps.join(' ').includes(String(Number(q.answer.toPrecision(3))))) ok = false; }
  check('galv: 40 seeded question sets check out', ok);
};
