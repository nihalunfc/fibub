---
name: Reference interval calculator
num: 502
shelf: science
section: nursing-and-lab-medicine
title: "Reference interval calculator: CLSI EP28 nonparametric and Box-Cox parametric limits with confidence intervals"
summary: "Paste results from healthy reference people and get the central 95 % reference interval by the CLSI rank method with 90 % confidence intervals, a parametric interval on the raw, log or Box-Cox scale, Tukey or Dixon outlier screens, a Harris-Boyd check for subgroups and a histogram."
status: live
ads: false
order: 42
icon: ruler
works: offline
updated: 2026-11-09
related: [bland-altman, method-validation, calibration-curve, uncertainty-calculator, sample-size, non-detects]
sources:
  - "Nonparametric rank method and 90 % CIs of the limits: CLSI EP28-A3c, Defining, establishing and verifying reference intervals in the clinical laboratory (2008, reaffirmed 2010)."
  - "Dixon's 1/3 rule for reference data: Reed AH, Henry RJ and Mason WB (1971), Clinical Chemistry 17:275-284. Tukey fences on transformed data: Horn PS, Feng L, Li Y and Pesce AJ (2001), Clinical Chemistry 47:2137-2145."
  - "Box-Cox transformation: Box GEP and Cox DR (1964), Journal of the Royal Statistical Society B 26:211-252. Exact CIs of a normal quantile by the noncentral t distribution."
  - "Partitioning: Harris EK and Boyd JC (1990), Clinical Chemistry 36:265-270."
  - "Sample data: made up for this page."
flow:
  - { icon: table, label: "Results" }
  - { icon: target, label: "Outliers" }
  - { icon: ruler, label: "Limits" }
  - { icon: chart, label: "Histogram" }
---
## What it does

Every lab result is read against a **reference interval**: the range that holds the central 95 % of results from healthy people. Labs are expected to set or check these intervals for their own method and population. This tool works one out from your own reference results, in your browser, following the methods of CLSI EP28-A3c.

You get the **nonparametric** interval (the 2.5th and 97.5th percentiles by the CLSI rank method) with **90 % confidence intervals** of each limit from order statistics, a **parametric** interval (mean ± 1.96 SD) on the raw, log or **Box-Cox** scale with exact confidence intervals, an **outlier screen** (Tukey fences or Dixon's 1/3 rule), a **Harris-Boyd** check of whether two subgroups such as women and men need separate intervals, and a histogram with both sets of limits.

## How to use it

1. Paste one result per line. To check subgroups, add a second column with the group name (exactly two groups, such as F and M). A header row is fine. Or open a CSV or Excel file.
2. Choose the interval, the confidence level of the limits, the parametric scale and the outlier screen.
3. Look at the flagged results. Tick **Leave out flagged results** only when you can explain them.
4. Read the table, the notes and the histogram, then download the CSV or a report.

## The options

- **Interval.** Central 95 % is standard (limits at the 2.5th and 97.5th percentiles). 90 % and 99 % are there for special uses.
- **CIs of the limits.** CLSI uses 90 %. The nonparametric CI needs at least 119 results for 90 % (and more for 95 %); with fewer the page says so.
- **Parametric scale.** Raw assumes the results follow a normal (Gaussian) curve. Log suits most skewed lab analytes. Box-Cox finds the power λ that makes the data most normal by maximum likelihood (λ = 1 is no change, 0 is log). The limits are worked out on that scale and transformed back.
- **Outlier screen.** Tukey fences flag values below Q1 − 1.5 IQR or above Q3 + 1.5 IQR, on the parametric scale. Dixon's rule (Reed and colleagues) flags the largest or smallest value when its gap to the next value is more than a third of the range, and repeats. Dixon's rule can miss two outliers close to each other, which is why Tukey's fences on transformed data are often preferred.

## Formulas

Nonparametric: sort the n results; the lower limit is at rank 0.025 × (n + 1) and the upper at 0.975 × (n + 1), interpolating between neighbours. The 90 % CI of the lower limit runs from order statistic r to s, where r is the largest rank with P(B ≤ r − 1) ≤ 0.05 and s the smallest with P(B ≤ s − 1) ≥ 0.95 for B ~ Binomial(n, 0.025); the upper limit mirrors it. For n = 120 that gives ranks 1 and 7, as in CLSI's table. Parametric: limits = mean ± 1.96 SD on the chosen scale; each limit's CI comes from the noncentral t distribution. Harris-Boyd: z = |m₁ − m₂| ÷ √(s₁²/n₁ + s₂²/n₂) and z* = 3 √(n̄ ÷ 120) with n̄ the mean group size; separate intervals are advised if z > z* or if the larger SD is more than 1.5 times the smaller.

## Worked example

The sample is 240 made-up results in U/L, 120 labelled F and 120 M, with two planted outliers (118 and 140). The page shows a nonparametric interval of 13 to 44.97 U/L, read from ranks 6.025 and 234.975; the 90 % CIs use order statistics 2 and 11 from each end, giving 11 to 13 for the lower limit and 41 to 118 for the upper one, stretched by the outliers. On the log scale the parametric interval is 12.18 to 47.71 U/L. Tukey's fences on the logs flag 3 results: 10, 118 and 140. Leaving them out gives 13 to 43.05 U/L, with the upper limit's CI now 39 to 48, and a parametric interval of 13.01 to 43.74. Dixon's rule flags nothing here, because the two outliers mask each other. Harris-Boyd gives z = 5.20 against z* = 3, so F (11 to 43.85) and M (15.03 to 47.92) need separate intervals.

All these numbers match NumPy (percentiles, method "weibull") and SciPy (binomial ranks, Box-Cox λ, noncentral t).

## Tips

- Choose reference people carefully and write down how: the statistics cannot fix a poorly chosen group.
- Collect at least 120 per subgroup for the nonparametric method. With fewer, a parametric method on a suitable scale, or verifying a published interval with 20 local results (CLSI EP28), may be better.
- Check the histogram: two humps suggest mixed subgroups.

## FAQ

**Which interval should I report?** CLSI prefers the nonparametric one. Use the parametric one when the data fit the scale well (skewness near 0 on that scale) and you have fewer results.

**Is my data uploaded?** No. Everything stays in your browser and the page works offline.
