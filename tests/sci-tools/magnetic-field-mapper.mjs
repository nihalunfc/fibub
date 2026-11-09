// #1043 Magnetic field mapper. The loop field (exact elliptic-integral form) was checked against an independent
// NumPy script adding up the Biot-Savart field of 200,000 pieces of the loop at five points; K(0.5) and E(0.5)
// against their published values; wire, loop-centre and solenoid formulas against hand-worked numbers.
import * as M from '../../src/lib/sci/magnetic-mapper.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-6) => Math.abs(a - b) <= r * Math.abs(b) + 1e-18;

export default async (check) => {
  const [K, E] = M.ellipKE(0.5), [K0, E0] = M.ellipKE(0);
  check('mag: K(0.5) = 1.8540746773, E(0.5) = 1.3506438810', near(K, 1.854074677301372, 1e-12) && near(E, 1.350643881047675, 1e-12) && near(K0, Math.PI / 2, 1e-15) && near(E0, Math.PI / 2, 1e-15));
  const ref = [[[0.04, 1, 0, 0, 0], [1.57079633e-05, 0]], [[0.04, 10, 0, 0.03, 0.02], [7.08707754e-05, 2.9648384e-05]], [[0.04, 10, 0, -0.05, -0.06], [5.8791156e-06, 1.48329355e-05]], [[0.025, 2, 0.01, 0, 0.03], [-9.68801949e-07, -2.53788741e-05]], [[0.04, 5, 0, 0.001, 0.039], [5.62490105e-04, 5.05255931e-04]]];
  check('mag: loop field matches brute-force Biot-Savart at 5 points', ref.every(([a, [bx, by]]) => { const [x, y] = M.loopB(...a); return near(x, bx, 2e-7) && (by === 0 ? Math.abs(y) < 1e-15 : near(y, by, 2e-7)); }));
  check('mag: loop field is mirror-symmetric', (() => { const [a, b] = M.loopB(0.04, 1, 0, 0.02, 0.03), [c, d] = M.loopB(0.04, 1, 0, 0.02, -0.03), [e, f] = M.loopB(0.04, 1, 0, -0.02, 0.03); return near(a, c, 1e-12) && near(b, -d, 1e-12) && near(a, e, 1e-12) && near(b, -f, 1e-12); })());
  check('mag: loop centre = μ0 N I / 2a', near(Math.hypot(...M.field({ kind: 'loop', I: 5, N: 10 }, 0, 0)), M.loopCentre(10, 5, 0.04), 1e-9) && near(M.loopCentre(10, 5, 0.04), 7.853981633e-4, 1e-9));
  check('mag: wire 5 A at 7.5 cm is 13.33 µT, anticlockwise', near(M.wireFormula(5, 0.075), 1.3333333e-5, 1e-6) && near(Math.hypot(...M.wireB(5, 0, 0, 0.06, 0.045)), 1.3333333e-5, 1e-6) && near(M.angleDeg(...M.wireB(5, 0, 0, 0.06, 0.045)), 126.869897645844, 1e-9));
  const sol = M.field({ kind: 'solenoid', I: 5, N: 200 }, 0, 0)[0];
  check('mag: solenoid centre approaches μ0 n I (finite-length formula μ0 n I cosθ)', near(sol, M.solenoidInside(200 / 0.12, 5) * (0.06 / Math.hypot(0.06, 0.025)), 3e-3) && sol < M.solenoidInside(200 / 0.12, 5));
  check('mag: magnet N pole on the right: field points right on the axis, left beside the middle', M.field({ kind: 'magnet', I: 1, N: 1 }, 0.07, 0)[0] > 0 && M.field({ kind: 'magnet', I: 1, N: 1 }, 0, 0.04)[0] < 0);
  const box = { x0: -0.1, x1: 0.1, y0: -0.0833, y1: 0.0833 };
  const ring = M.trace({ kind: 'wire', I: 1, N: 1 }, 0.02, 0, box);
  check('mag: a wire line is a closed circle of the right radius', ring.length > 50 && ring.every(([x, y]) => Math.abs(Math.hypot(x, y) - 0.02) < 2e-5) && Math.hypot(ring.at(-1)[0] - 0.02, ring.at(-1)[1]) < 1e-9);
  const loopL = M.trace({ kind: 'loop', I: 1, N: 1 }, 0, 0.01, box);
  check('mag: a loop line closes round the wire', Math.hypot(loopL[0][0] - loopL.at(-1)[0], loopL[0][1] - loopL.at(-1)[1]) < 0.002 || loopL.some(([x, y]) => Math.abs(x) > 0.099 || Math.abs(y) > 0.083));
  check('mag: seeds', M.seeds({ kind: 'wire' }, 8).length === 8 && M.seeds({ kind: 'solenoid' }, 10).every(([x, y]) => x === 0 && Math.abs(y) < M.SIZE.solA));
  let ok = true;
  for (let s = 1; s <= 40; s++) {
    const qs = M.questions(seeded(s));
    for (const q of qs) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) ok = false; if (!q.steps.join(' ').includes(String(Number(q.answer.toPrecision(3))))) ok = false; }
    const [I, r] = qs[0].text.match(/carries ([\d.]+) A\. How strong is its magnetic field ([\d.]+) cm/).slice(1).map(Number);
    if (!near(qs[0].answer, (2e-7 * I) / (r / 100) * 1e6, 1e-6)) ok = false;
  }
  check('mag: 40 seeded question sets check out', ok);
};
