---
name: Curve fitter
num: 976
shelf: science
section: general-physics-lab-helpers
title: "Curve fitter: linear and nonlinear least squares with residuals, chi-square and parameter uncertainties"
summary: "Fit a straight line, polynomial, exponential, power law, Gaussian, sine wave or your own formula to x, y data, weighted by the y uncertainties if you have them, and get each parameter with its uncertainty and 95 % interval, chi-square, reduced chi-square and p-value, residuals and correlations."
status: live
ads: true
order: 12
icon: curve
works: offline
updated: 2026-11-09
related: [uncertainty-calculator, plot-maker, optical-tweezers, sig-fig-checker, calibration-curve, graph-digitizer, oscilloscope-viewer, regression-workbench]
sources:
  - "Weighted least squares, Levenberg-Marquardt, parameter covariance, chi-square goodness of fit: standard methods, for example Bevington, P. R. and Robinson, D. K. (2003), Data Reduction and Error Analysis for the Physical Sciences; Press, W. H. et al., Numerical Recipes (incomplete gamma function)."
  - "Checked against scipy.optimize.curve_fit (absolute_sigma=True for weighted fits) and scipy.stats.chi2.sf on the example data for every built-in model, written for the tests; parameters agree to 1e-8 and uncertainties to 1e-7."
  - "The example data (counts against time) are made up."
flow:
  - { icon: table, label: "Data" }
  - { icon: curve, label: "Model" }
  - { icon: chart, label: "Residuals" }
  - { icon: sigma, label: "χ²" }
---

## What it does

Fitting a curve to measurements is the heart of most lab reports: a straight line through a calibration, an exponential through a decay, a Gaussian through a peak. This fitter finds the parameters that make the curve pass as close as possible to your points (least squares), tells you how well each parameter is known, and checks whether the curve actually describes the data.

It works for **straight lines and polynomials** (linear models) and for **nonlinear models** such as exponentials, power laws, Gaussian peaks and sine waves, or **any formula you type**, using the Levenberg-Marquardt method. If you have an **uncertainty for each y value**, the fit gives more weight to the better-measured points and you get a **chi-square test** of the fit.

Read data off a published graph with the [[graph-digitizer|graph digitiser]], and draw a finished figure with the [[plot-maker|plot maker]].

## How to use it

1. Paste your data (columns x, y and, if you have it, σy), or open a CSV, TSV, text or Excel file. Pick the columns if there are more.
2. Choose a **model**, or "My own formula" and type it, for example `A*exp(-x/tau) + B`. Every name other than x is a parameter.
3. The built-in models **guess starting values** from the data. For your own formula, give them as `A = 100, tau = 5, B = 10`; a nonlinear fit can fail or find the wrong minimum from a poor start.
4. Read the parameter table, the fit statistics, the plot with the fitted curve and the residual plot.
5. Download the fitted values and residuals as CSV, or the report as an image, PDF or Word file.

## Reading the results

- **Std. uncertainty** is the one-standard-deviation uncertainty of each parameter; the **95 % interval** uses Student's t for your degrees of freedom. The **Written** column rounds each pair the way a report would.
- **χ²** adds up (residual ÷ σ)². With honest uncertainties and the right model, the **reduced χ²** (χ² ÷ degrees of freedom) is about 1. Much larger means the model misses something or the σ are too small; much smaller means the σ are probably too large. The **p-value** puts a number on it.
- **Residuals** should scatter evenly about zero. A curve or trend in them means the model is wrong, even if R² is high.
- **Correlations** near ±1 mean two parameters trade off against each other and are poorly separated by your data.
- Without σ, the uncertainties come from the scatter of the residuals. With σ they are absolute; tick **scale by √(χ²/dof)** if your σ are only relative (this matches most spreadsheet and curve-fitting programs).

## Worked example

The example is a made-up count rate falling with time, with σ = √counts. Fitting **exponential decay with offset**, y = a·exp(−x/t) + c, gives **t = 4.56 ± 0.52** s, a = 109.5 ± 7.3 and c = 10.9 ± 2.1, with **χ²/dof = 0.764 (p = 0.74)**: consistent with the uncertainties. A **straight line** gives χ²/dof = 5.90 with p = 3.3 × 10⁻¹⁵, clearly the wrong model, even though its R² is not far off. Removing the weights (choose "None" for the uncertainty) gives t = 4.83 ± 0.55 with R² = 0.9651.

## FAQ

**Which model should I choose?** The one your physics predicts. Comparing models by AIC (lower is better) helps when you are unsure, but more parameters always fit a little better.

**My fit fails to converge.** Give better starting values, check the units, and try a simpler model first.

**Do my data leave this page?** No, the fit runs entirely in your browser.
