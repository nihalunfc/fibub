---
title: 'The sigmoid and odds: from a line to a probability'
seoTitle: 'Logistic regression: the sigmoid function and odds'
summary: 'Logistic regression keeps the straight-line score of a linear model and squeezes it through the S-shaped sigmoid into a probability between 0 and 1. Shape the curve with two sliders and learn to read weights as changes in odds.'
minutes: 25
updated: 2026-11-21
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
---

**Module 4 · about 25 minutes · read first: 1.5, 3.1, 4.1.** You'll be able to compute the sigmoid, convert between probability, odds and log-odds, and interpret a logistic regression weight.

## 1. Why this matters

Logistic regression is the workhorse of yes/no prediction in medicine, finance and marketing, and the simplest neural network: one neuron with a sigmoid. Its output is a real probability, its weights can be explained, and the sigmoid it uses reappears in Lessons 9.2 and 10.4.

## 2. The model

Start with the linear score from Module 3:

```math
z = \mathbf{w} \cdot \mathbf{x} + b
```

`$z$` can be any number from very negative to very positive. Squeeze it into the range 0 to 1 with the **sigmoid** (also called the logistic function):

```math
p = \sigma(z) = \frac{1}{1 + e^{-z}}
```

- Large positive `$z$`: `$e^{-z}$` is tiny, so `$p$` is close to 1.
- `$z = 0$`: `$p = 0.5$`.
- Large negative `$z$`: `$e^{-z}$` is huge, so `$p$` is close to 0.

<!--fig:sigmoid-fit-->

The weight `$w$` sets how steep the S is: a big `$w$` means a small change in x swings the probability fast. The bias slides it sideways. The 50 % point, where `$z = 0$`, sits at `$x = -b/w$`.

## 3. Odds and log-odds

Gamblers' **odds** are the chance something happens divided by the chance it doesn't:

```math
\text{odds} = \frac{p}{1 - p}
```

`$p = 0.5$` is odds 1 ("evens"); `$p = 0.8$` is odds 4 ("4 to 1 on"); `$p = 0.2$` is odds 0.25. Take the natural log and you get the **log-odds** or **logit**, which runs from −∞ to +∞. Here is the key fact: solving `$p = \sigma(z)$` for `$z$` gives

```math
z = \ln \frac{p}{1 - p}
```

So logistic regression is simply **a linear model for the log-odds**. That is why its weights read as: "one unit more of `$x_j$` adds `$w_j$` to the log-odds", which means "multiplies the odds by `$e^{w_j}$`", whatever the other inputs are. That number `$e^{w_j}$` is the **odds ratio**, the way doctors and economists report these models.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the sigmoid maps any score to a probability, and its inverse, the logit, maps a probability back to a score. The model is linear on the logit scale.

**Equations:**

```math
\sigma(z) = \frac{1}{1 + e^{-z}}, \qquad \sigma^{-1}(p) = \ln\frac{p}{1-p}, \qquad \sigma'(z) = \sigma(z)\,\big(1 - \sigma(z)\big)
```

The last one, the sigmoid's slope, is neat: it is largest (0.25) at `$z = 0$` and tiny far out, which matters in Lesson 4.3 and again for neural networks (Lesson 9.2).

Also `$\sigma(-z) = 1 - \sigma(z)$`: the curve is symmetric about the 50 % point.

**Analogy:** a dimmer switch with soft ends. In the middle a small turn changes the light a lot; near fully on or fully off, turning further barely matters.

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

Every 2 extra hours adds 1.4 to `$z$` and multiplies the odds by `$e^{1.4} \approx 4.06$`. But the probability gain is uneven: from 4 to 6 hours it goes up 30 points, from 8 to 10 only 14. Effects are constant on the odds scale, not the probability scale.

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

**Try it on your own data:** the [[regression-workbench]] fits logistic regression with odds ratios and their confidence intervals.

**New words:** *logistic regression*, *sigmoid*, *odds*, *log-odds* or *logit*, *odds ratio*.
