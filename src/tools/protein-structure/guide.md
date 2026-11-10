---
name: Protein structure levels
num: 1395
shelf: learn
section: school-biology
title: "Protein structure: primary, secondary (α-helix, β-sheet), tertiary and quaternary, with folding"
summary: "Type a sequence of amino acids and see its four levels of structure: peptide bonds and mass, an α-helix or β-sheet with its hydrogen bonds, a folding animation where water-fearing parts tuck inside (heat it to denature it), and haemoglobin's four chains. Class 11, with quick questions."
status: live
ads: false
order: 1395
icon: orbit
works: offline
updated: 2026-11-09
related: [central-dogma, enzyme-activity, cell-membrane, protein-calculator]
sources:
  - "Levels of protein structure, peptide bonds formed by condensation, α-helix (3.6 residues per turn, 0.15 nm rise per residue, 0.54 nm pitch) and β-strand (about 0.33 nm per residue) dimensions, and haemoglobin's four chains (2 α of 141 and 2 β of 146 amino acids, four haem groups, about 64,500 Da): general biochemistry, rounded."
  - "Masses come from each amino acid's formula and standard atomic weights, using fibub's peptide library (src/lib/sci/peptide.ts)."
  - "The folding picture is fibub's own simple 2D hydrophobic-polar bead model (springs, attraction between water-fearing beads, random kicks for heat). It shows the idea only; it is not a prediction of any real protein's shape."
  - "Checked in the tests: GA = 146.146 Da and the example 20-residue chain = 2262.70 Da (sum of residue masses + water), 19 peptide bonds, 20^20 = 1.05 × 10²⁶ sequences, and the bead model folds at 25 °C and unfolds at 80 °C. Nothing you enter is stored or sent anywhere."
flow:
  - { icon: pencil, label: "Sequence" }
  - { icon: orbit, label: "Helix" }
  - { icon: target, label: "Fold" }
  - { icon: check, label: "Check" }
---

## What it does

A protein is a chain of amino acids that folds into a precise shape, and its shape decides its job. Biologists describe that shape at four levels:

- **Primary**: the order of amino acids, joined by **peptide bonds**.
- **Secondary**: parts of the chain winding into an **α-helix** or lying side by side as a **β-pleated sheet**, held by hydrogen bonds in the backbone.
- **Tertiary**: the whole chain folding into a 3D shape, with water-fearing (hydrophobic) side chains tucked inside.
- **Quaternary**: two or more folded chains fitting together, as in **haemoglobin**.

Type any sequence in one-letter codes and switch between the four levels. The page counts the peptide bonds, the water released and the mass; draws your chain as a helix or a sheet with its size; folds it in a simple animation you can heat until it falls apart (denaturing); and shows haemoglobin's four chains coming together.

It fits Class 11 Biology (biomolecules: proteins and their structure) and links to Class 12 (the molecular basis of inheritance, where the sequence comes from). See how a gene's code becomes this sequence in [[central-dogma]], and how an enzyme's folded shape makes it work in [[enzyme-activity]].

## How to use it

1. Type a sequence (or keep the made-up example **MKLVAEFGSDLIKAWRVLEG**). Only the 20 standard letters count; anything else is left out and the page says so.
2. Pick a level: **Primary**, **Secondary**, **Tertiary** or **Quaternary**.
3. At Secondary, switch between **α-helix** and **β-pleated sheet**.
4. At Tertiary, watch the chain fold. Move **Temperature** above 60 °C to unfold it, back down to let it fold again, or press **Stretch it out again**.
5. At Quaternary, press **Separate the chains** and **Join the chains**.

## Worked example

The example has **20 amino acids**, so it has **19 peptide bonds**, and making them released **19 water molecules**. Its mass is the sum of the 20 residue masses plus one water for the two ends: **2262.7 Da**. There are 20²⁰ ≈ **1.05 × 10²⁶** possible sequences of this length, which is why proteins can be so varied.

As one α-helix it would make 20 ÷ 3.6 = **5.56 turns** and be 20 × 0.15 = **3 nm** long. Stretched out as a β-strand it would be about 20 × 0.33 = **6.6 nm**.

At Tertiary, the 11 water-fearing beads (orange) drift together; after a few seconds the page reports most or all of them buried and the chain is compact. Raise the temperature to 80 °C and it opens up again.

## Tips

- Heat, strong acids and alkalis break the weak bonds of the fold but not the peptide bonds, so a denatured protein keeps its primary structure.
- In a helix the side chains point outwards; the hydrogen bonds are between the backbone groups.
- Change one letter at the start of the sequence (for example a water-fearing one to a charged one) and refold: a single change can matter, as in sickle-cell haemoglobin.

## FAQ

**Is this how a real protein folds?** Only in spirit. Real folding happens in 3D with many kinds of interactions. The bead model shows the main idea: the oily parts hide from water.

**Why is the mass in daltons?** One dalton (Da) is about the mass of a hydrogen atom. Proteins are usually thousands to hundreds of thousands of daltons.

**Do all proteins have quaternary structure?** No. Only proteins made of more than one chain, like haemoglobin, do.
