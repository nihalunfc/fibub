// Geometric progressions for school (Class 11 sequences and series): nth term, sum of n terms, sum to infinity,
// arithmetic, geometric and harmonic means, and money that grows or shrinks by a fixed percentage. No DOM.

/** The kth term (k from 1) of a GP with first term a and ratio r: a r^(k−1). */
export const term = (a: number, r: number, k: number) => a * r ** (k - 1);

/** The first n terms. */
export const terms = (a: number, r: number, n: number) => Array.from({ length: n }, (_, i) => term(a, r, i + 1));

/** Sum of the first n terms: a(rⁿ − 1)/(r − 1), or n a when r = 1. */
export function sumN(a: number, r: number, n: number): number {
  if (r === 1) return n * a;
  return (a * (r ** n - 1)) / (r - 1);
}

/** Sum to infinity a/(1 − r) when |r| < 1, otherwise NaN (no finite sum unless a = 0). */
export function sumInf(a: number, r: number): number {
  if (a === 0) return 0;
  return Math.abs(r) < 1 ? a / (1 - r) : NaN;
}

/** The common ratio from two consecutive terms (NaN if the first is 0). */
export const ratioOf = (t1: number, t2: number) => (t1 === 0 ? NaN : t2 / t1);

/** Arithmetic, geometric and harmonic means of two positive numbers. */
export const am = (a: number, b: number) => (a + b) / 2;
export const gm = (a: number, b: number) => Math.sqrt(a * b);
export const hm = (a: number, b: number) => (2 * a * b) / (a + b);

/** Insert m geometric means between a and b (both positive): the ratio and the means. */
export function insertGMs(a: number, b: number, m: number): { r: number; means: number[] } {
  const r = (b / a) ** (1 / (m + 1));
  return { r, means: Array.from({ length: m }, (_, i) => a * r ** (i + 1)) };
}

/** Value each year for `years` years when it grows (rate > 0) or shrinks (rate < 0) by `rate` % a year. Index 0 is the start. */
export const yearly = (p: number, rate: number, years: number) => Array.from({ length: years + 1 }, (_, k) => p * (1 + rate / 100) ** k);

/** How many whole years until the value first reaches `target` (grow) or falls to it (shrink); Infinity if never. */
export function yearsTo(p: number, rate: number, target: number): number {
  const r = 1 + rate / 100;
  if (r <= 0 || r === 1 || p <= 0 || target <= 0) return Infinity;
  if ((r > 1 && target <= p) || (r < 1 && target >= p)) return 0;
  if ((r > 1) !== (target > p)) return Infinity;
  const k = Math.log(target / p) / Math.log(r);
  return Math.ceil(k - 1e-9);
}

/** Read a list of terms as a GP: the common ratio, or null if the terms are not a GP (needs 2 terms, a first term of 0 is not allowed). */
export function ratioOfList(xs: number[]): number | null {
  if (xs.length < 2 || xs[0] === 0) return null;
  const r = xs[1] / xs[0];
  return xs.every((x, i) => i === 0 || Math.abs(x - xs[i - 1] * r) <= 1e-9 * Math.max(1, Math.abs(x))) ? r : null;
}

/** First term and ratio(s) when the pth term is x and the qth term is y (p ≠ q). Two ratios (±) when q − p is even. */
export function fromTwoTerms(p: number, x: number, q: number, y: number): { ratios: number[]; a: number[] } | null {
  if (p === q || x === 0 || y === 0) return null;
  const gap = q - p, ratio = y / x;
  let rs: number[];
  if (Math.abs(gap) % 2 === 0) { if (ratio < 0) return null; const m = ratio ** (1 / gap); rs = [m, -m]; }
  else rs = [Math.sign(ratio) * Math.abs(ratio) ** (1 / gap)];
  return { ratios: rs, a: rs.map((r) => x / r ** (p - 1)) };
}

/** Which term of the GP equals t? The position n (a whole number or not), NaN if t is never reached. */
export function termNumber(a: number, r: number, t: number): number {
  if (a === 0 || r === 0 || r === 1 || t === 0) return NaN;
  const ratio = t / a;
  if (r > 0) return ratio > 0 ? 1 + Math.log(ratio) / Math.log(r) : NaN;
  // Negative ratio: terms alternate in sign, so only |t/a| matters and the parity must fit.
  if (ratio === 0) return NaN;
  const n = 1 + Math.log(Math.abs(ratio)) / Math.log(Math.abs(r));
  const k = Math.round(n);
  return Math.abs(n - k) < 1e-9 && (k % 2 === 1) === (ratio > 0) ? k : NaN;
}

/** How many terms are needed for the sum to reach s (|r| ≠ 1): the smallest whole n with Sn ≥ s (or ≤ s when s is negative), Infinity if never. */
export function termsForSum(a: number, r: number, s: number, cap = 100000): number {
  let sum = 0, t = a;
  for (let n = 1; n <= cap; n++) { sum += t; t *= r; if (s >= 0 ? sum >= s - 1e-12 : sum <= s + 1e-12) return n; if (!Number.isFinite(sum)) return Infinity; }
  return Infinity;
}
