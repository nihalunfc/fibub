// Thermal mismatch stress: biaxial stress in a thin film from the CTE mismatch with its substrate, Stoney's equation
// (film stress from wafer curvature or bow, and the bow a film stress causes), a bonded strip of layers (Timoshenko's
// bimetal formula and a general beam solution that also gives the stress in each layer), and a constrained bar.
// CTE may vary linearly with temperature: α(T) = α₀ + α₁ (T − T_ref). Textbook forms (Timoshenko 1925, J. Opt. Soc.
// Am. 11, 233; Stoney 1909; Freund and Suresh, Thin Film Materials, ch. 2). Units: E in MPa, lengths in mm,
// α in 1/K, temperatures in °C (only differences matter except for T_ref).

export type Cte = { a0: number; a1?: number; Tref?: number };

/** Thermal strain ∫ α(T) dT from T0 to T1 for a CTE linear in T. */
export function thermalStrain(c: Cte, T0: number, T1: number): number {
  const a1 = c.a1 ?? 0, Tr = c.Tref ?? 20;
  return c.a0 * (T1 - T0) + (a1 / 2) * ((T1 - Tr) ** 2 - (T0 - Tr) ** 2);
}

/** Biaxial stress in a thin film bonded to a thick substrate, from a stress-free T0 to T1:
 *  σ = E_f/(1 − ν_f) · (ε_s − ε_f), where ε are the free thermal strains. Positive = tension. */
export function filmStress(Ef: number, nuf: number, film: Cte, sub: Cte, T0: number, T1: number) {
  const mis = thermalStrain(sub, T0, T1) - thermalStrain(film, T0, T1);
  return { sigma: (Ef / (1 - nuf)) * mis, mismatch: mis, biaxial: Ef / (1 - nuf) };
}

/** Stoney: film stress from substrate curvature κ (1/mm). σ_f = E_s h_s² κ / (6 (1 − ν_s) h_f). */
export const stoneyStress = (Es: number, nus: number, hs: number, hf: number, kappa: number) => (Es * hs * hs * kappa) / (6 * (1 - nus) * hf);
/** Stoney the other way: curvature from film stress. */
export const stoneyCurvature = (Es: number, nus: number, hs: number, hf: number, sigma: number) => (6 * sigma * hf * (1 - nus)) / (Es * hs * hs);
/** Curvature of a spherical cap with bow (sagitta) δ over a chord (diameter) d: κ = 2δ / (r² + δ²), r = d/2. */
export const bowToCurvature = (bow: number, d: number) => (2 * bow) / ((d / 2) ** 2 + bow * bow);
/** Bow of a spherical cap of curvature κ over a diameter d. */
export const curvatureToBow = (kappa: number, d: number) => {
  if (kappa === 0) return 0;
  const R = 1 / Math.abs(kappa), r = d / 2;
  return Math.sign(kappa) * (R - Math.sqrt(Math.max(0, R * R - r * r)));
};

/** Timoshenko's bimetal strip: curvature κ = 6 Δε (1 + m)² / (h [3(1 + m)² + (1 + mn)(m² + 1/(mn))]),
 *  m = t1/t2, n = E1/E2, h = t1 + t2, Δε = ε2 − ε1 (layer 2 on top). Positive κ bends layer 2 to the outside. */
export function timoshenko(E1: number, t1: number, E2: number, t2: number, deps: number): number {
  const m = t1 / t2, n = E1 / E2, h = t1 + t2;
  return (6 * deps * (1 + m) ** 2) / (h * (3 * (1 + m) ** 2 + (1 + m * n) * (m * m + 1 / (m * n))));
}

export type Layer = { E: number; t: number; eps: number };
/** A stack of bonded layers (first at the bottom, z from 0 up), free to stretch and bend, each with its own free
 *  strain eps. Beam theory (plane sections): ε(z) = ε₀ + κ z, σ = E (ε − eps); no net force or moment. Returns
 *  ε₀, κ, the neutral height of the stress-free strain, and the stress at the bottom and top of each layer. */
export function multilayer(layers: Layer[]) {
  let zb = 0, a11 = 0, a12 = 0, a22 = 0, b1 = 0, b2 = 0;
  const zs: [number, number][] = [];
  for (const L of layers) {
    const zt = zb + L.t, s1 = (zt * zt - zb * zb) / 2, s2 = (zt ** 3 - zb ** 3) / 3;
    a11 += L.E * L.t; a12 += L.E * s1; a22 += L.E * s2; b1 += L.E * L.t * L.eps; b2 += L.E * s1 * L.eps;
    zs.push([zb, zt]); zb = zt;
  }
  const det = a11 * a22 - a12 * a12, e0 = (b1 * a22 - b2 * a12) / det, k = (a11 * b2 - a12 * b1) / det;
  const stress = layers.map((L, i) => ({ bottom: L.E * (e0 + k * zs[i][0] - L.eps), top: L.E * (e0 + k * zs[i][1] - L.eps), z: zs[i] }));
  return { e0, k, stress, h: zb };
}

/** A bar between rigid walls with an initial gap g (mm; 0 = ends fixed): σ = −E (ε_th L − g)/L once the gap closes. */
export function constrainedBar(E: number, c: Cte, T0: number, T1: number, L: number, gap = 0) {
  const eth = thermalStrain(c, T0, T1), free = eth * L;
  let closeT: number | null = null;
  if (gap > 0 && free > gap) { // temperature at which the gap closes (bisection on the monotonic part)
    let lo = T0, hi = T1;
    for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (thermalStrain(c, T0, m) * L < gap) lo = m; else hi = m; }
    closeT = (lo + hi) / 2;
  }
  // Fully held (no gap): the ends are fixed, so cooling pulls too. With a gap the bar only pushes once it closes.
  const sigma = gap === 0 ? -E * eth : -E * (Math.max(0, free - gap) / L);
  return { eth, free, sigma, closeT };
}
