---
title: 'Standard error: how much a sample result wobbles'
summary: 'The standard error measures how far a statistic typically lands from the truth: σ/√n for a mean, √(p(1−p)/n) for a proportion, and the formula for a difference between two groups. SD versus SE, and the square-root law.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'What is the difference between the standard deviation and the standard error?'
    choices: ['They are the same thing', 'The SD measures spread between individual values; the SE measures how much a statistic (like the mean) varies between samples', 'The SE is always bigger']
    ans: 1
    why: 'The SD describes the data. The SE describes the uncertainty of an estimate and shrinks as the sample grows; the SD does not.'
  - q: 'A survey of 400 gives p̂ = 0.5. What is the standard error?'
    choices: ['0.025', '0.05', '0.0125']
    ans: 0
    why: '√(0.5 × 0.5 ÷ 400) = √0.000625 = 0.025, or 2.5 percentage points.'
  - q: 'To cut a standard error by a factor of 3, how much more data do you need?'
    choices: ['3 times', '6 times', '9 times']
    ans: 2
    why: 'SE ∝ 1/√n, so to divide it by 3 you multiply n by 3² = 9.'
sources:
  - 'OpenIntro Statistics, 4th edition (Diez, Cetinkaya-Rundel, Barr), Sections 5.1 and 6.2 (difference of two proportions) https://www.openintro.org/book/os/'
  - 'NIST/SEMATECH e-Handbook, 7.2 Comparisons based on data from one process https://www.itl.nist.gov/div898/handbook/prc/section2/prc2.htm'
---

**Module 4 · about 20 minutes · school maths.** You'll be able to compute standard errors for a mean, a proportion and a difference, tell SE from SD, and plan with the square-root law.

<div class="bigidea">The standard error is the typical distance between a sample result and the truth: the size of the wobble you would see if you repeated the study.</div>

**In everyday terms:** measure your own height ten times with a tape and you get slightly different numbers. The SD is how much single measurements scatter; the SE is how much the average of your ten measurements would scatter if you did the whole thing again.

## 1. The size of the wobble

The standard error (SE) is the standard deviation of a statistic's sampling distribution: how far, typically, the estimate lands from the truth. It is the number behind every margin of error, confidence interval and test in the rest of the course.

<!--fig:se-shrink-->

## 2. SD versus SE

| | Standard deviation | Standard error |
|---|---|---|
| Describes | Individual values | An estimate (a mean, a rate) |
| Question | How different are customers from each other? | How sure are we about the average? |
| With more data | Settles near σ | Shrinks towards 0 |

A common reporting error is to put "± SE" on a chart where readers expect "± SD", or the other way round. Say which one you're showing.

## 3. The formulas

**Mean:**

```math
\text{SE}(\bar{x}) = \frac{s}{\sqrt{n}}
```

using the sample SD `$s$` in place of the unknown `$\sigma$`.

**Proportion:**

```math
\text{SE}(\hat p) = \sqrt{\frac{\hat p(1-\hat p)}{n}}
```

**Difference between two independent groups** (A/B tests!): variances add, so

```math
\text{SE}(\bar{x}_B - \bar{x}_A) = \sqrt{\frac{s_A^2}{n_A} + \frac{s_B^2}{n_B}} \qquad \text{SE}(\hat p_B - \hat p_A) = \sqrt{\frac{\hat p_A(1-\hat p_A)}{n_A} + \frac{\hat p_B(1-\hat p_B)}{n_B}}
```

A difference is noisier than either group alone, about √2 times as noisy for equal groups. This is why A/B tests need more traffic than people expect.

## 4. The square-root law

Because of the `$\sqrt{n}$`, precision gets expensive: 4× the data halves the SE; 100× the data cuts it to a tenth. When planning, ask what precision you need *before* asking for more data. Going from a ±2-point to a ±1-point margin costs four times the sample.

<div class="meaning">

<dl>
<dt>SD</dt><dd>Spread of individual values (customers, orders).</dd>
<dt>SE of a mean = s/√n</dt><dd>Spread of the sample mean across repeated samples.</dd>
<dt>SE of a share = √(p(1 − p)/n)</dt><dd>Spread of a percentage such as a conversion rate.</dd>
<dt>SE of a difference = √(SE₁² + SE₂²)</dt><dd>Wobbles add in squares when you compare two groups.</dd>
<dt>Physical meaning</dt><dd>The SE is the "give or take" on every result you report. To halve it you need four times as much data, which is why precision gets expensive.</dd>
</dl>

</div>

<div class="myth">

**"The SE of a difference is SE₁ + SE₂."** Two independent wobbles partly cancel, so they add in squares: √(0.28² + 0.30²) ≈ 0.41 points, not 0.58.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The test.</b> A: 200 of 5,000 bought (4.0 %). B: 240 of 5,000 (4.8 %).</div>
<div class="step"><b>SE of A.</b> √(0.04 × 0.96 ÷ 5,000) ≈ 0.28 points.</div>
<div class="step"><b>SE of B.</b> √(0.048 × 0.952 ÷ 5,000) ≈ 0.30 points.</div>
<div class="step"><b>SE of the difference.</b> √(0.28² + 0.30²) ≈ 0.41 points.</div>
<div class="step"><b>Compare.</b> The difference is 0.8 points, about 2 SEs: borderline, worth the formal test of Module 6.</div>
</div>

<div class="problem" data-problem="se-difference"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the SE of an average equals the spread of one value divided by the square root of how many values were averaged.

**Equations:** `$\text{SE}(\bar{x}) = s/\sqrt{n}$`; `$\text{SE}(\hat p) = \sqrt{\hat p(1-\hat p)/n}$`; for independent groups `$\text{SE}(\text{diff}) = \sqrt{\text{SE}_A^2 + \text{SE}_B^2}$`.

**In code:** Excel `=STDEV.S(range)/SQRT(COUNT(range))`; pandas `df["x"].sem()`; SQL `STDDEV_SAMP(x) / SQRT(COUNT(x))`.
</details>

## 5. Worked example

*Made-up numbers.* A test of a new product page:

| | Visitors | Buyers | Rate |
|---|---|---|---|
| A (old) | 5,000 | 200 | 4.0 % |
| B (new) | 5,000 | 240 | 4.8 % |

- SE(A) = √(0.04 × 0.96 ÷ 5,000) ≈ 0.00277 (0.28 points).
- SE(B) = √(0.048 × 0.952 ÷ 5,000) ≈ 0.00302 (0.30 points).
- SE(difference) = √(0.00277² + 0.00302²) ≈ **0.0041** (0.41 points).
- Observed difference 0.8 points is about 0.8 ÷ 0.41 ≈ **1.95 SEs**. Borderline: right at the usual line for "clearly more than noise". Module 7 takes this further.

## 6. Practice

1. 25 values with s = 10. What is the SE of the mean?
2. A rate of 20 % from 1,600 people. What is the SE?
3. Group A: mean 50, s = 12, n = 36. Group B: mean 55, s = 16, n = 64. What is the SE of the difference?

<details>
<summary>Answers</summary>

1. 10 ÷ 5 = 2.
2. √(0.2 × 0.8 ÷ 1,600) = √0.0001 = 0.01, one percentage point.
3. √(144/36 + 256/64) = √(4 + 4) = √8 ≈ 2.83. The difference of 5 is about 1.8 SEs.
</details>

**Try it on your own data:** the [[hypothesis-tests]] tool shows the standard error behind each test it runs; the [[sample-size]] calculator runs the square-root law backwards.

**New words:** *standard error*, *SE of a proportion*, *SE of a difference*, *square-root law*.

<div class="keypoints">

- SD describes individuals; SE describes a statistic.
- SE of a mean = s/√n; of a share = √(p(1 − p)/n).
- For a difference of independent groups, add SEs in squares.
- Square-root law: four times the data halves the SE.

</div>
