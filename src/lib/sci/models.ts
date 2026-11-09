// Small machine-learning models for tables, written to match scikit-learn's definitions: a CART decision tree
// classifier (gini or entropy), k-means with greedy k-means++ seeding, L2-regularised logistic regression (binary or
// multinomial, solved by Newton's method), and k-nearest neighbours. Plain TypeScript, no DOM; runs in a Worker.
import { rng } from './dataset.ts';
import { cellNumber, isMissing, type Table } from './dataset.ts';

export type Mat = Float64Array[];

// ---------- Preparing a table ----------
export type Prepared = { X: Mat; names: string[]; y: string[]; rows: number[]; dropped: number; encoded: string[] };
/**
 * Feature matrix from chosen columns. Number columns are used as they are; text columns become one 0/1 column per
 * value (one-hot, every value kept, as OneHotEncoder). Rows with a missing feature or target are left out.
 */
export function prepare(t: Table, features: string[], target: string | null, maxLevels = 30): Prepared {
  const fi = features.map((f) => t.head.indexOf(f)), ti = target == null ? -1 : t.head.indexOf(target);
  if (fi.some((i) => i < 0)) throw new Error('A chosen column is not in the table.');
  const keep: number[] = [];
  t.rows.forEach((r, i) => { if (fi.every((j) => !isMissing(r[j])) && (ti < 0 || !isMissing(r[ti]))) keep.push(i); });
  const names: string[] = [], cols: number[][] = [], encoded: string[] = [];
  fi.forEach((j, a) => {
    const vals = keep.map((i) => t.rows[i][j].trim());
    if (vals.every((v) => Number.isFinite(cellNumber(v)))) { names.push(features[a]); cols.push(vals.map((v) => cellNumber(v))); return; }
    const levels = [...new Set(vals)].sort();
    if (levels.length > maxLevels) throw new Error(`"${features[a]}" is text with ${levels.length} different values; leave it out (at most ${maxLevels} values can be turned into 0/1 columns).`);
    encoded.push(features[a]);
    for (const l of levels) { names.push(`${features[a]}=${l}`); cols.push(vals.map((v) => (v === l ? 1 : 0))); }
  });
  const X = keep.map((_, r) => Float64Array.from(cols, (c) => c[r]));
  return { X, names, y: ti < 0 ? [] : keep.map((i) => t.rows[i][ti].trim()), rows: keep, dropped: t.rows.length - keep.length, encoded };
}

/** Mean and SD (dividing by n, as StandardScaler) of each column; an SD of 0 is replaced by 1. */
export function fitScaler(X: Mat): { mean: number[]; sd: number[] } {
  const p = X[0]?.length ?? 0, n = X.length, mean = new Array(p).fill(0), sd = new Array(p).fill(0);
  for (const r of X) for (let j = 0; j < p; j++) mean[j] += r[j] / n;
  for (const r of X) for (let j = 0; j < p; j++) sd[j] += (r[j] - mean[j]) ** 2 / n;
  return { mean, sd: sd.map((v) => (v > 0 ? Math.sqrt(v) : 1)) };
}
export const scale = (X: Mat, s: { mean: number[]; sd: number[] }): Mat => X.map((r) => r.map((v, j) => (v - s.mean[j]) / s.sd[j]));

// ---------- Decision tree (CART) ----------
export type TreeNode = { n: number; counts: number[]; impurity: number; depth: number; feature: number; threshold: number; left: TreeNode | null; right: TreeNode | null };
export type TreeOpts = { criterion: 'gini' | 'entropy'; maxDepth: number; minSplit: number; minLeaf: number };
const impurityOf = (counts: number[], n: number, crit: 'gini' | 'entropy') => {
  if (crit === 'gini') { let s = 0; for (const c of counts) s += (c / n) ** 2; return 1 - s; }
  let h = 0; for (const c of counts) if (c > 0) { const p = c / n; h -= p * Math.log2(p); } return h;
};

/**
 * Fit a classification tree as sklearn's DecisionTreeClassifier (best splitter, thresholds midway between values).
 * When two splits are exactly as good, the first feature wins here; sklearn picks among them at random.
 */
export function fitTree(X0: Mat, y: number[], K: number, o: TreeOpts): { root: TreeNode; importance: number[]; leaves: number; depth: number } {
  // Values in single precision, as sklearn's trees store them; thresholds in double precision.
  const X = X0.map((r) => Float32Array.from(r)), p = X[0].length, imp = new Array(p).fill(0);
  let leaves = 0, depthMax = 0;
  const build = (idx: number[], depth: number): TreeNode => {
    const n = idx.length, counts = new Array(K).fill(0);
    for (const i of idx) counts[y[i]]++;
    const node: TreeNode = { n, counts, impurity: impurityOf(counts, n, o.criterion), depth, feature: -1, threshold: NaN, left: null, right: null };
    depthMax = Math.max(depthMax, depth);
    if (depth >= o.maxDepth || n < o.minSplit || n < 2 * o.minLeaf || node.impurity <= 1e-7) { leaves++; return node; }
    let best = { score: Infinity, f: -1, t: NaN, pos: -1, order: [] as number[] };
    for (let f = 0; f < p; f++) {
      const order = idx.slice().sort((a, b) => X[a][f] - X[b][f]);
      if (X[order[0]][f] === X[order[n - 1]][f]) continue;
      const lc = new Array(K).fill(0), rc = counts.slice();
      for (let i = 0; i < n - 1; i++) {
        const c = y[order[i]]; lc[c]++; rc[c]--;
        const a = X[order[i]][f], b = X[order[i + 1]][f];
        if (b <= a + 1e-7) continue; // sklearn's FEATURE_THRESHOLD: no split between equal values
        const nl = i + 1, nr = n - nl;
        if (nl < o.minLeaf || nr < o.minLeaf) continue;
        const score = nl * impurityOf(lc, nl, o.criterion) + nr * impurityOf(rc, nr, o.criterion);
        if (score < best.score - 1e-12) { let t = a / 2 + b / 2; if (t === b || !Number.isFinite(t)) t = a; best = { score, f, t, pos: nl, order }; }
      }
    }
    if (best.f < 0) { leaves++; return node; }
    imp[best.f] += n * node.impurity - best.score;
    node.feature = best.f; node.threshold = best.t;
    node.left = build(best.order.slice(0, best.pos), depth + 1);
    node.right = build(best.order.slice(best.pos), depth + 1);
    return node;
  };
  const root = build([...Array(X.length).keys()], 0);
  const tot = imp.reduce((s, v) => s + v, 0);
  return { root, importance: imp.map((v) => (tot > 0 ? v / tot : 0)), leaves, depth: depthMax };
}
export function treeLeaf(node: TreeNode, x: ArrayLike<number>): TreeNode {
  while (node.left && node.right) node = Math.fround(x[node.feature]) <= node.threshold ? node.left : node.right;
  return node;
}
export const argmax = (a: ArrayLike<number>) => { let b = 0; for (let i = 1; i < a.length; i++) if (a[i] > a[b]) b = i; return b; };
export const treePredict = (root: TreeNode, X: Mat) => X.map((x) => argmax(treeLeaf(root, x).counts));

// ---------- k-means ----------
const d2 = (a: ArrayLike<number>, b: ArrayLike<number>) => { let s = 0; for (let j = 0; j < a.length; j++) { const d = a[j] - b[j]; s += d * d; } return s; };
/** Greedy k-means++ seeding, as sklearn's _kmeans_plusplus (2 + ln k candidates per step). */
export function kmeansPP(X: Mat, k: number, r: () => number): Float64Array[] {
  const n = X.length, trials = 2 + Math.floor(Math.log(k));
  const centers = [Float64Array.from(X[Math.floor(r() * n)])];
  let closest = X.map((x) => d2(x, centers[0])), pot = closest.reduce((s, v) => s + v, 0);
  for (let c = 1; c < k; c++) {
    const cum: number[] = []; let acc = 0; for (const v of closest) cum.push((acc += v));
    let bestPot = Infinity, bestId = 0, bestD: number[] = closest;
    for (let t = 0; t < trials; t++) {
      const target = r() * pot;
      let lo = 0, hi = n - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (cum[m] < target) lo = m + 1; else hi = m; }
      const cand = Math.min(lo, n - 1), dist = X.map((x, i) => Math.min(closest[i], d2(x, X[cand])));
      const p = dist.reduce((s, v) => s + v, 0);
      if (p < bestPot) { bestPot = p; bestId = cand; bestD = dist; }
    }
    centers.push(Float64Array.from(X[bestId])); closest = bestD; pot = bestPot;
  }
  return centers;
}
export type KMeans = { centers: Float64Array[]; labels: Int32Array; inertia: number; iterations: number };
/** Lloyd's algorithm from k-means++ starts; the best of `nInit` runs (lowest inertia). Tolerance as sklearn (1e-4 × mean variance). */
export function kmeans(X: Mat, k: number, seed: number, nInit = 10, maxIter = 300): KMeans {
  const n = X.length, p = X[0].length;
  if (k < 1 || k > n) throw new Error(`k must be from 1 to the number of rows (${n}).`);
  const mu = new Array(p).fill(0); for (const x of X) for (let j = 0; j < p; j++) mu[j] += x[j] / n;
  let v = 0; for (const x of X) for (let j = 0; j < p; j++) v += (x[j] - mu[j]) ** 2 / n;
  const tol = (1e-4 * v) / p;
  const r = rng(seed);
  let best: KMeans | null = null;
  for (let run = 0; run < nInit; run++) {
    let C = kmeansPP(X, k, r), labels = new Int32Array(n), it = 0;
    for (; it < maxIter; it++) {
      for (let i = 0; i < n; i++) { let b = 0, bd = Infinity; for (let c = 0; c < k; c++) { const d = d2(X[i], C[c]); if (d < bd) { bd = d; b = c; } } labels[i] = b; }
      const sum = Array.from({ length: k }, () => new Float64Array(p)), cnt = new Array(k).fill(0);
      for (let i = 0; i < n; i++) { cnt[labels[i]]++; for (let j = 0; j < p; j++) sum[labels[i]][j] += X[i][j]; }
      const next = sum.map((v, c) => (cnt[c] ? v.map((x) => x / cnt[c]) : Float64Array.from(C[c])));
      // An empty cluster restarts at the point farthest from its own centre.
      cnt.forEach((m, c) => { if (!m) { let far = 0, fd = -1; for (let i = 0; i < n; i++) { const d = d2(X[i], C[labels[i]]); if (d > fd) { fd = d; far = i; } } next[c] = Float64Array.from(X[far]); } });
      const shift = next.reduce((a, v, c) => a + d2(v, C[c]), 0);
      C = next;
      if (shift <= tol) { it++; break; }
    }
    let inertia = 0;
    for (let i = 0; i < n; i++) { let b = 0, bd = Infinity; for (let c = 0; c < k; c++) { const d = d2(X[i], C[c]); if (d < bd) { bd = d; b = c; } } labels[i] = b; inertia += bd; }
    if (!best || inertia < best.inertia - 1e-12 * Math.max(1, inertia)) best = { centers: C, labels, inertia, iterations: it };
  }
  return best!;
}
/** Mean silhouette width (Euclidean), as sklearn.metrics.silhouette_score. */
export function silhouette(X: Mat, labels: ArrayLike<number>, k: number): number {
  const n = X.length;
  if (k < 2 || k >= n) return NaN;
  const size = new Array(k).fill(0); for (let i = 0; i < n; i++) size[labels[i]]++;
  let tot = 0;
  for (let i = 0; i < n; i++) {
    const s = new Array(k).fill(0);
    for (let j = 0; j < n; j++) if (j !== i) s[labels[j]] += Math.sqrt(d2(X[i], X[j]));
    const own = labels[i];
    if (size[own] <= 1) continue; // sklearn: 0 for a point alone in its cluster
    const a = s[own] / (size[own] - 1);
    let b = Infinity; for (let c = 0; c < k; c++) if (c !== own && size[c]) b = Math.min(b, s[c] / size[c]);
    tot += (b - a) / Math.max(a, b);
  }
  return tot / n;
}

// ---------- Logistic regression ----------
/** Solve A x = b (A symmetric positive definite) by Cholesky. */
function cholSolve(A: Float64Array[], b: Float64Array): Float64Array {
  const n = b.length, L = A.map((r) => Float64Array.from(r));
  for (let j = 0; j < n; j++) {
    let s = L[j][j]; for (let k = 0; k < j; k++) s -= L[j][k] * L[j][k];
    if (!(s > 0)) throw new Error('The model could not be fitted (the features may be exact copies of each other). Try a smaller C.');
    L[j][j] = Math.sqrt(s);
    for (let i = j + 1; i < n; i++) { let t = L[i][j]; for (let k = 0; k < j; k++) t -= L[i][k] * L[j][k]; L[i][j] = t / L[j][j]; }
  }
  const z = new Float64Array(n);
  for (let i = 0; i < n; i++) { let t = b[i]; for (let k = 0; k < i; k++) t -= L[i][k] * z[k]; z[i] = t / L[i][i]; }
  for (let i = n - 1; i >= 0; i--) { let t = z[i]; for (let k = i + 1; k < n; k++) t -= L[k][i] * z[k]; z[i] = t / L[i][i]; }
  return z;
}
export type Logistic = { W: number[][]; b: number[]; iterations: number; binary: boolean };
/**
 * L2-regularised logistic regression as sklearn's LogisticRegression(C): minimises C × (sum of log losses) + ½‖W‖²,
 * intercepts not penalised. Two classes: one coefficient vector (for the second class). More: multinomial (softmax),
 * with the intercepts summing to 0. Newton's method with a backtracking line search.
 */
export function fitLogistic(X: Mat, y: number[], K: number, C: number): Logistic {
  const n = X.length, p = X[0].length, bin = K === 2, G = bin ? 1 : K, D = G * (p + 1);
  let w = new Float64Array(D); // per class: p coefficients then the intercept
  const ix = (g: number, j: number) => g * (p + 1) + j; // j = p for the intercept
  const scores = (v: Float64Array, x: Float64Array) => { const s = new Float64Array(G); for (let g = 0; g < G; g++) { let t = v[ix(g, p)]; for (let j = 0; j < p; j++) t += v[ix(g, j)] * x[j]; s[g] = t; } return s; };
  const probs = (s: Float64Array) => {
    if (bin) return Float64Array.of(1 / (1 + Math.exp(-s[0])));
    const m = Math.max(...s), e = s.map((v) => Math.exp(v - m)), z = e.reduce((a, v) => a + v, 0); return e.map((v) => v / z);
  };
  const objective = (v: Float64Array) => {
    let f = 0;
    for (let i = 0; i < n; i++) {
      const s = scores(v, X[i]);
      if (bin) { const z = y[i] === 1 ? s[0] : -s[0]; f += z > 0 ? Math.log1p(Math.exp(-z)) : -z + Math.log1p(Math.exp(z)); }
      else { const m = Math.max(...s); let z = 0; for (const t of s) z += Math.exp(t - m); f += m + Math.log(z) - s[y[i]]; }
    }
    f *= C;
    for (let g = 0; g < G; g++) for (let j = 0; j < p; j++) f += 0.5 * v[ix(g, j)] ** 2;
    return f;
  };
  let it = 0, f = objective(w);
  for (; it < 100; it++) {
    const grad = new Float64Array(D), H = Array.from({ length: D }, () => new Float64Array(D));
    const xt = new Float64Array(p + 1);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < p; j++) xt[j] = X[i][j]; xt[p] = 1;
      const pr = probs(scores(w, X[i]));
      for (let g = 0; g < G; g++) {
        const r = pr[g] - (bin ? (y[i] === 1 ? 1 : 0) : y[i] === g ? 1 : 0);
        for (let j = 0; j <= p; j++) grad[ix(g, j)] += C * r * xt[j];
        for (let h = 0; h < G; h++) {
          const wgt = C * (bin ? pr[0] * (1 - pr[0]) : (g === h ? pr[g] : 0) - pr[g] * pr[h]);
          if (wgt === 0) continue;
          for (let j = 0; j <= p; j++) { const a = wgt * xt[j], row = H[ix(g, j)]; for (let l = 0; l <= p; l++) row[ix(h, l)] += a * xt[l]; }
        }
      }
    }
    for (let g = 0; g < G; g++) { for (let j = 0; j < p; j++) { grad[ix(g, j)] += w[ix(g, j)]; H[ix(g, j)][ix(g, j)] += 1; } H[ix(g, p)][ix(g, p)] += 1e-10 * n * C; }
    // Multinomial: adding the same amount to every intercept changes nothing; keep them centred.
    const gnorm = Math.sqrt(grad.reduce((s, v) => s + v * v, 0));
    if (gnorm < 1e-10 * Math.max(1, n * C)) break;
    const step = cholSolve(H, grad);
    let t = 1, wn = w, fn = Infinity;
    const slope = step.reduce((s, v, i) => s + v * grad[i], 0);
    for (let ls = 0; ls < 50; ls++) { wn = w.map((v, i) => v - t * step[i]); fn = objective(wn); if (fn <= f - 1e-4 * t * slope) break; t /= 2; }
    const done = Math.abs(f - fn) <= 1e-15 * Math.max(1, Math.abs(f));
    w = wn; f = fn;
    if (!bin) { let m = 0; for (let g = 0; g < G; g++) m += w[ix(g, p)] / G; for (let g = 0; g < G; g++) w[ix(g, p)] -= m; }
    if (done) { it++; break; }
  }
  const W = Array.from({ length: G }, (_, g) => Array.from({ length: p }, (_, j) => w[ix(g, j)])), b = Array.from({ length: G }, (_, g) => w[ix(g, p)]);
  return { W, b, iterations: it, binary: bin };
}
export function logisticProba(m: Logistic, x: ArrayLike<number>): number[] {
  const s = m.W.map((row, g) => row.reduce((a, v, j) => a + v * x[j], m.b[g]));
  if (m.binary) { const q = 1 / (1 + Math.exp(-s[0])); return [1 - q, q]; }
  const mx = Math.max(...s), e = s.map((v) => Math.exp(v - mx)), z = e.reduce((a, v) => a + v, 0);
  return e.map((v) => v / z);
}
export const logisticPredict = (m: Logistic, X: Mat) => X.map((x) => argmax(logisticProba(m, x)));

// ---------- k-nearest neighbours ----------
export type KnnOpts = { k: number; metric: 'euclidean' | 'manhattan'; weights: 'uniform' | 'distance' };
/** Predict each row of Xq from the k nearest training rows (nearer rows first, then the earlier row). */
export function knnPredict(Xt: Mat, yt: number[], K: number, Xq: Mat, o: KnnOpts, skipSelf = false): number[] {
  const n = Xt.length, k = Math.min(o.k, n - (skipSelf ? 1 : 0));
  const dist = o.metric === 'manhattan' ? (a: ArrayLike<number>, b: ArrayLike<number>) => { let s = 0; for (let j = 0; j < a.length; j++) s += Math.abs(a[j] - b[j]); return s; } : (a: ArrayLike<number>, b: ArrayLike<number>) => Math.sqrt(d2(a, b));
  return Xq.map((x, qi) => {
    const best: [number, number][] = []; // [distance, index], sorted, at most k
    for (let i = 0; i < n; i++) {
      if (skipSelf && i === qi) continue;
      const d = dist(x, Xt[i]);
      if (best.length < k || d < best[best.length - 1][0]) {
        let p = best.length; while (p > 0 && best[p - 1][0] > d) p--;
        best.splice(p, 0, [d, i]); if (best.length > k) best.pop();
      }
    }
    const votes = new Array(K).fill(0);
    if (o.weights === 'distance' && best.some(([d]) => d === 0)) { for (const [d, i] of best) if (d === 0) votes[yt[i]] += 1; }
    else for (const [d, i] of best) votes[yt[i]] += o.weights === 'distance' ? 1 / d : 1;
    return argmax(votes);
  });
}

/** Made-up example: 150 seedlings of three made-up varieties, with leaf length and width, height and a soil type. */
export const EXAMPLE = (() => {
  const r = rng(569), rows = ['leaf_length_mm,leaf_width_mm,height_cm,soil,variety'];
  const g = () => { let u = 0; for (let i = 0; i < 12; i++) u += r(); return u - 6; };
  const V: [string, number, number, number][] = [['Amber', 52, 21, 14], ['Birch', 63, 28, 19], ['Cedar', 70, 25, 24]];
  for (let i = 0; i < 150; i++) {
    const [name, l, w, h] = V[i % 3];
    const soil = r() < (name === 'Cedar' ? 0.7 : 0.35) ? 'clay' : 'sand';
    rows.push(`${(l + 5 * g()).toFixed(1)},${(w + 3 * g()).toFixed(1)},${(h + 3.5 * g() + (soil === 'clay' ? 1 : 0)).toFixed(1)},${soil},${name}`);
  }
  return rows.join('\n');
})();
