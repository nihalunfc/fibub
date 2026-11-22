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
sources:
  - 'SQLite documentation, SELECT: Generation of the set of result rows (GROUP BY) https://www.sqlite.org/lang_select.html'
  - 'Microsoft Learn, SELECT - GROUP BY (Transact-SQL) https://learn.microsoft.com/en-us/sql/t-sql/queries/select-group-by-transact-sql'
  - 'PostgreSQL documentation, The GROUP BY and HAVING Clauses https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-GROUP'
---

**Module 3 · about 30 minutes · read first: 3.1.** You'll be able to split a table into groups, get one summary row per group, group by more than one column, and fix the "not in GROUP BY" error.

<div class="bigidea">GROUP BY sorts rows into groups that share a value, then each aggregate runs once per group, giving one summary row per group.</div>

**In everyday terms:** sorting laundry into baskets by colour, then counting each basket. You end up with one line per basket ("whites: 12, darks: 9"), not one per sock.

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

<div class="meaning">

<dl>
<dt>GROUP BY col</dt><dd>Put rows with the same value of col into one group.</dd>
<dt>Group</dt><dd>All the rows that share that value. Every row is in exactly one group.</dd>
<dt>Grouping column</dt><dd>A column named in GROUP BY. It has one value per group, so it can be shown.</dd>
<dt>GROUP BY a, b</dt><dd>Each different pair of values is a group.</dd>
<dt>Golden rule</dt><dd>Every SELECT column is either in GROUP BY or inside an aggregate.</dd>
<dt>Physical meaning</dt><dd>The output has one row per different value (or pair) of the grouping columns. The group counts always add back up to the rows that went in.</dd>
</dl>

</div>

<div class="myth">

**"I can show any column next to a group total."** One output row stands for a whole group, so a column that differs inside the group has no single value to show. SQLite quietly picks one at random; other databases refuse. Add the column to GROUP BY (smaller groups) or wrap it in an aggregate such as MIN().

</div>

Watch the query above run, one step at a time (its **Show how it runs** button animates the same thing in colour):

<div class="steps">
<div class="step"><b>FROM mini_orders.</b> <table class="lk-tbl"><tr><th>order</th><th>customer_id</th><th>amount</th></tr><tr><td>101</td><td>1</td><td>45</td></tr><tr><td>102</td><td>1</td><td>5</td></tr><tr><td>103</td><td>2</td><td>20</td></tr><tr><td>104</td><td>3</td><td>90</td></tr><tr><td>105</td><td>3</td><td>45</td></tr><tr><td>106</td><td>9</td><td>60</td></tr></table></div>
<div class="step"><b>GROUP BY customer_id.</b> Four groups: {101, 102}, {103}, {104, 105}, {106}.</div>
<div class="step"><b>COUNT(*) and SUM(amount) per group.</b> Each group squeezes into one row. <table class="lk-tbl"><tr><th>customer_id</th><th>orders</th><th>spent</th></tr><tr><td>1</td><td>2</td><td><mark>50</mark></td></tr><tr><td>2</td><td>1</td><td>20</td></tr><tr><td>3</td><td>2</td><td><mark>135</mark></td></tr><tr><td>9</td><td>1</td><td>60</td></tr></table></div>
<div class="step"><b>Check.</b> 2 + 1 + 2 + 1 = 6 orders and 50 + 20 + 135 + 60 = 265: the groups add back to the whole table.</div>
</div>

<div class="problem" data-problem="sql-group-sum"></div>

Step through the four stages, then change the aggregate and raise the HAVING bar.

<div class="steps" data-fig="@data-groupby-buckets">
<div class="step">Start with the plain table: ten rows, each with a region and an amount.</div>
<div class="step">Split: every row slides into the bucket for its region.</div>
<div class="step">Apply: the aggregate is worked out inside each bucket on its own.</div>
<div class="step">Combine: each bucket collapses to one result row. HAVING now removes whole groups.</div>
</div>


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

<div class="keypoints">

- GROUP BY makes one output row per different value of the grouping columns.
- Aggregates then run once per group instead of once for the whole table.
- With two grouping columns, each different pair is a group.
- All NULLs fall into one group of their own.
- Every SELECT column must be grouped or aggregated; SQLite's leniency here hides mistakes.

</div>

**New words:** *GROUP BY*, *group*, *partition*, *equivalence class*, *grouping column*.
