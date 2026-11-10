---
name: Molar mass calculator
num: 78
shelf: science
code: T78
section: general-and-lab-chemistry
title: "Molar mass calculator: formula weight, percent composition and grams to moles"
summary: "Type any formula, including brackets, hydrates, isotope labels and charges, for its molar mass, exact mass, percentage of each element, and a grams, moles and particles converter."
status: live
ads: true
order: 5
icon: flask
works: offline
updated: 2026-11-08
related: [solution-calculator, equation-balancer, isotope-pattern-calculator, calibration-curve, uncertainty-calculator]
sources:
  - "Atomic weights: IUPAC/CIAAW standard atomic weights (abridged values)."
  - "Isotope masses and abundances: the chemical-elements data set by cheminfo (MIT licence), compiled from NIST and IUPAC data."
flow:
  - { icon: pencil, label: "Formula" }
  - { icon: calculator, label: "Molar mass" }
  - { icon: chart, label: "Make-up" }
---

## What it does

The molar mass is the mass of one mole of a substance: 6.022 × 10²³ molecules or formula units. It turns grams on a balance into moles in a reaction, so nearly every calculation in a chemistry lab starts with it. This calculator reads the formula the way you would write it and gives:

- **Molar mass** in g/mol, from the IUPAC standard atomic weights (the values on modern periodic tables). The same number is the mass of one molecule in daltons.
- **Formula in Hill order**, the way databases and catalogues list compounds: carbon first, hydrogen second, then the other elements alphabetically.
- **Monoisotopic and nominal mass**, with every atom as its most common isotope. That is the main peak in a mass spectrum, which is why it differs from the molar mass.
- **Rings plus double bonds** (degree of unsaturation) for organic formulas.
- **Percentage composition**: each element's share of the mass, as a table and a bar chart.
- **Grams, moles and particles**: change any of the three and the other two follow.

To make up a solution from the mass, use the [[solution-calculator]]; for the exact masses a mass spectrometer sees, the [[isotope-pattern-calculator]].

## Writing formulas

- Capitals matter. **Co** is cobalt; **CO** is carbon and oxygen.
- Brackets of any kind nest: Ca3(PO4)2, K4[Fe(CN)6], {…}.
- Water of crystallisation goes after a dot, a middle dot or a star: CuSO4.5H2O, CuSO4·5H2O or CuSO4*5H2O. Fractions work too (CaSO4·0.5H2O).
- Isotope labels go in square brackets or after a caret: [13C]6H12O6 or ^13C. D and T stand for deuterium and tritium.
- Charges go at the end with a caret (Fe^3+, SO4^2-) or as a lone sign (NH4+, Cl-). Fe3+ would be read as three iron atoms with one positive charge, so use the caret.
- Decimal counts such as Fe0.95O are allowed for non-stoichiometric solids.

## Worked example

Copper(II) sulfate pentahydrate, CuSO4·5H2O, has 1 Cu, 1 S, 9 O and 10 H:

63.546 + 32.06 + 9 × 15.999 + 10 × 1.0080 = 249.677 g/mol.

Copper is 63.546 ÷ 249.677 = 25.45 % of the mass, and water 36.08 %. So 10 g of the blue crystals is 10 ÷ 249.677 = 0.04005 mol, or 2.41 × 10²² formula units.

## Questions

**Why does my textbook give a slightly different number?** Older books used older atomic weights (for example 12.0107 for carbon instead of 12.011) or rounded them to one decimal place. The differences are tiny but can change the last digit. This tool uses the IUPAC abridged standard atomic weights (2021 table with the 2024 updates, checked November 2026); check the official source when it matters.

**What about radioactive elements?** Elements such as technetium or plutonium have no standard atomic weight. The tool uses the mass number of their longest-lived isotope, shown in brackets on periodic tables, and says so.

**Where do the isotope masses come from?** Exact isotope masses and natural abundances are from the NIST and IUPAC tables, as packaged in the open-source chemical-elements data set by cheminfo (MIT licence).

**Is anything sent anywhere?** No. The whole calculation runs in your browser and keeps working offline.
