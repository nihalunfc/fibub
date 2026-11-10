// Decomposition of dead leaves and wood for school ecology: a litter-bag teaching model. The mass left
// falls exponentially, M(t) = M0 e^(−kt), and the rate k depends on temperature (doubling for every 10 °C,
// Q10 = 2), on moisture (slow when dry, fastest when damp, slow again when waterlogged and short of
// oxygen) and on how tough the material is (lignin and chitin slow it down). Round, made-up numbers.

export const K_REF = 1.2; // per year, soft leaves at 25 °C and the best moisture
export const T_REF = 25;
export const Q10 = 2;
export const LITTER = { soft: { name: 'soft leaves (rich in nitrogen and sugars)', f: 1 }, tough: { name: 'tough leaves (more lignin)', f: 0.45 }, wood: { name: 'wood (mostly lignin and cellulose)', f: 0.12 } } as const;
export type Litter = keyof typeof LITTER;

/** Temperature factor: Q10^((T − 25)/10); no decomposition at or below −5 °C (frozen). */
export const fTemp = (T: number) => (T <= -5 ? 0 : Math.pow(Q10, (T - T_REF) / 10));
/** Moisture factor for moisture w from 0 (bone dry) to 1 (waterlogged): best at 0.6. */
export const fMoist = (w: number) => Math.exp(-(((w - 0.6) / 0.25) ** 2));
/** Rate constant k (per year). */
export const rate = (T: number, w: number, litter: Litter) => K_REF * fTemp(T) * fMoist(w) * LITTER[litter].f;
/** Share of the start mass left after t years. */
export const left = (k: number, t: number) => Math.exp(-k * t);
/** Half-life in years: ln 2 / k. */
export const halfLife = (k: number) => (k > 0 ? Math.LN2 / k : Infinity);
/** Years until only 5 % is left: ln 20 / k. */
export const t95 = (k: number) => (k > 0 ? Math.log(20) / k : Infinity);

export const PLACES: Record<string, { name: string; T: number; w: number }> = {
  rain: { name: 'Tropical rainforest', T: 27, w: 0.7 },
  temperate: { name: 'Temperate forest', T: 12, w: 0.6 },
  grass: { name: 'Grassland', T: 18, w: 0.4 },
  desert: { name: 'Desert', T: 30, w: 0.12 },
  tundra: { name: 'Tundra', T: 0, w: 0.55 },
  bog: { name: 'Waterlogged bog', T: 10, w: 0.97 },
};
