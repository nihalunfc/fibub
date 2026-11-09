// Exact counting with BigInt: factorials, permutations and combinations (with and without repetition),
// multinomial coefficients, Stirling numbers of both kinds, Lah numbers, Bell, Catalan and Fibonacci-free
// classics: integer partitions p(n) and into k parts, derangements. Plain TypeScript, no DOM.
// Checked against sympy in tests/sci-tools/combinatorics-calculator.mjs.

export const LIMIT = { n: 5000, triangle: 400, bell: 400, partitions: 20000 };
const need = (ok: boolean, msg: string) => { if (!ok) throw new Error(msg); };
const nat = (x: number, name: string, max: number) => need(Number.isInteger(x) && x >= 0 && x <= max, `${name} must be a whole number from 0 to ${max}.`);

export function factorial(n: number): bigint { nat(n, 'n', 20000); let f = 1n; for (let k = 2n; k <= BigInt(n); k++) f *= k; return f; }
/** Falling factorial n(n−1)…(n−k+1): ordered selections of k from n without repetition, nPk. */
export function permutations(n: number, k: number): bigint { nat(n, 'n', LIMIT.n); nat(k, 'k', LIMIT.n); if (k > n) return 0n; let p = 1n; for (let i = 0; i < k; i++) p *= BigInt(n - i); return p; }
/** Binomial coefficient n choose k. */
export function choose(n: number, k: number): bigint {
  nat(n, 'n', 2 * LIMIT.n); nat(k, 'k', 2 * LIMIT.n);
  if (k > n) return 0n;
  k = Math.min(k, n - k); let c = 1n;
  for (let i = 1; i <= k; i++) c = (c * BigInt(n - k + i)) / BigInt(i);
  return c;
}
/** Unordered selections of k from n kinds with repetition: C(n + k − 1, k). */
export function multichoose(n: number, k: number): bigint { nat(n, 'n', LIMIT.n); nat(k, 'k', LIMIT.n); if (n === 0) return k === 0 ? 1n : 0n; return choose(n + k - 1, k); }
/** Ordered selections of k from n with repetition: n^k. */
export function power(n: number, k: number): bigint { nat(n, 'n', LIMIT.n); nat(k, 'k', LIMIT.n); return BigInt(n) ** BigInt(k); }
/** Multinomial coefficient (k1 + … + km)! / (k1! … km!). */
export function multinomial(ks: number[]): bigint {
  need(ks.length > 0, 'Type at least one group size.');
  ks.forEach((k) => nat(k, 'Each group size', LIMIT.n));
  let total = 0, m = 1n;
  for (const k of ks) { total += k; need(total <= LIMIT.n, `The group sizes may add up to ${LIMIT.n} at most.`); m *= choose(total, k); }
  return m;
}
/** Rows 0..N of a triangle T(n, k), 0 ≤ k ≤ n, from a recurrence. */
function triangle(N: number, rec: (n: number, k: number, prev: bigint[]) => bigint): bigint[][] {
  const rows: bigint[][] = [[1n]];
  for (let n = 1; n <= N; n++) { const prev = rows[n - 1], row: bigint[] = []; for (let k = 0; k <= n; k++) row.push(rec(n, k, prev)); rows.push(row); }
  return rows;
}
const at = (r: bigint[], k: number) => (k >= 0 && k < r.length ? r[k] : 0n);
export const pascal = (N: number) => { nat(N, 'Rows', LIMIT.triangle); return triangle(N, (n, k, p) => at(p, k - 1) + at(p, k)); };
/** Unsigned Stirling numbers of the first kind c(n, k): permutations of n with k cycles. */
export const stirling1 = (N: number) => { nat(N, 'n', LIMIT.triangle); return triangle(N, (n, k, p) => at(p, k - 1) + BigInt(n - 1) * at(p, k)); };
/** Stirling numbers of the second kind S(n, k): ways to split n things into k non-empty groups. */
export const stirling2 = (N: number) => { nat(N, 'n', LIMIT.triangle); return triangle(N, (n, k, p) => at(p, k - 1) + BigInt(k) * at(p, k)); };
/** Unsigned Lah numbers L(n, k): ways to split n things into k non-empty ordered lists. */
export const lah = (N: number) => { nat(N, 'n', LIMIT.triangle); return triangle(N, (n, k, p) => at(p, k - 1) + BigInt(n - 1 + k) * at(p, k)); };
/** Partitions of n into exactly k parts, p(n, k) = p(n − 1, k − 1) + p(n − k, k). */
export function partitionsK(N: number): bigint[][] {
  nat(N, 'n', LIMIT.triangle);
  const T: bigint[][] = Array.from({ length: N + 1 }, (_, n) => new Array<bigint>(n + 1).fill(0n));
  T[0][0] = 1n;
  for (let n = 1; n <= N; n++) for (let k = 1; k <= n; k++) T[n][k] = T[n - 1][k - 1] + (n - k >= k ? T[n - k][k] : 0n);
  return T;
}
export const signedStirling1 = (n: number, k: number) => { const c = stirling1(n)[n][k] ?? 0n; return (n - k) % 2 ? -c : c; };

/** Bell numbers B(0..N) by the Bell triangle. */
export function bell(N: number): bigint[] {
  nat(N, 'n', LIMIT.bell);
  const out = [1n]; let row = [1n];
  for (let n = 1; n <= N; n++) { const next = [row[row.length - 1]]; for (const x of row) next.push(next[next.length - 1] + x); out.push(next[0]); row = next; }
  return out;
}
/** Catalan numbers C(0..N). */
export function catalan(N: number): bigint[] { nat(N, 'n', LIMIT.n); const c = [1n]; for (let n = 0; n < N; n++) c.push((c[n] * BigInt(2 * (2 * n + 1))) / BigInt(n + 2)); return c; }
/** Partition numbers p(0..N) by Euler's pentagonal number theorem. */
export function partitions(N: number): bigint[] {
  nat(N, 'n', LIMIT.partitions);
  const p = [1n];
  for (let n = 1; n <= N; n++) {
    let s = 0n;
    for (let j = 1; ; j++) {
      const g1 = (j * (3 * j - 1)) / 2; if (g1 > n) break;
      const sg = j % 2 ? 1n : -1n;
      s += sg * p[n - g1];
      const g2 = (j * (3 * j + 1)) / 2; if (g2 <= n) s += sg * p[n - g2];
    }
    p.push(s);
  }
  return p;
}
/** Derangements !n (permutations with no fixed point), 0..N: !n = (n − 1)(!(n−1) + !(n−2)). */
export function derangements(N: number): bigint[] { nat(N, 'n', LIMIT.n); const d = [1n, 0n]; for (let n = 2; n <= N; n++) d.push(BigInt(n - 1) * (d[n - 1] + d[n - 2])); return d.slice(0, N + 1); }

/** A big number for reading: full if short, otherwise the first and last digits and the digit count. */
export function shortNum(x: bigint, max = 60): string {
  const neg = x < 0n, s = (neg ? -x : x).toString();
  const g = (t: string) => t.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const body = s.length <= max ? g(s) : `${s.slice(0, 20)}…${s.slice(-12)} (${s.length} digits)`;
  return (neg ? '−' : '') + body;
}
/** Scientific form, e.g. 9.33262 × 10^157. */
export function sci(x: bigint, digits = 6): string {
  const neg = x < 0n, s = (neg ? -x : x).toString();
  if (s.length <= digits) return (neg ? '−' : '') + s;
  let m = Number(s.slice(0, digits + 1)), e = s.length - 1;
  m = Math.round(m / 10); // rounded to `digits` significant digits
  let t = String(m);
  if (t.length > digits) { t = t.slice(0, digits); e++; }
  return `${neg ? '−' : ''}${t[0]}.${t.slice(1)} × 10^${e}`;
}
