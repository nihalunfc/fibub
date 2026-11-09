// FASTA / FASTQ inspector: a streaming reader that takes text in chunks of any size (so files of several GB can be
// read piece by piece in the browser) and keeps running totals: read lengths, base counts, GC per read, quality per
// position and per read, base composition per position and a duplicate sample. No DOM.

export const QMAX = 94; // quality codes '!' (33) to '~' (126)
export type Format = 'fastq' | 'fasta';

export type Result = {
  format: Format; reads: number; bases: number;
  minLen: number; maxLen: number; meanLen: number; n50: number;
  counts: { A: number; C: number; G: number; T: number; N: number; other: number };
  gc: number; // G+C as a fraction of A+C+G+T
  lengths: [number, number][]; // [length, reads], sorted by length
  gcHist: number[]; // 101 bins: reads by rounded GC %
  offset: 33 | 64; minCode: number; maxCode: number;
  q30: number; meanQ: number; // share of bases with Q >= 30, mean of all base qualities
  readQ: number[]; // reads by rounded mean quality (index = Phred)
  posQ: Uint32Array; posComp: Uint32Array; positions: number; // per position: quality counts (QMAX each) and A C G T N counts
  sampled: number; distinct: number; top: { seq: string; count: number }[];
  errors: string[];
};

export class SeqStats {
  private rest = '';
  private state = 0; // FASTQ: 0 header, 1 sequence, 2 plus, 3 quality
  private fmt: Format | null = null;
  private seq = '';
  private seqLen = 0; // FASTA: running length of the current record
  private gcRun = 0; private atRun = 0; private posRun = 0;
  private lineNo = 0;
  readonly maxPos: number; readonly dupSample: number;
  lens = new Map<number, number>();
  reads = 0; bases = 0;
  cnt = { A: 0, C: 0, G: 0, T: 0, N: 0, other: 0 };
  gcHist = new Array(101).fill(0);
  qHist = new Float64Array(QMAX); rq33 = new Float64Array(QMAX); rq64 = new Float64Array(QMAX);
  posQ: Uint32Array; posComp: Uint32Array; positions = 0;
  minCode = 999; maxCode = -1;
  dup = new Map<string, number>();
  errors: string[] = [];

  constructor(maxPos = 1000, dupSample = 100000) {
    this.maxPos = maxPos; this.dupSample = dupSample;
    this.posQ = new Uint32Array(maxPos * QMAX); this.posComp = new Uint32Array(maxPos * 5);
  }

  push(chunk: string) {
    const text = this.rest + chunk;
    let start = 0;
    for (;;) {
      const nl = text.indexOf('\n', start);
      if (nl < 0) break;
      this.line(text.charCodeAt(nl - 1) === 13 ? text.slice(start, nl - 1) : text.slice(start, nl));
      start = nl + 1;
    }
    this.rest = text.slice(start);
  }
  end() {
    if (this.rest) { this.line(this.rest.replace(/\r$/, '')); this.rest = ''; }
    if (this.fmt === 'fasta' && this.state === 1) this.closeFasta();
    if (this.fmt === 'fastq' && this.state !== 0) this.err(`The file ends in the middle of read ${this.reads + 1}.`);
  }
  private err(m: string) { if (this.errors.length < 5) this.errors.push(m); }

  private line(l: string) {
    this.lineNo++;
    if (this.fmt === null) {
      if (!l.trim()) return;
      if (l[0] === '@') this.fmt = 'fastq';
      else if (l[0] === '>') this.fmt = 'fasta';
      else { this.fmt = 'fasta'; this.state = 1; this.addFasta(l); return; }
    }
    if (this.fmt === 'fasta') {
      if (l[0] === '>') { if (this.state === 1) this.closeFasta(); this.state = 1; this.seqLen = 0; this.gcRun = 0; this.atRun = 0; this.posRun = 0; this.seq = ''; return; }
      if (l[0] === ';') return;
      if (this.state === 0) this.state = 1;
      this.addFasta(l.trim());
      return;
    }
    // FASTQ, four lines per read.
    if (this.state === 0) {
      if (!l) return;
      if (l[0] !== '@') { this.err(`Line ${this.lineNo.toLocaleString('en')} should start a read with @.`); return; }
      this.state = 1; return;
    }
    if (this.state === 1) { this.seq = l.trim(); this.state = 2; return; }
    if (this.state === 2) { if (l[0] !== '+') this.err(`Line ${this.lineNo.toLocaleString('en')} should be the + line of read ${this.reads + 1}.`); this.state = 3; return; }
    this.state = 0;
    const s = this.seq, qs = l.trim();
    if (qs.length !== s.length) { this.err(`Read ${(this.reads + 1).toLocaleString('en')} has ${s.length} bases but ${qs.length} quality letters; it was skipped.`); return; }
    let gc = 0, at = 0, qsum = 0;
    const P = this.maxPos;
    for (let i = 0; i < s.length; i++) {
      const b = s.charCodeAt(i) & 0xdf, k = b === 65 ? 0 : b === 67 ? 1 : b === 71 ? 2 : b === 84 || b === 85 ? 3 : b === 78 ? 4 : 5;
      if (k === 1 || k === 2) gc++; else if (k === 0 || k === 3) at++;
      this.count(k);
      let c = qs.charCodeAt(i) - 33; if (c < 0) c = 0; if (c >= QMAX) c = QMAX - 1;
      if (c < this.minCode) this.minCode = c; if (c > this.maxCode) this.maxCode = c;
      qsum += c; this.qHist[c]++;
      if (i < P) { this.posQ[i * QMAX + c]++; if (k < 5) this.posComp[i * 5 + k]++; }
    }
    if (s.length > this.positions) this.positions = Math.min(s.length, P);
    const mq = qsum / Math.max(1, s.length); // mean code; the read's mean quality under each possible offset
    this.rq33[Math.min(QMAX - 1, Math.round(mq))]++; this.rq64[Math.max(0, Math.min(QMAX - 1, Math.round(mq - 31)))]++;
    this.finishRead(s.length, gc, at, s);
  }

  private count(k: number) { if (k === 0) this.cnt.A++; else if (k === 1) this.cnt.C++; else if (k === 2) this.cnt.G++; else if (k === 3) this.cnt.T++; else if (k === 4) this.cnt.N++; else this.cnt.other++; }
  private addFasta(l: string) {
    const P = this.maxPos;
    for (let i = 0; i < l.length; i++) {
      const b = l.charCodeAt(i) & 0xdf;
      if (b < 65 || b > 90) continue;
      const k = b === 65 ? 0 : b === 67 ? 1 : b === 71 ? 2 : b === 84 || b === 85 ? 3 : b === 78 ? 4 : 5;
      if (k === 1 || k === 2) this.gcRun++; else if (k === 0 || k === 3) this.atRun++;
      this.count(k);
      if (this.posRun < P && k < 5) this.posComp[this.posRun * 5 + k]++;
      this.posRun++; this.seqLen++;
      if (this.reads < this.dupSample && this.seq.length < 1000) this.seq += String.fromCharCode(b);
    }
  }
  private closeFasta() {
    if (this.posRun > this.positions) this.positions = Math.min(this.posRun, this.maxPos);
    this.finishRead(this.seqLen, this.gcRun, this.atRun, this.seqLen <= 1000 ? this.seq : '');
    this.state = 0;
  }
  private finishRead(len: number, gc: number, at: number, s: string) {
    this.reads++; this.bases += len;
    this.lens.set(len, (this.lens.get(len) ?? 0) + 1);
    if (gc + at > 0) this.gcHist[Math.round((100 * gc) / (gc + at))]++;
    if (this.reads <= this.dupSample && s) { const u = s.toUpperCase(); this.dup.set(u, (this.dup.get(u) ?? 0) + 1); }
  }

  result(): Result {
    const fmt = this.fmt ?? 'fasta';
    const lengths = [...this.lens.entries()].sort((a, b) => a[0] - b[0]);
    let half = this.bases / 2, n50 = 0;
    for (let i = lengths.length - 1, acc = 0; i >= 0; i--) { acc += lengths[i][0] * lengths[i][1]; if (acc >= half) { n50 = lengths[i][0]; break; } }
    const fq = fmt === 'fastq' && this.maxCode >= 0;
    // Phred+64 files never use codes below 64 ('@'); Phred+33 files almost always do.
    const offset: 33 | 64 = fq && this.minCode >= 31 ? 64 : 33, sh = offset - 33;
    let q30 = 0, qs = 0, qn = 0;
    for (let c = 0; c < QMAX; c++) { const n = this.qHist[c], q = c - sh; qn += n; qs += n * q; if (q >= 30) q30 += n; }
    const readQ = [...(sh ? this.rq64 : this.rq33)];
    let posQ = this.posQ;
    if (sh) { posQ = new Uint32Array(this.posQ.length); for (let p = 0; p < this.positions; p++) for (let c = sh; c < QMAX; c++) posQ[p * QMAX + c - sh] = this.posQ[p * QMAX + c]; }
    const sampled = Math.min(this.reads, this.dupSample);
    const top = [...this.dup.entries()].filter((e) => e[1] > 1).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([seq, count]) => ({ seq, count }));
    const acgt = this.cnt.A + this.cnt.C + this.cnt.G + this.cnt.T;
    return {
      format: fmt, reads: this.reads, bases: this.bases,
      minLen: lengths.length ? lengths[0][0] : 0, maxLen: lengths.length ? lengths[lengths.length - 1][0] : 0, meanLen: this.reads ? this.bases / this.reads : 0, n50,
      counts: { ...this.cnt }, gc: acgt ? (this.cnt.C + this.cnt.G) / acgt : NaN, lengths, gcHist: [...this.gcHist],
      offset, minCode: this.minCode - sh, maxCode: this.maxCode - sh, q30: qn ? q30 / qn : NaN, meanQ: qn ? qs / qn : NaN, readQ,
      posQ, posComp: this.posComp, positions: this.positions,
      sampled, distinct: this.dup.size, top, errors: [...this.errors],
    };
  }
}

/** Smallest value whose cumulative count reaches q of the total (numpy's 'inverted_cdf'). */
export function histQuantile(h: ArrayLike<number>, q: number, from = 0, len = h.length) {
  let n = 0; for (let i = 0; i < len; i++) n += h[from + i];
  if (!n) return NaN;
  const want = q * n; let acc = 0;
  for (let i = 0; i < len; i++) { acc += h[from + i]; if (acc >= want && acc > 0) return i; }
  return len - 1;
}

export type PosBox = { from: number; to: number; mean: number; p10: number; p25: number; med: number; p75: number; p90: number; n: number };
/** Quality boxes by position, grouping positions so there are at most `maxGroups` boxes. Positions are 1-based. */
export function qualityBoxes(r: Result, maxGroups = 100): PosBox[] {
  const g = Math.max(1, Math.ceil(r.positions / maxGroups)), out: PosBox[] = [];
  for (let a = 0; a < r.positions; a += g) {
    const b = Math.min(r.positions, a + g), h = new Float64Array(QMAX);
    for (let p = a; p < b; p++) for (let c = 0; c < QMAX; c++) h[c] += r.posQ[p * QMAX + c];
    let n = 0, s = 0; for (let c = 0; c < QMAX; c++) { n += h[c]; s += c * h[c]; }
    if (!n) continue;
    out.push({ from: a + 1, to: b, mean: s / n, p10: histQuantile(h, 0.1), p25: histQuantile(h, 0.25), med: histQuantile(h, 0.5), p75: histQuantile(h, 0.75), p90: histQuantile(h, 0.9), n });
  }
  return out;
}

/** Percent A, C, G, T and N at each position (1-based), grouped like qualityBoxes. */
export function composition(r: Result, maxGroups = 100) {
  const g = Math.max(1, Math.ceil(r.positions / maxGroups)), out: { pos: number; A: number; C: number; G: number; T: number; N: number }[] = [];
  for (let a = 0; a < r.positions; a += g) {
    const b = Math.min(r.positions, a + g), c = [0, 0, 0, 0, 0];
    for (let p = a; p < b; p++) for (let k = 0; k < 5; k++) c[k] += r.posComp[p * 5 + k];
    const n = c.reduce((x, y) => x + y, 0); if (!n) continue;
    out.push({ pos: (a + 1 + b) / 2, A: (100 * c[0]) / n, C: (100 * c[1]) / n, G: (100 * c[2]) / n, T: (100 * c[3]) / n, N: (100 * c[4]) / n });
  }
  return out;
}

/** A small seeded random number generator (mulberry32), for made-up examples that are the same every time. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** Made-up FASTQ reads: random bases, quality that falls along the read, a few Ns, and one made-up sequence repeated
 *  in about 3 % of reads so the duplicate check has something to find. */
export function exampleFastq(reads = 500, len = 100, seed = 7) {
  const r = rng(seed), B = 'ACGT', rep = 'GATTACAGATTACACCGGTTAACCGGTTAAGGCCTTAAGGCCTTAATTGGCCAATTGGCCAAGGTTCCAAGGTTCCAACC'.repeat(Math.ceil(len / 80)).slice(0, len);
  const out: string[] = [];
  for (let i = 0; i < reads; i++) {
    const L = i % 10 === 9 ? len - 1 - Math.floor(r() * 30) : len;
    let s = '';
    if (r() < 0.03) s = rep.slice(0, L);
    else for (let p = 0; p < L; p++) s += r() < 0.002 ? 'N' : B[Math.floor(r() * 4)];
    let q = '';
    for (let p = 0; p < s.length; p++) {
      const mean = 37 - (14 * p) / len, v = s[p] === 'N' ? 2 : Math.max(2, Math.min(41, Math.round(mean + (r() - 0.5) * 12 - (r() < 0.05 ? 15 : 0))));
      q += String.fromCharCode(v + 33);
    }
    out.push(`@demo_read_${i + 1}`, s, '+', q);
  }
  return out.join('\n') + '\n';
}
