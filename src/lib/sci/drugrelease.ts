// Drug release kinetics: cumulative release (%) against time fitted to the usual models by least squares on the
// untransformed data, with R², adjusted R², AIC and a best model; plus a first-order fit of biomaterial mass
// remaining during degradation. Model forms as in Costa and Sousa Lobo (2001) and Zhang et al. (2010, DDSolver).
// This fits release curves only; it gives no doses. No DOM.
import { levenbergMarquardt } from './fit.ts';

export type ModelId = 'zero' | 'first' | 'higuchi' | 'kp' | 'hc' | 'weibull';
export type ModelFit = {
  id: ModelId; name: string; formula: string; params: { name: string; value: number; se: number; unit: string }[];
  f: (t: number) => number; n: number; k: number; sse: number; r2: number; r2adj: number; aic: number; ok: boolean; note?: string;
};

const sumsq = (t: number[], F: number[], f: (t: number) => number) => t.reduce((s, ti, i) => s + (F[i] - f(ti)) ** 2, 0);

function finish(id: ModelId, name: string, formula: string, t: number[], F: number[], f: (t: number) => number, params: ModelFit['params'], note?: string): ModelFit {
  const n = t.length, k = params.length, sse = sumsq(t, F, f), m = F.reduce((s, v) => s + v, 0) / n, sst = F.reduce((s, v) => s + (v - m) ** 2, 0);
  const r2 = sst > 0 ? 1 - sse / sst : NaN, r2adj = n - k > 0 ? 1 - (1 - r2) * (n - 1) / (n - k) : NaN;
  const aic = n * Math.log(Math.max(sse, 1e-300) / n) + 2 * k;
  return { id, name, formula, params, f, n, k, sse, r2, r2adj, aic, ok: params.every((p) => Number.isFinite(p.value)), note };
}

/** Least-squares slope through the origin, y = b·x, with its standard error. */
function throughOrigin(x: number[], y: number[]) {
  const sxx = x.reduce((s, v) => s + v * v, 0), b = x.reduce((s, v, i) => s + v * y[i], 0) / sxx;
  const sse = x.reduce((s, v, i) => s + (y[i] - b * v) ** 2, 0), df = x.length - 1;
  return { b, se: df > 0 ? Math.sqrt(sse / df / sxx) : NaN };
}
/** Ordinary least squares y = a + b·x. */
function line(x: number[], y: number[]) {
  const n = x.length, mx = x.reduce((s, v) => s + v, 0) / n, my = y.reduce((s, v) => s + v, 0) / n;
  let sxx = 0, sxy = 0; for (let i = 0; i < n; i++) { sxx += (x[i] - mx) ** 2; sxy += (x[i] - mx) * (y[i] - my); }
  const b = sxy / sxx; return { a: my - b * mx, b };
}

export function zeroOrder(t: number[], F: number[]): ModelFit {
  const { b, se } = throughOrigin(t, F);
  return finish('zero', 'Zero order', 'F = k₀·t', t, F, (x) => b * x, [{ name: 'k₀', value: b, se, unit: '%/time' }]);
}
export function higuchi(t: number[], F: number[]): ModelFit {
  const s = t.map(Math.sqrt), { b, se } = throughOrigin(s, F);
  return finish('higuchi', 'Higuchi', 'F = k_H·√t', t, F, (x) => b * Math.sqrt(x), [{ name: 'k_H', value: b, se, unit: '%/time^½' }]);
}
export function firstOrder(t: number[], F: number[]): ModelFit {
  const g = t.map((x, i) => (x > 0 && F[i] < 100 ? -Math.log(1 - F[i] / 100) / x : NaN)).filter(Number.isFinite).sort((a, b) => a - b);
  const k0 = g.length ? g[Math.floor(g.length / 2)] : 0.1;
  const r = levenbergMarquardt((x, p) => 100 * (1 - Math.exp(-p[0] * x)), t, F, [k0]);
  return finish('first', 'First order', 'F = 100·(1 − e^(−k₁·t))', t, F, (x) => 100 * (1 - Math.exp(-r.p[0] * x)), [{ name: 'k₁', value: r.p[0], se: r.se[0], unit: '1/time' }]);
}
export function hixsonCrowell(t: number[], F: number[]): ModelFit {
  const c = 100 ** (1 / 3), y = F.map((v) => c - Math.cbrt(Math.max(0, 100 - v)));
  const k0 = Math.max(1e-6, throughOrigin(t, y).b);
  const g = (x: number, k: number) => { const r = c - k * x; return r <= 0 ? 100 : 100 - r ** 3; };
  const r = levenbergMarquardt((x, p) => g(x, p[0]), t, F, [k0]);
  return finish('hc', 'Hixson-Crowell', '(100 − F)^⅓ = 100^⅓ − k_HC·t', t, F, (x) => g(x, r.p[0]), [{ name: 'k_HC', value: r.p[0], se: r.se[0], unit: '%^⅓/time' }]);
}
export function weibull(t: number[], F: number[]): ModelFit {
  const pts = t.map((x, i) => [x, F[i]]).filter(([x, v]) => x > 0 && v > 0 && v < 100);
  let p0 = [Math.max(...t) / 2, 1];
  if (pts.length >= 2) { const l = line(pts.map(([x]) => Math.log(x)), pts.map(([, v]) => Math.log(-Math.log(1 - v / 100)))); if (Number.isFinite(l.b) && l.b > 0) p0 = [Math.exp(-l.a / l.b), l.b]; }
  const g = (x: number, p: number[]) => 100 * (1 - Math.exp(-((Math.max(0, x) / Math.abs(p[0])) ** p[1])));
  const r = levenbergMarquardt(g, t, F, p0);
  const tau = Math.abs(r.p[0]);
  return finish('weibull', 'Weibull', 'F = 100·(1 − e^(−(t/τ)^β))', t, F, (x) => g(x, r.p), [{ name: 'τ (time to 63.2 %)', value: tau, se: r.se[0], unit: 'time' }, { name: 'β (shape)', value: r.p[1], se: r.se[1], unit: '' }],
    r.p[1] < 1 ? 'β < 1: fast start then slow (parabolic curve)' : r.p[1] > 1 ? 'β > 1: S-shaped curve with a slow start' : 'β = 1: same as first order');
}

export type Geometry = 'film' | 'cylinder' | 'sphere';
const LIMITS: Record<Geometry, [number, number]> = { film: [0.5, 1], cylinder: [0.45, 0.89], sphere: [0.43, 0.85] };

/** What the Korsmeyer-Peppas exponent says about the release mechanism for a given shape (Ritger and Peppas 1987). */
export function peppasMechanism(n: number, geom: Geometry) {
  const [a, b] = LIMITS[geom], tol = 0.005;
  if (!Number.isFinite(n)) return '–';
  if (n < a - tol) return `n below ${a}: less than Fickian (often a porous matrix or a burst)`;
  if (n <= a + tol) return 'Fickian diffusion';
  if (n < b - tol) return 'Anomalous (non-Fickian): diffusion and swelling or erosion together';
  if (n <= b + tol) return 'Case II transport (relaxation or erosion controlled, near zero order)';
  return 'Super case II transport';
}

/** Korsmeyer-Peppas F = k·tⁿ fitted to the points with 0 < F ≤ limit (and t > 0). */
export function korsmeyerPeppas(t: number[], F: number[], limit = 60, geom: Geometry = 'film'): ModelFit {
  const idx = t.map((_, i) => i).filter((i) => t[i] > 0 && F[i] > 0 && F[i] <= limit);
  const ts = idx.map((i) => t[i]), Fs = idx.map((i) => F[i]);
  if (ts.length < 3) return { ...finish('kp', 'Korsmeyer-Peppas', 'F = k_KP·tⁿ', t, F, () => NaN, [{ name: 'k_KP', value: NaN, se: NaN, unit: '' }, { name: 'n', value: NaN, se: NaN, unit: '' }]), ok: false, note: `needs 3 or more points between 0 and ${limit} %` };
  const l = line(ts.map(Math.log), Fs.map(Math.log));
  const r = levenbergMarquardt((x, p) => p[0] * x ** p[1], ts, Fs, [Math.exp(l.a), l.b]);
  const fit = finish('kp', 'Korsmeyer-Peppas', 'F = k_KP·tⁿ', ts, Fs, (x) => r.p[0] * Math.max(0, x) ** r.p[1], [{ name: 'k_KP', value: r.p[0], se: r.se[0], unit: '%/timeⁿ' }, { name: 'n', value: r.p[1], se: r.se[1], unit: '' }]);
  fit.note = `${peppasMechanism(r.p[1], geom)}; fitted to ${ts.length} points up to ${limit} %`;
  return fit;
}

/** All six release models; the best is the lowest AIC among models fitted to the same points. */
export function fitAll(t: number[], F: number[], limit = 60, geom: Geometry = 'film') {
  if (t.length < 3) throw new Error('Give at least 3 time points.');
  const fits: ModelFit[] = [];
  for (const fn of [zeroOrder, firstOrder, higuchi, hixsonCrowell, weibull]) { try { fits.push(fn(t, F)); } catch { /* skip a model that cannot be fitted */ } }
  const kp = korsmeyerPeppas(t, F, limit, geom); fits.splice(3, 0, kp);
  const same = fits.filter((m) => m.ok && m.n === t.length);
  const best = same.reduce<ModelFit | null>((b, m) => (!b || m.aic < b.aic ? m : b), null);
  return { fits, best };
}

/** First-order degradation: mass remaining M = M₀·e^(−k·t) (M₀ fitted or fixed at 100 %), with half-life ln 2 / k. */
export function degradation(t: number[], M: number[], fixM0 = true) {
  if (t.length < 3) throw new Error('Give at least 3 time points for the mass.');
  const pos = t.map((x, i) => [x, M[i]]).filter(([, m]) => m > 0);
  const l = line(pos.map(([x]) => x), pos.map(([, m]) => Math.log(m)));
  const k0 = Math.max(1e-9, -l.b);
  const r = fixM0 ? levenbergMarquardt((x, p) => 100 * Math.exp(-p[0] * x), t, M, [k0]) : levenbergMarquardt((x, p) => p[1] * Math.exp(-p[0] * x), t, M, [k0, Math.exp(l.a)]);
  const k = r.p[0], M0 = fixM0 ? 100 : r.p[1], f = (x: number) => M0 * Math.exp(-k * x);
  const n = t.length, sse = sumsq(t, M, f), m = M.reduce((s, v) => s + v, 0) / n, sst = M.reduce((s, v) => s + (v - m) ** 2, 0);
  return { k, kse: r.se[0], M0, M0se: fixM0 ? 0 : r.se[1], half: Math.LN2 / k, f, r2: sst > 0 ? 1 - sse / sst : NaN, sse, n };
}
