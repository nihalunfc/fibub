---
name: Regression (OLS, IV and panel)
num: 744
shelf: science
section: econometrics
seoTitle: "Econometrics regression: robust SEs, IV and panel FE"
title: "Regression calculator: OLS with robust and clustered SEs, IV/2SLS and panel fixed effects (free)"
summary: "Run OLS with classical, robust (HC0 to HC3) or clustered standard errors, two-stage least squares with the first-stage F, or panel fixed effects with entity and time effects, from a CSV. Coefficients, t, p, confidence intervals and R², matching statsmodels and linearmodels."
status: live
ads: true
order: 744
icon: sigma
works: offline
updated: 2026-11-09
related: [data-cleaner, plot-maker, trend-analyser, sample-size, difference-in-differences, unit-root-cointegration, gravity-model, regression-workbench, hypothesis-tests, csv-profiler]
sources:
  - "Formulas: White (1980) and MacKinnon and White (1985) for HC0 to HC3; Liang and Zeger (1986) for clustered errors; two-stage least squares and the within estimator as in Wooldridge, Econometric Analysis of Cross Section and Panel Data. Example data made up."
flow:
  - { icon: table, label: "Your CSV" }
  - { icon: sliders, label: "Pick model" }
  - { icon: sigma, label: "Estimate" }
  - { icon: download, label: "Report" }
---

## What it does

This is a regression calculator for economics and the social sciences that runs entirely in your browser. Open a CSV or paste a table, pick the outcome and the explanatory variables, and choose one of three estimators:

- **OLS** (ordinary least squares), with classical standard errors, heteroskedasticity-robust standard errors (HC0, HC1, HC2 or HC3), or standard errors clustered by any column such as school, firm or region.
- **IV (2SLS)**: two-stage least squares for a regressor that is endogenous, using one or more excluded instruments. The tool also shows the **first-stage F** and partial R² for each endogenous variable, so you can see whether the instruments are strong.
- **Panel fixed effects**: the within estimator, with entity effects and, if you tick it, time effects as well (two-way fixed effects). It works with unbalanced panels.

You get a coefficient table with standard errors, t statistics, p-values and confidence intervals, plus R², adjusted R², a Wald F test of all slopes, the residual standard error, and a plot of residuals against fitted values. Download the report as an image, PDF or Word file, or the coefficients as CSV.

Clean and check your data first with the [[data-cleaner]], and test whether time series drift with [[unit-root-cointegration|unit root and cointegration tests]].

## How to use it

1. Paste your data or use **Open a file**. The first row must hold the column names. Each row is one observation; for a panel, one row per entity and period.
2. Pick **OLS**, **IV (2SLS)** or **Panel fixed effects**.
3. Choose the **outcome** and tick the **explanatory variables**. For IV, also tick the endogenous variables and the excluded instruments (the instruments must not appear among the explanatory variables).
4. Choose the **standard errors**. If you choose clustered, pick the column with the groups. For panels, pick the entity and time columns.
5. Rows with a blank or non-numeric cell in any variable you use are left out, and the tool says how many.

## The options in one line each

- **Classical**: assumes every error has the same spread and errors are independent.
- **HC0**: White's robust standard errors, valid when the spread differs between observations.
- **HC1**: HC0 times n/(n − k), the same as Stata's "robust".
- **HC2 and HC3**: adjust each residual for its leverage; HC3 is the safer choice in small samples.
- **Clustered**: allows errors to be correlated inside a group. For OLS, tests use G − 1 degrees of freedom, where G is the number of clusters.
- **Time effects**: adds a dummy for each period, removing shocks that hit every entity in the same year.

## Worked example (made-up data)

The sample is a made-up panel of 15 people over 4 years, with log wage, years of schooling (educ), experience, union membership and the distance to the nearest college when they were young.

**OLS:** log_wage on educ, exper and union gives educ = 0.0582 (SE 0.0145, p = 0.0002), exper = 0.0426 and union = 0.0593 (p = 0.29), with R² = 0.3128 and F(3, 56) = 8.50. With HC3 robust errors, the SE of educ becomes 0.0170.

**IV:** schooling is likely endogenous, because unmeasured ability raises both schooling and wages. Using distance as the instrument for educ, the first-stage F is 204.4 (strong), and the 2SLS estimate of educ falls to 0.0292 (SE 0.0170, p = 0.09). The OLS estimate was pushed up by ability.

**Fixed effects:** with person effects, exper = 0.0473 (SE 0.0105) and union = 0.0739 (SE 0.0431), within R² = 0.3360. Schooling is left out with a note, because it never changes within a person, so the person effects absorb it.

## How it was checked

Every number is checked against statsmodels (OLS, all five covariance types, with t-based inference) and linearmodels (IV2SLS with debiased=True, and PanelOLS with its defaults), on the example data and on an unbalanced panel. They agree to at least nine significant figures.

## Frequently asked questions

**Which robust option should I use?** HC1 is the most widely reported; HC3 is better below about 250 observations. Clustering is needed when observations in the same group share shocks.

**Can I use text categories?** Explanatory variables must be numbers. Make 0/1 dummy columns first (the data cleaner can help). Text columns can still be the cluster, entity or time column.

**Why can R² be negative for IV?** 2SLS does not minimise the residual sum of squares, so R² is not a measure of fit there. Judge an IV model by its first stage and its reasoning instead.

**Is my data uploaded?** No. Everything runs in your browser and the page keeps working offline.
