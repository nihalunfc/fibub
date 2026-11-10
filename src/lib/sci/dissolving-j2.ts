// Dissolving lab maths (#1226): how much of a solid dissolves in water at a temperature (solubility in g per 100 g
// of water), what stays undissolved, crystals that come out on cooling, mass percent and molality, and how much
// oxygen or carbon dioxide water can hold as it warms. The curves are smooth rounded teaching fits, not data tables.

export type SoluteId = 'salt' | 'sugar' | 'kno3';
export type Solute = { id: SoluteId; name: string; formula: string; molar: number; spoon: number; s: (t: number) => number };

/** Solubility fits in g per 100 g of water, for 0 to 100 °C (rounded; real values differ by a few percent). */
export const SOLUTES: Record<SoluteId, Solute> = {
  salt: { id: 'salt', name: 'Table salt', formula: 'NaCl', molar: 58.44, spoon: 5, s: (t) => 35.7 + 0.033 * t },
  sugar: { id: 'sugar', name: 'Sugar', formula: 'C₁₂H₂₂O₁₁', molar: 342.3, spoon: 5, s: (t) => 178.5 + 1.48 * t - 0.0113 * t * t + 0.000273 * t * t * t },
  kno3: { id: 'kno3', name: 'Potassium nitrate', formula: 'KNO₃', molar: 101.1, spoon: 5, s: (t) => 13.6 + 0.53 * t + 0.0179 * t * t },
};

export const clampT = (t: number) => Math.min(100, Math.max(0, t));

/** Most that dissolves (g) in `water` g of water at t °C. */
export const capacity = (id: SoluteId, t: number, water: number) => (SOLUTES[id].s(clampT(t)) * water) / 100;

export type Mix = { dissolved: number; left: number; cap: number; saturated: boolean; massPct: number; molality: number; perHundred: number };

/** Put `added` g of solute in `water` g of water at t °C. */
export function mix(id: SoluteId, added: number, water: number, t: number): Mix {
  const cap = capacity(id, t, water);
  const dissolved = Math.min(added, cap), left = Math.max(0, added - cap);
  return {
    dissolved, left, cap, saturated: added >= cap - 1e-9,
    massPct: dissolved + water > 0 ? (100 * dissolved) / (dissolved + water) : 0,
    molality: water > 0 ? dissolved / SOLUTES[id].molar / (water / 1000) : 0,
    perHundred: water > 0 ? (100 * dissolved) / water : 0,
  };
}

/** Crystals (g) that come out when a solution saturated at t1 is cooled to t2 (0 when t2 ≥ t1). */
export const crystalsOnCooling = (id: SoluteId, water: number, t1: number, t2: number) => Math.max(0, capacity(id, t1, water) - capacity(id, t2, water));

/** Oxygen that water in contact with air can hold, mg/L, 0 to 40 °C (rounded cubic fit at sea level). */
export const oxygen = (t: number) => { const x = Math.min(40, Math.max(0, t)); return 14.6 - 0.394 * x + 0.0072 * x * x - 0.00006 * x * x * x; };

/** Carbon dioxide that water can hold under 1 atm of pure CO₂, g/L, 0 to 40 °C (rounded exponential fit). */
export const carbonDioxide = (t: number) => 3.35 * Math.exp(-0.0335 * Math.min(40, Math.max(0, t)));
