// #1296 Alloy mixer. Every alloy's own example recipe adds to 100% and is recognised as that alloy; the ranges do
// not overlap for the example recipes; carats (18 ct = 75%, 22 ct = 91.67%) and masses checked by hand.
import { ALLOYS, match, total, masses, carats, goldPercent, METALS } from '../../src/lib/sci/alloy-school.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  check('every example recipe adds to 100', ALLOYS.every((a) => near(total(a.mix), 100, 1e-9)));
  check('every example recipe is recognised as itself only', ALLOYS.every((a) => { const m = match(a.mix); return m.length === 1 && m[0].id === a.id; }));
  check('every recipe uses only listed metals', ALLOYS.every((a) => Object.keys(a.ranges).every((el) => METALS.some((m) => m.sym === el))));
  check('pure copper is not an alloy; not adding to 100 matches nothing', match({ Cu: 100 }).length === 0 && match({ Cu: 70, Zn: 20 }).length === 0);
  check('60/40 brass and 90/10 bronze', match({ Cu: 60, Zn: 40 })[0].id === 'brass' && match({ Cu: 90, Sn: 10 })[0].id === 'bronze');
  check('iron with 1% carbon is steel, 3% is cast iron', match({ Fe: 99, C: 1 })[0].id === 'steel' && match({ Fe: 97, C: 3 })[0].id === 'castiron');
  check('iron with 5% chromium is not stainless', match({ Fe: 95, Cr: 5 }).length === 0);
  check('carats', carats(75) === 18 && near(carats(91.6667), 22, 1e-3) && goldPercent(18) === 75 && near(goldPercent(22), 91.6667, 1e-4));
  const m = masses({ Cu: 70, Zn: 30 }, 250);
  check('250 g of 70/30 brass: 175 g Cu, 75 g Zn', near(m.Cu, 175) && near(m.Zn, 75));
};
