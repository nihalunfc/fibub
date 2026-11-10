---
name: Forest inventory summary
num: 336
shelf: science
code: T251
section: forestry
title: "Forest inventory plot summary: stems per hectare, basal area per hectare, quadratic mean diameter and diameter distribution by species"
summary: "Turn a plot tally (plot, species, DBH, and height if measured) into a stand summary: stems and basal area per hectare or acre with standard errors across plots, quadratic mean diameter, Lorey's mean height, a table by species and a diameter class chart. Paste it or open a CSV or Excel file."
status: live
ads: true
order: 336
icon: table
works: offline
updated: 2026-11-09
related: [tree-carbon, biodiversity-indices, field-sampling-planner, sample-size, tree-height-basal-area, log-scale-calculator, quadrat-transect-analyser, canopy-gap-analyser, plot-maker]
sources:
  - "Fixed-area plot expansion, basal area, quadratic mean diameter, Lorey's mean height and the standard error of the mean across plots (simple random sampling): standard forest inventory methods, as in Husch, Beers and Kershaw, Forest Mensuration, and Avery and Burkhart, Forest Measurements. Method only."
  - "Checked in the tests against an independent pandas and SciPy calculation. The example tally is made up."
flow:
  - { icon: table, label: "Tally" }
  - { icon: target, label: "Plots" }
  - { icon: calculator, label: "Per hectare" }
  - { icon: chart, label: "Classes" }
---

## What it does

In a forest inventory you measure every tree in a number of small plots of the same size, then scale up to the whole stand. This tool takes that tally and gives:

- **Stems per hectare** (or per acre): trees in a plot × 10,000 ÷ plot area in m², averaged over the plots.
- **Basal area per hectare**: the trunk cross-sections at breast height (π × DBH² / 4), scaled the same way. It is the usual measure of how stocked a stand is.
- **Standard error** and a **95 % range** for both, from the spread between plots (treating them as a simple random sample, with Student's t).
- **Quadratic mean diameter (QMD)**: the DBH of the tree of average basal area, √(basal area per tree × 4/π). It is always a little larger than the plain mean DBH.
- **Lorey's mean height**: the mean height weighted by basal area, from the trees you measured heights for.
- A **table by species**: stems, basal area with its standard error, share of basal area, QMD and Lorey's height.
- A **diameter distribution**: stems per hectare in each DBH class, stacked by species.

Measure heights and basal area in the field with the [[tree-height-basal-area|tree height and basal area calculator]], and turn the stand into carbon with the [[tree-carbon|tree carbon calculator]].

## How to use it

1. Paste or open the tally: one row per tree with **plot, species, DBH** and, if measured, **height**. Columns headed plot, species, DBH (or diameter) and height are found by name; without headers they are taken in that order. With only two columns they are plot and DBH.
2. Choose **units**: metric (cm, m, m²/ha) or imperial (inches, feet, ft²/acre).
3. Give the **plot size**: its area, or the radius of a circular plot (11.28 m gives 400 m²; 37.24 ft gives 1/10 acre).
4. **Number of plots**: leave blank to use the plots that appear in the tally. If some plots had no trees, type the total number so those plots count as zeros; otherwise the stand looks denser than it is.
5. **Class width**: 5 cm or 2 inches are common.

## Worked example (made-up tally)

Six 400 m² plots hold 37 trees of pine, spruce and birch. Each tree stands for 25 per hectare. The stand has **6.28 m²/ha of basal area** (± 1.05, or 16.7 %; 95 % range 3.59 to 8.97) and **154 stems/ha** (± 18.7). The quadratic mean diameter is **22.8 cm** and Lorey's mean height, from the 23 trees with heights, is **14.6 m**. Pine makes up 73.5 % of the basal area (4.62 m²/ha, QMD 27.3 cm), spruce 15.8 % and birch 10.7 %. The diameter distribution peaks in the 25 to 30 cm class with 41.7 stems/ha.

If a seventh plot had no trees, typing 7 plots lowers basal area to 5.39 m²/ha and widens the standard error.

## Tips

- Use the same minimum DBH on every plot and say what it was when you report.
- The standard error only reflects the plots you took; plots placed subjectively (for example, in "typical" spots) make it look better than it is.
- To see how many plots you need for a target precision, use the sample size planner with the standard deviation shown here.

## FAQs

**Why is QMD bigger than the mean DBH?** Basal area grows with the square of DBH, so the average basal area belongs to a slightly larger tree than the average diameter.

**Can I use variable-radius (prism) plots?** Not here: this tool is for fixed-area plots. The tree height and basal area calculator handles prism sweeps.

**Is my data uploaded?** No. Everything runs in your browser.
