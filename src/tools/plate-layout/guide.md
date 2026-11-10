---
name: Plate layout designer
num: 35
shelf: science
code: T35
section: lab-management
title: "Plate layout designer for 96, 384 and 1536-well plates (printable map and CSV)"
summary: "Lay out standards, samples, controls and blanks with replicates on any plate from 6 to 1536 wells. Keep the edge wells empty, then print the map or export a well list for your plate reader or liquid handler."
status: live
ads: true
order: 10
icon: table
works: offline
updated: 2026-11-08
related: [pcr-master-mix, solution-calculator, dose-response, calibration-curve]
flow:
  - { icon: sliders, label: "Plate" }
  - { icon: table, label: "Samples" }
  - { icon: download, label: "Map, CSV" }
---

## What it does

Before an ELISA, qPCR run, cell assay or drug screen, you plan which well gets what. Getting it wrong costs a plate. This designer places your standards, samples, controls and blanks with their replicates in a tidy, repeatable order. It shows the plate as a map you can print, and exports a well list that plate readers, qPCR software and liquid handlers can import.

Make up the reagents with the [[pcr-master-mix]], and fit the standards with the [[calibration-curve|calibration curve]] tool.

## How to use it

1. Choose the **plate**: 6, 12, 24, 48, 96, 384 or 1536 wells.
2. Choose how to **fill** it, across rows (A1, A2, A3 …) or down columns (A1, B1, C1 …).
3. Choose how to place **replicates**:
   - **Side by side, in a block:** filling across rows, a triplicate of S1 goes in A1, B1 and C1, so the replicates sit next to each other and the samples run along the plate. This is the usual layout for ELISAs.
   - **One after another:** the replicates follow each other in the fill order, packing the plate tightly.
4. Tick **Keep the edge wells empty** to avoid edge effects. On a 96-well plate that leaves the 60 inner wells.
5. List the names for each group, with the number of replicates. "S1-S24" expands to 24 names.
6. **Tap a well** to keep it empty (for example a damaged well), and tap again to use it.
7. **Copy** the plate as a grid to paste into Excel, **download a CSV** with one line per well, or save the map as an image, PDF or Word file.

## Worked example

An ELISA with eight standards in duplicate, 24 samples in triplicate, two controls in duplicate and a duplicate blank needs 16 + 72 + 4 + 2 = 94 wells. On a 96-well plate, filled across rows with blocks of replicates, the standards fill A1 to B8, the first samples start in column 9, and every well but two is used. With the edge wells kept empty, only 60 wells are free, so the tool says how many did not fit. Fewer sample replicates or a 384-well plate solves it.

## Frequently asked questions

**Which software reads the CSV?** The list has the well (A1), row, column, type, name and replicate number. Most plate reader, qPCR and liquid handler software can import a table like this. You may need to rename the columns to match.

**Is my layout saved or sent anywhere?** No. Everything stays in your browser. Save the CSV or PDF to keep it.

Work out the reagents with the [PCR master mix calculator](/science/pcr-master-mix/) and the [solutions calculator](/science/solution-calculator/), then fit the results with the [dose-response](/science/dose-response/) or [calibration curve](/science/calibration-curve/) tool.
