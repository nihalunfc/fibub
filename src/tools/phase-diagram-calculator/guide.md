---
name: Phase diagram
num: 108
shelf: science
code: T108
section: physical-chemistry
title: "Phase diagram"
summary: "Draw the phase diagram of a two-component mixture from the melting points and enthalpies of fusion (complete solid solution like Cu–Ni, or a simple eutectic like Bi–Cd), find the phases, their compositions and amounts at any temperature, and use the lever rule on compositions read off any real diagram, in wt % or mol %."
status: live
ads: true
order: 9
icon: chart
works: offline
updated: 2026-11-08
related: [colligative-properties, thermochemistry-calculator, glass-transition-calculator, dsc-tga-analyser]
sources:
  - "Melting points, enthalpies of fusion and molar masses: CRC Handbook values, which you can type over."
  - "Model: the ideal-solution (van Laar and Schröder–van Laar) equations."
flow:
  - { icon: flask, label: "Components" }
  - { icon: chart, label: "Diagram" }
  - { icon: ruler, label: "Tie line" }
  - { icon: sigma, label: "Lever rule" }
---

## What it does

A binary phase diagram shows which phases are present in a mixture of two substances at each temperature and composition. Between the liquidus and the solidus a mixture is part liquid and part solid. A horizontal tie line at your temperature meets the boundaries at the compositions of the two phases, and the lever rule says how much of each there is:

fraction of phase 2 = (C₀ − C₁) / (C₂ − C₁)

where C₀ is the overall composition and C₁ and C₂ are the ends of the tie line.

The first card calculates the whole diagram from four numbers, the melting point and enthalpy of fusion of each component, assuming the components mix ideally. Two shapes are covered:

- **Complete solid solution (a lens)**, where the solids mix in any ratio, as in copper–nickel and germanium–silicon. The van Laar equations give the liquid and solid compositions at each temperature.
- **Simple eutectic**, where the solids do not mix at all, as in benzene–naphthalene or bismuth–cadmium. The Schröder–van Laar equation gives each liquidus curve, and they cross at the eutectic point.

For your mixture and temperature it gives the phases present, their compositions in both wt % and mol %, their amounts, the liquidus and solidus temperatures, and (for a lens) the composition of the first solid to form. The diagram is drawn with the tie line and your point.

The second card is a plain lever rule calculator for any diagram, including real ones with intermediate phases, where you read the tie line ends yourself.

For the vapour-liquid side, use the [[vapour-pressure-calculator]]; to read melting and crystallisation from a scan, the [[dsc-tga-analyser]].

## How to use it

1. Pick a system, or choose "Your own components" and type the melting points (°C), enthalpies of fusion (kJ/mol) and molar masses.
2. Choose whether your composition is in wt % or mol % of B. Switching keeps the same mixture and converts the number.
3. Type the overall amount of B and the temperature.
4. For a real diagram, use the lever rule card with the three compositions in the same units. Add a total mass to get the mass of each phase.

## Worked examples

**Copper–nickel.** For 35 wt % Ni at 1225 °C the ideal model gives a liquid of 31.9 wt % Ni and a solid solution of 38.7 wt % Ni, so the alloy is **55 % liquid and 45 % solid** by mass. The liquidus is at 1237 °C and the solidus at 1211 °C. The measured diagram lies a few tens of degrees higher, because copper and nickel do not mix quite ideally.

**Textbook lever rule.** On the measured Cu–Ni diagram at 1250 °C, the same alloy has a liquid of 31.5 wt % Ni and an α solid of 42.5 wt % Ni. The lever rule card gives **68.2 % liquid and 31.8 % α**.

**Bismuth–cadmium.** The ideal eutectic is at 135.3 °C and 41.1 wt % Cd, close to the measured 144 °C and 40 %. An alloy with 20 wt % Cd at 180 °C is 23 % solid bismuth and 77 % liquid holding 26.0 wt % Cd.

**Benzene–naphthalene** is a near-ideal pair: the calculated eutectic at −3.6 °C matches experiment.

## Questions

**Why does my real system not match?** Real liquids and solids are rarely ideal, many systems have partial solid solubility, and some form compounds. The calculated diagram shows the shape and the trends; take real numbers from a measured diagram.

**Are the fractions by mass or by moles?** By mass when you work in wt %, by moles in mol %.

**What is coring?** In a lens system the first solid is richer in the higher-melting component. With fast cooling the centre of each grain keeps that composition, and only slow cooling or annealing evens it out.

**Is anything sent anywhere?** No. Everything is calculated in your browser, and the page works offline once loaded.
