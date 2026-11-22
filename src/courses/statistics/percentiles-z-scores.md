---
title: 'Percentiles and z-scores: where one value stands'
summary: 'Say where a single value sits in its group: percentiles and percentile ranks for any data, z-scores for comparing across scales, and the 90th and 95th percentiles that service targets are written in.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'A store''s sales are $1,200 on a day when the mean is $1,000 and the SD is $100. What is the z-score?'
    choices: ['0.2', '2', '200']
    ans: 1
    why: 'z = (1,200 − 1,000) ÷ 100 = 2. The day is 2 standard deviations above the mean.'
  - q: 'The 90th percentile delivery time is 45 minutes. What does that mean?'
    choices: ['90 % of deliveries take 45 minutes', '90 % of deliveries take 45 minutes or less', 'The average delivery is 45 minutes']
    ans: 1
    why: 'A percentile is a cut point: 90 % of values are at or below it and 10 % above.'
  - q: 'Why do service promises often use the 95th percentile instead of the mean?'
    choices: ['It is easier to compute', 'It describes the slow cases customers remember, which the mean hides', 'It is always smaller than the mean']
    ans: 1
    why: 'A mean of 2 seconds can hide 1 visitor in 20 waiting 10 seconds. The 95th percentile puts a number on that tail.'
sources:
  - 'OpenIntro Statistics, 4th edition, Section 4.1 Normal distribution (z-scores and percentiles) https://www.openintro.org/book/os/'
  - 'Hyndman, R. J. and Fan, Y. (1996), Sample Quantiles in Statistical Packages, The American Statistician 50(4), 361-365 https://doi.org/10.1080/00031305.1996.10473566'
---

**Module 1 · about 20 minutes · school maths.** You'll be able to find percentiles, compute and read z-scores, and use them to compare values on different scales.

<div class="bigidea">A z-score turns any value into "how many usual wobbles from normal", so values on different scales can be compared fairly.</div>

**In everyday terms:** a 15 cm growth spurt means a lot for a 10-year-old and little for a tree. Dividing by what is normal for each (their SD) puts them on one scale. A percentile says the same thing as a rank: "taller than 90 out of 100 classmates".

## 1. One value in context

"Store 14 sold $1,200 yesterday" means little alone. Compared with what? Two tools put one value in context: **percentiles**, which work for any data, and **z-scores**, which measure distance from the mean in standard deviations.

## 2. Percentiles

The **p-th percentile** is the value with p % of the data at or below it. The median is the 50th percentile; Q1 and Q3 are the 25th and 75th. The **percentile rank** goes the other way: given a value, what share of the data is at or below it?

Percentiles are the language of service levels, because they describe the slow tail that averages hide:

- **P90 / P95 / P99 latency**: page load times for 90 %, 95 % and 99 % of visitors.
- **Delivery promise**: "95 % of orders arrive within 3 days" is the 95th percentile.
- **Growth charts and test scores** are reported as percentile ranks.

Drag the number of bins from 3 to 40, then switch to equal-count edges.

<figure class="fig" data-fig="@data-hist-bins"><figcaption>Notice that the same data can look like one hump or two depending on the bins you choose.</figcaption></figure>


## 3. z-scores

A **z-score** says how many standard deviations a value is from the mean:

```math
z = \frac{x - \bar{x}}{s}
```

z = 0 is exactly average, z = 1.5 is one and a half SDs above, z = −2 is two SDs below. Because the units cancel, z-scores let you compare values on different scales: a region's sales against its own history, a test score on one exam against another.

<!--fig:z-score-->

For roughly bell-shaped data, a z-score converts straight into a percentile (Lesson 3.4 explains the curve). Rough rules: |z| > 2 happens about 1 time in 20; |z| > 3 about 3 times in 1,000. Analysts often use |z| > 3 to flag unusual days, and |z| > 2 as "worth a look".

## 4. Cautions

- z-scores come from the mean and SD, so outliers distort them, and on heavily skewed data the "1 in 20" rule fails. For skewed data, use percentiles.
- A value can be unusual without being important: z = 3 on a tiny product line may matter less than z = 1.5 on the flagship.

<div class="meaning">

<dl>
<dt>Percentile p</dt><dd>The value below which p % of the data falls. The 90th percentile of delivery time is the time 90 % of deliveries beat.</dd>
<dt>z-score</dt><dd>z = (value − mean) ÷ SD: how many SDs above (+) or below (−) the mean.</dd>
<dt>Physical meaning</dt><dd>z puts every measurement on the same ruler, marked in "usual wobbles". A z of +2 in sales and +2 in returns are equally unusual even though one is in dollars and the other in units.</dd>
</dl>

</div>

<div class="myth">

**"z = 2 always means the top 2.5 %."** That is true only for bell-shaped data. For skewed data like order values, many more values sit above z = 2. Use percentiles when the shape is skewed.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The question.</b> North sold $52,000 this week (usual $45,000, SD $5,000). South sold $18,500 (usual $15,000, SD $1,500). Which week was more unusual?</div>
<div class="step"><b>Gaps.</b> North is $7,000 above its usual; South is $3,500 above its usual. North looks bigger in dollars.</div>
<div class="step"><b>Divide by each region's wobble.</b> North: 7,000 ÷ 5,000 = 1.4. South: 3,500 ÷ 1,500 ≈ 2.33.</div>
<div class="step"><b>Compare.</b> South's week is 2.33 usual wobbles above normal, North's only 1.4. South's week is the more unusual one.</div>
<div class="step"><b>Report.</b> "South had its best week in a long while; North had a good but ordinary week."</div>
</div>

<div class="problem" data-problem="z-score-compare"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a z-score re-expresses a value in "standard deviations from the mean", which puts every variable on the same scale.

**Equations:** `$z = \frac{x - \bar{x}}{s}$`, and back again `$x = \bar{x} + z\,s$`. The z-scores of a whole dataset always have mean 0 and SD 1. This is the same **standardising** used to scale features in the ML course (Lesson 2.4 there).

**Analogy:** a temperature of 30 °C is ordinary in Delhi in May and extraordinary in London in March. The z-score is the "for this place and season" adjustment.
</details>

## 5. Worked example

*Made-up numbers.* Two regions, one good week each:

| Region | This week | Usual weekly mean | Usual SD |
|---|---|---|---|
| North | $52,000 | $45,000 | $5,000 |
| South | $18,500 | $15,000 | $1,500 |

- North: z = (52,000 − 45,000) ÷ 5,000 = **1.4**.
- South: z = (18,500 − 15,000) ÷ 1,500 = **2.33**.

North gained more dollars, but South's week is far more unusual for South: a jump of more than two of its usual SDs. If you want to find out what went right, start with South. In percentile terms (if weeks are roughly normal), North's week beats about 92 % of its weeks, South's about 99 %.

## 6. Practice

1. Mean 80, SD 6. What raw value has z = −1.5?
2. Exam A: you scored 72 (mean 60, SD 8). Exam B: you scored 81 (mean 75, SD 4). On which did you do better relative to the class?
3. 1,000 page loads sorted from fastest to slowest. Roughly which position is the 95th percentile?

<details>
<summary>Answers</summary>

1. x = 80 + (−1.5)(6) = 71.
2. A: z = 12 ÷ 8 = 1.5. B: z = 6 ÷ 4 = 1.5. Equally good.
3. Around the 950th: 950 of the 1,000 loads are at or faster than it.
</details>

**Try it on your own data:** the [[normal-curve-lab]] turns any z-score into a percentile and back; the [[distribution-explorer]] does the same for other distributions.

**New words:** *percentile*, *percentile rank*, *P90 / P95*, *z-score*, *standardising*.

<div class="keypoints">

- A percentile is the value a given share of the data falls below; service targets are often written as 90th or 95th percentiles.
- z = (value − mean) ÷ SD measures distance from normal in SDs.
- z-scores compare values measured on different scales.
- The "z = 2 is the top 2.5 %" rule needs bell-shaped data; for skewed data use percentiles.

</div>
