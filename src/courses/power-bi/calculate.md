---
title: 'CALCULATE: change the filters'
seoTitle: 'DAX CALCULATE explained with examples'
summary: CALCULATE evaluates an expression in a modified filter context. Add a filter, replace one, or keep both with KEEPFILTERS, and watch the context change step by step.
minutes: 18
updated: 2026-11-22
quiz:
  - q: In a table split by Category, what does CALCULATE([Total Sales], Product[Category] = "Home") return on the Grocery row?
    choices: ['Blank', 'Grocery sales', 'Home sales (the new filter replaces the row''s filter on Category)']
    ans: 2
    why: A CALCULATE filter on a column overwrites any existing filter on that same column. Use KEEPFILTERS to intersect instead.
  - q: How are several filter arguments in one CALCULATE combined?
    choices: ['With OR', 'With AND', 'Only the last one counts']
    ans: 1
    why: All filter arguments apply together, so CALCULATE([Total Sales], Store[Region] = "West", 'Date'[Year] = 2025) means West AND 2025.
  - q: What does KEEPFILTERS change?
    choices: ['Nothing', 'The new filter is added on top of the existing one (intersection) instead of replacing it', 'It removes all filters']
    ans: 1
    why: With KEEPFILTERS, the Grocery row keeps its Category = Grocery filter and adds Category = Home, so nothing passes and the result is blank.
---

**Module 5 · about 18 minutes · read first: 5.1.** You'll be able to use CALCULATE to add, replace and combine filters, and predict its result.

## 1. Why this matters

CALCULATE is the most important function in DAX. Almost every business measure beyond a plain sum uses it: sales for one category, last year's sales, share of total, sales to date. If you understand CALCULATE, you understand DAX.

## 2. Add a filter

<!--fig:dax-pad c-home-->

Trace a store: the filter context starts with that store, then CALCULATE **adds** Category = Home, and only then does SUM run.

## 3. Replace, or keep?

<!--fig:dax-pad c-overwrite-->

On the Grocery row, the visual says Category = Grocery. CALCULATE's filter is also on Category, so it **replaces** Grocery with Home: every row shows Home's sales. That's usually what you want for a fixed comparison ("Home sales next to each category"). `KEEPFILTERS` keeps both filters, so only the Home row passes.

Try it: set a Category slicer, then compare the plain measure with the CALCULATE versions.

<figure class="fig" data-fig="@biz-calculate-modes"><figcaption>Notice that CALCULATE with a column filter overrides the slicer, KEEPFILTERS keeps both, and ALL removes it.</figcaption></figure>

## 4. Several filters, and IN

<!--fig:dax-pad c-weekend-->

<!--fig:dax-pad c-two-filters-->

Filters on different columns combine with AND. For OR on one column, use `IN { … }` or `||` inside one condition: `Product[Category] = "Home" || Product[Category] = "Outdoor"`.

## 5. What a filter argument really is

`Product[Category] = "Home"` inside CALCULATE is shorthand for a table: `FILTER(ALL(Product[Category]), Product[Category] = "Home")`, the list of category values where the condition is true. CALCULATE then puts that list in place of any existing filter on `Product[Category]`. That's why it replaces, and it's why a condition can only use columns from one table. (Filters can also be tables, such as `FILTER(Sales, …)` in Lesson 5.4 or `DATESYTD(…)` in Module 6.)

<details class="maths" open>
<summary>Principle</summary>

**Principle:** `CALCULATE(expr, f1, f2, …)` does four things in order:

1. If there is a current row (row context), turn it into filters (context transition, Lesson 5.5).
2. Apply removers like `ALL` and `REMOVEFILTERS` (Lesson 5.3).
3. Apply each filter argument: replace existing filters on the same columns (or intersect, with KEEPFILTERS).
4. Evaluate `expr` in the new filter context.

**Try it:** split by Year. What does `CALCULATE([Total Sales], 'Date'[Year] = 2024)` show on the 2025 row? (2024 sales: the filter on Year is replaced.)
</details>

## 6. Worked example

*Northbay's manager wants each store's Outdoor sales next to its total.* `Outdoor Sales = CALCULATE([Total Sales], Product[Category] = "Outdoor")`, split by Store. The store filter stays (CALCULATE only touches Category), the category filter is set. Add `Outdoor % = DIVIDE([Outdoor Sales], [Total Sales])` and you can see which stores lean on summer goods.

## 7. Practice

1. Write `2025 Sales` that ignores the Year on the visual.
2. Write `Big Ticket Sales` for products with Product[UnitPrice] ≥ 50.
3. What does `CALCULATE([Total Sales])` with no filters do in a measure? (Hint: nothing visible yet; Lesson 5.5.)

<details>
<summary>Answers</summary>

1. `CALCULATE([Total Sales], 'Date'[Year] = 2025)`.
2. `CALCULATE([Total Sales], Product[UnitPrice] >= 50)`: earbuds and the camping chair.
3. In a measure with no row context it changes nothing; inside an iterator it turns the current row into a filter.
</details>
