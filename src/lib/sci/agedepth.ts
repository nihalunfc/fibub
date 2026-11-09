// Age-depth models for sediment and ice cores from dated levels: linear interpolation, a weighted cubic smoothing
// spline (Reinsch 1967, as Green and Silverman 1994 set it out) and a Monte Carlo model that samples each date from
// its normal error, rejects draws with an age reversal (as Clam does) and interpolates linearly, giving the median
// and a 95 % envelope. Plain TypeScript, no DOM.

export type Level = { depth: number; age: number; sd: number; label: string; line: number };
export type Parsed = { levels: Level[]; left: Level[]; bad: number[]; merged: string[] };

const num = (s: string) => Number(s.replace(/−/g, '-').replace(/,(?=\d{1,2}$)/, '.'));

/**
 * Reads "depth, age, 1σ[, label]" lines (comma, tab, semicolon or spaces). A line starting with # is a date left
 * out (still read, so it can be drawn). A first line that is not numbers is taken as a header.
 */
export function parseLevels(text: string): Parsed {
  const levels: Level[] = [], left: Level[] = [], bad: number[] = [];
  text.split(/\r?\n/).forEach((raw, i) => {
    let l = raw.trim(); if (!l) return;
    const out = l.startsWith('#'); if (out) l = l.replace(/^#+\s*/, '');
    const parts = (/[,;\t]/.test(l) ? l.split(/\s*[,;\t]\s*/) : l.split(/\s+/)).map((s) => s.trim());
    const [d, a, s] = parts.slice(0, 3).map(num);
    if (!(Number.isFinite(d) && Number.isFinite(a) && s > 0)) {
      if (!out && !(levels.length === 0 && left.length === 0 && bad.length === 0 && /[a-z]/i.test(l))) bad.push(i + 1);
      return;
    }
    const lv = { depth: d, age: a, sd: s, label: parts.slice(3).join(' ').trim(), line: i + 1 };
    (out ? left : levels).push(lv);
  });
  levels.sort((p, q) => p.depth - q.depth || p.age - q.age);
  // Dates at the same depth are combined into their error-weighted mean.
  const merged: string[] = [], out: Level[] = [];
  for (let i = 0; i < levels.length;) {
    let j = i; while (j + 1 < levels.length && levels[j + 1].depth === levels[i].depth) j++;
    if (j === i) out.push(levels[i]);
    else {
      const g = levels.slice(i, j + 1), w = g.map((v) => 1 / v.sd ** 2), sw = w.reduce((p, q) => p + q, 0);
      const age = g.reduce((p, v, k) => p + w[k] * v.age, 0) / sw;
      out.push({ depth: levels[i].depth, age, sd: 1 / Math.sqrt(sw), label: g.map((v) => v.label).filter(Boolean).join(' + '), line: g[0].line });
      merged.push(`${g.length} dates at depth ${levels[i].depth}`);
    }
    i = j + 1;
  }
  return { levels: out, left, bad, merged };
}

/** Linear interpolation through the levels; outside them, the nearest segment's rate carries on. */
export function linearAt(xs: ArrayLike<number>, ys: ArrayLike<number>, x: number, extrapolate = true): number {
  const n = xs.length;
  if (n === 1) return ys[0];
  if (x <= xs[0] || x >= xs[n - 1]) {
    if (!extrapolate && (x < xs[0] || x > xs[n - 1])) return NaN;
    const k = x <= xs[0] ? 0 : n - 2;
    return ys[k] + ((ys[k + 1] - ys[k]) * (x - xs[k])) / (xs[k + 1] - xs[k]);
  }
  let lo = 0, hi = n - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (xs[m] <= x) lo = m; else hi = m; }
  return ys[lo] + ((ys[hi] - ys[lo]) * (x - xs[lo])) / (xs[hi] - xs[lo]);
}
/** Slope (age per depth) of the linear model at x (the segment holding x; the end segments outside). */
export function linearSlope(xs: ArrayLike<number>, ys: ArrayLike<number>, x: number, extrapolate = true): number {
  const n = xs.length;
  if (n < 2) return NaN;
  if (!extrapolate && (x < xs[0] || x > xs[n - 1])) return NaN;
  let k = 0; while (k < n - 2 && x >= xs[k + 1]) k++;
  return (ys[k + 1] - ys[k]) / (xs[k + 1] - xs[k]);
}

// ---------- Smoothing spline ----------
export type Spline = { x: number[]; g: number[]; m: number[]; lambda: number; chi2: number; edf: number };

/** Solves a symmetric positive definite pentadiagonal system (diagonals d, e (1 off), f (2 off)). */
function solvePenta(d: number[], e: number[], f: number[], b: number[]): number[] {
  const n = d.length;
  // A = L D Lᵀ with unit lower L (sub-diagonals l1, l2) and pivots l0.
  const l0 = new Array(n).fill(0), l1 = new Array(n).fill(0), l2 = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    const a2 = i >= 2 ? f[i - 2] / l0[i - 2] : 0;
    l2[i] = a2;
    l1[i] = i >= 1 ? (e[i - 1] - (i >= 2 ? l2[i] * l1[i - 1] * l0[i - 2] : 0)) / l0[i - 1] : 0;
    l0[i] = d[i] - (i >= 1 ? l1[i] * l1[i] * l0[i - 1] : 0) - (i >= 2 ? l2[i] * l2[i] * l0[i - 2] : 0);
  }
  const z = b.slice();
  for (let i = 0; i < n; i++) z[i] -= (i >= 1 ? l1[i] * z[i - 1] : 0) + (i >= 2 ? l2[i] * z[i - 2] : 0);
  for (let i = 0; i < n; i++) z[i] /= l0[i];
  for (let i = n - 1; i >= 0; i--) z[i] -= (i + 1 < n ? l1[i + 1] * z[i + 1] : 0) + (i + 2 < n ? l2[i + 2] * z[i + 2] : 0);
  return z;
}

/**
 * Natural cubic smoothing spline minimising Σ wᵢ (yᵢ − g(xᵢ))² + λ ∫ g''² with wᵢ = 1/σᵢ² (x sorted, distinct).
 * The same criterion as scipy.interpolate.make_smoothing_spline(x, y, w, lam).
 */
export function smoothingSpline(x: number[], y: number[], sd: number[], lambda: number): Spline {
  const n = x.length;
  if (n < 3) return { x, g: y.slice(), m: new Array(n).fill(0), lambda, chi2: 0, edf: n };
  const h = x.slice(1).map((v, i) => v - x[i]), w = sd.map((s) => 1 / (s * s)), m = n - 2;
  // Q (n × m): column j has 1/h_j, −1/h_j − 1/h_{j+1}, 1/h_{j+1} in rows j, j+1, j+2.
  const qa = (j: number) => 1 / h[j], qb = (j: number) => -1 / h[j] - 1 / h[j + 1], qc = (j: number) => 1 / h[j + 1];
  const d = new Array(m), e = new Array(Math.max(0, m - 1)), f = new Array(Math.max(0, m - 2)), b = new Array(m);
  for (let j = 0; j < m; j++) {
    d[j] = (h[j] + h[j + 1]) / 3 + lambda * (qa(j) ** 2 / w[j] + qb(j) ** 2 / w[j + 1] + qc(j) ** 2 / w[j + 2]);
    if (j + 1 < m) e[j] = h[j + 1] / 6 + lambda * (qb(j) * qa(j + 1) / w[j + 1] + qc(j) * qb(j + 1) / w[j + 2]);
    if (j + 2 < m) f[j] = lambda * (qc(j) * qa(j + 2) / w[j + 2]);
    b[j] = qa(j) * y[j] + qb(j) * y[j + 1] + qc(j) * y[j + 2];
  }
  const gam = solvePenta(d, e, f, b);
  const qg = new Array(n).fill(0);
  for (let j = 0; j < m; j++) { qg[j] += qa(j) * gam[j]; qg[j + 1] += qb(j) * gam[j]; qg[j + 2] += qc(j) * gam[j]; }
  const g = y.map((v, i) => v - (lambda * qg[i]) / w[i]);
  const chi2 = g.reduce((s, v, i) => s + w[i] * (y[i] - v) ** 2, 0);
  return { x, g, m: [0, ...gam, 0], lambda, chi2, edf: NaN };
}
/** Value of the spline at x (linear outside the first and last level). */
export function splineAt(s: Spline, x: number, extrapolate = true): number {
  const { x: X, g, m } = s, n = X.length;
  if (n === 1) return g[0];
  if (n === 2) return linearAt(X, g, x, extrapolate);
  if (x < X[0] || x > X[n - 1]) { if (!extrapolate) return NaN; const k = x < X[0] ? 0 : n - 1; return g[k] + splineSlope(s, X[k]) * (x - X[k]); }
  let i = 0, hi = n - 1; while (hi - i > 1) { const k = (i + hi) >> 1; if (X[k] <= x) i = k; else hi = k; }
  const h = X[i + 1] - X[i], a = X[i + 1] - x, b = x - X[i];
  return (m[i] * a ** 3 + m[i + 1] * b ** 3) / (6 * h) + (g[i] / h - (m[i] * h) / 6) * a + (g[i + 1] / h - (m[i + 1] * h) / 6) * b;
}
/** Derivative (age per depth) of the spline at x. */
export function splineSlope(s: Spline, x: number, extrapolate = true): number {
  const { x: X, g, m } = s, n = X.length;
  if (n < 2) return NaN;
  if (n === 2) return linearSlope(X, g, x, extrapolate);
  if (!extrapolate && (x < X[0] || x > X[n - 1])) return NaN;
  const xc = Math.min(X[n - 1], Math.max(X[0], x));
  let i = 0, hi = n - 1; while (hi - i > 1) { const k = (i + hi) >> 1; if (X[k] <= xc) i = k; else hi = k; }
  const h = X[i + 1] - X[i], a = X[i + 1] - xc, b = xc - X[i];
  return (-m[i] * a * a + m[i + 1] * b * b) / (2 * h) - (g[i] / h - (m[i] * h) / 6) + (g[i + 1] / h - (m[i + 1] * h) / 6);
}
/**
 * The smoothing spline whose χ² = Σ ((yᵢ − g(xᵢ))/σᵢ)² equals `target` (Reinsch's criterion; target = n fits the
 * curve within the errors, 0 passes through every date). If even a straight line fits within the target, the line
 * is returned (λ = Infinity).
 */
export function splineForChi2(x: number[], y: number[], sd: number[], target: number): Spline {
  const n = x.length;
  if (n < 3 || target <= 0) return { ...smoothingSpline(x, y, sd, 0), lambda: 0 };
  // Work in depth scaled to 0..1 so λ stays in a sensible range, and convert back at the end (λ scales as L³).
  const L = x[n - 1] - x[0], xs = x.map((v) => (v - x[0]) / L);
  const at = (lg: number) => smoothingSpline(xs, y, sd, 10 ** lg);
  // Weighted straight line: the λ → ∞ limit.
  const w = sd.map((s) => 1 / (s * s)), sw = w.reduce((p, q) => p + q, 0);
  const mx = xs.reduce((p, v, i) => p + w[i] * v, 0) / sw, my = y.reduce((p, v, i) => p + w[i] * v, 0) / sw;
  const sl = xs.reduce((p, v, i) => p + w[i] * (v - mx) * (y[i] - my), 0) / xs.reduce((p, v, i) => p + w[i] * (v - mx) ** 2, 0);
  const lineChi = y.reduce((p, v, i) => p + w[i] * (v - my - sl * (xs[i] - mx)) ** 2, 0);
  if (lineChi <= target) {
    const g = xs.map((v) => my + sl * (v - mx));
    return { x, g, m: new Array(n).fill(0), lambda: Infinity, chi2: lineChi, edf: 2 };
  }
  let lo = -20, hi = 20;
  for (let k = 0; k < 200 && hi - lo > 1e-12; k++) { const mid = (lo + hi) / 2; if (at(mid).chi2 < target) lo = mid; else hi = mid; }
  const s = at((lo + hi) / 2);
  return { x, g: s.g, m: s.m.map((v) => v / (L * L)), lambda: s.lambda * L ** 3, chi2: s.chi2, edf: NaN };
}

// ---------- Monte Carlo ----------
/** Small seeded generator (mulberry32) with Box–Muller normals. */
export function rng(seed: number) {
  let a = seed >>> 0, spare: number | null = null;
  const u = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return (((t ^ (t >>> 14)) >>> 0) + 0.5) / 4294967296; };
  const normal = () => {
    if (spare !== null) { const s = spare; spare = null; return s; }
    const r = Math.sqrt(-2 * Math.log(u())), th = 2 * Math.PI * u();
    spare = r * Math.sin(th); return r * Math.cos(th);
  };
  return { u, normal };
}

export type MC = {
  depths: number[]; n: number; tries: number;
  /** Age quantiles at each depth. */
  median: number[]; lo: number[]; hi: number[]; mean: number[];
  /** Age per depth (deposition time) quantiles at each depth. */
  rateMedian: number[]; rateLo: number[]; rateHi: number[];
  /** All accepted draws: ages[i * depths.length + k]. */
  ages: Float64Array;
};
/** Linear-interpolation quantile of a sorted array (numpy's default). */
export function quantile(sorted: ArrayLike<number>, p: number): number {
  const n = sorted.length; if (!n) return NaN;
  const h = (n - 1) * p, i = Math.floor(h), f = h - i;
  return i + 1 < n ? sorted[i] + f * (sorted[i + 1] - sorted[i]) : sorted[n - 1];
}
/**
 * Draws each level's age from N(age, σ), keeps the draw only if ages never decrease with depth, and interpolates
 * linearly to `depths`. Stops after `iterations` accepted draws, `maxTries` attempts or 3e7 random numbers.
 */
export function monteCarlo(levels: Level[], depths: number[], iterations = 2000, seed = 1, extrapolate = true, maxTries = iterations * 200): MC {
  const R = rng(seed), n = levels.length, G = depths.length;
  const xs = levels.map((l) => l.depth), a = new Float64Array(n);
  const ages = new Float64Array(iterations * G), rates = new Float64Array(iterations * G);
  let got = 0, tries = 0, draws = 0;
  // Stops after maxTries attempts or 30 million random numbers, so contradictory dates cannot hang the page.
  while (got < iterations && tries < maxTries && draws < 3e7) {
    tries++;
    let ok = true;
    for (let i = 0; i < n; i++) { draws++; a[i] = levels[i].age + levels[i].sd * R.normal(); if (i && a[i] < a[i - 1]) { ok = false; break; } }
    if (!ok) continue;
    for (let k = 0; k < G; k++) { ages[got * G + k] = linearAt(xs, a, depths[k], extrapolate); rates[got * G + k] = linearSlope(xs, a, depths[k], extrapolate); }
    got++;
  }
  const median: number[] = [], lo: number[] = [], hi: number[] = [], mean: number[] = [], rm: number[] = [], rl: number[] = [], rh: number[] = [];
  const col = new Float64Array(got), rc = new Float64Array(got);
  for (let k = 0; k < G; k++) {
    let s = 0;
    for (let i = 0; i < got; i++) { col[i] = ages[i * G + k]; rc[i] = rates[i * G + k]; s += col[i]; }
    col.sort(); rc.sort();
    median.push(quantile(col, 0.5)); lo.push(quantile(col, 0.025)); hi.push(quantile(col, 0.975)); mean.push(got ? s / got : NaN);
    rm.push(quantile(rc, 0.5)); rl.push(quantile(rc, 0.025)); rh.push(quantile(rc, 0.975));
  }
  return { depths, n: got, tries, median, lo, hi, mean, rateMedian: rm, rateLo: rl, rateHi: rh, ages: ages.subarray(0, got * G) };
}

// ---------- Checks on the dates ----------
export type Flag = { level: Level; z: number; reversal: boolean; outlier: boolean };
/**
 * Flags dates that sit more than `zMax` errors from the smoothing spline, and pairs of neighbouring dates where the
 * upper one is older than the lower one by more than 2 combined errors (a significant age reversal).
 */
export function flagLevels(levels: Level[], spline: Spline, zMax = 2): Flag[] {
  return levels.map((l, i) => {
    const z = (l.age - spline.g[i]) / l.sd;
    const rev = (j: number) => j >= 0 && j + 1 < levels.length && levels[j].age - levels[j + 1].age > 2 * Math.hypot(levels[j].sd, levels[j + 1].sd);
    return { level: l, z, reversal: rev(i - 1) || rev(i), outlier: Math.abs(z) > zMax };
  });
}

/** Evenly spaced depths from top to bottom: `step` apart, or about 200 steps when step is not given. */
export function depthGrid(top: number, bottom: number, step?: number): number[] {
  if (!(bottom > top)) return [top];
  let s = step && step > 0 ? step : niceStep((bottom - top) / 200);
  if ((bottom - top) / s > 5000) s = (bottom - top) / 5000;
  const out: number[] = [];
  for (let k = 0; ; k++) { const d = +(top + k * s).toPrecision(12); if (d > bottom + s * 1e-9) break; out.push(d); }
  if (out[out.length - 1] < bottom - s * 1e-9) out.push(bottom);
  return out;
}
function niceStep(raw: number) {
  const mag = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw * 0.999)!;
}

/** A made-up lake core: depth (cm), calibrated age (cal yr BP), 1σ (years). */
export const EXAMPLE = `depth_cm,age_cal_BP,sd,label
0,-60,5,core top (2010)
42,610,40,leaf
95,1480,55,charcoal
150,2290,60,seeds
198,3290,70,leaf
226,3150,60,bulk sediment
265,4720,80,charcoal
330,5980,90,twig
381,7210,100,charcoal
440,8890,120,seeds`;
