// Train/test splits and k-fold assignment with a seed, following scikit-learn's rules for how many rows go where:
// train_test_split (test = ceil(fraction × n)), StratifiedShuffleSplit's class allocation, GroupShuffleSplit
// (a fraction of the groups), KFold, StratifiedKFold and GroupKFold fold sizes, plus a time-ordered hold-out.
// The rows chosen differ from scikit-learn's (a different random generator); the counts match. Plain TypeScript.
import { rng } from './dataset.ts';

export type Rand = () => number;
/** Fisher-Yates shuffle of a copy. */
export function shuffle<T>(a: T[], r: Rand): T[] {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
  return b;
}

/**
 * scikit-learn's _approximate_mode: split n draws over classes in proportion to their counts, flooring, then giving
 * the leftover draws to the largest remainders (ties broken at random).
 */
export function approximateMode(counts: number[], draws: number, r: Rand): number[] {
  const total = counts.reduce((s, x) => s + x, 0);
  const cont = counts.map((c) => (c / total) * draws), out = cont.map(Math.floor);
  let need = draws - out.reduce((s, x) => s + x, 0);
  const rem = cont.map((c, i) => c - out[i]);
  const values = [...new Set(rem)].sort((a, b) => b - a);
  for (const v of values) {
    if (need <= 0) break;
    const inds = rem.map((x, i) => (x === v ? i : -1)).filter((i) => i >= 0);
    const add = Math.min(inds.length, need);
    for (const i of shuffle(inds, r).slice(0, add)) out[i]++;
    need -= add;
  }
  return out;
}

/** How many test rows scikit-learn takes for a fraction (ceil) and the rest for training. */
export function testCount(n: number, frac: number): number {
  return Math.ceil(frac * n - 1e-9);
}

export type Assign = { set: Int8Array }; // 0 train, 1 test, 2 validation

/** Random split: indices of the test (and validation) rows. */
export function randomSplit(n: number, testFrac: number, valFrac: number, seed: number): Int8Array {
  const r = rng(seed), set = new Int8Array(n), order = shuffle([...Array(n).keys()], r);
  const nt = testCount(n, testFrac), nv = testCount(n, valFrac);
  if (nt + nv >= n) throw new Error('The test and validation parts leave no rows for training.');
  order.slice(0, nt).forEach((i) => (set[i] = 1));
  order.slice(nt, nt + nv).forEach((i) => (set[i] = 2));
  return set;
}

/** Group the row indices by label, classes in sorted order (as numpy.unique). */
export function byClass(labels: string[]): { classes: string[]; idx: number[][] } {
  const classes = [...new Set(labels)].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const pos = new Map(classes.map((c, i) => [c, i]));
  const idx: number[][] = classes.map(() => []);
  labels.forEach((l, i) => idx[pos.get(l)!].push(i));
  return { classes, idx };
}

/**
 * Stratified split as StratifiedShuffleSplit: training counts per class allocated first, then the test counts from
 * what is left. A validation part, if any, is then taken from the training rows the same way.
 */
export function stratifiedSplit(labels: string[], testFrac: number, valFrac: number, seed: number): Int8Array {
  const n = labels.length, r = rng(seed), set = new Int8Array(n);
  const nt = testCount(n, testFrac), nv = testCount(n, valFrac);
  if (nt + nv >= n) throw new Error('The test and validation parts leave no rows for training.');
  const { idx } = byClass(labels);
  const counts = idx.map((a) => a.length);
  const ntr = n - nt;
  const train = approximateMode(counts, ntr, r), left = counts.map((c, i) => c - train[i]);
  const test = approximateMode(left, nt, r);
  const trainRows: number[][] = [];
  idx.forEach((rows, c) => {
    const p = shuffle(rows, r);
    trainRows.push(p.slice(0, train[c]));
    p.slice(train[c], train[c] + test[c]).forEach((i) => (set[i] = 1));
  });
  if (nv) {
    const tc = trainRows.map((a) => a.length), keep = approximateMode(tc, ntr - nv, r);
    trainRows.forEach((rows, c) => shuffle(rows, r).slice(keep[c]).forEach((i) => (set[i] = 2)));
  }
  return set;
}

/** Grouped split as GroupShuffleSplit: ceil(fraction × number of groups) whole groups go to the test part. */
export function groupSplit(groups: string[], testFrac: number, valFrac: number, seed: number): Int8Array {
  const r = rng(seed), set = new Int8Array(groups.length);
  const u = shuffle(byClass(groups).classes, r), g = u.length;
  const nt = testCount(g, testFrac), nv = testCount(g, valFrac);
  if (g < 2) throw new Error('A grouped split needs at least two groups.');
  if (nt + nv >= g) throw new Error(`Only ${g} groups: the test and validation parts would leave none for training.`);
  const where = new Map<string, number>();
  u.slice(0, nt).forEach((x) => where.set(x, 1)); u.slice(nt, nt + nv).forEach((x) => where.set(x, 2));
  groups.forEach((x, i) => (set[i] = where.get(x) ?? 0));
  return set;
}

/** Time-ordered hold-out: the latest rows are the test part, the ones before it validation, the earliest training. */
export function timeSplit(order: number[], testFrac: number, valFrac: number): Int8Array {
  const n = order.length, set = new Int8Array(n), nt = testCount(n, testFrac), nv = testCount(n, valFrac);
  if (nt + nv >= n) throw new Error('The test and validation parts leave no rows for training.');
  order.slice(n - nt).forEach((i) => (set[i] = 1));
  order.slice(n - nt - nv, n - nt).forEach((i) => (set[i] = 2));
  return set;
}

/** KFold: folds of n // k rows, the first n % k folds one larger; shuffled with the seed, or in order (blocks). */
export function kfold(n: number, k: number, seed: number | null): Int32Array {
  const fold = new Int32Array(n), order = seed == null ? [...Array(n).keys()] : shuffle([...Array(n).keys()], rng(seed));
  let p = 0;
  for (let f = 0; f < k; f++) { const size = Math.floor(n / k) + (f < n % k ? 1 : 0); for (let j = 0; j < size; j++) fold[order[p++]] = f; }
  return fold;
}

/**
 * StratifiedKFold: each class is dealt round the folds as scikit-learn does (the sorted labels taken every k-th
 * from position f give fold f's class counts); rows within a class are shuffled with the seed.
 */
export function stratifiedKfold(labels: string[], k: number, seed: number): Int32Array {
  const n = labels.length, fold = new Int32Array(n), r = rng(seed);
  // Classes in order of first appearance, as scikit-learn encodes them for this step.
  const first: string[] = []; const seen = new Set<string>();
  for (const l of labels) if (!seen.has(l)) { seen.add(l); first.push(l); }
  const code = new Map(first.map((c, i) => [c, i]));
  const yOrder = labels.map((l) => code.get(l)!).sort((a, b) => a - b);
  const alloc = Array.from({ length: k }, (_, f) => { const c = new Array(first.length).fill(0); for (let i = f; i < n; i += k) c[yOrder[i]]++; return c; });
  first.forEach((cl, c) => {
    const rows = shuffle(labels.map((l, i) => (l === cl ? i : -1)).filter((i) => i >= 0), r);
    let p = 0;
    for (let f = 0; f < k; f++) for (let j = 0; j < alloc[f][c]; j++) fold[rows[p++]] = f;
  });
  return fold;
}

/** GroupKFold (no shuffle): groups from largest to smallest, each into the fold with the fewest rows so far. */
export function groupKfold(groups: string[], k: number): Int32Array {
  const { classes, idx } = byClass(groups);
  if (classes.length < k) throw new Error(`Only ${classes.length} groups, fewer than ${k} folds.`);
  const order = classes.map((_, i) => i).sort((a, b) => idx[b].length - idx[a].length || b - a); // ties: later group first, as sklearn
  const load = new Array(k).fill(0), fold = new Int32Array(groups.length);
  for (const g of order) {
    let f = 0; for (let j = 1; j < k; j++) if (load[j] < load[f]) f = j;
    load[f] += idx[g].length;
    for (const i of idx[g]) fold[i] = f;
  }
  return fold;
}

/** Order of rows by a time column: numbers by value, dates written year first by date, otherwise as text. Stable. */
export function timeOrder(values: string[]): number[] {
  const asNum = values.map((v) => Number(v.trim()));
  const asDate = values.map((v) => (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(v.trim()) ? Date.parse(v.trim().replace(/\//g, '-').replace(' ', 'T')) : NaN));
  const key = values.every((v, i) => v.trim() !== '' && Number.isFinite(asNum[i])) ? asNum : values.every((_, i) => Number.isFinite(asDate[i])) ? asDate : null;
  const ix = values.map((_, i) => i);
  return key ? ix.sort((a, b) => key[a] - key[b] || a - b) : ix.sort((a, b) => (values[a] < values[b] ? -1 : values[a] > values[b] ? 1 : a - b));
}

/** Count of each class in each part (rows: classes; columns: parts). */
export function balance(labels: string[], part: ArrayLike<number>, parts: number): { classes: string[]; counts: number[][] } {
  const { classes } = byClass(labels), pos = new Map(classes.map((c, i) => [c, i]));
  const counts = classes.map(() => new Array(parts).fill(0));
  labels.forEach((l, i) => counts[pos.get(l)!][part[i]]++);
  return { classes, counts };
}

/** The made-up example: 40 fruit from 8 farms, picked on dates through autumn. */
export const EXAMPLE = (() => {
  const r = rng(2026), rows = ['fruit_id,farm,picked,kind,weight_g,sugar_pct'];
  const kinds = ['apple', 'apple', 'apple', 'apple', 'apple', 'orange', 'orange', 'orange', 'pear', 'pear'];
  for (let i = 0; i < 40; i++) {
    const kind = kinds[Math.floor(r() * kinds.length)], farm = `F${1 + Math.floor(r() * 8)}`;
    const day = 1 + Math.floor(i * 1.5), d = new Date(Date.UTC(2026, 8, day));
    const w = Math.round((kind === 'orange' ? 180 : kind === 'pear' ? 170 : 150) + (r() - 0.5) * 50);
    const s = (kind === 'orange' ? 9 : kind === 'pear' ? 10 : 12) + Math.round((r() - 0.5) * 40) / 10;
    rows.push(`${String(i + 1).padStart(3, '0')},${farm},${d.toISOString().slice(0, 10)},${kind},${w},${s.toFixed(1)}`);
  }
  return rows.join('\n');
})();
