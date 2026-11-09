// #486 glycaemic load: checked against an independent pandas/numpy implementation (np.average weighted by carbohydrate).
import { meal, available, glOf, giBand, glBand, EXAMPLE, validate } from '../../src/lib/sci/glycaemic.ts';
export default async (check) => {
  const near = (a, b) => Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b));
  const m = meal(EXAMPLE, false);
  check('glycaemic: example carbs 64 g, GL 32, meal GI 50', near(m.carb, 64) && near(m.gl, 32) && near(m.gi, 50));
  check('glycaemic: example food GLs 16.5, 12, 3.5', m.rows.map((r) => r.gl).every((g, i) => near(g, [16.5, 12, 3.5][i])));
  const s = meal(EXAMPLE, true);
  check('glycaemic: subtracting fibre gives 57.25 g, GL 28.4375, GI 49.6725', near(s.carb, 57.25) && near(s.gl, 28.4375) && near(s.gi, 49.672489082969435));
  const cases = [
    [{ gi: [95, 66, 71, 90, 62], carbs: [18.0, 24.0, 69.9, 0.4, 65.7], fibre: [8.0, 4.7, 3.0, 2.8, 2.5], portion: [314, 396, 189, 201, 211] }, 367.621, 252.72383, 68.74575445907607],
    [{ gi: [62, 59, 55, 99, 82], carbs: [49.8, 79.1, 17.2, 12.8, 49.0], fibre: [0.4, 0.4, 5.1, 4.7, 9.2], portion: [321, 332, 259, 187, 215] }, 551.914, 354.87282, 64.29857187895216],
    [{ gi: [33, 54, 44, 32, 99], carbs: [15.4, 55.4, 16.0, 29.6, 0.3], fibre: [8.3, 1.5, 2.7, 8.8, 5.1], portion: [24, 377, 341, 289, 263] }, 310.372, 149.4831, 48.16255976698928],
  ];
  cases.forEach(([d, c, g, gi], k) => {
    const foods = d.gi.map((_, i) => ({ name: `f${i}`, gi: d.gi[i], carbs: d.carbs[i], fibre: d.fibre[i], portion: d.portion[i] }));
    const r = meal(foods, true);
    check(`glycaemic: random meal ${k + 1} matches numpy (carb ${c}, GL ${g}, GI ${gi})`, near(r.carb, c) && near(r.gl, g) && near(r.gi, gi));
  });
  check('glycaemic: fibre above carbs gives 0 g, not negative', available({ gi: 50, carbs: 0.4, fibre: 2.8, portion: 100 }, true) === 0);
  check('glycaemic: GL = GI × carb / 100', glOf(70, 30) === 21);
  check('glycaemic: GI bands 55/56/69/70', giBand(55) === 'low' && giBand(56) === 'medium' && giBand(69) === 'medium' && giBand(70) === 'high');
  check('glycaemic: GL bands 10/11/19/20', glBand(10) === 'low' && glBand(11) === 'medium' && glBand(19.9) === 'medium' && glBand(20) === 'high');
  check('glycaemic: bad rows flagged and left out', (() => { const r = meal([...EXAMPLE, { name: 'x', gi: 150, carbs: 10, fibre: 0, portion: 100 }], false); return r.rows[3].error && near(r.gl, 32); })());
  check('glycaemic: validation messages', validate({ gi: 50, carbs: 120, fibre: 0, portion: 10 }).includes('Carbohydrate') && validate({ gi: 50, carbs: 10, fibre: 0, portion: 0 }).includes('Portion') && !validate(EXAMPLE[0]));
  check('glycaemic: no carbohydrate gives no meal GI', Number.isNaN(meal([{ name: 'egg', gi: 0, carbs: 0, fibre: 0, portion: 50 }], false).gi));
};
