// Biomolecule test lab (Learn #1396): the classic school food tests. No DOM. Which samples contain what, and the
// colours each test gives, are general school-lab knowledge. The Benedict's colour scale for reducing sugar is the
// usual rough guide (blue none; green trace about 0.1-0.5 %; yellow 0.5-1 %; orange 1-1.5 %; brick red above
// about 1.5 %). Colours are drawn approximately.

export type Nutrient = 'starch' | 'reducing' | 'sucrose' | 'protein' | 'fat';
export type Sample = { id: string; name: string; has: Nutrient[]; sugar?: number };
export const SAMPLES: Sample[] = [
  { id: 'water', name: 'Distilled water (control)', has: [] },
  { id: 'glucose', name: 'Glucose solution', has: ['reducing'], sugar: 1 },
  { id: 'sucrose', name: 'Sucrose (table sugar) solution', has: ['sucrose'] },
  { id: 'starch', name: 'Starch solution', has: ['starch'] },
  { id: 'egg', name: 'Egg white in water', has: ['protein'] },
  { id: 'oil', name: 'Vegetable oil', has: ['fat'] },
  { id: 'milk', name: 'Milk', has: ['protein', 'fat', 'reducing'], sugar: 1.2 },
  { id: 'potato', name: 'Potato, crushed in water', has: ['starch'] },
  { id: 'peanut', name: 'Groundnut, crushed in water', has: ['protein', 'fat'] },
];

export type TestId = 'iodine' | 'benedict' | 'biuret' | 'sudan';
export const TESTS: { id: TestId; name: string; finds: string; reagent: string; start: string; needsHeat?: boolean }[] = [
  { id: 'iodine', name: 'Iodine test', finds: 'starch', reagent: 'a few drops of iodine solution', start: '#c98a2b' },
  { id: 'benedict', name: "Benedict's test", finds: 'reducing sugars (glucose, fructose, lactose, maltose)', reagent: "an equal volume of Benedict's solution, then heat in a hot water bath", start: '#2f6fd6', needsHeat: true },
  { id: 'biuret', name: 'Biuret test', finds: 'proteins', reagent: 'sodium hydroxide, then a few drops of copper sulphate', start: '#6d9ee8' },
  { id: 'sudan', name: 'Sudan III test', finds: 'fats and oils', reagent: 'a few drops of Sudan III stain, then shake', start: '#d9534a' },
];

/** Benedict's colour for a reducing-sugar strength in % (rough guide). */
export function benedict(pct: number): { colour: string; name: string } {
  if (pct <= 0) return { colour: '#2f6fd6', name: 'stays blue' };
  if (pct < 0.5) return { colour: '#4f9a4a', name: 'green (trace)' };
  if (pct < 1) return { colour: '#d8c22a', name: 'yellow (a little)' };
  if (pct < 1.5) return { colour: '#e0802a', name: 'orange (a fair amount)' };
  return { colour: '#a8361e', name: 'brick red (a lot)' };
}

export type Result = { colour: string; name: string; positive: boolean; layer?: boolean; note?: string };
/** The result of a test on a sample. `sugar` overrides the reducing-sugar % (for the glucose slider); `hydrolysed`
 *  means sucrose was first boiled with dilute acid and neutralised, splitting it into glucose and fructose. */
export function result(s: Sample, t: TestId, opts: { heated?: boolean; sugar?: number; hydrolysed?: boolean } = {}): Result {
  const has = (n: Nutrient) => s.has.includes(n);
  if (t === 'iodine') return has('starch') ? { colour: '#1b1f3a', name: 'blue-black', positive: true } : { colour: '#c98a2b', name: 'stays orange-brown', positive: false };
  if (t === 'biuret') return has('protein') ? { colour: '#7b3fa6', name: 'violet (purple)', positive: true } : { colour: '#6d9ee8', name: 'stays blue', positive: false };
  if (t === 'sudan') return has('fat') ? { colour: '#d9534a', name: 'red-stained oily layer on top', positive: true, layer: true } : { colour: '#e9a39e', name: 'no red layer (stain mixes in, pale)', positive: false };
  if (!opts.heated) return { colour: '#2f6fd6', name: 'stays blue (not heated yet)', positive: false, note: "Benedict's only works when heated." };
  let pct = has('reducing') ? (opts.sugar ?? s.sugar ?? 1) : 0;
  if (has('sucrose') && opts.hydrolysed) pct = 1.5;
  const b = benedict(pct);
  return { ...b, positive: pct > 0, note: has('sucrose') && !opts.hydrolysed ? 'Sucrose is not a reducing sugar, so it stays blue. Boil it with dilute acid first to split it.' : undefined };
}

/** What a set of positive tests tells you. */
export function verdict(results: Partial<Record<TestId, boolean>>) {
  const out: string[] = [];
  if (results.iodine) out.push('starch'); if (results.benedict) out.push('reducing sugar'); if (results.biuret) out.push('protein'); if (results.sudan) out.push('fat');
  return out;
}

/** Mass of solute (g) for a volume (mL) of a % (w/v) solution. */
export const soluteGrams = (pct: number, mL: number) => (pct * mL) / 100;
