---
title: Correlated subqueries
seoTitle: 'SQL correlated subquery explained with examples'
summary: 'A correlated subquery looks at the outer row and is worked out again for each one: products priced above their own category average, each customer''s latest order. Learn to read them, write them and know when to swap them out.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: What makes a subquery correlated?
    choices: ['It uses a column from the outer query', 'It returns more than one row', 'It is in the SELECT list']
    ans: 0
    why: A correlated subquery mentions the outer row (like p.category_id), so its answer can be different for each outer row.
  - q: 'In the mini orders, Asha''s orders are $45 and $5. Is order 101 ($45) above her own average?'
    choices: ['No, $45 is only about the overall average', 'Yes, her own average is $25', 'Only if Chen spent less']
    ans: 1
    why: "The correlated subquery averages only Asha's orders: (45 + 5) / 2 = 25. 45 is above 25."
  - q: Why can a correlated subquery be slow on a big table?
    choices: ['It is worked out once for each outer row, in principle', 'It always scans every table twice', 'It disables indexes']
    ans: 0
    why: In principle the inner query runs once per outer row. Databases often optimise this, but a join to a grouped table or a window function is usually safer on large data.
sources:
  - 'SQLite documentation, Subquery expressions (correlated subqueries) https://www.sqlite.org/lang_expr.html#subq'
  - 'Microsoft Learn, Correlated subqueries (SQL Server) https://learn.microsoft.com/en-us/sql/relational-databases/performance/subqueries#correlated'
  - 'PostgreSQL documentation, Subquery expressions https://www.postgresql.org/docs/current/functions-subquery.html'
---

**Module 5 · about 25 minutes · read first: 5.1 and 5.2.** You'll be able to write a subquery that depends on the current row, use it to compare each row with its own group, and rewrite it as a join when speed matters.

<div class="bigidea">A correlated subquery mentions a column of the outer row, so it gives a different answer for every row: "compare me with my own group".</div>

**In everyday terms:** each pupil checking their mark against the average of their own class, not the whole school. The question is the same, but the class changes from pupil to pupil.

## 1. Why this matters

Many analyst questions compare a row with **its own group**, not with everyone: a product against its category's average price, an order against that customer's usual spend, a customer's latest purchase. A plain subquery gives one number for the whole table. A **correlated subquery** gives a different number for each row, which is exactly what "its own group" needs.

## 2. Plain vs correlated

In [Lesson 5.1](/learn/courses/sql/subqueries/), `(SELECT AVG(amount) FROM mini_orders)` gave one number for everyone. Now add a link to the outer row:

```sql
-- try
SELECT o.order_id, o.customer_id, o.item, o.amount
FROM mini_orders o
WHERE o.amount > (
  SELECT AVG(o2.amount)
  FROM mini_orders o2
  WHERE o2.customer_id = o.customer_id
)
```

The inner query mentions `o.customer_id`, a column of the **outer** row. That makes it correlated. Think of it as running once per order:

- Order 101 (Asha): her average is (45 + 5) / 2 = 25. 45 > 25, keep.
- Order 102 (Asha): 5 > 25? No.
- Order 103 (Ben): his only order, average 20. 20 > 20? No.
- Order 104 (Chen): his average is (90 + 45) / 2 = 67.5. 90 > 67.5, keep.

Two orders survive: 101 and 104. With the overall average ($44.17) you got four. Same data, different question.

Notice the two aliases, `o` and `o2`, for the same table, just like a self-join ([Lesson 4.6](/learn/courses/sql/self-join/)). Without them, `customer_id = customer_id` would compare the inner row with itself and always be true.

## 3. Each row against its own group

*Question:* which Kitchen and Electronics products cost more than the average for their own category?

```sql
-- try
SELECT p.product_name, p.unit_price, c.category_name
FROM products p
JOIN categories c ON c.category_id = p.category_id
WHERE c.category_id IN (6, 10)
  AND p.unit_price > (
    SELECT AVG(p2.unit_price)
    FROM products p2
    WHERE p2.category_id = p.category_id
  )
ORDER BY c.category_name, p.unit_price DESC
```

Six products: earbuds, speaker and power bank in Electronics; kettle, chef knife and pan in Kitchen. Drop the `IN (6, 10)` line and 28 of the 61 products are above their category average.

## 4. A correlated subquery in SELECT

A correlated subquery in SELECT adds one looked-up value per row. *Question:* when was each product last sold?

```sql
-- try
SELECT p.product_name,
       (SELECT MAX(o.order_date)
        FROM order_items oi
        JOIN orders o ON o.order_id = oi.order_id
        WHERE oi.product_id = p.product_id) AS last_sold
FROM products p
ORDER BY last_sold
LIMIT 5
```

Every product sold in December 2025; the power bank's last sale was the earliest, on 4 December. If a product had never sold, `last_sold` would be NULL.

## 5. Speed, and the rewrite

In principle a correlated subquery runs once for every outer row. On 61 products that's nothing; on 10 million orders it can be slow. Databases often rewrite it for you, but not always. When it matters, do the grouping once and join to it:

```sql
-- try
SELECT p.product_name, p.unit_price, ca.avg_price
FROM products p
JOIN (
  SELECT category_id, AVG(unit_price) AS avg_price
  FROM products
  GROUP BY category_id
) AS ca ON ca.category_id = p.category_id
WHERE p.unit_price > ca.avg_price
```

Same 28 products. The derived table makes one average per category (10 rows), then each product is joined to its own. Window functions in [Lesson 6.1](/learn/courses/sql/over/) give a third, even shorter way.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a correlated subquery is a function of the outer row. For each row r, it returns f(r), and the outer query uses that value.

**Equation:** for products, f(p) = AVG{ q.price : q ∈ Products, q.category = p.category }. The query is σ_{p.price > f(p)}(Products). The rewrite computes all values of f at once with grouping, γ_category, AVG(price)(Products), and joins it back: σ_{price > avg}(Products ⋈ γ(Products)). Same answer, because f depends only on p.category, so it has one value per category.

**Analogy:** marking exams by class average. A correlated subquery is a teacher who, for each student, walks to that student's class and works out its average before marking. The rewrite works out every class average once, pins them on the wall, and then marks everyone.

**Try it:** Ben has one order of $20. What is f(order 103)? (20, his own average. A row is never above an average made only of itself.)
</details>

<div class="meaning">

<dl>
<dt>Correlated subquery</dt><dd>A subquery that uses a column from the outer query, such as <code>o2.customer_id = o.customer_id</code>.</dd>
<dt>Outer row</dt><dd>The row the outer query is looking at right now. The subquery is worked out again for it.</dd>
<dt>Two aliases</dt><dd>The same table given two names (o and o2) so SQL knows which copy each column belongs to.</dd>
<dt>Rewrite as a join</dt><dd>Group once in a derived table, then join each row to its own group. Same answer, often faster on big tables.</dd>
<dt>Physical meaning</dt><dd>In principle the inner query runs once per outer row, each time seeing only the rows that match that outer row. The outer table is filtered or gets one looked-up value per row.</dd>
</dl>

</div>

<div class="myth">

**"I can leave out the second alias."** Without it, `WHERE customer_id = customer_id` compares the inner row with itself, is always true, and the subquery becomes the plain overall average. Give the inner copy its own name and point at the outer one.

</div>

Watch it happen, one step at a time (any live box's **Show how it runs** button animates the real query on Northbay):

<div class="steps">
<div class="step"><b>The table.</b> <table class="lk-tbl"><tr><th>order_id</th><th>customer_id</th><th>amount</th></tr><tr><td>101</td><td>1</td><td>45</td></tr><tr><td>102</td><td>1</td><td>5</td></tr><tr><td>103</td><td>2</td><td>20</td></tr><tr><td>104</td><td>3</td><td>90</td></tr><tr><td>105</td><td>3</td><td>45</td></tr><tr><td>106</td><td>9</td><td>60</td></tr></table></div>
<div class="step"><b>Order 101 (customer 1).</b> The subquery sees only customer 1: (45 + 5) ÷ 2 = 25. Is 45 &gt; 25? <mark>Keep</mark>.</div>
<div class="step"><b>Order 102.</b> Same customer, same average 25. Is 5 &gt; 25? No.</div>
<div class="step"><b>Order 103 (customer 2).</b> Average of one order is 20. Is 20 &gt; 20? No.</div>
<div class="step"><b>Orders 104 and 105 (customer 3).</b> Average 67.5. 90 &gt; 67.5 <mark>keep</mark>; 45 does not.</div>
<div class="step"><b>Result.</b> <table class="lk-tbl"><tr><th>order_id</th><th>customer_id</th><th>amount</th></tr><tr><td><mark>101</mark></td><td>1</td><td>45</td></tr><tr><td><mark>104</mark></td><td>3</td><td>90</td></tr></table> Order 106 is alone in its group, so it equals its own average and is dropped.</div>
</div>

<div class="problem" data-problem="sql-correlated-above-own"></div>

## 6. Worked example: customers who have gone quiet

*Question:* which customers' latest order was before July 2025? These are candidates for a "we miss you" email.

```sql
-- try
SELECT COUNT(*) AS quiet_customers
FROM customers c
WHERE (SELECT MAX(o.order_date)
       FROM orders o
       WHERE o.customer_id = c.customer_id) < '2025-07-01'
```

1. For each customer, the subquery finds their latest order date.
2. WHERE keeps those whose latest date is before 1 July 2025.
3. Answer: **92** customers. The 3 who never ordered (601 to 603) are not counted: their latest date is NULL, and NULL < a date is not true. If you want them too, add `OR NOT EXISTS (...)`.

## 7. Practice

```sql
-- exercise: List each employee's name, store_id and salary where their salary is the highest in their store. Leave out head-office staff (store_id IS NULL).
-- hint: WHERE e.store_id IS NOT NULL AND e.salary = (SELECT MAX(e2.salary) FROM employees e2 WHERE e2.store_id = e.store_id).
SELECT e.name, e.store_id, e.salary
FROM employees e
WHERE e.store_id IS NOT NULL
  AND e.salary = (SELECT MAX(e2.salary) FROM employees e2)
-- answer:
SELECT e.name, e.store_id, e.salary
FROM employees e
WHERE e.store_id IS NOT NULL
  AND e.salary = (SELECT MAX(e2.salary) FROM employees e2 WHERE e2.store_id = e.store_id)
```

```sql
-- exercise: For every mini customer, show their name and the amount of their biggest order. Use a correlated subquery in SELECT.
-- hint: (SELECT MAX(o.amount) FROM mini_orders o WHERE o.customer_id = c.id) AS biggest. Customers with no orders get NULL.
SELECT c.name
FROM mini_customers c
-- answer:
SELECT c.name,
       (SELECT MAX(o.amount) FROM mini_orders o WHERE o.customer_id = c.id) AS biggest
FROM mini_customers c
```

```sql
-- exercise: For each store, list the order_id and order_date of its most recent order (ties: show them all).
-- hint: WHERE o.order_date = (SELECT MAX(o2.order_date) FROM orders o2 WHERE o2.store_id = o.store_id).
SELECT o.store_id, o.order_id, o.order_date
FROM orders o
WHERE o.order_date = (SELECT MAX(o2.order_date) FROM orders o2)
-- answer:
SELECT o.store_id, o.order_id, o.order_date
FROM orders o
WHERE o.order_date = (SELECT MAX(o2.order_date) FROM orders o2 WHERE o2.store_id = o.store_id)
```

<div class="keypoints">

- A correlated subquery uses a column of the outer row, so its answer changes row by row.
- Use it to compare each row with its own group.
- Give the inner and outer copies of a table different aliases.
- On big tables, rewrite it as a grouped derived table joined back, or use a window function.

</div>

**New words:** *correlated subquery*, *outer row*.
