// School maths: Pythagoras' theorem (Class 8 squares and square roots / Pythagorean triples, Class 10 triangles,
// Class 7 and 9 right triangles). Triples, the converse test and the geometry of four classic proofs. No DOM.
import { gcd } from './smath.ts';

export type Pt = [number, number];
export type Triple = { a: number; b: number; c: number; primitive: boolean; m: number; n: number; k: number };

export const hyp = (a: number, b: number) => Math.hypot(a, b);

/** Is a triangle with these sides right-angled (to a relative tolerance)? Returns the hypotenuse index or −1. */
export function rightAngleAt(sides: [number, number, number], tol = 1e-9): number {
  const s = [...sides];
  if (s.some((x) => !(x > 0))) return -1;
  const i = s.indexOf(Math.max(...s));
  const o = s.filter((_, j) => j !== i);
  const lhs = o[0] * o[0] + o[1] * o[1], rhs = s[i] * s[i];
  return Math.abs(lhs - rhs) <= tol * rhs ? i : -1;
}

/**
 * All Pythagorean triples with hypotenuse up to `maxC`, from Euclid's formula a = k(m² − n²), b = k·2mn,
 * c = k(m² + n²) with m > n > 0, gcd(m, n) = 1 and m − n odd. Sorted by c then a; a < b in each.
 */
export function triples(maxC: number): Triple[] {
  const out: Triple[] = [];
  for (let m = 2; m * m + 1 <= maxC; m++) for (let n = 1; n < m; n++) {
    if ((m - n) % 2 === 0 || gcd(m, n) !== 1) continue;
    const a0 = m * m - n * n, b0 = 2 * m * n, c0 = m * m + n * n;
    for (let k = 1; k * c0 <= maxC; k++) out.push({ a: k * Math.min(a0, b0), b: k * Math.max(a0, b0), c: k * c0, primitive: k === 1, m, n, k });
  }
  return out.sort((x, y) => x.c - y.c || x.a - y.a);
}

/** The Class 8 family for any whole m > 1: 2m, m² − 1, m² + 1. */
export const tripleFrom = (m: number): [number, number, number] => [2 * m, m * m - 1, m * m + 1];

/**
 * The rearrangement proof: a square of side a + b holding four copies of the triangle. At t = 0 they leave a tilted
 * square of side c uncovered; at t = 1 they leave a square of side a and a square of side b. Each triangle only
 * slides. Coordinates have y up, the big square is [0, a + b]².
 */
export function rearrangement(a: number, b: number, t: number): Pt[][] {
  const s = a + b;
  const start: Pt[][] = [
    [[0, 0], [a, 0], [0, b]],
    [[s, 0], [s, a], [a, 0]],
    [[s, s], [b, s], [s, a]],
    [[0, s], [0, b], [b, s]],
  ];
  const move: Pt[] = [[0, a], [0, 0], [-b, 0], [a, -b]];
  return start.map((tri, i) => tri.map(([x, y]) => [x + t * move[i][0], y + t * move[i][1]] as Pt));
}

/**
 * Bhaskara's figure: the square on the hypotenuse (corners P0..P3, anticlockwise, side c) holds four copies of the
 * triangle in a pinwheel around a small square of side |b − a|. Area: c² = 4 × ab/2 + (b − a)² = a² + b².
 */
export function bhaskara(a: number, b: number): { big: Pt[]; tris: Pt[][]; inner: Pt[]; c: number } {
  const lo = Math.min(a, b), hi = Math.max(a, b), d = hi - lo;
  const P: Pt[] = [[0, 0], [hi, lo], [d, hi + lo], [-lo, hi]];
  const Rr: Pt[] = [[0, lo], [d, lo], [d, hi], [0, hi]];
  const tris = [0, 1, 2, 3].map((i) => [P[i], P[(i + 1) % 4], Rr[i]]);
  return { big: P, tris, inner: Rr, c: Math.hypot(a, b) };
}

/** Similar-triangles proof: the altitude to the hypotenuse cuts c into p (next to a) and q (next to b). */
export function altitudeSplit(a: number, b: number) {
  const c = Math.hypot(a, b);
  return { c, p: (a * a) / c, q: (b * b) / c, h: (a * b) / c };
}

/** Area of a polygon (shoelace), positive for anticlockwise. */
export function area(poly: Pt[]): number {
  let s = 0;
  for (let i = 0; i < poly.length; i++) { const [x1, y1] = poly[i], [x2, y2] = poly[(i + 1) % poly.length]; s += x1 * y2 - x2 * y1; }
  return s / 2;
}
