// School maths: quadratic equations ax² + bx + c = 0 (Class 10 quadratic equations; complex roots for Class 11).
// Discriminant, roots, vertex, completing the square and splitting the middle term. No DOM.
import { fmt, sgn, gcd, randInt } from './smath.ts';

export type Quad = {
  a: number; b: number; c: number;
  D: number;                       // discriminant b² − 4ac
  kind: 'two' | 'one' | 'none';    // two distinct real roots, two equal roots, no real roots
  roots: number[];                 // real roots, smaller first ([] when none; one entry repeated twice when equal)
  re: number; im: number;          // complex roots re ± im·i when D < 0 (im = 0 otherwise)
  h: number; k: number;            // vertex (h, k); axis of symmetry x = h
  sum: number; product: number;    // −b/a and c/a
};

export function quad(a: number, b: number, c: number): Quad {
  if (a === 0) throw new Error('a must not be 0 for a quadratic');
  const D = b * b - 4 * a * c;
  const eps = 1e-12 * Math.max(1, b * b, Math.abs(4 * a * c));
  const h = -b / (2 * a), k = c - (b * b) / (4 * a);
  let roots: number[] = [], kind: Quad['kind'], re = h, im = 0;
  if (Math.abs(D) <= eps) { kind = 'one'; roots = [h, h]; }
  else if (D > 0) {
    kind = 'two';
    // Stable form: avoid cancellation when b² ≫ 4ac.
    const q = -0.5 * (b + Math.sign(b || 1) * Math.sqrt(D));
    const r1 = q / a, r2 = q !== 0 ? c / q : -r1;
    roots = [r1, r2].sort((x, y) => x - y);
  } else { kind = 'none'; im = Math.sqrt(-D) / (2 * Math.abs(a)); }
  return { a, b, c, D, kind, roots, re, im, h, k, sum: -b / a, product: c / a };
}

/** Text of the polynomial: quadText(1, -5, 6) = "x² − 5x + 6". */
export function quadText(a: number, b: number, c: number, v = 'x'): string {
  const lead = a === 1 ? '' : a === -1 ? '−' : fmt(a);
  let s = `${lead}${v}²`;
  if (b) s += ` ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : fmt(Math.abs(b))}${v}`;
  if (c) s += ` ${sgn(c)}`;
  return s;
}

/** Completing the square, step by step (as text lines). */
export function completeSquare(a: number, b: number, c: number): string[] {
  const p = b / (2 * a), D = b * b - 4 * a * c;
  const steps: string[] = [];
  steps.push(`${quadText(a, b, c)} = 0`);
  if (a !== 1) steps.push(`Divide by a = ${fmt(a)}: ${quadText(1, b / a, c / a)} = 0`);
  steps.push(`Move the number across: x² ${sgn(b / a, 3)}x = ${fmt(-c / a, 3)}`);
  steps.push(`Add (half of ${fmt(b / a, 3)})² = ${fmt(p * p, 3)} to both sides: x² ${sgn(b / a, 3)}x + ${fmt(p * p, 3)} = ${fmt(p * p - c / a, 3)}`);
  steps.push(`The left side is a perfect square: (x ${sgn(p, 3)})² = ${fmt(D / (4 * a * a), 3)}`);
  if (D > 0) steps.push(`Take square roots: x ${sgn(p, 3)} = ± ${fmt(Math.sqrt(D) / (2 * Math.abs(a)), 3)}, so x = ${fmt(-p - Math.sqrt(D) / (2 * Math.abs(a)), 3)} or x = ${fmt(-p + Math.sqrt(D) / (2 * Math.abs(a)), 3)}`);
  else if (Math.abs(D) < 1e-12) steps.push(`So x ${sgn(p, 3)} = 0 and x = ${fmt(-p, 3)} (two equal roots)`);
  else steps.push(`A square cannot be negative, so there are no real roots.`);
  return steps;
}

/**
 * Split the middle term: for integer a, b, c find integers p, q with p + q = b and p·q = a·c. Returns null when
 * none exist (then the quadratic has no factors with whole numbers). The pair with smaller |p| comes first.
 */
export function splitMiddle(a: number, b: number, c: number): { p: number; q: number; f1: [number, number]; f2: [number, number] } | null {
  if (![a, b, c].every(Number.isInteger) || a === 0) return null;
  const ac = a * c;
  let best: [number, number] | null = null;
  if (ac === 0) best = [0, b];
  else for (let p = -Math.abs(ac); p <= Math.abs(ac); p++) {
    if (p === 0 || ac % p) continue;
    const q = ac / p;
    if (p + q === b && p <= q) { best = [p, q]; break; }
  }
  if (!best) return null;
  const [p, q] = best;
  // ax² + px + qx + c = gx(ux + v) + h(ux + v) with g = gcd(a, p).
  let g = gcd(a, p) || Math.abs(a);
  if (a < 0) g = -g;
  const u = a / g, v = p / g;
  const hh = v !== 0 ? c / v : q / u;
  return { p, q, f1: [g, hh], f2: [u, v] };   // (g x + hh)(u x + v)
}

/** "(2x − 3)" from [2, −3]. */
export const factorText = ([m, n]: [number, number]) => `(${m === 1 ? '' : m === -1 ? '−' : fmt(m)}x${n ? ' ' + sgn(n) : ''})`;

/** A quadratic with whole-number roots for the quiz. */
export function practice(rnd = Math.random) {
  const r1 = randInt(-6, 6, false, rnd), r2 = randInt(-6, 6, false, rnd), a = randInt(1, 2, false, rnd);
  return { a, b: -a * (r1 + r2), c: a * r1 * r2, roots: [Math.min(r1, r2), Math.max(r1, r2)] };
}
