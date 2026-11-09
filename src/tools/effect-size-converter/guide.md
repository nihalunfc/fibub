---
name: Effect size converter
num: 565
shelf: science
section: statistics
title: "Effect size converter: Cohen's d, Hedges' g, r, odds ratio, eta squared, Cohen's f, Cliff's delta"
summary: "Convert between Cohen's d, Hedges' g, r, odds ratios, eta squared, omega squared, Cohen's f and w and Cliff's delta, or work them out from a t, F or chi-square statistic and the sample sizes. With confidence intervals and size labels."
status: live
ads: true
order: 565
icon: convert
works: offline
updated: 2026-11-09
related: [hypothesis-tests, sample-size, reliability-analysis, uncertainty-calculator]
sources:
  - "Formulas: Borenstein, Hedges, Higgins and Rothstein (2009), Introduction to Meta-Analysis; Lakens (2013), Frontiers in Psychology 4:863; McGraw and Wong (1992) for the common-language effect size."
flow:
  - { icon: pencil, label: "Your value" }
  - { icon: convert, label: "Convert" }
  - { icon: table, label: "All sizes" }
---

## What it does

Papers report effects in many ways: a t or F statistic, Cohen's d, a correlation, an odds ratio or eta squared. To compare studies, pool them in a meta-analysis or plan a sample size, you need them on one scale. Type what you have and this tool shows every effect size it can be converted to, with confidence intervals where a standard one exists and a rough size label for each.

## How to use it

1. Pick what you are starting from in **Start from**.
2. Type its value and the boxes that appear. Group sizes give intervals and make the conversions exact; a paired t test needs the number of pairs; an F test needs both degrees of freedom; a chi-square needs the total N.
3. Read the table. Each row shows the value, its interval, a size label and how it was worked out. Download the table as a CSV, or the report as an image, PDF or Word file.

## The conversions

- **From t:** d = t √(1/n1 + 1/n2) for two separate groups; dz = t / √n for paired data (the change measured against the spread of the changes, which is not the same scale as d).
- **d and r:** r = d / √(d² + a). With group sizes, a = N(N − 2)/(n1 n2), so r is exactly the point-biserial correlation t / √(t² + df); without them a = 4, the value for equal groups.
- **d and odds ratios:** ln OR = d π / √3, the logistic approximation (Hasselblad and Hedges). It assumes the yes/no outcome comes from cutting a continuous, roughly logistic scale.
- **Hedges' g** = d × J, where J is the exact small-sample correction Γ(df/2) / (√(df/2) Γ((df − 1)/2)).
- **From F:** partial η² = F df1 / (F df1 + df2), partial ω² = df1 (F − 1) / (df1 (F − 1) + N) and Cohen's f = √(η² / (1 − η²)). With df1 = 1 (two groups) d follows too.
- **From chi-square:** Cohen's w = √(χ²/N) and Cramér's V = w / √(m − 1), where m is the smaller side of the table. For a 2 × 2 table w is phi, used as r.
- **Cliff's delta, probability of superiority, U3, overlap and NNT** come from d assuming two normal groups with the same spread: δ = 2Φ(d/√2) − 1.

The interval for d uses the usual standard error √((n1 + n2)/(n1 n2) + d²/(2(n1 + n2))); r uses Fisher's z when you start from r. Intervals are carried through each conversion.

## Worked example

A study reports t(43) = 2.5 with groups of 20 and 25. The tool gives d = 0.75 (95 % CI 0.1419 to 1.358), Hedges' g = 0.7368, r = 0.3562, an odds ratio of 3.898 and η² = 0.1269: a medium-to-large effect by Cohen's guide. Starting instead from F(2, 27) = 5.2 gives partial η² = 0.2781, partial ω² = 0.2188 and Cohen's f = 0.6206.

## Limits

Conversions between families (for example d to an odds ratio) rest on the assumptions above and are approximations. A chi-square with more than 1 degree of freedom, or an F with df1 above 1, cannot be turned into a single d. Intervals for eta squared from F need the noncentral F distribution and are not given. Signs cannot be recovered from F or chi-square: set them from the direction of the effect.

## Frequently asked questions

**Which should I report?** The one that fits your analysis (d or g for two means, r for correlations, odds ratios for yes/no outcomes, η² or ω² for ANOVA), with its confidence interval.

**Are Cohen's labels reliable?** They are rough. A "small" effect can matter a lot in medicine or education; compare with typical effects in your own field.

**Is anything sent anywhere?** No. Everything is worked out in your browser.

Run the test itself with the [hypothesis test chooser and runner](/science/hypothesis-tests/).
