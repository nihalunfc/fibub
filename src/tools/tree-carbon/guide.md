---
name: Tree carbon calculator
num: 161
shelf: science
section: carbon-and-energy-accounting
title: "Tree carbon sequestration calculator: CO₂ stored in trees from trunk diameter (DBH) and height with your allometric equation"
summary: "Estimate the carbon and CO₂ stored in trees, and how much they take up each year. Enter each tree's trunk diameter (DBH) and height, an allometric equation for your species, a root-to-shoot ratio and a carbon fraction. See biomass, carbon, CO₂e for every tree and in total, and yearly uptake from two measurements or a growth rate."
status: live
ads: true
order: 1
icon: calculator
works: offline
updated: 2026-11-09
related: [landfill-gas, biodiversity-indices, field-sampling-planner]
sources:
  - "Allometric biomass equations of the forms a·DBH^b and a·(ρ·DBH²·H)^b, root-to-shoot ratios and the carbon fraction of dry biomass: standard forest inventory methods. The tool has no built-in species equations; the default a, b, wood density, root-to-shoot ratio and carbon fraction are made-up illustrations."
  - "CO₂ from carbon by the ratio of molar masses, 44.01/12.01."
  - "Checked in the tests against an independent NumPy calculation. The example trees are made up."
flow:
  - { icon: ruler, label: "Measure" }
  - { icon: sigma, label: "Equation" }
  - { icon: calculator, label: "Biomass" }
  - { icon: chart, label: "CO₂e" }
---

## What it does

A tree's wood is about half carbon, which came out of the air as CO₂. Weighing a tree is impractical, so foresters use **allometric equations**: formulas, fitted by cutting and weighing sample trees, that predict dry biomass from easy measurements such as the trunk diameter at breast height (**DBH**, 1.3 m up) and the height. This tool applies the equation you choose to a list of trees and works out:

- above-ground dry biomass from the equation;
- roots, as a **root-to-shoot ratio** times the above-ground biomass;
- **carbon**, as the carbon fraction of the total dry biomass;
- **CO₂ equivalent**, carbon × 44/12;
- **yearly uptake**, from the change since an earlier measurement, or by growing each trunk at a DBH growth rate for one year.

To compare the trees with other ways of saving carbon, use [[lca-compare|life cycle comparison]]; for the variety of species in the same stand, [[biodiversity-indices]].

## How to use it

1. **Trees.** Paste or open one row per tree: a name (optional), DBH now in cm, height now in m, and if you have them the DBH and height at an earlier measurement. Give the years between the two measurements.
2. **Growth rate.** For trees with no earlier measurement, give a typical DBH growth in cm per year to estimate the yearly uptake (the height is kept the same).
3. **Equation.** Choose *a × DBH^b* or *a × (ρ × DBH² × H)^b*, where ρ is the wood density in g/cm³, and type its coefficients. Use an equation published for your species, region and size range: equations vary a lot, and using one outside its range can be badly wrong.
4. **Root-to-shoot ratio and carbon fraction.** Typical values sit around 0.2 to 0.3 for roots and 0.47 to 0.5 for carbon, but use values from your own guidance.

**The default coefficients are made-up illustrations**, not taken from any study and not for any real species.

## Worked example

The eight made-up trees, from a 14 cm cherry to a 51 cm pine, were measured now and five years ago. With the illustrative equation biomass = 0.1 × DBH^2.4, a root-to-shoot ratio of 0.25 and a carbon fraction of 0.47, they hold 5.23 t of dry biomass (4.18 t above ground and 1.05 t in roots). That is 2.46 t of carbon, or **9 t of CO₂e**. Comparing with the earlier measurements, they took up **346 kg of CO₂e per year**. The biggest store is Pine 1, with 2.7 t CO₂e, 30 % of the total.

## FAQs

**Why is my result so different with another equation?** Biomass grows steeply with diameter (b is often 2 to 2.7), so small changes in the coefficients change the result a lot. Always use an equation built for trees like yours.

**Can I use this to sell carbon credits?** No. Carbon credit standards set their own methods, sampling, uncertainty deductions and checks. This tool is for learning, planning and rough estimates.

**Does it count dead wood, leaves or soil?** It counts what your equation counts (usually stem, branches and leaves) plus roots. Dead wood, litter and soil carbon are not included.

**Is my data uploaded?** No. Everything runs in your browser.
