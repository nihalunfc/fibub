---
title: 'Which test when: a one-page guide'
summary: 'Pick the right statistical test in three questions: what kind of outcome, how many groups, and are they paired. A one-page table from proportions to regression, with the assumption to check and the fibub tool that runs each one.'
minutes: 15
updated: 2026-11-22
quiz:
  - q: 'Conversion (yes/no) for two independent groups. Which test?'
    choices: ['Paired t-test', 'Two-proportion z-test (or chi-square on the 2 × 2 table)', 'ANOVA']
    ans: 1
    why: 'A yes/no outcome in two independent groups is a comparison of two proportions; the z-test and the 2 × 2 chi-square are equivalent.'
  - q: 'Task time for the same 15 users on the old and new app (skewed times). Which test?'
    choices: ['Welch t-test', 'Wilcoxon signed-rank test (or a paired t-test on log times)', 'Chi-square']
    ans: 1
    why: 'Same users twice means paired; small and skewed suggests a rank test or a log transform.'
  - q: 'Average basket value across four store layouts. Which test?'
    choices: ['Four separate t-tests', 'One-way ANOVA (Welch''s version if spreads differ), then corrected pairwise comparisons', 'Spearman correlation']
    ans: 1
    why: 'Several group means: one overall test first avoids the multiple-testing problem of many pairwise t-tests.'
sources:
  - 'OpenIntro Statistics, 4th edition (Diez, Cetinkaya-Rundel, Barr) https://www.openintro.org/book/os/'
  - 'NIST/SEMATECH e-Handbook, 7 Product and Process Comparisons https://www.itl.nist.gov/div898/handbook/prc/prc.htm'
---

**Module 9 · about 15 minutes · revision.** Use this page as a cheat sheet when you have data and a question and need to know which test to run.

<div class="bigidea">Choose a test from two questions: what kind of data is the outcome, and how many groups are you comparing, paired or not.</div>

**In everyday terms:** choosing a tool from a toolbox: what material (wood, metal) and what job (cut, join). The data type is the material; the comparison is the job.

## 1. Three questions

1. **What is the outcome?** Yes/no (a proportion), a number (mean or median), counts in categories, or a relationship between two numbers.
2. **How many groups?** One (against a known value), two, or more.
3. **Paired or independent?** Paired = the same units measured twice (before/after, same customers on two versions). Independent = different units in each group.

## 2. The table

| Outcome | Groups | Design | Test | Check | Lesson |
|---|---|---|---|---|---|
| Yes/no | 1 vs a known rate | — | One-proportion z-test (exact binomial if small) | n·p ≥ 10 | 5.2 |
| Yes/no | 2 | Independent | Two-proportion z-test or chi-square 2 × 2; Fisher's exact if counts are small | Expected counts ≥ 5 | 7.5 |
| Yes/no | 2 | Paired | McNemar's test | Count of discordant pairs | 6.5 |
| Categories | 1 vs expected shares | — | Chi-square goodness of fit | Expected counts ≥ 5 | 6.5, 7.6 |
| Categories | 2 or more | Independent | Chi-square test of independence; Cramér's V for strength | Expected counts ≥ 5 | 6.5 |
| Number | 1 vs a known value | — | One-sample t-test | Roughly normal, or n ≥ 30 | 6.3 |
| Number | 2 | Independent | Welch's t-test; Mann-Whitney if small and skewed; bootstrap for medians | Outliers, skew | 6.3, 6.7 |
| Number | 2 | Paired | Paired t-test; Wilcoxon signed-rank if skewed | Differences roughly normal | 6.3, 6.7 |
| Number | 3 or more | Independent | One-way ANOVA (Welch's if spreads differ); Kruskal-Wallis if skewed | Similar spreads | 6.6, 6.7 |
| Two numbers | — | — | Pearson correlation; Spearman if curved or outliers | Scatter plot first | 8.1 |
| Number from inputs | — | — | Linear regression | Residual plots | 8.2 |
| KPI over time | — | — | Control chart; compare same period last year | Stable baseline | 8.4, 8.6 |

<!--fig:effect-size-->

Whatever the test, report the **effect size and its interval** next to the p-value: the figure above shows how even a trivial effect becomes "significant" once the sample is big enough.

## 3. Rules of thumb

- **Default to Welch** over the classic equal-variance t-test; it loses almost nothing when variances are equal.
- **Big samples are forgiving:** with hundreds per group, t-tests work even for skewed data (central limit theorem), but medians may still describe the data better.
- **Many groups or metrics:** correct for multiple testing (Holm, Benjamini-Hochberg), or pick one primary in advance.
- **Time-ordered data** violates independence; compare whole periods or use methods for time series.
- **When unsure, bootstrap:** resampling by unit works for medians, ratios and odd statistics.
- **A test is not a decision:** the decision rule, set in advance, decides; the test feeds it.

<div class="meaning">

<dl>
<dt>Yes/no outcome, 2 groups</dt><dd>Two-proportion z-test or chi-square.</dd>
<dt>Number, 2 independent groups</dt><dd>Welch t-test; Mann-Whitney if very skewed or small.</dd>
<dt>Number, same units twice</dt><dd>Paired t-test; Wilcoxon signed-rank if skewed.</dd>
<dt>Number, 3+ groups</dt><dd>ANOVA; Kruskal-Wallis if skewed.</dd>
<dt>Categories × categories</dt><dd>Chi-square test of independence.</dd>
<dt>Physical meaning</dt><dd>Every test is the same idea in a different shape: (what you saw − what "no effect" predicts) ÷ how much it wobbles. Picking a test is picking the right way to measure the wobble for your data.</dd>
</dl>

</div>

<div class="myth">

**"Use whichever test gives the smallest p-value."** Picking the test after seeing results is p-hacking. Choose it from the data type and design, ideally in the plan.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>Question.</b> Did the new layout change average basket size in 40 stores, measured before and after?</div>
<div class="step"><b>Outcome type.</b> A number (dollars).</div>
<div class="step"><b>Design.</b> The same stores twice: paired.</div>
<div class="step"><b>Shape.</b> Differences look roughly symmetric, no wild outliers.</div>
<div class="step"><b>Choice.</b> Paired t-test on the 40 differences (Wilcoxon signed-rank as a check).</div>
</div>

<div class="problem" data-problem="which-test-df"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** almost every test has the same shape: (estimate − value under the null) ÷ standard error, compared with a known distribution.

```math
\text{test statistic} = \frac{\text{estimate} - \text{null value}}{\text{SE}}
```

z and t for means and proportions; chi-square adds up squared standardised gaps across cells; F compares the spread between groups with the spread within them. Learn the shape once and the table becomes a list of SE formulas.
</details>

## 4. Worked example

*Made-up questions from one week as an analyst:*

| Question | Outcome, groups, design | Test |
|---|---|---|
| Did the new email subject raise open rate? | Yes/no, 2, independent | Two-proportion z-test |
| Are returns related to product category? | Categories × categories | Chi-square of independence |
| Did staff training cut handling time for the same 20 agents? | Number, 2, paired | Paired t-test (Wilcoxon if skewed) |
| Do three regions differ in average order value? | Number, 3, independent | Welch's ANOVA on (capped) order value |
| Is delivery distance related to rating? | Two numbers, ordinal rating | Spearman correlation |
| Did the 50/50 split hold? | Counts vs expected | Chi-square goodness of fit, alarm at p < 0.001 |

## 5. Practice

1. Did more customers renew after a price change? Same customers, renewal yes/no in two years.
2. Satisfaction rated 1 to 5 for two independent groups of 40.
3. Hourly sales vs temperature over a summer.

<details>
<summary>Answers</summary>

1. Paired yes/no: McNemar's test (but a before/after has no control group; seasonality or other changes could explain it).
2. Ordinal ratings, two independent groups: Mann-Whitney (a t-test is often used too, with 40 per group; say which and why).
3. Correlation (Spearman if curved), remembering autocorrelation in hourly data makes the p-value too optimistic.
</details>

**Try it on your own data:** the [[hypothesis-tests]] tool runs most of the tests in the table; [[crosstab-chi-square]] covers categories; [[bootstrap-permutation]] covers anything with resampling; [[regression-workbench]] covers relationships.

**New words:** *paired design*, *McNemar's test*, *Kruskal-Wallis test*, *Welch's ANOVA*.

<div class="keypoints">

- Start from the outcome type: yes/no, number, category.
- Then the design: 2 groups, 3+ groups, or the same units twice.
- Skewed or small samples: rank-based versions.
- Choose the test before you see the results.

</div>
