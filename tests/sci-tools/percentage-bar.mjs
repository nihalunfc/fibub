// #1242 Percentage bar. Checked against hand-worked examples (35% of 240 = 84; up 20% then down 20% is a 4% fall).
import { percentOf, whatPercent, percentChange, changeBy, overall, original } from '../../src/lib/sci/percentage-bar.ts';

const near = (a, b) => Math.abs(a - b) < 1e-9;
export default async (check) => {
  check('35% of 240 = 84; 150% of 60 = 90', near(percentOf(35, 240), 84) && near(percentOf(150, 60), 90));
  check('84 is 35% of 240; 0 of 0 is NaN', near(whatPercent(84, 240), 35) && Number.isNaN(whatPercent(1, 0)));
  check('change 80 to 100 is +25%, 100 to 80 is −20%', near(percentChange(80, 100), 25) && near(percentChange(100, 80), -20));
  check('500 up 20% = 600, then down 20% = 480', near(changeBy(500, 20), 600) && near(changeBy(600, -20), 480));
  check('up 20% then down 20% = −4% overall; order does not matter', near(overall(20, -20), -4) && near(overall(-20, 20), -4) && near(overall(10, 10), 21));
  check('up p% then down p% is always −p²/100 %', [5, 10, 25, 50, 90].every((p) => near(overall(p, -p), -(p * p) / 100)));
  check('after a 25% rise the price is 150, so it was 120', near(original(150, 25), 120) && near(original(90, -10), 100));
};
