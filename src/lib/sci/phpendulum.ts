// Simple pendulum lab analysis: exact large-amplitude period (complete elliptic integral via the AGM), small-angle
// series, and a least-squares fit of T² against L to find g (with or without an unknown length offset). No DOM.
import { tInv } from './stats.ts';

const RAD = Math.PI / 180;

/** Complete elliptic integral of the first kind K(k) for modulus k (0 ≤ k < 1), via the arithmetic-geometric mean. */
export function ellipK(k: number) {
  let a = 1, b = Math.sqrt(1 - k * k);
  for (let i = 0; i < 40 && Math.abs(a - b) > 1e-16 * a; i++) { const an = (a + b) / 2; b = Math.sqrt(a * b); a = an; }
  return Math.PI / (2 * a);
}
/** Exact period ÷ small-angle period for an amplitude θ₀ in degrees: 2K(sin(θ₀/2))/π. */
export const largeFactor = (deg: number) => (deg === 0 ? 1 : (2 * ellipK(Math.sin((Math.abs(deg) * RAD) / 2))) / Math.PI);
/** The first terms of the series, 1 + θ²/16 + 11θ⁴/3072 (θ in radians). */
export const seriesFactor = (deg: number) => { const t = deg * RAD; return 1 + (t * t) / 16 + (11 * t ** 4) / 3072; };
/** Small-angle period 2π√(L/g). */
export const smallPeriod = (L: number, g: number) => 2 * Math.PI * Math.sqrt(L / g);

export type PendFit = {
  n: number; g: number; ug: number; ci95: [number, number]; slope: number; uSlope: number; intercept: number; uIntercept: number;
  offset: number; uOffset: number; r2: number; rmsT: number; T0: number[]; T2: number[]; pred: number[]; resid: number[]; df: number;
};

/**
 * Fit g from lengths L (m) and periods T (s). Periods are first divided by the large-amplitude factor for their amplitude
 * (deg; 0 = no correction). With `offset` true, fits T² = a + bL (a constant unknown extra length δ = a/b, e.g. to the
 * bob's centre); otherwise T² = bL through the origin. g = 4π²/b.
 */
export function fitG(L: number[], T: number[], amp: number[] = [], offset = false): PendFit {
  const n = L.length;
  const T0 = T.map((t, i) => t / largeFactor(amp[i] ?? 0)), y = T0.map((t) => t * t);
  let b: number, a = 0, ub: number, ua = 0, cab = 0, df: number;
  if (offset) {
    const mx = L.reduce((s, x) => s + x, 0) / n, my = y.reduce((s, x) => s + x, 0) / n;
    let sxx = 0, sxy = 0; for (let i = 0; i < n; i++) { sxx += (L[i] - mx) ** 2; sxy += (L[i] - mx) * (y[i] - my); }
    b = sxy / sxx; a = my - b * mx; df = n - 2;
    const sse = y.reduce((s, yi, i) => s + (yi - a - b * L[i]) ** 2, 0), s2 = df > 0 ? sse / df : NaN;
    ub = Math.sqrt(s2 / sxx); ua = Math.sqrt(s2 * (1 / n + (mx * mx) / sxx)); cab = (-mx * s2) / sxx;
  } else {
    let sxx = 0, sxy = 0; for (let i = 0; i < n; i++) { sxx += L[i] * L[i]; sxy += L[i] * y[i]; }
    b = sxy / sxx; df = n - 1;
    const sse = y.reduce((s, yi, i) => s + (yi - b * L[i]) ** 2, 0), s2 = df > 0 ? sse / df : NaN;
    ub = Math.sqrt(s2 / sxx);
  }
  const pred = L.map((x) => a + b * x), resid = y.map((v, i) => v - pred[i]);
  const my = y.reduce((s, x) => s + x, 0) / n, sst = y.reduce((s, v) => s + (v - my) ** 2, 0);
  const sse = resid.reduce((s, r) => s + r * r, 0);
  const g = (4 * Math.PI * Math.PI) / b, ug = (g * ub) / b;
  const tq = df > 0 ? tInv(0.975, df) : NaN, bLo = b + tq * ub, bHi = b - tq * ub;
  const offs = offset ? a / b : 0, uoff = offset ? Math.sqrt(Math.max(0, (ua * ua) / (b * b) + (a * a * ub * ub) / b ** 4 - (2 * a * cab) / b ** 3)) : 0; // first-order, with the a-b covariance
  const rmsT = Math.sqrt(T0.reduce((s, t, i) => s + (t - Math.sqrt(Math.max(0, pred[i]))) ** 2, 0) / n);
  return { n, g, ug, ci95: [(4 * Math.PI * Math.PI) / bLo, bHi > 0 ? (4 * Math.PI * Math.PI) / bHi : Infinity], slope: b, uSlope: ub, intercept: a, uIntercept: ua, offset: offs, uOffset: uoff, r2: 1 - sse / sst, rmsT, T0, T2: y, pred, resid, df };
}
