// Creep-rupture time-temperature parameters and Norton's creep law.
// Larson-Miller P = T (C + log10 t), Sherby-Dorn P = log10 t − Q/(ln10 R T), Manson-Haferd P = (T − Ta)/(log10 t − log10 ta),
// each fitted as a polynomial in log10 σ (T in kelvin, t in hours). Norton: minimum creep rate = A σⁿ exp(−Q/RT).
// Textbook forms as in Dieter, Mechanical Metallurgy, ch. 13; Dowling, Mechanical Behavior of Materials, ch. 15;
// Callister, Materials Science and Engineering, ch. 8. fibub's own code.
import { solveSPD } from './fit.ts';

export const R = 8.314462618; // J/(mol K)
export type Method = 'lm' | 'sd' | 'mh';
export const METHOD_NAME: Record<Method, string> = { lm: 'Larson-Miller', sd: 'Sherby-Dorn', mh: 'Manson-Haferd' };
export type Consts = { C: number; Q: number; Ta: number; logta: number };

/** The parameter for temperature T (K) and rupture time t (h). Q in J/mol. */
export function param(m: Method, T: number, t: number, k: Consts): number {
  const lt = Math.log10(t);
  if (m === 'lm') return T * (k.C + lt);
  if (m === 'sd') return lt - k.Q / (Math.LN10 * R * T);
  return (T - k.Ta) / (lt - k.logta);
}
/** log10 of rupture time (h) from a parameter value at temperature T (K). */
export function logTime(m: Method, P: number, T: number, k: Consts): number {
  if (m === 'lm') return P / T - k.C;
  if (m === 'sd') return P + k.Q / (Math.LN10 * R * T);
  return k.logta + (T - k.Ta) / P;
}

/** Least-squares polynomial y = Σ c_j x^j (j = 0..deg), with x centred and scaled for conditioning. */
export function polyfit(x: number[], y: number[], deg: number) {
  const n = x.length;
  if (n < deg + 2) throw new Error(`A degree ${deg} fit needs at least ${deg + 2} points.`);
  const mx = x.reduce((s, v) => s + v, 0) / n, sx = Math.sqrt(x.reduce((s, v) => s + (v - mx) ** 2, 0) / n) || 1;
  const z = x.map((v) => (v - mx) / sx), k = deg + 1;
  const A = Array.from({ length: k }, () => new Array(k).fill(0)), b = new Array(k).fill(0);
  for (let i = 0; i < n; i++) { const p = Array.from({ length: k }, (_, j) => z[i] ** j); for (let r = 0; r < k; r++) { b[r] += p[r] * y[i]; for (let c = 0; c < k; c++) A[r][c] += p[r] * p[c]; } }
  const cz = solveSPD(A, b);
  if (!cz) throw new Error('The stresses are too few or too alike for this polynomial: lower the degree.');
  // Expand Σ cz_j ((x − mx)/sx)^j into powers of x.
  const c = new Array(k).fill(0);
  for (let j = 0; j < k; j++) for (let i = 0; i <= j; i++) c[i] += cz[j] * binom(j, i) * (-mx) ** (j - i) / sx ** j;
  const f = (v: number) => cz.reduce((s, cj, j) => s + cj * ((v - mx) / sx) ** j, 0);
  return { c, f };
}
const binom = (n: number, k: number) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return r; };

export type Point = { T: number; s: number; t: number };
export type ParamFit = { m: Method; k: Consts; c: number[]; f: (logs: number) => number; rms: number; r2: number; n: number };

/** Fit P(T, t) as a polynomial in log10 σ; rms is the scatter of log10 t predicted against measured. */
export function fitParam(m: Method, pts: Point[], deg: number, k: Consts): ParamFit {
  const x = pts.map((p) => Math.log10(p.s)), y = pts.map((p) => param(m, p.T, p.t, k));
  if (y.some((v) => !Number.isFinite(v))) throw new Error('The parameter is not finite for some points (check the constants).');
  const { c, f } = polyfit(x, y, deg);
  const lt = pts.map((p) => Math.log10(p.t)), mean = lt.reduce((s, v) => s + v, 0) / lt.length;
  let sse = 0, sst = 0;
  pts.forEach((p, i) => { const e = logTime(m, f(x[i]), p.T, k) - lt[i]; sse += Number.isFinite(e) ? e * e : 1e6; sst += (lt[i] - mean) ** 2; });
  return { m, k, c, f, rms: Math.sqrt(sse / pts.length), r2: sst > 0 ? 1 - sse / sst : 1, n: pts.length };
}

/** Golden-section minimum of a function of one variable on [a, b]. */
function golden(g: (x: number) => number, a: number, b: number, tol = 1e-10) {
  // Coarse grid first, so a single dip inside a wide range is found.
  let best = a, bv = Infinity;
  for (let i = 0; i <= 200; i++) { const x = a + ((b - a) * i) / 200, v = g(x); if (v < bv) { bv = v; best = x; } }
  let lo = Math.max(a, best - (b - a) / 200), hi = Math.min(b, best + (b - a) / 200);
  const r = (Math.sqrt(5) - 1) / 2;
  let x1 = hi - r * (hi - lo), x2 = lo + r * (hi - lo), f1 = g(x1), f2 = g(x2);
  while (hi - lo > tol * (1 + Math.abs(lo))) {
    if (f1 < f2) { hi = x2; x2 = x1; f2 = f1; x1 = hi - r * (hi - lo); f1 = g(x1); } else { lo = x1; x1 = x2; f1 = f2; x2 = lo + r * (hi - lo); f2 = g(x2); }
  }
  return (lo + hi) / 2;
}

/** Nelder-Mead simplex minimum of a function of two variables. */
function nelderMead(g: (p: number[]) => number, p0: number[], step: number[], iters = 4000) {
  let S = [p0, [p0[0] + step[0], p0[1]], [p0[0], p0[1] + step[1]]].map((p) => ({ p, v: g(p) }));
  for (let it = 0; it < iters; it++) {
    S.sort((a, b) => a.v - b.v);
    const [b, m, w] = S, c = [(b.p[0] + m.p[0]) / 2, (b.p[1] + m.p[1]) / 2];
    const at = (t: number) => { const p = [c[0] + t * (w.p[0] - c[0]), c[1] + t * (w.p[1] - c[1])]; return { p, v: g(p) }; };
    const r = at(-1);
    if (r.v < b.v) { const e = at(-2); S[2] = e.v < r.v ? e : r; }
    else if (r.v < m.v) S[2] = r;
    else { const k = at(r.v < w.v ? -0.5 : 0.5); if (k.v < Math.min(w.v, r.v)) S[2] = k; else S = S.map((s, i) => (i ? { p: [b.p[0] + (s.p[0] - b.p[0]) / 2, b.p[1] + (s.p[1] - b.p[1]) / 2], v: 0 } : s)).map((s, i) => (i ? { ...s, v: g(s.p) } : s)); }
    if (Math.abs(S[2].v - S[0].v) < 1e-14 && Math.hypot(S[2].p[0] - S[0].p[0], S[2].p[1] - S[0].p[1]) < 1e-9) break;
  }
  S.sort((a, b) => a.v - b.v);
  return S[0].p;
}

/** Best-fit Larson-Miller C (smallest scatter in log t), searched over 5 to 50. */
export const bestC = (pts: Point[], deg: number) => golden((C) => fitParam('lm', pts, deg, { C, Q: 0, Ta: 0, logta: 0 }).rms, 5, 50);
/** Best-fit Sherby-Dorn Q (J/mol), searched over 20 to 1500 kJ/mol. */
export const bestQ = (pts: Point[], deg: number) => golden((Q) => fitParam('sd', pts, deg, { C: 0, Q, Ta: 0, logta: 0 }).rms, 2e4, 1.5e6);
/** Best-fit Manson-Haferd Ta (K) and log10 ta: the point where iso-stress lines meet, above the data. */
export function bestMH(pts: Point[], deg: number): { Ta: number; logta: number } {
  const maxLt = Math.max(...pts.map((p) => Math.log10(p.t))), minT = Math.min(...pts.map((p) => p.T));
  const g = (q: number[]) => { const k = { C: 0, Q: 0, Ta: q[0], logta: q[1] }; if (q[1] <= maxLt + 0.05 || q[0] >= minT - 1) return 1e6; try { return fitParam('mh', pts, deg, k).rms; } catch { return 1e6; } };
  // Start from a few places; keep the best.
  let best = [minT * 0.5, maxLt + 10], bv = g(best);
  for (const Ta of [0.2, 0.4, 0.6, 0.8].map((f) => f * minT)) for (const lt of [maxLt + 2, maxLt + 5, maxLt + 10, maxLt + 20]) {
    const p = nelderMead(g, [Ta, lt], [minT * 0.05, 1]), v = g(p);
    if (v < bv) { bv = v; best = p; }
  }
  return { Ta: best[0], logta: best[1] };
}

/** Rupture time (h) predicted for a stress and temperature. */
export const ruptureTime = (fit: ParamFit, s: number, T: number) => 10 ** logTime(fit.m, fit.f(Math.log10(s)), T, fit.k);

/** Stress for a target rupture time at temperature T, by bisection on log σ between sLo and sHi (null if not bracketed). */
export function stressFor(fit: ParamFit, t: number, T: number, sLo: number, sHi: number): number | null {
  const g = (ls: number) => logTime(fit.m, fit.f(ls), T, fit.k) - Math.log10(t);
  let lo = Math.log10(sLo), hi = Math.log10(sHi), glo = g(lo), ghi = g(hi);
  if (!Number.isFinite(glo) || !Number.isFinite(ghi) || glo * ghi > 0) return null;
  for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2, gm = g(mid); if (gm * glo > 0) { lo = mid; glo = gm; } else hi = mid; }
  return 10 ** ((lo + hi) / 2);
}

/**
 * Norton (power-law) creep with an Arrhenius term: ln ε̇ = ln A + n ln σ − Q/(R T), fitted by least squares. With one
 * temperature only, Q cannot be found and is left out (A then includes exp(−Q/RT)).
 */
export function norton(s: number[], T: number[], rate: number[]) {
  const N = s.length;
  if (N < 3) throw new Error('Need at least three creep rates.');
  if ([...s, ...rate].some((v) => !(v > 0)) || T.some((v) => !(v > 0))) throw new Error('Stress, temperature and creep rate must all be above zero.');
  const temps = new Set(T.map((t) => t.toFixed(6))), withQ = temps.size > 1;
  if (withQ && N < 4) throw new Error('With several temperatures, give at least four creep rates.');
  const X = s.map((v, i) => (withQ ? [1, Math.log(v), -1 / (R * T[i])] : [1, Math.log(v)])), y = rate.map(Math.log), k = X[0].length;
  const A = Array.from({ length: k }, () => new Array(k).fill(0)), b = new Array(k).fill(0);
  X.forEach((r, i) => { for (let p = 0; p < k; p++) { b[p] += r[p] * y[i]; for (let q = 0; q < k; q++) A[p][q] += r[p] * r[q]; } });
  const c = solveSPD(A, b);
  if (!c) throw new Error('The stresses are all the same: vary the stress to find n.');
  const fit = X.map((r) => r.reduce((t, v, j) => t + v * c[j], 0)), my = y.reduce((t, v) => t + v, 0) / N;
  const sse = y.reduce((t, v, i) => t + (v - fit[i]) ** 2, 0), sst = y.reduce((t, v) => t + (v - my) ** 2, 0);
  return { A: Math.exp(c[0]), n: c[1], Q: withQ ? c[2] : null, r2: sst > 0 ? 1 - sse / sst : 1, rmsLog10: Math.sqrt(sse / N) / Math.LN10, withQ, rate: (sv: number, Tv: number) => Math.exp(c[0] + c[1] * Math.log(sv) - (withQ ? c[2] / (R * Tv) : 0)) };
}

/** Made-up creep-rupture data (not any real alloy): LMP (C = 20) = 30000 − 2500 x − 500 x², x = log10 σ, scatter 0.08 in log t. */
export function exampleRupture(): Point[] {
  let seed = 5;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const gauss = () => Math.sqrt(-2 * Math.log(rnd() || 1e-9)) * Math.cos(2 * Math.PI * rnd());
  const sets: [number, number[]][] = [[600, [300, 250, 200, 170]], [650, [200, 160, 130, 100]], [700, [130, 100, 80, 60]]];
  const out: Point[] = [];
  for (const [c, ss] of sets) for (const s of ss) {
    const x = Math.log10(s), T = c + 273.15, P = 30000 - 2500 * x - 500 * x * x;
    out.push({ T: c, s, t: +(10 ** (P / T - 20 + 0.08 * gauss())).toPrecision(3) });
  }
  return out; // T in °C here
}

/** Made-up minimum creep rates (1/h): A = 71, n = 5, Q = 280 kJ/mol, scatter 0.05 in log10. T in °C. */
export function exampleNorton(): { s: number; T: number; rate: number }[] {
  let seed = 3;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const out: { s: number; T: number; rate: number }[] = [];
  for (const [c, ss] of [[600, [150, 200, 250]], [650, [80, 110, 150]], [700, [40, 60, 80]]] as [number, number[]][]) for (const s of ss) {
    const T = c + 273.15, r = 71 * s ** 5 * Math.exp(-280000 / (R * T)) * 10 ** (0.1 * (rnd() - 0.5));
    out.push({ s, T: c, rate: +r.toPrecision(3) });
  }
  return out;
}
