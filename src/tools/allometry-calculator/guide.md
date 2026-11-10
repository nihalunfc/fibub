---
name: Allometry calculator
num: 317
shelf: science
code: T232
section: zoology-and-animal-behaviour
title: "Allometry calculator: fit Y = aM^b scaling with confidence limits (free)"
summary: "Paste body masses and a trait such as metabolic rate and fit the allometric equation Y = aM^b by log-log regression, with confidence limits, a test of the exponent against 3/4 or 2/3, and predictions. Also scaling laws with editable, illustrative coefficients. Runs in your browser."
status: live
ads: true
order: 317
icon: curve
works: offline
updated: 2026-11-09
related: [plot-maker, calibration-curve, uncertainty-calculator, tree-carbon, respirometry-calculator, fish-length-weight, regression-workbench, body-mass-estimator, von-bertalanffy-fitter]
sources:
  - "Allometric equation and log-log fitting: Huxley, J. S. (1932), Problems of Relative Growth; Kleiber, M. (1932), Hilgardia 6: 315–353 (the 3/4 exponent)."
  - "Back-transformation bias correction: Baskerville, G. L. (1972), Canadian Journal of Forest Research 2: 49–53; Sprugel, D. G. (1983), Ecology 64: 209–210."
  - "Least squares and t-based limits: standard regression formulas. Checked against Python scipy.stats.linregress and scipy.stats.t on the page's example."
flow:
  - { icon: table, label: "Paste data" }
  - { icon: curve, label: "Log-log fit" }
  - { icon: sigma, label: "Exponent" }
  - { icon: calculator, label: "Predict" }
---

## What it does

Many traits of animals and plants change with body size as a power law, Y = a M^b. Metabolic rate, heart rate, lifespan, home range size, bone length and leaf area all follow this pattern, each with its own exponent b. On a log-log plot a power law is a straight line, so b is the slope and a is the value of Y at a mass of 1. This calculator fits that line to your own data, tells you how precise a and b are, tests whether your exponent differs from a theoretical value such as 3/4 or 2/3, and predicts Y for a new mass. A second panel works out the classic scaling laws for any mass, with coefficients you can edit. Everything runs in your browser.

Fit and test the line itself in the [[regression-workbench|regression workbench]], and estimate body mass from bones with the [[body-mass-estimator|body mass estimator]].

## How to use it

1. Paste two columns, **mass** then **Y**, or three columns with a **name** first. A header row is fine and is skipped. You can also open a CSV or Excel file.
2. Type the **mass unit** and the **Y name and unit**; they label the chart and the report.
3. Choose the **confidence** level, the exponent to **test b against**, and a mass to **predict** Y at.
4. Download the fit as CSV, or the report as an image, PDF or Word file.

## What each result means

- **Exponent b** with its standard error and confidence limits. b = 1 means Y grows in proportion to mass; b below 1 means bigger animals have less Y per kilogram.
- **Coefficient a**: Y at M = 1 in your mass unit. Changing the unit (grams instead of kilograms) changes a but not b.
- **R²** on the log scale, and the **scatter about the line** as a factor: a scatter of 0.065 log₁₀ units means a typical point is within about ×1.16 of the line.
- **Bias correction factor**: a prediction made by back-transforming the log line is the median, not the mean. Multiply by this factor, exp((s ln 10)² / 2), if you need the mean.
- **b against …**: a t test of your slope against the value you typed. If the value sits inside the confidence limits there is no clear difference.
- **Prediction** limits: the narrower pair is for the line itself; the wider pair is for one new species or individual.

## Scaling laws

The lower panel uses well-known exponents: 3/4 for whole-body metabolic rate (Kleiber), −1/4 for metabolic rate per kilogram and for heart rate, 1/4 for lifespan and 2/3 for surface area. The coefficients are **illustrative** round numbers chosen to show how each law behaves; they are not values for any group of animals. Replace a, and b if you wish, with figures for your group from a source you trust. The table shows Y from 10 g to 1 tonne and how many times the 1 kg value it is.

## Worked example

The page opens with 14 made-up species from 48 g to 67 kg. The fit is **Y = 3.532 × M^0.7415**, with b = 0.7415 ± 0.017 and 95 % limits 0.7036 to 0.7794, a = 3.532 (3.237 to 3.854) and R² = 0.9935. Tested against 0.75, t = −0.489 and p = 0.63, so the exponent is consistent with 3/4; 2/3 lies outside the limits. At 50 kg the predicted metabolic rate is 64.24 W, with limits for the line of 54.40 to 75.85 W and for one new species of 44.57 to 92.58 W. In the scaling-laws panel, the illustrative Kleiber law gives 3.4 × 70^0.75 = 82.28 W for a 70 kg animal.

## Frequently asked questions

**Why ordinary least squares and not reduced major axis?** Least squares is right when you want to predict Y from mass, which is what this tool does. If both variables have large measurement errors and you only want the slope, a reduced major axis line will give a steeper exponent.

**Can I mix species of very different groups?** You can, but different groups often have different coefficients, and the pooled exponent may mislead. Fit each group separately and compare their limits.

**Is my data sent anywhere?** No. It stays in your browser, and the page works offline once loaded.
