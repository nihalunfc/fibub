---
name: Regression workbench
num: 561
shelf: science
section: statistics
title: "Regression calculator: multiple, polynomial and logistic regression with p-values, VIF, Cook's distance and residual plots"
summary: "Paste a table or open a CSV or Excel file and fit a multiple linear, polynomial or logistic regression. Get coefficients with standard errors, t or z tests, p-values and confidence intervals, R², adjusted R², AIC and BIC, odds ratios, predictions with intervals, and the diagnostic plots: residuals, Q-Q, leverage and Cook's distance, with VIF. Matches statsmodels."
status: live
ads: false
order: 561
icon: chart
works: offline
updated: 2026-11-09
related: [distribution-explorer, calibration-curve, plot-maker, data-cleaner, sample-size]
sources:
  - "Methods: least squares by Householder QR; logistic regression by iteratively reweighted least squares; standard textbook formulas for leverage, studentized residuals, Cook's distance, VIF and Durbin–Watson."
  - "Checked against statsmodels 0.15.0 (OLS, Logit, GLM Binomial influence, variance_inflation_factor, get_prediction) on all three examples, and against 60-digit mpmath for a badly conditioned degree-5 polynomial."
  - "The three example data sets (plant growth, stopping distance, exam results) are made up for this tool."
flow:
  - { icon: table, label: "Paste data" }
  - { icon: sliders, label: "Pick model" }
  - { icon: sigma, label: "Coefficients" }
  - { icon: chart, label: "Diagnostics" }
---

## What it does

Regression explains one column (the response, y) with others (the predictors, x). This workbench fits three kinds:

- **Linear**, with one or many predictors (multiple regression). A predictor with text in it, such as a soil type or a treatment group, is turned into groups, each compared with the first group in A–Z order.
- **Polynomial** in one predictor, up to degree 6, for curved relationships.
- **Logistic**, for a yes/no response (0/1, pass/fail, alive/dead). It gives odds ratios and the chance of “yes” for any x.

For each fit you get the equation; a coefficient table with the estimate, standard error, t (or z) statistic, p-value and confidence interval; R² and adjusted R² (McFadden's R² for logistic); the overall F or likelihood-ratio test; AIC, BIC and the log-likelihood; and a predictor box that gives the predicted value with a confidence interval for the mean and a prediction interval for one new value.

## Checking the model

A regression is only as good as its assumptions, so the page draws the standard diagnostic plots:

- **Data with the fitted line or curve** and its confidence and prediction bands (for one predictor), or observed against fitted values (for several).
- **Residuals against fitted values**: you want a shapeless cloud. A curve means a missing term; a funnel means the spread changes.
- **Normal Q-Q plot** of standardized residuals: points near the line mean the errors look normal.
- **Leverage against studentized residual**, and **Cook's distance** for every row. Rows that stand out are listed so you can check them for typing mistakes.
- **VIF** (variance inflation factor) for each predictor: above about 5, predictors overlap so much that their separate effects are uncertain.
- **Durbin–Watson**: near 2 means neighbouring residuals are not correlated (matters for data in time order).

## How to use it

1. Paste a table with a header row, open a CSV or Excel file, or start from an example.
2. Choose the model type, the response and the predictors (or, for a polynomial, the x and the degree).
3. Leave the intercept on unless theory says the line must pass through zero.
4. Read the coefficient table and the plots; type values in **Predict** to use the model.
5. Download the coefficients and the residuals as CSV, or the whole report as an image, PDF or Word file.

## Worked example

The first example is made-up plant growth: height (cm) against fertiliser (g), water (mL a day), light (hours) and soil type, 32 plants. The fit gives **R² = 0.8555, adjusted R² = 0.8278 (n = 32)**, F(5, 26) = 30.79 with p = 3.89 × 10⁻¹⁰. Each extra gram of fertiliser adds 1.8328 cm (p = 1.21 × 10⁻⁸), other things equal. Loam is 2.1123 cm taller than clay, but p = 0.154, so the data cannot tell that apart from no difference. All VIFs are below 1.7. For 5 g of fertiliser, 250 mL of water, 8 hours of light and loam, Predict gives 40.94 cm, with a 95 % prediction interval of 34.43 to 47.45 cm.

The logistic example (made-up exam results for 40 students) gives an odds ratio of 2.11 per hour of study: each hour roughly doubles the odds of passing. A student who studied 6 hours and did 2 practice tests has a predicted chance of 0.4314 (95 % CI 0.1969 to 0.7013).

## What it does not do

There are no interaction terms, random effects, weights, stepwise selection or robust standard errors. To model an interaction, add a column that is the product of the two predictors. For curved relationships with a known equation (such as exponential decay) a non-linear fit is better.

## Frequently asked questions

**R² went up when I added a predictor. Is the model better?** Not necessarily: R² never falls when you add a column. Compare adjusted R², AIC or BIC instead; lower AIC is better.

**What does “separation” mean?** In logistic regression, if one x splits the yeses from the noes perfectly, the best coefficient is infinite. The page warns you; the numbers are then not reliable.

**Is my data uploaded?** No. Everything runs in your browser; nothing is stored or sent.
