---
name: Genome browser lite
num: 211
shelf: science
section: genomics-and-bioinformatics
title: "Genome browser lite: view your own FASTA with GFF3, GTF, BED and VCF tracks in the browser"
summary: "A small genome browser for your own files. Open a FASTA (a bacterial genome or a few contigs) with gene annotation, BED regions and VCF variants, then zoom, pan and jump to a region or a gene name. See the ruler, the bases, GC % in windows, genes with exons and CDS, and variants. Tap a gene to copy its spliced, coding or protein sequence, and save the view as PNG or SVG. Nothing is uploaded."
status: live
ads: false
order: 211
icon: search
works: offline
updated: 2026-11-09
related: [vcf-viewer, interval-tools, sequence-tools, kmer-counter, fastq-inspector]
sources:
  - "FASTA, GFF3, GTF, BED12 and VCF readers, GC windows, gene models and the drawing are written by fibub from the public file layouts. The GFF3 and GTF line reader is the one the interval tools use."
  - "Checked in the tests against Biopython (Bio.SeqIO, reverse_complement and translate) and NumPy: every example transcript's spliced, coding and protein sequence read from GFF3, GTF and BED12, GC % in windows, and a messy FASTA with Windows line ends, lower case and N."
  - "The example is made up by the page: two random contigs, ten made-up genes whose coding parts are open reading frames, made-up peaks and made-up variants."
  - "Files you open are read on the page only. They are never uploaded or stored."
flow:
  - { icon: file, label: "Open files" }
  - { icon: search, label: "Find region" }
  - { icon: pointer, label: "Tap a gene" }
  - { icon: copy, label: "Copy or save" }
---

## What it does

Genome browsers such as IGV or JBrowse show a genome as a strip you can move along, with tracks of genes, peaks and variants stacked under it. This page is a small one that runs on your phone or computer with no install and no upload, for your own files:

- **Sequence.** One FASTA file: a bacterial or viral genome, an organelle, a plasmid, a set of assembled contigs, or a chromosome cut out of a bigger genome. Files of tens of MB are read piece by piece, and .gz files are unzipped on the page.
- **Tracks.** Any number of GFF3, GTF and BED (up to BED12) files, drawn as genes: thin boxes for exons, thick boxes for the coding part (CDS), lines for introns and small arrows for the strand. VCF files are drawn as ticks, coloured by kind (SNV, insertion, deletion, MNV or complex).
- **Moving around.** Choose a contig, use the buttons, drag sideways, pinch on a touch screen or Ctrl + scroll on a computer, or type a region (chr1:1,000-2,000, chr1:1500 for the 100 bases around it, or just chr1) or a gene name.
- **Ruler, bases and GC %.** Zoomed in, the bases show as coloured bars, then as letters. GC % is drawn in windows that line up from the start of the contig, so they stay put while you move. Pick the window size or leave it on automatic.
- **Details.** Tap a gene to see its place, strand, exons and attributes, and copy its spliced sequence, CDS, protein or whole genomic span, reverse-complemented when the gene is on the minus strand. Tap a variant for REF, ALT, QUAL, FILTER, INFO and genotypes.
- **Pictures.** Save what you see as PNG for slides or SVG to edit in a drawing program.

For whole-file variant counts use the [[vcf-viewer|VCF viewer]], to merge or intersect tracks use the [[interval-tools|interval tools]], and to translate or find open reading frames in a sequence you copied use the [[sequence-tools|sequence tools]].

## How to use it

1. **Open files.** Tap *Open files* and pick the FASTA and the tracks together, or add them one at a time. The list shows what each file held, and warns when a track names contigs that are not in the FASTA (a common snag is "chr1" in one file and "1" in the other). You can also open only tracks; contig lengths are then taken from the last feature.
2. **Find a region.** Pick a contig, or type a region or a feature name in the box and press *Go*. Names from the Name, ID, gene_name, gene_id, transcript_id and locus_tag fields all work, and the box suggests them as you type.
3. **Look.** Move with the arrow buttons or by dragging, and zoom with + and − or by pinching. The numbers under the view give the span, GC % in view, and the features and variants in view.
4. **Tap a gene or a variant.** Its details open below. Choose which sequence to copy, then *Copy* or *Download FASTA*.
5. **Save the view** as PNG or SVG. The picture is drawn 1,000 px wide or more, in black on white.

## Worked example

The page opens with a made-up genome: demo_chr1 (48,000 bases) and demo_chr2 (16,000 bases), ten made-up genes, six made-up peaks and 48 made-up variants. The whole of demo_chr1 shows 10 genes, 5 peaks and 36 variants, with **GC 47.2 %**. The GC track shows windows of 500 bp and a clear GC-rich block between about 20 and 26 kb, where the example sequence was made at 66 % GC.

Type **alfA** and press *Go*. The view jumps to **demo_chr1:1,671-5,630**, the gene plus 10 % on each side. Tap the gene: alfA.1 is an mRNA on the plus strand at demo_chr1:2,001-5,300, 3,300 bp long with **3 exons, 1,900 nt spliced**, and a **CDS of 1,500 nt**, which is 499 amino acids plus the stop. Choose *Protein* and the sequence starts with M and ends with *, as an open reading frame should.

Now type **betB**. That gene is on the minus strand, so its spliced sequence (1,700 nt) is the reverse complement of its two exons joined, and its CDS (1,200 nt) starts with ATG, even though on the screen that codon sits near the right-hand end.

## Tips

- Zoom in to about 40 bases across a phone (or 100 on a computer) to read the letters; at one base per pixel or more they show as coloured bars (A green, C blue, G orange, T red).
- Very busy regions draw features as thin bars without names. Zoom in, and the names come back.
- GC windows smaller than about 50 bp are noisy; automatic picks about one window per 5 pixels.
- Coordinates on the page count from 1 with both ends included, as in GFF and VCF. BED files count from 0 and are converted.

## FAQ

**Are my files uploaded?** No. They are read inside this page on your device. Nothing is sent or stored, and the page shows no ads. Close the tab and they are gone.

**How big can the files be?** The page keeps the whole genome in memory, so tens of MB of FASTA is comfortable on a computer and a few MB on a phone. A whole human genome is too big; cut out the chromosome or region you need first.

**Why does my protein read out of frame?** The protein is read from the first base of the CDS. A partial gene whose first CDS has phase 1 or 2 starts part-way through a codon, so trim that many bases first.

**Can it show read alignments (BAM)?** Not yet. BAM files need an index and much more memory; this page sticks to sequence, annotation and variants.
