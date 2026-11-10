// #1401 Electric dipole in a field. Checked against a Python script: q 2 µC, d 2 cm, E 5e4 N/C, θ 30°: p = 4e-8 C m,
// τ = 1.0e-3 N m, U = −1.7320508e-3 J, W(0→30°) = 2.6794919e-4 J; and τ = −dU/dθ by a central difference.
import * as D from '../../src/lib/sci/dipole-torque.ts';
import { n3 } from '../../src/lib/sci/em-p34.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-9) => Math.abs(a - b) <= r * Math.abs(b) + 1e-15;

export default async (check) => {
  const s = D.dipole(2e-6, 0.02, 5e4, 30);
  check('dipole: moment, torque, energy, work', near(s.p, 4e-8) && near(s.torque, 1e-3) && near(s.U, -1.7320508075688772e-3) && near(s.W0, 2.6794919243112275e-4) && near(s.F, 0.1));
  let ok = true;
  for (let t = 5; t <= 175; t += 10) { const h = 1e-4, dU = (D.dipole(2e-6, 0.02, 5e4, t + h).U - D.dipole(2e-6, 0.02, 5e4, t - h).U) / ((2 * h * Math.PI) / 180); if (!near(D.dipole(2e-6, 0.02, 5e4, t).torque, dU, 1e-6)) ok = false; }
  check('dipole: torque is dU/dθ (its size)', ok);
  check('dipole: work 0 → 180° is 2pE', near(D.workTurn(4e-8, 5e4, 0, 180), 4e-3));
  check('dipole: work equals the change in U', near(D.workTurn(4e-8, 5e4, 30, 120), D.dipole(2e-6, 0.02, 5e4, 120).U - s.U));
  let [th, w] = [Math.PI / 6, 0], max = 0;
  for (let i = 0; i < 2000; i++) { [th, w] = D.swingStep(th, w, 10, 0, 0.01); max = Math.max(max, Math.abs(th)); }
  check('dipole: undamped swing keeps its size', max <= Math.PI / 6 + 1e-3 && max > Math.PI / 6 - 1e-3);
  let okq = true;
  for (let k = 1; k <= 60; k++) for (const q of D.questions(seeded(k))) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) okq = false; if (!q.steps.join(' ').includes(n3(q.answer))) okq = false; }
  check('dipole: 60 seeded question sets check out', okq);
};
