---
title: 'Fan-out: when a join copies rows'
seoTitle: 'SQL join duplicates rows? Fan-out explained and fixed'
summary: 'Join a table to two "many" tables and every row gets copied, so SUM and COUNT come out too big. Watch it happen on Northbay order lines and returns, then fix it by aggregating before you join.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'An order has 4 lines and 2 returns. You join order_items to returns on order_id. How many rows does that order make?'
    choices: ['4', '6', '8']
    ans: 2
    why: Each of the 4 lines matches each of the 2 returns, so 4 × 2 = 8 rows. Every line is now counted twice.
  - q: Which fix is safe for both a SUM and a COUNT across two "many" tables?
    choices: ['Add DISTINCT to the SELECT', 'Aggregate each table to the shared grain first, then join the summaries', 'Divide the SUM by 2']
    ans: 1
    why: Summarise each many table to one row per store (or per order) first. Joining one row to one row cannot copy anything.
  - q: 'Why is SUM(DISTINCT line_value) not a real fix?'
    choices: ['It is slower', 'Two different lines with the same value would be counted once', 'SUM DISTINCT does not exist']
    ans: 1
    why: DISTINCT works on values, not rows. Two separate $3.49 lines would collapse into one, so the total would be too small.
---

**Module 4 · about 30 minutes · read first: 4.2 and 3.5.** You'll be able to predict when a join will copy rows, spot an inflated total, and fix it so every SUM and COUNT is right.

## 1. Why this matters

Fan-out is the most common reason a BI report is wrong. The query runs, the numbers look reasonable, and revenue is quietly a few percent too high. Nobody notices until finance compares it with their own figure. Learning to see it before it happens is one of the clearest differences between a junior and a senior analyst, and a favourite interview question.

## 2. A join repeats a row once per match

You saw in [Lesson 4.2](/learn/courses/sql/inner-join/) that Asha appears twice when you join customers to orders, because she has two orders. That is fine if you want one row per order. It goes wrong when you then add up something that belongs to the *customer*.

*Question:* how many customers live in each city? Press **Run**, then **Show how it runs**.

```sql
-- try
SELECT c.city, COUNT(*) AS customers
FROM mini_customers c
JOIN mini_orders o ON o.customer_id = c.id
GROUP BY c.city
```

Toronto shows 4 customers. There are only two: Asha and Chen. Each was copied once per order, so the count measured orders, not people. This copying is called **fan-out**: one row on the "one" side fans out into many rows after joining a "many" side.

The fix here is to count distinct people:

```sql
-- try
SELECT c.city, COUNT(DISTINCT c.id) AS customers
FROM mini_customers c
JOIN mini_orders o ON o.customer_id = c.id
GROUP BY c.city
```

Toronto is now 2. (Ben is the only Ottawa customer with an order; Eli has none, so the inner join drops him.)

## 3. Two "many" tables: the real trap

It gets worse when you join one table to **two** "many" tables. An order has many lines (`order_items`) and can have many returns (`returns`). Join both on `order_id` and every line pairs with every return.

Look at order 2198: 4 lines and 2 returns. Press **Show how it runs** and watch each line match twice.

```sql
-- try
SELECT oi.order_id, oi.product_id,
       oi.quantity * oi.unit_price * (1 - oi.discount) AS line_value,
       r.return_id
FROM order_items oi
JOIN returns r ON r.order_id = oi.order_id
WHERE oi.order_id = 2198
```

8 rows from 4 lines. The order is worth $69.96, but adding up `line_value` here gives $139.92. The **grain** (what one row means, see [Lesson 3.5](/learn/courses/sql/grain/)) has silently changed from "one order line" to "one line-and-return pair".

## 4. Watch a report go wrong

*Question:* for each store, show total revenue and the number of returns. A natural first try:

```sql
-- try
SELECT o.store_id,
       ROUND(SUM(oi.quantity * oi.unit_price * (1 - oi.discount)), 2) AS revenue,
       COUNT(r.return_id) AS returns
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
LEFT JOIN returns r ON r.order_id = o.order_id
GROUP BY o.store_id
ORDER BY o.store_id
```

It runs and looks fine. It is wrong in both columns:

- **Returns** are counted once per *line* of the order, not once each. Store 12 (online) shows 111; the true number is 51. Across the chain, 472 instead of 204.
- **Revenue** is counted once per *return* for the three orders with two returns. Store 12 shows $33,543.04 instead of $33,473.08; store 10 shows $9,513.59 instead of $9,454.69.

The revenue error is small, which makes it dangerous: nobody spots 0.2% by eye.

## 5. The fix: aggregate first, then join

The safe fix is to bring each "many" table down to the grain you want (one row per store) **before** joining them. One row joined to one row cannot copy anything.

`WITH` lets you name each step; you will meet it properly in [Lesson 5.4](/learn/courses/sql/cte/). Read it as "first make `sales`, then make `rets`, then join them":

```sql
-- try
WITH sales AS (
  SELECT o.store_id,
         SUM(oi.quantity * oi.unit_price * (1 - oi.discount)) AS revenue
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.order_id
  GROUP BY o.store_id
),
rets AS (
  SELECT o.store_id, COUNT(*) AS returns
  FROM orders o
  JOIN returns r ON r.order_id = o.order_id
  GROUP BY o.store_id
)
SELECT s.store_id, ROUND(s.revenue, 2) AS revenue, COALESCE(r.returns, 0) AS returns
FROM sales s
LEFT JOIN rets r ON r.store_id = s.store_id
ORDER BY s.store_id
```

Now store 12 has $33,473.08 and 51 returns, matching each table on its own.

Other fixes, and when they are enough:

- **COUNT(DISTINCT key)** fixes counts: `COUNT(DISTINCT r.return_id)` gives 51 for store 12. It does nothing for sums.
- **SUM(DISTINCT ...)** is not a fix. DISTINCT removes repeated *values*, so two separate $3.49 lines would count as one.
- **EXISTS** instead of a join, when you only need to know whether a match exists ([Lesson 4.4](/learn/courses/sql/anti-join/)).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** SQL tables are **bags** (multisets): the same row can appear more than once, and SUM adds every copy. A join multiplies copies.

**Equation:** for one key value k, the join gives |A_k| × |B_k| rows, where A_k and B_k are the rows with key k. Joining order lines L to returns R on order_id gives Σ_k |L_k| · |R_k| rows. A SUM of a line column after the join is Σ_k |R_k| · (sum of L_k), so each order's lines are weighted by its number of returns. It equals the true total only when every |R_k| = 1. Aggregating first, γ_store(L) ⋈ γ_store(R), joins one row to one row: |1| × |1| = 1, so nothing is weighted.

**Analogy:** a group photo. If each person in team A is photographed with each person in team B, someone counting faces in all the photos counts every person several times.

**Try it:** order 2198 has 4 lines and 2 returns. How many times is each line counted after the join? (Twice.)
</details>

## 6. Worked example: how much did fan-out add?

Across all of Northbay:

1. True revenue, from `order_items` alone: **$129,777.78**.
2. After `LEFT JOIN returns` on `order_id`, the same SUM gives **$130,001.59**, $223.81 too much, all from the 3 orders that have 2 returns.
3. True returns: **204** rows in `returns`. After joining to `order_items`, `COUNT(r.return_id)` gives **472**, because each return is repeated once per line of its order.
4. Aggregating each table to one row per store before joining gives the true figures for every store.

A quick check to run on any join you don't fully trust: count the rows before and after (`SELECT COUNT(*) ...`). If the count went up and you didn't expect it, you have fan-out.

## 7. Practice

```sql
-- exercise: Fix the returns count so each return is counted once. Keep the join; change only the COUNT.
-- hint: COUNT(DISTINCT r.return_id) counts each return once, however many lines its order has.
SELECT o.store_id, COUNT(r.return_id) AS returns
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
JOIN returns r ON r.order_id = o.order_id
GROUP BY o.store_id
-- answer:
SELECT o.store_id, COUNT(DISTINCT r.return_id) AS returns
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
JOIN returns r ON r.order_id = o.order_id
GROUP BY o.store_id
```

```sql
-- exercise: Count how many rows the join of order_items to returns (on order_id) makes, next to how many rows returns has on its own. Show both numbers in one row.
-- hint: Two scalar counts: (SELECT COUNT(*) FROM order_items oi JOIN returns r ON r.order_id = oi.order_id) and (SELECT COUNT(*) FROM returns).
SELECT COUNT(*) AS return_rows
FROM returns
-- answer:
SELECT (SELECT COUNT(*) FROM order_items oi JOIN returns r ON r.order_id = oi.order_id) AS joined_rows,
       (SELECT COUNT(*) FROM returns) AS return_rows
```

```sql
-- exercise: For each channel (store or online), show revenue and the number of returns, both correct. Aggregate each table by channel first, then join.
-- hint: Make one summary of revenue by o.channel and one of returns by o.channel, then join them on channel.
SELECT o.channel,
       SUM(oi.quantity * oi.unit_price * (1 - oi.discount)) AS revenue,
       COUNT(r.return_id) AS returns
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id
LEFT JOIN returns r ON r.order_id = o.order_id
GROUP BY o.channel
-- answer:
WITH sales AS (
  SELECT o.channel, SUM(oi.quantity * oi.unit_price * (1 - oi.discount)) AS revenue
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.order_id
  GROUP BY o.channel
),
rets AS (
  SELECT o.channel, COUNT(*) AS returns
  FROM orders o
  JOIN returns r ON r.order_id = o.order_id
  GROUP BY o.channel
)
SELECT s.channel, s.revenue, r.returns
FROM sales s
JOIN rets r ON r.channel = s.channel
```

**New words:** *fan-out*, *bag (multiset)*, *aggregate first*.
