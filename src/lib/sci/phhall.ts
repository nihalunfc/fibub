// Van der Pauw sheet resistance and Hall effect analysis. Plain maths, no DOM. SI units inside.

/** Elementary charge (CODATA exact, C). */
export const QE = 1.602176634e-19;

/**
 * Sheet resistance from the two van der Pauw resistances R_A = R₁₂,₃₄ and R_B = R₂₃,₄₁ (Ω), solving
 * exp(−πR_A/R_s) + exp(−πR_B/R_s) = 1 by Newton's method. f is the van der Pauw correction factor in
 * R_s = π/ln2 · (R_A + R_B)/2 · f (1 for a symmetric sample).
 */
export function vdpSheet(RA: number, RB: number): { Rs: number; f: number; ratio: number } {
  if (!(RA > 0 && RB > 0)) return { Rs: NaN, f: NaN, ratio: NaN };
  const g = (Rs: number) => Math.exp((-Math.PI * RA) / Rs) + Math.exp((-Math.PI * RB) / Rs) - 1;
  const dg = (Rs: number) => ((Math.PI * RA) / (Rs * Rs)) * Math.exp((-Math.PI * RA) / Rs) + ((Math.PI * RB) / (Rs * Rs)) * Math.exp((-Math.PI * RB) / Rs);
  // Start from the symmetric formula, which lies at or above the root (g is increasing in Rs).
  let Rs = (Math.PI / Math.LN2) * ((RA + RB) / 2);
  for (let i = 0; i < 100; i++) {
    const step = g(Rs) / dg(Rs);
    Rs -= step;
    if (Math.abs(step) < 1e-14 * Rs) break;
  }
  return { Rs, f: Rs / ((Math.PI / Math.LN2) * ((RA + RB) / 2)), ratio: Math.max(RA, RB) / Math.min(RA, RB) };
}

export type HallIn = { I: number; B: number; VH: number; Rs?: number; t?: number; rH?: number };
export type HallOut = { RHs: number; type: 'n' | 'p'; ns: number; n?: number; RH?: number; mu?: number; rho?: number; sigma?: number };
/**
 * Hall analysis. VH is the Hall voltage after removing the offset (V), with the sign convention that holes give
 * VH > 0. RHs = r_H... the sheet Hall coefficient VH/(I B) (m²/C), sheet density n_s = r_H / (e |RHs|) (m⁻²),
 * Hall mobility |RHs| / Rs (m²/(V·s)); with a thickness t (m), bulk density, Hall coefficient and resistivity.
 */
export function hall(h: HallIn): HallOut {
  const rH = h.rH ?? 1, RHs = h.VH / (h.I * h.B), ns = rH / (QE * Math.abs(RHs));
  const out: HallOut = { RHs, type: RHs < 0 ? 'n' : 'p', ns };
  if (h.Rs && h.Rs > 0) out.mu = Math.abs(RHs) / h.Rs / rH;
  if (h.t && h.t > 0) {
    out.n = ns / h.t; out.RH = RHs * h.t;
    if (h.Rs && h.Rs > 0) { out.rho = h.Rs * h.t; out.sigma = 1 / out.rho; }
  }
  return out;
}

/** Least-squares line y = a + b x with standard errors and R². */
export function line(x: number[], y: number[]) {
  const n = x.length, mx = x.reduce((s, v) => s + v, 0) / n, my = y.reduce((s, v) => s + v, 0) / n;
  let sxx = 0, sxy = 0, syy = 0;
  x.forEach((v, i) => { sxx += (v - mx) ** 2; sxy += (v - mx) * (y[i] - my); syy += (y[i] - my) ** 2; });
  const b = sxy / sxx, a = my - b * mx, ssr = Math.max(0, syy - b * sxy), s2 = n > 2 ? ssr / (n - 2) : NaN;
  return { a, b, seB: Math.sqrt(s2 / sxx), seA: Math.sqrt(s2 * (1 / n + (mx * mx) / sxx)), r2: syy > 0 ? 1 - ssr / syy : 1 };
}

/** Largest relative difference (fraction) of a set of readings from their mean: the reciprocity check. */
export const spread = (v: number[]) => { const m = v.reduce((s, x) => s + x, 0) / v.length; return Math.max(...v.map((x) => Math.abs(x - m))) / Math.abs(m); };
