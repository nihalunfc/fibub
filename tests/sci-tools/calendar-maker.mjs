// #1231 Calendar maker. Leap years checked against Python calendar.isleap / calendar.leapdays (e.g. leapdays(1901,
// 2001) = 25, leapdays(2001, 2101) = 24, 97 leap years in 400); mean year and month from Meeus; Metonic cycle
// 235 months ≈ 19 years within about 2 hours; 7 adhik months in 19 years.
import { TROPICAL, SYNODIC, isLeapGregorian, isLeapJulian, leapsBetween, slip, lunisolar, metonic, yearsToSlip } from '../../src/lib/sci/calendar-j2.ts';

export default async (check) => {
  const near = (a, b, e) => Math.abs(a - b) <= e;
  check('calendar: Gregorian leap rule (1900 no, 2000 yes, 2024 yes, 2100 no, 2023 no); Julian 1900 yes', !isLeapGregorian(1900) && isLeapGregorian(2000) && isLeapGregorian(2024) && !isLeapGregorian(2100) && !isLeapGregorian(2023) && isLeapJulian(1900));
  let cnt = 0, ok = true; for (let y = 1; y <= 2500; y++) { if (isLeapGregorian(y)) cnt++; if (leapsBetween(1, y) !== cnt) ok = false; }
  check('calendar: leapsBetween matches a direct count for every year to 2500; 25, 24 and 97 per 400', ok && leapsBetween(1901, 2000) === 25 && leapsBetween(2001, 2100) === 24 && leapsBetween(2001, 2400) === 97);
  check('calendar: 100 years slip: 365-day +24.22, Julian −0.78, Gregorian −0.03 days', near(slip('plain', 100), 24.22, 0.01) && near(slip('julian', 100), -0.78, 0.01) && near(slip('gregorian', 100), -0.031, 0.001));
  check('calendar: Moon-only year 354.37 days, 10.88 days short, round the seasons in about 33.6 years', near(12 * SYNODIC, 354.367, 0.001) && near(slip('lunar', 1), 10.875, 0.001) && near(yearsToSlip('lunar', TROPICAL), 33.58, 0.01));
  const L19 = lunisolar(19), m = metonic();
  check('calendar: 7 adhik months in 19 years, 235 months, within 3 hours', L19.adhik.length === 7 && L19.months === 235 && Math.abs(L19.lag) < 0.125 && near(m.diffHours, -2.08, 0.01));
  let within = true; for (let y = 1; y <= 1000; y++) if (Math.abs(lunisolar(y).lag) > SYNODIC / 2 + 1e-9) within = false;
  check('calendar: lunisolar calendar stays within half a month for 1000 years; about 37 adhik in 100', within && lunisolar(100).adhik.length === 37);
  check('calendar: Julian slips a day in 128 years, Gregorian in about 3,226', near(yearsToSlip('julian', 1), 128.0, 0.1) && near(yearsToSlip('gregorian', 1), 3225.8, 1));
};
