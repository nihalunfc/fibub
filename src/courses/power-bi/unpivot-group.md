---
title: Unpivot, pivot and group by
seoTitle: 'Unpivot and group by in Power Query, with examples'
summary: Spreadsheets are wide; Power BI wants long. Unpivot month columns into rows, pivot back when needed, and group rows to summarise them, watching each step change the table.
minutes: 14
updated: 2026-11-22
quiz:
  - q: A targets sheet has columns Store, Jan, Feb, …, Dec. What shape should it be for Power BI?
    choices: ['Keep 13 columns', 'Unpivot to Store, Month, Target: one row per store per month', 'Transpose it']
    ans: 1
    why: Long tables let one Month column filter and relate. With 12 month columns you would need 12 measures and could not filter by month.
  - q: When you unpivot, which columns do you select before "Unpivot other columns"?
    choices: ['The month columns', 'The columns to keep as they are (Store)', 'All columns']
    ans: 1
    why: Select what should stay (Store) and unpivot the others. New months added later are unpivoted too, which makes refresh safe.
  - q: Why might you avoid Group by in Power Query for the main sales table?
    choices: ['It is slow to type', 'You lose detail: measures can no longer slice by product or day once rows are grouped away', 'Group by is not available']
    ans: 1
    why: Keep facts at the finest grain and let DAX summarise. Group in Power Query only when you truly never need the detail, or to make a separate summary table.
---

**Module 2 · about 14 minutes · read first: 2.2.** You'll be able to reshape wide tables into long ones, and summarise rows with Group by.

## 1. Why this matters

Planning and finance teams send wide spreadsheets: a column per month, a column per store. They are easy for people to read and hard for Power BI to use. Turning them into long tables is a daily job.

## 2. Unpivot in one picture

<!--fig:pq-steps unpivot-->

**Unpivot other columns** (select Store, then Transform > Unpivot columns > Unpivot other columns) turns each month column into rows: 3 stores × 3 months = 9 rows with Store, Attribute, Value. Rename Attribute to Month and Value to Target. Now one `Target` column can be summed, filtered by month and compared with sales.

Use "Unpivot **other** columns" rather than selecting the months: if April appears next month, it is unpivoted automatically.

**Pivot** is the reverse (values of one column become column headers). You'll rarely need it for a model, but it is useful to build a small summary for export.

Drag the slider or press Play to turn a wide table into a long one.

<figure class="fig" data-fig="@biz-unpivot-anim"><figcaption>Notice that the month headings become values in a column of their own.</figcaption></figure>

## 3. Group by

<!--fig:pq-steps group-->

**Transform > Group by** collapses rows that share values in the group columns and computes aggregations (Sum, Count rows, Average, Min, Max) for each group. It's the Power Query version of a pivot table or SQL `GROUP BY`.

When to use it: building a separate summary table, or when the source has far more detail than any report needs (for example, sensor readings every second, when reports only ever look at hours). When not to: on your main fact table, because measures can only slice by what's left. In DAX the same summary is `SUMMARIZECOLUMNS(Store[Store], "Sales", [Total Sales])` (Lesson 5.7), worked out on demand without losing detail.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** tidy data has one column per variable and one row per observation. "Month" is one variable, so it belongs in one column, not twelve.

**Check:** if you would need to change a measure every time a new month, store or product appears, the table is too wide.
</details>

## 4. Worked example

*Northbay's planning team sends targets as a wide sheet: Store plus 12 month columns.* In Power Query: Use first row as headers, select Store, Unpivot other columns, rename to Month and Target, change Month into a proper YearMonth text like `2025-01`, set Target to a decimal number. 5 stores × 12 months = 60 rows. That's exactly the shape of the Targets table in the course data.

## 5. Practice

1. A sheet has Product plus columns Q1, Q2, Q3, Q4. How many rows after unpivoting 12 products?
2. You grouped Sales by Store and Month in Power Query. Now the manager wants sales by category. What happened?
3. Which step turns a list of stores and months back into a table with a column per month?

<details>
<summary>Answers</summary>

1. 12 × 4 = 48 rows.
2. Category was grouped away. Remove the Group by and let a DAX measure summarise instead.
3. Pivot column (Month as the column, Target as the values).
</details>
