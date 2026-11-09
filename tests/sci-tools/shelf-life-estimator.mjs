// #392 Water activity and shelf-life estimator. Expected values from scipy.stats.linregress (scratch sl.py).
import { q10Shift, q10From, q10FromEa, fitShelf, awFromErh, norrish } from '../../src/lib/sci/shelflife.ts';
export default async (check) => {
  const near = (a, b, t = 1e-6) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  check('shelf life: Q10 shift colder', near(q10Shift(180, 25, 5, 2.5), 1125) && near(q10Shift(180, 25, 40, 2), 63.6396103));
  check('shelf life: Q10 from two points and back', near(q10From(180, 25, 75, 35), 2.4) && near(q10Shift(180, 25, 35, 2.4), 75));
  const f = fitShelf([{ T: 25, t: 180 }, { T: 35, t: 75 }, { T: 45, t: 32 }]);
  check('shelf life: Q10 fit matches scipy', near(f.q10, 2.3717082451) && near(f.q10Line.r2, 0.99993715687) && near(f.predictQ10(5), 1008.5057355) && near(f.predictQ10(20), 276.11276013));
  check('shelf life: Arrhenius Ea matches scipy', near(f.Ea, 68097.4582047) && near(f.arrLine.r2, 0.99988322685) && near(f.predictArr(5), 1304.24193415) && near(f.predictArr(20), 289.080221348));
  check('shelf life: Q10 from Ea at 20 °C', near(q10FromEa(f.Ea, 20), 2.5133446269));
  const two = fitShelf([{ T: 25, t: 180 }, { T: 35, t: 75 }]);
  check('shelf life: two points fit exactly', near(two.q10, 2.4) && two.q10Line.r2 === 1 && near(two.predictArr(35), 75));
  let e = ''; try { fitShelf([{ T: 30, t: 10 }, { T: 30, t: 20 }]); } catch (x) { e = x.message; }
  check('shelf life: one temperature refused', e.includes('two different temperatures'));
  e = ''; try { q10Shift(0, 25, 5, 2); } catch (x) { e = x.message; } check('shelf life: zero shelf life refused', e.includes('more than 0'));
  check('water activity: from ERH', awFromErh(75) === 0.75);
  check('water activity: Norrish with K = 0 is Raoult', near(norrish(100, 60, 342.3, 0).aw, 0.9693890555) && near(norrish(100, 60, 342.3, 6).aw, 0.96395426818) && norrish(100, 0, 58.44, 3).aw === 1);
};
