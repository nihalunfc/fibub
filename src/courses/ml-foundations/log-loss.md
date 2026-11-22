---
title: 'Log-loss: how logistic regression learns'
seoTitle: 'Log-loss (cross-entropy) and training logistic regression'
summary: 'Logistic regression is trained by making the log-loss (cross-entropy) small. See why it punishes confident wrong answers so hard, derive its surprisingly simple gradient, and connect it to maximum likelihood.'
minutes: 30
updated: 2026-11-22
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
sources:
  - 'Goodfellow, Bengio and Courville (2016), Deep Learning, MIT Press, Section 5.5 (Maximum likelihood estimation) and 6.2.2 https://www.deeplearningbook.org/'
  - 'Bishop (2006), Pattern Recognition and Machine Learning, Springer, Section 4.3.2 (cross-entropy error for logistic regression)'
  - 'scikit-learn API reference: sklearn.metrics.log_loss https://scikit-learn.org/stable/modules/generated/sklearn.metrics.log_loss.html'
---

**Module 4 · about 30 minutes · read first: 1.5, 3.3, 4.2.** You'll be able to compute log-loss, explain why it suits probabilities, derive the gradient of logistic regression, and say what maximum likelihood means.

<div class="bigidea">Log-loss charges a model for how surprised it was by the truth, so a confident wrong answer costs far more than a humble one.</div>

## 1. Why this matters

A model that gives probabilities needs a score that rewards good probabilities, not just right yes/no answers. **Log-loss**, also called **binary cross-entropy**, is that score. Its many-class version, **cross-entropy**, is exactly what language models make small when they learn to predict the next word (Lesson 10.6). Learn it here on one neuron and you know the training rule of an LLM.

## 2. The loss for one example

Think of it as a "surprise bill". If the truth is "yes" (`$y = 1$`), the bill is `$-\ln p$`. If the truth is "no" (`$y = 0$`), it is `$-\ln(1 - p)$`. Here ln is the natural logarithm and `$p$` the model's probability of "yes". One formula covers both cases, because one of the two terms is always zero:

```math
\ell(y, p) = -\big[\, y \ln p + (1 - y) \ln(1 - p) \,\big]
```

<!--fig:log-loss-curve-->

- Right and sure (`$p = 0.99$` for a yes): bill 0.01.
- Unsure (`$p = 0.5$`): bill 0.69 either way.
- Wrong and sure (`$p = 0.01$` for a yes): bill 4.6, and it heads to infinity as `$p$` heads to 0.

The average bill over all training examples is the model's **log-loss**. Training finds the weights that make it as small as possible.

<div class="meaning">

<dl>
<dt>y</dt><dd>The true label: 1 for yes, 0 for no.</dd>
<dt>p</dt><dd>The model's probability of yes.</dd>
<dt>−ln p</dt><dd>The surprise when a yes happens: 0 if p was 1, larger the lower p was.</dd>
<dt>ℓ</dt><dd>The loss for one example; the log-loss is its average over all examples.</dd>
<dt>Physical meaning</dt><dd>It is how a fair forecaster is scored over a year. Saying "99 % sun" on a day it pours costs far more than saying "60 %". The best long-run score comes from stating what you truly believe, so the model can't game it.</dd>
</dl>

</div>

<div class="problem" data-problem="log-loss-mean"></div>

## 3. The gradient: error times input

To walk downhill we need the slope (gradient) of the loss for each weight. With `$p_i = \sigma(z_i)$` and `$z_i = \mathbf{w} \cdot \mathbf{x}_i + b$`, use the chain rule in three links: loss → `$p$` → `$z$` → `$w_j$`.

- `$\dfrac{\partial \ell}{\partial p} = -\dfrac{y}{p} + \dfrac{1 - y}{1 - p} = \dfrac{p - y}{p(1 - p)}$`
- `$\dfrac{\partial p}{\partial z} = p(1 - p)$` (the sigmoid's slope from Lesson 4.2)
- `$\dfrac{\partial z}{\partial w_j} = x_j$`

Multiply them and the `$p(1 - p)$` cancels:

```math
\frac{\partial \ell}{\partial w_j} = (p - y)\, x_j, \qquad \frac{\partial \ell}{\partial b} = p - y
```

Averaged over the training set, that is the gradient. It has exactly the same shape as linear regression's (Lesson 3.3): **error times input**, with the error now a gap in probability. There is no formula that jumps straight to the best weights this time, so we walk downhill with gradient descent. Luckily the log-loss is a perfect bowl (**convex**), so there is only one bottom to find.

<div class="steps">
<div class="step"><p><b>Start flat.</b> Three students studied 1, 2 and 3 hours; only the last passed (y = 0, 0, 1). With w = 0 and b = 0, every p = σ(0) = 0.5. Log-loss 0.693.</p></div>
<div class="step"><p><b>Errors.</b> p − y = 0.5, 0.5, −0.5. Two predictions were too high, one too low.</p></div>
<div class="step"><p><b>Gradient for w.</b> Average of error × hours: (0.5 × 1 + 0.5 × 2 − 0.5 × 3) ÷ 3 = 0. The hours cancel out for now, so w stays put.</p></div>
<div class="step"><p><b>Gradient for b.</b> Average error: 0.5 ÷ 3 = 0.167. Step against it (learning rate 1): b = −0.167. The model first learns "most students fail".</p></div>
<div class="step"><p><b>Next step.</b> Now every p = 0.458, errors 0.458, 0.458, −0.542. The w gradient is (0.458 + 0.917 − 1.625) ÷ 3 = −0.083, so w starts to rise: more hours, more passing.</p></div>
</div>

<div class="problem" data-problem="log-loss-step"></div>

<div class="myth">

**"A model with 90 % accuracy must have a low log-loss."** Not necessarily. Accuracy only checks which side of 0.5 each prediction falls. Log-loss also checks how sure the model was. A model that is right 90 % of the time but says 0.999 on its wrong answers can have a worse log-loss than a humbler model with lower accuracy.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** making log-loss small is the same as **maximum likelihood**: choosing the weights that make the labels we actually saw as probable as possible.

**Equations:** the probability the model gives to the whole training set (treating examples as independent) is the **likelihood**

```math
\mathcal{L}(\mathbf{w}) = \prod_{i=1}^{n} p_i^{\,y_i} (1 - p_i)^{1 - y_i}
```

Each factor is `$p_i$` for a yes and `$1 - p_i$` for a no. Products of many small numbers are awkward, so take logs (which turn products into sums) and a minus sign (to minimise instead of maximise):

```math
-\frac{1}{n}\ln \mathcal{L}(\mathbf{w}) = -\frac{1}{n}\sum_{i=1}^{n} \big[ y_i \ln p_i + (1 - y_i)\ln(1 - p_i) \big]
```

which is the mean log-loss. Same best weights either way.

**Analogy:** a weather forecaster scored over a year, as in the box above.

**Try it:** two examples: a yes with `$p = 0.8$` and a no with `$p = 0.3$`. Mean log-loss? (`$(-\ln 0.8 - \ln 0.7)/2 = (0.223 + 0.357)/2 = 0.29$`.)
</details>

## 4. Worked example

*Made-up numbers.* One input, three students: `$x = $` 1, 2, 3 hours, `$y = $` 0, 0, 1. Start at `$w = 0$`, `$b = 0$`, learning rate 1.

- All `$p = \sigma(0) = 0.5$`. Errors `$p - y$`: 0.5, 0.5, −0.5. Log-loss = 0.693.
- Gradient for `$w$`: `$\frac{1}{3}(0.5 \times 1 + 0.5 \times 2 - 0.5 \times 3) = 0$`. For `$b$`: `$\frac{1}{3}(0.5) = 0.167$`.
- Update: `$w = 0$`, `$b = -0.167$`. The model first learns "most students fail" (only 1 of 3 passed) by lowering the bias.
- Next step, `$p = \sigma(-0.167) = 0.458$` for all. Errors 0.458, 0.458, −0.542. Gradient for `$w$`: `$\frac{1}{3}(0.458 + 0.917 - 1.625) = -0.083$`: now `$w$` starts to rise, because the one pass had the most hours.

After a few hundred steps the model settles with a steep positive `$w$`. (With data this tidy, where one cut-off separates the classes perfectly, `$w$` would grow for ever: the loss keeps falling as the S gets steeper. A small L2 penalty, Lesson 3.8, stops that.)

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

<div class="keypoints">

- Log-loss for one example is −ln p if the truth is yes and −ln(1 − p) if it is no.
- It punishes confident wrong answers very hard, and rewards honest probabilities.
- Its gradient is simply (p − y) × x: error times input.
- The log-loss of logistic regression is a convex bowl, so gradient descent finds the single best answer.
- Making log-loss small is the same as maximum likelihood.

</div>

**Try it on your own data:** the [[small-model-trainer]] trains logistic regression on your CSV by exactly this gradient descent, and shows the test accuracy.

**New words:** *log-loss*, *binary cross-entropy*, *likelihood*, *maximum likelihood*, *convex*.
