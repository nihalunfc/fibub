// Models for the ML foundations simulations (Modules 3 and 4): least squares in matrix form, polynomial,
// ridge and lasso fits, logistic regression, classification scores, ROC and AUC, k-nearest neighbours and
// naive Bayes. Plain maths, no DOM; checked by tests/ml.mjs.
import { mean, sum } from './core.ts';

/** Solve A·x = b by Gaussian elimination with partial pivoting. A is n×n. Returns null if A is singular. */
export function solve(A: number[][], b: number[]): number[] | null {
  const n = b.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (Math.abs(M[p][c]) < 1e-12) return null;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = M[r][c] / M[c][c];
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
    }
  }
  return M.map((r, i) => r[n] / r[i]);
}

/**
 * Least squares for ŷ = Xw (put a column of 1s in X for the intercept), by the normal equation
 * (XᵀX + λI)w = Xᵀy. λ > 0 is ridge regression; `skip` is a column not penalised (the intercept).
 */
export function leastSquares(X: number[][], y: number[], lambda = 0, skip = 0): number[] {
  const d = X[0].length, A = Array.from({ length: d }, () => new Array(d).fill(0)), b = new Array(d).fill(0);
  for (let i = 0; i < X.length; i++) for (let j = 0; j < d; j++) { b[j] += X[i][j] * y[i]; for (let k = 0; k < d; k++) A[j][k] += X[i][j] * X[i][k]; }
  for (let j = 0; j < d; j++) if (j !== skip) A[j][j] += lambda;
  return solve(A, b) ?? new Array(d).fill(0);
}

/** Powers 1, x, x², … x^deg (x is first scaled by `scale` so high powers stay sensible). */
export const polyRow = (x: number, deg: number, scale = 1) => Array.from({ length: deg + 1 }, (_, k) => (x / scale) ** k);
export function polyFit(xs: number[], ys: number[], deg: number, lambda = 0, scale = 1) {
  const w = leastSquares(xs.map((x) => polyRow(x, deg, scale)), ys, lambda, 0);
  return { w, f: (x: number) => sum(polyRow(x, deg, scale).map((v, k) => v * w[k])) };
}

/**
 * Lasso by coordinate descent: minimise (1/2n)·Σ(y − Xw)² + λ·Σ|w_j| (column `skip`, the intercept, not
 * penalised). Columns other than the intercept should be standardised first.
 */
export function lasso(X: number[][], y: number[], lambda: number, iters = 300, skip = 0) {
  const n = X.length, d = X[0].length, w = new Array(d).fill(0);
  const r = y.slice();
  const colSq = Array.from({ length: d }, (_, j) => sum(X.map((row) => row[j] * row[j])) / n);
  for (let it = 0; it < iters; it++) {
    for (let j = 0; j < d; j++) {
      if (colSq[j] === 0) continue;
      let rho = 0; for (let i = 0; i < n; i++) rho += X[i][j] * (r[i] + X[i][j] * w[j]);
      rho /= n;
      const nw = j === skip ? rho / colSq[j] : Math.sign(rho) * Math.max(0, Math.abs(rho) - lambda) / colSq[j];
      const dw = nw - w[j];
      if (dw !== 0) { for (let i = 0; i < n; i++) r[i] -= X[i][j] * dw; w[j] = nw; }
    }
  }
  return w;
}

export const sigmoid = (z: number) => (z >= 0 ? 1 / (1 + Math.exp(-z)) : Math.exp(z) / (1 + Math.exp(z)));
/** Log-loss (binary cross-entropy) of one prediction p for a true label y (0 or 1). */
export const logLoss1 = (y: number, p: number) => { const q = Math.min(1 - 1e-12, Math.max(1e-12, p)); return -(y * Math.log(q) + (1 - y) * Math.log(1 - q)); };
export const logLoss = (ys: number[], ps: number[]) => mean(ys.map((y, i) => logLoss1(y, ps[i])));

/**
 * Logistic regression p = σ(w·x + b) by gradient descent on the mean log-loss (with an optional L2 penalty).
 * The gradient is (1/n)·Σ (p − y)·x, the same shape as for linear regression.
 */
export function logisticStep(X: number[][], y: number[], w: number[], b: number, rate: number, l2 = 0) {
  const n = X.length, gw = new Array(w.length).fill(0); let gb = 0;
  for (let i = 0; i < n; i++) {
    const e = sigmoid(X[i].reduce((s, v, j) => s + v * w[j], b)) - y[i];
    for (let j = 0; j < w.length; j++) gw[j] += (e * X[i][j]) / n;
    gb += e / n;
  }
  return { w: w.map((v, j) => v - rate * (gw[j] + l2 * v)), b: b - rate * gb };
}
export function logisticFit(X: number[][], y: number[], iters = 2000, rate = 0.5, l2 = 0) {
  let w = new Array(X[0].length).fill(0), b = 0;
  for (let t = 0; t < iters; t++) ({ w, b } = logisticStep(X, y, w, b, rate, l2));
  return { w, b, p: (x: number[]) => sigmoid(x.reduce((s, v, j) => s + v * w[j], b)) };
}

/** Confusion counts and the usual scores for a threshold on predicted scores. */
export function confusion(ys: number[], scores: number[], t: number) {
  let tp = 0, fp = 0, tn = 0, fn = 0;
  ys.forEach((y, i) => { const p = scores[i] >= t ? 1 : 0; if (p && y) tp++; else if (p) fp++; else if (y) fn++; else tn++; });
  const precision = tp + fp ? tp / (tp + fp) : NaN, recall = tp + fn ? tp / (tp + fn) : NaN;
  return { tp, fp, tn, fn, accuracy: (tp + tn) / ys.length, precision, recall,
    f1: precision + recall ? (2 * precision * recall) / (precision + recall) : NaN, fpr: fp + tn ? fp / (fp + tn) : NaN };
}
/** ROC curve points (false positive rate, true positive rate) from the highest threshold down, and the area under it. */
export function roc(ys: number[], scores: number[]) {
  const idx = scores.map((s, i) => i).sort((a, b) => scores[b] - scores[a]);
  const P = ys.filter((y) => y).length, N = ys.length - P;
  const pts: [number, number][] = [[0, 0]]; let tp = 0, fp = 0;
  for (let k = 0; k < idx.length; k++) {
    if (ys[idx[k]]) tp++; else fp++;
    if (k === idx.length - 1 || scores[idx[k + 1]] !== scores[idx[k]]) pts.push([fp / N, tp / P]);
  }
  let auc = 0; for (let k = 1; k < pts.length; k++) auc += (pts[k][0] - pts[k - 1][0]) * (pts[k][1] + pts[k - 1][1]) / 2;
  return { pts, auc };
}

/** k-nearest neighbours: the share of class 1 among the k closest training points (ties in distance by order). */
export function knnScore(X: number[][], y: number[], q: number[], k: number) {
  const d = X.map((x, i) => ({ i, d: x.reduce((s, v, j) => s + (v - q[j]) ** 2, 0) })).sort((a, b) => a.d - b.d).slice(0, k);
  return { score: mean(d.map((o) => y[o.i])), near: d.map((o) => o.i) };
}

/** Multinomial naive Bayes on word lists, with add-one (Laplace) smoothing. Returns P(class 1 | words). */
export function naiveBayes(docs: string[][], labels: number[]) {
  const vocab = new Set(docs.flat()), V = vocab.size;
  const count = [new Map<string, number>(), new Map<string, number>()], total = [0, 0], nDocs = [0, 0];
  docs.forEach((d, i) => { const c = labels[i]; nDocs[c]++; for (const w of d) { count[c].set(w, (count[c].get(w) ?? 0) + 1); total[c]++; } });
  const prior = [nDocs[0] / docs.length, nDocs[1] / docs.length];
  const pWord = (w: string, c: number) => ((count[c].get(w) ?? 0) + 1) / (total[c] + V);
  const predict = (words: string[]) => {
    const known = words.filter((w) => vocab.has(w));
    const lp = [0, 1].map((c) => Math.log(prior[c]) + sum(known.map((w) => Math.log(pWord(w, c)))));
    const m = Math.max(...lp), e = lp.map((v) => Math.exp(v - m));
    return { p: e[1] / (e[0] + e[1]), logs: lp, known };
  };
  return { prior, pWord, predict, vocab };
}
