// #1418 EM wave in 3D. Checked against Python: c = 1/√(µ0 ε0) = 299792457.99982 m/s (CODATA 2022 values);
// λ 3.02 m: f = 99269025.8 Hz; E0 10 V/m: B0 = 3.33564095e-8 T, I = 0.132721 W/m², u = 4.42709e-10 J/m³.
import * as W from '../../src/lib/sci/em-wave-3d.ts';
import { n3 } from '../../src/lib/sci/em-p34.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-6) => Math.abs(a - b) <= r * Math.abs(b) + 1e-30;

export default async (check) => {
  check('emwave: c from µ0 and ε0', near(W.cFromConstants(), 299792458, 1e-9));
  const w = W.wave(10, 3.02);
  check('emwave: frequency and period', near(w.f, 99269025.82781457, 1e-12) && near(w.T * w.f, 1, 1e-12));
  check('emwave: B0, intensity, energy density', near(w.B0, 3.33564095e-8) && near(w.I, 0.132721, 1e-5) && near(w.u, 4.42709e-10, 1e-5) && near(w.I, w.u * 299792458, 1e-12));
  check('emwave: E and B in phase, travelling forward', W.at(0.25, 0) === 1 && Math.abs(W.at(0.5, 0.25) - 1) < 1e-12);
  let okq = true;
  for (let k = 1; k <= 60; k++) for (const q of W.questions(seeded(k))) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) okq = false; if (!q.steps.join(' ').includes(n3(q.answer))) okq = false; }
  check('emwave: 60 seeded question sets check out', okq);
};
