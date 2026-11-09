// Crime (event) rates: rates per 1,000 or 100,000 with exact Poisson or Byar confidence intervals, rate ratios
// (exact conditional and log-normal intervals), percent change and direct age standardisation with the
// Fay–Feuer gamma interval. Plain maths, no DOM.
import { logGamma, ibeta, normInv } from './stats.ts';

/** Regularised lower incomplete gamma P(a, x) (series below a + 1, continued fraction above; Numerical Recipes 6.2). */
export function gammaP(a: number, x: number): number {
  if (x <= 0) return 0;
  const lg = a * Math.log(x) - x - logGamma(a);
  if (x < a + 1) {
    let ap = a, sum = 1 / a, del = sum;
    for (let n = 0; n < 1000; n++) { ap++; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-16) break; }
    return sum * Math.exp(lg);
  }
  let b = x + 1 - a, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i < 1000; i++) {
    const an = -i * (i - a); b += 2;
    d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d; const del = d * c; h *= del;
    if (Math.abs(del - 1) < 1e-16) break;
  }
  return 1 - Math.exp(lg) * h;
}

/** Solve f(x) = p for an increasing f on (lo, hi) by bisection to full precision. */
function solve(f: (x: number) => number, p: number, lo: number, hi: number): number {
  while (f(hi) < p) { lo = hi; hi *= 2; if (hi > 1e300) return Infinity; }
  for (let i = 0; i < 300; i++) { const mid = (lo + hi) / 2; if (f(mid) < p) lo = mid; else hi = mid; if (hi - lo <= 1e-15 * hi) break; }
  return (lo + hi) / 2;
}
/** Chi-square quantile with df degrees of freedom (any df > 0). */
export const chi2Inv = (p: number, df: number) => (p <= 0 ? 0 : 2 * solve((x) => gammaP(df / 2, x), p, 0, Math.max(1, df)));
/** Beta quantile. */
export const betaInv = (p: number, a: number, b: number) => (p <= 0 ? 0 : p >= 1 ? 1 : solve((x) => ibeta(x, a, b), p, 0, 1));

/** Exact (Garwood) Poisson interval for a count k. */
export function poissonExact(k: number, conf = 0.95): [number, number] {
  const a = 1 - conf;
  return [k === 0 ? 0 : chi2Inv(a / 2, 2 * k) / 2, chi2Inv(1 - a / 2, 2 * k + 2) / 2];
}
/** Byar's approximation to the exact Poisson interval. */
export function byar(k: number, conf = 0.95): [number, number] {
  const z = normInv(1 - (1 - conf) / 2), k1 = k + 1;
  return [k === 0 ? 0 : k * (1 - 1 / (9 * k) - z / (3 * Math.sqrt(k))) ** 3, k1 * (1 - 1 / (9 * k1) + z / (3 * Math.sqrt(k1))) ** 3];
}

export type Rate = { k: number; pop: number; per: number; rate: number; ci: [number, number] };
/** Rate per `per` people with an interval on the count, scaled the same way. */
export function crudeRate(k: number, pop: number, per: number, conf = 0.95, method: 'exact' | 'byar' = 'exact'): Rate {
  const c = method === 'exact' ? poissonExact(k, conf) : byar(k, conf);
  return { k, pop, per, rate: (k / pop) * per, ci: [(c[0] / pop) * per, (c[1] / pop) * per] };
}

const logBinom = (n: number, k: number) => logGamma(n + 1) - logGamma(k + 1) - logGamma(n - k + 1);
/** Two-sided exact binomial test p-value (sum of outcomes no more likely than the one seen, as in SciPy's binomtest). */
export function binomTwoSided(k: number, n: number, p: number): number {
  if (p <= 0) return k === 0 ? 1 : 0;
  if (p >= 1) return k === n ? 1 : 0;
  const lp = (j: number) => logBinom(n, j) + j * Math.log(p) + (n - j) * Math.log1p(-p);
  const d = lp(k), tol = 1e-7;
  let s = 0;
  for (let j = 0; j <= n; j++) { const l = lp(j); if (l <= d + Math.log1p(tol)) s += Math.exp(l); }
  return Math.min(1, s);
}

export type RateRatio = { rr: number; logCi: [number, number]; exactCi: [number, number]; p: number; change: number; changeCi: [number, number] };
/**
 * Rate ratio (area or year 1 over the reference 2). The exact interval treats k1 given k1 + k2 as binomial
 * (Clopper–Pearson) and turns the proportion into a ratio; the log interval is exp(ln RR ± z √(1/k1 + 1/k2)).
 * Percent change is 100 (RR − 1), with the exact interval.
 */
export function rateRatio(k1: number, p1: number, k2: number, p2: number, conf = 0.95): RateRatio {
  const a = 1 - conf, z = normInv(1 - a / 2), n = k1 + k2, rr = (k1 / p1) / (k2 / p2);
  const se = Math.sqrt(1 / k1 + 1 / k2);
  const logCi: [number, number] = k1 > 0 && k2 > 0 ? [rr * Math.exp(-z * se), rr * Math.exp(z * se)] : [NaN, NaN];
  const lo = k1 === 0 ? 0 : betaInv(a / 2, k1, n - k1 + 1), hi = k1 === n ? 1 : betaInv(1 - a / 2, k1 + 1, n - k1);
  const toRR = (pi: number) => (pi >= 1 ? Infinity : (pi / (1 - pi)) * (p2 / p1));
  const exactCi: [number, number] = n > 0 ? [toRR(lo), toRR(hi)] : [NaN, NaN];
  const p = n > 0 ? binomTwoSided(k1, n, p1 / (p1 + p2)) : NaN;
  return { rr, logCi, exactCi, p, change: 100 * (rr - 1), changeCi: [100 * (exactCi[0] - 1), 100 * (exactCi[1] - 1)] };
}

export type AgeRow = { k: number; pop: number; std: number };
/**
 * Direct standardisation: Σ wᵢ rᵢ / Σ wᵢ with rᵢ = kᵢ / popᵢ and wᵢ the standard population. Variance
 * Σ (wᵢ/W)² kᵢ / popᵢ². Intervals: normal, and the Fay–Feuer (1997) gamma interval.
 */
export function directStd(rows: AgeRow[], per: number, conf = 0.95) {
  const a = 1 - conf, z = normInv(1 - a / 2), W = rows.reduce((s, r) => s + r.std, 0);
  const y = rows.reduce((s, r) => s + (r.std / W) * (r.k / r.pop), 0);
  const v = rows.reduce((s, r) => s + (r.std / W) ** 2 * (r.k / r.pop ** 2), 0);
  const wM = Math.max(...rows.map((r) => r.std / W / r.pop));
  const gLo = y === 0 ? 0 : (v / (2 * y)) * chi2Inv(a / 2, (2 * y * y) / v);
  const gHi = ((v + wM * wM) / (2 * (y + wM))) * chi2Inv(1 - a / 2, (2 * (y + wM) ** 2) / (v + wM * wM));
  const K = rows.reduce((s, r) => s + r.k, 0), P = rows.reduce((s, r) => s + r.pop, 0);
  return {
    asr: y * per, se: Math.sqrt(v) * per, normalCi: [(y - z * Math.sqrt(v)) * per, (y + z * Math.sqrt(v)) * per] as [number, number],
    gammaCi: [gLo * per, gHi * per] as [number, number], crude: (K / P) * per, k: K, pop: P,
    groups: rows.map((r) => ({ rate: (r.k / r.pop) * per, weight: r.std / W })),
  };
}
