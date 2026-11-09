// Noncentral t distribution: CDF by numerical integration over the chi distribution, and its quantile.
// Used for exact confidence intervals of a normal quantile mu + z*sigma (limits of agreement, reference limits).
// T = (Z + delta) / sqrt(V / nu), so P(T <= t) = E[ Phi(t * U - delta) ] with U = sqrt(V / nu), V ~ chi-square(nu).
import { logGamma, normCdf } from './stats.ts';

/** P(T <= t) for the noncentral t with nu degrees of freedom and noncentrality delta. */
export function nctCdf(t: number, nu: number, delta: number): number {
  if (!(nu > 0)) return NaN;
  // Density of U: f(u) = 2 (nu/2)^(nu/2) / Gamma(nu/2) * u^(nu-1) * exp(-nu u^2 / 2).
  const lc = Math.log(2) + (nu / 2) * Math.log(nu / 2) - logGamma(nu / 2);
  const s = 1 / Math.sqrt(2 * nu);
  const lo = Math.max(0, 1 - 12 * s), hi = 1 + 14 * s + (nu < 4 ? 6 : 0);
  const N = 4000, h = (hi - lo) / N;
  let sum = 0;
  for (let i = 0; i <= N; i++) {
    const u = lo + i * h;
    // At u = 0 the density is exp(lc) for nu = 1 and 0 above (nu - 1 > 0).
    const f = u <= 0 ? (nu === 1 ? Math.exp(lc) : 0) : Math.exp(lc + (nu - 1) * Math.log(u) - (nu * u * u) / 2);
    const w = i === 0 || i === N ? 1 : i % 2 ? 4 : 2;
    sum += w * f * normCdf(t * u - delta);
  }
  return Math.min(1, Math.max(0, (sum * h) / 3));
}

/** Quantile of the noncentral t: the t with P(T <= t) = p. */
export function nctInv(p: number, nu: number, delta: number): number {
  if (!(p > 0 && p < 1) || !(nu > 0)) return NaN;
  let lo = delta - 10, hi = delta + 10;
  while (nctCdf(lo, nu, delta) > p) lo = delta - 2 * (delta - lo);
  while (nctCdf(hi, nu, delta) < p) hi = delta + 2 * (hi - delta);
  for (let i = 0; i < 100 && hi - lo > 1e-10 * Math.max(1, Math.abs(hi)); i++) {
    const mid = (lo + hi) / 2;
    if (nctCdf(mid, nu, delta) < p) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * Exact two-sided confidence interval for the normal quantile mu + z*sigma from a sample with mean m, SD s and size n
 * (one-sided tolerance factors, as Carkeet 2015 for limits of agreement): m + s * t'_{p}(n-1, z*sqrt(n)) / sqrt(n).
 */
export function quantileCiExact(m: number, s: number, n: number, z: number, conf: number): [number, number] {
  const a = (1 - conf) / 2, d = z * Math.sqrt(n), r = Math.sqrt(n);
  return [m + (s * nctInv(a, n - 1, d)) / r, m + (s * nctInv(1 - a, n - 1, d)) / r];
}
