// Shared bits for the "Check yourself" questions of NCERT helper 4's Learn tools. Plain TypeScript, no DOM.
export type Question = { text: string; ans: number; unit: string; work: string; tol?: number };
/** Whole number from lo to hi inclusive. */
export const pick = (rng: () => number, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));
/** One item of a list. */
export const one = <T,>(rng: () => number, a: readonly T[]): T => a[Math.floor(rng() * a.length)];
/** Round for printing (d decimals), minus sign as −. */
export const n = (x: number, d = 2) => String(Math.round(x * 10 ** d) / 10 ** d).replace('-', '−');
/** Seeded generator for tests. */
export const seeded = (seed = 7) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
