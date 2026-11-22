---
title: Relationships, cardinality and filter direction
seoTitle: 'Power BI relationships: cardinality and filter direction'
summary: Relationships let a filter on one table reach another. Learn one-to-many, many-to-many and one-to-one, which way filters flow, and why single direction is the safe default.
minutes: 16
updated: 2026-11-22
quiz:
  - q: In a one-to-many relationship between Product and Sales, which way do filters flow by default?
    choices: ['From Sales to Product', 'From Product (one side) to Sales (many side)', 'Both ways always']
    ans: 1
    why: Filters flow from the one side to the many side. Picking a category keeps only that category's sales lines.
  - q: Store filters Sales. Does a Store filter change COUNTROWS(Product) with single direction?
    choices: ['Yes', 'No: the filter reaches Sales but does not travel back up to Product', 'Only on Mondays']
    ans: 1
    why: Single-direction filters stop at the many side. To count products sold in a store, count in the fact table instead, e.g. DISTINCTCOUNT(Sales[ProductKey]).
  - q: Why is "both directions" risky?
    choices: ['It is not allowed', 'It can create ambiguous paths between tables and slow the model', 'It deletes data']
    ans: 1
    why: With several bidirectional relationships there can be two routes between tables, and filters can arrive in surprising ways. Use it only when needed, or use CROSSFILTER in one measure.
---

**Module 3 · about 16 minutes · read first: 3.1.** You'll be able to create relationships, read cardinality and predict which tables a filter reaches.

## 1. Why this matters

A relationship is a promise: "a filter on this table should affect that one". Most wrong totals come from a missing relationship, a wrong key, or a filter flowing the wrong way. Understanding the flow is the foundation of DAX's filter context.

## 2. The idea in one picture

Click a filter, then tick "both directions" and click a store again:

<!--fig:filter-flow-->

## 3. Cardinality

| Type | Example | Notes |
|---|---|---|
| **One-to-many (1:\*)** | Product → Sales | The normal case: the key is unique on the one side |
| **Many-to-one (\*:1)** | Sales → Product | The same relationship seen from the other end |
| **One-to-one (1:1)** | Product → ProductExtra | Usually means the two tables should be merged into one |
| **Many-to-many (\*:\*)** | Targets (month) ↔ Date (day) | Neither key is unique; use with care, or bridge it |

Power BI detects cardinality from the data. If it says many-to-many where you expected one-to-many, the "one" side has a duplicate key: find it (Group by the key, count rows, filter > 1) and fix it in Power Query.

## 4. Filter direction

**Single** (the default): filters flow from the one side to the many side. Product and Store filter Sales; Sales doesn't filter Product.

**Both**: filters flow both ways. Tempting for "products sold in this store", but with several such relationships the model can have two paths between tables, and Power BI may block it or pick a route you didn't expect. Better options:

- Count in the fact table: `Products Sold = DISTINCTCOUNT(Sales[ProductKey])`.
- Turn on both directions for one measure only with `CROSSFILTER` inside `CALCULATE` (an advanced function).

<!--fig:dax-pad filter-direction-->

## 5. Active and inactive relationships

Only one relationship between two tables can be **active** (solid line). If Sales had both an OrderDate and a ShipDate, only one could actively relate to Date; the other is **inactive** (dashed) and is switched on inside a measure with `USERELATIONSHIP`. Many teams instead load Date twice (Order Date and Ship Date tables), which is clearer for report users.

<details class="maths" open>
<summary>Principle</summary>

**Principle:** a filter on a table keeps some of its rows; the relationship then keeps only the many-side rows whose key is among the kept keys. Repeat along every relationship in the filter direction. That is all a relationship does, and it is exactly the "propagate" step in the editor's "Show me what happened".

**Try it:** with single direction, does a filter on Targets reach Sales? (No: both are many sides of Store; filters don't flow from a many side up to Store and back down.)
</details>

## 6. Worked example

*The Region slicer filters sales but the target card doesn't move.* Check Model view: Targets has no relationship to Store. Drag `Targets[StoreKey]` to `Store[StoreKey]`; now the slicer on Store[Region] flows to both fact tables, and sales and targets agree.

## 7. Practice

1. Power BI made Sales–Product many-to-many. What do you check first?
2. Which tables does a filter on `'Date'[Year]` reach in the Northbay model?
3. How do you count products sold in each store without a bidirectional relationship?

<details>
<summary>Answers</summary>

1. Whether ProductKey is unique in Product (look for duplicate keys).
2. Date and Sales. Not Targets (no relationship to Date), not Product or Store.
3. `DISTINCTCOUNT(Sales[ProductKey])`, split by Store.
</details>
