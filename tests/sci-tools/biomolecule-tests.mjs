// #1396 Biomolecule test lab. Checked against the standard school results: iodine only for starch, biuret only for
// protein, Sudan III only for fat, Benedict's only for reducing sugars and only when heated; sucrose positive only
// after acid hydrolysis; Benedict's colour scale steps at 0.5, 1 and 1.5 %; 2 % of 50 mL = 1 g.
import * as B from '../../src/lib/sci/biomolecule-tests.ts';
export default async (check) => {
  const S = (id) => B.SAMPLES.find((s) => s.id === id);
  const pos = (id, t, o = { heated: true }) => B.result(S(id), t, o).positive;
  check('food tests: water control negative for all four', ['iodine', 'benedict', 'biuret', 'sudan'].every((t) => !pos('water', t)));
  check('food tests: iodine only for starch and potato', B.SAMPLES.every((s) => pos(s.id, 'iodine') === ['starch', 'potato'].includes(s.id)));
  check('food tests: biuret for egg, milk, groundnut', B.SAMPLES.every((s) => pos(s.id, 'biuret') === ['egg', 'milk', 'peanut'].includes(s.id)));
  check('food tests: Sudan III for oil, milk, groundnut', B.SAMPLES.every((s) => pos(s.id, 'sudan') === ['oil', 'milk', 'peanut'].includes(s.id)));
  check("food tests: Benedict's for glucose and milk, only when heated", B.SAMPLES.every((s) => pos(s.id, 'benedict') === ['glucose', 'milk'].includes(s.id)) && !pos('glucose', 'benedict', { heated: false }));
  check('food tests: sucrose positive only after acid', !pos('sucrose', 'benedict') && pos('sucrose', 'benedict', { heated: true, hydrolysed: true }));
  const names = [0, 0.3, 0.7, 1.2, 2].map((p) => B.benedict(p).name.split(' ')[0]);
  check("food tests: Benedict's colour scale", names.join() === 'stays,green,yellow,orange,brick');
  check("food tests: glucose 1.0 % gives orange, 0.49 % green", B.result(S('glucose'), 'benedict', { heated: true, sugar: 1 }).name.startsWith('orange') && B.result(S('glucose'), 'benedict', { heated: true, sugar: 0.49 }).name.startsWith('green'));
  check('food tests: verdict lists nutrients', B.verdict({ iodine: false, benedict: true, biuret: true, sudan: true }).join() === 'reducing sugar,protein,fat');
  check('food tests: 2 % of 50 mL is 1 g', B.soluteGrams(2, 50) === 1);
};
