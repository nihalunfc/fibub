// Salt sums for brines, vegetable ferments, dry cures and curing salt. Plain arithmetic by weight; the tool
// never suggests a nitrite level: the user enters their own target from their recipe or local rules.

/** Saturated salt brine is about 26.4 % salt by weight at 15.6 °C (60 °F); a salinometer reads 100° there. */
export const SATURATED_PCT = 26.4;

export type Basis = 'total' | 'water';

/** Salt (g) for a brine of pct % from waterG of water. 'total': salt is pct % of salt + water. 'water': salt is pct % of the water's weight. */
export function saltForBrine(waterG: number, pct: number, basis: Basis): number {
  if (!(waterG > 0)) throw new Error('Water must be more than 0 g.');
  if (!(pct >= 0)) throw new Error('The salt percentage cannot be negative.');
  if (basis === 'total') {
    if (pct >= 100) throw new Error('Salt by total weight must be under 100 %.');
    return (waterG * pct) / (100 - pct);
  }
  return (waterG * pct) / 100;
}

/** Strength of a brine made from saltG of salt and waterG of water, both ways, and in salinometer degrees. */
export function brineStrength(saltG: number, waterG: number): { pctTotal: number; pctWater: number; sal: number; saturated: boolean } {
  if (!(saltG >= 0) || !(waterG > 0)) throw new Error('Give the salt (0 g or more) and the water (more than 0 g).');
  const pctTotal = (100 * saltG) / (saltG + waterG);
  return { pctTotal, pctWater: (100 * saltG) / waterG, sal: salFromPct(pctTotal), saturated: pctTotal > SATURATED_PCT };
}

/** Salinometer degrees from % salt by total weight, and back (100° = saturated, 26.4 %). */
export const salFromPct = (pct: number) => (100 * pct) / SATURATED_PCT;
export const pctFromSal = (sal: number) => (sal * SATURATED_PCT) / 100;

/** Equilibrium brine for a vegetable ferment: salt is pct % of the vegetables plus the water. Also the share of everything once the salt is in. */
export function equilibrium(vegG: number, waterG: number, pct: number): { salt: number; ofAll: number } {
  if (!(vegG >= 0) || !(waterG >= 0) || !(vegG + waterG > 0)) throw new Error('Give the weight of the vegetables and the water.');
  if (!(pct >= 0)) throw new Error('The salt percentage cannot be negative.');
  const salt = ((vegG + waterG) * pct) / 100;
  return { salt, ofAll: (100 * salt) / (vegG + waterG + salt) };
}

/** Dry cure: salt and any sugar as a percentage of the meat's weight. */
export function dryCure(meatG: number, saltPct: number, sugarPct = 0): { salt: number; sugar: number } {
  if (!(meatG > 0)) throw new Error('Meat must be more than 0 g.');
  if (!(saltPct >= 0) || !(sugarPct >= 0)) throw new Error('Percentages cannot be negative.');
  return { salt: (meatG * saltPct) / 100, sugar: (meatG * sugarPct) / 100 };
}

/**
 * Curing salt for a target nitrite level the user chose (ppm = mg of sodium nitrite per kg of meat), from the
 * nitrite content of their cure (% by weight, from its label). Applied directly to the meat (dry cure or mince).
 */
export function cureForPpm(meatG: number, nitritePct: number, ppm: number): { cure: number; nitriteMg: number } {
  if (!(meatG > 0)) throw new Error('Meat must be more than 0 g.');
  if (!(nitritePct > 0 && nitritePct <= 100)) throw new Error('Nitrite in the cure must be more than 0 and at most 100 %.');
  if (!(ppm >= 0)) throw new Error('The target cannot be negative.');
  const nitriteMg = (ppm * meatG) / 1000;
  return { cure: nitriteMg / 1000 / (nitritePct / 100), nitriteMg };
}
/** Nitrite level (ppm) from grams of cure on meatG of meat. */
export function ppmFromCure(meatG: number, nitritePct: number, cureG: number): number {
  if (!(meatG > 0)) throw new Error('Meat must be more than 0 g.');
  if (!(nitritePct > 0 && nitritePct <= 100)) throw new Error('Nitrite in the cure must be more than 0 and at most 100 %.');
  return ((cureG * nitritePct) / 100 / meatG) * 1e6;
}

/** Weight in grams of one unit of the water units the brine page offers (US cup = 236.5882365 ml of water, about 1 g per ml). */
export const WATER_UNITS: Record<string, number> = { g: 1, kg: 1000, ml: 1, l: 1000, oz: 28.349523125, lb: 453.59237, cup: 236.5882365 };
export const toGrams = (x: number, unit: string) => x * (WATER_UNITS[unit] ?? 1);
/**
 * Salt (g) to stir into an existing brine to bring it up to a stronger percentage (of salt + water by weight).
 * From (s0 + x) = t/100 × (W + x) with s0 = W × c/100: x = W (t − c) / (100 − t). Negative means the brine is already too strong
 * (add water instead: see waterToDilute).
 */
export function saltToAdd(brineG: number, currentPct: number, targetPct: number): number {
  if (!(targetPct < 100)) throw new Error('The target must be under 100 %.');
  return (brineG * (targetPct - currentPct)) / (100 - targetPct);
}
/** Water (g) to add to a brine to dilute it from currentPct to a weaker targetPct: W × (c − t) / t. */
export function waterToDilute(brineG: number, currentPct: number, targetPct: number): number {
  if (!(targetPct > 0)) throw new Error('The target must be above 0 %.');
  return (brineG * (currentPct - targetPct)) / targetPct;
}
