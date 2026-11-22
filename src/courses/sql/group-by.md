---
title: 'GROUP BY: one row per group'
seoTitle: 'SQL GROUP BY explained with examples and animations'
summary: 'GROUP BY splits a table into groups and gives one summary row per group: orders per channel, sales per month, customers per province. Watch the groups form step by step.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'SELECT channel, COUNT(*) FROM orders GROUP BY channel returns how many rows?'
    choices: ['One per order', 'One per different channel', 'Always one']
    ans: 1
    why: GROUP BY makes one output row for each different value of the grouping column. Northbay has two channels.
  - q: 'Which columns may appear in SELECT with GROUP BY store_id?'
    choices: ['Any column', 'store_id and aggregates such as COUNT(*) or SUM(...)', 'Only aggregates']
    ans: 1
    why: Each output row stands for a whole group, so a plain column must be one the group shares (a grouping column). Anything else has to be squeezed with an aggregate.
  - q: Where do rows with a NULL loyalty_tier go in GROUP BY loyalty_tier?
    choices: ['They are dropped', 'All into one NULL group', 'Each into its own group']
    ans: 1
    why: GROUP BY treats all NULLs as one group, so you get a row with a blank tier and its count.
---

**Module 3 · about 30 minutes · read first: 3.1.** You'll be able to split a table into groups, get one summary row per group, group by more than one column, and fix the "not in GROUP BY" error.

## 1. Why this matters

Totals for the whole company are rarely enough. Managers want them broken down: per store, per month, per category, per channel. Each of those is a GROUP BY, and it's the single most used clause in analyst SQL after SELECT, FROM and WHERE. A chart in Power BI or Tableau with a category on one axis is a GROUP BY behind the scenes.

## 2. Groups, then one row each

GROUP BY sorts rows into groups that share a value, then the aggregates run once per group instead of once for the whole table.

```sql
-- try
SELECT customer_id, COUNT(*) AS orders, SUM(amount) AS spent
FROM mini_orders
GROUP BY customer_id
```

Press **Show how it runs**, then **Play**, and watch closely:

- At the GROUP BY step the six rows are coloured by customer: customers 1 and 3 have two rows each, customers 2 and 9 one each.
- At the aggregate step each colour squeezes into one row: customer 1 spent 45 + 5 = 50, customer 3 spent 90 + 45 = 135.
- Six rows in, four rows out: one per group.

## 3. On real data

How many orders came through each channel?

```sql
-- try
SELECT channel, COUNT(*) AS orders
FROM orders
GROUP BY channel
```

What are customers' loyalty tiers? Notice the blank row: all 58 NULL tiers form one group of their own.

```sql
-- try
SELECT loyalty_tier, COUNT(*) AS customers
FROM customers
GROUP BY loyalty_tier
ORDER BY customers DESC
```

GROUP BY and ORDER BY are good friends: group to get the totals, then sort to put the biggest first.

## 4. Grouping by an expression

You can group by anything you can compute. `strftime('%Y', order_date)` takes the year out of a date, so this gives orders per year:

```sql
-- try
SELECT strftime('%Y', order_date) AS year, COUNT(*) AS orders
FROM orders
GROUP BY strftime('%Y', order_date)
```

SQLite (and PostgreSQL) also let you write `GROUP BY year`, using the alias; SQL Server doesn't, so repeating the expression is the portable habit. In SQL Server the year is `YEAR(order_date)`; in PostgreSQL, `EXTRACT(YEAR FROM order_date)`.

## 5. Grouping by two columns

With two grouping columns, each different *pair* is a group:

```sql
-- try
SELECT strftime('%Y', order_date) AS year, channel, COUNT(*) AS orders
FROM orders
GROUP BY strftime('%Y', order_date), channel
ORDER BY year, channel
```

Four groups: two years × two channels. Online grew from 376 orders in 2024 to 683 in 2025.

## 6. The golden rule

Every column in SELECT must either be in GROUP BY or be inside an aggregate. Here's why: one output row stands for a whole group. For the "online" group, which `order_id` should it show? There are 1,059 of them.

```sql
-- noviz
SELECT channel, order_id, COUNT(*) AS orders
FROM orders
GROUP BY channel
```

SQLite is lenient and quietly picks one order_id from each group, which is almost never what you want. SQL Server, PostgreSQL and most others reject this query with an error like "column must appear in the GROUP BY clause or be used in an aggregate function". Treat SQLite's answer as a mistake: either add the column to GROUP BY (more, smaller groups) or wrap it in an aggregate such as `MIN(order_id)`.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** GROUP BY *partitions* the rows: every row lands in exactly one group, and no group is empty. The aggregates are then applied to each group's bag of values. In relational algebra this is γ with grouping columns: γ<sub>channel; COUNT(*)</sub>(orders).

**Equation:** the groups are the *equivalence classes* of the relation "same value in the grouping columns". The number of output rows equals the number of different values (pairs, with two columns): here 2 channels, or 2 years × 2 channels = 4. Group counts always add back up to the total: Σ<sub>g</sub> |g| = |T|, so 1,059 + 3,005 = 4,064.

**Analogy:** sorting laundry into baskets by colour, then counting each basket. It breaks down a little with NULL: NULL ≠ NULL in a WHERE test, yet GROUP BY puts all NULLs in one basket.

**Try it:** grouping customers by province gives 4 groups (ON 372, AB 115, MB 61, BC 55). What do the counts add up to? (603, the number of customers.)
</details>

## 7. Worked example

*Question:* which month of 2025 was busiest, and how much busier than the quietest?

1. Keep 2025: `WHERE order_date LIKE '2025%'`.
2. Group by month: `strftime('%m', order_date)` gives '01' to '12'.
3. Count orders per group, then sort.

```sql
-- try
SELECT strftime('%m', order_date) AS month, COUNT(*) AS orders
FROM orders
WHERE order_date LIKE '2025%'
GROUP BY strftime('%m', order_date)
ORDER BY orders DESC
```

4. December leads with **304** orders (Christmas plus Boxing week). The quietest is February with **124**. 304 / 124 ≈ 2.5, so December was about two and a half times as busy as February. A store manager planning staff rotas would want exactly this table.

## 8. Practice

```sql
-- exercise: Count the returns for each reason, most common reason first.
-- hint: GROUP BY reason, COUNT(*), then ORDER BY the count DESC.
SELECT reason
FROM returns
-- answer:
SELECT reason, COUNT(*) AS returns
FROM returns
GROUP BY reason
ORDER BY returns DESC
```

```sql
-- exercise: For each store_id, count its orders in 2025. Biggest first.
-- hint: WHERE for the year, GROUP BY store_id, ORDER BY the count DESC.
SELECT store_id, COUNT(*) AS orders
FROM orders
GROUP BY store_id
-- answer:
SELECT store_id, COUNT(*) AS orders
FROM orders
WHERE order_date LIKE '2025%'
GROUP BY store_id
ORDER BY orders DESC
```

```sql
-- exercise: Find the total units sold of each product. Show product_id and units, top 3 only.
-- hint: GROUP BY product_id, SUM(quantity), ORDER BY units DESC, LIMIT 3.
SELECT product_id, quantity
FROM order_items
LIMIT 3
-- answer:
SELECT product_id, SUM(quantity) AS units
FROM order_items
GROUP BY product_id
ORDER BY units DESC
LIMIT 3
```

**Try it on your own data:** [[csv-profiler]] shows the most common values in every column of a CSV, a quick GROUP BY without writing SQL.

**New words:** *GROUP BY*, *group*, *partition*, *equivalence class*, *grouping column*.
