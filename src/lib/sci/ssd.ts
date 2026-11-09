// Species sensitivity distribution (SSD): one toxicity value per species (geometric mean when a species has several),
// a log-normal or log-logistic distribution fitted to log10 of the values by maximum likelihood, and the hazardous
// concentration HCp that a fraction p of species are expected to be more sensitive than. Limits by parametric bootstrap
// (seeded, so the same data always give the same limits). Model averaging by AICc weights on the mixture distribution.
// No DOM.
import { normCdf, normInv } from './stats.ts';
import { rng } from './floodfreq.ts';

export type Model = 'lnorm' | 'llogis';
export type SsdFit = { model: Model; mu: number; s: number; n: number; logLik: number; aic: number; aicc: number; F: (y: number) => number; q: (p: number) => number };

const ln2pi = Math.log(2 * Math.PI);

/** Group values by species; species with several values get their geometric mean. */
export function speciesMeans(rows: { species: string; group?: string; value: number }[]) {
  const m = new Map<string, { species: string; group: string; vals: number[] }>();
  for (const r of rows) {
    const k = r.species.trim().toLowerCase();
    if (!m.has(k)) m.set(k, { species: r.species.trim(), group: (r.group ?? '').trim(), vals: [] });
    m.get(k)!.vals.push(r.value);
  }
  return [...m.values()].map((d) => ({ ...d, value: 10 ** (d.vals.reduce((s, v) => s + Math.log10(v), 0) / d.vals.length) }));
}

function finish(model: Model, y: number[], mu: number, s: number, logLik: number): SsdFit {
  const n = y.length, k = 2, aic = 2 * k - 2 * logLik, aicc = n - k - 1 > 0 ? aic + (2 * k * (k + 1)) / (n - k - 1) : Infinity;
  const F = model === 'lnorm' ? (v: number) => normCdf((v - mu) / s) : (v: number) => 1 / (1 + Math.exp(-(v - mu) / s));
  const q = model === 'lnorm' ? (p: number) => mu + s * normInv(p) : (p: number) => mu + s * Math.log(p / (1 - p));
  return { model, mu, s, n, logLik, aic, aicc, F, q };
}

/** Normal fit to log10 values by maximum likelihood (σ with divisor n). */
export function fitLnorm(y: number[]): SsdFit {
  const n = y.length, mu = y.reduce((a, b) => a + b, 0) / n, s = Math.sqrt(y.reduce((a, b) => a + (b - mu) ** 2, 0) / n);
  return finish('lnorm', y, mu, s, -0.5 * n * (ln2pi + 2 * Math.log(s) + 1));
}

const llLogis = (y: number[], mu: number, s: number) => y.reduce((a, v) => { const z = (v - mu) / s; return a - z - Math.log(s) - 2 * Math.log1p(Math.exp(-z)); }, 0);

/** Logistic fit to log10 values by maximum likelihood (Newton–Raphson with step halving). */
export function fitLlogis(y: number[]): SsdFit {
  const n = y.length;
  let mu = y.reduce((a, b) => a + b, 0) / n, s = Math.max(1e-6, (Math.sqrt(y.reduce((a, b) => a + (b - mu) ** 2, 0) / n) * Math.sqrt(3)) / Math.PI);
  for (let it = 0; it < 200; it++) {
    let g1 = 0, g2 = 0, h11 = 0, h12 = 0, h22 = 0;
    for (const v of y) {
      const z = (v - mu) / s, t = Math.tanh(z / 2), tp = (1 - t * t) / 2;
      g1 += t / s; g2 += (z * t - 1) / s;
      h11 -= tp / (s * s); h12 -= (z * tp + t) / (s * s); h22 += (1 - 2 * z * t - z * z * tp) / (s * s);
    }
    const det = h11 * h22 - h12 * h12;
    let dm: number, ds: number;
    if (det > 0 && h11 < 0) { dm = -(h22 * g1 - h12 * g2) / det; ds = -(h11 * g2 - h12 * g1) / det; } else { dm = g1 * s * s * 0.1; ds = g2 * s * s * 0.1; }
    const L0 = llLogis(y, mu, s); let k = 0;
    while ((s + ds <= 0 || llLogis(y, mu + dm, s + ds) < L0 - 1e-12) && k < 40) { dm /= 2; ds /= 2; k++; }
    mu += dm; s += ds;
    if (Math.abs(dm) < 1e-12 * (1 + Math.abs(mu)) && Math.abs(ds) < 1e-12 * s) break;
  }
  return finish('llogis', y, mu, s, llLogis(y, mu, s));
}

export const fitModel = (m: Model, y: number[]) => (m === 'lnorm' ? fitLnorm(y) : fitLlogis(y));

/** Akaike weights from AICc. */
export function weights(fits: SsdFit[]) {
  const a = fits.map((f) => f.aicc), m = Math.min(...a), e = a.map((v) => (Number.isFinite(v) ? Math.exp(-(v - m) / 2) : 0)), t = e.reduce((x, y) => x + y, 0);
  return e.map((v) => v / t);
}

/** Log10 concentration where the weighted mixture of the fitted distributions reaches p (bisection). */
export function mixQ(fits: SsdFit[], w: number[], p: number) {
  const Fm = (v: number) => fits.reduce((s, f, i) => s + w[i] * f.F(v), 0);
  let lo = Math.min(...fits.map((f) => f.q(p))) - 1, hi = Math.max(...fits.map((f) => f.q(p))) + 1;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (Fm(m) < p) lo = m; else hi = m; }
  return (lo + hi) / 2;
}

/** Anderson–Darling A² of the log10 values against a fitted distribution. */
export function andersonDarling(y: number[], F: (v: number) => number) {
  const s = [...y].sort((a, b) => a - b), n = s.length, c = (u: number) => Math.min(1 - 1e-15, Math.max(1e-15, u));
  let a = 0;
  for (let i = 0; i < n; i++) a += (2 * i + 1) * (Math.log(c(F(s[i]))) + Math.log(1 - c(F(s[n - 1 - i]))));
  return -n - a / n;
}

const draw = (m: Model, mu: number, s: number, u: number) => (m === 'lnorm' ? mu + s * normInv(u) : mu + s * Math.log(u / (1 - u)));

/** Parametric bootstrap of log10 HCp: simulate n values from the fit, refit, repeat. Returns [lo, hi] in log10 units for each p. */
export function bootstrapHC(fit: SsdFit, ps: number[], B = 1000, conf = 0.95, seed = 1) {
  const r = rng(seed), out: number[][] = ps.map(() => []);
  for (let b = 0; b < B; b++) {
    const y = Array.from({ length: fit.n }, () => draw(fit.model, fit.mu, fit.s, Math.min(1 - 1e-12, Math.max(1e-12, r()))));
    const f = fitModel(fit.model, y);
    ps.forEach((p, i) => { const v = f.q(p); if (Number.isFinite(v)) out[i].push(v); });
  }
  return out.map((a) => [pick(a, (1 - conf) / 2), pick(a, (1 + conf) / 2)]);
}

/** Bootstrap of the model-averaged HCp: draw each value from the weighted mixture, refit every model, re-weight. */
export function bootstrapAvg(fits: SsdFit[], w: number[], ps: number[], B = 1000, conf = 0.95, seed = 1) {
  const r = rng(seed), n = fits[0].n, out: number[][] = ps.map(() => []);
  for (let b = 0; b < B; b++) {
    const y = Array.from({ length: n }, () => { let u = r(), k = 0; while (k < w.length - 1 && u > w[k]) { u -= w[k]; k++; } const f = fits[k]; return draw(f.model, f.mu, f.s, Math.min(1 - 1e-12, Math.max(1e-12, r()))); });
    const fs = fits.map((f) => fitModel(f.model, y)), ww = weights(fs);
    ps.forEach((p, i) => out[i].push(mixQ(fs, ww, p)));
  }
  return out.map((a) => [pick(a, (1 - conf) / 2), pick(a, (1 + conf) / 2)]);
}

function pick(a: number[], p: number) {
  if (a.length < 10) return NaN;
  const s = [...a].sort((u, v) => u - v), h = (s.length - 1) * p, lo = Math.floor(h);
  return s[lo] + (s[Math.min(lo + 1, s.length - 1)] - s[lo]) * (h - lo);
}

/** Hazen plotting position of each ranked value: (i − 0.5) / n. */
export const hazen = (n: number) => Array.from({ length: n }, (_, i) => (i + 0.5) / n);
