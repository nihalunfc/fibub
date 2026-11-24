// #487 VO2max from field tests. Reference numbers from hand Python (/tmp/claude-0/a9/vo2.py) and the
// LibreTexts physiology lab worked example (1.5 mile in 11.66 min -> 44.92 mL/kg/min).
import * as V from '../../src/lib/sci/vo2max.ts';
export default async (check) => {
  const near = (a, b, t = 1e-6) => Math.abs(a - b) <= t;
  check('vo2: Cooper 2400 m = 42.3675', near(V.cooper(2400), 42.36753856));
  check('vo2: Cooper 3000 m and 1800 m', near(V.cooper(3000), 55.78135480) && near(V.cooper(1800), 28.95372233));
  check('vo2: 1.5 mile worked example 11.66 min -> 44.92', near(V.mile15(11.66), 44.92367067));
  check('vo2: 1.5 mile 11:40 -> 44.9', near(V.mile15(V.parseMinutes('11:40')), 44.9));
  check('vo2: Rockport man 75 kg, 40 y, 14.5 min, 140', near(V.rockport(75, 40, true, 14.5, 140), 41.69378903));
  check('vo2: Rockport woman 60 kg, 30 y, 15.25 min, 150', near(V.rockport(60, 30, false, 15.25, 150), 37.78514622));
  check('vo2: Rockport in pounds matches (170 lb)', near(V.rockport(170 * 0.45359237, 40, true, 14.5, 140), 41.33595));
  check('vo2: shuttle stage speeds', V.shuttleSpeed(1) === 8.5 && V.shuttleSpeed(9) === 12.5);
  check('vo2: Léger child age 12', near(V.legerChild(8.5, 12), 35.2392) && near(V.legerChild(12.5, 12), 55.564) && near(V.legerChild(14, 12), 63.1858));
  check('vo2: Léger adult', near(V.legerAdult(8.5), 26.6) && near(V.legerAdult(12.5), 50.6));
  // Pinned by /blog/discoveries/vo2max-field-tests-university-students-leger-age-range/: the two Léger equations on
  // the same run, the step at the age-18 boundary, and the children's equation's slope with age.
  check('vo2: Léger child 11.828 km/h at 20.63 y = 39.80, adult = 46.57', near(V.legerChild(11.828, 20.63), 39.798011904, 1e-9) && near(V.legerAdult(11.828), 46.568, 1e-6));
  check('vo2: Léger child at the age-18 boundary is 3.01 below the adult equation', near(V.legerChild(11.828, 18), 43.5621184, 1e-9) && near(V.legerAdult(11.828) - V.legerChild(11.828, 18), 3.0058816, 1e-9));
  check('vo2: children\'s equation loses 1.431 mL/kg/min a year at 11.828 km/h', near(V.legerChild(11.828, 21) - V.legerChild(11.828, 20), -1.4312192, 1e-9) && near(V.legerChild(12, 21), 40.3802, 1e-9));
  check('vo2: Queens College', near(V.queens(150, true), 48.33) && near(V.queens(160, false), 36.258));
  check('vo2: Uth ratio', near(V.uth(190, 60), 48.45) && near(V.uth(180, 50), 55.08));
  check('vo2: time parsing', near(V.parseMinutes('11:40'), 11 + 40 / 60) && V.parseMinutes('12.5') === 12.5 && near(V.parseMinutes("9'30"), 9.5) && Number.isNaN(V.parseMinutes('9:75')) && Number.isNaN(V.parseMinutes('abc')));
  check('vo2: METs and litres', near(V.mets(42), 12) && near(V.litres(50, 70), 3.5));
};
