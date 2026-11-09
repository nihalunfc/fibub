// School matrices (Class 12 maths): 2 × 2 matrices as transformations of the plane (determinant as the
// area scale, composition as a product), and 3 × 3 systems solved by X = A⁻¹B with minors, cofactors and
// the adjoint, in exact fractions. Plain TypeScript, no DOM.

export type M2 = [number, number, number, number]; // [a, b, c, d] = [[a, b], [c, d]]
export const det2 = ([a, b, c, d]: M2) => a * d - b * c;
export const mul2 = ([a, b, c, d]: M2, [e, f, g, h]: M2): M2 => [a * e + b * g, a * f + b * h, c * e + d * g, c * f + d * h];
export const apply2 = ([a, b, c, d]: M2, [x, y]: [number, number]): [number, number] => [a * x + b * y, c * x + d * y];
export function inv2(m: M2): M2 | null { const D = det2(m); if (D === 0) return null; const [a, b, c, d] = m; return [d / D, -b / D, -c / D, a / D]; }
const D = Math.PI / 180;
export const PRESETS2: { id: string; name: string; m: (t: number) => M2 }[] = [
  { id: 'rot', name: 'Rotation by θ', m: (t) => [Math.cos(t * D), -Math.sin(t * D), Math.sin(t * D), Math.cos(t * D)] },
  { id: 'shear', name: 'Shear along x', m: () => [1, 1, 0, 1] },
  { id: 'stretch', name: 'Stretch (2 across, 0.5 up)', m: () => [2, 0, 0, 0.5] },
  { id: 'refx', name: 'Reflection in the x-axis', m: () => [1, 0, 0, -1] },
  { id: 'refyx', name: 'Reflection in y = x', m: () => [0, 1, 1, 0] },
  { id: 'proj', name: 'Squash onto the x-axis (det 0)', m: () => [1, 0, 0, 0] },
  { id: 'id', name: 'Identity (do nothing)', m: () => [1, 0, 0, 1] },
];

// Exact fractions for the 3 × 3 working (school examples use small whole numbers).
export type Q = { n: number; d: number };
const g = (a: number, b: number): number => (b ? g(b, a % b) : Math.abs(a));
export const q = (n: number, d = 1): Q => { if (d === 0) throw new Error('division by zero'); const s = d < 0 ? -1 : 1, k = g(n, d) || 1; return { n: (s * n) / k, d: (s * d) / k }; };
export const qadd = (a: Q, b: Q) => q(a.n * b.d + b.n * a.d, a.d * b.d);
export const qmul = (a: Q, b: Q) => q(a.n * b.n, a.d * b.d);
export const qdiv = (a: Q, b: Q) => q(a.n * b.d, a.d * b.n);
export const qval = (a: Q) => a.n / a.d;
export const qstr = (a: Q) => `${a.n < 0 ? '−' : ''}${Math.abs(a.n)}${a.d === 1 ? '' : `/${a.d}`}`;

export type M3 = number[][];
/** Minor M_ij: the determinant of A with row i and column j removed. */
export function minor(A: M3, i: number, j: number): number {
  const r = A.filter((_, k) => k !== i).map((row) => row.filter((_, k) => k !== j));
  return r[0][0] * r[1][1] - r[0][1] * r[1][0];
}
export const cofactor = (A: M3, i: number, j: number) => ((i + j) % 2 ? -1 : 1) * minor(A, i, j);
/** det A by expansion along the first row. */
export const det3 = (A: M3) => A[0].reduce((s, a, j) => s + a * cofactor(A, 0, j), 0);
export const adjoint = (A: M3): M3 => [0, 1, 2].map((i) => [0, 1, 2].map((j) => cofactor(A, j, i)));

/** Solve AX = B. Unique solution by X = A⁻¹B = (adj A)B / |A|; when |A| = 0, say whether there are none or many. */
export function solve3(A: M3, B: number[]): { det: number; adj: M3; inv: Q[][] | null; x: Q[] | null; kind: 'unique' | 'none' | 'many'; adjB: number[] } {
  const det = det3(A), adj = adjoint(A), adjB = adj.map((row) => row.reduce((s, a, k) => s + a * B[k], 0));
  if (det !== 0) return { det, adj, inv: adj.map((row) => row.map((a) => q(a, det))), x: adjB.map((v) => q(v, det)), kind: 'unique', adjB };
  // |A| = 0: if (adj A)B ≠ 0 there is no solution; if it is 0 there may be many (or none), decided by ranks.
  if (adjB.some((v) => v !== 0)) return { det, adj, inv: null, x: null, kind: 'none', adjB };
  return { det, adj, inv: null, x: null, kind: rank([...A.map((r, i) => [...r, B[i]])]) === rank(A) ? 'many' : 'none', adjB };
}
/** Rank of a small matrix by Gaussian elimination. */
export function rank(M: number[][]): number {
  const a = M.map((r) => r.slice()); let rk = 0;
  for (let c = 0; c < a[0].length && rk < a.length; c++) {
    let p = rk; while (p < a.length && Math.abs(a[p][c]) < 1e-12) p++;
    if (p === a.length) continue;
    [a[rk], a[p]] = [a[p], a[rk]];
    for (let r = 0; r < a.length; r++) if (r !== rk) { const f = a[r][c] / a[rk][c]; for (let k = c; k < a[0].length; k++) a[r][k] -= f * a[rk][k]; }
    rk++;
  }
  return rk;
}
