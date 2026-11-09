// Trains the small models off the main thread, so a big table never freezes the page. Messages in: the table and
// the settings; out: plain results the page draws. Nothing leaves the device.
import { readTable } from './dataset.ts';
import { prepare, fitScaler, scale, fitTree, treePredict, fitLogistic, logisticPredict, knnPredict, kmeans, silhouette, type Mat, type TreeNode } from './models.ts';
import { stratifiedSplit, randomSplit } from './split.ts';
import { metrics, sortLabels } from './confusion.ts';

export type Settings = {
  model: 'tree' | 'logistic' | 'knn' | 'kmeans'; target: string; features: string[]; testPct: number; seed: number; scale: boolean;
  criterion: 'gini' | 'entropy'; maxDepth: number; minLeaf: number; C: number; k: number; metric: 'euclidean' | 'manhattan'; weights: 'uniform' | 'distance'; clusters: number;
};

const SIL_MAX = 3000;

function run(text: string, s: Settings) {
  const t = readTable(text);
  if (!t.rows.length) throw new Error('The table has no rows of data.');
  if (!s.features.length) throw new Error('Tick at least one feature column.');
  const P = prepare(t, s.features, s.model === 'kmeans' ? null : s.target);
  const n = P.X.length;
  if (n < 4) throw new Error(`Only ${n} complete rows: at least 4 are needed.`);
  const base = { rowsUsed: n, dropped: P.dropped, names: P.names, encoded: P.encoded, rows: P.rows };
  if (s.model === 'kmeans') {
    const sc = s.scale ? fitScaler(P.X) : null, Z = sc ? scale(P.X, sc) : P.X;
    if (!(s.clusters >= 1 && s.clusters <= Math.min(30, n))) throw new Error(`The number of clusters must be from 1 to ${Math.min(30, n)}.`);
    const m = kmeans(Z, s.clusters, s.seed);
    const elbow: { k: number; inertia: number; sil: number }[] = [];
    const kmax = Math.min(10, n - 1);
    const sample = n > SIL_MAX;
    for (let k = 1; k <= kmax; k++) {
      const e = k === s.clusters ? m : kmeans(Z, k, s.seed, 4);
      elbow.push({ k, inertia: e.inertia, sil: !sample && k >= 2 ? silhouette(Z, e.labels, k) : NaN });
    }
    const centers = m.centers.map((c) => Array.from(c, (v, j) => { const u = sc ? v * sc.sd[j] + sc.mean[j] : v; return Math.abs(u) < 1e-9 * (sc ? sc.sd[j] + Math.abs(sc.mean[j]) : 1) ? 0 : u; }));
    const sizes = new Array(s.clusters).fill(0); for (const l of m.labels) sizes[l]++;
    return { kind: 'kmeans' as const, ...base, labels: Array.from(m.labels), inertia: m.inertia, iterations: m.iterations, sil: sample ? NaN : silhouette(Z, m.labels, s.clusters), silSkipped: sample, centers, sizes, elbow, X: P.X.map((r) => Array.from(r)) };
  }
  const classes = sortLabels(P.y);
  if (classes.length < 2) throw new Error(`The class column "${s.target}" has only one value; a model needs at least two classes.`);
  if (classes.length > 20) throw new Error(`The class column "${s.target}" has ${classes.length} different values. Choose a column of classes (at most 20), not a number column.`);
  const code = new Map(classes.map((c, i) => [c, i])), y = P.y.map((v) => code.get(v)!);
  const counts = classes.map((_, i) => y.filter((v) => v === i).length);
  const split = counts.every((c) => c >= 2) ? stratifiedSplit(P.y, s.testPct / 100, 0, s.seed) : randomSplit(n, s.testPct / 100, 0, s.seed);
  const tr = [...Array(n).keys()].filter((i) => split[i] === 0), te = [...Array(n).keys()].filter((i) => split[i] === 1);
  if (tr.length < 2 || !te.length) throw new Error('The split leaves too few rows: change the test percentage.');
  let Xtr: Mat = tr.map((i) => P.X[i]), Xte: Mat = te.map((i) => P.X[i]);
  const ytr = tr.map((i) => y[i]), yte = te.map((i) => y[i]);
  const useScale = s.scale && s.model !== 'tree';
  const sc = useScale ? fitScaler(Xtr) : null;
  if (sc) { Xtr = scale(Xtr, sc); Xte = scale(Xte, sc); }
  let ptr: number[], pte: number[], extra: Record<string, unknown> = {};
  if (s.model === 'tree') {
    const m = fitTree(Xtr, ytr, classes.length, { criterion: s.criterion, maxDepth: s.maxDepth > 0 ? s.maxDepth : Infinity, minSplit: 2, minLeaf: Math.max(1, s.minLeaf) });
    ptr = treePredict(m.root, Xtr); pte = treePredict(m.root, Xte);
    extra = { tree: m.root as TreeNode, importance: m.importance, leaves: m.leaves, depth: m.depth };
  } else if (s.model === 'logistic') {
    if (!(s.C > 0)) throw new Error('C must be above 0.');
    const m = fitLogistic(Xtr, ytr, classes.length, s.C);
    ptr = logisticPredict(m, Xtr); pte = logisticPredict(m, Xte);
    extra = { W: m.W, b: m.b, binary: m.binary, iterations: m.iterations };
  } else {
    if (!(Number.isInteger(s.k) && s.k >= 1 && s.k <= tr.length)) throw new Error(`k must be a whole number from 1 to ${tr.length} (the training rows).`);
    const o = { k: s.k, metric: s.metric, weights: s.weights };
    ptr = knnPredict(Xtr, ytr, classes.length, Xtr, o); pte = knnPredict(Xtr, ytr, classes.length, Xte, o);
    // Test accuracy for a range of k, to choose k.
    const curve: { k: number; acc: number }[] = [];
    for (let k = 1; k <= Math.min(30, tr.length); k += k < 10 ? 1 : 2) { const p = knnPredict(Xtr, ytr, classes.length, Xte, { ...o, k }); curve.push({ k, acc: p.filter((v, i) => v === yte[i]).length / te.length }); }
    extra = { curve };
  }
  const mat = (yy: number[], pp: number[]) => { const m = classes.map(() => new Array(classes.length).fill(0)); yy.forEach((v, i) => m[v][pp[i]]++); return m; };
  const mTest = metrics(classes, mat(yte, pte)), mTrain = metrics(classes, mat(ytr, ptr));
  const pred = new Array(n).fill(''); tr.forEach((i, j) => (pred[i] = classes[ptr[j]])); te.forEach((i, j) => (pred[i] = classes[pte[j]]));
  return { kind: 'classify' as const, ...base, classes, split: Array.from(split), pred, nTrain: tr.length, nTest: te.length, stratified: counts.every((c) => c >= 2), scaled: useScale, test: mTest, train: mTrain, ...extra };
}
export type Result = ReturnType<typeof run>;

self.onmessage = (e: MessageEvent) => {
  const { id, text, settings } = e.data;
  try { (self as unknown as Worker).postMessage({ id, ok: true, result: run(text, settings) }); }
  catch (err) { (self as unknown as Worker).postMessage({ id, ok: false, error: (err as Error).message }); }
};
