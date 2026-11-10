// #1403 Capacitor network reducer. Checked against a Python script with exact fractions: 4 µF in series with
// (2 ∥ 6) = 8/3 µF; (1 ∥ 3) series (2 ∥ 2) = 2 µF; ladder ((6 series 3) ∥ 2) series 4 = 2 µF; 2, 3, 6 in series = 1 µF.
// On 12 V the first gives Q = 32 µC, V = 8, 4, 4 V, U = 128, 16, 48 µJ (sum 192 = ½CV²).
import * as N from '../../src/lib/sci/capacitor-network.ts';
import { n3 } from '../../src/lib/sci/em-p34.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-12) => Math.abs(a - b) <= r * Math.abs(b) + 1e-12;
const C = (id, c) => ({ kind: 'C', id, c }), S = (...kids) => ({ kind: 'S', kids }), P = (...kids) => ({ kind: 'P', kids });

export default async (check) => {
  const sp = S(C(1, 4), P(C(2, 2), C(3, 6)));
  check('capnet: equivalent capacitances', near(N.ceq(sp), 8 / 3) && near(N.ceq(S(P(C(1, 1), C(2, 3)), P(C(3, 2), C(4, 2)))), 2) && near(N.ceq(S(P(S(C(1, 6), C(2, 3)), C(3, 2)), C(4, 4))), 2) && near(N.ceq(S(C(1, 2), C(2, 3), C(3, 6))), 1));
  const st = N.steps(sp);
  check('capnet: steps innermost first', st.length === 2 && st[0].text.startsWith('C₂ and C₃ are in parallel') && st[0].text.includes('2 + 6 = 8 µF. Call it C₂₃.') && st[1].text.startsWith('C₁ and C₂₃ are in series') && st[1].text.includes('giving 2.67 µF. Call it C₁₂₃.'));
  const sh = N.share(sp, 12);
  check('capnet: charges and voltages', near(sh[1].Q, 32) && near(sh[1].V, 8) && near(sh[2].V, 4) && near(sh[3].Q, 24) && near(sh[2].Q + sh[3].Q, 32));
  check('capnet: energies add to ½CV²', near(sh[1].U + sh[2].U + sh[3].U, 0.5 * (8 / 3) * 144) && near(sh[1].U, 128));
  let ok = true;
  const lad = S(P(S(C(1, 6), C(2, 3)), C(3, 2)), C(4, 4)), sl = N.share(lad, 10);
  if (!near(sl[1].Q, sl[2].Q) || !near(sl[1].V + sl[2].V, sl[3].V) || !near(sl[3].V + sl[4].V, 10)) ok = false;
  check('capnet: ladder obeys series and parallel rules', ok);
  let okq = true;
  for (let k = 1; k <= 60; k++) for (const q of N.questions(seeded(k))) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) okq = false; if (!q.steps.join(' ').includes(n3(q.answer))) okq = false; }
  check('capnet: 60 seeded question sets check out', okq);
};
