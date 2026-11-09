// Disease progress curves: area under the disease progress curve (AUDPC) and stairs (AUDPS), and the
// monomolecular, logistic and Gompertz models (Campbell and Madden 1990). Plain maths; no DOM.
// AUDPC = Σ (y_i + y_{i+1})/2 · (t_{i+1} − t_i)  (Shaner and Finney 1977)
// AUDPS = AUDPC + (y_1 + y_n)/2 · (t_n − t_1)/(n − 1)  (Simko and Piepho 2012)
import { fitLine, levenbergMarquardt } from './fit.ts';

export function audpc(t: number[], y: number[]): number {
  let s = 0;
  for (let i = 0; i + 1 < t.length; i++) s += ((y[i] + y[i + 1]) / 2) * (t[i + 1] - t[i]);
  return s;
}
export function audps(t: number[], y: number[]): number {
  const n = t.length;
  return audpc(t, y) + ((y[0] + y[n - 1]) / 2) * ((t[n - 1] - t[0]) / (n - 1));
}
/** Relative values: AUDPC ÷ (ymax · duration); AUDPS ÷ (ymax · duration · n/(n − 1)). Both 0 to 1. */
export const relAudpc = (t: number[], y: number[], ymax: number) => audpc(t, y) / (ymax * (t[t.length - 1] - t[0]));
export const relAudps = (t: number[], y: number[], ymax: number) => audps(t, y) / (ymax * (t[t.length - 1] - t[0]) * (t.length / (t.length - 1)));

export type ModelName = 'monomolecular' | 'logistic' | 'gompertz';
export const MODELS: ModelName[] = ['monomolecular', 'logistic', 'gompertz'];
/** Disease proportion y (0 to 1) at time t after the first assessment, from y0 (at t = 0) and the rate r. */
export function model(m: ModelName, t: number, y0: number, r: number): number {
  if (!(y0 < 1) || (m !== 'monomolecular' && !(y0 > 0))) return NaN;
  if (m === 'monomolecular') return 1 - (1 - y0) * Math.exp(-r * t);
  if (m === 'logistic') return 1 / (1 + ((1 - y0) / y0) * Math.exp(-r * t));
  return Math.exp(Math.log(y0) * Math.exp(-r * t));
}
/** The linearising transforms: ln(1/(1−y)), ln(y/(1−y)) and −ln(−ln y). */
export function linear(m: ModelName, y: number): number {
  if (m === 'monomolecular') return Math.log(1 / (1 - y));
  if (m === 'logistic') return Math.log(y / (1 - y));
  return -Math.log(-Math.log(y));
}
function inverse(m: ModelName, z: number): number {
  if (m === 'monomolecular') return 1 - Math.exp(-z);
  if (m === 'logistic') return 1 / (1 + Math.exp(-z));
  return Math.exp(-Math.exp(-z));
}

export type ModelFit = {
  model: ModelName;
  lin: { r: number; rSe: number; y0: number; r2: number; n: number } | null;
  nl: { r: number; rSe: number; y0: number; y0Se: number; r2: number; s: number } | null;
};

/** Fit one model to proportions y (0 to 1) at times t (shifted so the first assessment is t = 0). */
export function fitModel(m: ModelName, t: number[], y: number[]): ModelFit {
  const t0 = t[0], tt = t.map((v) => v - t0);
  const idx = y.map((_, i) => i).filter((i) => y[i] > 0 && y[i] < 1);
  let lin: ModelFit['lin'] = null;
  if (idx.length >= 3 && new Set(idx.map((i) => tt[i])).size >= 2) {
    const f = fitLine(idx.map((i) => tt[i]), idx.map((i) => linear(m, y[i])));
    lin = { r: f.slope, rSe: f.seSlope, y0: inverse(m, f.intercept), r2: f.r2, n: idx.length };
  }
  let nl: ModelFit['nl'] = null;
  if (t.length >= 3) {
    // Least squares on the original scale, started from the linearised fit.
    const s0 = lin && lin.y0 < 1 && (m === 'monomolecular' || lin.y0 > 0) ? lin.y0 : Math.min(0.5, Math.max(1e-3, y[0] || 1e-3));
    const r0 = lin && Number.isFinite(lin.r) && lin.r > 0 ? lin.r : 1 / Math.max(1e-9, tt[tt.length - 1]);
    try {
      const f = levenbergMarquardt((x, p) => model(m, x, p[0], p[1]), tt, y, [s0, r0]);
      if (f.p.every(Number.isFinite)) nl = { r: f.p[1], rSe: f.se[1], y0: f.p[0], y0Se: f.se[0], r2: f.r2, s: f.s };
    } catch { nl = null; }
  }
  return { model: m, lin, nl };
}

export function fitAll(t: number[], y: number[]) {
  const fits = MODELS.map((m) => fitModel(m, t, y));
  const ok = fits.filter((f) => f.nl && f.nl.r > 0);
  const best = ok.length ? ok.reduce((a, b) => (b.nl!.s < a.nl!.s ? b : a)).model : null;
  return { fits, best };
}
