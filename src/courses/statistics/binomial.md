---
title: 'The binomial: how many of n say yes'
summary: 'The binomial distribution counts yeses in n independent tries with the same chance p: conversions, clicks, defects, survey answers. Its formula, mean and spread, and how to tell when a count is surprising.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'Which situation is binomial?'
    choices: ['Number of orders in the next hour', 'Number of 200 email recipients who click, each clicking with chance 3 %', 'Time until the next click']
    ans: 1
    why: 'A fixed number of independent tries (200), each with the same chance (3 %), counting successes. Orders per hour has no fixed n (Poisson); time is continuous.'
  - q: 'n = 400 visitors, p = 0.05. What are the mean and SD of the number who buy?'
    choices: ['Mean 20, SD about 4.4', 'Mean 20, SD 19', 'Mean 5, SD 2.2']
    ans: 0
    why: 'Mean np = 20. SD = √(np(1 − p)) = √(400 × 0.05 × 0.95) = √19 ≈ 4.36.'
  - q: 'A campaign usually converts 5 % of 400 visitors (mean 20, SD about 4.4). Today 32 bought. Is that unusual?'
    choices: ['No, 32 is close to 20', 'Yes: about 2.75 SDs above the mean, rare by chance alone', 'Cannot tell without a p-value table']
    ans: 1
    why: '(32 − 20) ÷ 4.36 ≈ 2.75. Counts that far above average happen well under 1 % of the time if the true rate is still 5 %.'
sources:
  - 'OpenIntro Statistics, 4th edition (Diez, Cetinkaya-Rundel, Barr), Section 4.3 Binomial distribution https://www.openintro.org/book/os/'
  - 'NIST/SEMATECH e-Handbook, 1.3.6.6.18 Binomial Distribution https://www.itl.nist.gov/div898/handbook/eda/section3/eda366i.htm'
---

**Module 3 · about 25 minutes · school maths.** You'll be able to recognise a binomial situation, compute binomial probabilities, its mean and SD, and judge whether a count of yeses is surprising.

<div class="bigidea">When n independent people each say yes with the same chance p, the number of yeses follows the binomial distribution, centred on n·p.</div>

**In everyday terms:** flip a slightly biased coin 10 times and count heads. Conversions, clicks and defects work the same way: each visitor is one flip with chance p of "yes".

## 1. Counting yeses

Conversions, clicks, opens, defects, survey "yes" answers: much of an analyst's data is a count of successes out of a number of tries. When

1. there are a **fixed number** `$n$` of tries,
2. each try is a **yes or no**,
3. each has the **same chance** `$p$` of yes,
4. tries are **independent**,

the number of yeses `$X$` follows a **binomial distribution**, written `$X \sim \text{Bin}(n, p)$`.

## 2. The formula

The chance of exactly `$k$` yeses:

```math
P(X = k) = \binom{n}{k}\, p^k\, (1-p)^{n-k}
```

Read it as: `$p^k(1-p)^{n-k}$` is the chance of one particular pattern with `$k$` yeses and `$n-k$` noes; `$\binom{n}{k}$` (Lesson 2.4) counts how many such patterns there are.

Its mean and standard deviation are simple:

```math
\mu = np \qquad \sigma = \sqrt{np(1-p)}
```

<!--fig:binomial-bars-->

Slide `$n$` up and the bars turn into a bell curve, a preview of Lesson 3.4. A common rule: when both `$np$` and `$n(1-p)$` are at least 10, the normal curve approximates the binomial well. That's why tests on conversion rates (Lesson 7.5) can use normal maths.

## 3. Proportions

Analysts usually work with the **share** of yeses, `$\hat p = X/n$`, rather than the count. Dividing by `$n$`:

```math
E[\hat p] = p \qquad \text{SD}(\hat p) = \sqrt{\frac{p(1-p)}{n}}
```

That second formula is the standard error of a proportion. It returns in confidence intervals (Lesson 5.2) and A/B tests (Module 7). Notice the `$\sqrt{n}$`: four times the visitors halves the wobble.

## 4. When the binomial breaks

- **Not independent:** one customer making many visits, or friends influencing each other. Count customers, not visits, or expect more spread than the formula says.
- **Not the same p:** mixing mobile (2 %) and desktop (6 %) traffic gives more variation than a single binomial. Split by segment.
- **No fixed n:** orders per hour have no "number of tries". Use the Poisson (Lesson 3.3).

<div class="meaning">

<dl>
<dt>n</dt><dd>Number of independent tries (visitors, tickets, units).</dd>
<dt>p</dt><dd>Chance of a yes on each try.</dd>
<dt>P(X = k) = nCk · p^k · (1 − p)^(n − k)</dt><dd>Ways to choose which k say yes × chance of that exact pattern.</dd>
<dt>Mean n·p, SD √(n·p·(1 − p))</dt><dd>Where the count centres and how much it usually wobbles.</dd>
<dt>Physical meaning</dt><dd>The binomial is the shape of "how many said yes" when everyone decides independently. Its SD grows like √n, so the share p̂ = X/n wobbles less as n grows: that is why big samples give steady percentages.</dd>
</dl>

</div>

<div class="myth">

**"10 % conversion means exactly 10 of 100 visitors will buy."** Ten is only the centre. With n = 100 and p = 0.1, the SD is 3, so anything from about 4 to 16 buyers is an ordinary day.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The setup.</b> 80 % of tickets are resolved first time. Next 10 tickets: chance at least 9 are?</div>
<div class="step"><b>All 10.</b> 0.8¹⁰ ≈ 0.107.</div>
<div class="step"><b>Exactly 9.</b> Which one fails? 10 ways. Each way: 0.8⁹ × 0.2. Total 10 × 0.134 × 0.2 ≈ 0.268.</div>
<div class="step"><b>Add.</b> P(at least 9) ≈ 0.107 + 0.268 = 0.376, about 38 %.</div>
<div class="step"><b>Centre and wobble.</b> Mean 10 × 0.8 = 8; SD √1.6 ≈ 1.26. A day with 6 of 10 is 1.6 SDs low: unlucky, not alarming.</div>
</div>

<div class="problem" data-problem="binomial-exact"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the binomial is the sum of `$n$` independent yes/no (Bernoulli) variables. Each has mean `$p$` and variance `$p(1-p)$`; adding `$n$` of them gives mean `$np$` and variance `$np(1-p)$` (the rules from Lesson 3.1).

**Equations:** `$P(X=k)=\binom{n}{k}p^k(1-p)^{n-k}$`, `$\mu = np$`, `$\sigma^2 = np(1-p)$`.

**In code:** Excel `BINOM.DIST(k, n, p, FALSE)` for exactly `$k$`, `TRUE` for `$k$` or fewer; Python `scipy.stats.binom.pmf(k, n, p)` and `.cdf`.

**Try it:** with `$n = 10$`, `$p = 0.5$`, P(exactly 5 heads) = `$\binom{10}{5}/2^{10}$` = 252/1,024 ≈ 24.6 %. Even the most likely result happens less than a quarter of the time.
</details>

## 5. Worked example

*Made-up numbers.* A support team resolves 80 % of tickets on first contact. Of the next 10 tickets, what's the chance at least 9 are resolved first time?

- P(X = 10) = 0.8¹⁰ ≈ 0.1074.
- P(X = 9) = `$\binom{10}{9}$` × 0.8⁹ × 0.2 = 10 × 0.1342 × 0.2 ≈ 0.2684.
- P(X ≥ 9) ≈ 0.1074 + 0.2684 = **0.376**, about 38 %.

Mean = 10 × 0.8 = 8 tickets; SD = √(10 × 0.8 × 0.2) = √1.6 ≈ 1.26. So a day with only 6 of 10 resolved (1.6 SDs below the mean) is unlucky but not alarming on its own.

## 6. Practice

1. A 2 % defect rate, batch of 50. What are the mean and SD of the number of defects?
2. Using the formula, find P(exactly 0 defects) in that batch.
3. 1,000 visitors, true conversion 4 %. Between which two counts will about 95 % of days fall (mean ± 2 SD)?

<details>
<summary>Answers</summary>

1. Mean 1; SD √(50 × 0.02 × 0.98) = √0.98 ≈ 0.99.
2. 0.98⁵⁰ ≈ 0.364.
3. Mean 40; SD √(1,000 × 0.04 × 0.96) = √38.4 ≈ 6.2. From about 28 to 52 conversions.
</details>

**Try it on your own data:** the [[binomial-distribution-lab]] draws any binomial and shades the probability you ask for; the [[distribution-explorer]] handles it alongside the other distributions.

**New words:** *Bernoulli trial*, *binomial distribution*, *success probability*, *sample proportion*, *standard error of a proportion*.

<div class="keypoints">

- Binomial: n independent tries, same p, count the yeses.
- P(X = k) = nCk · p^k · (1 − p)^(n − k).
- Mean n·p; SD √(n·p(1 − p)); the share X/n has SD √(p(1 − p)/n).
- It breaks when tries are not independent (one customer, many visits) or p changes.

</div>
