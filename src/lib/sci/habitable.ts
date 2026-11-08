// Habitable zone (Kopparapu et al. 2014, ApJ 787 L29) and planetary equilibrium temperature.

export type HzLimit = { id: string; name: string; s0: number; a: number; b: number; c: number; d: number };
// Effective stellar flux S_eff = S0 + aT + bT² + cT³ + dT⁴ with T = Teff − 5780 K, valid for 2600 to 7200 K.
export const HZ_LIMITS: HzLimit[] = [
  { id: 'venus', name: 'Recent Venus', s0: 1.776, a: 2.136e-4, b: 2.533e-8, c: -1.332e-11, d: -3.097e-15 },
  { id: 'runaway', name: 'Runaway greenhouse', s0: 1.107, a: 1.332e-4, b: 1.58e-8, c: -8.308e-12, d: -1.931e-15 },
  { id: 'maxgh', name: 'Maximum greenhouse', s0: 0.356, a: 6.171e-5, b: 1.698e-9, c: -3.198e-12, d: -5.575e-16 },
  { id: 'mars', name: 'Early Mars', s0: 0.32, a: 5.547e-5, b: 1.526e-9, c: -2.874e-12, d: -5.011e-16 },
];
// The runaway greenhouse edge moves with planet mass (Kopparapu 2014, Table 1).
export const RUNAWAY_BY_MASS: Record<string, HzLimit> = {
  '0.1': { id: 'runaway', name: 'Runaway greenhouse (0.1 Earth masses)', s0: 0.99, a: 1.209e-4, b: 1.404e-8, c: -7.418e-12, d: -1.713e-15 },
  '1': HZ_LIMITS[1],
  '5': { id: 'runaway', name: 'Runaway greenhouse (5 Earth masses)', s0: 1.188, a: 1.433e-4, b: 1.707e-8, c: -8.968e-12, d: -2.084e-15 },
};
export const T_MIN = 2600, T_MAX = 7200;

export const seff = (l: HzLimit, teff: number) => { const t = teff - 5780; return l.s0 + l.a * t + l.b * t * t + l.c * t ** 3 + l.d * t ** 4; };
/** Distance in AU where a star of luminosity L (solar units) gives flux S (Earth units). */
export const distFor = (L: number, S: number) => Math.sqrt(L / S);

/** All four edges for a star, in AU, inner to outer, with the runaway edge for the chosen planet mass. */
export function habitableZone(teff: number, L: number, mass: '0.1' | '1' | '5' = '1') {
  const lims = [HZ_LIMITS[0], RUNAWAY_BY_MASS[mass], HZ_LIMITS[2], HZ_LIMITS[3]];
  const edges = lims.map((l) => { const s = seff(l, teff); return { id: l.id, name: l.name, seff: s, au: distFor(L, s) }; });
  return { edges, outOfRange: teff < T_MIN || teff > T_MAX,
    conservative: [edges[1].au, edges[2].au] as [number, number], optimistic: [edges[0].au, edges[3].au] as [number, number] };
}

export const SIGMA = 5.670374419e-8, L_SUN = 3.828e26, R_SUN = 6.957e8, AU_M = 1.495978707e11, T_SUN = 5772;
/** Luminosity in solar units from radius (solar radii) and temperature. */
export const lumFrom = (R: number, teff: number) => R * R * (teff / T_SUN) ** 4;
export const radiusFrom = (L: number, teff: number) => Math.sqrt(L) * (T_SUN / teff) ** 2;

/**
 * Equilibrium temperature in K for a planet at d AU: the temperature of a black body in balance with the starlight it absorbs.
 * redistribute: 1 spreads the heat over the whole planet (fast rotator), 2 over the day side only (tidally locked, no atmosphere).
 */
export function tEq(L: number, d: number, albedo: number, redistribute: 1 | 2 = 1) {
  const S = (L * L_SUN) / (4 * Math.PI * (d * AU_M) ** 2);
  return ((S * (1 - albedo) * redistribute) / (4 * SIGMA)) ** 0.25;
}
/** Flux at the planet in Earth units. */
export const insolation = (L: number, d: number) => L / (d * d);
/** Kepler's third law: period in days for a orbit of d AU round a star of M solar masses (planet mass neglected). */
export const periodDays = (d: number, M: number) => 365.25636 * Math.sqrt(d ** 3 / M);
export const auForPeriod = (days: number, M: number) => Math.cbrt(M * (days / 365.25636) ** 2);
