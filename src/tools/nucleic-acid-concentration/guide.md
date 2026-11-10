---
name: Nucleic acid concentration
num: 164
shelf: science
section: molecular-biology
title: "Nucleic acid concentration"
summary: "Turn spectrophotometer readings into concentration for double- or single-stranded DNA, RNA or protein, with background correction, dilution and path length. Check purity with 260/280 and 260/230, get nM and copies per µL from the length or sequence, and see how much stock to dilute to any target. Many samples at once."
status: live
ads: true
order: 12
icon: flask
works: offline
updated: 2026-11-09
related: [sequence-tools, pcr-master-mix, beer-lambert-calculator, solution-calculator]
sources:
  - "Beer–Lambert law with the conventional factors of 50, 33 and 40 µg/mL per A260 unit for double-stranded DNA, single-stranded DNA and RNA (general laboratory facts). Purity ranges are common rules of thumb, not a standard."
  - "Nucleotide residue masses worked out by fibub from the chemical formulas with standard atomic weights; copies use the Avogadro constant (exact SI value)."
  - "Checked in the tests against an independent Python calculation. The example readings are made up."
flow:
  - { icon: flask, label: "Sample type" }
  - { icon: table, label: "Readings" }
  - { icon: ruler, label: "Size" }
  - { icon: calculator, label: "Dilute" }
---

## What it does

A spectrophotometer gives absorbance; you need concentration, a purity check and, for PCR, cloning or sequencing, the molarity or copy number and how to dilute. This page does all of it for one sample or a whole batch, in your browser.

- **Concentration** = (A260 − A320) × factor × dilution ÷ path length, in ng/µL. The factor is 50 for double-stranded DNA, 33 for single-stranded DNA and 40 for RNA; you can change it (short oligos need a sequence-specific factor from the supplier).
- **Protein** uses A280 with your extinction coefficient ε and molar mass: c = A × M ÷ (ε × path), in mg/mL and µM.
- **Purity:** the 260/280 and 260/230 ratios, background-corrected, with a plain note when they fall outside the usual ranges, and a chart of both ratios.
- **Molarity and copies** from the length (average base mass) or the exact sequence, for linear or circular DNA.
- **Dilution:** stock and diluent volumes to reach a target in ng/µL, nM or copies/µL (mg/mL or µM for protein).

To dilute the sample to a working stock, use the [[solution-calculator]]; to check the sequence it came from, the [[sequence-tools|DNA sequence tools]].

## How to use it

1. **Sample type.** Choose double-stranded DNA, single-stranded DNA, RNA or protein. Set the dilution if you diluted before measuring, and the path length (leave 1 cm for microvolume readers, which already scale to 1 cm).
2. **Readings.** One row per sample: name, A260, A280, then A230 and A320 if you have them. Paste, type or open a CSV or spreadsheet.
3. **Size.** Give the length in bp or nt, and the shape for double-stranded DNA. Paste the sequence instead for its exact mass.
4. **Dilute to.** Pick a target, a unit and the final volume.

## Worked example

The made-up example has four double-stranded DNA preps of a 3,000 bp linear fragment. Prep 1 reads A260 7.40 and A320 0.02, so it is (7.40 − 0.02) × 50 = **369 ng/µL**. A 3,000 bp linear double strand weighs about 1,853,733 g/mol, so that is 199 nM, or **1.20 × 10¹¹ copies/µL**. To make 50 µL at 10 ng/µL, mix 1.36 µL of stock with 48.6 µL of water.

Prep 3 has a 260/280 of 1.62, below the usual 1.7 for DNA, which hints at protein or phenol left over. Prep 4 has a 260/230 of 1.39, which hints at salt or guanidine carried over from the kit. The tool flags both: "4 samples, 43–369 ng/µL; 2 to check".

## Good to know

- Below about 0.02 absorbance units readings are unreliable, and the tool says so.
- A260 counts every nucleic acid, so RNA in a DNA prep (or free nucleotides) inflates the result. A dye-based assay is more specific.
- The purity ranges are rules of thumb; ratios also shift with the pH and salt of the blank.

## FAQ

**Why subtract A320?** Nucleic acids and proteins barely absorb at 320 nm, so a reading there is background from turbidity or the optics.

**Does circular DNA weigh less?** Slightly: a closed circle has no free ends, so it lacks the two water molecules of a linear double strand. The difference matters only for short molecules.

**Is anything uploaded?** No. Everything runs in your browser.
