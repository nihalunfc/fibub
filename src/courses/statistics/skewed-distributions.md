---
title: 'Waiting times and money: exponential and log-normal'
summary: 'Two distributions for data with a long right tail: the exponential for waiting times between events, and the log-normal for order values, incomes and prices. Why their mean sits above the median, and why logs help.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'Calls arrive on average every 4 minutes (Poisson arrivals). What is the median wait for the next call?'
    choices: ['4 minutes', 'About 2.8 minutes', '2 minutes']
    ans: 1
    why: 'Waits are exponential with mean 4. The median is mean × ln 2 ≈ 4 × 0.693 ≈ 2.8 minutes: most waits are shorter than the average.'
  - q: 'Order values are log-normal. What happens if you take the log of each value?'
    choices: ['The logs are normal, so normal-based tools work on them', 'The logs are uniform', 'Nothing useful']
    ans: 0
    why: 'That is the definition of log-normal: log(X) is normal. Analysing log values often makes skewed money data well behaved.'
  - q: 'A customer has been on hold 5 minutes. With exponential waits, how does the chance of waiting another minute compare with a new caller''s?'
    choices: ['Lower, they are nearly done', 'The same: the exponential has no memory', 'Higher']
    ans: 1
    why: 'The exponential is memoryless: the remaining wait does not depend on how long you have already waited. (Real queues are not always like this.)'
sources:
  - 'NIST/SEMATECH e-Handbook, 1.3.6.6.7 Exponential Distribution and 1.3.6.6.9 Lognormal Distribution https://www.itl.nist.gov/div898/handbook/eda/section3/eda366.htm'
  - 'Limpert, E., Stahel, W. A. and Abbt, M. (2001), Log-normal Distributions across the Sciences: Keys and Clues, BioScience 51(5), 341-352 https://doi.org/10.1641/0006-3568(2001)051[0341:LNDATS]2.0.CO;2'
---

**Module 3 · about 20 minutes · school maths and logarithms.** You'll be able to use the exponential for waiting times, recognise log-normal money data, and explain why the median and percentiles describe both better than the mean.

<div class="bigidea">Waiting times and money have a floor at zero and no ceiling, so a few huge values stretch the right tail and the mean ends up above the typical value.</div>

**In everyday terms:** queue times at a bank: most people wait a few minutes, nobody waits less than zero, and now and then someone waits forty minutes. The long right tail drags the mean above what most people experience.

## 1. Data with a floor and no ceiling

Waiting times, session lengths, order values, incomes, house prices and claim sizes can't go below zero but have no upper limit. They pile up near the low end with a long tail to the right. Two distributions describe most of them.

<!--fig:skewed-dists-->

## 2. The exponential: time between events

When events arrive as a Poisson process (Lesson 3.3) at rate `$\lambda$` per minute, the **time between them** is exponential:

```math
f(t) = \lambda e^{-\lambda t}, \qquad P(T > t) = e^{-\lambda t}
```

- Mean `$1/\lambda$`, SD also `$1/\lambda$`.
- Median `$\ln 2 / \lambda \approx 0.693 / \lambda$`: about 69 % of the mean. Most gaps are shorter than average, a few are very long.
- **Memoryless:** having waited 5 minutes doesn't make the next call any closer. Useful for arrivals; often wrong for things that wear out or for service times.

## 3. The log-normal: money and sizes

A variable is **log-normal** when its logarithm is normal. That happens when a quantity is the **product** of many independent factors (an order value = items × price × quantity discounts...), just as normals come from sums.

If `$\ln X \sim N(\mu, \sigma^2)$`:

```math
\text{median} = e^{\mu} \qquad \text{mean} = e^{\mu + \sigma^2/2}
```

The bigger `$\sigma$` (the spread of the logs), the further the mean runs above the median. In the simulation, push the spread up and watch the share of orders above the mean fall below 30 %.

## 4. What to do with skewed data

- **Report the median and high percentiles** (P90, P95) alongside the mean.
- **Plot on a log scale.** Order values from $5 to $5,000 are unreadable on a normal axis and clear on a log axis.
- **Analyse logs when testing or modelling** money: differences in log values are percentage differences, which is how managers think about money anyway ("10 % higher").
- **Keep the mean for totals.** Revenue is still mean × count, so for budgets you still need the mean, outliers and all.

<div class="meaning">

<dl>
<dt>Exponential, rate λ</dt><dd>Time between independent events. Mean 1/λ; median 0.693/λ; P(wait > t) = e^(−λt).</dd>
<dt>Log-normal</dt><dd>A variable whose logarithm is normal: order values, incomes, prices, file sizes.</dd>
<dt>Median e^μ, mean e^(μ + σ²/2)</dt><dd>For a log-normal the mean always sits above the median, more so the bigger σ.</dd>
<dt>Physical meaning</dt><dd>Log-normal data come from multiplying many small effects (a bit more income, a bit more spending, a bit bigger basket), while normal data come from adding them. Taking logs turns multiplying into adding and the skew into a bell.</dd>
</dl>

</div>

<div class="myth">

**"Remove the big values and the data will be normal."** In skewed data the big values are part of the shape, not mistakes. Use medians and percentiles, or work on the log scale, instead of cutting the tail off.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The model.</b> Order values are log-normal with median $50 and log-spread σ = 0.8 (so μ = ln 50 ≈ 3.912).</div>
<div class="step"><b>Mean.</b> 50 × e^(0.8²/2) = 50 × e^0.32 ≈ $68.86, well above the $50 median.</div>
<div class="step"><b>Share above $100.</b> On the log scale: z = (ln 100 − 3.912) ÷ 0.8 ≈ 0.866; area above ≈ 19 %.</div>
<div class="step"><b>95th percentile.</b> e^(3.912 + 1.645 × 0.8) ≈ $186.</div>
<div class="step"><b>Report.</b> "Typical order $50; average $69 because one order in twenty is over $186."</div>
</div>

<div class="problem" data-problem="exponential-wait"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** sums of many independent pieces become normal; products of many independent pieces become log-normal, because the log turns a product into a sum.

**Equations:** exponential `$P(T > t) = e^{-\lambda t}$`, mean `$1/\lambda$`, median `$\ln 2/\lambda$`. Log-normal: median `$e^{\mu}$`, mean `$e^{\mu+\sigma^2/2}$`, `$P(X \le x) = \Phi\!\left(\frac{\ln x - \mu}{\sigma}\right)$`.

**In code:** Excel `EXPON.DIST(t, λ, TRUE)`, `LOGNORM.DIST(x, μ, σ, TRUE)`; Python `scipy.stats.expon(scale=1/lam)`, `scipy.stats.lognorm(s=sigma, scale=exp(mu))`.
</details>

## 5. Worked example

*Made-up numbers.* Order values are log-normal with median $50 and log-spread σ = 0.8 (so μ = ln 50 ≈ 3.912).

- **Mean:** 50 × e^(0.8²/2) = 50 × e^0.32 ≈ 50 × 1.377 ≈ **$68.86**.
- **Share above $100:** ln 100 = 4.605; z = (4.605 − 3.912) ÷ 0.8 ≈ 0.866; P(Z > 0.866) ≈ **19 %**.
- **95th percentile:** e^(3.912 + 1.645 × 0.8) = e^5.228 ≈ **$186**.

"Average order $69" hides that the typical order is $50 and one in twenty is over $186. A free-shipping threshold at $75 would be above the median: fine if the goal is to push typical customers to add an item.

## 6. Practice

1. Website visits arrive at 2 per minute. What's the chance of a gap longer than 1 minute?
2. Exponential waits with mean 10 minutes: what are the median and the 90th percentile?
3. Incomes in a region: median $55k, mean $72k. Which distribution would you try first?

<details>
<summary>Answers</summary>

1. `$e^{-2}$` ≈ 13.5 %.
2. Median 10 × 0.693 ≈ 6.9 min; P90: `$-\ln(0.1) \times 10$` ≈ 23 min.
3. Log-normal (positive, right-skewed, mean well above median).
</details>

**Try it on your own data:** the [[distribution-explorer]] draws exponential and log-normal curves and gives their percentiles; the [[histogram-builder]] shows whether your data has a long right tail.

**New words:** *exponential distribution*, *memoryless*, *log-normal distribution*, *log scale*, *right tail*.

<div class="keypoints">

- Exponential: waiting times between independent events; P(wait > t) = e^(−λt), mean 1/λ.
- Log-normal: logs are normal; typical for money and sizes.
- In right-skewed data the mean sits above the median; report median and percentiles.
- Logs turn multiplicative, skewed data into roughly symmetric data.

</div>
