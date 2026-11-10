---
name: Interval tools
num: 175
shelf: science
code: T175
section: genomics-and-bioinformatics
title: "Interval tools"
summary: "Open a BED, GFF3 or GTF file (gzip too) and see intervals per chromosome and feature type, bases covered and lengths. Merge overlapping intervals, find where two files overlap, keep or drop overlaps, or cut one file out of another, with bedtools rules. Download the result as BED. Nothing is uploaded."
status: live
ads: false
order: 4
icon: ruler
works: offline
updated: 2026-11-09
related: [vcf-viewer, fastq-inspector, plasmid-map, sequence-tools]
sources:
  - "Readers and interval operations written by fibub from the public BED, GFF3 and GTF layouts, following the documented behaviour of bedtools merge, intersect (default, -u, -v) and subtract. Checked in the tests against a separate brute-force base-by-base implementation."
  - "The example annotation and peaks are made up: random genes, exons and peaks on two made-up contigs."
flow:
  - { icon: file, label: "Open A" }
  - { icon: sliders, label: "Pick a tool" }
  - { icon: eye, label: "See it" }
  - { icon: download, label: "BED out" }
---

## What it does

Genome annotations and experiment results usually come as lists of intervals: a chromosome, a start and an end. **BED** files (peaks, regions, targets) count from 0 and leave the end out, so `chr1 0 100` is the first 100 bases. **GFF3** and **GTF** files (genes, transcripts, exons) count from 1 and include both ends. This page reads all three, converts GFF and GTF to BED positions, and answers the everyday questions without installing bedtools:

- **Just summarise A.** How many intervals there are per chromosome and per feature type (gene, mRNA, exon, CDS), how many bases they cover (overlaps counted once), their lengths and strands.
- **Merge** joins intervals that overlap or touch into single regions, like `bedtools merge`. Set *Join gaps up to* to also join intervals that close. The *Joined* column counts how many went into each region.
- **Overlapping parts of A and B** gives the shared part of every overlapping pair, like `bedtools intersect`.
- **A that overlap B** keeps whole A intervals that touch at least one base of B, once each (`intersect -u`). **A that don't overlap B** keeps the rest (`intersect -v`).
- **A with B cut out** removes the parts of A covered by B (`bedtools subtract`).

Tick *Same strand only* to compare + with + and − with −. Use *Feature type* to work on exons only, or genes only, and *Chromosome* to look at one.

For the variants that fall in the intervals, use the [[vcf-viewer]]; for the sequences under them, the [[sequence-tools|DNA sequence tools]].

## The view and the downloads

The view draws A, B and the result as boxes in rows for any stretch of a chromosome, with arrows for strand. Type the range you want; positions in the view and the tables count from 1, as genome browsers do. **Download as BED** gives the whole result in BED positions (merge adds the count as a fourth column), and the Image, PDF and Word buttons give a short report with the summary, view, length chart and the first 200 intervals.

## Worked example

The example A is a made-up annotation: 27 genes with 35 transcripts and 125 exons on two contigs. Some genes have a second transcript that skips an exon and starts a little later, so their exons overlap. With *Feature type: exon* and **Merge**, the 125 exons become 100 regions covering 37,272 bases: overlapping exons from the two transcripts have been joined. Switch to *Feature type: gene* and **A that don't overlap B**: 10 of the 27 genes have no peak anywhere on them. In the other direction, **Overlapping parts of A and B** with exons shows exactly which bases of each exon a peak covers.

## FAQ

**Is my file uploaded?** No. It is read in your browser and stays on your device, so private annotations and patient-derived regions stay private. There are no ads on this page.

**How big can files be?** Up to 500 MB, also after unzipping a .gz. Very large annotations (a whole human GTF) work but take a few seconds; filtering by type first helps.

**Why do touching intervals merge but not intersect?** That is how bedtools does it: `0-100` and `100-200` share no base, so they do not overlap, but merge joins book-ended intervals into `0-200`.

**What about zero-length BED intervals?** An interval with start equal to end (an insertion point) counts as covering the base after it when looking for overlaps.
