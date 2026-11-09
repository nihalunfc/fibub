---
name: k-mer counter and spectrum
num: 176
shelf: science
section: genomics-and-bioinformatics
title: "k-mer counter: k-mer spectrum, most common k-mers and a rough genome size from FASTA or FASTQ, in your browser"
summary: "Count every k-letter word in FASTA or FASTQ files (gzip too, any size), with reverse complements together. See the k-mer spectrum, the most common k-mers, a look-up box and a rough genome size from the spectrum's peak. Download the spectrum as CSV. Nothing is uploaded."
status: live
ads: false
order: 5
icon: chart
works: offline
updated: 2026-11-09
related: [fastq-inspector, sequence-tools, sequence-alignment, interval-tools]
sources:
  - "k-mer counting, spectrum and the peak-based genome size written by fibub. Counts, spectrum and most common k-mers checked in the tests and against a separate Python Counter script for k = 5, 21 and 25, with and without reverse complements."
  - "The example reads are simulated: a seeded random 40,000-base genome with a made-up repeat, 1 % random errors."
flow:
  - { icon: file, label: "Open reads" }
  - { icon: sliders, label: "Pick k" }
  - { icon: chart, label: "Spectrum" }
  - { icon: download, label: "CSV" }
---

## What it does

A **k-mer** is a word of k letters taken from a sequence: the read `ACGTAC` holds the 3-mers ACG, CGT, GTA and TAC. Counting every k-mer in a set of reads is a quick, assembly-free way to see what is in them:

- **The spectrum** plots how many distinct k-mers were seen once, twice, three times and so on. For good whole-genome reads it has a tall wall at 1 (k-mers carrying a sequencing error), a valley, then a hump at the typical depth of the genome, with a tail of repeats to the right.
- **Most common k-mers** shows the top 20 with their share, which is where adapters, primers and repeats stand out.
- **Look up a k-mer** gives the count of any word you type.
- **Genome size (rough)** is the number of k-mers counted from the valley on, divided by the depth at the peak. It assumes one copy of each chromosome set and even coverage, so treat it as a first guess, not a measurement.

## Options

- **k** is the word length, from 1 to 25. Longer words are more likely to be unique in a genome; 21 is a common choice. Small k (3 to 8) is useful for word use and composition in short sequences.
- **Count a word and its reverse complement together** merges ACG with CGT. Leave it on for reads, which come from both strands; turn it off for strand-specific data.

Letters other than A, C, G and T (such as N) break the sequence, and no word is counted across them. Up to 5 million distinct k-mers are kept; the page says so if a file has more.

## Worked example

The example is 10,000 reads of 100 bases simulated from a made-up 40,000-base genome that holds a 600-base repeat three times, with 1 % random errors. With k = 21 and reverse complements together, the 1,000,000 bases give 800,000 k-mers, 188,111 of them distinct. 145,234 are seen only once: nearly all of them hold an error. The valley is at 4×, the main peak at 15× (25× read coverage, less the k-mers lost to read ends and errors), and the genome size estimate is about 43,100 bases, within 8 % of the true 40,000. The repeat's k-mers form a small second hump around 45 to 50×, about three times the peak. Turn off reverse complements and the peak halves, because each strand is now counted on its own.

## FAQ

**Is my data uploaded?** No. Files are read piece by piece in your browser, so even large or private sequencing data stays on your device. There are no ads on this page.

**Why is my genome size estimate off?** Heterozygous genomes have a second, half-height peak, polyploid ones more, and low coverage (under about 15×) blurs the peak. Dedicated tools fit a model to the whole spectrum for that; this page gives the simple peak estimate.

**Can I use an assembly?** Yes, for counting and the most common k-mers, but an assembly has no error wall or depth hump, so no genome size is given.
