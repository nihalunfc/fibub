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
export function compareCng(a: { kmMonth: number; petrolPrice: number; petrolMileage: number; gasPrice: number; gasMileage: number; extra: number; years: number }): CngResult {
  const petrolPerKm = a.petrolPrice / a.petrolMileage, gasPerKm = a.gasPrice / a.gasMileage;
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
