// Exact decimal digits for the number line zoom (Learn): square roots by integer square root, fractions by long
// division and π from its known digits, all with BigInt so the zoom stays exact however deep it goes. Also the
// decimal detective: does p/q terminate or repeat, and with what period. No DOM.
import { gcd, primeFactors } from './smath.ts';

export type Target = { kind: 'sqrt'; n: number } | { kind: 'frac'; p: number; q: number } | { kind: 'pi' };

/** π to 60 decimal places (a mathematical constant). */
export const PI_DIGITS = '3.141592653589793238462643383279502884197169399375105820974944';

/** Integer square root: the largest r with r² ≤ n. */
export function isqrt(n: bigint): bigint {
  if (n < 0n) throw new Error('negative');
  if (n < 2n) return n;
  // Newton's method from above: x falls to floor(√n) and stops.
  let x = 1n << BigInt(Math.ceil(n.toString(2).length / 2) + 1);
  for (;;) { const y = (x + n / x) >> 1n; if (y >= x) break; x = y; }
  while (x * x > n) x--;
  while ((x + 1n) * (x + 1n) <= n) x++;
  return x;
}

const TEN = (k: number) => 10n ** BigInt(k);

/** floor(x × 10^k) exactly, for x ≥ 0. */
export function scaled(t: Target, k: number): bigint {
  if (t.kind === 'sqrt') return isqrt(BigInt(t.n) * TEN(2 * k));
  if (t.kind === 'frac') return (BigInt(t.p) * TEN(k)) / BigInt(t.q);
  const d = PI_DIGITS.replace('.', '');
  if (k > d.length - 1) throw new Error('π is only stored to 60 places');
  return BigInt(d.slice(0, k + 1));
}

/** Is x exactly L/10^k (the zoom lands on a mark)? */
export function exactAt(t: Target, k: number): boolean {
  const L = scaled(t, k);
  if (t.kind === 'sqrt') return L * L === BigInt(t.n) * TEN(2 * k);
  if (t.kind === 'frac') return L * BigInt(t.q) === BigInt(t.p) * TEN(k);
  return false;
}

/** L/10^k as a decimal string with exactly k places. */
export function dec(L: bigint, k: number): string {
  const neg = L < 0n; if (neg) L = -L;
  const s = L.toString().padStart(k + 1, '0');
  const out = k === 0 ? s : `${s.slice(0, s.length - k)}.${s.slice(s.length - k)}`;
  return (neg ? '−' : '') + out;
}

/** Where x sits inside [L, L+1]/10^k, as a fraction from 0 to 1 (to about 6 digits). */
export function within(t: Target, k: number): number {
  const L = scaled(t, k), M = scaled(t, k + 6);
  return Number(M - L * TEN(6)) / 1e6;
}

/** The check for one zoom step, as text pieces: lower bound, upper bound and why. */
export function why(t: Target, k: number): string {
  const L = scaled(t, k), lo = dec(L, k), hi = dec(L + 1n, k);
  if (t.kind === 'sqrt') return `${lo}² = ${dec(L * L, 2 * k)} ≤ ${t.n} < ${dec((L + 1n) * (L + 1n), 2 * k)} = ${hi}²`;
  if (t.kind === 'frac') return `${lo} × ${t.q} = ${dec(L * BigInt(t.q), k)} ≤ ${t.p} < ${dec((L + 1n) * BigInt(t.q), k)} = ${hi} × ${t.q}`;
  return `the known digits of π start ${dec(L, k)}…`;
}

export const isSquare = (n: number) => { const r = isqrt(BigInt(n)); return r * r === BigInt(n); };
export const rational = (t: Target) => t.kind === 'frac' || (t.kind === 'sqrt' && isSquare(t.n));

export type DecInfo = {
  p: number; q: number;              // in lowest terms
  factors: number[];                 // prime factors of q
  terminates: boolean;
  intPart: number; pre: string; rep: string; // p/q = intPart . pre (rep)(rep)...
  steps: { r: number; d: number }[];         // long division: remainder brought down, digit written
};

/** The decimal of p/q (p ≥ 0, q > 0) by long division, with where the repeating part starts. */
export function decimalInfo(p: number, q: number): DecInfo {
  const g = gcd(p, q) || 1; p /= g; q /= g;
  const intPart = Math.floor(p / q);
  let r = p % q;
  const seen = new Map<number, number>(), digits: number[] = [], steps: { r: number; d: number }[] = [];
  while (r !== 0 && !seen.has(r)) {
    seen.set(r, digits.length);
    const d = Math.floor((r * 10) / q);
    steps.push({ r, d }); digits.push(d);
    r = (r * 10) % q;
  }
  const s = digits.join('');
  if (r === 0) return { p, q, factors: primeFactors(q), terminates: true, intPart, pre: s, rep: '', steps };
  const at = seen.get(r)!;
  return { p, q, factors: primeFactors(q), terminates: false, intPart, pre: s.slice(0, at), rep: s.slice(at), steps };
}

/** The decimal written with a bar shown as brackets: 7/12 → "0.58(3)". */
export const decText = (d: DecInfo) => `${d.intPart}${d.pre || d.rep ? '.' : ''}${d.pre}${d.rep ? `(${d.rep})` : ''}`;
