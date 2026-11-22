---
title: 'Many tests at once: the multiple comparisons trap'
summary: 'Test enough segments, metrics or variants and something will look significant by luck. The family-wise error rate, Bonferroni and Holm corrections, the false discovery rate, and habits that keep dashboards and A/B readouts honest.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'You test 20 segments where the change truly does nothing, each at α = 0.05. Roughly how likely is at least one "significant" result?'
    choices: ['5 %', 'About 64 %', '100 %']
    ans: 1
    why: '1 − 0.95²⁰ ≈ 0.64. Most analyses that slice data 20 ways will find a false win.'
  - q: 'With Bonferroni and 10 tests, what threshold does each p-value need to beat for an overall 5 % error rate?'
    choices: ['0.05', '0.005', '0.5']
    ans: 1
    why: 'Bonferroni divides α by the number of tests: 0.05 ÷ 10 = 0.005.'
  - q: 'Which habit best prevents the trap in an A/B test readout?'
    choices: ['Pick the primary metric and the segments to check before the test starts', 'Look at every segment and report the ones that won', 'Only report p-values below 0.01']
    ans: 0
    why: 'Pre-registering one primary metric and a short list of segments keeps the number of tests small and honest. Everything else is exploration, labelled as such.'
---

**Module 6 · about 20 minutes · school maths.** You'll be able to explain why many tests produce false positives, apply Bonferroni and Holm corrections, and set up analyses that avoid the trap.

## 1. Slice it enough and something wins

A test at α = 0.05 has a 5 % false alarm rate. Run 20 independent tests where nothing is going on and the chance that **at least one** comes out significant is

```math
1 - 0.95^{20} \approx 0.64
```

That happens all the time in analytics: a test that "didn't win overall" is sliced by device, region, age, new vs returning, day of week... until one slice wins. Or a dashboard tracks 30 KPIs and flags whichever moved "significantly" this week.

<!--fig:multiple-tests-->

Every segment here is pure noise. Run a few analyses: with 20 segments, one or two bars usually cross the 0.05 line. After the Holm correction, almost none do.

## 2. Corrections

The **family-wise error rate (FWER)** is the chance of at least one false positive across a family of tests. To keep it at 5 %:

- **Bonferroni:** test each of `$m$` p-values against `$\alpha/m$` (equivalently, multiply each p by `$m$`). Simple and safe, a bit strict.
- **Holm:** sort the p-values from smallest; compare the smallest with `$\alpha/m$`, the next with `$\alpha/(m-1)$`, and so on, stopping at the first that fails. Always at least as powerful as Bonferroni, with the same guarantee. Use it by default.

When you're screening many things and can tolerate some false leads (which 50 products to look at more closely), control the **false discovery rate (FDR)** instead: the expected share of your "discoveries" that are false. The **Benjamini-Hochberg** procedure does this and is far less strict than Bonferroni.

## 3. Habits that help more than formulas

1. **Decide before you look:** one primary metric, a short list of secondary metrics and segments, written down before the test starts.
2. **Label exploration as exploration:** "In an unplanned look at 12 segments, mobile users in Quebec showed a lift (unadjusted p = 0.03). Worth a follow-up test."
3. **Replicate:** a surprising segment win becomes the hypothesis of the next test, not a shipped decision.
4. **Count the forking paths:** trying several date ranges, outlier rules or metric definitions is also multiple testing, even if you only report one.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** each test has a small chance of a false alarm; across many tests those chances pile up.

**Equations:** FWER for `$m$` independent null tests at level α: `$1 - (1-\alpha)^m$`. Bonferroni threshold `$\alpha/m$`. Holm: for sorted `$p_{(1)} \le \cdots \le p_{(m)}$`, reject while `$p_{(i)} \le \alpha/(m - i + 1)$`. Benjamini-Hochberg: find the largest `$i$` with `$p_{(i)} \le (i/m)\,\alpha$` and reject the first `$i$`.

**In code:** Python `statsmodels.stats.multitest.multipletests(pvals, method="holm")` (or `"bonferroni"`, `"fdr_bh"`).
</details>

## 4. Worked example

*Made-up numbers.* A test readout checks 5 pre-planned segments. p-values: new users 0.004, returning 0.03, mobile 0.04, desktop 0.20, tablet 0.65.

- Unadjusted, 3 look significant.
- **Bonferroni** (threshold 0.05 ÷ 5 = 0.01): only new users (0.004).
- **Holm:** sorted 0.004 vs 0.05/5 = 0.010 ✓; 0.03 vs 0.05/4 = 0.0125 ✗, stop. Only new users.
- Holm-adjusted p-values: 0.004 × 5 = 0.02; 0.03 × 4 = 0.12; 0.04 × 3 = 0.12; then 0.40 and 0.65.

Report: "The lift was clear for new users (adjusted p = 0.02). Returning and mobile users showed smaller lifts that don't survive correction for testing 5 segments."

## 5. Practice

1. 10 tests, nothing real. Chance of at least one false positive at 0.05?
2. Bonferroni threshold for 8 tests at α = 0.05?
3. Holm on p = 0.01, 0.02, 0.03 (3 tests). Which are significant at 5 %?

<details>
<summary>Answers</summary>

1. 1 − 0.95¹⁰ ≈ 40 %.
2. 0.00625.
3. 0.01 ≤ 0.05/3 = 0.0167 ✓; 0.02 ≤ 0.05/2 = 0.025 ✓; 0.03 ≤ 0.05/1 ✓. All three. (Bonferroni would keep only the first.)
</details>

**Try it on your own data:** the [[hypothesis-tests]] tool adjusts a list of p-values with Bonferroni, Holm or Benjamini-Hochberg.

**New words:** *multiple comparisons*, *family-wise error rate*, *Bonferroni correction*, *Holm correction*, *false discovery rate*, *Benjamini-Hochberg*, *pre-registration*.
