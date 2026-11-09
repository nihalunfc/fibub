// VCF reader and summary: streams text in chunks of any size, keeps the header, and counts variants by type and
// chromosome, transitions and transversions, filters, QUAL and allele frequency, and genotypes per sample, for the
// records that pass the user's filters. Matching lines are kept (up to a cap) for a filtered VCF. No DOM.

export type VarType = 'SNV' | 'insertion' | 'deletion' | 'MNV' | 'complex' | 'other';
export const TYPES: VarType[] = ['SNV', 'insertion', 'deletion', 'MNV', 'complex', 'other'];

/** Kind of change from REF to one ALT allele. Symbolic, breakend, '*' and missing alleles are 'other'. */
export function varType(ref: string, alt: string): VarType {
  if (!alt || alt === '.' || alt === '*' || /[<>[\]]/.test(alt) || !/^[ACGTN]+$/i.test(ref) || !/^[ACGTN]+$/i.test(alt)) return 'other';
  if (ref.length === alt.length) return ref.length === 1 ? 'SNV' : 'MNV';
  if (ref.length === 1 && alt.length > 1 && alt[0].toUpperCase() === ref[0].toUpperCase()) return 'insertion';
  if (alt.length === 1 && ref.length > 1 && ref[0].toUpperCase() === alt[0].toUpperCase()) return 'deletion';
  return 'complex';
}
/** A↔G and C↔T are transitions; the other single-base changes are transversions. */
export const isTransition = (r: string, a: string) => { const x = (r + a).toUpperCase(); return x === 'AG' || x === 'GA' || x === 'CT' || x === 'TC'; };

/** Alleles of a GT value such as 0/1, 1|1, ./. or 1; null alleles are -1. */
export function parseGT(s: string) { return s.split(/[/|]/).map((x) => (x === '.' || x === '' ? -1 : Number(x))); }
export type GtKind = 'homRef' | 'het' | 'homAlt' | 'missing';
export function gtKind(al: number[]): GtKind {
  if (!al.length || al.some((x) => x < 0 || !Number.isFinite(x))) return 'missing';
  if (al.every((x) => x === 0)) return 'homRef';
  return al.every((x) => x === al[0]) ? 'homAlt' : 'het';
}

export type Filter = { chrom?: string; start?: number; end?: number; minQual?: number; passOnly?: boolean; types?: VarType[]; minDP?: number };
export type SampleCounts = { name: string; homRef: number; het: number; homAlt: number; missing: number };
export type Result = {
  records: number; kept: number; alleles: number; header: string[]; samples: SampleCounts[]; contigs: string[];
  byType: Record<VarType, number>; byChrom: [string, number][];
  ti: number; tv: number; multiallelic: number; pass: number; failed: number; noFilter: number; failedBy: [string, number][];
  qualHist: number[]; qualMissing: number; qualMax: number; afHist: number[]; afFrom: 'info' | 'genotypes' | 'none';
  lines: string[]; linesCapped: boolean; errors: string[];
};

export const QBIN = 10, QBINS = 51; // QUAL 0-9.99, 10-19.99, ... 500 and up

export class VcfStats {
  private rest = '';
  private lineNo = 0;
  private cols: string[] | null = null;
  header: string[] = [];
  names: string[] = [];
  contigs: string[] = [];
  private s: SampleCounts[] = [];
  records = 0; kept = 0; alleles = 0;
  byType = Object.fromEntries(TYPES.map((t) => [t, 0])) as Record<VarType, number>;
  byChrom = new Map<string, number>();
  ti = 0; tv = 0; multi = 0; pass = 0; failed = 0; noFilter = 0; failedBy = new Map<string, number>();
  qualHist = new Array(QBINS).fill(0); qualMissing = 0; qualMax = 0;
  afHist = new Array(20).fill(0); afInfo = 0; afGt = 0;
  lines: string[] = []; capped = false;
  errors: string[] = [];
  private f: Filter; private maxLines: number;

  constructor(filter: Filter = {}, maxLines = 200000) { this.f = filter; this.maxLines = maxLines; }

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
  end() { if (this.rest) { this.line(this.rest.replace(/\r$/, '')); this.rest = ''; } }
  private err(m: string) { if (this.errors.length < 5) this.errors.push(m); }

  private line(l: string) {
    this.lineNo++;
    if (!l) return;
    if (l.startsWith('##')) { this.header.push(l); const m = /^##contig=<.*?ID=([^,>]+)/.exec(l); if (m) this.contigs.push(m[1]); return; }
    if (l.startsWith('#')) {
      this.header.push(l); this.cols = l.slice(1).split('\t');
      this.names = this.cols.slice(9); this.s = this.names.map((name) => ({ name, homRef: 0, het: 0, homAlt: 0, missing: 0 }));
      return;
    }
    const c = l.split('\t');
    if (c.length < 8) { this.err(`Line ${this.lineNo.toLocaleString('en')} has ${c.length} columns; a VCF record needs at least 8 (tab-separated). It was skipped.`); return; }
    this.records++;
    const [chrom, posS, , ref, altS, qualS, filter, info] = c, pos = Number(posS);
    const alts = altS.split(','), qual = qualS === '.' ? NaN : Number(qualS);
    const types = alts.map((a) => varType(ref, a));
    const f = this.f;
    if (f.chrom && chrom !== f.chrom) return;
    if (f.start !== undefined && pos < f.start) return;
    if (f.end !== undefined && pos > f.end) return;
    if (f.minQual !== undefined && !(qual >= f.minQual)) return;
    if (f.passOnly && filter !== 'PASS') return;
    if (f.types && f.types.length && !types.some((t) => f.types!.includes(t))) return;
    let dp = NaN, afs: number[] | null = null;
    for (const kv of info.split(';')) {
      if (kv.startsWith('DP=')) dp = Number(kv.slice(3));
      else if (kv.startsWith('AF=')) afs = kv.slice(3).split(',').map(Number);
    }
    if (f.minDP !== undefined && !(dp >= f.minDP)) return;
    this.kept++;
    if (this.lines.length < this.maxLines) this.lines.push(l); else this.capped = true;
    this.byChrom.set(chrom, (this.byChrom.get(chrom) ?? 0) + 1);
    if (alts.length > 1) this.multi++;
    if (filter === 'PASS') this.pass++;
    else if (filter === '.' || filter === '') this.noFilter++;
    else { this.failed++; for (const k of filter.split(';')) this.failedBy.set(k, (this.failedBy.get(k) ?? 0) + 1); }
    if (Number.isFinite(qual)) { this.qualHist[Math.min(QBINS - 1, Math.max(0, Math.floor(qual / QBIN)))]++; if (qual > this.qualMax) this.qualMax = qual; } else this.qualMissing++;
    alts.forEach((a, k) => {
      const t = types[k]; this.byType[t]++; this.alleles++;
      if (t === 'SNV') { if (isTransition(ref, a)) this.ti++; else this.tv++; }
    });
    // Genotypes.
    let gtCounts: number[] | null = null, called = 0;
    if (c.length > 9 && this.s.length) {
      const fmt = c[8].split(':'), gi = fmt.indexOf('GT');
      if (gi >= 0) {
        gtCounts = new Array(alts.length + 1).fill(0);
        for (let k = 0; k < this.s.length; k++) {
          const v = c[9 + k]; if (v === undefined) { this.s[k].missing++; continue; }
          const al = parseGT(v.split(':')[gi] ?? '.');
          this.s[k][gtKind(al)]++;
          for (const x of al) if (x >= 0 && x <= alts.length) { gtCounts[x]++; called++; }
        }
      }
    }
    // Allele frequency: INFO AF when present, else counted from genotypes.
    alts.forEach((_, k) => {
      let af = NaN;
      if (afs && Number.isFinite(afs[k])) { af = afs[k]; this.afInfo++; }
      else if (gtCounts && called) { af = gtCounts[k + 1] / called; this.afGt++; }
      if (Number.isFinite(af)) this.afHist[Math.min(19, Math.max(0, Math.floor(af * 20)))]++;
    });
  }

  result(): Result {
    return {
      records: this.records, kept: this.kept, alleles: this.alleles, header: this.header, samples: this.s.map((x) => ({ ...x })), contigs: this.contigs,
      byType: { ...this.byType }, byChrom: [...this.byChrom.entries()],
      ti: this.ti, tv: this.tv, multiallelic: this.multi, pass: this.pass, failed: this.failed, noFilter: this.noFilter, failedBy: [...this.failedBy.entries()].sort((a, b) => b[1] - a[1]),
      qualHist: [...this.qualHist], qualMissing: this.qualMissing, qualMax: this.qualMax, afHist: [...this.afHist],
      afFrom: this.afInfo ? 'info' : this.afGt ? 'genotypes' : 'none',
      lines: this.lines, linesCapped: this.capped, errors: [...this.errors],
    };
  }
}

/** Made-up VCF: three made-up contigs, three made-up samples, random positions, mostly SNVs (about two thirds
 *  transitions), some indels, a few MNVs and multi-allelic sites, random QUAL, DP and genotypes. */
export function exampleVcf(n = 300, seed = 5, rng: () => number = mulberry(seed)) {
  const r = rng, B = 'ACGT', TI: Record<string, string> = { A: 'G', G: 'A', C: 'T', T: 'C' };
  const contigs: [string, number][] = [['chrA', 50000], ['chrB', 30000], ['chrC', 20000]];
  const rows: { c: number; pos: number; line: string }[] = [];
  const base = () => B[Math.floor(r() * 4)];
  for (let i = 0; i < n; i++) {
    const ci = r() < 0.5 ? 0 : r() < 0.6 ? 1 : 2, pos = 1 + Math.floor(r() * contigs[ci][1]);
    const u = r(); let ref = base(), alt: string;
    if (u < 0.8) { alt = r() < 0.67 ? TI[ref] : (() => { let x; do x = base(); while (x === ref || x === TI[ref]); return x; })(); if (r() < 0.05) { let y; do y = base(); while (y === ref || y === alt); alt += ',' + y; } }
    else if (u < 0.88) { alt = ref + Array.from({ length: 1 + Math.floor(r() * 4) }, base).join(''); }
    else if (u < 0.96) { alt = ref; ref = ref + Array.from({ length: 1 + Math.floor(r() * 4) }, base).join(''); }
    else { ref = base() + base(); alt = [...ref].map((x) => TI[x]).join(''); }
    const qual = r() < 0.03 ? '.' : (5 + r() * 300).toFixed(1), dp = 5 + Math.floor(r() * 60);
    const filter = Number(qual) < 30 ? 'LowQual' : r() < 0.06 ? 'StrandBias' : 'PASS';
    const nAlt = alt.split(',').length;
    const gts = [0, 1, 2].map(() => { if (r() < 0.04) return './.'; const g = () => (r() < 0.45 ? 0 : 1 + Math.floor(r() * nAlt)); const a = g(), b = g(); return `${Math.min(a, b)}/${Math.max(a, b)}`; });
    rows.push({ c: ci, pos, line: `${contigs[ci][0]}\t${pos}\t.\t${ref}\t${alt}\t${qual}\t${filter}\tDP=${dp}\tGT:DP\t${gts.map((g) => `${g}:${Math.floor(dp / 3)}`).join('\t')}` });
  }
  rows.sort((a, b) => a.c - b.c || a.pos - b.pos);
  return ['##fileformat=VCFv4.2', '##source=fibub made-up example', ...contigs.map(([id, len]) => `##contig=<ID=${id},length=${len}>`),
    '##FILTER=<ID=LowQual,Description="Made-up: QUAL below 30">', '##FILTER=<ID=StrandBias,Description="Made-up filter for the example">',
    '##INFO=<ID=DP,Number=1,Type=Integer,Description="Read depth">', '##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">', '##FORMAT=<ID=DP,Number=1,Type=Integer,Description="Read depth">',
    '#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tsample1\tsample2\tsample3', ...rows.map((x) => x.line)].join('\n') + '\n';
}
function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
