---
title: 'Correlation: Pearson and Spearman'
summary: 'Measure how two numbers move together with Pearson''s r and Spearman''s rank correlation, test whether r could be zero, put an interval on it, and avoid the traps: outliers, curves, huge samples and hidden causes.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'r = 0.3 from 50 stores. Is that evidence of a real (non-zero) correlation at α = 0.05?'
    choices: ['No, 0.3 is weak', 'Yes, p ≈ 0.03, though the 95 % CI (about 0.02 to 0.53) shows it could be tiny or moderate', 'Only if r is above 0.5']
    ans: 1
    why: 'Significance depends on n. With 50 pairs, 0.3 is just significant; the interval shows how uncertain its size is.'
  - q: 'One huge store sits far from the rest and drives r from 0.1 to 0.7. What should you report?'
    choices: ['r = 0.7', 'Spearman''s rank correlation, or r with and without that store, and a scatter plot', 'Nothing']
    ans: 1
    why: 'Pearson''s r is sensitive to outliers; ranks are not. Show the plot so readers see why.'
  - q: 'Ice cream sales and drownings are correlated. Why?'
    choices: ['Ice cream causes drowning', 'A hidden cause (hot weather) drives both', 'Coincidence']
    ans: 1
    why: 'A confounder can create a correlation between two things that do not affect each other (ML foundations Lesson 2.3).'
sources:
  - 'OpenIntro Statistics, 4th edition (Diez, Cetinkaya-Rundel, Barr), Section 8.1 Fitting a line, residuals, and correlation https://www.openintro.org/book/os/'
  - 'Anscombe, F. J. (1973), Graphs in Statistical Analysis, The American Statistician 27(1), 17-21 https://doi.org/10.1080/00031305.1973.10478966'
---

**Module 8 · about 20 minutes · school maths.** You'll be able to compute and test a correlation, choose Pearson or Spearman, and explain why correlation alone doesn't show cause.

<div class="bigidea">Correlation measures how closely two numbers move together on a straight line, from −1 to +1, and says nothing on its own about cause.</div>

**In everyday terms:** ice-cream sales and sunburn rise and fall together, but ice cream does not cause sunburn. Summer causes both. Correlation spots the dance; it does not say who leads.

## 1. Pearson's r

**Pearson's r** measures how closely two numbers follow a straight line: +1 a perfect rising line, −1 a perfect falling line, 0 no straight-line relationship.

<!--fig:correlation-slider-->

Add the far-away point and watch one dot move r a long way. That's Pearson's weakness.

**r²** is the share of one variable's spread "shared" with the other: r = 0.6 means r² = 36 %.

## 2. Spearman's rank correlation

Replace each value by its **rank** (1st, 2nd, ...) and compute Pearson's r on the ranks. **Spearman's ρ** measures any steadily rising or falling relationship, straight or curved, and one extreme value can only be "the largest", so it can't dominate. Use it for skewed data (revenue, house prices), ranks and ratings, or when outliers are present.

Drag any dot, add the outlier, and switch on the residual gaps.

<figure class="fig" data-fig="@data-corr-drag"><figcaption>Notice how r and the slope react, especially to a single far-away point.</figcaption></figure>


## 3. Is r real? Test and interval

The test of "true correlation is zero" uses a t-statistic with `$n - 2$` degrees of freedom. For an interval, use **Fisher's z** transform.

Two warnings:

- **Small samples** give wild r values. With 10 points, r = 0.6 still has a 95 % CI from about −0.05 to 0.89.
- **Huge samples** make tiny correlations "significant". r = 0.1 from 2,000 customers has p < 0.0001 but explains 1 % of the spread. Report r and its interval, not just the p-value.

## 4. Correlation is not causation

<!--fig:hidden-cause-->

A **confounder** drives both variables. Here hot days raise both ice cream sales and swimming accidents. Show only days in one temperature band and the correlation mostly vanishes. Other explanations for a correlation: reverse cause (busier stores hire more staff, not the other way round), selection (only successful products survive into your data), and chance across many comparisons. Experiments (Module 7) are the clean way to show cause.

<div class="meaning">

<dl>
<dt>Pearson r</dt><dd>Average product of z-scores: how well a straight line fits, from −1 to +1.</dd>
<dt>r²</dt><dd>Share of the variation in one variable lined up with the other.</dd>
<dt>Spearman ρ</dt><dd>Pearson on the ranks: any steady up-or-down trend, robust to outliers.</dd>
<dt>Physical meaning</dt><dd>r compares each point's position with the averages. Points in the "both above" and "both below" corners push r up; points in the mixed corners push it down. One extreme point sitting far out in a corner can create or hide a correlation on its own.</dd>
</dl>

</div>

<div class="myth">

**"r = 0 means the variables are unrelated."** r only measures straight-line patterns. A U-shape (sales highest at medium prices) can have r near 0 and a very strong relationship. Always plot first.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The data.</b> 50 stores: staff hours per week and satisfaction score.</div>
<div class="step"><b>Plot.</b> A loose upward cloud, plus one big flagship store top right.</div>
<div class="step"><b>Pearson.</b> r = 0.30, p = 0.034, CI 0.02 to 0.53.</div>
<div class="step"><b>Check the flagship.</b> Without it, r = 0.22. Spearman (all stores): 0.24.</div>
<div class="step"><b>Report.</b> A weak positive link, not proof that more hours raise scores: bigger, busier stores differ in other ways.</div>
</div>

<div class="problem" data-problem="pearson-r"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** r is the average product of the two variables in z-score units.

**Equation:**

```math
r = \frac{\sum (x_i - \bar x)(y_i - \bar y)}{\sqrt{\sum (x_i - \bar x)^2 \sum (y_i - \bar y)^2}}, \qquad t = \frac{r\sqrt{n-2}}{\sqrt{1-r^2}}
```

**Interval:** `$z = \tanh^{-1}(r)$` is roughly normal with SE `$1/\sqrt{n-3}$`; build `$z \pm 1.96\,\text{SE}$` and transform back with `$\tanh$`.

**Check:** r = 0.3, n = 50: t = 2.18, p = 0.034; 95 % CI 0.02 to 0.53 (scipy agrees; tests/stats.mjs checks the t and p).
</details>

## 5. Worked example

*Made-up data:* 50 stores; correlation between staff hours per week and customer satisfaction score.

- Scatter plot first: a loose upward cloud, one very large flagship store at the top right.
- Pearson r = 0.30, p = 0.034, 95 % CI 0.02 to 0.53.
- Without the flagship: r drops to 0.22. Spearman (all stores): 0.24.
- Report: "a weak positive association (Spearman 0.24); stores with more staff hours tend to score a little higher. This doesn't show that adding hours would raise scores: bigger, busier stores may differ in other ways."

## 6. Practice

1. r = −0.8. Describe it in words.
2. Which correlation would you use for customers' spend (very skewed) against visits?
3. r = 0.05, n = 100,000, p < 0.001. Is it important?

<details>
<summary>Answers</summary>

1. A strong negative straight-line relationship: as one goes up, the other tends to go down, and r² = 64 % of the spread is shared.
2. Spearman, because spend is skewed and a few big spenders would dominate Pearson's r.
3. It's very likely real but tiny: r² = 0.25 %. Statistically significant, practically negligible.
</details>

**Try it on your own data:** the [[csv-profiler]] tool shows correlations between the numeric columns of a file; [[regression-workbench]] fits the line and gives r with a scatter plot; [[bootstrap-permutation]] puts an interval on any statistic, including Spearman's ρ.

**New words:** *Pearson's r*, *Spearman's rank correlation*, *r²*, *Fisher's z*, *confounder*, *reverse causation*.

<div class="keypoints">

- Plot first; r measures straight-line association only.
- r ranges from −1 to +1; r² is the share of variation lined up.
- Spearman uses ranks and resists outliers.
- Correlation is not causation: look for confounders and use experiments when you can.

</div>
