---
name: Non-detect statistics
num: 153
shelf: science
code: T153
section: environmental-monitoring
title: "Non-detect statistics: mean, median and percentiles of lab results with \"<DL\" values (Kaplan–Meier, ROS, MLE)"
summary: "Work out the mean, median, upper percentiles and an upper confidence limit for lab results that include non-detects (\"<1\", \"ND\"), even with several detection limits. Uses Kaplan–Meier, robust ROS and maximum likelihood instead of substituting half the limit, compares every method side by side, and counts results above a guideline."
status: live
ads: true
order: 1
icon: sigma
works: offline
updated: 2026-11-09
related: [calibration-curve, species-sensitivity, air-quality-calculator, uncertainty-calculator]
sources:
  - "Methods for non-detects as described by D. R. Helsel, Statistics for Censored Environmental Data (Wiley, 2nd ed. 2012): Kaplan–Meier on flipped data, robust regression on order statistics (Helsel and Cohn 1988, with Hirsch and Stedinger plotting positions), and maximum likelihood. Method only; no tables are copied."
  - "Written by fibub. Checked in the tests against statsmodels 0.15 (SurvfuncRight on the flipped data, impute_ros) and SciPy (censored log-normal likelihood)."
  - "The example results are made up."
flow:
  - { icon: table, label: "Results" }
  - { icon: search, label: "Non-detects" }
  - { icon: sigma, label: "Statistics" }
  - { icon: check, label: "Guideline" }
---

## What it does

Lab reports often say "<1 µg/L": the substance was not detected, and could be anywhere from zero up to the detection (or reporting) limit. These **non-detects** are real information, but they are not numbers, so an ordinary average cannot use them. The common shortcut, replacing each with half the limit, can bias the mean and the spread, especially when there are several limits or many non-detects.

This tool uses the methods recommended for environmental data instead:

- **Kaplan–Meier**, borrowed from survival analysis by flipping the data so that "less than" becomes "more than". It makes no assumption about the shape of the data and is the usual first choice.
- **Robust ROS** (regression on order statistics). Fits a log-normal line through the detected values and uses it only to fill in the non-detects. The detected values are kept as measured.
- **Maximum likelihood** for a log-normal distribution with censoring. Best when the data really are log-normal and there are enough of them.

The substitution results (0, half the limit, the limit) are shown next to them, so you can see how much the choice matters.

To find how many samples you need, use the [[sample-size]]; to set the detection limit from a calibration, the [[calibration-curve|calibration curve]] tool.

## How to use it

1. **Paste or open the results**, one per row, with an optional sample name first. Write non-detects as "<1" or "ND 1", or put a flag ("<", "ND", "U") in the column after the value. Rows with several values and no names are also read, one result per value.
2. Several detection limits are fine. So is a detected value below another sample's limit, which often happens when samples are diluted.
3. **Unit** is used only for the labels.
4. **Guideline value** (optional): the tool counts the results above it. Non-detects with a limit above the guideline cannot be placed either side, and the tool says so.

## What you get

- The **Kaplan–Meier mean and median**, the standard error of the mean, and an **upper 95 % confidence limit of the mean** (mean + t × standard error), often used for exposure-point concentrations.
- A **table of every method**: mean, standard deviation, median, 90th and 95th percentiles, and what each one assumes.
- **A plot** of the cumulative distribution on a log scale, with the Kaplan–Meier steps, the fitted log-normal, each result at its plotting position and the detection limits marked.
- **Each result with its ROS value**, plus CSV, PDF, PNG and Word downloads.

## Worked example

The made-up example has 16 arsenic results from wells. Five are non-detects at two limits (<1 three times, <2 twice), and one detected value (0.8 µg/L) is below the <1 limit.

- **Kaplan–Meier**: mean 2.48 µg/L, median 1.5 µg/L, standard error 0.603. The upper 95 % confidence limit of the mean is 3.54 µg/L.
- **Robust ROS**: mean 2.43 µg/L, with the non-detects filled in at 0.38 to 1.16 µg/L.
- **Maximum likelihood** (log-normal): mean 2.45 µg/L.
- **Substitution**: half the limit gives 2.43 µg/L, and zero gives 2.21 µg/L.

The three proper methods agree to within about 2 % here, because only 31 % of the results are non-detects. Substituting zero is already 11 % lower. With more non-detects, or with limits higher than many detected values, the methods drift apart and substitution can be badly wrong.

## Good practice

- Below about 50 % non-detects, all three methods work well. From 50 to 80 %, report the upper percentiles with more confidence than the mean. Above 80 %, report the share detected and the highest values instead of a mean.
- When the lowest result is a non-detect, the Kaplan–Meier mean puts the unknown lowest part at the lowest limit, so it is a little high. The tool notes this.
- Never report a non-detect as zero or as the limit in a summary without saying so.

## FAQs

**Which method should I report?** Kaplan–Meier, unless you have a reason to assume a log-normal shape. ROS is a good second opinion, and it gives values you can use in other calculations.

**Why is the median "<2"?** When more than half the results are non-detects, the median is below a detection limit and cannot be pinned down. That is an honest answer, not an error.

**Is my data uploaded?** No. Everything runs in your browser.
