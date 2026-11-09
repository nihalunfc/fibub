// Meal and day nutrient totals from the user's own label values. Energy from the macronutrients uses the general
// Atwater factors: protein 4, fat 9, carbohydrate 4 kcal/g, and optionally fibre 2 kcal/g (as EU Regulation
// 1169/2011 Annex XIV uses for labels). No food data is bundled.
import { num, csv } from './num.ts';

export const KJ_PER_KCAL = 4.184;
export const MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'] as const;
export type Key = 'energy' | 'protein' | 'fat' | 'carbs' | 'fibre' | 'sugars' | 'sodium';
export const NUTRIENTS: { key: Key; label: string; unit: string }[] = [
  { key: 'energy', label: 'Energy', unit: 'kcal' },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'fat', label: 'Fat', unit: 'g' },
  { key: 'carbs', label: 'Carbohydrate', unit: 'g' },
  { key: 'fibre', label: 'Fibre', unit: 'g' },
  { key: 'sugars', label: 'Sugars', unit: 'g' },
  { key: 'sodium', label: 'Sodium', unit: 'mg' },
];
export type Basis = '100g' | 'serving';
export type Food = { name: string; meal: string; basis: Basis; amount: number } & Record<Key, number>;
export type Totals = Record<Key, number>;

const zero = (): Totals => ({ energy: 0, protein: 0, fat: 0, carbs: 0, fibre: 0, sugars: 0, sodium: 0 });
/** How many label units were eaten: grams ÷ 100 for per-100 g values, or the number of servings. */
export const scale = (f: Food) => (f.basis === '100g' ? f.amount / 100 : f.amount);

export function problem(f: Food): string | undefined {
  if (!(f.amount > 0)) return f.basis === '100g' ? 'Type the grams eaten.' : 'Type the number of servings.';
  for (const n of NUTRIENTS) if (f[n.key] < 0) return `${n.label} cannot be below zero.`;
  if (f.basis === '100g' && f.protein + f.fat + f.carbs > 100.5) return 'Protein + fat + carbohydrate is more than 100 g per 100 g: check the label.';
  return undefined;
}

/** What one food adds (energy in the label's unit). Blank values count as 0. */
export function eaten(f: Food): Totals {
  const s = scale(f), t = zero();
  for (const n of NUTRIENTS) t[n.key] = (Number.isFinite(f[n.key]) ? f[n.key] : 0) * s;
  return t;
}

export function add(a: Totals, b: Totals): Totals { const t = zero(); for (const n of NUTRIENTS) t[n.key] = a[n.key] + b[n.key]; return t; }

export function totals(foods: Food[]) {
  const byMeal = new Map<string, Totals>(), ok: Food[] = [];
  let day = zero();
  for (const f of foods) {
    if (problem(f)) continue;
    ok.push(f);
    const e = eaten(f);
    day = add(day, e);
    byMeal.set(f.meal, add(byMeal.get(f.meal) ?? zero(), e));
  }
  return { day, byMeal, used: ok.length };
}

/** Energy (kcal) from the macronutrients and each one's share. */
export function macroEnergy(t: Totals, fibre2: boolean) {
  const p = 4 * t.protein, f = 9 * t.fat, c = 4 * t.carbs, fb = fibre2 ? 2 * t.fibre : 0, total = p + f + c + fb;
  const pc = (x: number) => (total > 0 ? (100 * x) / total : NaN);
  return { protein: p, fat: f, carbs: c, fibre: fb, total, pct: { protein: pc(p), fat: pc(f), carbs: pc(c), fibre: pc(fb) } };
}

export const toKcal = (energy: number, unit: 'kcal' | 'kJ') => (unit === 'kJ' ? energy / KJ_PER_KCAL : energy);
export const percentOf = (x: number, target: number) => (target > 0 ? (100 * x) / target : NaN);
/** Salt equivalent (g) from sodium (mg): salt = sodium × 2.5. */
export const saltG = (sodiumMg: number) => (sodiumMg * 2.5) / 1000;

const COLS = ['meal', 'food', 'basis', 'amount', 'energy', 'protein_g', 'fat_g', 'carbohydrate_g', 'fibre_g', 'sugars_g', 'sodium_mg'];
const cell = (x: number) => (Number.isFinite(x) ? String(x) : '');

export function foodsCsv(foods: Food[], unit: 'kcal' | 'kJ'): string {
  return csv([COLS.map((c) => (c === 'energy' ? `energy_${unit}` : c)), ...foods.map((f) => [f.meal, f.name, f.basis === '100g' ? 'per 100 g' : 'per serving', cell(f.amount), ...NUTRIENTS.map((n) => cell(f[n.key]))])]);
}

/** Rows of a CSV or TSV, with quoted cells (which may hold commas) as spreadsheets write them. */
export function parseCsv(text: string): string[][] {
  const t = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n'), first = t.split('\n')[0];
  const sep = first.includes('\t') ? '\t' : first.includes(';') ? ';' : ',';
  const rows: string[][] = []; let row: string[] = [], cur = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"') { if (t[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === sep) { row.push(cur.trim()); cur = ''; }
    else if (c === '\n') { row.push(cur.trim()); rows.push(row); row = []; cur = ''; }
    else cur += c;
  }
  if (cur || row.length) { row.push(cur.trim()); rows.push(row); }
  return rows.filter((r) => r.some((c) => c !== ''));
}

/** Read foods back from a CSV (ours, or any with similar column names). */
export function readFoodsCsv(text: string): { foods: Food[]; unit: 'kcal' | 'kJ'; skipped: number } {
  const rows = parseCsv(text);
  if (rows.length < 2) throw new Error('The file needs a header row and at least one food.');
  const head = rows[0].map((h) => h.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim());
  const find = (...names: RegExp[]) => head.findIndex((h) => names.some((r) => r.test(h)));
  const at = {
    meal: find(/^meal/), food: find(/^food|^name|^item/), basis: find(/^basis|^per$/), amount: find(/^amount|^grams|^portion|^servings|^quantity/),
    energy: find(/^energy|^kcal|^kj|^calories/), protein: find(/^protein/), fat: find(/^fat/), carbs: find(/^carb/), fibre: find(/^fib/), sugars: find(/^sugar/), sodium: find(/^sodium/),
  };
  if (at.food < 0 || at.amount < 0) throw new Error('The file needs at least a "food" and an "amount" column.');
  const unit: 'kcal' | 'kJ' = at.energy >= 0 && /kj/.test(head[at.energy]) ? 'kJ' : 'kcal';
  const foods: Food[] = []; let skipped = 0;
  for (const r of rows.slice(1)) {
    const name = (r[at.food] ?? '').trim();
    if (!name) { skipped++; continue; }
    const b = at.basis >= 0 ? (r[at.basis] ?? '').toLowerCase() : '';
    const meal = at.meal >= 0 ? MEALS.find((m) => m.toLowerCase() === (r[at.meal] ?? '').trim().toLowerCase()) ?? 'Snacks' : 'Snacks';
    const v = (i: number) => (i >= 0 ? num(r[i]) : NaN);
    foods.push({ name, meal, basis: /serv/.test(b) ? 'serving' : '100g', amount: v(at.amount), energy: v(at.energy), protein: v(at.protein), fat: v(at.fat), carbs: v(at.carbs), fibre: v(at.fibre), sugars: v(at.sugars), sodium: v(at.sodium) });
  }
  return { foods, unit, skipped };
}

/** An invented example day (made-up, rounded label values for illustration; not from any food database). */
export const EXAMPLE: Food[] = [
  { meal: 'Breakfast', name: 'Oat cereal', basis: '100g', amount: 50, energy: 370, protein: 12, fat: 7, carbs: 60, fibre: 9, sugars: 1, sodium: 10 },
  { meal: 'Breakfast', name: 'Milk', basis: '100g', amount: 200, energy: 50, protein: 3.5, fat: 1.8, carbs: 5, fibre: 0, sugars: 5, sodium: 45 },
  { meal: 'Lunch', name: 'Sandwich', basis: 'serving', amount: 1, energy: 420, protein: 20, fat: 15, carbs: 48, fibre: 5, sugars: 5, sodium: 800 },
  { meal: 'Dinner', name: 'Rice, cooked', basis: '100g', amount: 200, energy: 130, protein: 2.5, fat: 0.3, carbs: 28, fibre: 0.5, sugars: 0, sodium: 0 },
  { meal: 'Dinner', name: 'Vegetable curry', basis: 'serving', amount: 1, energy: 300, protein: 10, fat: 16, carbs: 28, fibre: 8, sugars: 9, sodium: 900 },
  { meal: 'Snacks', name: 'Apple', basis: '100g', amount: 150, energy: 50, protein: 0.3, fat: 0.2, carbs: 12, fibre: 2.5, sugars: 10, sodium: 0 },
];
