// Straight lines y = mx + c for school (Learn): the zero of a linear polynomial, slope as rise over run, the
// angle the line makes with the x-axis, and the line through two points. No DOM.
import { gcd } from './smath.ts';

/** Where y = mx + c crosses the x-axis: x = −c/m. NaN for a flat line (m = 0). */
export const zero = (m: number, c: number) => (m === 0 ? NaN : -c / m);

/** Angle of inclination in degrees, 0 ≤ θ < 180 (tan θ = m). */
export function angleDeg(m: number) {
  const t = (Math.atan(m) * 180) / Math.PI;
  return t < 0 ? t + 180 : t;
}

/** Slope and intercept of the line through two points; vertical lines give { vertical: x }. */
export function through(p: [number, number], q: [number, number]): { m: number; c: number } | { vertical: number } | null {
  if (p[0] === q[0]) return p[1] === q[1] ? null : { vertical: p[0] };
  const m = (q[1] - p[1]) / (q[0] - p[0]);
  return { m, c: p[1] - m * p[0] };
}

/** A slope from a whole-number rise and run, as a fraction in lowest terms ("3/2", "−1/4", "2"). */
export function slopeText(rise: number, run: number) {
  if (run === 0) return 'undefined';
  if (run < 0) { rise = -rise; run = -run; }
  const g = gcd(rise, run) || 1;
  const p = rise / g, q = run / g;
  return (q === 1 ? String(p) : `${p}/${q}`).replace('-', '−');
}

/** y-values for a table: x from a to b. */
export const table = (m: number, c: number, xs: number[]) => xs.map((x) => [x, m * x + c] as [number, number]);
