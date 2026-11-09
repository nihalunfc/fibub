// Photosynthesis lab (school biology): oxygen bubbles from pondweed under a lamp. Plain maths, no DOM.
// Blackman's law of limiting factors: the rate is set by the factor in shortest supply, so the gross rate
// is the smallest of three caps: light (alpha × I), carbon dioxide (beta × C) and the enzymes' top speed
// at that temperature (pMax × f(T)). Respiration uses some oxygen, so the bubbles seen are gross minus
// respiration. Every constant is a made-up round number for teaching, not a measurement of a real plant.

export const ALPHA = 0.6;     // bubbles/min per light unit (light-limited slope)
export const BETA = 80;       // bubbles/min per % CO2 source (CO2-limited cap)
export const C0 = 0.05;       // CO2 already dissolved in the water, as % sodium hydrogencarbonate
export const PMAX = 50;       // enzyme-limited top rate at the optimum temperature (bubbles/min)
export const T_OPT = 30, T_MAX = 45;
export const RESP = 2;        // respiration at 25 °C (bubbles/min of oxygen used)

/** Light intensity (relative units, 100 at 10 cm) from lamp distance in cm: inverse square law. */
export const lightAt = (d: number) => 100 * (10 / d) ** 2;
/** Enzyme speed factor: doubles every 10 °C up to the optimum, then falls to 0 at T_MAX as enzymes denature. */
export function tempFactor(t: number): number {
  if (t <= T_OPT) return Math.max(0, 2 ** ((t - T_OPT) / 10));
  if (t >= T_MAX) return 0;
  return (T_MAX - t) / (T_MAX - T_OPT);
}
/** Respiration rises with temperature (doubles every 10 °C) until the cells are damaged near T_MAX. */
export const respAt = (t: number) => (t >= T_MAX ? 0 : RESP * 2 ** ((t - 25) / 10));

export type Factor = 'light' | 'co2' | 'temperature';
export type Rate = { light: number; co2: number; temp: number; gross: number; resp: number; net: number; limit: Factor };

/** Rates in bubbles per minute for light I (relative units), CO2 source c (% NaHCO3) and temperature t (°C). */
export function rate(I: number, c: number, t: number): Rate {
  const light = ALPHA * Math.max(0, I), co2 = BETA * (C0 + Math.max(0, c)), temp = PMAX * tempFactor(t);
  const gross = Math.min(light, co2, temp);
  const limit: Factor = gross === light ? 'light' : gross === co2 ? 'co2' : 'temperature';
  const resp = respAt(t);
  return { light, co2, temp, gross, resp, net: Math.max(0, gross - resp), limit };
}

/** Light needed (relative units) for gross photosynthesis to just balance respiration (compensation point). */
export const compensation = (t: number) => respAt(t) / ALPHA;

/** Poisson random count with mean m (Knuth for small m, normal approximation above 60). */
export function poisson(m: number, r: () => number): number {
  if (m <= 0) return 0;
  if (m > 60) { const g = Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r()); return Math.max(0, Math.round(m + Math.sqrt(m) * g)); }
  const L = Math.exp(-m); let k = 0, p = 1;
  do { k++; p *= r(); } while (p > L);
  return k - 1;
}
