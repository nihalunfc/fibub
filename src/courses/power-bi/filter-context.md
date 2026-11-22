---
title: 'Filter context: what a measure sees'
seoTitle: 'DAX filter context explained visually'
summary: Every cell of every visual evaluates the measure with its own set of filters. See exactly which rows a measure sees, where the filters come from, and how they travel through relationships.
minutes: 16
updated: 2026-11-22
quiz:
  - q: Where does a cell's filter context come from?
    choices: ['Only slicers', 'The visual''s row and column headers, slicers, cross-highlighting and the filters pane, all combined', 'The measure''s name']
    ans: 1
    why: Every source of filtering adds to the filter context of each cell. The measure is then evaluated over the rows that pass all of them.
  - q: Why is the total row of a table not always the sum of the rows above?
    choices: ['Power BI adds wrong', 'The total cell has its own filter context (without the row filter), and the measure is evaluated again in it', 'Totals are typed in']
    ans: 1
    why: Totals are evaluated, not added. For SUM they match; for ratios, distinct counts and more complex measures they often don't, and that's correct.
  - q: A filter on Store[Region] = "East" reaches which tables in Northbay?
    choices: ['Store, then Sales and Targets', 'Store only', 'All tables, including Product']
    ans: 0
    why: 'Filters flow from Store (one side) to every many side related to it: Sales and Targets. They don''t reach Product or Date.'
---

**Module 5 · about 16 minutes · read first: 3.2 and 4.3.** You'll be able to describe the filter context of any cell and predict what a measure will return.

## 1. Why this matters

Filter context is the single most important idea in DAX. Once you can picture it, CALCULATE, ALL, time intelligence and "why is my total wrong?" all make sense. Senior interviewers almost always ask you to explain it.

## 2. See it

<!--fig:dax-pad fc-see-->

Each row of the result is a separate evaluation of the same measure. For East, Power BI filters Store to the rows with Region = East (just Rideau), the filter flows along the relationship to Sales, and `SUM` adds up the Amount of only those rows.

Follow the filters from the slicers down to the rows that the measure adds up.

<div class="steps" data-fig="@biz-filter-steps">

<div class="step">No filter: every row counts and the total is $870.</div>

<div class="step">Store = Rideau: the slicer filters the Store table, and the filter flows to Sales. Only Rideau rows remain.</div>

<div class="step">Category = Home as well: both filters apply together, so only Rideau AND Home rows remain.</div>

<div class="step">The measure SUM(Sales[Amount]) adds the amounts of the rows left. Now change the slicers yourself.</div>

</div>

## 3. Where filters come from

For any cell, the filter context combines:

1. **The visual's own coordinates:** the row (and column) labels of a table or matrix, the bar's category, the point's date.
2. **Slicers** on the page.
3. **Cross-filtering:** a bar clicked in another visual.
4. **The Filters pane:** visual, page and report filters.
5. **Row-level security** for the person viewing (Lesson 8.2).

All of them are combined (AND). A filter on one column and a filter on another must both be true.

<!--fig:dax-pad fc-slicer-->

## 4. Totals are evaluated, not added

The total row has a filter context too: everything except the row's own label. For `SUM`, the total equals the sum of the rows. For a ratio or a distinct count it usually doesn't, and that's correct: total margin % is total margin ÷ total sales, and a product sold in 3 stores is still one product in the total. When someone says "the total is wrong", first ask what the total should mean.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** a measure has no inputs except the filter context. Write down the filters for a cell, apply each to its table, follow the relationships to the fact table, and you know exactly which rows the measure aggregates.

**Equation:** with filters `$F_1, \dots, F_k$`, the rows a measure on Sales sees are

```math
R = \{\, r \in \text{Sales} : r \text{ passes every } F_i \text{ (directly or through its related rows)} \,\}
```

**Try it:** a matrix cell at Region = West, Year = 2025, with a slicer Category = Home. Which Sales rows count? (Lines in West stores, in 2025, for Home products.)
</details>

Try it: press Play in column mode, then switch to Measure and use the Store slicer.

<figure class="fig" data-fig="@biz-row-vs-filter"><figcaption>Notice that a column is worked out row by row and stored, and a measure is worked out for whatever the filters leave.</figcaption></figure>

## 5. Worked example

*"Products Sold" shows 12 for every store and 12 in the total.* That's not a bug: every store sold every product, so each store's distinct count is 12, and the whole chain's distinct count is also 12, not 60. The total cell's filter context has no store filter, so DISTINCTCOUNT sees all stores' rows and still finds 12 different products.

## 6. Practice

1. Write the filter context of the cell "Queen Street, 2024" in a matrix with stores on rows and years on columns, with a Region slicer on Central.
2. Why does the Forks Market row disappear when you split by Store with a 2024 Year filter?
3. In the slicer editor above, what would happen if the slicer selected Home and Outdoor?

<details>
<summary>Answers</summary>

1. Store = Queen Street, Year = 2024, Region = Central. All three must hold.
2. Forks Market had no 2024 sales, so the measure is blank and the visual hides rows where every value is blank.
3. Each cell would see Sales lines of both categories for that store.
</details>
