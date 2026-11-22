---
title: Pace against last year and targets
seoTitle: 'DAX pace vs last year and sales vs target measures'
summary: Compare this year to date with last year to date, bring in a monthly targets table with TREATAS, and build the "are we on track?" measures every retail dashboard needs.
minutes: 18
updated: 2026-11-22
quiz:
  - q: How do you get last year's year-to-date figure?
    choices: ['TOTALYTD of last year typed by hand', 'CALCULATE([YTD], SAMEPERIODLASTYEAR(''Date''[Date]))', 'YTD minus 1']
    ans: 1
    why: Shifting the dates back a year and evaluating the YTD measure inside them gives the matching period last year.
  - q: Targets are monthly with a YearMonth column; Date is daily. How does TREATAS help?
    choices: ['It creates a relationship in the model', 'It applies the visible YearMonth values from Date as a filter on Targets[YearMonth], inside one measure', 'It converts text to dates']
    ans: 1
    why: TREATAS(VALUES('Date'[YearMonth]), Targets[YearMonth]) takes the current months and treats them as a filter on Targets, like a virtual relationship.
  - q: What does "pace" usually mean in retail reporting?
    choices: ['How fast the website loads', 'How this year to date compares with the same point last year', 'Units per hour']
    ans: 1
    why: Pace tells a manager whether the year is running ahead of or behind last year at the same point in time.
---

**Module 6 · about 18 minutes · read first: 6.1 and 6.2.** You'll be able to build pace and target measures, and connect a table at a different grain.

## 1. Why this matters

The questions behind most retail dashboards are "are we ahead of last year?" and "are we on target?". These are the measures in the capstone, and the kind of thing a BI developer gets asked for in week one.

## 2. Pace

<!--fig:dax-pad ti-pace-->

On the March 2025 row, `YTD` covers 1 January to 31 March 2025. `YTD LY` shifts those dates back a year and runs the YTD measure in them: 1 January to 31 March 2024. `Pace %` compares the two. By December, Northbay is about 29 % ahead.

Pace is a better headline than a single month's growth, because one bad month (a snowstorm, a holiday moving) doesn't swing it.

## 3. Targets at a different grain

Targets is monthly per store, with a `YearMonth` text column and no relationship to the daily Date table. Rather than a messy many-to-many relationship, move the filter inside the measure:

<!--fig:dax-pad ti-target-->

`VALUES('Date'[YearMonth])` lists the months visible in the cell; `TREATAS` applies them as a filter on `Targets[YearMonth]`. Store filters reach Targets through its real relationship to Store. Northbay beat its 2025 targets, which were set at last year plus 6 %, because sales grew much faster.

Other ways to handle different grains: add a YearMonth dimension that relates to both tables, or relate Targets to the Date table on the first day of each month. TREATAS keeps the model simple and is a favourite interview answer.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** compare like with like. Pace compares two periods of the same length at the same point in the year; target comparisons only make sense at the target's own grain (month and store) or coarser (quarter, region, year). Below that grain, such as per day, a monthly target has no meaning: show it blank, or spread it by a rule you agree with the business.

**Try it:** split the target measure by `'Date'[Weekday]`. What does it show, and why is that misleading? (Every weekday shows all the targets of the months visible, because a target can't be split by weekday.)
</details>

## 4. Worked example

*The store manager's card row.* Four cards: `YTD` 262k, `Pace %` +29 %, `Target YTD` 246k, `vs Target %` about +7 %. The YTD target is `CALCULATE([Target], DATESYTD('Date'[Date]))`, the same pattern as YTD sales. Under them, a line chart of `3M Avg` against `Target` by month. That's the core of the capstone in Module 9.

## 5. Practice

1. Write `Target YTD`.
2. Write `Gap to Target` = Target − Total Sales, blank when there is no target.
3. Why is a relationship between Targets[YearMonth] and Date[YearMonth] tricky?

<details>
<summary>Answers</summary>

1. `CALCULATE([Target], DATESYTD('Date'[Date]))`.
2. `IF(ISBLANK([Target]), BLANK(), [Target] - [Total Sales])`.
3. YearMonth is not unique in either table (many days per month in Date, many stores per month in Targets), so it would be many-to-many, which is slower and easy to get wrong.
</details>
