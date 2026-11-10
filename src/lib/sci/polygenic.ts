// Polygenic traits (school level, Class 12 biology): n genes with additive alleles, F1 × F1 cross. The number of
// "plus" alleles in a child is binomial(2n, 1/2), so with more genes the classes multiply and the histogram turns
// into a bell curve; add environmental spread and it becomes smooth. Pure functions, no DOM.

/** C(n, k) as an exact float (n ≤ 60). */
export function choose(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return Math.round(r);
}

/** Probability that a child of two all-heterozygous parents has k plus alleles out of 2n. */
export function classProb(n: number, k: number): number {
  if (!Number.isInteger(n) || n < 1 || n > 20) throw new Error('Use 1 to 20 genes.');
  return choose(2 * n, k) / 4 ** n;
}

/** The whole F2 distribution: 2n + 1 classes. */
export const distribution = (n: number) => Array.from({ length: 2 * n + 1 }, (_, k) => classProb(n, k));

/** The ratio as whole numbers, e.g. 1 : 4 : 6 : 4 : 1 for two genes. */
export const ratio = (n: number) => Array.from({ length: 2 * n + 1 }, (_, k) => choose(2 * n, k));

/** Mean and standard deviation of the plus-allele count: n and √(n/2). */
export const moments = (n: number) => ({ mean: n, sd: Math.sqrt(n / 2) });

/** Trait value for k plus alleles: base + k × effect. */
export const trait = (base: number, effect: number, k: number) => base + k * effect;

/** Smooth density of the trait with environmental spread sigma (normal around each class), at x. */
export function density(n: number, base: number, effect: number, sigma: number, x: number): number {
  if (!(sigma > 0)) throw new Error('The spread must be above zero.');
  return distribution(n).reduce((s, p, k) => s + p * Math.exp(-((x - trait(base, effect, k)) ** 2) / (2 * sigma * sigma)) / (sigma * Math.sqrt(2 * Math.PI)), 0);
}

/** Seeded random numbers (mulberry32) so a sample can be repeated. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** Grow `count` children: each of the 2n alleles is plus with chance ½. Returns counts per class. */
export function sample(n: number, count: number, seed = 1): number[] {
  const r = rng(seed), out = new Array(2 * n + 1).fill(0);
  for (let i = 0; i < count; i++) { let k = 0; for (let j = 0; j < 2 * n; j++) if (r() < 0.5) k++; out[k]++; }
  return out;
}
