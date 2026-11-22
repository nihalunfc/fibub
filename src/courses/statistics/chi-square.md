---
title: Chi-square tests for categories
summary: 'Tests for counts in categories: goodness of fit (does the mix match what we expect?) and independence (are two categorical columns related?). Expected counts, the χ² sum, degrees of freedom, the small-count rule and Cramér''s V.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'What is the expected count in a cell of a contingency table, if the two variables are independent?'
    choices: ['Row total × column total ÷ grand total', 'Grand total ÷ number of cells', 'The observed count']
    ans: 0
    why: 'Under independence the cell share is (row share) × (column share), so the count is row total × column total ÷ grand total.'
  - q: 'A table has 3 rows and 4 columns. How many degrees of freedom does the chi-square test of independence have?'
    choices: ['12', '6', '7']
    ans: 1
    why: '(rows − 1) × (columns − 1) = 2 × 3 = 6.'
  - q: 'Several expected counts are below 5. What should you do?'
    choices: ['Ignore it', 'Combine small categories or use Fisher''s exact test', 'Multiply all counts by 10']
    ans: 1
    why: 'The chi-square approximation is poor with small expected counts. Merging sparse categories or an exact test fixes it. Inflating counts is not allowed.'
---

**Module 6 · about 25 minutes · school maths.** You'll be able to run chi-square goodness-of-fit and independence tests, check their small-count rule, and report the strength of the relationship.

## 1. Tests for counts

Many business questions are about **categories**, not averages:

- Is churn related to the plan a customer is on?
- Do complaints split across regions the way sales do?
- Is the 50/50 split in our A/B test really 50/50? (Lesson 7.6)

The data is a table of counts. The **chi-square (χ²) test** compares observed counts `$O$` with the counts `$E$` you would expect under the null hypothesis:

```math
\chi^2 = \sum_{\text{cells}} \frac{(O - E)^2}{E}
```

Each cell adds its squared gap, scaled by how big a count was expected (a gap of 10 matters more when 20 were expected than when 2,000 were).

## 2. Goodness of fit

One categorical column, compared with expected shares. Degrees of freedom = categories − 1.

Example: complaints by region were 50, 30, 20 (n = 100), and sales shares are 40 %, 40 %, 20%. Expected counts: 40, 40, 20. χ² = 100/40 + 100/40 + 0 = 5.0 with 2 df: p ≈ 0.082. The complaint mix doesn't differ clearly from the sales mix.

## 3. Independence (contingency tables)

Two categorical columns cross-tabulated. Under independence, each cell's expected count is

```math
E_{ij} = \frac{\text{row}_i \text{ total} \times \text{column}_j \text{ total}}{\text{grand total}}
```

and df = (rows − 1) × (columns − 1).

<!--fig:chi-square-table-->

Edit the counts and watch the expected (outlined) bars and the χ² change. Make the Pro column's renewals match the others and the p-value climbs.

## 4. Strength and the small-count rule

**Cramér's V** turns χ² into a 0-to-1 strength measure: `$V = \sqrt{\chi^2 / (n(k-1))}$`, where `$k$` is the smaller of rows and columns. Rough guide for 2-column tables: 0.1 small, 0.3 medium, 0.5 large. With big data a tiny V can be "significant"; report V too.

**Small counts:** the χ² approximation needs expected counts of at least about 5 in every cell. If not, combine sparse categories or use **Fisher's exact test** (for 2 × 2 tables).

A significant result says the columns are related, not **how**. Look at which cells have the largest `$(O-E)^2/E$` contributions, or at row percentages, to describe it.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** under the null, each cell's `$(O-E)/\sqrt{E}$` is roughly a standard normal; adding their squares gives a chi-square variable with df equal to the number of free cells.

**Equations:** `$\chi^2 = \sum (O-E)^2/E$`; `$E_{ij} = R_i C_j / N$`; df = `$(r-1)(c-1)$`; `$V = \sqrt{\chi^2/(N(k-1))}$`.

**In code:** Excel `CHISQ.TEST(observed, expected)`; Python `scipy.stats.chi2_contingency(table, correction=False)` and `scipy.stats.chisquare(obs, f_exp)`; pandas `pd.crosstab(df.plan, df.renewed)` builds the table.

**For 2 × 2 tables**, the chi-square test equals the two-proportion z-test squared: χ² = z².
</details>

## 5. Worked example

*The simulation's starting numbers.* Renewals by plan:

| | Basic | Plus | Pro | Total |
|---|---|---|---|---|
| Renewed | 120 | 90 | 70 | 280 |
| Left | 80 | 40 | 20 | 140 |
| Total | 200 | 130 | 90 | 420 |

- Expected renewed: Basic 200 × 280 ÷ 420 = **133.3**; Plus 130 × 280/420 = **86.7**; Pro 90 × 280/420 = **60**. Expected left: 66.7, 43.3, 30.
- Contributions: (120 − 133.3)²/133.3 = 1.33; (90 − 86.7)²/86.7 = 0.13; (70 − 60)²/60 = 1.67; (80 − 66.7)²/66.7 = 2.67; (40 − 43.3)²/43.3 = 0.26; (20 − 30)²/30 = 3.33.
- χ² ≈ **9.38** with df = 2; p ≈ **0.009**. Cramér's V = √(9.38 ÷ 420) ≈ **0.15** (small to modest).
- Renewal rates: Basic 60 %, Plus 69 %, Pro 78 %. Higher plans renew more.

Report: "Renewal differs by plan (χ² = 9.4, df = 2, p = 0.009): 60 % on Basic, 69 % on Plus, 78 % on Pro." Whether the plan *causes* renewal is another matter: committed customers may choose Pro.

## 6. Practice

1. A die is rolled 60 times: counts 8, 9, 12, 11, 6, 14. Compute χ² for a fair die.
2. A 2 × 2 table has 120 people in total, row totals 30 and 90, column totals 40 and 80. Find the expected count for the top-left cell.
3. χ² = 2.1 with 3 df. Significant at 5 %? (The 5 % critical value for 3 df is 7.81.)

<details>
<summary>Answers</summary>

1. Expected 10 each. (4 + 1 + 4 + 1 + 16 + 16) ÷ 10 = 4.2, with 5 df: p ≈ 0.52, consistent with fair.
2. 30 × 40 ÷ 120 = 10.
3. No: 2.1 is well below 7.81.
</details>

**Try it on your own data:** [[crosstab-chi-square]] builds the table from a CSV and runs the test with Cramér's V; the [[hypothesis-tests]] tool does goodness of fit from pasted counts.

**New words:** *chi-square test*, *goodness of fit*, *contingency table*, *expected count*, *test of independence*, *Cramér's V*, *Fisher's exact test*.
