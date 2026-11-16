// Grams per level US cup (236.6 ml), rounded, from USDA FoodData Central household measures (US public domain)
// where it lists one; a few (marked ~) are fibub's own working from similar foods. Packing changes these by 10-20%.
// Also used by recipe-scaler for its optional metric conversion. `k` are words that match a recipe line.
export type Ingredient = { id: string; name: string; g: number; k: string[]; group: string };
export const INGREDIENTS: Ingredient[] = [
  { id: 'water', name: 'Water', g: 237, k: ['water'], group: 'Liquids' },
  { id: 'milk', name: 'Milk (whole)', g: 244, k: ['milk'], group: 'Liquids' },
  { id: 'buttermilk', name: 'Buttermilk', g: 245, k: ['buttermilk'], group: 'Liquids' },
  { id: 'cream', name: 'Heavy cream', g: 238, k: ['cream'], group: 'Liquids' },
  { id: 'coconut-milk', name: 'Coconut milk (canned)', g: 226, k: ['coconut milk'], group: 'Liquids' },
  { id: 'veg-oil', name: 'Vegetable oil', g: 218, k: ['vegetable oil', 'oil'], group: 'Fats and oils' },
  { id: 'olive-oil', name: 'Olive oil', g: 216, k: ['olive oil'], group: 'Fats and oils' },
  { id: 'butter', name: 'Butter', g: 227, k: ['butter'], group: 'Fats and oils' },
  { id: 'peanut-butter', name: 'Peanut butter', g: 256, k: ['peanut butter'], group: 'Fats and oils' },
  { id: 'ap-flour', name: 'All-purpose flour', g: 125, k: ['all-purpose flour', 'plain flour', 'flour'], group: 'Flours and starches' },
  { id: 'bread-flour', name: 'Bread flour', g: 137, k: ['bread flour'], group: 'Flours and starches' },
  { id: 'ww-flour', name: 'Whole wheat flour', g: 120, k: ['whole wheat flour', 'wholemeal flour'], group: 'Flours and starches' },
  { id: 'almond-flour', name: 'Almond flour (~)', g: 96, k: ['almond flour', 'ground almonds'], group: 'Flours and starches' },
  { id: 'cornstarch', name: 'Cornstarch (cornflour)', g: 128, k: ['cornstarch', 'cornflour', 'corn starch'], group: 'Flours and starches' },
  { id: 'cornmeal', name: 'Cornmeal', g: 157, k: ['cornmeal', 'polenta'], group: 'Flours and starches' },
  { id: 'semolina', name: 'Semolina', g: 167, k: ['semolina'], group: 'Flours and starches' },
  { id: 'cocoa', name: 'Cocoa powder', g: 86, k: ['cocoa'], group: 'Flours and starches' },
  { id: 'breadcrumbs', name: 'Breadcrumbs (dry)', g: 108, k: ['breadcrumbs', 'bread crumbs'], group: 'Flours and starches' },
  { id: 'sugar', name: 'Granulated sugar', g: 200, k: ['granulated sugar', 'white sugar', 'caster sugar', 'sugar'], group: 'Sugars and syrups' },
  { id: 'brown-sugar', name: 'Brown sugar (packed)', g: 220, k: ['brown sugar'], group: 'Sugars and syrups' },
  { id: 'icing-sugar', name: 'Powdered (icing) sugar', g: 120, k: ['powdered sugar', 'icing sugar', 'confectioners'], group: 'Sugars and syrups' },
  { id: 'honey', name: 'Honey', g: 339, k: ['honey'], group: 'Sugars and syrups' },
  { id: 'maple', name: 'Maple syrup', g: 315, k: ['maple syrup'], group: 'Sugars and syrups' },
  { id: 'molasses', name: 'Molasses', g: 337, k: ['molasses', 'treacle'], group: 'Sugars and syrups' },
  { id: 'corn-syrup', name: 'Corn syrup', g: 328, k: ['corn syrup', 'golden syrup'], group: 'Sugars and syrups' },
  { id: 'rice', name: 'Rice (uncooked, long grain)', g: 185, k: ['rice'], group: 'Grains and pulses' },
  { id: 'cooked-rice', name: 'Rice (cooked)', g: 158, k: ['cooked rice'], group: 'Grains and pulses' },
  { id: 'oats', name: 'Rolled oats', g: 81, k: ['oats', 'oatmeal'], group: 'Grains and pulses' },
  { id: 'quinoa', name: 'Quinoa (uncooked)', g: 170, k: ['quinoa'], group: 'Grains and pulses' },
  { id: 'lentils', name: 'Lentils (dry)', g: 192, k: ['lentils', 'dal'], group: 'Grains and pulses' },
  { id: 'salt', name: 'Table salt', g: 292, k: ['salt'], group: 'Baking and seasoning' },
  { id: 'baking-soda', name: 'Baking soda', g: 220, k: ['baking soda', 'bicarbonate'], group: 'Baking and seasoning' },
  { id: 'baking-powder', name: 'Baking powder', g: 220, k: ['baking powder'], group: 'Baking and seasoning' },
  { id: 'yogurt', name: 'Yogurt (plain)', g: 245, k: ['yogurt', 'yoghurt', 'curd'], group: 'Dairy' },
  { id: 'sour-cream', name: 'Sour cream', g: 230, k: ['sour cream'], group: 'Dairy' },
  { id: 'cheddar', name: 'Cheddar (shredded)', g: 113, k: ['cheddar', 'grated cheese', 'shredded cheese'], group: 'Dairy' },
  { id: 'parmesan', name: 'Parmesan (grated)', g: 100, k: ['parmesan'], group: 'Dairy' },
  { id: 'choc-chips', name: 'Chocolate chips', g: 168, k: ['chocolate chips', 'choc chips'], group: 'Nuts, fruit and extras' },
  { id: 'almonds', name: 'Almonds (whole)', g: 143, k: ['almonds'], group: 'Nuts, fruit and extras' },
  { id: 'walnuts', name: 'Walnuts (chopped)', g: 117, k: ['walnuts'], group: 'Nuts, fruit and extras' },
  { id: 'raisins', name: 'Raisins', g: 145, k: ['raisins', 'sultanas'], group: 'Nuts, fruit and extras' },
  { id: 'coconut', name: 'Shredded coconut', g: 93, k: ['shredded coconut', 'desiccated coconut'], group: 'Nuts, fruit and extras' },
];

// Volume units in ml, weight units in g.
export const ML: Record<string, number> = { uscup: 236.588, metcup: 250, ukcup: 284.131, tbsp: 14.787, tsp: 4.929, ml: 1, floz: 29.574 };
export const G: Record<string, number> = { g: 1, oz: 28.3495, lb: 453.592 };
export const UNIT_NAMES: Record<string, string> = {
  uscup: 'US cup', metcup: 'metric cup (250 ml)', ukcup: 'UK cup (284 ml)', tbsp: 'tbsp', tsp: 'tsp', ml: 'ml', floz: 'US fl oz', g: 'g', oz: 'oz', lb: 'lb',
};
export const SHORT: Record<string, string> = { uscup: 'US cup', metcup: 'metric cup', ukcup: 'UK cup', tbsp: 'tbsp', tsp: 'tsp', ml: 'ml', floz: 'fl oz', g: 'g', oz: 'oz', lb: 'lb' };

/** Grams per ml for an ingredient. */
export const gPerMl = (ing: Ingredient) => ing.g / ML.uscup;

/** Convert an amount between any two units for one ingredient. */
export function convert(amount: number, from: string, to: string, ing: Ingredient): number {
  const grams = from in G ? amount * G[from] : amount * ML[from] * gPerMl(ing);
  return to in G ? grams / G[to] : grams / gPerMl(ing) / ML[to];
}

/** Longest keyword match for a recipe line, or undefined. */
export function findIngredient(text: string): Ingredient | undefined {
  const t = text.toLowerCase();
  let best: Ingredient | undefined, len = 0;
  for (const ing of INGREDIENTS) for (const k of ing.k) if (k.length > len && new RegExp(`\\b${k.replace(/[-]/g, '\\-')}`).test(t)) { best = ing; len = k.length; }
  return best;
}

const UFRAC: Record<string, number> = { '½': 1 / 2, '⅓': 1 / 3, '⅔': 2 / 3, '¼': 1 / 4, '¾': 3 / 4, '⅛': 1 / 8, '⅜': 3 / 8, '⅝': 5 / 8, '⅞': 7 / 8 };

/** Read a typed amount: "1.5", "1,5", "1/2", "1 1/2", "1½", "½". Returns NaN when it cannot be read. */
export function parseAmount(raw: string): number {
  const s = raw.trim().replace(/\s+/g, ' ');
  if (s === '') return NaN;
  let m = s.match(/^(\d+)\s*([½⅓⅔¼¾⅛⅜⅝⅞])$/); if (m) return +m[1] + UFRAC[m[2]];
  if (UFRAC[s] !== undefined) return UFRAC[s];
  m = s.match(/^(\d+) (\d+)\/(\d+)$/); if (m) return +m[3] === 0 ? NaN : +m[1] + +m[2] / +m[3];
  m = s.match(/^(\d+)\/(\d+)$/); if (m) return +m[2] === 0 ? NaN : +m[1] / +m[2];
  return /^-?(\d*[.,]?\d+|\d+[.,])$/.test(s) ? +s.replace(',', '.') : NaN;
}

/** Typical recipe measures for the "common measures" table: [label, unit, amount]. */
export const COMMON: [string, string, number][] = [
  ['1/4 cup', 'cup', 0.25], ['1/3 cup', 'cup', 1 / 3], ['1/2 cup', 'cup', 0.5], ['2/3 cup', 'cup', 2 / 3], ['3/4 cup', 'cup', 0.75], ['1 cup', 'cup', 1],
  ['1 tbsp', 'tbsp', 1], ['1 tsp', 'tsp', 1],
];

/** Grams and ounces of one ingredient for each common measure. `cup` is the cup unit key (uscup, metcup or ukcup). */
export function commonTable(ing: Ingredient, cup = 'uscup'): { label: string; g: number; oz: number }[] {
  return COMMON.map(([label, u, a]) => {
    const g = convert(a, u === 'cup' ? cup : u, 'g', ing);
    return { label: u === 'cup' && cup !== 'uscup' ? label.replace('cup', cup === 'metcup' ? 'metric cup' : 'UK cup') : label, g, oz: g / G.oz };
  });
}

/** The first ingredient whose name or keywords start with or contain the typed words, or undefined. */
export function searchIngredient(q: string): Ingredient | undefined {
  const t = q.toLowerCase().trim();
  if (!t) return undefined;
  return INGREDIENTS.find((i) => i.name.toLowerCase().startsWith(t)) || INGREDIENTS.find((i) => i.k.some((k) => k.startsWith(t))) ||
    INGREDIENTS.find((i) => i.name.toLowerCase().includes(t) || i.k.some((k) => k.includes(t)));
}
