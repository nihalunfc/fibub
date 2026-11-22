---
title: 'The bootstrap: resampling your own data'
summary: 'When there is no handy formula (medians, percentiles, ratios, skewed revenue), resample your own data with replacement thousands of times and read the uncertainty off the results. How the percentile bootstrap works and when it does not.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'What does one bootstrap resample of 20 values contain?'
    choices: ['The same 20 values in a new order', '20 values drawn at random with replacement from the original 20, so some repeat and some are missing', '20 new values from the population']
    ans: 1
    why: 'Drawing with replacement is the whole trick: each resample is a plausible "other sample" built only from the data you have.'
  - q: 'You resample 2,000 times and sort the 2,000 medians. Where is the 95 % percentile interval?'
    choices: ['Between the 50th and 1,950th values', 'Between the smallest and largest', 'Between the 1,000th and 1,001st']
    ans: 0
    why: 'The middle 95 % runs from the 2.5th percentile (value 50 of 2,000) to the 97.5th (value 1,950).'
  - q: 'When does the bootstrap struggle?'
    choices: ['For medians', 'With very small samples, or for extremes like the maximum, which a resample can never exceed', 'When the data is not normal']
    ans: 1
    why: 'A resample can only contain values you saw, so tiny samples and the largest values are poorly covered. Non-normal data is exactly where it helps.'
---

**Module 4 · about 20 minutes · no new maths.** You'll be able to explain and run a bootstrap, read a percentile interval, and know when to trust it.

## 1. No formula? Resample

Lesson 4.4 gave SE formulas for means and proportions. But what's the uncertainty of a **median** order value? A **90th percentile** delivery time? A **ratio** like revenue per visitor? Formulas get ugly or don't exist. The **bootstrap** (Bradley Efron, 1979) answers with computing power instead of algebra.

## 2. How it works

1. You have one sample of `$n$` values.
2. Draw `$n$` values from it **at random with replacement**. That's one resample.
3. Compute your statistic (median, P90, ratio...) on the resample.
4. Repeat 1,000 to 10,000 times.
5. The spread of those results estimates the statistic's sampling variation. The middle 95 % of them is a **95 % percentile interval**; their SD is the **bootstrap standard error**.

The idea: the sample is your best picture of the population, so resampling from it mimics drawing new samples from the population.

<!--fig:bootstrap-ci-->

Try the median, then the mean, then the 90th percentile. The P90's interval is wide and lumpy: with only 20 orders, two values (98 and 140) decide it. That is honest: you really don't know the 90th percentile well from 20 orders.

## 3. Uses at work

- Uncertainty for **medians and percentiles** (P95 page load, median basket).
- **Revenue per visitor** in an A/B test, where most values are $0 and a few are large.
- **Ratios and custom metrics**: average order value = revenue ÷ orders.
- A check on formula-based answers: if the bootstrap interval and the formula interval disagree, the formula's assumptions are probably shaky.

## 4. Cautions

- **Tiny samples** (under ~15–20): the resamples can't invent the values you never saw.
- **Extremes** (minimum, maximum): a resample can never exceed the observed max.
- **Dependent data:** resample the independent units (customers, stores, days), not rows. If one customer has 50 orders, resample customers with all their orders (a "cluster bootstrap").
- **Use a seed** (`random_state`) so others can repeat your numbers.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** treat the sample as a stand-in for the population (the "plug-in" principle) and simulate sampling from it.

**Percentile interval:** with `$B$` resamples giving `$\theta^*_1 \le \cdots \le \theta^*_B$` sorted, the 95 % interval runs from the 2.5th to the 97.5th percentile of the `$\theta^*$`. **Bootstrap SE:** the SD of the `$\theta^*$`. Better variants (BCa) adjust for skew and bias.

**In code (Python):** `scipy.stats.bootstrap((x,), np.median, n_resamples=5000, method="percentile")`, or by hand: `np.median(rng.choice(x, size=(5000, len(x)), replace=True), axis=1)`.

**Analogy:** you can't revisit the population, so you remix the recording you already have, thousands of times, to hear how much the tune could vary.
</details>

## 5. Worked example

*The 20 orders in the simulation.* Sorted: 12, 15, 18, 19, 22, 24, 25, 27, 29, 31, 33, 35, 38, 41, 45, 52, 60, 75, 98, 140.

- Sample median: (31 + 33) ÷ 2 = **$32**. Sample mean: **$41.95**.
- 5,000 bootstrap medians, sorted: the 2.5th percentile is about $24.5 and the 97.5th about $43 (your run may differ by a dollar).
- Report: "Median order $32 (95 % bootstrap interval roughly $25 to $43, n = 20)."
- The mean's bootstrap interval is wider on the high side ($30 to $57 or so) because the $140 order appears 0, 1, 2 or more times in each resample.

## 6. Practice

1. Why must resampling be *with* replacement?
2. You resample 1,000 times. Which sorted positions give a 90 % interval?
3. An A/B test has 40,000 visitors per group and revenue per visitor is mostly $0. Why might the bootstrap be a good check on a t-test here?

<details>
<summary>Answers</summary>

1. Without replacement, every resample of size n is just the original sample reshuffled, so every statistic comes out the same and there is no variation to measure.
2. The 50th and 950th (5th and 95th percentiles).
3. The data is extremely skewed (lots of zeros, a few big spenders), so the normal approximation may need more data than usual; the bootstrap doesn't rely on it.
</details>

**Try it on your own data:** the [[bootstrap-permutation]] tool runs percentile and BCa bootstrap intervals for a mean, median, SD or difference, seeded so results repeat. The ML course uses bootstrap samples to build random forests ([bagging](/learn/courses/ml-foundations/bagging-bootstrap/)).

**New words:** *bootstrap*, *resample*, *with replacement*, *percentile interval*, *bootstrap standard error*, *cluster bootstrap*.
