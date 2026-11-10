// Aerobic and anaerobic respiration (#1304): where glucose goes with and without oxygen, the energy (ATP) per glucose,
// and the products, by molecules and by mass. No DOM.
// Aerobic:      C6H12O6 + 6 O2 → 6 CO2 + 6 H2O        (about 38 ATP per glucose in school books; 2 of them from glycolysis)
// Yeast:        C6H12O6 → 2 C2H5OH + 2 CO2             (2 ATP, from glycolysis)
// Muscle:       C6H12O6 → 2 C3H6O3 (lactic acid)        (2 ATP, from glycolysis)

export type Organism = 'yeast' | 'muscle';

/** Molar masses, g/mol, from IUPAC standard atomic weights (C 12.011, H 1.008, O 15.999), rounded to 0.01. */
export const M = { glucose: 180.16, o2: 32.0, co2: 44.01, water: 18.02, ethanol: 46.07, lactic: 90.08 };

export const ATP_GLYCOLYSIS = 2;
/** School-book total for complete aerobic breakdown (newer measurements give about 30 to 32). */
export const ATP_AEROBIC = 38;

export type Result = {
  atpPerGlucose: number;
  /** All in moles, for `mol` moles of glucose. */
  o2: number; co2: number; water: number; ethanol: number; lactic: number; atp: number;
};

/** `mol` moles of glucose; `oxygen` is the share (0 to 1) of pyruvate that goes the aerobic way. */
export function respire(mol: number, oxygen: number, org: Organism, atpAerobic = ATP_AEROBIC): Result {
  const f = Math.min(1, Math.max(0, oxygen)), aer = mol * f, an = mol * (1 - f);
  const atpPerGlucose = ATP_GLYCOLYSIS + f * (atpAerobic - ATP_GLYCOLYSIS);
  return {
    atpPerGlucose,
    o2: 6 * aer,
    co2: 6 * aer + (org === 'yeast' ? 2 * an : 0),
    water: 6 * aer,
    ethanol: org === 'yeast' ? 2 * an : 0,
    lactic: org === 'muscle' ? 2 * an : 0,
    atp: mol * atpPerGlucose,
  };
}

/** Grams of each substance for a result. */
export function grams(r: Result) {
  return { o2: r.o2 * M.o2, co2: r.co2 * M.co2, water: r.water * M.water, ethanol: r.ethanol * M.ethanol, lactic: r.lactic * M.lactic };
}

/** How many glucose molecules are needed to make `atp` ATP, with or without oxygen. */
export const glucoseFor = (atp: number, oxygen: number, atpAerobic = ATP_AEROBIC) => atp / (ATP_GLYCOLYSIS + Math.min(1, Math.max(0, oxygen)) * (atpAerobic - ATP_GLYCOLYSIS));
