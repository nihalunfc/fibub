---
name: Reaction equivalents table
num: 85
shelf: science
section: organic-chemistry
title: "Reaction equivalents table: reagent amounts in mmol, mg and mL for a synthesis"
summary: "The reagent table of a lab notebook: molar masses from formulas, equivalents, density, purity and solution molarity, giving the mass to weigh or volume to measure for every reagent, and the theoretical and percent yield."
status: live
ads: true
order: 5
icon: flask
works: offline
updated: 2026-11-08
related: [molar-mass-calculator, equation-balancer, solution-calculator, uncertainty-calculator]
sources:
  - "Atomic weights: IUPAC/CIAAW standard atomic weights (abridged values)."
flow:
  - { icon: table, label: "Reagents" }
  - { icon: calculator, label: "Amounts" }
  - { icon: check, label: "Yield" }
---

## What it does

Before an organic reaction, chemists write a reagent table: every substance, its molar mass, how many equivalents are used relative to the limiting reagent, and what to weigh or measure. This tool builds that table and keeps the arithmetic right when you change the scale.

- **Molar masses from formulas.** Type the formula and the molar mass fills in, using IUPAC atomic weights. Brackets work, so Pd(P(C6H5)3)4 gives 1155.59. You can also type a molar mass directly.
- **Equivalents** set each reagent's amount relative to the limiting reagent, which is 1 equivalent.
- **Liquids** with a density get a volume in µL or mL, for a syringe or pipette.
- **Solutions** with a molarity, such as n-butyllithium at 2.5 mol/L, get the volume of solution to add.
- **Purity** below 100 % scales up the mass to weigh, so a 95 % reagent still delivers the moles you planned.
- **Scale** by mmol, by the mass of any reagent, or by the volume of a liquid one: "I have 1.20 g of this, how much of everything else?"
- **Yield**: the theoretical yield of your product and the percent yield from what you isolated.

## How to use it

1. Press **Example** to see a filled-in table, or **Start empty**.
2. For each reagent, type a name and formula (or molar mass), the equivalents, and a density, purity or molarity where they apply.
3. Choose which reagent sets the scale and how much you have.
4. Read the mass to weigh and the volume to measure for each row. Download the table as a PNG, PDF or Word file for your notebook.
5. Type the product's formula and the mass you isolated for the percent yield.

## Worked example

A Suzuki coupling at 5.00 mmol scale: 4-bromoanisole (C7H7BrO, 187.04 g/mol, a liquid of density 1.494 g/mL) with 1.2 equivalents of phenylboronic acid, 2 equivalents of potassium carbonate and 5 mol % (0.05 equivalents) of Pd(PPh₃)₄.

- 4-Bromoanisole: 5.00 mmol = 935.2 mg, or 626 µL by syringe.
- Phenylboronic acid: 6.00 mmol × 121.93 = 731.6 mg.
- Potassium carbonate: 10.0 mmol × 138.20 = 1.382 g.
- Pd(PPh₃)₄: 0.250 mmol × 1155.59 = 288.9 mg.

The product, 4-methoxybiphenyl (C13H12O, 184.24 g/mol), has a theoretical yield of 921.2 mg. If you isolate 780 mg, that is 84.7 %.

## Questions

**What is an equivalent?** The number of moles of a reagent for every mole of the limiting reagent. 1.2 equivalents means a 20 % excess. A catalyst at 5 mol % is 0.05 equivalents.

**Should I use the purity for the limiting reagent too?** Yes, if you know it. The tool divides the mass by the purity, so you weigh enough to get the moles you want.

**Is my data saved?** No. The table lives only on this page; download it to keep it. Nothing is sent anywhere.
