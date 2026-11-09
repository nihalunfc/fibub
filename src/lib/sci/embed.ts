// Embeddings for small tables: principal component analysis (as sklearn.decomposition.PCA, with its sign rule) and
// exact t-SNE (as sklearn.manifold.TSNE(method='exact'): perplexity search, early exaggeration, momentum and gains),
// plus trustworthiness and neighbour preservation to judge an embedding. Plain TypeScript, no DOM.
import { rng } from './dataset.ts';

export type Mat = Float64Array[];

/** Eigenvalues and eigenvectors of a symmetric matrix (cyclic Jacobi), largest first; vectors are columns of V. */
export function eigSym(A0: number[][]): { values: number[]; vectors: number[][] } {
  const n = A0.length, A = A0.map((r) => r.slice()), V = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] ** 2;
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(A[p][q]) < 1e-300) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const a = A[k][p], b = A[k][q]; A[k][p] = c * a - s * b; A[k][q] = s * a + c * b; }
      for (let k = 0; k < n; k++) { const a = A[p][k], b = A[q][k]; A[p][k] = c * a - s * b; A[q][k] = s * a + c * b; }
      for (let k = 0; k < n; k++) { const a = V[k][p], b = V[k][q]; V[k][p] = c * a - s * b; V[k][q] = s * a + c * b; }
    }
  }
  const order = A.map((_, i) => i).sort((a, b) => A[b][b] - A[a][a]);
  return { values: order.map((i) => A[i][i]), vectors: V.map((r) => order.map((i) => r[i])) };
}

export type PCA = { mean: number[]; sd: number[] | null; components: number[][]; variance: number[]; ratio: number[]; scores: number[][] };
/**
 * PCA by the eigen-decomposition of the covariance matrix. Explained variance divides by n − 1, as sklearn. Each
 * component's sign is set so its largest loading (in absolute value) is positive, as sklearn's svd_flip.
 * With `standardise`, columns are first divided by their SD (n − 1), giving a correlation-matrix PCA.
 */
export function pca(X: Mat, standardise: boolean, nComp = Math.min(X.length, X[0].length)): PCA {
  const n = X.length, p = X[0].length;
  const mean = new Array(p).fill(0); for (const r of X) for (let j = 0; j < p; j++) mean[j] += r[j] / n;
  let sd: number[] | null = null;
  if (standardise) { sd = new Array(p).fill(0); for (const r of X) for (let j = 0; j < p; j++) sd[j] += (r[j] - mean[j]) ** 2 / (n - 1); sd = sd.map((v, j) => (Math.sqrt(v) > 1e-12 * Math.max(1, Math.abs(mean[j])) ? Math.sqrt(v) : 1)); } // a constant column (up to rounding) is left as it is
  const Z = X.map((r) => Array.from(r, (v, j) => (v - mean[j]) / (sd ? sd[j] : 1)));
  const C = Array.from({ length: p }, () => new Array(p).fill(0));
  for (const r of Z) for (let a = 0; a < p; a++) { const ra = r[a]; if (ra) for (let b = a; b < p; b++) C[a][b] += ra * r[b]; }
  for (let a = 0; a < p; a++) for (let b = a; b < p; b++) { C[a][b] /= n - 1; C[b][a] = C[a][b]; }
  const { values, vectors } = eigSym(C);
  const k = Math.min(nComp, p, n);
  const components = Array.from({ length: k }, (_, c) => {
    const v = vectors.map((r) => r[c]);
    let big = 0; v.forEach((x, j) => { if (Math.abs(x) > Math.abs(v[big])) big = j; });
    return v[big] < 0 ? v.map((x) => -x) : v;
  });
  const total = values.reduce((s, v) => s + Math.max(0, v), 0);
  const variance = values.slice(0, k).map((v) => Math.max(0, v));
  return { mean, sd, components, variance, ratio: variance.map((v) => (total > 0 ? v / total : 0)), scores: Z.map((r) => components.map((c) => c.reduce((s, w, j) => s + w * r[j], 0))) };
}

const EPS = 2.220446049250313e-16; // numpy's machine epsilon, sklearn's floor for P and Q
const sqd = (a: ArrayLike<number>, b: ArrayLike<number>) => { let s = 0; for (let j = 0; j < a.length; j++) { const d = a[j] - b[j]; s += d * d; } return s; };

/**
 * Joint probabilities P of t-SNE: for each row, a Gaussian over squared distances whose entropy matches log(perplexity)
 * (binary search on its precision, as sklearn's _binary_search_perplexity), then P = (P + Pᵀ) / sum. Returned full n × n.
 */
export function jointP(X: Mat, perplexity: number): Float64Array[] {
  const n = X.length, P = Array.from({ length: n }, () => new Float64Array(n));
  const D = X.map((a) => Float64Array.from(X, (b) => sqd(a, b)));
  const target = Math.log(perplexity);
  for (let i = 0; i < n; i++) {
    let beta = 1, lo = -Infinity, hi = Infinity, sumP = 0;
    for (let step = 0; step < 100; step++) {
      sumP = 0;
      for (let j = 0; j < n; j++) { const v = j === i ? 0 : Math.exp(-D[i][j] * beta); P[i][j] = v; sumP += v; }
      if (sumP === 0) sumP = 1e-8;
      let sumDP = 0; for (let j = 0; j < n; j++) { P[i][j] /= sumP; sumDP += D[i][j] * P[i][j]; }
      const H = Math.log(sumP) + beta * sumDP, diff = H - target;
      if (Math.abs(diff) <= 1e-5) break;
      if (diff > 0) { lo = beta; beta = hi === Infinity ? beta * 2 : (beta + hi) / 2; }
      else { hi = beta; beta = lo === -Infinity ? beta / 2 : (beta + lo) / 2; }
    }
  }
  let tot = 0;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const v = P[i][j] + P[j][i]; P[i][j] = P[j][i] = v; tot += 2 * v; }
  tot = Math.max(tot, 1e-300);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) P[i][j] = i === j ? 0 : Math.max(P[i][j] / tot, EPS);
  return P;
}

/** KL divergence of a two-dimensional embedding Y and its gradient (Student t, one degree of freedom), as sklearn's exact t-SNE. */
let wBuf = new Float64Array(0);
export function klGrad(P: Float64Array[], Y: Mat, grad?: Mat, withKl = true): number {
  const n = Y.length;
  if (wBuf.length < n * n) wBuf = new Float64Array(n * n); // reused between steps
  const W = wBuf;
  let sum = 0;
  for (let i = 0; i < n; i++) { const a0 = Y[i][0], a1 = Y[i][1]; for (let j = i + 1; j < n; j++) { const d0 = a0 - Y[j][0], d1 = a1 - Y[j][1], w = 1 / (1 + d0 * d0 + d1 * d1); W[i * n + j] = w; sum += 2 * w; } }
  let kl = NaN;
  if (withKl) { kl = 0; for (let i = 0; i < n; i++) { const Pi = P[i]; for (let j = i + 1; j < n; j++) { const p = Pi[j], q = Math.max(W[i * n + j] / sum, EPS); kl += 2 * p * Math.log(Math.max(p, EPS) / q); } } }
  if (grad) {
    for (const g of grad) g.fill(0);
    // Each pair once: its force on i and the opposite force on j.
    for (let i = 0; i < n; i++) {
      const Pi = P[i], yi = Y[i], gi = grad[i]; let g0 = 0, g1 = 0;
      for (let j = i + 1; j < n; j++) {
        const w = W[i * n + j], q = w / sum, m = 4 * (Pi[j] - (q > EPS ? q : EPS)) * w, yj = Y[j], f0 = m * (yi[0] - yj[0]), f1 = m * (yi[1] - yj[1]);
        g0 += f0; g1 += f1; grad[j][0] -= f0; grad[j][1] -= f1;
      }
      gi[0] += g0; gi[1] += g1;
    }
  }
  return kl;
}

export type TsneOpts = { perplexity: number; iterations: number; init: 'pca' | 'random'; seed: number; earlyExaggeration?: number; learningRate?: number | 'auto' };
/** Exact t-SNE into two dimensions, as sklearn.manifold.TSNE(method='exact'). `progress` is called every 50 steps. */
export function tsne(X: Mat, o: TsneOpts, progress?: (iter: number, kl: number) => void): { Y: number[][]; kl: number; iterations: number } {
  const n = X.length;
  if (n < 4) throw new Error('t-SNE needs at least 4 rows.');
  if (!(o.perplexity > 0 && o.perplexity < n)) throw new Error(`The perplexity must be above 0 and below the number of rows (${n}).`);
  const ee = o.earlyExaggeration ?? 12, lr = o.learningRate == null || o.learningRate === 'auto' ? Math.max(n / ee / 4, 50) : o.learningRate;
  const P = jointP(X, o.perplexity);
  let Y: Mat;
  if (o.init === 'pca') {
    const s = pca(X, false, 2).scores, sd0 = Math.sqrt(s.reduce((a, r) => a + r[0] ** 2, 0) / n - (s.reduce((a, r) => a + r[0], 0) / n) ** 2) || 1;
    Y = s.map((r) => Float64Array.from([r[0], r[1] ?? 0], (v) => (v / sd0) * 1e-4));
  } else { const r = rng(o.seed); const g = () => { let u = 0; for (let i = 0; i < 12; i++) u += r(); return u - 6; }; Y = X.map(() => Float64Array.from([g() * 1e-4, g() * 1e-4])); }
  const update = Y.map(() => new Float64Array(2)), gains = Y.map(() => Float64Array.from([1, 1])), grad = Y.map(() => new Float64Array(2));
  const total = Math.max(250, o.iterations);
  let kl = 0, it = 0;
  const run = (from: number, to: number, momentum: number, noProgress: number) => {
    let best = Infinity, bestIt = from;
    for (let i = from; i < to; i++) {
      // The error is only needed at the checks (every 50 steps) and at the end, as in sklearn.
      const check = (i + 1) % 50 === 0 || i === to - 1;
      const e = klGrad(P, Y, grad, check); if (check) kl = e;
      let gn = 0;
      for (let a = 0; a < n; a++) for (let d = 0; d < 2; d++) {
        const inc = update[a][d] * grad[a][d] < 0;
        gains[a][d] = Math.max(0.01, inc ? gains[a][d] + 0.2 : gains[a][d] * 0.8);
        const g = grad[a][d] * gains[a][d]; gn += g * g;
        update[a][d] = momentum * update[a][d] - lr * g; Y[a][d] += update[a][d];
      }
      it = i + 1;
      if ((i + 1) % 50 === 0) {
        progress?.(i + 1, kl);
        if (kl < best) { best = kl; bestIt = i; } else if (i - bestIt > noProgress) break;
        if (Math.sqrt(gn) <= 1e-7) break;
      }
    }
  };
  for (const r of P) for (let j = 0; j < n; j++) r[j] *= ee;
  run(0, 250, 0.5, 250);
  for (const r of P) for (let j = 0; j < n; j++) r[j] /= ee;
  run(it, total, 0.8, 300);
  // kl is the value at the last step, before its update, as sklearn reports kl_divergence_.
  return { Y: Y.map((r) => Array.from(r)), kl, iterations: it };
}

/** Ranks of every point's neighbours by distance (nearest first), ties by index. */
function neighbourOrder(X: ArrayLike<ArrayLike<number>>, i: number): number[] {
  const n = X.length, d = Array.from({ length: n }, (_, j) => sqd(X[i], X[j]));
  return d.map((_, j) => j).filter((j) => j !== i).sort((a, b) => d[a] - d[b] || a - b);
}
/** Trustworthiness of an embedding (Venna and Kaski), as sklearn.manifold.trustworthiness: 1 means no false neighbours. */
export function trustworthiness(X: ArrayLike<ArrayLike<number>>, Y: ArrayLike<ArrayLike<number>>, k = 5): number {
  const n = X.length;
  let t = 0;
  for (let i = 0; i < n; i++) {
    const rx = neighbourOrder(X, i), rank = new Map(rx.map((j, r) => [j, r + 1]));
    for (const j of neighbourOrder(Y, i).slice(0, k)) t += Math.max(0, rank.get(j)! - k);
  }
  return 1 - (2 / (n * k * (2 * n - 3 * k - 1))) * t;
}
/** Share of each point's k nearest neighbours in the data that are also among its k nearest in the embedding. */
export function neighbourKeep(X: ArrayLike<ArrayLike<number>>, Y: ArrayLike<ArrayLike<number>>, k = 10): number {
  const n = X.length; let s = 0;
  for (let i = 0; i < n; i++) { const a = new Set(neighbourOrder(X, i).slice(0, k)); s += neighbourOrder(Y, i).slice(0, k).filter((j) => a.has(j)).length / k; }
  return s / n;
}

/** Made-up example: 120 sensor readings from four machines, 6 measurements each. */
export const EXAMPLE = (() => {
  const r = rng(572), g = () => { let u = 0; for (let i = 0; i < 12; i++) u += r(); return u - 6; };
  const rows = ['machine,temp_c,vibration_mm_s,current_a,noise_db,pressure_kpa,speed_rpm'];
  const M: [string, number[]][] = [['Press A', [62, 2.1, 14, 71, 410, 1450]], ['Press B', [66, 3.4, 15, 74, 395, 1480]], ['Lathe', [48, 1.2, 9, 66, 300, 2900]], ['Pump', [55, 4.6, 21, 79, 520, 1750]]];
  const spread = [2.5, 0.45, 1.2, 1.8, 18, 40];
  for (let i = 0; i < 120; i++) {
    const [name, mu] = M[i % 4], load = g();
    rows.push([name, ...mu.map((m, j) => (m + spread[j] * (0.8 * g() + 0.6 * load * (j < 4 ? 1 : 0.5))).toFixed(j === 1 ? 2 : j === 5 ? 0 : 1))].join(','));
  }
  return rows.join('\n');
})();
