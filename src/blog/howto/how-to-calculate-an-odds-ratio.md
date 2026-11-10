---
title: "How to calculate an odds ratio and its 95% confidence interval"
summary: "Lay out a 2 × 2 table, multiply across the diagonals (ad ÷ bc), then build the interval on the log scale. A worked case-control example, and how to read the answer."
tools: [odds-risk-ratio, nnt-calculator, diagnostic-test-calculator]
updated: 2026-11-10
sources:
  - "Woolf (1955), Annals of Human Genetics 19: 251-253, for the log-scale interval of the odds ratio; Rothman, Greenland and Lash, Modern Epidemiology, 3rd ed., for exact and mid-p limits."
  - "The case-control counts in the example are made up for this article."
---

To get an odds ratio, put your counts in a 2 × 2 table with exposed cases a, exposed controls b, unexposed cases c and unexposed controls d, then work out OR = (a × d) ÷ (b × c). The [[odds-risk-ratio]] calculator does this from the four counts and adds three kinds of confidence interval plus the matching tests. For general study and teaching only, not medical advice.

## What you need

- **Four whole-number counts**: how many people with and without the outcome were exposed or not. Percentages will not work.
- **To know your study design.** In a *case-control* study people were picked because they had the outcome (cases) or did not (controls), so only the odds ratio is meaningful. In a *cohort* or *trial* people were grouped by exposure and followed up, so the risk ratio can be used too.
- A confidence level, normally 95 %.

## Step by step

1. Open [[odds-risk-ratio]] and keep **One table** selected.
2. Set **Study design** to *Case-control* or *Cohort or trial*. With a cohort the column headings change to *Ill (event)* and *Well (no event)*, and risks appear in the results.
3. Type the four counts into the grid: the **Exposed** row first, then **Unexposed**, with cases (or ill) on the left.
4. Choose the **Confidence** level.
5. Read the headline OR with its interval, the **Ratios** table (Woolf, exact and mid-p estimates) and the **Tests of no association** table (Pearson chi-square, the Yates-corrected version, Fisher's exact test and the mid-p test). A note appears if any expected count is below 5.
6. Download the results as CSV, or a report as an image, PDF or Word file.

The arithmetic behind the headline numbers:

- OR = (a × d) ÷ (b × c), which is the same as (a ÷ c) ÷ (b ÷ d): the odds of exposure among cases divided by the odds among controls.
- Standard error on the log scale: SE = √(1/a + 1/b + 1/c + 1/d)
- 95 % interval: exp( ln OR − 1.96 × SE ) to exp( ln OR + 1.96 × SE )

The interval is built on the log scale because the OR cannot fall below 0 and its sampling spread is lopsided; on the log scale it is close to symmetric.

## A worked example

A made-up case-control study looks at whether regular night-shift work is linked to a sleep disorder. It recruits 50 people with the disorder and 150 without, then asks about their shifts.

| | Cases (disorder) | Controls (none) |
|---|---|---|
| Night shifts | a = 30 | b = 45 |
| No night shifts | c = 20 | d = 105 |

Working it through:

- Odds of night shifts among cases: 30 ÷ 20 = 1.5. Among controls: 45 ÷ 105 = 0.429.
- OR = (30 × 105) ÷ (45 × 20) = 3,150 ÷ 900 = 3.5.
- ln 3.5 = 1.253. SE = √(1/30 + 1/45 + 1/20 + 1/105) = 0.339.
- Limits: exp(1.253 − 1.96 × 0.339) = 1.80 and exp(1.253 + 1.96 × 0.339) = 6.80.

The calculator shows **OR 3.50 (1.80 to 6.80)**. Its exact estimate is a touch lower, 3.48 with limits 1.71 to 7.21, and the mid-p interval is 1.79 to 6.85. Pearson's chi-square is 14.400 and both chi-square and Fisher's exact test give p < 0.001.

How to say it: people with the disorder had 3.5 times the odds of working night shifts compared with people without it, and the data are compatible with an odds ratio anywhere from about 1.8 to 6.8. That is a link, not proof that shifts cause the disorder.

## Check your answer

- **The interval must contain the estimate**, and on a log scale it sits evenly around it: 3.5 ÷ 1.80 and 6.80 ÷ 3.5 both come to about 1.94.
- **Interval against 1.** An OR of 1 means no link. Here the whole interval is above 1, which matches the small p-values.
- **Flip the table.** Swap the rows (exposed and unexposed) and you should get 1 ÷ 3.5 = 0.286, with the limits flipped the same way.

## Questions people ask

**What is the difference between an odds ratio and a risk ratio?** Risk is events out of everyone in a group; odds is events against non-events. When the outcome is rare (under about 10 %) the two are close. When it is common the OR is further from 1, so do not describe an OR as "times as likely". In a cohort with these counts the risk ratio would be 2.5, not 3.5.

**What if one of the cells is zero?** Then ad ÷ bc is 0 or infinite and the log interval breaks down. Use the exact interval, which the calculator still gives.

**Can I adjust for a confounder such as age?** Yes: switch to **Strata (Mantel-Haenszel)** and paste one row of four counts per age group. To turn a risk difference from a trial into patients per benefit, use the [[nnt-calculator]]; for a test's sensitivity and specificity, the [[diagnostic-test-calculator]].
