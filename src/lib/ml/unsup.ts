// Unsupervised learning for the ML foundations course (Module 8): k-means, silhouette, hierarchical clustering,
// PCA and simple anomaly scores. Plain TypeScript with no DOM, checked in tests/ml.mjs.
import { mean, type Rng } from './core.ts';

export const dist2 = (a: number[], b: number[]) => a.reduce((s, v, j) => s + (v - b[j]) ** 2, 0);

/** One k-means step: assign each point to its nearest centre, then move each centre to the mean of its points. */
export function kmeansStep(X: number[][], C: number[][]) {
  const lab = X.map((x) => { let b = 0, bd = Infinity; C.forEach((c, k) => { const d = dist2(x, c); if (d < bd) { bd = d; b = k; } }); return b; });
  const next = C.map((c, k) => { const mine = X.filter((_, i) => lab[i] === k); return mine.length ? c.map((_, j) => mean(mine.map((x) => x[j]))) : c.slice(); });
  return { lab, C: next, inertia: X.reduce((s, x, i) => s + dist2(x, C[lab[i]]), 0) };
}

/** k-means++ start: the first centre at random, each next one far from those already chosen. */
export function kmeansPP(X: number[][], k: number, R: Rng) {
  const C = [X[Math.floor(R.next() * X.length)].slice()];
  while (C.length < k) {
    const d = X.map((x) => Math.min(...C.map((c) => dist2(x, c)))), tot = d.reduce((a, b) => a + b, 0);
    let r = R.next() * tot, i = 0; while (i < X.length - 1 && (r -= d[i]) > 0) i++;
    C.push(X[i].slice());
  }
  return C;
}

/** Run k-means to convergence; returns labels, centres and inertia (sum of squared distances to own centre). */
export function kmeans(X: number[][], k: number, R: Rng, iters = 100) {
  let C = kmeansPP(X, k, R), lab: number[] = [];
  for (let t = 0; t < iters; t++) {
    const s = kmeansStep(X, C);
    const same = s.lab.every((v, i) => v === lab[i]); lab = s.lab; C = s.C;
    if (same) break;
  }
  const inertia = X.reduce((s, x, i) => s + dist2(x, C[lab[i]]), 0);
  return { lab, C, inertia };
}

/** Mean silhouette: for each point, (b − a) / max(a, b), with a the mean distance to its own cluster, b to the nearest other. */
export function silhouette(X: number[][], lab: number[]) {
  const ks = [...new Set(lab)]; if (ks.length < 2) return 0;
  const s = X.map((x, i) => {
    const byK = new Map<number, number[]>();
    X.forEach((y, j) => { if (j !== i) { const arr = byK.get(lab[j]) ?? []; arr.push(Math.sqrt(dist2(x, y))); byK.set(lab[j], arr); } });
    const own = byK.get(lab[i]); if (!own || !own.length) return 0;
    const a = mean(own), b = Math.min(...ks.filter((k) => k !== lab[i]).map((k) => mean(byK.get(k) ?? [Infinity])));
    return (b - a) / Math.max(a, b);
  });
  return mean(s);
}

/**
 * Agglomerative clustering: start with every point alone, repeatedly merge the two closest clusters.
 * linkage 'single' (closest pair), 'complete' (farthest pair) or 'average'. Returns the merges in order.
 */
export function agglomerate(X: number[][], linkage: 'single' | 'complete' | 'average' = 'average') {
  let clusters = X.map((_, i) => ({ id: i, members: [i] }));
  const merges: { a: number; b: number; id: number; h: number; members: number[] }[] = [];
  const d = (A: number[], B: number[]) => {
    const all = A.flatMap((i) => B.map((j) => Math.sqrt(dist2(X[i], X[j]))));
    return linkage === 'single' ? Math.min(...all) : linkage === 'complete' ? Math.max(...all) : mean(all);
  };
  let next = X.length;
  while (clusters.length > 1) {
    let bi = 0, bj = 1, bd = Infinity;
    for (let i = 0; i < clusters.length; i++) for (let j = i + 1; j < clusters.length; j++) {
      const v = d(clusters[i].members, clusters[j].members); if (v < bd) { bd = v; bi = i; bj = j; }
    }
    const m = { a: clusters[bi].id, b: clusters[bj].id, id: next++, h: bd, members: [...clusters[bi].members, ...clusters[bj].members] };
    merges.push(m);
    clusters = clusters.filter((_, k) => k !== bi && k !== bj); clusters.push({ id: m.id, members: m.members });
  }
  return merges;
}
/** Labels from cutting the merge tree into k clusters (undo the last k − 1 merges). */
export function cutTree(n: number, merges: { a: number; b: number; id: number; members: number[] }[], k: number) {
  const lab = new Array(n).fill(0);
  const keep = merges.slice(0, n - k), groups = new Map<number, number[]>();
  for (let i = 0; i < n; i++) groups.set(i, [i]);
  for (const m of keep) { groups.set(m.id, [...groups.get(m.a)!, ...groups.get(m.b)!]); groups.delete(m.a); groups.delete(m.b); }
  [...groups.values()].forEach((g, c) => g.forEach((i) => (lab[i] = c)));
  return lab;
}

/** Covariance matrix of the columns (population, after centring). */
export function covMatrix(X: number[][]) {
  const d = X[0].length, mu = Array.from({ length: d }, (_, j) => mean(X.map((x) => x[j])));
  return { mu, S: Array.from({ length: d }, (_, a) => Array.from({ length: d }, (_, b) => mean(X.map((x) => (x[a] - mu[a]) * (x[b] - mu[b]))))) };
}

/** PCA by power iteration with deflation: the top `k` directions (unit vectors) and the variance along each. */
export function pca(X: number[][], k = 2, iters = 200) {
  const { mu, S } = covMatrix(X), d = S.length;
  const A = S.map((r) => r.slice()), comps: number[][] = [], vars: number[] = [];
  for (let c = 0; c < Math.min(k, d); c++) {
    let v = Array.from({ length: d }, (_, j) => 1 + j * 0.1);
    for (let t = 0; t < iters; t++) {
      let w = A.map((r) => r.reduce((s, a, j) => s + a * v[j], 0));
      if (Math.hypot(...w) < 1e-12) w = v.slice(); // nothing left to explain: keep the direction, made orthogonal below
      for (const u of comps) { const dp = u.reduce((s, ui, j) => s + ui * w[j], 0); w = w.map((x, j) => x - dp * u[j]); }
      const n = Math.hypot(...w) || 1;
      v = w.map((x) => x / n);
    }
    const lam = v.reduce((s, vi, i) => s + vi * A[i].reduce((t, a, j) => t + a * v[j], 0), 0);
    if (v[0] < 0) v = v.map((x) => -x);
    comps.push(v); vars.push(lam);
    for (let i = 0; i < d; i++) for (let j = 0; j < d; j++) A[i][j] -= lam * v[i] * v[j];
  }
  const total = S.reduce((s, r, i) => s + r[i], 0);
  const project = (x: number[]) => comps.map((v) => v.reduce((s, vj, j) => s + vj * (x[j] - mu[j]), 0));
  return { mu, comps, vars, share: vars.map((v) => v / total), project };
}

/** z-scores of a column: how many standard deviations each value sits from the mean. */
export function zScores(xs: number[]) {
  const m = mean(xs), s = Math.sqrt(mean(xs.map((x) => (x - m) ** 2)));
  return xs.map((x) => (x - m) / (s || 1));
}

/** Anomaly score by k-nearest-neighbour distance: the mean distance to the k closest other points. */
export function knnDistance(X: number[][], q: number[], k: number, self = -1) {
  const d = X.map((x, i) => (i === self ? Infinity : Math.sqrt(dist2(x, q)))).sort((a, b) => a - b);
  return mean(d.slice(0, k));
}
