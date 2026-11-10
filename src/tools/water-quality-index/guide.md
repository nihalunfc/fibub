---
name: Water quality index
num: 156
shelf: science
code: T156
section: environmental-monitoring
title: "Water quality index calculator (CCME WQI method): score lab results against your own objectives"
summary: "Turn a season of water lab results into one score from 0 to 100 using the CCME water quality index method. Enter the objectives that apply to your water and the results for each sample. See how many variables and tests failed and by how much, the score and its category, and which samples failed."
status: live
ads: true
order: 2
icon: check
works: offline
updated: 2026-11-09
related: [non-detects, species-sensitivity, rain-gauge-average]
sources:
  - "Index structure (scope F1, frequency F2, amplitude F3, the excursion and normalised sum of excursions, the 1.732 scaling and the five categories): the Canadian Council of Ministers of the Environment (CCME) Water Quality Index 1.0 method (2001). Method only. No guideline values are built in; you enter your own objectives."
  - "Written by fibub and checked in the tests against an independent Python implementation of the same formulas."
  - "The example objectives and results are made up and are not any jurisdiction's guidelines."
flow:
  - { icon: ruler, label: "Objectives" }
  - { icon: table, label: "Results" }
  - { icon: sigma, label: "F1 F2 F3" }
  - { icon: check, label: "Score" }
---

## What it does

A monitoring program can produce hundreds of numbers a year: pH, oxygen, nutrients, bacteria, metals, at several dates. A **water quality index** boils them down to one score that people can follow from year to year and compare between sites.

This tool uses the method of the **Canadian Council of Ministers of the Environment (CCME) Water Quality Index**. It is widely used because it works with whatever variables and objectives fit your water. It combines three factors:

- **Scope (F1)**: the share of variables that failed their objective at least once.
- **Frequency (F2)**: the share of all individual tests that failed.
- **Amplitude (F3)**: how far the failing tests went beyond their objectives, from the sum of their excursions, squeezed into 0 to 100.

The index is 100 − √(F1² + F2² + F3²) ÷ 1.732, from 0 (worst) to 100 (every test met its objective). The categories are Excellent (95 to 100), Good (80 to 94), Fair (65 to 79), Marginal (45 to 64) and Poor (0 to 44).

For lab results below the detection limit, use [[non-detects|non-detect statistics]]; to plan where to sample, the [[field-sampling-planner]].

## How to use it

1. **Objectives**: one row per variable with its lowest and/or highest allowed value. Use the guidelines or site-specific objectives that apply to your water and its use, from your regulator. The tool has no values built in.
2. **Results**: a header row with the same variable names, then one row per sample. A date or sample name in the first column is optional. Leave a cell blank when a variable was not measured. Results like "<0.01" are taken at the detection limit.
3. You can paste from a spreadsheet or open CSV, TXT or Excel files for either table.

## What you get

- The **index** and its **category**.
- **F1, F2 and F3** with the counts behind them, so you can see whether the score is low because many variables fail, because failures are frequent, or because a few are very large.
- **A chart** with the score on the category scale and the share of tests failed for each variable.
- **A table by variable**: objective, tests, failures and the worst result as a multiple of its limit.
- **Every sample**, with failing results marked, plus CSV, PDF, PNG and Word downloads.

## Worked example

The made-up river station has eight monthly samples of six variables, judged against made-up objectives.

- pH and nitrate always pass. Dissolved oxygen, total phosphorus, E. coli and turbidity each fail at least once, so **F1 = 66.7**.
- 10 of the 48 tests fail, so **F2 = 20.8**.
- The worst failure is E. coli at 1,200 per 100 mL, 8 times its limit. Across all tests the normalised sum of excursions is 0.243, so **F3 = 19.5**.
- **WQI = 58, Marginal.**

Scope dominates here: four of the six variables fail at some point, even though most tests pass.

## Good practice

- Use at least 4 variables and 4 samples, and keep the same variables and objectives when you compare years or sites.
- The index summarises; it does not replace looking at the variables that fail and why.
- Choosing more variables that rarely fail raises the score, and adding sensitive ones lowers it. Report which variables and objectives you used.

## FAQs

**Can I use this for drinking water compliance?** No. Compliance is judged sample by sample against the rules that apply. The index is a summary for reporting trends.

**Why does one bad result move the score so much?** A single failure makes that variable count in F1. With few variables, one variable is a large share.

**Is my data uploaded?** No. Everything runs in your browser.
