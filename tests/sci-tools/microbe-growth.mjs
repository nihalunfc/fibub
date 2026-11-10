// #1213 microbe-growth: cardinal temperature model and logistic + heat-death simulation, checked against an
// independent Python implementation written for the tests.
import { MICROBES, tempFactor, soluteFactor, killRate, simulate, doublingTime, doubling } from '../../src/lib/sci/learnj-microbe.ts';
export default async (check) => {
  const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  const [food, curd, yeast] = MICROBES;
  check('microbe: CTMI is 1 at the best temperature', near(tempFactor(37, food), 1));
  check('microbe: CTMI 0.57566 at 25 °C (Python)', near(tempFactor(25, food), 0.5756578947368421));
  check('microbe: CTMI 0 at and beyond the limits', tempFactor(5, food) === 0 && tempFactor(46, food) === 0 && tempFactor(60, food) === 0);
  check('microbe: food at 30 °C doubles every 24.70 min (Python)', near(doublingTime(food, 30, 0, 0), 24.704, 1e-4));
  check('microbe: food 30 °C, 4 h: 84,038 (Python)', near(simulate(food, 30, 0, 0, 100, 240)[240], 84038.39530708049));
  check('microbe: fridge 4 °C: no growth', simulate(food, 4, 0, 0, 100, 240)[240] === 100);
  check('microbe: curd 40 °C, 12 h: 409,432 (Python)', near(simulate(curd, 40, 0, 0, 100, 720)[720], 409432.3374578083));
  check('microbe: yeast 30 °C, 4 h: 610.52 (Python)', near(simulate(yeast, 30, 0, 0, 100, 240)[240], 610.5197106881579));
  check('microbe: boiling kills within a minute', simulate(food, 100, 0, 0, 100, 1)[1] < 1e-6);
  check('microbe: one in ten survive 10 min at 60 °C', near(Math.exp(-killRate(60) * 10), 0.1));
  check('microbe: salt at the limit stops growth', soluteFactor(10, 10) === 0 && !Number.isFinite(doublingTime(food, 30, 12, 0)));
  check('microbe: never above the 10⁹ limit', Math.max(...simulate(food, 37, 0, 0, 100, 720)) <= 1e9);
  check('microbe: 100 × 2^(60/20) = 800', near(doubling(100, 60, 20), 800));
};
