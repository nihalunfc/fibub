// A small genome browser's maths: read FASTA (in chunks, for genomes of tens of MB), gene models from GFF3, GTF and
// BED (BED12 blocks and thick parts too), variants from VCF; GC % over windows (from a block index, so a whole
// contig is quick), regions such as chr1:1,000-2,000 or a feature name, zoom and pan, and the drawing itself as a
// list of shapes that the page paints on a canvas or writes as SVG. Feature sequences (spliced, CDS, genomic, protein)
// come out reverse-complemented for the minus strand. Coordinates inside are 0-based, end not included. No DOM.
import { parseIntervals, chromCompare, type Iv } from './intervals.ts';
import { reverseComplement, translate } from './seqtools.ts';
import { varType, type VarType } from './vcf.ts';

// ---------- FASTA ----------
export type Contig = { name: string; desc: string; seq: string; length: number };

/** Reads FASTA text pushed in pieces of any size. Letters are kept (upper-cased); digits, spaces, gaps and other
 *  marks are dropped and counted. Text before the first '>' becomes one contig called "sequence". */
export class FastaReader {
  contigs: Contig[] = [];
  dropped = 0;
  duplicates: string[] = [];
  private cur: { name: string; desc: string; parts: string[] } | null = null;
  private carry = '';
  private names = new Set<string>();
  push(chunk: string) {
    const t = this.carry + chunk, i = t.lastIndexOf('\n');
    if (i < 0) { this.carry = t; return; }
    this.carry = t.slice(i + 1);
    this.lines(t.slice(0, i));
  }
  end() { if (this.carry) this.lines(this.carry); this.carry = ''; this.close(); return this.contigs; }
  get bases() { return this.contigs.reduce((s, c) => s + c.length, 0) + (this.cur ? this.cur.parts.reduce((s, p) => s + p.length, 0) : 0); }
  private close() {
    if (!this.cur) return;
    const seq = this.cur.parts.join('');
    let name = this.cur.name || 'sequence';
    if (this.names.has(name)) { this.duplicates.push(name); let k = 2; while (this.names.has(`${name}_${k}`)) k++; name = `${name}_${k}`; }
    this.names.add(name);
    this.contigs.push({ name, desc: this.cur.desc, seq, length: seq.length });
    this.cur = null;
  }
  private lines(block: string) {
    for (const raw of block.split('\n')) {
      const line = raw.endsWith('\r') ? raw.slice(0, -1) : raw;
      if (line[0] === '>') {
        this.close();
        const h = line.slice(1).trim(), sp = h.search(/\s/);
        this.cur = { name: sp < 0 ? h : h.slice(0, sp), desc: sp < 0 ? '' : h.slice(sp + 1).trim(), parts: [] };
        continue;
      }
      if (line[0] === ';' || !line) continue;
      if (!this.cur) this.cur = { name: 'sequence', desc: '', parts: [] };
      const clean = line.replace(/[^A-Za-z]/g, '');
      this.dropped += line.replace(/\s/g, '').length - clean.length;
      this.cur.parts.push(clean.toUpperCase());
    }
  }
}
export const parseFasta = (text: string) => { const r = new FastaReader(); r.push(text); r.end(); return r; };

// ---------- GC ----------
const BLOCK = 256;
/** Cumulative G+C and A+C+G+T counts every 256 bases, so the count over any stretch needs at most 510 bases read. */
export class GcIndex {
  gc: Uint32Array; acgt: Uint32Array; seq: string;
  constructor(seq: string) {
    this.seq = seq;
    const nb = Math.floor(seq.length / BLOCK);
    this.gc = new Uint32Array(nb + 1); this.acgt = new Uint32Array(nb + 1);
    let g = 0, t = 0;
    for (let b = 0; b < nb; b++) {
      for (let i = b * BLOCK, e = i + BLOCK; i < e; i++) { const c = seq.charCodeAt(i); if (c === 71 || c === 67) { g++; t++; } else if (c === 65 || c === 84) t++; }
      this.gc[b + 1] = g; this.acgt[b + 1] = t;
    }
  }
  private scan(s: number, e: number) {
    let g = 0, t = 0;
    for (let i = s; i < e; i++) { const c = this.seq.charCodeAt(i); if (c === 71 || c === 67) { g++; t++; } else if (c === 65 || c === 84) t++; }
    return [g, t];
  }
  /** G+C and A+C+G+T counts in [s, e). N and other codes are left out of both. */
  count(s: number, e: number): { gc: number; acgt: number } {
    s = Math.max(0, Math.floor(s)); e = Math.min(this.seq.length, Math.ceil(e));
    if (e <= s) return { gc: 0, acgt: 0 };
    const b0 = Math.ceil(s / BLOCK), b1 = Math.floor(e / BLOCK);
    if (b1 <= b0) { const [g, t] = this.scan(s, e); return { gc: g, acgt: t }; }
    const [g1, t1] = this.scan(s, b0 * BLOCK), [g2, t2] = this.scan(b1 * BLOCK, e);
    return { gc: this.gc[b1] - this.gc[b0] + g1 + g2, acgt: this.acgt[b1] - this.acgt[b0] + t1 + t2 };
  }
  /** GC fraction in [s, e); NaN when there are no A, C, G or T bases. */
  fraction(s: number, e: number) { const c = this.count(s, e); return c.acgt ? c.gc / c.acgt : NaN; }
}
export type GcWindow = { start: number; end: number; gc: number };
/** GC fraction in fixed windows of `win` bases, lined up on multiples of `win` from the contig start (so they stay put
 *  while you pan), covering [from, to). The last window of a contig may be shorter. */
export function gcWindows(idx: GcIndex, from: number, to: number, win: number): GcWindow[] {
  win = Math.max(1, Math.round(win));
  const L = idx.seq.length, out: GcWindow[] = [];
  for (let s = Math.max(0, Math.floor(from / win) * win); s < Math.min(to, L); s += win) { const e = Math.min(L, s + win); out.push({ start: s, end: e, gc: idx.fraction(s, e) }); }
  return out;
}

/** Smallest of 1, 2, 5 × 10^k that is at least x. */
export function niceUp(x: number) {
  if (!(x > 0)) return 1;
  const p = 10 ** Math.floor(Math.log10(x));
  for (const m of [1, 2, 5, 10]) if (m * p >= x * (1 - 1e-9)) return m * p;
  return 10 * p;
}
/** GC window for a view: about 5 px per window, at least 10 bases. */
export const autoGcWindow = (span: number, width: number) => Math.max(10, niceUp(span / Math.max(20, width / 5)));

// ---------- features ----------
export type Block = [number, number];
export type Feature = {
  id: string; chrom: string; start: number; end: number; strand: '+' | '-' | '.'; name: string; type: string;
  attrs: Record<string, string>; parentAttrs?: Record<string, string>; exons: Block[]; cds: Block[]; solid: boolean; source: string;
};
export type FeatureTrack = { format: 'gff' | 'gtf' | 'bed'; features: Feature[]; names: { name: string; chrom: string; start: number; end: number; strand: string }[]; errors: string[]; skipped: number };

const PART = new Set(['exon', 'cds', 'five_prime_utr', 'three_prime_utr', 'utr', '5utr', '3utr', 'five_prime_utr_region', 'start_codon', 'stop_codon', 'intron', 'stop_codon_redefined_as_selenocysteine']);
const isPart = (t: string) => PART.has(t.toLowerCase());
const strandOf = (s: string): '+' | '-' | '.' => (s === '+' || s === '-' ? s : '.');

/** Sorted, touching/overlapping blocks joined. */
export function mergeBlocks(b: Block[]): Block[] {
  const s = [...b].sort((x, y) => x[0] - y[0] || x[1] - y[1]), out: Block[] = [];
  for (const x of s) { const l = out.at(-1); if (l && x[0] <= l[1]) l[1] = Math.max(l[1], x[1]); else out.push([x[0], x[1]]); }
  return out;
}
function modelFrom(id: string, head: Iv | undefined, parts: Iv[], nameHint: string, parentAttrs: Record<string, string> | undefined, src: string): Feature {
  const ex = parts.filter((p) => p.type.toLowerCase() === 'exon').map((p) => [p.start, p.end] as Block);
  const cds = mergeBlocks(parts.filter((p) => p.type.toLowerCase() === 'cds').map((p) => [p.start, p.end] as Block));
  const utr = parts.filter((p) => /utr/i.test(p.type)).map((p) => [p.start, p.end] as Block);
  const exons = mergeBlocks(ex.length ? ex : [...cds, ...utr]);
  const all = [...exons, ...cds];
  const start = Math.min(head?.start ?? Infinity, ...all.map((b) => b[0])), end = Math.max(head?.end ?? -Infinity, ...all.map((b) => b[1]));
  const p0 = head ?? parts[0];
  return { id, chrom: p0.chrom, start, end, strand: strandOf(head?.strand ?? parts.find((p) => p.strand !== '.')?.strand ?? '.'), name: nameHint || id, type: head?.type ?? (cds.length ? 'mRNA' : 'transcript'),
    attrs: head?.attrs ?? { ...parts[0].attrs }, parentAttrs, exons: exons.length ? exons : [[start, end]], cds, solid: false, source: src };
}
const single = (x: Iv, id: string, src: string): Feature => {
  const cds = x.type.toLowerCase() === 'cds' ? [[x.start, x.end] as Block] : [];
  return { id, chrom: x.chrom, start: x.start, end: x.end, strand: strandOf(x.strand), name: x.name || id, type: x.type || 'feature', attrs: x.attrs, exons: [[x.start, x.end]], cds, solid: !cds.length, source: src };
};

/** Gene models from GFF3: a feature with exon/CDS/UTR children is drawn as one transcript (exons thin, CDS thick,
 *  introns as lines); a gene whose children are transcripts is not drawn itself but its name finds them; any other
 *  feature is drawn as a box. */
function fromGff(items: Iv[]): Feature[] {
  const byId = new Map<string, Iv>(), kids = new Map<string, Iv[]>(), out: Feature[] = [];
  items.forEach((x) => { if (x.attrs.ID && !byId.has(x.attrs.ID)) byId.set(x.attrs.ID, x); });
  for (const x of items) for (const p of (x.attrs.Parent ?? '').split(',').filter(Boolean)) { const l = kids.get(p); if (l) l.push(x); else kids.set(p, [x]); }
  const hasParts = (id: string) => (kids.get(id) ?? []).some((k) => isPart(k.type));
  const used = new Set<Iv>();
  // Transcripts: anything with part children.
  for (const [id, ch] of kids) {
    const parts = ch.filter((k) => isPart(k.type)); if (!parts.length) continue;
    const head = byId.get(id);
    const gene = head ? (head.attrs.Parent ?? '').split(',').map((p) => byId.get(p)).find(Boolean) : undefined;
    parts.forEach((p) => used.add(p)); if (head) used.add(head);
    const name = head?.attrs.Name ?? gene?.attrs.Name ?? head?.attrs.ID ?? id;
    // A part may list a Parent on another contig only in broken files; keep the parts on the head's contig.
    const same = head ? parts.filter((p) => p.chrom === head.chrom) : parts;
    if (!same.length) continue;
    out.push(modelFrom(id, head, same, name, gene?.attrs, 'gff'));
  }
  for (const x of items) {
    if (used.has(x)) continue;
    const id = x.attrs.ID ?? '';
    if (isPart(x.type)) { if (!/^(start|stop)_codon$|^intron$/i.test(x.type)) out.push(single(x, id || `${x.type}:${x.chrom}:${x.start + 1}`, 'gff')); continue; }
    // A gene (or other parent) whose children are drawn as transcripts.
    if (id && (kids.get(id) ?? []).some((k) => hasParts(k.attrs.ID ?? '') || used.has(k))) continue;
    out.push(single(x, id || `${x.type}:${x.chrom}:${x.start + 1}`, 'gff'));
  }
  return out;
}
/** Gene models from GTF, grouped by transcript_id; gene lines are only drawn when the gene has no transcripts. */
function fromGtf(items: Iv[]): Feature[] {
  const tx = new Map<string, { head?: Iv; parts: Iv[] }>(), genesWithTx = new Set<string>(), out: Feature[] = [];
  for (const x of items) {
    const t = x.attrs.transcript_id;
    if (!t) continue;
    if (x.attrs.gene_id) genesWithTx.add(x.attrs.gene_id);
    const e = tx.get(t) ?? { parts: [] }; tx.set(t, e);
    if (x.type.toLowerCase() === 'transcript' || x.type.toLowerCase() === 'mrna') e.head = x; else e.parts.push(x);
  }
  for (const [id, e] of tx) {
    const a = e.head?.attrs ?? e.parts[0]?.attrs ?? {};
    const parts = e.parts.filter((p) => isPart(p.type));
    if (!parts.length) { if (e.head) out.push(single(e.head, id, 'gtf')); continue; }
    const f = modelFrom(id, e.head, parts, a.transcript_name ?? a.gene_name ?? id, undefined, 'gtf');
    if (!e.head) { f.type = f.cds.length ? 'mRNA' : 'transcript'; f.attrs = { ...a }; }
    out.push(f);
  }
  for (const x of items) if (!x.attrs.transcript_id && !(x.attrs.gene_id && genesWithTx.has(x.attrs.gene_id))) out.push(single(x, x.attrs.gene_id ?? `${x.type}:${x.chrom}:${x.start + 1}`, 'gtf'));
  return out;
}
/** BED3 to BED12: columns 7 and 8 (thickStart, thickEnd) mark the coding part, 10 to 12 the blocks (exons). */
function fromBed(text: string, errors: string[], maxErrors: number): { features: Feature[]; skipped: number } {
  const out: Feature[] = []; let skipped = 0, n = 0;
  const err = (m: string) => { skipped++; if (errors.length < maxErrors) errors.push(`Line ${n}: ${m}`); };
  for (const raw of text.split('\n')) {
    n++;
    const line = raw.replace(/\r$/, '');
    if (!line.trim() || /^(#|track\b|browser\b)/.test(line)) continue;
    let c = line.split('\t'); if (c.length < 3) c = line.trim().split(/\s+/);
    if (c.length < 3) { err('a BED line needs chromosome, start and end.'); continue; }
    if (!/^\d+$/.test(c[1]) || !/^\d+$/.test(c[2])) { err('start and end must be whole numbers.'); continue; }
    const s = +c[1], e = +c[2];
    if (e < s) { err(`end ${e} is before start ${s}.`); continue; }
    const name = c[3] && c[3] !== '.' ? c[3] : '', strand = strandOf(c[5] ?? '.');
    let exons: Block[] = [[s, e]], cds: Block[] = [], solid = true;
    if (c.length >= 12 && +c[9] > 0) {
      const k = +c[9], sizes = c[10].split(',').filter((x) => x !== '').map(Number), starts = c[11].split(',').filter((x) => x !== '').map(Number);
      if (sizes.length < k || starts.length < k || [...sizes, ...starts].some((x) => !Number.isFinite(x) || x < 0)) { err('blockCount, blockSizes and blockStarts do not agree.'); continue; }
      exons = mergeBlocks(Array.from({ length: k }, (_, i) => [s + starts[i], s + starts[i] + sizes[i]] as Block));
      if (exons.some((b) => b[1] > e)) { err('a block runs past the end of the feature.'); continue; }
    }
    if (c.length >= 8 && /^\d+$/.test(c[6]) && /^\d+$/.test(c[7])) {
      const ts = +c[6], te = +c[7]; solid = false;
      if (te > ts) cds = exons.map(([a, b]) => [Math.max(a, ts), Math.min(b, te)] as Block).filter(([a, b]) => b > a);
    }
    const attrs: Record<string, string> = {};
    ['name', 'score', 'strand', 'thickStart', 'thickEnd', 'itemRgb', 'blockCount', 'blockSizes', 'blockStarts'].forEach((k, i) => { if (c[i + 3] !== undefined && c[i + 3] !== '') attrs[k] = c[i + 3]; });
    c.slice(12).forEach((v, i) => (attrs[`column ${i + 13}`] = v));
    out.push({ id: name || `${c[0]}:${s + 1}-${e}`, chrom: c[0], start: s, end: e, strand, name: name || `${c[0]}:${s + 1}-${e}`, type: c.length >= 12 ? 'BED12 feature' : 'BED feature', attrs, exons, cds, solid: solid && !cds.length, source: 'bed' });
  }
  return { features: out, skipped };
}

/** Read a GFF3, GTF or BED file into drawable features, sorted by contig and start. */
export function parseFeatures(text: string, format: 'gff' | 'gtf' | 'bed', maxErrors = 20): FeatureTrack {
  let features: Feature[], errors: string[] = [], skipped = 0;
  const names: FeatureTrack['names'] = [];
  if (format === 'bed') ({ features, skipped } = fromBed(text, errors, maxErrors));
  else {
    const p = parseIntervals(text, format, maxErrors); errors = p.errors; skipped = p.skipped;
    features = format === 'gff' ? fromGff(p.items) : fromGtf(p.items);
    const seen = new Set<string>();
    for (const x of p.items) {
      if (isPart(x.type)) continue;
      for (const n of [x.attrs.Name, x.attrs.ID, x.attrs.gene_name, x.attrs.gene_id, x.attrs.transcript_id, x.attrs.transcript_name, x.attrs.locus_tag]) {
        if (!n) continue; const k = `${n}\t${x.chrom}\t${x.start}`; if (seen.has(k)) continue; seen.add(k);
        names.push({ name: n, chrom: x.chrom, start: x.start, end: x.end, strand: x.strand });
      }
    }
  }
  features.sort((a, b) => chromCompare(a.chrom, b.chrom) || a.start - b.start || a.end - b.end);
  const have = new Set(names.map((n) => `${n.name}\t${n.chrom}\t${n.start}`));
  for (const f of features) if (!have.has(`${f.name}\t${f.chrom}\t${f.start}`)) names.push({ name: f.name, chrom: f.chrom, start: f.start, end: f.end, strand: f.strand });
  return { format, features, names, errors, skipped };
}

// ---------- VCF ----------
export type Variant = { chrom: string; pos: number; start: number; end: number; id: string; ref: string; alts: string[]; qual: number; filter: string; info: Record<string, string>; type: VarType; gts: [string, string][] };
export type VariantTrack = { variants: Variant[]; samples: string[]; errors: string[]; skipped: number };
/** VCF records (any version 4.x). Positions count from 1; `start`/`end` cover the REF bases. Genotypes (GT) are kept
 *  for the first 20 samples. */
export function parseVcf(text: string, maxErrors = 20): VariantTrack {
  const variants: Variant[] = [], errors: string[] = []; let samples: string[] = [], skipped = 0, n = 0;
  for (const raw of text.split('\n')) {
    n++;
    const line = raw.replace(/\r$/, '');
    if (!line) continue;
    if (line.startsWith('#CHROM')) { samples = line.split('\t').slice(9); continue; }
    if (line[0] === '#') continue;
    const c = line.split('\t');
    if (c.length < 8) { skipped++; if (errors.length < maxErrors) errors.push(`Line ${n}: a VCF record needs 8 columns separated by tabs.`); continue; }
    if (!/^\d+$/.test(c[1]) || +c[1] < 1) { skipped++; if (errors.length < maxErrors) errors.push(`Line ${n}: POS must be a whole number from 1.`); continue; }
    const pos = +c[1], ref = c[3].toUpperCase(), alts = c[4].split(','), info: Record<string, string> = {};
    for (const kv of c[7] === '.' ? [] : c[7].split(';')) { const i = kv.indexOf('='); if (i < 0) info[kv] = 'yes'; else info[kv.slice(0, i)] = kv.slice(i + 1); }
    const types = alts.map((a) => varType(ref, a)), type = types.every((t) => t === types[0]) ? types[0] : 'complex';
    const fmt = (c[8] ?? '').split(':'), gi = fmt.indexOf('GT');
    const gts: [string, string][] = gi < 0 ? [] : c.slice(9, 29).map((s, i) => [samples[i] ?? `sample${i + 1}`, s.split(':')[gi] ?? '.']);
    variants.push({ chrom: c[0], pos, start: pos - 1, end: pos - 1 + Math.max(1, ref.length), id: c[2], ref, alts, qual: c[5] === '.' ? NaN : Number(c[5]), filter: c[6], info, type, gts });
  }
  variants.sort((a, b) => chromCompare(a.chrom, b.chrom) || a.start - b.start);
  return { variants, samples, errors, skipped };
}

// ---------- file type ----------
export type Kind = 'fasta' | 'gff' | 'gtf' | 'bed' | 'vcf';
/** File type from the name, or else from the first lines. */
export function detectKind(name: string, head: string): Kind {
  const n = name.toLowerCase().replace(/\.(gz|txt)$/, '');
  if (/\.(fa|fasta|fna|fas|ffn|frn|fsa|seq|mfa|dna)$/.test(n)) return 'fasta';
  if (/\.(gff|gff3)$/.test(n)) return 'gff';
  if (/\.gtf$/.test(n)) return 'gtf';
  if (/\.(bed|bed\d+|narrowpeak|broadpeak)$/.test(n)) return 'bed';
  if (/\.vcf$/.test(n)) return 'vcf';
  const t = head.replace(/^﻿/, '').trimStart();
  if (t[0] === '>') return 'fasta';
  if (/^##fileformat=VCF/i.test(t) || /^#CHROM\tPOS/m.test(t)) return 'vcf';
  if (/^##gff-version/.test(t)) return 'gff';
  for (const line of t.split('\n', 200)) {
    if (!line.trim() || /^(#|track|browser)/.test(line)) continue;
    const c = line.split('\t');
    if (c.length >= 9 && /^\d+$/.test(c[3]) && /^\d+$/.test(c[4])) return /\w+ "[^"]*"/.test(c[8]) ? 'gtf' : 'gff';
    if (c.length >= 3 && /^\d+$/.test(c[1]) && /^\d+$/.test(c[2])) return 'bed';
    if (/^[ACGTNacgtn]+$/.test(line.trim())) return 'fasta';
  }
  return 'bed';
}

// ---------- views and regions ----------
export type View = { chrom: string; start: number; end: number };
export const MIN_SPAN = 20;
/** Keep the view inside the contig and at least MIN_SPAN bases wide (or the whole contig, if shorter). */
export function clampView(v: View, len: number): View {
  const want = v.end - v.start, span = Math.min(len, Math.max(Math.min(MIN_SPAN, len), want));
  let s = span > want ? (v.start + v.end) / 2 - span / 2 : v.start;
  if (s < 0) s = 0;
  if (s + span > len) s = len - span;
  return { chrom: v.chrom, start: s, end: s + span };
}
/** Zoom by `factor` (2 = in, 0.5 = out) keeping the base at `at` in the same place. */
export function zoom(v: View, factor: number, len: number, at = (v.start + v.end) / 2): View {
  const span = (v.end - v.start) / factor, f = (at - v.start) / (v.end - v.start);
  return clampView({ chrom: v.chrom, start: at - f * span, end: at - f * span + span }, len);
}
export const pan = (v: View, bases: number, len: number) => clampView({ chrom: v.chrom, start: v.start + bases, end: v.end + bases }, len);
/** Whole bases for showing and typing: 1-based start, inclusive end. */
export const snap = (v: View) => ({ start: Math.max(0, Math.round(v.start)), end: Math.round(v.end) });
export const fmtRegion = (v: View) => { const s = snap(v); return `${v.chrom}:${(s.start + 1).toLocaleString('en')}-${s.end.toLocaleString('en')}`; };

export type Named = { name: string; chrom: string; start: number; end: number };
/** Read what was typed: "chr1:1,000-2,000" (counting from 1, both ends included), "chr1:1500" (100 bases around
 *  it), "chr1" (whole contig), or a feature name (exact, ignoring case, else the first that starts with it; padded
 *  by 10 % of its length on each side). */
export function parseRegion(text: string, contigs: { name: string; length: number }[], names: Named[] = []): View | { error: string } {
  const t = text.trim().replace(/[–—]/g, '-');
  if (!t) return { error: 'Type a region such as chr1:1,000-2,000, a contig name or a feature name.' };
  const byName = new Map(contigs.map((c) => [c.name, c])), lower = new Map(contigs.map((c) => [c.name.toLowerCase(), c]));
  const whole = byName.get(t) ?? lower.get(t.toLowerCase());
  if (whole) return { chrom: whole.name, start: 0, end: whole.length };
  const m = /^(.+?)\s*[:\s]\s*([\d,_]+)(?:\s*(?:-|\.\.|\s)\s*([\d,_]+))?$/.exec(t);
  if (m) {
    const c = byName.get(m[1]) ?? lower.get(m[1].toLowerCase());
    if (c) {
      const a = Number(m[2].replace(/[,_]/g, '')), b = m[3] === undefined ? NaN : Number(m[3].replace(/[,_]/g, ''));
      if (!Number.isFinite(a) || a < 1) return { error: 'Positions count from 1.' };
      if (a > c.length) return { error: `${c.name} is only ${c.length.toLocaleString('en')} bases long.` };
      if (Number.isNaN(b)) return clampView({ chrom: c.name, start: a - 1 - 50, end: a - 1 + 50 }, c.length);
      if (b < a) return { error: 'The end comes before the start.' };
      return clampView({ chrom: c.name, start: a - 1, end: Math.min(b, c.length) }, c.length);
    }
  }
  const q = t.toLowerCase();
  const hit = names.find((n) => n.name.toLowerCase() === q) ?? names.find((n) => n.name.toLowerCase().startsWith(q));
  if (hit) {
    const c = byName.get(hit.chrom); if (!c) return { error: `${hit.name} is on ${hit.chrom}, which is not in the open files.` };
    const pad = Math.round((hit.end - hit.start) * 0.1);
    return clampView({ chrom: c.name, start: hit.start - pad, end: hit.end + pad }, c.length);
  }
  return { error: `No contig or feature called "${t}". Contigs: ${contigs.slice(0, 5).map((c) => c.name).join(', ')}${contigs.length > 5 ? ', …' : ''}.` };
}

// ---------- sequences of a feature ----------
export type SeqKind = 'mrna' | 'cds' | 'genomic' | 'protein';
/** The feature's sequence, on its own strand: spliced exons (mRNA), the CDS, the whole span, or the CDS translated
 *  with the standard code (starting at the first CDS base). */
export function featureSeq(seq: string, f: Feature, kind: SeqKind) {
  const blocks = kind === 'genomic' ? [[f.start, f.end] as Block] : kind === 'mrna' ? f.exons : f.cds;
  let s = mergeBlocks(blocks).map(([a, b]) => seq.slice(a, b)).join('');
  if (f.strand === '-') s = reverseComplement(s);
  return kind === 'protein' ? translate(s) : s;
}
export const blockLen = (b: Block[]) => mergeBlocks(b).reduce((s, [a, e]) => s + e - a, 0);
export function toFasta(header: string, s: string, width = 60) {
  const out = [`>${header}`];
  for (let i = 0; i < s.length; i += width) out.push(s.slice(i, i + width));
  return out.join('\n') + '\n';
}

/** Features overlapping [s, e) from a list sorted by start (with the longest length on that contig given). */
export function inView<T extends { start: number; end: number }>(list: T[], s: number, e: number, maxLen: number): T[] {
  let lo = 0, hi = list.length;
  const from = s - maxLen;
  while (lo < hi) { const m = (lo + hi) >> 1; if (list[m].start < from) lo = m + 1; else hi = m; }
  const out: T[] = [];
  for (let i = lo; i < list.length && list[i].start < e; i++) if (list[i].end > s) out.push(list[i]);
  return out;
}

// ---------- the drawing ----------
export type Col = 'ink' | 'muted' | 'line' | 'grid' | 'accent' | 'accent2' | 'good' | 'warn' | 'bad' | 'bg';
export type Prim =
  | { t: 'rect'; x: number; y: number; w: number; h: number; fill?: Col; stroke?: Col; lw?: number; op?: number }
  | { t: 'line'; x1: number; y1: number; x2: number; y2: number; stroke: Col; lw?: number; dash?: boolean }
  | { t: 'text'; x: number; y: number; s: string; fill: Col; size: number; anchor?: 'start' | 'middle' | 'end'; bold?: boolean; mono?: boolean }
  | { t: 'poly'; pts: number[]; fill?: Col; stroke?: Col; lw?: number };
export type Hit = { x: number; y: number; w: number; h: number; kind: 'feature' | 'variant'; track: number; item: Feature | Variant };
export type Scene = { w: number; h: number; prims: Prim[]; hits: Hit[]; info: { bpPerPx: number; seqMode: 'letters' | 'colours' | 'none'; gcWin: number; shown: number[]; hiddenRows: number[]; variantsShown: number[] } };
export const BASE_COL: Record<string, Col> = { A: 'good', C: 'accent', G: 'accent2', T: 'bad' };
export const TRACK_COL: Col[] = ['accent', 'good', 'accent2', 'ink'];
export const VAR_COL: Record<VarType, Col> = { SNV: 'bad', insertion: 'good', deletion: 'accent', MNV: 'accent2', complex: 'accent2', other: 'muted' };

export type LayoutIn = {
  w: number; view: View; length: number; seq?: string; gc?: GcIndex; gcWin?: number; showGc?: boolean; showSeq?: boolean;
  tracks: { name: string; features: Feature[]; maxLen: number }[]; vtracks: { name: string; variants: Variant[]; maxLen: number }[];
  selected?: Feature | Variant | null; maxRows?: number; title?: boolean;
};
const textW = (s: string, size: number) => s.length * size * 0.58;
/** Tick spacing of 1, 2 or 5 × 10^k bases giving labels about 80 px apart. */
export const tickStep = (bpPerPx: number, minPx = 80) => niceUp(bpPerPx * minPx);
export const fmtPos = (p: number, step: number) => (step >= 1e6 && p % 1e6 === 0 ? `${p / 1e6} Mb` : step >= 1000 && p % 1000 === 0 && p >= 10000 ? `${(p / 1000).toLocaleString('en')} kb` : p.toLocaleString('en'));

/** Lay out the whole view (title, ruler, sequence, GC, feature tracks, variant tracks) as shapes at width w. */
export function layout(o: LayoutIn): Scene {
  const { w, view } = o, span = view.end - view.start, bpp = span / w, X = (p: number) => (p - view.start) / bpp;
  const P: Prim[] = [], hits: Hit[] = [], info: Scene['info'] = { bpPerPx: bpp, seqMode: 'none', gcWin: 0, shown: [], hiddenRows: [], variantsShown: [] };
  const maxRows = o.maxRows ?? 12;
  let y = 0;
  const label = (s: string) => { P.push({ t: 'text', x: 2, y: y + 10, s, fill: 'muted', size: 11, bold: true }); y += 14; };
  if (o.title !== false) { P.push({ t: 'text', x: 2, y: 13, s: `${fmtRegion(view)}  (${Math.round(span).toLocaleString('en')} bp)`, fill: 'ink', size: 12, bold: true }); y = 20; }
  // Ruler.
  const step = tickStep(bpp);
  P.push({ t: 'line', x1: 0, y1: y + 18, x2: w, y2: y + 18, stroke: 'muted', lw: 1 });
  for (let p = Math.ceil(view.start / step) * step; p <= view.end; p += step) {
    const x = X(p); P.push({ t: 'line', x1: x, y1: y + 12, x2: x, y2: y + 18, stroke: 'muted', lw: 1 });
    const s = fmtPos(p, step), tw = textW(s, 10);
    if (x - tw / 2 >= 0 && x + tw / 2 <= w) P.push({ t: 'text', x, y: y + 9, s, fill: 'muted', size: 10, anchor: 'middle' });
  }
  const minor = step / (String(step)[0] === '2' ? 4 : 5);
  if (minor / bpp >= 6) for (let p = Math.ceil(view.start / minor) * minor; p <= view.end; p += minor) if (p % step) { const x = X(p); P.push({ t: 'line', x1: x, y1: y + 15, x2: x, y2: y + 18, stroke: 'line', lw: 1 }); }
  y += 24;
  // Sequence.
  if (o.seq && o.showSeq !== false) {
    const ppb = 1 / bpp, s0 = Math.max(0, Math.floor(view.start)), s1 = Math.min(o.length, Math.ceil(view.end));
    label('Sequence');
    if (ppb >= 1) {
      info.seqMode = ppb >= 7 ? 'letters' : 'colours';
      for (let i = s0; i < s1; i++) {
        const b = o.seq[i], x = X(i), col = BASE_COL[b] ?? 'muted';
        if (ppb >= 7) P.push({ t: 'text', x: x + ppb / 2, y: y + 11, s: b, fill: col, size: Math.min(14, Math.max(9, ppb * 0.9)), anchor: 'middle', bold: true, mono: true });
        else P.push({ t: 'rect', x, y: y + 2, w: Math.max(1, ppb), h: 10, fill: col });
      }
    } else P.push({ t: 'text', x: 2, y: y + 11, s: 'Zoom in to see the bases', fill: 'muted', size: 11 });
    y += 16;
  }
  // GC.
  if (o.gc && o.showGc !== false) {
    const win = o.gcWin && o.gcWin > 0 ? o.gcWin : autoGcWindow(span, w), H = 40;
    info.gcWin = win;
    label(`GC % (windows of ${win.toLocaleString('en')} bp)`);
    P.push({ t: 'rect', x: 0, y, w, h: H, stroke: 'grid', lw: 1 });
    for (const g of gcWindows(o.gc, view.start, view.end, win)) {
      if (!Number.isFinite(g.gc)) continue;
      const x0 = Math.max(0, X(g.start)), x1 = Math.min(w, X(g.end)), h = g.gc * H;
      if (x1 > x0) P.push({ t: 'rect', x: x0, y: y + H - h, w: Math.max(0.6, x1 - x0 - (x1 - x0 > 3 ? 0.5 : 0)), h, fill: 'accent2', op: 0.85 });
    }
    P.push({ t: 'line', x1: 0, y1: y + H / 2, x2: w, y2: y + H / 2, stroke: 'muted', lw: 1, dash: true });
    P.push({ t: 'text', x: w - 2, y: y + H / 2 - 3, s: '50 %', fill: 'muted', size: 9, anchor: 'end' });
    y += H + 6;
  }
  // Feature tracks.
  const sel = o.selected;
  o.tracks.forEach((tr, ti) => {
    const vis = inView(tr.features, view.start, view.end, tr.maxLen), col = TRACK_COL[ti % TRACK_COL.length];
    label(`${tr.name} (${vis.length.toLocaleString('en')} in view)`);
    const many = vis.length > 400, RH = many ? 10 : 26;
    const ends: number[] = [], rowOf: number[] = [];
    let hidden = 0;
    vis.forEach((f, i) => {
      const x0 = X(f.start), x1 = X(f.end), lw = many ? 0 : textW(f.name, 10);
      const cx = (Math.max(0, x0) + Math.min(w, x1)) / 2, l0 = Math.min(Math.max(0, x0), cx - lw / 2), l1 = Math.max(Math.min(w, x1), cx + lw / 2);
      let r = ends.findIndex((e) => e + 4 <= l0);
      if (r < 0) { if (ends.length < maxRows) { r = ends.length; ends.push(0); } else { hidden++; rowOf[i] = -1; return; } }
      ends[r] = l1; rowOf[i] = r;
    });
    info.shown.push(vis.length - hidden); info.hiddenRows.push(hidden);
    vis.forEach((f, i) => {
      const r = rowOf[i]; if (r < 0) return;
      const top = y + r * RH, x0 = X(f.start), x1 = X(f.end), mid = top + (many ? 4 : 6);
      const cl = (x: number) => Math.max(-2, Math.min(w + 2, x));
      if (!many) {
        if (f.exons.length > 1 || !f.solid) P.push({ t: 'line', x1: cl(x0), y1: mid, x2: cl(x1), y2: mid, stroke: col, lw: 1 });
        for (const [a, b] of f.exons) { const xa = cl(X(a)), xb = cl(X(b)); if (xb > xa) P.push({ t: 'rect', x: xa, y: f.solid ? top : top + 2, w: Math.max(1, xb - xa), h: f.solid ? 12 : 8, fill: col }); }
        for (const [a, b] of f.cds) { const xa = cl(X(a)), xb = cl(X(b)); if (xb > xa) P.push({ t: 'rect', x: xa, y: top, w: Math.max(1, xb - xa), h: 12, fill: col }); }
        // Strand chevrons every 18 px: pale on the boxes, coloured on the lines.
        if (f.strand !== '.' && x1 - x0 >= 10) {
          const d = f.strand === '+' ? 1 : -1;
          for (let x = Math.max(cl(x0) + 6, Math.ceil((Math.max(0, x0) + 6) / 18) * 18); x <= Math.min(w, x1) - 4; x += 18) {
            const bp = view.start + x * bpp, onBox = f.exons.some(([a, b]) => bp >= a && bp < b) || f.cds.some(([a, b]) => bp >= a && bp < b);
            P.push({ t: 'poly', pts: [x - 2 * d, mid - 3, x + 1.5 * d, mid, x - 2 * d, mid + 3], stroke: onBox ? 'bg' : col, lw: 1.3 });
          }
        }
        const lwid = textW(f.name, 10), cx = Math.min(Math.max((Math.max(0, x0) + Math.min(w, x1)) / 2, lwid / 2 + 1), w - lwid / 2 - 1);
        P.push({ t: 'text', x: cx, y: top + 23, s: f.name, fill: 'ink', size: 10, anchor: 'middle' });
      } else P.push({ t: 'rect', x: cl(x0), y: top + 1, w: Math.max(1, cl(x1) - cl(x0)), h: 7, fill: col });
      if (sel === f) P.push({ t: 'rect', x: cl(x0) - 2, y: top - 2, w: Math.max(1, cl(x1) - cl(x0)) + 4, h: (many ? 9 : 16), stroke: 'ink', lw: 1.5 });
      { const hx0 = Math.max(-2, x0 - 2), hx1 = Math.min(w + 2, Math.max(x1, x0 + 8) + 2); hits.push({ x: hx0, y: top - 2, w: hx1 - hx0, h: RH, kind: 'feature', track: ti, item: f }); }
    });
    y += Math.max(1, ends.length) * RH + 2;
    if (hidden) { P.push({ t: 'text', x: 2, y: y + 9, s: `${hidden.toLocaleString('en')} more not shown; zoom in`, fill: 'muted', size: 10 }); y += 13; }
    y += 4;
  });
  // Variant tracks.
  o.vtracks.forEach((tr, ti) => {
    const vis = inView(tr.variants, view.start, view.end, tr.maxLen);
    info.variantsShown.push(vis.length);
    label(`${tr.name} (${vis.length.toLocaleString('en')} in view)`);
    P.push({ t: 'line', x1: 0, y1: y + 16, x2: w, y2: y + 16, stroke: 'grid', lw: 1 });
    for (const v of vis) {
      const x0 = Math.max(0, X(v.start)), x1 = Math.min(w, X(v.end)), ww = Math.max(2, x1 - x0), col = VAR_COL[v.type];
      P.push({ t: 'rect', x: x0, y: y + 2, w: ww, h: 14, fill: col });
      if (ww >= 9 && v.type === 'SNV') P.push({ t: 'text', x: x0 + ww / 2, y: y + 13, s: v.alts[0], fill: 'bg', size: 10, anchor: 'middle', bold: true, mono: true });
      if (sel === v) P.push({ t: 'rect', x: x0 - 2, y, w: ww + 4, h: 18, stroke: 'ink', lw: 1.5 });
      hits.push({ x: x0 - 3, y, w: ww + 6, h: 20, kind: 'variant', track: ti, item: v });
    }
    y += 24;
  });
  return { w, h: Math.ceil(y + 4), prims: P, hits, info };
}

/** The shape under a point: the nearest hit (variants win ties, as they are thin). */
export function hitAt(sc: Scene, x: number, y: number) {
  let best: Hit | null = null, bd = Infinity;
  for (const h of sc.hits) {
    if (y < h.y || y > h.y + h.h || x < h.x - 4 || x > h.x + h.w + 4) continue;
    const d = x < h.x ? h.x - x : x > h.x + h.w ? x - h.x - h.w : 0;
    const score = d + (h.kind === 'variant' ? -0.5 : 0) + (h.w > 200 ? 0.1 : 0);
    if (score < bd) { bd = score; best = h; }
  }
  return best;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const r2 = (x: number) => Math.round(x * 100) / 100;
/** The scene as an SVG file, with the colours of the palette given. */
export function toSvg(sc: Scene, pal: Record<Col, string>) {
  const o = [`<svg xmlns="http://www.w3.org/2000/svg" width="${sc.w}" height="${sc.h}" viewBox="0 0 ${sc.w} ${sc.h}" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif">`, `<rect width="${sc.w}" height="${sc.h}" fill="${pal.bg}"/>`];
  for (const p of sc.prims) {
    if (p.t === 'rect') o.push(`<rect x="${r2(p.x)}" y="${r2(p.y)}" width="${r2(p.w)}" height="${r2(p.h)}" fill="${p.fill ? pal[p.fill] : 'none'}"${p.stroke ? ` stroke="${pal[p.stroke]}" stroke-width="${p.lw ?? 1}"` : ''}${p.op !== undefined && p.op < 1 ? ` fill-opacity="${p.op}"` : ''}/>`);
    else if (p.t === 'line') o.push(`<line x1="${r2(p.x1)}" y1="${r2(p.y1)}" x2="${r2(p.x2)}" y2="${r2(p.y2)}" stroke="${pal[p.stroke]}" stroke-width="${p.lw ?? 1}"${p.dash ? ' stroke-dasharray="4 3"' : ''}/>`);
    else if (p.t === 'text') o.push(`<text x="${r2(p.x)}" y="${r2(p.y)}" font-size="${p.size}" fill="${pal[p.fill]}"${p.anchor && p.anchor !== 'start' ? ` text-anchor="${p.anchor}"` : ''}${p.bold ? ' font-weight="700"' : ''}${p.mono ? ' font-family="ui-monospace, Menlo, Consolas, monospace"' : ''}>${esc(p.s)}</text>`);
    else o.push(`<polyline points="${p.pts.map(r2).join(' ')}" fill="${p.fill ? pal[p.fill] : 'none'}"${p.stroke ? ` stroke="${pal[p.stroke]}" stroke-width="${p.lw ?? 1}" stroke-linecap="round" stroke-linejoin="round"` : ''}/>`);
  }
  o.push('</svg>');
  return o.join('\n') + '\n';
}

// ---------- the made-up example ----------
function mulberry(seed: number) { let s = seed >>> 0; return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
type Tx = { id: string; exons: Block[]; cds?: [number, number] };
type Gene = { id: string; name: string; chrom: string; strand: '+' | '-'; tx: Tx[]; type?: string };
/** Made-up genes (1-based, both ends included, as typed in a GFF). CDS ends are moved so the CDS is whole codons. */
export const EXAMPLE_GENES: Gene[] = [
  { id: 'gene0001', name: 'alfA', chrom: 'demo_chr1', strand: '+', tx: [{ id: 'alfA.1', exons: [[2001, 2600], [3201, 3700], [4501, 5300]], cds: [2101, 5000] }] },
  { id: 'gene0002', name: 'betB', chrom: 'demo_chr1', strand: '-', tx: [{ id: 'betB.1', exons: [[7001, 7900], [8601, 9400]], cds: [7301, 9201] }] },
  { id: 'gene0003', name: 'gamC', chrom: 'demo_chr1', strand: '+', tx: [{ id: 'gamC.1', exons: [[12001, 12500], [13101, 13601], [14201, 15000]], cds: [12101, 14700] }, { id: 'gamC.2', exons: [[12001, 12500], [14201, 15000]], cds: [12101, 14700] }] },
  { id: 'gene0004', name: 'delD', chrom: 'demo_chr1', strand: '-', tx: [{ id: 'delD.1', exons: [[18001, 19800]], cds: [18101, 19700] }] },
  { id: 'gene0005', name: 'rnaE', chrom: 'demo_chr1', strand: '+', type: 'ncRNA', tx: [{ id: 'rnaE.1', exons: [[22501, 22900], [23301, 23700]] }] },
  { id: 'gene0006', name: 'epsF', chrom: 'demo_chr1', strand: '+', tx: [{ id: 'epsF.1', exons: [[27001, 27500], [28301, 29500], [30101, 30600]], cds: [27201, 30400] }] },
  { id: 'gene0007', name: 'zetG', chrom: 'demo_chr1', strand: '-', tx: [{ id: 'zetG.1', exons: [[34001, 34400], [35001, 35500], [36101, 36700], [37301, 37800]], cds: [34201, 37601] }] },
  { id: 'gene0008', name: 'etaH', chrom: 'demo_chr1', strand: '+', tx: [{ id: 'etaH.1', exons: [[41001, 43400]], cds: [41101, 43300] }] },
  { id: 'gene0009', name: 'theI', chrom: 'demo_chr2', strand: '-', tx: [{ id: 'theI.1', exons: [[2001, 2800], [3401, 4200]], cds: [2201, 4001] }] },
  { id: 'gene0010', name: 'iotJ', chrom: 'demo_chr2', strand: '+', tx: [{ id: 'iotJ.1', exons: [[7001, 7600], [8201, 9200]], cds: [7101, 9001] }] },
];
export const EXAMPLE_CONTIGS: [string, number][] = [['demo_chr1', 48000], ['demo_chr2', 16000]];
/** CDS blocks (0-based) of a transcript: exons cut to the CDS, then the 3' end moved so the length is whole codons. */
function cdsBlocks(t: Tx, strand: '+' | '-'): Block[] {
  if (!t.cds) return [];
  const ex = t.exons.map(([a, b]) => [a - 1, b] as Block);
  let cs = t.cds[0] - 1, ce = t.cds[1];
  const len = () => ex.reduce((s, [a, b]) => s + Math.max(0, Math.min(b, ce) - Math.max(a, cs)), 0);
  while (len() % 3) { if (strand === '+') ce--; else cs++; }
  return ex.map(([a, b]) => [Math.max(a, cs), Math.min(b, ce)] as Block).filter(([a, b]) => b > a);
}
/** The example: two made-up contigs (random bases, about 42 % GC, with a GC-rich stretch at 20-26 kb on demo_chr1),
 *  ten made-up genes whose CDS are real open reading frames (ATG ... stop, GT-AG introns), a made-up BED track and a
 *  made-up VCF whose REF bases match the sequence. */
export function exampleGenome(seed = 211) {
  const r = mulberry(seed), seqs: Record<string, string[]> = {};
  const pick = (gc: number) => { const u = r(); return u < gc / 2 ? 'G' : u < gc ? 'C' : u < gc + (1 - gc) / 2 ? 'A' : 'T'; };
  for (const [c, n] of EXAMPLE_CONTIGS) seqs[c] = Array.from({ length: n }, (_, i) => pick(c === 'demo_chr1' && i >= 20000 && i < 26000 ? 0.66 : 0.42));
  const SENSE = 'ACGT', STOPS = ['TAA', 'TAG', 'TGA'];
  const codon = () => { for (;;) { const c = SENSE[Math.floor(r() * 4)] + SENSE[Math.floor(r() * 4)] + SENSE[Math.floor(r() * 4)]; if (!STOPS.includes(c)) return c; } };
  const write = (chrom: string, blocks: Block[], strand: '+' | '-', s: string) => {
    const t = strand === '-' ? reverseComplement(s) : s; let k = 0;
    for (const [a, b] of blocks) for (let i = a; i < b; i++) seqs[chrom][i] = t[k++];
  };
  const gff = ['##gff-version 3', ...EXAMPLE_CONTIGS.map(([c, n]) => `##sequence-region ${c} 1 ${n}`)];
  for (const g of EXAMPLE_GENES) {
    const gs = Math.min(...g.tx.flatMap((t) => t.exons.map((e) => e[0]))), ge = Math.max(...g.tx.flatMap((t) => t.exons.map((e) => e[1])));
    gff.push([g.chrom, 'fibub', g.type === 'ncRNA' ? 'ncRNA_gene' : 'gene', gs, ge, '.', g.strand, '.', `ID=${g.id};Name=${g.name};note=made-up example gene`].join('\t'));
    // One CDS per gene, shared by its transcripts (the example's alternative transcript skips a whole coding exon of
    // length divisible by 3, so the frame holds).
    let protein = '';
    g.tx.forEach((t, ti) => {
      const ex = t.exons.map(([a, b]) => [a - 1, b] as Block);
      // GT-AG at intron ends, on the gene's strand.
      for (let i = 0; i + 1 < ex.length; i++) { const a = ex[i][1], b = ex[i + 1][0]; if (g.strand === '+') { seqs[g.chrom][a] = 'G'; seqs[g.chrom][a + 1] = 'T'; seqs[g.chrom][b - 2] = 'A'; seqs[g.chrom][b - 1] = 'G'; } else { seqs[g.chrom][a] = 'C'; seqs[g.chrom][a + 1] = 'T'; seqs[g.chrom][b - 2] = 'A'; seqs[g.chrom][b - 1] = 'C'; } }
      const cds = cdsBlocks(t, g.strand), n = cds.reduce((s, [a, b]) => s + b - a, 0);
      if (n && ti === 0) { const cod = n / 3; protein = 'ATG' + Array.from({ length: cod - 2 }, codon).join('') + STOPS[Math.floor(r() * 3)]; write(g.chrom, cds, g.strand, protein); }
      const ty = g.type === 'ncRNA' ? 'ncRNA' : 'mRNA';
      gff.push([g.chrom, 'fibub', ty, Math.min(...t.exons.map((e) => e[0])), Math.max(...t.exons.map((e) => e[1])), '.', g.strand, '.', `ID=${t.id};Parent=${g.id};Name=${t.id}`].join('\t'));
      t.exons.forEach(([a, b], i) => gff.push([g.chrom, 'fibub', 'exon', a, b, '.', g.strand, '.', `ID=${t.id}.exon${i + 1};Parent=${t.id}`].join('\t')));
      let phase = 0;
      const ord = g.strand === '+' ? cds : [...cds].reverse();
      const ph = new Map<Block, number>();
      for (const b of ord) { ph.set(b, phase); phase = (3 - ((b[1] - b[0] - phase) % 3)) % 3; }
      cds.forEach((b) => gff.push([g.chrom, 'fibub', 'CDS', b[0] + 1, b[1], '.', g.strand, String(ph.get(b)), `ID=${t.id}.cds;Parent=${t.id}`].join('\t')));
    });
  }
  // A made-up repeat in the GC-rich stretch, as a feature with no children.
  gff.push(['demo_chr1', 'fibub', 'repeat_region', 24001, 24800, '.', '.', '.', 'ID=rep0001;Name=demoRepeat;note=made-up'].join('\t'));
  const bed = ['track name="Made-up peaks"'];
  for (const [c, s, e, n, sc] of [['demo_chr1', 1800, 2150, 'peak1', 640], ['demo_chr1', 6900, 7120, 'peak2', 410], ['demo_chr1', 11850, 12180, 'peak3', 880], ['demo_chr1', 26850, 27250, 'peak4', 520], ['demo_chr1', 40880, 41160, 'peak5', 300], ['demo_chr2', 6850, 7150, 'peak6', 700]] as const) bed.push([c, s, e, n, sc, '.'].join('\t'));
  // Variants: SNVs mostly, a few insertions and deletions, REF taken from the sequence.
  const vrows: [number, number, string][] = [];
  EXAMPLE_CONTIGS.forEach(([c, n], ci) => {
    const k = ci === 0 ? 36 : 12;
    for (let i = 0; i < k; i++) {
      const p = 100 + Math.floor(r() * (n - 200)), u = r(), s = seqs[c];
      let ref = s[p], alt: string;
      if (u < 0.78) { do alt = SENSE[Math.floor(r() * 4)]; while (alt === ref); }
      else if (u < 0.89) alt = ref + Array.from({ length: 1 + Math.floor(r() * 3) }, () => SENSE[Math.floor(r() * 4)]).join('');
      else { ref = s.slice(p, p + 2 + Math.floor(r() * 3)).join(''); alt = s[p]; }
      const q = 12 + Math.floor(r() * 88), dp = 8 + Math.floor(r() * 50), af = r() < 0.5 ? 0.5 : 1, gt = af === 1 ? '1/1' : '0/1';
      vrows.push([ci, p, [c, p + 1, '.', ref, alt, q, q < 30 ? 'LowQual' : 'PASS', `DP=${dp};AF=${af}`, 'GT', gt].join('\t')]);
    }
  });
  vrows.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const vcf = ['##fileformat=VCFv4.2', '##source=fibub made-up example', ...EXAMPLE_CONTIGS.map(([c, n]) => `##contig=<ID=${c},length=${n}>`), '##FILTER=<ID=LowQual,Description="Made-up: QUAL below 30">',
    '##INFO=<ID=DP,Number=1,Type=Integer,Description="Read depth">', '##INFO=<ID=AF,Number=A,Type=Float,Description="Allele frequency">', '##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">', '#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tdemo_sample', ...vrows.map((v) => v[2])].join('\n') + '\n';
  const fasta = EXAMPLE_CONTIGS.map(([c]) => toFasta(`${c} made-up example contig`, seqs[c].join(''), 70)).join('');
  return { fasta, gff: gff.join('\n') + '\n', bed: bed.join('\n') + '\n', vcf };
}
