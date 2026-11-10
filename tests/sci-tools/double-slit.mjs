// #1422 Young's double slit and single slit: checked against an independent Python calculation (math for β, the
// minima and the exact path difference; the intensities against a numerical Huygens sum of 20 000 point sources
// across each slit, numpy).
import { fringeWidth, brightAt, darkAt, angularWidth, singleMin, centralWidth, pathDiff, intensity, wavelengthRGB } from '../../src/lib/sci/q-slits.ts';
export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  const L = 600e-9, d = 0.25e-3, D = 1, a = 0.05e-3;
  check('slits: β = λD/d = 2.4 mm; 3rd bright 7.2 mm; 1st dark 1.2 mm; angular width 0.1375°', near(fringeWidth(L, D, d), 2.4e-3, 1e-15) && near(brightAt(3, L, D, d), 7.2e-3, 1e-15) && near(darkAt(1, L, D, d), 1.2e-3, 1e-15) && near(angularWidth(L, d) * 180 / Math.PI, 0.13750987083139757, 1e-12));
  check('slits: exact path difference at x 3.6 mm: 899.994 nm (1.49999 λ)', near(pathDiff(3.6e-3, D, d), 8.999941609744155e-07, 1e-15));
  check('slits: single slit 0.05 mm: central max 24.0017 mm, 2nd minimum 24.0069 mm, none past nλ > a', near(centralWidth(L, D, a), 0.024001728186646396, 1e-12) && near(singleMin(2, L, D, a), 0.024006914987417992, 1e-12) && singleMin(100, L, D, a) === null);
  const xs = [0.6e-3, 1.2e-3, 2.4e-3, 5e-3, 12e-3, 15e-3];
  const S = [0.991802, 0.967531, 0.875141, 0.544524, 0, 0.032401], W = [0.495901, 0, 0.875141, 0.50807, 0, 0.016272];
  check('slits: single-slit intensities match the Huygens sum (±2e-6)', xs.every((x, i) => near(intensity('single', x, L, D, d, a), S[i], 2e-6)));
  check('slits: double-slit intensities match the Huygens sum (±2e-6)', xs.every((x, i) => near(intensity('double', x, L, D, d, a), W[i], 2e-6)));
  check('slits: ideal narrow slits (a = 0) give cos² fringes', near(intensity('double', 1.2e-3, L, D, d, 0), 0, 1e-6) && near(intensity('double', 2.4e-3, L, D, d, 0), 1, 1e-6));
  check('slits: colours: 650 nm red, 530 nm green, 450 nm blue', wavelengthRGB(650)[0] === 1 && wavelengthRGB(530)[1] === 1 && wavelengthRGB(450)[2] === 1 && wavelengthRGB(450)[0] === 0);
};
