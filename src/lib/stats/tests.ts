// Descriptive statistics, confidence intervals, hypothesis tests and A/B test sums for the Statistics for
// analysts course. Plain maths, no DOM; checked against textbook worked examples in tests/stats.mjs.
import { mean, variance, sd, median, quantile, rng, type Rng } from '../ml/core.ts';
import { normalCdf, normalInv, tCdf, tInv, chi2Cdf, fCdf } from './dist.ts';

const sum = (xs: number[]) => xs.reduce((s, x) => s + x, 0);
const sq = (x: number) => x * x;

// ---------- Describing data ----------
/** Every most common value (a set can have several modes). */
export function modes(xs: (number | string)[]) {
  const c = new Map<number | string, number>();
  for (const x of xs) c.set(x, (c.get(x) ?? 0) + 1);
  const top = Math.max(...c.values());
  return [...c].filter(([, n]) => n === top).map(([v]) => v);
}
export const range = (xs: number[]) => Math.max(...xs) - Math.min(...xs);
/** Quartiles by the same rule as quantile() (linear between order statistics, like Excel QUARTILE.INC and pandas). */
export function quartiles(xs: number[]) { return { q1: quantile(xs, 0.25), q2: quantile(xs, 0.5), q3: quantile(xs, 0.75) }; }
export const iqr = (xs: number[]) => quantile(xs, 0.75) - quantile(xs, 0.25);
/** Median absolute deviation (not scaled). */
export const mad = (xs: number[]) => { const m = median(xs); return median(xs.map((x) => Math.abs(x - m))); };
/** Sample skewness (adjusted Fisher-Pearson, as Excel SKEW and pandas .skew()). */
export function skewness(xs: number[]) {
  const n = xs.length, m = mean(xs), s = sd(xs, true);
  return (n / ((n - 1) * (n - 2))) * sum(xs.map((x) => ((x - m) / s) ** 3));
}
/** Excess kurtosis (as Excel KURT and pandas .kurt()). */
export function kurtosis(xs: number[]) {
  const n = xs.length, m = mean(xs), s = sd(xs, true);
  const a = ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sum(xs.map((x) => ((x - m) / s) ** 4));
  return a - (3 * sq(n - 1)) / ((n - 2) * (n - 3));
}
export const zScore = (x: number, mu: number, s: number) => (x - mu) / s;
/** Share of values at or below x, as a percentage. */
export const percentileRank = (xs: number[], x: number) => (100 * xs.filter((v) => v <= x).length) / xs.length;
/** Box plot numbers with Tukey's 1.5 × IQR fences. */
export function fiveNumber(xs: number[], k = 1.5) {
  const { q1, q2, q3 } = quartiles(xs), f = k * (q3 - q1), lo = q1 - f, hi = q3 + f;
  const inside = xs.filter((x) => x >= lo && x <= hi);
  return { min: Math.min(...xs), q1, median: q2, q3, max: Math.max(...xs), lowFence: lo, highFence: hi, whiskerLo: Math.min(...inside), whiskerHi: Math.max(...inside), outliers: xs.filter((x) => x < lo || x > hi) };
}

// ---------- Probability ----------
/** Bayes' rule for a test: chance of the condition given a positive result. */
export function bayesPositive(prior: number, sensitivity: number, falsePositive: number) {
  const pos = prior * sensitivity + (1 - prior) * falsePositive;
  return (prior * sensitivity) / pos;
}
/** Expected value and standard deviation of a discrete outcome list. */
export function expected(values: number[], probs: number[]) {
  const ev = sum(values.map((v, i) => v * probs[i]));
  return { ev, sd: Math.sqrt(sum(values.map((v, i) => probs[i] * sq(v - ev)))) };
}

// ---------- Estimation ----------
export const standardError = (xs: number[]) => sd(xs, true) / Math.sqrt(xs.length);
/** t confidence interval for a mean from raw values or from (mean, s, n). */
export function ciMean(m: number, s: number, n: number, level = 0.95) {
  const t = tInv(1 - (1 - level) / 2, n - 1), me = (t * s) / Math.sqrt(n);
  return { lo: m - me, hi: m + me, me, t };
}
export const ciMeanOf = (xs: number[], level = 0.95) => ciMean(mean(xs), sd(xs, true), xs.length, level);
/** Wald and Wilson intervals for a proportion. */
export function ciProportion(x: number, n: number, level = 0.95) {
  const z = normalInv(1 - (1 - level) / 2), p = x / n, me = z * Math.sqrt((p * (1 - p)) / n);
  const den = 1 + (z * z) / n, centre = (p + (z * z) / (2 * n)) / den, half = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / den;
  return { p, wald: { lo: p - me, hi: p + me, me }, wilson: { lo: centre - half, hi: centre + half }, z };
}
/** Sample size for a mean to within ±me, or a proportion to within ±me (worst case p = 0.5). */
export const nForMean = (s: number, me: number, level = 0.95) => Math.ceil(sq((normalInv(1 - (1 - level) / 2) * s) / me));
export const nForProportion = (me: number, p = 0.5, level = 0.95) => Math.ceil((sq(normalInv(1 - (1 - level) / 2)) * p * (1 - p)) / sq(me));

/** Percentile bootstrap interval for any statistic. */
export function bootstrapCi(xs: number[], stat: (s: number[]) => number, reps = 2000, level = 0.95, R: Rng = rng(7)) {
  const out: number[] = [];
  for (let r = 0; r < reps; r++) { const s = xs.map(() => xs[Math.floor(R.next() * xs.length)]); out.push(stat(s)); }
  out.sort((a, b) => a - b);
  return { lo: quantile(out, (1 - level) / 2), hi: quantile(out, 1 - (1 - level) / 2), stats: out };
}

// ---------- Tests ----------
export type Tail = 'two' | 'greater' | 'less';
const pFromT = (t: number, df: number, tail: Tail) => (tail === 'two' ? 2 * (1 - tCdf(Math.abs(t), df)) : tail === 'greater' ? 1 - tCdf(t, df) : tCdf(t, df));
const pFromZ = (z: number, tail: Tail) => (tail === 'two' ? 2 * (1 - normalCdf(Math.abs(z))) : tail === 'greater' ? 1 - normalCdf(z) : normalCdf(z));
export { pFromT, pFromZ };

export function zTestMean(m: number, mu0: number, sigma: number, n: number, tail: Tail = 'two') {
  const z = (m - mu0) / (sigma / Math.sqrt(n));
  return { z, p: pFromZ(z, tail) };
}
export function tTestOne(xs: number[], mu0: number, tail: Tail = 'two') {
  const n = xs.length, m = mean(xs), s = sd(xs, true), t = (m - mu0) / (s / Math.sqrt(n));
  return { t, df: n - 1, p: pFromT(t, n - 1, tail), mean: m, s };
}
/** Two-sample t from summaries: Welch (default) or pooled (equal variances). */
export function tTestTwoSummary(m1: number, s1: number, n1: number, m2: number, s2: number, n2: number, equalVar = false, tail: Tail = 'two') {
  let se: number, df: number;
  if (equalVar) {
    const sp2 = ((n1 - 1) * s1 * s1 + (n2 - 1) * s2 * s2) / (n1 + n2 - 2);
    se = Math.sqrt(sp2 * (1 / n1 + 1 / n2)); df = n1 + n2 - 2;
  } else {
    const a = (s1 * s1) / n1, b = (s2 * s2) / n2;
    se = Math.sqrt(a + b); df = sq(a + b) / (sq(a) / (n1 - 1) + sq(b) / (n2 - 1));
  }
  const t = (m1 - m2) / se;
  return { t, df, p: pFromT(t, df, tail), diff: m1 - m2, se };
}
export const tTestTwo = (a: number[], b: number[], equalVar = false, tail: Tail = 'two') => tTestTwoSummary(mean(a), sd(a, true), a.length, mean(b), sd(b, true), b.length, equalVar, tail);
export function tTestPaired(before: number[], after: number[], tail: Tail = 'two') {
  return tTestOne(after.map((x, i) => x - before[i]), 0, tail);
}
/** Two-proportion z-test (pooled), with the unpooled interval for the difference B − A. */
export function propTest(xA: number, nA: number, xB: number, nB: number, tail: Tail = 'two', level = 0.95) {
  const pA = xA / nA, pB = xB / nB, pp = (xA + xB) / (nA + nB);
  const z = (pB - pA) / Math.sqrt(pp * (1 - pp) * (1 / nA + 1 / nB));
  const se = Math.sqrt((pA * (1 - pA)) / nA + (pB * (1 - pB)) / nB), zc = normalInv(1 - (1 - level) / 2);
  return { pA, pB, diff: pB - pA, lift: pA ? (pB - pA) / pA : NaN, z, p: pFromZ(z, tail), lo: pB - pA - zc * se, hi: pB - pA + zc * se };
}
/** Chi-square goodness of fit: observed counts against expected shares (or counts). */
export function chiSquareGof(obs: number[], expected: number[]) {
  const n = sum(obs), es = sum(expected), e = expected.map((x) => (x * n) / es);
  const chi2 = sum(obs.map((o, i) => sq(o - e[i]) / e[i])), df = obs.length - 1;
  return { chi2, df, p: 1 - chi2Cdf(chi2, df), expected: e };
}
/** Chi-square test of independence on an r × c table of counts. */
export function chiSquareTable(t: number[][]) {
  const rows = t.map(sum), cols = t[0].map((_, j) => sum(t.map((r) => r[j]))), n = sum(rows);
  const e = t.map((r, i) => r.map((_, j) => (rows[i] * cols[j]) / n));
  const chi2 = sum(t.flatMap((r, i) => r.map((o, j) => sq(o - e[i][j]) / e[i][j]))), df = (t.length - 1) * (t[0].length - 1);
  const k = Math.min(t.length, t[0].length);
  return { chi2, df, p: 1 - chi2Cdf(chi2, df), expected: e, cramersV: Math.sqrt(chi2 / (n * (k - 1))) };
}
/** One-way ANOVA. */
export function anova(groups: number[][]) {
  const all = groups.flat(), gm = mean(all), k = groups.length, N = all.length;
  const ssb = sum(groups.map((g) => g.length * sq(mean(g) - gm)));
  const ssw = sum(groups.map((g) => { const m = mean(g); return sum(g.map((x) => sq(x - m))); }));
  const dfb = k - 1, dfw = N - k, f = ssb / dfb / (ssw / dfw);
  return { ssb, ssw, dfb, dfw, msb: ssb / dfb, msw: ssw / dfw, f, p: 1 - fCdf(f, dfb, dfw), eta2: ssb / (ssb + ssw) };
}
/** Average ranks (ties share the mean of their ranks), 1-based. */
export function ranks(xs: number[]) {
  const idx = xs.map((x, i) => [x, i] as const).sort((a, b) => a[0] - b[0]), r = new Array(xs.length);
  for (let i = 0; i < idx.length; ) { let j = i; while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++; const avg = (i + j) / 2 + 1; for (let k = i; k <= j; k++) r[idx[k][1]] = avg; i = j + 1; }
  return r as number[];
}
/** Mann-Whitney U with the normal approximation (tie-corrected variance, continuity correction). */
export function mannWhitney(a: number[], b: number[], tail: Tail = 'two') {
  const n1 = a.length, n2 = b.length, r = ranks([...a, ...b]), R1 = sum(r.slice(0, n1));
  const U1 = R1 - (n1 * (n1 + 1)) / 2, U2 = n1 * n2 - U1, mu = (n1 * n2) / 2, N = n1 + n2;
  const ties = new Map<number, number>(); r.forEach((x) => ties.set(x, (ties.get(x) ?? 0) + 1));
  const tc = sum([...ties.values()].map((t) => t ** 3 - t));
  const sig = Math.sqrt(((n1 * n2) / 12) * (N + 1 - tc / (N * (N - 1))));
  const cc = tail === 'two' ? 0.5 * Math.sign(U1 - mu) : tail === 'greater' ? 0.5 : -0.5;
  const z = (U1 - mu - cc) / sig;
  return { U1, U2, U: Math.min(U1, U2), z, p: pFromZ(z, tail) };
}
/** Pearson r with its t-test, and Spearman rho (Pearson on ranks). */
export function pearson(x: number[], y: number[]) {
  const mx = mean(x), my = mean(y);
  const r = sum(x.map((v, i) => (v - mx) * (y[i] - my))) / Math.sqrt(sum(x.map((v) => sq(v - mx))) * sum(y.map((v) => sq(v - my))));
  const n = x.length, t = (r * Math.sqrt(n - 2)) / Math.sqrt(1 - r * r);
  return { r, t, df: n - 2, p: pFromT(t, n - 2, 'two') };
}
export const spearman = (x: number[], y: number[]) => pearson(ranks(x), ranks(y));
/** Simple regression for explaining: slope, intercept, their standard errors, t and p, and R². */
export function regress(x: number[], y: number[]) {
  const n = x.length, mx = mean(x), my = mean(y), sxx = sum(x.map((v) => sq(v - mx)));
  const b = sum(x.map((v, i) => (v - mx) * (y[i] - my))) / sxx, a = my - b * mx;
  const res = y.map((v, i) => v - (a + b * x[i])), sse = sum(res.map(sq)), s = Math.sqrt(sse / (n - 2));
  const seB = s / Math.sqrt(sxx), seA = s * Math.sqrt(1 / n + (mx * mx) / sxx), tb = b / seB;
  const tc = tInv(0.975, n - 2);
  return { a, b, seA, seB, t: tb, p: pFromT(tb, n - 2, 'two'), r2: 1 - sse / sum(y.map((v) => sq(v - my))), s, bLo: b - tc * seB, bHi: b + tc * seB, residuals: res };
}
/** Bonferroni and Holm adjusted p-values (same order as given). */
export const bonferroni = (ps: number[]) => ps.map((p) => Math.min(1, p * ps.length));
export function holm(ps: number[]) {
  const m = ps.length, o = ps.map((p, i) => [p, i] as const).sort((a, b) => a[0] - b[0]), out = new Array(m);
  let run = 0;
  o.forEach(([p, i], k) => { run = Math.max(run, Math.min(1, (m - k) * p)); out[i] = run; });
  return out as number[];
}
/** Cohen's d (pooled standard deviation). */
export function cohensD(a: number[], b: number[]) {
  const sp = Math.sqrt(((a.length - 1) * variance(a, true) + (b.length - 1) * variance(b, true)) / (a.length + b.length - 2));
  return (mean(a) - mean(b)) / sp;
}

// ---------- Power and A/B test planning ----------
/** Visitors per group to detect a change from p1 to p2 (two-sided, normal approximation). */
export function nPerGroupProportions(p1: number, p2: number, alpha = 0.05, power = 0.8) {
  const za = normalInv(1 - alpha / 2), zb = normalInv(power), pb = (p1 + p2) / 2;
  return Math.ceil(sq(za * Math.sqrt(2 * pb * (1 - pb)) + zb * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2))) / sq(p2 - p1));
}
/** People per group to detect a difference delta in means with standard deviation s. */
export const nPerGroupMeans = (delta: number, s: number, alpha = 0.05, power = 0.8) => Math.ceil((2 * sq(normalInv(1 - alpha / 2) + normalInv(power)) * s * s) / (delta * delta));
/** Power of a two-sided two-sample z-test for a true difference delta, standard deviation s, n per group. */
export function powerMeans(delta: number, s: number, n: number, alpha = 0.05) {
  const se = s * Math.sqrt(2 / n), za = normalInv(1 - alpha / 2);
  return 1 - normalCdf(za - Math.abs(delta) / se) + normalCdf(-za - Math.abs(delta) / se);
}
/** Sample ratio mismatch: chi-square test that the split matches the planned shares. */
export const srmTest = (counts: number[], shares: number[]) => chiSquareGof(counts, shares);

// ---------- Time series ----------
export function movingAverage(xs: number[], k: number) { return xs.map((_, i) => (i + 1 < k ? NaN : mean(xs.slice(i + 1 - k, i + 1)))); }
/** Simple exponential smoothing; returns the smoothed level after each value. */
export function expSmooth(xs: number[], alpha: number) { const out: number[] = []; let l = xs[0]; for (const x of xs) { l = alpha * x + (1 - alpha) * l; out.push(l); } return out; }
/** Control chart (individuals) limits: mean ± 3 × moving-range / 1.128. */
export function controlLimits(xs: number[]) {
  const m = mean(xs), mr = mean(xs.slice(1).map((x, i) => Math.abs(x - xs[i]))), s = mr / 1.128;
  return { centre: m, lcl: m - 3 * s, ucl: m + 3 * s, sigma: s };
}
