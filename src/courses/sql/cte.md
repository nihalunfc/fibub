---
title: 'CTEs: WITH, step by step'
seoTitle: 'SQL CTE (WITH clause) explained with examples'
summary: 'A CTE gives a subquery a name at the top of your query, so you can build an answer in readable steps. Rewrite nested queries with WITH, chain several steps, and work out each store''s share of Northbay''s revenue.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: What does WITH big AS (SELECT ...) do?
    choices: ['Creates a permanent table called big', 'Names a query result that the rest of this one query can use like a table', 'Makes the query run faster']
    ans: 1
    why: A CTE lives only for the one statement. Nothing is saved; it is a named step you can refer to below it.
  - q: How do you write two CTEs in one query?
    choices: ['WITH a AS (...) WITH b AS (...)', 'WITH a AS (...), b AS (...)', 'You can only have one']
    ans: 1
    why: One WITH, then the CTEs separated by commas. A later CTE can use an earlier one.
  - q: Why do analysts prefer CTEs to deeply nested subqueries?
    choices: ['They read top to bottom in the order the steps happen, and each step can be checked on its own', 'They always run faster', 'Subqueries are being removed from SQL']
    ans: 0
    why: Nested queries read inside out. CTEs read like a recipe, and you can run each step alone to check it. Speed is usually the same.
---

**Module 5 · about 25 minutes · read first: 5.1.** You'll be able to write a query as a series of named steps with WITH, check each step on its own, and turn a hard question into a few easy ones.

## 1. Why this matters

Real analyst queries are often 50 to 200 lines long. Written as subqueries inside subqueries, they become impossible to read or fix. A **CTE** (common table expression) lets you write the same logic as a list of named steps, top to bottom. Most BI teams write nearly all their SQL this way, and code reviewers expect it.

## 2. Naming a step with WITH

A CTE starts with `WITH name AS (query)`, followed by the main query, which uses `name` like a table:

```sql
-- try
WITH big_orders AS (
  SELECT order_id, customer_id, amount
  FROM mini_orders
  WHERE amount >= 45
)
SELECT c.name, b.order_id, b.amount
FROM big_orders b
JOIN mini_customers c ON c.id = b.customer_id
```

Press **Show how it runs**: `big_orders` is built first (four orders of $45 or more), then joined to the customers. Order 106 has no customer, so the inner join drops it and three rows are left. The CTE exists only while this one statement runs; nothing is saved in the database.

## 3. The same query, nested and with WITH

Here is the average-orders-per-customer question from [Lesson 5.1](/learn/courses/sql/subqueries/), rewritten. Compare how it reads:

```sql
-- try
WITH per_customer AS (
  SELECT customer_id, COUNT(*) AS orders
  FROM orders
  WHERE customer_id IS NOT NULL
  GROUP BY customer_id
)
SELECT ROUND(AVG(orders), 2) AS avg_orders_per_customer,
       MAX(orders) AS most_orders
FROM per_customer
```

Same answer, 5.97 and 14, but now it reads in the order it happens: first count per customer, then average. When a number looks wrong, you can run just the CTE's SELECT on its own to inspect the middle step. That habit alone saves hours.

## 4. Several steps, each using the last

One `WITH`, then CTEs separated by commas. Each can use the ones above it.

*Question:* how many customers fall into each spending band, counting only completed orders?

```sql
-- try
WITH line_values AS (
  SELECT o.customer_id,
         oi.quantity * oi.unit_price * (1 - oi.discount) AS value
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.order_id
  WHERE o.status = 'completed'
    AND o.customer_id IS NOT NULL
),
spend AS (
  SELECT customer_id, SUM(value) AS total
  FROM line_values
  GROUP BY customer_id
),
banded AS (
  SELECT customer_id,
         CASE WHEN total >= 500 THEN 'High'
              WHEN total >= 200 THEN 'Medium'
              ELSE 'Low' END AS band
  FROM spend
)
SELECT band, COUNT(*) AS customers
FROM banded
GROUP BY band
ORDER BY customers DESC
```

Low **361**, Medium **223**, High **14**. Each step does one job: pick the lines, add them up per customer, label each customer, count the labels. Good CTE names say what one row is: `spend` is "one row per customer with their total".

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a CTE is a named intermediate result. Naming does not change the answer; it only makes the composition of steps visible.

**Equation:** WITH a AS (Q₁), b AS (Q₂(a)) SELECT Q₃(b) is the same as Q₃(Q₂(Q₁)). It is the "let" of maths: let a = Q₁, let b = Q₂(a), answer = Q₃(b). Because a CTE can be used more than once, it also avoids writing Q₁ twice, which a nested query would need.

**Analogy:** showing your working in a maths exam. Writing "let x = 3 + 4" and then "x² = 49" gives the same answer as (3 + 4)² = 49, but a marker can check each line, and so can you.

**Try it:** in the banding query, what is the grain (one row is ...) of `spend`? (One customer.) Of `line_values`? (One order line.)
</details>

## 5. Worked example: each store's share of 2025 revenue

*Question:* what share of Northbay's completed 2025 revenue did each store bring in?

```sql
-- try
WITH lines_2025 AS (
  SELECT o.store_id,
         oi.quantity * oi.unit_price * (1 - oi.discount) AS value
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.order_id
  WHERE o.status = 'completed'
    AND o.order_date LIKE '2025%'
),
by_store AS (
  SELECT store_id, SUM(value) AS revenue
  FROM lines_2025
  GROUP BY store_id
),
chain AS (
  SELECT SUM(revenue) AS total FROM by_store
)
SELECT s.store_name,
       ROUND(b.revenue, 2) AS revenue,
       ROUND(100.0 * b.revenue / c.total, 1) AS pct_of_chain
FROM by_store b
JOIN stores s ON s.store_id = b.store_id
CROSS JOIN chain c
ORDER BY pct_of_chain DESC
```

1. `lines_2025`: every completed 2025 order line with its store and value.
2. `by_store`: one row per store with its revenue.
3. `chain`: one row, the total: **$72,594.52**.
4. The final SELECT puts the total next to every store (`CROSS JOIN` with a one-row table just adds its columns to every row) and divides.

Northbay Online leads with **28.8%** ($20,883.03), then Bytown **8.1%** and River Valley **7.8%**. Note `100.0`, not `100`: in SQLite and SQL Server, dividing two whole numbers throws away the decimals.

## 6. Practice

```sql
-- exercise: Rewrite with a CTE called per_order: first make one row per order with its total, then show the average order total rounded to 2 decimal places.
-- hint: WITH per_order AS (SELECT order_id, SUM(quantity * unit_price * (1 - discount)) AS total FROM order_items GROUP BY order_id) SELECT ROUND(AVG(total), 2) FROM per_order.
SELECT ROUND(AVG(quantity * unit_price * (1 - discount)), 2) AS avg_value
FROM order_items
-- answer:
WITH per_order AS (
  SELECT order_id, SUM(quantity * unit_price * (1 - discount)) AS total
  FROM order_items
  GROUP BY order_id
)
SELECT ROUND(AVG(total), 2) AS avg_order_total
FROM per_order
```

```sql
-- exercise: Using two CTEs, show each department's 2025 revenue (completed orders) and its share of the 2025 total as a percentage rounded to 1 decimal place.
-- hint: First CTE: revenue per department (order_items → orders → products → categories, filtered to completed 2025). Second CTE: the total. Then CROSS JOIN and divide with 100.0.
WITH dept AS (
  SELECT c.department,
         SUM(oi.quantity * oi.unit_price * (1 - oi.discount)) AS revenue
  FROM order_items oi
  JOIN orders o     ON o.order_id = oi.order_id
  JOIN products p   ON p.product_id = oi.product_id
  JOIN categories c ON c.category_id = p.category_id
  WHERE o.status = 'completed' AND o.order_date LIKE '2025%'
  GROUP BY c.department
)
SELECT department, ROUND(revenue, 2) AS revenue
FROM dept
-- answer:
WITH dept AS (
  SELECT c.department,
         SUM(oi.quantity * oi.unit_price * (1 - oi.discount)) AS revenue
  FROM order_items oi
  JOIN orders o     ON o.order_id = oi.order_id
  JOIN products p   ON p.product_id = oi.product_id
  JOIN categories c ON c.category_id = p.category_id
  WHERE o.status = 'completed' AND o.order_date LIKE '2025%'
  GROUP BY c.department
),
total AS (
  SELECT SUM(revenue) AS t FROM dept
)
SELECT d.department, ROUND(d.revenue, 2) AS revenue,
       ROUND(100.0 * d.revenue / total.t, 1) AS pct
FROM dept d
CROSS JOIN total
```

```sql
-- exercise: Find the physical stores (leave out store 12, online) whose 2025 order count (all statuses) was above the average physical store's. Show store_id and the count.
-- hint: CTE counts: store_id, COUNT(*) AS n for 2025, with store_id <> 12. Then SELECT from counts WHERE n > (SELECT AVG(n) FROM counts).
WITH counts AS (
  SELECT store_id, COUNT(*) AS n
  FROM orders
  WHERE order_date LIKE '2025%' AND store_id <> 12
  GROUP BY store_id
)
SELECT store_id, n
FROM counts
-- answer:
WITH counts AS (
  SELECT store_id, COUNT(*) AS n
  FROM orders
  WHERE order_date LIKE '2025%' AND store_id <> 12
  GROUP BY store_id
)
SELECT store_id, n
FROM counts
WHERE n > (SELECT AVG(n) FROM counts)
```

**Try it on your own data:** paste a long nested query from work into [[sql-playground]] with a sample of the data and untangle it into named CTE steps.

**New words:** *CTE (common table expression)*, *WITH*, *CROSS JOIN*.
