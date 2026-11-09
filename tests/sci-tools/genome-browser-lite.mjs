// #211 genome browser lite: feature sequences, translations and GC windows checked against Biopython (Bio.SeqIO,
// Seq.reverse_complement, Seq.translate) and NumPy on the made-up example, in tests/sci-tools/genome-browser-lite.ref.json.
// The GTF and BED12 versions of the example and the messy FASTA there were written by that Python script, which read
// the example GFF with its own parser.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import * as G from '../../src/lib/sci/genome.ts';

export default async (check) => {
  const R = JSON.parse(readFileSync(new URL('./genome-browser-lite.ref.json', import.meta.url), 'utf8'));
  const md5 = (s) => createHash('md5').update(s).digest('hex');
  const ex = G.exampleGenome();
  // FASTA read in odd-sized pieces.
  const fr = new G.FastaReader();
  for (let i = 0; i < ex.fasta.length; i += 977) fr.push(ex.fasta.slice(i, i + 977));
  fr.end();
  const seq = Object.fromEntries(fr.contigs.map((c) => [c.name, c.seq]));
  check('genome: example FASTA has two contigs of 48,000 and 16,000 bases', fr.contigs.length === 2 && seq.demo_chr1.length === 48000 && seq.demo_chr2.length === 16000 && fr.contigs[0].desc === 'made-up example contig');
  // Gene models from GFF3, GTF and BED12 all give Biopython's sequences.
  const gff = G.parseFeatures(ex.gff, 'gff'), gtf = G.parseFeatures(R.gtf, 'gtf'), bed = G.parseFeatures(R.bed12, 'bed');
  check(`genome: GFF3 gives 11 transcripts and a repeat, no errors (${gff.features.length})`, gff.features.length === 12 && !gff.errors.length && gff.features.find((f) => f.id === 'rep0001')?.solid === true);
  for (const [name, tr] of [['GFF3', gff], ['GTF', gtf], ['BED12', bed]]) {
    const bad = [];
    for (const [id, r] of Object.entries(R.tx)) {
      const f = tr.features.find((x) => x.id === id);
      if (!f) { bad.push(`${id} missing`); continue; }
      if (f.start !== r.start || f.end !== r.end || f.strand !== r.strand) bad.push(`${id} span`);
      const m = G.featureSeq(seq[f.chrom], f, 'mrna'), c = G.featureSeq(seq[f.chrom], f, 'cds');
      if (m.length !== r.mrna[0] || md5(m) !== r.mrna[1]) bad.push(`${id} mRNA`);
      if (c.length !== r.cds[0] || (c.length && md5(c) !== r.cds[1])) bad.push(`${id} CDS`);
      if (G.featureSeq(seq[f.chrom], f, 'protein') !== r.protein) bad.push(`${id} protein`);
    }
    check(`genome: ${name} mRNA, CDS and protein of all 11 transcripts = Biopython ${bad.join(', ')}`, bad.length === 0);
  }
  { const f = gff.features.find((x) => x.id === 'betB.1'), g = G.featureSeq(seq.demo_chr1, f, 'genomic');
    check('genome: minus-strand genomic sequence is the reverse complement of the span', g.length === 2400 && g === [...seq.demo_chr1.slice(7000, 9400)].reverse().map((b) => ({ A: 'T', C: 'G', G: 'C', T: 'A' })[b]).join('')); }
  check('genome: example proteins are open reading frames (M ... one stop)', Object.values(R.tx).filter((r) => r.protein).every((r) => r.protein[0] === 'M' && r.protein.indexOf('*') === r.protein.length - 1));
  check('genome: alfA.1 is 1,900 nt spliced, CDS 1,500 nt, 499 aa', R.tx['alfA.1'].mrna[0] === 1900 && R.tx['alfA.1'].cds[0] === 1500 && R.tx['alfA.1'].protein.length === 500);
  check('genome: GTF gene_name and BED12 thick parts read', gtf.features.find((f) => f.id === 'alfA.1').attrs.gene_name === 'alfA' && bed.features.find((f) => f.id === 'rnaE.1').cds.length === 0 && bed.features.find((f) => f.id === 'zetG.1').exons.length === 4);
  // GC.
  { const idx = new G.GcIndex(seq.demo_chr1), w = G.gcWindows(idx, 0, 48000, 1000);
    check('genome: GC in 1,000 bp windows = NumPy', w.length === 48 && w.every((x, i) => Math.abs(x.gc - R.gc1000[i]) < 1e-12));
    check('genome: GC of demo_chr1 and of its GC-rich stretch = NumPy (47.2 %, 66.3 %)', Math.abs(idx.fraction(0, 48000) - R.gcAll[0]) < 1e-12 && Math.abs(idx.fraction(20000, 26000) - R.gcAll[1]) < 1e-12);
    const brute = (a, b) => { let g = 0, t = 0; for (let i = a; i < b; i++) { const c = seq.demo_chr1[i]; if (c === 'G' || c === 'C') { g++; t++; } else if (c === 'A' || c === 'T') t++; } return g / t; };
    check('genome: block index = plain count at odd edges', [[0, 1], [255, 257], [256, 512], [3, 47999], [1000, 1255]].every(([a, b]) => Math.abs(idx.fraction(a, b) - brute(a, b)) < 1e-12));
    check('genome: windows line up on multiples of the window size', G.gcWindows(idx, 1234, 3300, 500).map((x) => x.start).join() === '1000,1500,2000,2500,3000');
    check('genome: GC of only Ns is NaN', Number.isNaN(new G.GcIndex('NNNN').fraction(0, 4))); }
  // Messy FASTA (CRLF, lower case, N, blank lines) = Biopython.
  { const m = R.messy, r = new G.FastaReader(); for (let i = 0; i < m.text.length; i += 333) r.push(m.text.slice(i, i + 333)); r.end();
    check('genome: messy FASTA in pieces = Bio.SeqIO', r.contigs.map((c) => c.name).join() === m.ids.join() && r.contigs.every((c, i) => c.length === m.len[i] && md5(c.seq) === m.md5[i] && c.desc === m.desc[i]));
    check('genome: messy FASTA GC = Biopython count', r.contigs.every((c, i) => Math.abs(new G.GcIndex(c.seq).fraction(0, c.length) - m.gc[i]) < 1e-12));
    const p = G.parseFasta('ACGT\nAC-GT 12\n>x\nAA\n>x\nC'); check('genome: bare sequence, dropped marks, duplicate names', p.contigs.map((c) => `${c.name}:${c.seq}`).join() === 'sequence:ACGTACGT,x:AA,x_2:C' && p.dropped === 3 && p.duplicates[0] === 'x'); }
  // VCF.
  { const v = G.parseVcf(ex.vcf);
    check('genome: example VCF has 48 records, REF bases match the FASTA', v.variants.length === 48 && v.variants.every((x) => seq[x.chrom].slice(x.start, x.end) === x.ref) && v.samples[0] === 'demo_sample');
    const t = G.parseVcf('#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\ts1\ts2\nc\t10\trs1\tA\tG,T\t.\tPASS\tDP=5;DB\tGT:DP\t0/1:3\t1|2:2\nc\tx\t.\tA\tG\t1\t.\t.\nc\t5\t.\tACG\tA\t50\tq10\t.');
    check('genome: VCF fields, flags, genotypes and errors', t.variants.length === 2 && t.variants[0].pos === 5 && t.variants[0].type === 'deletion' && t.variants[0].end === 7 && t.variants[1].alts.join() === 'G,T' && Number.isNaN(t.variants[1].qual) && t.variants[1].info.DB === 'yes' && t.variants[1].gts[1].join() === 's2,1|2' && t.errors[0].startsWith('Line 3')); }
  // Regions.
  { const C = [{ name: 'demo_chr1', length: 48000 }, { name: 'demo_chr2', length: 16000 }];
    const eq = (r, c, s, e) => r.chrom === c && r.start === s && r.end === e;
    check('genome: region chr:start-end counts from 1, both ends in', eq(G.parseRegion('demo_chr1:2,001-5,300', C), 'demo_chr1', 2000, 5300) && eq(G.parseRegion('demo_chr2 101 200', C), 'demo_chr2', 100, 200) && eq(G.parseRegion('DEMO_CHR1:11..40', C), 'demo_chr1', 10, 40) && eq(G.parseRegion('demo_chr1:101-105', C), 'demo_chr1', 92.5, 112.5));
    check('genome: a single position gives 100 bp around it; a contig gives it all', eq(G.parseRegion('demo_chr1:1000', C), 'demo_chr1', 949, 1049) && eq(G.parseRegion('demo_chr2', C), 'demo_chr2', 0, 16000) && eq(G.parseRegion('demo_chr1:10', C), 'demo_chr1', 0, 100));
    check('genome: feature names (exact, then prefix), padded 10 %', eq(G.parseRegion('ALFA', C, gff.names), 'demo_chr1', 1670, 5630) && eq(G.parseRegion('gamC.2', C, gff.names), 'demo_chr1', 11700, 15300) && G.parseRegion('zet', C, gff.names).chrom === 'demo_chr1');
    check('genome: region errors', 'error' in G.parseRegion('demo_chr1:5-2', C) && G.parseRegion('demo_chr2:20000-30000', C).error.includes('16,000') && G.parseRegion('nothing', C).error.startsWith('No contig'));
    const v = { chrom: 'c', start: 1000, end: 2000 };
    check('genome: zoom keeps the base under the finger, pan and clamp', eq(G.zoom(v, 2, 10000), 'c', 1250, 1750) && eq(G.zoom(v, 2, 10000, 1000), 'c', 1000, 1500) && eq(G.zoom(v, 0.01, 10000), 'c', 0, 10000) && eq(G.zoom(v, 1000, 10000), 'c', 1490, 1510) && eq(G.pan(v, -5000, 10000), 'c', 0, 1000) && G.fmtRegion({ chrom: 'c', start: 999.6, end: 2000.2 }) === 'c:1,001-2,000'); }
  // Drawing.
  { const tr = [{ name: 'genes', features: gff.features.filter((f) => f.chrom === 'demo_chr1'), maxLen: 4000 }], vt = [{ name: 'vars', variants: G.parseVcf(ex.vcf).variants.filter((x) => x.chrom === 'demo_chr1'), maxLen: 5 }];
    const idx = new G.GcIndex(seq.demo_chr1);
    const whole = G.layout({ w: 800, view: { chrom: 'demo_chr1', start: 0, end: 48000 }, length: 48000, seq: seq.demo_chr1, gc: idx, tracks: tr, vtracks: vt });
    check(`genome: whole contig view: no bases, GC windows of 500 bp, all 10 features and 36 variants (${whole.info.gcWin})`, whole.info.seqMode === 'none' && whole.info.gcWin === 500 && whole.info.shown[0] === 10 && whole.info.variantsShown[0] === 36 && whole.hits.length === 46);
    const near = G.layout({ w: 400, view: { chrom: 'demo_chr1', start: 2090, end: 2130 }, length: 48000, seq: seq.demo_chr1, gc: idx, tracks: tr, vtracks: vt });
    const letters = near.prims.filter((p) => p.t === 'text' && p.mono).map((p) => p.s).join('');
    check('genome: 40 bases at 400 px are written out as letters', near.info.seqMode === 'letters' && letters === seq.demo_chr1.slice(2090, 2130));
    check('genome: mid zoom shows coloured bases', G.layout({ w: 400, view: { chrom: 'demo_chr1', start: 0, end: 300 }, length: 48000, seq: seq.demo_chr1, tracks: [], vtracks: [] }).info.seqMode === 'colours');
    const h = G.hitAt(whole, (2000 + 600) / 60, whole.hits[0].y + 6);
    check('genome: a tap on alfA finds it', h && h.item.id === 'alfA.1');
    const svg = G.toSvg(whole, { ink: '#000', muted: '#555', line: '#ccc', grid: '#eee', accent: '#15a', accent2: '#c60', good: '#161', warn: '#850', bad: '#b22', bg: '#fff' });
    check('genome: SVG export is well formed with every shape', svg.startsWith('<svg') && svg.trim().endsWith('</svg>') && (svg.match(/<(rect|line|text|polyline) /g) || []).length === whole.prims.length + 1 && !/NaN|undefined/.test(svg));
    check('genome: ruler ticks 1, 2, 5 × 10^k', G.tickStep(60) === 5000 && G.tickStep(0.1) === 10 && G.niceUp(3) === 5 && G.niceUp(0.7) === 1 && G.fmtPos(20000, 5000) === '20 kb'); }
  check('genome: file types from names and contents', G.detectKind('a.fa.gz', '') === 'fasta' && G.detectKind('x', '##fileformat=VCFv4.2') === 'vcf' && G.detectKind('x', 'c\t1\tgene\t1\t9\t.\t+\t.\tgene_id "a";') === 'gtf' && G.detectKind('x', 'c\t1\t9') === 'bed' && G.detectKind('x.gff3', '') === 'gff' && G.detectKind('x', '>a\nACGT') === 'fasta');
};
