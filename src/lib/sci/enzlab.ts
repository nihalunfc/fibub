// Enzyme activity lab (school biology): how temperature, pH, substrate and inhibitors change the rate of an
// enzyme reaction, and the starch-iodine test. Plain maths, no DOM. A teaching model with round made-up values.

export type Enzyme = { id: string; name: string; substrate: string; pHopt: number; vmax: number; km: number };
export const ENZYMES: Enzyme[] = [
  { id: 'amylase', name: 'Salivary amylase', substrate: 'starch', pHopt: 6.8, vmax: 100, km: 2 },
  { id: 'pepsin', name: 'Pepsin (stomach)', substrate: 'protein', pHopt: 2, vmax: 100, km: 2 },
  { id: 'trypsin', name: 'Trypsin (small intestine)', substrate: 'protein', pHopt: 8, vmax: 100, km: 2 },
];
export const T_REF = 37;      // °C, where the speed factor is 1 before any damage
export const T_MELT = 44;     // °C, where half the enzyme molecules have lost their shape
export const T_WIDTH = 2.5;   // °C, how sharply they lose it
export const PH_WIDTH = 1.5;  // pH units, how wide the pH peak is

/** Speed factor from temperature: doubles every 10 °C (Q10 = 2), times the share of molecules not denatured. */
export function tempFactor(t: number): number {
  return 2 ** ((t - T_REF) / 10) / (1 + Math.exp((t - T_MELT) / T_WIDTH));
}
/** Speed factor from pH: 1 at the enzyme's best pH, falling away on both sides. */
export const pHFactor = (e: Enzyme, pH: number) => Math.exp(-(((pH - e.pHopt) / PH_WIDTH) ** 2));

export type Inhibitor = 'none' | 'competitive' | 'noncompetitive';
/** Initial rate (units/min) for substrate s (mM), temperature t (°C), pH, inhibitor i (mM) with Ki = 1 mM. */
export function rate(e: Enzyme, s: number, t: number, pH: number, inh: Inhibitor = 'none', i = 0, ki = 1): number {
  const f = 1 + Math.max(0, i) / ki;
  const vmax = e.vmax * tempFactor(t) * pHFactor(e, pH) / (inh === 'noncompetitive' ? f : 1);
  const km = e.km * (inh === 'competitive' ? f : 1);
  return s <= 0 ? 0 : (vmax * s) / (km + s);
}
/** Temperature with the highest rate, by golden-section search between 0 and 80 °C. */
export function bestTemp(): number {
  let a = 0, b = 80; const g = (Math.sqrt(5) - 1) / 2;
  for (let k = 0; k < 100; k++) { const c = b - g * (b - a), d = a + g * (b - a); if (tempFactor(c) > tempFactor(d)) b = d; else a = c; }
  return (a + b) / 2;
}
/** Starch-iodine test: share of starch left after t minutes when the rate is r units/min (100 units of starch). */
export const starchLeft = (r: number, t: number) => Math.exp((-r * t) / 100);
/** Minutes until the iodine no longer turns blue-black (starch below 5 % of the start). */
export const timeToClear = (r: number) => (r > 0 ? (100 * Math.log(20)) / r : Infinity);
/** Spot-tile practical: a drop is tested every `step` minutes; the first time the iodine stays brown (under 5 % starch). */
export function spotTime(r: number, step = 0.5, max = 20): number {
  for (let k = 1; k * step <= max + 1e-9; k++) if (starchLeft(r, k * step) < 0.05) return k * step;
  return Infinity;
}
/** Michaelis-Menten numbers the Class 11 view shows: apparent Vmax and Km with an inhibitor. */
export function apparent(e: Enzyme, t: number, pH: number, inh: Inhibitor = 'none', i = 0, ki = 1) {
  const f = 1 + Math.max(0, i) / ki;
  return { vmax: e.vmax * tempFactor(t) * pHFactor(e, pH) / (inh === 'noncompetitive' ? f : 1), km: e.km * (inh === 'competitive' ? f : 1) };
}
