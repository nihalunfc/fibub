---
name: Fish length-weight
num: 331
shelf: science
section: marine-and-freshwater-biology
title: "Fish length-weight relationship calculator: W = aL^b, isometry test, Fulton's K and relative condition Kn"
summary: "Paste lengths and weights of fish and fit the length-weight relationship W = aL^b on log scales, with an optional bias correction, a t test of b against 3 (isometric growth), Fulton's condition factor K and Le Cren's relative condition Kn for every fish, plots and CSV."
status: live
ads: true
order: 331
icon: ruler
works: offline
updated: 2026-11-09
related: [biodiversity-indices, trend-analyser, plot-maker, sample-size, field-sampling-planner, von-bertalanffy-fitter, zooplankton-biomass, stocking-density-calculator, cpue-trend, yield-per-recruit]
sources:
  - "Method: E. D. Le Cren, Journal of Animal Ecology 20, 201-219 (1951) for W = aL^b and relative condition Kn; R. Froese, Journal of Applied Ichthyology 22, 241-253 (2006) for the review of a, b and condition factors; D. G. Sprugel, Ecology 64, 209-210 (1983) for the log-normal bias correction. Formulas only."
  - "Checked in the tests against Python: scipy.stats.linregress on log₁₀ values, statsmodels OLS t_test of b = 3, scipy.stats.t for the interval, and NumPy for the correction factor, Fulton's K and Kn."
  - "The example fish are made up."
flow:
  - { icon: table, label: "Lengths" }
  - { icon: curve, label: "Fit aL^b" }
  - { icon: target, label: "b vs 3" }
  - { icon: download, label: "K and Kn" }
---

## What it does

The weight of a fish rises roughly with the cube of its length. Fisheries biologists describe the relationship for a stock as **W = a·L^b**, fitted to measured fish. The exponent **b** tells you about shape: b = 3 is **isometric** growth (the fish keeps its shape as it grows); b above 3 means it gets relatively plumper (**positive allometry**), and below 3 relatively slimmer (**negative allometry**). The relationship is also used to turn length samples into weights, and to judge the **condition** (fatness) of individual fish.

This tool fits W = a·L^b by least squares on log₁₀ W against log₁₀ L, tests whether b differs from 3, and works out two condition indices for every fish:

- **Fulton's condition factor K = 100·W/L³** (W in g, L in cm). Simple, but it assumes isometric growth, so it drifts with length when b is not 3.
- **Le Cren's relative condition Kn = W / (a·L^b)**: the fish's weight divided by the weight expected for its length. Kn = 1 is an average fish; 1.1 is 10 % heavier than expected.

Fit growth with age using the [[von-bertalanffy-fitter]], and see how catch rates change over the years with the [[cpue-trend]] tool.

## How to use it

1. Paste one row per fish: an optional name or number, then length and weight. Or open a CSV, TSV, TXT or Excel file. With a header row containing "length" and "weight", the columns can be in any order.
2. Choose the **units**: length in cm or mm, weight in g or kg. Results are given for cm and g, the usual units for a and b.
3. **Bias correction of a**: back-transforming a log-scale fit predicts the median, not the mean, weight. Turning this on multiplies a by CF = exp(s²·(ln 10)²/2), where s is the residual SD on the log₁₀ scale. The correction is usually tiny for good data.
4. **Confidence**: 95 or 99 % for the interval of b.
5. **Kn from**: this fit, or your own a and b (in cm and g), for example the relationship from a reference period or another stock.

## Worked example

The 20 made-up fish range from 8.6 to 28.9 cm. The page shows **W = 0.01050 × L^3.089 (positive allometric)**:

- b = 3.089 ± 0.031, 95 % interval 3.025 to 3.154. The interval does not include 3.
- The test of b = 3 gives t = 2.91 on 18 df, p = 0.0093, so these fish get relatively heavier as they grow.
- R² on the log scale is 0.9982; the bias correction factor is 1.0013 (uncorrected a = 0.01049).
- Mean Fulton's K is 1.35; mean Kn is 1.000 (close to 1 by design).

## Tips

- Use one length type throughout (total, fork or standard length) and say which in your report.
- Measure fish over the widest possible size range; a narrow range gives a poorly defined b.
- Fit sexes, seasons or stocks separately if they may differ, and compare their b values.
- Fish far from the line (more than 3 residual SDs) are marked with "!". They are often typing slips, such as a weight in kg among grams.
- Most b values fall between 2.5 and 3.5; values outside this usually point to a data problem.

## FAQs

**Why fit on logs rather than a curve?** Variation in weight grows with size, and the log fit gives each fish fair weight. It is the standard method, so a and b compare with published values.

**Should I use K or Kn?** Kn, when you compare fish of different lengths and b is not 3. K is fine for fish of similar size.

**Is my data uploaded?** No. Everything runs in your browser.
