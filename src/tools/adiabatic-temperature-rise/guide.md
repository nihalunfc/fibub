---
name: Heat of reaction and adiabatic temperature rise
num: 666
shelf: science
section: chemical-engineering
title: "Adiabatic temperature rise calculator: heat of reaction, Kirchhoff's law and adiabatic flame temperature"
summary: "Type the species of a reaction with their heats of formation and heat capacities, the feed and the conversion, and get the heat of reaction at any temperature (Kirchhoff), the adiabatic outlet or flame temperature (with excess reactants and diluents), a quick ΔT estimate, the energy released per kg, and charts against conversion and temperature."
status: live
ads: true
order: 666
icon: flask
works: offline
updated: 2026-11-09
related: [thermochemistry-calculator, gas-law-calculator, uncertainty-calculator]
sources:
  - "Hess's law, Kirchhoff's law with a polynomial heat capacity, and the adiabatic energy balance of a reactor: standard chemical engineering thermodynamics, for example Smith, Van Ness and Abbott, Introduction to Chemical Engineering Thermodynamics, and Felder and Rousseau, Elementary Principles of Chemical Processes (equations only)."
  - "Example: standard heats of formation rounded to one decimal (general chemistry values); the heat-capacity lines are rough, made-up straight-line fits for illustration, not taken from any table."
  - "Checked against an independent SciPy calculation that integrates cp numerically (quad), follows a different reaction path (react at the feed temperature) and solves for the outlet temperature with brentq."
flow:
  - { icon: table, label: "Species" }
  - { icon: sigma, label: "ΔrH" }
  - { icon: calculator, label: "Balance" }
  - { icon: chart, label: "T out" }
---

## What it does

When a reaction gives out heat and nothing carries it away, everything leaving the reactor or flame gets hotter. This calculator does the energy balance:

- **Heat of reaction** at 298.15 K from Hess's law: ΔrH° = Σ ν ΔfH°.
- **Kirchhoff's law** for other temperatures: ΔrH(T) = ΔrH° + ∫ Δcp dT, with each species' heat capacity cp = a + bT + cT² + dT³ (or a constant).
- The **adiabatic outlet temperature** for a feed at any temperature and any **conversion** of the key reactant. Excess reactants and inerts (nitrogen, a solvent, steam) take up heat too. The tool cools the feed to 298.15 K, lets the reaction happen there, and heats the outlet mixture until the energy balances. It finds that temperature by bisection and Newton steps. At full conversion of a fuel this is the **adiabatic flame temperature** (without dissociation).
- A **quick estimate** ΔT = −ΔrH ξ / Σ n cp of the feed, the form used in reactor safety screening.
- **Heat released** per kg of feed and per kg of the key reactant, and the outlet composition.

## How to use it

1. Type one species per line: **name, ν, feed moles, ΔfH° (kJ/mol), molar mass (g/mol), cp a, b, c, d**. ν is negative for reactants, positive for products and 0 for inerts. Leave out b, c and d for a constant cp. You can also open a CSV or Excel file.
2. Give the **feed temperature**, the **conversion** and, if you like, which reactant is the key (by default the limiting one).
3. Read the outlet temperature, the heats of reaction, and the charts of outlet temperature against conversion and ΔrH against temperature. Download the sweep, the outlet or the report.

## Worked example

Methane burning in 10 % excess air (2.2 mol O₂ and 8.28 mol N₂ per mol CH₄), with rounded ΔfH° and made-up straight-line cp fits, feed at 25 °C and 100 % conversion. The page gives ΔrH° = **−802.5 kJ/mol**, −805.49 kJ/mol at 1,000 °C, and an **adiabatic outlet of 1,937 °C** (a rise of 1,912 K). That is 2,521 kJ per kg of feed and 50,031 kJ per kg of methane. The quick constant-cp estimate says 2,335 K, too high because heat capacities grow with temperature. At 50 % conversion the outlet is 1,053 °C. Adding nitrogen to 20 mol cools the full-conversion outlet to 1,359 K: that is how diluents tame a reaction.

## FAQ

**Why is a real flame cooler?** Above about 2,000 K, CO₂ and H₂O partly split into CO, H₂, O and OH, which absorbs heat. Equilibrium codes include this; this tool does not. Heat loss to walls lowers it further.

**What about liquids that boil?** Each species keeps one phase. For a liquid feed that boils, add the heat of vaporisation to its ΔfH° (use the gas-phase value) or split the problem in two.

**Is this a safety assessment?** No. It is for study and planning, not a substitute for professional process safety assessment and calorimetry.
