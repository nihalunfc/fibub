---
name: Colligative properties calculator
num: 88
shelf: science
code: T88
section: physical-chemistry
title: "Colligative properties calculator: freezing point depression, boiling point elevation, osmotic pressure and molar mass"
summary: "Freezing point, boiling point, vapour pressure and osmotic pressure of a solution in water or 10 other solvents, with the van 't Hoff factor, and the molar mass of an unknown from a measured freezing point drop, boiling point rise or osmotic pressure."
status: live
ads: true
order: 5
icon: flask
works: offline
updated: 2026-11-08
related: [molar-mass-calculator, solution-calculator, gas-law-calculator, reaction-equivalents]
sources:
  - "Atomic weights: IUPAC/CIAAW standard atomic weights (abridged values)."
  - "Solvent constants (Kf, Kb, melting and boiling points): common textbook values (Atkins; CRC Handbook), which you can type over."
flow:
  - { icon: flask, label: "Solution" }
  - { icon: calculator, label: "Molality" }
  - { icon: chart, label: "ΔT and π" }
  - { icon: check, label: "Molar mass" }
---

## What it does

Dissolve something in a liquid and four properties change by an amount that depends only on how many particles you added, not what they are. These are the colligative properties, and they are how chemists first measured molar masses.

- **Freezing point depression**: ΔTf = i·Kf·m. Salt on roads and antifreeze in car radiators work this way.
- **Boiling point elevation**: ΔTb = i·Kb·m.
- **Vapour pressure lowering** (Raoult's law): the solvent's vapour pressure falls in proportion to its mole fraction.
- **Osmotic pressure** (van 't Hoff): π = i·c·R·T. Shown for water, where it is also given in mOsm/kg.

Here m is the molality (moles of solute per kilogram of solvent) and i is the van 't Hoff factor, the number of particles each formula unit gives: 1 for sugar, 2 for NaCl, 3 for CaCl₂. Real salts give a little less than the ideal number, because ions pair up. NaCl in dilute water acts like i ≈ 1.9.

The second part works backwards: from a measured change it gives the **molar mass** of an unknown. If you type the formula you expect, it compares the two and tells you whether the solute pairs up (as acetic acid does in benzene) or splits into ions.

Get the molar mass of the solute first with the [[molar-mass-calculator]]; for the vapour pressure of a pure liquid, use the [[vapour-pressure-calculator]].

## How to use it

1. Pick the solvent. Its Kf, Kb, melting and boiling points fill in (common textbook values from Atkins and the CRC Handbook). Type over them to use your own.
2. Type the solute's formula (such as C6H12O6) or its molar mass, the two masses, and i.
3. Read the new freezing and boiling points, the vapour pressure and, for water, the osmotic pressure.
4. For an unknown, choose what you measured, then type the masses and the change. For osmotic pressure, give the solution volume and the temperature.

## Worked example

10.0 g of glucose (180.16 g/mol) in 200 g of water is 0.2775 mol/kg. It freezes at −0.516 °C (1.86 × 0.2775) and boils at 100.142 °C (0.512 × 0.2775). The water's vapour pressure at 25 °C drops from 3.169 to 3.153 kPa, and the osmotic pressure is about 6.86 bar.

1.00 g of sulfur in 50.0 g of benzene lowers its freezing point by 0.40 K. M = 5.12 × 1.00 / (0.40 × 0.0500) = 256 g/mol, which matches S₈ (256.5 g/mol): sulfur exists as eight-atom rings.

10.0 g/L of a protein with an osmotic pressure of 3.73 mbar at 25 °C gives about 66,500 g/mol, the size of serum albumin.

## Questions

**Why is my salt water result a bit off?** The laws are exact only for dilute, ideal solutions. Ions attract each other, so i is a little below the ideal value, and above about 1 mol/kg all solutions depart from the simple laws.

**Which method is best for molar mass?** Freezing point depression for small molecules (camphor, with Kf about 40, gives the biggest change), and osmotic pressure for polymers and proteins, where the temperature changes would be too small to measure.

**Is anything sent anywhere?** No. Everything is worked out in your browser.
