---
name: Seriation
num: 405
shelf: science
code: T293
section: archaeology
title: "Seriation"
summary: "Paste or open a table of type counts per site, and get a correspondence analysis (inertia per axis, site and type scores, map), the sites and types ordered along the first axis, a battleship (frequency seriation) plot and the Brainerd-Robinson similarity matrix. Nothing is uploaded."
status: live
ads: false
order: 405
icon: chart
works: offline
updated: 2026-11-09
related: [harris-matrix-builder, radiocarbon-calibration, biodiversity-indices, plot-maker, artefact-scale-tool, trench-recording-sheet, community-ordination, range-chart-plotter]
sources:
  - "Correspondence analysis as in M. Greenacre, Correspondence Analysis in Practice (3rd ed., 2017): SVD of the standardised residuals, principal and standard coordinates. Seriation by the first CA axis and the battleship plot as described by Ford (1962) and in archaeological statistics texts. Brainerd (1951) and Robinson (1951) for the similarity coefficient."
  - "Checked against an independent numpy implementation (inertias and scores to 1e-13 on four tables) and scipy's chi-square test (χ² = inertia × n); the 2 × 2 case against φ² worked by hand; a shuffled perfect sequence is put back in order."
  - "The example counts and site names are made up for this tool."
flow:
  - { icon: table, label: "Counts" }
  - { icon: sigma, label: "CA" }
  - { icon: sliders, label: "Order" }
  - { icon: chart, label: "Battleship" }
---

## What it does

Seriation puts assemblages in a relative order when you have no dates: if pottery or tool types come into fashion, peak and fade, sites can be ordered so that each type's share rises and falls only once. This tool does that from a simple table of counts:

- **Correspondence analysis (CA)** of the sites × types table: the inertia (variation) held by each axis, the score of every site and type on each axis, and a map of both on the first two axes.
- **Seriated order**: sites and types sorted by their score on the first CA axis. Which end is earlier is up to you; tick **Reverse the order** to flip it.
- **Battleship plot**: each site's percentage of each type as a bar, in the seriated order. A good sequence looks like a row of ship hulls.
- **Brainerd-Robinson similarity** between every pair of sites (200 = identical percentages, 0 = no types in common), shown in the seriated order, with a count of places where the order breaks the expected pattern of similarity falling away from the diagonal.

Order the layers on site with the [[harris-matrix-builder]], and date them with [[radiocarbon-calibration]].

## How to use it

Paste from a spreadsheet: a header row with type names, then one row per site with its name and counts. You can also open a CSV, TSV or Excel file. Blank cells count as 0. Sites or types with no finds at all are left out, with a note. You need at least three sites and three types.

Download the ordered table, the CA scores (all axes, with masses and inertia) and the similarity matrix as CSV, or a report as an image, PDF or Word file.

## Worked example

The example is eight made-up sites with 531 sherds of six made-up types, entered in no particular order. The first axis holds **54.4 %** of the inertia (total inertia 1.4430, χ² 766.2) and the second 30.9 %. Sorted along the first axis, the sites run Long Meadow, Old Ford, Brook End, Ash Row, Hill Farm, Church Field, Mill Lane, Quarry Pit, and the types run from Cord-marked to Glazed. The battleship plot shows each type rising and falling once, and the CA map shows the typical horseshoe. The Brainerd-Robinson matrix in this order has **0** breaks of the pattern, against 28 in the order typed. Long Meadow and Old Ford score 142; Long Meadow and Quarry Pit share no types and score 0.

## Things to keep in mind

- CA finds the main gradient in the data. It is a sequence only if that gradient is time; region, function or site size can drive it too.
- Small samples are noisy: a site with 15 sherds moves around easily. Look at the Finds column.
- A strong second axis or a broken horseshoe can mean two overlapping sequences, or outliers worth a second look.

## FAQ

**Principal or standard coordinates?** The map and tables use principal coordinates for both sites and types (a symmetric map). The CSV has the principal scores; standard scores are these divided by the square root of the axis inertia.

**Is my data uploaded?** No. Everything runs in your browser and works offline.
