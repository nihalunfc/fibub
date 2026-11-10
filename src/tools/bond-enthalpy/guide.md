---
name: Bond enthalpy estimator
num: 1362
shelf: learn
code: L222
section: school-chemistry
title: "Bond enthalpy calculator: estimate ΔH from bonds broken minus bonds made, with an energy diagram"
seoTitle: "Bond enthalpy calculator: ΔH from bonds broken − made"
summary: "Pick a reaction or count the bonds yourself and estimate its enthalpy change: energy in to break the old bonds, energy out when the new bonds form, ΔH = broken − made. An energy ladder shows the climb to separate atoms and the drop to products, with every number filled in."
status: live
ads: false
order: 1362
icon: flask
works: offline
updated: 2026-11-09
related: [gibbs-explorer, thermochemistry-calculator, lewis-structures, heating-curve]
sources:
  - "Standard method: ΔH ≈ Σ(bond enthalpies of bonds broken) − Σ(bond enthalpies of bonds made). The bond values are rounded average bond enthalpies (general chemistry facts) and can be edited. Written for fibub; no textbook text, figures or exercises are used."
  - "Every preset checked by an independent hand sum in Python with the same rounded values (methane −802, H₂ + Cl₂ −183, water −482, ammonia −93 kJ/mol and others)."
flow:
  - { icon: flask, label: "Reaction" }
  - { icon: scissors, label: "Break" }
  - { icon: link, label: "Make" }
  - { icon: calculator, label: "ΔH" }
---

## What it does

Every chemical reaction breaks some bonds and makes new ones. **Breaking a bond always takes energy in; making a bond always gives energy out.** If the new bonds are stronger than the old ones, more energy comes out than went in and the reaction is exothermic. This page adds it up:

**ΔH ≈ (sum of bonds broken) − (sum of bonds made)**

using the **average bond enthalpy** of each kind of bond, in kJ per mole of bonds. An energy ladder shows the reactants climbing to separate atoms (red arrow) and dropping to the products (green arrow); the blue arrow is ΔH.

It follows enthalpy and bond enthalpy in Class 11 chemistry (thermodynamics), and also the Class 10 idea of exothermic and endothermic reactions. Draw the molecules first with [[lewis-structures]] to count the bonds, then take ΔH on to the [[gibbs-explorer]] to see whether the reaction is spontaneous, or use the [[thermochemistry-calculator]] for measured values.

## How to use it

1. **Pick a reaction.** The bond counts fill in by themselves. Pick **My own** and type the counts to do any reaction.
2. **Read the answer.** The big line gives ΔH and whether the reaction gives out or takes in heat; the line under it shows the whole sum with your numbers.
3. **Change a bond value** in the kJ/mol column to use the numbers in your own book. "Put back the rounded values" undoes it.
4. Tick **Show every bond type** to see all 17 bonds; otherwise only the bonds in use are listed.

## Worked example

Burning methane: CH₄ + 2O₂ → CO₂ + 2H₂O.

- Bonds broken: 4 C–H and 2 O=O = 4 × 413 + 2 × 498 = **2648 kJ**.
- Bonds made: 2 C=O (in CO₂) and 4 O–H (two in each water) = 2 × 799 + 4 × 463 = **3450 kJ**.
- ΔH ≈ 2648 − 3450 = **−802 kJ/mol**. Negative: heat is given out.

H₂ + Cl₂ → 2HCl: 436 + 243 − 2 × 431 = **−183 kJ/mol**.

## Why is it only an estimate?

A C–H bond in methane is not exactly as strong as one in ethanol. Tables give an average over many molecules, so the answer can be a few percent off the measured value. Bond enthalpies also apply to gases: if water ends up as a liquid, extra heat comes out as the steam condenses.

## Check yourself

Three questions with fresh numbers: ΔH for H₂ + X₂, the energy to break all the C–H bonds in an alkane, and whether a reaction is exothermic. Nothing is saved.

## FAQ

**Why is breaking a bond "+"?** You have to put energy in to pull atoms apart, so it counts as energy taken in by the system.

**Do I count bonds per molecule or per equation?** Per equation as written: 2H₂O has four O–H bonds.

**Is this from my textbook?** It covers the standard school topic with its own examples and pictures. It is an independent study aid, not part of NCERT.
