---
title: 'Iterators: SUMX and row context'
seoTitle: 'DAX SUMX and row context explained with examples'
summary: SUMX, AVERAGEX, MAXX and friends go through a table one row at a time, work out an expression for each row, then combine the results. Watch it happen row by row and see why SUM × SUM is wrong.
minutes: 18
updated: 2026-11-22
quiz:
  - q: What does SUMX(Sales, Sales[Quantity] * Sales[UnitPrice]) do?
    choices: ['Multiplies total quantity by total price', 'For each Sales row, multiplies that row''s quantity and price, then adds the results', 'Counts the rows']
    ans: 1
    why: The X functions create a row context for each row of the table, evaluate the expression in it, and aggregate the per-row results.
  - q: Why is SUM(Sales[Quantity]) * SUM(Sales[UnitPrice]) wrong for revenue?
    choices: ['It is right', 'It multiplies two grand totals, pairing every quantity with every price', 'SUM cannot be multiplied']
    ans: 1
    why: Multiplication must happen per row before adding. Sum of products ≠ product of sums.
  - q: What is row context?
    choices: ['A filter from a slicer', 'The current row of a table being iterated (or of a calculated column), whose column values can be read directly', 'A type of chart']
    ans: 1
    why: Row context means "there is a current row". It exists in calculated columns and inside iterators, and it does not filter other tables by itself (Lesson 5.5).
---

**Module 4 · about 18 minutes · read first: 4.1 and 3.4.** You'll be able to write iterator measures and explain row context.

## 1. Why this matters

Whenever a calculation must happen per row before adding up (price × quantity, cost × units, days between two dates), you need an iterator. Row context is also half of DAX's mental model: understanding it now makes CALCULATE easy later.

## 2. The idea, step by step

Run it, click a category, then **Show me what happened**: you'll see the filter context first, then SUMX going through the rows, the new column it works out for each one, and the total.

<!--fig:dax-pad x-revenue-->

## 3. The X family

| Function | For each row… then | Example |
|---|---|---|
| `SUMX(table, expr)` | adds | revenue, cost, weighted totals |
| `AVERAGEX(table, expr)` | averages | average sales per day (Lesson 5.5) |
| `MAXX`, `MINX` | takes the largest / smallest | biggest order line |
| `COUNTX(table, expr)` | counts non-blank results | lines with a value |
| `CONCATENATEX(table, expr, ", ")` | joins text | list of selected stores in a title |

The first argument can be any table: `Sales`, `VALUES(Product[Product])`, or a filtered table (Lesson 5.4).

<!--fig:dax-pad x-biggest-line-->

## 4. The classic mistake

<!--fig:dax-pad x-wrong-->

`Wrong` adds all quantities, adds all prices, then multiplies the two big numbers. Every quantity gets paired with every price. `Right` multiplies each row's own quantity by its own price first.

## 5. Row context

Inside an iterator (and in a calculated column), there is a **current row**, so `Sales[Quantity]` means "this row's quantity". That's **row context**. A measure on its own has no current row, which is why `Sales[Quantity]` alone fails in a measure (Lesson 1.5). Two things row context does **not** do: it doesn't filter other tables, and it doesn't change what `SUM` sees. Lesson 5.5 shows how CALCULATE turns a row into a filter.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** sum of products is not product of sums.

```math
\sum_{r} q_r\,p_r \;\neq\; \Big(\sum_r q_r\Big)\Big(\sum_r p_r\Big)
```

**Try it:** two lines, (q = 2, p = 10) and (q = 1, p = 50). Revenue = 2·10 + 1·50 = 70. Wrong formula: (2 + 1)(10 + 50) = 180.

**Speed:** iterators over millions of rows are fast when the expression only uses the row's own columns. Avoid calling complex measures inside SUMX over a big fact table; iterate a smaller table (like VALUES of a dimension) instead.
</details>

Try it: press Play in column mode, then switch to Measure and use the Store slicer.

<figure class="fig" data-fig="@biz-row-vs-filter"><figcaption>Notice that a column is worked out row by row and stored, and a measure is worked out for whatever the filters leave.</figcaption></figure>

## 6. Worked example

*Total cost when the cost is stored per unit.* `Total Cost = SUMX(Sales, Sales[Quantity] * Sales[UnitCost])`. For Northbay that's about $229,000 against $466,000 of sales, a margin of about 51 %. Store the per-row result as a column only if you need to slice by it.

## 7. Practice

1. Write `Average Line Value` with AVERAGEX. Is it the same as `DIVIDE([Total Sales], COUNTROWS(Sales))`?
2. Write `Units at Full Price`: the total quantity of lines with UnitPrice equal to the 2024 price. (Hint: FILTER inside SUMX, Lesson 5.4.)
3. What would `MAXX(Sales, Sales[Date])` give?

<details>
<summary>Answers</summary>

1. `AVERAGEX(Sales, Sales[Quantity] * Sales[UnitPrice])`. Yes: the average of per-line values equals total ÷ number of lines.
2. One way: `SUMX(FILTER(Sales, Sales[UnitPrice] = RELATED(Product[UnitPrice])), Sales[Quantity])` (RELATED is next lesson).
3. The latest sale date in the current filter context, the same as `MAX(Sales[Date])`.
</details>
