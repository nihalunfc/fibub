// #1218 parallax-reading: d·tanθ shifts for each instrument, checked by hand.
import { INSTRUMENTS, apparent, parallaxError, toMark, pctError } from '../../src/lib/sci/learnj-measure.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const [ruler, thermo, cyl] = INSTRUMENTS;
  check('parallax: straight on, no error', INSTRUMENTS.every((m) => parallaxError(0, m) === 0));
  check('parallax: cylinder at 30° reads 3.849 mL high', near(parallaxError(30, cyl), (12 * Math.tan(Math.PI / 6)) / 1.8));
  check('parallax: cylinder 46 mL at 30° reads 49.85 mL', near(apparent(46, 30, cyl), 46 + 3.849001794597505, 1e-9));
  check('parallax: ruler at 30° 0.1732 cm', near(parallaxError(30, ruler), 0.17320508075688773));
  check('parallax: thermometer below reads low', parallaxError(-30, thermo) < 0 && near(parallaxError(-30, thermo), -1.1547005383792515));
  check('parallax: to the nearest mark 49.85 → 50 (2 mL marks)', toMark(49.85, 2) === 50);
  check('parallax: 2 in 10 is 20 %', pctError(12, 10) === 20);
};
