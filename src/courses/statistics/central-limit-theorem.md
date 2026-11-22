---
title: The central limit theorem
summary: 'Averages of many independent values form a bell curve centred on the true mean, with spread σ/√n, whatever the raw data looks like. The theorem that makes confidence intervals and tests on averages work, and its limits.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'Order values are heavily right-skewed. You take many random samples of 100 orders and plot their means. What shape do the means make?'
    choices: ['Right-skewed like the orders', 'Close to a normal bell curve', 'Flat']
    ans: 1
    why: 'The central limit theorem: means of large enough samples are approximately normal whatever the shape of the individual values.'
  - q: 'Orders have mean $50 and SD $40. What is the SD of the mean of 64 random orders?'
    choices: ['$40', '$5', '$0.63']
    ans: 1
    why: 'σ/√n = 40/√64 = 40/8 = $5.'
  - q: 'When can the central limit theorem let you down?'
    choices: ['With large samples of independent values', 'With small samples from very skewed data, or values that are not independent', 'Whenever the data is not normal']
    ans: 1
    why: 'The theorem needs enough independent values. Very skewed data needs bigger n, and dependence (repeat customers, clustered stores) breaks the σ/√n rule.'
sources:
  - 'OpenIntro Statistics, 4th edition (Diez, Cetinkaya-Rundel, Barr), Section 5.1 Point estimates and sampling variability https://www.openintro.org/book/os/'
  - 'Blitzstein, J. and Hwang, J. (2019), Introduction to Probability, 2nd edition, Section 10.3 Central limit theorem https://projects.iq.harvard.edu/stat110'
---

**Module 4 · about 25 minutes · school maths.** You'll be able to state the central limit theorem, predict the spread of a sample mean, and know when the theorem can be trusted.

<div class="bigidea">Average enough independent values and the average follows a bell curve around the true mean, with spread σ/√n, whatever shape the raw data had.</div>

**In everyday terms:** one dice roll is equally likely to be anything from 1 to 6, flat as a table. Average 30 rolls and you almost always get something near 3.5; the averages pile up in a bell. Highs and lows cancel out.

## 1. Why averages behave

Individual order values are lopsided: lots of small orders, a few huge ones. Yet the *average* of 100 random orders behaves beautifully: it lands near the true mean, its possible values form a bell curve, and its spread is predictable. That is the **central limit theorem (CLT)**, probably the most useful result in statistics.

<!--fig:clt-sim-->

Try each population with n = 1, then 5, then 30. The left plot never changes, but the sample means on the right turn into a bell and narrow as n grows. Even "bought or not" (just 0s and 1s) gives a bell for its averages, which are conversion rates.

## 2. The theorem

Take random samples of size `$n$` from any population with mean `$\mu$` and standard deviation `$\sigma$`. For large enough `$n$`, the sample mean `$\bar{x}$` is approximately normal:

```math
\bar{x} \;\approx\; N\!\left(\mu,\; \frac{\sigma^2}{n}\right)
```

Three parts:

1. **Centre:** sample means are centred on the true mean. No systematic error (for a random sample).
2. **Spread:** their SD is `$\sigma/\sqrt{n}$`, the **standard error** (next lesson).
3. **Shape:** approximately normal, whatever the population's shape.

The same holds for **totals** (sum = n × mean): daily revenue as the total of many orders is close to normal even though orders are not.

Press Draw 1 a few times to see what resampling does, then Draw 500.

<figure class="fig" data-fig="@data-bootstrap-resample"><figcaption>Notice that some original values are picked twice and others not at all, and that the middle 95% of the resampled means forms the interval.</figcaption></figure>


## 3. How large is "large enough"?

- Roughly symmetric data: n of 10–20 is plenty.
- Moderately skewed (most business measures): about 30–50.
- Very skewed or with huge outliers (revenue per visitor, where most are $0 and a few spend thousands): hundreds or thousands. Use the bootstrap (Lesson 4.5) to check.
- Proportions: the rule from Lesson 3.2, `$np$` and `$n(1-p)$` both at least 10.

## 4. When it fails

- **Not independent:** 100 orders from 10 customers aren't 100 independent values. Spread will be bigger than `$\sigma/\sqrt{n}$`. Analyse at the customer level, or use methods for clustered data.
- **Infinite or huge variance:** some heavy-tailed data (viral content, insurance catastrophes) never settles.
- **Medians and percentiles** follow their own rules. The bootstrap handles them.

<div class="meaning">

<dl>
<dt>Population mean μ, SD σ</dt><dd>The centre and spread of single values.</dd>
<dt>Sample mean x̄ of n values</dt><dd>One number from one sample.</dd>
<dt>x̄ ≈ Normal(μ, σ/√n)</dt><dd>If you took many samples, their averages would form this bell.</dd>
<dt>Physical meaning</dt><dd>In an average, the lucky highs and unlucky lows cancel each other more and more as n grows. Quadruple the sample and the wobble of the average halves. This is why a daily average is steadier than any single sale.</dd>
</dl>

</div>

<div class="myth">

**"The CLT makes the data normal."** It does not change your raw data at all: order values stay skewed. It says the average of many of them is close to normal, which is what intervals and tests use.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>Single sales.</b> Café transactions: mean $8.40, SD $6.00, very skewed.</div>
<div class="step"><b>Average 400 of them.</b> The daily average has SD 6 ÷ √400 = $0.30: twenty times steadier.</div>
<div class="step"><b>Bell.</b> About 95 % of days have an average between $7.80 and $9.00.</div>
<div class="step"><b>To revenue.</b> × 400: mean $3,360, SD $120; 95 % of days between about $3,120 and $3,600.</div>
<div class="step"><b>Use it.</b> A $3,050 day is more than 2.5 SDs low: ask why. A $3,250 day is noise.</div>
</div>

<div class="problem" data-problem="clt-daily"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** in a sum of many independent pieces, the random highs and lows of the pieces mostly cancel, and what's left has the bell shape no matter what the pieces looked like.

**Why σ/√n:** for independent values, variances add (Lesson 3.1). The sum of `$n$` values has variance `$n\sigma^2$`; dividing by `$n$` to get the mean divides the variance by `$n^2$`:

```math
\text{Var}(\bar{x}) = \frac{n\sigma^2}{n^2} = \frac{\sigma^2}{n}, \qquad \text{SD}(\bar{x}) = \frac{\sigma}{\sqrt{n}}
```

**Analogy:** one die is flat (each face equally likely); the average of 10 dice is almost always between 2.5 and 4.5, bunched around 3.5. Lesson 3.1's dice simulation showed the start of this.
</details>

## 5. Worked example

*Made-up numbers.* A café's single transactions have mean $8.40 and SD $6.00 (skewed: most are a coffee, some are big group orders). A typical day has 400 transactions.

- Daily average transaction: approximately normal with mean $8.40 and SD 6 ÷ √400 = **$0.30**.
- About 95 % of days have an average between 8.40 ± 2 × 0.30 = **$7.80 and $9.00**.
- Daily revenue (400 × average): mean $3,360, SD 400 × 0.30 = **$120**; 95 % of days between about $3,120 and $3,600.

So a $3,050 day is more than 2.5 SDs low: worth asking why. A $3,250 day is ordinary noise.

## 6. Practice

1. Delivery times have mean 35 and SD 12 minutes. What are the mean and SD of the average of 36 deliveries?
2. Why does a mean of 25 values from a very skewed distribution still look skewed?
3. A conversion rate is measured on 10,000 visitors with p ≈ 0.03. Can you use the normal approximation?

<details>
<summary>Answers</summary>

1. Mean 35; SD 12 ÷ 6 = 2 minutes.
2. 25 isn't large enough to wash out strong skew; the CLT is approximate, and how fast it works depends on the shape.
3. Yes: np = 300 and n(1 − p) = 9,700, both well above 10.
</details>

**Try it on your own data:** the [[bootstrap-permutation]] tool shows the sampling distribution of the mean (or median) of your own data, so you can see whether it is close to normal.

**New words:** *central limit theorem*, *sampling distribution of the mean*, *standard error*, *independence*.

<div class="keypoints">

- Averages of n independent values have SD σ/√n.
- Their distribution is close to normal for large n, whatever the shape of single values.
- Very skewed data needs a larger n before the bell appears.
- The CLT fails for dependent data and for extremely heavy tails.

</div>
