---
title: Bias and variance
seoTitle: 'Bias-variance trade-off explained, with a simulation'
summary: 'Every model''s test error splits into bias (wrong on average), variance (changes with the sample) and noise (nobody can remove). Train the same model on 20 different samples and see both, then read the dartboard.'
minutes: 25
updated: 2026-11-22
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
sources:
  - 'James, Witten, Hastie, Tibshirani and Taylor (2023), An Introduction to Statistical Learning with Applications in Python, Springer, Section 2.2.2 (the bias-variance trade-off) https://www.statlearning.com/'
  - 'Hastie, Tibshirani and Friedman (2009), The Elements of Statistical Learning, 2nd edition, Springer, Sections 7.2 and 7.3'
  - 'Geman, Bienenstock and Doursat (1992), Neural networks and the bias/variance dilemma, Neural Computation 4(1), 1-58 https://doi.org/10.1162/neco.1992.4.1.1'
---

**Module 7 · about 25 minutes · read first: 3.7, 6.1.** You'll be able to name the three parts of test error, tell from training and validation scores whether a model is too simple or too jumpy, and pick the right fix for each.

<div class="bigidea">A model can be wrong in two ways: it misses the same way every time (bias), or it changes a lot with each new sample (variance), and the cures are opposite.</div>

## 1. Why this matters

When a model disappoints, ask first: is it too simple, or too jumpy? The two problems need opposite fixes. One needs more flexibility, the other needs less. Guess wrong and you can waste days. Bias and variance are the two words for this question. They also explain why random forests average many trees and why boosting adds trees up (Module 6).

## 2. Two ways to be wrong

Picture an archer. Some archers always hit low and to the left: their arrows land close together, but in the wrong place. Others aim at the centre on average, but their arrows fly all over the board. Models behave the same way.

Imagine training the same kind of model many times, each time on a fresh sample from the same source.

- **Bias** is how far the **average** of those models is from the truth. A model that is too simple misses the same way every time, like the archer who always hits low.
- **Variance** is how much the models **differ** from each other. A model that is too flexible follows the noise in each sample, so every sample gives a different fit, like the archer whose arrows scatter.

<!--fig:dartboard-->

The simulation does this for real. It takes 20 samples of 12 points from one curve and fits 20 polynomials, so you can see how far the fits wander and where their average lands.

<!--fig:bias-variance-->

### Watch it happen

Here is the whole idea with five small numbers. At one point the true value is 5.

<div class="steps">
<div class="step"><p><b>Train five times.</b> The same model is trained on five different samples. At our point it predicts 6, 7, 6, 5 and 6. The truth is 5.</p></div>
<div class="step"><p><b>Find the centre.</b> The average prediction is (6 + 7 + 6 + 5 + 6) ÷ 5 = 6. The models miss by 1 on average, all in the same direction.</p></div>
<div class="step"><p><b>Bias².</b> Square that miss: (6 − 5)² = 1. This is the part of the error that more data will not fix, because the model itself is off.</p></div>
<div class="step"><p><b>Variance.</b> How far does each prediction sit from the centre of 6? Distances 0, 1, 0, −1, 0. Squares 0, 1, 0, 1, 0. Average: 2 ÷ 5 = 0.4.</p></div>
<div class="step"><p><b>Add the noise.</b> Real data also wobble by themselves. Say that noise has variance 0.6. Expected squared error = 1 + 0.4 + 0.6 = 2.0. Each part has a different cure.</p></div>
</div>

<div class="problem" data-problem="bias-variance-error"></div>

Try it: pick the line, then degree 9, and slide the number of examples. Watch training and test error meet or stay apart.

<figure class="fig" data-fig="@ai-learning-curves"><figcaption>A line is too simple (both errors stay high: more data will not help). A flexible model has a big gap that shrinks as data grows (more data helps). No model gets below the noise floor.</figcaption></figure>

## 3. The trade-off and the cures

More flexibility lowers bias and raises variance. Less flexibility does the opposite. Test error is lowest somewhere in between: the U-shaped curve of Lesson 3.7.

You can't watch bias and variance directly on real data, because you only have one sample. But training and validation error give the game away:

| | training error | validation error | diagnosis | fixes |
|---|---|---|---|---|
| A | high | high, close to training | **high bias** (underfitting) | more flexible model, better features, less regularisation, boosting |
| B | low | much higher | **high variance** (overfitting) | more data, simpler model, regularisation, averaging (bagging, forests), early stopping |
| C | low | low, close | good | ship it |

The third part, **noise**, is the randomness in the data itself: measurement error, or things your columns don't capture. No model can remove it. Only better data can.

<div class="meaning">

<dl>
<dt>y = f(x) + ε</dt><dd>what we observe: a true pattern f plus random noise ε</dd>
<dt>f̂ (f-hat)</dt><dd>the model you get from one particular training sample</dd>
<dt>Bias²</dt><dd>how far the average model is from the truth, squared: the error built into the kind of model you chose</dd>
<dt>Variance</dt><dd>how much the model changes from one sample to the next: the error that comes from the luck of the sample</dd>
<dt>σ² (noise)</dt><dd>the wobble in the data that no model can predict</dd>
<dt>Physical meaning</dt><dd>A forecaster that always says "same as last week" is steady but stubbornly wrong (bias). One that rebuilds itself from scratch every Monday is clever but nervous (variance). Good models sit between, and part of tomorrow's sales will always be a surprise (noise).</dd>
</dl>

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** averaged over possible training sets, squared test error splits into three parts that can be measured separately.

**The decomposition:** data come from `$y = f(x) + \varepsilon$` with noise variance `$\sigma^2$`. Let `$\hat{f}$` be the model trained on a random sample, and `$\bar{f}(x) = E[\hat{f}(x)]$` its average over samples (`$E$` means "average over many tries"). At a point `$x$`:

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

<div class="myth">

**"More data always helps."** More data mostly cuts **variance**: each fit depends less on the luck of the sample. It does little for **bias**. A straight line fitted to a million points from a curve is still a straight line, missing the curve in the same places. If training and validation error are both high and close, collect better features or use a more flexible model, not just more rows.

</div>

## 4. Worked example

*Made-up numbers.* A shop forecasts daily sales. Errors are root mean squared (RMSE), in units sold.

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

<div class="keypoints">

- Test error = bias² + variance + noise.
- Bias: the model misses the same way every time (too simple). Variance: the model changes a lot with the sample (too flexible).
- High training and validation error, close together, means high bias. Low training error with much higher validation error means high variance.
- More data, simpler models and averaging cut variance; more flexibility and better features cut bias. Nothing removes noise except better data.

</div>
