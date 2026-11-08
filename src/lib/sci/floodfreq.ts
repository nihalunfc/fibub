// Flood frequency analysis of annual maxima: Gumbel (moments and L-moments), GEV (L-moments, Hosking's approximation),
// log-Pearson type III (moments of log10 flows, station or typed skew), plotting positions, Grubbs-Beck outlier screen and
// bootstrap confidence intervals. No DOM.
import { logGamma, normInv } from './stats.ts';

const EULER = 0.5772156649015329;

/** Regularised lower incomplete gamma P(a, x), by its series for x < a + 1 and a continued fraction otherwise. */
export function gammaP(a: number, x: number) {
  if (x <= 0) return 0;
  const lg = a * Math.log(x) - x - logGamma(a);
  if (x < a + 1) {
    let sum = 1 / a, term = sum;
    for (let n = 1; n < 100000; n++) { term *= x / (a + n); sum += term; if (Math.abs(term) < Math.abs(sum) * 1e-15) break; }
    return Math.min(1, sum * Math.exp(lg));
  }
  let b = x + 1 - a, c = 1 / 1e-300, d = 1 / b, h = d;
  for (let i = 1; i < 100000; i++) {
    const an = -i * (i - a); b += 2;
    d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-15) break;
  }
  return Math.max(0, 1 - Math.exp(lg) * h);
}

/** Inverse of P(a, x) in x, by bisection on a bracket around the Wilson-Hilferty start. */
export function gammaPInv(p: number, a: number) {
  const z = normInv(p), wh = a * Math.pow(Math.max(1e-12, 1 - 1 / (9 * a) + (z * Math.sqrt(1 / (9 * a)))), 3);
  let lo = Math.max(0, wh * 0.5 - 1), hi = Math.max(wh * 2 + 10, 1);
  while (gammaP(a, lo) > p && lo > 0) lo = lo / 2 < 1e-300 ? 0 : lo / 2;
  while (gammaP(a, hi) < p) hi *= 2;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (gammaP(a, m) < p) lo = m; else hi = m; if (hi - lo <= 1e-13 * hi) break; }
  return (lo + hi) / 2;
}

/** Pearson type III frequency factor K for non-exceedance probability p and skew g (exact; Wilson-Hilferty for |g| < 0.01). */
export function pearsonK(p: number, g: number) {
  const z = normInv(p);
  if (Math.abs(g) < 0.01) return (2 / g) * (Math.pow(1 + (g * z) / 6 - (g * g) / 36, 3) - 1) || z;
  const a = 4 / (g * g), s = Math.sqrt(a);
  return g > 0 ? (gammaPInv(p, a) - a) / s : -(gammaPInv(1 - p, a) - a) / s;
}

export const meanOf = (x: number[]) => x.reduce((s, v) => s + v, 0) / x.length;
export function sdOf(x: number[]) { const m = meanOf(x); return Math.sqrt(x.reduce((s, v) => s + (v - m) ** 2, 0) / (x.length - 1)); }
/** Sample skew with the usual small-sample correction n / ((n − 1)(n − 2)). */
export function skewOf(x: number[]) { const n = x.length, m = meanOf(x), s = sdOf(x); return (n * x.reduce((t, v) => t + (v - m) ** 3, 0)) / ((n - 1) * (n - 2) * s ** 3); }

/** Sample L-moments λ1, λ2, λ3 and τ3 from unbiased probability-weighted moments. */
export function lmoments(x: number[]) {
  const s = [...x].sort((a, b) => a - b), n = s.length;
  let b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < n; i++) { b0 += s[i]; b1 += (i / (n - 1)) * s[i]; b2 += ((i * (i - 1)) / ((n - 1) * (n - 2))) * s[i]; }
  b0 /= n; b1 /= n; b2 /= n;
  const l1 = b0, l2 = 2 * b1 - b0, l3 = 6 * b2 - 6 * b1 + b0;
  return { l1, l2, l3, t3: l3 / l2 };
}

/** Exceedance probability 1/T to the non-exceedance F and the Gumbel reduced variate. */
export const reduced = (T: number) => -Math.log(-Math.log(1 - 1 / T));

export type Fit = { name: string; q: (T: number) => number; F: (x: number) => number; params: Record<string, number> };

export function gumbelMoments(x: number[]): Fit {
  const a = (Math.sqrt(6) * sdOf(x)) / Math.PI, u = meanOf(x) - EULER * a;
  return { name: 'Gumbel (moments)', q: (T) => u + a * reduced(T), F: (v) => Math.exp(-Math.exp(-(v - u) / a)), params: { u, alpha: a } };
}
export function gumbelL(x: number[]): Fit {
  const L = lmoments(x), a = L.l2 / Math.LN2, u = L.l1 - EULER * a;
  return { name: 'Gumbel (L-moments)', q: (T) => u + a * reduced(T), F: (v) => Math.exp(-Math.exp(-(v - u) / a)), params: { u, alpha: a } };
}
/** GEV by L-moments with Hosking's (1985) approximation for the shape k (Hosking's sign: k > 0 has an upper bound). */
export function gevL(x: number[]): Fit {
  const L = lmoments(x), c = 2 / (3 + L.t3) - Math.LN2 / Math.log(3), k = 7.859 * c + 2.9554 * c * c;
  if (Math.abs(k) < 1e-6) { const g = gumbelL(x); return { ...g, name: 'GEV (L-moments)', params: { ...g.params, xi: g.params.u, k: 0 } }; }
  const g1 = Math.exp(logGamma(1 + k)), a = (L.l2 * k) / ((1 - Math.pow(2, -k)) * g1), xi = L.l1 - (a * (1 - g1)) / k;
  return {
    name: 'GEV (L-moments)', params: { xi, alpha: a, k },
    q: (T) => xi + (a / k) * (1 - Math.pow(-Math.log(1 - 1 / T), k)),
    F: (v) => { const y = 1 - (k * (v - xi)) / a; return y <= 0 ? (k > 0 ? 1 : 0) : Math.exp(-Math.pow(y, 1 / k)); },
  };
}
/** Log-Pearson type III on log10 flows, with the station skew or a typed one (for example a regional skew). */
export function logPearson3(x: number[], skew?: number): Fit {
  const y = x.map(Math.log10), m = meanOf(y), s = sdOf(y), g = skew ?? skewOf(y);
  const q = (T: number) => Math.pow(10, m + s * pearsonK(1 - 1 / T, g));
  const F = (v: number) => {
    if (!(v > 0)) return 0;
    const k = (Math.log10(v) - m) / s;
    let lo = 1e-12, hi = 1 - 1e-12;
    for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; if (pearsonK(mid, g) < k) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  };
  return { name: 'Log-Pearson III', q, F, params: { mean: m, sd: s, skew: g } };
}

/** Plotting positions: return period for each value ranked from largest. Weibull a = 0, Cunnane 0.4, Gringorten 0.44. */
export function plotting(x: number[], a = 0) {
  const s = [...x].sort((p, q) => q - p), n = s.length;
  return s.map((v, i) => ({ x: v, rank: i + 1, T: (n + 1 - 2 * a) / (i + 1 - a) }));
}

/** Grubbs-Beck screen on log10 flows at the 10 % level with the Bulletin 17B approximation of K_N (for 10 ≤ n ≤ 149). */
export function grubbsBeck(x: number[]) {
  const y = x.filter((v) => v > 0).map(Math.log10), n = y.length, m = meanOf(y), s = sdOf(y), ln = Math.log10(n);
  const KN = -0.9043 + 3.345 * Math.sqrt(ln) - 0.4046 * ln;
  const hi = Math.pow(10, m + KN * s), lo = Math.pow(10, m - KN * s);
  return { KN, hi, lo, high: x.filter((v) => v > hi), low: x.filter((v) => v > 0 && v < lo), valid: n >= 10 && n <= 149 };
}

/** Standard error of a Gumbel moments quantile (Kite): s / √n · √(1 + 1.1396 K + 1.1 K²). */
export function gumbelSE(x: number[], T: number) {
  const K = (Math.sqrt(6) / Math.PI) * (reduced(T) - EULER);
  return (sdOf(x) / Math.sqrt(x.length)) * Math.sqrt(1 + 1.1396 * K + 1.1 * K * K);
}

/** A small seeded random generator (mulberry32) so the bootstrap gives the same answer each time. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** Bootstrap percentile interval of each quantile: resample the years with replacement, refit, take the (1 ± conf)/2 points. */
export function bootstrap(x: number[], fit: (s: number[]) => Fit, Ts: number[], B = 1000, conf = 0.9, seed = 1) {
  const r = rng(seed), n = x.length, out: number[][] = Ts.map(() => []);
  for (let b = 0; b < B; b++) {
    const s = Array.from({ length: n }, () => x[Math.floor(r() * n)]);
    if (Math.max(...s) === Math.min(...s)) continue;
    const f = fit(s);
    Ts.forEach((T, i) => { const v = f.q(T); if (Number.isFinite(v)) out[i].push(v); });
  }
  const pick = (a: number[], p: number) => { const s = [...a].sort((u, v) => u - v), h = (s.length - 1) * p, lo = Math.floor(h); return s[lo] + (s[Math.min(lo + 1, s.length - 1)] - s[lo]) * (h - lo); };
  return out.map((a) => (a.length >= 10 ? [pick(a, (1 - conf) / 2), pick(a, (1 + conf) / 2)] : [NaN, NaN]));
}

/** Return period of a flow for a fit: 1 / (1 − F). */
export const returnPeriod = (f: Fit, v: number) => 1 / (1 - f.F(v));
/** Chance of at least one flood bigger than the T-year flood in N years. */
export const riskInYears = (T: number, N: number) => 1 - Math.pow(1 - 1 / T, N);
