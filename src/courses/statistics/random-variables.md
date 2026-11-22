---
title: Random variables and distributions
summary: 'A random variable is a number decided by chance; its distribution lists what values it can take and how likely each is. Discrete and continuous, probability mass and density, and the mean and variance of a distribution.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'Which of these is a continuous random variable?'
    choices: ['The number of items in a basket', 'The time a customer spends on the site', 'Whether a visitor buys (yes or no)']
    ans: 1
    why: 'Time can take any value in a range (12.37 seconds), so it is continuous. Item counts and yes/no outcomes are discrete.'
  - q: 'For a continuous distribution, what gives the probability of a value between 10 and 20?'
    choices: ['The height of the curve at 15', 'The area under the density curve from 10 to 20', 'The density at 20 minus the density at 10']
    ans: 1
    why: 'A density curve''s height is not a probability; the area under it over an interval is. The whole area is 1.'
  - q: 'A die is rolled. What is E[X], the expected value of the face?'
    choices: ['3', '3.5', '6']
    ans: 1
    why: '(1 + 2 + 3 + 4 + 5 + 6) ÷ 6 = 3.5. The expected value need not be a value the variable can actually take.'
---

**Module 3 · about 20 minutes · school maths.** You'll be able to say what a random variable and its distribution are, tell discrete from continuous, and compute the mean and variance of a simple distribution.

## 1. Numbers decided by chance

A **random variable** is a number whose value depends on chance: the number of orders in the next hour, tomorrow's sales, whether the next visitor buys (1) or not (0), how long the next call lasts. Before it happens, you can't know the value, but you can describe **which values are possible and how likely each one is**. That description is the variable's **distribution**.

Distributions are the backbone of the rest of the course. A test (Module 6) asks "how likely is this result if nothing changed?", which needs the distribution of the result when nothing changed.

## 2. Discrete and continuous

- **Discrete** variables take separate values, usually counts: items in a basket, complaints per day, a yes/no outcome. Their distribution is a **probability mass function (PMF)**: a probability for each value, and they add up to 1.
- **Continuous** variables can take any value in a range: time, weight, revenue (near enough). Any single exact value has probability 0, so we use a **probability density function (PDF)**, a curve whose **area** over an interval is the probability of landing in it. The total area is 1.

The **cumulative distribution function (CDF)**, `$F(x) = P(X \le x)$`, works for both: the chance of being at or below `$x$`. Percentiles (Lesson 1.5) are read off the CDF.

<!--fig:dice-sum-->

The dots are the exact PMF of the dice total, found by counting combinations. The bars are what you get by rolling. With more rolls, the bars match the dots: a distribution is what the data would look like in the long run.

## 3. The mean and variance of a distribution

A distribution has its own mean (expected value, Lesson 2.3) and variance:

```math
\mu = E[X] = \sum_x x\,P(X = x) \qquad \sigma^2 = \text{Var}(X) = \sum_x (x - \mu)^2\,P(X = x)
```

For continuous variables the sums become integrals, but the meaning is the same: the long-run average and the long-run spread.

Two rules analysts use all the time, for independent variables `$X$` and `$Y$` and constants `$a$`, `$b$`:

```math
E[aX + b] = a\,E[X] + b \qquad \text{Var}(aX + b) = a^2\,\text{Var}(X)
```
```math
E[X + Y] = E[X] + E[Y] \qquad \text{Var}(X + Y) = \text{Var}(X) + \text{Var}(Y)
```

Variances add for independent variables, standard deviations do not. That is why the spread of a sum or average grows more slowly than you might expect, the key to Module 4.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a distribution is the long-run pattern of a chance quantity; data is a sample from it.

**Equations:** PMF `$P(X = x)$`, PDF `$f(x)$` with `$P(a \le X \le b) = \int_a^b f(x)\,dx$`, CDF `$F(x) = P(X \le x)$`. Mean `$\sum x P(x)$`; variance `$\sum (x - \mu)^2 P(x)$`.

**Try it:** one die has mean 3.5 and variance 35/12 ≈ 2.92. What are the mean and variance of the total of 2 dice? (7 and 5.83: both double, because they add for independent dice.) The SD goes from 1.71 to 2.42, up only by √2.
</details>

## 4. Worked example

*Made-up numbers.* Basket sizes at a corner shop:

| Items x | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| P(X = x) | 0.4 | 0.3 | 0.2 | 0.1 |

- Check: 0.4 + 0.3 + 0.2 + 0.1 = 1. ✓
- Mean: 1(0.4) + 2(0.3) + 3(0.2) + 4(0.1) = 0.4 + 0.6 + 0.6 + 0.4 = **2 items**.
- Variance: (1−2)²(0.4) + 0²(0.3) + 1²(0.2) + 2²(0.1) = 0.4 + 0 + 0.2 + 0.4 = **1.0**; SD = **1 item**.
- CDF at 2: P(X ≤ 2) = 0.7, so 70 % of baskets have 2 items or fewer.
- If items cost $3 each plus a $1 bag fee: E[3X + 1] = 3(2) + 1 = $7, SD = 3 × 1 = $3.

## 5. Practice

1. Is "number of website errors today" discrete or continuous? "Server response time"?
2. P(X = 0) = 0.5, P(X = 10) = 0.5. Find the mean and SD.
3. Daily sales have mean $2,000 and SD $300, independent across days. What are the mean and SD of a 4-day total?

<details>
<summary>Answers</summary>

1. Discrete (a count); continuous (a time).
2. Mean 5; variance 0.5(25) + 0.5(25) = 25; SD 5.
3. Mean $8,000. Variance 4 × 300² = 360,000, SD $600 (not $1,200).
</details>

**Try it on your own data:** the [[distribution-explorer]] draws the PMF, PDF and CDF of the common distributions and reads probabilities off them.

**New words:** *random variable*, *distribution*, *discrete*, *continuous*, *probability mass function*, *probability density function*, *cumulative distribution function*.
