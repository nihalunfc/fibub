---
name: Fume hood and lab ventilation calculator
num: 516
shelf: science
section: green-chemistry-and-safety
title: "Fume hood face velocity and lab ventilation calculator: traverse average and uniformity, hood exhaust flow, air changes per hour, purge time, steady state, ppm to mg/m³"
summary: "Average a face velocity traverse and flag readings outside the band and ± % you type in, work out the hood's exhaust flow from the sash opening, a room's air changes per hour, how long dilution ventilation takes to bring a vapour down (with a mixing factor K), the steady level from an evaporating liquid, and convert ppm to mg/m³. For study and planning; no limits built in."
status: live
ads: true
order: 516
icon: flask
works: offline
updated: 2026-11-09
related: [exposure-twa, hvac-room-load, greenhouse-heating, gas-law-calculator, vapour-pressure-calculator, green-chemistry-metrics, air-quality-calculator]
sources:
  - "Face velocity statistics (mean, sample standard deviation, per cent deviation from the mean), flow = area × velocity, air changes per hour, and the well-mixed room model V dC/dt = G − (Q/K) C with its solution and purge time t = (K V/Q) ln(C₀/C): standard industrial ventilation and industrial hygiene formulas, as set out in textbooks such as the ACGIH Industrial Ventilation manual and AIHA's Mathematical Models for Estimating Occupational Exposure to Chemicals (methods only)."
  - "Molar volume from the ideal gas law with the exact SI gas constant (8.314462618 J/(mol K)); ppm to mg/m³ = ppm × M ÷ molar volume. Molar masses from fibub's periodic table (IUPAC standard atomic weights)."
  - "No face velocity limits, uniformity rules, air change rates or exposure limits from any agency or standard are included; the user types any target. The example hood, readings, room, flows, mixing factor and spill are made up; the acetone density is a rounded general figure."
  - "Checked against an independent NumPy calculation of the traverse and SciPy solve_ivp integration of the room model (including the time to reach a target, by event detection), and scipy.constants for the molar volume."
flow:
  - { icon: table, label: "Traverse" }
  - { icon: calculator, label: "Hood flow" }
  - { icon: clock, label: "Purge" }
  - { icon: chart, label: "Levels" }
---

## What it does

**For study and planning; hood certification needs a qualified tester and the relevant standard.** This page does the everyday sums behind lab ventilation, in six parts that feed each other:

1. **Face velocity traverse.** Paste the anemometer readings taken across the sash opening as a grid. You get the mean, the lowest and highest readings and where they are, the standard deviation and coefficient of variation, and each reading's difference from the mean. If you type a **target band** for the mean and a **± % uniformity** figure (from your own standard, local rules or the hood maker), the page says whether the mean is inside the band and marks each reading outside the band or the ± %. Nothing is built in: leave them empty and you just get the statistics.
2. **Hood exhaust flow.** Flow = opening width × sash height × mean face velocity, in m³/s, m³/h, L/s and cfm. A table shows what happens at other sash heights: a **constant-volume** hood keeps its flow, so the face velocity rises as the sash comes down; a **variable-volume** hood keeps the face velocity, so its flow follows the opening.
3. **Room air changes.** Air changes per hour = room exhaust flow × 3600 ÷ room volume. With a **mixing factor K** you also get the effective air changes, the time constant τ = K V ÷ Q and how long it takes to clear 90, 99 and 99.9 % of a vapour once its source stops.
4. **Substance and ppm ↔ mg/m³.** Type a formula or a molar mass. The molar volume comes from the ideal gas law at your air temperature and pressure, and mg/m³ = ppm × M ÷ molar volume.
5. **Steady state from a constant source.** For a liquid evaporating (or any steady release) at a known rate, the room settles where everything released leaves with the exhaust: C = rate × K ÷ flow, in mg/m³ and ppm.
6. **Purge or build-up.** C(t) = Css + (C₀ − Css) e^(−t Q ÷ (K V)). It gives the time to go from a starting level to a target, with the source stopped or still running, and plots the curve.

## How to use it

1. Measure the face velocity at the centre of equal areas of the opening, with the sash at its working height, and paste the grid (top row first). Choose m/s or ft/min.
2. If you have a target band or a uniformity rule, type it in; otherwise leave the boxes empty.
3. Enter the opening width, the working sash height and, if you want the table to go to the top, the full-open height.
4. Enter the room size, the total flow of air leaving the room and K. **Use the hood flow** copies the hood's flow from part 2 if the hood is the only exhaust.
5. Enter the substance, then the release rate, then the starting and target levels.
6. Download the readings or the curve as CSV, or the whole report as an image, PDF or Word file.

## Worked example

The example is made up: a hood 1.5 m wide with the sash at 0.45 m, read at 15 points in a 3 × 5 grid. The mean face velocity is **0.5087 m/s (100 ft/min)**, from 0.42 to 0.57 m/s, so the readings run from **−17.4 % to +12.1 %** of the mean (coefficient of variation 8.34 %). With a band of 0.45 to 0.6 m/s typed in, the mean is inside it but 2 readings are below it; with ± 15 % typed in, 1 reading (0.42, bottom right) is outside.

The hood exhausts **1236 m³/h (727.5 cfm)**. If it is constant-volume and the sash is raised to the full 0.75 m, the face velocity falls to 0.3052 m/s; a variable-volume hood would need 2060 m³/h to hold 0.5087 m/s there.

The room is 8 × 6 × 3 m (144 m³) with 1600 m³/h of exhaust: **11.1 air changes per hour**. With K = 3 the time constant is 16.2 min, and clearing 99 % of a vapour takes 74.6 min.

For acetone (C₃H₆O, 58.08 g/mol) at 25 °C and 101.325 kPa, the molar volume is 24.465 L/mol, so 500 ppm = **1187 mg/m³**. If 2 mL/min of acetone (density 0.79 g/mL) keeps evaporating, the room settles at **177.8 mg/m³ = 74.87 ppm**. Once the source is stopped, bringing the room from 500 to 25 ppm takes **48.5 min**.

## Good to know

- The model assumes clean supply air and a room that behaves as one mixed volume. K is a judgement: it is not a measured property. Real rooms have plumes near the source that are much higher than the room average.
- Face velocity alone does not prove a hood contains vapour: cross-draughts, people walking past and clutter inside the hood all matter. Smoke tests and containment tests are part of proper testing.
- Evaporation rates depend on the liquid, the area of the pool, the temperature and the air speed over it. Use a measured or estimated rate; this page does not predict it.

## FAQ

**Which face velocity should my hood have?** That depends on your country, your organisation and the hood. This page deliberately includes no limits; type the band you were given.

**Why does the purge say "never"?** With the source still running the level can only approach its steady state, so a target below it (when falling) or above it (when rising) is never reached.

**Is my data sent anywhere?** No. Everything is worked out on this page and nothing leaves your device.
