// Irrational numbers for Class 9 and 10: exact digits of √n, the best fraction a/b for each b (a² never equals n·b²
// when n is not a perfect square), and the proof by contradiction that √p is irrational for a prime p, step by step.
// No DOM.
import { gcd } from './smath.ts';

/** Integer square root of a non-negative BigInt (largest r with r² ≤ n). */
export function isqrt(n: bigint): bigint {
  if (n < 0n) throw new Error('negative');
  if (n < 2n) return n;
  // Newton's method from above: x falls until x² ≤ n.
  let x = BigInt(Math.ceil(Math.sqrt(Number(n)))) + 1n;
  if (x * x <= n) x = n;                 // the float guess was too small (very big n): start from n itself
  let y = (x + n / x) / 2n;
  while (y < x) { x = y; y = (x + n / x) / 2n; }
  return x;
}

/** √n to `k` decimal places, cut off (not rounded): sqrtDigits(2, 5) = "1.41421". */
export function sqrtDigits(n: number, k: number): string {
  const r = isqrt(BigInt(n) * 10n ** BigInt(2 * k)).toString().padStart(k + 1, '0');
  return k ? `${r.slice(0, r.length - k)}.${r.slice(r.length - k)}` : r;
}

export const isSquare = (n: number) => Number.isInteger(n) && n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;
export function isPrime(n: number): boolean {
  if (!Number.isInteger(n) || n < 2) return false;
  for (let p = 2; p * p <= n; p++) if (n % p === 0) return false;
  return true;
}

/** The whole number a that makes a/b closest to √n, and how far a² is from n·b². */
export function bestFraction(n: number, b: number): { a: number; a2: number; nb2: number; diff: number } {
  const lo = Number(isqrt(BigInt(n) * BigInt(b) * BigInt(b)));
  // a/b closest to √n: compare (a + ½)² with n b² exactly, i.e. (2a + 1)² vs 4 n b².
  const a = BigInt(2 * lo + 1) ** 2n <= 4n * BigInt(n) * BigInt(b) ** 2n ? lo + 1 : lo;
  return { a, a2: a * a, nb2: n * b * b, diff: a * a - n * b * b };
}

/** A repeating decimal 0.(block) with the block repeating forever, as a fraction in lowest terms [p, q]. */
export function recurringToFraction(block: string): [number, number] {
  const p = Number(block), q = 10 ** block.length - 1, g = gcd(p, q) || 1;
  return [p / g, q / g];
}

/** The steps of the proof that √p is irrational, for a prime p. */
export function rootProof(p: number): { claim: string; why: string }[] {
  return [
    { claim: `Suppose √${p} is rational. Then √${p} = a/b for whole numbers a and b (b ≠ 0) with no common factor other than 1.`, why: 'Every fraction can be cancelled down to lowest terms. This is the assumption we will show is impossible.' },
    { claim: `Then b√${p} = a, and squaring both sides gives ${p}b² = a².`, why: 'Multiply both sides by b, then square.' },
    { claim: `So ${p} divides a², and because ${p} is prime, ${p} divides a.`, why: `If a prime divides a², it divides a. (Check: the squares of numbers not divisible by ${p} are never divisible by ${p}.)` },
    { claim: `Write a = ${p}c for some whole number c. Then ${p}b² = ${p * p}c², so b² = ${p}c².`, why: `Put a = ${p}c into ${p}b² = a² and divide both sides by ${p}.` },
    { claim: `So ${p} divides b², and therefore ${p} divides b.`, why: 'The same reason as before.' },
    { claim: `Now ${p} divides both a and b. But we said a and b have no common factor other than 1.`, why: 'This contradicts the assumption in step 1.' },
    { claim: `The assumption must be false, so √${p} is irrational.`, why: 'That is a proof by contradiction: assume the opposite and reach something impossible.' },
  ];
}

/** The steps of the proof that r + s√p is irrational (r, s whole numbers, s ≠ 0), given that √p is irrational. */
export function sumProof(p: number, r: number, s: number): { claim: string; why: string }[] {
  const m = (x: number) => (x < 0 ? `− ${-x}` : `+ ${x}`);
  const num = `x ${r < 0 ? '+' : '−'} ${Math.abs(r)}`, sd = s < 0 ? `(−${-s})` : String(s), rd = r < 0 ? `(−${-r})` : String(r);
  return [
    { claim: `Suppose ${r < 0 ? '−' + -r : r} ${m(s)}√${p} is rational. Call it x, so x = ${r < 0 ? '−' + -r : r} ${m(s)}√${p} with x rational.`, why: 'Assume the opposite of what we want to prove.' },
    { claim: `Then √${p} = (${num}) / ${sd}.`, why: `Subtract ${rd} from both sides, then divide by ${sd}.` },
    { claim: `The right-hand side is rational, because rational numbers stay rational when you add, subtract, multiply or divide them (except by 0).`, why: `x, ${rd} and ${sd} are all rational.` },
    { claim: `So √${p} would be rational. But √${p} is irrational.`, why: `Proved by the √${p} steps.` },
    { claim: `The assumption is false, so ${r < 0 ? '−' + -r : r} ${m(s)}√${p} is irrational.`, why: 'Proof by contradiction again.' },
  ];
}
