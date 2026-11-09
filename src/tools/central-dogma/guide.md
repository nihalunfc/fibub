---
name: Central dogma lab
num: 1125
shelf: learn
section: school-biology
title: "Central dogma lab: DNA to mRNA to protein, and what a mutation does"
summary: "See a gene's coding strand, template strand, mRNA and amino acids codon by codon with the standard genetic code. Tap a base to change, insert or delete it, and find out whether the change is silent, missense, nonsense or a frameshift."
status: live
ads: false
order: 1125
icon: link
works: offline
updated: 2026-11-09
related: [mendel-peas, sequence-tools, cell-explorer]
sources:
  - "The standard genetic code (64 codons, 3 stops) is general biology. It is written out here by amino acid and checked codon by codon in the tests against the separate standard-code table used by fibub's DNA sequence tools."
  - "The example gene is made up. The mutation classes (silent, missense, nonsense, frameshift, in-frame, start and stop lost) are written by fibub and checked against hand-worked examples."
  - "Nothing you type is stored or sent anywhere."
flow:
  - { icon: pencil, label: "DNA" }
  - { icon: copy, label: "mRNA" }
  - { icon: link, label: "Protein" }
  - { icon: pointer, label: "Mutate" }
---

## What it does

The **central dogma** is the one-way flow of information in a cell: **DNA → mRNA → protein**. A gene's DNA is copied into messenger RNA (**transcription**), and a ribosome reads the mRNA three bases at a time, each **codon** naming one amino acid (**translation**). This lab lays it out codon by codon:

- the **coding strand** of DNA (5′ to 3′), the one that reads like the mRNA;
- the **template strand** underneath (3′ to 5′), which the RNA is actually copied from;
- the **mRNA**, with U in place of T;
- the **amino acid** for each codon, from the first AUG (start) to a stop codon.

Then you can **mutate** the gene. Tap a base to change it, insert a base before it, or delete it, and the page tells you what kind of mutation it is and draws the protein chain before and after, with changed amino acids marked. It fits **Class 12 Biology: molecular basis of inheritance** (transcription, the genetic code, translation, mutations and frameshifts). Before this, see how genes are passed on in [[mendel-peas]] and where DNA sits in the [[cell-explorer]]; for real sequences, use [[sequence-tools]].

## How to use it

1. **Start with the example** or type your own coding strand. The page reads from the first ATG; bases before it and after the stop are shown dashed, as they are not read.
2. **Pick what a tap does**: *Change* (to the new base you choose; if the base is already that letter, it moves to the next one), *Insert before* or *Delete*.
3. **Tap a base** in the strip. Changed and inserted bases are marked. Keep tapping to stack several changes; **Undo all changes** goes back.
4. **Read the result**: the big line names the kind of change, the chains show the protein before and after, and the facts list both proteins in three-letter codes.
5. **Play translation** steps a highlight along the codons, as a ribosome would.
6. **The genetic code** table opens below, and **Check yourself** gives fresh questions every time.

## Kinds of mutation

- **Silent**: the codon changes but still codes for the same amino acid (often a change in the third base).
- **Missense**: one amino acid is swapped for another.
- **Nonsense**: a codon turns into a stop (UAA, UAG or UGA), so the protein is cut short.
- **Frameshift**: inserting or deleting one or two bases moves the reading frame, so every codon after it changes.
- **In-frame**: three bases (or six, nine...) added or removed: whole amino acids are gained or lost, the rest stays.

## Worked example

The example coding strand GCATGGCTTGGAAAGGTCTGTTCCACTAAGCA reads from ATG: AUG GCU UGG AAA GGU CUG UUC CAC UAA, giving **Met-Ala-Trp-Lys-Gly-Leu-Phe-His** and stop. Change the T of TGG to C: CGG codes for arginine, so the page says **Missense: one amino acid changed (Trp → Arg at amino acid 3)**. Change the last G of TGG to A instead: UGA is a stop, so it says **Nonsense** and the chain is just Met-Ala. Insert one base in the middle and the chain changes after that point: a **frameshift**.

## FAQ

**Why is the template strand written under the coding strand?** Each template base pairs with the coding base above it (A with T, G with C). RNA polymerase reads the template, so the mRNA comes out matching the coding strand, with U for T.

**Why do three deletions do less harm than one?** Three bases are one codon, so the frame stays the same and only one amino acid is lost.

**Is every silent change harmless?** Usually, but not always: some change how fast or how much protein is made. The page only looks at the amino acids.
