---
title: 'Many inputs: multiple regression and matrices'
seoTitle: 'Multiple linear regression and the normal equation'
summary: 'With two inputs a linear model is a flat plane; with more it is a hyperplane. Stack the data in a matrix and one equation, the normal equation, gives every weight at once. Turn a 3-D plane and work a small example.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'In ŷ = Xw, what is in each row of X?'
    choices: ['One example''s inputs, with a 1 at the front for the bias', 'One feature for all examples', 'The predictions']
    ans: 0
    why: Each row is one example. The leading 1 multiplies the bias, so the bias becomes just another weight.
  - q: 'The normal equation is:'
    choices: ['w = (XᵀX)⁻¹ Xᵀy', 'w = Xy', 'w = y / X']
    ans: 0
    why: Setting the gradient of the squared error to zero gives XᵀX w = Xᵀy, solved as w = (XᵀX)⁻¹Xᵀy when XᵀX can be inverted.
  - q: Two inputs are almost copies of each other (size in m² and in ft²). What happens to their weights?
    choices: ['They become unstable: large and of opposite sign, swinging with small data changes', 'They are both zero', 'Nothing unusual']
    ans: 0
    why: This is multicollinearity. XᵀX is nearly impossible to invert, so the split of credit between the two is arbitrary. Drop one, or use ridge (Lesson 3.8).
sources:
  - 'James, G., Witten, D., Hastie, T., Tibshirani, R. and Taylor, J. (2023), An Introduction to Statistical Learning with Applications in Python, Springer, Chapter 3 (linear regression) https://www.statlearning.com/'
  - 'Hastie, T., Tibshirani, R. and Friedman, J. (2009), The Elements of Statistical Learning, 2nd ed., Springer, Chapter 3 (linear methods for regression) https://hastie.su.domains/ElemStatLearn/'
  - 'Strang, G. (2016), Introduction to Linear Algebra, 5th ed., Wellesley-Cambridge Press, Chapter 4 (projections and least squares)'
---

**Module 3 · about 30 minutes · read first: 1.4, 3.2.** You'll be able to write multiple regression in matrix form, explain the normal equation, solve a two-input example, and spot multicollinearity.

<div class="bigidea">With many inputs, the whole model is one matrix product, ŷ = Xw, and the best weights solve one small set of equations: the normal equation.</div>

## 1. Why this matters

Real predictions use many inputs: a price depends on size, age, location and more. Writing one formula per weight gets messy fast, like a shopping list with one line per apple instead of "6 apples". Matrices let us write the model, the loss and the solution in one line each, whatever the number of inputs. They are also how computers (and graphics cards) actually do the sums, which is why the same notation carries straight into neural networks.

## 2. The picture: a plane

With two inputs, `$\hat y = w_1 x_1 + w_2 x_2 + b$` is a flat, tilted plane above the floor of `$(x_1, x_2)$`. Least squares tilts and lifts it to sit as close as possible to all the points, measured straight up and down.

<!--fig:regression-plane-->

## 3. The model as a matrix product

Put the data in a table `$X$`, one row per example, with a column of 1s at the front for the bias. Put the weights in a column `$\mathbf{w}$`, with the bias first:

```math
\underbrace{\begin{pmatrix} \hat y_1 \\ \hat y_2 \\ \vdots \\ \hat y_n \end{pmatrix}}_{\hat{\mathbf{y}}} = \underbrace{\begin{pmatrix} 1 & x_{11} & x_{12} \\ 1 & x_{21} & x_{22} \\ \vdots & \vdots & \vdots \\ 1 & x_{n1} & x_{n2} \end{pmatrix}}_{X} \underbrace{\begin{pmatrix} b \\ w_1 \\ w_2 \end{pmatrix}}_{\mathbf{w}}
```

Matrix times vector means: for each row, take the dot product of that row with `$\mathbf{w}$` (Lesson 1.4). So the whole model, for every example at once, is

```math
\hat{\mathbf{y}} = X \mathbf{w}
```

## 4. The normal equation

The sum of squared errors is `$S(\mathbf{w}) = \lVert \mathbf{y} - X\mathbf{w} \rVert^2$`. Its gradient is `$-2X^{\mathsf T}(\mathbf{y} - X\mathbf{w})$`, where `$X^{\mathsf T}$` (X transposed) is `$X$` with rows and columns swapped. Setting it to zero gives the **normal equation**:

```math
X^{\mathsf T} X \, \mathbf{w} = X^{\mathsf T} \mathbf{y} \qquad\Rightarrow\qquad \mathbf{w} = \left( X^{\mathsf T} X \right)^{-1} X^{\mathsf T} \mathbf{y}
```

`$X^{\mathsf T}X$` is a small square table (3 × 3 here, whatever `$n$` is), so solving it is quick. For one input it reduces exactly to the slope and intercept formulas of Lesson 3.2.

In practice software solves the equation by elimination or a QR decomposition rather than inverting, which is faster and more accurate. For millions of inputs (text, images) even that is too slow, and gradient descent (Lesson 3.3) takes over.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the least-squares weights make the residual vector `$\mathbf{y} - X\mathbf{w}$` perpendicular to every column of `$X$`. That is what `$X^{\mathsf T}(\mathbf{y} - X\mathbf{w}) = \mathbf{0}$` says: each column's dot product with the residuals is zero.

**Equations:** `$\hat{\mathbf{y}} = X\mathbf{w}$`; `$X^{\mathsf T}X\mathbf{w} = X^{\mathsf T}\mathbf{y}$`.

**Analogy:** the shadow of a stick on the floor. The closest point on the floor to the stick's tip is straight below it; the leftover (the residual) points straight up, at right angles to the floor. The predictions are the shadow of `$\mathbf{y}$` on the space the columns of `$X$` can reach.

**Try it:** with only the column of 1s (no inputs), what does the normal equation give? (`$X^{\mathsf T}X = n$` and `$X^{\mathsf T}\mathbf{y} = \sum y_i$`, so `$b = \bar y$`: the baseline that always predicts the mean.)
</details>

<div class="meaning">

<dl>
<dt>X</dt><dd>The design matrix: one row per example, a column of 1s for the bias, then one column per input.</dd>
<dt>w</dt><dd>The weights, bias first, as one column.</dd>
<dt>Xw</dt><dd>Every prediction at once: each row of X dotted with w.</dd>
<dt>XᵀX w = Xᵀy</dt><dd>The normal equation: a small square set of equations, one per weight, whose solution is the least-squares fit.</dd>
<dt>Physical meaning</dt><dd>The predictions are the shadow of the true values on the "floor" of everything the inputs can explain. The leftover, the residuals, stands straight up from that floor: no mix of the inputs can reduce it further. Each weight is the effect of one input with all the others held still, which is what lets the model untangle size from age.</dd>
</dl>

</div>

## 5. Worked example

*Made-up numbers.* Four flats with size `$x_1$` (in 10 m²), age `$x_2$` (in 10 years) and price `$y$` ($000):

| x₁ | x₂ | y |
|---|---|---|
| 5 | 1 | 250 |
| 6 | 3 | 250 |
| 8 | 2 | 340 |
| 9 | 4 | 340 |

Centring the columns first removes the bias from the sums (it is then `$\bar y$` minus the weights times the means). Means: `$\bar x_1 = 7$`, `$\bar x_2 = 2.5$`, `$\bar y = 295$`. Centred values: `$x_1$`: −2, −1, 1, 2; `$x_2$`: −1.5, 0.5, −0.5, 1.5; `$y$`: −45, −45, 45, 45.

The normal equation for the two weights uses sums of products of the centred columns:

- `$\sum x_1^2 = 4 + 1 + 1 + 4 = 10$`, `$\sum x_1 x_2 = 3 - 0.5 - 0.5 + 3 = 5$`, `$\sum x_2^2 = 2.25 + 0.25 + 0.25 + 2.25 = 5$`
- `$\sum x_1 y = 90 + 45 + 45 + 90 = 270$`, `$\sum x_2 y = 67.5 - 22.5 - 22.5 + 67.5 = 90$`

```math
\begin{pmatrix} 10 & 5 \\ 5 & 5 \end{pmatrix} \begin{pmatrix} w_1 \\ w_2 \end{pmatrix} = \begin{pmatrix} 270 \\ 90 \end{pmatrix} \quad\text{that is}\quad 10 w_1 + 5 w_2 = 270, \;\; 5 w_1 + 5 w_2 = 90
```

Subtracting: `$5 w_1 = 180$`, so `$w_1 = 36$`, then `$w_2 = (90 - 180)/5 = -18$`. Bias: `$b = 295 - 36 \times 7 - (-18) \times 2.5 = 295 - 252 + 45 = 88$`.

The same solution as a sequence:

<div class="steps">
<div class="step"><b>Centre the columns.</b> Subtract the means (size 7, age 2.5, price 295), so the bias drops out and only two weights are left.</div>
<div class="step"><b>Build the small table.</b> Sums of products of the centred columns: Σx₁² = 10, Σx₁x₂ = 5, Σx₂² = 5, Σx₁y = 270, Σx₂y = 90.</div>
<div class="step"><b>Two equations.</b> 10w₁ + 5w₂ = 270 and 5w₁ + 5w₂ = 90. Subtract the second from the first: 5w₁ = 180, so w₁ = 36.</div>
<div class="step"><b>Back-substitute.</b> 5 × 36 + 5w₂ = 90 gives w₂ = −18. Bias: 295 − 36 × 7 + 18 × 2.5 = 88.</div>
<div class="step"><b>Read it.</b> +$36,000 per extra 10 m², −$18,000 per extra 10 years, holding the other still. Price alone hid the age effect, because the bigger flats were also older.</div>
</div>

<div class="problem" data-problem="multiple-regression-solve"></div>

So price ≈ 36 × size(10 m²) − 18 × age(10 yr) + 88: each extra 10 m² adds $36,000, and each extra 10 years takes off $18,000. Check: the first flat gives 180 − 18 + 88 = 250, exactly its price (this tiny example fits perfectly). Notice that prices alone (two at 250, two at 340) hid the age effect: the bigger flats were also older.

## 6. Multicollinearity

When two inputs carry almost the same information (size in m² and in ft², or "years since built" and "year built"), `$X^{\mathsf T}X$` is nearly impossible to invert. The model fits fine, but the split of credit between the twins is arbitrary: one weight may come out large and positive and the other large and negative, and both swing wildly with a few rows changed. Fixes: drop one twin, combine them, or add a ridge penalty (Lesson 3.8).

## 7. Practice

1. A model has 5 inputs plus a bias. What size is `$X^{\mathsf T}X$`?
2. In the worked example, predict a flat of 70 m² that is 30 years old.
3. Why did the age weight only appear once size was in the model too?

<details>
<summary>Answers</summary>

1. 6 × 6 (one row and column per weight, including the bias).
2. 36 × 7 − 18 × 3 + 88 = 252 − 54 + 88 = 286, so about $286,000.
3. Size and age were correlated (bigger flats were older), so on its own age's effect was hidden behind size's. Holding size fixed revealed it.
</details>

**Try it on your own data:** the [[regression-workbench]] fits multiple regression to your CSV and gives each input's VIF (variance inflation factor), which flags inputs that are too alike.

**New words:** *multiple regression*, *design matrix*, *transpose*, *normal equation*, *hyperplane*, *multicollinearity*.

<div class="keypoints">

- Multiple regression fits a flat plane (or hyperplane) through the data: ŷ = Xw, with a column of 1s for the bias.
- The least-squares weights solve the normal equation XᵀXw = Xᵀy, one equation per weight.
- Each weight is the effect of its input with the other inputs held still, which can reveal effects hidden in simple comparisons.
- When two inputs are near copies (multicollinearity), the fit is fine but their separate weights are unstable.

</div>
