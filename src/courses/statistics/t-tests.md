---
title: 't-tests: one sample, two samples and paired'
summary: 'The workhorse tests for means: one-sample (against a target), two-sample (two groups, Welch by default) and paired (the same units before and after). Formulas, assumptions, worked examples and how to run each in Excel and Python.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: '20 stores are measured before and after a new layout. Which test fits?'
    choices: ['Two-sample t-test', 'Paired t-test on the 20 differences', 'Chi-square test']
    ans: 1
    why: 'The same stores appear twice, so analyse each store''s change. Pairing removes the big store-to-store differences and gives a much more sensitive test.'
  - q: 'Why is Welch''s t-test a good default for two groups?'
    choices: ['It assumes the groups have equal variances', 'It does not assume equal variances, and loses almost nothing when they are equal', 'It works without data']
    ans: 1
    why: 'The classic pooled test assumes equal spreads and can mislead when they differ, especially with unequal group sizes. Welch handles both cases.'
  - q: 'In t = (x̄_B − x̄_A) ÷ SE, what makes t bigger?'
    choices: ['A bigger gap, less spread within groups, or more data', 'More spread within groups', 'Smaller samples']
    ans: 0
    why: 'Bigger signal (gap) or smaller noise (SE, which falls with less spread and more data) both raise t.'
---

**Module 6 · about 30 minutes · school maths.** You'll be able to choose between one-sample, two-sample and paired t-tests, compute each by hand, and run them in a spreadsheet or Python.

## 1. Three questions, three tests

| Question | Test | Example |
|---|---|---|
| Is the mean different from a target? | One-sample t | Is average handling time different from the 6-minute target? |
| Do two separate groups differ? | Two-sample t (Welch) | Do mobile and desktop users spend differently? |
| Did the same units change? | Paired t | Did the same 20 stores sell more after the refit? |

All three are signal ÷ noise: a difference in means divided by its standard error.

<!--fig:t-test-sim-->

## 2. One-sample t

```math
t = \frac{\bar{x} - \mu_0}{s/\sqrt{n}}, \qquad df = n - 1
```

Lesson 6.1's pack weights were an example.

## 3. Two-sample t (Welch)

```math
t = \frac{\bar{x}_B - \bar{x}_A}{\sqrt{\dfrac{s_A^2}{n_A} + \dfrac{s_B^2}{n_B}}}
```

The degrees of freedom come from the Welch-Satterthwaite formula (software does it; it lands between the smaller `$n - 1$` and `$n_A + n_B - 2$`). Use Welch by default. The older **pooled** t-test assumes equal variances; it's fine when they really are equal and sample sizes match, risky otherwise.

## 4. Paired t

When each unit is measured twice (before/after, two treatments on the same customer), compute each unit's difference `$d_i$` and run a one-sample t on the differences against 0:

```math
t = \frac{\bar{d}}{s_d/\sqrt{n}}, \qquad df = n - 1
```

Pairing is powerful because big stores and small stores both cancel out: only the change is left.

## 5. Assumptions

- **Independent** units (customers, stores), not repeated rows of the same customer.
- **Roughly normal means**: by the CLT this holds for moderate n; for small n, the data shouldn't be wildly skewed. With heavy skew and small n, use a rank test (Lesson 6.7) or the bootstrap.
- For paired tests, the *differences* are what need to behave.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** every t-test divides an observed difference by its standard error and compares that ratio with the t distribution.

**In code:**
- Excel: `T.TEST(range1, range2, 2, 3)` gives the two-sided p for Welch (type 3), `type 2` for pooled, `type 1` for paired.
- Python: `scipy.stats.ttest_1samp(x, 6)`, `ttest_ind(b, a, equal_var=False)`, `ttest_rel(after, before)`.

**Check:** groups A = 6, 8, 4, 5, 3, 4 and B = 8, 12, 9, 11, 6, 8 give Welch t = 3.46 (B − A), df ≈ 9.6, p ≈ 0.006. tests/stats.mjs checks this against scipy.
</details>

## 6. Worked examples

*Made-up numbers.*

**Two-sample.** Average basket on mobile: x̄ = $38.50, s = $22, n = 400. Desktop: x̄ = $42.10, s = $25, n = 350.

- SE = √(22²/400 + 25²/350) = √(1.21 + 1.786) = √2.996 ≈ **1.73**.
- t = (42.10 − 38.50) ÷ 1.73 ≈ **2.08**; df ≈ 702; two-sided p ≈ **0.038**.
- 95 % CI for the difference: 3.60 ± 1.96 × 1.73 = **$0.21 to $6.99**.

Desktop baskets are higher by somewhere between almost nothing and $7.

**Paired.** 8 stores' weekly sales ($k) before and after a refit:

| Store | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Before | 52 | 87 | 31 | 120 | 64 | 45 | 98 | 73 |
| After | 55 | 90 | 33 | 124 | 63 | 49 | 101 | 76 |
| Change | 3 | 3 | 2 | 4 | −1 | 4 | 3 | 3 |

- Mean change `$\bar{d}$` = 21 ÷ 8 = **2.625**; s_d ≈ **1.60**; SE = 1.60 ÷ √8 ≈ **0.57**.
- t = 2.625 ÷ 0.57 ≈ **4.65**, df = 7, p ≈ **0.002**.

A two-sample test on the same numbers would find nothing (store sizes range from 31 to 124, swamping a 3k change). Pairing is what reveals it.

## 7. Practice

1. Which test: (a) same customers rate two menus; (b) customers in Ontario vs Quebec; (c) is the average call longer than the 5-minute target?
2. One-sample: n = 16, x̄ = 52, s = 8, target 50. Find t.
3. Why might a paired analysis be wrong if the "after" period includes a holiday?

<details>
<summary>Answers</summary>

1. (a) Paired. (b) Two-sample (Welch). (c) One-sample, one-sided if only "longer" matters and that was decided in advance.
2. SE = 8 ÷ 4 = 2; t = 2 ÷ 2 = 1.0 (df 15, two-sided p ≈ 0.33).
3. The holiday changes every store at once, so the "change" mixes the refit with the season. Compare with stores that didn't get the refit over the same weeks (a control group).
</details>

**Try it on your own data:** the [[hypothesis-tests]] tool runs all three t-tests from pasted numbers or a CSV, and the [[regression-workbench]] handles more than two groups or extra variables.

**New words:** *one-sample t-test*, *two-sample t-test*, *Welch's t-test*, *pooled t-test*, *paired t-test*, *degrees of freedom*.
