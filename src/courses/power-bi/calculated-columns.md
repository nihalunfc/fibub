---
title: Calculated columns or measures?
seoTitle: 'Calculated column vs measure in Power BI: when to use each'
summary: A calculated column is worked out once per row and stored; a measure is worked out on demand for each cell of a visual. Try both on the same margin calculation and learn when each is right.
minutes: 16
updated: 2026-11-22
quiz:
  - q: When is a calculated column worked out?
    choices: ['Every time a visual changes', 'When the data is refreshed, once per row, and the result is stored', 'Never']
    ans: 1
    why: Columns are computed at refresh and stored in the model, taking memory. Measures are computed at query time.
  - q: You want to put "Price band" (Budget, Mid, Premium) on a slicer. Column or measure?
    choices: ['A measure', 'A calculated column (or better, a Power Query column), because slicers and axes need values stored per row', 'Neither works']
    ans: 1
    why: Slicers, rows and axes group by stored values. Measures return one number per cell and can't be used to group.
  - q: Why is Margin % better as a measure than as a column summed up?
    choices: ['Columns can''t hold percentages', 'Adding up row-level percentages gives nonsense; the measure divides total margin by total sales for each cell', 'Measures are always faster']
    ans: 1
    why: Percentages don't add. A ratio must be worked out from the totals in the current filter context, which only a measure can do.
---

**Module 3 · about 16 minutes · read first: 3.1.** You'll be able to choose between a calculated column and a measure, and write both.

## 1. Why this matters

Beginners make everything a calculated column because it feels like Excel. Models then grow huge and ratios come out wrong. Knowing the difference is one of the first things a Power BI interview checks.

## 2. The difference in one table

| | Calculated column | Measure |
|---|---|---|
| Worked out | at refresh, once per row | when a visual asks, once per cell |
| Stored? | yes, takes memory | no |
| Has a current row? | yes (row context) | no (filter context) |
| Can go on a slicer, axis or rows | yes | no |
| Good for | attributes to group or filter by | numbers that must respect filters: totals, ratios, time comparisons |

## 3. Try a column

A calculated column has a current row, so it can use the row's columns directly:

<!--fig:dax-pad calc-column-margin-->

## 4. The same thing as a measure

Instead of storing a margin for 7,328 rows, a measure can work it out on demand with an iterator (`SUMX`, Lesson 4.3):

<!--fig:dax-pad measure-margin-->

Both give the same totals. The measure takes no memory and works in any visual. In a model with 50 million rows, that difference matters a lot.

## 5. Where columns are right

Use a column when you need to **group or filter by** the result: a price band, an age group, "Weekend / Weekday", a product's category copied into Sales (rarely needed, since relationships already do that). And prefer to create such columns in **Power Query** or the source, which compresses better and keeps DAX for calculations. A good rule from the Power BI community: *"as far upstream as possible, as far downstream as necessary"*.

Columns can follow relationships with `RELATED`:

<!--fig:dax-pad related-category-->

<details class="maths" open>
<summary>Principle</summary>

**Principle:** columns describe rows; measures summarise sets of rows. If the answer depends on which rows are selected (a total, an average, a ratio, "vs last year"), it's a measure. If it's a fact about one row that never depends on the report, it can be a column.

**Ratios:** for Margin % the correct value for a group is `ΣMargin / ΣSales`, not the sum or average of row percentages. Only a measure computes the sums in the current filter context first.
</details>

## 6. Worked example

*Margin % by category.* A column `Sales[Margin %] = DIVIDE(Sales[Amount] - Sales[Quantity] * Sales[UnitCost], Sales[Amount])` summed in a visual gives values like 3,412 %: nonsense, because it adds percentages. Averaging them weights a $15 sale the same as a $500 one. The measure `Margin % = DIVIDE([Total Margin], [Total Sales])` divides the totals for each category: Electronics about 49 %, Grocery about 42 %, Home and Outdoor about 54 %.

## 7. Practice

1. Column or measure: (a) Sales last year, (b) "Big order" flag when Amount > 100, (c) Average price per unit?
2. Why can't you put a measure on a slicer?
3. Where else could you create a "Weekend" column instead of DAX?

<details>
<summary>Answers</summary>

1. (a) Measure. (b) Column (you'd filter by it). (c) Measure (total amount ÷ total quantity).
2. A slicer lists stored values to filter by; a measure has no stored values, only a result per cell.
3. In Power Query (Add column > Conditional column) or in the date table itself.
</details>
