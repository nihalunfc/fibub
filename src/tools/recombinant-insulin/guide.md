---
name: Recombinant insulin
num: 1456
shelf: learn
code: L298
section: school-biology
title: "How recombinant human insulin is made: restriction enzymes, sticky ends, ligase, E. coli and selection"
summary: "Step through making human insulin in bacteria: the A and B chains, their genes, cutting a plasmid with a restriction enzyme, matching sticky ends, DNA ligase, putting the plasmid into E. coli, picking recombinant colonies on ampicillin and tetracycline plates, growing them and joining the chains."
status: live
ads: false
order: 1456
icon: flask
works: offline
updated: 2026-11-09
related: [central-dogma, restriction-digest, plasmid-map, bioreactor]
sources:
  - "Standard school biotechnology: restriction enzymes and their recognition sites (EcoRI G↓AATTC, BamHI G↓GATCC, HindIII A↓AGCTT, SmaI CCC↓GGG, as listed in REBASE), DNA ligase, plasmid vectors with ampicillin and tetracycline resistance genes and insertional inactivation, transformation of competent E. coli, and the 1983 production of human insulin from separately made A and B chains. Written for fibub; no textbook text, figures or exercises are used; the pictures are drawn for fibub."
  - "The colony counts on the plates are made up for teaching."
flow:
  - { icon: pointer, label: "Step" }
  - { icon: scissors, label: "Cut" }
  - { icon: link, label: "Join" }
  - { icon: check, label: "Check" }
---

## What it shows

People with type 1 diabetes need insulin. It used to come from the pancreas of slaughtered cattle and pigs, which was slightly different from human insulin and caused allergies in some people. Since the 1980s, **human insulin** has been made by bacteria carrying human genes: one of the first products of **recombinant DNA technology**.

This page steps through the process in seven pictures:

1. insulin is two chains, **A (21 amino acids)** and **B (30)**, held by disulphide bridges;
2. genes for chain A and chain B are prepared;
3. a **plasmid** and the gene are cut with a **restriction enzyme** that leaves **sticky ends** (you choose the enzymes and see whether the ends match);
4. **DNA ligase** joins them into a recombinant plasmid;
5. the plasmid goes into **E. coli**, and recombinant cells are picked out on **ampicillin and tetracycline plates**;
6. the bacteria are grown in a **bioreactor** and make the chains;
7. the chains are purified and joined into insulin.

It fits **Class 12 Biology: biotechnology, principles and processes** (restriction enzymes, cloning vectors, selectable markers, competent hosts, downstream processing) and **biotechnology and its applications** (genetically engineered insulin). How a gene is read into a protein is in [[central-dogma]]; cutting real sequences is in [[restriction-digest]], and the growing step is in the [[bioreactor]].

## How to use it

1. Press **Next** or tap a step number.
2. At step 3, choose the enzyme for the plasmid and for the gene. Matching sticky ends turn green.
3. At step 5, compare the three plates. Tick **Show which cells are which** to colour cells with no plasmid, the plain plasmid and the recombinant plasmid.

## Worked example

Chain A has 21 amino acids, so its gene needs 21 × 3 = 63 base pairs, plus a start codon (3) and a stop codon (3): **69 bp**. Chain B needs 30 × 3 + 6 = **96 bp**.

EcoRI cuts G↓AATTC on both strands, leaving four unpaired bases, **AATT**, on each end. A gene cut with EcoRI has the same ends, so the two pair up and ligase seals them. A gene cut with BamHI has GATC ends, which cannot pair with AATT.

On the plates in this example, 36 cells grow with no antibiotic, **18** on ampicillin (all those with any plasmid) and **12** on tetracycline (those with the plain plasmid). The **6** that grow on ampicillin but not tetracycline carry the insulin gene, because it was put inside the tetracycline resistance gene and broke it.

## Check yourself

Five fresh questions: base pairs for a chain, an enzyme's sticky end, whether two ends can be joined, which plate recombinant cells grow on, and which enzyme joins DNA. Nothing is saved.

## FAQ

**Why make the chains separately?** Bacteria cannot cut proinsulin's C-peptide out the way the pancreas does, so the first method made A and B separately and joined them. Later methods make proinsulin and cut it outside the cell.

**Why do the plates use two antibiotics?** Ampicillin keeps only cells that took up a plasmid; tetracycline then shows which of those plasmids lost their tetR gene to the insert.

**Is this from my textbook?** It covers the standard school topic with its own words and pictures. It is an independent study aid.
