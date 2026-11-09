// Randomisation lists for trials: simple, permuted blocks (fixed or random sizes) and stratified blocks,
// with allocation ratios, from a seeded, reproducible random number generator.
//
// Generator (documented so anyone can reproduce a list):
//   1. The seed text is encoded as UTF-8 and hashed with 32-bit FNV-1a (offset 2166136261, prime 16777619).
//   2. Four 32-bit words from SplitMix32 started at that hash fill the state (z += 0x9e3779b9;
//      z ^= z >>> 16; z *= 0x21f0aaad; z ^= z >>> 15; z *= 0x735a2d97; z ^= z >>> 15).
//   3. Numbers come from xoshiro128** (Blackman and Vigna 2018, https://prng.di.unimi.it/).
//   4. A whole number below n is drawn without bias by rejection: draws at or above floor(2^32 / n) * n are thrown away,
//      then the draw is taken mod n.
//   5. A block is shuffled by Fisher-Yates (Durstenfeld): for i from the last place down to 1, swap place i with a
//      place j drawn from 0..i.
// Each stratum has its own generator, seeded with "<seed>/<stratum name>" (just "<seed>" with no strata), so
// changing one stratum's size never changes another stratum's list.

export class Xoshiro128ss {
  s: Uint32Array;
  constructor(seed: number[] | Uint32Array) {
    this.s = Uint32Array.from(seed);
    if (this.s.every((v) => v === 0)) this.s[0] = 1;
  }
  /** Next 32-bit unsigned integer. */
  next(): number {
    const s = this.s;
    const r = Math.imul(rotl(Math.imul(s[1], 5), 7), 9) >>> 0;
    const t = s[1] << 9;
    s[2] ^= s[0]; s[3] ^= s[1]; s[1] ^= s[2]; s[0] ^= s[3]; s[2] ^= t; s[3] = rotl(s[3], 11);
    return r;
  }
  /** Uniform whole number 0 <= k < n, without modulo bias. */
  below(n: number): number {
    if (!(n >= 1 && n <= 2 ** 32)) throw new Error('bad range');
    const limit = Math.floor(2 ** 32 / n) * n;
    let x: number;
    do x = this.next(); while (x >= limit);
    return x % n;
  }
}
const rotl = (x: number, k: number) => ((x << k) | (x >>> (32 - k))) >>> 0;

export function fnv1a(text: string): number {
  let h = 2166136261;
  for (const b of new TextEncoder().encode(text)) h = Math.imul(h ^ b, 16777619) >>> 0;
  return h >>> 0;
}
export function splitmix32(seed: number): () => number {
  let z = seed >>> 0;
  return () => {
    z = (z + 0x9e3779b9) >>> 0;
    let x = z;
    x = Math.imul(x ^ (x >>> 16), 0x21f0aaad);
    x = Math.imul(x ^ (x >>> 15), 0x735a2d97);
    return (x ^ (x >>> 15)) >>> 0;
  };
}
/** The generator for a seed text (steps 1 to 3 above). */
export function rngFromText(text: string): Xoshiro128ss {
  const sm = splitmix32(fnv1a(text));
  return new Xoshiro128ss([sm(), sm(), sm(), sm()]);
}

export type Method = 'simple' | 'blocks' | 'random-blocks';
export type Allocation = { seq: number; stratum: string; inStratum: number; block: number; blockSize: number; arm: string; armIndex: number };
export type ListOptions = {
  arms: string[]; ratio: number[]; method: Method; blockSizes: number[]; perStratum: number;
  /** Stratification factors: each has a name and levels. Empty for one unstratified list. */
  factors: { name: string; levels: string[] }[];
  seed: string;
};
export type StratumSummary = { name: string; counts: number[]; maxImbalance: number; blocks: number; lastBlockComplete: boolean };

/** All strata as names, in order (the cartesian product of the factors' levels). */
export function strata(factors: { name: string; levels: string[] }[]): string[] {
  let out: string[] = [''];
  for (const f of factors) out = out.flatMap((s) => f.levels.map((l) => (s ? `${s}, ` : '') + (f.name ? `${f.name}: ${l}` : l)));
  return out;
}

/** "2:1" or "2 1" into [2, 1]. */
export function parseRatio(text: string, arms: number): number[] {
  const t = text.trim();
  if (!t) return Array(arms).fill(1);
  const r = t.split(/[:\s,]+/).filter(Boolean).map(Number);
  if (r.length !== arms) throw new Error(`The ratio has ${r.length} part${r.length === 1 ? '' : 's'} but there ${arms === 1 ? 'is 1 arm' : `are ${arms} arms`}. Write one whole number per arm, such as ${Array(arms).fill(1).join(':')}.`);
  if (r.some((v) => !(Number.isInteger(v) && v >= 1 && v <= 20))) throw new Error('Each part of the ratio must be a whole number from 1 to 20.');
  return r;
}

function checkOptions(o: ListOptions) {
  if (o.arms.length < 2) throw new Error('Name at least two arms (groups), separated by commas.');
  if (o.arms.length > 12) throw new Error('This tool takes up to 12 arms.');
  if (new Set(o.arms).size !== o.arms.length) throw new Error('Each arm needs a different name.');
  if (o.ratio.length !== o.arms.length) throw new Error('Give one ratio part per arm.');
  if (!(Number.isInteger(o.perStratum) && o.perStratum >= 1 && o.perStratum <= 10000)) throw new Error('The list length must be a whole number from 1 to 10,000 per stratum.');
  const R = o.ratio.reduce((s, v) => s + v, 0);
  if (o.method !== 'simple') {
    if (!o.blockSizes.length) throw new Error('Give a block size.');
    for (const b of o.blockSizes) if (!(Number.isInteger(b) && b >= R && b % R === 0 && b <= 200)) throw new Error(`Block size ${b} does not work: with a ${o.ratio.join(':')} ratio every block size must be a multiple of ${R} (such as ${R}, ${2 * R} or ${3 * R}), up to 200.`);
  }
  const n = strata(o.factors).length;
  if (n > 200) throw new Error(`That makes ${n} strata; this tool takes up to 200. Use fewer factors or levels.`);
  if (n * o.perStratum > 20000) throw new Error(`That is ${(n * o.perStratum).toLocaleString('en')} allocations; this tool makes up to 20,000 at once.`);
  if (!o.seed) throw new Error('Type a seed (any word or number), so the list can be made again.');
}

/** One stratum's allocations (armIndex per place, with block numbers and sizes). */
export function stratumList(o: ListOptions, stratum: string): { arm: number; block: number; size: number }[] {
  const rng = rngFromText(stratum ? `${o.seed}/${stratum}` : o.seed);
  const R = o.ratio.reduce((s, v) => s + v, 0), out: { arm: number; block: number; size: number }[] = [];
  if (o.method === 'simple') {
    const cum: number[] = []; o.ratio.reduce((s, v, i) => (cum[i] = s + v), 0);
    for (let i = 0; i < o.perStratum; i++) { const k = rng.below(R); out.push({ arm: cum.findIndex((c) => k < c), block: 0, size: 0 }); }
    return out;
  }
  let block = 0;
  while (out.length < o.perStratum) {
    const size = o.method === 'random-blocks' ? o.blockSizes[rng.below(o.blockSizes.length)] : o.blockSizes[0];
    const m = size / R, b: number[] = [];
    o.ratio.forEach((r, k) => { for (let j = 0; j < r * m; j++) b.push(k); });
    for (let i = b.length - 1; i > 0; i--) { const j = rng.below(i + 1); [b[i], b[j]] = [b[j], b[i]]; }
    block++;
    for (const k of b) { if (out.length >= o.perStratum) break; out.push({ arm: k, block, size }); }
  }
  return out;
}

export function makeList(o: ListOptions): { list: Allocation[]; summary: StratumSummary[] } {
  checkOptions(o);
  const list: Allocation[] = [], summary: StratumSummary[] = [];
  const R = o.ratio.reduce((s, v) => s + v, 0);
  for (const st of strata(o.factors)) {
    const s = stratumList(o, st), counts = o.arms.map(() => 0);
    let maxImb = 0;
    s.forEach((a, i) => {
      counts[a.arm]++;
      // Running imbalance: the largest gap between an arm's count and its share by the ratio, in participants.
      const n = i + 1;
      maxImb = Math.max(maxImb, ...counts.map((c, k) => Math.abs(c - (n * o.ratio[k]) / R)));
      list.push({ seq: list.length + 1, stratum: st, inStratum: n, block: a.block, blockSize: a.size, arm: o.arms[a.arm], armIndex: a.arm });
    });
    const last = s[s.length - 1];
    const lastBlockComplete = o.method === 'simple' || s.filter((a) => a.block === last.block).length === last.size;
    summary.push({ name: st || 'All', counts, maxImbalance: maxImb, blocks: last.block, lastBlockComplete });
  }
  return { list, summary };
}
