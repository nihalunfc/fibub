---
name: Bomb calorimeter virtual practical
num: 1367
shelf: learn
section: school-chemistry
title: "Bomb calorimeter virtual practical: calibrate, burn a sample, find ΔU and ΔH of combustion"
seoTitle: "Bomb calorimeter virtual lab: ΔU and ΔH of combustion"
summary: "A virtual bomb calorimeter: calibrate it by burning benzoic acid, then burn glucose, sucrose, naphthalene or urea and read the temperature rise off a live thermometer trace. Work out q = CΔT, the internal energy change ΔU per mole, and ΔH = ΔU + Δn(gas)RT, with every step shown."
status: live
ads: false
order: 1367
icon: flask
works: offline
updated: 2026-11-09
related: [gibbs-explorer, bond-enthalpy, thermochemistry-calculator, heating-curve]
sources:
  - "Standard thermodynamics: constant-volume calorimetry q = CΔT, ΔU = q_V, ΔH = ΔU + Δn(gas)RT. R from CODATA 2018. The benzoic acid calibration value (26.43 kJ/g) and the samples' combustion energies are rounded standard values, labelled as rounded; the readings are simulated. Written for fibub; no textbook text, figures or exercises are used."
  - "Checked by independent hand calculation in Python: calibration C = 26.43 / 2.604 = 10.150 kJ/K; 1.2 g of glucose gives ΔT = 1.839 K and ΔU = −2802 kJ/mol; ΔH for naphthalene (Δn = −2) and urea (Δn = +½)."
flow:
  - { icon: flask, label: "Calibrate" }
  - { icon: pointer, label: "Fire" }
  - { icon: chart, label: "Read ΔT" }
  - { icon: calculator, label: "ΔU, ΔH" }
---

## What it does

A **bomb calorimeter** measures the energy released when something burns. The sample sits in a sealed steel container (the "bomb") full of oxygen, surrounded by water. A spark sets it alight, and the heat warms the bomb and the water by a small, carefully measured amount ΔT.

Because the bomb is sealed, the burning happens at **constant volume**, so the heat measured is the **internal energy change ΔU**. To get the **enthalpy change ΔH** (constant pressure), add the work term for the change in moles of gas: **ΔH = ΔU + Δn(gas)RT**.

This virtual practical walks you through it: first calibrate the calorimeter with benzoic acid, then burn a sample and work out ΔU and ΔH per mole. The temperature trace is drawn live as if from a fine thermometer.

It follows thermodynamics in Class 11 chemistry (measuring ΔU and ΔH). Go on to the [[gibbs-explorer]] to see whether a reaction is spontaneous, the [[bond-enthalpy]] estimator to predict ΔH from bonds, or the [[thermochemistry-calculator]] for any reaction.

## How to use it

1. **Step 1, calibrate.** Type the mass of benzoic acid (about 1 g) and press **Fire**. It releases 26.43 kJ per gram, so C = q ÷ ΔT gives the heat capacity of this calorimeter.
2. **Step 2, burn your sample.** Choose glucose, sucrose, naphthalene or urea, type its mass and press **Fire**. The page uses your C to turn ΔT into heat, then into ΔU per mole and ΔH.
3. **Use a different calorimeter** gives one with another heat capacity. Calibrate again; your final ΔU should not change.

## Worked example

Calibration: 1.000 g of benzoic acid gives q = 26.43 kJ and a rise of ΔT = 2.604 K, so **C = 26.43 ÷ 2.604 = 10.150 kJ/K**.

Glucose: 1.200 g gives ΔT = 1.839 K. Heat q = 10.150 × 1.839 = **18.665 kJ**. Moles = 1.200 ÷ 180.16 = 0.0066607 mol, so ΔU = −18.665 ÷ 0.0066607 = **−2802.3 kJ/mol**. For glucose, C₆H₁₂O₆(s) + 6O₂(g) → 6CO₂(g) + 6H₂O(l), Δn(gas) = 6 − 6 = 0, so ΔH = ΔU.

Naphthalene (1.000 g, ΔT = 3.960 K) gives ΔU = −5151.5 kJ/mol; there are 12 mol of O₂ before and 10 mol of CO₂ after, so Δn = −2 and ΔH = −5151.5 − 2 × 8.314 × 298 ÷ 1000 = **−5156.5 kJ/mol**.

## Check yourself

Three questions with fresh numbers: the heat capacity from a calibration, ΔU per mole from a temperature rise, and ΔH from ΔU. Nothing is saved.

## FAQ

**Why calibrate?** The bomb, water, stirrer and thermometer all soak up heat. Rather than adding them up, burn something with a known energy and measure.

**Why is ΔU negative?** Heat leaves the reacting chemicals and warms the water, so the chemicals lose energy.

**Is this from my textbook?** It covers the standard school topic with its own examples and pictures. It is an independent study aid, not part of NCERT.
