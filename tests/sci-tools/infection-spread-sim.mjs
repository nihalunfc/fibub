// #1214 infection-spread-sim: R0 = contacts × chance × days, herd immunity 1 − 1/R0, and the stochastic town's
// big outbreaks average to the SIR final-size equation z = 1 − e^(−R0 z) (0.9405 for R0 = 3, checked in Python).
import { r0, herdThreshold, rEff, finalSize, runAll } from '../../src/lib/sci/learnj-infect.ts';
import { rng } from '../../src/lib/sci/learnj-micro.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  check('infection: R0 = 3 × 0.25 × 4 = 3', near(r0(3, 0.25, 4), 3));
  check('infection: herd threshold for R0 = 3 is 2/3', near(herdThreshold(3), 2 / 3));
  check('infection: no threshold when R0 ≤ 1', herdThreshold(0.8) === 0);
  check('infection: R eff = 3 × 0.4 = 1.2', near(rEff(3, 0.4), 1.2));
  check('infection: final size for R0 = 3 is 0.94048 (Python)', near(finalSize(3), 0.9404797907073597, 1e-10));
  check('infection: final size 0 when R0 < 1', finalSize(0.9) === 0);
  const rand = rng(11), t = { n: 2000, contacts: 3, chance: 0.25, days: 4, vaccinated: 0, seeds: 3 };
  let sum = 0, big = 0;
  for (let k = 0; k < 60; k++) { const h = runAll(t, rand), last = h[h.length - 1], z = last.r / t.n; if (z > 0.3) { sum += z; big++; } }
  check(`infection: big outbreaks reach ${(sum / big).toFixed(3)} ≈ 0.940 (${big} of 60)`, big > 40 && Math.abs(sum / big - finalSize(3)) < 0.03);
  let tot = 0; for (let k = 0; k < 60; k++) { const h = runAll({ ...t, vaccinated: 0.8 }, rand); tot += h[h.length - 1].r; }
  check(`infection: 80 % vaccinated (above 67 %) keeps it small (${(tot / 60).toFixed(1)} people)`, tot / 60 < 30);
  const h = runAll({ ...t, n: 300 }, rand), last = h[h.length - 1];
  check('infection: everyone accounted for', last.s + last.i + last.r + last.v === 300 && last.i === 0);
};
