// #1409 Biot–Savart field builder and Ampère's law. Checked against an independent numpy Biot–Savart sum with
// 200 000 elements (5 A loop, R = 10 cm, 7 cm along the axis: 1.72731073e-5 T; 20 cm wire, P 5 cm away and 3 cm up:
// 1.74707908e-5 T into the page), the loop formula summed over 200 turns for the solenoid (within 0.5%), and
// Ampère's law (∮B·dl = μ₀ I_enclosed) by numerical integration.
import * as B from '../../src/lib/sci/biot-savart.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-6) => Math.abs(a - b) <= r * Math.abs(b);

export default async (check) => {
  check('biot: loop off-centre matches numpy', near(B.loopAxis(5, 0.1, 0.07), 1.72731073e-5, 1e-7));
  check('biot: finite wire matches numpy', near(B.wireExact(5, 0.2, 0.05, 0.03), 1.74707908e-5, 1e-7));
  const fine = B.sumPieces(5, B.wirePieces(0.2, 4000), [0.05, 0.03, 0]);
  check('biot: many pieces give the exact wire field, into the page', near(-fine[2], 1.74707908e-5, 1e-5) && fine[2] < 0 && Math.abs(fine[0]) < 1e-15);
  const lp = B.sumPieces(5, B.loopPieces(0.1, 4000), [0.07, 0, 0]);
  check('biot: many loop pieces give the axis formula, sideways parts cancel', near(lp[0], 1.72731073e-5, 1e-5) && Math.abs(lp[1]) < 1e-15 && Math.abs(lp[2]) < 1e-15);
  check('biot: loop centre μ₀I/2R', near(B.loopAxis(5, 0.1, 0), (B.MU0 * 5) / 0.2, 1e-12) && near(B.loopAxis(5, 0.1, 0, 10), (B.MU0 * 50) / 0.2, 1e-12));
  check('biot: long wire limit', near(B.wireExact(5, 1000, 0.05), B.longWire(5, 0.05), 1e-6) && near(B.longWire(5, 0.05), 2e-5, 1e-6));
  let sum = 0; for (let i = 0; i < 200; i++) sum += B.loopAxis(5, 0.02, 0.05 - (-0.1 + (i * 0.2) / 199));
  check('biot: solenoid vs 200 separate turns', near(B.solenoidAxis(5, 200, 0.2, 0.02, 0.05), sum, 5e-3));
  check('biot: long solenoid middle → μ₀nI, end → half', near(B.solenoidAxis(1, 10000, 10, 0.01, 0), B.solenoidIdeal(1, 10000, 10), 1e-5) && near(B.solenoidAxis(1, 10000, 10, 0.01, 5), B.solenoidIdeal(1, 10000, 10) / 2, 1e-4));
  const ws = [{ x: -0.03, y: 0.01, I: 5 }, { x: 0.02, y: 0.02, I: -3 }, { x: 0.01, y: -0.03, I: 2 }];
  const a1 = B.ampereLoop(ws, -0.03, 0.01, 0.02), a2 = B.ampereLoop(ws, 0, 0, 0.05), a3 = B.ampereLoop(ws, 0.05, -0.05, 0.01), a4 = B.ampereLoop(ws, -0.025, 0.012, 0.031);
  check('biot: Ampère round A', a1.Ienc === 5 && near(a1.integral, B.MU0 * 5, 1e-9));
  check('biot: Ampère round all three', a2.Ienc === 4 && near(a2.integral, B.MU0 * 4, 1e-9));
  check('biot: Ampère round none', a3.Ienc === 0 && Math.abs(a3.integral) < 1e-15);
  check('biot: Ampère off-centre round A only, wires close outside', a4.Ienc === 5 && near(a4.integral, B.MU0 * 5, 1e-6));
  check('biot: wire on the loop flagged', B.ampereLoop(ws, 0, 0.01, 0.03).onLine);
  let ok = true;
  for (let s = 1; s <= 40; s++) for (const q of B.questions(seeded(s))) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) ok = false; if (!q.steps.join(' ').includes(String(Number(q.answer.toPrecision(3))))) ok = false; }
  check('biot: 40 seeded question sets check out', ok);
};
