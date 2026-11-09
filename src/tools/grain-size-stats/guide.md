---
name: Grain-size statistics from sieve data
num: 875
shelf: science
section: sedimentology-and-stratigraphy
title: "Grain size statistics calculator: sieve analysis, Folk and Ward, moments, phi percentiles (free, GRADISTAT-style)"
summary: "Turn sieve masses into a cumulative curve, φ percentiles, Folk and Ward mean, sorting, skewness and kurtosis with their verbal classes, moment statistics and Udden-Wentworth class percentages, for one sample or a whole batch."
status: live
ads: true
order: 875
icon: chart
works: offline
updated: 2026-11-09
related: [ternary-plot-maker]
sources:
  - "Methods (formulas and class limits only, no data copied): Folk and Ward (1957) graphic measures and verbal classes; Krumbein φ scale; Udden (1914) and Wentworth (1922) size classes; moment formulas as written out by Blott and Pye (2001) for GRADISTAT."
  - "Example sieve data: synthetic, made up by fibub."
flow:
  - { icon: table, label: "Sieve masses" }
  - { icon: curve, label: "Cumulative" }
  - { icon: sigma, label: "Statistics" }
  - { icon: download, label: "CSV, plots" }
---

## What it does

A sieve analysis gives the mass of sediment left on each sieve. This page turns those masses into the numbers sedimentologists report:

- the **cumulative curve** (weight % coarser against grain size in φ, where φ = −log₂ of the size in mm) and the **percentiles** φ5 to φ95, read by straight-line interpolation between sieves;
- the **Folk and Ward (1957) graphic measures**: mean M<sub>z</sub> = (φ16 + φ50 + φ84)/3, sorting σ<sub>I</sub>, skewness Sk<sub>I</sub> and kurtosis K<sub>G</sub>, each with its published verbal class (for example "moderately well sorted", "fine skewed", "mesokurtic");
- the **method of moments** in three forms: logarithmic (φ), geometric (sizes in mm, worked on their logarithms) and arithmetic (sizes in mm), using the mid-point of each class;
- **D10, D50, D90** (the sizes that 10, 50 and 90 % of the sample is finer than) and the uniformity D60/D10;
- the weight % in each **Udden-Wentworth class**, from boulders to clay, and the gravel, sand and mud totals.

Several samples can go in side by side: one column of masses per sample.

## How to use it

1. Paste your table: the **sieve opening** in the first column and the **mass retained** on it in the next ones. Write **pan** for what passed the finest sieve. A first row of names labels the samples. You can also open a CSV or Excel file.
2. Choose whether the sieve sizes are in **mm, µm or φ**. Rows can be in any order.
3. Set how far the two **open classes** reach. Grains on the top sieve could be any size bigger than it, and the pan holds everything finer than the last sieve; the page spreads that mass evenly over the width you set (1 φ by default). If more than 5 % sits in either open class the page warns you, because the outer percentiles then depend on that choice.
4. Read the summary table, look at the curves, pick a sample to see its percentiles and classes, and download the statistics, the curves or the plots.

## Worked example

The example has three made-up samples on half-φ sieves from 4 mm to 63 µm. The **Beach** sample (111.8 g) gives φ16 = 1.104, φ50 = 1.686 and φ84 = 2.261, so the Folk and Ward mean is **1.684 φ (311 µm), medium sand**. Sorting is **0.591, moderately well sorted**; skewness −0.014 (symmetrical) and kurtosis 1.059 (mesokurtic). The logarithmic moments give a mean of 1.677 φ and a sorting of 0.586 φ, close to the graphic values, as expected for a tidy sample.

The **River bar** is gravelly: 20.40 % gravel, 77.77 % sand and 1.83 % mud, a mean of 0.342 φ (coarse sand) and a sorting of 1.554, poorly sorted. The **Estuary** sample has 32 % in the pan, so the page warns that φ84 and φ95 lie inside the pan class and move if you change how far it reaches.

## Tips

- Weigh the pan. Leaving it out makes the sample look coarser and better sorted than it is.
- For muddy samples, sieve the sand and measure the fines with a laser or pipette, then join the two into one table in φ.
- Folk and Ward kurtosis is 1.00 for a normal curve; kurtosis by moments is 3. The two are on different scales.
- In φ, a positive skewness means a tail of fine grains. In mm (the geometric moments) the sign is the other way round.

## FAQ

**Why are my percentiles different from another program?** Programs differ in how they interpolate (straight lines in φ here, as is usual) and in how they treat the open classes. Check the pan and top-class widths first.

**Can I use laser data?** Yes: give each size bin's upper limit as the "sieve" and its volume % as the mass.

**Is anything uploaded?** No. All the sums run in your browser and nothing leaves your device.
