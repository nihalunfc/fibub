// School binomial theorem (Class 11 maths): Pascal's triangle, the expansion of (ax + b)ⁿ with exact whole
// coefficients (BigInt), the general term T(r+1) = C(n, r)(ax)ⁿ⁻ʳ bʳ, the middle term(s), and the binomial
// chances behind a Galton board. Plain TypeScript, no DOM.

export function pascal(rows: number): bigint[][] {
  const t: bigint[][] = [[1n]];
  for (let n = 1; n < rows; n++) { const p = t[n - 1]; t.push([1n, ...p.slice(1).map((v, i) => v + p[i]), 1n]); }
  return t;
}
export function C(n: number, r: number): bigint {
  if (r < 0 || r > n) return 0n;
  let v = 1n; for (let i = 1; i <= r; i++) v = (v * BigInt(n - r + i)) / BigInt(i);
  return v;
}

export type Term = { r: number; coef: bigint; power: number; text: string };
const sup = (k: number) => String(k).split('').map((d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+d]).join('');
/** The term T(r+1) of (ax + b)ⁿ: C(n, r) aⁿ⁻ʳ bʳ xⁿ⁻ʳ. */
export function term(a: number, b: number, n: number, r: number): Term {
  const coef = C(n, r) * BigInt(a) ** BigInt(n - r) * BigInt(b) ** BigInt(r), power = n - r;
  return { r, coef, power, text: monomial(coef, power) };
}
export function monomial(c: bigint, p: number): string {
  const s = c < 0n ? '−' : '', m = c < 0n ? -c : c;
  if (p === 0) return s + m.toString();
  return `${s}${m === 1n ? '' : m.toString()}x${p === 1 ? '' : sup(p)}`;
}
/** Every term of (ax + b)ⁿ, highest power first, and the whole expansion as text. */
export function expand(a: number, b: number, n: number): { terms: Term[]; text: string } {
  const terms = Array.from({ length: n + 1 }, (_, r) => term(a, b, n, r));
  const nz = terms.filter((t) => t.coef !== 0n);
  const text = nz.length ? nz.map((t, i) => (i === 0 ? t.text : t.coef < 0n ? ` − ${t.text.slice(1)}` : ` + ${t.text}`)).join('') : '0';
  return { terms, text };
}
/** Which terms are the middle: one (r = n/2) when n is even, two when n is odd. Returned as r values. */
export const middle = (n: number) => (n % 2 === 0 ? [n / 2] : [(n - 1) / 2, (n + 1) / 2]);
/** Chance a Galton-board ball ends in slot k after n rows: C(n, k)/2ⁿ. */
export const galton = (n: number, k: number) => Number(C(n, k)) / 2 ** n;

// ---- Solve-my-numbers helpers (added 2026-11-16) ----

export type TermFind =
  | { ok: true; r: number; coef: bigint; power: number; count: number }
  | { ok: false; reason: 'none' | 'same' | 'bad' };
/**
 * In (a·xᵖ + b·x^q)ⁿ, the term with xᵏ: T(r+1) = C(n, r) aⁿ⁻ʳ bʳ x^(p(n−r) + q·r).
 * Needs p(n − r) + q·r = k, so r = (p·n − k)/(p − q); it must be a whole number from 0 to n.
 * When p = q every term has the same power, so there is one power only (count = n + 1 terms add up).
 */
export function findTerm(a: number, b: number, n: number, p: number, q: number, k: number): TermFind {
  if (![a, b, n, p, q, k].every(Number.isInteger) || n < 0 || n > 60) return { ok: false, reason: 'bad' };
  if (p === q) {
    if (k !== p * n) return { ok: false, reason: 'none' };
    return { ok: true, r: 0, coef: (BigInt(a) + BigInt(b)) ** BigInt(n), power: k, count: n + 1 };
  }
  const num = p * n - k, den = p - q;
  if (num % den !== 0) return { ok: false, reason: 'none' };
  const r = num / den;
  if (r < 0 || r > n) return { ok: false, reason: 'none' };
  return { ok: true, r, coef: C(n, r) * BigInt(a) ** BigInt(n - r) * BigInt(b) ** BigInt(r), power: p * (n - r) + q * r, count: 1 };
}
