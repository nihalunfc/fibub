// #1415 Self and mutual inductance. Checked against Python (µ0 = 1.25663706127e-6): N1 500, N2 200, ℓ 0.25 m,
// r1 2 cm, r2 3 cm: L1 = 1.5791367e-3 H, M = 6.3165468e-4 H, L2 = 5.6848921e-4 H, k = 2/3 (= r1/r2, exact),
// B at 2 A = 5.0265482e-3 T.
import * as I from '../../src/lib/sci/inductance-lab.ts';
import { n3 } from '../../src/lib/sci/em-p34.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-9) => Math.abs(a - b) <= r * Math.abs(b) + 1e-15;

export default async (check) => {
  const g = I.coils(500, 200, 0.25, 0.02, 0.03);
  check('inductance: L1, M, L2 match Python', near(g.L1, 0.0015791367039657994) && near(g.M, 0.0006316546815863199) && near(g.L2, 0.0005684892134276878));
  check('inductance: coupling is r1/r2 for an air core', near(g.k, 2 / 3) && near(I.coils(300, 700, 0.4, 0.01, 0.04).k, 0.25));
  check('inductance: field inside', near(g.B1(2), 0.00502654824508));
  const fe = I.coils(500, 200, 0.25, 0.02, 0.03, 1000);
  check('inductance: iron core multiplies L1 and M by µr', near(fe.L1, 1000 * g.L1) && near(fe.M, 1000 * g.M));
  check('inductance: triangle current and its rate', near(I.current(2, 0.5, 0.25), 1) && near(I.current(2, 0.5, 0.75), 1) && near(I.current(2, 0.5, 1.0), 0, 1) && I.rate(2, 0.5, 0.2) === 4 && I.rate(2, 0.5, 0.7) === -4);
  let ok = true;
  for (let t = 0.01; t < 2; t += 0.137) { const h = 1e-6; if (Math.abs((I.current(2, 0.5, t + h) - I.current(2, 0.5, t - h)) / (2 * h) - I.rate(2, 0.5, t)) > 1e-3) ok = false; }
  check('inductance: rate is the slope of the current', ok);
  let okq = true;
  for (let k = 1; k <= 60; k++) for (const q of I.questions(seeded(k))) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) okq = false; if (!q.steps.join(' ').includes(n3(q.answer))) okq = false; }
  check('inductance: 60 seeded question sets check out', okq);
};
