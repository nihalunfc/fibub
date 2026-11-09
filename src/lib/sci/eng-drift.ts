// Calibration drift: straight-line drift of an instrument's as-found error against time, prediction interval,
// predicted date to reach a tolerance limit, and a calibration interval that meets a reliability target. No DOM.
import { fitLine } from './fit.ts';
import { tInv, tCdf } from './stats.ts';

export type DriftFit = {
  n: number; slope: number; intercept: number; seSlope: number; s: number; df: number; tbar: number; sxx: number; r2: number;
  slopeCI: [number, number]; pSlope: number;
};
/** Ordinary least squares of error e against time t (years). */
export function driftFit(t: number[], e: number[], conf = 0.95): DriftFit {
  const f = fitLine(t, e), tc = tInv(1 - (1 - conf) / 2, f.df);
  const tStat = f.seSlope > 0 ? f.slope / f.seSlope : Infinity;
  return { n: f.n, slope: f.slope, intercept: f.intercept, seSlope: f.seSlope, s: f.syx, df: f.df, tbar: f.xbar, sxx: f.sxx, r2: f.r2,
    slopeCI: [f.slope - tc * f.seSlope, f.slope + tc * f.seSlope], pSlope: Number.isFinite(tStat) ? 2 * (1 - tCdf(Math.abs(tStat), f.df)) : 0 };
}
/** Fitted value and the standard error for a new single observation at time t (prediction). */
export function predict(f: DriftFit, t: number): { y: number; se: number } {
  return { y: f.intercept + f.slope * t, se: f.s * Math.sqrt(1 + 1 / f.n + (t - f.tbar) ** 2 / f.sxx) };
}
/** Two-sided prediction interval at t. */
export function predInterval(f: DriftFit, t: number, conf = 0.95): [number, number] {
  const p = predict(f, t), h = tInv(1 - (1 - conf) / 2, f.df) * p.se; return [p.y - h, p.y + h];
}
/** Probability that a new as-found error at t lies outside [lo, hi], from the t predictive distribution. */
export function probOut(f: DriftFit, t: number, lo: number, hi: number): number {
  const p = predict(f, t);
  const below = Number.isFinite(lo) ? tCdf((lo - p.y) / p.se, f.df) : 0, above = Number.isFinite(hi) ? 1 - tCdf((hi - p.y) / p.se, f.df) : 0;
  return below + above;
}
/** First time after t0 (up to t0 + maxYears) at which g(t) becomes true, by scanning then bisection; NaN if never. */
export function firstTime(g: (t: number) => boolean, t0: number, maxYears = 50): number {
  if (g(t0)) return t0;
  const step = maxYears / 2000;
  let a = t0;
  for (let b = t0 + step; b <= t0 + maxYears + 1e-9; b += step) {
    if (g(b)) { for (let i = 0; i < 60; i++) { const m = (a + b) / 2; if (g(m)) b = m; else a = m; } return b; }
    a = b;
  }
  return NaN;
}
/** Time when the fitted line reaches the tolerance (the side it drifts towards); NaN if it drifts away or is flat. */
export function lineCrossing(f: DriftFit, lo: number, hi: number, after: number): number {
  const ts: number[] = [];
  if (Number.isFinite(hi) && f.slope > 0) ts.push((hi - f.intercept) / f.slope);
  if (Number.isFinite(lo) && f.slope < 0) ts.push((lo - f.intercept) / f.slope);
  const ok = ts.filter((x) => x >= after - 1e-12);
  return ok.length ? Math.min(...ok) : NaN;
}

/** Days since 1970 from YYYY-MM-DD (or YYYY-MM); NaN otherwise. */
export function parseDate(s: string): number {
  const m = /^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/.exec(s.trim());
  if (!m) return NaN;
  const mo = +m[2], d = m[3] ? +m[3] : 1;
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return NaN;
  return Date.UTC(+m[1], mo - 1, d) / 86400000;
}
export const isoDate = (days: number) => new Date(Math.round(days) * 86400000).toISOString().slice(0, 10);

/** Made-up calibration history of a pressure transmitter (error in kPa, expanded uncertainty U, k = 2). */
export const EXAMPLE: [string, number, number][] = [
  ['2019-03-12', 0.01, 0.03], ['2019-09-20', 0.03, 0.03], ['2020-04-02', 0.06, 0.03], ['2020-10-15', 0.05, 0.03],
  ['2021-05-11', 0.09, 0.03], ['2022-01-18', 0.12, 0.03], ['2022-08-30', 0.12, 0.03], ['2023-06-07', 0.17, 0.03], ['2024-02-21', 0.19, 0.03],
];
