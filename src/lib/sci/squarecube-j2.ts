// Square and cube builder maths (#1229): odd numbers adding up to squares, perfect squares and cubes, the cubes added
// when a cube grows by one, the smallest multiplier that makes a perfect square or cube, and numbers that are a sum of
// two cubes in more than one way (taxicab numbers such as 1729). Whole numbers only; no DOM.

/** The first n odd numbers: 1, 3, 5, ..., 2n − 1 (they add up to n²). */
export const odds = (n: number) => Array.from({ length: n }, (_, i) => 2 * i + 1);

/** Exact whole k-th root of x, or null when x is not a perfect k-th power. */
export function exactRoot(x: number, k: number): number | null {
  if (!Number.isInteger(x) || x < 0) return null;
  const r = Math.round(x ** (1 / k));
  for (const c of [r - 1, r, r + 1]) if (c >= 0 && c ** k === x) return c;
  return null;
}

/** Cubes added when an (n − 1)-cube grows to an n-cube: n³ − (n − 1)³ = 3n² − 3n + 1. */
export const shell = (n: number) => 3 * n * n - 3 * n + 1;

/** Prime factorisation as [prime, power] pairs. */
export function factorise(x: number): [number, number][] {
  const out: [number, number][] = [];
  for (let p = 2; p * p <= x; p++) { let e = 0; while (x % p === 0) { x /= p; e++; } if (e) out.push([p, e]); }
  if (x > 1) out.push([x, 1]);
  return out;
}

/** Smallest whole number to multiply x by so it becomes a perfect k-th power (k = 2 square, 3 cube). */
export const smallestMultiplier = (x: number, k: number) => factorise(x).reduce((m, [p, e]) => m * p ** ((k - (e % k)) % k), 1);
/** Smallest whole number to divide x by so it becomes a perfect k-th power. */
export const smallestDivisor = (x: number, k: number) => factorise(x).reduce((m, [p, e]) => m * p ** (e % k), 1);

/** Every way to write x as a³ + b³ with 1 ≤ a ≤ b. */
export function cubeWays(x: number): [number, number][] {
  const out: [number, number][] = [];
  for (let a = 1; 2 * a ** 3 <= x; a++) { const b = exactRoot(x - a ** 3, 3); if (b !== null && b >= a) out.push([a, b]); }
  return out;
}

/** Numbers up to `limit` that are a sum of two positive cubes in at least two ways, with their ways. */
export function taxicabs(limit: number): { n: number; ways: [number, number][] }[] {
  const m = new Map<number, [number, number][]>();
  for (let a = 1; 2 * a ** 3 <= limit; a++) for (let b = a; a ** 3 + b ** 3 <= limit; b++) { const s = a ** 3 + b ** 3; m.set(s, [...(m.get(s) ?? []), [a, b]]); }
  return [...m.entries()].filter(([, w]) => w.length > 1).sort((x, y) => x[0] - y[0]).map(([n, ways]) => ({ n, ways }));
}

/** Last digits a square can end in. */
export const SQUARE_ENDINGS = [0, 1, 4, 5, 6, 9];
