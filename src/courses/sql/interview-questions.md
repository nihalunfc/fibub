---
title: '30 SQL interview questions, answered'
seoTitle: '30 SQL interview questions for data analysts, with answers'
summary: 'Thirty realistic analyst interview questions on the Northbay database, from easy counts to window functions and gaps-and-islands. Each one is a live exercise with a hint, a checker and a model answer, plus a method for thinking out loud.'
minutes: 90
updated: 2026-11-22
quiz:
  - q: 'An interviewer asks for "revenue by store". What should you do before writing SQL?'
    choices: ['Start typing straight away to save time', 'Ask what counts as revenue (cancelled orders? discounts? returns?) and agree the grain of the answer', 'Ask for the answer']
    ans: 1
    why: 'Clarifying the definition and the shape of the result is part of what is being tested. It also stops you solving the wrong problem.'
  - q: 'You need each store''s top product, and two products tie in one store. Which function keeps both?'
    choices: ['ROW_NUMBER()', 'RANK()', 'NTILE(1)']
    ans: 1
    why: 'RANK gives tied rows the same number, so filtering on rank = 1 keeps every tied winner. ROW_NUMBER breaks ties arbitrarily and keeps one.'
  - q: What is the best quick check after writing a join in an interview?
    choices: ['Count the rows before and after the join, to see whether it dropped or copied rows', 'Add DISTINCT to everything', 'Run it twice']
    ans: 0
    why: 'Comparing row counts catches the two classic join bugs: rows lost by an inner join and rows copied by fan-out.'
---

**Module 10 · about 90 minutes (do it in sittings) · read first: Modules 1–8.** You'll be able to answer the SQL questions that come up in data analyst and BI interviews, out loud and under time pressure, and check your own answers.

## 1. Why this matters

Most analyst hiring processes include a SQL test: a shared screen, a take-home task or a timed online quiz. The questions repeat across companies because the jobs repeat: counts, joins, top-N, growth, retention, duplicates. Practising on one realistic database is the fastest way to get fluent. Every question here is a live box: type, press **Check**, and use the hint only when stuck.

## 2. A method for any question

Interviewers mark *how* you think as much as the final query. Use the same five steps every time, and say them out loud:

1. **Clarify.** Restate the question and ask about the definitions. "Revenue: completed orders only? After discounts? Do returns come off?" On Northbay, assume completed orders and line value = quantity × unit_price × (1 − discount) unless told otherwise.
2. **State the grain.** "The answer has one row per store." This decides your GROUP BY ([Lesson 3.5](/learn/courses/sql/grain/)).
3. **Find the tables and keys.** Which tables, joined on which columns, and could the join fan out?
4. **Build it in steps.** A CTE per step. Run each step as you go.
5. **Check.** Row counts, a NULL or two, one number worked out by hand.

Here is step 5 in action: the number of orders, then the number of rows after joining order_items. If the two differ, the join has fanned out and any COUNT(*) on it counts lines, not orders.

```sql
-- try
SELECT (SELECT COUNT(*) FROM orders) AS orders,
       (SELECT COUNT(*) FROM orders o JOIN order_items i ON i.order_id = o.order_id) AS joined_rows,
       (SELECT COUNT(DISTINCT o.order_id) FROM orders o JOIN order_items i ON i.order_id = o.order_id) AS distinct_orders_after_join
```

4,064 orders become 7,310 rows after the join, but still 4,064 distinct orders: every order has at least one line, and many have several.

And a quick NULL check, because NULLs change counts quietly ([Lesson 2.4](/learn/courses/sql/null/)):

```sql
-- try
SELECT COUNT(*) AS all_orders,
       COUNT(customer_id) AS with_customer,
       COUNT(*) - COUNT(customer_id) AS guest_orders
FROM orders
```

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** most wrong answers in SQL interviews are cardinality mistakes: the result has more or fewer rows than the question implies. Before writing, say how many rows you expect and what one row is; after running, compare.

**Equation:** for a join R ⋈ S on a key, |R ⋈ S| ≤ |R| when each R row matches at most one S row (many-to-one). If an R row can match many S rows (one-to-many), |R ⋈ S| can exceed |R|, and Σ over the joined rows double-counts R's measures. COUNT(DISTINCT key) recovers |R|; it does not repair a SUM.

**Analogy:** a carpenter's "measure twice, cut once". Saying the expected row count is the measuring.

**Try it:** orders has 4,064 rows and stores has 12. How many rows does `orders JOIN stores ON store_id` give? (4,064: each order has exactly one store, so the join is many-to-one and can't add rows.)
</details>

## 3. Worked example

*Question (asked in many interviews):* "Which store had the highest revenue in 2025?"

1. Clarify: completed orders, 2025 order dates, revenue after discounts.
2. Grain: one row per store, then keep the top one.
3. Tables: orders (date, status, store) → order_items (values) → stores (name). Orders to items is one-to-many, but summing line values is exactly what we want.
4. Build and run:

```sql
-- try
SELECT s.store_name,
       ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS revenue_2025
FROM orders o
JOIN order_items i ON i.order_id = o.order_id
JOIN stores s ON s.store_id = o.store_id
WHERE o.status = 'completed'
  AND o.order_date >= '2025-01-01' AND o.order_date < '2026-01-01'
GROUP BY s.store_name
ORDER BY revenue_2025 DESC
LIMIT 1
```

5. Check and say the insight: Northbay Online, $20,883.03, about 29% of 2025 revenue. Then add: "If you meant physical stores only, I'd filter out store 12, and the answer is Northbay Bytown." Offering the follow-up shows you think about what the business actually wants.

## 4. Practice: easy (1–10)

These test SELECT, WHERE, GROUP BY, NULL and sorting. Aim for under 3 minutes each.

```sql
-- exercise: Q1. How many orders were placed in 2025 (any status)? Return one number.
-- hint: Filter with order_date >= '2025-01-01' AND order_date < '2026-01-01', then COUNT(*).
SELECT COUNT(*) AS orders
FROM orders
-- answer:
SELECT COUNT(*) AS orders
FROM orders
WHERE order_date >= '2025-01-01' AND order_date < '2026-01-01'
```

```sql
-- exercise: Q2. List the 5 most expensive products: product_name and unit_price, most expensive first. Break ties by product name.
-- hint: ORDER BY unit_price DESC, product_name, then LIMIT 5.
SELECT product_name, unit_price
FROM products
LIMIT 5
-- answer:
SELECT product_name, unit_price
FROM products
ORDER BY unit_price DESC, product_name
LIMIT 5
```

```sql
-- exercise: Q3. How many customers have no email address?
-- hint: Missing values are NULL, so use IS NULL, not = NULL.
SELECT COUNT(*) AS customers
FROM customers
-- answer:
SELECT COUNT(*) AS customers
FROM customers
WHERE email IS NULL
```

```sql
-- exercise: Q4. How many physical stores are there in each province? Leave out the online shop.
-- hint: The online shop has a NULL province. GROUP BY province.
SELECT province
FROM stores
-- answer:
SELECT province, COUNT(*) AS stores
FROM stores
WHERE province IS NOT NULL
GROUP BY province
```

```sql
-- exercise: Q5. Count customers in each loyalty tier, showing customers with no tier as 'None'.
-- hint: GROUP BY COALESCE(loyalty_tier, 'None').
SELECT loyalty_tier, COUNT(*) AS customers
FROM customers
WHERE loyalty_tier IS NOT NULL
GROUP BY loyalty_tier
-- answer:
SELECT COALESCE(loyalty_tier, 'None') AS tier, COUNT(*) AS customers
FROM customers
GROUP BY COALESCE(loyalty_tier, 'None')
```

```sql
-- exercise: Q6. What was total revenue from completed orders in 2025, rounded to 2 decimals?
-- hint: Join orders to order_items and SUM(quantity * unit_price * (1 - discount)) with the status and date filters.
SELECT SUM(i.quantity * i.unit_price) AS revenue
FROM order_items i
-- answer:
SELECT ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS revenue
FROM orders o
JOIN order_items i ON i.order_id = o.order_id
WHERE o.status = 'completed'
  AND o.order_date >= '2025-01-01' AND o.order_date < '2026-01-01'
```

```sql
-- exercise: Q7. Which categories belong to the Home department? Show category_name only, A to Z.
-- hint: WHERE department = 'Home', ORDER BY category_name.
SELECT category_name, department
FROM categories
-- answer:
SELECT category_name
FROM categories
WHERE department = 'Home'
ORDER BY category_name
```

```sql
-- exercise: Q8. Count orders by channel and status (one row per combination).
-- hint: GROUP BY two columns: channel, status.
SELECT channel, COUNT(*) AS orders
FROM orders
GROUP BY channel
-- answer:
SELECT channel, status, COUNT(*) AS orders
FROM orders
GROUP BY channel, status
```

```sql
-- exercise: Q9. How many customers have a city with extra spaces at the start or end?
-- hint: Compare city with TRIM(city).
SELECT COUNT(*) AS customers
FROM customers
WHERE city = TRIM(city)
-- answer:
SELECT COUNT(*) AS customers
FROM customers
WHERE city <> TRIM(city)
```

```sql
-- exercise: Q10. List employees hired on or after 1 January 2024: name, role and hired_on, newest first.
-- hint: Dates are 'YYYY-MM-DD' text, so >= '2024-01-01' works. ORDER BY hired_on DESC.
SELECT name, role, hired_on
FROM employees
-- answer:
SELECT name, role, hired_on
FROM employees
WHERE hired_on >= '2024-01-01'
ORDER BY hired_on DESC
```

## 5. Practice: medium (11–20)

Joins, anti-joins, subqueries and careful counting. Aim for 5 minutes each, and say the grain before you type.

```sql
-- exercise: Q11. Who are the top 5 customers by completed revenue? Show customer_id, first_name, last_name and revenue (2 decimals), highest first.
-- hint: Join orders, order_items and customers; filter completed; GROUP BY the customer; ORDER BY revenue DESC LIMIT 5.
SELECT customer_id, first_name, last_name
FROM customers
LIMIT 5
-- answer:
SELECT c.customer_id, c.first_name, c.last_name,
       ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS revenue
FROM orders o
JOIN order_items i ON i.order_id = o.order_id
JOIN customers c ON c.customer_id = o.customer_id
WHERE o.status = 'completed'
GROUP BY c.customer_id, c.first_name, c.last_name
ORDER BY revenue DESC
LIMIT 5
```

```sql
-- exercise: Q12. List the customer_id of every customer who has never had a completed order.
-- hint: An anti-join: NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id AND o.status = 'completed').
SELECT customer_id
FROM customers
-- answer:
SELECT c.customer_id
FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o
                  WHERE o.customer_id = c.customer_id AND o.status = 'completed')
```

```sql
-- exercise: Q13. Show 2025 completed revenue per department (2 decimals), largest first.
-- hint: orders → order_items → products → categories. GROUP BY department.
SELECT department
FROM categories
-- answer:
SELECT c.department,
       ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS revenue
FROM orders o
JOIN order_items i ON i.order_id = o.order_id
JOIN products p ON p.product_id = i.product_id
JOIN categories c ON c.category_id = p.category_id
WHERE o.status = 'completed' AND o.order_date >= '2025-01-01'
GROUP BY c.department
ORDER BY revenue DESC
```

```sql
-- exercise: Q14. Return rate by category: returned lines ÷ lines sold in completed orders, as a percentage with 1 decimal. Show category_name and the rate, highest first.
-- hint: Count lines per category, and count returns per category (returns has product_id), in two CTEs; then join them and divide with 100.0.
SELECT category_name
FROM categories
-- answer:
WITH sold AS (
  SELECT p.category_id, COUNT(*) AS lines
  FROM order_items i
  JOIN orders o ON o.order_id = i.order_id
  JOIN products p ON p.product_id = i.product_id
  WHERE o.status = 'completed'
  GROUP BY p.category_id
),
returned AS (
  SELECT p.category_id, COUNT(*) AS returns
  FROM returns r
  JOIN products p ON p.product_id = r.product_id
  GROUP BY p.category_id
)
SELECT c.category_name,
       ROUND(100.0 * COALESCE(rt.returns, 0) / s.lines, 1) AS return_rate_pct
FROM sold s
JOIN categories c ON c.category_id = s.category_id
LEFT JOIN returned rt ON rt.category_id = s.category_id
ORDER BY return_rate_pct DESC
```

```sql
-- exercise: Q15. List every employee's name with their manager's name. Keep the CEO, who has no manager.
-- hint: A self-join: employees e LEFT JOIN employees m ON m.employee_id = e.manager_id.
SELECT name, manager_id
FROM employees
-- answer:
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON m.employee_id = e.manager_id
```

```sql
-- exercise: Q16. How many distinct customers placed a completed order in each month of 2025? One row per month.
-- hint: GROUP BY strftime('%Y-%m', order_date) and COUNT(DISTINCT customer_id). COUNT(DISTINCT ...) skips the NULL guests by itself.
SELECT strftime('%Y-%m', order_date) AS month, COUNT(*) AS orders
FROM orders
WHERE status = 'completed' AND order_date >= '2025-01-01'
GROUP BY month
-- answer:
SELECT strftime('%Y-%m', order_date) AS month,
       COUNT(DISTINCT customer_id) AS active_customers
FROM orders
WHERE status = 'completed' AND order_date >= '2025-01-01'
GROUP BY month
```

```sql
-- exercise: Q17. Find email addresses used by more than one customer, ignoring capital letters. Show the lower-case email and how many customers use it.
-- hint: GROUP BY LOWER(email) HAVING COUNT(*) > 1. NULL emails form their own group, so leave them out.
SELECT email, COUNT(*) AS customers
FROM customers
GROUP BY email
HAVING COUNT(*) > 1
-- answer:
SELECT LOWER(email) AS email, COUNT(*) AS customers
FROM customers
WHERE email IS NOT NULL
GROUP BY LOWER(email)
HAVING COUNT(*) > 1
```

```sql
-- exercise: Q18. What is the average order value (revenue ÷ number of completed orders) for each channel? 2 decimals.
-- hint: SUM of line values divided by COUNT(DISTINCT o.order_id), because the join to order_items has one row per line.
SELECT o.channel, COUNT(*) AS rows_joined
FROM orders o
JOIN order_items i ON i.order_id = o.order_id
WHERE o.status = 'completed'
GROUP BY o.channel
-- answer:
SELECT o.channel,
       ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)) / COUNT(DISTINCT o.order_id), 2) AS avg_order_value
FROM orders o
JOIN order_items i ON i.order_id = o.order_id
WHERE o.status = 'completed'
GROUP BY o.channel
```

```sql
-- exercise: Q19. Which physical stores (not store 12) had 2025 completed revenue above the average physical store? Show store_id and revenue (2 decimals).
-- hint: Put revenue per store in a CTE, then WHERE revenue > (SELECT AVG(revenue) FROM that_cte).
SELECT store_id, store_name
FROM stores
WHERE store_id <> 12
-- answer:
WITH s AS (
  SELECT o.store_id, SUM(i.quantity * i.unit_price * (1 - i.discount)) AS revenue
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed' AND o.order_date >= '2025-01-01' AND o.store_id <> 12
  GROUP BY o.store_id
)
SELECT store_id, ROUND(revenue, 2) AS revenue
FROM s
WHERE revenue > (SELECT AVG(revenue) FROM s)
```

```sql
-- exercise: Q20. What share of 2025 completed revenue did each department bring in? Show department and percent (1 decimal), largest first.
-- hint: Department revenue ÷ SUM(department revenue) OVER (), times 100.0.
SELECT department, COUNT(*) AS categories
FROM categories
GROUP BY department
-- answer:
WITH d AS (
  SELECT c.department, SUM(i.quantity * i.unit_price * (1 - i.discount)) AS revenue
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  JOIN products p ON p.product_id = i.product_id
  JOIN categories c ON c.category_id = p.category_id
  WHERE o.status = 'completed' AND o.order_date >= '2025-01-01'
  GROUP BY c.department
)
SELECT department, ROUND(100.0 * revenue / SUM(revenue) OVER (), 1) AS share_pct
FROM d
ORDER BY share_pct DESC
```

## 6. Practice: hard (21–30)

Window functions, set operations and the analyst patterns from Module 8. Take 10 minutes each; in an interview, talk through your CTEs as you write them.

```sql
-- exercise: Q21. For each store, find the best-selling product by quantity in 2025 (completed orders). Keep ties. Show store_id, product_id and quantity.
-- hint: Sum quantity per store and product in a CTE, then RANK() OVER (PARTITION BY store_id ORDER BY qty DESC) and keep rank 1. ROW_NUMBER would drop a tied product.
SELECT o.store_id, i.product_id, i.quantity
FROM orders o
JOIN order_items i ON i.order_id = o.order_id
LIMIT 10
-- answer:
WITH t AS (
  SELECT o.store_id, i.product_id, SUM(i.quantity) AS qty
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed' AND o.order_date >= '2025-01-01'
  GROUP BY o.store_id, i.product_id
),
ranked AS (
  SELECT store_id, product_id, qty,
         RANK() OVER (PARTITION BY store_id ORDER BY qty DESC) AS rk
  FROM t
)
SELECT store_id, product_id, qty
FROM ranked
WHERE rk = 1
```

```sql
-- exercise: Q22. Show 2025 completed revenue by month with a running total for the year (both 2 decimals).
-- hint: Monthly revenue in a CTE, then SUM(revenue) OVER (ORDER BY month).
SELECT strftime('%Y-%m', order_date) AS month
FROM orders
WHERE order_date >= '2025-01-01'
GROUP BY month
-- answer:
WITH m AS (
  SELECT strftime('%Y-%m', o.order_date) AS month,
         SUM(i.quantity * i.unit_price * (1 - i.discount)) AS revenue
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed' AND o.order_date >= '2025-01-01'
  GROUP BY month
)
SELECT month, ROUND(revenue, 2) AS revenue,
       ROUND(SUM(revenue) OVER (ORDER BY month), 2) AS running_total
FROM m
ORDER BY month
```

```sql
-- exercise: Q23. For each month of 2025, show completed orders and the % change from the month before (1 decimal). January 2025 should compare with December 2024.
-- hint: Work out LAG over all months first, then filter to 2025 in the outer query. Filtering first would leave January with nothing to compare.
SELECT strftime('%Y-%m', order_date) AS month, COUNT(*) AS orders
FROM orders
WHERE status = 'completed' AND order_date >= '2025-01-01'
GROUP BY month
-- answer:
WITH m AS (
  SELECT strftime('%Y-%m', order_date) AS month, COUNT(*) AS orders
  FROM orders
  WHERE status = 'completed'
  GROUP BY month
),
g AS (
  SELECT month, orders,
         ROUND(100.0 * (orders - LAG(orders) OVER (ORDER BY month)) / LAG(orders) OVER (ORDER BY month), 1) AS mom_pct
  FROM m
)
SELECT month, orders, mom_pct
FROM g
WHERE month >= '2025-01'
ORDER BY month
```

```sql
-- exercise: Q24. What is the second-highest salary at Northbay? Return one number.
-- hint: SELECT DISTINCT salary, ORDER BY salary DESC, LIMIT 1 OFFSET 1. (Or DENSE_RANK() = 2.)
SELECT MAX(salary) AS salary
FROM employees
-- answer:
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1
```

```sql
-- exercise: Q25. How many customers placed completed orders in both 2024 and 2025?
-- hint: INTERSECT the customer_ids from each year, then count the rows of the result.
SELECT COUNT(DISTINCT customer_id) AS customers
FROM orders
WHERE status = 'completed'
-- answer:
SELECT COUNT(*) AS customers
FROM (
  SELECT customer_id FROM orders
  WHERE status = 'completed' AND order_date < '2025-01-01' AND customer_id IS NOT NULL
  INTERSECT
  SELECT customer_id FROM orders
  WHERE status = 'completed' AND order_date >= '2025-01-01'
)
```

```sql
-- exercise: Q26. Show daily completed revenue for December 2025 with a 7-day moving average (both 2 decimals). Days early in the month may average fewer days.
-- hint: Daily revenue in a CTE, then AVG(revenue) OVER (ORDER BY order_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW).
SELECT order_date, COUNT(*) AS orders
FROM orders
WHERE order_date >= '2025-12-01'
GROUP BY order_date
-- answer:
WITH d AS (
  SELECT o.order_date, SUM(i.quantity * i.unit_price * (1 - i.discount)) AS revenue
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed' AND o.order_date >= '2025-12-01'
  GROUP BY o.order_date
)
SELECT order_date, ROUND(revenue, 2) AS revenue,
       ROUND(AVG(revenue) OVER (ORDER BY order_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2) AS avg_7d
FROM d
ORDER BY order_date
```

```sql
-- exercise: Q27. On average, how many days pass between a customer's first and second completed orders? 1 decimal place.
-- hint: ROW_NUMBER per customer by order_date, pick out rows 1 and 2 with MAX(CASE ...), then AVG(julianday(second) - julianday(first)).
SELECT customer_id, MIN(order_date) AS first_order
FROM orders
WHERE status = 'completed' AND customer_id IS NOT NULL
GROUP BY customer_id
-- answer:
WITH n AS (
  SELECT customer_id, order_date,
         ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date, order_id) AS rn
  FROM orders
  WHERE status = 'completed' AND customer_id IS NOT NULL
),
p AS (
  SELECT customer_id,
         MAX(CASE WHEN rn = 1 THEN order_date END) AS first_order,
         MAX(CASE WHEN rn = 2 THEN order_date END) AS second_order
  FROM n
  GROUP BY customer_id
)
SELECT ROUND(AVG(julianday(second_order) - julianday(first_order)), 1) AS avg_days
FROM p
WHERE second_order IS NOT NULL
```

```sql
-- exercise: Q28. What is the longest run of consecutive days on which the online shop (store 12) had a completed order? Return one number.
-- hint: Gaps and islands: DISTINCT days, label = date minus ROW_NUMBER days, GROUP BY label, then MAX of the counts.
SELECT COUNT(DISTINCT order_date) AS days
FROM orders
WHERE store_id = 12 AND status = 'completed'
-- answer:
WITH d AS (
  SELECT DISTINCT order_date FROM orders
  WHERE store_id = 12 AND status = 'completed'
),
g AS (
  SELECT date(order_date, '-' || ROW_NUMBER() OVER (ORDER BY order_date) || ' days') AS grp
  FROM d
)
SELECT MAX(n) AS longest_streak
FROM (SELECT grp, COUNT(*) AS n FROM g GROUP BY grp)
```

```sql
-- exercise: Q29. Which pair of products appears together in the most completed orders? Show both product names and the number of orders.
-- hint: Self-join order_items on order_id with a.product_id < b.product_id (so each pair counts once), join products twice for the names, GROUP BY the pair, ORDER BY the count DESC LIMIT 1.
SELECT order_id, product_id
FROM order_items
LIMIT 10
-- answer:
SELECT pa.product_name AS product_a, pb.product_name AS product_b, COUNT(*) AS orders
FROM order_items a
JOIN order_items b ON b.order_id = a.order_id AND a.product_id < b.product_id
JOIN orders o ON o.order_id = a.order_id
JOIN products pa ON pa.product_id = a.product_id
JOIN products pb ON pb.product_id = b.product_id
WHERE o.status = 'completed'
GROUP BY a.product_id, b.product_id
ORDER BY orders DESC
LIMIT 1
```

```sql
-- exercise: Q30. How many customers spent more than twice as much in 2025 as in 2024 (completed orders)? Count only customers who spent something in 2024.
-- hint: One row per customer with SUM(CASE WHEN year = 2024 ...) and SUM(CASE WHEN year = 2025 ...), then count rows where spend_2025 > 2 * spend_2024.
SELECT customer_id
FROM orders
WHERE status = 'completed' AND customer_id IS NOT NULL
GROUP BY customer_id
-- answer:
WITH s AS (
  SELECT o.customer_id,
         SUM(CASE WHEN o.order_date < '2025-01-01' THEN i.quantity * i.unit_price * (1 - i.discount) ELSE 0 END) AS spend_2024,
         SUM(CASE WHEN o.order_date >= '2025-01-01' THEN i.quantity * i.unit_price * (1 - i.discount) ELSE 0 END) AS spend_2025
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed' AND o.customer_id IS NOT NULL
  GROUP BY o.customer_id
)
SELECT COUNT(*) AS customers
FROM s
WHERE spend_2024 > 0 AND spend_2025 > 2 * spend_2024
```

## 7. Questions that are asked in words

Some interview questions have no data. Short answers you can give:

- **WHERE vs HAVING?** WHERE filters rows before grouping; HAVING filters groups after ([Lesson 3.3](/learn/courses/sql/having/)).
- **INNER vs LEFT JOIN?** INNER keeps only matches; LEFT keeps every row from the left table and fills missing matches with NULL.
- **UNION vs UNION ALL?** UNION removes duplicate rows (and costs a sort); UNION ALL keeps them all.
- **RANK vs DENSE_RANK vs ROW_NUMBER?** On a tie: RANK gives 1, 1, 3; DENSE_RANK gives 1, 1, 2; ROW_NUMBER gives 1, 2, 3.
- **Why is COUNT(column) different from COUNT(\*)?** COUNT(column) skips NULLs.
- **How would you speed up a slow query?** Read the plan, filter early, make conditions sargable, add an index on join and filter columns, avoid SELECT \* ([Lesson 9.1](/learn/courses/sql/explain/)).
- **DELETE vs TRUNCATE vs DROP?** Some rows; all rows quickly; the whole table ([Lesson 9.5](/learn/courses/sql/changing-data/)).

**Try it on your own data:** once these feel easy, write your own questions on a public dataset in [[sql-playground]], then build the [capstone casebook](/learn/courses/sql/capstone/).

**New words:** *clarifying question*, *cardinality check*, *market basket*.
