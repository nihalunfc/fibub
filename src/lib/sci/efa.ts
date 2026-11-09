// Exploratory factor analysis for small data sets: correlation matrix, KMO and Bartlett's test, eigenvalues
// with Horn's parallel analysis, extraction by iterated principal axis or maximum likelihood (the objective of
// R's factanal), and varimax or promax rotation with Kaiser normalisation (as R and factor_analyzer do).
import { logGamma } from './stats.ts';
import { invSPD } from './fit.ts';

type M = number[][];
const zeros = (r: number, c: number): M => Array.from({ length: r }, () => new Array(c).fill(0));
const T = (A: M): M => A[0].map((_, j) => A.map((r) => r[j]));
const mul = (A: M, B: M): M => A.map((r) => B[0].map((_, j) => r.reduce((s, x, k) => s + x * B[k][j], 0)));

/** Pearson correlations of the columns of X (rows with a missing value are dropped first). */
export function correlation(X: number[][]): { R: M; n: number; sd: number[] } {
  const Y = X.filter((r) => r.every(Number.isFinite)), n = Y.length, p = Y[0]?.length ?? 0;
  if (p < 3) throw new Error('Need at least three variables (columns)');
  if (n < 3) throw new Error('Need at least three complete rows');
  const m = Array.from({ length: p }, (_, j) => Y.reduce((s, r) => s + r[j], 0) / n);
  const C = zeros(p, p);
  for (const r of Y) for (let a = 0; a < p; a++) { const da = r[a] - m[a]; for (let b = a; b < p; b++) C[a][b] += da * (r[b] - m[b]); }
  const sd = C.map((r, j) => Math.sqrt(r[j] / (n - 1)));
  sd.forEach((s, j) => { if (!(s > 0)) throw new Error(`Column ${j + 1} has the same value in every row`); });
  const R = zeros(p, p);
  for (let a = 0; a < p; a++) for (let b = a; b < p; b++) R[a][b] = R[b][a] = a === b ? 1 : C[a][b] / Math.sqrt(C[a][a] * C[b][b]);
  return { R, n, sd };
}

/** Eigenvalues (largest first) and eigenvectors (columns) of a symmetric matrix, by cyclic Jacobi rotations. */
export function eigenSym(A0: M): { values: number[]; vectors: M } {
  const n = A0.length, A = A0.map((r) => r.slice()), V = zeros(n, n);
  for (let i = 0; i < n; i++) V[i][i] = 1;
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] ** 2;
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(A[p][q]) < 1e-300) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
      const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
      for (let k = 0; k < n; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; }
      for (let k = 0; k < n; k++) { const vkp = V[k][p], vkq = V[k][q]; V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq; }
    }
  }
  const idx = A.map((_, i) => i).sort((a, b) => A[b][b] - A[a][a]);
  return { values: idx.map((i) => A[i][i]), vectors: V.map((r) => idx.map((i) => r[i])) };
}

const inverse = (R: M) => { const I = invSPD(R); if (!I) throw new Error('The correlation matrix is singular: some variables are exact combinations of others, or there are fewer rows than variables'); return I; };
/** Squared multiple correlation of each variable with all the others. */
export const smc = (R: M) => inverse(R).map((r, i) => 1 - 1 / r[i]);

/** Kaiser-Meyer-Olkin measure of sampling adequacy, overall and per variable. */
export function kmo(R: M): { overall: number; items: number[] } {
  const I = inverse(R), p = R.length;
  let rs = 0, ps = 0;
  const items = R.map((_, i) => {
    let a = 0, b = 0;
    for (let j = 0; j < p; j++) if (j !== i) { a += R[i][j] ** 2; b += (I[i][j] / Math.sqrt(I[i][i] * I[j][j])) ** 2; }
    rs += a; ps += b; return a / (a + b);
  });
  return { overall: rs / (rs + ps), items };
}

/** Regularised upper incomplete gamma Q(a, x). */
export function gammaQ(a: number, x: number): number {
  if (x <= 0) return 1;
  const lg = a * Math.log(x) - x - logGamma(a);
  if (x < a + 1) { let s = 1 / a, t = s; for (let n = 1; n < 1000; n++) { t *= x / (a + n); s += t; if (Math.abs(t) < Math.abs(s) * 1e-16) break; } return 1 - s * Math.exp(lg); }
  let b = x + 1 - a, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i < 1000; i++) { const an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300; c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-16) break; }
  return Math.exp(lg) * h;
}
export const chi2Sf = (x: number, df: number) => gammaQ(df / 2, x / 2);

/** log determinant of a symmetric positive definite matrix (Cholesky). */
function logDet(A: M): number {
  const n = A.length, L = zeros(n, n); let s = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) {
    let v = A[i][j]; for (let k = 0; k < j; k++) v -= L[i][k] * L[j][k];
    if (i === j) { if (!(v > 0)) return -Infinity; L[i][i] = Math.sqrt(v); s += Math.log(L[i][i]); } else L[i][j] = v / L[j][j];
  }
  return 2 * s;
}
/** Bartlett's test that the correlation matrix is an identity matrix. */
export function bartlett(R: M, n: number) {
  const p = R.length, chi2 = -(n - 1 - (2 * p + 5) / 6) * logDet(R), df = (p * (p - 1)) / 2;
  return { chi2, df, p: chi2Sf(chi2, df) };
}

/** A small seeded random number generator, so parallel analysis gives the same answer every time. */
function rng(seed: number) {
  let a = seed >>> 0;
  const u = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  return () => { let x = 0; while (x === 0) x = u(); return Math.sqrt(-2 * Math.log(x)) * Math.cos(2 * Math.PI * u()); };
}
/** Horn's parallel analysis: eigenvalues of correlation matrices of random normal data the same size. */
export function parallel(n: number, p: number, reps = 100, seed = 1) {
  const norm = rng(seed), all: number[][] = Array.from({ length: p }, () => []);
  for (let r = 0; r < reps; r++) {
    const X = Array.from({ length: n }, () => Array.from({ length: p }, norm));
    eigenSym(correlation(X).R).values.forEach((v, j) => all[j].push(v));
  }
  const q95 = (a: number[]) => { const s = a.slice().sort((x, y) => x - y), h = (s.length - 1) * 0.95, i = Math.floor(h); return i + 1 < s.length ? s[i] + (h - i) * (s[i + 1] - s[i]) : s[i]; };
  return { mean: all.map((a) => a.reduce((s, x) => s + x, 0) / a.length), p95: all.map(q95), reps };
}

function loadingsFrom(Rr: M, m: number) {
  const { values, vectors } = eigenSym(Rr);
  return vectors.map((r) => r.slice(0, m).map((v, j) => v * Math.sqrt(Math.max(values[j], 0))));
}

/** Iterated principal axis factoring from squared multiple correlations. Converges to the minres (ULS) solution. */
export function principalAxis(R: M, m: number, maxIter = 2000, tol = 1e-9) {
  const p = R.length;
  let h2 = smc(R), L: M = [], iter = 0, converged = false;
  for (; iter < maxIter; iter++) {
    const Rr = R.map((r, i) => r.map((v, j) => (i === j ? h2[i] : v)));
    L = loadingsFrom(Rr, m);
    const nh = L.map((r) => r.reduce((s, x) => s + x * x, 0));
    const d = Math.max(...nh.map((v, i) => Math.abs(v - h2[i])));
    h2 = nh;
    if (d < tol) { converged = true; break; }
  }
  void p;
  return { L, iterations: iter + 1, converged };
}

/** Maximum likelihood factor analysis: minimises R's factanal objective over the uniquenesses (0.005 to 1). */
export function maxLikelihood(R: M, m: number) {
  const p = R.length, LO = 0.005, HI = 1;
  const psiOf = (z: number[]) => z.map((v) => LO + (HI - LO) / (1 + Math.exp(-v)));
  const star = (psi: number[]) => R.map((r, i) => r.map((v, j) => v / Math.sqrt(psi[i] * psi[j])));
  const f = (psi: number[]) => { const e = eigenSym(star(psi)).values.slice(m); return -(e.reduce((s, x) => s + Math.log(x) - x, 0) - m + p); };
  const grad = (psi: number[]) => {
    const { values, vectors } = eigenSym(star(psi));
    const L = vectors.map((r, i) => r.slice(0, m).map((v, j) => Math.sqrt(psi[i]) * v * Math.sqrt(Math.max(values[j] - 1, 0))));
    return psi.map((ps, i) => (L[i].reduce((s, x) => s + x * x, 0) + ps - R[i][i]) / (ps * ps));
  };
  const F = (z: number[]) => f(psiOf(z));
  const G = (z: number[]) => { const psi = psiOf(z), g = grad(psi); return z.map((v, i) => { const s = 1 / (1 + Math.exp(-v)); return g[i] * (HI - LO) * s * (1 - s); }); };
  const s0 = smc(R).map((h) => Math.min(HI - 1e-3, Math.max(LO + 1e-3, 1 - h)));
  let z = s0.map((ps) => { const u = (ps - LO) / (HI - LO); return Math.log(u / (1 - u)); });
  // BFGS with a backtracking line search.
  let H = zeros(p, p); for (let i = 0; i < p; i++) H[i][i] = 1;
  let fz = F(z), g = G(z), iter = 0, converged = false;
  for (; iter < 1000; iter++) {
    const gn = Math.sqrt(g.reduce((s, x) => s + x * x, 0));
    if (gn < 1e-10) { converged = true; break; }
    let d = H.map((r) => -r.reduce((s, x, k) => s + x * g[k], 0));
    let slope = d.reduce((s, x, i) => s + x * g[i], 0);
    if (slope >= 0) { d = g.map((x) => -x); slope = -gn * gn; H = H.map((r, i) => r.map((_, j) => (i === j ? 1 : 0))); }
    let t = 1, zn = z, fn = fz;
    for (let k = 0; k < 60; k++) { zn = z.map((v, i) => v + t * d[i]); fn = F(zn); if (fn <= fz + 1e-4 * t * slope) break; t /= 2; }
    if (!(fn < fz) && Math.abs(fn - fz) < 1e-15) { converged = true; break; }
    const gnw = G(zn), sv = zn.map((v, i) => v - z[i]), yv = gnw.map((v, i) => v - g[i]);
    const sy = sv.reduce((s, x, i) => s + x * yv[i], 0);
    if (sy > 1e-14) {
      const Hy = H.map((r) => r.reduce((s, x, k) => s + x * yv[k], 0)), yHy = yv.reduce((s, x, i) => s + x * Hy[i], 0);
      H = H.map((r, i) => r.map((h, j) => h + ((sy + yHy) * sv[i] * sv[j]) / (sy * sy) - (Hy[i] * sv[j] + sv[i] * Hy[j]) / sy));
    }
    const done = Math.abs(fz - fn) < 1e-14 * Math.max(1, Math.abs(fz));
    z = zn; fz = fn; g = gnw;
    if (done) { converged = true; break; }
  }
  const psi = psiOf(z), { values, vectors } = eigenSym(star(psi));
  const L = vectors.map((r, i) => r.slice(0, m).map((v, j) => Math.sqrt(psi[i]) * v * Math.sqrt(Math.max(values[j] - 1, 0))));
  return { L, objective: fz, iterations: iter + 1, converged };
}

/** Varimax with Kaiser normalisation (the iteration of R's varimax and factor_analyzer). */
export function varimax(L0: M, normalize = true, maxIter = 5000, tol = 1e-13): { L: M; rot: M } {
  const p = L0.length, m = L0[0].length;
  if (m < 2) return { L: L0.map((r) => r.slice()), rot: [[1]] };
  const h = L0.map((r) => Math.sqrt(r.reduce((s, x) => s + x * x, 0)) || 1);
  const X = normalize ? L0.map((r, i) => r.map((v) => v / h[i])) : L0.map((r) => r.slice());
  let Rm = zeros(m, m); for (let i = 0; i < m; i++) Rm[i][i] = 1;
  let d = 0;
  for (let it = 0; it < maxIter; it++) {
    const old = d, B = mul(X, Rm);
    const cs = B[0].map((_, j) => B.reduce((s, r) => s + r[j] ** 2, 0));
    const Z = B.map((r) => r.map((b, j) => b ** 3 - (b * cs[j]) / p));
    const Tm = mul(T(X), Z);
    // Polar factor U V' of Tm via the eigen decomposition of Tm'Tm.
    const { values, vectors } = eigenSym(mul(T(Tm), Tm));
    const inv = vectors.map((r) => r.map((v, j) => v / Math.sqrt(Math.max(values[j], 1e-300))));
    Rm = mul(Tm, mul(inv, T(vectors)));
    d = values.reduce((s, x) => s + Math.sqrt(Math.max(x, 0)), 0);
    if (d < old * (1 + tol)) break;
  }
  const out = mul(X, Rm);
  return { L: normalize ? out.map((r, i) => r.map((v) => v * h[i])) : out, rot: Rm };
}

/** Promax (power 4 by default) with Kaiser normalisation, as R's promax and factor_analyzer. Returns pattern loadings and factor correlations. */
export function promax(L0: M, power = 4): { L: M; phi: M; rot: M } {
  const m = L0[0].length;
  if (m < 2) return { L: L0.map((r) => r.slice()), phi: [[1]], rot: [[1]] };
  const h = L0.map((r) => Math.sqrt(r.reduce((s, x) => s + x * x, 0)) || 1);
  const W = L0.map((r, i) => r.map((v) => v / h[i]));
  const { L: X, rot } = varimax(W, true);
  const Y = X.map((r) => r.map((v) => v * Math.abs(v) ** (power - 1)));
  const XtXi = invSPD(mul(T(X), X))!;
  let U = mul(XtXi, mul(T(X), Y));
  const UtUi = invSPD(mul(T(U), U));
  if (!UtUi) throw new Error('Promax failed: the rotation is singular');
  const dg = UtUi.map((r, i) => Math.sqrt(r[i]));
  U = U.map((r) => r.map((v, j) => v * dg[j]));
  const Z = mul(X, U).map((r, i) => r.map((v) => v * h[i]));
  const Ui = invert(U);
  return { L: Z, phi: mul(Ui, T(Ui)), rot: mul(rot, U) };
}
/** General small matrix inverse (Gauss-Jordan with pivoting). */
function invert(A: M): M {
  const n = A.length, B = A.map((r, i) => [...r, ...r.map((_, j) => (i === j ? 1 : 0))]);
  for (let c = 0; c < n; c++) {
    let piv = c; for (let r = c + 1; r < n; r++) if (Math.abs(B[r][c]) > Math.abs(B[piv][c])) piv = r;
    [B[c], B[piv]] = [B[piv], B[c]];
    const d = B[c][c]; if (Math.abs(d) < 1e-14) throw new Error('Singular matrix');
    for (let j = 0; j < 2 * n; j++) B[c][j] /= d;
    for (let r = 0; r < n; r++) if (r !== c) { const f = B[r][c]; for (let j = 0; j < 2 * n; j++) B[r][j] -= f * B[c][j]; }
  }
  return B.map((r) => r.slice(n));
}

export type EfaOptions = { factors: number; method: 'pa' | 'ml'; rotation: 'none' | 'varimax' | 'promax'; power?: number };
export type EfaResult = {
  loadings: M; structure: M | null; phi: M | null; communalities: number[]; uniqueness: number[];
  ss: number[]; propVar: number[]; rmsr: number; heywood: number[]; converged: boolean; iterations: number;
  ml: { chi2: number; df: number; p: number; objective: number } | null;
};

/** Extract and rotate. Factors are put in order of their variance and given positive column sums. */
export function efa(R: M, n: number, o: EfaOptions): EfaResult {
  const p = R.length, m = o.factors;
  if (!(m >= 1 && m < p && Number.isInteger(m))) throw new Error(`The number of factors must be a whole number from 1 to ${p - 1}`);
  const fit = o.method === 'ml' ? maxLikelihood(R, m) : principalAxis(R, m);
  const L0 = fit.L, communalities = L0.map((r) => r.reduce((s, x) => s + x * x, 0));
  let L = L0, phi: M | null = null;
  if (m > 1 && o.rotation === 'varimax') L = varimax(L0).L;
  else if (m > 1 && o.rotation === 'promax') { const pr = promax(L0, o.power ?? 4); L = pr.L; phi = pr.phi; }
  // Order factors by sum of squared loadings, and flip signs so each column sums to a positive number.
  const ss0 = L[0].map((_, j) => L.reduce((s, r) => s + r[j] ** 2, 0));
  const ord = ss0.map((_, j) => j).sort((a, b) => ss0[b] - ss0[a]);
  const sg = ord.map((j) => (L.reduce((s, r) => s + r[j], 0) < 0 ? -1 : 1));
  L = L.map((r) => ord.map((j, k) => r[j] * sg[k]));
  if (phi) { const P = phi; phi = ord.map((a, i) => ord.map((b, j) => P[a][b] * sg[i] * sg[j])); }
  const structure = phi ? mul(L, phi) : null;
  const ss = L[0].map((_, j) => L.reduce((s, r) => s + r[j] ** 2, 0));
  // Residual correlations from the unrotated solution.
  let rr = 0;
  for (let i = 0; i < p; i++) for (let j = 0; j < p; j++) if (i !== j) rr += (R[i][j] - L0[i].reduce((s, x, k) => s + x * L0[j][k], 0)) ** 2;
  let ml: EfaResult['ml'] = null;
  if (o.method === 'ml' && 'objective' in fit) {
    const df = ((p - m) ** 2 - (p + m)) / 2, chi2 = (n - 1 - (2 * p + 5) / 6 - (2 * m) / 3) * fit.objective;
    ml = { chi2, df, p: df > 0 ? chi2Sf(chi2, df) : NaN, objective: fit.objective };
  }
  return {
    loadings: L, structure, phi, communalities, uniqueness: communalities.map((h) => 1 - h),
    ss, propVar: ss.map((s) => s / p), rmsr: Math.sqrt(rr / (p * (p - 1))),
    heywood: communalities.map((h, i) => (h >= 0.995 ? i : -1)).filter((i) => i >= 0),
    converged: fit.converged, iterations: fit.iterations, ml,
  };
}
