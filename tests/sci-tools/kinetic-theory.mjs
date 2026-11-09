// #1066 kinetic-theory: v_rms etc. checked against Python; the disc box conserves energy, its measured wall pressure
// matches the 2D ideal-gas law, and its speeds follow the 2D Maxwell shape.
import { vrms, vmean, vmostProbable, meanKE, idealP, GASES, makeBox, stepBox, rng, kineticEnergy, measuredP, theoryP, maxwell2D, meanSq, discCorrection } from '../../src/lib/sci/learngas.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  check('gas: v_rms N₂ 300 K = 516.8 m/s', near(vrms(300, GASES[1].M), 516.8391885639508, 1e-9));
  check('gas: v_rms He 300 K = 1367.3 m/s', near(vrms(300, GASES[0].M), 1367.3108237603833, 1e-9));
  check('gas: v_mp < v_mean < v_rms', vmostProbable(300, 0.028) < vmean(300, 0.028) && vmean(300, 0.028) < vrms(300, 0.028));
  check('gas: (3/2)kT at 300 K = 6.2129e-21 J', near(meanKE(300), 6.2129205e-21, 1e-9));
  check('gas: 1 mol at 273.15 K in 22.414 L ≈ 101.325 kPa', near(idealP(1, 273.15, 0.022413969545014137), 101325, 1e-9));
  const rand = rng(11), b = makeBox(60, 0.3, rand);
  const E0 = kineticEnergy(b);
  for (let i = 0; i < 4000; i++) stepBox(b, 0.002);
  check('gas: discs placed', b.ps.length === 60);
  check('gas: collisions keep the kinetic energy', near(kineticEnergy(b), E0, 1e-9));
  b.impulse = 0; b.time = 0;
  for (let i = 0; i < 40000; i++) stepBox(b, 0.002);
  const ratio = measuredP(b) / theoryP(b);
  check(`gas: measured wall pressure / 2D theory = ${ratio.toFixed(3)} (within 8%)`, Math.abs(ratio - 1) < 0.08);
  const z = discCorrection(b);
  check(`gas: with the hard-disc correction 1 + 2η = ${z.toFixed(3)}, ratio ${(ratio / z).toFixed(3)} (within 3%)`, Math.abs(ratio / z - 1) < 0.03);
  // Speeds: fraction below the median of the 2D Maxwell, v² = ms ln 2, should be about one half.
  const ms = meanSq(b), sp = b.ps.map((p) => Math.hypot(p.vx, p.vy)), below = sp.filter((v) => v * v < ms * Math.LN2).length / sp.length;
  check(`gas: speeds spread into the Maxwell shape (half below the median: ${below.toFixed(2)})`, Math.abs(below - 0.5) < 0.2 && Math.max(...sp) > 1.5 * Math.min(...sp) + 0.05);
  let integ = 0; for (let v = 0; v < 10; v += 0.001) integ += maxwell2D(v + 0.0005, 0.09) * 0.001;
  check('gas: 2D Maxwell curve has area 1', near(integ, 1, 1e-4));
};
