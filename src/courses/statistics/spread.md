---
title: 'The spread: range, variance, standard deviation and IQR'
summary: 'How far values sit from the centre: the range, the interquartile range, the variance and the standard deviation, why we square, why samples divide by n − 1, and which one to report.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'Two stores both average 100 sales a day. Store A has standard deviation 5, store B has 25. What does that tell a planner?'
    choices: ['Store B sells more', 'Store B''s daily sales swing much more, so it needs more flexible staffing and stock', 'Nothing, because the means are equal']
    ans: 1
    why: 'The standard deviation is the typical distance from the mean. Store B''s days are often 25 or more away from 100 in either direction.'
  - q: Why do we divide by n − 1 for a sample standard deviation?
    choices: ['To make the number bigger for safety', 'Because the sample''s own mean sits closer to its values than the true mean, so dividing by n would underestimate the spread', 'Because one value is always an outlier']
    ans: 1
    why: 'Measuring gaps from the sample mean makes them slightly too small on average. Dividing by n − 1 instead of n corrects that bias (Bessel''s correction).'
  - q: 'The values have a few extreme outliers. Which measure of spread is least affected?'
    choices: ['The range', 'The standard deviation', 'The interquartile range']
    ans: 2
    why: 'The IQR uses only the middle half of the data (Q3 − Q1), so the extremes do not touch it. The range uses only the extremes, and the SD squares them.'
---

**Module 1 · about 25 minutes · school maths.** You'll be able to compute the range, IQR, variance and standard deviation, explain the n − 1, and choose a measure of spread for a report.

## 1. Why the average is not enough

A store that sells 100 units every single day and a store that sells 40 one day and 160 the next have the same mean. They need completely different staffing, stock and cash planning. **Spread** (also called dispersion or variability) measures how far values typically sit from the centre. It is also the size of the "noise" from Lesson 1.1, so everything in Modules 4 to 7 depends on it.

<!--fig:spread-compare-->

## 2. Range

Largest minus smallest. Easy, but it depends on only two values, the two most unusual ones, and it grows as you collect more data. Use it to show limits ("deliveries took between 18 and 64 minutes"), not to compare spreads.

## 3. Interquartile range (IQR)

Sort the data and cut it into four equal parts. The cut points are the **quartiles**: Q1 (25 % of values below), Q2 (the median) and Q3 (75 % below). The IQR is

```math
\text{IQR} = Q_3 - Q_1
```

the width of the middle half of the data. Extreme values do not affect it, so it pairs naturally with the median. Box plots (Lesson 1.4) are drawn from it.

*How quartiles are computed varies a little between tools.* Excel's QUARTILE.INC, pandas' `quantile()` and the simulations here interpolate between sorted values; some textbooks take medians of each half. On large datasets the methods agree closely; on 8 values they can differ slightly.

## 4. Variance and standard deviation

Take each value's distance from the mean, square it, and average the squares. That is the **variance**. Its square root is the **standard deviation (SD)**, back in the original units.

```math
s^2 = \frac{1}{n-1}\sum_{i=1}^{n}(x_i - \bar{x})^2 \qquad s = \sqrt{s^2}
```

Why square? Raw gaps above and below the mean always add to zero, so they cannot be averaged directly. Squaring makes them all positive and gives big gaps extra weight. (Absolute gaps would also work, but squares have much nicer maths, which the rest of statistics relies on.)

Why `$n - 1$`? For a **sample**, the gaps are measured from the sample's own mean, which is by construction the point closest to these values. The gaps come out slightly too small, so we divide by one fewer to make up for it. For a whole **population** you divide by `$n$` and write `$\sigma$` (sigma). In practice: Excel's `STDEV.S`, pandas' `.std()` and most tools use `$n - 1$` by default; NumPy's `np.std()` uses `$n$` unless you pass `ddof=1`. On large data the difference is tiny.

**Reading an SD:** it is roughly the typical distance from the mean. For bell-shaped data, about two thirds of values lie within 1 SD of the mean and about 95 % within 2 SD (Lesson 3.4).

## 5. Coefficient of variation

To compare spreads on different scales, divide the SD by the mean: **CV = s ÷ x̄**. A product selling 1,000 ± 100 a day (CV 10 %) is steadier than one selling 50 ± 15 (CV 30 %), even though its SD is bigger.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** spread is the typical size of the gap between a value and the centre. The SD measures it with squared gaps (sensitive to extremes); the IQR with the middle half (robust).

**Equations:** `$s^2 = \frac{1}{n-1}\sum (x_i - \bar{x})^2$`, `$s = \sqrt{s^2}$`, `$\text{IQR} = Q_3 - Q_1$`, `$\text{CV} = s / \bar{x}$`.

A handy shortcut for hand calculation: `$\sum (x_i - \bar{x})^2 = \sum x_i^2 - n\bar{x}^2$`.

**Analogy:** two archers both centred on the bullseye. The SD measures how tightly each one's arrows group.
</details>

## 6. Worked example

*Made-up numbers.* Daily returns at a store over 6 days: 4, 7, 5, 9, 6, 11.

- Mean: (4 + 7 + 5 + 9 + 6 + 11) ÷ 6 = 42 ÷ 6 = **7**.
- Gaps: −3, 0, −2, 2, −1, 4. Squares: 9, 0, 4, 4, 1, 16. Sum = **34**.
- Sample variance: 34 ÷ (6 − 1) = **6.8**. Sample SD: √6.8 ≈ **2.61 returns**.
- Range: 11 − 4 = **7**.
- Sorted: 4, 5, 6, 7, 9, 11. Using interpolation (pandas' default), Q1 is a quarter of the way from the 2nd to the 3rd value: 5.25; Q3 is three quarters of the way from the 4th to the 5th: 8.5. IQR = 8.5 − 5.25 = **3.25**.

Report: "about 7 returns a day, typically within 2 or 3 of that".

## 7. Practice

1. Find the sample variance and SD of 10, 12, 14, 16, 18.
2. A dataset's SD is 12 when measured in dollars. What is it in cents? What is its variance in cents²?
3. You add one huge outlier to a dataset. Rank the range, SD and IQR from most to least affected.

<details>
<summary>Answers</summary>

1. Mean 14; gaps −4, −2, 0, 2, 4; squares 16, 4, 0, 4, 16 = 40; variance 40 ÷ 4 = 10; SD √10 ≈ 3.16.
2. SD 1,200 cents. Variance 1,200² = 1,440,000 cents² (variance scales with the square, which is why we usually report the SD).
3. Range (most), then SD, then IQR (barely moves).
</details>

**Try it on your own data:** the [[csv-profiler]] reports the SD, quartiles and IQR of every number column; the [[grouped-data-stats]] tool works them out from a frequency table, step by step.

**New words:** *spread*, *range*, *quartile*, *interquartile range (IQR)*, *variance*, *standard deviation*, *Bessel's correction*, *coefficient of variation*.
