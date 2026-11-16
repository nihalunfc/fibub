---
name: Yield and atom economy
num: 2262
shelf: learn
code: L348
section: school-chemistry
title: "Percentage yield and atom economy calculator"
summary: "Choose a reaction, set the mass of reactant and the mass of product you actually got, and see the theoretical yield, the percentage yield and the atom economy as two bars."
status: live
ads: false
order: 2262
icon: flask
works: offline
updated: 2026-11-16
related: [limiting-reagent, mole-bridge, molar-mass-calculator]
sources:
  - "Percentage yield = actual ÷ theoretical × 100; atom economy = Mr of the desired product (× coefficient) ÷ total Mr of the reactants (× coefficients) × 100. Standard atomic masses (H 1.008, C 12.011, N 14.007, O 15.999, Ca 40.078, Fe 55.845). Serves GCSE chemistry C3 and C4 (higher tier), Ontario SCH3U quantities in chemical reactions and NGSS HS-PS1-7. Maths in src/lib/learn/curr-chem.ts, checked in tests/curr-chem.mjs. Drawings are fibub's own."
flow:
  - { icon: flask, label: "Reaction" }
  - { icon: sliders, label: "Masses" }
  - { icon: percent, label: "Bars" }
  - { icon: check, label: "Quiz" }
---

## What it does

Two numbers tell you how good a chemical process is. The **percentage yield** compares the mass of product you really collected with the most the equation says you could make. The **atom economy** is about the equation itself: what fraction of the mass of all the reactants ends up in the product you want, rather than in waste products. A process can have a high atom economy and still a low yield, and the other way round.

Pick a reaction, set the grams of the first reactant and the grams of product obtained, and the page shows the theoretical yield and both percentages as bars. At the upper level it also lists every step of the calculation. To find which reactant runs out first, use [[limiting-reagent]]; for converting grams to moles use [[mole-bridge]] and [[molar-mass-calculator]].

## How to use it

1. Choose a reaction.
2. Set the mass of the first reactant. The other reactants are assumed to be in excess.
3. Set the actual mass of product you got.
4. Read the theoretical yield, percentage yield and atom economy, and look at the two bars.
5. Read why yields are less than 100% and answer the quiz.

## What each setting does

- **Mass of reactant:** the amount you start with; it sets the theoretical yield.
- **Actual mass obtained:** what you collected. The slider goes slightly above the theoretical yield so you can see why more than 100% means the product is wet or impure.
- **Atom economy bar:** depends only on the equation, not on your masses.

## Worked example

Heat 100 g of calcium carbonate: CaCO₃ → CaO + CO₂. Moles of CaCO₃ = 100 ÷ 100.09 = 0.999 mol, so the theoretical yield of CaO is 0.999 × 56.08 = 56.0 g. If you collect 42 g, the percentage yield is 42 ÷ 56.0 × 100 = 75 %. The atom economy is 56.08 ÷ 100.09 × 100 = 56.0 %, because the carbon dioxide is waste.

## FAQs

**Can the percentage yield be over 100%?** Not for a correct measurement. If it is, the product still holds water or contains impurities.

**Why is the Haber process atom economy 100%?** N₂ + 3H₂ → 2NH₃ has only one product, so every atom ends up in ammonia. The yield per pass is still low because the reaction is reversible.

**Which matters more?** Industry cares about both: yield for the cost of materials, atom economy for waste and sustainability.
