---
title: 'Top N per group'
seoTitle: 'SQL top N per group with ROW_NUMBER, step by step'
summary: 'The best seller in each department, the latest order of each customer, the two top earners in each store: number the rows inside each group, then keep the first N.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'Why can you not write WHERE ROW_NUMBER() OVER (...) <= 3 in the same query?'
    choices: ['ROW_NUMBER only works in ORDER BY', 'WHERE runs before window functions are worked out', 'You can, it works in every database']
    ans: 1
    why: WHERE runs before SELECT, where the window is worked out. Number the rows in a CTE or subquery, then filter the number outside.
  - q: You want the latest order for each customer. What goes in the OVER brackets?
    choices: ['PARTITION BY customer_id ORDER BY order_date DESC', 'PARTITION BY order_date ORDER BY customer_id', 'ORDER BY customer_id DESC']
    ans: 0
    why: Partition by the group (customer) and order so that the row you want comes first (newest date first). Then keep row number 1.
  - q: Two products tie for top seller in a department. Which function keeps both?
    choices: ['ROW_NUMBER', 'RANK', 'Neither can']
    ans: 1
    why: RANK gives tied rows the same number, so WHERE rnk = 1 keeps both. ROW_NUMBER picks one of them.
---

**Module 6 · about 25 minutes · read first: 6.2.** You'll be able to pick the top N rows in each group with a ranking function in a CTE, choose how ties are handled, and get "the latest row per key", the pattern behind most deduplication.

## 1. Why this matters

"Best seller in each department", "each customer's most recent order", "top 3 stores per region": these are top-N-per-group questions, and they come up every week in BI work and in nearly every SQL interview. LIMIT cannot do it, because LIMIT cuts the whole result, not each group.

## 2. The pattern in two steps

1. In a CTE, number the rows inside each group with ROW_NUMBER (or RANK), ordered so the rows you want come first.
2. Outside the CTE, keep the rows whose number is N or less.

First watch step 1 on its own. Staff at stores 1 and 2, numbered by salary within each store:

```sql
-- try
SELECT name, store_id, salary,
       ROW_NUMBER() OVER (PARTITION BY store_id ORDER BY salary DESC, employee_id) AS rn
FROM employees
WHERE store_id IN (1, 2)
```

Press **Show how it runs**. At the OVER step, watch the count restart at 1 each time the window enters a new store. Each row's number is its place inside its own store, not in the whole table.

Now step 2: wrap it and filter.

```sql
-- try
WITH ranked AS (
  SELECT name, store_id, salary,
         ROW_NUMBER() OVER (PARTITION BY store_id ORDER BY salary DESC, employee_id) AS rn
  FROM employees
  WHERE store_id IN (1, 2)
)
SELECT store_id, name, salary
FROM ranked
WHERE rn <= 2
ORDER BY store_id, rn
```

Four rows: the two best-paid people at each store. Change `2` to `1` and you get each store's top earner.

## 3. Why the CTE is needed

You might try to skip the CTE. It fails, because WHERE runs before window functions exist:

```sql
-- fails
SELECT name, store_id, salary
FROM employees
WHERE ROW_NUMBER() OVER (PARTITION BY store_id ORDER BY salary DESC) <= 2
```

A subquery in FROM works exactly like the CTE. Some databases (BigQuery, Snowflake, DuckDB) also have `QUALIFY rn <= 2`, a WHERE that runs after windows; SQLite, SQL Server and PostgreSQL do not.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** top-N-per-group is a selection (σ) on a column that only exists after a window has been added. So it must be two steps: first extend each row with its rank, then select.

**Equation:** result = σ(rn ≤ N)( ω(rn = ROW_NUMBER, partition k, order x)(R) ), where ω is the window step. Because ROW_NUMBER is a bijection onto {1, ..., |P|} in each partition P, the result has exactly min(N, |P|) rows per group, so at most N·g rows for g groups. With RANK, ties can make it more than N per group.

**Analogy:** a sports day. First each race gives out finishing places (the window), then the teacher calls up everyone placed 1st or 2nd (the filter). You cannot call up the winners before the race is run. It breaks down a little because with RANK two runners can share 2nd, and both come up.

**Try it:** a store has 3 staff and you keep rn ≤ 2 with ROW_NUMBER. How many rows for that store? And for a store with only 1 employee? (2, then 1.)
</details>

## 4. Latest row per key

The most common top-N is N = 1 ordered by date, newest first: "the latest order for each customer". Here are customers 17 and 142 (8 orders) so you can see every row:

```sql
-- try
WITH ranked AS (
  SELECT order_id, customer_id, order_date,
         ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC, order_id DESC) AS rn
  FROM orders
  WHERE customer_id IN (17, 142)
)
SELECT customer_id, order_id, order_date
FROM ranked
WHERE rn = 1
```

Customer 17's latest order is 4843 on 2025-12-10; customer 142's is 4524 on 2025-10-30. Change DESC to ASC and you get each customer's **first** order instead, which you need for cohorts in [Lesson 8.2](/learn/courses/sql/cohorts/). The same pattern removes duplicate rows in [Lesson 7.4](/learn/courses/sql/duplicates/).

## 5. Ties: ROW_NUMBER or RANK?

- ROW_NUMBER: exactly N per group. Ties are cut at random unless you add a tie-breaker.
- RANK: everyone tied with the Nth row is kept, so a group can return more than N.
- DENSE_RANK with `<= N`: the top N **values**, however many rows share them.

Say which one you used in the report: "top 2 products (ties included)".

## 6. Worked example

*Question:* what were the two best-selling products by units in each department in 2025?

```sql
-- try
WITH units AS (
  SELECT c.department, p.product_name, SUM(i.quantity) AS units
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  JOIN products p ON p.product_id = i.product_id
  JOIN categories c ON c.category_id = p.category_id
  WHERE o.status = 'completed' AND o.order_date LIKE '2025%'
  GROUP BY c.department, p.product_name
),
ranked AS (
  SELECT department, product_name, units,
         RANK() OVER (PARTITION BY department ORDER BY units DESC) AS rnk
  FROM units
)
SELECT department, product_name, units, rnk
FROM ranked
WHERE rnk <= 2
ORDER BY department, rnk
```

1. `units` has one row per department and product.
2. `ranked` numbers products within each department, most units first.
3. The filter keeps ranks 1 and 2: Grocery is led by **Milk 2% 4 L (209 units)** then Paneer 350 g (190); Home by Laundry detergent (111); Kids by Plush bear (71); Tech by Bluetooth speaker (71).
4. There were no ties at the cut, so RANK and ROW_NUMBER give the same 8 rows here.

## 7. Practice

```sql
-- exercise: For each customer in mini_orders, show only their single biggest order (order_id, customer_id, amount).
-- hint: ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY amount DESC) in a CTE, then WHERE rn = 1.
SELECT order_id, customer_id, amount
FROM mini_orders
ORDER BY amount DESC
LIMIT 1
-- answer:
WITH ranked AS (
  SELECT order_id, customer_id, amount,
         ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY amount DESC, order_id) AS rn
  FROM mini_orders
)
SELECT order_id, customer_id, amount
FROM ranked
WHERE rn = 1
```

```sql
-- exercise: Show the first order (earliest date) of customer 388: order_id and order_date.
-- hint: ORDER BY order_date ASC inside OVER, and keep rn = 1. Partition by customer_id so it would work for every customer.
SELECT order_id, order_date
FROM orders
WHERE customer_id = 388
-- answer:
WITH ranked AS (
  SELECT order_id, customer_id, order_date,
         ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date, order_id) AS rn
  FROM orders
  WHERE customer_id = 388
)
SELECT order_id, order_date
FROM ranked
WHERE rn = 1
```

```sql
-- exercise: List the most expensive product in each category (category_id, product_name, unit_price), keeping ties.
-- hint: RANK() OVER (PARTITION BY category_id ORDER BY unit_price DESC), then WHERE rnk = 1.
SELECT category_id, MAX(unit_price) AS unit_price
FROM products
GROUP BY category_id
-- answer:
WITH ranked AS (
  SELECT category_id, product_name, unit_price,
         RANK() OVER (PARTITION BY category_id ORDER BY unit_price DESC) AS rnk
  FROM products
)
SELECT category_id, product_name, unit_price
FROM ranked
WHERE rnk = 1
```

**New words:** *top N per group*, *QUALIFY*, *latest row per key*.
