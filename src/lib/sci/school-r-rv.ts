// Random variables (Class 12 maths): a probability distribution as a table, its mean, variance and standard
// deviation, ready-made experiments (coins, dice, drawing without replacement), the binomial distribution, and a
// seeded simulation to compare long-run averages with the theory. Plain TypeScript, no DOM.

export type Dist = { x: number[]; p: number[] };

/** Problems with a table: probabilities must be in [0, 1] and add to 1. Empty when fine. */
export function problems(d: Dist): string[] {
  const out: string[] = [];
  if (!d.x.length) out.push('Add at least one value.');
  if (d.x.some((v) => !Number.isFinite(v)) || d.p.some((v) => !Number.isFinite(v))) out.push('Every box needs a number.');
  if (d.p.some((v) => v < 0 || v > 1)) out.push('Each probability must be between 0 and 1.');
  const s = d.p.reduce((a, b) => a + b, 0);
  if (Number.isFinite(s) && Math.abs(s - 1) > 1e-9) out.push(`The probabilities add to ${+s.toFixed(6)}, not 1.`);
  if (new Set(d.x).size !== d.x.length) out.push('Each value of X should appear once.');
  return out;
}

export function moments(d: Dist) {
  const mean = d.x.reduce((s, v, i) => s + v * d.p[i], 0);
  const ex2 = d.x.reduce((s, v, i) => s + v * v * d.p[i], 0);
  const variance = Math.max(0, ex2 - mean * mean);
  return { mean, ex2, variance, sd: Math.sqrt(variance) };
}

export function choose(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  r = Math.min(r, n - r);
  let c = 1;
  for (let i = 1; i <= r; i++) c = (c * (n - r + i)) / i;
  return Math.round(c);
}

export function binomial(n: number, p: number): Dist {
  const x: number[] = [], pr: number[] = [];
  for (let r = 0; r <= n; r++) { x.push(r); pr.push(choose(n, r) * p ** r * (1 - p) ** (n - r)); }
  return { x, p: pr };
}

/** Number of special items in a sample of k drawn without replacement from N items of which K are special. */
export function hypergeometric(N: number, K: number, k: number): Dist {
  const x: number[] = [], p: number[] = [], all = choose(N, k);
  for (let r = Math.max(0, k - (N - K)); r <= Math.min(k, K); r++) { x.push(r); p.push((choose(K, r) * choose(N - K, k - r)) / all); }
  return { x, p };
}

/** Sum of two fair dice. */
export function twoDice(): Dist {
  const x: number[] = [], p: number[] = [];
  for (let s = 2; s <= 12; s++) { x.push(s); p.push((6 - Math.abs(s - 7)) / 36); }
  return { x, p };
}

/** Small seeded generator (mulberry32), so a simulation can be repeated. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** Draw n values of X; returns counts per table entry and the sample mean and variance. */
export function simulate(d: Dist, n: number, seed = 1) {
  const r = rng(seed), counts = d.x.map(() => 0), cum: number[] = [];
  d.p.reduce((s, v, i) => (cum[i] = s + v), 0);
  let s1 = 0, s2 = 0;
  for (let i = 0; i < n; i++) {
    const u = r() * cum[cum.length - 1];
    let j = cum.findIndex((c) => u < c); if (j < 0) j = cum.length - 1;
    counts[j]++; s1 += d.x[j]; s2 += d.x[j] * d.x[j];
  }
  const mean = s1 / n;
  return { counts, mean, variance: Math.max(0, s2 / n - mean * mean) };
}
