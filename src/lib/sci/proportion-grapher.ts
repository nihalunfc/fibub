// Direct and inverse proportion (school maths, proportional reasoning): y = k × x and x × y = k, the missing
// value by the unitary method, and telling from a table whether two quantities are in direct or inverse
// proportion. Plain TypeScript, no DOM.

export type Kind = 'direct' | 'inverse';

/** y for a given x: y = k x (direct) or y = k / x (inverse). */
export const yOf = (kind: Kind, k: number, x: number) => (kind === 'direct' ? k * x : k / x);

/** x1 → y1 is known; find y2 for x2. Direct: y2 = y1 × x2 / x1. Inverse: y2 = y1 × x1 / x2. */
export const missing = (kind: Kind, x1: number, y1: number, x2: number) => (kind === 'direct' ? (y1 * x2) / x1 : (y1 * x1) / x2);

/**
 * Is a table of pairs in direct proportion (y ÷ x the same every time), inverse proportion (x × y the same), or
 * neither? Values are compared with a small relative tolerance. Pairs with x = 0 are skipped for the ratio.
 */
export function classify(xs: number[], ys: number[], tol = 1e-9): Kind | 'neither' {
  const same = (v: number[]) => v.length > 1 && v.every((t) => Math.abs(t - v[0]) <= tol * Math.max(1, Math.abs(v[0])));
  const ratios = xs.map((x, i) => (x === 0 ? NaN : ys[i] / x)).filter(Number.isFinite);
  if (same(ratios) && ratios[0] !== 0) return 'direct';
  if (same(xs.map((x, i) => x * ys[i])) && xs[0] * ys[0] !== 0) return 'inverse';
  return 'neither';
}
