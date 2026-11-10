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
