---
title: 'Measuring fit: residuals, RMSE and R²'
seoTitle: 'Regression metrics: residuals, RMSE, MAE and R²'
summary: 'How good is a regression model? RMSE and MAE give the typical error in real units, R² gives the share of variation explained, and a residual plot shows what the scores hide. Switch between four datasets and read the residuals.'
minutes: 25
updated: 2026-11-21
quiz:
  - q: 'Errors of 2, −2, 2, −2 and 10. Which is larger, MAE or RMSE?'
    choices: ['MAE', 'RMSE', 'They are equal']
    ans: 1
    why: MAE = (2+2+2+2+10)/5 = 3.6. RMSE = √((4+4+4+4+100)/5) = √23.2 ≈ 4.8. Squaring makes the one big miss count more.
  - q: 'R² = 0 on the test set means:'
    choices: ['The model is perfect', 'The model does no better than always predicting the mean', 'The model is useless for every purpose']
    ans: 1
    why: R² compares the model's squared error with the baseline that predicts the mean. 0 means equal; negative means worse.
  - q: The residuals form a clear U shape. What should you try?
    choices: ['Collect more rows', 'Add a squared term or another feature that captures the curve', 'Report a higher R²']
    ans: 1
    why: A pattern in the residuals means the model is missing a shape. A U says the relationship curves.
---

**Module 3 · about 25 minutes · read first: 3.2.** You'll be able to compute MAE, RMSE and R², choose the right one for a job, and diagnose a model from its residual plot.

## 1. Why this matters

A model always produces numbers, even a bad one. Before anyone acts on its predictions they need two answers: how far off is it, typically, and is it missing something systematic? The scores answer the first. The residual plot answers the second, and catches problems the scores hide.

## 2. Three scores

With residuals `$e_i = y_i - \hat y_i$` on `$n$` test rows:

| Score | Formula | Units | Reads as |
|---|---|---|---|
| **MAE** (mean absolute error) | `$\frac{1}{n}\sum \lvert e_i \rvert$` | same as y | "on average we are off by this much" |
| **RMSE** (root mean squared error) | `$\sqrt{\frac{1}{n}\sum e_i^2}$` | same as y | "a typical error", with big misses counted more |
| **R²** (coefficient of determination) | `$1 - \dfrac{\sum e_i^2}{\sum (y_i - \bar y)^2}$` | none | "share of the variation the model explains" |

Choose by what hurts: if one miss of 10 is much worse than five misses of 2 (stock levels, dosing), use RMSE. If every unit of error costs the same (delivery minutes), MAE is more honest. R² is good for comparing models on the same data, but it says nothing about whether the error is small enough for the job: an R² of 0.9 can still mean errors of $50,000 on house prices.

Always quote scores on **test** data. On training data they flatter.

## 3. Reading residuals

Plot each residual against its prediction. A good model leaves residuals that look like random noise: centred on zero, the same spread everywhere, no shape.

<!--fig:residuals-->

| You see | It means | Try |
|---|---|---|
| Random cloud around 0 | The model has caught the pattern | Nothing; it is as good as this feature set allows |
| A curve (U or arch) | The relationship bends | Squared terms (Lesson 3.6), a log, or a tree model |
| A funnel (spread grows) | Errors grow with the size of y | Predict log(y), or report errors in percent |
| One point far out | An outlier or a data error | Check the row; consider capping or a robust loss |
| Groups or stripes | A missing category | Add the feature that separates the groups |

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** R² compares the model with the simplest baseline, always predicting the mean `$\bar y$`.

**Equations:**

```math
R^2 = 1 - \frac{\text{SSE}}{\text{SST}} = 1 - \frac{\sum_i (y_i - \hat{y}_i)^2}{\sum_i (y_i - \bar{y})^2}
```

SSE is the model's sum of squared errors; SST ("total") is the baseline's. On the training data of a least-squares line, R² equals the squared correlation `$r^2$` (Lesson 2.3). On test data R² can be **negative**: the model is worse than the mean.

Also, `$\text{RMSE} = \sqrt{\text{SSE}/n}$`, so lowering one lowers the other, and `$\text{MAE} \le \text{RMSE}$` always.

**Analogy:** the baseline is a guess with no information. R² asks how much of the guess's error the model removes.

**Try it:** y = 3, 5, 7, 9; predictions 4, 5, 6, 9. Find R². (`$\bar y = 6$`; SST = 9 + 1 + 1 + 9 = 20; SSE = 1 + 0 + 1 + 0 = 2; R² = 1 − 2/20 = 0.9.)
</details>

## 4. Worked example

*Made-up numbers.* Two models predict delivery times (minutes) for the same 6 test orders, whose true times are 20, 25, 30, 35, 40, 90 (the last was a road closure).

| | errors | MAE | RMSE |
|---|---|---|---|
| Model A | 3, −3, 3, −3, 3, −40 | 9.2 | 16.6 |
| Model B | 8, −8, 8, −8, 8, −20 | 10.0 | 11.0 |

Model A is closer on five of six orders and has the lower MAE; Model B has the lower RMSE because it misses the road closure by less. Which is better? If a 40-minute surprise loses a customer, the business should prefer B and RMSE. If every minute costs the same, A and MAE.

(The arithmetic for A: MAE = (3×5 + 40)/6 = 55/6 ≈ 9.2. RMSE = √((9×5 + 1600)/6) = √274.2 ≈ 16.6.)

## 5. Practice

1. Errors of 1, −1, 1, −1. Find MAE and RMSE.
2. A model's test R² is −0.2. What does that tell you?
3. A residual plot fans out to the right. Name one fix.

<details>
<summary>Answers</summary>

1. Both are 1.
2. It is worse than predicting the mean for everyone: back to the drawing board (often a sign of overfitting or a bug).
3. Model log(y) instead of y, or judge errors in percent.
</details>

**Try it on your own data:** the [[regression-workbench]] shows R² and a residual plot for any model you fit.

**New words:** *MAE*, *RMSE*, *R²*, *SSE* and *SST*, *residual plot*, *heteroscedasticity* (a funnel: the error spread changes with the prediction).
