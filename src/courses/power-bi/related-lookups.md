---
title: RELATED and looking things up
seoTitle: 'DAX RELATED and LOOKUPVALUE explained'
summary: RELATED fetches a value from the one side of a relationship for the current row. Use it in calculated columns and inside iterators, and know when LOOKUPVALUE or RELATEDTABLE is the right tool.
minutes: 14
updated: 2026-11-22
quiz:
  - q: Where can RELATED(Product[Category]) be used?
    choices: ['Anywhere', 'Where there is a current row of a table on the many side, such as a Sales calculated column or inside SUMX(Sales, ...)', 'Only in Power Query']
    ans: 1
    why: RELATED follows the relationship from the current row. Without a row context there is no row to start from.
  - q: Which direction does RELATED go?
    choices: ['From the many side to the one side (Sales to Product)', 'From the one side to the many side', 'Either']
    ans: 0
    why: Each Sales row has exactly one Product, so RELATED returns one value. To go the other way (one product, many sales) use RELATEDTABLE.
  - q: What does RELATEDTABLE(Sales) return in a Product calculated column?
    choices: ['One value', 'The Sales rows for the current product', 'All Sales rows']
    ans: 1
    why: RELATEDTABLE goes from the one side to the many side, returning the related rows. COUNTROWS(RELATEDTABLE(Sales)) counts each product's order lines.
---

**Module 4 · about 14 minutes · read first: 4.3.** You'll be able to look up values across relationships in columns and iterators.

## 1. Why this matters

Calculations often need a value from another table: the list price from Product, the region from Store. RELATED gets it without merging tables, which keeps the model a clean star.

## 2. RELATED inside an iterator

Product[UnitPrice] holds the 2024 list price, while Sales[UnitPrice] holds what was actually charged. Compare them:

<!--fig:dax-pad r-list-price-->

In 2025 Northbay charged about 4 % more than the 2024 list price, so `Total Sales` is higher than `At List Price` for 2025. Show me what happened on a 2025 row shows SUMX working out a list-price value for every line.

## 3. RELATED in a calculated column

<!--fig:dax-pad r-region-col-->

This works, but think twice before adding it to a real model: the relationship already lets `Store[Region]` filter Sales. A copied column only earns its place when you need it inside a Sales-level calculation.

## 4. Other lookups

| Function | Direction | Use |
|---|---|---|
| `RELATED(Dim[col])` | many → one, one value | inside Sales rows, fetch the product's category |
| `RELATEDTABLE(Fact)` | one → many, a table | in a Product column: `COUNTROWS(RELATEDTABLE(Sales))` |
| `LOOKUPVALUE(result, search col, value)` | no relationship needed | fetch from a table with no relationship (slower, use sparingly) |

<details class="maths" open>
<summary>Principle</summary>

**Principle:** a many-to-one relationship guarantees exactly one row on the one side for each row on the many side, so a lookup from Sales to Product always gives one value. The other way gives a set of rows, so it returns a table.

**Try it:** in a Store calculated column, what does `COUNTROWS(RELATEDTABLE(Sales))` give for Forks Market? (Its number of order lines, all in 2025.)
</details>

## 5. Worked example

*Discount compared with list price.* `Discount Given = SUMX(Sales, Sales[Quantity] * (RELATED(Product[UnitPrice]) - Sales[UnitPrice]))`. For 2024 it's 0 (prices equal the list); for 2025 it's negative, which tells you prices rose. A real retailer would use this to track promotions.

## 6. Practice

1. Write a Sales calculated column `Line Cost` = Quantity × the product's UnitCost from Product.
2. In a Product calculated column, count the stores that sold the product. (Hint: DISTINCTCOUNT on a RELATEDTABLE needs CALCULATE; try `CALCULATE(DISTINCTCOUNT(Sales[StoreKey]))`, Lesson 5.5 explains why.)
3. Why does RELATED fail in a plain measure?

<details>
<summary>Answers</summary>

1. `Sales[Line Cost] = Sales[Quantity] * RELATED(Product[UnitCost])`.
2. `Product[Stores] = CALCULATE(DISTINCTCOUNT(Sales[StoreKey]))`: CALCULATE turns the current product row into a filter on Sales.
3. A measure has no current row, so there's no row to follow the relationship from.
</details>
