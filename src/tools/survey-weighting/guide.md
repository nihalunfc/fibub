---
name: Survey weighting calculator (raking and post-stratification)
num: 494
shelf: science
section: public-health
title: "Survey weighting calculator: raking, post-stratification, design effect and effective sample size"
summary: "Weight survey respondents to match population figures for up to three variables by post-stratification or raking (iterative proportional fitting), starting from design weights if you have them. Get the weights, weighted percentages, Kish's design effect and the effective sample size."
status: live
ads: false
order: 34
icon: table
works: offline
updated: 2026-11-09
related: [sample-size, daly-qaly, herd-immunity, plot-maker, reliability-analysis]
sources:
  - "Raking (iterative proportional fitting): Deming and Stephan (1940), Annals of Mathematical Statistics 11: 427-444; as calibration: Deville and Särndal (1992), Journal of the American Statistical Association 87: 376-382."
  - "Post-stratification: Holt and Smith (1979), Journal of the Royal Statistical Society A 142: 33-46."
  - "Design effect from unequal weights: Kish (1965), Survey Sampling, Wiley; Kish (1992), Journal of Official Statistics 8: 183-200."
  - "Example respondents and population figures are made up."
flow:
  - { icon: table, label: "Respondents" }
  - { icon: target, label: "Population" }
  - { icon: sliders, label: "Rake" }
  - { icon: download, label: "Weights" }
---

## What it does

Surveys rarely reach people in the same mix as the population: more women than men may answer, or too few young people. **Weighting** counts under-represented respondents a bit more and over-represented ones a bit less, so the weighted sample matches known population figures. This tool:

- starts from **design weights** (or selection probabilities) if your sample design had them,
- **post-stratifies** to one variable, or **rakes** to two or three variables at once,
- shows **weighted percentages** for every column, next to the plain sample percentages and the population targets,
- gives **Kish's design effect** and the **effective sample size**, which tell you how much precision the weighting costs,
- downloads your data with a weight column as CSV.

Everything runs in your browser: your respondents never leave your device.

Plan how many people to ask with the [[sample-size|sample size calculator]], and check a questionnaire scale with [[reliability-analysis|reliability and agreement]].

## How to use it

1. Paste the respondent table with a header row, or open a CSV or Excel file. One row per respondent.
2. If your sample design gave people different chances of selection, choose the **design weight column** and say whether it holds weights or selection probabilities (weight = 1/p).
3. Choose the **method** and up to three **variables**. For each, type the population figure for every category, as counts or per cent: "Female, 51 %". Choosing a variable lists its categories for you.
4. Choose whether the weights add up to the **sample size** (handy for percentages) or to the **population size** (so weighted counts estimate population totals).

Every category in the data must have a population figure, and every category with a population figure must have at least one respondent. Merge small categories if not.

## The methods

**Post-stratification** multiplies each respondent's weight by (population share × total) ÷ (current weighted total of their group), in one step. **Raking** does this for each variable in turn and repeats until every weighted share matches its population share to within 10⁻¹³ (Deming and Stephan, 1940). The result is the raking-ratio calibration estimator of Deville and Särndal (1992). With one variable, raking and post-stratification give the same weights.

**Design effect** (Kish): deff = n Σw² ÷ (Σw)² = 1 + CV², the factor by which unequal weights inflate the variance of a mean. **Effective sample size** = (Σw)² ÷ Σw² = n ÷ deff.

## Worked example

The page opens with 40 made-up respondents (27 women, 13 men) raked to made-up figures: 51 % female, age 30 / 35 / 35 %, and 40 % North. Raking settles in 14 rounds. The **design effect is 1.258** and the **effective sample size is 31.8** out of 40. The weights run from 0.4816 to 2.177. The share who smoke moves from 27.5 % unweighted to **28.4 %** weighted. Switch to post-stratification and only sex is used: the women's weight is 0.7556 and the men's 1.508, with a design effect of 1.124.

## Tips

- A design effect much above 2, or a largest weight more than 10 times the smallest, means a few people count a lot. Merge small categories or use fewer variables.
- Raking matches each variable's total, not every combination: the share of young women is not forced to match.
- Population figures from a census or official statistics carry their own date and source; check the official source.

## Frequently asked questions

**Were the weights checked?** Yes: against a separate raking routine written with NumPy and pandas, and against the calibration equations solved with SciPy, to better than one part in a billion.

**Is my data stored or uploaded?** No. Nothing leaves your browser.
