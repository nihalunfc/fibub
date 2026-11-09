// Pressure buildup analysis for an oil well in oilfield units (hours, psi, STB/d, rb/STB, cP, ft, md, 1/psi):
// Horner and MDH semi-log straight lines, permeability, skin, p*, radius of investigation, and the Bourdet
// derivative. Also the line-source (exponential integral) solution used to make the example. No DOM.
import { fitLine } from './fit.ts';

/** Exponential integral E1(x) = −Ei(−x) for x > 0 (series below 1, continued fraction above). */
export function e1(x: number): number {
  if (!(x > 0)) return Infinity;
  if (x <= 1) {
    let sum = 0, term = 1;
    for (let k = 1; k < 60; k++) { term *= -x / k; sum += term / k; if (Math.abs(term / k) < 1e-17) break; }
    return -0.5772156649015329 - Math.log(x) - sum;
  }
  // Modified Lentz continued fraction.
  let b = x + 1, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i < 200; i++) {
    const a = -i * i; b += 2; d = 1 / (a * d + b); c = b + a / c; const del = c * d; h *= del;
    if (Math.abs(del - 1) < 1e-16) break;
  }
  return h * Math.exp(-x);
}

export type Reservoir = { q: number; B: number; mu: number; h: number; phi: number; ct: number; rw: number };
/** 141.2 qBµ/kh in psi: the pressure scale of the dimensionless solution. */
export const pScale = (r: Reservoir, k: number) => (141.2 * r.q * r.B * r.mu) / (k * r.h);

/** Line-source pressure drop (psi) at distance d (ft) after t hours of production at rate q. */
export function lineSource(r: Reservoir, k: number, t: number, d: number): number {
  if (t <= 0) return 0;
  return pScale(r, k) * 0.5 * e1((948.1 * r.phi * r.mu * r.ct * d * d) / (k * t));
}
/**
 * Buildup pressure (psi) after producing for tp hours and shutting in for dt hours, for a well with skin s,
 * optionally near one straight sealing fault at distance L (ft; image well at 2L). dt = 0 gives the flowing pressure.
 */
export function buildupPressure(r: Reservoir, k: number, s: number, pi: number, tp: number, dt: number, L = 0): number {
  const drop = (t: number) => lineSource(r, k, t, r.rw) + (L > 0 ? lineSource(r, k, t, 2 * L) : 0);
  if (dt <= 0) return pi - drop(tp) - pScale(r, k) * s;
  return pi - (drop(tp + dt) - drop(dt));
}

export type Line = { slope: number; intercept: number; r2: number; n: number; i0: number; i1: number };
export type Analysis = {
  method: 'horner' | 'mdh'; m: number; k: number; kh: number; s: number; dpSkin: number; pStar: number; p1hr: number;
  ri: number; line: Line; flowEff: number; hornerX: number[];
};

/** Horner ratio (tp + Δt)/Δt. */
export const hornerRatio = (tp: number, dt: number) => (tp + dt) / dt;

/** Least-squares line through points i0..i1 of pws against x. */
export function lineFit(x: number[], y: number[], i0: number, i1: number): Line {
  const f = fitLine(x.slice(i0, i1 + 1), y.slice(i0, i1 + 1));
  return { slope: f.slope, intercept: f.intercept, r2: f.r2, n: f.n, i0, i1 };
}

/**
 * Analyse a buildup from points i0..i1 (inclusive) taken as the middle-time (radial flow) straight line.
 * Horner: pws against log10((tp+Δt)/Δt); MDH: pws against log10(Δt). Skin uses p1hr from the line.
 */
export function analyse(dt: number[], pws: number[], pwf: number, tp: number, r: Reservoir, i0: number, i1: number, method: 'horner' | 'mdh'): Analysis {
  const hornerX = dt.map((t) => Math.log10(hornerRatio(tp, t)));
  const x = method === 'horner' ? hornerX : dt.map((t) => Math.log10(t));
  const line = lineFit(x, pws, i0, i1);
  const m = method === 'horner' ? -line.slope : line.slope; // psi per log cycle, positive for a buildup
  const kh = (162.6 * r.q * r.B * r.mu) / m, k = kh / r.h;
  const p1hr = method === 'horner' ? line.intercept + line.slope * Math.log10(tp + 1) : line.intercept;
  const s = 1.1513 * ((p1hr - pwf) / m - Math.log10(k / (r.phi * r.mu * r.ct * r.rw * r.rw)) + 3.2275);
  const dpSkin = 0.869 * m * s;
  // p*: the Horner line at a ratio of 1 (infinite shut-in); MDH does not give it.
  const pStar = method === 'horner' ? line.intercept : NaN;
  const ri = 0.029 * Math.sqrt((k * dt[dt.length - 1]) / (r.phi * r.mu * r.ct));
  const flowEff = Number.isFinite(pStar) ? (pStar - pwf - dpSkin) / (pStar - pwf) : NaN;
  return { method, m, k, kh, s, dpSkin, pStar, p1hr, ri, line, flowEff, hornerX };
}

/**
 * Bourdet derivative of Δp with respect to the buildup superposition time X = ln(Δt/(tp+Δt)), with smoothing
 * window L (in units of ln). For drawdown (tp = Infinity) X = ln Δt. Points with no neighbour L away are NaN.
 */
export function bourdet(dt: number[], dp: number[], tp: number, L = 0.2): number[] {
  const X = dt.map((t) => (Number.isFinite(tp) ? Math.log(t / (tp + t)) : Math.log(t)));
  const n = dt.length;
  return dt.map((_, i) => {
    let a = i - 1; while (a >= 0 && X[i] - X[a] < L) a--;
    let b = i + 1; while (b < n && X[b] - X[i] < L) b++;
    if (L === 0) { a = i - 1; b = i + 1; }
    if (a < 0 || b >= n) return NaN;
    const d1 = X[i] - X[a], d2 = X[b] - X[i];
    return (((dp[i] - dp[a]) / d1) * d2 + ((dp[b] - dp[i]) / d2) * d1) / (d1 + d2);
  });
}

/**
 * Automatic choice of the radial-flow straight line: the longest run of consecutive points (by log span of Δt)
 * whose Bourdet derivative stays within ±tol (10 %) of the run's median. Returns indexes, or null if none spans
 * at least half a log cycle with 4 points.
 */
export function autoRange(dt: number[], deriv: number[], tol = 0.1): { i0: number; i1: number } | null {
  let best: { i0: number; i1: number; span: number } | null = null;
  const n = dt.length;
  for (let i = 0; i < n; i++) {
    if (!(deriv[i] > 0)) continue;
    const run: number[] = [];
    for (let j = i; j < n; j++) {
      if (!(deriv[j] > 0)) break;
      run.push(deriv[j]);
      const med = [...run].sort((a, b) => a - b)[Math.floor(run.length / 2)];
      if (run.some((v) => Math.abs(v / med - 1) > tol)) break;
      const span = Math.log10(dt[j] / dt[i]);
      if (j - i + 1 >= 4 && span >= 0.5 && (!best || span > best.span + 1e-9)) best = { i0: i, i1: j, span };
    }
  }
  return best ? { i0: best.i0, i1: best.i1 } : null;
}

/** A small seeded random generator (mulberry32) for the made-up example. */
function rng(seed: number) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/** Made-up example: an oil well with k = 35 md, s = 3, near a sealing fault 350 ft away, built from the line-source solution. */
export const EXAMPLE = { r: { q: 250, B: 1.2, mu: 0.9, h: 40, phi: 0.18, ct: 1.2e-5, rw: 0.35 } as Reservoir, k: 35, s: 3, pi: 4200, tp: 480, L: 350 };
export function exampleBuildup(): { dt: number; p: number }[] {
  const e = EXAMPLE, rnd = rng(688), out: { dt: number; p: number }[] = [{ dt: 0, p: Math.round(buildupPressure(e.r, e.k, e.s, e.pi, e.tp, 0, e.L) * 100) / 100 }];
  for (let i = 0; i <= 40; i++) {
    const dt = +(0.01 * Math.pow(10, (i * 4) / 40)).toPrecision(3);
    out.push({ dt, p: Math.round((buildupPressure(e.r, e.k, e.s, e.pi, e.tp, dt, e.L) + 0.06 * (rnd() - 0.5)) * 100) / 100 });
  }
  return out;
}
