// Matrix calculator maths: exact fractions (BigInt) for determinants, inverses, row reduction with steps, products,
// LU and characteristic polynomials; floating point for eigenvalues (complex too), QR, Cholesky and SVD.
// Plain TypeScript, no DOM. Checked against numpy and sympy in tests/sci-tools/matrix-calculator.mjs.

// ---------- Exact fractions ----------
const babs = (a: bigint) => (a < 0n ? -a : a);
function bgcd(a: bigint, b: bigint): bigint { a = babs(a); b = babs(b); while (b) { [a, b] = [b, a % b]; } return a; }

/** An exact fraction n/d with d > 0, always in lowest terms. */
export class Q {
  readonly n: bigint; readonly d: bigint;
  constructor(n: bigint, d: bigint = 1n) {
    if (d === 0n) throw new Error('Division by zero');
    if (d < 0n) { n = -n; d = -d; }
    const g = bgcd(n, d) || 1n;
    this.n = n / g; this.d = d / g;
  }
  static of(x: number | bigint): Q { return typeof x === 'bigint' ? new Q(x) : fromNumber(x); }
  static readonly ZERO = new Q(0n);
  static readonly ONE = new Q(1n);
  add(b: Q) { return new Q(this.n * b.d + b.n * this.d, this.d * b.d); }
  sub(b: Q) { return new Q(this.n * b.d - b.n * this.d, this.d * b.d); }
  mul(b: Q) { return new Q(this.n * b.n, this.d * b.d); }
  div(b: Q) { if (b.n === 0n) throw new Error('Division by zero'); return new Q(this.n * b.d, this.d * b.n); }
  neg() { return new Q(-this.n, this.d); }
  abs() { return new Q(babs(this.n), this.d); }
  isZero() { return this.n === 0n; }
  isOne() { return this.n === 1n && this.d === 1n; }
  eq(b: Q) { return this.n === b.n && this.d === b.d; }
  cmp(b: Q) { const x = this.n * b.d - b.n * this.d; return x < 0n ? -1 : x > 0n ? 1 : 0; }
  sign() { return this.n < 0n ? -1 : this.n > 0n ? 1 : 0; }
  toNumber(): number {
    const n = this.n, d = this.d;
    const an = babs(n);
    if (an < 2n ** 1000n && d < 2n ** 1000n) return Number(n) / Number(d);
    // Very large numbers: scale down first.
    const sh = BigInt(Math.max(0, an.toString(2).length - 900)), sd = BigInt(Math.max(0, d.toString(2).length - 900));
    return (Number(n >> sh) / Number(d >> sd)) * 2 ** (Number(sh) - Number(sd));
  }
  /** "3", "−3/4" (with a real minus sign), or plain ASCII with ascii=true. */
  toString(ascii = false): string {
    const m = ascii ? '-' : '−';
    const s = (this.n < 0n ? m : '') + babs(this.n).toString();
    return this.d === 1n ? s : `${s}/${this.d}`;
  }
}
function fromNumber(x: number): Q {
  if (!Number.isFinite(x)) throw new Error('Not a finite number');
  if (Number.isInteger(x)) return new Q(BigInt(x));
  // Exact binary value of the float.
  let d = 1n, v = x;
  while (!Number.isInteger(v)) { v *= 2; d *= 2n; }
  return new Q(BigInt(v), d);
}

/** Parse one entry: integers, decimals, "1.5e-3", fractions "−3/4" or "0.5/3". Exact (decimals are read as decimals). */
export function parseQ(s: string): Q {
  const t = s.trim().replace(/[−–]/g, '-').replace(/^\+/, '');
  const one = (u: string): Q => {
    const m = /^(-?)(\d*)(?:\.(\d*))?(?:[eE]([+-]?\d+))?$/.exec(u);
    if (!m || (m[2] === '' && (m[3] ?? '') === '')) throw new Error(`"${s.trim()}" is not a number or a fraction`);
    const frac = m[3] ?? '';
    let n = BigInt((m[2] || '0') + frac), d = 10n ** BigInt(frac.length);
    const e = m[4] ? Number(m[4]) : 0;
    if (Math.abs(e) > 300) throw new Error(`"${s.trim()}" is too large or too small`);
    if (e > 0) n *= 10n ** BigInt(e); else if (e < 0) d *= 10n ** BigInt(-e);
    return new Q(m[1] ? -n : n, d);
  };
  const parts = t.split('/');
  if (parts.length === 1) return one(parts[0]);
  if (parts.length === 2) { const b = one(parts[1]); if (b.isZero()) throw new Error(`"${s.trim()}" divides by zero`); return one(parts[0]).div(b); }
  throw new Error(`"${s.trim()}" is not a number or a fraction`);
}

export type QM = Q[][];
export type M = number[][];

/**
 * Read a matrix typed or pasted as rows on lines, entries split by spaces, commas, tabs or semicolons. Also takes
 * numpy/MATLAB style "[[1, 2], [3, 4]]" or "[1 2; 3 4]".
 */
export function parseMatrix(text: string, maxSize = 12): QM {
  let t = text.trim();
  if (!t) throw new Error('Type the matrix: one row per line.');
  if (/^\[/.test(t)) {
    t = t.replace(/\]\s*,?\s*\[/g, '\n').replace(/[[\]]/g, '');
    if (t.includes(';')) t = t.replace(/;/g, '\n');
  }
  const lines = t.split(/\r?\n/).map((l) => l.trim()).filter((l) => l !== '');
  const rows = lines.map((l) => l.split(/[\s,;\t]+/).filter((c) => c !== '').map(parseQ));
  if (!rows.length) throw new Error('Type the matrix: one row per line.');
  const w = rows[0].length;
  const bad = rows.findIndex((r) => r.length !== w);
  if (bad >= 0) throw new Error(`Row ${bad + 1} has ${rows[bad].length} entr${rows[bad].length === 1 ? 'y' : 'ies'} but row 1 has ${w}. Every row needs the same number.`);
  if (rows.length > maxSize || w > maxSize) throw new Error(`This tool takes matrices up to ${maxSize} × ${maxSize}; this one is ${rows.length} × ${w}.`);
  return rows;
}

export const toFloat = (A: QM): M => A.map((r) => r.map((x) => x.toNumber()));
export const size = (A: unknown[][]) => [A.length, A[0]?.length ?? 0] as const;
const qcopy = (A: QM): QM => A.map((r) => r.slice());
export const qIdentity = (n: number): QM => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? Q.ONE : Q.ZERO)));
export const transpose = <T>(A: T[][]): T[][] => (A[0] ?? []).map((_, j) => A.map((r) => r[j]));

export function qMul(A: QM, B: QM): QM {
  if (A[0].length !== B.length) throw new Error(`A × B needs A's columns (${A[0].length}) to equal B's rows (${B.length}).`);
  return A.map((r) => B[0].map((_, j) => r.reduce((s, x, k) => (x.isZero() ? s : s.add(x.mul(B[k][j]))), Q.ZERO)));
}
export function qAdd(A: QM, B: QM, sign = 1): QM {
  if (A.length !== B.length || A[0].length !== B[0].length) throw new Error(`A and B must be the same size to ${sign > 0 ? 'add' : 'subtract'} (A is ${A.length} × ${A[0].length}, B is ${B.length} × ${B[0].length}).`);
  return A.map((r, i) => r.map((x, j) => (sign > 0 ? x.add(B[i][j]) : x.sub(B[i][j]))));
}
export const qTrace = (A: QM) => A.reduce((s, r, i) => s.add(r[i]), Q.ZERO);
export const isSquare = (A: unknown[][]) => A.length === A[0].length;
export const qSymmetric = (A: QM) => isSquare(A) && A.every((r, i) => r.every((x, j) => x.eq(A[j][i])));

// ---------- Row reduction with steps ----------
export type Step = { ops: string[]; M: QM; note?: string };
const R = (i: number) => `R${i + 1}`;
/** "3", "1/2", "−2" as a multiplier in front of a row name. */
function coef(q: Q): string {
  if (q.isOne()) return '';
  if (q.eq(Q.ONE.neg())) return '−';
  const s = q.toString();
  return q.d === 1n ? s : `(${s})`;
}

export type Reduction = { steps: Step[]; M: QM; pivots: number[]; swaps: number; scale: Q };

/**
 * Gauss-Jordan elimination as done by hand, in exact fractions. `cols` limits pivots to the first `cols` columns
 * (the left part of an augmented matrix). With `reduced=false` it stops at row echelon form (no scaling, nothing
 * cleared above a pivot), which is how a determinant is found. `scale` is the product of the row scalings used.
 */
export function rowReduce(A: QM, cols = A[0].length, reduced = true): Reduction {
  const M = qcopy(A), m = M.length, n = M[0].length;
  const steps: Step[] = [], pivots: number[] = [];
  let r = 0, swaps = 0, scale = Q.ONE;
  for (let c = 0; c < cols && r < m; c++) {
    // Pivot: the first nonzero entry at or below row r, preferring a 1 or −1 (easier by hand).
    let p = -1;
    for (let i = r; i < m; i++) if (!M[i][c].isZero()) { if (p < 0) p = i; if (M[i][c].abs().isOne()) { p = i; break; } }
    if (p < 0) continue;
    if (p !== r) {
      [M[p], M[r]] = [M[r], M[p]]; swaps++;
      steps.push({ ops: [`${R(r)} ↔ ${R(p)}`], M: qcopy(M) });
    }
    if (reduced && !M[r][c].isOne()) {
      const k = Q.ONE.div(M[r][c]);
      scale = scale.mul(k);
      M[r] = M[r].map((x) => x.mul(k));
      steps.push({ ops: [`${R(r)} → ${coef(k)}${R(r)}`], M: qcopy(M) });
    }
    const ops: string[] = [];
    for (let i = reduced ? 0 : r + 1; i < m; i++) {
      if (i === r || M[i][c].isZero()) continue;
      const f = M[i][c].div(M[r][c]);
      M[i] = M[i].map((x, j) => x.sub(f.mul(M[r][j])));
      ops.push(f.sign() > 0 ? `${R(i)} → ${R(i)} − ${coef(f)}${R(r)}` : `${R(i)} → ${R(i)} + ${coef(f.neg())}${R(r)}`);
    }
    if (ops.length) steps.push({ ops, M: qcopy(M) });
    pivots.push(c); r++;
  }
  return { steps, M, pivots, swaps, scale };
}

export function rank(A: QM) { return rowReduce(A, A[0].length, false).pivots.length; }

export function det(A: QM): { value: Q; red: Reduction } {
  if (!isSquare(A)) throw new Error(`Only square matrices have a determinant; this one is ${A.length} × ${A[0].length}.`);
  const red = rowReduce(A, A[0].length, false);
  let v = red.pivots.length < A.length ? Q.ZERO : red.M.reduce((s, r, i) => s.mul(r[i]), Q.ONE);
  if (red.swaps % 2) v = v.neg();
  return { value: v, red };
}

/** Inverse by Gauss-Jordan on [A | I]; null when A is singular. */
export function inverse(A: QM): { inv: QM | null; red: Reduction } {
  if (!isSquare(A)) throw new Error(`Only square matrices can have an inverse; this one is ${A.length} × ${A[0].length}.`);
  const n = A.length, I = qIdentity(n);
  const red = rowReduce(A.map((r, i) => [...r, ...I[i]]), n, true);
  if (red.pivots.length < n) return { inv: null, red };
  return { inv: red.M.map((r) => r.slice(n)), red };
}

/** A basis of the null space (exact), one vector per free column, from the reduced row echelon form. */
export function nullSpace(A: QM): QM {
  const red = rowReduce(A), n = A[0].length;
  const free = Array.from({ length: n }, (_, j) => j).filter((j) => !red.pivots.includes(j));
  return free.map((f) => {
    const v = Array.from({ length: n }, (_, j) => (j === f ? Q.ONE : Q.ZERO));
    red.pivots.forEach((pc, i) => { v[pc] = red.M[i][f].neg(); });
    return v;
  });
}

export type Solution =
  | { kind: 'unique'; x: QM }
  | { kind: 'none'; row: number }
  | { kind: 'many'; particular: Q[]; free: number[]; directions: Q[][] };
/** Solve A x = B (B may have several columns when the solution is unique). */
export function solve(A: QM, B: QM): { sol: Solution; red: Reduction } {
  if (B.length !== A.length) throw new Error(`B needs as many rows as A (${A.length}); it has ${B.length}.`);
  const n = A[0].length, k = B[0].length;
  const red = rowReduce(A.map((r, i) => [...r, ...B[i]]), n, true);
  const rk = red.pivots.length;
  for (let i = rk; i < A.length; i++) if (red.M[i].slice(n).some((x) => !x.isZero())) return { sol: { kind: 'none', row: i }, red };
  if (rk === n) return { sol: { kind: 'unique', x: Array.from({ length: n }, (_, j) => red.M[red.pivots.indexOf(j)].slice(n)) }, red };
  if (k > 1) throw new Error('A is singular, so A x = B has many solutions or none. Use a single column for B to see them.');
  const free = Array.from({ length: n }, (_, j) => j).filter((j) => !red.pivots.includes(j));
  const particular = Array.from({ length: n }, () => Q.ZERO);
  red.pivots.forEach((pc, i) => { particular[pc] = red.M[i][n]; });
  const directions = free.map((f) => { const v = Array.from({ length: n }, (_, j) => (j === f ? Q.ONE : Q.ZERO)); red.pivots.forEach((pc, i) => { v[pc] = red.M[i][f].neg(); }); return v; });
  return { sol: { kind: 'many', particular, free, directions }, red };
}

export function qPower(A: QM, p: number): QM {
  if (!isSquare(A)) throw new Error('Only square matrices have powers.');
  if (!Number.isInteger(p) || Math.abs(p) > 100) throw new Error('Type a whole-number power from −100 to 100.');
  let base = A;
  if (p < 0) { const { inv } = inverse(A); if (!inv) throw new Error('A is singular (determinant 0), so it has no negative powers.'); base = inv; p = -p; }
  let out = qIdentity(A.length);
  while (p > 0) { if (p & 1) out = qMul(out, base); base = qMul(base, base); p >>= 1; }
  return out;
}

/**
 * LU decomposition with row swaps, exact: P A = L U, L unit lower triangular. `partial` picks the largest pivot
 * in each column (as numpy/scipy do); otherwise rows are swapped only when a pivot is zero (as by hand).
 * Works for any m × n matrix (L is m × m, U is m × n).
 */
export function lu(A: QM, partial: boolean): { P: QM; L: QM; U: QM; perm: number[]; swaps: number } {
  const m = A.length, n = A[0].length;
  const U = qcopy(A), L = qIdentity(m), perm = Array.from({ length: m }, (_, i) => i);
  let swaps = 0;
  for (let c = 0, r = 0; c < n && r < m; c++) {
    let p = -1;
    for (let i = r; i < m; i++) {
      if (U[i][c].isZero()) continue;
      if (p < 0) { p = i; if (!partial) break; } else if (U[i][c].abs().cmp(U[p][c].abs()) > 0) p = i;
    }
    if (p < 0) continue;
    if (p !== r) {
      [U[p], U[r]] = [U[r], U[p]]; [perm[p], perm[r]] = [perm[r], perm[p]]; swaps++;
      for (let j = 0; j < r; j++) [L[p][j], L[r][j]] = [L[r][j], L[p][j]];
    }
    for (let i = r + 1; i < m; i++) {
      if (U[i][c].isZero()) continue;
      const f = U[i][c].div(U[r][c]);
      L[i][r] = f;
      U[i] = U[i].map((x, j) => x.sub(f.mul(U[r][j])));
    }
    r++;
  }
  const P = perm.map((pi) => Array.from({ length: m }, (_, j) => (j === pi ? Q.ONE : Q.ZERO)));
  return { P, L, U, perm, swaps };
}

/** det(λI − A) as exact coefficients, constant term first (Faddeev-LeVerrier). */
export function charPoly(A: QM): Q[] {
  const n = A.length;
  const c: Q[] = Array(n + 1).fill(Q.ZERO);
  c[n] = Q.ONE;
  let Mk: QM = A.map((r) => r.map(() => Q.ZERO));
  for (let k = 1; k <= n; k++) {
    // M_k = A M_{k-1} + c_{n-k+1} I ; c_{n-k} = −tr(A M_k)/k
    const AM = qMul(A, Mk);
    Mk = AM.map((r, i) => r.map((x, j) => (i === j ? x.add(c[n - k + 1]) : x)));
    c[n - k] = qTrace(qMul(A, Mk)).neg().div(new Q(BigInt(k)));
  }
  return c;
}

/** A polynomial (constant first) in λ as text, like "λ³ − 6λ² + 11λ − 6". */
export function polyText(c: Q[], v = 'λ'): string {
  const SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const sup = (k: number) => String(k).split('').map((d) => SUPS[Number(d)]).join('');
  let s = '';
  for (let k = c.length - 1; k >= 0; k--) {
    const a = c[k];
    if (a.isZero()) continue;
    const neg = a.sign() < 0, ab = a.abs();
    const coefT = k > 0 && ab.isOne() ? '' : ab.d === 1n || k === 0 ? ab.toString() : `(${ab.toString()})`;
    const term = coefT + (k === 0 ? '' : k === 1 ? v : v + sup(k));
    s += s ? (neg ? ' − ' : ' + ') + term : (neg ? '−' : '') + term;
  }
  return s || '0';
}

// ---------- Exact complex fractions (for checking eigenvalues like 2 ± i exactly) ----------
export class QC {
  readonly re: Q; readonly im: Q;
  constructor(re: Q, im: Q = Q.ZERO) { this.re = re; this.im = im; }
  add(b: QC) { return new QC(this.re.add(b.re), this.im.add(b.im)); }
  sub(b: QC) { return new QC(this.re.sub(b.re), this.im.sub(b.im)); }
  mul(b: QC) { return new QC(this.re.mul(b.re).sub(this.im.mul(b.im)), this.re.mul(b.im).add(this.im.mul(b.re))); }
  div(b: QC) {
    const den = b.re.mul(b.re).add(b.im.mul(b.im));
    if (den.isZero()) throw new Error('Division by zero');
    return new QC(this.re.mul(b.re).add(this.im.mul(b.im)).div(den), this.im.mul(b.re).sub(this.re.mul(b.im)).div(den));
  }
  neg() { return new QC(this.re.neg(), this.im.neg()); }
  isZero() { return this.re.isZero() && this.im.isZero(); }
  isReal() { return this.im.isZero(); }
}

/** Closest fraction with a denominator up to maxDen (continued fractions). */
export function nearestFraction(x: number, maxDen = 1000): Q {
  if (!Number.isFinite(x)) return Q.ZERO;
  let h0 = 0n, h1 = 1n, k0 = 1n, k1 = 0n, v = x;
  for (let i = 0; i < 40; i++) {
    const a = Math.floor(v);
    const ab = BigInt(a);
    const h2 = ab * h1 + h0, k2 = ab * k1 + k0;
    if (k2 > BigInt(maxDen)) break;
    h0 = h1; h1 = h2; k0 = k1; k1 = k2;
    const f = v - a;
    if (Math.abs(f) < 1e-12) break;
    v = 1 / f;
    if (!Number.isFinite(v) || Math.abs(v) > 1e15) break;
  }
  return new Q(h1, k1);
}

function polyEvalC(c: Q[], z: QC): QC {
  let s = new QC(Q.ZERO);
  for (let k = c.length - 1; k >= 0; k--) s = s.mul(z).add(new QC(c[k]));
  return s;
}
const polyDeriv = (c: Q[]) => c.slice(1).map((a, k) => a.mul(new Q(BigInt(k + 1))));

/** Exact null space over the complex fractions (Gauss-Jordan). */
function nullSpaceQC(A: QC[][]): QC[][] {
  const M = A.map((r) => r.slice()), m = M.length, n = M[0].length, piv: number[] = [];
  let r = 0;
  for (let c = 0; c < n && r < m; c++) {
    let p = -1;
    for (let i = r; i < m; i++) if (!M[i][c].isZero()) { p = i; break; }
    if (p < 0) continue;
    [M[p], M[r]] = [M[r], M[p]];
    const k = M[r][c];
    M[r] = M[r].map((x) => x.div(k));
    for (let i = 0; i < m; i++) if (i !== r && !M[i][c].isZero()) { const f = M[i][c]; M[i] = M[i].map((x, j) => x.sub(f.mul(M[r][j]))); }
    piv.push(c); r++;
  }
  const free = Array.from({ length: n }, (_, j) => j).filter((j) => !piv.includes(j));
  return free.map((f) => { const v = Array.from({ length: n }, (_, j) => new QC(j === f ? Q.ONE : Q.ZERO)); piv.forEach((pc, i) => { v[pc] = M[i][f].neg(); }); return v; });
}
/** Scale an exact vector to the smallest whole numbers (Gaussian integers for complex ones). */
function cleanVector(v: QC[]): QC[] {
  let l = 1n;
  const lcm = (a: bigint, b: bigint) => (a / bgcd(a, b)) * b;
  for (const z of v) { l = lcm(l, z.re.d); l = lcm(l, z.im.d); }
  let w = v.map((z) => new QC(z.re.mul(new Q(l)), z.im.mul(new Q(l))));
  let g = 0n;
  for (const z of w) { g = bgcd(g, z.re.n); g = bgcd(g, z.im.n); }
  if (g > 1n) w = w.map((z) => new QC(new Q(z.re.n / g), new Q(z.im.n / g)));
  // First nonzero entry positive (its real part, or its imaginary part when purely imaginary).
  const first = w.find((z) => !z.isZero());
  if (first && (first.re.sign() < 0 || (first.re.isZero() && first.im.sign() < 0))) w = w.map((z) => z.neg());
  return w;
}

// ---------- Floating point ----------
export const EPS = 2.220446049250313e-16;
export type C = { re: number; im: number };
const cabs = (z: C) => Math.hypot(z.re, z.im);

function hessenberg(A: M): M {
  const n = A.length, H = A.map((r) => r.slice());
  for (let k = 0; k < n - 2; k++) {
    let alpha = 0;
    for (let i = k + 1; i < n; i++) alpha += H[i][k] ** 2;
    alpha = Math.sqrt(alpha);
    if (alpha === 0) continue;
    if (H[k + 1][k] > 0) alpha = -alpha;
    const v = Array(n).fill(0);
    v[k + 1] = H[k + 1][k] - alpha;
    for (let i = k + 2; i < n; i++) v[i] = H[i][k];
    const vv = v.reduce((s, x) => s + x * x, 0);
    if (vv === 0) continue;
    // H = (I − 2vvᵀ/vv) H (I − 2vvᵀ/vv)
    for (let j = 0; j < n; j++) { let s = 0; for (let i = k + 1; i < n; i++) s += v[i] * H[i][j]; s = (2 * s) / vv; for (let i = k + 1; i < n; i++) H[i][j] -= s * v[i]; }
    for (let i = 0; i < n; i++) { let s = 0; for (let j = k + 1; j < n; j++) s += H[i][j] * v[j]; s = (2 * s) / vv; for (let j = k + 1; j < n; j++) H[i][j] -= s * v[j]; }
    for (let i = k + 2; i < n; i++) H[i][k] = 0;
  }
  return H;
}

/** Eigenvalues of a real square matrix by Hessenberg reduction and shifted complex QR (Wilkinson shifts). */
export function eigenvalues(A: M): C[] {
  const n = A.length;
  const H0 = hessenberg(A);
  const Hr = H0.map((r) => r.slice()), Hi = H0.map((r) => r.map(() => 0));
  const norm = Math.max(1e-300, ...A.map((r) => r.reduce((s, x) => s + Math.abs(x), 0)));
  const out: C[] = [];
  let hi = n - 1, iter = 0, total = 0;
  const abs = (i: number, j: number) => Math.hypot(Hr[i][j], Hi[i][j]);
  while (hi >= 0) {
    if (hi === 0) { out.push({ re: Hr[0][0], im: Hi[0][0] }); hi--; continue; }
    let l = hi;
    for (; l > 0; l--) {
      let s = abs(l - 1, l - 1) + abs(l, l);
      if (s === 0) s = norm;
      if (abs(l, l - 1) <= EPS * s) { Hr[l][l - 1] = 0; Hi[l][l - 1] = 0; break; }
    }
    if (l === hi) { out.push({ re: Hr[hi][hi], im: Hi[hi][hi] }); hi--; iter = 0; continue; }
    if (++total > 300 * n) throw new Error('The eigenvalue search did not settle. Try rounding the entries.');
    iter++;
    // Wilkinson shift: eigenvalue of the trailing 2 × 2 closest to its bottom-right entry.
    const a = { re: Hr[hi - 1][hi - 1], im: Hi[hi - 1][hi - 1] }, b = { re: Hr[hi - 1][hi], im: Hi[hi - 1][hi] };
    const c = { re: Hr[hi][hi - 1], im: Hi[hi][hi - 1] }, d = { re: Hr[hi][hi], im: Hi[hi][hi] };
    let mu: C;
    if (iter % 11 === 10) {
      // Exceptional shift to break cycles.
      mu = { re: d.re + 0.75 * Math.abs(Hr[hi][hi - 1]) + 1e-3 * norm, im: d.im + 0.5 * Math.abs(Hr[hi][hi - 1]) };
    } else {
      const h = { re: (a.re - d.re) / 2, im: (a.im - d.im) / 2 };
      const bc = { re: b.re * c.re - b.im * c.im, im: b.re * c.im + b.im * c.re };
      const disc = csqrt({ re: h.re * h.re - h.im * h.im + bc.re, im: 2 * h.re * h.im + bc.im });
      const mid = { re: (a.re + d.re) / 2, im: (a.im + d.im) / 2 };
      const m1 = { re: mid.re + disc.re, im: mid.im + disc.im }, m2 = { re: mid.re - disc.re, im: mid.im - disc.im };
      mu = cabs({ re: m1.re - d.re, im: m1.im - d.im }) <= cabs({ re: m2.re - d.re, im: m2.im - d.im }) ? m1 : m2;
    }
    for (let k = l; k <= hi; k++) { Hr[k][k] -= mu.re; Hi[k][k] -= mu.im; }
    const rots: [C, C][] = [];
    for (let k = l; k < hi; k++) {
      const x = { re: Hr[k][k], im: Hi[k][k] }, y = { re: Hr[k + 1][k], im: Hi[k + 1][k] };
      const r = Math.hypot(x.re, x.im, y.re, y.im);
      const cc = r === 0 ? { re: 1, im: 0 } : { re: x.re / r, im: x.im / r }, ss = r === 0 ? { re: 0, im: 0 } : { re: y.re / r, im: y.im / r };
      rots.push([cc, ss]);
      // rows k, k+1: new_k = conj(c) row_k + conj(s) row_k1 ; new_k1 = −s row_k + c row_k1
      for (let j = k; j <= hi; j++) {
        const p = { re: Hr[k][j], im: Hi[k][j] }, q = { re: Hr[k + 1][j], im: Hi[k + 1][j] };
        Hr[k][j] = cc.re * p.re + cc.im * p.im + ss.re * q.re + ss.im * q.im;
        Hi[k][j] = cc.re * p.im - cc.im * p.re + ss.re * q.im - ss.im * q.re;
        Hr[k + 1][j] = -(ss.re * p.re - ss.im * p.im) + (cc.re * q.re - cc.im * q.im);
        Hi[k + 1][j] = -(ss.re * p.im + ss.im * p.re) + (cc.re * q.im + cc.im * q.re);
      }
    }
    rots.forEach(([cc, ss], idx) => {
      const k = l + idx;
      // columns k, k+1: new_k = col_k c + col_k1 s ; new_k1 = −col_k conj(s) + col_k1 conj(c)
      for (let i = l; i <= Math.min(k + 2, hi); i++) {
        const p = { re: Hr[i][k], im: Hi[i][k] }, q = { re: Hr[i][k + 1], im: Hi[i][k + 1] };
        Hr[i][k] = p.re * cc.re - p.im * cc.im + q.re * ss.re - q.im * ss.im;
        Hi[i][k] = p.re * cc.im + p.im * cc.re + q.re * ss.im + q.im * ss.re;
        Hr[i][k + 1] = -(p.re * ss.re + p.im * ss.im) + (q.re * cc.re + q.im * cc.im);
        Hi[i][k + 1] = -(p.im * ss.re - p.re * ss.im) + (q.im * cc.re - q.re * cc.im);
      }
    });
    for (let k = l; k <= hi; k++) { Hr[k][k] += mu.re; Hi[k][k] += mu.im; }
  }
  // Real input: clean tiny imaginary parts and make conjugate pairs exact.
  const tol = 1e-10 * norm;
  for (const z of out) if (Math.abs(z.im) <= tol) z.im = 0;
  const used = new Set<number>();
  for (let i = 0; i < out.length; i++) {
    if (out[i].im <= 0 || used.has(i)) continue;
    let best = -1, bd = Infinity;
    for (let j = 0; j < out.length; j++) { if (j === i || used.has(j) || out[j].im >= 0) continue; const dd = Math.hypot(out[j].re - out[i].re, out[j].im + out[i].im); if (dd < bd) { bd = dd; best = j; } }
    if (best >= 0) { const re = (out[i].re + out[best].re) / 2, im = (out[i].im - out[best].im) / 2; out[i] = { re, im }; out[best] = { re, im: -im }; used.add(i); used.add(best); }
  }
  return out.sort((p, q) => q.re - p.re || q.im - p.im);
}
function csqrt(z: C): C {
  const r = Math.hypot(z.re, z.im);
  if (r === 0) return { re: 0, im: 0 };
  const re = Math.sqrt((r + z.re) / 2), im = Math.sqrt(Math.max(0, (r - z.re) / 2));
  return { re, im: z.im < 0 ? -im : im };
}

/** Null space of a complex matrix with complete pivoting and a relative tolerance. */
function complexNull(Ar: M, Ai: M, tol: number): C[][] {
  const m = Ar.length, n = Ar[0].length;
  const R = Ar.map((r) => r.slice()), I = Ai.map((r) => r.slice());
  const colOrder = Array.from({ length: n }, (_, j) => j);
  const scale = Math.max(1e-300, ...R.flatMap((r, i) => r.map((x, j) => Math.hypot(x, I[i][j]))));
  let rk = 0;
  for (; rk < Math.min(m, n); rk++) {
    let bi = -1, bj = -1, bv = 0;
    for (let i = rk; i < m; i++) for (let j = rk; j < n; j++) { const v = Math.hypot(R[i][j], I[i][j]); if (v > bv) { bv = v; bi = i; bj = j; } }
    if (bv <= tol * scale) break;
    [R[bi], R[rk]] = [R[rk], R[bi]]; [I[bi], I[rk]] = [I[rk], I[bi]];
    for (const X of [R, I]) for (const row of X) [row[bj], row[rk]] = [row[rk], row[bj]];
    [colOrder[bj], colOrder[rk]] = [colOrder[rk], colOrder[bj]];
    const pr = R[rk][rk], pi = I[rk][rk], pd = pr * pr + pi * pi;
    for (let i = rk + 1; i < m; i++) {
      // f = M[i][rk] / pivot
      const fr = (R[i][rk] * pr + I[i][rk] * pi) / pd, fi = (I[i][rk] * pr - R[i][rk] * pi) / pd;
      for (let j = rk; j < n; j++) { const xr = R[rk][j], xi = I[rk][j]; R[i][j] -= fr * xr - fi * xi; I[i][j] -= fr * xi + fi * xr; }
    }
  }
  const basis: C[][] = [];
  for (let f = rk; f < n; f++) {
    const y: C[] = Array.from({ length: n }, (_, j) => ({ re: j === f ? 1 : 0, im: 0 }));
    for (let i = rk - 1; i >= 0; i--) {
      let sr = 0, si = 0;
      for (let j = i + 1; j < n; j++) { sr += R[i][j] * y[j].re - I[i][j] * y[j].im; si += R[i][j] * y[j].im + I[i][j] * y[j].re; }
      const pr = R[i][i], pi = I[i][i], pd = pr * pr + pi * pi;
      y[i] = { re: -(sr * pr + si * pi) / pd, im: -(si * pr - sr * pi) / pd };
    }
    const v: C[] = Array(n);
    colOrder.forEach((orig, j) => { v[orig] = y[j]; });
    basis.push(v);
  }
  return basis;
}
function normalise(v: C[]): C[] {
  const nn = Math.hypot(...v.map((z) => Math.hypot(z.re, z.im)));
  // Largest entry made real and positive, then unit length.
  let big = v[0];
  for (const z of v) if (cabs(z) > cabs(big) + 1e-12) big = z;
  const b = cabs(big), ph = { re: big.re / b, im: -big.im / b };
  return v.map((z) => ({ re: (z.re * ph.re - z.im * ph.im) / nn, im: (z.re * ph.im + z.im * ph.re) / nn }));
}
function orthonormal(vs: C[][]): C[][] {
  const out: C[][] = [];
  for (const v0 of vs) {
    let v = v0.map((z) => ({ ...z }));
    for (const u of out) {
      // v −= (uᴴ v) u
      let dr = 0, di = 0;
      u.forEach((a, i) => { dr += a.re * v[i].re + a.im * v[i].im; di += a.re * v[i].im - a.im * v[i].re; });
      v = v.map((z, i) => ({ re: z.re - (dr * u[i].re - di * u[i].im), im: z.im - (dr * u[i].im + di * u[i].re) }));
    }
    const nn = Math.hypot(...v.map(cabs));
    if (nn > 1e-8) out.push(normalise(v));
  }
  return out;
}

export type Eigen = {
  value: C;
  /** The exact value, when it is a fraction (or a complex number with fraction parts) that solves det(λI − A) = 0 exactly. */
  exact?: QC;
  algebraic: number;
  /** Unit eigenvectors (an orthonormal basis of the eigenspace). */
  vectors: C[][];
  /** The same eigenvectors in smallest whole numbers, when the eigenvalue is exact. */
  exactVectors?: QC[][];
};

/** Eigenvalues with multiplicities and eigenvectors. Exact values and vectors when the eigenvalue is a fraction. */
export function eigen(A: QM): { poly: Q[]; eigs: Eigen[] } {
  if (!isSquare(A)) throw new Error(`Only square matrices have eigenvalues; this one is ${A.length} × ${A[0].length}.`);
  const n = A.length, F = toFloat(A);
  const poly = charPoly(A);
  const vals = eigenvalues(F);
  const norm = Math.max(1, ...F.map((r) => r.reduce((s, x) => s + Math.abs(x), 0)));
  const taken = Array(vals.length).fill(false);
  const eigs: Eigen[] = [];
  // 1. Exact eigenvalues: round to a nearby fraction, keep it only if it solves the characteristic polynomial exactly.
  for (let i = 0; i < vals.length; i++) {
    if (taken[i]) continue;
    const z = vals[i];
    const cands = [1000, 100, 12].map((md) => new QC(nearestFraction(z.re, md), nearestFraction(z.im, md)));
    let ex: QC | null = null;
    for (const c of cands) {
      const close = Math.hypot(c.re.toNumber() - z.re, c.im.toNumber() - z.im) < 1e-4 * (1 + Math.hypot(z.re, z.im));
      if (close && polyEvalC(poly, c).isZero()) { ex = c; break; }
    }
    if (!ex) continue;
    let mult = 0, p = poly;
    while (p.length > 1 && polyEvalC(p, ex).isZero()) { mult++; p = polyDeriv(p); }
    // Claim the `mult` computed values closest to it.
    const exN = { re: ex.re.toNumber(), im: ex.im.toNumber() };
    const order = vals.map((v, j) => [j, Math.hypot(v.re - exN.re, v.im - exN.im)] as const).filter(([j]) => !taken[j]).sort((a, b) => a[1] - b[1]).slice(0, mult);
    order.forEach(([j]) => { taken[j] = true; });
    const Ae = A.map((r, a) => r.map((x, b) => new QC(a === b ? x.sub(ex!.re) : x, a === b ? ex!.im.neg() : Q.ZERO)));
    const exactVectors = nullSpaceQC(Ae).map(cleanVector);
    const vectors = orthonormal(exactVectors.map((v) => v.map((zz) => ({ re: zz.re.toNumber(), im: zz.im.toNumber() }))));
    eigs.push({ value: exN, exact: ex, algebraic: mult, vectors, exactVectors });
  }
  // 2. The rest, in floating point: cluster near-equal values, then the null space of A − λI.
  for (let i = 0; i < vals.length; i++) {
    if (taken[i]) continue;
    const group = [i];
    taken[i] = true;
    for (let j = i + 1; j < vals.length; j++) if (!taken[j] && Math.hypot(vals[j].re - vals[i].re, vals[j].im - vals[i].im) < 1e-6 * norm) { group.push(j); taken[j] = true; }
    const lam = { re: group.reduce((s, j) => s + vals[j].re, 0) / group.length, im: group.reduce((s, j) => s + vals[j].im, 0) / group.length };
    const Ar = F.map((r, a) => r.map((x, b) => (a === b ? x - lam.re : x)));
    const Ai = F.map((r, a) => r.map((_, b) => (a === b ? -lam.im : 0)));
    let basis: C[][] = [];
    for (const tol of [1e-11, 1e-9, 1e-7, 1e-5]) { basis = complexNull(Ar, Ai, tol); if (basis.length) break; }
    eigs.push({ value: lam, algebraic: group.length, vectors: orthonormal(basis.slice(0, group.length)) });
  }
  eigs.sort((p, q) => q.value.re - p.value.re || q.value.im - p.value.im);
  if (eigs.reduce((s, e) => s + e.algebraic, 0) !== n) throw new Error('Eigenvalue count mismatch');
  return { poly, eigs };
}

/** Householder QR: A (m × n) = Q R with Q m × k orthonormal columns, R k × n upper triangular, k = min(m, n); R's diagonal made ≥ 0. */
export function qr(A: M): { Q: M; R: M } {
  const m = A.length, n = A[0].length, k = Math.min(m, n);
  const Rm = A.map((r) => r.slice());
  const Qf: M = Array.from({ length: m }, (_, i) => Array.from({ length: m }, (_, j) => (i === j ? 1 : 0)));
  for (let c = 0; c < Math.min(m - 1, n); c++) {
    let alpha = 0;
    for (let i = c; i < m; i++) alpha += Rm[i][c] ** 2;
    alpha = Math.sqrt(alpha);
    if (alpha === 0) continue;
    if (Rm[c][c] > 0) alpha = -alpha;
    const v = Array(m).fill(0);
    v[c] = Rm[c][c] - alpha;
    for (let i = c + 1; i < m; i++) v[i] = Rm[i][c];
    const vv = v.reduce((s, x) => s + x * x, 0);
    if (vv === 0) continue;
    for (let j = 0; j < n; j++) { let s = 0; for (let i = c; i < m; i++) s += v[i] * Rm[i][j]; s = (2 * s) / vv; for (let i = c; i < m; i++) Rm[i][j] -= s * v[i]; }
    for (let i = 0; i < m; i++) { let s = 0; for (let j = c; j < m; j++) s += Qf[i][j] * v[j]; s = (2 * s) / vv; for (let j = c; j < m; j++) Qf[i][j] -= s * v[j]; }
    for (let i = c + 1; i < m; i++) Rm[i][c] = 0;
  }
  const Qk = Qf.map((r) => r.slice(0, k)), Rk = Rm.slice(0, k);
  for (let i = 0; i < k; i++) if (Rk[i][i] < 0) { Rk[i] = Rk[i].map((x) => -x); for (const r of Qk) r[i] = -r[i]; }
  return { Q: Qk, R: Rk };
}

/** Cholesky A = L Lᵀ for a symmetric positive definite matrix. Throws a plain message otherwise. */
export function cholesky(A: QM): M {
  if (!isSquare(A)) throw new Error('Cholesky needs a square matrix.');
  if (!qSymmetric(A)) throw new Error('Cholesky needs a symmetric matrix (A equal to its transpose); this one is not.');
  const F = toFloat(A), n = F.length, L: M = F.map((r) => r.map(() => 0));
  for (let j = 0; j < n; j++) {
    let s = F[j][j];
    for (let k = 0; k < j; k++) s -= L[j][k] ** 2;
    if (!(s > 1e-12 * Math.max(1, Math.abs(F[j][j])))) throw new Error(`A is not positive definite (the pivot in row ${j + 1} is ${s <= 0 ? 'zero or negative' : 'zero'}), so it has no Cholesky factor. Try LU instead.`);
    L[j][j] = Math.sqrt(s);
    for (let i = j + 1; i < n; i++) { let t = F[i][j]; for (let k = 0; k < j; k++) t -= L[i][k] * L[j][k]; L[i][j] = t / L[j][j]; }
  }
  return L;
}

/** Thin SVD by one-sided Jacobi: A = U Σ Vᵀ, U m × k, Σ k values (largest first), V n × k, k = min(m, n). */
export function svd(A: M): { U: M; S: number[]; V: M } {
  const m = A.length, n = A[0].length;
  if (m < n) { const r = svd(transpose(A)); return { U: r.V, S: r.S, V: r.U }; }
  const W = A.map((r) => r.slice());
  const V: M = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  for (let sweep = 0; sweep < 80; sweep++) {
    let off = 0;
    for (let p = 0; p < n - 1; p++) for (let q = p + 1; q < n; q++) {
      let a = 0, b = 0, g = 0;
      for (let i = 0; i < m; i++) { a += W[i][p] ** 2; b += W[i][q] ** 2; g += W[i][p] * W[i][q]; }
      if (g === 0 || Math.abs(g) <= EPS * Math.sqrt(a * b)) continue;
      off = Math.max(off, Math.abs(g) / Math.sqrt(a * b));
      const zeta = (b - a) / (2 * g);
      const t = Math.sign(zeta || 1) / (Math.abs(zeta) + Math.sqrt(1 + zeta * zeta));
      const c = 1 / Math.sqrt(1 + t * t), s = c * t;
      for (let i = 0; i < m; i++) { const x = W[i][p], y = W[i][q]; W[i][p] = c * x - s * y; W[i][q] = s * x + c * y; }
      for (let i = 0; i < n; i++) { const x = V[i][p], y = V[i][q]; V[i][p] = c * x - s * y; V[i][q] = s * x + c * y; }
    }
    if (off <= EPS * 4) break;
  }
  const S = Array.from({ length: n }, (_, j) => Math.hypot(...W.map((r) => r[j])));
  const order = S.map((s, j) => [s, j] as const).sort((a, b) => b[0] - a[0]).map(([, j]) => j);
  const Ss = order.map((j) => S[j]);
  const tol = Math.max(m, n) * EPS * (Ss[0] || 0);
  const Ucols: number[][] = [];
  order.forEach((j, idx) => {
    if (Ss[idx] > tol) Ucols.push(W.map((r) => r[j] / Ss[idx]));
    else {
      // Complete U with a unit vector orthogonal to the columns found so far.
      for (let e = 0; e < m; e++) {
        let v = Array.from({ length: m }, (_, i) => (i === e ? 1 : 0));
        for (const u of Ucols) { const d = u.reduce((s, x, i) => s + x * v[i], 0); v = v.map((x, i) => x - d * u[i]); }
        const nn = Math.hypot(...v);
        if (nn > 1e-6) { Ucols.push(v.map((x) => x / nn)); break; }
      }
    }
  });
  const U = Array.from({ length: m }, (_, i) => Ucols.map((c) => c[i]));
  const Vs = V.map((r) => order.map((j) => r[j]));
  // Signs: largest entry of each right singular vector positive (any sign is valid; this keeps results stable).
  for (let k = 0; k < n; k++) {
    let big = 0;
    for (let i = 0; i < n; i++) if (Math.abs(Vs[i][k]) > Math.abs(big) + 1e-12) big = Vs[i][k];
    if (big < 0) { for (const r of Vs) r[k] = -r[k]; for (const r of U) r[k] = -r[k]; }
  }
  return { U, S: Ss, V: Vs };
}

export const fMul = (A: M, B: M): M => A.map((r) => B[0].map((_, j) => r.reduce((s, x, k) => s + x * B[k][j], 0)));
export const maxDiff = (A: M, B: M) => Math.max(...A.flatMap((r, i) => r.map((x, j) => Math.abs(x - B[i][j]))));

// ---------- Text ----------
/** A float to n significant figures without "−0" and with a real minus sign (ascii=true for CSV). */
export function fmt(x: number, n = 6, ascii = false): string {
  if (!Number.isFinite(x)) return String(x);
  if (Math.abs(x) < 1e-12) return '0';
  let s = Number(x.toPrecision(n)).toString();
  if (/e/.test(s)) { const [mm, e] = s.split('e'); s = `${mm}e${Number(e)}`; }
  return ascii ? s : s.replace('-', '−');
}
/** A complex number like "2 + 1.5i", "−i", "3". Parts below `zero` (relative) are dropped. */
export function fmtC(z: C, n = 6, ascii = false): string {
  const scale = Math.max(1, Math.hypot(z.re, z.im)), re = Math.abs(z.re) < 1e-12 * scale ? 0 : z.re, im = Math.abs(z.im) < 1e-12 * scale ? 0 : z.im;
  if (im === 0) return fmt(re, n, ascii);
  const m = ascii ? '-' : '−';
  const ims = fmt(Math.abs(im), n, ascii), ip = ims === '1' ? 'i' : `${ims}i`;
  if (re === 0) return (im < 0 ? m : '') + ip;
  return `${fmt(re, n, ascii)} ${im < 0 ? m : '+'} ${ip}`;
}
export function fmtQC(z: QC, ascii = false): string {
  if (z.im.isZero()) return z.re.toString(ascii);
  const m = ascii ? '-' : '−';
  const ia = z.im.abs(), ip = ia.isOne() ? 'i' : ia.d === 1n ? `${ia.toString()}i` : `(${ia.toString()})i`;
  if (z.re.isZero()) return (z.im.sign() < 0 ? m : '') + ip;
  return `${z.re.toString(ascii)} ${z.im.sign() < 0 ? m : '+'} ${ip}`;
}
/** A fraction as a decimal to n significant figures. */
export const qDec = (q: Q, n = 6, ascii = false) => fmt(q.toNumber(), n, ascii);
