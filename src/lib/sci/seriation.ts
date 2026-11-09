// Seriation of assemblages: correspondence analysis (CA) of a sites × types count table, ordering by the first CA
// axis, row percentages for a battleship (frequency seriation) plot, and the Brainerd-Robinson similarity matrix.
// CA follows Greenacre: the SVD of the standardised residuals S = Dr^-1/2 (P - r cᵀ) Dc^-1/2.
import { num, parseTable } from './num.ts';
import { jacobi } from './huckel.ts';

export type Counts = { rows: string[]; cols: string[]; N: number[][]; notes: string[]; errors: string[] };

/** Read a pasted table: first row type names, first column site names, counts in the cells. */
export function parseCounts(text: string): Counts {
  const t = parseTable(text), notes: string[] = [], errors: string[] = [];
  if (t.length < 2) return { rows: [], cols: [], N: [], notes, errors: t.length ? ['Add at least two sites (rows) under the header row.'] : [] };
  const width = Math.max(...t.map((r) => r.length));
  const headNumeric = t[0].slice(1).every((c) => c !== '' && !Number.isNaN(num(c)));
  const head = headNumeric ? Array.from({ length: width - 1 }, (_, j) => `Type ${j + 1}`) : Array.from({ length: width - 1 }, (_, j) => t[0][j + 1] || `Type ${j + 1}`);
  const body = headNumeric ? t : t.slice(1);
  if (headNumeric) notes.push('No header row found, so the types are numbered.');
  const rows: string[] = [], N: number[][] = [];
  body.forEach((r, i) => {
    const vals = head.map((_, j) => { const s = r[j + 1] ?? ''; return s === '' ? 0 : num(s); });
    const bad = vals.findIndex((v) => !Number.isFinite(v) || v < 0);
    if (bad >= 0) { errors.push(`Row "${r[0]}": "${r[bad + 1]}" under ${head[bad]} is not a count (use 0 or a positive number).`); return; }
    rows.push(r[0] || `Site ${i + 1}`); N.push(vals);
  });
  // Drop empty rows and columns: they have no profile.
  let cols = head;
  const zr = N.map((r) => r.reduce((a, b) => a + b, 0) === 0);
  if (zr.some(Boolean)) { notes.push(`Left out ${zr.filter(Boolean).length} site(s) with no finds: ${rows.filter((_, i) => zr[i]).join(', ')}.`); }
  const keepR = rows.map((_, i) => !zr[i]);
  let M = N.filter((_, i) => keepR[i]); const R = rows.filter((_, i) => keepR[i]);
  const zc = cols.map((_, j) => M.every((r) => r[j] === 0));
  if (zc.some(Boolean)) { notes.push(`Left out ${zc.filter(Boolean).length} type(s) with no finds: ${cols.filter((_, j) => zc[j]).join(', ')}.`); M = M.map((r) => r.filter((_, j) => !zc[j])); cols = cols.filter((_, j) => !zc[j]); }
  return { rows: R, cols, N: M, notes, errors };
}

export type CA = {
  n: number; rowMass: number[]; colMass: number[];
  /** Principal inertias (eigenvalues) of the non-trivial axes, largest first. */
  inertia: number[]; total: number; chi2: number;
  /** Row and column principal coordinates: [point][axis]. */
  F: number[][]; G: number[][];
  /** Row and column standard coordinates. */
  Fs: number[][]; Gs: number[][];
};

/** Correspondence analysis of a count table (at least 2 × 2, no empty rows or columns). */
export function correspondence(N: number[][]): CA {
  const I = N.length, J = N[0].length;
  const n = N.flat().reduce((a, b) => a + b, 0);
  const r = N.map((row) => row.reduce((a, b) => a + b, 0) / n);
  const c = Array.from({ length: J }, (_, j) => N.reduce((s, row) => s + row[j], 0) / n);
  const S = N.map((row, i) => row.map((x, j) => (x / n - r[i] * c[j]) / Math.sqrt(r[i] * c[j])));
  const total = S.flat().reduce((s, x) => s + x * x, 0);
  // Eigen-decomposition of the smaller cross-product matrix.
  const byCols = J <= I, m = byCols ? J : I;
  const C = Array.from({ length: m }, (_, a) => Array.from({ length: m }, (_, b) => {
    let s = 0;
    if (byCols) for (let i = 0; i < I; i++) s += S[i][a] * S[i][b];
    else for (let j = 0; j < J; j++) s += S[a][j] * S[b][j];
    return s;
  }));
  const { values, vectors } = jacobi(C);
  const idx = values.map((v, k) => [v, k]).sort((x, y) => y[0] - x[0]).map(([, k]) => k);
  const K = Math.min(I, J) - 1;
  const inertia: number[] = [], F: number[][] = r.map(() => []), G: number[][] = c.map(() => []), Fs: number[][] = r.map(() => []), Gs: number[][] = c.map(() => []);
  for (let a = 0; a < K; a++) {
    const lam = Math.max(0, values[idx[a]]), s = Math.sqrt(lam);
    const w = vectors.map((row) => row[idx[a]]);
    // Singular vectors u (rows) and v (columns), each of unit length.
    let u: number[], v: number[];
    if (byCols) { v = w; u = S.map((row) => row.reduce((t, x, j) => t + x * v[j], 0) / (s || 1)); }
    else { u = w; v = Array.from({ length: J }, (_, j) => S.reduce((t, row, i) => t + row[j] * u[i], 0) / (s || 1)); }
    // Fix the sign: the column with the largest |v| is positive, so results do not flip between runs.
    let big = 0; v.forEach((x, j) => { if (Math.abs(x) > Math.abs(v[big])) big = j; });
    const sg = v[big] < 0 ? -1 : 1;
    inertia.push(lam);
    u.forEach((x, i) => { Fs[i][a] = (sg * x) / Math.sqrt(r[i]); F[i][a] = Fs[i][a] * s; });
    v.forEach((x, j) => { Gs[j][a] = (sg * x) / Math.sqrt(c[j]); G[j][a] = Gs[j][a] * s; });
  }
  return { n, rowMass: r, colMass: c, inertia, total, chi2: total * n, F, G, Fs, Gs };
}

/** Indices sorted by a score (stable). */
export const orderBy = (scores: number[], reverse = false) => scores.map((s, i) => [s, i]).sort((a, b) => (reverse ? b[0] - a[0] : a[0] - b[0]) || a[1] - b[1]).map(([, i]) => i);

/** Row percentages (each site's assemblage adds to 100 %). */
export const rowPercent = (N: number[][]) => N.map((row) => { const t = row.reduce((a, b) => a + b, 0); return row.map((x) => (100 * x) / t); });

/** Brainerd-Robinson coefficient: 200 minus the sum of absolute differences of row percentages (200 = identical). */
export function brainerdRobinson(N: number[][]): number[][] {
  const P = rowPercent(N);
  return P.map((a) => P.map((b) => 200 - a.reduce((s, x, k) => s + Math.abs(x - b[k]), 0)));
}

/**
 * How well an order makes the BR matrix a Robinson matrix (similarities falling away from the diagonal): the number
 * of pairs, along each row, where a value further from the diagonal is larger than a nearer one. 0 is perfect.
 */
export function robinsonViolations(BR: number[][], order: number[]): number {
  let v = 0;
  const m = order.map((i) => order.map((j) => BR[i][j]));
  for (let i = 0; i < m.length; i++) {
    for (let j = i + 2; j < m.length; j++) if (m[i][j] > m[i][j - 1] + 1e-9) v++;
    for (let j = i - 2; j >= 0; j--) if (m[i][j] > m[i][j + 1] + 1e-9) v++;
  }
  return v;
}

/** Made-up example: pottery type counts at eight sites (invented; not from any real excavation), rows out of order. */
export const EXAMPLE = `Site\tCord-marked\tIncised\tPainted red\tPainted black\tStamped\tGlazed
Hill Farm\t2\t14\t38\t22\t3\t0
Old Ford\t30\t20\t4\t0\t0\t0
Mill Lane\t0\t0\t6\t20\t32\t18
Brook End\t18\t30\t16\t2\t0\t0
Church Field\t0\t2\t18\t34\t16\t2
Long Meadow\t44\t8\t0\t0\t0\t0
Quarry Pit\t0\t0\t0\t4\t18\t40
Ash Row\t6\t26\t30\t8\t0\t0`;
