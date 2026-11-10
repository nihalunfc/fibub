// #1347 thermal-expansion: checked against an independent Python calculation, including an exact circular-arc
// solution for the bowed rail.
import { deltaL, thermalStress, areaVolume, gapNeeded, bowRise } from '../../src/lib/sci/n2-thermal.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  check('expansion: steel 13 m warmed 25 °C grows 3.9 mm', near(deltaL(12e-6, 13, 25), 3.9e-3));
  check('expansion: cooling gives a negative change', deltaL(12e-6, 13, -10) < 0);
  check('expansion: gap for 13 m steel laid at 20 °C, hot 50 °C is 4.68 mm', near(gapNeeded(12e-6, 13, 20, 50), 4.68e-3));
  check('expansion: no gap needed if it never gets warmer', gapNeeded(12e-6, 13, 30, 20) === 0);
  check('expansion: stress in welded steel, ΔT 25 °C = 60 MPa', near(thermalStress(200e9, 12e-6, 25), 60e6));
  const av = areaVolume(12e-6, 1, 25);
  check('expansion: area change exact 6.0009 cm², approx 2αAΔT = 6 cm² (Python)', near((av.A - av.A0) * 1e4, 6.00089999999831, 1e-6) && near(av.dAapprox * 1e4, 6));
  check('expansion: volume change exact 900.27 cm³, approx 900 cm³', near((av.V - av.V0) * 1e6, 900.2700269999941, 1e-6) && near(av.dVapprox * 1e6, 900));
  check('expansion: shallow-arc rise for 13 m + 1 mm matches the exact arc (6.982 cm) within 0.1 %', Math.abs(bowRise(13, 1e-3) / 0.06982200584081966 - 1) < 1e-3);
  check('expansion: no bow without excess length', bowRise(13, 0) === 0);
};
