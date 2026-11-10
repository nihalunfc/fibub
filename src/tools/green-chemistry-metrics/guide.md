---
name: Green chemistry metrics
num: 98
shelf: science
code: T98
section: green-chemistry-and-safety
title: "Green chemistry metrics"
summary: "Type a reaction and get its atom economy and carbon economy (balanced for you). Add the masses you used, including solvents and work-up, for yield, reaction mass efficiency, carbon efficiency, E-factor with and without water, process mass intensity and a breakdown of where the mass went."
status: live
ads: true
order: 1
icon: percent
works: offline
updated: 2026-11-08
related: [reaction-equivalents, equation-balancer, molar-mass-calculator, thermochemistry-calculator, fume-hood-ventilation, lca-compare, exposure-twa, mass-balance-solver]
sources:
  - "Atomic weights: IUPAC/CIAAW standard atomic weights (abridged values)."
flow:
  - { icon: pencil, label: "Reaction" }
  - { icon: percent, label: "Atom econ." }
  - { icon: table, label: "Masses" }
  - { icon: chart, label: "E-factor" }
---

## What it does

A reaction can give a 95 % yield and still turn most of what you put in into waste. Green chemistry metrics put a number on that, and they are now asked for in many journals, process reviews and teaching labs. This tool works out the common ones in one place.

From the reaction alone:

- **Atom economy** (Trost): the molar mass of the wanted product times its coefficient, over the total for the reactants. It is the best you could ever do, at 100 % yield with exact amounts. Additions and rearrangements reach 100 %; substitutions and eliminations cannot.
- **Carbon economy**: the same idea counted in carbon atoms.

From the masses you actually used:

- **Yield**, with the limiting reagent found for you.
- **Reaction mass efficiency (RME)**: product mass over the mass of all reactants. It combines yield, atom economy and any excess reagent.
- **Carbon efficiency**: carbon in the isolated product over carbon in the reactants.
- **E-factor** (Sheldon): kilograms of waste per kilogram of product, counting everything that went in but did not come out as product. It is shown with and without water, as both are quoted.
- **Process mass intensity (PMI)**: total mass in per kilogram of product, the measure used by the ACS Green Chemistry Institute Pharmaceutical Roundtable. PMI = E-factor + 1.

A table shows each material's share of the total input, so you can see at once whether solvents dominate (they usually do).

Balance the reaction first with the [[equation-balancer]], and work out the amounts with the [[reaction-equivalents]].

## How to use it

1. Type the reaction with formulas, such as `CH3COOH + C2H5OH → CH3COOC2H5 + H2O`. The coefficients are found for you; any you type are ignored.
2. If there is more than one product, choose the one you want.
3. Type the mass of each reactant you weighed and the mass of product you isolated.
4. List everything else that went in, one per line as `name, mass in g`: catalysts, solvents, wash solutions, drying agents. Convert volumes to mass with the density. Name water lines "water" so they can be counted separately.

## Worked example: making ethyl acetate

6.00 g of acetic acid and 10.0 g of ethanol give 7.04 g of ethyl acetate, using 0.5 g of sulfuric acid, a wash of 2.5 g sodium hydrogen carbonate in 47.5 g water, 35.7 g of diethyl ether and 2 g of magnesium sulfate.

- Atom economy = 88.11 / (60.05 + 46.07) = **83.0 %**: water is the unavoidable by-product.
- Acetic acid limits (0.0999 mol), so the theoretical yield is 8.80 g and the yield is **80.0 %**.
- RME = 7.04 / 16.0 = **44.0 %**, lower than the atom economy because ethanol was used in excess.
- 104.2 g went in, so the E-factor is (104.2 − 7.04) / 7.04 = **13.8**, or **7.05** without water, and the PMI is **14.8**.

## Questions

**Which metric should I report?** Atom economy to compare routes on paper, and PMI or E-factor for a real process, because solvents and work-up usually make up most of the mass. Say whether water is included.

**Why is my yield over 100 %?** The product is probably still wet with solvent or impure. Dry it and weigh again.

**Does a low E-factor mean the process is safe?** No. These metrics count mass, not hazard. A kilogram of water and a kilogram of a toxic solvent count the same, so look at what the waste is too.

**Is anything sent anywhere?** No. It all runs in your browser and works offline once the page has loaded.
