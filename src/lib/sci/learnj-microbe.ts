// Microbe growth (Learn): a teaching model of how fast microbes multiply. Growth rate follows the cardinal
// temperature model with inflection (Rosso et al., 1993), salt and sugar slow it in a straight line to zero, and
// heat above about 55 °C kills (decimal reduction time with a z-value). The cardinal temperatures and times are
// rounded, made-up values for a "typical" microbe, not data for any real species. No DOM.

export type Microbe = { id: string; name: string; td: number; tmin: number; topt: number; tmax: number; saltMax: number; sugarMax: number; product: 'none' | 'gas' | 'acid' };
export const MICROBES: Microbe[] = [
  { id: 'food', name: 'Bacteria in cooked food', td: 20, tmin: 5, topt: 37, tmax: 46, saltMax: 10, sugarMax: 60, product: 'none' },
  { id: 'curd', name: 'Curd bacteria in milk', td: 60, tmin: 10, topt: 40, tmax: 48, saltMax: 6, sugarMax: 50, product: 'acid' },
  { id: 'yeast', name: 'Yeast in dough', td: 90, tmin: 4, topt: 32, tmax: 42, saltMax: 8, sugarMax: 65, product: 'gas' },
];

/** Growth rate relative to the best temperature (0 to 1), cardinal temperature model with inflection (CTMI). */
export function tempFactor(T: number, m: Pick<Microbe, 'tmin' | 'topt' | 'tmax'>): number {
  const { tmin, topt, tmax } = m;
  if (T <= tmin || T >= tmax) return 0;
  const num = (T - tmax) * (T - tmin) ** 2;
  const den = (topt - tmin) * ((topt - tmin) * (T - topt) - (topt - tmax) * (topt + tmin - 2 * T));
  return Math.max(0, num / den);
}
/** Salt or sugar slow growth in a straight line until it stops at the limit (illustrative). */
export const soluteFactor = (pct: number, max: number) => Math.max(0, 1 - pct / max);

/** Death rate per minute from heat: none below 55 °C; D = 10 min at 60 °C, ten times faster every 6 °C. */
export function killRate(T: number): number {
  if (T < 55) return 0;
  const D = 10 * 10 ** ((60 - T) / 6);
  return Math.LN10 / D;
}

/** Growth rate per minute: ln 2 / doubling time × factors. */
export const growthRate = (m: Microbe, T: number, salt: number, sugar: number) => (Math.LN2 / m.td) * tempFactor(T, m) * soluteFactor(salt, m.saltMax) * soluteFactor(sugar, m.sugarMax);
/** Doubling time in minutes under these conditions (Infinity when it does not grow). */
export const doublingTime = (m: Microbe, T: number, salt: number, sugar: number) => { const g = growthRate(m, T, salt, sugar); return g > 0 ? Math.LN2 / g : Infinity; };

export const CAP = 1e9;
/** Count after each minute up to `minutes`: logistic growth to CAP, minus heat death. Returns the series (length minutes + 1). */
export function simulate(m: Microbe, T: number, salt: number, sugar: number, n0: number, minutes: number): number[] {
  const g = growthRate(m, T, salt, sugar), k = killRate(T), out = [n0];
  let n = n0;
  for (let i = 0; i < minutes; i++) {
    // exact logistic step for one minute, then death
    if (g > 0) n = (CAP * n) / (n + (CAP - n) * Math.exp(-g));
    n *= Math.exp(-k);
    out.push(n);
  }
  return out;
}
/** Simple doubling with no limit: N = N₀ × 2^(t / td). */
export const doubling = (n0: number, t: number, td: number) => n0 * 2 ** (t / td);
