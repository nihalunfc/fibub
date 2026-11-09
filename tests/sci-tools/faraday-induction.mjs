// #1045 Faraday's magnet and coil. The dipole flux through the coil was checked against an independent NumPy
// integral of the dipole field over the coil's disc (5.36198e-6 Wb at 3 cm for m = 1 A m², a = 2 cm), dΦ/dz against a
// central finite difference (−1.34876e-3 Wb/m at 1 cm), and the generator (100 turns, 0.01 m², 0.2 T, 25 Hz:
// 31.416 V peak, 22.214 V rms) by hand.
import * as F from '../../src/lib/sci/faraday-induction.ts';
import { seeded, isRight } from '../../src/lib/sci/elec-quiz.ts';
const near = (a, b, r = 1e-9) => Math.abs(a - b) <= r * Math.abs(b) + 1e-18;

export default async (check) => {
  check('faraday: flux at the centre is μ0 m / 2a', near(F.flux1(1, 0.02, 0), 3.1415926531749994e-5, 1e-12));
  check('faraday: flux at 3 cm matches the numerical integral', near(F.flux1(1, 0.02, 0.03), 5.361975572796818e-6, 1e-9));
  check('faraday: dΦ/dz matches finite difference', near(F.dflux1(1, 0.02, 0.01), -0.0013487644281706668, 1e-8) && F.dflux1(1, 0.02, 0) === 0);
  check('faraday: dΦ/dz is largest at z = a/2', [0.004, 0.008, 0.012, 0.016].every((z) => Math.abs(F.dflux1(1, 0.02, z)) < Math.abs(F.dflux1(1, 0.02, 0.01))));
  check('faraday: emf approaching with N first is negative (Lenz), leaving positive', F.emf(100, 1, 0.02, -0.05, 0.2) < 0 && F.emf(100, 1, 0.02, -0.05, -0.2) > 0 && F.emf(100, 1, 0.02, 0.05, 0.2) > 0);
  check('faraday: still magnet gives no emf', F.emf(100, 1, 0.02, -0.01, 0) === 0 || Object.is(F.emf(100, 1, 0.02, -0.01, 0), -0));
  check('faraday: largest emf of a push in at 0.2 m/s is 26.98 mV', near(F.maxEmf(100, 1, 0.02, -0.15, 0, 0.2), 0.026975288563413337, 1e-9) && near(F.maxEmf(100, 1, 0.02, -0.15, -0.1, 0.2), Math.abs(F.emf(100, 1, 0.02, -0.1, 0.2)), 1e-12));
  const g = F.generator(100, 0.2, 0.01, 25);
  check('faraday: generator peak 31.416 V and rms 22.214 V', near(g.peak, 31.415926535897935) && near(g.rms, 22.21441469079183) && near(g.T, 0.04));
  check('faraday: generator emf = −dΦ/dt', [0.003, 0.011, 0.027].every((t) => near(g.emf(t), -(g.flux(t + 1e-7) - g.flux(t - 1e-7)) / 2e-7, 1e-6)));
  let ok = true;
  for (let s = 1; s <= 40; s++) {
    const qs = F.questions(seeded(s));
    for (const q of qs) { if (!(q.answer > 0) || !isRight(String(q.answer), q) || isRight(String(q.answer * 1.1), q)) ok = false; if (!q.steps.join(' ').includes(String(Number(q.answer.toPrecision(3))))) ok = false; }
    const [N, p0, p1, dt] = qs[0].text.match(/a (\d+)-turn coil changes from ([\d.]+) mWb to ([\d.]+) mWb in ([\d.]+) s/).slice(1).map(Number);
    if (!near(qs[0].answer, (N * (p1 - p0) * 1e-3) / dt, 1e-12)) ok = false;
  }
  check('faraday: 40 seeded question sets check out', ok);
};
