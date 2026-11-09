---
name: Pairwise sequence alignment
num: 172
shelf: science
section: genomics-and-bioinformatics
title: "Pairwise sequence alignment: Needleman-Wunsch and Smith-Waterman for DNA or protein, with a dot plot"
summary: "Align two DNA or protein sequences end to end (global), with free end gaps (semi-global) or by their best-matching stretch (local), with affine gap scores you can set. See the score, identity, similarity and gaps, the alignment in blocks, and a dot plot. Runs in your browser."
status: live
ads: true
order: 2
icon: sliders
works: offline
updated: 2026-11-09
related: [fastq-inspector, sequence-tools, primer-checker, plasmid-map, restriction-digest]
sources:
  - "Global (Needleman-Wunsch), local (Smith-Waterman) and semi-global alignment with affine gaps (Gotoh's method) written by fibub. Optimal scores checked in the tests against Biopython 1.88 PairwiseAligner with the same scores."
  - "Protein scoring uses eight simple side-chain groups (ILMV, FWY, KRH, DE, STNQ, AG, C, P) written by fibub. It is not BLOSUM, PAM or any other published substitution matrix."
  - "The example DNA and protein pairs are made-up random sequences with planted changes."
flow:
  - { icon: file, label: "Sequences" }
  - { icon: sliders, label: "Scores" }
  - { icon: table, label: "Alignment" }
  - { icon: eye, label: "Dot plot" }
---

## What it does

An alignment lines up two sequences so that matching letters sit in the same column, with gaps (-) where one sequence has letters the other lacks. It is the first step in comparing a clone with its reference, two versions of a gene, or a protein with a relative. This page aligns two sequences in your browser:

- **Three kinds of alignment.** *Global* (Needleman-Wunsch) lines up both sequences from end to end. *Semi-global* does the same but doesn't charge for gaps before or after either sequence, which suits a read or primer inside a longer sequence. *Local* (Smith-Waterman) finds the best-matching stretch and ignores the rest.
- **Affine gaps.** Opening a gap costs more than making it longer, so one gap of 6 is preferred to six gaps of 1, as in real insertions and deletions.
- **DNA or protein.** DNA scores a match and a mismatch. Protein scores the same amino acid, the same side-chain group, or a different group.
- **Results.** Score, identical and similar columns, gaps, the aligned part of each sequence, the alignment in blocks that fit your screen, and a dot plot.

Check reads before aligning them with the [[fastq-inspector]], and design primers on the aligned region with the [[primer-checker]].

## How to use it

1. **Sequences.** Paste two sequences or open two FASTA files. The first record of each is used.
2. **Scores.** Choose the kind and the alignment, and change the scores if you like. Gap scores are penalties, so they are negative.
3. **Alignment.** Read the summary and the blocks: | marks identical letters, : marks letters in the same group (protein).
4. **Dot plot.** Each dot means the same few letters in a row appear in both sequences. A clean diagonal is a good match, a sideways step is a gap, and orange dots on DNA are matches on the opposite strand.

Download the alignment as FASTA or text, or the report as an image, PDF or Word file.

## Worked example

The example is a made-up 240-base gene and a copy with 6 changed bases, 6 extra bases after position 80 and 4 missing bases after 170, 242 bases in all. With the default DNA scores (match +2, mismatch −3, gap opening −5, extension −2), the global alignment has 246 columns: 230 identical, 6 mismatched and 10 gap columns in 2 gaps. The score is 230 × 2 − 6 × 3 − (5 + 5 × 2) − (5 + 3 × 2) = **416**, and identity is 93.5 %. The dot plot shows one diagonal with a small step at each gap.

## FAQ

**Why did I get a different alignment from another program with the same score?** There are often several alignments with the same best score. This page keeps matches over gaps when there is a tie, and another program may choose differently.

**How long can the sequences be?** Up to 25 million cells, for example two 5,000-letter sequences. For a long genome, cut out the region you need, or use local mode on a shorter piece.

**Can I use BLOSUM62?** Not built in, because published matrices are not copied here. The group scores give sensible protein alignments; use a dedicated tool when you need a specific matrix.
