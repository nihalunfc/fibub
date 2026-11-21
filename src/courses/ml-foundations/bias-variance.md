---
title: Bias and variance
seoTitle: 'Bias-variance trade-off explained, with a simulation'
summary: 'Every model''s test error splits into bias (wrong on average), variance (changes with the sample) and noise (nobody can remove). Train the same model on 20 different samples and see both, then read the dartboard.'
minutes: 25
updated: 2026-11-21
quiz:
  - q: A straight line fitted to a strongly curved pattern has
    choices: ['High bias, low variance', 'Low bias, high variance', 'Low bias, low variance']
    ans: 0
    why: Every sample gives nearly the same line (low variance), and they all miss the curve the same way (high bias).
  - q: Which change mainly lowers variance?
    choices: ['More training data, or averaging many models', 'A more flexible model', 'Removing regularisation']
    ans: 0
    why: More data and averaging both make the fitted model depend less on the luck of one sample.
  - q: 'Expected test error (squared) equals:'
    choices: ['bias² + variance + noise', 'bias + variance', 'bias × variance']
    ans: 0
    why: 'The decomposition: E[(y − f̂)²] = bias² + variance + σ², where σ² is the noise in the data.'
---

**Module 7 · about 25 minutes · read first: 3.7, 6.1.** You'll be able to name the three parts of test error, diagnose high bias or high variance from training and validation scores, and pick the right fix for each.

## 1. Why this matters

When a model disappoints, the first question is: is it too simple or too jumpy? The answers need opposite fixes (more flexibility, or less), and guessing wrong wastes days. Bias and variance are the two words for that question, and they also explain why forests average and boosting adds (Module 6).

## 2. Two ways to be wrong

Imagine training the same kind of model many times, each on a fresh sample from the same source.

- **Bias:** how far the **average** of those models is from the truth. A model that is too simple misses the same way every time.
- **Variance:** how much the models **differ** from each other. A model that is too flexible follows each sample's noise, so every sample gives a different fit.

<!--fig:dartboard-->

The simulation does this for real: 20 samples of 12 points from one curve, 20 polynomial fits.

<!--fig:bias-variance-->

## 3. The trade-off and the cures

More flexibility lowers bias and raises variance; less does the opposite. Test error is lowest in between: the U-shaped curve of Lesson 3.7.

How to tell which problem you have, from training and validation error:

| | training error | validation error | diagnosis | fixes |
|---|---|---|---|---|
| A | high | high, close to training | **high bias** (underfitting) | more flexible model, better features, less regularisation, boosting |
| B | low | much higher | **high variance** (overfitting) | more data, simpler model, regularisation, averaging (bagging, forests), early stopping |
| C | low | low, close | good | ship it |

The third part, **noise**, is the randomness in the data itself (measurement error, things the columns don't capture). No model can remove it; only better data can.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** averaged over possible training sets, squared test error splits into three parts that can be measured separately.

**The decomposition:** data come from `$y = f(x) + \varepsilon$` with noise variance `$\sigma^2$`. Let `$\hat{f}$` be the model trained on a random sample, and `$\bar{f}(x) = E[\hat{f}(x)]$` its average over samples. At a point `$x$`:

```math
E\big[(y - \hat{f}(x))^2\big] = \text{bias}^2 + \text{variance} + \sigma^2
```

where

```math
\text{bias}^2 = \big(\bar{f}(x) - f(x)\big)^2
```

```math
\text{variance} = E\big[(\hat{f}(x) - \bar{f}(x))^2\big]
```

The cross terms vanish because the noise in a new `$y$` is independent of the training sample.

**Analogy:** the dartboard. Bias is where the cluster of darts is centred; variance is how widely they scatter.

**Try it:** at a point, the truth is 5. Five models trained on different samples predict 6, 7, 6, 5, 6. Bias² and variance? (Average 6, so bias² = 1. Variance = (0 + 1 + 0 + 1 + 0)/5 = 0.4.)
</details>

## 4. Worked example

*Made-up numbers.* A shop forecasts daily sales. Errors are root mean squared, in units sold.

| model | training RMSE | validation RMSE |
|---|---|---|
| average of last week | 41 | 42 |
| linear model on 6 columns | 30 | 31 |
| boosted trees, 2,000 rounds, depth 10 | 4 | 38 |
| boosted trees, early stopping (310 rounds), depth 4 | 21 | 24 |

The first two are close on training and validation: high bias. The third has a huge gap: high variance. The fourth is the best compromise. The noise floor is probably near 20: even perfect knowledge of the columns can't predict a sudden bus strike.

## 5. Practice

1. In the simulation, which degree gives the lowest bias² + variance?
2. Training error 3 %, validation error 3.5 %, but the business needs 1 %. Bias or variance problem?
3. Why does a random forest mostly reduce variance, and boosting mostly bias?

<details>
<summary>Answers</summary>

1. Around 3 on most draws (degree 1 is a close second, because this curve is gentle).
2. Bias: training and validation agree, so the model isn't overfitting; it needs more flexibility or better features.
3. A forest averages deep trees that already have low bias, cancelling their variance. Boosting adds up very simple, high-bias pieces until the sum is flexible enough.
</details>

**Try it on your own data:** the [[small-model-trainer]] shows training and test accuracy side by side; use the table above to diagnose your model.

**New words:** *bias*, *variance*, *irreducible error* (noise), *bias-variance decomposition*, *learning curve*.
