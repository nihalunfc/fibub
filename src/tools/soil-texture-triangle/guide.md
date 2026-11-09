---
name: Soil texture triangle
num: 322
shelf: science
section: botany-and-plant-science
title: "Soil texture triangle calculator: USDA texture class from sand, silt and clay %, for one sample or hundreds"
summary: "Type sand, silt and clay percentages and get the USDA soil texture class (sand, loam, silty clay and the rest of the 12). Paste or open a table of many samples to plot them all on the texture triangle, count them by class and download the classes as CSV."
status: live
ads: true
order: 322
icon: mountain
works: offline
updated: 2026-11-09
related: [ternary-plot-maker, darcy-flow-calculator, et0-calculator, field-sampling-planner, runoff-calculator, soil-test-interpreter, soil-classification, irrigation-scheduler, grain-size-stats]
sources:
  - "Class boundaries: the public USDA soil texture definitions (Soil Survey Division Staff, Soil Survey Manual, USDA Handbook 18, and the same rules used by the NRCS soil texture calculator). Rules only; the triangle is drawn by fibub from them."
  - "Checked in the tests against an independent Python implementation of the NRCS rule set (each class written as its full condition) on 5,050 grid points, and against the class polygons drawn on the page."
  - "The example samples are made up."
flow:
  - { icon: table, label: "Percentages" }
  - { icon: target, label: "Classify" }
  - { icon: chart, label: "Triangle" }
  - { icon: download, label: "CSV" }
---

## What it does

Soil **texture** is the mix of mineral particle sizes in a soil: **sand** (0.05 to 2 mm), **silt** (0.002 to 0.05 mm) and **clay** (finer than 0.002 mm). It controls how much water a soil holds, how fast it drains, how easily it is worked and how well it holds nutrients. The **USDA texture triangle** splits every possible mix into 12 named classes, from sand and loamy sand through loam to silty clay and clay.

This tool gives the class for one sample as you type, and for a whole table of samples at once. It plots every sample on the triangle with the 12 class boundaries, counts how many samples fall in each class, and lets you download the table with the class added.

Get the sand, silt and clay percentages from a sieve analysis with the [[grain-size-stats|grain size statistics tool]], and see what your soil needs in the [[soil-test-interpreter|soil test interpreter]].

## How to use it

1. **One sample**: type the sand, silt and clay percentages. Leave one box empty and it is worked out as 100 minus the other two (handy when the lab reports only sand and clay).
2. **Many samples**: paste a table, or open a CSV, TSV, TXT or Excel file. Use one row per sample: a name, then sand, silt and clay. With a header row that contains the words sand, silt and clay, the columns can come in any order and other columns are ignored.
3. Read the class of each sample in the table, see where the samples sit on the triangle, and download the CSV or a PNG, PDF or Word report.

## Options

- **When the three do not add up to 100**: lab results often add up to 99 or 101 % after rounding. By default a total within 2 % of 100 is rescaled so the three add to 100, and rows further off are skipped with a message, because a big gap usually means a typing slip or that organic matter or gravel was counted. You can widen this to 5 %, always rescale, or never rescale (any total that is not 100 is then skipped). Rescaled samples are marked with a star.
- **Point labels**: show sample names next to the points when there are 20 or fewer, always, or never.
- **Class names on the triangle**: show or hide the 12 class names.

## Worked example

The made-up example has eight samples. "Field 1 top" has 42 % sand, 38 % silt and 20 % clay: a **loam**. "Field 1 deep" (30, 36, 34) is a **clay loam**, the "River bank" (78, 15, 7) is a **loamy sand** because silt plus twice the clay is 29, just under the 30 that starts sandy loam. "Pond edge" (18, 40, 42) is a **silty clay** and the "Dune" (93, 4, 3) is **sand**. In all, the page reports **8 samples in 7 classes; most common: Silt loam (2)** (the terrace and the orchard).

In the single-sample box, 40 % sand, 40 % silt and 20 % clay gives **Loam**.

## How the classes are defined

Each class is a set of simple conditions on the three percentages. For example, sand is where silt + 1.5 × clay is below 15; loamy sand is where that is 15 or more but silt + 2 × clay is below 30; clay is 40 % clay or more with no more than 45 % sand and less than 40 % silt. A point exactly on a line goes to the class the USDA wording gives it (for example 40 % clay, 40 % silt and 20 % sand is silty clay).

## Tips

- Texture is measured on the **fine earth** only. If your soil has gravel, report it as a modifier (such as "gravelly loam") from the gravel percentage; this tool does not add it.
- Organic soils (peats and mucks) are not given a texture class this way.
- Other countries use other triangles with different size limits (silt up to 0.063 mm in some), so check which system your report needs.

## FAQs

**Can I use my own triangle?** For other schemes, plot your data with the [ternary plot maker](/science/ternary-plot-maker/) and draw the fields yourself.

**Why is my sample on a line?** Boundaries are sharp in the definition but soils are not. A sample within a percent or two of a line could reasonably be called either class; lab results are rarely better than that.

**Is my data uploaded?** No. Everything runs in your browser.
