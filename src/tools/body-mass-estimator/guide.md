---
name: Allometric body mass estimator
num: 407
shelf: science
section: paleontology
title: "Allometric body mass estimator for fossils: log-log regression with prediction intervals, %PE and smearing (free)"
summary: "Fit log M = a + b log X to your own reference specimens, or type a published equation's a and b, and estimate body masses of fossils with prediction intervals, %PE, %SEE and a smearing or QMLE bias correction. Plot, CSV and report downloads. Nothing is uploaded."
status: live
ads: false
order: 407
icon: sigma
works: offline
updated: 2026-11-09
related: [calibration-curve, uncertainty-calculator, trend-analyser, plot-maker, artefact-scale-tool, procrustes-morphometrics, range-chart-plotter]
sources:
  - "Ordinary least squares on log10-transformed data with the standard prediction interval; %PE and %SEE as defined by R. J. Smith (1984, American Journal of Physiology 246: R152-R160); smearing estimate of N. Duan (1983, Journal of the American Statistical Association 78: 605-610); the QMLE factor exp((ln 10 · SEE)² / 2). No published regression coefficients are included."
  - "Checked against statsmodels (OLS parameters, standard errors, r², SEE, and 90 % and 95 % prediction and confidence intervals at three X values) and numpy (%PE, %SEE, smearing and QMLE factors)."
  - "The example reference specimens and fossils are made up for this tool; they are not real animals."
flow:
  - { icon: table, label: "References" }
  - { icon: curve, label: "Fit log-log" }
  - { icon: target, label: "Fossils" }
  - { icon: chart, label: "Mass ± PI" }
---

## What it does

Body mass of an extinct animal is usually estimated from a bone measurement (a limb bone circumference, a tooth length, a skull length) through an **allometric equation** fitted to living animals: log M = a + b·log X. This tool lets you build that equation from your own reference data and use it honestly:

- **Fit** the line by least squares on log₁₀ X and log₁₀ M, with the standard errors of a and b, r², and the standard error of estimate (SEE) on the log scale.
- **Error measures** used in the body mass literature: **%PE**, the average absolute error of the reference predictions as a percentage of the prediction, and **%SEE**, 100 × (10^SEE − 1).
- **Bias correction**: back-transforming from logs gives the median, not the mean, mass. Pick the **smearing** factor (the average of 10^residual over the references) or the **QMLE** factor from the SEE, or none.
- **Prediction intervals** for each fossil (90, 95 or 99 %), and a warning when a fossil lies outside the range of the references, where the estimate is an extrapolation.
- **Type an equation** instead: enter a and b from a paper (log₁₀ or ln, with any correction factor it gives). The tool does not include any published equations; use the source's own error figures with the result.

## How to use it

Paste the reference specimens as three columns: name, X, mass (or open a CSV or Excel file). Use the same measurement and units for the fossils, as two columns: name and X. Any units work, as long as they match; type them in so the tables and plot are labelled.

## Worked example

The page opens with **made-up** reference data: 12 invented specimens with X from 49 to 304 mm and masses from 18 to 1350 kg. The fit is **log₁₀ M = −2.8593 + 2.4384 log₁₀ X** (r² = 0.9928, SEE = 0.0592), with %SEE 14.6 % and %PE 10.4 %. The smearing factor is 1.0078.

For the three made-up fossils, with smearing and 95 % intervals:

- **Fossil A**, X = 160 mm: **330 kg** (238.5 to 449.4 kg).
- **Fossil B**, X = 65 mm: **36.69 kg** (26.02 to 50.94 kg).
- **Fossil C**, X = 410 mm: **3273 kg** (2282 to 4622 kg), flagged as outside the reference range.

## Good practice

- Choose references that share the fossil's body plan and way of moving; a single equation across very different animals adds large errors.
- Report the interval, not only the point estimate, and say which correction you used.
- Ordinary least squares is the usual choice for prediction. Reduced major axis lines describe scaling, but are not meant for predicting one variable from the other.

## FAQ

**Why is the interval not symmetric?** It is symmetric on the log scale, so in kilograms it stretches further upwards.

**Is my data uploaded?** No. Everything runs in your browser and works offline.
