// #1283 Clock and turn angles. Hand angles checked by hand at well-known times (3:00 → 90°, 6:00 → 180°,
// 3:30 → 75°, 10:10 → 115°, 12:00 → 0°); the times the hands make a given angle checked against brute force over
// every second of 12 hours (Python gives 22 right-angle times and 11 overlaps), and compass turns.
import { hands, between, kind, timesAt, clockText, facing, turnWords, wrap } from '../../src/lib/sci/clock-school.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  check('3:00 is 90°, 6:00 is 180°, 12:00 is 0°', between(3, 0).small === 90 && between(6, 0).small === 180 && between(12, 0).small === 0);
  check('3:30 is 75°, 10:10 is 115°, 9:45 is 22.5°', near(between(3, 30).small, 75) && near(between(10, 10).small, 115) && near(between(9, 45).small, 22.5));
  check('reflex 360 − small', between(3, 30).reflex === 285);
  check('hands at 2:20: hour 70°, minute 120°', hands(2, 20).hour === 70 && hands(2, 20).minute === 120);
  check('kinds', kind(30) === 'acute' && kind(90) === 'right angle' && kind(120) === 'obtuse' && kind(180) === 'straight angle' && kind(200) === 'reflex' && kind(0) === 'zero angle' && kind(360) === 'full turn');
  check('22 right angles and 11 overlaps and 11 straight lines in 12 hours', timesAt(90).length === 22 && timesAt(0).length === 11 && timesAt(180).length === 11);
  check('first right angle 12:16:22, overlap 1:05:27', clockText(timesAt(90)[0]) === '12:16:22' && clockText(timesAt(0)[1]) === '1:05:27' && clockText(timesAt(180)[0]) === '12:32:44');
  let ok = true;
  for (const a of [0, 30, 45, 90, 120, 150, 180]) for (const t of timesAt(a)) { const h = Math.floor(t / 60), m = t - 60 * h; if (!near(between(h, m).small, a, 1e-7)) ok = false; }
  // Brute force: count sign changes of (small − a) over every second.
  const brute = (a) => { let n = 0, prev = null; for (let s = 0; s <= 43200; s++) { const t = s / 60, h = Math.floor(t / 60), d = between(h, t - 60 * h).small - a; if (prev !== null && ((prev < 0 && d >= 0) || (prev > 0 && d <= 0))) n++; prev = d; } return n; };
  check('every listed time really gives the angle', ok);
  check('brute force agrees for 30° (22) and 150° (22)', brute(30) === 22 && timesAt(30).length === 22 && brute(150) === 22 && timesAt(150).length === 22);
  check('no times for 200°', timesAt(200).length === 0);
  check('facing', facing(0, 90).name === 'east' && facing(0, -90).name === 'west' && facing(0, 450).name === 'east' && facing(90, 135).name === 'south-west' && facing(0, 30).name === null && facing(0, 30).bearing === 30);
  check('turn words', turnWords(90) === 'a quarter turn clockwise' && turnWords(-180) === 'a half turn anticlockwise' && turnWords(270) === 'three quarters of a turn clockwise' && turnWords(630) === '1 ¾ turns clockwise' && turnWords(720) === '2 turns clockwise' && turnWords(360) === '1 turn clockwise' && turnWords(0) === 'no turn' && turnWords(60) === '0.1667 of a turn clockwise');
  check('wrap', wrap(-90) === 270 && wrap(370) === 10);
};
