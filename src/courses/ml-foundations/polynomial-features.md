---
title: 'Curves with a linear model: polynomial features'
seoTitle: 'Polynomial regression: curves with a linear model'
summary: 'Add x², x³ and other new columns and a linear model can draw curves, because it is linear in its weights, not in x. Raise the degree of a polynomial and watch it bend, then learn the other useful features: logs, interactions and bins.'
minutes: 20
updated: 2026-11-21
quiz:
  - q: 'Why is ŷ = w₀ + w₁x + w₂x² still called a linear model?'
    choices: ['Because its graph is a straight line', 'Because the prediction is a weighted sum of the inputs 1, x and x², so it is linear in the weights', 'It is not linear']
    ans: 1
    why: '"Linear" refers to the weights. x² is just a new column; least squares and gradient descent work exactly as before.'
  - q: 'A polynomial of degree 5 has how many weights (including w₀)?'
    choices: ['5', '6', '25']
    ans: 1
    why: One for each power from x⁰ to x⁵.
  - q: 'House prices grow by a percentage per extra room rather than a fixed amount. A good feature trick is:'
    choices: ['Predict log(price) instead of price', 'Square the price', 'Drop the rooms column']
    ans: 0
    why: Equal percentage changes are equal steps on a log scale, so a straight line in log(price) captures them.
---

**Module 3 · about 20 minutes · read first: 3.1, 3.4.** You'll be able to fit curves with a linear model by adding polynomial features, and use log, interaction and binned features to capture other shapes.

## 1. Why this matters

Lesson 3.5 showed a U-shaped residual plot: the data curves and a straight line can't. You don't need a new kind of model to fix that. You need new **features**: extra columns made from the ones you have. This trick, called **feature engineering**, is often the cheapest way to improve any model.

## 2. Powers of x

Make columns `$x^2, x^3, \dots, x^d$` and fit an ordinary multiple regression on them:

```math
\hat{y} = w_0 + w_1 x + w_2 x^2 + \dots + w_d x^d
```

The prediction is still a weighted sum, so everything from Lessons 3.2 to 3.4 applies: the normal equation, gradient descent, the scores. Only the picture changes: a parabola for degree 2, an S for degree 3, and more wiggles as the degree rises.

<!--fig:poly-degree-->

Try degree 1, then 3, then 12. Degree 3 follows the curve well. Degree 12 threads through every training point but swings wildly between them: it has started to model the noise. The next lesson measures this.

**Practical note:** powers of big numbers explode (100¹⁰ is 10²⁰), which ruins the arithmetic. Scale x to roughly −1 to 1 before taking powers, as the simulation does.

## 3. Other useful features

| Feature | Made from | Catches |
|---|---|---|
| **Log** `$\log x$` or predicting `$\log y$` | Money, populations, sizes | Effects that are percentages, long right tails |
| **Interaction** `$x_1 x_2$` | Two inputs | One input's effect depending on another (ads work better at weekends) |
| **Bins** (one-hot of ranges) | Age into 18-25, 26-40, ... | Steps and odd shapes without picking a formula |
| **Ratio** `$x_1 / x_2$` | Price and size | Price per m², debt-to-income |
| **Time parts** | Dates | Hour, weekday, season (Lesson 2.1) |
| **Sine and cosine** | Cycles | Hour 23 being next to hour 0 |

Domain knowledge is the best source of features. A doctor knows body mass index (weight ÷ height²) matters more than either alone; an analyst knows "days since last order" predicts cancelling better than the order date itself.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a model is linear in its weights if the prediction is a weighted sum. The inputs to that sum may be any fixed functions of the raw data, `$\phi_j(x)$`, called **basis functions** or features.

**Equation:**

```math
\hat{y} = \sum_{j=0}^{d} w_j \, \phi_j(x), \qquad \phi_j(x) = x^j \text{ for a polynomial}
```

The design matrix (Lesson 3.4) simply has columns `$\phi_0(x_i) = 1, \phi_1(x_i) = x_i, \phi_2(x_i) = x_i^2, \dots$`, and the normal equation is unchanged.

**Counting:** with `$p$` raw inputs and all products up to degree 2, the number of features is `$1 + p + p(p+1)/2$`. For 10 inputs that is 66; for 100, 5,151. Features multiply fast, which is one reason to prefer models that find interactions by themselves (trees, Module 5).

**Analogy:** a straight ruler can't trace a curve, but a set of flexible rulers glued together at chosen bends can. Each new feature is one more bend you allow.

**Try it:** fit `$\hat y = w_0 + w_1 x + w_2 x^2$` exactly through (−1, 2), (0, 1), (1, 2). (From x = 0: `$w_0 = 1$`. Then `$1 - w_1 + w_2 = 2$` and `$1 + w_1 + w_2 = 2$`, so `$w_1 = 0$`, `$w_2 = 1$`: `$\hat y = 1 + x^2$`.)
</details>

## 4. Worked example

*Made-up numbers.* A café's daily iced-drink sales rise with temperature up to about 30 °C, then fall a little on the hottest days (people stay indoors). A straight line on temperature `$t$` gives R² = 0.71 with an arch in the residuals. Adding `$t^2$`:

```math
\widehat{\text{sales}} = -180 + 21\,t - 0.35\,t^2
```

- At 20 °C: −180 + 420 − 140 = **100 drinks**.
- At 30 °C: −180 + 630 − 315 = **135 drinks**.
- At 36 °C: −180 + 756 − 453.6 ≈ **122 drinks**.

The peak is where the slope `$21 - 0.7t$` is zero: `$t = 30$` °C. Test R² rises to 0.86 and the residual arch disappears. The fitted curve says something useful in plain words, which a wiggly degree-12 curve never would.

## 5. Practice

1. How many weights has a degree-4 polynomial in one input?
2. Sales grow by about 8 % for each extra store opened. What feature or target change makes this linear?
3. Why scale x before computing `$x^8$`?

<details>
<summary>Answers</summary>

1. Five (powers 0 to 4).
2. Predict log(sales): an 8 % rise each time is a constant step of log(1.08) ≈ 0.077.
3. Large x makes huge numbers that swamp the arithmetic and make the normal equation unstable; small x keeps all powers in a sensible range.
</details>

**Try it on your own data:** the [[regression-workbench]] fits polynomial regression, and the [[curve-fitter]] fits curves of any formula you choose.

**New words:** *feature engineering*, *polynomial features*, *basis function*, *interaction term*, *log transform*, *binning*.
