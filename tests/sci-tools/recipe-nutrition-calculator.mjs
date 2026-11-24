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
  // Blog article squid-powder-burger-buns-protein-energy-atwater: Ali and El-Anany (2025), Front. Nutr. 12: 1615629
  // (CC BY 4.0). Their bun energies follow 4/9/4/2 and their ingredient energies 4/9/4; the dough mass balance does not
  // reach their measured protein.
  check('nutrition: paper bun energies follow 4/9/4/2', near(atwater({ protein: 12.13, fat: 4.08, carb: 82.06, fibre: 0.83 }), 415.14, 1e-12) && near(atwater({ protein: 17.31, fat: 4.41, carb: 76.16, fibre: 0.81 }), 415.19, 1e-12));
  check('nutrition: paper ingredient energies follow 4/9/4', near(atwater({ protein: 10.6, fat: 1.25, carb: 86.96 }), 401.49, 1e-12) && near(atwater({ protein: 78.98, fat: 3.9, carb: 13.37 }), 404.5, 1e-12));
  const dough = parseRecipe(`Ingredient, Amount (g), Energy (kcal), Fat, Saturates, Carbohydrate, Sugars, Fibre, Protein, Salt
Wheat flour (dry solids), 840.75, 401.49, 1.25, 0, 86.96, 0, 0.59, 10.6, 0
Squid powder (dry solids), 45.75, 404.5, 3.9, 0, 13.37, 0, 0, 78.98, 0
Sugar, 60, 400, 0, 0, 100, 0, 0, 0, 0
Palmolein oil, 27, 900, 100, 0, 0, 0, 0, 0, 0
Dry active yeast, 12.5, 360, 0, 0, 40, 0, 20, 40, 0
Salt, 10, 0, 0, 0, 0, 0, 0, 0, 100
Improver, 5, 400, 0, 0, 100, 0, 0, 0, 0`);
  const dw = dough.items.reduce((s, i) => s + i.grams, 0);
  const db = recipe(dough.items, { servings: 1, cookedWeight: dw, energyFromMacros: true });
  check('nutrition: squid bun dough mass balance on a dry basis', dough.errors.length === 0 && dw === 1001 && near(db.per100.protein, 13.0122727273, 1e-9) && near(db.per100.carb, 80.6426548452, 1e-9) && near(db.per100.kcal, 411.4392382617, 1e-9));

  check('nutrition: label formatting', fmt('kcal', 250.6) === '251' && fmt('salt', 2.0662) === '2.07' && fmt('fat', 0.05) === '0.05' && fmt('fat', 6.4) === '6.4');

  // Blog article amaranth-porridge-formulation-nutrition-recomputed: Mwikwabe et al. (2026), Front. Nutr. 13:
  // 1895788 (CC BY). Their four flours (carbohydrate by difference), then two of their five blends. The F1 blend
  // reproduces the protein and fat they measured on the extruded product to two decimals.
  { const F = { am: { m: 11.17, p: 17.46, f: 6.05, fib: 4.18, ash: 2.88 }, mz: { m: 9.33, p: 11.13, f: 3.33, fib: 2.17, ash: 1.14 }, sb: { m: 7.9, p: 38.29, f: 17.41, fib: 6.01, ash: 5.18 }, se: { m: 5.27, p: 25.46, f: 50.48, fib: 8.77, ash: 6.28 } };
    for (const x of Object.values(F)) { x.carb = +(100 - x.m - x.p - x.f - x.fib - x.ash).toFixed(2); x.kcal = atwater({ protein: x.p, fat: x.f, carb: x.carb, fibre: x.fib }); }
    check('nutrition: flour energies by difference and Atwater: 365.69, 370.43, 422.71, 588.66 kcal/100 g',
      near(F.am.kcal, 365.69) && near(F.mz.kcal, 370.43) && near(F.sb.kcal, 422.71) && near(F.se.kcal, 588.66) && F.se.carb === 3.74 && F.mz.carb === 72.9);
    const blend = (g) => { const t = `Ingredient, Amount (g), Energy (kcal), Fat, Saturates, Carbohydrate, Sugars, Fibre, Protein, Salt\n` +
        ['am', 'mz', 'sb', 'se'].map((k, i) => [k, g[i], F[k].kcal, F[k].f, 0, F[k].carb, 0, F[k].fib, F[k].p, 0].join(', ')).join('\n');
      const p = parseRecipe(t); if (p.errors.length) throw new Error(p.errors.join('; '));
      return recipe(p.items, { servings: 1, lossPct: 0, energyFromMacros: true }); };
    const f1 = blend([35, 45, 15, 5]), f5 = blend([40, 35, 20, 5]), f3 = blend([31, 37, 21, 11]);
    check('nutrition: F1 blend gives 387.52 kcal, 18.136 g protein, 8.7515 g fat per 100 g (their measured 18.14 and 8.75)',
      near(f1.per100.kcal, 387.5245, 1e-9) && near(f1.per100.protein, 18.136, 1e-9) && near(f1.per100.fat, 8.7515, 1e-9));
    check('nutrition: F5 blend 389.9015 kcal and 19.8105 g protein; only F3 clears the 400 kcal CSB++ minimum',
      near(f5.per100.kcal, 389.9015, 1e-9) && near(f5.per100.protein, 19.8105, 1e-9) && f3.per100.kcal >= 400 && f1.per100.kcal < 400 && f5.per100.kcal < 400); }
};
