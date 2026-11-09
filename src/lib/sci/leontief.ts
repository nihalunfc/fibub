// Input-output analysis (Leontief): technical coefficients, the Leontief inverse, output multipliers, linkages,
// the effect of a change in final demand, and Type I multipliers for income, jobs or any other per-sector
// quantity. Plain maths, no DOM.

export type Matrix = number[][];

/** Inverse of a square matrix by Gauss-Jordan elimination with partial pivoting; null if singular. */
export function inverse(M: Matrix): Matrix | null {
  const n = M.length, a = M.map((r, i) => [...r, ...Array.from({ length: n }, (_, k) => (k === i ? 1 : 0))]);
  const scale = Math.max(1, ...M.flat().map(Math.abs));
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let i = c + 1; i < n; i++) if (Math.abs(a[i][c]) > Math.abs(a[p][c])) p = i;
    if (Math.abs(a[p][c]) < 1e-12 * scale) return null;
    [a[c], a[p]] = [a[p], a[c]];
    const d = a[c][c];
    for (let k = 0; k < 2 * n; k++) a[c][k] /= d;
    for (let i = 0; i < n; i++) if (i !== c && a[i][c]) { const f = a[i][c]; for (let k = 0; k < 2 * n; k++) a[i][k] -= f * a[c][k]; }
  }
  return a.map((r) => r.slice(n));
}

export const matVec = (M: Matrix, v: number[]) => M.map((r) => r.reduce((s, x, j) => s + x * v[j], 0));
export const vecMat = (v: number[], M: Matrix) => M[0].map((_, j) => M.reduce((s, r, i) => s + v[i] * r[j], 0));

export type IO = {
  /** Total output of each sector. */
  x: number[];
  /** Technical coefficients a_ij = z_ij / x_j: input from sector i per unit of sector j's output. */
  A: Matrix;
  /** Leontief inverse (I − A)⁻¹: total output of i needed per unit of final demand for j. */
  L: Matrix;
  /** Output multipliers: column sums of L. */
  multipliers: number[];
  /** Backward and forward linkages (Rasmussen): column and row sums of L divided by their average. */
  backward: number[]; forward: number[];
  /** Value added (or primary inputs) per sector: x_j − Σ_i z_ij. */
  valueAdded: number[];
};

/**
 * Set up the model from inter-industry flows Z (row i sells to column j) and either final demand f (total output
 * x = row sums + f) or given total outputs x.
 */
export function model(Z: Matrix, f: number[] | null, xGiven?: number[] | null): IO {
  const n = Z.length;
  const x = xGiven ?? Z.map((r, i) => r.reduce((s, v) => s + v, 0) + (f ? f[i] : 0));
  if (x.some((v) => !(v > 0))) throw new Error('Every sector needs a total output above zero.');
  const A = Z.map((r) => r.map((z, j) => z / x[j]));
  const IA = A.map((r, i) => r.map((a, j) => (i === j ? 1 : 0) - a));
  const L = inverse(IA);
  if (!L) throw new Error('I − A cannot be inverted: some group of sectors uses up all of its own output. Check the flows.');
  const col = L[0].map((_, j) => L.reduce((s, r) => s + r[j], 0)), row = L.map((r) => r.reduce((s, v) => s + v, 0));
  const avg = col.reduce((s, v) => s + v, 0) / n;
  return {
    x, A, L, multipliers: col,
    backward: col.map((c) => c / avg), forward: row.map((r) => r / avg),
    valueAdded: x.map((xj, j) => xj - Z.reduce((s, r) => s + r[j], 0)),
  };
}

/** Change in every sector's output for a change in final demand: Δx = L Δf. */
export const impact = (io: IO, df: number[]) => matVec(io.L, df);

/**
 * A per-sector quantity (wages, jobs, emissions) as coefficients per unit of output, its total effect per unit of
 * final demand (the "simple" multiplier, coefficient row × L), and the Type I multiplier (simple ÷ direct).
 */
export function satellite(io: IO, totals: number[]) {
  const coef = totals.map((t, j) => t / io.x[j]);
  const simple = vecMat(coef, io.L);
  return { coef, simple, typeI: simple.map((s, j) => (coef[j] !== 0 ? s / coef[j] : NaN)) };
}

/** Hawkins-Simon style checks: every column of A sums to less than 1 and L has no negative entries. */
export function productive(io: IO) {
  const colSums = io.A[0].map((_, j) => io.A.reduce((s, r) => s + r[j], 0));
  return { ok: colSums.every((c) => c < 1) && io.L.flat().every((v) => v >= -1e-12), colSums };
}
