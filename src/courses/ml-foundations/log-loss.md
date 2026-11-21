---
title: 'Log-loss: how logistic regression learns'
seoTitle: 'Log-loss (cross-entropy) and training logistic regression'
summary: 'Logistic regression is trained by making the log-loss (cross-entropy) small. See why it punishes confident wrong answers so hard, derive its surprisingly simple gradient, and connect it to maximum likelihood.'
minutes: 30
updated: 2026-11-21
quiz:
  - q: 'The truth is "yes" and the model says p = 0.9. What is the log-loss for this example?'
    choices: ['0.105', '0.9', '2.303']
    ans: 0
    why: −ln(0.9) ≈ 0.105. Had the model said 0.1, the loss would be −ln(0.1) ≈ 2.303.
  - q: 'The gradient of the log-loss for logistic regression with respect to a weight wⱼ is:'
    choices: ['(1/n)·Σ (pᵢ − yᵢ)·xᵢⱼ', '(1/n)·Σ yᵢ·xᵢⱼ', 'Σ pᵢ']
    ans: 0
    why: The sigmoid's slope cancels neatly against the log, leaving "error times input", the same shape as for linear regression.
  - q: Why not use squared error for logistic regression?
    choices: ['It is not allowed', 'With the sigmoid it gives a bumpy loss with flat regions, and punishes confident mistakes too gently', 'It is always zero']
    ans: 1
    why: Squared error through a sigmoid is not a nice bowl, and a prediction of 0.01 for a true "yes" costs at most 1. Log-loss is a smooth bowl and costs 4.6.
---

**Module 4 · about 30 minutes · read first: 1.5, 3.3, 4.2.** You'll be able to compute log-loss, explain why it suits probabilities, derive the gradient of logistic regression, and say what maximum likelihood means.

## 1. Why this matters

A probability model needs a loss that rewards good probabilities, not just right yes/no answers. Log-loss, also called **binary cross-entropy**, is that loss. Its multi-class version, **cross-entropy**, is exactly what language models minimise when they learn to predict the next word (Lesson 10.6). Learn it here on one neuron and you have the training rule of an LLM.

## 2. The loss for one example

If the truth is `$y = 1$`, the loss is `$-\ln p$`. If the truth is `$y = 0$`, it is `$-\ln(1 - p)$`. One formula covers both:

```math
\ell(y, p) = -\big[\, y \ln p + (1 - y) \ln(1 - p) \,\big]
```

<!--fig:log-loss-curve-->

- Right and sure (`$p = 0.99$` for a yes): loss 0.01.
- Unsure (`$p = 0.5$`): loss 0.69 either way.
- Wrong and sure (`$p = 0.01$` for a yes): loss 4.6, and it heads to infinity as `$p \to 0$`.

The average over all training examples is the **log-loss** of the model. Training finds the weights that make it smallest.

## 3. The gradient: error times input

With `$p_i = \sigma(z_i)$` and `$z_i = \mathbf{w} \cdot \mathbf{x}_i + b$`, use the chain rule in three links: loss → `$p$` → `$z$` → `$w_j$`.

- `$\dfrac{\partial \ell}{\partial p} = -\dfrac{y}{p} + \dfrac{1 - y}{1 - p} = \dfrac{p - y}{p(1 - p)}$`
- `$\dfrac{\partial p}{\partial z} = p(1 - p)$` (the sigmoid's slope from Lesson 4.2)
- `$\dfrac{\partial z}{\partial w_j} = x_j$`

Multiply them and the `$p(1 - p)$` cancels:

```math
\frac{\partial \ell}{\partial w_j} = (p - y)\, x_j, \qquad \frac{\partial \ell}{\partial b} = p - y
```

Averaged over the training set, that is the gradient. It has exactly the same shape as linear regression's (Lesson 3.3), "error times input", with the error now a probability gap. Gradient descent does the rest. There is no formula for the best weights this time, so we must walk downhill, but the log-loss is a perfect bowl (convex), so there is only one bottom to find.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** minimising log-loss is the same as **maximum likelihood**: choosing the weights that make the observed labels as probable as possible.

**Equations:** the probability the model gives to the whole training set (assuming independent examples) is the **likelihood**

```math
\mathcal{L}(\mathbf{w}) = \prod_{i=1}^{n} p_i^{\,y_i} (1 - p_i)^{1 - y_i}
```

Each factor is `$p_i$` for a yes and `$1 - p_i$` for a no. Products of many small numbers are awkward, so take logs (which turns products into sums) and a minus sign (to minimise instead of maximise):

```math
-\frac{1}{n}\ln \mathcal{L}(\mathbf{w}) = -\frac{1}{n}\sum_{i=1}^{n} \big[ y_i \ln p_i + (1 - y_i)\ln(1 - p_i) \big]
```

which is the mean log-loss. Same weights either way.

**Analogy:** a weather forecaster scored over a year. Saying 99 % sun on a day it pours should cost a lot more than saying 60 %. Log-loss is that scoring rule, and it can't be gamed: the best long-run score comes from stating your true belief.

**Try it:** two examples: a yes with `$p = 0.8$` and a no with `$p = 0.3$`. Mean log-loss? (`$(-\ln 0.8 - \ln 0.7)/2 = (0.223 + 0.357)/2 = 0.29$`.)
</details>

## 4. Worked example

*Made-up numbers.* One input, three students: `$x = $` 1, 2, 3 hours, `$y = $` 0, 0, 1. Start at `$w = 0$`, `$b = 0$`, learning rate 1.

- All `$p = \sigma(0) = 0.5$`. Errors `$p - y$`: 0.5, 0.5, −0.5. Log-loss = 0.693.
- Gradient for `$w$`: `$\frac{1}{3}(0.5 \times 1 + 0.5 \times 2 - 0.5 \times 3) = 0$`. For `$b$`: `$\frac{1}{3}(0.5) = 0.167$`.
- Update: `$w = 0$`, `$b = -0.167$`. The model first learns "most students fail" (only 1 of 3 passed) by lowering the bias.
- Next step, `$p = \sigma(-0.167) = 0.458$` for all. Errors 0.458, 0.458, −0.542. Gradient for `$w$`: `$\frac{1}{3}(0.458 + 0.917 - 1.625) = -0.083$`: now `$w$` starts to rise, because the one pass had the most hours.

After a few hundred steps the model settles with a steep positive `$w$`. (With data this tidy, where a cut-off separates the classes perfectly, `$w$` would grow for ever: the loss keeps falling as the S gets steeper. A small L2 penalty, Lesson 3.8, stops that.)

## 5. Practice

1. A yes is predicted at `$p = 0.5$`. What is its log-loss?
2. Which costs more: predicting 0.99 for a no, or 0.6 for a no?
3. What is `$\partial \ell / \partial b$` for a yes predicted at 0.7?

<details>
<summary>Answers</summary>

1. `$-\ln 0.5 \approx 0.693$`.
2. 0.99 for a no: `$-\ln(0.01) \approx 4.6$`, against `$-\ln(0.4) \approx 0.92$`.
3. `$p - y = 0.7 - 1 = -0.3$`: the bias should go up.
</details>

**Try it on your own data:** the [[small-model-trainer]] trains logistic regression on your CSV by exactly this gradient descent, and shows the test accuracy.

**New words:** *log-loss*, *binary cross-entropy*, *likelihood*, *maximum likelihood*, *convex*.
