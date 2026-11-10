// #1227 Moon phase simulator. Mean synodic month and reference new moon from Meeus, Astronomical Algorithms ch. 49;
// mean ages checked against observed new and full moons (all within the ±0.5 day the mean motion allows).
import { ageOf, thetaOfAge, litFraction, phaseName, tithi, riseSet, clock, meanAge, litPath, SYNODIC } from '../../src/lib/sci/moonphase-j2.ts';

export default async (check) => {
  const near = (a, b, e) => Math.abs(a - b) <= e;
  const dist = (age, want) => Math.min(Math.abs(age - want), SYNODIC - Math.abs(age - want));
  const obs = [['2024-04-08T18:21Z', 0], ['2025-03-14T06:55Z', SYNODIC / 2], ['2025-09-07T18:09Z', SYNODIC / 2], ['2026-08-12T17:37Z', 0], ['2026-11-09T07:02Z', 0]];
  check('moon: mean age within 0.5 day of five observed new and full moons', obs.every(([d, w]) => dist(meanAge(Date.parse(d)), w) < 0.5));
  check('moon: age and angle convert both ways; 90° = 7.38 days', near(ageOf(90), 7.3826, 1e-3) && near(thetaOfAge(ageOf(123)), 123, 1e-9) && near(thetaOfAge(SYNODIC), 0, 1e-9));
  check('moon: lit fraction 0 new, 0.5 quarters, 1 full, 0.25 at 60°', near(litFraction(0), 0, 1e-12) && near(litFraction(90), 0.5, 1e-12) && near(litFraction(270), 0.5, 1e-12) && near(litFraction(180), 1, 1e-12) && near(litFraction(60), 0.25, 1e-12));
  check('moon: phase names', phaseName(0) === 'New moon' && phaseName(358) === 'New moon' && phaseName(45) === 'Waxing crescent' && phaseName(92) === 'First quarter' && phaseName(150) === 'Waxing gibbous' && phaseName(180) === 'Full moon' && phaseName(200) === 'Waning gibbous' && phaseName(270) === 'Last quarter' && phaseName(300) === 'Waning crescent');
  const t5 = tithi(48.76), t15 = tithi(179.9), t16 = tithi(180), t30 = tithi(359.9);
  check('moon: tithis of 12°: 48.8° = Shukla Panchami, 180° starts Krishna Pratipada, 359.9° = Amavasya', t5.n === 5 && t5.name === 'Panchami' && t15.name === 'Purnima' && t16.n === 16 && t16.paksha === 'Krishna' && t16.name === 'Pratipada' && t30.n === 30 && t30.name === 'Amavasya');
  check('moon: full moon rises 18:00 and sets 06:00; first quarter rises at noon; 48.8 min a day', clock(riseSet(180).rise) === '18:00' && clock(riseSet(180).set) === '06:00' && clock(riseSet(90).rise) === '12:00' && near(riseSet(0).lagMin, 48.763, 1e-3));
  check('moon: lit path empty at new, right half at first quarter', litPath(0, 10) === '' && litPath(90, 10).startsWith('M0 -10A10 10 0 0 1 0 10A') && litPath(270, 10).startsWith('M0 -10A10 10 0 0 0 0 10A'));
};
