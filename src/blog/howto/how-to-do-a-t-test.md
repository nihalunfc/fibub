---
title: "How to do a t-test (two groups, with a worked example)"
summary: "Paste two columns of numbers, let the tool pick Welch's or Student's t-test, then read t, the degrees of freedom, the p-value, the confidence interval and Cohen's d."
tools: [hypothesis-tests, sample-size, effect-size-converter]
updated: 2026-11-10
sources:
  - "Welch (1947), Biometrika 34: 28-35, for the unequal-variance t-test and its degrees of freedom; Cohen (1988), Statistical Power Analysis for the Behavioral Sciences, for the d benchmarks."
  - "The quiz scores in the example are made up for this article."
---

A two-sample t-test asks whether the gap between two group means is bigger than random noise would usually give: divide the difference in means by its standard error, then compare that ratio with a t distribution to get a p-value. Paste both groups into the [[hypothesis-tests]] page and it chooses the right version, runs it and spells out what the answer means.

## What you need

- **Two groups of measured numbers**, such as reaction times, marks or plant heights, from different people or things. If the same people were measured twice, you need the paired t-test instead (the same page has it).
- **At least two values per group.** Eight or more each gives the test a fair chance of seeing a real difference; the [[sample-size|sample size and power calculator]] tells you how many you really need.
- **A decision made before you look:** are you testing for any difference (two-sided) or only for one direction (one-sided)?

## Step by step

1. Open [[hypothesis-tests]]. Under **What did you measure?** keep *Numbers*, and under **What are you comparing?** keep *Two separate groups*.
2. Leave **Roughly bell-shaped (normal)?** on *Not sure: check my data*. The page then runs a Shapiro-Wilk normality check on each group. If either group is clearly skewed and has fewer than 30 values, it switches to the Mann-Whitney U test, which works on ranks.
3. Paste your data into the box: one column per group, with the group names in the top row. Copying two columns straight from a spreadsheet works.
4. Check **Alternative** (two-sided unless you planned otherwise), the **Confidence level** for the interval, and **Significance level α**, which only changes the wording of the verdict.
5. Read the large line at the top of the results, the plain-English paragraph under it, the list of numbers and the **Assumptions** checklist. The strip chart shows every value with each group's mean and confidence interval.
6. Save the results as a CSV, or as an image, PDF or Word report.

The test behind it is Welch's t-test, the safe default because it does not assume both groups are equally spread out:

- t = (x̄₁ − x̄₂) ÷ √(s₁²/n₁ + s₂²/n₂)
- degrees of freedom ν = (s₁²/n₁ + s₂²/n₂)² ÷ [ (s₁²/n₁)²/(n₁ − 1) + (s₂²/n₂)²/(n₂ − 1) ]

Here x̄ is a group mean, s² its sample variance (dividing by n − 1) and n its size. Student's version pools the two variances and uses n₁ + n₂ − 2 degrees of freedom; pick it from the **Test** list only if you have a good reason to think the spreads match.

## A worked example

A tutor tries two ways of revising for a quiz. Eight students use spaced practice and score 68, 74, 71, 79, 65, 72, 77 and 70 %. Eight others reread their notes and score 61, 66, 70, 63, 59, 68, 64 and 62 %.

By hand:

- Means: 576 ÷ 8 = 72 % and 513 ÷ 8 = 64.125 %, a difference of 7.875 points.
- Sample variances: 21.14 and 13.55, so s²/n is 2.643 and 1.694.
- Standard error: √(2.643 + 1.694) = √4.337 = 2.083.
- t = 7.875 ÷ 2.083 = 3.781.
- Welch's degrees of freedom: 4.337² ÷ (2.643²/7 + 1.694²/7) = 13.36.

Pasted into the page, the Shapiro-Wilk checks find nothing odd (p = 0.98 and 0.95), so Welch's test is chosen. The headline reads **t(13.36) = 3.781, p = 0.002**. The 95 % confidence interval for the difference runs from 3.388 to 12.36 points, and Cohen's d is 1.891, a large effect by the usual guide (0.2 small, 0.5 medium, 0.8 large).

In words: if both methods really worked equally well, a gap this big would turn up only about 2 times in 1,000 experiments like this one. The tutor has good evidence that spaced practice scored higher, probably by somewhere between 3 and 12 points.

## Check your answer

- **The sign.** t is positive because the first column has the bigger mean. Swap the columns and t, the difference and its interval flip sign, but p stays the same.
- **The interval and p agree.** A 95 % interval that does not include 0 always goes with a two-sided p below 0.05. Here 0 lies well outside 3.4 to 12.4.
- **Degrees of freedom.** Welch's ν always lies between the smaller n − 1 (7) and n₁ + n₂ − 2 (14). Something outside that range means a typing slip.
- **Rough size.** t is about the difference over the standard error. A gap of about 8 with a standard error of about 2 should give t near 4, and it does.

## Questions people ask

**What does "statistically significant" actually mean here?** Only that p fell below the α you chose, usually 0.05. It says nothing about whether the difference matters in practice; look at the interval and the effect size for that, and convert d to other measures with the [[effect-size-converter]].

**Can I run a t-test in Excel instead?** Yes, with the T.TEST function, but it gives only the p-value. You would still need to work out the interval, the effect size and the normality checks separately.

**My p-value is 0.08. Is there no difference?** Not proven either way. A small study can miss a real effect. Report the interval, which shows the range of differences the data still allow.
