---
name: Equation balancer
num: 79
shelf: science
section: general-and-lab-chemistry
title: "Chemical equation balancer with stoichiometry, limiting reagent and percent yield"
summary: "Balance any chemical equation, including ionic and redox ones, check the atoms on both sides, then find the limiting reagent, the theoretical yield, what is left over and your percent yield."
status: live
ads: true
order: 6
icon: flask
works: offline
updated: 2026-11-08
related: [molar-mass-calculator, solution-calculator, isotope-pattern-calculator, uncertainty-calculator]
flow:
  - { icon: pencil, label: "Reaction" }
  - { icon: check, label: "Balance" }
  - { icon: calculator, label: "Yield" }
---

## What it does

A balanced equation says how many molecules of each substance react, and atoms are never created or destroyed. This tool finds the coefficients, then does the stoichiometry that follows from them.

- **Balancing** gives the smallest whole numbers that conserve every element, and the electric charge for ionic equations. It is exact: the tool solves the conservation equations with fractions, not trial and error, so even long redox equations come out right.
- **Atom check** lists each element (and the charge) on both sides, with a tick when they match.
- **Amounts** take the mass or moles of each reactant you start with. The tool finds the **limiting reagent** (the one that runs out first), how much of every substance reacts or forms, and what is **left over**.
- **Percent yield** compares the mass you actually collected with the most you could have made.

## How to use it

1. Type the reaction with + between substances and an arrow (->, = or →) between the sides, such as `Fe + O2 -> Fe2O3`. Capitals matter (Co is cobalt, CO is carbon monoxide), brackets nest, and ions take a caret: `Fe^2+`, `MnO4^-`. Coefficients and state symbols you type, such as 2 or (aq), are ignored.
2. Read the balanced equation and the atom check.
3. Type the amount of each reactant, in grams or moles. Leave a box empty for one in excess, such as oxygen in a burning flame.
4. Pick the product you collected and type its mass for the percent yield.

## Worked example

Propane burns in oxygen: C3H8 + O2 → CO2 + H2O. Carbon forces 3 CO2, hydrogen forces 4 H2O, and then the right side has 10 oxygen atoms, so 5 O2:

C₃H₈ + 5O₂ → 3CO₂ + 4H₂O.

Burning 10 g of propane (44.097 g/mol, so 0.2268 mol) in plenty of air uses 5 × 0.2268 = 1.134 mol of oxygen (36.28 g) and makes 3 × 0.2268 = 0.680 mol of carbon dioxide, which is 29.94 g, and 16.34 g of water. If you start with only 20 g of oxygen instead, oxygen is limiting: just 5.51 g of propane burns and 16.50 g of CO₂ forms.

For an ionic redox reaction, permanganate oxidising iron(II) in acid balances to MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O, with a charge of +17 on both sides.

## Questions

**It says the reaction can be balanced in more than one way.** That happens when the list holds two separate reactions, such as hydrogen burning to both water and hydrogen peroxide. Any mix of the two balances, so the tool shows the one with the smallest numbers and says so. The real proportions depend on the conditions.

**It says an element appears on only one side.** A product is missing or a formula is mistyped. Water, carbon dioxide and hydrogen ions are the usual missing ones.

**Why is my percent yield over 100 %?** The product is probably still wet or impure. Dry it to constant mass and weigh again.

**Which atomic weights are used?** The IUPAC standard atomic weights, the same as the molar mass calculator. Nothing is sent anywhere: it all runs in your browser.
