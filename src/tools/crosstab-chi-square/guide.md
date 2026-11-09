---
name: Cross-tab and chi-square
num: 747
shelf: science
section: sociology-and-survey-research
title: "Cross-tab and chi-square test calculator with weights, Cramér's V and Fisher's exact test (free)"
summary: "Turn raw survey answers into a cross-tabulation with row, column and total percentages, then test it: Pearson chi-square, likelihood-ratio G², Cramér's V, adjusted residuals, Fisher's exact test for 2 × 2, and a design-effect correction for weighted data. Matches scipy."
status: live
ads: true
order: 747
icon: table
works: offline
updated: 2026-11-09
related: [sample-size, reliability-analysis, data-cleaner, sql-playground]
sources:
  - "Formulas: Pearson (1900), the likelihood-ratio G² test, Cramér (1946), Haberman (1973) adjusted residuals, Fisher (1922) exact test, Yates (1934) correction, Kish (1965) design effect for weights, and the first-order idea of Rao and Scott (1981). Example data made up."
flow:
  - { icon: table, label: "Your survey" }
  - { icon: sliders, label: "Pick 2 items" }
  - { icon: percent, label: "Cross-tab" }
  - { icon: sigma, label: "χ² test" }
---

## What it does

A cross-tabulation shows how the answers to one survey question are spread across the answers to another: for example, how people of different ages travel to work. This tool builds the table from your raw data (one row per respondent) and tests whether the two questions are related:

- **Counts and percentages**: row %, column % or total %, with totals.
- **Pearson chi-square** and the **likelihood-ratio G²** test of independence, with degrees of freedom and p-values.
- **Cramér's V**, the strength of the relationship from 0 (none) to 1.
- **Adjusted standardised residuals** for every cell, marked when beyond ±1.96, so you can see which combinations are more or less common than chance.
- For **2 × 2 tables**: Yates' continuity correction, **Fisher's exact test** and the odds ratio.
- **Survey weights**: weighted counts and percentages, and a chi-square corrected for the design effect of the weights.

## How to use it

1. Paste your data or open a CSV or Excel file: one row per respondent, one column per question, with a header row.
2. Choose the question for the **rows** and the one for the **columns**. Columns with 2 to 50 different answers are offered.
3. If your data has a weight column, choose it under **Weight**.
4. Switch between row %, column %, total % and counts only. Download the table as CSV, or the full report as an image, PDF or Word file.

Rows with a blank answer in either question are left out and the tool says how many.

## Weighted data, explained

With weights, simply running the chi-square on the weighted counts is wrong: the weighted total is not the number of people asked, and unequal weights make estimates less precise. This tool uses a simple, clearly stated correction in the spirit of Rao and Scott's first-order adjustment. It computes the chi-square from the weighted shares as if they came from the actual number of respondents, then divides it by Kish's design effect of the weights, deff = n Σw² / (Σw)². This handles unequal weights only. If your survey also has clusters or strata, use survey software with the full Rao-Scott correction.

## Worked example (made-up data)

The sample is a made-up survey of 240 people: age group, region, main way of getting to work and a weight. Two people did not answer the transport question, so 238 are used. Age group by transport gives Pearson χ² = 22.455 with 4 degrees of freedom, p = 0.0002, G² = 24.223, and Cramér's V = 0.217. The residuals show that people aged 18 to 34 use the bus or train more than expected (adjusted residual +3.91) and those 55 and over use it less (−3.79).

With the **weight** column, the design effect is 1.208 (an effective sample of about 197), and the design-adjusted χ² is 19.205, p = 0.0007.

For a 2 × 2 table such as [[3, 1], [1, 3]], Fisher's exact two-sided p is 0.486 and the odds ratio 9.

## How it was checked

Counts, expected counts, Pearson χ² (with and without Yates' correction), G², Cramér's V and Fisher's exact test (two-sided and one-sided, and the odds ratio) agree with scipy, and the Pearson and adjusted residuals with statsmodels, to at least nine significant figures. The weighted correction matches an independent numpy calculation.

## Frequently asked questions

**When should I use Fisher's exact test?** When any expected count in a 2 × 2 table is below 5; the tool warns you. For bigger tables with small cells, merge categories.

**What is a big Cramér's V?** It depends on the table size. The tool labels it negligible, small, medium or large using Cohen's guidelines adjusted for the number of categories.

**Is my survey data uploaded?** No. Everything runs in your browser and works offline.
