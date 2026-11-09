// Radiation counting statistics: net count rate and its uncertainty, Currie's decision threshold and detection
// limit (and the minimum detectable activity), exact Poisson confidence limits, dead-time corrections and the best
// split of counting time between sample and background. No DOM.
import { logGamma, normInv } from './stats.ts';

/** Net count rate (counts per unit time) and its 1σ uncertainty from gross G counts in tg and background B in tb. */
export function netRate(G: number, tg: number, B: number, tb: number) {
  const rg = G / tg, rb = B / tb, net = rg - rb, sd = Math.sqrt(G / (tg * tg) + B / (tb * tb));
  return { rg, rb, net, sd, rel: net !== 0 ? sd / Math.abs(net) : Infinity, sdG: Math.sqrt(G) / tg, sdB: Math.sqrt(B) / tb };
}

/**
 * Currie (1968): critical level L_C and detection limit L_D, in net counts during the gross counting time tg, for a
 * background of B counts measured over tb. alpha and beta are the false-positive and false-negative rates.
 */
export function currie(B: number, tb: number, tg: number, alpha = 0.05, beta = 0.05) {
  const muB = (B * tg) / tb, sigma0 = Math.sqrt(muB * (1 + tg / tb));
  const za = normInv(1 - alpha), zb = normInv(1 - beta);
  const LC = za * sigma0, b = 2 * LC + zb * zb, c = LC * LC - zb * zb * sigma0 * sigma0;
  const LD = (b + Math.sqrt(b * b - 4 * c)) / 2;
  return { muB, sigma0, za, zb, LC, LD };
}
/** Minimum detectable activity (Bq) from L_D counts: efficiency (counts per decay), time (s), emission yield. */
export const mda = (LD: number, eff: number, tg: number, yieldFrac = 1) => LD / (eff * tg * yieldFrac);

/** Lambert W, principal branch, for x ≥ −1/e. */
export function lambertW0(x: number): number {
  if (x < -1 / Math.E) return NaN;
  if (x === 0) return 0;
  let w = x < 1 ? (x > -0.3 ? x * (1 - x) : -1 + Math.sqrt(2 * (1 + Math.E * x))) : Math.log(x) - Math.log(Math.log(x) + 1e-300 + (x < 3 ? 1 : 0));
  if (!Number.isFinite(w)) w = 0.5;
  for (let i = 0; i < 60; i++) {
    const e = Math.exp(w), f = w * e - x, d = e * (w + 1);
    if (d === 0) break;
    const dw = f / (d - ((w + 2) * f) / (2 * w + 2));
    w -= dw;
    if (Math.abs(dw) <= 1e-15 * (1 + Math.abs(w))) break;
  }
  return w;
}

/** True rate from a measured rate m with dead time tau: non-paralysable n = m/(1 − mτ). */
export const trueNonPar = (m: number, tau: number) => (m * tau < 1 ? m / (1 - m * tau) : NaN);
/** True rate for a paralysable detector (m = n e^(−nτ)), on the low-rate branch; NaN if mτ > 1/e. */
export const truePar = (m: number, tau: number) => (m * tau <= 1 / Math.E ? -lambertW0(-m * tau) / tau : NaN);
/** Measured rate from a true rate n in each model. */
export const measNonPar = (n: number, tau: number) => n / (1 + n * tau);
export const measPar = (n: number, tau: number) => n * Math.exp(-n * tau);

/** Best share of a total counting time T for the gross count (the rest on background): tg/tb = √(Rg/Rb). */
export function bestSplit(Rg: number, Rb: number, T: number) {
  const a = Math.sqrt(Rg), b = Math.sqrt(Rb), tg = (T * a) / (a + b);
  return { tg, tb: T - tg };
}
/** Total time (gross + background, best split) for a wanted relative 1σ uncertainty of the net rate. */
export const timeForPrecision = (Rg: number, Rb: number, rel: number) => (Math.sqrt(Rg) + Math.sqrt(Rb)) ** 2 / ((Rg - Rb) ** 2 * rel * rel);

/** Regularised lower incomplete gamma P(a, x). */
export function gammaP(a: number, x: number): number {
  if (x <= 0) return 0;
  const lg = logGamma(a);
  if (x < a + 1) {
    let sum = 1 / a, term = sum;
    for (let n = 1; n < 1000; n++) { term *= x / (a + n); sum += term; if (Math.abs(term) < Math.abs(sum) * 1e-16) break; }
    return sum * Math.exp(-x + a * Math.log(x) - lg);
  }
  // Continued fraction for Q (Lentz).
  let b = x + 1 - a, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i < 1000; i++) {
    const an = -i * (i - a); b += 2;
    d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d; const del = d * c; h *= del;
    if (Math.abs(del - 1) < 1e-16) break;
  }
  return 1 - Math.exp(-x + a * Math.log(x) - lg) * h;
}
/** x with P(a, x) = p. */
export function gammaInv(p: number, a: number): number {
  let lo = 0, hi = Math.max(10, a * 3 + 50);
  while (gammaP(a, hi) < p) hi *= 2;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (gammaP(a, m) < p) lo = m; else hi = m; if (hi - lo < 1e-14 * hi) break; }
  return (lo + hi) / 2;
}
/** Exact (Garwood) two-sided confidence interval for the mean of a Poisson count n. */
export function poissonCI(n: number, conf = 0.95) {
  const a = 1 - conf;
  return { lo: n === 0 ? 0 : gammaInv(a / 2, n), hi: gammaInv(1 - a / 2, n + 1) };
}
