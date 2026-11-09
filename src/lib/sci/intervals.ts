// Genomic intervals: read BED, GFF3 and GTF; sort, merge, intersect, subtract and filter them, with the same rules as
// the bedtools commands of the same names (BED coordinates: start counts from 0, end is not included, so 0-100 is
// the first 100 bases; GFF and GTF count from 1 with both ends included and are converted). Summaries per
// chromosome and per feature type, and a packed track layout for drawing. No DOM.

export type Format = 'bed' | 'gff' | 'gtf';
export type Iv = { chrom: string; start: number; end: number; name: string; score: string; strand: string; type: string; attrs: Record<string, string>; source?: string };
export type Parsed = { format: Format; items: Iv[]; errors: string[]; skipped: number; fields: number };

/** BED, GFF3 or GTF from the first data lines: GFF/GTF have 9 columns with numbers in columns 4 and 5; GTF
 *  attributes look like `gene_id "x";`. */
export function detectFormat(text: string): Format {
  if (/^##gff-version/m.test(text.slice(0, 2000))) return 'gff';
  for (const line of text.split(/\r?\n/, 200)) {
    if (!line.trim() || /^(#|track|browser)/.test(line)) continue;
    const c = line.split('\t');
    if (c.length >= 9 && /^\d+$/.test(c[3]) && /^\d+$/.test(c[4]) && /^[+\-.?]$/.test(c[6])) return /\w+ "[^"]*"/.test(c[8]) ? 'gtf' : 'gff';
    if (c.length >= 3 && /^\d+$/.test(c[1]) && /^\d+$/.test(c[2])) return 'bed';
  }
  return 'bed';
}

const dec = (s: string) => { try { return decodeURIComponent(s); } catch { return s; } };
function attrsGff(s: string) {
  const a: Record<string, string> = {};
  for (const p of s.split(';')) { const i = p.indexOf('='); if (i > 0) a[dec(p.slice(0, i).trim())] = dec(p.slice(i + 1).trim()); }
  return a;
}
function attrsGtf(s: string) {
  const a: Record<string, string> = {};
  for (const m of s.matchAll(/(\S+)\s+(?:"([^"]*)"|([^;\s]+))\s*;?/g)) { const k = m[1], v = m[2] ?? m[3]; a[k] = a[k] === undefined ? v : `${a[k]},${v}`; }
  return a;
}
/** A readable name for a GFF/GTF feature. */
const gffName = (a: Record<string, string>) => a.Name ?? a.gene_name ?? a.ID ?? a.transcript_id ?? a.gene_id ?? a.Parent ?? '';

export function parseIntervals(text: string, format: Format = detectFormat(text), maxErrors = 20): Parsed {
  const items: Iv[] = [], errors: string[] = [];
  let skipped = 0, fields = 0;
  const err = (n: number, m: string) => { skipped++; if (errors.length < maxErrors) errors.push(`Line ${n}: ${m}`); };
  const lines = text.split(/\r?\n/);
  for (let n = 0; n < lines.length; n++) {
    const line = lines[n];
    if (!line.trim() || line.startsWith('#') || /^(track|browser)\b/.test(line)) { if (format === 'gff' && line.startsWith('##FASTA')) break; continue; }
    const c = line.split('\t');
    if (format === 'bed') {
      const cc = c.length >= 3 ? c : line.trim().split(/\s+/);
      if (cc.length < 3) { err(n + 1, 'a BED line needs chromosome, start and end.'); continue; }
      const s = +cc[1], e = +cc[2];
      if (!/^\d+$/.test(cc[1]) || !/^\d+$/.test(cc[2])) { err(n + 1, 'start and end must be whole numbers.'); continue; }
      if (e < s) { err(n + 1, `end ${e} is before start ${s}.`); continue; }
      fields = Math.max(fields, cc.length);
      items.push({ chrom: cc[0], start: s, end: e, name: cc[3] ?? '', score: cc[4] ?? '', strand: cc[5] === '+' || cc[5] === '-' ? cc[5] : '.', type: '', attrs: {} });
    } else {
      if (c.length < 9) { err(n + 1, `a ${format.toUpperCase()} line needs 9 columns separated by tabs.`); continue; }
      if (!/^\d+$/.test(c[3]) || !/^\d+$/.test(c[4])) { err(n + 1, 'start and end must be whole numbers.'); continue; }
      const s = +c[3], e = +c[4];
      if (s < 1 || e < s) { err(n + 1, `positions ${s}-${e} are not valid (they count from 1).`); continue; }
      const attrs = format === 'gtf' ? attrsGtf(c[8]) : attrsGff(c[8]);
      fields = 9;
      items.push({ chrom: c[0], start: s - 1, end: e, name: gffName(attrs), score: c[5] === '.' ? '' : c[5], strand: c[6] === '+' || c[6] === '-' ? c[6] : '.', type: c[2], attrs, source: c[1] });
    }
  }
  return { format, items, errors, skipped, fields };
}

/** Natural chromosome order: chr1, chr2 ... chr10, chrX, chrY, chrM, then others by name. */
export function chromCompare(a: string, b: string) {
  const k = (s: string) => { const t = s.replace(/^chr/i, ''); const n = /^\d+$/.test(t) ? +t : t === 'X' ? 1e6 : t === 'Y' ? 1e6 + 1 : /^(M|MT)$/.test(t) ? 1e6 + 2 : Infinity; return [n, s] as const; };
  const [x, y] = [k(a), k(b)];
  return x[0] !== y[0] ? (x[0] < y[0] ? -1 : 1) : x[1] < y[1] ? -1 : x[1] > y[1] ? 1 : 0;
}
export const sortIv = (v: Iv[]) => [...v].sort((a, b) => chromCompare(a.chrom, b.chrom) || a.start - b.start || a.end - b.end);
const byChrom = (v: Iv[]) => { const m = new Map<string, Iv[]>(); for (const x of v) { const l = m.get(x.chrom); if (l) l.push(x); else m.set(x.chrom, [x]); } return m; };
const plain = (chrom: string, start: number, end: number, extra: Partial<Iv> = {}): Iv => ({ chrom, start, end, name: '', score: '', strand: '.', type: '', attrs: {}, ...extra });

/** bedtools merge: overlapping intervals, and those `distance` or fewer bases apart (0 = touching), become one.
 *  With `strand`, + and - are merged separately. `count` is how many intervals went into each. */
export function merge(v: Iv[], distance = 0, strand = false) {
  const groups = new Map<string, Iv[]>();
  for (const x of v) { const k = strand ? `${x.chrom}\u0000${x.strand}` : x.chrom; const l = groups.get(k); if (l) l.push(x); else groups.set(k, [x]); }
  const out: (Iv & { count: number })[] = [];
  for (const list of groups.values()) {
    list.sort((a, b) => a.start - b.start || a.end - b.end);
    let cur: (Iv & { count: number }) | null = null;
    for (const x of list) {
      if (cur && x.start <= cur.end + distance) { cur.end = Math.max(cur.end, x.end); cur.count++; }
      else { if (cur) out.push(cur); cur = { ...plain(x.chrom, x.start, x.end, { strand: strand ? x.strand : '.' }), count: 1 }; }
    }
    if (cur) out.push(cur);
  }
  return sortIv(out) as (Iv & { count: number })[];
}

/** Zero-length intervals (insertion points, start = end) count as covering the base after them for overlaps. */
const effEnd = (x: Iv) => (x.end > x.start ? x.end : x.start + 1);
/** An index of B for overlap queries: per chromosome, sorted by start, with the largest end so far. */
export function index(b: Iv[]) {
  const m = new Map<string, { s: Iv[]; maxEnd: number[] }>();
  for (const [c, l] of byChrom(b)) {
    const s = [...l].sort((x, y) => x.start - y.start || x.end - y.end), maxEnd: number[] = [];
    let mx = -Infinity; for (const x of s) { mx = Math.max(mx, effEnd(x)); maxEnd.push(mx); }
    m.set(c, { s, maxEnd });
  }
  return m;
}
/** Intervals of B that overlap `a` by at least one base (touching ends do not count), in start order. With
 *  `strand`, only those on the same strand (+ or -). */
export function overlaps(idx: ReturnType<typeof index>, a: Iv, strand = false) {
  const e = idx.get(a.chrom); if (!e) return [];
  const aEnd = effEnd(a);
  let lo = 0, hi = e.s.length; // first B with start >= aEnd
  while (lo < hi) { const mid = (lo + hi) >> 1; if (e.s[mid].start < aEnd) lo = mid + 1; else hi = mid; }
  const out: Iv[] = [];
  for (let i = lo - 1; i >= 0 && e.maxEnd[i] > a.start; i--) {
    const b = e.s[i];
    if (effEnd(b) > a.start && (!strand || (a.strand === b.strand && a.strand !== '.'))) out.push(b);
  }
  return out.reverse();
}

export type Op = 'none' | 'merge' | 'intersect' | 'overlapping' | 'notOverlapping' | 'subtract';
/** bedtools intersect (the overlapping part of each A and B pair), intersect -u (A that overlap B, once each),
 *  intersect -v (A that overlap no B) and subtract (A with the parts covered by B cut out). */
export function intersect(a: Iv[], b: Iv[], strand = false) {
  const idx = index(b), out: Iv[] = [];
  for (const x of a) for (const y of overlaps(idx, x, strand)) out.push({ ...x, start: Math.max(x.start, y.start), end: Math.min(x.end, y.end) });
  return out;
}
export const overlapping = (a: Iv[], b: Iv[], strand = false) => { const idx = index(b); return a.filter((x) => overlaps(idx, x, strand).length > 0); };
export const notOverlapping = (a: Iv[], b: Iv[], strand = false) => { const idx = index(b); return a.filter((x) => overlaps(idx, x, strand).length === 0); };
export function subtract(a: Iv[], b: Iv[], strand = false) {
  const idx = index(b), out: Iv[] = [];
  for (const x of a) {
    const hits = overlaps(idx, x, strand).map((y) => [y.start, y.end]).sort((p, q) => p[0] - q[0]);
    if (!hits.length) { out.push(x); continue; }
    let pos = x.start;
    for (const [s, e] of hits) { if (s > pos) out.push({ ...x, start: pos, end: Math.min(s, x.end) }); pos = Math.max(pos, e); if (pos >= x.end) break; }
    if (pos < x.end) out.push({ ...x, start: pos, end: x.end });
  }
  return out;
}

/** Bases covered at least once (overlaps counted once). */
export const coveredBases = (v: Iv[]) => merge(v).reduce((s, x) => s + x.end - x.start, 0);

export function summary(v: Iv[]) {
  const chroms = new Map<string, { n: number; bases: number; min: number; max: number }>(), types = new Map<string, number>();
  let total = 0;
  const lens = v.map((x) => x.end - x.start);
  for (const x of v) {
    const c = chroms.get(x.chrom) ?? { n: 0, bases: 0, min: Infinity, max: -Infinity };
    c.n++; c.min = Math.min(c.min, x.start); c.max = Math.max(c.max, x.end); chroms.set(x.chrom, c);
    if (x.type) types.set(x.type, (types.get(x.type) ?? 0) + 1);
    total += x.end - x.start;
  }
  for (const [c, l] of byChrom(v)) chroms.get(c)!.bases = coveredBases(l);
  const sorted = [...lens].sort((a, b) => a - b), q = (p: number) => (sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))] : NaN);
  return {
    count: v.length, total, covered: [...chroms.values()].reduce((s, c) => s + c.bases, 0),
    minLen: sorted[0] ?? NaN, medianLen: sorted.length ? (sorted.length % 2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2) : NaN, maxLen: sorted.at(-1) ?? NaN, p90: q(0.9),
    chroms: [...chroms.entries()].sort((a, b) => chromCompare(a[0], b[0])), types: [...types.entries()].sort((a, b) => b[1] - a[1]),
    strands: { plus: v.filter((x) => x.strand === '+').length, minus: v.filter((x) => x.strand === '-').length },
  };
}

/** BED6 text (BED3 when `bed3`), in the order given. */
export function toBed(v: Iv[], bed3 = false) {
  return v.map((x) => (bed3 ? `${x.chrom}\t${x.start}\t${x.end}` : `${x.chrom}\t${x.start}\t${x.end}\t${x.name || '.'}\t${x.score || '0'}\t${x.strand}`)).join('\n') + (v.length ? '\n' : '');
}

/** Lanes for drawing: each interval goes in the first lane whose last interval ends before it starts (with a gap). */
export function pack(v: Iv[], gap = 0) {
  const ends: number[] = [], lane: number[] = [];
  const order = v.map((_, i) => i).sort((a, b) => v[a].start - v[b].start || v[a].end - v[b].end);
  for (const i of order) {
    let l = ends.findIndex((e) => e + gap <= v[i].start);
    if (l < 0) { l = ends.length; ends.push(0); }
    ends[l] = v[i].end; lane[i] = l;
  }
  return { lane, lanes: ends.length };
}

/** A made-up gene annotation (GFF3) and a made-up set of peaks (BED) on two made-up contigs, for the examples. */
export function exampleFiles(seed = 7) {
  let s = seed >>> 0;
  const rnd = () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const gff = ['##gff-version 3', '##sequence-region ctgA 1 90000', '##sequence-region ctgB 1 60000'];
  const bed = ['track name=peaks description="made-up peaks"'];
  let g = 0;
  for (const [ctg, len] of [['ctgA', 90000], ['ctgB', 60000]] as const) {
    let pos = 500 + Math.floor(rnd() * 1500);
    while (pos < len - 6000) {
      g++;
      const id = `gene${String(g).padStart(3, '0')}`, strand = rnd() < 0.5 ? '+' : '-';
      const nEx = 2 + Math.floor(rnd() * 4), exons: [number, number][] = [];
      let p = pos;
      for (let e = 0; e < nEx; e++) { const l = 150 + Math.floor(rnd() * 400); exons.push([p, p + l - 1]); p += l + 200 + Math.floor(rnd() * 900); }
      const gEnd = exons.at(-1)![1];
      gff.push([ctg, 'demo', 'gene', pos, gEnd, '.', strand, '.', `ID=${id};Name=DEMO${g}`].join('\t'));
      gff.push([ctg, 'demo', 'mRNA', pos, gEnd, '.', strand, '.', `ID=${id}.t1;Parent=${id}`].join('\t'));
      exons.forEach(([a, b], k) => gff.push([ctg, 'demo', 'exon', a, b, '.', strand, '.', `ID=${id}.t1.e${k + 1};Parent=${id}.t1`].join('\t')));
      exons.forEach(([a, b], k) => gff.push([ctg, 'demo', 'CDS', a + (k === 0 ? 60 : 0), b - (k === nEx - 1 ? 80 : 0), '.', strand, '0', `ID=${id}.cds;Parent=${id}.t1`].join('\t')));
      // A second transcript for some genes: skips one middle exon and starts its first exon a little later, so
      // exons overlap and merging has something to do.
      if (nEx > 2 && rnd() < 0.5) {
        const skip = 1 + Math.floor(rnd() * (nEx - 2)), first = exons[0][0] + 20 + Math.floor(rnd() * 80);
        gff.push([ctg, 'demo', 'mRNA', first, gEnd, '.', strand, '.', `ID=${id}.t2;Parent=${id}`].join('\t'));
        exons.forEach(([a, b], k) => { if (k !== skip) gff.push([ctg, 'demo', 'exon', k ? a : first, b, '.', strand, '.', `ID=${id}.t2.e${k + 1};Parent=${id}.t2`].join('\t')); });
      }
      // Peaks: often near the gene start, sometimes inside, sometimes between genes.
      const tss = strand === '+' ? pos : gEnd;
      if (rnd() < 0.8) { const c = tss - 1 + Math.floor((rnd() - 0.5) * 600), w = 150 + Math.floor(rnd() * 350); bed.push([ctg, Math.max(0, c - (w >> 1)), c + (w >> 1), `peak${bed.length}`, Math.floor(200 + rnd() * 800), '.'].join('\t')); }
      if (rnd() < 0.4) { const c = pos + Math.floor(rnd() * (gEnd - pos)), w = 200 + Math.floor(rnd() * 300); bed.push([ctg, c - (w >> 1), c + (w >> 1), `peak${bed.length}`, Math.floor(100 + rnd() * 500), '.'].join('\t')); }
      pos = gEnd + 600 + Math.floor(rnd() * 2400);
      if (rnd() < 0.4) { const c = pos - 300, w = 250; bed.push([ctg, c, c + w, `peak${bed.length}`, Math.floor(100 + rnd() * 300), '.'].join('\t')); }
    }
  }
  return { gff: gff.join('\n') + '\n', bed: bed.join('\n') + '\n' };
}
