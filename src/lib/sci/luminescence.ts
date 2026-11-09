// Luminescence dating sums: equivalent dose from many aliquots (central age model, weighted mean), the
// environmental dose rate from its parts or from K, U and Th with conversion factors the user enters, the
// water-content correction, and the age De / dose rate with first-order uncertainty propagation.
// Plain TypeScript, no DOM. No reference data tables are built in: every factor is an input.
import { propagate, type Input } from './uncertainty.ts';

/**
 * Central age model (Galbraith et al. 1999): ln(De_i) ~ N(ln δ, σ² + s_i²) with s_i = u_i / De_i. Solved by the
 * usual fixed-point iteration. σ is the overdispersion (relative). `sigmab` adds a known extra relative spread.
 */
export function cam(de: number[], u: number[], sigmab = 0) {
  const n = de.length;
  if (n < 2) throw new Error('The central age model needs at least two aliquots.');
  if (de.some((d) => !(d > 0))) throw new Error('Every equivalent dose must be above 0 for the central age model (it works on logs).');
  if (u.some((x) => !(x > 0))) throw new Error('Every equivalent dose needs an uncertainty above 0.');
  const z = de.map(Math.log), s2 = de.map((d, i) => (u[i] / d) ** 2 + sigmab * sigmab);
  let sigma = 0.15, mu = 0, w: number[] = [], it = 0, converged = false;
  for (; it < 1000; it++) {
    w = s2.map((s) => 1 / (sigma * sigma + s));
    const sw = w.reduce((a, b) => a + b, 0);
    mu = w.reduce((a, wi, i) => a + wi * z[i], 0) / sw;
    const next = sigma * Math.sqrt(w.reduce((a, wi, i) => a + wi * wi * (z[i] - mu) ** 2, 0) / sw);
    const done = Math.abs(next - sigma) < 1e-12;
    sigma = next;
    if (done || sigma < 1e-9) { converged = true; break; }
  }
  w = s2.map((s) => 1 / (sigma * sigma + s));
  const sw = w.reduce((a, b) => a + b, 0);
  mu = w.reduce((a, wi, i) => a + wi * z[i], 0) / sw;
  const relSe = 1 / Math.sqrt(sw), dose = Math.exp(mu);
  const sigmaSe = sigma > 1e-9 ? 1 / Math.sqrt(2 * sigma * sigma * w.reduce((a, wi) => a + wi * wi, 0)) : NaN;
  // Log-likelihood, for checks.
  const ll = -0.5 * z.reduce((a, zi, i) => a + Math.log(2 * Math.PI / w[i]) + w[i] * (zi - mu) ** 2, 0);
  return { de: dose, se: dose * relSe, relSe, od: sigma < 1e-9 ? 0 : sigma, odSe: sigmaSe, n, iterations: it + 1, converged, ll };
}

/** Inverse-variance weighted mean with its standard error and the MSWD (reduced chi-square). */
export function weightedMean(de: number[], u: number[]) {
  if (de.length < 2) throw new Error('A weighted mean needs at least two values.');
  if (u.some((x) => !(x > 0))) throw new Error('Every equivalent dose needs an uncertainty above 0.');
  const w = u.map((x) => 1 / (x * x)), sw = w.reduce((a, b) => a + b, 0);
  const m = w.reduce((a, wi, i) => a + wi * de[i], 0) / sw;
  const mswd = w.reduce((a, wi, i) => a + wi * (de[i] - m) ** 2, 0) / (de.length - 1);
  return { de: m, se: 1 / Math.sqrt(sw), mswd, n: de.length };
}

/** Arithmetic mean and its standard error. */
export function plainMean(de: number[]) {
  const n = de.length, m = de.reduce((a, b) => a + b, 0) / n;
  const sd = Math.sqrt(de.reduce((a, x) => a + (x - m) ** 2, 0) / (n - 1));
  return { de: m, se: sd / Math.sqrt(n), sd, n };
}

/** Water correction (Zimmerman 1971; Aitken 1985): wet = dry / (1 + k·W), W = water mass ÷ dry mass. */
export const wet = (dry: number, W: number, k: number) => dry / (1 + k * W);

export type V = { v: number; u: number };
/** Inputs for the dose rate from concentrations. Factors are Gy/ka per % K or per ppm U or Th, entered by the user. */
export type ConcInputs = {
  De: V; K: V; U: V; Th: V; water: V; cosmic: V; internal: V; aValue: V; betaAtt: V;
  f: { Ka: number; Kb: number; Kg: number; Ua: number; Ub: number; Ug: number; Ta: number; Tb: number; Tg: number };
  kw: { a: number; b: number; g: number };
};
/** Inputs when the alpha, beta and gamma dose rates are known (dry, before the water correction, unless water is 0). */
export type PartInputs = { De: V; alpha: V; beta: V; gamma: V; water: V; cosmic: V; internal: V; kw: { a: number; b: number; g: number } };

const NAMES_C = ['De', 'K', 'U', 'Th', 'water', 'cosmic', 'internal', 'aValue', 'betaAtt'] as const;
const NAMES_P = ['De', 'alpha', 'beta', 'gamma', 'water', 'cosmic', 'internal'] as const;
export const LABELS: Record<string, string> = { De: 'Equivalent dose', K: 'K', U: 'U', Th: 'Th', water: 'Water content', cosmic: 'Cosmic dose rate', internal: 'Internal dose rate', aValue: 'Alpha efficiency (a-value)', betaAtt: 'Beta attenuation factor', alpha: 'Alpha dose rate (dry)', beta: 'Beta dose rate (dry)', gamma: 'Gamma dose rate (dry)' };

function partsC(x: Record<string, number>, p: ConcInputs) {
  const f = p.f, W = x.water;
  const a = x.aValue * (f.Ka * x.K + f.Ua * x.U + f.Ta * x.Th), b = x.betaAtt * (f.Kb * x.K + f.Ub * x.U + f.Tb * x.Th), g = f.Kg * x.K + f.Ug * x.U + f.Tg * x.Th;
  return { alpha: wet(a, W, p.kw.a), beta: wet(b, W, p.kw.b), gamma: wet(g, W, p.kw.g), cosmic: x.cosmic, internal: x.internal };
}
function partsP(x: Record<string, number>, p: PartInputs) {
  const W = x.water;
  return { alpha: wet(x.alpha, W, p.kw.a), beta: wet(x.beta, W, p.kw.b), gamma: wet(x.gamma, W, p.kw.g), cosmic: x.cosmic, internal: x.internal };
}
const total = (d: { alpha: number; beta: number; gamma: number; cosmic: number; internal: number }) => d.alpha + d.beta + d.gamma + d.cosmic + d.internal;

/**
 * The age (ka) = De (Gy) / dose rate (Gy/ka), with GUM first-order propagation of every input's standard
 * uncertainty (inputs treated as independent). Returns the parts of the dose rate, the dose rate and the age with
 * their uncertainties, and each input's share of the age's variance.
 */
export function age(mode: 'conc', p: ConcInputs): AgeResult;
export function age(mode: 'parts', p: PartInputs): AgeResult;
export function age(mode: 'conc' | 'parts', p: ConcInputs | PartInputs): AgeResult {
  const names = (mode === 'conc' ? NAMES_C : NAMES_P) as readonly string[];
  const rec = p as unknown as Record<string, V>;
  const inputs: Input[] = names.map((k) => ({ name: k, value: rec[k].v, spread: Math.abs(rec[k].u), dist: 'normal' as const }));
  const obj = (v: ArrayLike<number>) => Object.fromEntries(names.map((k, i) => [k, v[i]]));
  const parts = (v: ArrayLike<number>) => (mode === 'conc' ? partsC(obj(v), p as ConcInputs) : partsP(obj(v), p as PartInputs));
  const x = names.map((k) => rec[k].v);
  const d0 = parts(x), D = total(d0);
  if (!(D > 0)) throw new Error('The total dose rate must be above 0.');
  const dr = propagate((v) => total(parts(v)), inputs);
  const ag = propagate((v) => v[0] / total(parts(v)), inputs);
  const each = (['alpha', 'beta', 'gamma', 'cosmic', 'internal'] as const).map((k) => ({ part: k, value: d0[k], u: propagate((v) => parts(v)[k], inputs).uc }));
  return {
    parts: each, doseRate: D, doseRateU: dr.uc, age: ag.y, ageU: ag.uc,
    budget: ag.rows.map((r) => ({ name: r.name, label: LABELS[r.name] ?? r.name, value: r.value, u: r.u, sensitivity: r.c, share: r.share })),
  };
}
export type AgeResult = {
  parts: { part: 'alpha' | 'beta' | 'gamma' | 'cosmic' | 'internal'; value: number; u: number }[];
  doseRate: number; doseRateU: number; age: number; ageU: number;
  budget: { name: string; label: string; value: number; u: number; sensitivity: number; share: number }[];
};

/** Read pasted aliquot equivalent doses: one per line, De then its uncertainty (a name first is allowed). */
export function parseAliquots(rows: string[][], num: (s: string) => number): { de: number[]; u: number[]; skipped: number } {
  const de: number[] = [], u: number[] = [];
  let skipped = 0;
  for (const r of rows) {
    const nums = r.map(num), k = nums.findIndex(Number.isFinite);
    if (k < 0 || !Number.isFinite(nums[k + 1])) { skipped++; continue; }
    de.push(nums[k]); u.push(nums[k + 1]);
  }
  return { de, u, skipped };
}

/** Made-up example: 24 aliquot equivalent doses (Gy) with their uncertainties. */
export const EXAMPLE_ALIQUOTS = `aliquot	De (Gy)	error (Gy)
A01	41.8	2.6
A02	42.1	1.9
A03	58.6	3.3
A04	45.0	1.8
A05	43.1	2.4
A06	55.9	4.9
A07	45.1	3.0
A08	36.4	2.3
A09	45.0	3.6
A10	40.6	2.8
A11	37.5	2.6
A12	43.8	2.9
A13	43.0	3.7
A14	42.7	2.0
A15	46.7	3.6
A16	50.2	3.1
A17	39.7	3.7
A18	44.3	2.4
A19	59.7	5.6
A20	44.9	3.9
A21	37.4	2.5
A22	41.6	3.5
A23	50.7	2.3
A24	42.6	2.4
`;
