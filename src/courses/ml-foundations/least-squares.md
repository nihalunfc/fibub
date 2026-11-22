---
title: 'Least squares: why we square the errors'
seoTitle: 'Least squares regression explained, with the derivation'
summary: 'The best line is the one that makes the sum of squared errors smallest. Drag points and watch the squares, then derive the slope and intercept formulas step by step with calculus.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: Why are the errors squared rather than just added?
    choices: ['Positive and negative errors would cancel, and squares are easy to minimise with calculus', 'Squaring makes the errors smaller', 'There is no reason']
    ans: 0
    why: Plain errors cancel (+5 and −5 add to 0). Squares are always positive, punish big misses more, and give a smooth bowl whose bottom calculus can find exactly.
  - q: 'For x = 1, 2, 3 and y = 2, 4, 5, the least-squares slope is:'
    choices: ['1.5', '2', '1.33']
    ans: 0
    why: 'x̄ = 2, ȳ = 11/3. Σ(x − x̄)(y − ȳ) = (−1)(−5/3) + 0 + (1)(4/3) = 3, and Σ(x − x̄)² = 2, so m = 3/2 = 1.5.'
  - q: The least-squares line always passes through which point?
    choices: ['The origin (0, 0)', 'The point of means (x̄, ȳ)', 'The first data point']
    ans: 1
    why: From c = ȳ − m x̄, putting x = x̄ into the line gives ŷ = ȳ.
sources:
  - 'James, G., Witten, D., Hastie, T., Tibshirani, R. and Taylor, J. (2023), An Introduction to Statistical Learning with Applications in Python, Springer, Chapter 3 (linear regression) https://www.statlearning.com/'
  - 'Hastie, T., Tibshirani, R. and Friedman, J. (2009), The Elements of Statistical Learning, 2nd ed., Springer, Chapter 3 (linear methods for regression) https://hastie.su.domains/ElemStatLearn/'
  - 'Stigler, S. M. (1986), The History of Statistics: The Measurement of Uncertainty before 1900, Harvard University Press, Chapter 1 (Legendre, Gauss and least squares)'
---

**Module 3 · about 30 minutes · read first: 1.5, 3.1.** You'll be able to explain why least squares uses squared errors, derive the formulas for the best slope and intercept, and fit a line to small data by hand.

<div class="bigidea">The best line is the one whose squared misses add up to the least, and calculus finds it exactly: it passes through the point of means with slope "how x and y move together ÷ how much x moves".</div>

## 1. Why this matters

"The best line" needs a definition before a computer can find it. Think of a referee: before a match can be won, someone must agree what counts as a goal. Least squares, invented around 1805 by Legendre and Gauss to work out the orbits of planets and comets, is the definition almost everyone uses. Its loss, the mean squared error, comes back in neural networks, and the idea of "write the error as a function, then find its minimum" runs through the whole course.

## 2. Choosing what "best" means

Each point has a **residual** `$e_i = y_i - \hat y_i$`: positive if the point is above the line, negative if below. We want residuals small overall. Options:

- **Add them up:** no good. +5 and −5 cancel, and a terrible line can score 0.
- **Add their sizes** `$\sum |e_i|$` (least absolute deviations): sensible and robust to outliers, but its V-shaped corners make the maths awkward.
- **Add their squares** `$\sum e_i^2$` (least squares): always positive, punishes a big miss much more than several small ones, and gives a smooth bowl-shaped error with a single bottom that calculus finds exactly.

<!--fig:least-squares-->

Try dragging one point far away. Its square grows with the distance *squared*, so least squares bends the line a long way to reduce it. That is the price of squaring: sensitivity to outliers (Lesson 2.4).

Watch least squares judge three lines through the same three points:

<div class="steps" data-fig="least-squares-residuals">
<div class="step"><b>The data.</b> Three days of an ice-cream van: (1, 2), (2, 4), (3, 5). The means are x̄ = 2 and ȳ = 3.67.</div>
<div class="step"><b>A flat line at the mean.</b> Predict 3.67 every day. The misses are −1.67, 0.33 and 1.33; their squares add to 4.67. This is the "no model" baseline.</div>
<div class="step"><b>Try ŷ = 2x.</b> Predictions 2, 4, 6. Misses 0, 0 and −1: sum of squares 1.00. Much better.</div>
<div class="step"><b>The least-squares line, ŷ = 1.5x + 0.67.</b> Predictions 2.17, 3.67, 5.17. Misses −0.17, 0.33, −0.17: sum of squares 0.17. No other straight line does better.</div>
<div class="step"><b>A built-in check.</b> The best line passes through the point of means (2, 3.67), and its misses add to exactly zero.</div>
</div>

## 3. Deriving the best line

We want the `$m$` and `$c$` that make the sum of squared errors smallest:

```math
S(m, c) = \sum_{i=1}^{n} \left( y_i - m x_i - c \right)^2
```

At the bottom of the bowl, the slope in every direction is zero (Lesson 1.5). So we set both partial derivatives to 0. Using the chain rule, the derivative of `$(y_i - m x_i - c)^2$` with respect to `$c$` is `$2(y_i - m x_i - c) \times (-1)$`, and with respect to `$m$` it is `$2(y_i - m x_i - c) \times (-x_i)$`.

**Step 1, the intercept.**

```math
\frac{\partial S}{\partial c} = -2 \sum_i (y_i - m x_i - c) = 0 \;\Rightarrow\; \sum_i y_i - m \sum_i x_i - n c = 0 \;\Rightarrow\; c = \bar{y} - m \bar{x}
```

So the best line always passes through the point of means `$(\bar x, \bar y)$`, the "centre of gravity" of the data.

**Step 2, the slope.** Put `$c = \bar y - m \bar x$` into the second condition:

```math
\frac{\partial S}{\partial m} = -2 \sum_i x_i \big( (y_i - \bar y) - m (x_i - \bar x) \big) = 0
```

Because `$\sum_i (y_i - \bar y) = 0$` and `$\sum_i (x_i - \bar x) = 0$`, we may replace `$x_i$` in front by `$(x_i - \bar x)$` without changing the sum, which gives

```math
m = \frac{\sum_i (x_i - \bar{x})(y_i - \bar{y})}{\sum_i (x_i - \bar{x})^2}
```

The top is (n times) the covariance of x and y; the bottom is (n times) the variance of x. So the slope is "how x and y move together" divided by "how much x moves".

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the least-squares line minimises the sum of squared residuals. Setting the derivatives to zero gives a formula, so no search is needed.

**Equations:**

```math
m = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sum (x_i - \bar{x})^2} = r \, \frac{s_y}{s_x}, \qquad c = \bar{y} - m \bar{x}
```

The second form links the slope to the correlation `$r$` of Lesson 2.3: the slope is the correlation scaled by the ratio of spreads.

**Analogy:** hanging the line from springs attached to every point, where each spring pulls harder the more it is stretched. The line settles where the pulls balance.

**Try it:** for (1, 2), (2, 4), (3, 5), find `$m$` and `$c$`. (`$\bar x = 2$`, `$\bar y = 11/3$`; top = 3, bottom = 2, so `$m = 1.5$`; `$c = 11/3 - 3 = 2/3$`: `$\hat y = 1.5x + 0.67$`.)
</details>

<div class="meaning">

<dl>
<dt>eᵢ = yᵢ − ŷᵢ</dt><dd>The residual: how far point i is above (+) or below (−) the line.</dd>
<dt>S = Σ eᵢ²</dt><dd>The sum of squared errors: the score least squares makes as small as possible.</dd>
<dt>Σ(x − x̄)(y − ȳ)</dt><dd>How x and y move together (n times their covariance).</dd>
<dt>Σ(x − x̄)²</dt><dd>How much x moves on its own (n times its variance).</dd>
<dt>c = ȳ − m x̄</dt><dd>The intercept that makes the line pass through the point of means.</dd>
<dt>Physical meaning</dt><dd>Hang a stiff rod among the points and tie each point to it with a spring that pulls harder the more it is stretched. The rod settles where all the pulls balance: that resting place is the least-squares line. One point far away stretches its spring a lot and drags the rod towards it, which is why outliers matter so much.</dd>
</dl>

</div>

## 4. Worked example

*Made-up numbers.* Five flats:

| size x (m²) | 50 | 60 | 80 | 100 | 110 |
|---|---|---|---|---|---|
| price y ($000) | 260 | 290 | 340 | 420 | 440 |

- Means: `$\bar x = 400/5 = 80$`, `$\bar y = 1750/5 = 350$`.
- Deviations `$x - \bar x$`: −30, −20, 0, 20, 30. `$y - \bar y$`: −90, −60, −10, 70, 90.
- Products: 2700, 1200, 0, 1400, 2700. Sum = **8000**.
- Squares of x deviations: 900, 400, 0, 400, 900. Sum = **2600**.
- Slope `$m = 8000 / 2600 \approx 3.08$` ($000 per m²). Intercept `$c = 350 - 3.08 \times 80 \approx 103.8$`.

So price ≈ 3.08 × size + 104, in $000. A 90 m² flat: about 3.08 × 90 + 104 ≈ **$381,000**.

<div class="problem" data-problem="least-squares-slope"></div>

<div class="myth">

**"Least squares finds the line that goes through the most points."** It may go through none of them. It balances the misses of all points at once, and squaring means it cares far more about one big miss than several small ones. If you want a line that one wild point can't drag around, you need a different loss, such as least absolute deviations.

</div>

## 5. Practice

1. Fit a line by least squares to (0, 1), (1, 3), (2, 5), (3, 7). What do you notice?
2. Show that the residuals of a least-squares line (with an intercept) always add up to 0.
3. If every y is doubled, what happens to m and c?

<details>
<summary>Answers</summary>

1. The points lie exactly on `$y = 2x + 1$`, so least squares returns it with every residual 0.
2. That is the condition `$\partial S / \partial c = 0$`: `$-2 \sum (y_i - m x_i - c) = 0$`, so `$\sum e_i = 0$`.
3. Both double: the top of the slope formula doubles, and `$c = \bar y - m \bar x$` doubles too.
</details>

**Try it on your own data:** the [[scatter-best-fit]] tool draws the least-squares line through your own points and shows the working.

**New words:** *least squares*, *sum of squared errors*, *point of means*, *least absolute deviations*.

<div class="keypoints">

- The residual is the gap between a point and the line; least squares makes the sum of squared residuals smallest.
- Squaring keeps every miss positive and gives a smooth bowl with one bottom, but makes the line sensitive to outliers.
- Best slope m = Σ(x − x̄)(y − ȳ) ÷ Σ(x − x̄)²; intercept c = ȳ − m x̄.
- The least-squares line passes through the point of means and its residuals add to zero.

</div>
