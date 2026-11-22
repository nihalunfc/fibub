---
title: Ranking and top N
seoTitle: 'DAX RANKX and TOPN: rank and top N with examples'
summary: Rank products, stores or days with RANKX, return the top N with TOPN, and avoid the classic traps with the total row, ties and filters.
minutes: 16
updated: 2026-11-22
quiz:
  - q: Why does RANKX(Product, [Total Sales]) often rank every product 1?
    choices: ['RANKX is broken', 'Product is filtered to the current product, so it ranks among a list of one; use ALL(Product[Product])', 'The data has ties']
    ans: 1
    why: The table argument is evaluated in the current filter context. On a product row only that product is visible, so it's always first. ALL widens the list.
  - q: Two products tie for 2nd place. With RANKX's default ties setting, what rank does the next product get?
    choices: ['3', '4 (ranks are skipped after a tie)', '2']
    ans: 1
    why: The default (SKIP) leaves a gap after ties, like sports rankings. Use DENSE as the fifth argument for 1, 2, 2, 3.
  - q: What does TOPN(3, VALUES(Product[Product]), [Total Sales]) return?
    choices: ['A number', 'A table with the 3 products with the highest sales (more if tied at third place)', 'The 3rd product only']
    ans: 1
    why: TOPN returns a table of rows, sorted by the expression, keeping ties at the cut-off. Use it in a query or as a filter in CALCULATE.
---

**Module 5 · about 16 minutes · read first: 5.3 and 5.5.** You'll be able to rank items and return the top N in measures and queries.

## 1. Why this matters

"Top 10 products", "bottom 5 stores", "where does this store rank?" appear in nearly every dashboard and in many interview exercises.

## 2. RANKX

<!--fig:dax-pad rk-rank-->

`RANKX(table, expression, [value], [order], [ties])` evaluates the expression for each row of the table (with context transition), then finds where the current value fits. Three things to remember:

1. **Widen the table:** `ALL(Product[Product])`, or `ALLSELECTED(Product[Product])` to rank among what's selected in a slicer.
2. **Order:** descending by default (biggest = 1). Use `ASC` for "lowest cost = 1".
3. **The total row** gets rank 1 here, because the grand total is bigger than any product. Hide it with `IF(ISINSCOPE(Product[Product]), RANKX(…))`, which returns blank outside product rows.

## 3. TOPN

<!--fig:dax-pad rk-top3-->

`TOPN(n, table, orderBy, [order])` returns the top rows as a table. In a measure, use it as a filter:

```
Top 3 Products Sales =
CALCULATE([Total Sales], TOPN(3, ALL(Product[Product]), [Total Sales]))
```

In a report, the visual-level **Top N filter** (Filters pane > Filter type > Top N) does the same without DAX, which is often simpler. DAX is needed when the top N must feed another calculation, such as "share of sales from the top 3 products".

<details class="maths" open>
<summary>Principle</summary>

**Principle:** with the default ties setting, the rank of a value `$v$` among values `$x_1, \dots, x_n$` (descending) is

```math
\text{rank}(v) = 1 + \#\{\, i : x_i > v \,\}
```

so ties share a rank and the next one skips. DENSE counts distinct larger values instead.

**Try it:** sales 90, 70, 70, 40. Default ranks: 1, 2, 2, 4. Dense: 1, 2, 2, 3.
</details>

## 4. Worked example

*Rank stores within the selected region.* `Store Rank = IF(ISINSCOPE(Store[Store]), RANKX(ALLSELECTED(Store[Store]), [Total Sales]))`. With the Region slicer on West, Falls Centre is 1, Harbour Front 2, Forks Market 3; clear the slicer and Queen Street jumps to 1. ALLSELECTED makes the ranking follow the slicer, and ISINSCOPE hides the meaningless total.

## 5. Practice

1. Write `Store Rank` among all stores (ignoring slicers).
2. Write a query for the 2 lowest-selling products.
3. Why might a top 3 table show 4 rows?

<details>
<summary>Answers</summary>

1. `RANKX(ALL(Store[Store]), [Total Sales])`.
2. `EVALUATE TOPN(2, ADDCOLUMNS(VALUES(Product[Product]), "Sales", [Total Sales]), [Sales], ASC)`.
3. A tie at third place: TOPN keeps every row tied at the cut-off.
</details>
