// #1216 fuse-heating: temperature rise ∝ I², melt currents, home current I = P/V and H = I²Rt, checked by hand
// and with Python.
import { WIRES, wireTemp, meltCurrent, glowOf, homeCurrent, heat } from '../../src/lib/sci/learnj-fuse.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const [fuse, nichrome, copper] = WIRES;
  check('fuse: fuse wire melts at 5 A', near(meltCurrent(fuse), 5));
  check('fuse: nichrome melts at 6.770 A (Python)', near(meltCurrent(nichrome), 6.7700320038633));
  check('fuse: copper melts at 28 A', near(meltCurrent(copper), 28));
  check('fuse: nichrome 4 A = 505 °C dull red, 5 A = 775 °C cherry red', wireTemp(nichrome, 4) === 505 && glowOf(505) === 'dull red' && wireTemp(nichrome, 5) === 775 && glowOf(775) === 'cherry red');
  check('fuse: doubling current quadruples the rise', near(wireTemp(nichrome, 4) - 25, 4 * (wireTemp(nichrome, 2) - 25)));
  check('fuse: no glow below 500 °C, white-hot above 1300', glowOf(499) === 'no glow' && glowOf(1350) === 'white-hot');
  check('fuse: kettle + heater = 3500 W / 230 V = 15.22 A', near(homeCurrent([1500, 2000]), 3500 / 230));
  check('fuse: H = 3² × 10 × 60 = 5400 J', heat(3, 10, 60) === 5400);
};
