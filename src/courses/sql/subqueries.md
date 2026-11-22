---
title: 'Subqueries: a query inside a query'
seoTitle: 'SQL subquery explained with examples'
summary: 'Put one query inside another: a single number in WHERE or SELECT, or a whole table in FROM. Compare orders with the average, summarise in two steps, and read nested queries from the inside out.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'In WHERE amount > (SELECT AVG(amount) FROM mini_orders), what does the subquery return?'
    choices: ['One number, so it can be compared like a constant', 'A list of every amount', 'Nothing until the outer query runs']
    ans: 0
    why: It is a scalar subquery. It returns one row and one column, the average, which WHERE compares with each row's amount.
  - q: What happens if a subquery used with = returns more than one row?
    choices: ['SQL picks the first row', 'Most databases raise an error; SQLite quietly uses the first row', 'It averages them']
    ans: 1
    why: = needs a single value. SQL Server and PostgreSQL stop with an error. SQLite takes the first row, which hides the bug, so make sure it returns one value.
  - q: Why does a subquery in FROM need a name in most databases?
    choices: ['So the outer query can refer to its columns', 'For speed', 'It does not']
    ans: 0
    why: A derived table acts like a table, and a table needs a name. PostgreSQL and SQL Server require the alias; SQLite lets you skip it, but always add one.
sources:
  - 'SQLite documentation, SELECT (subqueries in FROM and as expressions) https://www.sqlite.org/lang_select.html'
  - 'PostgreSQL documentation, Scalar subqueries https://www.postgresql.org/docs/current/sql-expressions.html#SQL-SYNTAX-SCALAR-SUBQUERIES'
  - 'Microsoft Learn, Subqueries (SQL Server) https://learn.microsoft.com/en-us/sql/relational-databases/performance/subqueries'
  - 'Molinaro, A. and de Graaf, R. (2020), SQL Cookbook, 2nd edition, O''Reilly, chapter 3'
---

**Module 5 · about 25 minutes · read first: 3.2.** You'll be able to use a subquery as a single value, as a table in FROM, and read nested queries from the inside out.

<div class="bigidea">A subquery is a query in brackets that runs first and hands its answer, one value or a whole table, to the query around it.</div>

**In everyday terms:** a shopping trip with a note that says "buy anything cheaper than the average price on the shelf". First you work out the average (the inner query), then you walk the shelf with that one number in your head (the outer query).

## 1. Why this matters

Many questions need two steps: "orders bigger than the average" needs the average first; "the average customer's number of orders" needs a count per customer first, then an average of those counts. A **subquery** is a query inside another query that does the first step. Analysts use them every day, and they are the building block for CTEs in [Lesson 5.4](/learn/courses/sql/cte/).

## 2. A subquery as one value

A **scalar subquery** returns exactly one row and one column, so you can use it anywhere a single value fits. Put it in round brackets.

*Question:* which mini orders are above the average amount?

```sql
-- try
SELECT order_id, item, amount
FROM mini_orders
WHERE amount > (SELECT AVG(amount) FROM mini_orders)
ORDER BY amount DESC
```

Read it from the inside out. The inner query gives one number, about $44.17. The outer query keeps orders above it: 104 ($90), 106 ($60), 101 and 105 ($45 each). You can't write `WHERE amount > AVG(amount)`, because WHERE looks at one row at a time ([Lesson 1.4](/learn/courses/sql/how-a-query-runs/)). The subquery gets around that by working out the average separately.

Step through the clauses in the order SQL really runs them and move the three sliders.

<div class="steps" data-fig="@data-query-order">
<div class="step">FROM: the whole table is the starting point.</div>
<div class="step">WHERE: rows are dropped before any grouping.</div>
<div class="step">GROUP BY: the surviving rows become one row per region.</div>
<div class="step">HAVING: whole groups are dropped by their aggregate.</div>
<div class="step">SELECT: columns are computed here, so the alias total exists only from now on.</div>
<div class="step">ORDER BY: now the alias can be used to sort.</div>
<div class="step">LIMIT: finally only the first rows are kept.</div>
</div>


## 3. A scalar subquery in SELECT

The same kind of subquery can go in SELECT, to show a fixed reference number on every row:

```sql
-- try
SELECT product_name, unit_price,
       ROUND(unit_price - (SELECT AVG(unit_price) FROM products), 2) AS above_average
FROM products
ORDER BY above_average DESC
LIMIT 5
```

Northbay's average shelf price is $17.68, so the duvet ($89.99) is $72.31 above it. If a scalar subquery returns more than one row, SQL Server and PostgreSQL stop with an error; SQLite quietly uses the first row, which can hide a mistake.

## 4. A subquery as a table: FROM (SELECT ...)

A subquery in FROM can return many rows and columns. It acts like a temporary table, called a **derived table**, and the outer query reads from it. Give it a name with `AS`.

*Question:* how many orders does a typical loyalty member place?

```sql
-- try
SELECT ROUND(AVG(orders), 2) AS avg_orders_per_customer,
       MAX(orders) AS most_orders
FROM (
  SELECT customer_id, COUNT(*) AS orders
  FROM orders
  WHERE customer_id IS NOT NULL
  GROUP BY customer_id
) AS per_customer
```

Step 1 (inside) makes one row per customer with their order count. Step 2 (outside) averages those counts: **5.97** orders per customer, and the busiest have **14**. You can't write `AVG(COUNT(*))`, because aggregates can't be nested in one step; the derived table splits it into two steps. Press **Show how it runs** to see the derived table built first.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** every query returns a table, and anywhere SQL expects a table you can put a query. This property is called **closure**: operations on tables give back tables.

**Equation:** a derived table is function composition. For "average orders per customer": AVG( γ_customer, COUNT(*)( σ_customer≠NULL(Orders) ) ). The inner γ (grouping) produces a table; the outer AVG reduces it to one number. A scalar subquery is the special case where the inner result is a 1 × 1 table, which SQL treats as a plain value.

**Analogy:** a recipe that says "add 200 ml of the sauce from page 12". You make the sauce first, then use it as one ingredient, without caring how it was made.

**Try it:** what is the shape of `(SELECT MAX(order_date) FROM orders)`? (One row, one column: a scalar. It can go in WHERE as `order_date = (...)`.)
</details>

<div class="meaning">

<dl>
<dt>Subquery</dt><dd>A complete SELECT written inside round brackets, inside another query.</dd>
<dt>Scalar subquery</dt><dd>A subquery that returns one row and one column, so it can stand wherever a single value fits.</dd>
<dt>Derived table</dt><dd>A subquery in FROM. It returns a whole table, and the outer query reads from it like any table. Give it a name with AS.</dd>
<dt>Inside out</dt><dd>The way to read nested SQL: work out the innermost brackets first, then the next level.</dd>
<dt>Physical meaning</dt><dd>The database builds the inner result first (one number, or a temporary table that exists only during this query), then runs the outer query against it. Nothing is saved.</dd>
</dl>

</div>

<div class="myth">

**"I can write WHERE amount > AVG(amount)."** WHERE looks at one row at a time, and one row has no average. Work the average out in its own query, in brackets: `WHERE amount > (SELECT AVG(amount) FROM mini_orders)`.

</div>

Watch it happen, one step at a time (any live box's **Show how it runs** button animates the real query on Northbay):

<div class="steps">
<div class="step"><b>The table.</b> mini_orders (6 rows). <table class="lk-tbl"><tr><th>order_id</th><th>customer_id</th><th>amount</th></tr><tr><td>101</td><td>1</td><td>45</td></tr><tr><td>102</td><td>1</td><td>5</td></tr><tr><td>103</td><td>2</td><td>20</td></tr><tr><td>104</td><td>3</td><td>90</td></tr><tr><td>105</td><td>3</td><td>45</td></tr><tr><td>106</td><td>9</td><td>60</td></tr></table></div>
<div class="step"><b>Inner query first.</b> <code>SELECT AVG(amount)</code> gives one number: 265 ÷ 6 = <mark>44.17</mark>.</div>
<div class="step"><b>Swap it in.</b> The outer query now reads <code>WHERE amount &gt; 44.17</code>, a plain filter.</div>
<div class="step"><b>Filter.</b> <table class="lk-tbl"><tr><th>order_id</th><th>customer_id</th><th>amount</th></tr><tr><td>101</td><td>1</td><td><mark>45</mark></td></tr><tr><td>104</td><td>3</td><td><mark>90</mark></td></tr><tr><td>105</td><td>3</td><td><mark>45</mark></td></tr><tr><td>106</td><td>9</td><td><mark>60</mark></td></tr></table> Four rows are above the average.</div>
</div>

<div class="problem" data-problem="sql-scalar-above-avg"></div>

## 5. Worked example: average order value by store

*Question:* which stores have the highest average order value? An order's value is the sum of its lines, so we need two levels.

```sql
-- try
SELECT store_id, ROUND(AVG(order_total), 2) AS avg_order_value
FROM (
  SELECT o.store_id, o.order_id,
         SUM(oi.quantity * oi.unit_price * (1 - oi.discount)) AS order_total
  FROM orders o
  JOIN order_items oi ON oi.order_id = o.order_id
  GROUP BY o.store_id, o.order_id
) AS per_order
GROUP BY store_id
ORDER BY avg_order_value DESC
LIMIT 3
```

1. Inside: one row per order, with its total (4,064 rows).
2. Outside: group those orders by store and average them.
3. Answer: store 4 (Northbay Bytown) **$35.32**, store 10 **$34.26**, store 5 **$33.67**.

If you averaged the *line* values directly you would get the average line, not the average order: a different (and wrong) number for this question.

## 6. Practice

```sql
-- exercise: List the product names and prices of products that cost more than the average product price. Don't type the average in by hand: if prices change, the query should still be right.
-- hint: Replace the 20 with (SELECT AVG(unit_price) FROM products).
SELECT product_name, unit_price
FROM products
WHERE unit_price > 20
-- answer:
SELECT product_name, unit_price
FROM products
WHERE unit_price > (SELECT AVG(unit_price) FROM products)
```

```sql
-- exercise: Show the orders (order_id, store_id) placed on the most recent date in the orders table.
-- hint: WHERE order_date = (SELECT MAX(order_date) FROM orders).
SELECT order_id, store_id
FROM orders
ORDER BY order_date DESC
-- answer:
SELECT order_id, store_id
FROM orders
WHERE order_date = (SELECT MAX(order_date) FROM orders)
```

```sql
-- exercise: Using a derived table, find the average number of lines per order, rounded to 2 decimal places.
-- hint: Inside: SELECT order_id, COUNT(*) AS lines FROM order_items GROUP BY order_id. Outside: ROUND(AVG(lines), 2).
SELECT COUNT(*) AS lines
FROM order_items
-- answer:
SELECT ROUND(AVG(lines), 2) AS avg_lines
FROM (
  SELECT order_id, COUNT(*) AS lines
  FROM order_items
  GROUP BY order_id
) AS per_order
```

<div class="keypoints">

- A subquery is a query in brackets inside another query; read it from the inside out.
- A scalar subquery returns one value and can go in WHERE or SELECT.
- A subquery in FROM is a derived table; give it a name.
- Use a derived table for two-step summaries such as an average of counts.
- Make sure a scalar subquery really returns one row; SQLite hides it when it does not.

</div>

**New words:** *subquery*, *scalar subquery*, *derived table*, *closure*.
