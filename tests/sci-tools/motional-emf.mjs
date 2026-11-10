// #1414 Rod on rails. Checked against Python: B 0.5 T, ℓ 0.5 m, v 4 m/s, R 2 Ω: ε 1 V, I 0.5 A, F 0.125 N, P 0.5 W.
// Speeds checked against a Python RK4 integration of m dv/dt = F − B²ℓ²v/R: m 0.2 kg, let go at 4 m/s:
// v(3 s) = 2.503136 m/s; pulled from rest by 0.5 N: v(10 s) = 12.646218 m/s, terminal 16 m/s.
import * as M from '../../src/lib/sci/motional-emf.ts';
import { n3 } from '../../src/lib/sci/em-p34.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-9) => Math.abs(a - b) <= r * Math.abs(b) + 1e-12;

export default async (check) => {
  const r = M.rod(0.5, 0.5, 4, 2);
  check('motional: emf, current, force, power', near(r.emf, 1) && near(r.I, 0.5) && near(r.F, 0.125) && near(r.P, 0.5) && near(r.heat, 0.5));
  check('motional: time constant', near(M.tau(0.5, 0.5, 2, 0.2), 6.4));
  check('motional: coasting speed matches RK4', near(M.speed(0.5, 0.5, 2, 0.2, 4, 0, 3), 2.5031360384183756, 1e-9));
  check('motional: pulled speed matches RK4', near(M.speed(0.5, 0.5, 2, 0.2, 0, 0.5, 10), 12.646217805582399, 1e-9) && near(M.terminal(0.5, 0.5, 2, 0.5), 16));
  let v = 4, ok = true;
  for (let i = 0; i < 30000; i++) v += (-(0.25 * 0.25 * v) / 2 / 0.2) * 1e-4;
  if (!near(v, M.speed(0.5, 0.5, 2, 0.2, 4, 0, 3), 1e-4)) ok = false;
  check('motional: Euler steps agree', ok);
  let okq = true;
  for (let k = 1; k <= 60; k++) for (const q of M.questions(seeded(k))) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) okq = false; if (!q.steps.join(' ').includes(n3(q.answer))) okq = false; }
  check('motional: 60 seeded question sets check out', okq);
};
