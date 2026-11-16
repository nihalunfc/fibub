// School maths: quadratic equations ax² + bx + c = 0 (Class 10 quadratic equations; complex roots for Class 11).
// Discriminant, roots, vertex, completing the square and splitting the middle term. No DOM.
import { fmt, sgn, gcd, randInt, fracText } from './smath.ts';

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

// ---- Added 2026-11-16: the answer in exact form, an equation from its roots, textbook-style presets ----

/** √n as k√m with m square-free: surd(72) = [6, 2] (6√2). */
export function surd(n: number): [number, number] {
  let k = 1, m = Math.round(n);
  for (let f = 2; f * f <= m; f++) while (m % (f * f) === 0) { m /= f * f; k *= f; }
  return [k, m];
}

/**
 * The roots in exact form for whole-number a, b, c: fractions when D is a perfect square, otherwise
 * "x = (−3 ± √65) / 4" (with i for D < 0). Returns null when a, b or c is not a whole number or a = 0.
 */
export function exactRoots(a: number, b: number, c: number): string | null {
  if (![a, b, c].every(Number.isInteger) || a === 0) return null;
  const D = b * b - 4 * a * c, den = 2 * a;
  if (D === 0) return `x = ${fracText(-b, den)}`;
  const root = Math.sqrt(Math.abs(D));
  if (D > 0 && Number.isInteger(root)) {
    const r = [fracText(-b + root, den), fracText(-b - root, den)];
    const v = [(-b + root) / den, (-b - root) / den];
    return `x = ${v[0] <= v[1] ? r.join(' or x = ') : r.reverse().join(' or x = ')}`;
  }
  const [k, m] = surd(Math.abs(D));
  const neg = D < 0;
  const g = gcd(gcd(b, k), den) || 1;
  let nb = -b / g, kk = k / g, dd = den / g;
  if (dd < 0) { dd = -dd; nb = -nb; }
  const sq = `${kk === 1 ? '' : kk}${neg ? 'i' : ''}${m === 1 ? (neg ? '' : (kk === 1 ? '1' : '')) : '√' + m}`;
  const top = nb === 0 ? `±${sq}` : `${fmt(nb)} ± ${sq}`;
  return `x = ${dd === 1 ? top : nb === 0 ? `${top} / ${dd}` : `(${top}) / ${dd}`}`;
}

/** The equation whose roots are r1 and r2: a(x − r1)(x − r2) = a x² + bx + c. */
export function fromRoots(r1: number, r2: number, a = 1) {
  return { a, b: -a * (r1 + r2), c: a * r1 * r2 };
}

/** Textbook-style situations in our own words; each is a quadratic to solve, with what the answer means. */
export const WORDS: { id: string; label: string; a: number; b: number; c: number; story: string; meaning: string }[] = [
  { id: 'rect', label: 'Rectangle with area 48', a: 1, b: 2, c: -48, story: 'A rectangle is 2 m longer than it is wide and its area is 48 m². With width x: x(x + 2) = 48, which is x² + 2x − 48 = 0.', meaning: 'x = 6 or x = −8. A width cannot be negative, so the width is 6 m and the length 8 m.' },
  { id: 'sumprod', label: 'Two numbers: sum 13, product 40', a: 1, b: -13, c: 40, story: 'Two numbers add up to 13 and multiply to 40. Both are roots of x² − (sum)x + (product) = 0, which is x² − 13x + 40 = 0.', meaning: 'x = 5 or x = 8: the two numbers are 5 and 8.' },
  { id: 'stone', label: 'Stone thrown up', a: -5, b: 20, c: -15, story: 'A stone is thrown up so that its height is 20t − 5t² metres after t seconds. When is it 15 m high? 20t − 5t² = 15 becomes −5t² + 20t − 15 = 0 (use x for t).', meaning: 'x = 1 or x = 3: the stone is 15 m high at 1 s going up and again at 3 s coming down.' },
  { id: 'surd', label: 'Roots that are not whole', a: 2, b: 3, c: -7, story: 'Not every quadratic factorises. 2x² + 3x − 7 = 0 has D = 65, which is not a perfect square.', meaning: 'Use the formula: x = (−3 ± √65) / 4, about 1.27 and −2.77.' },
];
