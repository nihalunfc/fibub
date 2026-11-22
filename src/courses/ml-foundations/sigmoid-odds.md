---
title: 'The sigmoid and odds: from a line to a probability'
seoTitle: 'Logistic regression: the sigmoid function and odds'
summary: 'Logistic regression keeps the straight-line score of a linear model and squeezes it through the S-shaped sigmoid into a probability between 0 and 1. Shape the curve with two sliders and learn to read weights as changes in odds.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: What is σ(0)?
    choices: ['0', '0.5', '1']
    ans: 1
    why: σ(0) = 1 / (1 + e⁰) = 1 / 2. A score of zero means even chances.
  - q: A probability of 0.8 is what odds?
    choices: ['0.8 to 1', '4 to 1', '8 to 1']
    ans: 1
    why: Odds = p / (1 − p) = 0.8 / 0.2 = 4.
  - q: 'In a logistic model, the weight on "hours studied" is 0.7. What does one extra hour do?'
    choices: ['Adds 0.7 to the probability', 'Multiplies the odds of passing by e^0.7 ≈ 2', 'Adds 70 % to the mark']
    ans: 1
    why: Weights add to the log-odds, so each extra hour multiplies the odds by e^0.7 ≈ 2.01. The change in probability depends on where you start.
sources:
  - 'James, Witten, Hastie and Tibshirani (2021), An Introduction to Statistical Learning, 2nd edition, Springer, Section 4.3 (Logistic regression) https://www.statlearning.com/'
  - 'Bishop (2006), Pattern Recognition and Machine Learning, Springer, Section 4.3.2 (Logistic regression)'
  - 'scikit-learn user guide: Logistic regression https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression'
---

**Module 4 · about 25 minutes · read first: 1.5, 3.1, 4.1.** You'll be able to compute the sigmoid, convert between probability, odds and log-odds, and interpret a logistic regression weight.

<div class="bigidea">Logistic regression adds up evidence as a score, then squeezes that score through an S-shaped curve so it always lands between 0 and 1.</div>

## 1. Why this matters

Logistic regression is the everyday workhorse of yes/no prediction in medicine, finance and marketing. It is also the simplest neural network: one "neuron" with an S-shaped curve. Its output is a real probability, its weights can be explained in plain words, and the same S-curve comes back in Lessons 9.2 and 10.4.

## 2. The model

Start with the straight-line score from Module 3. Each input gets a weight, and a bias is added:

```math
z = \mathbf{w} \cdot \mathbf{x} + b
```

Here `$\mathbf{x}$` is the list of inputs, `$\mathbf{w}$` their weights (how much each counts), `$b$` the bias (the starting point), and `$z$` the score. `$z$` can be any number at all, from very negative to very positive. To turn it into a probability, squeeze it through the **sigmoid** (also called the logistic function):

```math
p = \sigma(z) = \frac{1}{1 + e^{-z}}
```

`$e \approx 2.718$` is the base of natural logarithms. You don't need to love it: just watch what the formula does.

- Big positive `$z$`: `$e^{-z}$` is tiny, so `$p$` is close to 1.
- `$z = 0$`: `$e^0 = 1$`, so `$p = 1/2 = 0.5$`.
- Big negative `$z$`: `$e^{-z}$` is huge, so `$p$` is close to 0.

<!--fig:sigmoid-fit-->

The weight `$w$` sets how steep the S is: a big weight means a small change in x swings the probability fast. The bias slides the S sideways. The 50 % point, where `$z = 0$`, sits at `$x = -b/w$`.

<div class="steps">
<div class="step"><p><b>Inputs to a score.</b> A pass/fail model uses hours studied: z = 0.7 × hours − 4.2. A student who studied 8 hours gets z = 5.6 − 4.2 = 1.4.</p></div>
<div class="step"><p><b>Flip the sign and raise e to it.</b> e<sup>−1.4</sup> ≈ 0.247.</p></div>
<div class="step"><p><b>Add 1 and take one over it.</b> 1 ÷ (1 + 0.247) ≈ 0.80. So the model gives this student an 80 % chance of passing.</p></div>
<div class="step"><p><b>Read it as odds.</b> 0.80 ÷ 0.20 = 4: "4 to 1 on". That is just e<sup>z</sup> = e<sup>1.4</sup> ≈ 4.06, rounded.</p></div>
<div class="step"><p><b>Two more hours.</b> z rises by 1.4 to 2.8, so the odds are multiplied by e<sup>1.4</sup> ≈ 4 again: about 16 to 1, a 94 % chance.</p></div>
</div>

<div class="problem" data-problem="sigmoid-odds-prob"></div>

Try it: drag the score bars, press Add 2 to all, and move the temperature.

<figure class="fig" data-fig="@ai-softmax-lab"><figcaption>Softmax turns any scores into probabilities that are positive and add to 100%. Adding the same number to every score changes nothing; a low temperature makes the leader win nearly everything and a high one flattens the odds.</figcaption></figure>

## 3. Odds and log-odds

Gamblers use **odds**: the chance something happens divided by the chance it doesn't.

```math
\text{odds} = \frac{p}{1 - p}
```

`$p = 0.5$` is odds 1 ("evens"). `$p = 0.8$` is odds 4 ("4 to 1 on"). `$p = 0.2$` is odds 0.25 ("4 to 1 against"). Take the natural log (ln) of the odds and you get the **log-odds**, also called the **logit**. It runs from minus infinity to plus infinity, just like the score `$z$`. That is no accident. Solving `$p = \sigma(z)$` for `$z$` gives

```math
z = \ln \frac{p}{1 - p}
```

<div class="meaning">

<dl>
<dt>z</dt><dd>The score: the weighted sum of the evidence. It is also the log-odds of a "yes".</dd>
<dt>σ(z)</dt><dd>The sigmoid: turns any score into a probability between 0 and 1.</dd>
<dt>p ÷ (1 − p)</dt><dd>The odds: how many times more likely "yes" is than "no".</dd>
<dt>e<sup>w</sup></dt><dd>The odds ratio: what one more unit of an input multiplies the odds by.</dd>
<dt>Physical meaning</dt><dd>Evidence adds up on the log-odds scale, like weights on a balance. The sigmoid is the pointer that shows how far the balance has tipped, and it can never go past fully "yes" or fully "no".</dd>
</dl>

</div>

So logistic regression is simply **a straight-line model for the log-odds**. That gives its weights a clear reading: "one more unit of `$x_j$` adds `$w_j$` to the log-odds", which is the same as "multiplies the odds by `$e^{w_j}$`", whatever the other inputs are. That number `$e^{w_j}$` is the **odds ratio**, the way doctors and economists report these models.

<div class="myth">

**"A weight of 0.7 means each extra hour adds 0.7, or 70 %, to the chance of passing."** No. The weight adds 0.7 to the **log-odds**, which multiplies the **odds** by about 2. How much the probability moves depends on where you start: from 50 % it jumps to about 67 %, but from 95 % it can only creep up to about 97 %.

</div>

<div class="problem" data-problem="sigmoid-odds-ratio"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the sigmoid maps any score to a probability, and its inverse, the logit, maps a probability back to a score. The model is a straight line on the logit scale.

**Equations:**

```math
\sigma(z) = \frac{1}{1 + e^{-z}}, \qquad \sigma^{-1}(p) = \ln\frac{p}{1-p}, \qquad \sigma'(z) = \sigma(z)\,\big(1 - \sigma(z)\big)
```

The last one is the sigmoid's slope (how fast it rises). It is largest, 0.25, at `$z = 0$` and tiny far out. That matters in Lesson 4.3 and again for neural networks (Lesson 9.2).

Also `$\sigma(-z) = 1 - \sigma(z)$`: the curve is symmetric about the 50 % point.

**Analogy:** a dimmer switch with soft ends. In the middle, a small turn changes the light a lot; near fully on or fully off, turning further barely matters.

**Try it:** `$w = 0.7$`, `$b = -4.2$`. Probability at `$x = 6$`? At `$x = 8$`? (`$z = 0$`, so 0.5. `$z = 1.4$`, so `$1/(1 + e^{-1.4}) \approx 1/(1 + 0.247) \approx 0.80$`.)
</details>

## 4. Worked example

*Made-up numbers.* A model of whether a student passes, from hours studied `$x$`: `$z = 0.7x - 4.2$`.

| hours | z | odds `$e^z$` | p |
|---|---|---|---|
| 2 | −2.8 | 0.061 | 0.06 |
| 4 | −1.4 | 0.247 | 0.20 |
| 6 | 0 | 1 | 0.50 |
| 8 | 1.4 | 4.06 | 0.80 |
| 10 | 2.8 | 16.4 | 0.94 |

Every 2 extra hours adds 1.4 to `$z$` and multiplies the odds by `$e^{1.4} \approx 4.06$`. But the probability gain is uneven: from 4 to 6 hours it goes up 30 points, from 8 to 10 only 14. Effects are steady on the odds scale, not on the probability scale.

## 5. Practice

1. Convert `$p = 0.25$` to odds and log-odds.
2. `$z = -1$`. What is `$p$`? (`$e \approx 2.718$`.)
3. A medical model has an odds ratio of 1.5 for smokers. What does that mean?

<details>
<summary>Answers</summary>

1. Odds 0.25 / 0.75 = 1/3; log-odds ln(1/3) ≈ −1.10.
2. `$1/(1 + e) \approx 1/3.718 \approx 0.27$`.
3. With everything else the same, smokers' odds of the outcome are 1.5 times non-smokers' odds (not 1.5 times the probability).
</details>

<div class="keypoints">

- Logistic regression computes a straight-line score z = w·x + b, then p = σ(z) = 1 / (1 + e<sup>−z</sup>).
- σ(0) = 0.5; big positive scores give p near 1, big negative scores p near 0.
- Odds are p ÷ (1 − p); the score z is the log of the odds.
- Each unit of an input multiplies the odds by e<sup>w</sup>, the odds ratio; the change in probability depends on the starting point.

</div>

**Try it on your own data:** the [[regression-workbench]] fits logistic regression with odds ratios and their confidence intervals.

**New words:** *logistic regression*, *sigmoid*, *odds*, *log-odds* or *logit*, *odds ratio*.
