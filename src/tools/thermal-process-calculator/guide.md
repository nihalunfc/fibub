---
name: Thermal processing F-value calculator
num: 393
shelf: science
section: food-science
title: "Thermal processing calculator: D-value, z-value, F needed and F0 from a time-temperature profile (general method)"
summary: "Fit a D-value to survivor counts and a z-value to D-values at several temperatures, work out the F needed for a log reduction, and add up lethal rates over a pasted time-temperature profile to get F0 or any F by the general method. For study. Nothing is uploaded."
status: live
ads: false
order: 393
icon: chart
works: offline
updated: 2026-11-09
related: [shelf-life-estimator, decay-calculator, reaction-kinetics-fitter, recipe-nutrition-calculator]
sources:
  - "General first-order microbial inactivation formulas: D from the slope of log10 N against time, z from the slope of log10 D against temperature, F = D·(log10 N0 − log10 N), lethal rate L = 10^((T − Tref)/z), and the general method (trapezoid rule). The reference of 121.1 °C and z = 10 °C for F0 is a general textbook convention."
  - "Checked against numpy.polyfit (D, z and R²) and numpy.trapezoid / scipy cumulative_trapezoid (F0, F with other Tref and z, and F partway through) on the example data."
  - "The survivor counts, D-values and heating profile in the example are made up for this tool, not from any study or organism."
flow:
  - { icon: table, label: "Counts" }
  - { icon: chart, label: "D and z" }
  - { icon: curve, label: "Profile" }
  - { icon: sigma, label: "F value" }
---

## What it does

Heat kills microbes at a steady rate on a log scale: each minute at a fixed temperature removes the same fraction. This calculator does the standard sums of thermal process calculation, for coursework and for checking hand calculations:

- **D-value**: the time for a tenfold (90 %) drop in survivors at one temperature. Paste heating times and survivor counts; the page fits a straight line to log₁₀(count) against time and shows it on a log chart.
- **z-value**: the rise in temperature that makes D ten times shorter. Paste D-values measured at several temperatures; you also get D at the reference temperature.
- **F needed**: the minutes at the reference temperature needed to go from a starting count N₀ to a target N: F = D × (log₁₀ N₀ − log₁₀ N).
- **F from a profile (general method)**: paste a time-temperature record from the slowest-heating point of the product. Each reading becomes a lethal rate, L = 10^((T − Tref)/z), and the page adds them up over time with the trapezoid rule. With Tref 121.1 °C and z 10 °C the result is F₀.

## How to use it

1. Set the reference temperature and z at the top. They apply to the profile and to D at Tref.
2. Paste data in any of the boxes, two numbers per line, from a spreadsheet or a CSV, TXT or Excel file. A header row is fine.
3. **Use this z and D** copies the fitted z and the D at Tref into the boxes below, so the profile and the F needed use them.
4. Download the profile with its lethal rates as CSV, or the report as an image, PDF or Word file.

## Worked example

Press **Use the example** (all values made up). The survivor counts fall from 1,000,000 to 2,000 per gram over 8 minutes: **D = 2.96 min** (R² 0.9999). The D-values of 20, 6.5, 2 and 0.62 minutes at 110 to 125 °C give **z = 9.92 °C**, and D at 121.1 °C of 1.55 min.

With D = 1.546 min, going from 1000 to 1e-9 per unit is 12 log reductions, so **F = 18.6 min**. The pasted heating curve peaks at 121.5 °C after 35 minutes and gives **F = 27.4 min** at 121.1 °C (z 10 °C), about 17.7 log reductions at that D.

## Tips

- Take temperatures often (every minute or less) where the product is hot; the trapezoid rule is only as good as the spacing.
- Survivor curves with a shoulder or a tail do not follow one straight line; fit only the straight part.
- F adds up lethality from heating and cooling, so record the whole cycle.

## FAQ

**Can I use this to set a canning process?** No. It is for study, not a substitute for a process authority. Commercial heat processes must be designed and validated by a qualified process authority and follow the rules where the food is sold.

**Why 121.1 °C?** It is 250 °F, the traditional reference for sterilising low-acid food.

**Is my data uploaded?** No. Everything runs in your browser and works offline.
