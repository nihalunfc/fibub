// k-mer counting for FASTA and FASTQ, read piece by piece: counts of every k-letter word (optionally merged with its
// reverse complement, "canonical"), the k-mer spectrum (how many distinct k-mers occur once, twice, ...), the most
// common k-mers and a rough genome size from the spectrum's main peak. Words with letters other than A, C, G, T are
// skipped. k-mers are kept as numbers (2 bits a base), so k is at most 25. No DOM.

export const MAX_K = 25;
const CODE: Record<string, number> = { A: 0, C: 1, G: 2, T: 3, a: 0, c: 1, g: 2, t: 3, U: 3, u: 3 };
const BASES = 'ACGT';

export function decode(code: number, k: number) {
  let s = '';
  for (let i = 0; i < k; i++) { s = BASES[code % 4] + s; code = Math.floor(code / 4); }
  return s;
}
export function encode(s: string) {
  let v = 0;
  for (const ch of s) { const c = CODE[ch]; if (c === undefined) return NaN; v = v * 4 + c; }
  return v;
}
export const revComp = (s: string) => [...s].reverse().map((c) => ({ A: 'T', C: 'G', G: 'C', T: 'A', U: 'A' })[c.toUpperCase()] ?? 'N').join('');

export type KmerOpts = { k: number; canonical: boolean; maxDistinct?: number };

/** Streaming counter: push text in chunks of any size, then end(). Reads FASTA (records start with >), FASTQ
 *  (four lines: @name, sequence, +, quality) or plain sequence lines. */
export class KmerCounter {
  readonly k: number; readonly canonical: boolean; readonly maxDistinct: number;
  counts = new Map<number, number>();
  records = 0; bases = 0; other = 0; total = 0; full = false; format: 'fasta' | 'fastq' | 'plain' | '' = '';
  private rest = ''; private fq = 0; // FASTQ line within a record: 0 header, 1 sequence, 2 plus, 3 quality
  private fwd = 0; private rev = 0; private len = 0; private readonly top: number;
  private fqSeqLen = 0; private fqQualLen = 0;

  constructor(o: KmerOpts) {
    if (!Number.isInteger(o.k) || o.k < 1 || o.k > MAX_K) throw new Error(`k must be a whole number from 1 to ${MAX_K}.`);
    this.k = o.k; this.canonical = o.canonical; this.maxDistinct = o.maxDistinct ?? 5_000_000;
    this.top = 4 ** (o.k - 1);
  }
  private reset() { this.len = 0; this.fwd = 0; this.rev = 0; }
  private seq(s: string) {
    const k = this.k, top = this.top, m = this.counts;
    for (let i = 0; i < s.length; i++) {
      const c = CODE[s[i]];
      if (c === undefined) { if (s.charCodeAt(i) > 32) { this.bases++; this.other++; } this.reset(); continue; }
      this.bases++;
      this.fwd = (this.fwd % top) * 4 + c;
      this.rev = Math.floor(this.rev / 4) + (3 - c) * top;
      if (++this.len < k) continue;
      const key = this.canonical && this.rev < this.fwd ? this.rev : this.fwd;
      this.total++;
      const v = m.get(key);
      if (v !== undefined) m.set(key, v + 1);
      else if (m.size < this.maxDistinct) m.set(key, 1);
      else this.full = true;
    }
  }
  private line(l: string) {
    if (!this.format) {
      if (!l.trim()) return;
      this.format = l[0] === '>' ? 'fasta' : l[0] === '@' ? 'fastq' : 'plain';
    }
    if (this.format === 'fastq') {
      if (this.fq === 0) { if (!l.trim()) return; if (l[0] !== '@') throw new Error(`FASTQ record ${this.records + 1} should start with @.`); this.records++; this.reset(); this.fq = 1; this.fqSeqLen = 0; return; }
      if (this.fq === 1) { if (l[0] === '+') { this.fq = 3; this.fqQualLen = 0; return; } this.fqSeqLen += l.trim().length; this.seq(l.trim()); return; }
      this.fqQualLen += l.trim().length; if (this.fqQualLen >= this.fqSeqLen) this.fq = 0;
      return;
    }
    if (l[0] === '>') { this.records++; this.reset(); return; }
    if (this.format === 'plain' && !l.trim()) { this.reset(); return; }
    if (this.format === 'plain' && this.records === 0) this.records = 1;
    this.seq(l.trim());
  }
  push(text: string) {
    const t = this.rest + text;
    let a = 0;
    for (let i = t.indexOf('\n'); i !== -1; i = t.indexOf('\n', a)) { this.line(t.slice(a, i).replace(/\r$/, '')); a = i + 1; }
    this.rest = t.slice(a);
  }
  end() { if (this.rest) { this.line(this.rest.replace(/\r$/, '')); this.rest = ''; } }
  /** Count of one k-mer (its canonical form when counting canonically); NaN for a word of the wrong length or
   *  with other letters. */
  get(word: string) {
    if (word.length !== this.k) return NaN;
    let v = encode(word); if (!Number.isFinite(v)) return NaN;
    if (this.canonical) v = Math.min(v, encode(revComp(word)));
    return this.counts.get(v) ?? 0;
  }
}

/** Spectrum: hist[m] = how many distinct k-mers occur exactly m times (m from 1; the last bin collects m ≥ cap). */
export function spectrum(counts: Map<number, number>, cap = 1000) {
  const h = new Array(cap + 1).fill(0);
  for (const v of counts.values()) h[Math.min(cap, v)]++;
  return h;
}
/** The n most common k-mers, ties in alphabetical order. */
export function topKmers(counts: Map<number, number>, k: number, n = 20) {
  const best: [number, number][] = [];
  for (const [key, v] of counts) {
    if (best.length < n || v > best[best.length - 1][1] || (v === best[best.length - 1][1] && key < best[best.length - 1][0])) {
      best.push([key, v]); best.sort((a, b) => b[1] - a[1] || a[0] - b[0]); if (best.length > n) best.pop();
    }
  }
  return best.map(([key, v]) => ({ kmer: decode(key, k), count: v }));
}

/** Rough genome size from a spectrum of reads: the first valley after the error k-mers, the highest point after
 *  it (the main peak, the typical k-mer depth), then size = k-mers counted beyond the valley ÷ peak depth. Returns
 *  null when there is no clear valley and peak, or when the part past the valley holds under a quarter of all
 *  k-mers (too little coverage, very noisy reads, or an assembly rather than reads). */
export function genomeEstimate(hist: number[]) {
  const cap = hist.length - 1;
  let valley = -1;
  for (let m = 2; m < cap - 1; m++) if (hist[m] < hist[m - 1] && hist[m] <= hist[m + 1]) { valley = m; break; }
  if (valley < 0) return null;
  let peak = valley;
  for (let m = valley; m < cap; m++) if (hist[m] > hist[peak]) peak = m;
  if (peak === valley || hist[peak] < 1.5 * hist[valley] + 1) return null;
  let kmers = 0, distinct = 0, errors = 0;
  for (let m = 1; m <= cap; m++) { if (m >= valley) { kmers += m * hist[m]; distinct += hist[m]; } else errors += m * hist[m]; }
  // Reads put most k-mers in the hump; when it holds under a quarter of them (an assembly with a few repeats,
  // very noisy reads) the "peak" is not the genome's depth.
  if (kmers < 0.25 * (kmers + errors)) return null;
  return { valley, peak, size: kmers / peak, solid: kmers, solidDistinct: distinct, errorKmers: errors };
}

/** A made-up genome (a seeded random sequence with a few repeats) and reads sampled from both strands with
 *  random errors, as FASTQ, for the example. */
export function exampleReads(genomeLen = 40000, cover = 25, readLen = 100, errorRate = 0.01, seed = 11) {
  let s = seed >>> 0;
  const rnd = () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  let g = '';
  for (let i = 0; i < genomeLen; i++) g += BASES[Math.floor(rnd() * 4)];
  // Three copies of a 600-base repeat so some k-mers sit at three times the depth.
  const rep = g.slice(1000, 1600);
  g = g.slice(0, 15000) + rep + g.slice(15600, 30000) + rep + g.slice(30600);
  const n = Math.round((genomeLen * cover) / readLen), out: string[] = [];
  const q = 'I'.repeat(readLen);
  for (let r = 0; r < n; r++) {
    const p = Math.floor(rnd() * (g.length - readLen + 1));
    let read = g.slice(p, p + readLen);
    if (rnd() < 0.5) read = revComp(read);
    let e = '';
    for (const ch of read) e += rnd() < errorRate ? BASES[(BASES.indexOf(ch) + 1 + Math.floor(rnd() * 3)) % 4] : ch;
    out.push(`@read${r + 1}`, e, '+', q);
  }
  return { fastq: out.join('\n') + '\n', genome: g };
}
