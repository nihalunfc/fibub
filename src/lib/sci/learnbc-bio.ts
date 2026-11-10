// Small models for the Class 10 biology Learn tools (copying errors, sex determination). Plain TypeScript, no DOM.
export const BASES = ['A', 'T', 'G', 'C'] as const;

/** Copy a DNA string once: each base is wrongly copied with chance p, always into one of the other three. */
export function copyOnce(dna: string[], p: number, rand: () => number): string[] {
  return dna.map((b) => {
    if (rand() >= p) return b;
    const others = BASES.filter((x) => x !== b);
    return others[Math.floor(rand() * 3)];
  });
}

/** Copy over several generations; returns every generation's string, the first being the original. */
export function lineage(start: string[], p: number, gens: number, rand: () => number): string[][] {
  const out = [start];
  for (let g = 0; g < gens; g++) out.push(copyOnce(out[g], p, rand));
  return out;
}

export const diffCount = (a: string[], b: string[]) => a.reduce((n, x, i) => n + (x !== b[i] ? 1 : 0), 0);

/** Rule of thumb for a small error rate: length × rate × generations. */
export const roughDiff = (len: number, p: number, gens: number) => len * p * gens;
/** Exact average number of differences from the original (a base hit twice may change back). */
export const exactDiff = (len: number, p: number, gens: number) => len * 0.75 * (1 - Math.pow(1 - (4 * p) / 3, gens));

/** Average differences from the original over many runs. */
export function meanDiff(len: number, p: number, gens: number, runs: number, rand: () => number): number {
  let tot = 0;
  for (let k = 0; k < runs; k++) {
    const s = Array.from({ length: len }, () => BASES[Math.floor(rand() * 4)]);
    const l = lineage(s, p, gens, rand);
    tot += diffCount(s, l[gens]);
  }
  return tot / runs;
}

/** Mother XX, father XY: the four equally likely children. */
export const crossXY = () => ['XX', 'XX', 'XY', 'XY'];

/**
 * Births from a pool of sperm cells. Every sperm-making cell gives 2 X and 2 Y sperm, so the pool is exactly half and
 * half; each egg (always X) meets one sperm chosen at random. Returns true for a girl (XX) per birth.
 */
export function births(n: number, rand: () => number): boolean[] {
  const pool = Array.from({ length: 2 * n }, (_, i) => i % 2 === 0);
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  return pool.slice(0, n);
}

/** Share of families of a given size with 0..size girls. */
export function familySplit(b: boolean[], size: number): number[] {
  const counts = new Array(size + 1).fill(0); let fam = 0;
  for (let i = 0; i + size <= b.length; i += size) { let g = 0; for (let k = 0; k < size; k++) if (b[i + k]) g++; counts[g]++; fam++; }
  return counts.map((c) => (fam ? c / fam : 0));
}
/** Exact chance of k girls in a family of n (each child 1/2). */
export const binom = (n: number, k: number) => { let c = 1; for (let i = 1; i <= k; i++) c = (c * (n - k + i)) / i; return c / 2 ** n; };
