// Psychrometrics (src/lib/sci/psychro.ts). The ASHRAE checks live in tests/sci.mjs; these pin the psychrometer
// error case from the discovery article on matched dry and wet bulb calibration (de Araújo et al. 2026, J 9: 7).
import { air } from '../../src/lib/sci/psychro.ts';

export default async (check) => {
  const near = (a, b, t) => Math.abs(a - b) <= t, P = 101325;
  const tw = air(19, P, { rh: 0.668 }).tw;
  check('psychro: 19 °C and 66.8 % RH give a wet bulb of 15.14 °C', near(tw, 15.14, 0.005));
  const e = (dt, dw) => (air(19 + dt, P, { tw: tw + dw }).rh - 0.668) * 100;
  check('psychro: ±1 K opposite errors move RH by +16.2 and −14.2 points', near(e(-1, 1), 16.18, 0.01) && near(e(1, -1), -14.23, 0.01));
  check('psychro: the same +1 K error in both bulbs moves RH by only 0.84 points', near(e(1, 1), 0.842, 0.002));
  check('psychro: typed readings 18 / 16.14 °C give 83.0 % RH, 20 / 16.14 °C give 67.6 %', near(air(18, P, { tw: 16.14 }).rh * 100, 83.0, 0.05) && near(air(20, P, { tw: 16.14 }).rh * 100, 67.6, 0.05));
};
