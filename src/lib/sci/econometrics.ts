// Linear regression for econometrics: OLS with classical, heteroskedasticity-robust (HC0 to HC3) and
// cluster-robust standard errors, instrumental variables by two-stage least squares, and panel fixed
// effects (the within estimator) with entity and time effects. Plain functions, no DOM.
// Conventions follow statsmodels (OLS, use_t=True) and linearmodels (IV2SLS with debiased=True,
// PanelOLS defaults), so the numbers agree with both to many decimal places.
import { tTwoSided, tInv, fSf } from './stats.ts';

export type Mat = number[][];

/** Inverse of a square matrix by Gauss-Jordan elimination with partial pivoting; null if (near) singular. */
export function inv(A: Mat): Mat | null {
  const n = A.length, M = A.map((r, i) => [...r, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  const scale = Math.max(1e-300, ...A.map((r, i) => Math.abs(r[i])));
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (Math.abs(M[p][c]) < 1e-11 * scale) return null;
    [M[c], M[p]] = [M[p], M[c]];
    const d = M[c][c];
    for (let j = 0; j < 2 * n; j++) M[c][j] /= d;
    for (let r = 0; r < n; r++) {
      if (r === c || M[r][c] === 0) continue;
      const f = M[r][c];
      for (let j = 0; j < 2 * n; j++) M[r][j] -= f * M[c][j];
    }
  }
  return M.map((r) => r.slice(n));
}
/** A'B for row-major data matrices with the same number of rows. */
export function crossprod(A: Mat, B: Mat): Mat {
  const p = A[0]?.length ?? 0, q = B[0]?.length ?? 0, out = Array.from({ length: p }, () => new Array(q).fill(0));
  for (let i = 0; i < A.length; i++) { const a = A[i], b = B[i]; for (let j = 0; j < p; j++) { const aj = a[j]; if (aj) for (let k = 0; k < q; k++) out[j][k] += aj * b[k]; } }
  return out;
}
export const mulMat = (A: Mat, B: Mat): Mat => A.map((r) => B[0].map((_, j) => r.reduce((s, x, k) => s + x * B[k][j], 0)));
export const mulVec = (A: Mat, v: number[]) => A.map((r) => r.reduce((s, x, k) => s + x * v[k], 0));
const sandwich = (B: Mat, M: Mat) => mulMat(mulMat(B, M), B);

export type CovType = 'classical' | 'hc0' | 'hc1' | 'hc2' | 'hc3' | 'cluster';
export type Coef = { name: string; b: number; se: number; t: number; p: number; lo: number; hi: number };
export type RegResult = {
  coefs: Coef[]; n: number; k: number; df: number; r2: number; adjR2: number; ssr: number; sigma: number;
  /** Joint test that all slopes (not the constant) are zero, using the chosen covariance. */
  f?: { F: number; df1: number; df2: number; p: number };
  clusters?: number; cov: CovType; resid: number[]; fitted: number[];
  firstStage?: { name: string; F: number; df1: number; df2: number; p: number; partialR2: number }[];
  effects?: { entities: number; times: number; absorbed: number; r2Within: number };
};

function coefTable(names: string[], b: number[], V: Mat, df: number, level: number): Coef[] {
  const tq = tInv(1 - (1 - level) / 2, df);
  return names.map((name, j) => {
    const se = Math.sqrt(V[j][j]), t = b[j] / se;
    return { name, b: b[j], se, t, p: tTwoSided(t, df), lo: b[j] - tq * se, hi: b[j] + tq * se };
  });
}
/** Wald F of R b = 0 for the given coefficient indices. */
function waldF(b: number[], V: Mat, idx: number[], df2: number) {
  if (!idx.length) return undefined;
  const Vi = inv(idx.map((i) => idx.map((j) => V[i][j])));
  if (!Vi) return undefined;
  const r = idx.map((i) => b[i]), F = r.reduce((s, x, i) => s + x * r.reduce((t, y, j) => t + Vi[i][j] * y, 0), 0) / idx.length;
  return { F, df1: idx.length, df2, p: fSf(F, idx.length, df2) };
}
/** Sum over clusters of (X_g' e_g)(X_g' e_g)'. */
function clusterMeat(X: Mat, e: number[], g: string[]) {
  const k = X[0].length, sums = new Map<string, number[]>();
  X.forEach((r, i) => { let s = sums.get(g[i]); if (!s) sums.set(g[i], (s = new Array(k).fill(0))); for (let j = 0; j < k; j++) s[j] += r[j] * e[i]; });
  const M = Array.from({ length: k }, () => new Array(k).fill(0));
  for (const s of sums.values()) for (let a = 0; a < k; a++) for (let c = 0; c < k; c++) M[a][c] += s[a] * s[c];
  return { M, G: sums.size };
}
const weighted = (X: Mat, w: number[]) => X.map((r, i) => r.map((x) => x * w[i]));
const collinear = (names: string[]) => new Error(`The variables are perfectly collinear (one is an exact combination of the others${names.length ? `: check ${names.join(', ')}` : ''}). Remove one and try again.`);

/** Which columns make X'X singular, found by adding columns one at a time. */
function culprits(X: Mat, names: string[]) {
  const keep: number[] = [];
  const bad: string[] = [];
  for (let j = 0; j < names.length; j++) {
    const idx = [...keep, j], S = crossprod(X.map((r) => idx.map((i) => r[i])), X.map((r) => idx.map((i) => r[i])));
    if (inv(S)) keep.push(j); else bad.push(names[j]);
  }
  return bad;
}

export type OlsOpts = { cov?: CovType; clusters?: string[]; level?: number; hasConst?: boolean };

/** Ordinary least squares. X already holds the constant column if wanted (set hasConst). */
export function ols(y: number[], X: Mat, names: string[], o: OlsOpts = {}): RegResult {
  const cov = o.cov ?? 'classical', level = o.level ?? 0.95, n = y.length, k = names.length;
  if (n <= k) throw new Error(`There ${n === 1 ? "is 1 complete row" : `are ${n} complete rows`} but ${k} coefficients to estimate. You need more rows than coefficients.`);
  const XtXi = inv(crossprod(X, X));
  if (!XtXi) throw collinear(culprits(X, names));
  const b = mulVec(XtXi, crossprod(X, y.map((v) => [v])).map((r) => r[0]));
  const fitted = X.map((r) => r.reduce((s, x, j) => s + x * b[j], 0)), e = y.map((v, i) => v - fitted[i]);
  const ssr = e.reduce((s, x) => s + x * x, 0), ybar = y.reduce((s, x) => s + x, 0) / n;
  const tss = o.hasConst ? y.reduce((s, x) => s + (x - ybar) ** 2, 0) : y.reduce((s, x) => s + x * x, 0);
  const dfr = n - k, s2 = ssr / dfr;
  let V: Mat, dfInf = dfr, G: number | undefined;
  if (cov === 'classical') V = XtXi.map((r) => r.map((x) => x * s2));
  else if (cov === 'cluster') {
    if (!o.clusters) throw new Error('Choose the column that holds the clusters.');
    const c = clusterMeat(X, e, o.clusters); G = c.G;
    if (G < 2) throw new Error('Clustered standard errors need at least two clusters.');
    const adj = (G / (G - 1)) * ((n - 1) / (n - k));
    V = sandwich(XtXi, c.M).map((r) => r.map((x) => x * adj));
    dfInf = G - 1;
  } else {
    const h = X.map((r) => r.reduce((s, x, a) => s + x * r.reduce((t, z, c) => t + XtXi[a][c] * z, 0), 0));
    const w = e.map((x, i) => (cov === 'hc2' ? (x * x) / (1 - h[i]) : cov === 'hc3' ? (x * x) / (1 - h[i]) ** 2 : x * x));
    V = sandwich(XtXi, crossprod(weighted(X, w), X));
    if (cov === 'hc1') V = V.map((r) => r.map((x) => (x * n) / dfr));
  }
  const coefs = coefTable(names, b, V, dfInf, level);
  const r2 = 1 - ssr / tss, adjR2 = 1 - ((1 - r2) * (n - (o.hasConst ? 1 : 0))) / dfr;
  const slopes = names.map((_, j) => j).filter((j) => !(o.hasConst && j === 0));
  return { coefs, n, k, df: dfInf, r2, adjR2, ssr, sigma: Math.sqrt(s2), f: waldF(b, V, slopes, dfInf), clusters: G, cov, resid: e, fitted };
}

export type IvOpts = { cov?: 'classical' | 'robust' | 'cluster'; clusters?: string[]; level?: number; hasConst?: boolean };

/**
 * Two-stage least squares. `exog` holds the included exogenous columns (with the constant if wanted),
 * `endog` the endogenous regressors and `instr` the excluded instruments. Standard errors follow
 * linearmodels' IV2SLS with debiased=True: s² = SSR / (n − k), robust = HC0 × n / (n − k), clustered =
 * G / (G − 1) × (n − 1) / (n − k), and t tests on n − k degrees of freedom.
 */
export function iv2sls(y: number[], exog: Mat, endog: Mat, instr: Mat, names: { exog: string[]; endog: string[]; instr: string[] }, o: IvOpts = {}): RegResult {
  const cov = o.cov ?? 'classical', level = o.level ?? 0.95, n = y.length;
  const kx = names.exog.length, ke = names.endog.length, kz = names.instr.length, k = kx + ke;
  if (!ke) throw new Error('Choose at least one endogenous variable.');
  if (kz < ke) throw new Error(`There ${kz === 1 ? 'is 1 instrument' : `are ${kz} instruments`} for ${ke} endogenous variable${ke > 1 ? 's' : ''}. You need at least as many instruments as endogenous variables.`);
  if (n <= kx + kz) throw new Error('There are too few complete rows for this many variables and instruments.');
  const X = exog.map((r, i) => [...r, ...endog[i]]), Z = exog.map((r, i) => [...r, ...instr[i]]);
  const ZtZi = inv(crossprod(Z, Z));
  if (!ZtZi) throw collinear(culprits(Z, [...names.exog, ...names.instr]));
  // First stage: fitted values of every regressor from all instruments.
  const P = mulMat(ZtZi, crossprod(Z, X)), Xh = Z.map((r) => P[0].map((_, j) => r.reduce((s, z, a) => s + z * P[a][j], 0)));
  const A = inv(crossprod(Xh, Xh));
  if (!A) throw new Error('The instruments do not identify the model: the fitted endogenous variables are collinear with the other regressors. Check that each instrument varies and is not one of the regressors.');
  const b = mulVec(A, crossprod(Xh, y.map((v) => [v])).map((r) => r[0]));
  const fitted = X.map((r) => r.reduce((s, x, j) => s + x * b[j], 0)), e = y.map((v, i) => v - fitted[i]);
  const ssr = e.reduce((s, x) => s + x * x, 0), dfr = n - k, ybar = y.reduce((s, x) => s + x, 0) / n;
  const tss = o.hasConst ? y.reduce((s, x) => s + (x - ybar) ** 2, 0) : y.reduce((s, x) => s + x * x, 0);
  let V: Mat, G: number | undefined;
  if (cov === 'classical') V = A.map((r) => r.map((x) => (x * ssr) / dfr));
  else if (cov === 'robust') V = sandwich(A, crossprod(weighted(Xh, e.map((x) => x * x)), Xh)).map((r) => r.map((x) => (x * n) / dfr));
  else {
    if (!o.clusters) throw new Error('Choose the column that holds the clusters.');
    const c = clusterMeat(Xh, e, o.clusters); G = c.G;
    if (G < 2) throw new Error('Clustered standard errors need at least two clusters.');
    V = sandwich(A, c.M).map((r) => r.map((x) => (x * (G! / (G! - 1)) * (n - 1)) / dfr));
  }
  const all = [...names.exog, ...names.endog], coefs = coefTable(all, b, V, dfr, level);
  const r2 = 1 - ssr / tss;
  // Classical first-stage F for the excluded instruments, one per endogenous variable.
  const firstStage = names.endog.map((nm, j) => {
    const yj = endog.map((r) => r[j]);
    const full = ols(yj, Z, [...names.exog, ...names.instr]);
    const restr = kx ? ols(yj, exog, names.exog) : { ssr: yj.reduce((s, v) => s + v * v, 0) };
    const df2 = n - kx - kz, F = ((restr.ssr - full.ssr) / kz) / (full.ssr / df2);
    return { name: nm, F, df1: kz, df2, p: fSf(F, kz, df2), partialR2: 1 - full.ssr / restr.ssr };
  });
  const slopes = all.map((_, j) => j).filter((j) => !(o.hasConst && j === 0));
  return { coefs, n, k, df: dfr, r2, adjR2: 1 - ((1 - r2) * (n - (o.hasConst ? 1 : 0))) / dfr, ssr, sigma: Math.sqrt(ssr / dfr), f: waldF(b, V, slopes, dfr), clusters: G, cov: cov === 'robust' ? 'hc1' : cov, resid: e, fitted, firstStage };
}

/** Subtract group means, alternating between entity and time until nothing changes (exact for balanced panels after one pass). */
export function demean(cols: number[][], ent: string[], time: string[] | null) {
  const out = cols.map((c) => c.slice());
  const pass = (v: number[], g: string[]) => {
    const s = new Map<string, [number, number]>();
    g.forEach((key, i) => { const a = s.get(key) ?? [0, 0]; a[0] += v[i]; a[1]++; s.set(key, a); });
    let moved = 0;
    for (let i = 0; i < v.length; i++) { const a = s.get(g[i])!, m = a[0] / a[1]; v[i] -= m; moved = Math.max(moved, Math.abs(m)); }
    return moved;
  };
  for (const v of out) {
    const scale = Math.max(1, ...v.map(Math.abs));
    for (let it = 0; it < 10000; it++) {
      const m = pass(v, ent) + (time ? pass(v, time) : 0);
      if (!time || m < 1e-14 * scale) break;
    }
  }
  return out;
}

export type PanelOpts = { timeEffects?: boolean; cov?: 'classical' | 'robust' | 'cluster'; level?: number };

/**
 * Panel fixed effects (within estimator), matching linearmodels' PanelOLS with its default
 * debiased=True: k regressors and `absorbed` effects (entities, plus periods − 1 with time effects).
 * Classical s² = SSR / (n − k − absorbed); robust = HC0 × n / (n − k − absorbed); clustered by entity =
 * (n / (n − k − extra)) × Σ_g, where extra counts the effects not nested in the entities (0 with entity
 * effects only). t tests use n − k − absorbed degrees of freedom.
 */
export function panelFE(y: number[], X: Mat, names: string[], entity: string[], time: string[], o: PanelOpts = {}): RegResult {
  const cov = o.cov ?? 'classical', level = o.level ?? 0.95, n = y.length, k = names.length;
  const ents = new Set(entity).size, times = new Set(time).size;
  const absorbed = ents + (o.timeEffects ? times - 1 : 0);
  if (n - k - absorbed < 1) throw new Error(`Too few rows: ${n} rows, ${k} slopes and ${absorbed} fixed effects leave no degrees of freedom.`);
  const [yd, ...xd] = demean([y, ...names.map((_, j) => X.map((r) => r[j]))], entity, o.timeEffects ? time : null);
  const Xd = yd.map((_, i) => xd.map((c) => c[i]));
  // A regressor that never changes within an entity (or period) vanishes after demeaning.
  const flat = names.filter((_, j) => xd[j].every((v) => Math.abs(v) < 1e-9 * Math.max(1, ...X.map((r) => Math.abs(r[j])))));
  if (flat.length) throw new Error(`${flat.join(', ')} ${flat.length > 1 ? 'do' : 'does'} not change within ${o.timeEffects ? 'an entity or a period' : 'an entity'}, so the fixed effects absorb ${flat.length > 1 ? 'them' : 'it'}. Remove ${flat.length > 1 ? 'them' : 'it'} from the regressors.`);
  const XtXi = inv(crossprod(Xd, Xd));
  if (!XtXi) throw collinear(culprits(Xd, names));
  const b = mulVec(XtXi, crossprod(Xd, yd.map((v) => [v])).map((r) => r[0]));
  const e = yd.map((v, i) => v - Xd[i].reduce((s, x, j) => s + x * b[j], 0));
  const ssr = e.reduce((s, x) => s + x * x, 0), dfr = n - k - absorbed, tssW = yd.reduce((s, x) => s + x * x, 0);
  let V: Mat, G: number | undefined;
  if (cov === 'classical') V = XtXi.map((r) => r.map((x) => (x * ssr) / dfr));
  else if (cov === 'robust') V = sandwich(XtXi, crossprod(weighted(Xd, e.map((x) => x * x)), Xd)).map((r) => r.map((x) => (x * n) / dfr));
  else {
    const c = clusterMeat(Xd, e, entity); G = c.G;
    if (G < 2) throw new Error('Clustered standard errors need at least two entities.');
    const extra = o.timeEffects ? absorbed : 0;
    V = sandwich(XtXi, c.M).map((r) => r.map((x) => (x * n) / (n - k - extra)));
  }
  const coefs = coefTable(names, b, V, dfr, level);
  const r2 = 1 - ssr / tssW;
  const fitted = yd.map((v, i) => v - e[i]); // within (demeaned) fitted values
  return { coefs, n, k, df: dfr, r2, adjR2: 1 - ((1 - r2) * (n - absorbed)) / dfr, ssr, sigma: Math.sqrt(ssr / dfr), f: waldF(b, V, names.map((_, j) => j), dfr), clusters: G, cov: cov === 'robust' ? 'hc1' : cov, resid: e, fitted, effects: { entities: ents, times, absorbed, r2Within: r2 } };
}

/** Columns of a CSV-like table: header names and the cells as text. */
export function readColumns(rows: string[][]) {
  if (rows.length < 2) throw new Error('Paste a table with a header row and at least two rows of data.');
  const head = rows[0].map((h, i) => h.trim() || `Column ${i + 1}`);
  const seen = new Set<string>();
  for (const h of head) { if (seen.has(h)) throw new Error(`Two columns are called "${h}". Give every column its own name.`); seen.add(h); }
  const body = rows.slice(1);
  const cols: Record<string, string[]> = {};
  head.forEach((h, j) => (cols[h] = body.map((r) => (r[j] ?? '').trim())));
  return { head, cols, n: body.length };
}
