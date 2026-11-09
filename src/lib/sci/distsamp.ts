// Conventional distance sampling (Buckland et al. 2001) for line and point transects: half-normal and
// hazard-rate detection functions fitted to exact distances by maximum likelihood, effective strip width or
// effective detection radius, density, and a log-normal confidence interval with Satterthwaite degrees of freedom.
import { tInv } from './stats.ts';
import { nelderMead, hessian, inverse, gaussLegendre } from './ecoopt.ts';

export type Key = 'hn' | 'hr';
export type Survey = 'line' | 'point';

const GL = gaussLegendre(48);
/** ∫_0^w h(x) dx by composite Gauss-Legendre (8 panels of 48 nodes). */
function integrate(h: (x: number) => number, w: number) {
  let s = 0; const P = 8, d = w / P;
  for (let p = 0; p < P; p++) { const a = p * d; for (let i = 0; i < GL.x.length; i++) s += GL.w[i] * h(a + (d / 2) * (GL.x[i] + 1)); }
  return (s * d) / 2;
}

/** Detection probability g(x) for parameters on the natural scale [σ] or [σ, b]. */
export function g(key: Key, par: number[], x: number) {
  const s = par[0];
  return key === 'hn' ? Math.exp((-x * x) / (2 * s * s)) : x <= 0 ? 1 : 1 - Math.exp(-((x / s) ** -par[1]));
}
const natural = (key: Key, th: number[]) => (key === 'hn' ? [Math.exp(th[0])] : [Math.exp(th[0]), 1 + Math.exp(th[1])]);

/** μ = ∫ g (lines, metres) or ν = 2π ∫ r g (points, square metres). */
export function area(key: Key, par: number[], w: number, survey: Survey) {
  if (key === 'hn') {
    const s = par[0];
    if (survey === 'line') return integrate((x) => g('hn', par, x), w);
    return 2 * Math.PI * s * s * (1 - Math.exp((-w * w) / (2 * s * s)));
  }
  return survey === 'line' ? integrate((x) => g('hr', par, x), w) : 2 * Math.PI * integrate((r) => r * g('hr', par, r), w);
}

export type DetFit = {
  key: Key; par: number[]; theta: number[]; cov: number[][] | null; logLik: number; aic: number; n: number; w: number; survey: Survey;
  /** μ (lines: ESW in metres) or ν (points: effective area in m²). */
  mu: number; seMu: number; cvMu: number;
  /** Average detection probability inside w. */
  pa: number;
  /** Effective detection radius ρ = √(ν/π) for points (m). */
  edr: number;
  converged: boolean;
};

export function fitDetection(dist: number[], w: number, key: Key, survey: Survey): DetFit {
  const x = dist.filter((d) => d <= w), n = x.length;
  if (n < 3) throw new Error('At least 3 distances within the truncation distance are needed.');
  const nll = (th: number[]) => {
    const par = natural(key, th);
    if (!par.every((p) => Number.isFinite(p) && p > 0) || par[0] > 1e6 * w || par[0] < 1e-6 * w) return Infinity;
    const A = area(key, par, w, survey);
    if (!(A > 0)) return Infinity;
    let s = 0; for (const d of x) { const gi = g(key, par, d); if (!(gi > 0)) return Infinity; s += Math.log(gi); }
    return -(s - n * Math.log(A));
  };
  // Starting σ from the half-normal moment estimate; try a few shapes for the hazard rate and keep the best.
  const m2 = Math.sqrt(x.reduce((a, d) => a + d * d, 0) / n) || w / 2;
  const starts = key === 'hn' ? [[Math.log(m2)]] : [[Math.log(m2), Math.log(1)], [Math.log(m2 * 0.7), Math.log(2)], [Math.log(m2 * 1.2), Math.log(0.3)], [Math.log(m2 * 0.5), Math.log(5)]];
  let best = null as ReturnType<typeof nelderMead> | null;
  for (const s0 of starts) { const r = nelderMead(nll, s0, { step: 0.3 }); if (!best || r.f < best.f) best = r; }
  const th = best!.x, par = natural(key, th), mu = area(key, par, w, survey);
  const H = hessian(nll, th, 1e-4), cov = inverse(H);
  let varMu = NaN;
  if (cov && cov.every((r, i) => r[i] > 0)) {
    const grad = th.map((_, i) => { const h = 1e-5 * Math.max(1, Math.abs(th[i])), a = th.slice(), b = th.slice(); a[i] += h; b[i] -= h; return (area(key, natural(key, a), w, survey) - area(key, natural(key, b), w, survey)) / (2 * h); });
    varMu = grad.reduce((s, gi, i) => s + gi * grad.reduce((t, gj, j) => t + cov[i][j] * gj, 0), 0);
  }
  const seMu = Math.sqrt(varMu);
  return { key, par, theta: th, cov, logLik: -best!.f, aic: 2 * best!.f + 2 * th.length, n, w, survey, mu, seMu, cvMu: seMu / mu,
    pa: survey === 'line' ? mu / w : mu / (Math.PI * w * w), edr: survey === 'point' ? Math.sqrt(mu / Math.PI) : NaN, converged: best!.converged && Number.isFinite(seMu) };
}

export type Density = {
  fit: DetFit; n: number;
  /** Animals (or clusters) per km² and per hectare. */
  D: number; perHa: number; se: number; cv: number; cvN: number; lo: number; hi: number; df: number; conf: number;
  /** Encounter rate: per km of line, or per point. */
  er: number; varMethod: 'empirical' | 'poisson';
};

/**
 * Density from a fitted detection function. For lines `effort` is the length of each line in km (one entry and
 * no per-line counts means Poisson variance for n); for points it is one entry per point. `counts` are the
 * detections within w on each line or point, in the same order (or null).
 */
export function density(fit: DetFit, effort: number[], counts: number[] | null, conf = 0.95): Density {
  const n = fit.n, K = effort.length, E = effort.reduce((a, b) => a + b, 0);
  let varN = n, varMethod: Density['varMethod'] = 'poisson';
  if (counts && K > 1) {
    varMethod = 'empirical';
    varN = fit.survey === 'line' ? (E / (K - 1)) * counts.reduce((s, nk, k) => s + effort[k] * (nk / effort[k] - n / E) ** 2, 0) : (K / (K - 1)) * counts.reduce((s, nk) => s + (nk - n / K) ** 2, 0);
  }
  const D = fit.survey === 'line' ? n / (2 * E * (fit.mu / 1000)) : (n / (E * fit.mu)) * 1e6;
  const cvN = Math.sqrt(varN) / n, cv = Math.sqrt(cvN ** 2 + fit.cvMu ** 2), p = fit.theta.length;
  const parts = (varMethod === 'empirical' ? cvN ** 4 / (K - 1) : 0) + fit.cvMu ** 4 / Math.max(1, n - p);
  const df = parts > 0 ? Math.max(1, cv ** 4 / parts) : Infinity;
  const t = tInv(1 - (1 - conf) / 2, Math.min(df, 1e8)), C = Math.exp(t * Math.sqrt(Math.log(1 + cv * cv)));
  return { fit, n, D, perHa: D / 100, se: D * cv, cv, cvN, lo: D / C, hi: D * C, df, conf, er: n / E, varMethod };
}
