---
title: Fitting by gradient descent
summary: 'Instead of a formula, start with any line and keep stepping downhill on the error. Walk the error bowl of a straight line, see why the learning rate and scaling matter, and meet stochastic and mini-batch descent.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'For the mean squared error of ŷ = wx + b, the gradient with respect to b is:'
    choices: ['(2/n)·Σ(ŷᵢ − yᵢ)', '(2/n)·Σ(ŷᵢ − yᵢ)·xᵢ', 'Σ yᵢ']
    ans: 0
    why: The derivative of (ŷᵢ − yᵢ)² with respect to b is 2(ŷᵢ − yᵢ), because ŷᵢ changes by 1 when b does. Averaged over n rows gives (2/n)·Σ(ŷᵢ − yᵢ).
  - q: Why does gradient descent zig-zag when the inputs are not scaled?
    choices: ['The error bowl becomes a long narrow valley, steep across and nearly flat along it', 'The computer is too slow', 'The data has outliers']
    ans: 0
    why: Unscaled inputs stretch the bowl. A rate small enough not to blow up across the steep sides crawls along the flat floor.
  - q: What does stochastic (or mini-batch) gradient descent do differently?
    choices: ['It uses a random small batch of rows for each step instead of all rows', 'It picks random weights each step', 'It never converges']
    ans: 0
    why: Each step's gradient is estimated from a few rows. Steps are noisier but far cheaper, which is how large models are trained.
sources:
  - 'Goodfellow, I., Bengio, Y. and Courville, A. (2016), Deep Learning, MIT Press, Sections 4.3 and 8.1 to 8.3 (gradient descent and SGD) https://www.deeplearningbook.org/'
  - 'Robbins, H. and Monro, S. (1951), A Stochastic Approximation Method, The Annals of Mathematical Statistics 22(3), 400-407 https://doi.org/10.1214/aoms/1177729586'
  - 'scikit-learn user guide: Stochastic Gradient Descent https://scikit-learn.org/stable/modules/sgd.html'
---

**Module 3 · about 30 minutes · read first: 1.5, 3.2.** You'll be able to compute the gradient of the mean squared error, run gradient descent on a straight line, choose a learning rate, and explain why large models use mini-batches.

<div class="bigidea">Most models have no formula for their best weights, so they find them by walking downhill: measure the slope of the error, take a small step against it, and repeat.</div>

## 1. Why this matters

Least squares has a neat formula, but almost nothing else does. Think of finding the lowest point of a dark valley with only a torch that lights the ground at your feet: you can't see the bottom, but you can always see which way is down. Logistic regression, neural networks and language models have no formula for their best weights. They are all trained the same way: start somewhere, measure the slope of the error, step downhill, repeat. Seeing this work on a straight line, where you can check the answer, is the best way to trust it on a billion-weight model.

## 2. The error as a landscape

For a line `$\hat y = wx + b$`, every pair `$(w, b)$` gives a mean squared error. Plot the error for every pair and you get a surface: a bowl, lowest at the least-squares line. Training is walking to the bottom of the bowl.

## 3. The gradient of the mean squared error

The loss is `$L(w, b) = \frac{1}{n} \sum_i (w x_i + b - y_i)^2$`. By the chain rule (Lesson 1.5):

```math
\frac{\partial L}{\partial w} = \frac{2}{n} \sum_{i=1}^{n} (\hat{y}_i - y_i)\, x_i, \qquad \frac{\partial L}{\partial b} = \frac{2}{n} \sum_{i=1}^{n} (\hat{y}_i - y_i)
```

Read them in words: "average the errors (for `$b$`), or the errors weighted by their inputs (for `$w$`)". If predictions are too high on average, the bias gradient is positive and the step lowers `$b$`. If they are too high mainly where `$x$` is large, the slope gradient is positive and the step flattens the line.

The update for both, at the same time, with learning rate `$\eta$`:

```math
w \leftarrow w - \eta \frac{\partial L}{\partial w}, \qquad b \leftarrow b - \eta \frac{\partial L}{\partial b}
```

Here are the first steps on three points, (0, 1), (1, 3) and (2, 5), whose true line is y = 2x + 1, with learning rate 0.2:

<div class="steps" data-fig="gradient-descent-steps">
<div class="step"><b>Step 0: start flat.</b> w = 0, b = 0, so every prediction is 0. Errors ŷ − y are −1, −3, −5. Slopes: ∂L/∂w = −8.67 and ∂L/∂b = −6. Both negative, so both must go up.</div>
<div class="step"><b>Step 1.</b> w = 0 − 0.2 × (−8.67) = 1.73 and b = 0 − 0.2 × (−6) = 1.2. The error drops from 11.7 to 0.05 in a single step.</div>
<div class="step"><b>Step 2.</b> The slopes are now small (−0.49 and −0.13), so the step is small: w = 1.83, b = 1.23.</div>
<div class="step"><b>Step 3.</b> w = 1.85, b = 1.20. The bias now overshoots a little and is pulled back, while w keeps creeping up.</div>
<div class="step"><b>Keep going.</b> After about 60 steps, w = 2.00 and b = 1.00: the same answer as the least-squares formula, found without any formula.</div>
</div>

<div class="problem" data-problem="gradient-descent-step"></div>

## 4. Try it

<!--fig:loss-bowl-->

Experiments:

- **Scaled x, rate about 0.1:** smooth steps into the centre of the round bowl in 20 to 40 steps.
- **Scaled x, rate above 1:** the steps overshoot further each time and the error blows up.
- **Raw x:** the bowl stretches into a narrow diagonal valley. Any rate big enough to move quickly along the valley throws you across it. Small rates crawl. This is why Lesson 2.4 said: scale your inputs before gradient descent.

## 5. Batches: how big models do it

The gradient above averages over all `$n$` rows. With 10 rows that is instant; with 10 billion it is not. Three choices:

| Version | Rows per step | Steps | Notes |
|---|---|---|---|
| **Batch** gradient descent | all `$n$` | smooth, exact | Slow per step on big data |
| **Stochastic** gradient descent (SGD) | 1 random row | very noisy | Cheap; the noise can help escape poor valleys |
| **Mini-batch** | e.g. 32 to 4,096 | a little noisy | What practically all neural networks use |

A pass through all the rows is called an **epoch**. (Think of a batch as tasting the whole pot of soup before adding salt, and a mini-batch as tasting a spoonful: a spoonful is quicker and nearly as informative.) Lesson 9.5 returns to batches, epochs and the improved step rules (momentum, Adam) used to train networks.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** repeat "compute the gradient of the loss, step a little against it" until the loss stops falling.

**Equations:** in vector form, with all weights `$\boldsymbol{\theta}$`,

```math
\boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t - \eta \, \nabla L(\boldsymbol{\theta}_t)
```

**When it converges:** for a bowl whose steepest curvature is `$\lambda_{\max}$`, steps settle only if `$\eta < 2 / \lambda_{\max}$`. For the mean squared error of a line with standardised x, the curvature in each direction is 2, so `$\eta < 1$`. Unscaled x spread from 1 to 9 has an average `$x^2$` of about 30, so the steepest curvature is about 2 × 31 ≈ 62 and `$\eta$` must stay below about 0.03. That rate crawls along the flattest direction, whose curvature is below 1.

**Analogy:** a skier who can only feel the slope underfoot. Short careful turns are safe but slow; long bold ones overshoot the bottom and climb the far side.

**Try it:** data (1, 3), (2, 5). Start at `$w = 0$`, `$b = 0$`, rate 0.1. (Predictions 0, 0; errors −3, −5. `$\partial L/\partial w = \frac{2}{2}((-3)(1) + (-5)(2)) = -13$`, `$\partial L/\partial b = -8$`. New `$w = 1.3$`, `$b = 0.8$`.)
</details>

<div class="meaning">

<dl>
<dt>L(w, b)</dt><dd>The loss: the mean squared error for one choice of weights. Every (w, b) pair has its own height.</dd>
<dt>∂L/∂w, ∂L/∂b</dt><dd>How steeply the loss rises if you nudge w or b: the average error, weighted by x for w.</dd>
<dt>η</dt><dd>The learning rate: how far to move against the slope each time.</dd>
<dt>Epoch</dt><dd>One pass through all the training rows.</dd>
<dt>Physical meaning</dt><dd>A marble released on the side of a bowl rolls to the bottom without knowing where the bottom is; at each moment the tilt under it tells it which way to go. Gradient descent is that marble in slow motion, one measured step at a time, in a "bowl" that may have millions of directions.</dd>
</dl>

</div>

<div class="myth">

**"A bigger learning rate always trains faster."** Only up to a point. Past it, each step jumps over the bottom of the valley and lands higher up the far side, and the error grows instead of shrinking. With unscaled inputs the safe rate can be tiny. If the loss rises, the first fix is a smaller rate and scaled inputs.

</div>

## 6. Worked example

*Made-up numbers.* Three points (0, 1), (1, 3), (2, 5), so the true line is `$y = 2x + 1$`. Start at `$w = 0$`, `$b = 0$`, `$\eta = 0.2$`.

| step | w | b | predictions | errors ŷ − y | ∂L/∂w | ∂L/∂b |
|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0, 0, 0 | −1, −3, −5 | −8.67 | −6 |
| 1 | 1.73 | 1.2 | 1.2, 2.93, 4.67 | 0.2, −0.07, −0.33 | −0.49 | −0.13 |
| 2 | 1.83 | 1.23 | 1.23, 3.06, 4.89 | 0.23, 0.06, −0.11 | −0.11 | 0.12 |

The gradients for step 0: `$\partial L/\partial w = \frac{2}{3}(0 \cdot (-1) + 1 \cdot (-3) + 2 \cdot (-5)) = -8.67$` and `$\partial L/\partial b = \frac{2}{3}(-9) = -6$`. After a few dozen more steps, `$w$` and `$b$` settle at 2 and 1, the same answer as the least-squares formula.

## 7. Practice

1. Your loss rises every step. What do you change?
2. After 1,000 steps the loss is still falling slowly and steadily. What could help?
3. Why might two runs of stochastic gradient descent end with slightly different weights?

<details>
<summary>Answers</summary>

1. Lower the learning rate (and check the inputs are scaled).
2. A larger learning rate, scaling the inputs, or a smarter step rule such as momentum or Adam.
3. Each run picks rows in a different random order, so the paths differ. With a bowl-shaped loss they end near the same bottom; with bumpy losses (neural networks) they may end in different valleys.
</details>

**New words:** *loss landscape*, *learning rate*, *batch*, *stochastic gradient descent*, *mini-batch*, *epoch*, *convergence*.

<div class="keypoints">

- Gradient descent repeats: compute the slope of the loss for every weight, then step a little against it.
- For a line with mean squared error, the slopes are averages of the errors (for b) and of the errors times x (for w).
- Too large a learning rate overshoots and blows up; too small crawls. Scaling the inputs makes the bowl round and training easy.
- Big models use mini-batches: each step uses a small random handful of rows, and one pass through all rows is an epoch.

</div>
