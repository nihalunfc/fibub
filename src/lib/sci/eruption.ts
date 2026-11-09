// Eruption column height and mass eruption rate, both ways round:
//  1. An empirical power law H = a · V^b (H in km above the vent, V the dense-rock (DRE) volume flux in m³/s), with
//     the widely used coefficients of Mastin et al. (2009), a = 2.00 and b = 0.241, editable.
//  2. Morton, Taylor and Turner (1956) buoyant plume theory: a top-hat plume from a point source of buoyancy flux F0
//     rising through air of constant buoyancy frequency N, entraining air at speed α·w. Its top is
//     H = C · α^(−1/2) · F0^(1/4) · N^(−3/4); the constant C comes from integrating the plume equations here.
//     F0 comes from the heat the erupted mass carries: F0 = g · Q · cp · ΔT / (ρa · ca · Ta).
// Plus erupted mass over a duration and its DRE volume. No DOM.

export const G = 9.81;

/** H (km above vent) from DRE volume flux V (m³/s) by H = a V^b. */
export const heightFromV = (V: number, a: number, b: number) => a * Math.pow(V, b);
/** DRE volume flux V (m³/s) from H (km above vent). */
export const vFromHeight = (H: number, a: number, b: number) => Math.pow(H / a, 1 / b);

/**
 * Integrate the top-hat plume equations in scaled form (α = 1, F = 1, N = 1, fluxes divided by π):
 *   dQ/dz = 2 M^(1/2),  d(M²)/dz = 2 F Q,  dF/dz = −Q
 * from the pure-plume similarity solution near the source. Returns the scaled height of neutral buoyancy (F = 0) and
 * of the top (M = 0), and the profile for plotting.
 */
export function mttScaled(step = 2e-5) {
  const z0 = 1e-6, A = Math.cbrt(25 / 48);
  // pure plume: b = 6z/5, w = A z^(−1/3)
  let z = z0, Q = (36 / 25) * A * Math.pow(z0, 5 / 3), P = Math.pow((36 / 25) * A * A * Math.pow(z0, 4 / 3), 2), F = 1;
  const d = (q: number, p: number, f: number): [number, number, number] => [2 * Math.pow(Math.max(p, 0), 0.25), 2 * f * q, -q];
  let zNB = NaN;
  const prof: [number, number, number][] = [];
  while (P > 0 && z < 10) {
    const k1 = d(Q, P, F), k2 = d(Q + (step / 2) * k1[0], P + (step / 2) * k1[1], F + (step / 2) * k1[2]);
    const k3 = d(Q + (step / 2) * k2[0], P + (step / 2) * k2[1], F + (step / 2) * k2[2]), k4 = d(Q + step * k3[0], P + step * k3[1], F + step * k3[2]);
    const nQ = Q + (step / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]), nP = P + (step / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]), nF = F + (step / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]);
    if (F > 0 && nF <= 0) zNB = z + (step * F) / (F - nF);
    if (nP <= 0) { z += (step * P) / (P - nP); P = 0; break; }
    Q = nQ; P = nP; F = nF; z += step;
    if (prof.length === 0 || z - prof[prof.length - 1][0] > 0.01) prof.push([z, Q, F]);
  }
  return { top: z, nb: zNB, profile: prof };
}

let cache: { top: number; nb: number } | null = null;
/** Scaled top and neutral-buoyancy heights (computed once). */
export function mttConstants() {
  if (!cache) { const r = mttScaled(); cache = { top: r.top, nb: r.nb }; }
  return cache;
}

/** Height (m) of the plume top and of neutral buoyancy for a buoyancy flux F0 (m⁴/s³), α and N (1/s). */
export function mttHeight(F0: number, alpha: number, N: number) {
  const c = mttConstants(), s = Math.pow(alpha, -0.5) * Math.pow(F0 / Math.PI, 0.25) * Math.pow(N, -0.75);
  return { top: c.top * s, nb: c.nb * s, C: c.top * Math.pow(Math.PI, -0.25) };
}
/** Buoyancy flux F0 (m⁴/s³) from a top height (m). */
export function mttFlux(H: number, alpha: number, N: number) {
  const c = mttConstants();
  return Math.PI * Math.pow(H / (c.top * Math.pow(alpha, -0.5) * Math.pow(N, -0.75)), 4);
}

export type Thermal = { cp: number; dT: number; rhoA: number; cA: number; tA: number };
/** Buoyancy flux (m⁴/s³) from a mass eruption rate Q (kg/s): the heat flux Q·cp·ΔT turned into buoyancy. */
export const fluxFromQ = (Q: number, t: Thermal) => (G * Q * t.cp * t.dT) / (t.rhoA * t.cA * t.tA);
export const qFromFlux = (F: number, t: Thermal) => (F * t.rhoA * t.cA * t.tA) / (G * t.cp * t.dT);

/** Erupted mass (kg) and volumes (m³) over a duration (s). */
export function totals(Q: number, seconds: number, rhoDRE: number, rhoBulk?: number) {
  const M = Q * seconds;
  return { mass: M, dre: M / rhoDRE, bulk: rhoBulk && rhoBulk > 0 ? M / rhoBulk : undefined };
}
