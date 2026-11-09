// #391 Recipe nutrition calculator. Expected values from an independent numpy sum (scratch nut.py) on the example.
import { parseRecipe, recipe, atwater, fmt, EXAMPLE, KJ_PER_KCAL } from '../../src/lib/sci/nutrition.ts';
export default async (check) => {
  const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t * Math.max(1, Math.abs(b));
  const p = parseRecipe(EXAMPLE);
  check('nutrition: example parses 5 rows, no errors', p.items.length === 5 && p.errors.length === 0 && p.items[3].per100.fat === 100);
  const r = recipe(p.items, { servings: 4, lossPct: 15 });
  check('nutrition: raw and cooked weight', r.rawWeight === 1520 && near(r.cookedWeight, 1292));
  check('nutrition: totals match numpy', near(r.total.kcal, 1002.5) && near(r.total.fat, 25.6) && near(r.total.sat, 4.35) && near(r.total.carb, 127.5) && near(r.total.salt, 8.265) && near(r.total.protein, 52.4));
  check('nutrition: per 100 g cooked', near(r.per100.kcal, 77.5929, 1e-5) && near(r.per100.protein, 4.0557, 1e-4) && near(r.per100.salt, 0.6397, 1e-3));
  check('nutrition: per serving', near(r.perServing.kcal, 250.625) && near(r.perServing.carb, 31.875) && near(r.perServing.salt, 2.066, 1e-3) && near(r.servingWeight, 323));
  check('nutrition: kJ', near(r.kj.perServing, 250.625 * KJ_PER_KCAL));
  const a = recipe(p.items, { servings: 4, lossPct: 15, energyFromMacros: true });
  check('nutrition: Atwater energy', near(a.total.kcal, 1006) && near(a.perServing.kcal, 251.5) && atwater({ protein: 10, fat: 10, carb: 10, fibre: 10 }) === 190);
  const u = recipe(p.items, { servings: 4, lossPct: 15, energyFromMacros: true, carbIncludesFibre: true });
  check('nutrition: US-style carbohydrate includes fibre', near(u.total.kcal, 894) && near(u.total.carb, 99.5));
  check('nutrition: cooked weight given wins', near(recipe(p.items, { servings: 2, lossPct: 50, cookedWeight: 1000 }).per100.kcal, 100.25));
  check('nutrition: shares add to 1', near(r.rows.reduce((s, x) => s + x.kcalShare, 0), 1));
  const k = parseRecipe('Food, Amount (g), Energy (kJ), Sodium\nA, 50, 418.4, 1');
  check('nutrition: kJ and sodium columns', near(k.items[0].per100.kcal, 100) && near(k.items[0].per100.salt, 2.5) && k.missing.protein?.[0] === 'A');
  const n = parseRecipe('Oats 100 380 7 1.2 60 1 10 13 0');
  check('nutrition: no header uses the default order', n.items[0].grams === 100 && n.items[0].per100.kcal === 380 && n.items[0].per100.salt === 0);
  const bad = parseRecipe('Ingredient, Amount (g), Fat, Saturates\nX, , 1, 2\nY, 10, 5, 6');
  check('nutrition: bad rows explained', bad.errors.some((e) => e.includes('give the amount')) && bad.errors.some((e) => e.includes('saturates (6) are more than fat')) && bad.items.length === 1);
  check('nutrition: over 100 g per 100 g flagged', parseRecipe('Ingredient, Amount (g), Fat, Protein\nZ, 10, 80, 30').errors[0].includes('110.0 g'));
  let thrown = ''; try { recipe(p.items, { servings: 4, lossPct: 100 }); } catch (e) { thrown = e.message; }
  check('nutrition: 100 % loss refused', thrown.includes('more than 0'));
  check('nutrition: label formatting', fmt('kcal', 250.6) === '251' && fmt('salt', 2.0662) === '2.07' && fmt('fat', 0.05) === '0.05' && fmt('fat', 6.4) === '6.4');
};
