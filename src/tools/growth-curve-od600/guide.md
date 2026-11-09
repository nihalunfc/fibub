---
name: Growth curve and doubling time (OD600)
num: 194
shelf: science
section: microbiology
title: "OD600 growth curve calculator: growth rate, doubling time, lag time and Gompertz or logistic fit"
summary: "Paste time and OD600 readings for one or many cultures, take away a blank, and get the growth rate, doubling time and lag time from the exponential phase (found for you or chosen by hand), the highest OD, an optional Gompertz or logistic fit, plots on a linear or log scale, cells/mL from your own factor, and CSV and report downloads."
status: live
ads: false
order: 1
icon: chart
works: offline
updated: 2026-11-09
related: [cell-doubling-time, calibration-curve, plot-maker, hemocytometer, beer-lambert-calculator]
sources:
  - "Exponential growth, the least-squares fit of ln OD against time, doubling time = ln 2 ÷ growth rate and the tangent (Lag = where the steepest line meets the starting OD) are general science knowledge, written by fibub."
  - "The logistic and Gompertz curves are used in the form of M. H. Zwietering, I. Jongenburger, F. M. Rombouts and K. van 't Riet, Modeling of the bacterial growth curve, Applied and Environmental Microbiology 56 (1990) 1875–1881 (the formulas only; no data)."
  - "Checked in the tests against an independent NumPy script: the window search, the straight-line fit and its Student-t interval, the tangent lag, and a Levenberg-Marquardt fit of both models with analytic derivatives and standard errors, on the example and six random synthetic cultures."
  - "The example readings and the default 1 × 10⁹ cells/mL for OD 1 are made up by fibub and are not values for any organism or instrument. All settings are editable."
flow:
  - { icon: table, label: "Readings" }
  - { icon: sliders, label: "Blank" }
  - { icon: curve, label: "Fit" }
  - { icon: download, label: "Report" }
---

## What it does

A batch culture grows in phases: a **lag** while the cells adjust, an **exponential phase** where the number of cells (and the OD600) doubles at a steady pace, then a slowdown to a **plateau**. On a log scale the exponential phase is a straight line. This page finds that line in your readings and works out:

- **Growth rate µ** (per hour): the slope of ln OD against time in the exponential phase, with a 95 % interval from the slope's standard error.
- **Doubling time** = ln 2 ÷ µ, in minutes and hours.
- **Lag time** by the tangent method: where the straight line through the exponential phase meets the starting OD.
- **Highest OD** and when it was reached.
- **A model fit** (optional): the Gompertz or logistic curve in the form of Zwietering and others (1990), fitted to ln(OD / starting OD). It gives its own maximum growth rate µm, lag λ and plateau A, each with a standard error.
- **Cells/mL** from an OD, using a factor you type.

Several cultures can be analysed at once: one column each, straight from a plate reader export.

## How to use it

1. **Readings.** Paste or open a table: time in the first column, OD600 in the others, one column per culture or well. Choose hours or minutes; times like 1:30:00 are read as clock time.
2. **Blank.** Take away the OD of medium without cells: none, a typed value, or a blank column (its mean is used).
3. **Exponential phase.** "Find it" slides a window of a set number of readings along each curve and keeps the steepest stretch of ln OD. "Choose by hand" uses the times you type for every culture. Readings below the **lowest OD** after the blank are too close to the blank to trust on a log scale and are left out.
4. **Read and download.** The table compares all cultures; pick one to see its details, warnings and plot, on a log or linear scale. Download the results or the blank-corrected data as CSV, or a report as an image, PDF or Word file.

## Worked example

The made-up example has readings every 30 minutes for 14 hours from three strains and a medium-only blank. The blank column's mean, **0.04528**, is taken away from every reading. With a 5-reading window and the Gompertz model:

- **Strain A**: the steepest window is 2.5 to 4.5 h (R² = 0.9975). The growth rate is **0.8088 per h** (95 %: 0.7340 to 0.8836), so the **doubling time is 51.4 min (0.857 h)**. The tangent meets the starting OD of 0.0187 at a **lag of 1.32 h**. The highest OD is 1.59 at 14 h, which is 1.59 × 10⁹ cells/mL with the placeholder factor. The Gompertz fit gives µm = 0.8386 ± 0.0078 per h and λ = 1.363 ± 0.025 h, with R² = 0.9997.
- **Strain B** doubles every 67 min (1.12 h) and **Strain C** every 90.6 min (1.51 h), each after a longer lag.

Choose "Logistic" and Strain A's model rate becomes 0.8457 per h: the two models put the curve's bend in slightly different places, so compare like with like.

## Tips

- Read often during the exponential phase: a window needs at least 3 readings, and 5 or more give a steadier rate.
- Keep the OD in the range where your instrument is linear. Dilute dense samples and multiply back; the page warns when the window includes readings above OD 1.
- Plate readers have a shorter light path than a 1 cm cuvette, so their ODs are lower. Rates and doubling times do not change, but OD values and the cells/mL factor do.
- If "Find it" picks a noisy stretch at the start, raise the lowest OD or choose the window by hand.

## FAQ

**Why does the model give a different rate from the window?** The window rate is the steepest straight stretch of your readings. The model fits a smooth curve through every reading and takes the slope at its bend, so it is less affected by one noisy reading.

**What if the lag is below 0?** The tangent meets the starting OD before the first reading: the culture was already growing when you started.

**Is the cells/mL factor right for my bacteria?** No. It is a made-up round number. The real factor depends on the organism, cell size and the instrument; plate a few dilutions at known ODs and count colonies to find your own.

**Is anything sent or saved?** No. Everything is worked out in your browser and nothing is stored.
