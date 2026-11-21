---
title: 'Regularisation: ridge and lasso'
seoTitle: 'Ridge and lasso regression: regularisation explained'
summary: 'Add a penalty for large weights to the error, and an over-flexible model calms down. Ridge shrinks every weight; lasso sets some to exactly zero and so picks features. Turn up the penalty and watch the weights and the test error.'
minutes: 25
updated: 2026-11-21
quiz:
  - q: 'What does ridge regression add to the squared error?'
    choices: ['λ times the sum of squared weights', 'λ times the number of rows', 'Nothing']
    ans: 0
    why: Ridge minimises SSE + λ·Σw². Large weights cost extra, so the fit prefers small, smooth ones.
  - q: Which penalty can set weights to exactly zero?
    choices: ['Ridge (L2)', 'Lasso (L1)', 'Both, equally often']
    ans: 1
    why: The L1 penalty's sharp corner at zero makes exact zeros the best choice for weak features. Ridge only shrinks them towards zero.
  - q: How should you choose λ?
    choices: ['Pick the value with the lowest training error', 'Pick the value with the lowest validation (or cross-validation) error', 'Always use λ = 1']
    ans: 1
    why: Training error is always lowest at λ = 0. Only held-out data shows where the penalty helps.
---

**Module 3 · about 25 minutes · read first: 3.4, 3.7.** You'll be able to write the ridge and lasso losses, explain why a penalty reduces overfitting, say how lasso selects features, and choose the penalty strength.

## 1. Why this matters

An overfitting model usually has **huge weights** that pull against each other to thread every training point. Regularisation adds a cost for large weights, so the model only uses big weights when the data really demands them. It is one of the most used tools in practice: in regression, in logistic regression, and in neural networks, where the same idea is called **weight decay**.

## 2. The penalised loss

Instead of minimising only the squared error, minimise error plus a penalty:

```math
\text{Ridge (L2):}\quad \sum_{i} (y_i - \hat{y}_i)^2 + \lambda \sum_{j} w_j^2
```

```math
\text{Lasso (L1):}\quad \frac{1}{2n}\sum_{i} (y_i - \hat{y}_i)^2 + \lambda \sum_{j} \lvert w_j \rvert
```

`$\lambda$` (lambda) sets the strength. At `$\lambda = 0$` it is plain least squares. As `$\lambda$` grows, weights shrink. At a very large `$\lambda$` every weight is crushed to (almost) zero and the model predicts the mean. The bias `$w_0$` is never penalised: shifting the whole line up or down isn't complexity.

**Scale the features first** (Lesson 2.4). The penalty treats all weights alike, so a feature measured in large units (with a small weight) would barely be penalised compared with one in small units.

<!--fig:ridge-lasso-->

## 3. Ridge or lasso?

| | Ridge (L2) | Lasso (L1) |
|---|---|---|
| Effect on weights | Shrinks all smoothly towards zero | Shrinks, and sets the weakest to exactly zero |
| Feature selection | No | Yes: zero weight means the feature is dropped |
| Twin features (multicollinearity) | Shares the weight between them | Tends to keep one, drop the other |
| Solution | A formula: `$(X^{\mathsf T}X + \lambda I)^{-1} X^{\mathsf T}\mathbf{y}$` | A search (coordinate descent) |

**Elastic net** mixes both penalties, and is a sensible default when you aren't sure.

## 4. Why lasso gives exact zeros

Picture just two weights. The squared error makes oval rings around the least-squares answer. The penalty limits how far from zero the weights may go: for ridge, inside a circle (`$w_1^2 + w_2^2 \le t$`); for lasso, inside a diamond (`$|w_1| + |w_2| \le t$`). The answer is where the smallest error ring touches the shape. A circle is round, so the touching point is usually somewhere on its curve, with both weights non-zero. A diamond has sharp corners on the axes, and the rings very often touch a corner first, where one weight is exactly zero.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a penalty trades a little training error for much smaller, steadier weights, lowering variance at the cost of a little bias (Lesson 3.7).

**Equations:** ridge has a closed-form solution, the normal equation with `$\lambda$` added down the diagonal:

```math
\mathbf{w}_{\text{ridge}} = \left( X^{\mathsf T}X + \lambda I \right)^{-1} X^{\mathsf T} \mathbf{y}
```

Adding `$\lambda$` to the diagonal also makes the matrix safe to invert even when features are near copies of each other, which is how ridge cures multicollinearity.

For one standardised feature, ridge simply scales the least-squares weight: `$w_{\text{ridge}} = w_{\text{LS}} \cdot \frac{s}{s + \lambda}$`, where `$s = \sum x_i^2$`. Lasso instead subtracts and clips: `$w_{\text{lasso}} = \operatorname{sign}(w_{\text{LS}}) \max(0, |w_{\text{LS}}| - \lambda')$`, which hits exactly zero once `$\lambda'$` passes `$|w_{\text{LS}}|$`.

**Analogy:** a budget. Ridge taxes every pound spent on weights, so all spending shrinks a little. Lasso charges a flat fee per pound with no discount for small amounts, so tiny purchases aren't worth it and are cut entirely.

**Try it:** least-squares weight 4, `$s = 10$`. Ridge with `$\lambda = 10$`? Lasso with `$\lambda' = 3$`, then `$\lambda' = 5$`? (Ridge: `$4 \times 10/20 = 2$`. Lasso: `$4 - 3 = 1$`, then `$\max(0, -1) = 0$`.)
</details>

## 5. Worked example

*Made-up numbers.* A retailer predicts weekly sales per store from 60 features (local population, competitors, weather, 40 product-mix shares...). With 150 stores, plain least squares overfits: training R² 0.94, validation R² 0.41.

| Model | Validation R² | Features used |
|---|---|---|
| Least squares | 0.41 | 60 |
| Ridge, best λ (by cross-validation) | 0.72 | 60, all shrunk |
| Lasso, best λ | 0.74 | 11 |

Lasso does slightly better and also tells the team which 11 features carry the signal. That makes the model easier to explain and cheaper to keep up to date, since 49 data feeds are no longer needed.

## 6. Practice

1. What happens to the ridge weights as `$\lambda \to \infty$`?
2. Two features are near copies. Which penalty is likelier to keep only one of them?
3. Why isn't the bias penalised?

<details>
<summary>Answers</summary>

1. They all shrink to zero, and the model predicts the mean of y (the bias).
2. Lasso.
3. Moving the whole prediction up or down doesn't make the model more wiggly; penalising it would only bias predictions towards zero.
</details>

**Try it on your own data:** fit a high-degree polynomial in the [[regression-workbench]] and compare its R² with a simpler fit. The overfitting you see there is what a penalty tames.

**New words:** *regularisation*, *penalty*, *λ (lambda)*, *ridge (L2)*, *lasso (L1)*, *elastic net*, *weight decay*, *feature selection*.
