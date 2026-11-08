// Slug tests: fit the exponential recovery of head after a sudden change, then hydraulic conductivity by the
// Hvorslev (1951) and Bouwer-Rice (1976) equations. Plain maths; no DOM.

import { fitLine } from './fit.ts';

/**
 * Fit ln(H/H0) = a − t/T0 over the readings whose H/H0 lies in [lo, hi]. Returns the basic time lag T0 (the time for
 * H/H0 to reach e⁻¹ ≈ 0.37 on the fitted line) and the line. H0 is the first displacement unless given.
 */
export function fitRecovery(t: number[], h: number[], opts: { h0?: number; lo?: number; hi?: number; t0?: number } = {}) {
  if (t.length !== h.length || t.length < 3) throw new Error('Need at least three readings');
  const H0 = opts.h0 ?? h[0], tStart = opts.t0 ?? t[0];
  if (!(Math.abs(H0) > 0)) throw new Error('The starting displacement H0 must not be zero');
  const ratio = h.map((v) => v / H0);
  const lo = opts.lo ?? 0.05, hi = opts.hi ?? 1;
  const use = ratio.map((r, i) => r > 0 && r >= lo && r <= hi && t[i] >= tStart);
  const ix = ratio.map((_, i) => i).filter((i) => use[i]);
  if (ix.length < 2) throw new Error('Fewer than two readings fall in the fit window');
  const x = ix.map((i) => t[i] - tStart), y = ix.map((i) => Math.log(ratio[i]));
  const f = ix.length === 2 ? { slope: (y[1] - y[0]) / (x[1] - x[0]), intercept: y[0] - ((y[1] - y[0]) / (x[1] - x[0])) * x[0], r2: 1 } : fitLine(x, y);
  if (!(f.slope < 0)) throw new Error('The displacement does not shrink with time in the fit window');
  const T0 = -1 / f.slope;
  // Sign changes mean an oscillating (underdamped) response, which these methods do not cover.
  const oscillates = ratio.slice(1).some((r) => r < -0.02);
  return { H0, T0, a: f.intercept, b: f.slope, r2: f.r2, used: use, ratio, tStart, oscillates, n: ix.length };
}

/** Hvorslev (1951) for a well screen of length Le and radius R, with Le/R > 8: K = rc² ln(Le/R) / (2 Le T0). */
export const hvorslev = (rc: number, R: number, Le: number, T0: number) => (rc * rc * Math.log(Le / R)) / (2 * Le * T0);

/** Bouwer-Rice (1976): K = rc² ln(Re/rw) / (2 Le T0), with the effective radius ratio supplied by the user. */
export const bouwerRice = (rc: number, lnReRw: number, Le: number, T0: number) => (rc * rc * lnReRw) / (2 * Le * T0);

/** Effective casing radius when the water level moves inside the filter pack: rc² = rc_casing² (1 − n) + n R² (common correction). */
export const rcEffective = (rc: number, R: number, n: number) => Math.sqrt((1 - n) * rc * rc + n * R * R);
