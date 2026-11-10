// #1406 Drift velocity. Checked against an independent Python calculation: copper n = 8.49123e28 m⁻³,
// 1 A in 1 mm²: v_d = 7.35053e-5 m/s, τ = 2.48764e-14 s, μ = 4.37532e-3 m²/Vs, 13604.5 s per metre;
// aluminium n = 1.80785e29, silver 5.85633e28; classical thermal speed at 300 K 1.16793e5 m/s.
import * as D from '../../src/lib/sci/drift-velocity.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-5) => Math.abs(a - b) <= r * Math.abs(b);

export default async (check) => {
  check('drift: free electrons per m³', near(D.freeElectrons('copper'), 8.49123e28) && near(D.freeElectrons('aluminium'), 1.80785e29) && near(D.freeElectrons('silver'), 5.85633e28));
  const w = D.wire('copper', 1, 1e-6, 1);
  check('drift: copper 1 A in 1 mm²', near(w.vd, 7.35053e-5) && near(w.tau, 2.48764e-14) && near(w.mobility, 4.37532e-3) && near(w.crossTime, 13604.5) && near(w.E, 0.0168));
  check('drift: e E τ / m equals I / (n e A)', near(w.vdCheck, w.vd, 1e-12) && near(D.wire('aluminium', 3, 2e-6).vdCheck, D.wire('aluminium', 3, 2e-6).vd, 1e-12));
  check('drift: thermal speed', near(w.vth, 1.16793e5));
  check('drift: no current, no drift', D.wire('copper', 0, 1e-6).vd === 0 && D.wire('copper', 0, 1e-6).crossTime === Infinity);
  check('drift: I = n e A v_d inverts v_d', near(D.currentFrom(D.driftSpeed(2.5, 8.5e28, 3e-6), 8.5e28, 3e-6), 2.5, 1e-12));
  let ok = true;
  for (let s = 1; s <= 40; s++) for (const q of D.questions(seeded(s))) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) ok = false; if (!q.steps.join(' ').includes(String(Number(q.answer.toPrecision(3))))) ok = false; }
  check('drift: 40 seeded question sets check out', ok);
};
