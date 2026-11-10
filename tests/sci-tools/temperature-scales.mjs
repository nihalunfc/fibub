// #1346 temperature-scales: checked against an independent Python calculation of the same formulas.
import { toC, fromC, convert, belowAbsZero, toCustom, fromCustom, sameReading, gasPressure, zeroPressureT, ABS_ZERO_C } from '../../src/lib/sci/n2-thermal.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  check('temp: 25 °C = 77 °F = 298.15 K', near(fromC(25, 'F'), 77) && near(fromC(25, 'K'), 298.15));
  check('temp: 98.6 °F = 37 °C', near(toC(98.6, 'F'), 37));
  check('temp: −40 °C = −40 °F', near(convert(-40, 'C', 'F'), -40) && near(convert(-40, 'F', 'C'), -40));
  check('temp: 300 K = 540 °R, 0 K = 0 °R', near(convert(300, 'K', 'R'), 540) && near(fromC(ABS_ZERO_C, 'R'), 0, 1e-9));
  check('temp: 212 °F = 100 °C = 373.15 K', near(convert(212, 'F', 'K'), 373.15));
  check('temp: round trips', [-273.15, -40, 0, 37.5, 1000].every((c) => ['C', 'F', 'K', 'R'].every((s) => near(toC(fromC(c, s), s), c))));
  check('temp: −300 °C is below absolute zero; −273.15 is not', belowAbsZero(-300) && !belowAbsZero(-273.15) && belowAbsZero(toC(-1, 'K')));
  check('temp: custom scale 20/220 reads 70 at 25 °C and back', near(toCustom(25, 20, 220), 70) && near(fromCustom(70, 20, 220), 25));
  check('temp: custom 20/220 agrees with Celsius at −20', near(sameReading(20, 220), -20));
  check('temp: Fahrenheit as a custom scale (32/212) agrees at −40', near(sameReading(32, 212), -40));
  check('temp: same-size degrees never agree', Number.isNaN(sameReading(5, 105)));
  check('temp: gas 100 kPa at 0 °C is 109.152 kPa at 25 °C (Python)', near(gasPressure(100, 25), 109.1524803221673));
  check('temp: gas pressure zero at absolute zero', near(gasPressure(150, ABS_ZERO_C), 0, 1e-9));
  check('temp: extrapolating two readings gives −273.15', near(zeroPressureT(0, gasPressure(80, 0), 100, gasPressure(80, 100)), -273.15));
  check('temp: Python example 100 kPa → 136.6 kPa gives −273.224', near(zeroPressureT(0, 100, 100, 136.6), -273.224043715847));
};
