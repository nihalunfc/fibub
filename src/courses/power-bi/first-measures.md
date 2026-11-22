---
title: 'Your first measures: SUM, COUNTROWS, DISTINCTCOUNT'
seoTitle: 'DAX SUM, COUNTROWS and DISTINCTCOUNT with examples'
summary: The five aggregations behind most measures, what each one counts, how blanks are treated, and why every report should be built on named measures.
minutes: 15
updated: 2026-11-22
quiz:
  - q: What does COUNTROWS(Sales) count?
    choices: ['The number of different products', 'The number of visible rows in Sales (order lines)', 'The total quantity']
    ans: 1
    why: COUNTROWS counts rows of a table in the current filter context. Its meaning depends on the table's grain, here order lines.
  - q: Which gives the number of different customers who bought, if Sales had a CustomerKey?
    choices: ['COUNT(Sales[CustomerKey])', 'DISTINCTCOUNT(Sales[CustomerKey])', 'SUM(Sales[CustomerKey])']
    ans: 1
    why: COUNT counts non-blank values, so a customer with 5 lines counts 5 times. DISTINCTCOUNT counts each different value once.
  - q: A store has no sales in a month. What does SUM(Sales[Amount]) return for that cell?
    choices: ['0', 'Blank', 'An error']
    ans: 1
    why: Aggregating no rows gives BLANK, and visuals hide rows where every measure is blank. That's usually what you want; Lesson 4.5 shows how to show 0 instead.
---

**Module 4 · about 15 minutes · read first: 1.5.** You'll be able to write the basic aggregation measures and say exactly what each one counts.

## 1. Why this matters

Every report starts with a few base measures: sales, units, orders, customers. Get them right and named well, and every other measure is built from them. Interviewers often start with "how would you count unique customers?".

## 2. The five aggregations

| Function | Gives | Example |
|---|---|---|
| `SUM(col)` | the total of a number column | `Total Sales = SUM(Sales[Amount])` |
| `COUNTROWS(table)` | the number of rows | `Order Lines = COUNTROWS(Sales)` |
| `DISTINCTCOUNT(col)` | the number of different values | `Products Sold = DISTINCTCOUNT(Sales[ProductKey])` |
| `AVERAGE(col)` | the mean of a column | `Average Unit Price = AVERAGE(Sales[UnitPrice])` |
| `MIN(col)`, `MAX(col)` | the smallest and largest value (numbers, dates or text) | `Last Sale = MAX(Sales[Date])` |

There's also `COUNT` (non-blank numbers) and `COUNTA` (non-blank values of any type), which you'll rarely need: COUNTROWS on the right table is clearer.

<!--fig:dax-pad m-basics-->

Click a store row and press **Show me what happened**: the filter on Store reaches Sales, then the last measure counts the distinct product keys among the visible rows.

<!--fig:dax-pad m-min-max-->

Try it: press Play in column mode, then switch to Measure and use the Store slicer.

<figure class="fig" data-fig="@biz-row-vs-filter"><figcaption>Notice that a column is worked out row by row and stored, and a measure is worked out for whatever the filters leave.</figcaption></figure>

## 3. Blanks

Aggregating no rows gives **BLANK**, not zero. Visuals hide rows where all measures are blank, which keeps tables tidy: Forks Market doesn't show for 2024 because it had no sales. `AVERAGE` skips blanks rather than counting them as 0, so missing quantities don't drag the average down.

Try it: make the big store bigger and see the two ways of combining margins drift apart.

<figure class="fig" data-fig="@biz-ratio-of-sums"><figcaption>Notice that the real margin is a ratio of totals, not an average of percentages.</figcaption></figure>

## 4. Habits that make you look experienced

1. **Explicit measures only.** Don't drag the Amount column into a visual (an "implicit measure"); write `Total Sales`. Then you can format it once, reuse it and build on it.
2. **Clear names with spaces:** `Total Sales`, `Order Lines`, not `Measure 3` or `SumAmt`.
3. **A measures table:** Home > Enter data, an empty table named `_Measures`, and set each measure's Home table to it, so measures are easy to find.
4. **Format at the measure:** currency, thousands separators, decimal places.
5. **Always use the table name for columns** (`Sales[Amount]`) and never for measures (`[Total Sales]`), so a reader can tell them apart.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** an aggregation looks at the rows of its table that are visible in the current filter context and reduces them to one value.

**Equations:** for the visible rows `$R$` of Sales,

```math
\text{SUM} = \sum_{r \in R} \text{Amount}_r, \qquad \text{COUNTROWS} = |R|, \qquad \text{DISTINCTCOUNT} = |\{\text{ProductKey}_r : r \in R\}|
```

**Try it:** a store has 3 lines: product 4 twice and product 7 once. COUNTROWS = 3, DISTINCTCOUNT(ProductKey) = 2.
</details>

## 5. Worked example

*How many products did each store sell in 2025?* `Products Sold = DISTINCTCOUNT(Sales[ProductKey])`, split by Store, with a Year slicer on 2025. Every store sells all 12 products, so the answer is 12 everywhere: not interesting. The useful version is "products with fewer than 10 units sold", which needs FILTER (Lesson 5.4). Base measures first, then questions.

## 6. Practice

1. Write `Average Quantity` per order line two ways: with AVERAGE, and with DIVIDE of two measures. Are they the same?
2. What is the difference between `COUNT(Sales[Quantity])` and `COUNTROWS(Sales)` if some Quantity values were blank?
3. Why is `[Total Sales]` written without a table name?

<details>
<summary>Answers</summary>

1. `AVERAGE(Sales[Quantity])` and `DIVIDE(SUM(Sales[Quantity]), COUNTROWS(Sales))`. Same here, because there are no blank quantities; with blanks, AVERAGE skips them while COUNTROWS still counts the rows.
2. COUNT skips blank quantities; COUNTROWS counts every row.
3. It's a measure; measures belong to the model, not to a table's rows, and the naming habit makes that visible.
</details>
