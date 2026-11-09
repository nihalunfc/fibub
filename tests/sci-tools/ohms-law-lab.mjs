// #1041 Ohm's law lab. Wire resistance, drift speed and the straight-line fit were checked against a NumPy script
// (np.polyfit for the free line, sum(IV)/sum(I²) for the line through zero, corrcoef² for r²); the drift speed for
// 1.5 A in 1 mm² of copper is the textbook 1.1 × 10⁻⁴ m/s.
import * as O from '../../src/lib/sci/ohms-lab.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-6) => Math.abs(a - b) <= r * Math.abs(b);

export default async (check) => {
  check('ohm: nichrome 1 m, 0.3 mm is 15.56 Ω', near(O.wireR(1.1e-6, 1, 0.0003), 15.5618166579, 1e-9));
  check('ohm: copper 1 m of 1 mm² is 0.017 Ω', near(O.wireR(1.7e-8, 1, Math.sqrt(4e-6 / Math.PI)), 0.017, 1e-9));
  check('ohm: R doubles with length, quarters with doubled diameter', near(O.wireR(1e-6, 2, 1e-3) / O.wireR(1e-6, 1, 1e-3), 2) && near(O.wireR(1e-6, 1, 2e-3) / O.wireR(1e-6, 1, 1e-3), 0.25));
  check('ohm: drift speed 1.5 A in 1 mm² copper = 1.1e-4 m/s', near(O.drift(1.5, O.N_COPPER, 1e-6), 1.10144277785e-4, 1e-9));
  check('ohm: resistor current V/R', O.current('resistor', 6, 10) === 0.6 && O.current('wire', 0, 5) === 0);
  check('ohm: bulb is 0.5 A at 6 V, 2 Ω cold, R grows with V', near(O.bulbI(6), 0.5) && O.bulbR(0) === 2 && near(O.bulbI(2), 0.3251, 2e-4) && near(O.bulbI(12), 0.6182, 2e-4) && O.bulbI(0) === 0);
  check('ohm: bulb current still rises with voltage', [...Array(24)].every((_, k) => O.bulbI(0.5 * (k + 1)) > O.bulbI(0.5 * k)));
  const f = O.fit([[0.1, 1], [0.2, 2.1], [0.31, 3], [0.4, 4.1], [0.52, 5]]);
  check('ohm: fit matches numpy polyfit, line through zero and r²', near(f.m, 9.5901034, 1e-7) && near(f.c, 0.10542836, 1e-6) && near(f.k, 9.869904596704249, 1e-12) && near(f.r2, 0.995025909824016, 1e-9));
  check('ohm: fit needs two different currents', O.fit([[0.1, 1]]) === null && O.fit([[0.1, 1], [0.1, 2]]) === null);
  check('ohm: meter rounding', near(O.meter(0.6049, 0.01), 0.6) && near(O.meter(6.04, 0.1), 6.0));
  // Practice questions: fresh numbers, answers agree with the worked steps.
  let ok = true;
  for (let s = 1; s <= 40; s++) {
    const qs = O.questions(seeded(s));
    if (qs.length !== 4) ok = false;
    for (const q of qs) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.2), q)) ok = false; if (!q.steps.join(' ').includes(String(Number(q.answer.toPrecision(3))))) ok = false; }
    const [a, b, c, d] = qs;
    if (!near(c.answer, O.wireR(1.1e-6, +c.text.match(/is ([\d.]+) m long/)[1], +c.text.match(/([\d.]+) mm thick/)[1] / 1000))) ok = false;
    const v = +a.text.match(/a ([\d.]+) V battery/)[1], r = +a.text.match(/A ([\d.]+) Ω/)[1]; if (!near(a.answer, v / r)) ok = false;
    void b; void d;
  }
  check('ohm: 40 seeded question sets check out against their own working', ok);
  check('ohm: different seeds give different questions', O.questions(seeded(1)).map((q) => q.text).join() !== O.questions(seeded(2)).map((q) => q.text).join());
  check('quiz: answer parsing', isRight('', { answer: 1, tol: 0.01 }) === null && isRight('abc', { answer: 1, tol: 0.01 }) === null && isRight('1,000', { answer: 1000, tol: 0.01 }) === true && isRight('−2', { answer: -2, tol: 0.01 }) === true);
};
