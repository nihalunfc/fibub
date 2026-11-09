---
name: Range chart and diversity through time
num: 409
shelf: science
section: paleontology
title: "Range chart maker and diversity through time: boundary crossers, origination and extinction rates (Foote)"
summary: "Paste taxa with their first and last appearances (ages in Ma or numbered bins) and get a range chart, diversity per time bin, range-through and boundary-crosser counts, originations, extinctions and Foote's per-capita rates, with CSV export. Nothing is uploaded."
status: live
ads: true
order: 409
icon: chart
works: offline
updated: 2026-11-09
related: [biodiversity-indices, radiometric-age-calculator, procrustes-morphometrics, plot-maker]
sources:
  - "Boundary-crosser categories and per-capita origination and extinction rates from Foote, M. (2000), Origination and extinction components of taxonomic diversity: general problems, Paleobiology 26(sp4). Range-through diversity as in standard palaeobiology texts."
  - "Checked against an independent pandas implementation that works out boundary crossing from the ages directly: every count and rate in 1,872 values (the example and four random sets of 60 taxa, with 5 Myr, 10 Myr and uneven bins) agrees."
  - "The example taxa and their ages are made up for this tool."
flow:
  - { icon: table, label: "Taxa" }
  - { icon: ruler, label: "Time bins" }
  - { icon: chart, label: "Range chart" }
  - { icon: sigma, label: "Rates" }
---

## What it does

A **range chart** draws each fossil taxon (a species, genus or family) as a bar from its first appearance to its last. Counting how many bars cross each slice of time gives **diversity through time**, and counting where bars start and stop gives **originations** and **extinctions**. This tool does those counts the way Mike Foote set out in 2000, sorting the taxa in every time bin into four kinds:

- **FL**: first and last appearance both in the bin (singletons).
- **bL**: crosses the bottom (older) boundary and ends in the bin.
- **Ft**: starts in the bin and crosses the top (younger) boundary.
- **bt**: ranges right through, crossing both boundaries.

From these come the **range-through diversity** (every taxon present: FL + bL + Ft + bt), the diversity at the base (bL + bt) and the top (Ft + bt) of the bin, the **mean standing diversity** ((bL + Ft) / 2 + bt), and Foote's **per-capita rates**: origination p = −ln(bt / (Ft + bt)) and extinction q = −ln(bt / (bL + bt)). The rates leave out singletons, which mostly reflect how well a bin was sampled.

## How to use it

1. Paste one taxon per row: name, first appearance, last appearance. Leave the last out for a taxon found at one level only. A header row is fine. You can also open a CSV, TSV, TXT or Excel file.
2. Say whether your values are **ages in Ma** (the first appearance is the larger number) or **bin numbers or names** (1 = oldest). For named bins, list the names in order in the *Bin names* box and use the names in the table.
3. With ages, choose **equal bins** (a width in Myr, laid on round numbers) or **your own boundaries**, oldest first, such as stage boundaries you have looked up. Bin names are optional.
4. Sort the range chart by first appearance, by last appearance or as entered.

A first appearance exactly on a boundary counts in the younger bin and a last appearance on a boundary in the older bin, so a taxon that dies out at a boundary did not cross it.

## Worked example

The example has 24 made-up taxa between 118 and 61 Ma. With 10 Myr bins the tool makes 6 bins from 120 to 60 Ma, and diversity peaks at 11 taxa in 90–80 and 80–70. In the bin from 100 to 90 Ma there are 9 taxa: 2 singletons (Taxon G and Taxon J), 1 that ends there (Taxon A), 3 that begin there and carry on (Taxa H, I and K) and 3 that range through (Taxa C, D and F). So p = −ln(3 / 6) = 0.693 per bin, or 0.069 per Myr, and q = −ln(3 / 4) = 0.288 per bin, or 0.029 per Myr. The first and last bins have no range-through taxa, so no rates can be worked out there; that is the normal edge effect.

Switch to *My own boundaries* (120, 100, 90, 80, 66, 60) to see uneven bins: rates per Myr then allow for the different bin lengths.

## FAQ

**Why are there no rates in some bins?** Foote's rates need at least one taxon that crosses both boundaries. With none, the logarithm is undefined, shown as –.

**Per bin or per Myr?** With ages, both are listed; the per-Myr rate is the per-bin rate divided by the bin's length. With numbered bins there is no length, so rates are per bin.

**Does it correct for sampling?** No. These are counts of observed ranges. Singletons, the Signor-Lipps effect and uneven sampling all affect them; the boundary-crosser rates are less sensitive than raw counts, but they are not a correction.

**Is my data uploaded?** No. Everything runs in your browser and works offline.
