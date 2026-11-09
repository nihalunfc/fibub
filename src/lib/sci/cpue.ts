// Catch per unit effort: nominal CPUE by year and a simple standardised index from a log-linear model,
// ln(CPUE) = year + other factors + error, fitted by least squares (a lognormal GLM), with confidence intervals.
import { invSPD, fitLine } from './fit.ts';
import { tInv } from './stats.ts';

export type Rec = { year: number; catch: number; effort: number; f: string[] };
export type YearRow = { year: number; records: number; positive: number; catch: number; effort: number; nominal: number; index: number; lo: number; hi: number; se: number };
export type Effect = { factor: string; level: string; ref: boolean; n: number; mult: number; lo: number; hi: number };
export type CpueFit = { years: YearRow[]; effects: Effect[]; n: number; p: number; df: number; s: number; r2: number; dropped: number; delta: number; trend: { pct: number; lo: number; hi: number; r2: number } | null };

/**
 * Fit the model. Zero catches cannot be logged: `zeros` 'drop' leaves them out, 'add' adds a constant δ (10 % of
 * the mean CPUE of all records) to every CPUE. Each extra factor's reference level is its most common one; the
 * year index is the predicted CPUE at those reference levels, exp(η + s²/2), with a t interval on η.
 */
export function cpueIndex(recs: Rec[], factorNames: string[], zeros: 'drop' | 'add'): CpueFit {
  const years = [...new Set(recs.map((r) => r.year))].sort((a, b) => a - b);
  const allCpue = recs.map((r) => r.catch / r.effort), delta = zeros === 'add' ? (0.1 * allCpue.reduce((s, v) => s + v, 0)) / allCpue.length : 0;
  const use = recs.filter((r) => zeros === 'add' || r.catch > 0);
  if (zeros === 'add' && !(delta > 0)) throw new Error('Every catch is zero, so there is nothing to model.');
  const levels = factorNames.map((_, j) => {
    const cnt = new Map<string, number>();
    for (const r of use) cnt.set(r.f[j], (cnt.get(r.f[j]) ?? 0) + 1);
    return [...cnt.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([l]) => l);
  });
  const yIdx = new Map(years.map((y, i) => [y, i]));
  const usedYears = new Set(use.map((r) => r.year));
  const missing = years.filter((y) => !usedYears.has(y));
  if (missing.length) throw new Error(`${missing.join(', ')} ${missing.length > 1 ? 'have' : 'has'} no records with a catch above 0. Add a constant for zero catches, or remove ${missing.length > 1 ? 'those years' : 'that year'}.`);
  // Columns: intercept, years 2..Y, then each factor's non-reference levels.
  const p = 1 + (years.length - 1) + levels.reduce((s, l) => s + l.length - 1, 0);
  const row = (r: Rec) => {
    const x = new Array(p).fill(0); x[0] = 1;
    const yi = yIdx.get(r.year)!; if (yi > 0) x[yi] = 1;
    let o = years.length;
    levels.forEach((l, j) => { const k = l.indexOf(r.f[j]); if (k > 0) x[o + k - 1] = 1; o += l.length - 1; });
    return x;
  };
  const X = use.map(row), y = use.map((r) => Math.log(r.catch / r.effort + delta)), n = use.length;
  if (n <= p) throw new Error(`The model has ${p} terms but only ${n} records to fit them. Use fewer factors or more data.`);
  const A = Array.from({ length: p }, (_, a) => Array.from({ length: p }, (_, b) => X.reduce((s, x) => s + x[a] * x[b], 0)));
  const inv = invSPD(A);
  if (!inv) throw new Error('The years and factors are confounded (for example, a vessel that fished in only one year), so the year effects cannot be separated. Remove that factor or combine levels.');
  const g = Array.from({ length: p }, (_, a) => X.reduce((s, x, i) => s + x[a] * y[i], 0));
  const b = inv.map((r) => r.reduce((s, v, j) => s + v * g[j], 0));
  const fit = X.map((x) => x.reduce((s, v, j) => s + v * b[j], 0));
  const sse = y.reduce((s, v, i) => s + (v - fit[i]) ** 2, 0), df = n - p, s2 = sse / df, s = Math.sqrt(s2);
  const ybar = y.reduce((s0, v) => s0 + v, 0) / n, sst = y.reduce((s0, v) => s0 + (v - ybar) ** 2, 0);
  const t = tInv(0.975, df), bc = Math.exp(s2 / 2);
  const yr: YearRow[] = years.map((yv, i) => {
    const c = new Array(p).fill(0); c[0] = 1; if (i > 0) c[i] = 1;
    const eta = c.reduce((s0, v, j) => s0 + v * b[j], 0);
    const v = c.reduce((s0, ci, a) => s0 + ci * c.reduce((s1, cj, k) => s1 + cj * inv[a][k], 0), 0) * s2, se = Math.sqrt(v);
    const rs = recs.filter((r) => r.year === yv), C = rs.reduce((s0, r) => s0 + r.catch, 0), E = rs.reduce((s0, r) => s0 + r.effort, 0);
    return { year: yv, records: rs.length, positive: rs.filter((r) => r.catch > 0).length, catch: C, effort: E, nominal: C / E, index: Math.exp(eta) * bc - delta, lo: Math.exp(eta - t * se) * bc - delta, hi: Math.exp(eta + t * se) * bc - delta, se };
  });
  const effects: Effect[] = [];
  let o = years.length;
  levels.forEach((l, j) => {
    l.forEach((lev, k) => {
      const n0 = use.filter((r) => r.f[j] === lev).length;
      if (k === 0) { effects.push({ factor: factorNames[j], level: lev, ref: true, n: n0, mult: 1, lo: NaN, hi: NaN }); return; }
      const bi = b[o + k - 1], se = Math.sqrt(inv[o + k - 1][o + k - 1] * s2);
      effects.push({ factor: factorNames[j], level: lev, ref: false, n: n0, mult: Math.exp(bi), lo: Math.exp(bi - t * se), hi: Math.exp(bi + t * se) });
    });
    o += l.length - 1;
  });
  let trend: CpueFit['trend'] = null;
  const pos = yr.filter((r) => r.index > 0);
  if (pos.length >= 3) {
    const L = fitLine(pos.map((r) => r.year), pos.map((r) => Math.log(r.index))), tt = tInv(0.975, L.df);
    trend = { pct: 100 * (Math.exp(L.slope) - 1), lo: 100 * (Math.exp(L.slope - tt * L.seSlope) - 1), hi: 100 * (Math.exp(L.slope + tt * L.seSlope) - 1), r2: L.r2 };
  }
  return { years: yr, effects, n, p, df, s, r2: sst > 0 ? 1 - sse / sst : 1, dropped: recs.length - use.length, delta, trend };
}
