---
name: Solutions and dilutions calculator
num: 30
shelf: science
section: general-and-lab-chemistry
title: "Molarity, dilution (C1V1 = C2V2) and serial dilution calculator"
summary: "Work out how much to weigh for a solution in M, mM, mg/mL, % w/v or ppm, how much stock to dilute, and a full serial dilution plan with volumes for every tube."
status: live
ads: true
order: 10
icon: flask
works: offline
updated: 2026-11-08
related: [pcr-master-mix, calibration-curve, plate-layout, uncertainty-calculator]
flow:
  - { icon: flask, label: "Weigh" }
  - { icon: sliders, label: "Dilute" }
  - { icon: table, label: "Serial plan" }
---

## What it does

Three bench calculations in one place, the ones every chemistry and biology lab does daily:

- **Make a solution:** how many grams to weigh for a given concentration and volume, or the concentration you get from a mass, or the volume to make up to.
- **Dilute a stock:** the C1V1 = C2V2 rule. Fill any three values and it works out the fourth, and how much diluent to add.
- **Serial dilution:** a tube-by-tube plan for a dilution series, with the transfer and diluent volumes, the concentration in each tube and the overall dilution.

Everything is worked out in your browser and the page keeps working offline.

## How to use it

**Make a solution.** Pick what to work out, then type the molar mass and the other two values. Concentrations can be in M, mM, µM or nM (these need the molar mass), or in g/L, mg/mL, µg/mL, ng/µL, % w/v, ppm or ppb (these do not). Weigh the amount shown, dissolve it in less solvent than the final volume, and then top up to the mark. Adding the solid to the full volume gives a slightly weaker solution.

**Dilute a stock.** Leave one box empty. Use the same unit for both concentrations (for example both in mM) and for both volumes. The answer tells you how much stock to take and how much diluent to add.

**Serial dilution.** Type the stock concentration, the factor for each step (2-fold, 10-fold or any other), the number of tubes, and the volume you want left in each tube. Each tube gets the same volume of diluent, and you then move the transfer volume from one tube to the next. For a factor f and a volume V left in each tube, the transfer is V / (f − 1). The extra transfer volume from the last tube is thrown away, so every tube ends with the same volume.

## Worked example

To make 250 mL of 0.5 M sodium chloride (molar mass 58.44 g/mol), weigh 0.5 × 0.250 × 58.44 = 7.305 g. To make 50 µL of 1 mM from a 10 mM stock, take 5 µL of stock and add 45 µL of diluent. For six 10-fold steps from 1000 µg/mL with 900 µL left in each tube, put 900 µL of diluent in each tube and move 100 µL along. Tube 6 then holds 0.001 µg/mL, a 1 : 1,000,000 dilution.

## Frequently asked questions

**Why does a hydrate matter?** The water in the crystal counts towards the mass you weigh. Copper sulfate pentahydrate (CuSO₄·5H₂O) has a molar mass of 249.69 g/mol, against 159.61 for the dry salt. Use the number on your bottle.

**Are ppm and mg/L the same?** For dilute solutions in water, yes, because a litre of water weighs about a kilogram. For other solvents or strong solutions, they differ.

**Next steps?** Plan a PCR with the [master mix calculator](/science/pcr-master-mix/), lay your dilutions out on a plate with the [plate layout designer](/science/plate-layout/), or turn the standards into a [calibration curve](/science/calibration-curve/).
