// Two-player games in normal form (bimatrix games): best responses, pure Nash equilibria, mixed equilibria by
// support enumeration, iterated elimination of dominated strategies, and the value of zero-sum games by linear
// programming. A[i][j] is the row player's payoff and B[i][j] the column player's when row plays i and column j.
// Plain maths, no DOM.

export type Matrix = number[][];
export type Equilibrium = { x: number[]; y: number[]; u: number; v: number; pure: boolean; supportRow: number[]; supportCol: number[] };

const TOL = 1e-9;

/** Solve M z = r by Gaussian elimination with partial pivoting; null when (nearly) singular. */
export function solveLinear(M: number[][], r: number[]): number[] | null {
  const n = r.length, a = M.map((row, i) => [...row, r[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let i = c + 1; i < n; i++) if (Math.abs(a[i][c]) > Math.abs(a[p][c])) p = i;
    if (Math.abs(a[p][c]) < 1e-12) return null;
    [a[c], a[p]] = [a[p], a[c]];
    for (let i = 0; i < n; i++) if (i !== c) { const f = a[i][c] / a[c][c]; if (f) for (let k = c; k <= n; k++) a[i][k] -= f * a[c][k]; }
  }
  return a.map((row, i) => row[n] / row[i]);
}

/** For each column, the rows that are best responses for the row player; for each row, the column player's best columns. */
export function bestResponses(A: Matrix, B: Matrix) {
  const m = A.length, n = A[0].length;
  const rowBR = Array.from({ length: n }, (_, j) => { const mx = Math.max(...A.map((r) => r[j])); return A.map((r, i) => (r[j] >= mx - TOL ? i : -1)).filter((i) => i >= 0); });
  const colBR = Array.from({ length: m }, (_, i) => { const mx = Math.max(...B[i]); return B[i].map((v, j) => (v >= mx - TOL ? j : -1)).filter((j) => j >= 0); });
  return { rowBR, colBR };
}

/** Pure-strategy equilibria as [row, column] pairs. */
export function pureEquilibria(A: Matrix, B: Matrix): [number, number][] {
  const { rowBR, colBR } = bestResponses(A, B), out: [number, number][] = [];
  for (let i = 0; i < A.length; i++) for (let j = 0; j < A[0].length; j++) if (rowBR[j].includes(i) && colBR[i].includes(j)) out.push([i, j]);
  return out;
}

function* subsets(n: number, k: number, start = 0, cur: number[] = []): Generator<number[]> {
  if (cur.length === k) { yield cur.slice(); return; }
  for (let i = start; i <= n - (k - cur.length); i++) { cur.push(i); yield* subsets(n, k, i + 1, cur); cur.pop(); }
}

/**
 * Solve the (possibly overdetermined) system M z = r. Returns the unique solution, or null when there is none
 * or more than one.
 */
export function solveUnique(M: number[][], r: number[]): number[] | null {
  const rows = M.length, n = M[0].length, a = M.map((row, i) => [...row, r[i]]);
  const scale = Math.max(1, ...a.flat().map(Math.abs));
  let rank = 0;
  const piv: number[] = [];
  for (let c = 0; c < n && rank < rows; c++) {
    let p = rank;
    for (let i = rank + 1; i < rows; i++) if (Math.abs(a[i][c]) > Math.abs(a[p][c])) p = i;
    if (Math.abs(a[p][c]) < 1e-10 * scale) return null; // a free variable: not unique
    [a[rank], a[p]] = [a[p], a[rank]];
    for (let i = 0; i < rows; i++) if (i !== rank) { const f = a[i][c] / a[rank][c]; if (f) for (let k = c; k <= n; k++) a[i][k] -= f * a[rank][k]; }
    piv.push(c); rank++;
  }
  if (rank < n) return null;
  for (let i = rank; i < rows; i++) if (Math.abs(a[i][n]) > 1e-9 * scale) return null; // inconsistent
  const z = new Array(n).fill(0);
  piv.forEach((c, i) => (z[c] = a[i][n] / a[i][c]));
  return z;
}

/**
 * Candidate mixes for one player: for each support S of the player's own strategies and each set R of the
 * opponent's strategies, the unique mix on S that makes the opponent exactly indifferent among R (and R exactly
 * the opponent's best responses). P[i][j] is the opponent's payoff when the opponent plays i and this player j.
 */
function candidates(P: Matrix): { mix: number[]; S: number[]; R: number[]; pay: number }[] {
  const m = P.length, n = P[0].length, out: { mix: number[]; S: number[]; R: number[]; pay: number }[] = [];
  for (let l = 1; l <= n; l++) for (const S of subsets(n, l)) for (let k = 1; k <= m; k++) for (const R of subsets(m, k)) {
    const M = R.map((i) => [...S.map((j) => P[i][j]), -1]);
    M.push([...S.map(() => 1), 0]);
    const z = solveUnique(M, [...R.map(() => 0), 1]);
    if (!z || z.slice(0, l).some((p) => p <= TOL)) continue;
    const mix = new Array(n).fill(0); S.forEach((j, t) => (mix[j] = z[t]));
    const val = z[l], tol = 1e-9 * Math.max(1, Math.abs(val));
    const pays = P.map((row) => row.reduce((s, a, j) => s + a * mix[j], 0));
    // R must be exactly the opponent's set of best responses.
    if (pays.some((p, i) => (R.includes(i) ? Math.abs(p - val) > tol * 100 : p > val - tol))) continue;
    out.push({ mix, S, R, pay: val });
  }
  return out;
}

const transpose = (M: Matrix) => M[0].map((_, j) => M.map((r) => r[j]));

/**
 * All extreme Nash equilibria (vertex enumeration, done as support enumeration over supports of any sizes):
 * a mix y for the column player with support J that leaves the row player exactly indifferent among R, paired with
 * a mix x with support I inside R that leaves the column player indifferent among C, with J inside C. In a
 * non-degenerate game these are all the equilibria; in a degenerate game the equilibria also include every
 * mixture of extreme equilibria that share best responses (shown as the listed extreme points).
 */
export function supportEnumeration(A: Matrix, B: Matrix): Equilibrium[] {
  const ys = candidates(A), xs = candidates(transpose(B)), out: Equilibrium[] = [];
  for (const cx of xs) for (const cy of ys) {
    if (!cx.S.every((i) => cy.R.includes(i)) || !cy.S.every((j) => cx.R.includes(j))) continue;
    const x = cx.mix, y = cy.mix;
    if (out.some((e) => e.x.every((p, i) => Math.abs(p - x[i]) < 1e-9) && e.y.every((p, j) => Math.abs(p - y[j]) < 1e-9))) continue;
    out.push({ x, y, u: cy.pay, v: cx.pay, pure: cx.S.length === 1 && cy.S.length === 1, supportRow: cx.S, supportCol: cy.S });
  }
  out.sort((a, b) => a.supportRow.length + a.supportCol.length - b.supportRow.length - b.supportCol.length);
  return out;
}

/** Payoffs (row, column) when the players use mixes x and y. */
export function payoffs(A: Matrix, B: Matrix, x: number[], y: number[]) {
  let u = 0, v = 0;
  for (let i = 0; i < A.length; i++) for (let j = 0; j < A[0].length; j++) { u += x[i] * A[i][j] * y[j]; v += x[i] * B[i][j] * y[j]; }
  return { u, v };
}

export type Elimination = { rows: number[]; cols: number[]; steps: { player: 'row' | 'col'; removed: number; by: number }[] };

/**
 * Iterated elimination of dominated pure strategies (by another pure strategy). Strict: worse against every
 * remaining opponent strategy. Weak: never better and worse at least once (the order can change the result).
 */
export function eliminate(A: Matrix, B: Matrix, weak = false): Elimination {
  let rows = A.map((_, i) => i), cols = A[0].map((_, j) => j);
  const steps: Elimination['steps'] = [];
  const dominated = (pay: (s: number, o: number) => number, own: number[], other: number[]) => {
    for (const s of own) for (const t of own) {
      if (s === t) continue;
      const d = other.map((o) => pay(t, o) - pay(s, o));
      if (weak ? d.every((x) => x >= -TOL) && d.some((x) => x > TOL) : d.every((x) => x > TOL)) return { s, t };
    }
    return null;
  };
  for (;;) {
    const r = dominated((i, j) => A[i][j], rows, cols);
    if (r) { rows = rows.filter((i) => i !== r.s); steps.push({ player: 'row', removed: r.s, by: r.t }); continue; }
    const c = dominated((j, i) => B[i][j], cols, rows);
    if (c) { cols = cols.filter((j) => j !== c.s); steps.push({ player: 'col', removed: c.s, by: c.t }); continue; }
    break;
  }
  return { rows, cols, steps };
}

/** True when A + B is zero everywhere (or constant: a constant-sum game is strategically zero-sum). */
export function isConstantSum(A: Matrix, B: Matrix): boolean {
  const c = A[0][0] + B[0][0];
  return A.every((r, i) => r.every((a, j) => Math.abs(a + B[i][j] - c) < 1e-9));
}

/**
 * Value and optimal (maximin) strategies of the zero-sum game with row payoffs A, by the simplex method:
 * shift A to be positive, then maximise Σq subject to (A + s) q ≤ 1, q ≥ 0. The column strategy is q / Σq,
 * the row strategy comes from the dual prices, and the value is 1/Σq − s.
 */
export function zeroSum(A: Matrix): { value: number; x: number[]; y: number[] } {
  const m = A.length, n = A[0].length;
  const shift = 1 - Math.min(...A.flat());
  // Tableau: m constraint rows [P | I | 1], objective row [−1 ... | 0 | 0].
  const T = A.map((r, i) => [...r.map((a) => a + shift), ...Array.from({ length: m }, (_, k) => (k === i ? 1 : 0)), 1]);
  const obj = [...new Array(n).fill(-1), ...new Array(m).fill(0), 0];
  const basis = Array.from({ length: m }, (_, i) => n + i);
  for (let it = 0; it < 10000; it++) {
    // Bland's rule: lowest index with negative reduced cost.
    let e = -1;
    for (let k = 0; k < n + m; k++) if (obj[k] < -1e-12) { e = k; break; }
    if (e < 0) break;
    let l = -1, best = Infinity;
    for (let i = 0; i < m; i++) if (T[i][e] > 1e-12) { const ratio = T[i][n + m] / T[i][e]; if (ratio < best - 1e-12 || (Math.abs(ratio - best) <= 1e-12 && basis[i] < basis[l])) { best = ratio; l = i; } }
    if (l < 0) break; // unbounded cannot happen with a positive matrix
    const p = T[l][e];
    T[l] = T[l].map((x) => x / p);
    for (let i = 0; i < m; i++) if (i !== l && T[i][e]) { const f = T[i][e]; T[i] = T[i].map((x, k) => x - f * T[l][k]); }
    const f = obj[e]; for (let k = 0; k <= n + m; k++) obj[k] -= f * T[l][k];
    basis[l] = e;
  }
  const q = new Array(n).fill(0);
  basis.forEach((b, i) => { if (b < n) q[b] = T[i][n + m]; });
  const sum = q.reduce((s, x) => s + x, 0);
  const p = Array.from({ length: m }, (_, i) => obj[n + i]);
  const psum = p.reduce((s, x) => s + x, 0);
  return { value: 1 / sum - shift, x: p.map((x) => x / psum), y: q.map((x) => x / sum) };
}

/**
 * A rough degeneracy check: a pure strategy (or, here, any mixed equilibrium's support) with more best responses
 * than its support size. Used only to warn that support enumeration may not list every equilibrium.
 */
export function looksDegenerate(A: Matrix, B: Matrix): boolean {
  const { rowBR, colBR } = bestResponses(A, B);
  return rowBR.some((r) => r.length > 1) || colBR.some((c) => c.length > 1);
}
