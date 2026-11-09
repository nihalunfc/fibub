---
name: Ligation and assembly calculator
num: 166
shelf: science
section: molecular-biology
title: "Ligation and Gibson assembly calculator: insert to vector molar ratio, ng and pmol of each fragment, and pipetting volumes"
summary: "Set up a ligation or a multi-fragment assembly. Enter the vector and inserts with their lengths, concentrations and molar ratios, and get the ng, fmol and µL of each, the buffer, enzyme and water volumes, a check that it all fits, and the insert amount at other ratios."
status: live
ads: true
order: 14
icon: link
works: offline
updated: 2026-11-09
related: [nucleic-acid-concentration, pcr-master-mix, sequence-tools, qpcr-analyser]
sources:
  - "Molar ratio arithmetic: pmol = ng ÷ molar mass × 1000, with the mass of linear double-stranded DNA worked out by fibub from the nucleotide formulas (the same as the DNA concentration tool). Written by fibub."
  - "The 3:1 starting ratio, 10× ligase buffer and 2× assembly master mix are common lab conventions, used as editable defaults; no kit manual text or tables are copied. Follow your kit's instructions where they differ."
  - "Checked in the tests against an independent Python calculation. The example fragments are made up."
flow:
  - { icon: sliders, label: "Reaction" }
  - { icon: table, label: "Fragments" }
  - { icon: calculator, label: "Amounts" }
  - { icon: check, label: "Pipette" }
---

## What it does

Ligations and assemblies work best when the pieces are mixed by **number of molecules**, not by weight. A 1,200 bp insert weighs less per molecule than a 5,400 bp vector, so a 3:1 molar ratio is not 3:1 in ng. This page does the conversion for any number of fragments and turns it into a pipetting list:

- **Amounts.** For each insert: fmol = vector fmol × ratio, then ng from the length. The vector's amount sets everything.
- **Volumes.** µL of each fragment from its concentration, the buffer or master mix volume (total ÷ strength), the enzyme volume, and the water that fills the rest.
- **Checks.** Whether the DNA fits in the room left, the most vector that would fit, and which fragments need less than 0.5 µL (hard to pipette accurately), with a dilution that brings them to at least 1 µL.
- **Other ratios.** The first insert's ng and µL at 1:1, 2:1, 3:1, 5:1, 7:1 and 10:1.

Measure each fragment first with [[nucleic-acid-concentration|DNA, RNA and protein concentration]], and see the finished construct on a [[plasmid-map]].

## How to use it

1. **Reaction.** Pick *Ligation* (10× buffer plus 1 µL ligase in 20 µL) or *Assembly* (2× master mix, enzyme included), or type your own total volume, buffer strength and enzyme volume.
2. **Vector amount.** How many ng of vector you want in the reaction.
3. **Fragments.** One row each: name, length in bp, concentration in ng/µL and molar ratio to the vector. The first row is the vector.
4. **Pipette.** Follow the table from the top: buffer, water, DNA, and the enzyme last.

## Worked example

The made-up example assembles a 5,400 bp vector (62.5 ng/µL) with three pieces: Insert A, 1,200 bp at 40 ng/µL, 3:1; Insert B, 850 bp at 25 ng/µL, 3:1; and Linker C, 400 bp at 18 ng/µL, 5:1. With 50 ng of vector, that is 15 fmol of vector, so each 3:1 insert is 45 fmol. Insert A comes to **33.3 ng (0.83 µL)**, the same as the shortcut 50 × 3 × 1,200 ÷ 5,400. In a 20 µL ligation with 2 µL of buffer and 1 µL of ligase, the DNA takes **3.61 µL** and water makes up **13.4 µL**. Up to 236 ng of vector would still fit at these ratios.

Switch to *Assembly* and the 2× master mix takes 10 µL, leaving 6.39 µL of water.

## Good to know

- Ratios of 1:1 to 10:1 are commonly tried; very short inserts are often added in larger excess. Your kit's manual has its own advice.
- Measure concentrations after clean-up; leftover primers and nucleotides inflate A260.
- Molar amounts assume linear double-stranded DNA, which is what you ligate or assemble.

## FAQ

**Why fmol and not pmol?** Typical vector amounts are tens of fmol (hundredths of a pmol); both are shown in the download.

**What if the DNA does not fit?** Use less vector (the tool gives the most that fits), concentrate the DNA, or raise the total volume.

**Is anything uploaded?** No. Everything runs in your browser.
