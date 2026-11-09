---
name: Plant growth analysis
num: 324
shelf: science
section: botany-and-plant-science
title: "Plant growth analysis calculator: RGR, NAR (ULR), LAR, SLA and LWR between harvests"
summary: "Paste dry mass and leaf area for plants from two or more harvests and get the classical growth analysis: relative growth rate with its standard error and confidence interval, unit leaf rate (net assimilation rate), leaf area ratio, specific leaf area and leaf weight ratio, using Hunt's formulas for means between harvests."
status: live
ads: true
order: 324
icon: curve
works: offline
updated: 2026-11-09
related: [tree-carbon, et0-calculator, trend-analyser, sample-size, plot-maker, photosynthesis-curve-fitter, leaf-area-analyser, growth-curve-tracker, yield-trial-anova]
sources:
  - "Formulas: R. Hunt, Plant Growth Curves: the Functional Approach to Plant Growth Analysis (Edward Arnold, 1982), and R. Hunt et al., A modern tool for classical plant growth analysis, Annals of Botany 90, 485-488 (2002). RGR with error from the mean of ln W: H. Hoffmann and H. Poorter, Annals of Botany 90, 37-42 (2002). Formulas only; no data are copied."
  - "Checked in the tests against an independent Python script (NumPy and SciPy): the example's RGR, standard error, confidence interval (scipy.stats t), ULR, LAR, SLA and LWR, and the mean ULR formula against the exact mean found by numerical integration (scipy.integrate.quad) for steady growth with leaf area linear in mass."
  - "The example plants are made up."
flow:
  - { icon: table, label: "Harvests" }
  - { icon: calculator, label: "Means" }
  - { icon: curve, label: "RGR, NAR" }
  - { icon: download, label: "Download" }
---

## What it does

**Classical growth analysis** describes how fast plants grow, and why, from a few **destructive harvests**: at each harvest you dry and weigh several plants and measure their leaf area. From two or more harvests this tool works out the standard quantities for each interval between harvests:

- **RGR**, relative growth rate: growth per unit of plant mass per day, (ln W₂ − ln W₁) / (t₂ − t₁).
- **ULR**, unit leaf rate, also called **net assimilation rate (NAR)**: dry mass gained per unit leaf area per day. Hunt's formula (W₂ − W₁)/(t₂ − t₁) × (ln LA₂ − ln LA₁)/(LA₂ − LA₁) is exact when leaf area rises in step with mass.
- **LAR**, leaf area ratio: leaf area per gram of plant (how leafy the plant is).
- **SLA**, specific leaf area: leaf area per gram of leaf (how thin the leaves are).
- **LWR**, leaf weight ratio: the share of plant mass in leaves. LAR = SLA × LWR.

LAR, SLA and LWR over an interval are the mean of the two harvest values.

Measure leaf areas from photos with the [[leaf-area-analyser|leaf area analyser]], and compare treatments with the [[yield-trial-anova|yield trial ANOVA]].

## How to use it

1. Paste one row per plant: **harvest time**, **total dry mass**, **leaf area** and, if you have it, **leaf dry mass** (needed for SLA and LWR). Or open a CSV, TSV, TXT or Excel file. Rows with the same time form one harvest; header rows are skipped.
2. Pick the units: time in days or weeks, mass in g or mg, leaf area in cm² or m². Results are given in g, cm² and m² as labelled.
3. **RGR from**: "Mean of ln W" (the default) averages the natural log of each plant's mass at each harvest. This handles the skew in plant sizes and gives a **standard error** and **confidence interval** for RGR, as recommended by Hoffmann and Poorter (2002); it needs at least two plants per harvest. "ln of mean W" is the classical calculation from harvest means, with no error.
4. **Confidence**: 90, 95 or 99 % for the RGR interval, using Student's t with n₁ + n₂ − 2 degrees of freedom.

With three or more harvests you get each interval and the whole period from the first harvest to the last. The headline and the key figures are for the whole period.

## Worked example

The made-up example has four plants harvested on days 14, 21 and 28. Over the whole period (days 14 to 28) the page shows:

- **RGR 0.142 g g⁻¹ d⁻¹**, that is 142 mg g⁻¹ d⁻¹, ± 4 SE, with a 95 % interval of 132 to 151 mg g⁻¹ d⁻¹.
- **ULR 6.85 g m⁻² d⁻¹**.
- **LAR 220 cm² g⁻¹**, **SLA 476 cm² g⁻¹** and **LWR 0.459 g g⁻¹**.

RGR slowed from 0.151 in the first week to 0.133 in the second, while ULR rose a little: the plants became less leafy (LAR fell from about 239 to 202 cm² g⁻¹), which is the usual reason RGR falls as plants grow. The check ULR × LAR gives 0.151, close to RGR; the two agree exactly only at an instant, not for means over an interval.

## Tips

- Use the **same number of plants** at each harvest where you can, and choose plants of average size; in classical analysis plants at different harvests are not paired.
- Harvest intervals should be short enough that growth is roughly steady within each one. Long gaps make ULR and the interval means less reliable.
- Oven-dry to constant mass (typically 60 to 70 °C for at least 48 hours) before weighing.
- For many harvests, the functional approach (fitting a curve through all harvests) can be better; this tool is for the classical interval approach.

## FAQs

**Why use the mean of ln W?** Plant sizes are skewed, and RGR is a difference of logarithms. Averaging the logarithms gives an unbiased estimate and lets the error be worked out from the spread within each harvest.

**Is NAR the same as ULR?** Yes. Unit leaf rate and net assimilation rate are two names for the same quantity.

**Is my data uploaded?** No. Everything runs in your browser.
