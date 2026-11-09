---
name: Reliability and agreement
num: 40
shelf: science
section: psychology-and-psychometrics
title: "Cronbach's alpha, Cohen's kappa, Fleiss' kappa and ICC calculator (free)"
summary: "Check a questionnaire scale with Cronbach's alpha and item statistics, or rater agreement with Cohen's kappa (weighted too), Fleiss' kappa and all six intraclass correlations with 95 % intervals. Matches R's psych package."
status: live
ads: true
order: 10
icon: check
works: offline
updated: 2026-11-08
related: [sample-size, uncertainty-calculator, sql-playground, plot-maker]
sources:
  - "Formulas: Cronbach (1951), Cohen (1960), Fleiss (1971), Shrout and Fleiss (1979)."
flow:
  - { icon: table, label: "Paste data" }
  - { icon: sigma, label: "Alpha/kappa" }
  - { icon: download, label: "Report" }
---

## What it does

Before you trust a questionnaire score or a set of ratings, reviewers will ask how reliable it is. This tool covers the four checks that come up most: **Cronbach's alpha** for the items of a scale, **Cohen's kappa** for two raters sorting things into categories, **Fleiss' kappa** for three or more raters, and the **intraclass correlation (ICC)** for numeric scores. Paste your data from a spreadsheet and the result, its confidence interval and a plain reading appear straight away. Nothing is uploaded.

To plan how many people to survey, use the [[sample-size]]; to explore the answers with SQL, the [[sql-playground]].

## How to use it

1. Pick what you are checking with the buttons at the top.
2. **Scale items:** one row per respondent and one column per item. Name any negatively worded items under "Reverse-scored items", by column name or number. They are scored as (lowest + highest) − score, so on a 1 to 5 scale a 2 becomes a 4.
3. **Two raters:** paste either a table of counts (rater 1 down the side, rater 2 across the top) or two columns of ratings with one row per subject. For ordered categories, choose linear or quadratic weights.
4. **Many raters:** one row per subject, either as counts per category or as one column per rater.
5. **Scores (ICC):** one row per subject and one column per rater or repeat measurement.
6. Download the result as PNG, PDF or Word.

## What the numbers mean

- **Alpha** shows how well the items hang together. Each item's **item-rest correlation** (with the total of the other items) and **alpha if deleted** point to items that do not fit. A negative item-rest correlation usually means a reversed item has not been reverse scored. The 95 % interval uses Feldt's method.
- **Kappa** is agreement beyond chance: 0 is chance level and 1 is perfect. The tool shows the Landis and Koch label (slight, fair, moderate, substantial, almost perfect) and the plain percentage agreement too.
- **ICC** comes in six forms (Shrout and Fleiss 1979). Use ICC(2,1) when your raters stand for raters in general and the scores themselves must match, ICC(3,1) when only the ranking matters for these particular raters, and ICC(1,1) when each subject was rated by different people. The "k" forms are for the average of all raters. Intervals and F tests follow McGraw and Wong (1996).

## Worked examples

**Scale:** the sample is twelve people answering five items, where Q4 is worded the other way. With Q4 reversed, alpha is 0.744 (95 % interval 0.410 to 0.916). Q5 has an item-rest correlation of −0.342, and alpha rises to 0.923 without it, so Q5 should be checked.

**Two raters:** 50 subjects, with both raters saying yes for 20 and no for 15. Observed agreement is 70 % against 50 % by chance, so kappa is 0.400, fair agreement.

**Many raters:** the classic example of 14 raters sorting 10 subjects into 5 categories gives Fleiss' kappa = 0.210.

**ICC:** Shrout and Fleiss's own data (6 subjects, 4 judges) gives ICC(1,1) = 0.166, ICC(2,1) = 0.290 (95 % interval 0.019 to 0.761), ICC(3,1) = 0.715, ICC(1,4) = 0.443, ICC(2,4) = 0.620 and ICC(3,4) = 0.909, the same as R's psych package.

## Frequently asked questions

**Is a high alpha always good?** No. Above about 0.95 often means items say the same thing in different words. Alpha also grows with the number of items, so a long scale can score high without measuring one thing.

**What about missing answers?** Rows with a blank cell are left out of alpha and ICC, and the tool says how many. Fleiss' kappa needs the same number of ratings for each subject.

**Is my data sent anywhere?** No. Everything runs in your browser and the page keeps working offline.
