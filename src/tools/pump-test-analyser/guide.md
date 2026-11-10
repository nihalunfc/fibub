---
name: Pump test analyser
num: 126
shelf: science
code: T126
section: hydrogeology
title: "Aquifer pump test analysis: Theis curve fit, Cooper-Jacob, recovery and distance-drawdown (transmissivity and storativity)"
summary: "Paste or open time–drawdown readings from a pumping test. Get transmissivity T and storativity S from a Theis curve fit and the Cooper-Jacob straight line (with a check that it applies), T from recovery data, and T and S from several observation wells. Log plots, PNG, PDF and Word downloads."
status: live
ads: true
order: 2
icon: chart
works: offline
updated: 2026-11-08
related: [piper-diagram, mixing-model-calculator, uncertainty-calculator, plot-maker]
sources:
  - "Theis (1935) well function and solution, the Cooper-Jacob (1946) straight-line approximation and Theis recovery: standard hydrogeology methods, written by fibub from the equations."
  - "W(u) is computed from its definition as the exponential integral (series and continued fraction), not from printed tables."
  - "Example data are made up by fibub for illustration."
flow:
  - { icon: table, label: "Readings" }
  - { icon: curve, label: "Theis fit" }
  - { icon: ruler, label: "Jacob line" }
  - { icon: check, label: "T and S" }
---

## What it does

In a **pumping test** a well is pumped at a steady rate while the water level is measured in the well or in a nearby observation well. How fast and how far the level falls (the **drawdown**) tells you two things about the aquifer:

- **Transmissivity T**: how easily water flows through the whole thickness of the aquifer, in m²/day.
- **Storativity S**: how much water the aquifer releases when the head drops. In a confined aquifer it is tiny, often 10⁻⁵ to 10⁻³.

This tool works these out three ways, so you can compare them.

For a quick test in a single well, use the [[slug-test-analyser]]; to add up drawdown from several wells, the [[well-field-drawdown]] tool.

## How to use it

1. Enter the **pumping rate** and choose its unit, the length unit (metres or feet) and the time unit of your readings.
2. Enter the observation well's **distance** from the pumped well and paste or open two columns: **time since pumping started** and **drawdown**. Thousands of logger readings are fine.
3. Optional: paste **recovery** readings (time since the pump stopped, and residual drawdown) with how long the pump ran.
4. Optional: paste **distance-drawdown** readings from several observation wells, all taken at the same time.
5. Optional: enter the aquifer thickness to get the hydraulic conductivity K = T ÷ thickness.

## The methods

- **Theis fit.** The Theis solution gives drawdown s = Q ÷ (4πT) × W(u), with u = r²S ÷ (4Tt). The tool finds the T and S that best match all readings on log scales, which is what matching the type curve by eye does. It gives a 95 % range for each.
- **Cooper-Jacob.** Once u is small, drawdown rises by the same amount in every log cycle of time. T = 2.303Q ÷ (4π × that rise) and S = 2.25Tt₀ ÷ r², where t₀ is where the line meets zero drawdown. The tool keeps only the readings with u ≤ 0.05 and tells you which it used.
- **Recovery.** After the pump stops, residual drawdown plotted against log(t/t′) gives a line whose slope gives T. Storativity cannot be found this way.
- **Distance-drawdown.** At one moment, drawdown falls by the same amount in each log cycle of distance. T = 2.303Q ÷ (2π × that fall), and the distance where the line reaches zero gives S.

## Worked example

All data are made up. A well pumps 500 m³/day and an observation well 30 m away is read for 1000 minutes. The Theis fit gives **T = 250 m²/day and S = 2.0 × 10⁻⁴**. The Cooper-Jacob line through the late readings gives T = 252 m²/day. The recovery readings give T = 253 m²/day, and four wells read at 1000 minutes give T = 251 m²/day. When the methods agree like this, you can trust the result more.

## Good to know

- These methods assume a **confined** aquifer that is the same everywhere, has no edges, and does not leak. Real tests often show leakage, boundaries or delayed yield, and the late readings then bend away from the Theis curve. That is a finding in itself.
- Early readings in the pumped well itself are affected by the water stored in the casing. Use an observation well where you can.
- For unconfined aquifers with small drawdown, the same methods give a rough answer.

## FAQ

**Why log scales?** The Theis curve is a fixed shape on log-log axes, and Cooper-Jacob lines are straight on semi-log axes, so both are easiest to judge that way.

**What if the Theis fit and Cooper-Jacob disagree?** Usually there are too few late readings for the straight line, or the aquifer departs from the ideal. Look at the plots.
