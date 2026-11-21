---
title: Trees that predict numbers
seoTitle: 'Regression trees explained, with a simulation'
summary: 'A regression tree predicts a number: the average of the training rows in each leaf. Its splits lower the spread (variance) of the target. See the staircase it draws and work out a split by hand.'
minutes: 20
updated: 2026-11-21
quiz:
  - q: 'A regression tree''s leaf holds the values 10, 12 and 17. It predicts:'
    choices: ['17', '13', '12']
    ans: 1
    why: The average, (10 + 12 + 17) / 3 = 13, which is the constant with the smallest squared error.
  - q: 'What does a regression tree''s split try to lower?'
    choices: ['Gini impurity', 'The variance (squared error) of the target within each child', 'The number of leaves']
    ans: 1
    why: For numbers, impurity is the spread around the mean, so the tree lowers the weighted variance.
  - q: A regression tree is trained on prices from $100k to $900k. For a huge house it predicts at most
    choices: ['Any amount, following the trend', 'The highest leaf average, which is no more than $900k', 'Exactly $900k']
    ans: 1
    why: Every prediction is an average of training values, so a tree can never extrapolate beyond them.
---

**Module 5 · about 20 minutes · read first: 3.5, 5.3.** You'll be able to build a regression tree split by hand, read its staircase predictions, and explain why trees cannot extrapolate.

## 1. Why this matters

Many questions in business are numbers, not classes: next week's sales, a delivery time, a house price. Regression trees answer them, and they are the building block of gradient boosting (Lesson 6.6), which wins most competitions on table data.

## 2. Same tree, different leaves

A regression tree asks the same kind of questions as a classification tree. Two things change:

- **The leaf's answer** is the average of the target over the training rows in that leaf.
- **Impurity** is the spread of the target in a box: its variance, the mean squared distance from the box's average. A split is good if each child's values are close to their own average.

So the gain of a split is the drop in weighted variance (equivalently, in total squared error, Lesson 3.2).

<!--fig:reg-tree-->

## 3. A staircase

Because each leaf predicts one constant, the prediction is flat inside each box and jumps at each threshold: a staircase in one dimension, a set of flat-topped blocks in two. More depth means more, finer steps.

Two consequences:

- **No extrapolation.** Beyond the training data the last step just carries on flat. A linear model would keep going up; a tree stays at the last leaf's average. That is safe for some jobs and wrong for others (prices that keep rising).
- **No smoothness.** Two days 0.1 °C apart can get very different predictions if a threshold falls between them. Averaging many trees (Module 6) smooths the steps out.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** within a box, the single number with the lowest squared error is the mean, so each leaf predicts its mean, and splits are chosen to lower the total squared error.

**Leaf value and impurity** for the rows `$y_i$` in a box with `$n$` rows and mean `$\bar{y}$`:

```math
c = \bar{y} = \frac{1}{n}\sum_i y_i, \qquad I = \frac{1}{n} \sum_i (y_i - \bar{y})^2
```

**Gain of a split:** `$I(\text{parent}) - \frac{n_L}{n} I(L) - \frac{n_R}{n} I(R)$`, the same formula as Lesson 5.3 with variance in place of Gini.

**Analogy:** pricing flats by neighbourhood. Instead of a formula, group similar flats and quote each group's average price; finer groups give finer quotes.

**Try it:** values 2, 4, 10, 12. Which split is best: {2} | {4, 10, 12} or {2, 4} | {10, 12}? (Second: each side has variance 1, total weighted 1. The first has a right side of mean 8.67 and variance 11.6, weighted 8.7.)
</details>

## 4. Worked example

*Made-up numbers.* Daily ice-cream sales (in hundreds) on six days:

| temperature (°C) | 12 | 15 | 18 | 24 | 27 | 30 |
|---|---|---|---|---|---|---|
| sales | 4 | 5 | 6 | 14 | 16 | 18 |

Mean 10.5; variance = (6.5² + 5.5² + 4.5² + 3.5² + 5.5² + 7.5²) / 6 = 191.5 / 6 = 31.92.

- **Split at 21 °C:** left {4, 5, 6}, mean 5, variance (1 + 0 + 1)/3 = 0.667. Right {14, 16, 18}, mean 16, variance (4 + 0 + 4)/3 = 2.667. Weighted: 0.5 × 0.667 + 0.5 × 2.667 = 1.667. Gain = 31.92 − 1.67 = **30.25**.
- **Split at 16.5 °C:** left {4, 5}, variance 0.25; right {6, 14, 16, 18}, mean 13.5, variance 20.75. Weighted: 2/6 × 0.25 + 4/6 × 20.75 = 13.92. Gain 18.0.

The tree splits at 21 °C. Its prediction: 500 sales on cool days, 1,600 on warm days. For a 40 °C heatwave it still says 1,600: it cannot extrapolate.

## 5. Practice

1. In the simulation, at depth 0 what does the tree predict, and what is that?
2. Why does the test error rise again at large depths?
3. A leaf holds one training row. What does it predict for every point that lands there?

<details>
<summary>Answers</summary>

1. One flat line at the average sales of all training days: the simplest possible baseline.
2. Deep trees make tiny leaves that follow the noise of single days (overfitting).
3. That one row's value, noise and all.
</details>

**Try it on your own data:** the [[regression-workbench]] fits straight-line models to your table; compare its smooth predictions with a tree's steps.

**New words:** *regression tree*, *leaf mean*, *variance reduction*, *extrapolation*, *step function*.
