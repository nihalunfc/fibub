---
title: 'Shape, skew and outliers: reading a box plot'
summary: 'Read the shape of data from a histogram and a box plot: symmetric or skewed, one peak or two, and which points are outliers by the 1.5 × IQR rule. What to do with an outlier once you find one.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'In a right-skewed dataset (long tail to the right), where is the mean compared with the median?'
    choices: ['Below the median', 'Above the median', 'Equal to the median']
    ans: 1
    why: 'The few very large values pull the mean up; the median stays with the bulk. Mean above median is the classic sign of right skew.'
  - q: 'Q1 = 20 and Q3 = 30. By the 1.5 × IQR rule, which value is an outlier?'
    choices: ['44', '47', '12']
    ans: 1
    why: 'IQR = 10, so the fences are 20 − 15 = 5 and 30 + 15 = 45. Only 47 is outside them.'
  - q: You find a delivery time of 900 minutes in the data. What should you do first?
    choices: ['Delete it, it is an outlier', 'Find out why: a data entry error, a lost parcel, or a real but rare event', 'Replace it with the mean']
    ans: 1
    why: 'An outlier is a question, not an answer. Errors should be fixed or removed; real rare events (a lost parcel) may be the most important rows in the data.'
---

**Module 1 · about 25 minutes · school maths.** You'll be able to describe the shape of a distribution, read and draw a box plot, find outliers with the 1.5 × IQR rule and decide what to do with them.

## 1. Shape tells you which summary to trust

Two datasets can share a mean and SD and still look nothing alike. Before quoting any summary, look at the **shape**: draw a histogram (bars of how many values fall in each range) or a box plot. Ask four questions:

1. **Symmetric or skewed?** A long tail to the right (order values, salaries, waits) is **right skew** or positive skew. A long tail to the left (exam scores when most do well, product ratings) is **left skew**.
2. **One peak or two?** Two peaks (**bimodal**) usually mean two groups mixed together, such as weekday and weekend orders, or two store formats. Split them before summarising.
3. **Any gaps or walls?** A wall at zero (no negative times) or at a limit (a 5-star cap) bends the shape.
4. **Any outliers?** Values far away from the rest.

## 2. The box plot

A box plot compresses a distribution into five numbers plus outliers:

- the **box** from Q1 to Q3, with a line at the **median**;
- **whiskers** out to the furthest values still within 1.5 × IQR of the box;
- dots beyond the whiskers: **outliers**.

<!--fig:box-plot-->

Stretch the tail and watch: the median sits off-centre in the box, the right whisker grows, the mean (dashed) moves above the median, and the skewness number turns positive. Add a 90-minute delivery and it appears as a separate dot.

Box plots shine when **comparing groups** side by side: delivery times per region, basket values per store. You see centre, spread, skew and outliers for each group at a glance.

## 3. The 1.5 × IQR rule

John Tukey's rule of thumb marks a value as an outlier when it lies outside the **fences**

```math
Q_1 - 1.5 \times \text{IQR} \quad\text{and}\quad Q_3 + 1.5 \times \text{IQR}
```

For normal data this flags only about 0.7 % of values. For skewed data it flags many values in the long tail, and that is fine: it is a prompt to look, not a verdict.

## 4. Skewness as a number

**Skewness** measures lopsidedness: 0 for symmetric data, positive for a right tail, negative for a left tail. As a rough guide, beyond ±1 is strongly skewed. Excel's `SKEW` and pandas' `.skew()` give the same adjusted formula used here.

## 5. What to do with an outlier

| Cause | Example | Action |
|---|---|---|
| Data error | Price typed as 1999 instead of 19.99 | Fix it, or remove it and note it |
| Different population | A business account in consumer orders | Analyse separately |
| Real, rare event | A lost parcel, a viral day | Keep it; report it; consider the median |

Never delete outliers just to make results look neater. Do say what you did: "3 test orders were removed; results with them included are in the appendix."

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the shape decides which summaries are honest. Symmetric data: mean and SD. Skewed data: median and IQR (or percentiles).

**Equations:** fences `$Q_1 - 1.5\,\text{IQR}$` and `$Q_3 + 1.5\,\text{IQR}$`. Sample skewness:

```math
g = \frac{n}{(n-1)(n-2)} \sum_{i=1}^{n} \left(\frac{x_i - \bar{x}}{s}\right)^3
```

Cubing keeps the sign, so values far above the mean push it positive and far below push it negative.

**Analogy:** the box is the "normal range" of the data; the fences are the edge of the car park; anything outside gets a second look.
</details>

## 6. Worked example

*Made-up numbers.* Minutes to answer 11 support emails: 12, 15, 18, 20, 22, 24, 25, 27, 30, 34, 95.

- Median (6th value): **24**. Q1 (interpolated, position 2.5 counting from 0): halfway from 18 to 20 = **19**. Q3 (position 7.5): halfway from 27 to 30 = **28.5**.
- IQR = 28.5 − 19 = **9.5**; 1.5 × IQR = 14.25.
- Fences: 19 − 14.25 = 4.75 and 28.5 + 14.25 = **42.75**.
- 95 is above 42.75: an **outlier**. The upper whisker stops at 34.
- Mean = 322 ÷ 11 ≈ 29.3, above the median of 24: right skew, mostly from the 95.

Before reporting, check the 95. If the email arrived on a Friday night and was answered Monday, it is real and matters for the service promise. If it was a test ticket, remove it.

## 7. Practice

1. For Q1 = 40, Q3 = 70, find the outlier fences.
2. A histogram of customer ages has peaks at 22 and 55. What does that suggest?
3. Mean salary $68k, median $52k. Which way is the skew?

<details>
<summary>Answers</summary>

1. IQR 30, 1.5 × 30 = 45. Fences −5 and 115.
2. Two different customer groups (students and older customers, perhaps). Summarise each separately; a single average age of about 38 would describe almost nobody.
3. Right skew: a few high salaries pull the mean above the median.
</details>

**Try it on your own data:** the [[box-plot-lab]] draws box plots from your numbers and marks outliers; the [[histogram-builder]] shows the shape with any bin width.

**New words:** *histogram*, *skew (right, left)*, *bimodal*, *box plot*, *whisker*, *fence*, *outlier*, *skewness*.
