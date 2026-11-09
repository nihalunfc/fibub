---
name: Chromatography calculator
num: 86
shelf: science
section: analytical-chemistry
title: "Chromatography calculator: resolution, plate count, retention factor and HPLC method transfer"
summary: "Resolution, retention factor, selectivity, plate number and HETP for two peaks, the plates needed for a target resolution, and moving an HPLC method to a shorter, narrower column (flow, injection, gradient times, USP <621> L/dp check)."
status: live
ads: true
order: 8
icon: chart
works: offline
updated: 2026-11-08
related: [calibration-curve, beer-lambert-calculator, isotope-pattern-calculator, solution-calculator]
sources:
  - "Formulas and method transfer rules: USP general chapter <621> and the European Pharmacopoeia."
flow:
  - { icon: chart, label: "Peaks" }
  - { icon: calculator, label: "Resolution" }
  - { icon: convert, label: "Transfer" }
---

## What it does

In HPLC and GC, two numbers decide whether a method works: how far apart two peaks are, and how wide they are. This calculator turns retention times and peak widths into the standard figures, and helps you move a method to a modern column.

**Two neighbouring peaks**

- **Retention factor** k = (tR − t₀)/t₀: how long each compound is held, relative to an unretained one.
- **Selectivity** α = k₂/k₁: how differently the column treats the two.
- **Resolution** Rs, by the USP formula from baseline widths, 2(t₂ − t₁)/(W₁ + W₂), or the Ph. Eur. formula from half-height widths, 1.18(t₂ − t₁)/(W½₁ + W½₂). An Rs of 1.5 is baseline separation; 2 is the usual target for robust methods.
- **Plate number** N and **plate height** (HETP), which measure column efficiency.
- **The Purnell equation** checks the figures against each other, and gives the plates needed for the resolution you want.

**Method transfer**

Going from a 250 × 4.6 mm, 5 µm column to a 100 × 2.1 mm, 1.8 µm one can save 90 % of the time and solvent. The flow, injection volume and every gradient time must be scaled together so the separation stays the same. The tool does that, as in USP chapter <621>, and checks the change in column length to particle size (L/dp) against the −25 % to +50 % window.

To turn peak areas into concentrations, use the [[calibration-curve|calibration curve]] tool; for spots on a TLC plate, the [[tlc-rf-calculator]].

## How to use it

1. Enter t₀, the two retention times and the two peak widths, and say how the widths were measured (most software reports W½).
2. Add the column length for HETP, and the resolution you need for the plate target.
3. For a transfer, enter the old and new column sizes, the flow, the injection volume and the gradient table.

## Worked example

Peaks at 6.40 and 7.10 min with t₀ = 1.20 min and half-height widths 0.150 and 0.160 min:

- k₁ = (6.40 − 1.20)/1.20 = 4.33, k₂ = 4.92, so α = 1.135.
- Rs = 1.18 × (7.10 − 6.40)/(0.150 + 0.160) = 2.66, fully separated.
- N₂ = 5.54 × (7.10/0.160)² ≈ 10,900 plates. In a 150 mm column, HETP = 13.7 µm.

Moving a method from 250 × 4.6 mm, 5 µm at 1.0 mL/min to 100 × 2.1 mm, 1.8 µm gives a flow of 1.0 × (2.1/4.6)² × (5/1.8) = 0.58 mL/min and an injection of 20 µL × 0.083 = 1.7 µL. Gradient times are multiplied by 0.144, so a 26 min gradient takes 3.7 min, using about 8 % of the solvent. L/dp goes from 50,000 to 55,600 (+11 %), inside the USP window.

## Questions

**Why does doubling the column only give 41 % more resolution?** Resolution grows with the square root of the plate number. Changing the selectivity, through the mobile phase, pH, temperature or column chemistry, is usually a far stronger lever.

**Do I need to revalidate after a transfer?** Changes inside the USP <621> or Ph. Eur. 2.2.46 limits are allowed without full revalidation for compendial methods, but system suitability must still pass. Check your monograph and local rules. Nothing you type leaves your browser.
