---
name: FASTQ inspector
num: 171
shelf: science
section: genomics-and-bioinformatics
title: "FASTQ inspector"
summary: "Open a FASTQ or FASTA file of any size (.gz too) and see read counts, lengths and N50, GC content per read, quality by position as boxes, reads by mean quality, base composition along the read and the most repeated sequences. The file is read on your device and never uploaded."
status: live
ads: false
order: 1
icon: chart
works: offline
updated: 2026-11-09
related: [sequence-tools, primer-checker, restriction-digest, plasmid-map, qpcr-analyser]
sources:
  - "Streaming FASTQ/FASTA reader, Phred+33/+64 detection, quality boxes, GC and duplicate counts written by fibub. Checked in the tests against Biopython 1.88 SeqIO and NumPy percentiles on the same reads."
  - "The colour bands (28 and up, 20 to 28, below 20) are a common rule of thumb for read quality, not a standard."
  - "The example is 500 made-up reads from a seeded random generator, with one made-up sequence repeated in about 3 % of reads."
flow:
  - { icon: file, label: "Open" }
  - { icon: clock, label: "Read" }
  - { icon: chart, label: "Quality" }
  - { icon: download, label: "Report" }
---

## What it does

Before you align or assemble sequencing reads, it pays to check that they look healthy. This page gives the first quick look, entirely in your browser:

- **Counts and lengths.** Reads, bases, shortest and longest read, mean length and N50 (half of all bases sit in reads at least this long).
- **Quality by position.** For each base position, a box for the middle half of the quality scores, whiskers from the 10th to the 90th percentile, a line for the median and a line for the mean, over bands for good (28 and up), fair (20 to 28) and poor (below 20).
- **Reads by mean quality.** How many reads have each average quality. A second hump at low quality points to a group of bad reads.
- **GC per read.** The spread of GC content, next to a bell curve with the same mean and spread. Extra humps often mean contamination or adapter.
- **Bases by position.** The share of A, C, G, T and N at each position. Random libraries give flat lines; the first few bases often wobble.
- **Repeated reads.** The share of reads seen before, among the first 100,000 reads, and the most repeated sequences.

To look inside the sequences themselves, use the [[sequence-tools|DNA sequence tools]]; to count repeated words across reads, the [[kmer-counter|k-mer counter]].

## How to use it

1. **Open** a .fastq, .fq, .fasta or .fa file, gzip-compressed or not, or paste a few reads into the box.
2. **Read.** Big files are read piece by piece, with progress. Press **Stop** to see what has been read so far.
3. **Quality.** Read the summary and the charts.
4. **Report.** Download the charts as a PNG, PDF or Word report, or the per-position numbers as CSV.

Quality letters are read as Phred+33 (modern Illumina, Nanopore, PacBio). When no letter below @ appears, the file is read as old Phred+64.

## Worked example

The example holds 500 made-up reads of up to 100 bases, 49,226 bases in all. The summary shows a GC content of 49.6 %, a mean base quality of 29.3, and 51.7 % of bases at Q30 or better. The quality boxes start high (median 37 at base 1) and slide down to a median of 23 at base 100, the usual shape of a short-read run. One made-up sequence appears 14 times, 2.8 % of reads, at the top of the repeated sequences table, the kind of thing that turns out to be an adapter or primer in real data.

## Tips

- Trimming low-quality ends and adapters is the usual next step if quality falls off at the end or a sequence repeats a lot.
- High repeat rates are normal for amplicon and small RNA libraries, and a warning sign for whole-genome libraries.
- Some .gz files made by bgzip are many small gzip pieces in a row. If the count looks too small, unzip the file first and open the unzipped copy.

## FAQ

**Is my data uploaded?** No. The file is read by this page on your device. Nothing is sent or stored.

**How big a file can it read?** There is no fixed limit, because the file is never held in memory all at once. A few GB takes a minute or two on a laptop.

**Why are positions past 1,000 missing from the quality chart?** Per-position statistics stop at base 1,000 to keep memory small; counts, lengths and GC still use every base.
