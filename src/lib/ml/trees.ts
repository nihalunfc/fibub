// Trees, forests, boosting and honest model checking for the ML foundations course (Modules 5-7).
// Plain TypeScript with no DOM, so tests/ml.mjs can check it against the lessons' worked examples.
// Classification here is two classes, 0 and 1; a leaf's value is the share of class 1.
import { mean, sum, type Rng } from './core.ts';

/** Gini impurity of a two-class node with share p of class 1: 1 − p² − (1 − p)². */
export const gini = (p: number) => 1 - p * p - (1 - p) * (1 - p);
/** Entropy in bits of a two-class node with share p of class 1. */
export const entropy = (p: number) => (p <= 0 || p >= 1 ? 0 : -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p)));

export type Kind = 'class' | 'reg';
export type Crit = 'gini' | 'entropy';
export type Node = {
  idx: number[]; n: number; value: number; imp: number; depth: number;
  f?: number; t?: number; l?: Node; r?: Node; gain?: number;
  best?: { f: number; t: number; li: number[]; ri: number[]; gain: number } | null;
};
type Opts = { kind?: Kind; crit?: Crit; maxDepth?: number; minLeaf?: number; maxSplits?: number; mtry?: number; R?: Rng };

/** Impurity from count, sum and sum of squares: Gini or entropy for classes, variance for numbers. */
function imp(n: number, s: number, ss: number, kind: Kind, crit: Crit) {
  if (!n) return 0;
  if (kind === 'reg') return Math.max(0, ss / n - (s / n) ** 2);
  return crit === 'entropy' ? entropy(s / n) : gini(s / n);
}

/**
 * The best single split of rows `idx`: for each feature, sort, try every threshold between two different
 * values, and keep the one that lowers the weighted impurity of the two children the most (the gain).
 */
export function bestSplit(X: number[][], y: number[], idx: number[], o: Opts = {}) {
  const kind = o.kind ?? 'class', crit = o.crit ?? 'gini', minLeaf = o.minLeaf ?? 1, d = X[0].length;
  const n = idx.length; if (n < 2 * minLeaf) return null;
  const S = sum(idx.map((i) => y[i])), SS = sum(idx.map((i) => y[i] * y[i])), parent = imp(n, S, SS, kind, crit);
  let feats = Array.from({ length: d }, (_, j) => j);
  if (o.mtry && o.mtry < d && o.R) feats = o.R.shuffle(feats).slice(0, o.mtry);
  let best: { f: number; t: number; k: number; order: number[]; gain: number } | null = null;
  for (const f of feats) {
    const order = idx.slice().sort((a, b) => X[a][f] - X[b][f]);
    let s = 0, ss = 0;
    for (let k = 0; k < n - 1; k++) {
      const v = y[order[k]]; s += v; ss += v * v;
      const nl = k + 1, nr = n - nl;
      if (nl < minLeaf || nr < minLeaf) continue;
      const a = X[order[k]][f], b = X[order[k + 1]][f];
      if (a === b) continue;
      const w = (nl * imp(nl, s, ss, kind, crit) + nr * imp(nr, S - s, SS - ss, kind, crit)) / n;
      const gain = parent - w;
      if (!best || gain > best.gain + 1e-12) best = { f, t: (a + b) / 2, k: nl, order, gain };
    }
  }
  if (!best || best.gain <= 1e-12) return null;
  return { f: best.f, t: best.t, li: best.order.slice(0, best.k), ri: best.order.slice(best.k), gain: best.gain };
}

function leaf(X: number[][], y: number[], idx: number[], depth: number, o: Opts): Node {
  const kind = o.kind ?? 'class', crit = o.crit ?? 'gini';
  const ys = idx.map((i) => y[i]), s = sum(ys), ss = sum(ys.map((v) => v * v));
  const nd: Node = { idx, n: idx.length, value: idx.length ? s / idx.length : 0, imp: imp(idx.length, s, ss, kind, crit), depth };
  nd.best = depth < (o.maxDepth ?? 30) ? bestSplit(X, y, idx, o) : null;
  return nd;
}

/**
 * Grow a tree best-first: keep splitting whichever leaf gives the largest total impurity drop (gain × rows),
 * until no split helps, the depth limit is reached, or `maxSplits` splits are made. Returns the root, the
 * splits in the order they were made, and each feature's importance (its share of the total impurity drop).
 */
export function growTree(X: number[][], y: number[], o: Opts = {}, rows?: number[]) {
  const root = leaf(X, y, rows ?? X.map((_, i) => i), 0, o), leaves = [root], order: Node[] = [];
  const raw = new Array(X[0].length).fill(0);
  while (order.length < (o.maxSplits ?? Infinity)) {
    let bi = -1, bv = 0;
    leaves.forEach((nd, i) => { if (nd.best && nd.best.gain * nd.n > bv) { bv = nd.best.gain * nd.n; bi = i; } });
    if (bi < 0) break;
    const nd = leaves[bi], b = nd.best!;
    nd.f = b.f; nd.t = b.t; nd.gain = b.gain; raw[b.f] += b.gain * nd.n;
    nd.l = leaf(X, y, b.li, nd.depth + 1, o); nd.r = leaf(X, y, b.ri, nd.depth + 1, o);
    leaves.splice(bi, 1, nd.l, nd.r); order.push(nd);
  }
  const tot = sum(raw);
  return { root, order, leaves, importance: raw.map((v) => (tot ? v / tot : 0)) };
}

/** Follow the questions from the root to a leaf: "is feature f ≤ t?" yes goes left. */
export function predictTree(nd: Node, x: number[]): number {
  while (nd.l && nd.r) nd = x[nd.f!] <= nd.t! ? nd.l : nd.r;
  return nd.value;
}
export const depthOf = (nd: Node): number => (nd.l && nd.r ? 1 + Math.max(depthOf(nd.l), depthOf(nd.r)) : 0);
export const leavesOf = (nd: Node): number => (nd.l && nd.r ? leavesOf(nd.l) + leavesOf(nd.r) : 1);

/** A bootstrap sample: n row numbers drawn with replacement. */
export const bootstrap = (n: number, R: Rng) => Array.from({ length: n }, () => Math.floor(R.next() * n));

/**
 * A random forest: each tree grows on its own bootstrap sample and, at every split, looks at only `mtry`
 * randomly chosen features. Prediction is the average of the trees (the share voting class 1).
 */
export function forest(X: number[][], y: number[], o: Opts & { trees: number }) {
  const R = o.R!, trees: { root: Node; oob: Set<number> }[] = [];
  const imps = new Array(X[0].length).fill(0);
  for (let t = 0; t < o.trees; t++) {
    const rows = bootstrap(X.length, R), inBag = new Set(rows);
    const g = growTree(X, y, o, rows);
    g.importance.forEach((v, j) => (imps[j] += v / o.trees));
    trees.push({ root: g.root, oob: new Set(X.map((_, i) => i).filter((i) => !inBag.has(i))) });
  }
  const predict = (x: number[], m = trees.length) => mean(trees.slice(0, m).map((t) => predictTree(t.root, x)));
  return { trees, predict, importance: imps };
}

/**
 * Gradient boosting for numbers (squared error): start from the mean, then each round fit a small tree to
 * what is still wrong (the residuals) and add a `rate`-sized step of it. `stages[m]` predicts with m trees.
 */
export function boost(X: number[][], y: number[], o: { rounds: number; rate: number; depth: number }) {
  const f0 = mean(y), trees: Node[] = [];
  const pred = y.map(() => f0);
  for (let m = 0; m < o.rounds; m++) {
    const res = y.map((v, i) => v - pred[i]);
    const t = growTree(X, res, { kind: 'reg', maxDepth: o.depth }).root;
    trees.push(t);
    X.forEach((x, i) => (pred[i] += o.rate * predictTree(t, x)));
  }
  const predict = (x: number[], m = trees.length) => f0 + o.rate * sum(trees.slice(0, m).map((t) => predictTree(t, x)));
  return { f0, trees, predict };
}

/** Probability that a majority of n independent voters, each right with probability p, is right (ties split). */
export function majorityRight(n: number, p: number) {
  let tot = 0, c = 1; // c = C(n, k)
  for (let k = 0; k <= n; k++) {
    const pk = c * p ** k * (1 - p) ** (n - k);
    if (2 * k > n) tot += pk; else if (2 * k === n) tot += pk / 2;
    c = (c * (n - k)) / (k + 1);
  }
  return tot;
}

/** k folds of row numbers, shuffled once: fold i is the test set of round i. */
export function kfold(n: number, k: number, R: Rng) {
  const ids = R.shuffle(Array.from({ length: n }, (_, i) => i));
  return Array.from({ length: k }, (_, f) => ids.filter((_, i) => i % k === f));
}

export const accuracy = (ys: number[], ps: number[]) => mean(ys.map((y, i) => ((ps[i] > 0.5 ? 1 : 0) === y ? 1 : 0)));
