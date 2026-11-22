---
title: ALL, REMOVEFILTERS and percent of total
seoTitle: 'DAX ALL, ALLEXCEPT, ALLSELECTED: percent of total'
summary: Remove filters to get the denominator for share of total. Learn ALL, REMOVEFILTERS, ALLEXCEPT and ALLSELECTED, and when each one gives the percentage people expect.
minutes: 18
updated: 2026-11-22
quiz:
  - q: What does CALCULATE([Total Sales], ALL(Product)) return on the Home row?
    choices: ['Home sales', 'Sales of all products (the Product filters are removed)', 'Blank']
    ans: 1
    why: ALL(Product) removes every filter on Product, so the Home row sees all categories. Dividing Home sales by it gives Home's share.
  - q: A Region slicer is set to West. Which denominator makes each store's share add up to 100 % in the visual?
    choices: ['ALL(Store)', 'ALLSELECTED(Store)', 'ALLEXCEPT(Store, Store[Store])']
    ans: 1
    why: ALLSELECTED removes the visual's own row filters but keeps outside filters like the slicer, so the denominator is all West stores.
  - q: What does ALLEXCEPT(Store, Store[Region]) keep?
    choices: ['Every filter', 'Only an existing filter on Region; other Store filters are removed', 'It always filters the current store''s region']
    ans: 1
    why: It removes all filters on Store except one on Region, if such a filter exists. With only Store on the rows there is none, so the result is the whole chain; use ALL(Store) with VALUES(Store[Region]) for share of region.
---

**Module 5 · about 18 minutes · read first: 5.2.** You'll be able to write share-of-total measures that behave correctly with slicers.

## 1. Why this matters

"What percentage of sales is this?" is asked in every report. The numerator is easy; the denominator needs filters removed, and choosing which filters to remove is the skill.

## 2. Share of all categories

<!--fig:dax-pad a-share-->

Trace the Home row: CALCULATE removes the filters on Product (and on any table Product looks up), so the denominator sees every Sales row.

`REMOVEFILTERS(Product)` does the same as `ALL(Product)` inside CALCULATE and reads more clearly. `ALL` also works as a table function (a list of all rows or values, ignoring filters), which REMOVEFILTERS doesn't.

## 3. Share of my group

<!--fig:dax-pad a-region-share-->

On the Falls Centre row, `VALUES(Store[Region])` is evaluated first, in the row's context, and gives {West}. CALCULATE then removes every filter on Store with `ALL(Store)` and sets Region to West: the denominator is all West stores.

Why not `ALLEXCEPT(Store, Store[Region])`? It keeps a filter on Region **only if there is one**. With just Store on the rows, the only filter is on Store[Store], so ALLEXCEPT removes it and you get the whole chain. ALLEXCEPT works when Region itself is in the visual or a slicer, for example a matrix with Region and Store on the rows. The ALL + VALUES pattern works either way.

## 4. ALL or ALLSELECTED?

<!--fig:dax-pad a-allselected-->

With the slicer on West, `ALL(Store)` divides by the whole chain, so West stores add up to about 49 %. `ALLSELECTED(Store)` divides by what the visual shows (the West stores), so they add up to 100 %. Ask the manager which one they mean: "share of the company" or "share of what I've selected".

<details class="maths" open>
<summary>Principle</summary>

**Principle:** share = (measure in the current context) ÷ (same measure in a wider context). The function you pick decides how wide:

| Denominator | Removes | Keeps |
|---|---|---|
| `ALL(Table)` | all filters on the table (and tables it looks up) | everything else |
| `ALL(Table[Col])` | filters on that column | everything else |
| `ALLEXCEPT(Table, Table[Col])` | all filters on the table except that column | that column, other tables |
| `ALLSELECTED(Table)` | filters added by the visual itself | slicers and outside filters |
| `REMOVEFILTERS()` | every filter in the model | nothing |
</details>

Try it: set a Category slicer, then compare the plain measure with the CALCULATE versions.

<figure class="fig" data-fig="@biz-calculate-modes"><figcaption>Notice that CALCULATE with a column filter overrides the slicer, KEEPFILTERS keeps both, and ALL removes it.</figcaption></figure>

## 5. Worked example

*Category share by region.* In a matrix with regions on rows and categories on columns, `Share of Region = DIVIDE([Total Sales], CALCULATE([Total Sales], ALL(Product)))` shows, for each region, how its sales split across categories: each row adds up to 100 %. Swap to `ALL(Store)` and each column adds up to 100 % instead, which answers "where are Home products sold?".

## 6. Practice

1. Write `Share of Year` for months: each month's sales ÷ its year's sales.
2. Why can't you use ALL(Sales[Amount]) for share of total?
3. Which denominator would you use for a pie chart that must always add to 100 % whatever slicers are set?

<details>
<summary>Answers</summary>

1. `DIVIDE([Total Sales], CALCULATE([Total Sales], ALL('Date'), VALUES('Date'[Year])))`.
2. It removes filters on the Amount column only, but the visual filters Product or Store, not Amount, so nothing changes.
3. ALLSELECTED on the pie's category table.
</details>
