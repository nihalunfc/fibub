// Transpiration lab (school biology): a leafy shoot in a potometer. Light opens the stomata, warm dry air pulls
// water out faster, wind blows away the moist layer next to the leaf, and petroleum jelly blocks stomata.
// Plain maths, no DOM. A teaching model: the shoot's numbers are made-up round values.

/** Saturation vapour pressure of water (kPa) at t °C, Tetens' formula. */
export const esat = (t: number) => 0.6108 * Math.exp((17.27 * t) / (t + 237.3));
/** Vapour pressure deficit (kPa): how much drier the air is than the inside of the leaf (saturated at air temperature). */
export const vpd = (t: number, rh: number) => esat(t) * (1 - Math.min(100, Math.max(0, rh)) / 100);

export const G_MIN = 0.02;   // stomatal conductance in the dark (stomata almost shut), arbitrary units
export const G_MAX = 0.4;    // fully open
export const K_LIGHT = 20;   // light (% of full sun) that opens them half way
export const GB0 = 0.5;      // boundary layer conductance in still air
export const GB_WIND = 0.8;  // extra per √(m/s) of wind
export const LOWER = 0.8;    // share of the stomata on the lower surface of the leaves
export const SCALE = 2.5;    // mL of water per hour per (conductance × kPa) for this shoot

export type Coat = 'none' | 'upper' | 'lower' | 'both';
/** Share of stomata left open by petroleum jelly on the upper, lower or both surfaces. */
export const coatShare = (c: Coat) => (c === 'none' ? 1 : c === 'upper' ? LOWER : c === 'lower' ? 1 - LOWER : 0);
/** Stomatal conductance from light (0-100 % of full sun), with any coating. */
export const stomata = (light: number, coat: Coat = 'none') => (G_MIN + ((G_MAX - G_MIN) * light) / (light + K_LIGHT)) * coatShare(coat);
/** Boundary layer conductance from wind speed (m/s). */
export const boundary = (wind: number) => GB0 + GB_WIND * Math.sqrt(Math.max(0, wind));
/** Total conductance: stomata and boundary layer in series. */
export const conductance = (light: number, wind: number, coat: Coat = 'none') => { const gs = stomata(light, coat); return gs > 0 ? 1 / (1 / gs + 1 / boundary(wind)) : 0; };

/** Water taken up (mL per hour) by the shoot. */
export function rate(light: number, t: number, rh: number, wind: number, coat: Coat = 'none'): number {
  return SCALE * conductance(light, wind, coat) * vpd(t, rh);
}
/** Distance (mm) the bubble moves along a capillary of inner radius r (mm) for a volume v (mL); 1 mL = 1000 mm³. */
export const bubbleMm = (v: number, r: number) => (v * 1000) / (Math.PI * r * r);
/** Volume (mL) from a bubble movement d (mm) in a capillary of radius r (mm). */
export const volumeFromMm = (d: number, r: number) => (Math.PI * r * r * d) / 1000;
