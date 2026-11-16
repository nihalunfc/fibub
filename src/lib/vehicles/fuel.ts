// Fuel maths for the Vehicles shelf: octane scales, ethanol blends, CNG payback, two-stroke mix.
// Plain TypeScript, no DOM. Rough estimates, not guarantees.

// ---- Octane ----
/** AKI (the pump number in the USA and Canada) = (RON + MON) / 2, which is about RON minus 4 for ordinary petrol. */
export const DEFAULT_RON_AKI_GAP = 4;
export const ronToAki = (ron: number, gap = DEFAULT_RON_AKI_GAP) => ron - gap;
export const akiToRon = (aki: number, gap = DEFAULT_RON_AKI_GAP) => aki + gap;

// ---- Ethanol ----
export const PETROL_MJ_PER_L = 32;
export const ETHANOL_MJ_PER_L = 21;
/** Energy per litre of a blend with ethanol fraction f (0 to 1). */
export function blendEnergy(f: number, petrol = PETROL_MJ_PER_L, ethanol = ETHANOL_MJ_PER_L) {
  return (1 - f) * petrol + f * ethanol;
}
export interface BlendResult { dropPct: number; newMileage: number; costPerKmOld: number; costPerKmNew: number; monthlyOld: number; monthlyNew: number; monthlyDiff: number }
/** Compare the old fuel (fraction fOld) with a new blend (fNew) using energy content only. */
export function compareBlend(a: { fOld: number; fNew: number; mileage: number; priceOld: number; priceNew: number; kmMonth: number; petrol?: number; ethanol?: number }): BlendResult {
  const eOld = blendEnergy(a.fOld, a.petrol, a.ethanol), eNew = blendEnergy(a.fNew, a.petrol, a.ethanol);
  const ratio = eNew / eOld;
  const newMileage = a.mileage * ratio;
  const costPerKmOld = a.priceOld / a.mileage, costPerKmNew = a.priceNew / newMileage;
  const monthlyOld = costPerKmOld * a.kmMonth, monthlyNew = costPerKmNew * a.kmMonth;
  return { dropPct: (1 - ratio) * 100, newMileage, costPerKmOld, costPerKmNew, monthlyOld, monthlyNew, monthlyDiff: monthlyNew - monthlyOld };
}

// ---- CNG / LPG vs petrol ----
export interface CngResult { petrolPerKm: number; gasPerKm: number; savingPerKm: number; monthlySaving: number; paybackMonths: number | null; yearsTotalSaving: number; yearsNet: number }
export function compareCng(a: { kmMonth: number; petrolPrice: number; petrolMileage: number; gasPrice: number; gasMileage: number; extra: number; years: number; gasShare?: number }): CngResult {
  const petrolPerKm = a.petrolPrice / a.petrolMileage;
  const share = a.gasShare === undefined ? 1 : Math.min(1, Math.max(0, a.gasShare));
  // Share of km on gas (bi-fuel cars start on petrol); the rest of the km are driven on petrol.
  const gasPerKm = petrolPerKm * (1 - share) + (a.gasPrice / a.gasMileage) * share;
  const savingPerKm = petrolPerKm - gasPerKm, monthlySaving = savingPerKm * a.kmMonth;
  const paybackMonths = monthlySaving > 0 ? a.extra / monthlySaving : null;
  const yearsTotalSaving = monthlySaving * 12 * a.years;
  return { petrolPerKm, gasPerKm, savingPerKm, monthlySaving, paybackMonths, yearsTotalSaving, yearsNet: yearsTotalSaving - a.extra };
}

// ---- Two-stroke mix ----
export const L_PER_US_GAL = 3.785411784;
export const L_PER_UK_GAL = 4.54609;
export const ML_PER_US_FLOZ = 29.5735295625;
export type VolUnit = 'l' | 'usgal' | 'ukgal';
export const toLitres = (v: number, u: VolUnit) => (u === 'usgal' ? v * L_PER_US_GAL : u === 'ukgal' ? v * L_PER_UK_GAL : v);
export const fromLitres = (l: number, u: VolUnit) => (u === 'usgal' ? l / L_PER_US_GAL : u === 'ukgal' ? l / L_PER_UK_GAL : l);
/** Oil in ml for petrol litres at a ratio of ratio:1 (petrol : oil). */
export const oilMl = (petrolL: number, ratio: number) => (petrolL * 1000) / ratio;
/** Petrol litres that go with oilMl millilitres of oil. */
export const petrolLFromOil = (ml: number, ratio: number) => (ml * ratio) / 1000;
export const mlToFlOz = (ml: number) => ml / ML_PER_US_FLOZ;

// ---- Extras ----
/** Ethanol percent of a blend made by mixing litresA of a fuel at pctA with litresB at pctB. */
export const mixPct = (litresA: number, pctA: number, litresB: number, pctB: number) => (litresA + litresB > 0 ? (litresA * pctA + litresB * pctB) / (litresA + litresB) : NaN);
/** Litres of fuel B (at pctB) and fuel A (at pctA) to make `total` litres at `target` percent. Null if the target is outside A..B. */
export function mixForTarget(total: number, target: number, pctA: number, pctB: number) {
  if (!(total > 0) || pctA === pctB) return null;
  const lo = Math.min(pctA, pctB), hi = Math.max(pctA, pctB);
  if (target < lo - 1e-9 || target > hi + 1e-9) return null;
  const b = (total * (target - pctA)) / (pctB - pctA);
  return { a: total - b, b };
}
/** Highest price per litre of the new blend that costs no more per km than the old fuel. */
export function breakEvenPrice(a: { fOld: number; fNew: number; priceOld: number; petrol?: number; ethanol?: number }) {
  const ratio = blendEnergy(a.fNew, a.petrol, a.ethanol) / blendEnergy(a.fOld, a.petrol, a.ethanol);
  return a.priceOld * ratio;
}

/** Cumulative cost by year, petrol only against gas (with the extra cost at the start). */
export function cumulativeCng(a: { kmMonth: number; petrolPerKm: number; gasPerKm: number; extra: number; years: number }) {
  const out: { year: number; petrol: number; gas: number }[] = [];
  const yp = a.petrolPerKm * a.kmMonth * 12, yg = a.gasPerKm * a.kmMonth * 12;
  for (let y = 0; y <= Math.max(0, Math.floor(a.years)); y++) out.push({ year: y, petrol: yp * y, gas: a.extra + yg * y });
  return out;
}
/** Blend of petrol and gas use: share (0 to 1) of km driven on gas. Cost per km is a weighted average. */
export const bifuelPerKm = (petrolPerKm: number, gasPerKm: number, gasShare: number) => petrolPerKm * (1 - gasShare) + gasPerKm * gasShare;

// ---- Octane check ----
export type OctaneVerdict = 'below' | 'ok' | 'higher';
/** Compare the grade you plan to use with the one the manual asks for (both RON). */
export function octaneVerdict(manualRon: number, useRon: number): OctaneVerdict {
  if (useRon < manualRon - 0.5) return 'below';
  if (useRon > manualRon + 1.5) return 'higher';
  return 'ok';
}
/** Extra money a year for a dearer grade: km a year, mileage km/L, extra price per litre. */
export const extraGradeYearly = (kmYear: number, kmPerL: number, extraPerL: number) => (kmPerL > 0 ? (kmYear / kmPerL) * extraPerL : NaN);

// ---- Two-stroke extras ----
/** Oil as a percent of the finished mix (1 part oil in ratio+1 parts). */
export const oilPercentOfMix = (ratio: number) => 100 / (ratio + 1);
/** Fixing a mix: `petrolL` litres already mixed at fromRatio. Returns oil (ml) to add, or petrol (L) to add if it is too oily. */
export function fixMix(petrolL: number, fromRatio: number, toRatio: number) {
  const have = oilMl(petrolL, fromRatio), want = oilMl(petrolL, toRatio);
  if (want >= have) return { addOilMl: want - have, addPetrolL: 0 };
  // too much oil: dilute with petrol until have oil is the right share
  const totalPetrol = petrolLFromOil(have, toRatio);
  return { addOilMl: 0, addPetrolL: Math.max(0, totalPetrol - petrolL) };
}
