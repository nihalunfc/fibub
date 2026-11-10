// #1217 tug-of-war-forces: net force, a = F/m and s = ½at², checked by hand.
import { netForce, accel, distance, timeTo } from '../../src/lib/sci/learnj-forces.ts';
export default async (check) => {
  const near = (a, b) => Math.abs(a - b) < 1e-9;
  check('forces: 500 − 250 = 250 N', netForce([250], [250, 250]) === 250);
  check('forces: five children balance two adults', netForce([100, 100, 100, 100, 100], [250, 250]) === 0);
  check('forces: left wins is negative', netForce([250, 100], [250]) === -100);
  check('forces: a = 250/200 = 1.25', accel(250, 200) === 1.25);
  check('forces: t to 2 m = 1.7889 s', near(timeTo(2, 1.25), Math.sqrt(3.2)));
  check('forces: s = ½ × 1.25 × 2² = 2.5 m', distance(1.25, 2) === 2.5);
  check('forces: zero force never arrives', timeTo(2, 0) === Infinity);
};
