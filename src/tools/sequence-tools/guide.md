---
name: DNA sequence tools
num: 163
shelf: science
section: molecular-biology
title: "DNA sequence tools: reverse complement, translate in six frames, find open reading frames (ORFs), GC content and codon usage"
summary: "Paste a DNA or RNA sequence or open a FASTA file. Get the length and GC content, the reverse complement, the protein in any of the six reading frames, every open reading frame above a length you choose drawn on a map, and a codon usage table. Runs in your browser; your sequence never leaves the device."
status: live
ads: true
order: 11
icon: search
works: offline
updated: 2026-11-09
related: [pcr-master-mix, enzyme-kinetics-fitter, buffer-recipe-calculator]
sources:
  - "Standard genetic code (NCBI translation table 1) and the IUPAC nucleotide ambiguity codes: general textbook facts."
  - "Reverse complement, six-frame translation, ORF finding and relative synonymous codon usage (RSCU) written by fibub and checked in the tests against Biopython 1.88."
  - "The example sequence is random, made up for this page, with two reading frames planted in it. It is not from any real organism."
flow:
  - { icon: file, label: "Sequence" }
  - { icon: convert, label: "Complement" }
  - { icon: search, label: "Find ORFs" }
  - { icon: table, label: "Codon use" }
---

## What it does

This page does the everyday jobs people reach for a sequence tool for, without sending the sequence anywhere. Paste a sequence (plain letters or FASTA, DNA or RNA) or open a FASTA or text file, and you get:

- **Summary:** length, GC content, base counts and how many open reading frames were found.
- **Reverse complement:** the other strand read 5′ to 3′, with ambiguity codes (R, Y, N and so on) complemented correctly. Copy it or download it as FASTA.
- **Translation:** the protein in any of the six frames (+1, +2, +3 on the strand you pasted, −1, −2, −3 on the other). Stops show as `*`; a codon with an ambiguous base shows as `X`.
- **Open reading frames:** every stretch from a start (ATG) to a stop above your minimum length, on one or both strands, on a map of the six frames and in a table you can download as CSV, with the proteins as FASTA.
- **Codon usage:** how often each codon is used in the longest ORF, all ORFs, or frame +1 of the whole sequence, with RSCU (relative synonymous codon usage: 1 means a codon is used exactly as often as its synonyms, above 1 means it is preferred).

## How to use it

1. **Sequence.** Paste it, or open a FASTA or text file (up to 20 MB; sequences up to 5 million bases). With several FASTA records, the first is used. Spaces, numbers and line breaks are ignored; U is read as T. Letters that are not bases are dropped and counted.
2. **Frame.** Pick the frame to translate.
3. **ORF settings.** *Minimum length* in amino acids (30 by default; real genes are usually longer than 100). *An ORF starts at* the first ATG after a stop, or just after a stop (*stop to stop*) to find every open stretch whatever the start codon. Set *Strands* to *Top strand only* to search only the strand you pasted.
4. **Codon usage.** Choose which sequence to count.

Positions are 1-based on the strand you pasted, and an ORF's end includes its stop codon, so a reverse-strand ORF reads from its end back to its start.

## Worked example

The example is a made-up 732-base sequence with 362 G and C, so **GC is 49.5 %**. With a 30 amino acid minimum the tool finds **2 ORFs**. The longest is in frame +2, from base 41 to 406: 366 bases, 121 amino acids plus the stop. The second is on the reverse strand in frame −1, from base 457 to 702, 81 amino acids. Both are complete (they start with ATG and end with a stop). Lower the minimum to 10 and short chance ORFs appear, which is why a sensible minimum matters: in random sequence a stop turns up about every 21 codons.

## Good to know

- Only the standard genetic code is used. Mitochondria and some microbes use other codes, so their translations will differ in places.
- An ORF is a candidate, not a proven gene. Introns, frameshifts and alternative starts are not handled.
- Everything runs in your browser. Nothing is uploaded or saved.

## FAQ

**Why does my protein start with M but not end with \*?** The ORF runs off the end of the sequence without a stop; it is marked incomplete.

**What does stop to stop do?** It reports open stretches between stops in each frame, which is useful for fragments that may have lost their start codon.

**Can it read GenBank files?** Not yet. Save the sequence as FASTA first.
