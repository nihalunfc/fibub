---
name: Respirometry calculator
num: 342
shelf: science
section: physiology
title: "Respirometry calculator: VO2, VCO2, RQ and metabolic rate from flow-through or closed-chamber readings"
summary: "Work out oxygen uptake (V̇O₂), CO₂ output (V̇CO₂), the respiratory quotient and metabolic rate in watts and kJ per day from flow-through gas readings (with the Haldane transformation) or from the fall of O₂ in a closed chamber of air or water. For study and teaching, not for clinical use."
status: live
ads: true
order: 342
icon: flask
works: offline
updated: 2026-11-09
related: [gas-law-calculator, psychrometric-calculator, uncertainty-calculator, plot-maker, allometry-calculator, fick-cardiac-output, vo2max-estimator]
sources:
  - "Flow-through equations: J. R. B. Lighton, Measuring Metabolic Rates: A Manual for Scientists (Oxford University Press, 2008), chapters 8 to 10 (nitrogen balance, eq. 10.2 for scrubbed CO₂). Written from the mass balances; no tables copied."
  - "Energy: J. B. de V. Weir (1949), J. Physiol. 109: 1-9, kcal = 3.941 V̇O₂ + 1.106 V̇CO₂; oxycalorific equivalent 16 + 5.164 RQ J/mL O₂ from Lighton et al. (1987) as given in Lighton (2008)."
  - "Water vapour pressure: A. L. Buck (1981, revised 1996) equation. Molar volume of an ideal gas at STPD 22.414 L/mol (CODATA)."
  - "Checked in the tests against an independent NumPy solution of the N₂, O₂ and CO₂ mass balances and SciPy linregress for the closed-chamber slope. The example readings are made up."
flow:
  - { icon: flask, label: "Chamber" }
  - { icon: table, label: "Gas readings" }
  - { icon: calculator, label: "VO2, RQ" }
  - { icon: chart, label: "Watts" }
---

## What it does

Respirometry measures how fast an animal (or a plant, a soil core or a person on a bike) uses oxygen and makes carbon dioxide. From that you get its **metabolic rate**: the energy it turns over, in watts or kilojoules per day. This calculator handles the two common set-ups:

- **Flow-through (open) respirometry.** Air is pumped through the chamber at a known flow. Analysers measure O₂ and CO₂ in the air going in (incurrent) and coming out (excurrent). The difference, times the flow, is the gas exchange.
- **Closed-chamber respirometry.** The animal sits in a sealed chamber and you record the O₂ falling over time, in air (as a percentage) or in water (dissolved O₂ in mg/L). The slope of that fall times the volume of air or water is the O₂ uptake.

For study and teaching, not for clinical use.

## How to use it

1. **Pick the set-up** with the buttons at the top.
2. **Flow-through:** type the flow rate and say where it is measured (before or after the chamber). If your flow meter reads volume at room conditions, choose "At the temperature and pressure below" and it is corrected to STPD (0 °C, 101.325 kPa, dry). Type the four gas readings as percentages. "O₂ only" is for set-ups that scrub CO₂ (and water) out before the O₂ analyser.
3. **Closed chamber:** paste time (minutes) and O₂ readings, or open a CSV or Excel file. Give the chamber volume and the animal's volume (the gas or water left is the difference). A **blank** slope from a run with no animal (microbes, leaks, sensor drift) is subtracted. In air, say whether the air is saturated with water vapour; the dry gas volume is then corrected to STPD.
4. **Energy:** choose how oxygen is turned into joules. **Lighton** uses 16 + 5.164 × RQ joules per mL of O₂. **Weir** uses both O₂ and CO₂: 3.941 kcal per litre of O₂ plus 1.106 per litre of CO₂. **Fixed** lets you type a value such as 20.1 J/mL. When CO₂ is not measured you set an **assumed RQ**.
5. **Body mass** (optional) gives mass-specific rates.

## Why the Haldane transformation matters

When an animal takes up more O₂ than it gives off CO₂ (RQ below 1), the air leaving the chamber is slightly less than the air going in. Only one flow is measured, so the other comes from nitrogen, which the animal neither uses nor makes: incurrent flow × N₂ fraction in = excurrent flow × N₂ fraction out. Ignoring this can bias V̇O₂ by several percent.

## Worked example

The made-up flow-through example: 500 mL/min at STPD measured before the chamber, incurrent air 20.94 % O₂ and 0.04 % CO₂, excurrent 20.36 % O₂ and 0.50 % CO₂, a 30 g animal.

- **V̇O₂ = 3.054 mL/min** (183.3 mL/h). V̇CO₂ = 2.296 mL/min. **RQ = 0.752.**
- Excurrent flow is 499.24 mL/min (the Haldane correction).
- With the Lighton equivalent, **1.012 W, or 87.45 kJ/day**. Weir gives 1.016 W.
- Per gram: 6.109 mL O₂/(g·h).

The closed air example (960 mL of saturated air at 20 °C and 101.3 kPa, O₂ falling 0.0367 % per minute) gives V̇O₂ = 0.3208 mL/min.

## Tips

- Zero and span the analysers against outside air before each run, and take a baseline of incurrent air.
- Scrub water before the analysers, or the dilution by water vapour lowers the O₂ reading.
- In closed chambers keep the run short so O₂ stays above about 19 % (or 70 % air saturation in water), or the animal starts to change its breathing.

## FAQ

**Which energy equation should I use?** If you measure CO₂, Weir and Lighton agree within about 1 %. Without CO₂, an assumed RQ of 0.8 is usually within ±3 %.

**Does any data leave my device?** No. Everything is worked out in your browser.
