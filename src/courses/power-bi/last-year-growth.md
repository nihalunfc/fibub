---
title: Same period last year and growth
seoTitle: 'DAX SAMEPERIODLASTYEAR, DATEADD and YoY growth %'
summary: Compare any period with the same period a year earlier, work out growth, and handle new stores and missing history correctly.
minutes: 16
updated: 2026-11-22
quiz:
  - q: On the March 2025 row, what dates does SAMEPERIODLASTYEAR('Date'[Date]) give?
    choices: ['March 2025', 'March 2024', 'All of 2024']
    ans: 1
    why: It shifts each visible date back one year. A whole month maps to the whole same month a year earlier.
  - q: What is the difference between SAMEPERIODLASTYEAR and DATEADD?
    choices: ['None at all', 'DATEADD can shift by any number of days, months, quarters or years; SAMEPERIODLASTYEAR is DATEADD(…, -1, YEAR)', 'DATEADD only works on numbers']
    ans: 1
    why: DATEADD('Date'[Date], -1, MONTH) gives last month; DATEADD(…, -1, YEAR) is the same as SAMEPERIODLASTYEAR.
  - q: Forks Market opened in 2025. What should its 2025 growth % show?
    choices: ['Infinity or 100 %', 'Blank (there is no last year to compare with)', '0 %']
    ans: 1
    why: Growth has no meaning without a base. DIVIDE returns blank when last year is blank, which is the honest answer.
---

**Module 6 · about 16 minutes · read first: 6.1.** You'll be able to write last-year and growth measures that are right for months, quarters, years and new stores.

## 1. Why this matters

"Are we up on last year?" is the first question in every retail meeting. Growth measures that break on new stores or show Infinity are the first thing a sharp manager notices.

## 2. Last year and growth

<!--fig:dax-pad ti-py-->

Trace a 2025 month: the visual's dates are replaced by the same dates one year earlier, and the sum runs on those. The 2024 rows have no last year in the data, so `Sales LY` is blank and so is growth. Northbay grew about 29 % in 2025: busier stores, a 4 % price rise and a new store.

## 3. New stores

<!--fig:dax-pad ti-growth-store-->

`DIVIDE` already makes Forks Market's growth blank. `Change` needs an explicit test. Many retailers go further and report **like-for-like** (same-store) growth: only stores open for the whole of both periods, so new stores don't flatter the number. You'd add a filter such as `Store[OpenDate] <= DATE(2024, 1, 1)`.

## 4. DATEADD and friends

| Function | Gives |
|---|---|
| `SAMEPERIODLASTYEAR('Date'[Date])` | the visible dates, one year earlier |
| `DATEADD('Date'[Date], -1, MONTH)` | one month earlier (any number and unit: DAY, MONTH, QUARTER, YEAR) |
| `PREVIOUSMONTH('Date'[Date])` | the whole month before the first visible date |
| `PARALLELPERIOD('Date'[Date], -1, YEAR)` | the whole previous year (full periods, not shifted days) |

So month-on-month: `Sales LM = CALCULATE([Total Sales], DATEADD('Date'[Date], -1, MONTH))`.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** growth compares two filter contexts that differ only in time:

```math
\text{Growth \%} = \frac{S(\text{period}) - S(\text{period shifted back one year})}{S(\text{period shifted back one year})}
```

**Try it:** March 2025 sales 21,792, March 2024 sales 15,461. Growth = (21,792 − 15,461) / 15,461 ≈ 41 %.
</details>

## 5. Worked example

*The December 2025 board slide.* December sales 30,031 against 22,313 a year earlier: +34.6 %. Year to date 262,471 against 203,438: +29 %. Both numbers come from the same two measures with different filter contexts (month row or YTD measure inside the shift, Lesson 6.4).

## 6. Practice

1. Write `Sales LM` and `MoM %` (month on month).
2. Why does Growth % on the total row (no date filter) show a strange number?
3. Write `Sales LY` with DATEADD instead of SAMEPERIODLASTYEAR.

<details>
<summary>Answers</summary>

1. `Sales LM = CALCULATE([Total Sales], DATEADD('Date'[Date], -1, MONTH))`, `MoM % = DIVIDE([Total Sales] - [Sales LM], [Sales LM])`.
2. The total covers both years; "last year" of both years is just 2024, so it compares two years with one. Hide growth on totals that span several years, or show it only per year.
3. `CALCULATE([Total Sales], DATEADD('Date'[Date], -1, YEAR))`.
</details>
