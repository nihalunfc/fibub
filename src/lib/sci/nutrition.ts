// Recipe nutrition from the user's own ingredient rows (values per 100 g from packs or labels). Adds the
// nutrients up by weight, allows for water lost in cooking, and gives values per serving and per 100 g of the
// cooked food. No food composition database is included: every number comes from the user.
import { num, parseTable } from './num.ts';

export const NUTRIENTS = [
  { id: 'kcal', name: 'Energy', unit: 'kcal' },
  { id: 'fat', name: 'Fat', unit: 'g' },
  { id: 'sat', name: 'of which saturates', unit: 'g' },
  { id: 'carb', name: 'Carbohydrate', unit: 'g' },
  { id: 'sugar', name: 'of which sugars', unit: 'g' },
  { id: 'fibre', name: 'Fibre', unit: 'g' },
  { id: 'protein', name: 'Protein', unit: 'g' },
  { id: 'salt', name: 'Salt', unit: 'g' },
] as const;
export type NutrientId = (typeof NUTRIENTS)[number]['id'];
export type Values = Record<NutrientId, number>;
export type Ingredient = { name: string; grams: number; per100: Partial<Values> };

/** kJ per kcal (thermochemical calorie). */
export const KJ_PER_KCAL = 4.184;
/** General Atwater factors, kcal per gram: protein, fat, available carbohydrate, fibre. */
export const ATWATER = { protein: 4, fat: 9, carb: 4, fibre: 2 };
/** Salt from sodium: salt = sodium × 2.5 (the usual label convention, NaCl / Na ≈ 58.44 / 22.99). */
export const SALT_PER_SODIUM = 2.5;

/** Energy (kcal) from macronutrients with the general Atwater factors. Missing values count as 0. */
export function atwater(v: Partial<Values>): number {
  return ATWATER.protein * (v.protein ?? 0) + ATWATER.fat * (v.fat ?? 0) + ATWATER.carb * (v.carb ?? 0) + ATWATER.fibre * (v.fibre ?? 0);
}

const HEAD: [RegExp, NutrientId | 'name' | 'grams' | 'kj' | 'sodium'][] = [
  [/satur/i, 'sat'], [/sugar/i, 'sugar'], [/fib/i, 'fibre'], [/carb/i, 'carb'], [/protein/i, 'protein'], [/sodium|\bna\b/i, 'sodium'],
  [/salt/i, 'salt'], [/fat|lipid/i, 'fat'], [/kj|kilojoule/i, 'kj'], [/kcal|calor|energy/i, 'kcal'],
  [/amount|gram|weight|qty|quantity|mass|^g$|\(g\)$/i, 'grams'], [/ingredient|name|food|item/i, 'name'],
];
/** The column order used when the pasted table has no header row. */
export const DEFAULT_ORDER = ['name', 'grams', 'kcal', 'fat', 'sat', 'carb', 'sugar', 'fibre', 'protein', 'salt'] as const;

export type Parsed = { items: Ingredient[]; columns: string[]; errors: string[]; missing: Partial<Record<NutrientId, string[]>> };

/** Reads pasted rows: a name, an amount in grams and values per 100 g. A header row picks the columns by name. */
export function parseRecipe(text: string): Parsed {
  const rows = parseTable(text);
  const errors: string[] = [];
  if (!rows.length) return { items: [], columns: [], errors, missing: {} };
  const isHead = rows[0].slice(1).some((c) => c !== '' && Number.isNaN(num(c)));
  let cols: string[];
  if (isHead) {
    cols = rows[0].map((h, i) => { const m = HEAD.find(([re]) => re.test(h)); return m ? m[1] : i === 0 ? 'name' : ''; });
    if (!cols.includes('grams')) errors.push('No amount column found. Name one "Amount (g)".');
  } else cols = [...DEFAULT_ORDER];
  const items: Ingredient[] = [];
  const missing: Partial<Record<NutrientId, string[]>> = {};
  for (const [r, row] of (isHead ? rows.slice(1) : rows).entries()) {
    const line = r + (isHead ? 2 : 1);
    const it: Ingredient = { name: '', grams: NaN, per100: {} };
    let kj = NaN, sodium = NaN;
    cols.forEach((c, i) => {
      const cell = (row[i] ?? '').trim();
      if (c === 'name') { it.name = cell; return; }
      if (!c || cell === '' || cell === '-' || cell === '–') return;
      const v = num(cell.replace(/\s*(g|kcal|kj|mg)$/i, ''));
      if (!Number.isFinite(v) || v < 0) { errors.push(`Row ${line}: "${cell}" is not a number.`); return; }
      if (c === 'grams') it.grams = v; else if (c === 'kj') kj = v; else if (c === 'sodium') sodium = v; else it.per100[c as NutrientId] = v;
    });
    if (!it.name) it.name = `Ingredient ${r + 1}`;
    if (it.per100.kcal === undefined && Number.isFinite(kj)) it.per100.kcal = kj / KJ_PER_KCAL;
    if (it.per100.salt === undefined && Number.isFinite(sodium)) it.per100.salt = sodium * SALT_PER_SODIUM;
    if (!(it.grams > 0)) { errors.push(`Row ${line} (${it.name}): give the amount in grams.`); continue; }
    for (const n of NUTRIENTS) if (it.per100[n.id] === undefined) (missing[n.id] ??= []).push(it.name);
    for (const [part, whole] of [['sat', 'fat'], ['sugar', 'carb']] as const) {
      const a = it.per100[part], b = it.per100[whole];
      if (a !== undefined && b !== undefined && a > b + 1e-9) errors.push(`${it.name}: ${part === 'sat' ? 'saturates' : 'sugars'} (${a}) are more than ${whole === 'fat' ? 'fat' : 'carbohydrate'} (${b}).`);
    }
    const g = ['fat', 'carb', 'fibre', 'protein', 'salt'].reduce((s, k) => s + (it.per100[k as NutrientId] ?? 0), 0);
    if (g > 100.5) errors.push(`${it.name}: the nutrients add up to ${g.toFixed(1)} g, more than 100 g per 100 g.`);
    items.push(it);
  }
  return { items, columns: cols, errors, missing };
}

export type RecipeOptions = {
  servings: number;
  /** Weight lost in cooking, % of the raw weight (water). Ignored if cookedWeight is given. */
  lossPct?: number;
  cookedWeight?: number;
  /** Work energy out from the macronutrients with the Atwater factors instead of using the label energy. */
  energyFromMacros?: boolean;
  /** Labels give total carbohydrate including fibre (US style): take fibre off before the Atwater sum. */
  carbIncludesFibre?: boolean;
};
export type RecipeResult = {
  rawWeight: number; cookedWeight: number; servingWeight: number; servings: number;
  total: Values; per100: Values; perServing: Values;
  kj: { total: number; per100: number; perServing: number };
  rows: { name: string; grams: number; total: Values; kcalShare: number }[];
};

/** Totals for the whole recipe, per serving and per 100 g of cooked food. Nutrients are assumed to stay in the food; only water is lost. */
export function recipe(items: Ingredient[], o: RecipeOptions): RecipeResult {
  if (!items.length) throw new Error('Add at least one ingredient.');
  if (!(o.servings > 0)) throw new Error('Servings must be more than 0.');
  const rawWeight = items.reduce((s, i) => s + i.grams, 0);
  const cookedWeight = o.cookedWeight && o.cookedWeight > 0 ? o.cookedWeight : rawWeight * (1 - (o.lossPct ?? 0) / 100);
  if (!(cookedWeight > 0)) throw new Error('The weight after cooking must be more than 0 (loss under 100 %).');
  const zero = () => Object.fromEntries(NUTRIENTS.map((n) => [n.id, 0])) as Values;
  const total = zero();
  const rows = items.map((it) => {
    const v = { ...it.per100 };
    if (o.carbIncludesFibre && v.carb !== undefined) v.carb = Math.max(0, v.carb - (v.fibre ?? 0));
    if (o.energyFromMacros) v.kcal = atwater(v);
    const t = zero();
    for (const n of NUTRIENTS) { t[n.id] = ((v[n.id] ?? 0) * it.grams) / 100; total[n.id] += t[n.id]; }
    return { name: it.name, grams: it.grams, total: t, kcalShare: 0 };
  });
  for (const r of rows) r.kcalShare = total.kcal > 0 ? r.total.kcal / total.kcal : 0;
  const scale = (f: number) => Object.fromEntries(NUTRIENTS.map((n) => [n.id, total[n.id] * f])) as Values;
  const per100 = scale(100 / cookedWeight), perServing = scale(1 / o.servings);
  return {
    rawWeight, cookedWeight, servingWeight: cookedWeight / o.servings, servings: o.servings, total, per100, perServing,
    kj: { total: total.kcal * KJ_PER_KCAL, per100: per100.kcal * KJ_PER_KCAL, perServing: perServing.kcal * KJ_PER_KCAL },
    rows,
  };
}

/** One value as a label shows it: energy in whole numbers, grams to one decimal (two below 0.1 g; salt to two). */
export function fmt(id: NutrientId | 'kj', v: number): string {
  if (id === 'kcal' || id === 'kj') return Math.round(v).toLocaleString('en');
  if (id === 'salt') return v.toFixed(2);
  return v > 0 && v < 0.1 ? v.toFixed(2) : v.toFixed(1);
}

/** The made-up example recipe: values are rounded example numbers, not from any database. Replace them with your own labels. */
export const EXAMPLE = `Ingredient, Amount (g), Energy (kcal), Fat, Saturates, Carbohydrate, Sugars, Fibre, Protein, Salt
Red lentils (dry), 200, 330, 1.5, 0.2, 50, 2, 11, 24, 0.05
Onion, 150, 40, 0.1, 0, 8, 6, 1.5, 1, 0.01
Carrot, 150, 35, 0.3, 0.1, 7, 5, 2.5, 0.6, 0.1
Olive oil, 20, 900, 100, 14, 0, 0, 0, 0, 0
Vegetable stock (made up), 1000, 5, 0.2, 0.1, 0.5, 0.3, 0, 0.2, 0.8`;
