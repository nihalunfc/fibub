---
title: Confidence intervals for a proportion
summary: 'Intervals for percentages: conversion rates, survey shares, defect rates. The simple Wald formula, the better Wilson interval for small samples and rates near 0 % or 100 %, and the ±3 points of a 1,000-person poll.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'A survey of 1,000 finds 50 % support. What is the approximate 95 % margin of error?'
    choices: ['±1 point', '±3 points', '±5 points']
    ans: 1
    why: '1.96 × √(0.5 × 0.5 ÷ 1,000) ≈ 1.96 × 0.0158 ≈ 0.031, about ±3 percentage points.'
  - q: '0 of 40 customers reported a bug. The simple Wald interval is 0 % to 0 %. What is wrong?'
    choices: ['Nothing, the rate is zero', 'The Wald formula breaks near 0 %; a Wilson interval gives roughly 0 % to 9 %', 'You cannot compute an interval for 0 events']
    ans: 1
    why: 'With p̂ = 0 the Wald SE is 0, which is absurd. Wilson (or the rule of three, 3/n ≈ 7.5 %) gives a sensible upper limit.'
  - q: 'A conversion rate of 3 % is measured on 2,000 visitors. Which is closest to the 95 % interval?'
    choices: ['2.25 % to 3.75 %', '2.9 % to 3.1 %', '0 % to 6 %']
    ans: 0
    why: 'SE = √(0.03 × 0.97 ÷ 2,000) ≈ 0.0038; margin ≈ 0.75 points; interval ≈ 2.25 % to 3.75 %.'
sources:
  - 'OpenIntro Statistics, 4th edition (Diez, Cetinkaya-Rundel, Barr), Section 6.1 Inference for a single proportion https://www.openintro.org/book/os/'
  - 'Brown, L. D., Cai, T. T. and DasGupta, A. (2001), Interval Estimation for a Binomial Proportion, Statistical Science 16(2), 101-133 https://doi.org/10.1214/ss/1009213286'
---

**Module 5 · about 20 minutes · school maths.** You'll be able to compute Wald and Wilson intervals for a proportion, know when the simple formula breaks, and read a poll's margin of error.

<div class="bigidea">A percentage from a sample needs a range too: p̂ ± 1.96 × √(p̂(1 − p̂)/n), or the Wilson interval when the sample is small or the share is near 0 % or 100 %.</div>

**In everyday terms:** a poll of 1,000 people says "45 %, plus or minus 3 points". That ±3 is the margin of error: the share in the whole country is very likely somewhere from 42 % to 48 %.

## 1. Percentages need intervals too

Conversion rates, click-through rates, survey percentages, defect rates and churn rates are all **proportions**: the share of yeses. They are the most common numbers an analyst reports, and they come with sampling error like any average (a proportion is the mean of 0s and 1s).

## 2. The Wald interval

From Lesson 3.2, `$\hat p$` has SE `$\sqrt{p(1-p)/n}$`. Plug in `$\hat p$` and use 1.96:

```math
\hat p \;\pm\; 1.96\sqrt{\frac{\hat p(1-\hat p)}{n}}
```

Fine when `$n\hat p$` and `$n(1-\hat p)$` are both at least 10. It fails for small samples or rates near 0 % and 100 %: it can include impossible values below 0, or shrink to nothing when `$\hat p$` is 0.

Press Draw 1 a few times to see what resampling does, then Draw 500.

<figure class="fig" data-fig="@data-bootstrap-resample"><figcaption>Notice that some original values are picked twice and others not at all, and that the middle 95% of the resampled means forms the interval.</figcaption></figure>


## 3. The Wilson interval

Edwin Wilson's 1927 interval fixes this by pulling the centre slightly towards 50 % and never leaving 0–100 %. With `$z = 1.96$`:

```math
\frac{\hat p + \frac{z^2}{2n}}{1 + \frac{z^2}{n}} \;\pm\; \frac{z}{1 + \frac{z^2}{n}}\sqrt{\frac{\hat p(1-\hat p)}{n} + \frac{z^2}{4n^2}}
```

You'll rarely compute it by hand; know that good tools use it (statsmodels `proportion_confint(method="wilson")`), and use it yourself when counts are small.

<!--fig:margin-of-error-->

Slide p̂ to 2 % with n = 100: the Wald interval dips below zero, Wilson doesn't. With large n both agree.

## 4. Reading polls

- "±3 points, 19 times out of 20" means a 95 % interval of about ±3 points for a 50 % answer with ~1,000 people.
- The margin applies to **each** percentage. The **gap** between two candidates (or two products) is noisier, roughly up to twice as wide.
- Subgroups have bigger margins: "among the 150 under-25s" might be ±8 points.
- The margin covers sampling error only, not bias (Lesson 4.2).

**Rule of three:** if 0 of `$n$` items had a problem, the 95 % upper limit for the true rate is about `$3/n$`. Zero complaints from 300 customers: true rate likely under 1 %.

<div class="meaning">

<dl>
<dt>p̂ = x/n</dt><dd>The share in your sample.</dd>
<dt>√(p̂(1 − p̂)/n)</dt><dd>Its standard error.</dd>
<dt>Wald interval</dt><dd>p̂ ± 1.96·SE. Simple, fine for large n and shares away from the edges.</dd>
<dt>Wilson interval</dt><dd>A better interval that never goes below 0 % or above 100 % and works for small n.</dd>
<dt>Physical meaning</dt><dd>A share is pulled hardest when it is near 50 % (the most uncertainty) and least near 0 or 100 %. That is why a 1,000-person poll is ±3 points at worst.</dd>
</dl>

</div>

<div class="myth">

**"0 defects in 50 units means the defect rate is 0 %."** It means the rate is probably low, not zero. The Wilson interval is 0 % to about 7 %; the rule of three gives roughly 3/n = 6 % as an upper bound.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The survey.</b> 186 of 300 customers like the new menu.</div>
<div class="step"><b>Share.</b> p̂ = 186 ÷ 300 = 0.62.</div>
<div class="step"><b>SE.</b> √(0.62 × 0.38 ÷ 300) ≈ 0.028.</div>
<div class="step"><b>Margin.</b> 1.96 × 0.028 ≈ 0.055, about 5.5 points.</div>
<div class="step"><b>Interval.</b> 56.5 % to 67.5 %. All above 50 %: a majority likes the menu, if the 300 were a fair sample.</div>
</div>

<div class="problem" data-problem="ci-proportion"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a proportion is an average of 0/1 values, so its interval is estimate ± multiplier × SE, with SE `$\sqrt{p(1-p)/n}$`. Near 0 or 1 the curve is lopsided, which Wilson allows for.

**Equations:** Wald `$\hat p \pm z\sqrt{\hat p(1-\hat p)/n}$`; Wilson as above; worst-case margin (p = 0.5) `$\approx 0.98/\sqrt{n}$`, so roughly `$1/\sqrt{n}$`.

**Quick rule:** 95 % margin ≈ `$1/\sqrt{n}$` for answers near 50 %: n = 100 → ±10 points, 400 → ±5, 1,000 → ±3, 10,000 → ±1.
</details>

## 5. Worked example

*Made-up numbers.* 300 customers were asked about a new menu; 186 said they like it.

- `$\hat p$` = 186 ÷ 300 = **62 %**.
- SE = √(0.62 × 0.38 ÷ 300) = √0.000785 ≈ **0.028**.
- Wald: 0.62 ± 1.96 × 0.028 = 0.62 ± 0.055 → **56.5 % to 67.5 %**.
- Wilson: about **56.4 % to 67.3 %**. Practically the same, since n is decent and p̂ isn't extreme.

Report: "62 % like the new menu (95 % CI 56 % to 67 %, n = 300)." The interval is above 50 %, so a majority of customers like the menu, provided the 300 were a fair sample.

## 6. Practice

1. 45 of 900 orders were late. Find the Wald 95 % interval.
2. 0 of 150 transactions were flagged. Rule-of-three upper limit?
3. A poll of 2,500 has what rough worst-case margin?

<details>
<summary>Answers</summary>

1. p̂ = 5 %; SE = √(0.05 × 0.95 ÷ 900) ≈ 0.00726; margin ≈ 1.4 points; CI ≈ 3.6 % to 6.4 %.
2. 3 ÷ 150 = 2 %.
3. 1 ÷ √2,500 = 1 ÷ 50 = ±2 points.
</details>

**Try it on your own data:** the [[hypothesis-tests]] tool gives Wilson intervals for a count out of a total; the [[sample-size]] calculator works the other way, from margin to n.

**New words:** *proportion*, *Wald interval*, *Wilson interval*, *margin of error*, *rule of three*.

<div class="keypoints">

- Share: p̂ ± 1.96 × √(p̂(1 − p̂)/n) for 95 % (Wald).
- Use the Wilson interval for small n or shares near 0 % or 100 %.
- The margin of error is largest at 50 %; ±3 points needs about 1,000 people.
- Zero events does not mean a zero rate; report an upper bound.

</div>
