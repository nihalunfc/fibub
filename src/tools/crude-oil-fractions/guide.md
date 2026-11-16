---
name: Crude oil fractions
num: 2271
shelf: learn
code: L347
section: school-chemistry
title: "Crude oil fractions: fractional distillation and cracking"
summary: "See how a fractionating column splits crude oil into refinery gases, petrol, kerosene, diesel, fuel oil and bitumen, how chain length changes boiling point and thickness, and how cracking turns long alkanes into shorter ones."
status: live
ads: false
order: 2271
icon: flask
works: offline
updated: 2026-11-16
related: [carbon-chain-namer, molecule-viewer, equation-balancer]
sources:
  - "Boiling points are standard values for the straight-chain alkanes C1 to C20 (CRC Handbook of Chemistry and Physics, rounded). Carbon ranges for the fractions are teaching ranges; real refineries overlap them. Viscosity and flammability bars are trend scales, not measurements. Serves GCSE chemistry C7 (organic chemistry), Ontario SCH4U organic chemistry and NGSS HS-PS1-2. Maths in src/lib/learn/curr-chem.ts, checked in tests/curr-chem.mjs. Drawings are fibub's own."
flow:
  - { icon: flask, label: "Column" }
  - { icon: sliders, label: "Chain" }
  - { icon: scissors, label: "Crack" }
  - { icon: check, label: "Quiz" }
---

## What it does

Crude oil is a mixture of hydrocarbons, mostly alkanes, with chains of very different lengths. In a refinery the oil is heated until it turns to vapour, which rises up a tall column that is hot at the bottom and cooler towards the top. Each hydrocarbon turns back into liquid at the height where the temperature drops below its boiling point, so the mixture splits into fractions. Short chains reach the top; long chains stay near the bottom.

Tap or hover over a fraction to see its carbon range, boiling range, uses and properties. The chain-length slider shows how boiling point, thickness (viscosity) and ease of ignition change from methane to icosane. The cracking card breaks a long alkane into a shorter alkane and an alkene, and checks that the atoms balance. To name and draw the chains, use [[carbon-chain-namer]] and [[molecule-viewer]], and [[equation-balancer]] for other equations.

## How to use it

1. Tap a fraction on the column to read about it.
2. Move the chain-length slider and watch the dot move along the boiling point chart.
3. In the cracking card, choose the alkane to crack and the size of the alkane produced.
4. Read the balanced equation and the atom count below the picture.
5. Answer the quiz questions, which change each time.

## What each setting does

- **Chain length:** the number of carbon atoms in a straight-chain alkane, CₙH₂ₙ₊₂.
- **Alkane to crack:** the long molecule that gets split.
- **Shorter alkane made:** how many carbons stay in the alkane; the rest become the alkene.
- **Level:** the upper level adds the conditions for thermal and catalytic cracking.

## Worked example

Crack decane, C₁₀H₂₂, to make octane, C₈H₁₈. Carbon atoms: 10 − 8 = 2 are left for the alkene. Hydrogen atoms: 22 − 18 = 4. So the alkene is C₂H₄, ethene, and the equation is C₁₀H₂₂ → C₈H₁₈ + C₂H₄. Octane (boiling point 126 °C) is a petrol-sized molecule, while decane (174 °C) is borderline between petrol and kerosene.

## FAQs

**Why are long chains cracked?** There is more demand for short chains such as petrol than the oil supplies, and alkenes from cracking are used to make polymers.

**Why does boiling point rise with chain length?** Longer molecules have more contact with their neighbours, so the forces between molecules are stronger and more energy is needed to separate them.

**Is the column temperature the same everywhere?** No. It is about 400 °C at the bottom and below 100 °C at the top. The values here are typical; real refineries vary.
