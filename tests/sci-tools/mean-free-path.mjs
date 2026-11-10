// #1350 mean-free-path: checked against an independent Python calculation, and the 2-D formula against a hard-disk
// simulation (60 disks of diameter 0.02 in a 1 × 0.6 box gave 0.172 against 0.177).
import { meanFreePath, numberDensity, meanSpeed, collisionRate, meanFreePath2D, AMU } from '../../src/lib/sci/n2-kinetic.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const lam = meanFreePath(101325, 300, 0.37e-9);
  check('mfp: N₂ at 101.325 kPa, 300 K, d 0.37 nm: λ = 67.21 nm (Python)', near(lam, 6.720778870538731e-08, 1e-9));
  check('mfp: n = 2.4463e25 per m³', near(numberDensity(101325, 300), 2.446313291792483e25, 1e-9));
  check('mfp: mean speed of N₂ at 300 K = 476.29 m/s', near(meanSpeed(300, 28 * AMU), 476.2870368571282, 1e-9));
  check('mfp: 7.087e9 collisions per second', near(collisionRate(101325, 300, 0.37e-9, 28 * AMU), 7086783333.178607, 1e-9));
  check('mfp: at 1 µPa λ = 6.81 km', near(meanFreePath(1e-6, 300, 0.37e-9), 6809.829190573369, 1e-9));
  check('mfp: λ ∝ T/p and ∝ 1/d²', near(meanFreePath(2e5, 600, 0.37e-9), lam * (600 / 300) / (2e5 / 101325)) && near(meanFreePath(101325, 300, 0.74e-9), lam / 4));
  check('mfp: 2-D formula 1/(2√2 n d) for 100 per unit area, d 0.02 = 0.17678', near(meanFreePath2D(100, 0.02), 0.17677669529663687));
};
