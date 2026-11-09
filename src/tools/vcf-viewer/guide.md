---
name: VCF viewer and filter
num: 173
shelf: science
section: genomics-and-bioinformatics
title: "VCF viewer and filter: variant counts, Ti/Tv, genotypes per sample and a filtered VCF, in your browser"
summary: "Open a VCF or .vcf.gz file of any size and see variant types, Ti/Tv ratio, multi-allelic sites, FILTER and QUAL, allele frequencies, genotypes per sample and counts by chromosome. Filter by chromosome, region, QUAL, depth, PASS and type, then download the filtered VCF. Nothing is uploaded."
status: live
ads: false
order: 3
icon: table
works: offline
updated: 2026-11-09
related: [fastq-inspector, sequence-alignment, sequence-tools, primer-checker]
sources:
  - "VCF reader, variant classes, Ti/Tv, genotype and allele frequency counts written by fibub from the public VCF layout. Checked in the tests against a separate plain-Python reader on the same file, with and without filters."
  - "The example VCF is made up: random positions on three made-up contigs, random genotypes for three made-up samples."
flow:
  - { icon: file, label: "Open" }
  - { icon: sliders, label: "Filter" }
  - { icon: table, label: "Summary" }
  - { icon: download, label: "Download" }
---

## What it does

A VCF (variant call format) file lists the places where sequenced samples differ from a reference genome. This page gives a quick, private look at one, without installing anything:

- **Variant types.** SNVs (one base changed), insertions, deletions, MNVs (several neighbouring bases changed) and complex or symbolic alleles, counted per alternate allele.
- **Ti/Tv.** The ratio of transitions (A↔G, C↔T) to transversions among SNVs. Real human whole-genome calls usually sit near 2, and exome calls a little higher, while random errors pull it towards 0.5, so a low ratio is a warning sign.
- **FILTER and QUAL.** How many records PASS, which filters failed the rest, and a QUAL histogram.
- **Allele frequency.** From the INFO AF field when present, or counted from the genotypes.
- **Genotypes per sample.** Homozygous reference, heterozygous, homozygous alternate and missing calls, with the het/hom-alt ratio.
- **By chromosome.** Records on each chromosome or contig.

## How to use it

1. **Open** a .vcf or .vcf.gz file, or paste a small VCF into the box.
2. **Filter** by chromosome, position range, lowest QUAL, lowest depth (INFO DP), PASS only and variant type. The summary follows the filters.
3. **Summary.** Read the facts, tables and charts, and the first 500 matching records.
4. **Download** the filtered VCF (with the original header) or the summary as an image, PDF or Word report.

## Worked example

The example holds 300 made-up records on contigs chrA, chrB and chrC for three made-up samples. There are 310 alternate alleles: 257 SNVs, 21 insertions, 21 deletions and 11 MNVs, with 10 multi-allelic sites. Of the SNVs, 175 are transitions and 82 transversions, so Ti/Tv = **2.13**. 256 records PASS and 44 fail (LowQual or a made-up StrandBias filter). Tick **PASS only** and set **Lowest QUAL** to 50, and 230 records remain with Ti/Tv 2.11.

## Tips

- A VCF made by bgzip is many small gzip pieces in a row. If the counts look too small, unzip it first (for example with `bgzip -d`) and open the plain .vcf.
- Filtering a large file reads it again from the start, so set all filters before you wait.
- The filtered VCF keeps up to 200,000 matching records; narrow the filters for more.

## FAQ

**Is my genome uploaded?** No. The file is read in this page on your device. Nothing is sent or stored, and the page shows no ads.

**Why are types counted per allele?** A multi-allelic site can hold, say, an SNV and a deletion at once, so each alternate allele is counted on its own, as most VCF tools do.
