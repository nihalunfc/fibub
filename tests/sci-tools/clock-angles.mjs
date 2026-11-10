// #1285 Clock hand angles. Checked by hand (3:00 → 90°, 6:00 → 180°, 3:30 → 75°, 9:45 → 22.5°) and against
// Python/sympy: the hands are at right angles 22 times in 12 hours (first at 16 4/11 min past 12) and overlap
// every 65 5/11 minutes.
import { hands, between, formula, timesAtAngle, clockText } from '../../src/lib/sci/clock-school.ts';
export default async (check) => {
  check('clock: 3:00 is 90°, 6:00 is 180°, 12:00 is 0°', between(3, 0).small === 90 && between(6, 0).small === 180 && between(12, 0).small === 0);
  check('clock: 3:30 is 75°, 9:45 is 22.5°, reflex 337.5°', between(3, 30).small === 75 && between(9, 45).small === 22.5 && between(9, 45).reflex === 337.5);
  check('clock: hour hand at 2:20 is 70°, minute hand 120°', hands(2, 20).hour === 70 && hands(2, 20).minute === 120);
  check('clock: formula |30h − 5.5m| for 4:20 is 10', formula(4, 20) === 10 && between(4, 20).small === 10);
  const r = timesAtAngle(90);
  check('clock: right angle 22 times in 12 h, first at 16.3636 min (sympy)', r.length === 22 && Math.abs(r[0] - 180 / 11) < 1e-6 && Math.abs(r[1] - 540 / 11) < 1e-6);
  const o = timesAtAngle(0);
  check('clock: hands overlap 11 times in 12 h, every 65 5/11 min', o.length === 11 && Math.abs(o[1] - 720 / 11) < 1e-6);
  check('clock: straight line 11 times', timesAtAngle(180).length === 11);
  check('clock: 65.4545 min is "1:05 and 27 s"', clockText(720 / 11) === '1:05 and 27 s' && clockText(0) === '12:00' && clockText(90) === '1:30');
  let ok = true;
  for (const t of r) { const h = Math.floor(t / 60), m = t - 60 * h; if (Math.abs(between(h, m).small - 90) > 1e-6) ok = false; }
  check('clock: every right-angle time really gives 90°', ok);
};
