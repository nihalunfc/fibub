// #1420 Displacement current. Checked against Python with CODATA 2022 ε0, µ0: V 12, R 10 MΩ, a 0.1 m, d 1 mm:
// C = 2.781625140504632e-10 F, τ = 2.7816251405046316e-3 s; at t = τ: I = 4.414553294057308e-7 A, q = 2.1099869259208236e-9 C,
// E = 7585.446705942691 V/m, dE/dt = 1587041.0537260373 V/m/s; B(5 cm, gap) = 4.414553293474442e-13 T, B(5 cm, wire) = 1.7658213173897768e-12 T.
import * as S from '../../src/lib/sci/displacement-current.ts';
import { n3 } from '../../src/lib/sci/em-p34.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-8) => Math.abs(a - b) <= r * Math.abs(b) + 1e-40;

export default async (check) => {
  const c = S.circuit(12, 10e6, 0.1, 1e-3);
  check('displacement: capacitance and time constant', near(c.C, 2.781625140504632e-10) && near(c.tau, 2.7816251405046316e-3) && near(c.I0, 1.2e-6));
  const s = S.at(12, 10e6, 0.1, 1e-3, c.tau);
  check('displacement: state at t = τ', near(s.I, 4.414553294057308e-7) && near(s.q, 2.1099869259208236e-9) && near(s.E, 7585.446705942691) && near(s.dEdt, 1587041.0537260373));
  check('displacement: I_d equals I at every time', [0, 0.3, 1, 2.5, 5].every((k) => { const t = S.at(9, 3e6, 0.07, 2e-3, k * c.tau); return near(t.Id, t.I, 1e-12); }));
  check('displacement: B in the gap and round the wire', near(S.bField(s.I, 0.05, 0.1, true), 4.414553293474442e-13) && near(S.bField(s.I, 0.05, 0.1, false), 1.7658213173897768e-12) && near(S.bField(s.I, 0.2, 0.1, true), S.bField(s.I, 0.2, 0.1, false), 1e-12) && near(S.bField(s.I, 0.1, 0.1, true), S.bField(s.I, 0.1, 0.1, false), 1e-12));
  let okq = true;
  for (let k = 1; k <= 60; k++) for (const q of S.questions(seeded(k))) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) okq = false; if (!q.steps.join(' ').includes(n3(q.answer))) okq = false; }
  check('displacement: 60 seeded question sets check out', okq);
};
