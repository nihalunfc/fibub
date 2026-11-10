---
name: Decline curve
num: 686
shelf: science
section: petroleum-engineering
title: "Decline curve"
summary: "Paste or open a well's rate-time history, fit Arps exponential, hyperbolic and harmonic declines by least squares, and forecast to the economic limit with EUR, remaining reserves, an optional terminal decline, and plots on linear and log axes."
status: live
ads: true
order: 686
icon: chart
works: offline
updated: 2026-11-09
related: [trend-analyser, pump-test-analyser, plot-maker, reaction-kinetics-fitter, pvt-correlations, well-test-analyser, npv-irr-calculator, curve-fitter]
sources:
  - "Arps, J. J. (1945), Analysis of decline curves, Transactions of the AIME 160, 228 to 247: the exponential, hyperbolic and harmonic rate equations and their cumulative forms, written by fibub from the equations."
  - "Terminal (modified hyperbolic) decline: the common industry practice of switching to exponential decline at a minimum decline rate, as described in petroleum engineering textbooks."
  - "Fits checked against SciPy's curve_fit, cumulatives against numerical integration (scipy.integrate.quad); used only for testing, no code copied."
  - "The example well is made up by fibub for illustration."
flow:
  - { icon: table, label: "Rates" }
  - { icon: curve, label: "Fit Arps" }
  - { icon: chart, label: "Forecast" }
  - { icon: download, label: "Download" }
---

## What it does

Oil and gas wells produce less every month as the reservoir pressure near the well falls. **Decline curve analysis** fits a smooth curve to a well's history and runs it forward to estimate how much more the well will produce. The usual curves are the three of **Arps (1945)**:

- **Exponential** (b = 0): the rate falls by the same fraction every year. q = qi·e^(−Di·t). The most cautious forecast.
- **Hyperbolic** (0 < b): the yearly decline itself slows down over time. q = qi / (1 + b·Di·t)^(1/b).
- **Harmonic** (b = 1): a special hyperbolic case, often an upper bound for conventional wells.

This tool fits all three by **nonlinear least squares**, gives each parameter with its standard error, forecasts to your **economic limit** (the rate below which the well no longer pays), and reports **EUR** (estimated ultimate recovery), production so far and **remaining reserves**. It plots the fit on a linear and a log rate axis. Everything runs in your browser; your data never leave the device.

Check the reservoir's flow from a shut-in test in the [[well-test-analyser]], and value the forecast with the [[npv-irr-calculator]].

## How to use it

1. **Paste or open your data**: time in the first column and rate in the second. Time can be days, months or years from any start, or calendar dates (2024-03-01 or 2024-03). Rows with a zero rate (shut-in months) are left out.
2. **Units**: say what the time column counts and whether the rate is per day, per month or per year. The volume unit (bbl, Mscf, m³) is only a label.
3. **Model for the forecast**: the table at the bottom always shows all three, so you can compare their fits and EUR.
4. **Fit to**: rates (standard least squares) or log of rates, which gives late, low rates more weight. Try both; a big difference means the data do not pin the curve down well.
5. **Largest b allowed**: b above 1 often appears in tight and shale wells during long transient flow. It can give a very large EUR, so use a **terminal decline** (for example 6 % per year) to switch to exponential decline later in life.
6. **Use points from**: leave out early clean-up or ramp-up months.
7. **Economic limit** and **longest forecast** decide where the forecast stops.

## Worked example

The made-up example well has 36 months of oil rates, from 808.8 down to 150.7 bbl/d. The hyperbolic fit to the rates gives qi = 799.9 bbl/d (± 5.9), Di = 1.06 per year nominal (an effective first-year decline of 54.7 %) and b = 0.711 (± 0.039), with R² = 0.9980. With an economic limit of 20 bbl/d the rate reaches the limit at month 203.44, about 14 years after the last data point. Production to date is 358,473 bbl (trapezoid rule over the data), the remaining reserves are 264,221 bbl and the **EUR is 622,694 bbl**.

The comparison table shows why the model choice matters: the exponential fit (R² 0.9760) gives an EUR of 415,626 bbl and the harmonic fit 845,328 bbl, from the same data.

## Tips

- Plot the data on the log axis first. A straight line there means exponential decline; upward curvature means b > 0.
- Fit only a period with steady operation. A change in choke, artificial lift or a workover starts a new decline.
- Report the range: the exponential and hyperbolic EURs bracket most reasonable answers.

## FAQ

**What is the difference between nominal and effective decline?** Nominal decline D is the instantaneous rate −(dq/dt)/q. Effective decline is the drop over a period, here the first year: 1 − q(1 year)/qi.

**Why is EUR so large with b above 1?** For b ≥ 1 the cumulative grows without limit as time goes on, so the economic limit or the terminal decline is what stops it.

**Is this a reserves booking?** No. It is a study and planning aid; reserves reports follow the rules of your regulator or the SPE-PRMS and need a qualified evaluator.

**Is my data uploaded?** No. All fitting happens in your browser and it works offline.
