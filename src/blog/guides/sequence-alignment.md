---
title: "Pairwise sequence alignment: how to line up two DNA or protein sequences"
summary: "What global, semi-global and local alignment mean, how gap scores change the answer, and how to read the score, identity and dot plot."
tools: [sequence-alignment, fastq-inspector, primer-checker, sequence-tools]
updated: 2026-11-10
sources:
  - "Needleman and Wunsch (1970), J. Mol. Biol. 48: 443-453 (global alignment by dynamic programming)."
  - "Smith and Waterman (1981), J. Mol. Biol. 147: 195-197 (local alignment)."
  - "Gotoh (1982), J. Mol. Biol. 162: 705-708 (affine gap scores)."
---

The pairwise sequence alignment tool takes two DNA, RNA or protein sequences and lines them up letter by letter, so you can see where they agree, where they differ and where one has letters the other lacks. It is for students new to bioinformatics and lab workers checking a clone against its reference. Before you align, tidy a sequence with [[sequence-tools]] or check raw reads in the [[fastq-inspector]]; afterwards, design primers on the region that matches with the [[primer-checker]].

## What it is

Two sequences that share an ancestor, or a sequence and its copy, rarely match perfectly. A base may have changed (a substitution), or letters may have been added or lost (an insertion or deletion, together called indels). An alignment writes the two sequences one above the other, adding gap symbols (-) so that letters that belong together sit in the same column.

There are many ways to place the gaps, so the tool gives each possible alignment a **score** and finds the best one:

- each column with the same letter adds the **match** score (positive),
- each column with different letters adds the **mismatch** score (negative),
- each gap costs a **gap opening** penalty for its first position and a **gap extension** penalty for every extra position.

So a gap of length L costs open + (L − 1) × extension. Because opening costs more than extending, one long gap beats several short ones, which is how real indels usually look. This scheme is called an affine gap score.

The tool uses dynamic programming: it fills a grid with one cell for each pair of positions, and each cell holds the best score of any alignment that ends there. The best overall alignment is then traced back through the grid. The three kinds differ only in where the trace may start and stop:

- **Global** (Needleman-Wunsch): from the first letter of both sequences to the last of both.
- **Semi-global**: the same, but gaps hanging off either end are free.
- **Local** (Smith-Waterman): the best-scoring stretch anywhere; the rest is ignored.

For proteins, the tool also rewards a "similar" pair: two different amino acids from the same simple side-chain group score better than two from different groups.

## How to use it

1. Paste the first sequence into the first box, or press **Open a file** to load a FASTA file. Do the same for the second.
2. Under **Settings**, choose the **Kind** (leave it on **Work it out** to let the tool guess, or pick DNA or RNA, or Protein) and the **Alignment** (global, semi-global or local).
3. Leave the scores as they are, or change match, mismatch, gap opening and gap extension (for protein: same amino acid, same group, different).
4. There is no run button: the result updates as you type or change a setting. Read the summary line and the facts under it: score, identical and similar columns, and gaps.
5. Look at the blocks of aligned text and then the **Dot plot** for the big picture.
6. Download the alignment as FASTA or text, or the report as an image, PDF or Word file, if you need to keep it.

## A worked example

Say a 15-base reference reads ATGGCTAGCTTACGA and a 10-base read reads GCTAGGTTAC. Use the default DNA scores: match +2, mismatch −3, gap opening −5, gap extension −2.

**Global.** The best alignment puts the read under bases 4 to 13 of the reference:

```
ATGGCTAGCTTACGA
---GCTAGGTTAC--
```

There are 9 matches (+18) and one mismatch, C against G (−3), so the aligned part scores 15. But the read must be stretched to the full length, which needs a 3-base gap at the start (5 + 2 × 2 = 9) and a 2-base gap at the end (5 + 1 × 2 = 7). The score is 15 − 9 − 7 = **−1**.

**Semi-global.** The same columns, but the end gaps are free, so the score is **15**. That reflects what you actually have: a short read sitting inside a longer sequence.

**Local.** The tool keeps only GCTAGCTTAC against GCTAGGTTAC, reference positions 4 to 13. It scores **15**, with 9 of 10 columns identical (90 %) and no gaps.

The lesson: a negative global score does not mean the sequences are unrelated. It means global was the wrong question for a short read.

## Where it is used

- **Checking clones and PCR products.** Align a sequencing result against the plasmid or gene you meant to make, and spot any changed base.
- **Comparing variants.** Two strains of a virus, two alleles of a gene or a patient sequence against a reference all start with an alignment.
- **Protein families.** Lining up a protein with a relative shows which parts are kept the same, which often means they matter for its job.

## Common mistakes

- **Using global for a short piece inside a long one.** End gaps swamp the score. Use semi-global or local instead.
- **Positive gap scores.** Gap scores are penalties, so they must be zero or negative. The tool shows an error if you type a positive one.
- **Comparing scores made with different settings.** A score only means something next to others made with the same scores and the same kind of alignment.
- **Pasting the wrong strand.** If the dot plot shows mostly orange dots, your second sequence matches the opposite strand. Reverse-complement it first (for example with [[sequence-tools]]) and align again.
- **Reading identity alone.** A high identity over a tiny local stretch can hide that most of each sequence did not align. Check the start and end positions too.

## Questions people ask

**What does a step in the dot plot mean?** A sideways or upward jump in the diagonal line means one sequence has extra letters at that spot: an insertion in one, or a deletion in the other.

**Does the order of the two sequences matter?** The best score is the same either way. An insertion in one simply shows up as a deletion in the other.

**Can I align more than two sequences?** Not here. Aligning many at once (multiple alignment) needs other methods; this tool compares one pair at a time.
