// Straight lines for school (Class 11): the line through two points in every standard form, the angle between two
// lines, and the distance from a point to a line with the foot of the perpendicular. Plain TypeScript, no DOM.
import { gcd } from './smath.ts';

export type Pt = [number, number];
/** A line ax + by + c = 0. For two whole-number points the coefficients are whole numbers with no common factor. */
export type Line = { a: number; b: number; c: number };

/** The line through P and Q as ax + by + c = 0 (null if P = Q). Signs: a > 0, or a = 0 and b > 0. */
export function through(P: Pt, Q: Pt): Line | null {
  let a = Q[1] - P[1], b = P[0] - Q[0];
  if (a === 0 && b === 0) return null;
  let c = Q[0] * P[1] - P[0] * Q[1];
  const ints = [a, b, c].every(Number.isInteger);
  if (ints) { const g = gcd(gcd(a, b), c) || 1; a /= g; b /= g; c /= g; }
  if (a < 0 || (a === 0 && b < 0)) { a = -a; b = -b; c = -c; }
  return { a: a + 0, b: b + 0, c: c + 0 };
}

/** Slope −a/b (Infinity for a vertical line). */
export const slope = (l: Line) => (l.b === 0 ? Infinity : -l.a / l.b + 0);
/** y-intercept −c/b (NaN for a vertical line). */
export const yIntercept = (l: Line) => (l.b === 0 ? NaN : -l.c / l.b + 0);
/** x-intercept −c/a (NaN for a horizontal line). */
export const xIntercept = (l: Line) => (l.a === 0 ? NaN : -l.c / l.a + 0);
/** Inclination in degrees, 0 ≤ θ < 180. */
export function inclination(l: Line): number {
  if (l.b === 0) return 90;
  const t = (Math.atan(slope(l)) * 180) / Math.PI;
  return t < 0 ? t + 180 : t + 0;
}

/** Normal form x cos ω + y sin ω = p, with p ≥ 0 the distance from the origin and ω in degrees, 0 ≤ ω < 360. */
export function normalForm(l: Line): { p: number; omega: number } {
  const r = Math.hypot(l.a, l.b);
  let ca = l.a / r, sa = l.b / r, p = -l.c / r;
  if (p < 0) { ca = -ca; sa = -sa; p = -p; }
  if (p === 0 && (sa < 0 || (sa === 0 && ca < 0))) { ca = -ca; sa = -sa; }
  let w = (Math.atan2(sa, ca) * 180) / Math.PI;
  if (w < 0) w += 360;
  return { p: p + 0, omega: w + 0 };
}

/** The acute (or right) angle between two lines in degrees: tan θ = |(m1 − m2)/(1 + m1 m2)|. */
export function angleBetween(l1: Line, l2: Line): number {
  const dot = Math.abs(l1.a * l2.a + l1.b * l2.b), cr = Math.abs(l1.a * l2.b - l2.a * l1.b);
  return (Math.atan2(cr, dot) * 180) / Math.PI;
}
export const parallel = (l1: Line, l2: Line) => Math.abs(l1.a * l2.b - l2.a * l1.b) < 1e-12;
export const perpendicular = (l1: Line, l2: Line) => Math.abs(l1.a * l2.a + l1.b * l2.b) < 1e-12;

/** Distance from point P to the line: |a x₀ + b y₀ + c| / √(a² + b²). */
export const distance = (l: Line, P: Pt) => Math.abs(l.a * P[0] + l.b * P[1] + l.c) / Math.hypot(l.a, l.b);

/** The foot of the perpendicular from P to the line. */
export function foot(l: Line, P: Pt): Pt {
  const k = (l.a * P[0] + l.b * P[1] + l.c) / (l.a * l.a + l.b * l.b);
  return [P[0] - l.a * k + 0, P[1] - l.b * k + 0];
}

/** Where two lines meet (null if parallel). */
export function meet(l1: Line, l2: Line): Pt | null {
  const d = l1.a * l2.b - l2.a * l1.b;
  if (Math.abs(d) < 1e-12) return null;
  return [(l1.b * l2.c - l2.b * l1.c) / d + 0, (l2.a * l1.c - l1.a * l2.c) / d + 0];
}
