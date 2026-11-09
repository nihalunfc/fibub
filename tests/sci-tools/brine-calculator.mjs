// #394 Brine, cure and fermentation salt calculator. Expected values worked by hand and in Python (scratch br.py).
import { saltForBrine, brineStrength, salFromPct, pctFromSal, equilibrium, dryCure, cureForPpm, ppmFromCure } from '../../src/lib/sci/brine.ts';
export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  check('brine: 5 % of total from 1 kg water', near(saltForBrine(1000, 5, 'total'), 52.631578947));
  check('brine: 5 % of water', near(saltForBrine(1000, 5, 'water'), 50));
  const b = brineStrength(60, 940);
  check('brine: strength both ways and salinometer', near(b.pctTotal, 6) && near(b.pctWater, 6.3829787234) && near(b.sal, 22.727272727) && !b.saturated);
  check('brine: round trip', near(brineStrength(saltForBrine(800, 12, 'total'), 800).pctTotal, 12));
  check('brine: saturated flag', brineStrength(400, 1000).saturated && near(salFromPct(26.4), 100) && near(pctFromSal(50), 13.2));
  const e = equilibrium(1000, 500, 2);
  check('brine: equilibrium salt for a ferment', near(e.salt, 30) && near(e.ofAll, 1.9607843137));
  const d = dryCure(2000, 2.5, 1);
  check('brine: dry cure', near(d.salt, 50) && near(d.sugar, 20));
  const c = cureForPpm(2000, 10, 100);
  check('brine: cure for a target ppm', near(c.cure, 2) && near(c.nitriteMg, 200));
  check('brine: ppm from cure', near(ppmFromCure(2000, 10, 3), 150) && near(ppmFromCure(1000, 6, cureForPpm(1000, 6, 123).cure), 123));
  let m = ''; try { cureForPpm(1000, 0, 100); } catch (x) { m = x.message; } check('brine: cure needs a nitrite %', m.includes('more than 0'));
  m = ''; try { saltForBrine(1000, 100, 'total'); } catch (x) { m = x.message; } check('brine: 100 % of total refused', m.includes('under 100'));
};
