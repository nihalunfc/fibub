---
title: 'Regression for explaining: coefficients, intervals and p-values'
seoTitle: 'Regression coefficients, intervals and p-values explained'
summary: 'Read a regression table like an analyst: what a coefficient means, its standard error and confidence interval, the t-test for "no effect", R², controlling for other variables, and the assumptions to check in the residuals.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'Sales = 120 + 1.6 × ad spend. What does 1.6 mean?'
    choices: ['Each extra $1 of ads goes with $1.60 more sales, on average, in this data', 'Ads cause exactly $1.60 of sales', '1.6 % of sales come from ads']
    ans: 0
    why: 'A slope is an average association in the data. Calling it a causal effect needs an experiment or a strong design.'
  - q: 'The slope is 1.6 with 95 % CI 0.44 to 2.76. What can you say?'
    choices: ['The slope is exactly 1.6', 'A positive association is clear, but its size is uncertain: from small to large', 'There is no association']
    ans: 1
    why: 'The interval excludes 0, so the sign is clear, and its width shows how precisely the data pin the slope down.'
  - q: 'R² is 0.15 but the slope''s p-value is 0.001. Is that a contradiction?'
    choices: ['Yes, one must be wrong', 'No: the trend is clearly real, but most of the week-to-week variation comes from other things', 'Only with small samples']
    ans: 1
    why: 'p is about whether the slope is zero; R² is about how much of the spread the line explains. They answer different questions.'
---

**Module 8 · about 25 minutes · uses Lessons 5.1 and 6.3.** You'll be able to read every number in a regression table, put an interval on a coefficient, and say what it does and doesn't show.

## 1. Predicting vs explaining

ML foundations taught regression for **prediction** ([least squares](/learn/courses/ml-foundations/least-squares/), [measuring fit](/learn/courses/ml-foundations/measuring-fit/)): does it forecast well on new data? Analysts also use it for **explaining**: how much does Y change with X, and how sure are we? That needs standard errors, intervals and tests.

<!--fig:slope-ci-->

With 20 weeks and noise 25, the slope's interval is wide. Push the weeks to 100: same true line, much narrower fan. Then raise the noise: R² falls, but with enough weeks the slope stays clearly above zero.

## 2. Reading the table

| Term | Coefficient | Std. error | t | p | 95 % CI |
|---|---|---|---|---|---|
| Intercept | 120 | 28 | 4.3 | 0.0004 | 61 to 179 |
| Ad spend ($) | 1.60 | 0.55 | 2.91 | 0.009 | 0.44 to 2.76 |

- **Coefficient**: the average change in Y for one more unit of X.
- **Standard error**: how much the coefficient would vary from sample to sample.
- **t = coefficient ÷ SE**, compared with a t-distribution with `$n - k - 1$` degrees of freedom (k = number of inputs).
- **95 % CI**: coefficient ± t-critical × SE.
- **Intercept**: the predicted Y when every X is 0; often meaningless (zero ad spend may be outside the data).

## 3. Controlling for other variables

With several inputs, each coefficient is the change in Y for one more unit of that X **holding the others fixed**. Adding a confounder (store size) can shrink or even flip a coefficient (next lesson). It's a powerful tool, but only for confounders you've measured.

**Categorical inputs** enter as 0/1 dummy columns; each coefficient is the difference from a baseline category.

## 4. Check the assumptions

Look at the **residuals** (actual − fitted):

- **Straight line?** A curve in residuals vs fitted means the relationship isn't linear (try log or a squared term).
- **Even spread?** A funnel shape (bigger errors for bigger values) makes SEs wrong; use robust SEs or log the outcome.
- **Independent?** Weekly data often has runs of positive and negative residuals; standard SEs are then too small.
- **Outliers and leverage:** one extreme point can move the line a lot (Lesson 8.1).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the slope is a weighted average of the data, so it has a sampling distribution like a mean, with SE shrinking like `$1/\sqrt{n}$`.

**Simple regression:**

```math
\hat\beta_1 = \frac{\sum (x_i - \bar x)(y_i - \bar y)}{\sum (x_i - \bar x)^2}, \qquad \text{SE}(\hat\beta_1) = \frac{s}{\sqrt{\sum (x_i - \bar x)^2}}
```

where `$s = \sqrt{\text{SSE}/(n-2)}$` is the typical residual. Spreading the x values wider shrinks the SE, which is why tests with a wide range of ad spend learn more.

**Check with the table:** t = 1.60 / 0.55 = 2.91 with 18 df, p = 0.009; t-critical 2.101, so CI 1.60 ± 1.16 = 0.44 to 2.76 (scipy agrees; tests/stats.mjs checks `regress` against scipy's linregress).
</details>

## 5. Worked example

*Made-up data:* 20 weeks of ad spend and sales, both measured in hundreds of dollars, as in the table.

- "Each extra $100 of weekly ad spend went with about $160 more weekly sales (95 % CI $44 to $276)."
- R² = 0.32: ads track about a third of the week-to-week variation.
- Residuals vs fitted: no curve, no funnel; one holiday week sits high. Re-fitting without it: slope 1.45. Mention it.
- What it doesn't show: that ads *caused* the sales. Ad spend may have risen in weeks the team expected to be busy. A geo experiment (ads on in some regions, off in others) would answer that.

## 6. Practice

1. Coefficient 0.8, SE 0.5, n = 30, one input. Is the slope significant at 0.05?
2. Why might the intercept be meaningless?
3. A funnel shape appears in the residuals. Name two remedies.

<details>
<summary>Answers</summary>

1. t = 1.6 with 28 df, p ≈ 0.12. No; the CI (about −0.22 to 1.82) includes 0.
2. X = 0 may lie far outside the data (no store has zero floor space), so the line's value there is an extrapolation.
3. Model log(Y) instead of Y; use robust (heteroscedasticity-consistent) standard errors.
</details>

**Try it on your own data:** the [[regression-workbench]] tool gives the full table with standard errors, intervals, residual plots and ANOVA; [[curve-fitter]] handles curved relationships.

**New words:** *coefficient*, *standard error of a coefficient*, *dummy variable*, *controlling for*, *residual plot*, *heteroscedasticity*, *robust standard errors*.
