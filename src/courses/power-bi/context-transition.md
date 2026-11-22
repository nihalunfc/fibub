---
title: Context transition
seoTitle: 'DAX context transition explained step by step'
summary: When CALCULATE runs inside a row context, the current row becomes a filter. That's why a measure inside SUMX gives per-row answers. Watch the two versions side by side and learn the patterns that rely on it.
minutes: 18
updated: 2026-11-22
quiz:
  - q: What is context transition?
    choices: ['Moving a visual', 'CALCULATE turning the current row of a row context into an equivalent filter context', 'Changing the data type']
    ans: 1
    why: Row context alone doesn't filter anything. CALCULATE (and every measure reference, which has an implicit CALCULATE) converts the row into filters.
  - q: Inside SUMX(Product, …), why does [Total Sales] give each product's sales but SUM(Sales[Amount]) gives the grand total each time?
    choices: ['SUM is broken', 'A measure reference triggers context transition; a bare SUM does not', 'They give the same result']
    ans: 1
    why: The measure is wrapped in an invisible CALCULATE, so the current product becomes a filter on Sales. SUM alone ignores the row context.
  - q: Which pattern gives the average daily sales?
    choices: ['AVERAGE(Sales[Amount])', 'AVERAGEX(VALUES(''Date''[Date]), [Total Sales])', 'SUM(Sales[Amount]) / 7']
    ans: 1
    why: AVERAGEX goes through the dates; [Total Sales] is evaluated for each date by context transition; then the daily values are averaged.
---

**Module 5 · about 18 minutes · read first: 5.2 and 4.3.** You'll be able to explain context transition and use it for per-item calculations.

## 1. Why this matters

Context transition is the idea that separates people who copy DAX from people who write it. It explains why measures inside iterators work, why some formulas are slow, and how to answer "best day", "average per customer" and "how many products sold more than X".

## 2. Two versions, side by side

<!--fig:dax-pad ct-demo-->

Trace **With** on the Home row: SUMX goes through the 3 Home products, and for each one CALCULATE turns the product row into a filter, so `[Total Sales]` gives that product's sales. Now move `Without` to the last line and trace it: SUM ignores the product row and sees all Home sales each time, so the answer is 3 × Home's sales.

## 3. The rule

- A **row context** (from an iterator or a calculated column) gives you a current row, but **filters nothing**.
- **CALCULATE** inside a row context performs **context transition**: the current row's values become filters (for a table row, effectively "this row").
- **Every measure reference** like `[Total Sales]` is wrapped in an invisible CALCULATE, so it always performs context transition.

## 4. Patterns that rely on it

<!--fig:dax-pad ct-best-day-->

<!--fig:dax-pad ct-avg-daily-->

`AVERAGEX(VALUES('Date'[Date]), [Total Sales])` evaluates sales for each date and averages them. Days with no sales give blank, which AVERAGEX skips, so it's the average over **days with sales**. `Per Calendar Day` divides by every day in the Date table (731), so it's much lower for Forks Market, which only existed for part of 2025. Choose the one that matches the question.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** for an iterator over table `$T$` with expression `$E$`:

```math
\text{SUMX}(T, [M]) = \sum_{t \in T} M\big(\text{filter context} \cap \{t\}\big)
```

The measure `$M$` is evaluated once per row `$t$`, with the row added as a filter. Without CALCULATE (a bare `SUM`), the `$\cap \{t\}$` part is missing and every row sees the same rows.

**Cost:** context transition on a large table is expensive (a new filter context per row). Iterate small tables (dates, products, customers), not the fact table, when you call measures inside an iterator.
</details>

## 5. Worked example

*In a Product calculated column, count each product's order lines.* `Product[Lines] = COUNTROWS(Sales)` gives 7,328 for every product: a calculated column has a row context but no filter context, so COUNTROWS sees all of Sales. `Product[Lines] = CALCULATE(COUNTROWS(Sales))` gives each product's own count: CALCULATE turns the product row into a filter, which flows to Sales. Same for `COUNTROWS(RELATEDTABLE(Sales))`, which is CALCULATETABLE in disguise.

## 6. Practice

1. Write `Worst Day` (the lowest daily sales among days with sales).
2. Why does `SUMX(Store, SUM(Sales[Amount]))` give 5 × the total when no store is filtered?
3. Write `Average Sales per Product` for the current context.

<details>
<summary>Answers</summary>

1. `MINX(VALUES('Date'[Date]), [Total Sales])` (blank days are skipped).
2. SUM ignores each store row (no context transition), so it adds the full total once per store.
3. `AVERAGEX(VALUES(Product[Product]), [Total Sales])`.
</details>
