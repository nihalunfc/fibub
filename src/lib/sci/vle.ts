// Antoine vapour pressure and ideal (Raoult's law) vapour-liquid equilibrium for a binary mixture: bubble and dew
// points in pressure or temperature, Txy and xy curves, relative volatility and an enthalpy of vaporisation estimate.
// Plain maths; no DOM.

export type PUnit = 'mmHg' | 'kPa' | 'bar' | 'Pa' | 'atm';
export const TO_KPA: Record<PUnit, number> = { mmHg: 101.325 / 760, kPa: 1, bar: 100, Pa: 0.001, atm: 101.325 };

/** Antoine constants for log10(P) = A − B / (C + T), T in °C, P in the given unit. */
export type Antoine = { name: string; A: number; B: number; C: number; unit: PUnit; tmin?: number; tmax?: number; bp?: number };

/**
 * Example constants, rounded by fibub (A to 3 decimals, B and C to one decimal) from widely published values,
 * so they are approximate. bp is the normal boiling point in °C, a general fact used to check them.
 */
export const EXAMPLES: Antoine[] = [
  { name: 'Water', A: 8.071, B: 1730.6, C: 233.4, unit: 'mmHg', tmin: 1, tmax: 100, bp: 100 },
  { name: 'Ethanol', A: 8.204, B: 1642.9, C: 230.3, unit: 'mmHg', tmin: -57, tmax: 80, bp: 78.4 },
  { name: 'Methanol', A: 8.081, B: 1582.3, C: 239.7, unit: 'mmHg', tmin: 15, tmax: 84, bp: 64.7 },
  { name: 'Acetone', A: 7.024, B: 1161.0, C: 224.0, unit: 'mmHg', tmin: -13, tmax: 55, bp: 56.1 },
  { name: 'Benzene', A: 6.906, B: 1211.0, C: 220.8, unit: 'mmHg', tmin: 8, tmax: 103, bp: 80.1 },
  { name: 'Toluene', A: 6.955, B: 1344.8, C: 219.5, unit: 'mmHg', tmin: 6, tmax: 137, bp: 110.6 },
  { name: 'n-Hexane', A: 6.876, B: 1171.2, C: 224.4, unit: 'mmHg', tmin: -25, tmax: 92, bp: 68.7 },
  { name: 'n-Heptane', A: 6.894, B: 1264.4, C: 216.6, unit: 'mmHg', tmin: -2, tmax: 124, bp: 98.4 },
];

/** Vapour pressure in kPa at t °C. */
export const psat = (a: Antoine, t: number) => Math.pow(10, a.A - a.B / (a.C + t)) * TO_KPA[a.unit];
/** Temperature (°C) at which the vapour pressure equals p kPa. */
export const tsat = (a: Antoine, p: number) => a.B / (a.A - Math.log10(p / TO_KPA[a.unit])) - a.C;

/** Enthalpy of vaporisation (kJ/mol) from the Clausius-Clapeyron slope of the Antoine curve at t °C (ideal vapour, small liquid volume). */
export const dHvap = (a: Antoine, t: number) => {
  const T = t + 273.15;
  return (8.314462618 * T * T * a.B * Math.LN10) / (a.C + t) ** 2 / 1000;
};

/** Bubble pressure (kPa) and vapour composition for liquid x1 at t °C. */
export function bubbleP(a1: Antoine, a2: Antoine, x1: number, t: number) {
  const p1 = psat(a1, t), p2 = psat(a2, t), P = x1 * p1 + (1 - x1) * p2;
  return { P, y1: (x1 * p1) / P };
}
/** Dew pressure (kPa) and liquid composition for vapour y1 at t °C. */
export function dewP(a1: Antoine, a2: Antoine, y1: number, t: number) {
  const p1 = psat(a1, t), p2 = psat(a2, t), P = 1 / (y1 / p1 + (1 - y1) / p2);
  return { P, x1: (y1 * P) / p1 };
}

function solveT(f: (t: number) => number, lo: number, hi: number) {
  // f rises with t; widen the bracket if needed, then bisect.
  for (let k = 0; k < 40 && f(lo) > 0; k++) lo -= 50;
  for (let k = 0; k < 40 && f(hi) < 0; k++) hi += 50;
  for (let k = 0; k < 100; k++) { const m = (lo + hi) / 2; if (f(m) < 0) lo = m; else hi = m; }
  return (lo + hi) / 2;
}

/** Bubble temperature (°C) and vapour composition for liquid x1 at p kPa. */
export function bubbleT(a1: Antoine, a2: Antoine, x1: number, p: number) {
  const t1 = tsat(a1, p), t2 = tsat(a2, p);
  const t = solveT((t) => x1 * psat(a1, t) + (1 - x1) * psat(a2, t) - p, Math.min(t1, t2), Math.max(t1, t2));
  return { t, y1: (x1 * psat(a1, t)) / p };
}
/** Dew temperature (°C) and liquid composition for vapour y1 at p kPa. */
export function dewT(a1: Antoine, a2: Antoine, y1: number, p: number) {
  const t1 = tsat(a1, p), t2 = tsat(a2, p);
  const t = solveT((t) => 1 - p * (y1 / psat(a1, t) + (1 - y1) / psat(a2, t)), Math.min(t1, t2), Math.max(t1, t2));
  return { t, x1: (y1 * p) / psat(a1, t) };
}

/** Txy curve at p kPa: n + 1 points of liquid x1, vapour y1 and bubble temperature. */
export function txy(a1: Antoine, a2: Antoine, p: number, n = 50) {
  return Array.from({ length: n + 1 }, (_, i) => { const x = i / n, b = bubbleT(a1, a2, x, p); return { x, y: b.y1, t: b.t }; });
}

/** Relative volatility p1/p2 at t °C, and its geometric mean over the two pure boiling points at p kPa. */
export const alphaAt = (a1: Antoine, a2: Antoine, t: number) => psat(a1, t) / psat(a2, t);
export function alphaMean(a1: Antoine, a2: Antoine, p: number) {
  const ta = alphaAt(a1, a2, tsat(a1, p)), tb = alphaAt(a1, a2, tsat(a2, p));
  return { top: ta, bottom: tb, mean: Math.sqrt(ta * tb) };
}

/** Flash at t °C and p kPa: vapour fraction V/F, x1 and y1 (Rachford-Rice for two components). */
export function flash(a1: Antoine, a2: Antoine, z1: number, t: number, p: number) {
  const K1 = psat(a1, t) / p, K2 = psat(a2, t) / p;
  const bub = z1 * K1 + (1 - z1) * K2, dew = z1 / K1 + (1 - z1) / K2;
  if (bub <= 1) return { state: 'liquid' as const, V: 0, x1: z1, y1: z1 * K1 };
  if (dew <= 1) return { state: 'vapour' as const, V: 1, x1: z1 / K1, y1: z1 };
  // Two components: closed form.
  const x1 = (1 - K2) / (K1 - K2), y1 = K1 * x1, V = (z1 - x1) / (y1 - x1);
  return { state: 'two-phase' as const, V, x1, y1 };
}
