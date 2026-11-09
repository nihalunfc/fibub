// Two-group comparison of metabolite (or any feature) tables: fold change, Welch's t-test, Benjamini-Hochberg FDR,
// log transforms and missing-value handling, and principal component analysis of the samples with centring and
// unit-variance or Pareto scaling. No DOM.
import { tTwoSided } from './stats.ts';

export type Table = { features: string[]; samples: string[]; groups: string[]; x: number[][] /* features × samples, NaN = missing */ };

/**
 * Reads a pasted table. Metabolites in rows (first column = names, first row = sample names) unless `samplesInRows`.
 * A row (or column) called group, class or condition gives the groups; otherwise a sample's group is its name
 * without a trailing number ("Ctrl_3" → "Ctrl").
 */
export function readTable(cells: string[][], samplesInRows = false): Table | string {
  let rows = cells.filter((r) => r.some((c) => c.trim() !== ''));
  if (rows.length < 2) return 'Paste a table with a header row and at least one row of numbers.';
  if (samplesInRows) {
    const w = Math.max(...rows.map((r) => r.length));
    rows = Array.from({ length: w }, (_, j) => rows.map((r) => r[j] ?? ''));
  }
  const head = rows[0].slice(1).map((s) => s.trim());
  const isGroup = (s: string) => /^(group|groups|class|condition|treatment)$/i.test(s.trim());
  let groups: string[] | null = null;
  const body: string[][] = [];
  for (const r of rows.slice(1)) { if (isGroup(r[0] ?? '') && !groups) groups = r.slice(1).map((s) => (s ?? '').trim()); else body.push(r); }
  const n = head.length;
  if (n < 2) return 'The table needs at least two sample columns.';
  if (!groups) groups = head.map((s) => s.replace(/[\s_.\-#]*\d+[a-z]?$/i, '').trim() || s);
  const features: string[] = [], x: number[][] = [];
  for (const r of body) {
    const vals = Array.from({ length: n }, (_, j) => { const s = (r[j + 1] ?? '').trim(); if (s === '' || /^(na|nan|n\/a|nd|-|null|missing)$/i.test(s)) return NaN; const v = Number(s.replace(',', '.')); return Number.isFinite(v) ? v : Infinity; });
    if (vals.some((v) => v === Infinity)) return `The row for "${r[0]}" has something that is not a number. Use empty cells or NA for missing values.`;
    features.push((r[0] ?? '').trim() || `Feature ${features.length + 1}`); x.push(vals);
  }
  if (!features.length) return 'There are no rows of numbers under the header.';
  return { features, samples: head, groups, x };
}

/** Replace missing values by half the smallest positive value of that feature ('half-min'), or drop such features. */
export function handleMissing(t: Table, how: 'half-min' | 'drop'): { t: Table; filled: number; dropped: number } {
  let filled = 0, dropped = 0;
  const features: string[] = [], x: number[][] = [];
  t.x.forEach((row, i) => {
    const miss = row.filter((v) => Number.isNaN(v)).length;
    if (!miss) { features.push(t.features[i]); x.push(row); return; }
    const pos = row.filter((v) => v > 0);
    if (how === 'drop' || !pos.length) { dropped++; return; }
    const h = Math.min(...pos) / 2;
    filled += miss; features.push(t.features[i]); x.push(row.map((v) => (Number.isNaN(v) ? h : v)));
  });
  return { t: { ...t, features, x }, filled, dropped };
}

export type Transform = 'none' | 'log2' | 'log10';
export const transform = (v: number, how: Transform) => (how === 'log2' ? Math.log2(v) : how === 'log10' ? Math.log10(v) : v);

const mean = (a: number[]) => a.reduce((s, v) => s + v, 0) / a.length;
const variance = (a: number[]) => { const m = mean(a); return a.reduce((s, v) => s + (v - m) ** 2, 0) / (a.length - 1); };

/** Welch's unequal-variance t-test of b against a: t, Welch–Satterthwaite df and two-sided p. */
export function welch(a: number[], b: number[]) {
  const va = variance(a) / a.length, vb = variance(b) / b.length, se = Math.sqrt(va + vb);
  const t = (mean(b) - mean(a)) / se, df = (va + vb) ** 2 / (va * va / (a.length - 1) + vb * vb / (b.length - 1));
  if (!(se > 0)) return { t: NaN, df: NaN, p: NaN };
  return { t, df, p: tTwoSided(Math.abs(t), df) };
}

/** Benjamini–Hochberg adjusted p-values (q), the step-up procedure; NaN stays NaN and is not counted. */
export function bh(p: number[]) {
  const idx = p.map((v, i) => [v, i] as [number, number]).filter(([v]) => Number.isFinite(v)).sort((a, b) => a[0] - b[0]);
  const m = idx.length, q = p.map(() => NaN);
  let min = 1;
  for (let k = m - 1; k >= 0; k--) { min = Math.min(min, (idx[k][0] * m) / (k + 1)); q[idx[k][1]] = min; }
  return q;
}

export type Result = { feature: string; meanA: number; meanB: number; fc: number; log2fc: number; t: number; df: number; p: number; q: number };

/** Fold change on the original scale (mean B ÷ mean A) and Welch's test on the transformed values. */
export function compare(t: Table, gA: string, gB: string, how: Transform): Result[] {
  const ia = t.groups.map((g, j) => (g === gA ? j : -1)).filter((j) => j >= 0), ib = t.groups.map((g, j) => (g === gB ? j : -1)).filter((j) => j >= 0);
  const res = t.x.map((row, i) => {
    const a = ia.map((j) => row[j]), b = ib.map((j) => row[j]);
    const mA = mean(a), mB = mean(b), fc = mB / mA;
    const w = welch(a.map((v) => transform(v, how)), b.map((v) => transform(v, how)));
    return { feature: t.features[i], meanA: mA, meanB: mB, fc, log2fc: Math.log2(fc), t: w.t, df: w.df, p: w.p, q: NaN };
  });
  const q = bh(res.map((r) => r.p));
  res.forEach((r, i) => { r.q = q[i]; });
  return res;
}

/** Symmetric eigen-decomposition by cyclic Jacobi rotations: eigenvalues (descending) and unit eigenvectors (columns). */
export function eigSym(A: number[][]) {
  const n = A.length, a = A.map((r) => r.slice()), v = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += a[i][j] ** 2;
    if (off < 1e-22 * (1 + a.reduce((s, r, i) => s + r[i] ** 2, 0))) break;
    for (let p = 0; p < n; p++) for (let qq = p + 1; qq < n; qq++) {
      if (Math.abs(a[p][qq]) < 1e-300) continue;
      const th = (a[qq][qq] - a[p][p]) / (2 * a[p][qq]), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const akp = a[k][p], akq = a[k][qq]; a[k][p] = c * akp - s * akq; a[k][qq] = s * akp + c * akq; }
      for (let k = 0; k < n; k++) { const apk = a[p][k], aqk = a[qq][k]; a[p][k] = c * apk - s * aqk; a[qq][k] = s * apk + c * aqk; }
      for (let k = 0; k < n; k++) { const vkp = v[k][p], vkq = v[k][qq]; v[k][p] = c * vkp - s * vkq; v[k][qq] = s * vkp + c * vkq; }
    }
  }
  const order = a.map((r, i) => [r[i], i] as [number, number]).sort((x, y) => y[0] - x[0]);
  return { values: order.map(([l]) => l), vectors: order.map(([, i]) => v.map((r) => r[i])) };
}

export type Scaling = 'none' | 'auto' | 'pareto';

/**
 * PCA of the samples (columns of x, transformed already): centre each feature, scale it (unit variance or Pareto,
 * √sd), then decompose the samples' Gram matrix. Scores are samples × k, loadings features × k, sign fixed so the
 * largest loading of each component is positive.
 */
export function pca(x: number[][], scaling: Scaling, k = 3) {
  const n = x[0].length;
  const Z = x.map((row) => { const m = mean(row), s = Math.sqrt(variance(row)), d = scaling === 'auto' ? s : scaling === 'pareto' ? Math.sqrt(s) : 1; return row.map((v) => (d > 0 ? (v - m) / d : 0)); });
  const G = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => Z.reduce((s, r) => s + r[i] * r[j], 0)));
  const { values, vectors } = eigSym(G), total = values.reduce((s, l) => s + Math.max(0, l), 0);
  const kk = Math.min(k, n - 1);
  const scores: number[][] = Array.from({ length: n }, () => []), loadings: number[][] = Z.map(() => []), explained: number[] = [];
  for (let c = 0; c < kk; c++) {
    const l = Math.max(values[c], 0), sv = Math.sqrt(l), u = vectors[c];
    let load = Z.map((r) => (sv > 0 ? r.reduce((s, v, j) => s + v * u[j], 0) / sv : 0));
    const big = load.reduce((b, v) => (Math.abs(v) > Math.abs(b) ? v : b), 0), sg = big < 0 ? -1 : 1;
    load = load.map((v) => v * sg);
    for (let j = 0; j < n; j++) scores[j][c] = u[j] * sv * sg;
    load.forEach((v, i) => { loadings[i][c] = v; });
    explained.push(total > 0 ? l / total : 0);
  }
  return { scores, loadings, explained, kept: Z.filter((r) => r.some((v) => v !== 0)).length };
}
