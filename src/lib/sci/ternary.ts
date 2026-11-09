// Ternary diagrams (three parts of a whole) and normalised multi-element "spider" diagrams. Plain maths; no DOM.

/** Normalise three non-negative parts to fractions that sum to 1. Null if they are all zero or any is negative. */
export function closure(a: number, b: number, c: number): [number, number, number] | null {
  if (!(a >= 0 && b >= 0 && c >= 0)) return null;
  const s = a + b + c;
  return s > 0 ? [a / s, b / s, c / s] : null;
}

/**
 * Position in an equilateral triangle of side 1 with corner A at the top, B bottom left and C bottom right.
 * Returns (x, y) with y up.
 */
export const toXY = (a: number, b: number, c: number): [number, number] => {
  const s = a + b + c;
  return [(0.5 * a + c) / s, ((Math.sqrt(3) / 2) * a) / s];
};
/** Back from (x, y) to fractions (a, b, c). */
export function fromXY(x: number, y: number): [number, number, number] {
  const a = y / (Math.sqrt(3) / 2), c = x - 0.5 * a;
  return [a, 1 - a - c, c];
}

/** Mean of compositions: the closed arithmetic mean, and the closed geometric mean (better for compositional data). */
export function centres(rows: [number, number, number][]) {
  const n = rows.length;
  const am = [0, 1, 2].map((k) => rows.reduce((s, r) => s + r[k], 0) / n);
  const pos = rows.filter((r) => r.every((v) => v > 0));
  const gm = pos.length ? [0, 1, 2].map((k) => Math.exp(pos.reduce((s, r) => s + Math.log(r[k]), 0) / pos.length)) : [NaN, NaN, NaN];
  return { arithmetic: closure(am[0], am[1], am[2]), geometric: pos.length ? closure(gm[0], gm[1], gm[2]) : null };
}

/** Normalise sample values by reference values, element by element; NaN where either is missing or not positive. */
export const normalise = (vals: number[], ref: number[]) => vals.map((v, i) => (v > 0 && ref[i] > 0 ? v / ref[i] : NaN));

/**
 * Eu anomaly Eu/Eu* = Eu_N / sqrt(Sm_N × Gd_N) from normalised values; NaN if any is missing.
 * A common check in rare earth element patterns.
 */
export const anomaly = (mid: number, left: number, right: number) => (mid > 0 && left > 0 && right > 0 ? mid / Math.sqrt(left * right) : NaN);
