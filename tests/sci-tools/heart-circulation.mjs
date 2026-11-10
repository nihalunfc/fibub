// #1302 Double circulation. Checked by hand: 75 beats × 70 mL = 5.25 L a minute; 5 L ÷ 5.25 L/min = 57.14 s a lap;
// 7560 L a day; humans and frogs pass through the ventricle(s) twice per lap, fish once.
import { ROUTES, CHAMBERS, heartPasses, cardiacOutput, lapSeconds, lapsPerDay, litresPerDay } from '../../src/lib/sci/circulation.ts';

export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;
  check('circulation: cardiac output 75 × 70 mL = 5.25 L/min', near(cardiacOutput(75, 70), 5.25));
  check('circulation: lap 57.14 s, 7560 L and 1512 laps a day', near(lapSeconds(75, 70), 57.142857142857, 1e-9) && near(litresPerDay(75, 70), 7560) && near(lapsPerDay(75, 70), 1512));
  check('circulation: double heart rate halves the lap', near(lapSeconds(150, 70), lapSeconds(75, 70) / 2) && lapSeconds(0, 70) === Infinity);
  check('circulation: passes through the heart', heartPasses('human') === 2 && heartPasses('frog') === 2 && heartPasses('fish') === 1);
  check('circulation: chambers 4, 3, 2', CHAMBERS.human === 4 && CHAMBERS.frog === 3 && CHAMBERS.fish === 2);
  const h = ROUTES.human;
  check('circulation: human oxygen only changes in lungs and body', h.find((p) => p.id === 'pa').o2 === 'de' && h.find((p) => p.id === 'pv').o2 === 'ox' && h.find((p) => p.id === 'lv').o2 === 'ox' && h.find((p) => p.id === 'rv').o2 === 'de' && !h.some((p) => p.o2 === 'mix'));
  check('circulation: frog mixes in the ventricle, fish heart holds only oxygen-poor blood', ROUTES.frog.filter((p) => p.o2 === 'mix').length >= 2 && ROUTES.fish.filter((p) => ['a', 'v'].includes(p.id)).every((p) => p.o2 === 'de'));
};
