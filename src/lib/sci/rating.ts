// Stage-discharge rating curves Q = a (h − h0)^b fitted to gaugings by least squares on logarithms, with the zero-flow
// stage h0 searched or given, an optional second segment above a break stage, residuals, and 95 % ranges. No DOM.
import { tInv } from './stats.ts';

export type Seg = { a: number; b: number; h0: number; n: number; s: number; xbar: number; sxx: number; lo: number; hi: number; sse: number };

/** Least squares of ln Q on ln(h − h0) for a fixed h0. Gaugings at or below h0 are left out. */
export function fitFixed(h: number[], Q: number[], h0: number): Seg | null {
  const x: number[] = [], y: number[] = [];
  h.forEach((v, i) => { if (v > h0 && Q[i] > 0) { x.push(Math.log(v - h0)); y.push(Math.log(Q[i])); } });
  const n = x.length;
  if (n < 3) return null;
  const xbar = x.reduce((s, v) => s + v, 0) / n, ybar = y.reduce((s, v) => s + v, 0) / n;
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sxx += (x[i] - xbar) ** 2; sxy += (x[i] - xbar) * (y[i] - ybar); }
  if (!(sxx > 0)) return null;
  const b = sxy / sxx, la = ybar - b * xbar;
  let sse = 0;
  for (let i = 0; i < n; i++) sse += (y[i] - la - b * x[i]) ** 2;
  const hs = h.filter((v, i) => v > h0 && Q[i] > 0);
  return { a: Math.exp(la), b, h0, n, s: Math.sqrt(sse / (n - 2)), xbar, sxx, lo: Math.min(...hs), hi: Math.max(...hs), sse };
}

/** Searches h0 below the lowest gauging for the smallest log-space misfit (golden section over a wide bracket). */
export function fitSearch(h: number[], Q: number[]): Seg | null {
  const hmin = Math.min(...h), span = Math.max(...h) - hmin || Math.abs(hmin) || 1;
  const f = (h0: number) => fitFixed(h, Q, h0)?.sse ?? Infinity;
  // Coarse scan, then golden section around the best point.
  let best = hmin - 1e-6 * span, bf = f(best);
  const lo0 = hmin - 3 * span;
  for (let k = 0; k <= 300; k++) { const t = hmin - 1e-6 * span - (k / 300) ** 2 * (hmin - 1e-6 * span - lo0); const v = f(t); if (v < bf) { bf = v; best = t; } }
  const step = (hmin - lo0) / 300 * 4;
  let a = Math.max(lo0, best - step), b = Math.min(hmin - 1e-9 * span, best + step);
  const g = (Math.sqrt(5) - 1) / 2;
  for (let i = 0; i < 200; i++) { const c = b - g * (b - a), d = a + g * (b - a); if (f(c) < f(d)) b = d; else a = c; if (b - a < 1e-12 * span) break; }
  const h0 = (a + b) / 2;
  return fitFixed(h, Q, f(h0) <= bf ? h0 : best);
}

/** Discharge from a segment at stage h (0 at or below h0). */
export const qAt = (s: Seg, h: number) => (h > s.h0 ? s.a * Math.pow(h - s.h0, s.b) : 0);
/** Stage for a discharge. */
export const hAt = (s: Seg, Q: number) => s.h0 + Math.pow(Q / s.a, 1 / s.b);

/** 95 % range of the fitted (mean) curve at stage h, from the log-space regression. */
export function band(s: Seg, h: number, conf = 0.95) {
  if (!(h > s.h0)) return [0, 0];
  const x = Math.log(h - s.h0), t = tInv(1 - (1 - conf) / 2, s.n - 2), se = s.s * Math.sqrt(1 / s.n + (x - s.xbar) ** 2 / s.sxx), q = qAt(s, h);
  return [q * Math.exp(-t * se), q * Math.exp(t * se)];
}

/** Uncertainty of a single new gauging around the curve, as ± % at the chosen confidence. */
export function scatterPct(s: Seg, conf = 0.95) {
  const t = tInv(1 - (1 - conf) / 2, s.n - 2);
  return [(Math.exp(-t * s.s) - 1) * 100, (Math.exp(t * s.s) - 1) * 100];
}

export type Rating = { segs: Seg[]; brk?: number };

/** One curve, or two segments split at a break stage (gaugings at or above the break go to the upper one). */
export function fitRating(h: number[], Q: number[], opts: { h0?: number; brk?: number; h0Upper?: number } = {}): Rating | null {
  const one = (hh: number[], qq: number[], h0?: number) => (h0 === undefined ? fitSearch(hh, qq) : fitFixed(hh, qq, h0));
  if (opts.brk === undefined) { const s = one(h, Q, opts.h0); return s ? { segs: [s] } : null; }
  const lowI = h.map((_, i) => i).filter((i) => h[i] < opts.brk!), upI = h.map((_, i) => i).filter((i) => h[i] >= opts.brk!);
  const s1 = one(lowI.map((i) => h[i]), lowI.map((i) => Q[i]), opts.h0), s2 = one(upI.map((i) => h[i]), upI.map((i) => Q[i]), opts.h0Upper);
  return s1 && s2 ? { segs: [s1, s2], brk: opts.brk } : null;
}

export const segFor = (r: Rating, h: number) => (r.brk !== undefined && h >= r.brk ? r.segs[1] : r.segs[0]);
export const ratingQ = (r: Rating, h: number) => qAt(segFor(r, h), h);
/** Stage for a discharge on a (possibly two-segment) rating, by bisection over the curve. */
export function ratingH(r: Rating, Q: number) {
  if (r.segs.length === 1) return hAt(r.segs[0], Q);
  let lo = r.segs[0].h0, hi = Math.max(r.segs[1].hi, r.brk!) * 2 - lo + 1;
  while (ratingQ(r, hi) < Q && hi < 1e9) hi = hi * 2 - lo;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (ratingQ(r, m) < Q) lo = m; else hi = m; }
  return (lo + hi) / 2;
}

/** Picks the stage and discharge columns by name (stage, level, gauge height, h; discharge, flow, Q), else the first two. */
export function pickColumns(headers: string[], cols: number[][]) {
  const usable = cols.map((c) => c.filter(Number.isFinite).length >= Math.max(3, c.length * 0.5));
  const find = (re: RegExp) => headers.findIndex((t, i) => usable[i] && re.test(t.toLowerCase()));
  let hi = find(/stage|level|gauge|height|^h\b|^h$|depth/), qi = find(/discharge|flow|^q\b|^q$|m³\/s|cfs|cumec/);
  const nums = usable.map((u, i) => (u ? i : -1)).filter((i) => i >= 0);
  if (hi < 0) hi = nums.find((i) => i !== qi) ?? -1;
  if (qi < 0) qi = nums.find((i) => i !== hi) ?? -1;
  return { hi, qi };
}
