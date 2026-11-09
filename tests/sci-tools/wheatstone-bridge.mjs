// #1048 Wheatstone and metre bridge. The node-voltage solution was checked against an independent NumPy mesh-current
// solve (P 10, Q 20, R 30, S 50, G 40 Ω, 6 V cell with 1 Ω: I_G = 3.65408 mA, I = 263.094 mA, I_P = 193.666 mA)
// and the balance condition P/Q = R/S; the metre bridge (X 6 Ω, R 10 Ω) balances at 37.5 cm.
import * as B from '../../src/lib/sci/wheatstone.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-9) => Math.abs(a - b) <= r * Math.abs(b) + 1e-15;

export default async (check) => {
  const b = B.bridge(10, 20, 30, 50, 40, 6, 1);
  check('bridge: matches mesh-current solve', near(b.IG, 0.0036540803897685825, 1e-9) && near(b.I, 0.2630937880633374, 1e-9) && near(b.IP, 0.19366626065773446, 1e-9));
  check('bridge: junction rules hold', near(b.I, b.IP + b.IR, 1e-12) && near(b.IP, b.IQ + b.IG, 1e-12) && near(b.IS, b.IR + b.IG, 1e-12));
  check('bridge: loop rule round P, G, R is zero', Math.abs(b.IP * 10 + b.IG * 40 - b.IR * 30) < 1e-12);
  check('bridge: balanced when P/Q = R/S', Math.abs(B.bridge(10, 20, 30, 60, 40, 6, 1).IG) < 1e-15 && Math.abs(B.bridge(5, 5, 7, 7, 100, 2, 0.1).IG) < 1e-15);
  check('metre: X 6, R 10 balances at 37.5 cm', near(B.balanceL(6, 10), 37.5) && Math.abs(B.metre(6, 10, 37.5, 2, 50, 2, 0.5).IG) < 1e-12 && near(B.unknownFrom(10, 37.5), 6));
  check('metre: galvanometer current changes sign through the balance point', B.metre(6, 10, 37.4, 2, 50, 2, 0.5).IG < 0 && B.metre(6, 10, 37.6, 2, 50, 2, 0.5).IG > 0);
  check('metre: swapping gaps gives 100 − l', near(B.balanceL(10, 6), 62.5));
  let ok = true;
  for (let s = 1; s <= 40; s++) {
    const qs = B.questions(seeded(s));
    for (const q of qs) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) ok = false; if (!q.steps.join(' ').includes(String(Number(q.answer.toPrecision(3))))) ok = false; }
    const [Rk, l] = qs[0].text.match(/a ([\d.]+) Ω resistor in the right gap, the balance point is ([\d.]+) cm/).slice(1).map(Number);
    if (!near(qs[0].answer, (Rk * l) / (100 - l), 1e-12) || Math.abs(B.metre(qs[0].answer, Rk, l, 2, 50, 2, 0.5).IG) > 1e-12) ok = false;
  }
  check('bridge: 40 seeded question sets check out', ok);
};
