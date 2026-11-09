// Black-oil and dry-gas PVT correlations in oilfield units (psia, °F, scf/STB). Published formulas only:
// Standing (1947), Vasquez and Beggs (1980), Beggs and Robinson (1975), Sutton (1985) pseudo-criticals,
// Wichert and Aziz (1972) sour-gas correction, Dranchuk and Abou-Kassem (1975) and Hall and Yarborough (1973)
// Z-factor, Lee, Gonzalez and Eakin (1966) gas viscosity. No DOM.

export const AIR_M = 28.967; // g/mol
export const R_FIELD = 10.7316; // psia ft³ / (lb-mol °R)
export const specificGravity = (api: number) => 141.5 / (api + 131.5);

// ---------- Oil ----------
/** Standing bubble point (psia) from solution GOR Rs (scf/STB), gas gravity, temperature (°F) and API. */
export function standingPb(Rs: number, gg: number, T: number, api: number): number {
  const a = 0.00091 * T - 0.0125 * api;
  return 18.2 * (Math.pow(Rs / gg, 0.83) * Math.pow(10, a) - 1.4);
}
/** Standing solution GOR (scf/STB) at pressure p ≤ pb. */
export function standingRs(p: number, gg: number, T: number, api: number): number {
  const x = 0.0125 * api - 0.00091 * T;
  return gg * Math.pow((p / 18.2 + 1.4) * Math.pow(10, x), 1.2048);
}
/** Standing oil formation volume factor (rb/STB) of saturated oil. */
export function standingBo(Rs: number, gg: number, T: number, api: number): number {
  return 0.9759 + 0.00012 * Math.pow(Rs * Math.sqrt(gg / specificGravity(api)) + 1.25 * T, 1.2);
}
/** Vasquez-Beggs gas gravity corrected to a separator pressure of 100 psig. */
export function vbGasGravity(gg: number, api: number, Tsep: number, psep: number): number {
  return gg * (1 + 5.912e-5 * api * Tsep * Math.log10(psep / 114.7));
}
const vbC = (api: number) => (api <= 30 ? { c1: 0.0362, c2: 1.0937, c3: 25.724, b1: 4.677e-4, b2: 1.751e-5, b3: -1.811e-8 } : { c1: 0.0178, c2: 1.187, c3: 23.931, b1: 4.67e-4, b2: 1.1e-5, b3: 1.337e-9 });
/** Vasquez-Beggs solution GOR at p ≤ pb, with the separator-corrected gas gravity ggs. */
export function vbRs(p: number, ggs: number, T: number, api: number): number {
  const c = vbC(api); return c.c1 * ggs * Math.pow(p, c.c2) * Math.exp((c.c3 * api) / (T + 460));
}
export function vbPb(Rs: number, ggs: number, T: number, api: number): number {
  const c = vbC(api); return Math.pow(Rs / (c.c1 * ggs * Math.exp((c.c3 * api) / (T + 460))), 1 / c.c2);
}
export function vbBo(Rs: number, ggs: number, T: number, api: number): number {
  const c = vbC(api); return 1 + c.b1 * Rs + c.b2 * (T - 60) * (api / ggs) + c.b3 * Rs * (T - 60) * (api / ggs);
}
/** Vasquez-Beggs undersaturated oil compressibility (1/psi) at p ≥ pb. */
export function vbCo(p: number, Rsb: number, ggs: number, T: number, api: number): number {
  return (-1433 + 5 * Rsb + 17.2 * T - 1180 * ggs + 12.61 * api) / (1e5 * p);
}
/** Beggs-Robinson dead-oil viscosity (cP). */
export function brDead(T: number, api: number): number {
  const z = 3.0324 - 0.02023 * api, y = Math.pow(10, z), x = y * Math.pow(T, -1.163);
  return Math.pow(10, x) - 1;
}
/** Beggs-Robinson live (saturated) oil viscosity (cP). */
export function brLive(muDead: number, Rs: number): number {
  const a = 10.715 * Math.pow(Rs + 100, -0.515), b = 5.44 * Math.pow(Rs + 150, -0.338);
  return a * Math.pow(muDead, b);
}
/** Vasquez-Beggs undersaturated oil viscosity (cP) at p > pb from the bubble-point viscosity. */
export function vbUnder(muB: number, p: number, pb: number): number {
  const m = 2.6 * Math.pow(p, 1.187) * Math.exp(-11.513 - 8.98e-5 * p);
  return muB * Math.pow(p / pb, m);
}

export type OilIn = { api: number; gg: number; T: number; Rsb: number; Tsep: number; psep: number; method: 'standing' | 'vb' };
export type OilOut = { pb: number; Rs: number; Bo: number; Bob: number; co: number; muDead: number; muB: number; mu: number; rho: number; ggs: number; saturated: boolean };
/** Oil properties at pressure p for an oil whose total solution GOR (at and above the bubble point) is Rsb. */
export function oil(i: OilIn, p: number): OilOut {
  const ggs = vbGasGravity(i.gg, i.api, i.Tsep, i.psep);
  const vb = i.method === 'vb';
  const pb = vb ? vbPb(i.Rsb, ggs, i.T, i.api) : standingPb(i.Rsb, i.gg, i.T, i.api);
  const rsAt = (pp: number) => Math.min(i.Rsb, vb ? vbRs(pp, ggs, i.T, i.api) : standingRs(pp, i.gg, i.T, i.api));
  const boAt = (rs: number) => (vb ? vbBo(rs, ggs, i.T, i.api) : standingBo(rs, i.gg, i.T, i.api));
  const Bob = boAt(i.Rsb), muDead = brDead(i.T, i.api), muB = brLive(muDead, i.Rsb);
  const saturated = p < pb;
  const Rs = saturated ? rsAt(p) : i.Rsb;
  // Above pb: Bo = Bob·exp(−A·ln(p/pb)) with co = A/p (Vasquez-Beggs), the integral of co over pressure.
  const A = (-1433 + 5 * i.Rsb + 17.2 * i.T - 1180 * ggs + 12.61 * i.api) / 1e5;
  const Bo = saturated ? boAt(Rs) : Bob * Math.exp(-A * Math.log(p / pb));
  const co = saturated ? NaN : vbCo(p, i.Rsb, ggs, i.T, i.api);
  const mu = saturated ? brLive(muDead, Rs) : vbUnder(muB, p, pb);
  // Oil density from mass balance: stock-tank oil plus dissolved gas, per reservoir barrel (lb/ft³).
  const rho = (62.4 * specificGravity(i.api) + 0.0136 * Rs * i.gg) / Bo;
  return { pb, Rs, Bo, Bob, co, muDead, muB, mu, rho, ggs, saturated };
}

// ---------- Gas ----------
/** Sutton (1985) pseudo-critical temperature (°R) and pressure (psia) from gas gravity, with the optional
 * Wichert-Aziz correction for CO2 and H2S mole fractions. */
export function pseudoCritical(gg: number, yCO2 = 0, yH2S = 0): { Tpc: number; Ppc: number; eps: number } {
  let Tpc = 169.2 + 349.5 * gg - 74.0 * gg * gg, Ppc = 756.8 - 131.07 * gg - 3.6 * gg * gg, eps = 0;
  const A = yCO2 + yH2S, B = yH2S;
  if (A > 0) {
    eps = 120 * (Math.pow(A, 0.9) - Math.pow(A, 1.6)) + 15 * (Math.sqrt(B) - Math.pow(B, 4));
    const T2 = Tpc - eps; Ppc = (Ppc * T2) / (Tpc + B * (1 - B) * eps); Tpc = T2;
  }
  return { Tpc, Ppc, eps };
}

const DAK = [0.3265, -1.07, -0.5339, 0.01569, -0.05165, 0.5475, -0.7361, 0.1844, 0.1056, 0.6134, 0.721];
/** Dranchuk-Abou-Kassem Z from reduced pressure and temperature (solves for reduced density). */
export function zDAK(Ppr: number, Tpr: number): number {
  if (Ppr <= 0) return 1;
  const [A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11] = DAK, T = Tpr;
  const c1 = A1 + A2 / T + A3 / T ** 3 + A4 / T ** 4 + A5 / T ** 5, c2 = A6 + A7 / T + A8 / T ** 2, c3 = A9 * (A7 / T + A8 / T ** 2), c4 = A10 / T ** 3;
  const zOf = (r: number) => 1 + c1 * r + c2 * r * r - c3 * r ** 5 + c4 * (1 + A11 * r * r) * r * r * Math.exp(-A11 * r * r);
  const F = (r: number) => zOf(r) * r * T - 0.27 * Ppr; // zero at the solution
  // F(0) < 0; walk up to the first sign change (the gas root), then bisect and polish.
  let lo = 0, hi = 0, step = 0.02;
  for (hi = step; hi < 4; hi += step) { if (F(hi) >= 0) break; lo = hi; }
  if (F(hi) < 0) return NaN;
  for (let k = 0; k < 200 && hi - lo > 1e-15; k++) { const m = (lo + hi) / 2; if (F(m) < 0) lo = m; else hi = m; }
  const r = (lo + hi) / 2;
  return (0.27 * Ppr) / (r * T);
}
/** Hall-Yarborough Z (reduced density y found by bisection then Newton). */
export function zHY(Ppr: number, Tpr: number): number {
  if (Ppr <= 0) return 1;
  const t = 1 / Tpr, A = 0.06125 * t * Math.exp(-1.2 * (1 - t) ** 2), B = 14.76 * t - 9.76 * t * t + 4.58 * t ** 3, C = 90.7 * t - 242.2 * t * t + 42.4 * t ** 3, D = 2.18 + 2.82 * t;
  const F = (y: number) => -A * Ppr + (y + y * y + y ** 3 - y ** 4) / (1 - y) ** 3 - B * y * y + C * Math.pow(y, D);
  let lo = 0, hi = 0;
  for (hi = 0.005; hi < 0.99; hi += 0.005) { if (F(hi) >= 0) break; lo = hi; }
  if (F(hi) < 0) return NaN;
  for (let k = 0; k < 200 && hi - lo > 1e-16; k++) { const m = (lo + hi) / 2; if (F(m) < 0) lo = m; else hi = m; }
  return (A * Ppr) / ((lo + hi) / 2);
}
/** Lee-Gonzalez-Eakin gas viscosity (cP) from temperature (°R), density (g/cm³) and molar mass. */
export function leeViscosity(TR: number, rhoGcc: number, M: number): number {
  const K = ((9.4 + 0.02 * M) * Math.pow(TR, 1.5)) / (209 + 19 * M + TR), X = 3.5 + 986 / TR + 0.01 * M, Y = 2.4 - 0.2 * X;
  return 1e-4 * K * Math.exp(X * Math.pow(rhoGcc, Y));
}
export type GasIn = { gg: number; T: number; yCO2: number; yH2S: number; method: 'dak' | 'hy' };
export type GasOut = { Tpc: number; Ppc: number; eps: number; Tpr: number; Ppr: number; Z: number; Bg: number; rho: number; mu: number; cg: number; M: number; inRange: boolean };
/** Gas properties at pressure p (psia): Bg in ft³/scf (= reservoir m³ per standard m³), density lb/ft³, µ cP, cg 1/psi. */
export function gas(i: GasIn, p: number): GasOut {
  const { Tpc, Ppc, eps } = pseudoCritical(i.gg, i.yCO2, i.yH2S);
  const TR = i.T + 459.67, Tpr = TR / Tpc, Ppr = p / Ppc, M = AIR_M * i.gg;
  const zf = (pr: number) => (i.method === 'hy' ? zHY(pr, Tpr) : zDAK(pr, Tpr));
  const Z = zf(Ppr);
  const Bg = ((14.696 / 519.67) * Z * TR) / p; // standard conditions 14.696 psia and 60 °F
  const rho = (p * M) / (Z * R_FIELD * TR);
  const mu = leeViscosity(TR, rho * 0.0160185, M);
  const h = Math.max(1e-4, Ppr * 1e-4), dZ = (zf(Ppr + h) - zf(Math.max(Ppr - h, 1e-9))) / (Ppr + h - Math.max(Ppr - h, 1e-9));
  const cg = 1 / p - (1 / Z) * (dZ / Ppc);
  const inRange = Ppr >= 0.2 && Ppr <= 30 && Tpr >= 1.0 && Tpr <= 3.0;
  return { Tpc, Ppc, eps, Tpr, Ppr, Z, Bg, rho, mu, cg, M, inRange };
}
