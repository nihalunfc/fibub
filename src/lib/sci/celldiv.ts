// Cell division (school biology): mitosis and meiosis stage by stage, chromosome number and DNA amount per cell,
// gamete variety, and the onion root tip practical (mitotic index and stage lengths). Plain maths, no DOM.

export type Stage = { id: string; name: string; short: string; chrom: (n2: number) => number; dna: number; cells: number; note: string };
// chrom: chromosomes in each cell (or nucleus) at this stage, for a body cell with 2n = n2.
// dna: DNA amount per cell (or nucleus) in C units, where a gamete has 1C. cells: cells at the end of the stage.
const half = (n2: number) => n2 / 2;
export const MITOSIS: Stage[] = [
  { id: 'g1', name: 'Interphase: G1', short: 'G1', chrom: (n) => n, dna: 2, cells: 1, note: 'The cell grows. Each chromosome is one long thread of DNA.' },
  { id: 's', name: 'Interphase: S', short: 'S', chrom: (n) => n, dna: 4, cells: 1, note: 'DNA is copied. Each chromosome now has two identical sister chromatids joined at the centromere.' },
  { id: 'g2', name: 'Interphase: G2', short: 'G2', chrom: (n) => n, dna: 4, cells: 1, note: 'The cell gets ready to divide. Same chromosome number, double the DNA.' },
  { id: 'pro', name: 'Prophase', short: 'Pro', chrom: (n) => n, dna: 4, cells: 1, note: 'Chromosomes coil up and become visible; the nuclear envelope breaks down; spindle fibres form.' },
  { id: 'meta', name: 'Metaphase', short: 'Meta', chrom: (n) => n, dna: 4, cells: 1, note: 'Chromosomes line up in single file on the equator, each attached to spindle fibres from both poles.' },
  { id: 'ana', name: 'Anaphase', short: 'Ana', chrom: (n) => 2 * n, dna: 4, cells: 1, note: 'Centromeres split and sister chromatids are pulled to opposite poles. Each chromatid is now a chromosome.' },
  { id: 'telo', name: 'Telophase and cytokinesis', short: 'Telo', chrom: (n) => n, dna: 2, cells: 2, note: 'A nucleus forms at each pole and the cytoplasm divides: two cells, each identical to the parent.' },
];
export const MEIOSIS: Stage[] = [
  { id: 's', name: 'Interphase (DNA copied)', short: 'Int', chrom: (n) => n, dna: 4, cells: 1, note: 'As before mitosis, DNA is copied so each chromosome has two sister chromatids.' },
  { id: 'pro1', name: 'Prophase I', short: 'P I', chrom: (n) => n, dna: 4, cells: 1, note: 'Matching (homologous) chromosomes pair up and swap pieces: crossing over.' },
  { id: 'meta1', name: 'Metaphase I', short: 'M I', chrom: (n) => n, dna: 4, cells: 1, note: 'Pairs line up on the equator. Which side each pair faces is random: independent assortment.' },
  { id: 'ana1', name: 'Anaphase I', short: 'A I', chrom: (n) => n, dna: 4, cells: 1, note: 'Whole chromosomes of each pair go to opposite poles; sister chromatids stay together.' },
  { id: 'telo1', name: 'Telophase I', short: 'T I', chrom: half, dna: 2, cells: 2, note: 'Two cells, each with half the chromosome number (n), still with two chromatids each.' },
  { id: 'meta2', name: 'Metaphase II', short: 'M II', chrom: half, dna: 2, cells: 2, note: 'In each cell the chromosomes line up again, like mitosis.' },
  { id: 'ana2', name: 'Anaphase II', short: 'A II', chrom: (n) => n, dna: 2, cells: 2, note: 'Sister chromatids separate and move to opposite poles.' },
  { id: 'telo2', name: 'Telophase II', short: 'T II', chrom: half, dna: 1, cells: 4, note: 'Four cells, each with n chromosomes and different mixes of genes.' },
];

/** Different gametes from independent assortment alone: 2^n for n chromosome pairs. */
export const gameteTypes = (pairs: number) => 2 ** pairs;
/** Different chromosome mixes in a child from two parents (no crossing over): (2^n)². */
export const zygoteTypes = (pairs: number) => 4 ** pairs;
/** Chance two gametes from the same parent carry exactly the same set of chromosomes: 1 / 2^n. */
export const sameGamete = (pairs: number) => 1 / gameteTypes(pairs);

// ---------- onion root tip practical ----------
export type Phase = 'interphase' | 'prophase' | 'metaphase' | 'anaphase' | 'telophase';
export const PHASES: Phase[] = ['interphase', 'prophase', 'metaphase', 'anaphase', 'telophase'];
/** Share of the cycle spent in each phase in this teaching model (onion root tip, about 24 h cycle). */
export const SHARE: Record<Phase, number> = { interphase: 0.9, prophase: 0.05, metaphase: 0.02, anaphase: 0.01, telophase: 0.02 };
export const CYCLE_H = 24;
/** Mitotic index: dividing cells ÷ all cells counted. */
export function mitoticIndex(c: Record<Phase, number>): number {
  const all = PHASES.reduce((s, p) => s + c[p], 0);
  return all ? (all - c.interphase) / all : 0;
}
/** Time spent in a phase, estimated as (cells in it ÷ all cells) × cycle length. */
export function phaseHours(c: Record<Phase, number>, p: Phase, cycle = CYCLE_H): number {
  const all = PHASES.reduce((s, q) => s + c[q], 0);
  return all ? (c[p] / all) * cycle : 0;
}
/** A field of view: n cells, each in a phase picked at random with the model's shares. */
export function field(n: number, rnd: () => number): Phase[] {
  const out: Phase[] = [];
  for (let k = 0; k < n; k++) {
    let u = rnd(), p: Phase = 'telophase';
    for (const q of PHASES) { if (u < SHARE[q]) { p = q; break; } u -= SHARE[q]; }
    out.push(p);
  }
  return out;
}
export function tally(cells: Phase[]): Record<Phase, number> {
  const c = { interphase: 0, prophase: 0, metaphase: 0, anaphase: 0, telophase: 0 } as Record<Phase, number>;
  for (const p of cells) c[p]++;
  return c;
}
/** Small seeded random number generator (mulberry32) so a field can be repeated. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
