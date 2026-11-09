// #939 decibel distance: spreading, ISO 9613-1 air absorption, A-weighting, adding levels. Reference numbers from an
// independent NumPy/SciPy implementation (brentq for the distance search).
import { levelAt, spreading, aWeight, distanceFor, dbSum, dbMean, dbSubtract, OCTAVES } from '../../src/lib/sci/phdb.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const air = { tC: 20, rh: 50, pKPa: 101.325, on: true };
  check('spreading: point source −6.02 dB per doubling', near(spreading('point', 1, 2), 6.0206, 1e-4));
  check('spreading: line source −3.01 dB per doubling', near(spreading('line', 1, 2), 3.0103, 1e-4));
  check('spreading: plane source none', spreading('plane', 1, 100) === 0);
  const r = levelAt(90, 1, 100, 1000, 'point', air);
  check('90 dB at 1 m → 49.54 dB at 100 m, 1 kHz, 20 °C 50 % (NumPy)', near(r.L2, 49.538191544491674, 1e-10));
  check('distance to 45 dB = 163.0 m (SciPy brentq)', near(distanceFor(45, 90, 1, (x) => levelAt(90, 1, x, 1000, 'point', air).L2), 163.00968663445352, 1e-9));
  check('distance search: NaN when already below target', Number.isNaN(distanceFor(95, 90, 1, (x) => levelAt(90, 1, x, 1000, 'point', air).L2)));
  check('distance search: NaN for a plane source with no air loss', Number.isNaN(distanceFor(45, 90, 1, () => 90)));
  check('line source 2 kHz, 10 °C, 80 %, 95 kPa (NumPy)', near(levelAt(70, 5, 300, 2000, 'line', { tC: 10, rh: 80, pKPa: 95, on: true }).L2, 49.6447333878008, 1e-10));
  check('air off: spreading only', near(levelAt(90, 1, 100, 1000, 'point', { ...air, on: false }).L2, 50, 1e-12));
  for (const [f, a] of [[31.5, -39.52886548324546], [63, -26.222825281137037], [100, -19.144954291317543], [1000, 0.0001415276948792954], [3150, 1.2014452784815515], [8000, -1.1468793432843185], [16000, -6.7061184127130495]])
    check(`A-weighting ${f} Hz = ${a.toFixed(2)} dB (IEC 61672 formula, NumPy)`, near(aWeight(f), a, 1e-10));
  const spec = [80, 84, 86, 88, 87, 84, 80, 74], ref = [45.96933629855028, 49.836260363735384, 51.46967671569305, 52.86502663629156, 51.0217723963227, 45.71984177701163, 32.982767655528036, -6.5109058767770875];
  const o = OCTAVES.map((f, i) => levelAt(spec[i], 10, 500, f, 'point', { tC: 15, rh: 70, pKPa: 101.325, on: true }).L2);
  check('octave spectrum 10 m → 500 m at 15 °C 70 % (NumPy, all 8 bands)', o.every((v, i) => near(v, ref[i], 1e-10)));
  check('A-weighted total 91.26 → 54.64 dB(A) (NumPy)', near(dbSum(spec.map((v, i) => v + aWeight(OCTAVES[i]))), 91.25668660607664, 1e-10) && near(dbSum(o.map((v, i) => v + aWeight(OCTAVES[i]))), 54.642466692916486, 1e-10));
  check('85 + 82 + 79 dB = 87.44 dB', near(dbSum([85, 82, 79]), 87.43627266045621, 1e-12));
  check('energy mean 82.67 dB', near(dbMean([85, 82, 79]), 82.66506011325959, 1e-12));
  check('two equal levels add 3.01 dB', near(dbSum([60, 60]), 63.0103, 1e-5));
  check('background subtraction 87.44 − 70 → 87.36 dB', near(dbSubtract(87.43627266045621, 70), 87.35718560668516, 1e-12));
  check('background subtraction: NaN when total ≤ background', Number.isNaN(dbSubtract(60, 60)));
};
