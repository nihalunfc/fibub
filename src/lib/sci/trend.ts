// Trend tests for time series: Mann-Kendall (with tie correction), Hamed-Rao autocorrelation correction, seasonal
// Mann-Kendall, Theil-Sen slope with a confidence interval, Pettitt change point and anomalies. No DOM.
import { normCdf, normInv } from './stats.ts';

const sign = (v: number) => (v > 0 ? 1 : v < 0 ? -1 : 0);
const median = (a: number[]) => { const s = [...a].sort((x, y) => x - y), n = s.length; return n ? (n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2) : NaN; };
export { median };

/** Mann-Kendall S and its variance with the tie correction. */
export function mkScore(x: number[]) {
  const n = x.length;
  let S = 0;
  for (let i = 0; i < n - 1; i++) for (let j = i + 1; j < n; j++) S += sign(x[j] - x[i]);
  const counts = new Map<number, number>();
  for (const v of x) counts.set(v, (counts.get(v) ?? 0) + 1);
  let ties = 0;
  for (const t of counts.values()) if (t > 1) ties += t * (t - 1) * (2 * t + 5);
  const varS = (n * (n - 1) * (2 * n + 5) - ties) / 18;
  return { n, S, varS, tiedGroups: [...counts.values()].filter((t) => t > 1).length };
}

/** Z with the continuity correction, and the two-sided p-value from the normal distribution. */
export function zp(S: number, varS: number) {
  const Z = varS > 0 ? (S > 0 ? (S - 1) / Math.sqrt(varS) : S < 0 ? (S + 1) / Math.sqrt(varS) : 0) : 0;
  return { Z, p: 2 * (1 - normCdf(Math.abs(Z))) };
}

/** Original Mann-Kendall test. Kendall's tau = S / (n(n−1)/2). */
export function mannKendall(x: number[]) {
  const s = mkScore(x);
  return { ...s, ...zp(s.S, s.varS), tau: s.S / ((s.n * (s.n - 1)) / 2) };
}

/** Ranks with ties given their mean rank (1-based). */
export function ranks(x: number[]) {
  const idx = x.map((v, i) => [v, i] as const).sort((a, b) => a[0] - b[0]), r = new Array<number>(x.length);
  for (let i = 0; i < idx.length; ) {
    let j = i; while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++;
    for (let k = i; k <= j; k++) r[idx[k][1]] = (i + j) / 2 + 1;
    i = j + 1;
  }
  return r;
}

/** Autocorrelation at lags 0..nlags (biased estimator, as in most trend software). */
export function acf(x: number[], nlags: number) {
  const n = x.length, m = x.reduce((s, v) => s + v, 0) / n, y = x.map((v) => v - m);
  const c0 = y.reduce((s, v) => s + v * v, 0) / n, out = [1];
  for (let k = 1; k <= nlags; k++) { let s = 0; for (let i = 0; i < n - k; i++) s += y[i] * y[i + k]; out.push(s / n / c0); }
  return out;
}

/**
 * Hamed and Rao (1998) variance correction for serial correlation: the series is detrended with the Sen slope (per
 * step), ranked, and the significant autocorrelations of the ranks (outside ±z/√n) inflate Var(S).
 * maxLag defaults to all lags, as in pyMannKendall; Hamed and Rao suggest 3.
 */
export function hamedRao(x: number[], alpha = 0.05, maxLag?: number) {
  const s = mkScore(x), n = s.n;
  const steps = x.map((_, i) => i + 1), slope = senSlope(steps, x).slope;
  const r = ranks(x.map((v, i) => v - (i + 1) * slope));
  const L = maxLag === undefined ? n - 1 : Math.min(maxLag, n - 1);
  const rho = acf(r, L), bound = normInv(1 - alpha / 2) / Math.sqrt(n);
  let sum = 0; const used: number[] = [];
  for (let k = 1; k <= L; k++) if (Math.abs(rho[k]) > bound) { sum += (n - k) * (n - k - 1) * (n - k - 2) * rho[k]; used.push(k); }
  const factor = 1 + (2 / (n * (n - 1) * (n - 2))) * sum, varS = factor > 0 ? s.varS * factor : NaN;
  return { ...s, varS, factor, lags: used, ...zp(s.S, varS), tau: s.S / ((n * (n - 1)) / 2) };
}

/** Theil-Sen slope (median of pairwise slopes over time) and Conover's intercept, median(x) − slope × median(t). */
export function senSlope(t: number[], x: number[]) {
  const d: number[] = [];
  for (let i = 0; i < x.length - 1; i++) for (let j = i + 1; j < x.length; j++) if (t[j] !== t[i]) d.push((x[j] - x[i]) / (t[j] - t[i]));
  d.sort((a, b) => a - b);
  const slope = median(d);
  return { slope, intercept: median(x) - slope * median(t), slopes: d };
}

/** Confidence interval of the Sen slope (Gilbert 1987): ranks (N′ ∓ z√VarS)/2 of the ordered slopes, interpolated. */
export function senCI(slopes: number[], varS: number, conf = 0.95) {
  const N = slopes.length, C = normInv(1 - (1 - conf) / 2) * Math.sqrt(varS);
  const at = (k: number) => { const kk = Math.min(Math.max(k, 1), N), i = Math.floor(kk), f = kk - i; return i >= N ? slopes[N - 1] : slopes[i - 1] + f * (slopes[i] - slopes[i - 1]); };
  const M1 = (N - C) / 2, M2 = (N + C) / 2 + 1;
  return { lo: M1 < 1 ? NaN : at(M1), hi: M2 > N ? NaN : at(M2) };
}

/**
 * Seasonal Mann-Kendall (Hirsch, Slack and Smith 1982): S and Var(S) summed over the seasons (no covariance term),
 * and the seasonal Sen slope, the median of all within-season slopes. groups[k] holds season k's (t, x) in time order.
 */
export function seasonalMK(groups: { t: number[]; x: number[] }[]) {
  let S = 0, varS = 0, n = 0, pairs = 0;
  const d: number[] = [];
  for (const g of groups) {
    if (g.x.length < 2) continue;
    const s = mkScore(g.x); S += s.S; varS += s.varS; n += s.n; pairs += (s.n * (s.n - 1)) / 2;
    const ss = senSlope(g.t, g.x); d.push(...ss.slopes);
  }
  d.sort((a, b) => a - b);
  return { S, varS, n, tau: pairs ? S / pairs : NaN, ...zp(S, varS), slope: median(d), slopes: d };
}

/** Pettitt (1979) change-point test: K = max |U_t| and the approximate p = 2 exp(−6K²/(n³ + n²)). The change is after index `at`. */
export function pettitt(x: number[]) {
  const n = x.length;
  let U = 0, K = -1, at = 0;
  const Us: number[] = [];
  for (let t = 0; t < n - 1; t++) {
    // U_t = U_{t−1} + Σ_j sign(x_t − x_j)
    for (let j = 0; j < n; j++) U += sign(x[t] - x[j]);
    Us.push(U);
    if (Math.abs(U) > K) { K = Math.abs(U); at = t; }
  }
  return { K, at, U: Us, p: Math.min(1, 2 * Math.exp((-6 * K * K) / (n ** 3 + n ** 2))) };
}

/** Anomalies from the mean of the values whose time lies in [from, to] (both inclusive). */
export function anomalies(t: number[], x: number[], from: number, to: number) {
  const base = x.filter((_, i) => t[i] >= from && t[i] <= to);
  const mean = base.length ? base.reduce((s, v) => s + v, 0) / base.length : NaN;
  return { mean, count: base.length, a: x.map((v) => v - mean) };
}

/** Reads time and value columns: 'year', a decimal year, a date (YYYY-MM or YYYY-MM-DD) or just values (then 1, 2, 3 …). */
export function parseSeries(rows: string[][], toNum: (s: string) => number): { t: number[]; x: number[]; month?: number[]; kind: string; skipped: number } {
  const data = rows.filter((r) => r.some((c) => c.trim() !== ''));
  const isHead = (r: string[]) => r.every((c) => !Number.isFinite(toNum(c)) && !/^\d{4}-\d{1,2}/.test(c.trim()));
  const body = data.length && isHead(data[0]) ? data.slice(1) : data;
  const t: number[] = [], x: number[] = [], month: number[] = [];
  let skipped = 0, kind = 'values', dated = false;
  const twoCol = body.filter((r) => r.length >= 2 && r[1].trim() !== '').length >= body.length / 2;
  body.forEach((r, i) => {
    if (!twoCol) { const v = toNum(r[0]); if (Number.isFinite(v)) { t.push(t.length + 1); x.push(v); } else skipped++; return; }
    const tc = r[0].trim(), v = toNum(r[1] ?? '');
    const m = /^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?/.exec(tc);
    let tv: number, mo: number | undefined;
    if (m) { const y = +m[1], mm = +m[2], dd = m[3] ? +m[3] : 15; mo = mm; tv = y + (mm - 1) / 12 + (dd - 1) / 365.25; dated = true; }
    else tv = toNum(tc);
    if (!Number.isFinite(tv) || !Number.isFinite(v)) { skipped++; return; }
    t.push(tv); x.push(v); month.push(mo ?? NaN); void i;
  });
  if (twoCol) kind = dated ? 'dates' : 'time and value';
  // Keep time order (stable) so the tests see the series as it happened.
  const ord = t.map((_, i) => i).sort((a, b) => t[a] - t[b] || a - b);
  return { t: ord.map((i) => t[i]), x: ord.map((i) => x[i]), month: dated ? ord.map((i) => month[i]) : undefined, kind, skipped };
}
