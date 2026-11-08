// Bench solution maths: mass ↔ concentration ↔ volume, C1V1 = C2V2 and serial dilutions.

export const MASS: Record<string, number> = { kg: 1e3, g: 1, mg: 1e-3, 'µg': 1e-6, ng: 1e-9 }; // to grams
export const VOL: Record<string, number> = { L: 1, mL: 1e-3, 'µL': 1e-6 }; // to litres
/** Concentration units: molar ones (to mol/L) and mass ones (to g/L). ppm and ppb assume a dilute water solution (1 L ≈ 1 kg). */
export const CONC: Record<string, { k: number; molar: boolean }> = {
  M: { k: 1, molar: true }, mM: { k: 1e-3, molar: true }, 'µM': { k: 1e-6, molar: true }, nM: { k: 1e-9, molar: true },
  'g/L': { k: 1, molar: false }, 'mg/mL': { k: 1, molar: false }, 'µg/mL': { k: 1e-3, molar: false }, 'ng/µL': { k: 1e-3, molar: false },
  '% w/v': { k: 10, molar: false }, ppm: { k: 1e-3, molar: false }, ppb: { k: 1e-6, molar: false },
};
/** Concentration in g/L (needs the molar mass for molar units). */
export function toGperL(c: number, unit: string, mw?: number): number {
  const u = CONC[unit]; if (!u) throw new Error(`Unknown unit ${unit}`);
  if (u.molar) { if (!(mw! > 0)) throw new Error('Type the molar mass (g/mol) to use molar units'); return c * u.k * mw!; }
  return c * u.k;
}
export const fromGperL = (g: number, unit: string, mw?: number) => { const u = CONC[unit]; if (u.molar && !(mw! > 0)) throw new Error('Type the molar mass (g/mol) to use molar units'); return u.molar ? g / mw! / u.k : g / u.k; };

/** Solve C1·V1 = C2·V2 for the one value given as NaN. Units cancel when both sides use the same ones. */
export function c1v1(c1: number, v1: number, c2: number, v2: number) {
  const vals = [c1, v1, c2, v2], missing = vals.filter((v) => !Number.isFinite(v)).length;
  if (missing !== 1) throw new Error('Fill in exactly three of the four boxes');
  if (vals.some((v) => Number.isFinite(v) && v <= 0)) throw new Error('Concentrations and volumes must be above zero');
  if (!Number.isFinite(c1)) c1 = (c2 * v2) / v1; else if (!Number.isFinite(v1)) v1 = (c2 * v2) / c1; else if (!Number.isFinite(c2)) c2 = (c1 * v1) / v2; else v2 = (c1 * v1) / c2;
  if (c2 > c1 * (1 + 1e-12)) throw new Error('The final concentration is higher than the stock: you cannot dilute up');
  return { c1, v1, c2, v2, diluent: v2 - v1 };
}

/**
 * Serial dilution: n tubes, each `factor` times weaker than the one before, each ending with `vol`
 * (same units in and out). Each tube gets `diluent`, then `transfer` from the previous one, mixed, and
 * `transfer` moved on. The last tube's extra `transfer` is discarded so every tube holds the same volume.
 */
export function serial(stock: number, factor: number, n: number, vol: number) {
  if (!(factor > 1)) throw new Error('The dilution factor must be above 1');
  if (!(n >= 1 && n <= 50)) throw new Error('Choose 1 to 50 tubes');
  if (!(vol > 0)) throw new Error('Volume must be above zero');
  const transfer = vol / (factor - 1);
  return { transfer, diluent: vol, tubes: Array.from({ length: n }, (_, i) => ({ tube: i + 1, conc: stock / factor ** (i + 1), total: factor ** (i + 1) })) };
}
