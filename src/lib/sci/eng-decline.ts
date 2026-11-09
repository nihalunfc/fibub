// Arps decline curve analysis: exponential, hyperbolic and harmonic fits to rate-time data by nonlinear
// least squares, forecasts to an economic limit, EUR and remaining reserves. Time is in days and rates are
// per day inside this file; the page converts its units. No DOM.
import { levenbergMarquardt, invSPD } from './fit.ts';

export type Model = 'exponential' | 'hyperbolic' | 'harmonic';
/** qi: initial rate (per day) at t = 0, Di: initial nominal decline (per day), b: Arps exponent. */
export type Arps = { qi: number; Di: number; b: number };
/** Optional switch to exponential decline once the nominal decline falls to dMin (per day); 0 = off. */
export type Terminal = { dMin: number };

/** Rate at time t (days) of the Arps curve, with an optional terminal exponential decline. */
export function rate(p: Arps, t: number, term: Terminal = { dMin: 0 }): number {
  const sw = switchTime(p, term);
  if (t > sw) return rate(p, sw) * Math.exp(-term.dMin * (t - sw));
  if (p.b === 0) return p.qi * Math.exp(-p.Di * t);
  return p.qi / Math.pow(1 + p.b * p.Di * t, 1 / p.b);
}
/** Nominal decline rate D(t) = −(dq/dt)/q. */
export function declineAt(p: Arps, t: number): number { return p.Di / (1 + p.b * p.Di * t); }
/** Time when the hyperbolic decline falls to the terminal decline (Infinity when there is none). */
export function switchTime(p: Arps, term: Terminal = { dMin: 0 }): number {
  if (!(term.dMin > 0) || p.b === 0) return Infinity;
  if (p.Di <= term.dMin) return 0;
  return (p.Di / term.dMin - 1) / (p.b * p.Di);
}
/** Cumulative volume from 0 to t (rate unit × days), closed forms. */
export function cumulative(p: Arps, t: number, term: Terminal = { dMin: 0 }): number {
  const sw = switchTime(p, term);
  if (t > sw) { const qs = rate(p, sw); return cumulative(p, sw) + (qs / term.dMin) * (1 - Math.exp(-term.dMin * (t - sw))); }
  const { qi, Di, b } = p, q = rate(p, t);
  if (b === 0) return (qi - q) / Di;
  if (Math.abs(b - 1) < 1e-12) return (qi / Di) * Math.log(qi / q);
  return (Math.pow(qi, b) / ((1 - b) * Di)) * (Math.pow(qi, 1 - b) - Math.pow(q, 1 - b));
}
/** Time (days) when the rate falls to qLimit; 0 if it starts below, Infinity if never. */
export function timeToRate(p: Arps, qLimit: number, term: Terminal = { dMin: 0 }): number {
  if (!(qLimit > 0)) return Infinity;
  if (p.qi <= qLimit) return 0;
  const sw = switchTime(p, term);
  const tq = p.b === 0 ? Math.log(p.qi / qLimit) / p.Di : (Math.pow(p.qi / qLimit, p.b) - 1) / (p.b * p.Di);
  if (tq <= sw) return tq;
  const qs = rate(p, sw);
  return sw + Math.log(qs / qLimit) / term.dMin;
}
/** Effective (secant) decline over the first `days`: 1 − q(days)/qi. */
export function effectiveDecline(p: Arps, days: number): number { return 1 - rate(p, days) / p.qi; }

export type FitResult = {
  model: Model; p: Arps; se: { qi: number; Di: number; b: number }; sse: number; rmse: number; r2: number; n: number; converged: boolean;
};

const modelFn = (model: Model, b?: number) => (t: number, v: number[]) => rate({ qi: v[0], Di: v[1], b: model === 'exponential' ? 0 : model === 'harmonic' ? 1 : b ?? v[2] }, t);

/** Covariance s²(JᵀJ)⁻¹ in the natural parameters at the optimum (central differences). */
function covariance(f: (t: number, v: number[]) => number, t: number[], y: number[], v: number[], tr: (x: number) => number, w: number[]): { se: number[]; sse: number } {
  const n = t.length, m = v.length;
  const r = t.map((ti, i) => tr(y[i]) - tr(f(ti, v)));
  const sse = r.reduce((s, x, i) => s + w[i] * x * x, 0);
  const J = t.map(() => new Array(m).fill(0));
  for (let j = 0; j < m; j++) {
    const h = 1e-6 * Math.max(Math.abs(v[j]), 1e-9);
    const vp = v.slice(), vm = v.slice(); vp[j] += h; vm[j] -= h;
    for (let i = 0; i < n; i++) J[i][j] = (tr(f(t[i], vp)) - tr(f(t[i], vm))) / (2 * h);
  }
  const A = Array.from({ length: m }, (_, a) => Array.from({ length: m }, (_, c) => J.reduce((s, row, i) => s + w[i] * row[a] * row[c], 0)));
  const inv = invSPD(A), s2 = sse / Math.max(1, n - m);
  return { se: v.map((_, i) => (inv ? Math.sqrt(inv[i][i] * s2) : NaN)), sse };
}

/**
 * Fit one Arps model by least squares on the rates (`space` 'rate') or on ln(rate) ('log'). Hyperbolic b is
 * kept between bMin and bMax (default 0.001 to 2). Parameters are fitted as logs (and b through a logistic
 * map) so they stay positive; the optimum is the same as an unconstrained fit when it lies inside the bounds.
 */
export function fitArps(t: number[], q: number[], model: Model, space: 'rate' | 'log' = 'rate', bMax = 2): FitResult {
  const n = t.length;
  if (n < (model === 'hyperbolic' ? 4 : 3)) throw new Error('Need more points');
  if (q.some((v) => !(v > 0))) throw new Error('Rates must be positive');
  const tr = space === 'log' ? Math.log : (x: number) => x;
  const w = t.map(() => 1);
  // Start: straight line through ln q against t.
  const tm = t.reduce((s, v) => s + v, 0) / n, lm = q.reduce((s, v) => s + Math.log(v), 0) / n;
  let sxy = 0, sxx = 0; t.forEach((ti, i) => { sxy += (ti - tm) * (Math.log(q[i]) - lm); sxx += (ti - tm) ** 2; });
  const slope = sxx > 0 ? sxy / sxx : -1e-3;
  const D0 = Math.max(-slope, 1e-6), qi0 = Math.exp(lm - slope * tm);
  const bMin = 0.001, sigm = (x: number) => bMin + (bMax - bMin) / (1 + Math.exp(-x)), logit = (b: number) => Math.log((b - bMin) / (bMax - b));
  const fitFixed = (b: number | undefined, p0: number[]) => {
    const m = modelFn(model, b);
    const g = b === undefined
      ? (x: number, u: number[]) => tr(m(x, [Math.exp(u[0]), Math.exp(u[1]), sigm(u[2])]))
      : (x: number, u: number[]) => tr(m(x, [Math.exp(u[0]), Math.exp(u[1])]));
    return levenbergMarquardt(g, t, q.map(tr), p0, { w, maxIter: 800 });
  };
  let best: { v: number[]; sse: number; converged: boolean } | null = null;
  if (model === 'hyperbolic') {
    // Grid of b values for the start, then a free fit from the best.
    let start: { u: number[]; sse: number } | null = null;
    for (const b of [0.05, 0.2, 0.4, 0.6, 0.8, 1, 1.3, 1.6, 1.9].filter((x) => x < bMax)) {
      try { const r = fitFixed(b, [Math.log(qi0), Math.log(D0)]); if (!start || r.sse < start.sse) start = { u: [r.p[0], r.p[1], logit(b)], sse: r.sse }; } catch { /* skip */ }
    }
    if (!start) throw new Error('The fit did not converge');
    const r = fitFixed(undefined, start.u);
    best = { v: [Math.exp(r.p[0]), Math.exp(r.p[1]), sigm(r.p[2])], sse: r.sse, converged: r.converged };
  } else {
    const r = fitFixed(model === 'exponential' ? 0 : 1, [Math.log(qi0), Math.log(D0)]);
    best = { v: [Math.exp(r.p[0]), Math.exp(r.p[1])], sse: r.sse, converged: r.converged };
  }
  const cv = covariance(modelFn(model), t, q, best.v, tr, w);
  const b = model === 'exponential' ? 0 : model === 'harmonic' ? 1 : best.v[2];
  const p: Arps = { qi: best.v[0], Di: best.v[1], b };
  // R² and RMSE always on the rates themselves, so models fitted either way compare fairly.
  const res = t.map((ti, i) => q[i] - rate(p, ti));
  const sseRate = res.reduce((s, x) => s + x * x, 0), qm = q.reduce((s, v) => s + v, 0) / n;
  const sst = q.reduce((s, v) => s + (v - qm) ** 2, 0);
  return { model, p, se: { qi: cv.se[0], Di: cv.se[1], b: model === 'hyperbolic' ? cv.se[2] : 0 }, sse: cv.sse, rmse: Math.sqrt(sseRate / n), r2: sst > 0 ? 1 - sseRate / sst : 1, n, converged: best.converged };
}

export type Forecast = { tEnd: number; qEnd: number; eur: number; npToDate: number; remaining: number; reachedLimit: boolean };
/**
 * Forecast from the fitted curve: to the economic limit qLimit or tMax days after t = 0, whichever is first.
 * EUR is the fitted cumulative from t = 0 to the end; produced-to-date is `actualCum` when given (the
 * measured cumulative to the last data point), else the fitted cumulative to tLast.
 */
export function forecast(p: Arps, tLast: number, qLimit: number, tMax: number, term: Terminal = { dMin: 0 }, actualCum?: number): Forecast {
  const tl = timeToRate(p, qLimit, term), reached = tl <= tMax;
  const tEnd = Math.max(tLast, Math.min(tl, tMax));
  const eurFit = cumulative(p, tEnd, term), npFit = cumulative(p, tLast, term);
  const np = actualCum ?? npFit;
  const remaining = Math.max(0, eurFit - npFit);
  return { tEnd, qEnd: rate(p, tEnd, term), eur: np + remaining, npToDate: np, remaining, reachedLimit: reached };
}

/** Cumulative from data by the trapezoid rule (rate × time), starting at the first point. */
export function trapezoid(t: number[], q: number[]): number {
  let s = 0; for (let i = 1; i < t.length; i++) s += ((q[i] + q[i - 1]) / 2) * (t[i] - t[i - 1]); return s;
}

/** Parse a time cell: a number, or a date YYYY-MM-DD / YYYY-MM (days since 1970). */
export function parseTime(s: string, toNum: (s: string) => number): { v: number; date: boolean } {
  const m = /^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/.exec(s.trim());
  if (m) return { v: Date.UTC(+m[1], +m[2] - 1, m[3] ? +m[3] : 1) / 86400000, date: true };
  return { v: toNum(s), date: false };
}

/** A small seeded random generator (mulberry32) for the made-up example. */
export function rng(seed: number) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/** Made-up monthly oil rates (bbl/d): hyperbolic qi 850, Di 0.09 per month, b 0.7, with ±4 % noise. */
export function exampleWell(): { month: number; rate: number }[] {
  const r = rng(686), out: { month: number; rate: number }[] = [];
  for (let m = 1; m <= 36; m++) {
    const q = 850 / Math.pow(1 + 0.7 * 0.09 * m, 1 / 0.7);
    out.push({ month: m, rate: Math.round(q * (1 + 0.08 * (r() - 0.5)) * 10) / 10 });
  }
  return out;
}
