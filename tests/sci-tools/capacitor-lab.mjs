// #1047 Parallel-plate capacitor lab. Checked by hand with ε₀ = 8.8541878188e-12 F/m (100 cm², 2 mm: 44.271 pF;
// at 6 V: 265.63 pC and 796.88 pJ; full K = 4 slab after disconnecting: 177.08 pF, 1.5 V, 199.22 pJ), the slab
// formula's limits (t = d gives K ε₀ A/d, t = 0 gives ε₀ A/d) and 4 µF with 12 µF: 3 µF in series, 16 µF in parallel.
import * as C from '../../src/lib/sci/capacitor-lab.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-9) => Math.abs(a - b) <= r * Math.abs(b) + 1e-24;

export default async (check) => {
  const c0 = C.plateC(0.01, 0.002);
  check('cap: ε0 A / d = 44.271 pF', near(c0, 4.4270939094e-11));
  const on = C.state(c0, 0.002, true, 6, 0);
  check('cap: Q, U and E at 6 V', near(on.Q, 2.65625634564e-10) && near(on.U, 7.96876903692e-10) && near(on.E, 3000));
  const c4 = C.plateC(0.01, 0.002, 4, 1), off = C.state(c4, 0.002, false, 6, on.Q);
  check('cap: disconnected, slab in: C × 4, V ÷ 4, U ÷ 4', near(c4, 1.77083756376e-10) && near(off.V, 1.5) && near(off.U, 1.99219225923e-10) && near(off.Q, on.Q));
  const on4 = C.state(c4, 0.002, true, 6, 0);
  check('cap: connected, slab in: V fixed, Q × 4, U × 4', near(on4.Q, 4 * on.Q) && near(on4.U, 4 * on.U) && near(on4.V, 6));
  check('cap: half slab is the two halves in parallel', near(C.plateC(0.01, 0.002, 4, 0.5), C.plateC(0.005, 0.002) + C.plateC(0.005, 0.002, 4, 1)));
  check('cap: slab formula limits', near(C.slabC(0.01, 0.002, 0.002, 4), c4) && near(C.slabC(0.01, 0.002, 0, 4), c0) && near(C.slabC(0.01, 0.002, 0.001, 1e12), C.plateC(0.01, 0.001), 1e-9));
  check('cap: series and parallel', near(C.series([4, 12]), 3) && C.parallel([4, 12]) === 16 && near(C.series([10, 10, 10]), 10 / 3));
  check('cap: U = Q²/2C = QV/2', near(on.U, (on.Q * on.Q) / (2 * c0)) && near(on.U, (on.Q * on.V) / 2));
  let ok = true;
  for (let s = 1; s <= 40; s++) {
    const qs = C.questions(seeded(s));
    for (const q of qs) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) ok = false; if (!q.steps.join(' ').includes(String(Number(q.answer.toPrecision(3))))) ok = false; }
    const [A, d] = qs[0].text.match(/area ([\d.]+) cm² are ([\d.]+) mm/).slice(1).map(Number);
    if (!near(qs[0].answer, C.plateC(A * 1e-4, d * 1e-3) * 1e12, 1e-12)) ok = false;
  }
  check('cap: 40 seeded question sets check out', ok);
};
