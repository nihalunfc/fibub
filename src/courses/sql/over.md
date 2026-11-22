---
title: 'OVER: totals without losing rows'
seoTitle: 'SQL window functions explained: OVER and PARTITION BY'
summary: 'GROUP BY squeezes rows into one per group. OVER puts the group total next to every row instead. Watch a window function work row by row and learn PARTITION BY.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'You run SUM(amount) OVER () on a table of 6 rows. How many rows come back?'
    choices: ['1', '6', 'It depends on how many customers there are']
    ans: 1
    why: A window function never merges rows. Every one of the 6 rows stays, and each gets the same grand total beside it.
  - q: What does PARTITION BY customer_id do inside OVER?
    choices: ['Sorts the rows by customer', 'Gives each row the total of its own customer only', 'Removes customers with one order']
    ans: 1
    why: PARTITION BY splits the rows into groups for the window. Each row's window is only the rows of its own group, so the sum is per customer.
  - q: 'Why does WHERE SUM(amount) OVER () > 100 fail?'
    choices: ['Window functions are worked out after WHERE, so WHERE cannot see them', 'SUM cannot be used with OVER', 'WHERE only accepts text']
    ans: 0
    why: Window functions run at the SELECT step, after WHERE has already chosen the rows. To filter on one, work it out in a CTE or subquery and filter outside.
sources:
  - 'SQLite documentation, Window functions https://www.sqlite.org/windowfunctions.html'
  - 'PostgreSQL documentation, Tutorial: window functions https://www.postgresql.org/docs/current/tutorial-window.html'
  - 'Microsoft Learn, SELECT - OVER clause (Transact-SQL) https://learn.microsoft.com/en-us/sql/t-sql/queries/select-over-clause-transact-sql'
---

**Module 6 · about 25 minutes · read first: 3.2.** You'll be able to put a total, an average or a count next to every row with OVER, split it by group with PARTITION BY, and say how that differs from GROUP BY.

<div class="bigidea">OVER works out a total, average or count for a group of rows and writes it on every row, without merging any rows.</div>

**In everyday terms:** a class photo with a caption. GROUP BY gives you only the caption ("28 pupils"); OVER keeps every face in the picture and writes "class of 28" under each one.

## 1. Why this matters

Analysts constantly compare one row with its group: this order against the customer's total, this salary against the store average, this day against the month. With GROUP BY alone you need a second query and a join. Window functions do it in one line, and they are the most-asked topic in SQL interviews for data and BI jobs.

## 2. GROUP BY squeezes, OVER keeps

Here is the grand total of `mini_orders` with GROUP BY thinking: one number, and the order rows are gone.

```sql
-- try
SELECT SUM(amount) AS total
FROM mini_orders
```

Now add `OVER ()` after the SUM. The *window* is the set of rows a window function looks at for each row. Empty brackets mean "the window is every row".

```sql
-- try
SELECT order_id, customer_id, amount,
       SUM(amount) OVER () AS grand_total
FROM mini_orders
```

All 6 rows come back, and each carries the same total, 265. Press **Show how it runs** and step to **OVER**: for each row the highlighted window covers the whole table, the sum lands in the new column, and no rows are merged.

A *window function* is any function followed by OVER. SUM, AVG, COUNT, MIN and MAX all work this way, and later lessons add ranking and LAG.

## 3. PARTITION BY: one window per group

`PARTITION BY` splits the rows into groups, and each row's window holds only the rows of its own group. It is GROUP BY's idea without the squeezing.

```sql
-- try
SELECT order_id, customer_id, amount,
       SUM(amount) OVER (PARTITION BY customer_id) AS customer_total
FROM mini_orders
```

Press **Show how it runs** and watch the OVER step. What to notice:

- Orders 101 and 102 (customer 1) share a window, so both show 50.
- Orders 104 and 105 (customer 3) both show 135.
- Customer 2 and customer 9 each have one order, so their window is just themselves.

Because the original columns are still there, you can do arithmetic with the window value on the same line, for example `amount * 100.0 / SUM(amount) OVER (PARTITION BY customer_id)` for each order's share of its customer's spend.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** grouping (γ) is a function from a bag of rows to a smaller bag, one row per group. A window function is a function from a bag of rows to a bag of the **same size**: it adds a column and keeps every row.

**Equation:** for row r in partition P(r), SUM(x) OVER (PARTITION BY k) at r = Σ x over all rows s with s.k = r.k. The output cardinality equals the input cardinality: |result| = |input|. With GROUP BY, |result| = number of distinct k.

**Analogy:** a class's test marks. GROUP BY gives the teacher one line per class with the average. OVER gives each student their own mark with the class average written beside it. It breaks down a little because a student can only be in one class, while a row can sit in many different windows if you write several OVER clauses.

**Try it:** `mini_orders` has 6 rows and 4 customers. How many rows does `SELECT customer_id, SUM(amount) FROM mini_orders GROUP BY customer_id` return? And the PARTITION BY version above? (4, then 6.)
</details>

## 4. Window functions run late

Window functions are worked out at the SELECT step, after FROM, WHERE, GROUP BY and HAVING. Two things follow.

First, WHERE runs before the window exists, so it cannot test one:

```sql
-- fails
SELECT order_id, amount
FROM mini_orders
WHERE amount > AVG(amount) OVER ()
```

Read the error, then see the fix: work the window out inside a CTE, then filter outside, where it is an ordinary column.

```sql
-- try
WITH t AS (
  SELECT order_id, amount, AVG(amount) OVER () AS avg_amount
  FROM mini_orders
)
SELECT order_id, amount, avg_amount
FROM t
WHERE amount > avg_amount
```

Second, WHERE decides what the window can see. If you filter to Toronto customers first, the "grand total" is the Toronto total. That is usually what you want, but say so in the column name.

<div class="meaning">

<dl>
<dt>Window</dt><dd>The set of rows a window function looks at for the current row.</dd>
<dt>Window function</dt><dd>Any function followed by OVER, such as <code>SUM(amount) OVER ()</code>.</dd>
<dt>OVER ()</dt><dd>Empty brackets: the window is every row of the result.</dd>
<dt>PARTITION BY</dt><dd>Splits rows into groups; each row's window is only its own group.</dd>
<dt>Physical meaning</dt><dd>The row count does not change. The database adds one new column, filled for each row from its window, after WHERE and GROUP BY have run.</dd>
</dl>

</div>

<div class="myth">

**"OVER (PARTITION BY x) is the same as GROUP BY x."** GROUP BY squeezes each group into one row; PARTITION BY keeps every row and only decides which rows each window sees. Six orders in, six rows out.

</div>

Watch it happen, one step at a time (any live box's **Show how it runs** button animates the real query on Northbay):

<div class="steps">
<div class="step"><b>Start.</b> <table class="lk-tbl"><tr><th>order_id</th><th>customer_id</th><th>amount</th></tr><tr><td>101</td><td>1</td><td>45</td></tr><tr><td>102</td><td>1</td><td>5</td></tr><tr><td>103</td><td>2</td><td>20</td></tr><tr><td>104</td><td>3</td><td>90</td></tr><tr><td>105</td><td>3</td><td>45</td></tr><tr><td>106</td><td>9</td><td>60</td></tr></table></div>
<div class="step"><b>Partition.</b> <code>PARTITION BY customer_id</code> makes four windows: customer 1 (101, 102), 2 (103), 3 (104, 105) and 9 (106).</div>
<div class="step"><b>Sum each window.</b> Customer 1: 45 + 5 = 50. Customer 3: 90 + 45 = 135. The others are their own amount.</div>
<div class="step"><b>Write it on every row.</b> <table class="lk-tbl"><tr><th>order_id</th><th>customer_id</th><th>amount</th><th>customer_total</th></tr><tr><td>101</td><td>1</td><td>45</td><td><mark>50</mark></td></tr><tr><td>102</td><td>1</td><td>5</td><td><mark>50</mark></td></tr><tr><td>103</td><td>2</td><td>20</td><td><mark>20</mark></td></tr><tr><td>104</td><td>3</td><td>90</td><td><mark>135</mark></td></tr><tr><td>105</td><td>3</td><td>45</td><td><mark>135</mark></td></tr><tr><td>106</td><td>9</td><td>60</td><td><mark>60</mark></td></tr></table> Still 6 rows.</div>
</div>

<div class="problem" data-problem="sql-over-partition"></div>

## 5. Worked example

*Question:* at stores 1 and 2, how far is each employee's salary from their store's average?

```sql
-- try
SELECT name, store_id, salary,
       AVG(salary) OVER (PARTITION BY store_id) AS store_avg,
       ROUND(salary - AVG(salary) OVER (PARTITION BY store_id)) AS vs_avg
FROM employees
WHERE store_id IN (1, 2)
ORDER BY store_id, salary DESC
```

1. WHERE keeps 6 employees, 3 per store.
2. PARTITION BY store_id makes two windows.
3. Store 1: (92,000 + 50,000 + 40,000) / 3 = 60,667. Store 2: (86,000 + 41,000 + 58,000) / 3 = 61,667.
4. Each row subtracts its own store's average. Liam Roy, the store 1 manager, is **31,333 above** his store's average; Chen Kumar at store 2 is 20,667 below.

Press **Show how it runs** and notice the two coloured partitions at the OVER step. (The average shows many decimals; wrap it in ROUND once you have watched it. The animation draws the first plain window column in the SELECT, so keep that one unwrapped while you learn.) Without OVER this needs a GROUP BY subquery joined back to `employees`.

## 6. Practice

```sql
-- exercise: Show every order in mini_orders with a column n_orders: how many orders that customer placed in total.
-- hint: COUNT(*) OVER (PARTITION BY customer_id).
SELECT order_id, customer_id, amount
FROM mini_orders
-- answer:
SELECT order_id, customer_id, amount,
       COUNT(*) OVER (PARTITION BY customer_id) AS n_orders
FROM mini_orders
```

```sql
-- exercise: List the Electronics products (category_id = 10) with their price and the most expensive price in the category beside each one.
-- hint: MAX(unit_price) OVER () after filtering with WHERE.
SELECT product_name, unit_price
FROM products
WHERE category_id = 10
-- answer:
SELECT product_name, unit_price,
       MAX(unit_price) OVER () AS top_price
FROM products
WHERE category_id = 10
```

```sql
-- exercise: List the mini_orders that are bigger than their own customer's average order.
-- hint: Work out AVG(amount) OVER (PARTITION BY customer_id) in a CTE, then filter outside it.
SELECT order_id, customer_id, amount
FROM mini_orders
-- answer:
WITH t AS (
  SELECT order_id, customer_id, amount,
         AVG(amount) OVER (PARTITION BY customer_id) AS cust_avg
  FROM mini_orders
)
SELECT order_id, customer_id, amount
FROM t
WHERE amount > cust_avg
```

**Try it on your own data:** load a CSV into [[sql-playground]] and add a group average next to each row.

<div class="keypoints">

- A window function is a function followed by OVER; it keeps every row.
- OVER () looks at all rows; OVER (PARTITION BY x) looks at the row's own group.
- Window functions run after WHERE, GROUP BY and HAVING, so WHERE cannot test them.
- To filter on a window value, compute it in a CTE and filter outside.

</div>

**New words:** *window*, *window function*, *OVER*, *PARTITION BY*.
