// School limits and continuity (Class 11 and 12 maths): one-sided limits estimated from tables of values,
// the limit, the value, and what kind of break (if any) a function has at a point: a hole (removable), a
// jump, an infinite break or endless wobbling. Ready-made examples carry their exact answers. No DOM.
import type { Fn } from './school-calculus.ts';

export type Kind = 'continuous' | 'removable' | 'jump' | 'infinite' | 'oscillating';
export type Example = { id: string; label: string; f: Fn; a: number; left: number; right: number; value: number; kind: Kind; aText?: string; note: string };

export const EXAMPLES: Example[] = [
  { id: 'sinx', label: 'sin x / x at 0', f: (x) => Math.sin(x) / x, a: 0, left: 1, right: 1, value: NaN, kind: 'removable', note: 'The famous limit: sin x / x → 1 (x in radians). 0/0 at x = 0, so there is a hole.' },
  { id: 'quad', label: '(x² − 4)/(x − 2) at 2', f: (x) => (x * x - 4) / (x - 2), a: 2, left: 4, right: 4, value: NaN, kind: 'removable', note: 'Factor: (x − 2)(x + 2)/(x − 2) = x + 2 for x ≠ 2, so the limit is 4. A straight line with a hole.' },
  { id: 'cos', label: '(1 − cos x)/x² at 0', f: (x) => (1 - Math.cos(x)) / (x * x), a: 0, left: 0.5, right: 0.5, value: NaN, kind: 'removable', note: '1 − cos x = 2 sin²(x/2), so the quotient is ½ [sin(x/2)/(x/2)]² → ½.' },
  { id: 'exp', label: '(eˣ − 1)/x at 0', f: (x) => (Math.exp(x) - 1) / x, a: 0, left: 1, right: 1, value: NaN, kind: 'removable', note: 'A standard limit: (eˣ − 1)/x → 1. It is the slope of eˣ at 0.' },
  { id: 'patch', label: 'x², but f(1) = 3', f: (x) => (x === 1 ? 3 : x * x), a: 1, left: 1, right: 1, value: 3, kind: 'removable', note: 'The limit is 1 but the value has been moved to 3: a removable break. Redefine f(1) = 1 to mend it.' },
  { id: 'sign', label: '|x| / x at 0', f: (x) => Math.abs(x) / x, a: 0, left: -1, right: 1, value: NaN, kind: 'jump', note: 'From the left the value is −1, from the right +1: a jump, so no limit.' },
  { id: 'floor', label: '[x] (greatest integer) at 1', f: Math.floor, a: 1, left: 0, right: 1, value: 1, kind: 'jump', note: 'The step function jumps up by 1 at every whole number.' },
  { id: 'abs', label: '|x| at 0 (a corner)', f: Math.abs, a: 0, left: 0, right: 0, value: 0, kind: 'continuous', note: 'Continuous (no break) even though it has a corner: continuous does not mean smooth.' },
  { id: 'inv2', label: '1/x² at 0', f: (x) => 1 / (x * x), a: 0, left: Infinity, right: Infinity, value: NaN, kind: 'infinite', note: 'The values grow without bound from both sides: an infinite break (a vertical asymptote).' },
  { id: 'inv', label: '1/x at 0', f: (x) => 1 / x, a: 0, left: -Infinity, right: Infinity, value: NaN, kind: 'infinite', note: 'Down to −∞ from the left, up to +∞ from the right.' },
  { id: 'wobble', label: 'sin(1/x) at 0', f: (x) => Math.sin(1 / x), a: 0, left: NaN, right: NaN, value: NaN, kind: 'oscillating', note: 'Near 0 it wobbles between −1 and 1 faster and faster, never settling: no limit.' },
];

export const STEPS = [0.1, 0.01, 0.001, 0.0001, 0.00001, 0.000001];
/** Values of f at a − h (side −1) or a + h (side +1) for h = 0.1, 0.01, … 0.000001. */
export const table = (f: Fn, a: number, side: -1 | 1) => STEPS.map((h) => ({ x: a + side * h, y: f(a + side * h) }));

/** One-sided limit estimated from the table: a number, ±Infinity, or NaN when the values do not settle. */
export function oneSided(f: Fn, a: number, side: -1 | 1): number {
  const v = table(f, a, side).map((p) => p.y);
  if (v.some((y) => !Number.isFinite(y))) return v.every((y) => y === Infinity) ? Infinity : v.every((y) => y === -Infinity) ? -Infinity : NaN;
  const n = v.length, last = v[n - 1];
  // Growing without bound.
  if (Math.abs(last) >= 1e5 && Math.abs(v[n - 1]) > Math.abs(v[n - 2]) * 3 && Math.abs(v[n - 2]) > Math.abs(v[n - 3]) * 3) return Math.sign(last) * Infinity;
  // Settling: the later values agree and the gaps shrink. The error of a smooth quotient shrinks in step
  // with h, so one Richardson step (L ≈ v₄ + (v₄ − v₃)/9) sharpens it; the h = 0.000001 value is only used
  // as a check, because 0/0 forms lose digits to rounding there.
  const close = (p: number, q: number, t: number) => Math.abs(p - q) <= t * Math.max(1, Math.abs(q));
  if (close(v[2], v[3], 1e-2) && close(v[3], v[4], 1e-3) && close(v[4], v[5], 1e-3) && Math.abs(v[4] - v[3]) <= Math.max(Math.abs(v[3] - v[2]), 1e-5 * Math.max(1, Math.abs(v[4])))) {
    const L = v[4] + (v[4] - v[3]) / 9;
    return Math.abs(L) < 1e-7 ? 0 : L;
  }
  return NaN;
}

/** Left and right limits, the limit, the value and the kind of point at x = a. */
export function examine(f: Fn, a: number) {
  const left = oneSided(f, a, -1), right = oneSided(f, a, 1), fa = f(a), value = Number.isFinite(fa) ? fa : NaN;
  const same = Number.isFinite(left) && Number.isFinite(right) && Math.abs(left - right) <= 1e-3 * Math.max(1, Math.abs(right));
  const limit = same ? (left + right) / 2 : left === right && !Number.isNaN(left) ? left : NaN;
  let kind: Kind;
  if (Number.isNaN(left) || Number.isNaN(right)) kind = 'oscillating';
  else if (!Number.isFinite(left) || !Number.isFinite(right)) kind = 'infinite';
  else if (!same) kind = 'jump';
  else kind = Number.isFinite(value) && Math.abs(value - limit) <= 1e-3 * Math.max(1, Math.abs(limit)) ? 'continuous' : 'removable';
  return { left, right, limit, value, kind };
}
