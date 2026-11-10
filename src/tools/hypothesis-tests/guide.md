---
name: Hypothesis tests
num: 560
shelf: science
section: statistics
title: "Hypothesis tests"
summary: "Answer three questions and the right test is picked for you, then run it on your pasted data: t tests (one-sample, Welch, Student, paired), ANOVA with Tukey HSD, chi-square, Fisher's exact, Mann-Whitney, Wilcoxon, Kruskal-Wallis and Shapiro-Wilk. Plain-English results, effect sizes and assumption checks. Matches scipy."
status: live
ads: true
order: 560
icon: sigma
works: offline
updated: 2026-11-09
related: [sample-size, effect-size-converter, bootstrap-permutation, distribution-explorer, regression-workbench, plot-maker, data-cleaner, reliability-analysis, uncertainty-calculator, bayesian-ab-test]
sources:
  - "Methods as in scipy.stats and statsmodels; Shapiro-Wilk by Royston (1995); Tukey HSD with the studentized range distribution. Example data made up."
flow:
  - { icon: target, label: "Choose test" }
  - { icon: table, label: "Paste data" }
  - { icon: sigma, label: "Run test" }
  - { icon: check, label: "Read result" }
---

## What it does

Picking the right statistical test is often harder than running it. This tool asks what you measured and what you are comparing, picks the test, runs it on your data and tells you in plain words what the result means, how big the effect is and whether the test's assumptions hold. Everything runs in your browser; your data never leave the page.

Tests included:

- **t tests:** one-sample, two separate groups (Welch's, or Student's when the spreads are equal) and paired.
- **One-way ANOVA** for three or more groups, with **Tukey's HSD** to find which pairs differ.
- **Chi-square** goodness of fit and test of independence, and **Fisher's exact test** for 2 × 2 tables.
- Rank-based tests that do not need normal data: **Mann-Whitney U**, **Wilcoxon signed-rank** (one group or paired) and **Kruskal-Wallis**.
- **Shapiro-Wilk** to check whether data look normal, with a Q-Q plot.

Plan how many samples you need with the [[sample-size|sample size calculator]] before you start, and report how big the difference is with the [[effect-size-converter]].

## How to use it

1. **Choose the test.** Say whether you measured numbers or counted things in categories, what you are comparing, and whether the numbers are roughly bell-shaped. If you are not sure, leave "Not sure: check my data": the tool runs Shapiro-Wilk on each group and picks the rank-based test if any group is clearly not normal (unless every group has 30 or more values, where means behave normally anyway). You can always pick a test yourself from the Test list; the tool says if your answers point elsewhere.
2. **Paste your data** from a spreadsheet, or open a CSV, TSV or Excel file. Groups go in columns with their names in the first row, or as two columns of group name and value. Paired data go as two columns, one row per subject. Counts go as a table.
3. **Options.** "Alternative" chooses a two-sided test (any difference) or a one-sided one, decided before you look at the data. The confidence level sets the width of the intervals. The significance level α is only used to word the result.
4. Read the result, the effect sizes, the tables and the assumption checks, then download a CSV or an image, PDF or Word report.

## What the numbers mean

- **p-value:** how often results at least this extreme would occur if there were really no effect. A small p-value is evidence against "no effect"; a large one is not proof of no effect.
- **Effect sizes** say how big the difference is, which the p-value does not. Cohen's d (and Hedges' g, slightly smaller to remove bias) for t tests: about 0.2 small, 0.5 medium, 0.8 large. η² and ω² for ANOVA (0.01, 0.06, 0.14). Rank-biserial r for rank tests and Cohen's w or Cramér's V for chi-square (0.1, 0.3, 0.5). The interval for d is the usual large-sample approximation.
- **Tukey HSD** compares every pair of groups with intervals that hold for the whole family of comparisons together.

## Worked example

The two-group example compares a made-up control (mean 20.98) with a fertiliser group (mean 24.47), ten plants each. Shapiro-Wilk finds both groups normal (p = 0.71 and 0.96), so Welch's t test is chosen: t(17.54) = −5.119, p < 0.001, a difference of −3.49 (95 % CI −4.925 to −2.055) and Cohen's d = −2.289, a large effect.

Choose "Three or more separate groups" for the diet example: F(2, 20) = 33.88, p < 0.001, η² = 0.7721. Tukey's HSD finds Diet B and Diet C both differ from Diet A, but B and C do not differ from each other (p = 0.059). The chi-square table example gives χ²(2) = 15.8, p < 0.001, Cramér's V = 0.3975.

## Limits

This is a one-factor tool: no two-way ANOVA, repeated-measures ANOVA, regression or post-hoc tests after Kruskal-Wallis (compare pairs with Mann-Whitney and a Bonferroni correction). Fisher's exact test is for 2 × 2 tables only. The exact Mann-Whitney and Wilcoxon p-values are used when there are no ties and 50 or fewer values per group; otherwise the normal approximation, as scipy does.

## Frequently asked questions

**Welch or Student?** Welch's t test is the safer default: it does not assume the two groups have the same spread and loses almost nothing when they do.

**Do the results match other software?** Yes. Every test was checked against scipy.stats, and Tukey's HSD against statsmodels, to at least six significant figures.

**Is my data sent anywhere?** No. Nothing is uploaded or stored, and the page keeps working offline.

Plan how many subjects you need with the [sample size and power calculator](/science/sample-size/).
