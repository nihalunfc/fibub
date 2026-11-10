---
title: "Reverse complement, six-frame translation and ORF finder explained"
summary: "How to read DNA on both strands, translate it in all six reading frames, find open reading frames and count codon use, with a short worked example you can check by hand."
tools: [sequence-tools, primer-checker, restriction-digest, protein-calculator]
updated: 2026-11-10
sources:
  - "The standard genetic code (NCBI translation table 1), base pairing rules and IUPAC ambiguity letters: general textbook facts."
  - "Relative synonymous codon usage (RSCU): Sharp and Li (1987), Nucleic Acids Research 15: 1281-1295 (the definition only)."
  - "The 34-base example sequence is made up for this guide."
---

The DNA sequence tools page takes a DNA or RNA sequence and does the jobs people need most often: it counts the bases and GC content, writes out the other strand, translates any of the six reading frames into protein, finds open reading frames (ORFs) and counts how often each codon is used. It suits students learning how genes are read and lab workers who want a quick answer. Once you know where your gene is, design primers for it with the [[primer-checker]], see where enzymes cut it in the [[restriction-digest]], and weigh the protein it codes for with the [[protein-calculator]].

## What it is

DNA has two strands. A pairs with T, G with C, and the strands run in opposite directions, each read from its **5′ end** to its **3′ end**.

**Reverse complement.** To write the other strand 5′ to 3′, swap each base for its partner and read the result backwards. Ambiguity letters swap too: R (A or G) becomes Y (C or T), and N stays N.

**Reading frames.** Cells read DNA three bases at a time; each triplet is a **codon** for one amino acid or a stop. Starting at the first, second or third base gives three frames per strand, so **six frames** in all: +1, +2 and +3 on the strand you pasted, and −1, −2 and −3 on the reverse complement.

**Open reading frame.** An ORF is a run of codons with no stop in it, normally from a start codon (ATG, which codes for methionine, M) to the next stop (TAA, TAG or TGA, shown as `*`). Long ORFs are good gene candidates, because 3 of the 64 codons are stops, so random sequence hits one about every 21 codons.

**GC content** is the share of bases that are G or C:

GC % = (G + C) ÷ (A + C + G + T) × 100

**Codon usage.** Most amino acids have several codons. RSCU (relative synonymous codon usage) compares how often a codon is used with an even split among its synonyms:

RSCU = (times this codon is used) × (number of codons for that amino acid) ÷ (times any of them is used)

An RSCU of 1 means an even share; above 1 means the codon is preferred.

## How to use it

1. Paste a sequence, plain or FASTA, into the box, or press **Open a sequence file**. Only the first FASTA record is read; U is treated as T.
2. Read the summary, then copy the **Reverse complement** or download it as FASTA.
3. Pick a **Reading frame** from +1 to −3 to see its protein.
4. Under **Open reading frames**, set the **Shortest ORF (amino acids)**, whether **An ORF starts at** the first ATG or just after a stop, and which **Strands** to search. The map shows every ORF on its frame, and the table lists start, end and length. Download them as CSV, or the proteins as FASTA.
5. Under **Codon usage**, count the longest ORF, all ORFs or frame +1 of the whole sequence, and open **Codon table**.

## A worked example

Paste this made-up 34-base sequence:

```
>demo
GACCATGGCTAAAGAGCTGTTCCGTTAAGCTTCA
```

**Counts.** A 9, C 8, G 8, T 9. GC = (8 + 8) ÷ 34 × 100 = **47.1 %**.

**Reverse complement.** Reverse the sequence and swap each base: **TGAAGCTTAACGGAACAGCTCTTTAGCCATGGTC**. Check: the pasted strand starts GAC, so the other must end GTC.

**Six frames.**

- +1: DHG\*RAVPLSF
- +2: TMAKELFR\*AS
- +3: PWLKSCSVKL
- −1: \*SLTEQLFSHG
- −2: EA\*RNSSLAMV
- −3: KLNGTAL\*PW

**ORFs.** At the default minimum of 30 amino acids nothing is found. Set it to **5**. One ORF appears, on the + strand in frame 2, from base **5 to 28**: ATG GCT AAA GAG CTG TTC CGT TAA. That is 24 bases, **7 amino acids** (MAKELFR) plus the stop, and it is complete because it starts with ATG.

Now switch **An ORF starts at** to just after a stop. Two stretches appear: the same one stretched back to base 2 (8 amino acids, TMAKELFR, no ATG at its start), and a new one on the − strand in frame 3, bases **9 to 32**, KLNGTAL, which has no ATG at all. Stop-to-stop mode does not need a start codon.

**Codons.** Counting the longest ORF gives 8 codons including the stop. Leucine has six codons and only CTG is used, so CTG scores RSCU = 1 × 6 ÷ 1 = **6**. Alanine (four codons, only GCT used) scores **4**, and lysine (two codons, only AAA used) scores **2**. With so few codons, RSCU means little; it needs long genes.

## Where it is used

- **Checking a clone.** Translate the read and confirm there is no early stop.
- **Finding the frame of a fragment.** In a piece of cDNA, the right frame is usually the one long open stretch.
- **Designing primers.** The reverse primer comes from the reverse complement.
- **Codon choice.** Comparing codon use with a host organism's preferences hints at whether a gene will express well in it.

## Common mistakes

- **Reversing without complementing, or the other way round.** The other strand needs both steps. Check the first and last three bases.
- **Calling every ORF a gene.** Short ORFs turn up by chance; a minimum of 100 amino acids is common for bacteria.
- **Forgetting the minimum is in amino acids.** 30 amino acids is 93 bases with the stop, not 30 bases.
- **Reading reverse-strand positions as 5′ to 3′.** Positions are counted on the strand you pasted, so a − strand ORF begins at its higher number.

## Questions people ask

**Why do frames −1 to −3 not line up with +1 to +3?** They are counted from the other end, on the reverse complement. Frame −1 starts with the partners of the last three bases you pasted, read backwards.

**Does GC content include N?** No. Ambiguous bases are left out of the count, apart from S (G or C) and W (A or T), which are counted as what they must be.
