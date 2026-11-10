// Ratio mixer (school maths, proportional reasoning): simplest form of a ratio, comparing two mixes by
// cross-multiplying, sharing a total in a ratio, the missing term of an equivalent ratio, and the colour a mix
// shows. Plain TypeScript, no DOM.
import { gcd } from './smath.ts';

/** a : b in simplest form (whole numbers). */
export function simplify(a: number, b: number): [number, number] {
  const g = gcd(a, b) || 1;
  return [a / g, b / g];
}

/** Share of the first part in the mix, a / (a + b). */
export const share = (a: number, b: number) => (a + b > 0 ? a / (a + b) : 0);

/**
 * Compare two mixes a1 : a2 and b1 : b2 by the first ingredient. Returns 1 when mix A has the bigger share of the
 * first ingredient, -1 when mix B has, 0 when the ratios are equal. a1 / (a1 + a2) > b1 / (b1 + b2) is the same as
 * a1 × b2 > a2 × b1, so whole numbers stay whole.
 */
export function compare(a1: number, a2: number, b1: number, b2: number): -1 | 0 | 1 {
  const d = a1 * b2 - a2 * b1;
  return d > 0 ? 1 : d < 0 ? -1 : 0;
}

/** Split `total` in the ratio a : b. */
export function split(total: number, a: number, b: number): [number, number] {
  return [(total * a) / (a + b), (total * b) / (a + b)];
}

/** a : b = c : x, so x = b × c / a. */
export const missing = (a: number, b: number, c: number) => (b * c) / a;

export type RGB = [number, number, number];
/**
 * Colour of a mix where `f` is the share of colour `x` and 1 − f the share of `y`. Paints absorb light, so the
 * mix is taken as the weighted geometric mean of each channel (a simple model of subtractive mixing): blue and
 * yellow give green, not grey.
 */
export function mixColour(x: RGB, y: RGB, f: number): RGB {
  return [0, 1, 2].map((i) => Math.round(Math.pow(Math.max(1, x[i]), f) * Math.pow(Math.max(1, y[i]), 1 - f))) as RGB;
}
