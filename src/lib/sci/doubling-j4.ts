// Power of doubling (#1234): paper folding and grains on a chessboard. Plain TypeScript, no DOM.

/** Thickness after n folds of a sheet `t` thick (any unit): t × 2ⁿ. */
export const foldThickness = (t: number, n: number) => t * 2 ** n;

/** Smallest number of folds n with t × 2ⁿ ≥ target (both in the same unit). */
export function foldsToReach(t: number, target: number): number {
  if (!(t > 0) || !(target > 0)) return NaN;
  if (target <= t) return 0;
  let n = Math.ceil(Math.log2(target / t) - 1e-12);
  // Guard against rounding in log2 either way.
  while (t * 2 ** n < target) n++;
  while (n > 0 && t * 2 ** (n - 1) >= target) n--;
  return n;
}

/** Grains on square k (1 to 64): 2^(k−1), exact. */
export const grainsOn = (k: number) => 1n << BigInt(k - 1);

/** Grains on squares 1 to k together: 2^k − 1, exact. */
export const grainsUpTo = (k: number) => (1n << BigInt(k)) - 1n;

/** Landmarks for the fold ladder, in metres (well-known round figures). */
export const LANDMARKS: { name: string; m: number }[] = [
  { name: 'sheet (0.1 mm)', m: 1e-4 },
  { name: 'fingernail (1 mm)', m: 1e-3 },
  { name: 'hand width (10 cm)', m: 0.1 },
  { name: 'person (1.7 m)', m: 1.7 },
  { name: 'Qutub Minar (73 m)', m: 73 },
  { name: 'Everest (8.8 km)', m: 8849 },
  { name: 'space station (400 km)', m: 4e5 },
  { name: 'Moon (384,400 km)', m: 3.844e8 },
  { name: 'Sun (150 million km)', m: 1.496e11 },
  { name: 'nearest star (4.2 ly)', m: 3.97e16 },
];
