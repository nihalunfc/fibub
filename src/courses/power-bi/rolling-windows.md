---
title: Rolling 28 days and moving averages
seoTitle: 'DAX rolling 28 days and moving average with DATESINPERIOD'
summary: Rolling windows smooth out weekday and holiday noise. Use DATESINPERIOD for the last 28 days, the last 3 months and moving averages, and learn why the first periods need care.
minutes: 15
updated: 2026-11-22
quiz:
  - q: What does DATESINPERIOD('Date'[Date], MAX('Date'[Date]), -28, DAY) return?
    choices: ['28 random days', 'The 28 days ending on the last visible date', 'The first 28 days of the year']
    ans: 1
    why: It starts at the given date and goes back 28 days (including that date), regardless of month boundaries.
  - q: Why do retailers like 28-day windows?
    choices: ['28 is lucky', 'Every 28-day window holds exactly 4 of each weekday, so busy weekends don''t distort comparisons', 'Months are always 28 days']
    ans: 1
    why: Calendar months contain 4 or 5 of each weekday. A 28-day window always has exactly four Saturdays, so windows compare fairly.
  - q: A 3-month average for the very first month of data is far too low. Why?
    choices: ['A bug in DAX', 'Only one month of data exists, but the measure still divides by 3', 'The date table is wrong']
    ans: 1
    why: Divide by the number of months that actually have data (or hide the first months) to avoid a misleading start.
---

**Module 6 · about 15 minutes · read first: 6.1.** You'll be able to write rolling totals and moving averages that are fair to compare.

## 1. Why this matters

Daily sales jump around with weekdays, weather and holidays. Operations managers watch rolling 7- or 28-day totals because they show the trend without the noise.

## 2. Last 28 days

<!--fig:dax-pad ti-r28-->

On each month's row, `MAX('Date'[Date])` is that month's last day, and the window is the 28 days ending there. Trace a row to see the dates CALCULATE keeps. Every 28-day window has exactly four of each weekday, so a window ending on a Tuesday compares fairly with one ending on a Sunday.

## 3. Moving average

<!--fig:dax-pad ti-3m-avg-->

Look at January and February 2024: the window reaches back into months with no data, but the measure still divides by 3, so the first values are far too low. Fix it by dividing by the number of months that have sales:

```
3M Avg =
VAR Window = DATESINPERIOD('Date'[Date], MAX('Date'[Date]), -3, MONTH)
RETURN AVERAGEX(
    CALCULATETABLE(VALUES('Date'[YearMonth]), Window),
    [Total Sales]
)
```

`AVERAGEX` averages the monthly totals and skips months that are blank. (Run it in the editor above: replace the measure and compare January 2024.)

<details class="maths" open>
<summary>Principle</summary>

**Principle:** a rolling window is a filter of the dates in `$(d_{\max} - n, d_{\max}]$`, computed for each cell from its last visible date. A moving average divides the window's total by the number of periods it covers:

```math
\text{MA}_k(t) = \frac{1}{k}\sum_{i=0}^{k-1} S_{t-i}
```

which is only fair when all `$k$` periods exist.
</details>

## 4. Worked example

*Snow shovels.* Daily sales of shovels are zero most of the summer and spike after snowfalls. A rolling 28-day total of shovel units smooths the spikes into a clear winter hump, which tells the buyer when to order stock. Try it in the playground: `Shovels 28d = CALCULATE(SUM(Sales[Quantity]), Product[Product] = "Snow shovel", DATESINPERIOD('Date'[Date], MAX('Date'[Date]), -28, DAY))` split by YearMonth.

## 5. Practice

1. Write `Sales 7d`.
2. Write `28d vs LY %`: the last 28 days against the same 28 days a year earlier.
3. Why use `MAX('Date'[Date])` rather than `TODAY()` as the window's end in a report?

<details>
<summary>Answers</summary>

1. `CALCULATE([Total Sales], DATESINPERIOD('Date'[Date], MAX('Date'[Date]), -7, DAY))`.
2. `VAR Now = [Sales 28d] VAR LY = CALCULATE([Sales 28d], SAMEPERIODLASTYEAR('Date'[Date])) RETURN DIVIDE(Now - LY, LY)`.
3. MAX follows the visual (each row, each slicer selection); TODAY would show the same window everywhere.
</details>
