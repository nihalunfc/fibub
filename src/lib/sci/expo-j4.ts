// Exponent laws (#1236): exact powers with whole-number bases and integer exponents, and the factor tiles that
// show why each law works. Plain TypeScript, no DOM.

export type Law = 'product' | 'quotient' | 'power' | 'bases';

/** aᵏ exactly, as a fraction num/den (den = 1 when k ≥ 0). a is a whole number ≥ 1. */
export function powFrac(a: number, k: number): { num: bigint; den: bigint } {
  const p = BigInt(a) ** BigInt(Math.abs(k));
  return k >= 0 ? { num: p, den: 1n } : { num: 1n, den: p };
}

/** The exponent of the answer for each law (for 'bases' the answer is (ab)ᵐ, so the exponent is m). */
export function lawExponent(law: Law, m: number, n: number): number {
  return law === 'product' ? m + n : law === 'quotient' ? m - n : law === 'power' ? m * n : m;
}

/** Tiles for aᵏ: k tiles of +1 (multiply by a) or |k| tiles of −1 (divide by a). */
export const tiles = (k: number): (1 | -1)[] => Array.from({ length: Math.abs(k) }, () => (k >= 0 ? 1 : -1));

/**
 * Put two rows of tiles side by side and cancel each "× a" with a "÷ a". Returns how many pairs cancel and the
 * exponent that is left (the sum of all the tiles).
 */
export function cancel(x: (1 | -1)[], y: (1 | -1)[]): { pairs: number; left: number } {
  const all = [...x, ...y], pos = all.filter((t) => t > 0).length, neg = all.length - pos;
  return { pairs: Math.min(pos, neg), left: pos - neg };
}

/** Multiply two exact fractions and reduce. */
export function mulFrac(p: { num: bigint; den: bigint }, q: { num: bigint; den: bigint }) {
  let num = p.num * q.num, den = p.den * q.den;
  const g = (a: bigint, b: bigint): bigint => (b === 0n ? a : g(b, a % b));
  const d = g(num, den);
  return { num: num / d, den: den / d };
}

/** An exact fraction as text: "128", "1/8". Very long numbers are cut to their first digits and length. */
export function fracText(f: { num: bigint; den: bigint }): string {
  const t = (b: bigint) => { const s = b.toString(); return s.length > 24 ? `${s.slice(0, 6)}… (${s.length} digits)` : s.replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
  return f.den === 1n ? t(f.num) : `${t(f.num)}/${t(f.den)}`;
}
