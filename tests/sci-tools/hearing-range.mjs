// #1266 Hearing range explorer. Log slider ends and round trips, wavelength λ = v/f (343/1000 = 0.343 m;
// 343/20 = 17.15 m), bands, and the exponential sweep (halfway in time = geometric mean, √(20 × 20000) ≈ 632.46 Hz).
import { posToF, fToPos, wavelength, band, sweepF, ANIMALS } from '../../src/lib/sci/hearing-range.ts';

export default async (check) => {
  check('slider ends 20 Hz and 20 kHz', posToF(0) === 20 && posToF(1000) === 20000);
  check('1000 Hz round trip', posToF(fToPos(1000)) === 1000 && fToPos(20) === 0 && fToPos(20000) === 1000);
  check('slider is monotonic', Array.from({ length: 1000 }, (_, i) => posToF(i + 1) >= posToF(i)).every(Boolean));
  check('wavelengths', wavelength(1000) === 0.343 && wavelength(20) === 17.15 && Math.abs(wavelength(20000) - 0.01715) < 1e-12);
  check('bands', band(10).startsWith('infra') && band(1000).startsWith('audible') && band(30000).startsWith('ultra'));
  check('sweep halfway = geometric mean', Math.abs(sweepF(12, 24, 20, 20000) - Math.sqrt(20 * 20000)) < 1e-9 && sweepF(0, 24, 20, 20000) === 20 && sweepF(30, 24, 20, 20000) === 20000);
  check('animal ranges low < high', ANIMALS.every(([, a, b]) => a < b));
};
