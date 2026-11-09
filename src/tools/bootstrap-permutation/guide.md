---
name: Bootstrap and permutation test tool
num: 562
shelf: science
section: statistics
title: "Bootstrap confidence interval and permutation test calculator (BCa, percentile, seeded)"
summary: "Bootstrap confidence intervals (percentile and BCa) for a mean, median, standard deviation, correlation or difference, and permutation tests for two groups, paired data and correlations. Seeded so results repeat, with histograms. Matches scipy."
status: live
ads: true
order: 562
icon: chart
works: offline
updated: 2026-11-09
related: [hypothesis-tests, effect-size-converter, uncertainty-calculator, plot-maker, data-cleaner, distribution-explorer, bayesian-ab-test, regression-workbench, sample-size]
sources:
  - "Methods: Efron and Tibshirani (1993), An Introduction to the Bootstrap; as in scipy.stats.bootstrap and scipy.stats.permutation_test. Example data made up."
flow:
  - { icon: table, label: "Paste data" }
  - { icon: sliders, label: "Resamples" }
  - { icon: chart, label: "Interval, p" }
---

## What it does

The bootstrap gives a confidence interval for almost any statistic without formulas or a normal distribution: it resamples your own data thousands of times and looks at how much the statistic moves. A permutation test gives a p-value the same way: it shuffles the data as if there were no effect and counts how often the shuffled result is at least as extreme as yours. This tool does both in your browser, and shows the resampled values as histograms.

You can estimate:

- **One sample:** the mean, median or standard deviation.
- **Two separate groups:** the difference in means or medians (each group is resampled on its own), with a permutation test that shuffles the group labels.
- **Pairs:** Pearson or Spearman correlation (pairs are resampled together; the test shuffles y against x) or the mean of paired differences (the test flips the sign of each difference).

Compare it with the classic tests in the [[hypothesis-tests|hypothesis test chooser]], and turn the difference into a standard effect size with the [[effect-size-converter]].

## How to use it

1. Pick what to estimate, then paste your data or open a CSV, TSV or Excel file. Groups go in columns with optional names in the first row; pairs go as two columns with one row per subject.
2. **Resamples** sets how many times the data are resampled (9,999 is a good default; more gives steadier edges).
3. **Seed** fixes the random numbers, so the same data and seed always give the same answer: write it down with your result. "New random seed" shows how much the answer moves by chance.
4. Choose the confidence level and the permutation test's direction, or turn the test off.
5. Download the results, the resampled values (CSV), or a report as an image, PDF or Word file.

## Percentile or BCa?

The **percentile** interval takes the middle 95 % of the bootstrap values. The **BCa** (bias-corrected and accelerated) interval shifts those cut-offs to correct for bias (z₀, from the share of bootstrap values below your estimate) and for skew (the acceleration a, from leaving out one value at a time). BCa is usually more accurate and is the one shown first.

The permutation p-value is exact when every possible arrangement fits in the number of resamples (for example 2 groups of 6 and 5 have 462 splits). Otherwise random arrangements are used and the p-value is (count + 1) / (resamples + 1), so it is never exactly zero.

## Worked example

The two-group example has ten times with an old method (mean 15.64) and eight with a new one (mean 12.46). The difference in means is 3.178. With 9,999 resamples and seed 12345, the 95 % BCa interval is 1.935 to 4.681 and the percentile interval 1.867 to 4.58, with a bootstrap standard error of 0.6986. The permutation test gives p = 0.0006, so the methods clearly differ.

For the correlation example (hours studied against score) Pearson r = 0.9629 with a BCa interval of 0.8734 to 0.9905, and the permutation p-value is 0.0002.

## Limits and tips

The bootstrap needs a reasonable sample: with fewer than about 10 values per sample intervals are too narrow. Medians of small samples sit on a few data values, so their intervals do too. Up to 200,000 resamples and 20,000 values per column; large data with many resamples can take a few seconds.

## Frequently asked questions

**Why does my answer differ a little from R or Python?** Different software uses different random numbers. With the same distribution of resampled values, the percentile and BCa intervals here match scipy.stats.bootstrap exactly; with its own random numbers scipy agrees within ordinary Monte Carlo error.

**Is my data uploaded?** No. Everything runs in your browser and the page works offline.

Run the classical tests with the [hypothesis test chooser and runner](/science/hypothesis-tests/).
