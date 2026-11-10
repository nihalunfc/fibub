// #1294 Water of crystallisation: molar masses of hydrated salts from IUPAC standard atomic weights, the mass of
// water in a sample, and finding x in salt·xH₂O from weighings before and after heating to constant mass. A small
// model of a heating run (each heating drives off a share of the water left) for the virtual practical. No DOM.

/** IUPAC standard atomic weights (abridged / conventional values) for the elements used here. */
export const AW: Record<string, number> = { H: 1.008, C: 12.011, O: 15.999, Na: 22.99, Mg: 24.305, S: 32.06, Cl: 35.45, Ca: 40.078, Fe: 55.845, Co: 58.933, Cu: 63.546, Zn: 65.38, Ba: 137.33 };

/** Molar mass of a formula given as element counts, e.g. { Cu: 1, S: 1, O: 4 }. */
export const molar = (f: Record<string, number>) => Object.entries(f).reduce((s, [el, n]) => s + AW[el] * n, 0);
export const WATER = molar({ H: 2, O: 1 });

export type Salt = { id: string; name: string; anhydrous: string; f: Record<string, number>; x: number; wet: string; dry: string; note: string };
export const SALTS: Salt[] = [
  { id: 'cuso4', name: 'Copper(II) sulfate (blue vitriol)', anhydrous: 'CuSO₄', f: { Cu: 1, S: 1, O: 4 }, x: 5, wet: '#2b7fd4', dry: '#e8e6dc', note: 'Blue crystals turn white. Add a drop of water to the white powder and the blue comes back, with heat given out.' },
  { id: 'feso4', name: 'Iron(II) sulfate (green vitriol)', anhydrous: 'FeSO₄', f: { Fe: 1, S: 1, O: 4 }, x: 7, wet: '#7fbf6a', dry: '#e9e4cf', note: 'Pale green crystals lose water and turn off-white. Heated strongly, the dry salt breaks down further into iron(III) oxide, sulfur dioxide and sulfur trioxide, so stop at gentle heat for this practical.' },
  { id: 'na2co3', name: 'Sodium carbonate (washing soda)', anhydrous: 'Na₂CO₃', f: { Na: 2, C: 1, O: 3 }, x: 10, wet: '#f4f4f0', dry: '#ffffff', note: 'Clear crystals of washing soda lose water even in dry air and crumble to a white powder (soda ash).' },
  { id: 'mgso4', name: 'Magnesium sulfate (Epsom salt)', anhydrous: 'MgSO₄', f: { Mg: 1, S: 1, O: 4 }, x: 7, wet: '#f2f2ee', dry: '#ffffff', note: 'Colourless crystals turn to a white powder.' },
  { id: 'cocl2', name: 'Cobalt(II) chloride', anhydrous: 'CoCl₂', f: { Co: 1, Cl: 2 }, x: 6, wet: '#d0558a', dry: '#2f5bd0', note: 'Pink crystals turn blue when dry. Paper soaked in it is used to test for water: blue turns pink.' },
  { id: 'bacl2', name: 'Barium chloride', anhydrous: 'BaCl₂', f: { Ba: 1, Cl: 2 }, x: 2, wet: '#f4f4f0', dry: '#ffffff', note: 'Colourless crystals lose two waters. Barium salts are poisonous; this one stays virtual.' },
  { id: 'caso4', name: 'Calcium sulfate (gypsum)', anhydrous: 'CaSO₄', f: { Ca: 1, S: 1, O: 4 }, x: 2, wet: '#f1efe8', dry: '#ffffff', note: 'Heated gently to about 373 K, gypsum loses only 1½ waters and becomes plaster of Paris, CaSO₄·½H₂O. Stronger heating removes all the water (dead-burnt plaster).' },
];

export const anhydrousMass = (s: Salt) => molar(s.f);
export const hydratedMass = (s: Salt) => molar(s.f) + s.x * WATER;
/** Percentage of water by mass in the hydrated salt. */
export const percentWater = (s: Salt) => (100 * s.x * WATER) / hydratedMass(s);

/** x from the mass of hydrated salt and of the dry (anhydrous) salt left after heating. */
export function findX(mHydrated: number, mDry: number, Mdry: number): { water: number; molWater: number; molSalt: number; x: number } | null {
  if (!(mHydrated > 0) || !(mDry > 0) || mDry > mHydrated || !(Mdry > 0)) return null;
  const water = mHydrated - mDry, molWater = water / WATER, molSalt = mDry / Mdry;
  return { water, molWater, molSalt, x: molWater / molSalt };
}

/**
 * Model heating run: each heating drives off `share` of the water still in the sample. Returns the sample mass after
 * each of `n` heatings. The water left after k heatings is (1 − share)^k of the starting water.
 */
export function heatRun(s: Salt, sample: number, n: number, share = 0.65): number[] {
  const water = (sample * s.x * WATER) / hydratedMass(s), dry = sample - water;
  return Array.from({ length: n }, (_, k) => dry + water * (1 - share) ** (k + 1));
}
