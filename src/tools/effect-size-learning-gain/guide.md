---
name: Learning gain
num: 765
shelf: science
code: T533
section: education-research
title: "Learning gain"
summary: "Work out Cohen's d, Hedges' g and Glass's delta with exact confidence intervals, paired effect sizes dz and dav for before-and-after studies, and Hake's normalised learning gain, from summary numbers or raw scores."
status: live
ads: true
order: 765
icon: sigma
works: offline
updated: 2026-11-09
related: [sample-size, reliability-analysis, uncertainty-calculator, plot-maker, rubric-grade-calculator, effect-size-converter, meta-analysis, hypothesis-tests, item-analysis]
sources:
  - "Formulas: Cohen (1988); Hedges (1981) small-sample correction and Hedges and Olkin (1985); Glass (1976); Lakens (2013) dz and dav; Borenstein et al. (2009) repeated-measures variance; noncentral t intervals (Steiger and Fouladi 1997) with Lenth's (1989) algorithm; Hake (1998) normalised gain."
  - "Example numbers: made up for this page."
flow:
  - { icon: pencil, label: "Enter" }
  - { icon: sigma, label: "Effect" }
  - { icon: chart, label: "Interval" }
  - { icon: download, label: "Report" }
---

## What it does

A p-value tells you whether a difference is likely to be real; an **effect size** tells you how big it is, in a way you can compare across studies. Journals in education and psychology ask for both. This calculator covers the effect sizes teachers and education researchers use most:

- **Two groups** (for example, two classes taught differently): **Cohen's d**, **Hedges' g** (d corrected for small samples) and **Glass's delta** (the difference divided by the control group's SD).
- **Before and after** on the same people: **dz** (the mean change divided by the SD of the changes) and **dav** (the mean change divided by the average of the two SDs), plus their small-sample corrected versions.
- **Learning gain**: **Hake's normalised gain**, both the class-average gain ⟨g⟩ and the average of each student's own gain.

Confidence intervals for d, g and dz are exact, found from the **noncentral t distribution**; they match Python's scipy to many decimal places. Nothing you type is sent anywhere.

Convert between effect size measures with the [[effect-size-converter|effect size converter]], and combine several studies in a [[meta-analysis|meta-analysis]].

## How to use it

1. Choose **Two groups**, **Before and after** or **Learning gain**.
2. Type the means, standard deviations and sizes from your report or spreadsheet, or switch to **Raw scores** and paste two columns.
3. For before-and-after summaries, give the correlation between the two measurements, or the SD of each person's change (it is then used instead).
4. For learning gain, set the **maximum score** of the test.
5. Pick a 90, 95 or 99 % confidence level, and download the results as CSV, image, PDF or Word.

## Worked example

**Two groups** (made up): a new method gives a mean of 78.4 (SD 9.6, n 24), the usual one 72.1 (SD 10.8, n 26). Cohen's d is 0.615, 95 % interval 0.044 to 1.180, and Hedges' g is 0.605 (0.043 to 1.162): a medium effect, but the interval is wide. The t test gives t(48) = 2.173, p = 0.035. Glass's delta is 0.583.

**Before and after**: 20 students go from 61.2 (SD 12.4) to 68.9 (SD 11.7), with r = 0.72 between the tests. dz is 0.852 (0.329 to 1.358) and dav is 0.639.

**Learning gain**: 10 students on a 25-mark test have a pre-test mean of 13.7 and a post-test mean of 16.7, so ⟨g⟩ = (16.7 − 13.7) / (25 − 13.7) = 0.265, a low gain. The average of individual gains is 0.279.

## Which one should I report?

- For two groups, report **Hedges' g** with its interval. Use Glass's delta when the treatment might change the spread of scores.
- For before-and-after, **dav** is comparable with two-group studies; **dz** goes with the paired t test and is usually larger when the two measurements are strongly correlated.
- Hake's gain is common in physics and science education with concept inventories. Report which of the two averages you used.
- Cohen's 0.2, 0.5 and 0.8 are rough labels. In education, an effect of 0.2 can matter a lot.

## Frequently asked questions

**Why are some intervals marked approximate?** Glass's delta and dav have no exact interval; they use standard normal approximations.

**What about very large studies?** When the noncentrality is very large (above 36), the calculator uses a normal approximation to the noncentral t, which is accurate to about 0.01 in probability.

**Is my data sent anywhere?** No. Everything runs in your browser and the page keeps working offline.
