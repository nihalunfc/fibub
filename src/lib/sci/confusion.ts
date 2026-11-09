// Confusion matrix and classification metrics, binary and multiclass, as scikit-learn defines them: per-class
// precision, recall, F1 and specificity; macro, micro and weighted averages; accuracy, balanced accuracy,
// Matthews correlation (multiclass form) and Cohen's kappa, with Wilson 95 % intervals for the proportions and
// the large-sample interval for kappa. Plain TypeScript, no DOM.
import { normInv } from './stats.ts';
import { cohen } from './reliability.ts';
import { num } from './num.ts';

/** Wilson score interval for k successes out of n. */
export function wilson(k: number, n: number, conf = 0.95): [number, number] {
  if (!(n > 0)) return [NaN, NaN];
  const z = normInv(1 - (1 - conf) / 2), p = k / n, d = 1 + (z * z) / n;
  const c = (p + (z * z) / (2 * n)) / d, h = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d;
  return [Math.max(0, c - h), Math.min(1, c + h)];
}

/** Sort class labels as scikit-learn does (numbers by value, otherwise text order). */
export function sortLabels(ls: string[]): string[] {
  const u = [...new Set(ls)];
  const allNum = u.every((s) => Number.isFinite(num(s)));
  return allNum ? u.sort((a, b) => num(a) - num(b)) : u.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

/** Confusion matrix: rows are the actual class, columns the predicted class. */
export function fromPairs(actual: string[], predicted: string[], labels?: string[]): { labels: string[]; m: number[][] } {
  const L = labels ?? sortLabels([...actual, ...predicted]);
  const ix = new Map(L.map((l, i) => [l, i]));
  const m = L.map(() => new Array(L.length).fill(0));
  actual.forEach((a, i) => { const r = ix.get(a), c = ix.get(predicted[i]); if (r != null && c != null) m[r][c]++; });
  return { labels: L, m };
}

export type ClassStats = { label: string; tp: number; fp: number; fn: number; tn: number; support: number; predicted: number; precision: number; recall: number; f1: number; specificity: number; precisionCI: [number, number]; recallCI: [number, number]; specificityCI: [number, number] };
export type Metrics = {
  n: number; labels: string[]; m: number[][]; classes: ClassStats[];
  accuracy: number; accuracyCI: [number, number]; balancedAccuracy: number; mcc: number;
  kappa: number; kappaSE: number; kappaCI: [number, number];
  macro: { precision: number; recall: number; f1: number }; micro: { precision: number; recall: number; f1: number }; weighted: { precision: number; recall: number; f1: number };
};

const div = (a: number, b: number) => (b > 0 ? a / b : 0); // scikit-learn's zero_division = 0

export function metrics(labels: string[], m: number[][]): Metrics {
  const k = labels.length;
  if (k < 2) throw new Error('Need at least two classes.');
  if (m.length !== k || m.some((r) => r.length !== k)) throw new Error('The matrix must be square, one row and one column per class.');
  if (m.flat().some((x) => !(x >= 0) || !Number.isInteger(x))) throw new Error('Counts must be whole numbers, 0 or more.');
  const n = m.flat().reduce((s, x) => s + x, 0);
  if (!n) throw new Error('The matrix is empty: all counts are 0.');
  const rowS = m.map((r) => r.reduce((s, x) => s + x, 0)), colS = labels.map((_, j) => m.reduce((s, r) => s + r[j], 0));
  const classes: ClassStats[] = labels.map((label, i) => {
    const tp = m[i][i], fn = rowS[i] - tp, fp = colS[i] - tp, tn = n - tp - fn - fp;
    const precision = div(tp, tp + fp), recall = div(tp, tp + fn);
    return { label, tp, fp, fn, tn, support: rowS[i], predicted: colS[i], precision, recall, f1: div(2 * precision * recall, precision + recall), specificity: div(tn, tn + fp), precisionCI: wilson(tp, tp + fp), recallCI: wilson(tp, tp + fn), specificityCI: wilson(tn, tn + fp) };
  });
  const correct = labels.reduce((s, _, i) => s + m[i][i], 0);
  const accuracy = correct / n;
  const present = classes.filter((c) => c.support > 0);
  const avg = (f: (c: ClassStats) => number) => classes.reduce((s, c) => s + f(c), 0) / k;
  const wavg = (f: (c: ClassStats) => number) => classes.reduce((s, c) => s + f(c) * c.support, 0) / n;
  // Micro averages pool the counts (with every class included they all equal accuracy).
  const TP = classes.reduce((s, c) => s + c.tp, 0), FP = classes.reduce((s, c) => s + c.fp, 0), FN = classes.reduce((s, c) => s + c.fn, 0);
  const mp = div(TP, TP + FP), mr = div(TP, TP + FN);
  // Matthews correlation, multiclass (Gorodkin's R_K), as sklearn.metrics.matthews_corrcoef.
  const sPred = colS.reduce((s, x) => s + x * x, 0), sTrue = rowS.reduce((s, x) => s + x * x, 0), cov = correct * n - labels.reduce((s, _, i) => s + rowS[i] * colS[i], 0);
  const den = Math.sqrt((n * n - sPred) * (n * n - sTrue));
  const ck = cohen(m);
  return {
    n, labels, m, classes, accuracy, accuracyCI: wilson(correct, n),
    balancedAccuracy: present.reduce((s, c) => s + c.recall, 0) / present.length,
    mcc: den > 0 ? cov / den : 0,
    kappa: ck.kappa, kappaSE: ck.se, kappaCI: ck.ci,
    macro: { precision: avg((c) => c.precision), recall: avg((c) => c.recall), f1: avg((c) => c.f1) },
    micro: { precision: mp, recall: mr, f1: div(2 * mp * mr, mp + mr) },
    weighted: { precision: wavg((c) => c.precision), recall: wavg((c) => c.recall), f1: wavg((c) => c.f1) },
  };
}

/** Extra measures for a two-class problem, for the chosen positive class. */
export function binary(tp: number, fn: number, fp: number, tn: number) {
  const n = tp + fn + fp + tn;
  const sens = div(tp, tp + fn), spec = div(tn, tn + fp), ppv = div(tp, tp + fp), npv = div(tn, tn + fn);
  return {
    n, sensitivity: sens, sensitivityCI: wilson(tp, tp + fn), specificity: spec, specificityCI: wilson(tn, tn + fp),
    ppv, ppvCI: wilson(tp, tp + fp), npv, npvCI: wilson(tn, tn + fn),
    fpr: 1 - spec, fnr: 1 - sens, prevalence: (tp + fn) / n, youden: sens + spec - 1,
    lrPlus: spec < 1 ? sens / (1 - spec) : Infinity, lrMinus: spec > 0 ? (1 - sens) / spec : NaN,
    f1: div(2 * tp, 2 * tp + fp + fn),
  };
}

/** Parse a pasted matrix of counts. A first row and/or first column of text are taken as class names. */
export function parseMatrix(rows: string[][]): { labels: string[]; m: number[][] } {
  let r = rows.filter((x) => x.some((c) => c.trim() !== ''));
  if (!r.length) throw new Error('Paste the matrix: one row per actual class, one column per predicted class.');
  let colLabels: string[] | null = null, rowLabels: string[] | null = null;
  if (r[0].some((c) => c.trim() !== '' && !Number.isFinite(num(c)))) { colLabels = r[0]; r = r.slice(1); }
  if (r.length && r.every((x) => x[0] != null && (x[0].trim() === '' || !Number.isFinite(num(x[0])))) && r.every((x) => x.length > 1)) { rowLabels = r.map((x) => x[0].trim()); r = r.map((x) => x.slice(1)); }
  const k = r.length;
  if (colLabels && rowLabels && colLabels.length === k + 1) colLabels = colLabels.slice(1);
  const m = r.map((x) => x.slice(0, Math.max(k, x.length)).map((c) => num(c)));
  if (m.some((x) => x.length !== k)) throw new Error(`The matrix must be square: ${k} rows, so ${k} numbers in each row.`);
  if (m.flat().some((x) => !Number.isFinite(x))) throw new Error('Every cell of the matrix must be a count (a whole number).');
  const labels = (rowLabels ?? colLabels?.map((s) => s.trim()) ?? m.map((_, i) => `Class ${i + 1}`)).map((s, i) => s || `Class ${i + 1}`);
  if (colLabels && rowLabels && colLabels.map((s) => s.trim()).join('\u0000') !== rowLabels.join('\u0000')) throw new Error('The row names and column names must be the same classes in the same order.');
  return { labels, m };
}

/** Made-up examples. */
export const EXAMPLE_MATRIX = `,cat,dog,rabbit
cat,42,6,2
dog,8,37,5
rabbit,1,4,25`;
export const EXAMPLE_PAIRS = `actual,predicted
spam,spam
spam,spam
spam,ham
ham,ham
ham,ham
ham,spam
spam,spam
ham,ham
ham,ham
spam,spam
ham,ham
spam,ham
ham,ham
spam,spam
ham,ham
ham,ham
spam,spam
ham,spam
ham,ham
spam,spam`;
