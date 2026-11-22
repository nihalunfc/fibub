---
title: FILTER and table filters
seoTitle: 'DAX FILTER function: when and how to use it'
summary: FILTER walks a table row by row and keeps the rows where a condition is true. Use it inside CALCULATE for conditions a simple filter can't express, and see which rows it keeps and drops.
minutes: 16
updated: 2026-11-22
quiz:
  - q: When do you need FILTER instead of a simple CALCULATE condition?
    choices: ['Always', 'When the condition uses a measure, several tables, or a row-by-row calculation', 'Never']
    ans: 1
    why: Simple conditions like Product[Category] = "Home" are best written directly. FILTER is for conditions such as [Total Sales] > 40000 or Sales[Quantity] * Sales[UnitPrice] >= 100.
  - q: Why is FILTER(ALL(Product[Category]), …) usually better than FILTER(Product, …) for a column condition?
    choices: ['It is shorter', 'It iterates a few distinct values instead of every row of a table, and filters just that column', 'There is no difference']
    ans: 1
    why: Iterating the small list of values is faster and sets a filter on just the column you mean, which is exactly what the shorthand condition does.
  - q: What does COUNTROWS(FILTER(VALUES(Product[Product]), [Total Sales] > 40000)) count?
    choices: ['Sales rows over 40,000', 'Products whose sales in the current context are above 40,000', 'All products']
    ans: 1
    why: FILTER goes through the visible products; for each one the measure is evaluated for that product (context transition), and the products passing the test are counted.
---

**Module 5 · about 16 minutes · read first: 5.2 and 4.3.** You'll be able to use FILTER for conditions that need row-by-row tests or measures.

## 1. Why this matters

Many business rules can't be written as "column = value": big orders, products above a sales threshold, customers who bought twice. FILTER handles them all.

## 2. Keep the rows that pass

<!--fig:dax-pad f-big-lines-->

Trace a category: after the filter context, FILTER goes through the visible Sales rows and keeps the ones with Amount ≥ 100. CALCULATE then uses the kept rows as the filter for the sum.

`FILTER(table, condition)` is an **iterator**: it creates a row context for each row of the table, tests the condition, and returns the rows that pass. It returns a table, so it's used inside CALCULATE, COUNTROWS, SUMX and other functions that take a table.

Try it: set a Category slicer, then compare the plain measure with the CALCULATE versions.

<figure class="fig" data-fig="@biz-calculate-modes"><figcaption>Notice that CALCULATE with a column filter overrides the slicer, KEEPFILTERS keeps both, and ALL removes it.</figcaption></figure>

## 3. Filtering with a measure

<!--fig:dax-pad f-top-products-->

For each product in `VALUES(Product[Product])`, the condition evaluates `[Total Sales]` **for that product**: the measure reference turns the current product row into a filter (context transition, the next lesson). Split by Year to see how many products cross the line each year.

## 4. Good habits

1. **Don't use FILTER for simple column conditions.** `CALCULATE([Total Sales], Product[Category] = "Home")` is clearer and faster than `CALCULATE([Total Sales], FILTER(Product, Product[Category] = "Home"))`.
2. **Filter the smallest table that works.** `FILTER(VALUES(Product[Product]), …)` (12 rows) beats `FILTER(Sales, …)` (7,328 rows) when the test is about products.
3. **Filtering a whole fact table** inside CALCULATE (like `FILTER(Sales, …)`) is fine for row-level tests on that table, but on very large tables a column filter is faster: `CALCULATE([Total Sales], Sales[Amount] >= 100)` works too, because the test uses one column.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** FILTER = iterate + test + keep. In set notation, for a table `$T$` and condition `$c$`:

```math
\text{FILTER}(T, c) = \{\, t \in T : c(t) = \text{TRUE} \,\}
```

The table `$T$` is evaluated first, in the current filter context, so FILTER can only keep rows that are already visible, never bring back hidden ones. Use ALL inside it (`FILTER(ALL(…), …)`) when you need rows the context has hidden.

**Try it:** in a 2024 context, can `FILTER(Sales, Sales[Amount] > 0)` return 2025 rows? (No: 2025 rows aren't visible to begin with.)
</details>

## 5. Worked example

*How much of each category's sales come from multi-unit lines?* `Multi Unit Sales = CALCULATE([Total Sales], Sales[Quantity] >= 2)` (a one-column test, so the shorthand works). Then `Multi Unit % = DIVIDE([Multi Unit Sales], [Total Sales])`. In Northbay's data a little under half of the lines have two or more units, and the categories are close to each other.

## 6. Practice

1. Write `Lines Over 200`: the number of Sales rows with Amount over 200.
2. Write `Products Under 20k`: products with sales below 20,000 in the current context.
3. What's wrong with `CALCULATE([Total Sales], FILTER(Product, [Total Sales] > 40000))` on very large models, and what's a better first argument?

<details>
<summary>Answers</summary>

1. `COUNTROWS(FILTER(Sales, Sales[Amount] > 200))` or `CALCULATE(COUNTROWS(Sales), Sales[Amount] > 200)`.
2. `COUNTROWS(FILTER(VALUES(Product[Product]), [Total Sales] < 20000))`.
3. It iterates every column of the Product table; `VALUES(Product[Product])` iterates just the product names and gives the same result here.
</details>
