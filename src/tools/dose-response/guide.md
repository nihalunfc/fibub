---
name: Dose-response and ELISA curve fitter (4PL)
num: 29
shelf: science
section: pharmacology
title: "IC50 and EC50 calculator: 4PL dose-response and ELISA standard curve fitter"
summary: "Fit a four-parameter logistic curve to dose-response or ELISA data. Get the EC50 or IC50 with its 95 % interval and the Hill slope, and read unknown samples off the curve."
status: live
ads: true
order: 10
icon: curve
works: offline
updated: 2026-11-08
related: [calibration-curve, plot-maker, uncertainty-calculator, lc50-probit]
sources:
  - "Model: the four-parameter logistic curve, as in standard pharmacology software."
flow:
  - { icon: table, label: "Paste data" }
  - { icon: curve, label: "4PL fit" }
  - { icon: target, label: "EC50 / IC50" }
  - { icon: download, label: "Report" }
---

## What it does

Many biological responses follow an S-shaped curve against the log of the dose. Examples include enzyme inhibition, cell viability, receptor binding, herbicide or antibiotic response, and ELISA signal against antigen concentration. The standard model for this curve is the **four-parameter logistic (4PL)**. Labs usually fit it with paid software. This page fits it for free in your browser, gives the same numbers as the standard packages, and reads unknown ELISA samples off the curve.

## How to use it

1. **Paste your data:** the dose or concentration in the first column, then one or more response columns (replicates). Copy them straight from your plate reader export or spreadsheet. Blank cells are skipped, and a header row is fine. Doses of zero (controls) are used in the fit.
2. Name your **dose unit** and **response** so the plot and report are labelled.
3. Leave **Bottom** and **Top** to be fitted, unless your data is normalised to per cent of control and the curve does not reach 0 or 100 on its own.
4. Choose **1/Y² weighting** when the scatter is proportional to the signal, as in many ELISAs. Otherwise use no weighting.
5. For an **ELISA**, paste each sample's absorbance on its own line (replicates on the same line) and add the dilution factor. Each sample's concentration is read off the fitted curve.

## The model and the results

The curve is y = Bottom + (Top − Bottom) / (1 + (EC50 / x)^Hill), the same form as GraphPad Prism's "log(agonist) vs. response, variable slope". A positive **Hill slope** means the response rises with dose, and the midpoint is the **EC50**. A negative slope means it falls, and the midpoint is the **IC50**. A slope near ±1 is a simple one-site response. A steeper slope suggests cooperativity.

The fit uses the Levenberg-Marquardt method on log10(EC50). The **95 % interval** of the EC50 is symmetric on the log scale, as the standard packages report it. Standard errors come from the fit's covariance matrix. If the EC50 falls outside your doses, the page warns you, because the curve is then guessed beyond your data.

## Worked example

The sample data is the ryegrass dataset (Inderjit, Streibig and Olofsdotter, 2002) that comes with the R package drc. Root length falls as the herbicide dose rises. The fit gives IC50 = 3.06 mM (95 % interval 2.69 to 3.47), Hill slope −2.98, top 7.79 cm and bottom 0.48 cm. These match drc's published LL.4 fit (e = 3.058, b = 2.982, d = 7.793, c = 0.481) and SciPy's curve_fit, to every digit shown.

## Frequently asked questions

**Why not a straight line?** A sigmoid response is linear only around its middle. Fitting a line to the whole curve gives wrong results at both ends. For assays that really are linear, use the [calibration curve tool](/science/calibration-curve/).

**Why is a sample flagged "outside the curve"?** Its response is beyond the fitted top or bottom, so no concentration gives that signal. Dilute the sample and rerun it.

**Is my data uploaded?** No. Fitting happens in your browser, nothing is sent anywhere, and the page keeps working offline.
