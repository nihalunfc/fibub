---
title: "How to do a chi-square test of independence (with an example)"
summary: "Put your counts in a table, work out the count you would expect in each cell if the two variables were unrelated, add up (O − E)²/E and read the p-value. Worked example included."
tools: [hypothesis-tests, crosstab-chi-square, sample-size]
updated: 2026-11-10
sources:
  - "Pearson (1900), Philosophical Magazine 50: 157-175, for the chi-square statistic; Cramér (1946), Mathematical Methods of Statistics, for V; Agresti (2013), Categorical Data Analysis, 3rd ed., for adjusted residuals."
  - "The study-place survey counts in the example are made up for this article."
---

A chi-square test of independence checks whether two category variables are linked: for every cell of the table, compare the count you got with the count you would expect if the variables had nothing to do with each other, then add up the squared gaps. Type the table into [[hypothesis-tests]] and it gives χ², the degrees of freedom, the p-value, Cramér's V and the cells that drive the result. If you have one row per survey answer rather than a ready table, [[crosstab-chi-square]] builds the table for you first.

## What you need

- **Counts, not percentages.** Each person or thing must be counted once, in exactly one cell. Turning counts into percentages before the test gives wrong answers.
- **A table with at least 2 rows and 2 columns**, such as year group against favourite study place.
- **Expected counts that are not tiny.** The usual rule is that no expected count falls below 1 and at most a fifth fall below 5. For a 2 × 2 table with small counts, use Fisher's exact test instead (the same page offers it and switches to it on its own when needed).

## Step by step

1. Open [[hypothesis-tests]]. Under **What did you measure?** choose *Counts in categories*.
2. Under **What are you comparing?** choose *Two variables in a table*. The recommendation line should name the chi-square test of independence.
3. Paste the table: the categories of one variable down the left, the other across the top, and the counts in between. Labels are optional; a spreadsheet block with an empty top-left cell works.
4. Leave **Significance level α** at 0.05 unless your course or journal says otherwise. The Yates correction box only matters for a 2 × 2 table.
5. Read the headline χ² line, then the **Observed (expected) counts** table and the **Adjusted residuals** table, and look at the chart of row percentages. Download a CSV or a report if you need to hand it in.

The formulas, for a table with r rows and c columns and grand total N:

- Expected count in a cell: E = (row total × column total) ÷ N
- Test statistic: χ² = Σ (O − E)² ÷ E, summed over every cell, where O is the observed count
- Degrees of freedom: (r − 1) × (c − 1)
- Strength of the link: Cramér's V = √[ χ² ÷ (N × (smaller of r and c − 1)) ], from 0 (none) to 1

## A worked example

A student society asks 150 students where they mostly study. The made-up answers:

| | Library | Home | Café | Total |
|---|---|---|---|---|
| First-year | 34 | 22 | 14 | 70 |
| Final-year | 18 | 30 | 32 | 80 |
| Total | 52 | 52 | 46 | 150 |

First the expected counts. First-years in the library: 70 × 52 ÷ 150 = 24.27. First-years in cafés: 70 × 46 ÷ 150 = 21.47. Final-years in the library: 80 × 52 ÷ 150 = 27.73. The library cell alone adds (34 − 24.27)² ÷ 24.27 = 3.90 to χ².

Adding all six cells gives the result the page shows: **χ²(2) = 12.59, p = 0.002**. There are (2 − 1) × (3 − 1) = 2 degrees of freedom. Cramér's V is 0.2897, a small-to-medium link for a table this shape. The smallest expected count is 21.47, so the large-count rule is easily met.

The adjusted residuals show where the difference lies. First-years in the library come out at +3.347 and first-years in cafés at −2.65; anything beyond about ±2 stands out. Home sits at −0.78, close to what chance would give. In plain words: first-year students lean towards the library, final-year students towards cafés, and home is just as popular in both years.

## Check your answer

- **Expected counts keep the totals.** Each row of expected counts adds up to the same row total as the observed counts (24.27 + 24.27 + 21.47 = 70). If yours do not, a total is wrong.
- **Residuals balance.** In a two-row table each column's two adjusted residuals are equal and opposite, as +3.347 and −3.347 are here.
- **Size against degrees of freedom.** With no link at all, χ² comes out close to its degrees of freedom on average. A value of 12.6 on 2 degrees of freedom is far above that, so a small p-value makes sense.

## Questions people ask

**What is the difference between this and a chi-square goodness of fit test?** Goodness of fit compares one variable with shares you set in advance, such as a 3:1 ratio. The test of independence compares two variables with each other, and works out the expected counts from the table's own totals.

**Does a small p-value mean one variable causes the other?** No. It only shows that the two are linked in your sample. A third factor, such as timetables or age, could explain both.

**How many people should I survey?** Enough that the expected counts stay well above 5 and a link of the size you care about would show. Use the [[sample-size|sample size calculator]] to plan this before collecting.
