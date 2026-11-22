---
title: 'DAX queries: EVALUATE and SUMMARIZECOLUMNS'
seoTitle: 'DAX queries: EVALUATE, SUMMARIZECOLUMNS, DAX query view'
summary: A DAX query returns a table instead of a single value. Use EVALUATE in Power BI's DAX query view to test measures, check data and answer questions fast, with SUMMARIZECOLUMNS, ADDCOLUMNS and ORDER BY.
minutes: 16
updated: 2026-11-22
quiz:
  - q: What must every DAX query start with?
    choices: ['SELECT', 'EVALUATE followed by a table expression', 'MEASURE']
    ans: 1
    why: EVALUATE returns a table. Optional DEFINE (for query measures) comes before it and ORDER BY after it.
  - q: SUMMARIZECOLUMNS(Store[Region], "Sales", [Total Sales]) returns…
    choices: ['One number', 'One row per region with its sales (regions with blank sales are left out)', 'Every Sales row']
    ans: 1
    why: It groups by the columns listed and evaluates each named expression per group, skipping groups where all expressions are blank, like a table visual.
  - q: Why are DAX queries useful even if you only build reports?
    choices: ['They are not', 'You can check a measure''s values per group, debug totals and inspect data without building visuals', 'Reports need them to load']
    ans: 1
    why: The DAX query view is a quick lab for testing measures and checking data, and Power BI writes a DAX query for every visual, so reading them helps with performance work too.
---

**Module 5 · about 16 minutes · read first: 5.2.** You'll be able to write DAX queries that return tables, and use them to test measures.

## 1. Why this matters

Every visual in Power BI runs a DAX query behind the scenes. Writing your own in **DAX query view** is the fastest way to test a measure, check data quality or answer a one-off question. Some interviews ask you to write one.

## 2. Your first queries

<!--fig:dax-pad q-first-->

`EVALUATE` takes any table expression: a table name, `VALUES(…)`, `FILTER(…)`, `TOPN(…)`, `SUMMARIZECOLUMNS(…)`. The editor shows only the last query in the box; comment the others out with `//`.

## 3. SUMMARIZECOLUMNS: a table visual in code

<!--fig:dax-pad q-summarize-->

`SUMMARIZECOLUMNS(group columns…, [filter tables…], "Name", expression, …)` groups by the columns, applies any filter tables, and evaluates each expression per group. It's exactly what a table visual does, which is why Power BI generates it.

<!--fig:dax-pad q-two-cols-->

`TREATAS({"Outdoor", "Electronics"}, Product[Category])` builds a small table of values and treats it as a filter on that column, like a slicer.

## 4. More query tools

| Function | Returns |
|---|---|
| `ADDCOLUMNS(table, "Name", expr)` | the table with new columns, worked out per row (with context transition for measures) |
| `SELECTCOLUMNS(table, "Name", expr)` | only the columns you list |
| `TOPN(n, table, orderBy)` | the top rows |
| `CALCULATETABLE(table, filters…)` | a table in a changed filter context |
| `ROW("Name", expr)` | a one-row table, handy to test a single measure |
| `ORDER BY expr [ASC/DESC]` | sorts the output (after EVALUATE) |

In Power BI you can also `DEFINE MEASURE Sales[Test] = …` at the top of a query to try a measure without adding it to the model. In this course's editor, measures written above the query do the same.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** a query is evaluated with an empty filter context (no visual, no slicers). Any filtering comes from the query itself: group columns, filter arguments or CALCULATETABLE. That makes queries a clean lab: what you see is the measure's pure behaviour.

**Try it:** `EVALUATE ROW("Sales", [Total Sales])` returns the grand total, because nothing filters it.
</details>

## 5. Worked example

*Check a measure before showing it to a manager.* `EVALUATE SUMMARIZECOLUMNS('Date'[Year], Store[Store], "Sales", [Total Sales], "Growth", [Growth %])` shows every store and year at once. Forks Market's 2025 growth is blank (no 2024 sales), every other store shows a sensible percentage, and the numbers match the report. Three minutes of checking saves an awkward meeting.

## 6. Practice

1. Write a query listing products with UnitPrice over 30, sorted by price.
2. Write a query for total sales per weekday, sorted from highest.
3. What does `EVALUATE ROW("Lines", COUNTROWS(Sales))` return?

<details>
<summary>Answers</summary>

1. `EVALUATE FILTER(Product, Product[UnitPrice] > 30) ORDER BY Product[UnitPrice] DESC`.
2. `EVALUATE SUMMARIZECOLUMNS('Date'[Weekday], "Sales", [Total Sales]) ORDER BY [Sales] DESC`.
3. One row with one column, Lines = 7,328.
</details>
