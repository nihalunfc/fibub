// Balance-scale equations a·x + b = c·x + d with whole-number boxes (x) and weights (1) on each pan. Every move does
// the same thing to both sides, so the scale stays balanced. Plain TypeScript, no DOM.

export type Pans = { a: number; b: number; c: number; d: number };
export type Move = 'unit' | 'units' | 'box' | 'share' | 'swap';
export type Solution = { kind: 'one'; p: number; q: number } | { kind: 'all' } | { kind: 'none' };

const gcd = (x: number, y: number): number => { x = Math.abs(x); y = Math.abs(y); while (y) [x, y] = [y, x % y]; return x; };

/** The solution of a·x + b = c·x + d, as a fraction p/q in lowest terms (q > 0). */
export function solve({ a, b, c, d }: Pans): Solution {
  const A = a - c, B = d - b;
  if (A === 0) return B === 0 ? { kind: 'all' } : { kind: 'none' };
  const s = A < 0 ? -1 : 1, g = gcd(B, A) || 1;
  return { kind: 'one', p: (s * B) / g, q: Math.abs(A) / g };
}
export const solText = (s: Solution) => (s.kind === 'one' ? (s.q === 1 ? String(s.p) : `${s.p}/${s.q}`).replace('-', '−') : s.kind === 'all' ? 'any number' : 'no number');

/** One side as text: "3x + 5", "x", "7", "0". */
export function sideText(x: number, u: number): string {
  const xs = x === 0 ? '' : x === 1 ? 'x' : `${x}x`;
  if (!xs) return String(u);
  return u === 0 ? xs : `${xs} + ${u}`;
}
export const eqText = (p: Pans) => `${sideText(p.a, p.b)} = ${sideText(p.c, p.d)}`;

/** Weight of each pan for a guess of x, and how far the beam tips (−1 left down … +1 right down). */
export function tip(p: Pans, x: number): { left: number; right: number; t: number } {
  const left = p.a * x + p.b, right = p.c * x + p.d, diff = right - left;
  return { left, right, t: Math.max(-1, Math.min(1, diff / Math.max(4, Math.abs(left) + Math.abs(right)) * 3)) };
}

/** Is the equation already x = number (or number = x)? */
export const isSolved = (p: Pans) => (p.a === 1 && p.b === 0 && p.c === 0) || (p.c === 1 && p.d === 0 && p.a === 0);

/** Make a move on both pans. Returns the new pans, or an error message for a move that can't be made. */
export function move(p: Pans, m: Move, k = 0): Pans | string {
  switch (m) {
    case 'unit': return p.b >= 1 && p.d >= 1 ? { ...p, b: p.b - 1, d: p.d - 1 } : 'Both pans need a 1-weight to take one off each.';
    case 'units': { const n = Math.min(p.b, p.d); return n >= 1 ? { ...p, b: p.b - n, d: p.d - n } : 'One pan has no 1-weights, so there are none to take from both.'; }
    case 'box': return p.a >= 1 && p.c >= 1 ? { ...p, a: p.a - 1, c: p.c - 1 } : 'Both pans need an x box to take one off each.';
    case 'share': {
      if (!Number.isInteger(k) || k < 2) return 'Share into 2 or more equal groups.';
      if ([p.a, p.b, p.c, p.d].some((v) => v % k !== 0)) return `Everything on both pans must split into ${k} equal groups (each count must divide by ${k}).`;
      return { a: p.a / k, b: p.b / k, c: p.c / k, d: p.d / k };
    }
    case 'swap': return { a: p.c, b: p.d, c: p.a, d: p.b };
  }
}

/** A good next move, as a hint. */
export function hint(p: Pans): string {
  if (isSolved(p)) return 'Solved: x is alone on one pan.';
  if (p.a >= 1 && p.c >= 1) return 'Take an x box from each pan until one pan has no boxes.';
  if (p.b >= 1 && p.d >= 1) return 'Take the 1-weights off both pans together.';
  const n = p.a || p.c, g = gcd(gcd(gcd(p.a, p.b), p.c), p.d);
  if (n > 1 && g > 1) return `Share both pans into ${g} equal groups.`;
  if (p.a === 0 && p.c === 0) return 'There are no x boxes left.';
  return `The boxes don't split evenly: divide both sides by ${n} to get a fraction.`;
}
