// Stable isotope delta notation: δ ↔ ratio against reference standards, changing reference scale, fractionation
// (α, ε, Δ, 1000 ln α), triple-oxygen Δ′17O and two-component mass-balance mixing. Plain maths; no DOM.

/** Reference standards: isotope ratio (heavy/light) of the standard, as commonly adopted. Conventions vary slightly. */
export type Std = { id: string; label: string; heavy: string; light: string; std: string; R: number; note?: string };
export const STANDARDS: Std[] = [
  { id: 'd2h', label: 'δ²H (δD) vs VSMOW', heavy: '²H', light: '¹H', std: 'VSMOW', R: 155.76e-6 },
  { id: 'd13c', label: 'δ¹³C vs VPDB', heavy: '¹³C', light: '¹²C', std: 'VPDB', R: 0.011180, note: 'older work often used 0.0112372' },
  { id: 'd15n', label: 'δ¹⁵N vs AIR', heavy: '¹⁵N', light: '¹⁴N', std: 'AIR N₂', R: 3.6782e-3 },
  { id: 'd17o', label: 'δ¹⁷O vs VSMOW', heavy: '¹⁷O', light: '¹⁶O', std: 'VSMOW', R: 379.9e-6 },
  { id: 'd18o', label: 'δ¹⁸O vs VSMOW', heavy: '¹⁸O', light: '¹⁶O', std: 'VSMOW', R: 2005.2e-6 },
  { id: 'd18op', label: 'δ¹⁸O vs VPDB', heavy: '¹⁸O', light: '¹⁶O', std: 'VPDB', R: 2005.2e-6 * 1.03092 },
  { id: 'd34s', label: 'δ³⁴S vs VCDT', heavy: '³⁴S', light: '³²S', std: 'VCDT', R: 0.0441626 },
  { id: 'd11b', label: 'δ¹¹B vs NIST SRM 951', heavy: '¹¹B', light: '¹⁰B', std: 'SRM 951', R: 4.04362 },
  { id: 'd37cl', label: 'δ³⁷Cl vs SMOC', heavy: '³⁷Cl', light: '³⁵Cl', std: 'SMOC', R: 0.31977 },
];
/** δ¹⁸O of VPDB on the VSMOW scale (‰), the accepted link between the two oxygen scales. */
export const VPDB_ON_VSMOW = 30.92;

/** δ (‰) from a sample ratio and the standard ratio. */
export const deltaFromR = (R: number, Rstd: number) => (R / Rstd - 1) * 1000;
/** Sample ratio from δ (‰). */
export const rFromDelta = (d: number, Rstd: number) => Rstd * (1 + d / 1000);
/** Fraction of the heavy isotope for a two-isotope system: R / (1 + R). */
export const heavyFraction = (R: number) => R / (1 + R);

/**
 * Change reference: δ of a sample against B (dXB) and δ of B against A (dBA) give δ of the sample against A.
 * Exact: (1 + δXA) = (1 + δXB)(1 + δBA), all as fractions.
 */
export const rescale = (dXB: number, dBA: number) => dXB + dBA + (dXB * dBA) / 1000;
/** δ¹⁸O VPDB to VSMOW and back. */
export const vpdbToVsmow = (d: number) => rescale(d, VPDB_ON_VSMOW);
export const vsmowToVpdb = (d: number) => (1000 + d) / (1 + VPDB_ON_VSMOW / 1000) - 1000;

/** Fractionation between phases A and B from their δ values (same scale). */
export function fractionation(dA: number, dB: number) {
  const alpha = (1000 + dA) / (1000 + dB);
  return { alpha, eps: (alpha - 1) * 1000, Delta: dA - dB, lnAlpha: 1000 * Math.log(alpha) };
}

/** Δ′¹⁷O (‰, logarithmic definition) from δ¹⁷O and δ¹⁸O (‰) with slope λ (0.528 is common). */
export const capDelta17 = (d17: number, d18: number, lambda = 0.528) => 1000 * (Math.log1p(d17 / 1000) - lambda * Math.log1p(d18 / 1000));
/** δ′ (‰): 1000 ln(1 + δ/1000), the "linearised" delta. */
export const deltaPrime = (d: number) => 1000 * Math.log1p(d / 1000);

/**
 * Two-component mixing. fA is the fraction of A by mass (or volume); cA and cB are the element's concentration in each
 * (any unit, same for both). Mass balance on the element: δmix = (fA cA δA + fB cB δB) / (fA cA + fB cB).
 */
export function mix(fA: number, cA: number, dA: number, cB: number, dB: number) {
  const a = fA * cA, b = (1 - fA) * cB;
  return { delta: (a * dA + b * dB) / (a + b), conc: a + b, shareA: a / (a + b) };
}
/** Fraction of A needed for a target δ (inverse of mix). NaN if the target is outside the end-members. */
export function fractionFor(target: number, cA: number, dA: number, cB: number, dB: number) {
  if ((target - dA) * (target - dB) > 0) return NaN;
  // fA cA (dA - t) + (1 - fA) cB (dB - t) = 0
  const num = cB * (dB - target), den = cB * (dB - target) - cA * (dA - target);
  return den === 0 ? NaN : num / den;
}
