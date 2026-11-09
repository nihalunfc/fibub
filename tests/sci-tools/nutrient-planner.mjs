// #485 nutrient planner: totals and energy split checked against an independent pandas implementation.
import { EXAMPLE, totals, eaten, macroEnergy, percentOf, saltG, toKcal, foodsCsv, readFoodsCsv, problem, scale } from '../../src/lib/sci/nutrients.ts';
export default async (check) => {
  const near = (a, b) => Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b));
  const t = totals(EXAMPLE), d = t.day;
  const ref = { energy: 1340, protein: 48.45, fat: 39, carbs: 190, fibre: 22.25, sugars: 39.5, sodium: 1795 };
  check('nutrients: example day totals match pandas', Object.entries(ref).every(([k, v]) => near(d[k], v)) && t.used === 6);
  const meals = { Breakfast: [285, 13, 7.1, 40], Lunch: [420, 20, 15, 48], Dinner: [560, 15, 16.6, 84], Snacks: [75, 0.45, 0.3, 18] };
  check('nutrients: per-meal subtotals match pandas', Object.entries(meals).every(([m, [e, p, f, c]]) => { const x = t.byMeal.get(m); return near(x.energy, e) && near(x.protein, p) && near(x.fat, f) && near(x.carbs, c); }));
  const m1 = macroEnergy(d, false);
  check('nutrients: 4/9/4 energy 1304.8 kcal, split 14.85 / 26.90 / 58.25 %', near(m1.total, 1304.8) && near(m1.pct.protein, 14.852851011649296) && near(m1.pct.fat, 26.900674432863276) && near(m1.pct.carbs, 58.24647455548743) && m1.fibre === 0);
  const m2 = macroEnergy(d, true);
  check('nutrients: with fibre at 2 kcal/g 1349.3 kcal, fibre 3.30 %', near(m2.total, 1349.3) && near(m2.pct.fibre, 3.298006373675239) && near(m2.pct.carbs, 56.32550211220633));
  check('nutrients: salt = sodium × 2.5 (1795 mg → 4.4875 g)', near(saltG(1795), 4.4875));
  check('nutrients: percent of target', near(percentOf(1340, 2000), 67) && Number.isNaN(percentOf(5, 0)));
  check('nutrients: kJ to kcal', near(toKcal(4184, 'kJ'), 1000) && toKcal(500, 'kcal') === 500);
  check('nutrients: per 100 g scales by grams, per serving by servings', scale(EXAMPLE[0]) === 0.5 && scale(EXAMPLE[2]) === 1 && near(eaten(EXAMPLE[0]).energy, 185));
  check('nutrients: blank values count as 0', eaten({ ...EXAMPLE[0], sugars: NaN }).sugars === 0);
  check('nutrients: problems', problem({ ...EXAMPLE[0], amount: 0 }).includes('grams') && problem({ ...EXAMPLE[2], amount: NaN }).includes('servings') && problem({ ...EXAMPLE[0], fat: -1 }).includes('Fat') && problem({ ...EXAMPLE[0], protein: 50, fat: 30, carbs: 30 }).includes('100 g') && !problem(EXAMPLE[0]));
  check('nutrients: a food with a problem is left out of totals', totals([...EXAMPLE, { ...EXAMPLE[0], amount: 0 }]).used === 6);
  const text = foodsCsv(EXAMPLE, 'kJ'), back = readFoodsCsv(text);
  check('nutrients: CSV round trip', back.unit === 'kJ' && back.foods.length === 6 && back.foods.every((f, i) => Object.keys(EXAMPLE[i]).every((k) => f[k] === EXAMPLE[i][k])));
  check('nutrients: CSV with quoted commas', readFoodsCsv('food,amount\n"Rice, cooked",200\n').foods[0].name === 'Rice, cooked');
  check('nutrients: CSV header', text.split('\n')[0] === 'meal,food,basis,amount,energy_kJ,protein_g,fat_g,carbohydrate_g,fibre_g,sugars_g,sodium_mg');
  const other = readFoodsCsv('Food;Grams;Calories;Protein;Fat;Carbs\nToast;40;260;9;3;48\n;5;;\n');
  check('nutrients: reads other column names', other.foods.length === 1 && other.skipped === 1 && other.foods[0].amount === 40 && other.foods[0].carbs === 48 && other.foods[0].basis === '100g' && other.unit === 'kcal' && Number.isNaN(other.foods[0].fibre));
  let threw = 0; for (const bad of ['only a header', 'x,y\n1,2']) { try { readFoodsCsv(bad); } catch { threw++; } }
  check('nutrients: bad CSV refused', threw === 2);
};
