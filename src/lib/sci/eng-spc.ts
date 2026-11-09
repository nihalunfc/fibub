// Statistical constants for quality control, computed from their definitions rather than copied from tables:
// d2 (mean range of n normal values in units of σ), d3 (standard deviation of that range), c4 (mean of the
// sample standard deviation in units of σ) and d2* for g ranges (Patnaik's approximation, as used for gauge
// studies). No DOM.
import { logGamma, normCdf } from './stats.ts';

const phi = (x: number) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
const cache = new Map<string, number>();

/** d2(n) = ∫ [1 − Φ(x)ⁿ − (1 − Φ(x))ⁿ] dx, by Simpson's rule on [−9, 9]. */
export function d2(n: number): number {
  if (!(n >= 2)) return NaN;
  const key = `d2:${n}`; if (cache.has(key)) return cache.get(key)!;
  const N = 4000, a = -9, h = 18 / N;
  let s = 0;
  for (let i = 0; i <= N; i++) { const x = a + i * h, F = normCdf(x), v = 1 - Math.pow(F, n) - Math.pow(1 - F, n); s += (i === 0 || i === N ? 1 : i % 2 ? 4 : 2) * v; }
  const r = (s * h) / 3; cache.set(key, r); return r;
}
/**
 * d3(n): √(E[R²] − d2²), with E[R²] = 2 ∫∫_{x<y} [1 − Φ(y)ⁿ − (1 − Φ(x))ⁿ + (Φ(y) − Φ(x))ⁿ] dx dy
 * (the probability that the range exceeds y − x, integrated with weight 2 over the triangle).
 * Uses E[R²] = ∫₀^∞ 2w P(R > w) dw with P(R > w) = 1 − n ∫ φ(x) [Φ(x + w) − Φ(x)]^(n−1) dx.
 */
export function d3(n: number): number {
  if (!(n >= 2)) return NaN;
  const key = `d3:${n}`; if (cache.has(key)) return cache.get(key)!;
  const NX = 1200, ax = -9, hx = 18 / NX;
  const xs: number[] = [], wx: number[] = [], fx: number[] = [], px: number[] = [];
  for (let i = 0; i <= NX; i++) { const x = ax + i * hx; xs.push(x); wx.push(((i === 0 || i === NX ? 1 : i % 2 ? 4 : 2) * hx) / 3); fx.push(phi(x)); px.push(normCdf(x)); }
  const cdfR = (w: number) => { let s = 0; for (let i = 0; i <= NX; i++) s += wx[i] * fx[i] * Math.pow(normCdf(xs[i] + w) - px[i], n - 1); return n * s; };
  const NW = 600, hw = 12 / NW;
  let er2 = 0;
  for (let j = 0; j <= NW; j++) { const w = j * hw; er2 += ((j === 0 || j === NW ? 1 : j % 2 ? 4 : 2) * 2 * w * (1 - cdfR(w)) * hw) / 3; }
  const r = Math.sqrt(Math.max(0, er2 - d2(n) ** 2)); cache.set(key, r); return r;
}
/** c4(n) = √(2/(n−1)) Γ(n/2) / Γ((n−1)/2). */
export function c4(n: number): number {
  if (!(n >= 2)) return NaN;
  return Math.sqrt(2 / (n - 1)) * Math.exp(logGamma(n / 2) - logGamma((n - 1) / 2));
}
/** d2* for g ranges of m values each (Patnaik approximation): √(d2² + d3²/g). */
export function d2star(m: number, g: number): number { return Math.sqrt(d2(m) ** 2 + d3(m) ** 2 / g); }

/** Regularised lower incomplete gamma P(a, x), series or continued fraction. */
export function gammaP(a: number, x: number): number {
  if (x <= 0) return 0;
  const lg = logGamma(a);
  if (x < a + 1) {
    let sum = 1 / a, term = sum;
    for (let n = 1; n < 500; n++) { term *= x / (a + n); sum += term; if (Math.abs(term) < Math.abs(sum) * 1e-16) break; }
    return sum * Math.exp(-x + a * Math.log(x) - lg);
  }
  let b = x + 1 - a, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i < 500; i++) { const an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300; c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-16) break; }
  return 1 - Math.exp(-x + a * Math.log(x) - lg) * h;
}
export const chi2Cdf = (x: number, k: number) => gammaP(k / 2, x / 2);
/** Chi-square quantile by bisection. */
export function chi2Inv(p: number, k: number): number {
  let lo = 0, hi = Math.max(10, k * 5);
  while (chi2Cdf(hi, k) < p) hi *= 2;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (chi2Cdf(m, k) < p) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
