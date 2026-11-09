---
name: Bland-Altman agreement plot
num: 471
shelf: science
section: biostatistics
title: "Bland-Altman plot calculator: bias, limits of agreement with confidence intervals and Lin's CCC"
summary: "Paste paired results from two methods and get the Bland-Altman plot, the bias and limits of agreement with exact or approximate confidence intervals, a proportional bias test, percentage or ratio scales, and Lin's concordance correlation coefficient."
status: live
ads: false
order: 11
icon: chart
works: offline
updated: 2026-11-09
related: [method-validation, calibration-curve, reliability-analysis, sample-size, uncertainty-calculator, plot-maker, roc-curve, gauge-rr, diagnostic-test-calculator]
sources:
  - "Bias and limits of agreement: Bland JM and Altman DG (1986), The Lancet 327:307-310; approximate intervals of the limits: Bland and Altman (1999), Statistical Methods in Medical Research 8:135-160."
  - "Exact intervals of the limits by the noncentral t distribution: Carkeet A (2015), Optometry and Vision Science 92:e71-e80."
  - "Concordance correlation coefficient and its z-transform interval: Lin LI (1989), Biometrics 45:255-268, corrected in Biometrics 56:324-325 (2000)."
  - "Sample data: made up for this page."
flow:
  - { icon: table, label: "Pairs" }
  - { icon: sigma, label: "Bias" }
  - { icon: chart, label: "Limits" }
  - { icon: download, label: "Plot, CSV" }
---

## What it does

When a new meter, a point-of-care device or a cheaper lab method is compared with an established one, a correlation coefficient is the wrong question: two methods can correlate almost perfectly and still disagree by a clinically important amount. The **Bland-Altman** method asks the right one: how far apart are the two results for the same sample, and how far apart could they be for most samples? This tool works it out from your paired results and draws the plot, all in your browser.

You get the **bias** (the mean difference, method A minus method B) with its confidence interval, the **limits of agreement** (bias ± 1.96 standard deviations of the differences, the range that should hold 95 % of differences) with exact or approximate confidence intervals for each limit, a test for **proportional bias** (do the differences grow with the size of the result?), and **Lin's concordance correlation coefficient** (CCC), which measures agreement with the line of equality.

Fit a calibration line for each method first with the [[calibration-curve]], and for a full validation of a new lab method use [[method-validation]].

## How to use it

1. Paste two columns: the result by method A and by method B, one subject or sample per line. A header row is used for the method names, and an ID column before them is skipped. Or open a CSV or Excel file.
2. Type the unit, then pick the options below. Everything updates as you type.
3. Read the plain summary, the key numbers and the plot. Download the plot as PNG, the pairs and statistics as CSV, or a report as an image, PDF or Word file.

## The options

- **Scale.** *Difference* uses A − B in your units. *Percentage difference* uses (A − B) divided by the mean of the pair, times 100: use it when the differences fan out as values get larger. *Ratio* works on ln(A ÷ B) and shows the mean ratio and limits as ratios (1.05 means A reads 5 % higher); it needs every result above zero.
- **Plot against.** The usual x axis is the mean of the two methods. If B is a true reference method, some prefer to plot against B alone (Krouwer 2008).
- **Limits of agreement.** 95 % (± 1.96 SD) is standard; 90 % and 99 % are offered for special cases.
- **Confidence intervals.** The level of the intervals for the bias, the limits and the regression slope.
- **Interval method.** *Exact* treats each limit as a normal quantile, bias ± z·SD, and finds its interval from the noncentral t distribution (Carkeet 2015). *Approximate* uses Bland and Altman's 1999 standard error, SD × √(1/n + z²/(2(n − 1))), with a t multiplier. The two agree closely for 50 or more pairs; with small samples the exact interval is wider on the outer side.
- **Proportional bias line.** The least squares line of the difference on the x value, with its slope, interval and p value. A slope clearly different from zero means the bias depends on the size of the result.

## Formulas

Differences d = A − B (or the percentage or log ratio). Bias = mean of d; s = SD of d with n − 1. Limits = bias ± z·s, where z is the normal quantile (1.96 for 95 %). Interval of the bias = bias ± t(n − 1)·s/√n. Lin's CCC = 2·s_AB / (s_A² + s_B² + (mean A − mean B)²) with n in the denominators, and its interval comes from Fisher's z transform with Lin's standard error, as in R's DescTools and epiR packages. The CCC equals Pearson's r times a bias correction factor Cb that falls below 1 when the two methods differ in mean or spread.

## Worked example

The sample is 30 made-up pairs of glucose-like results in mmol/L, from "Meter A" and "Lab analyser B". The page shows a bias of 0.4433 mmol/L (95 % CI 0.2040 to 0.6827): the meter reads about 0.44 mmol/L high on average. The 95 % limits of agreement are −0.8129 mmol/L (95 % CI −1.324 to −0.4863) and 1.700 mmol/L (95 % CI 1.373 to 2.210), so for 95 % of samples the meter should be between about 0.8 below and 1.7 above the analyser. No pair falls outside the limits. The proportional bias slope is 0.0546 with p = 0.0542, just short of significance, a hint worth checking with more data or the percentage scale. Lin's CCC is 0.9825 (95 % CI 0.9656 to 0.9911). With the approximate method the upper limit's interval becomes 1.286 to 2.113.

These numbers match NumPy and SciPy (scipy.stats.nct for the exact intervals, scipy.stats.linregress for the slope) to at least six figures.

## Tips

- Decide the largest difference that would not matter clinically before you look at the limits; the statistics cannot decide that for you.
- Use at least 40 to 100 pairs that cover the whole measuring range. Limits from 10 pairs have very wide intervals.
- Each subject should appear once. Repeated measurements on the same people need the repeated-measures version of the method.
- Look at the plot: a funnel shape points to the percentage or ratio scale, a slope to proportional bias, and a few far-off points to sample mix-ups.

## FAQ

**Why not just use the correlation?** Correlation measures how well one method predicts the other, not whether they give the same number. Methods that differ by a constant 2 mmol/L correlate perfectly.

**Are the limits of agreement a test?** No. They describe the spread of differences. Whether they are narrow enough is a clinical judgement.

**Is my data uploaded?** No. Everything runs in your browser and the page keeps working offline.
