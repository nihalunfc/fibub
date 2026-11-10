---
name: Difference-in-differences
num: 745
shelf: science
code: T513
section: econometrics
title: "Difference-in-differences calculator with event study and parallel-trends plot (free)"
summary: "Estimate a policy effect by difference-in-differences: the 2 × 2 from group means, or a two-way fixed effects regression on panel data with unit-clustered errors, event-study coefficients with intervals and a pre-trend test. Matches statsmodels."
status: live
ads: true
order: 745
icon: chart
works: offline
updated: 2026-11-09
related: [data-cleaner, plot-maker, trend-analyser, sample-size, regression-ols-iv-panel, unit-root-cointegration, effect-size-converter, hypothesis-tests]
sources:
  - "Formulas: the difference-in-differences and two-way fixed effects estimators, cluster-robust variance (Liang and Zeger 1986) and event-study regressions as in Angrist and Pischke, Mostly Harmless Econometrics. Example data made up."
flow:
  - { icon: table, label: "Your panel" }
  - { icon: calendar, label: "Start date" }
  - { icon: chart, label: "Event study" }
  - { icon: download, label: "Report" }
---

## What it does

Difference-in-differences (DiD) estimates the effect of a policy or event by comparing how a treated group changed with how a comparison group changed over the same time. This tool does it two ways, in your browser:

- **Panel data**: one row per unit (person, firm, county) and period. The tool runs the **two-way fixed effects** regression of the outcome on treated × after, with a fixed effect for every unit and every period, and **clusters the standard errors by unit**. It also runs an **event study**: one coefficient for each period, measured against a reference period, with confidence intervals on a chart. A joint F test of the coefficients before the start checks for different trends before treatment.
- **Group means**: the classic 2 × 2 table. Enter the mean outcome for treated and comparison groups before and after; add standard deviations and group sizes to get a standard error.

A second chart shows the **group means over time** with the comparison group shifted by the average gap before the start, so you can see by eye whether the trends were parallel.

Add more controls with the [[regression-ols-iv-panel|regression tool]], and plan how many groups you need with the [[sample-size|sample size calculator]].

## How to use it

1. Choose **Panel data** and paste your table or open a CSV or Excel file. Pick the unit, period, outcome and treated-group columns. The treated column holds 1 for units in the treated group and 0 for the comparison group, in every row of that unit.
2. Enter the **period in which treatment starts**. All treated units must start in the same period.
3. The **reference period** is normally the last period before the start; pick another if you need to.
4. Read the DiD estimate, the event-study chart and the pre-trend test. Download the report as an image, PDF or Word file, or the event study as CSV.
5. With only summary numbers, choose **Group means** and fill in the four cells.

## Worked example (made-up data)

The panel holds an employment rate for 20 counties from 2015 to 2022; 8 counties started a programme in 2019. The tool gives **DiD = 2.115** percentage points (clustered SE 0.1183, 95 % CI 1.868 to 2.363, 19 degrees of freedom). The event study shows coefficients near zero before the start (2015: −0.004, 2016: 0.275, 2017: 0.167, with 2018 as the reference) and a rising effect afterwards (2019: 1.193, 2022: 3.149). The pre-trend test is F(3, 19) = 0.1616, p = 0.92, so there is no sign that the groups were drifting apart before 2019.

With **group means** of 50 and 57 (treated, n = 40 and 38) and 48 and 51 (comparison, n = 45 and 44), the DiD is 7 − 3 = **4**. With SDs of 8, 9, 7.5 and 8.2, the standard error is 2.551 and the 95 % interval is −1.038 to 9.038 (p = 0.119).

## How it was checked

The panel results match statsmodels' OLS with unit and period dummies and cov_type='cluster' (with t tests on G − 1 degrees of freedom) to at least nine significant figures: the DiD, every event-study coefficient, its standard error, p-value and interval, and the joint pre-trend F test. The 2 × 2 standard error matches statsmodels' HC2 robust errors on individual data with the same means, SDs and sizes.

## Frequently asked questions

**What if treatment starts at different times?** This tool assumes one start period. With staggered adoption, two-way fixed effects can be biased when effects change over time; use an estimator built for that (such as Callaway and Sant'Anna or Sun and Abraham).

**Does a passed pre-trend test prove parallel trends?** No. It only shows that the data before the start do not contradict them. Small samples have little power to detect a difference.

**How many units do I need?** Clustered errors need a reasonable number of clusters; with fewer than about 30 units they can be too small, and the tool says so.

**Is my data uploaded?** No. Everything runs in your browser and works offline.
