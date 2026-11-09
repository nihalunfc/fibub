// Glycaemic load (Salmerón et al. 1997; Foster-Powell, Holt & Brand-Miller 2002): GL = GI × available carbohydrate (g) / 100.
// A meal's GI is the carbohydrate-weighted mean of its foods' GI (Wolever & Jenkins 1986), so meal GL = sum of food GLs.

export type Food = { name: string; gi: number; carbs: number; fibre: number; portion: number };
export type FoodResult = Food & { avail: number; gl: number; error?: string };

/** Available carbohydrate in the portion (g). Carbs and fibre are per 100 g; subtract fibre when the label's carbs include it. */
export function available(f: Food, subtractFibre: boolean): number {
  const per100 = f.carbs - (subtractFibre ? f.fibre || 0 : 0);
  return Math.max(0, per100) * f.portion / 100;
}
export const glOf = (gi: number, availG: number) => (gi * availG) / 100;

export function validate(f: Food): string | undefined {
  if (!(f.gi >= 0 && f.gi <= 110)) return 'GI should be between 0 and 110 (glucose = 100).';
  if (!(f.carbs >= 0 && f.carbs <= 100)) return 'Carbohydrate per 100 g should be between 0 and 100.';
  if (!(f.fibre >= 0 && f.fibre <= 100)) return 'Fibre per 100 g should be between 0 and 100.';
  if (!(f.portion > 0 && f.portion <= 5000)) return 'Portion should be between 0 and 5000 g.';
  return undefined;
}

export function meal(foods: Food[], subtractFibre: boolean) {
  const rows: FoodResult[] = foods.map((f) => {
    const error = validate(f);
    if (error) return { ...f, avail: NaN, gl: NaN, error };
    const avail = available(f, subtractFibre);
    return { ...f, avail, gl: glOf(f.gi, avail) };
  });
  const ok = rows.filter((r) => !r.error);
  const carb = ok.reduce((s, r) => s + r.avail, 0), gl = ok.reduce((s, r) => s + r.gl, 0);
  const gi = carb > 0 ? (100 * gl) / carb : NaN; // = Σ GIᵢ·carbᵢ / Σ carbᵢ
  return { rows, carb, gl, gi };
}

// Usual bands: GI low ≤ 55, medium 56 to 69, high ≥ 70; GL per serving low ≤ 10, medium 11 to 19, high ≥ 20.
export const giBand = (gi: number) => (gi <= 55 ? 'low' : gi < 70 ? 'medium' : 'high');
export const glBand = (gl: number) => (gl <= 10 ? 'low' : gl < 20 ? 'medium' : 'high');

/** Rough example foods with rounded, approximate GI values (not from any table); the user replaces them. */
export const EXAMPLE: Food[] = [
  { name: 'Porridge, cooked', gi: 55, carbs: 12, fibre: 1.5, portion: 250 },
  { name: 'Banana', gi: 50, carbs: 20, fibre: 2.5, portion: 120 },
  { name: 'Milk', gi: 35, carbs: 5, fibre: 0, portion: 200 },
];
