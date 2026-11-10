// #1399 Coulomb's law and superposition. Checked against an independent NumPy script adding the force vectors
// (k = 1/(4π × 8.8541878188e-12)): three-charge layout, force on A from B −1.34813 N (r 0.2 m), from C 0.607267 N
// (r 0.172047 m), net (0.995166, −0.494153) N = 1.11110 N at 333.593°; line layout net on the middle 3.13647 N;
// square of +2 µC charges 20 cm apart: net on a corner 1.72041 N at 225°.
import * as C from '../../src/lib/sci/coulomb-forces.ts';
import { K } from '../../src/lib/sci/em-p34.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-6) => Math.abs(a - b) <= r * Math.abs(b) + 1e-12;

export default async (check) => {
  check('coulomb: k from CODATA 2022 ε₀', near(K, 8987551786.170797, 1e-12));
  const three = [{ q: 2, x: 8, y: 8 }, { q: -3, x: 28, y: 8 }, { q: 1, x: 18, y: 22 }];
  const n = C.netForce(three, 0);
  check('coulomb: pair forces match NumPy', near(n.parts[0].F, -1.3481327679256192) && near(n.parts[1].F, 0.6072670125791078) && near(n.parts[1].r, 0.17204650534085256));
  check('coulomb: net force and angle match NumPy', near(n.fx, 0.99516599) && near(n.fy, -0.49415349) && near(n.F, 1.1110999128214045) && near(C.deg360(n.angle), 333.5931267062537));
  const line = C.netForce([{ q: 4, x: 6, y: 14 }, { q: 1, x: 16, y: 14 }, { q: 1, x: 30, y: 14 }], 1);
  check('coulomb: three in a line', near(line.F, 3.1364721539494003) && Math.abs(line.fy) < 1e-12);
  const sq = C.netForce([{ q: 2, x: 8, y: 4 }, { q: 2, x: 28, y: 4 }, { q: 2, x: 28, y: 24 }, { q: 2, x: 8, y: 24 }], 0);
  check('coulomb: square corner along the diagonal', near(sq.F, 1.720409352161867) && near(C.deg360(sq.angle), 225));
  const a = C.pairForce({ q: 2, x: 0, y: 0 }, { q: 5, x: 10, y: 0 }), b = C.pairForce({ q: 5, x: 10, y: 0 }, { q: 2, x: 0, y: 0 });
  check("coulomb: Newton's third law", near(a.fx, -b.fx) && near(a.F, b.F));
  const d = C.pairForce({ q: 2, x: 0, y: 0 }, { q: 5, x: 20, y: 0 });
  check('coulomb: inverse square', near(a.F / d.F, 4));
  let ok = true;
  for (let k = 1; k <= 60; k++) {
    for (const q of C.questions(seeded(k))) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) ok = false; if (!q.steps.join(' ').includes(String(Number(q.answer.toPrecision(3))))) ok = false; }
  }
  check('coulomb: 60 seeded question sets check out', ok);
};
