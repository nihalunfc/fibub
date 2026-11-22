---
title: "Fitting models and error bars"
seoTitle: "Fitting models, chi-squared and error bars | Astronomy"
summary: "Every measurement needs an uncertainty. Least-squares fitting finds the model that misses the data least, chi-squared says whether the misses match the error bars, and uncertainties pass through formulas in predictable ways."
minutes: 25
updated: 2026-11-22
quiz:
  - q: "A fit has reduced χ² = 5. The most likely problem is:"
    choices: ["The error bars are too small, or the model is wrong", "The fit is perfect", "There are too many data points"]
    ans: 0
    why: "Misses five times bigger (in squared terms) than the error bars allow mean something is off."
  - q: "Averaging 100 measurements each with uncertainty 0.1 gives an average uncertain by about:"
    choices: ["0.1", "0.01", "0.001"]
    ans: 1
    why: "The error of a mean shrinks as 1/√N: 0.1/10 = 0.01."
  - q: "If d = 1/p and p has a 5% uncertainty, d has about:"
    choices: ["5% uncertainty", "10% uncertainty", "25% uncertainty"]
    ans: 0
    why: "For a power law the fractional error is multiplied by the power; here the power is −1."
sources:
  - "Bevington, P. R. and Robinson, D. K. (2003), Data Reduction and Error Analysis for the Physical Sciences (methods described)"
---

**Module 5 · about 25 minutes · sums of squares.** You'll be able to fit a straight line by least squares, judge a fit with chi-squared, and carry uncertainties through a calculation.

## 1. Why this matters

A result without an error bar isn't a result. "The planet is 1.2 Earth radii" means little; "1.2 ± 0.1" tells you whether it could be rocky. Every number in a research paper comes with an uncertainty, and much of the argument in science is about whether those uncertainties are honest.

## 2. Least squares and chi-squared

You have measurements `$y_i$` with uncertainties `$\sigma_i$` and a model `$f(x)$` with adjustable numbers (parameters). The **least-squares fit** picks the parameters that make the total squared miss, weighted by the error bars, as small as possible. That total is **chi-squared** (`$\chi^2$`).

<!--fig:line-fit-->

Things to notice:

- By hand you can get close; the best-fit button finds the exact minimum.
- Shrink the claimed error bars and χ² shoots up even though the line hasn't changed.

<details class="maths" open>
<summary>Maths and principle</summary>

**Chi-squared**:

```math
\chi^2 = \sum_{i=1}^{N}\left(\frac{y_i - f(x_i)}{\sigma_i}\right)^2
```

**Reduced chi-squared**: `$\chi^2_\nu = \chi^2/(N - k)$` for `$k$` fitted parameters. About 1 is good.

**Straight-line fit** `$y = mx + b$` (equal error bars `$\sigma$`):

```math
m = \frac{\sum (x_i - \bar x)(y_i - \bar y)}{\sum (x_i - \bar x)^2}, \qquad b = \bar y - m\bar x, \qquad \sigma_m = \frac{\sigma}{\sqrt{\sum (x_i - \bar x)^2}}
```

**Error propagation** (independent errors):

- sums and differences: `$\sigma_{a \pm b} = \sqrt{\sigma_a^2 + \sigma_b^2}$`
- powers: if `$q = a^n$`, then `$\sigma_q/q = |n|\,\sigma_a/a$`
- mean of `$N$` equal measurements: `$\sigma_{\bar x} = \sigma/\sqrt N$`
</details>

## 3. What it means physically

Squaring the misses treats overshooting and undershooting alike and punishes big misses most. Dividing by `$\sigma$` means a point you measured carefully counts more than a rough one. If your error bars are right and your model is right, each point should miss by about one error bar on average, so χ² comes out near the number of points: that is the whole idea behind "reduced χ² ≈ 1".

## 4. Worked example

*A star's radius comes from `$R \propto \sqrt{L}/T^2$`. L is known to 10% and T to 2%. How well is R known?*

```math
\frac{\sigma_R}{R} = \sqrt{\left(\tfrac{1}{2}\times10\%\right)^2 + (2\times2\%)^2} = \sqrt{5^2 + 4^2}\,\% = 6.4\%
```

The temperature error, though only 2%, matters almost as much as the luminosity error, because T enters squared.

## 5. Practice

1. A fit to 22 points with 2 parameters gives χ² = 21. Is it good?
2. You measure a period ten times; the spread is 0.03 days. How well do you know the average?
3. `$m_1 = 12.30 \pm 0.02$`, `$m_2 = 11.85 \pm 0.03$`. What is `$m_1 - m_2$` with its error?

<details>
<summary>Answers</summary>

1. `$\chi^2_\nu = 21/20 = 1.05$`: good.
2. `$0.03/\sqrt{10} = 0.009$` days.
3. `$0.45 \pm \sqrt{0.02^2 + 0.03^2} = 0.45 \pm 0.036$`.
</details>

**Try it with real numbers:** fit real data with the [[radial-velocity-fitter]], the [[transit-light-curve-fitter]] or the [[rotation-curve-fitter]]; each reports its uncertainties.

**New words:** *uncertainty*, *least squares*, *chi-squared*, *reduced chi-squared*, *degrees of freedom*, *error propagation*.
