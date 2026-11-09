// Community ordination and clustering for a species-by-site table: transforms (Hellinger etc.), PCA, NMDS on
// Bray-Curtis (or another distance) with Kruskal stress-1 and a Shepard plot, and agglomerative clustering
// (UPGMA, Ward, single, complete) with the cophenetic correlation. Plain TypeScript, no DOM.

export type Transform = 'none' | 'sqrt' | 'relative' | 'hellinger';
export type DistKind = 'bray' | 'euclid';
export type Linkage = 'average' | 'ward' | 'single' | 'complete';

/** Rows are sites (objects), columns species. */
export function transform(X: number[][], t: Transform): number[][] {
  return X.map((r) => {
    const s = r.reduce((a, b) => a + b, 0);
    if (t === 'sqrt') return r.map((v) => Math.sqrt(v));
    if (t === 'relative') return r.map((v) => (s > 0 ? v / s : 0));
    if (t === 'hellinger') return r.map((v) => (s > 0 ? Math.sqrt(v / s) : 0));
    return r.slice();
  });
}

/** Full distance matrix between rows. */
export function distances(X: number[][], kind: DistKind): number[][] {
  const n = X.length, D = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    let v = 0;
    if (kind === 'bray') { let num = 0, den = 0; for (let k = 0; k < X[i].length; k++) { num += Math.abs(X[i][k] - X[j][k]); den += X[i][k] + X[j][k]; } v = den > 0 ? num / den : 0; }
    else { let s = 0; for (let k = 0; k < X[i].length; k++) s += (X[i][k] - X[j][k]) ** 2; v = Math.sqrt(s); }
    D[i][j] = D[j][i] = v;
  }
  return D;
}

/** Eigen-decomposition of a symmetric matrix by cyclic Jacobi rotations. Values sorted largest first;
 *  vectors[k] is the unit eigenvector for values[k]. */
export function symEigen(A: number[][]): { values: number[]; vectors: number[][] } {
  const n = A.length, a = A.map((r) => r.slice()), v = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0, tot = 0;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { if (i !== j) off += a[i][j] ** 2; tot += a[i][j] ** 2; }
    if (off <= 1e-22 * Math.max(tot, 1e-300)) break;
    for (let p = 0; p < n - 1; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(a[p][q]) < 1e-300) continue;
      const th = (a[q][q] - a[p][p]) / (2 * a[p][q]);
      const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const akp = a[k][p], akq = a[k][q]; a[k][p] = c * akp - s * akq; a[k][q] = s * akp + c * akq; }
      for (let k = 0; k < n; k++) { const apk = a[p][k], aqk = a[q][k]; a[p][k] = c * apk - s * aqk; a[q][k] = s * apk + c * aqk; }
      for (let k = 0; k < n; k++) { const vkp = v[k][p], vkq = v[k][q]; v[k][p] = c * vkp - s * vkq; v[k][q] = s * vkp + c * vkq; }
    }
  }
  const idx = Array.from({ length: n }, (_, i) => i).sort((x, y) => a[y][y] - a[x][x]);
  return { values: idx.map((i) => a[i][i]), vectors: idx.map((i) => v.map((r) => r[i])) };
}

/** Sign so the largest-magnitude element is positive (a fixed, repeatable choice). */
function fixSign(u: number[]) { let m = 0; for (const x of u) if (Math.abs(x) > Math.abs(m)) m = x; return m < 0 ? u.map((x) => -x) : u; }

export type Pca = { scores: number[][]; loadings: number[][]; eig: number[]; explained: number[]; total: number };
/** PCA on the covariance matrix (columns centred). scores[i][k] = site i on axis k (distance-preserving,
 *  "scaling 1"); loadings[j][k] = species j's unit eigenvector element. eig = variances (divisor n − 1). */
export function pca(X: number[][], axes = 4): Pca {
  const n = X.length, p = X[0].length;
  const mean = Array.from({ length: p }, (_, j) => X.reduce((s, r) => s + r[j], 0) / n);
  const C = X.map((r) => r.map((v, j) => v - mean[j]));
  const G = C.map((ri) => C.map((rj) => ri.reduce((s, v, k) => s + v * rj[k], 0)));
  const { values, vectors } = symEigen(G);
  const total = values.reduce((s, v) => s + Math.max(0, v), 0);
  const K = Math.min(axes, n - 1, p);
  const scores = Array.from({ length: n }, () => [] as number[]), loadings = Array.from({ length: p }, () => [] as number[]), eig: number[] = [], explained: number[] = [];
  for (let k = 0; k < K; k++) {
    const lam = Math.max(0, values[k]);
    let u = vectors[k];
    // Species loading = Cᵀu / √λ; fix the sign on the loadings so the result does not depend on the eigen solver.
    let w = Array.from({ length: p }, (_, j) => (lam > 0 ? C.reduce((s, r, i) => s + r[j] * u[i], 0) / Math.sqrt(lam) : 0));
    const f = fixSign(w); if (f !== w) { u = u.map((x) => -x); w = f; }
    for (let i = 0; i < n; i++) scores[i].push(u[i] * Math.sqrt(lam));
    for (let j = 0; j < p; j++) loadings[j].push(w[j]);
    eig.push(lam / (n - 1)); explained.push(total > 0 ? lam / total : 0);
  }
  return { scores, loadings, eig, explained, total: total / (n - 1) };
}

/** Classical scaling (PCoA) of a distance matrix, first `k` axes. */
export function pcoa(D: number[][], k = 2): number[][] {
  const n = D.length, A = D.map((r) => r.map((d) => -0.5 * d * d));
  const rm = A.map((r) => r.reduce((s, v) => s + v, 0) / n), gm = rm.reduce((s, v) => s + v, 0) / n;
  const B = A.map((r, i) => r.map((v, j) => v - rm[i] - rm[j] + gm));
  const { values, vectors } = symEigen(B);
  return Array.from({ length: n }, (_, i) => Array.from({ length: k }, (_, a) => vectors[a][i] * Math.sqrt(Math.max(0, values[a]))));
}

/** Pool-adjacent-violators: the non-decreasing least-squares fit to y (equal weights). */
export function pava(y: number[]): number[] {
  const v: number[] = [], w: number[] = [], len: number[] = [];
  for (const x of y) {
    v.push(x); w.push(1); len.push(1);
    while (v.length > 1 && v[v.length - 2] > v[v.length - 1]) {
      const b = v.pop()!, wb = w.pop()!, lb = len.pop()!, a = v.pop()!, wa = w.pop()!, la = len.pop()!;
      v.push((a * wa + b * wb) / (wa + wb)); w.push(wa + wb); len.push(la + lb);
    }
  }
  const out: number[] = [];
  v.forEach((x, k) => { for (let i = 0; i < len[k]; i++) out.push(x); });
  return out;
}

function confDist(Y: number[][]) {
  const n = Y.length, d = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { let s = 0; for (let k = 0; k < Y[i].length; k++) s += (Y[i][k] - Y[j][k]) ** 2; d[i][j] = d[j][i] = Math.sqrt(s); }
  return d;
}

/** Kruskal stress-1 of configuration Y against dissimilarities D, with the monotone fit (primary approach to ties:
 *  tied dissimilarities may get different fitted values). Returns the pairs in order of dissimilarity. */
export function stress1(D: number[][], Y: number[][]) {
  const n = D.length, d = confDist(Y), pairs: { i: number; j: number; delta: number; d: number; fit: number }[] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) pairs.push({ i, j, delta: D[i][j], d: d[i][j], fit: 0 });
  pairs.sort((a, b) => a.delta - b.delta || a.d - b.d);
  const f = pava(pairs.map((p) => p.d));
  let num = 0, den = 0;
  pairs.forEach((p, k) => { p.fit = f[k]; num += (p.d - f[k]) ** 2; den += p.d ** 2; });
  return { stress: den > 0 ? Math.sqrt(num / den) : 0, pairs };
}

/** A small repeatable random number generator (mulberry32). */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** One non-metric SMACOF run from a start configuration. */
function smacof(D: number[][], Y0: number[][], maxIter: number, tol: number) {
  const n = D.length, k = Y0[0].length;
  let Y = Y0.map((r) => r.slice()), prev = Infinity, s = stress1(D, Y), iter = 0;
  for (; iter < maxIter; iter++) {
    const d = confDist(Y), dh = Array.from({ length: n }, () => new Array(n).fill(0));
    for (const p of s.pairs) { dh[p.i][p.j] = dh[p.j][p.i] = p.fit; }
    // Scale the disparities so their sum of squares equals that of the distances (stress-1 is scale free).
    let sd = 0, sh = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { sd += d[i][j] ** 2; sh += dh[i][j] ** 2; }
    const sc = sh > 0 ? Math.sqrt(sd / sh) : 1;
    const Z = Array.from({ length: n }, () => new Array(k).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const b = d[i][j] > 1e-12 ? (sc * dh[i][j]) / d[i][j] : 0;
        for (let a = 0; a < k; a++) Z[i][a] += b * (Y[i][a] - Y[j][a]);
      }
      for (let a = 0; a < k; a++) Z[i][a] /= n;
    }
    Y = Z;
    s = stress1(D, Y);
    if (prev - s.stress < tol) { iter++; break; }
    prev = s.stress;
  }
  return { Y, stress: s.stress, pairs: s.pairs, iter };
}

export type Nmds = { Y: number[][]; stress: number; pairs: { i: number; j: number; delta: number; d: number; fit: number }[]; starts: number; sameBest: number; iter: number };
/** NMDS in k dimensions: a PCoA start plus `tries` random starts; the lowest stress wins. The result is centred
 *  and rotated to its principal axes, so axis 1 holds the most spread (as vegan's metaMDS does). */
export function nmds(D: number[][], k = 2, tries = 20, seed = 1): Nmds {
  const n = D.length, r = rng(seed);
  const starts: number[][][] = [pcoa(D, k)];
  for (let t = 0; t < tries; t++) starts.push(Array.from({ length: n }, () => Array.from({ length: k }, () => r() - 0.5)));
  const runs = starts.map((Y0) => smacof(D, Y0, 500, 1e-9));
  runs.sort((a, b) => a.stress - b.stress);
  const best = runs[0];
  const sameBest = runs.filter((x) => x.stress - best.stress < 1e-3).length;
  // Centre and rotate to principal axes.
  const m = Array.from({ length: k }, (_, a) => best.Y.reduce((s, y) => s + y[a], 0) / n);
  const C = best.Y.map((y) => y.map((v, a) => v - m[a]));
  const cov = Array.from({ length: k }, (_, a) => Array.from({ length: k }, (_, b) => C.reduce((s, y) => s + y[a] * y[b], 0)));
  const { vectors } = symEigen(cov);
  const Y = C.map((y) => vectors.map((v) => { const u = fixSign(v); return y.reduce((s, x, a) => s + x * u[a], 0); }));
  const fin = stress1(D, Y);
  return { Y, stress: fin.stress, pairs: fin.pairs, starts: runs.length, sameBest, iter: best.iter };
}

/** Agglomerative clustering on a distance matrix, scipy-style linkage rows [a, b, height, size] (leaves 0..n−1,
 *  the cluster made at row k is n + k). Ward uses the Lance-Williams update of scipy's "ward" (R's ward.D2). */
export function cluster(D: number[][], method: Linkage): number[][] {
  const n = D.length, d = D.map((r) => r.slice()), size = new Array(n).fill(1), id = Array.from({ length: n }, (_, i) => i);
  const alive = new Set(Array.from({ length: n }, (_, i) => i)), Z: number[][] = [];
  for (let step = 0; step < n - 1; step++) {
    let bi = -1, bj = -1, best = Infinity;
    const live = [...alive];
    for (let x = 0; x < live.length; x++) for (let y = x + 1; y < live.length; y++) { const i = live[x], j = live[y]; if (d[i][j] < best - 1e-12) { best = d[i][j]; bi = i; bj = j; } }
    const si = size[bi], sj = size[bj];
    const a = Math.min(id[bi], id[bj]), b = Math.max(id[bi], id[bj]);
    Z.push([a, b, best, si + sj]);
    for (const k of alive) {
      if (k === bi || k === bj) continue;
      const sk = size[k], dik = d[bi][k], djk = d[bj][k];
      let v: number;
      if (method === 'single') v = Math.min(dik, djk);
      else if (method === 'complete') v = Math.max(dik, djk);
      else if (method === 'average') v = (si * dik + sj * djk) / (si + sj);
      else { const T = si + sj + sk; v = Math.sqrt(Math.max(0, ((si + sk) * dik * dik + (sj + sk) * djk * djk - sk * best * best) / T)); }
      d[bi][k] = d[k][bi] = v;
    }
    alive.delete(bj); size[bi] = si + sj; id[bi] = n + step;
  }
  return Z;
}

/** Cophenetic distances (merge height at which two leaves join) and their correlation with the input distances. */
export function cophenetic(Z: number[][], D: number[][]) {
  const n = D.length, members: number[][] = Array.from({ length: n }, (_, i) => [i]), C = Array.from({ length: n }, () => new Array(n).fill(0));
  for (const [a, b, h] of Z) { for (const i of members[a]) for (const j of members[b]) C[i][j] = C[j][i] = h; members.push([...members[a], ...members[b]]); }
  const x: number[] = [], y: number[] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { x.push(D[i][j]); y.push(C[i][j]); }
  return { C, r: pearson(x, y) };
}
export function pearson(x: number[], y: number[]) {
  const n = x.length, mx = x.reduce((s, v) => s + v, 0) / n, my = y.reduce((s, v) => s + v, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; syy += (y[i] - my) ** 2; }
  return sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : NaN;
}

/** Cut the tree into k groups: group number (1..k) per leaf, numbered in leaf order. */
export function cutTree(Z: number[][], n: number, k: number): number[] {
  const parent = Array.from({ length: 2 * n - 1 }, (_, i) => i);
  const find = (x: number): number => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  for (let s = 0; s < n - k; s++) { const [a, b] = Z[s]; parent[find(a)] = n + s; parent[find(b)] = n + s; }
  const map = new Map<number, number>(), out: number[] = [];
  for (let i = 0; i < n; i++) { const r = find(i); if (!map.has(r)) map.set(r, map.size + 1); out.push(map.get(r)!); }
  return out;
}

/** The dendrogram as Newick, with branch lengths = differences in merge height (tips at height 0). */
export function linkageNewick(Z: number[][], names: string[]) {
  const n = names.length, h = (c: number) => (c < n ? 0 : Z[c - n][2]);
  const quote = (s: string) => (/[\s(),:;[\]'_]/.test(s) ? `'${s.replace(/'/g, "''")}'` : s);
  const f = (x: number) => String(+x.toPrecision(10));
  const w = (c: number, parentH: number): string => (c < n ? quote(names[c]) : `(${w(Z[c - n][0], h(c))},${w(Z[c - n][1], h(c))})`) + `:${f(Math.max(0, parentH - h(c)))}`;
  const top = 2 * n - 2, z = Z[top - n];
  return `(${w(z[0], z[2])},${w(z[1], z[2])});`;
}
