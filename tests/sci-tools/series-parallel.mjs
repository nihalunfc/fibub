// #1042 Series and parallel circuit builder. Checked against a Python script using exact fractions
// (10 + 10∥15 on 6 V: 16 Ω, 0.375 A, 2.25 V across the box, 0.225 A and 0.15 A; with r = 0.5 Ω: 0.3636 A,
// terminal 5.818 V; 10∥10∥15∥20 = 3.1579 Ω) and the hand-worked 6 Ω ∥ 3 Ω = 2 Ω.
import * as S from '../../src/lib/sci/series-parallel.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-9) => Math.abs(a - b) <= r * Math.abs(b) + 1e-15;

export default async (check) => {
  check('sp: series adds, parallel product over sum', S.series([2, 3, 5]) === 10 && near(S.parallel([6, 3]), 2) && S.parallel([]) === 0 && near(S.parallel([10, 10]), 5));
  const ex = S.solve([{ R: 10, place: 'series' }, { R: 10, place: 'parallel' }, { R: 15, place: 'parallel' }, { R: 20, place: 'out' }], 6);
  check('sp: example 10 + 10∥15 on 6 V', near(ex.Rp, 6) && near(ex.Req, 16) && near(ex.I, 0.375) && near(ex.Vp, 2.25) && near(ex.Vs, 3.75) && near(ex.P, 2.25));
  check('sp: branch currents 0.225 A and 0.15 A add to I', near(ex.parts[1].I, 0.225) && near(ex.parts[2].I, 0.15) && near(ex.parts[1].I + ex.parts[2].I, ex.I) && ex.parts[3].I === 0);
  check('sp: power in parts adds to total', near(ex.parts.reduce((s, p) => s + p.P, 0), ex.P));
  const wr = S.solve([{ R: 10, place: 'series' }, { R: 10, place: 'parallel' }, { R: 15, place: 'parallel' }], 6, 0.5);
  check('sp: internal resistance 0.5 Ω: 0.3636 A, terminal 5.818 V, loop rule holds', near(wr.I, 0.36363636363636365) && near(wr.Vterm, 5.818181818181818) && near(wr.I * 0.5 + wr.I * wr.Req, 6));
  check('sp: four in parallel 3.1579 Ω', near(S.solve([10, 10, 15, 20].map((R) => ({ R, place: 'parallel' })), 6).Req, 3.1578947368421053));
  check('sp: nothing in circuit is a short', S.solve([{ R: 5, place: 'out' }], 6).short && !S.solve([{ R: 5, place: 'out' }], 6, 1).short);
  check('sp: kWh: 1000 W for 5 h a day for 30 days is 150 kWh', S.kWh(1000, 5, 30) === 150 && near(S.kWh(2.25, 5, 30), 0.3375));
  let ok = true;
  for (let s = 1; s <= 40; s++) {
    const qs = S.questions(seeded(s));
    if (qs.length !== 4) ok = false;
    for (const q of qs) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) ok = false; if (!q.steps.join(' ').includes(String(Number(q.answer.toPrecision(3))))) ok = false; }
    const [, b, c] = qs, [r1, r2] = b.text.match(/A ([\d.]+) Ω and a ([\d.]+) Ω/).slice(1).map(Number);
    if (!near(b.answer, (r1 * r2) / (r1 + r2))) ok = false;
    const [rs, V] = [+c.text.match(/^A ([\d.]+) Ω/)[1], +c.text.match(/on a ([\d.]+) V/)[1]];
    if (!near(c.answer, V / (rs + (r1 * r2) / (r1 + r2)))) ok = false;
  }
  check('sp: 40 seeded question sets check out against their own working', ok);
};
