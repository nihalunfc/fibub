---
title: 'How a query runs: the order SQL thinks in'
seoTitle: 'SQL order of execution explained, with animations'
summary: 'You write SELECT first, but SQL runs FROM first. Watch a query run step by step on real tables, and learn the order that explains most beginner errors.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: Which part of a query does SQL work out first?
    choices: ['SELECT', 'FROM (and any JOINs)', 'ORDER BY']
    ans: 1
    why: SQL first needs the rows to work on, so it starts with FROM and the JOINs. SELECT comes near the end.
  - q: 'Why does WHERE total > 50 fail when total is an alias made in SELECT?'
    choices: ['WHERE runs before SELECT, so the alias does not exist yet', 'Aliases can never be used anywhere', 'WHERE only works on text']
    ans: 0
    why: WHERE is worked out before SELECT, so it can only see the table's own columns. ORDER BY runs after SELECT and can use the alias.
  - q: Where must a condition on a SUM go?
    choices: ['WHERE', 'HAVING', 'FROM']
    ans: 1
    why: WHERE tests single rows before any grouping. HAVING tests groups after GROUP BY has summed them.
sources:
  - 'Microsoft Learn, SELECT (Transact-SQL): Logical processing order of the SELECT statement https://learn.microsoft.com/en-us/sql/t-sql/queries/select-transact-sql'
  - 'PostgreSQL documentation, Queries: Overview and Table Expressions https://www.postgresql.org/docs/current/queries-table-expressions.html'
  - 'SQLite documentation, SELECT https://www.sqlite.org/lang_select.html'
---

**Module 1 · about 20 minutes · read first: 1.3.** You'll be able to say the order in which SQL works out each part of a query, and use it to fix the most common beginner errors.

<div class="bigidea">SQL runs a query in a different order from the way you write it: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT.</div>

**In everyday terms:** a recipe card lists the dish's name first, but the cook starts by fetching ingredients. SELECT is the name on the card; FROM is the trip to the cupboard.

## 1. Why this matters

Most "why doesn't this work?" moments in SQL come from one thing: the order you **write** a query in is not the order the database **runs** it in. Once you know the running order, error messages make sense, and joins and GROUP BY stop feeling like magic. Interviewers ask about it too.

## 2. Written order vs running order

You always write the parts of a query in this order: SELECT, FROM, JOIN, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT. The database runs them in a different order:

<!--fig:query-order-->

Think of a kitchen. FROM is fetching ingredients, WHERE is throwing away what you won't use, GROUP BY is putting the rest into bowls, SELECT is plating up, ORDER BY is lining up the plates, and LIMIT is serving only the first few.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** each step takes a table and hands a new table to the next step. A query is a pipeline of table-to-table functions.

**Equation:** result = LIMIT( ORDER( SELECT( HAVING( GROUP( WHERE( FROM ) ) ) ) ) ). As with functions in maths, the innermost one is worked out first, even though SELECT is written first.

**Analogy:** function composition, f(g(x)): you work out g before f. It breaks down a little because the database is free to *optimise* (for example, filter early while it reads), but the answer is always the same as if it ran in this order.

**Try it:** in `SELECT name FROM customers WHERE city = 'Ottawa' ORDER BY name`, which runs first, WHERE or ORDER BY? (WHERE.)
</details>

## 3. Watch it run

Press **Run** to see the answer. Then press **Show how it runs** and **Play**: the join matches each order with its customer, WHERE throws rows away, GROUP BY colours the groups, and SUM squeezes each group into one row.

```sql
-- try
SELECT c.city, SUM(o.amount) AS total
FROM mini_orders o
JOIN mini_customers c ON o.customer_id = c.id
WHERE o.amount > 10
GROUP BY c.city
ORDER BY total DESC
```

Things to notice:

- Order 106 belongs to customer 9, who doesn't exist, so the (inner) join drops it.
- WHERE removes the $5 bagels **before** grouping, so they never reach a total.
- Each city turns into one row only at the aggregate step.

<div class="meaning">

<dl>
<dt>FROM / JOIN</dt><dd>Runs first: fetch the rows of the table(s).</dd>
<dt>WHERE</dt><dd>Throws away rows, one at a time, before any grouping.</dd>
<dt>GROUP BY</dt><dd>Puts the rows left into groups.</dd>
<dt>HAVING</dt><dd>Throws away whole groups, after the totals are known.</dd>
<dt>SELECT</dt><dd>Works out the output columns and their aliases.</dd>
<dt>ORDER BY, LIMIT</dt><dd>Sort the answer, then keep the first few rows.</dd>
<dt>Physical meaning</dt><dd>Each step takes a table and hands a smaller or reshaped table to the next. A step can only use what earlier steps have made, which is why WHERE cannot see a SUM or (in most databases) a SELECT alias.</dd>
</dl>

</div>

<div class="myth">

**"SQL runs top to bottom, starting with SELECT."** SELECT is written first but runs fifth. That is why `WHERE SUM(amount) > 40` fails (there are no groups yet when WHERE runs) and why ORDER BY can use an alias but WHERE usually cannot.

</div>

Watch the query above run, one step at a time (the live box's **Show how it runs** button animates the real thing):

<div class="steps">
<div class="step"><b>FROM + JOIN.</b> 5 joined rows (order 106 has no customer). <table class="lk-tbl"><tr><th>order</th><th>city</th><th>amount</th></tr><tr><td>101</td><td>Toronto</td><td>45</td></tr><tr><td>102</td><td>Toronto</td><td>5</td></tr><tr><td>103</td><td>Ottawa</td><td>20</td></tr><tr><td>104</td><td>Toronto</td><td>90</td></tr><tr><td>105</td><td>Toronto</td><td>45</td></tr></table></div>
<div class="step"><b>WHERE amount &gt; 10.</b> The $5 bagels go. <table class="lk-tbl"><tr><th>order</th><th>city</th><th>amount</th></tr><tr><td>101</td><td>Toronto</td><td>45</td></tr><tr><td>103</td><td>Ottawa</td><td>20</td></tr><tr><td>104</td><td>Toronto</td><td>90</td></tr><tr><td>105</td><td>Toronto</td><td>45</td></tr></table></div>
<div class="step"><b>GROUP BY city.</b> Two bowls: Toronto (45, 90, 45) and Ottawa (20).</div>
<div class="step"><b>SELECT city, SUM(amount).</b> <table class="lk-tbl"><tr><th>city</th><th>total</th></tr><tr><td>Toronto</td><td><mark>180</mark></td></tr><tr><td>Ottawa</td><td><mark>20</mark></td></tr></table></div>
<div class="step"><b>ORDER BY total DESC.</b> Already biggest first, so the answer is Toronto 180, Ottawa 20.</div>
</div>

<div class="problem" data-problem="sql-run-order"></div>

## 4. The errors this explains

**An alias in WHERE.** In most databases this fails, because WHERE runs before SELECT has made `total`:

```sql
-- noviz
SELECT order_id, amount * 2 AS total
FROM mini_orders
WHERE total > 50
```

Try it: SQLite (the database in this course) is forgiving and accepts it, but SQL Server, PostgreSQL and most other databases reject it. Write the expression again (`WHERE amount * 2 > 50`) so your SQL works everywhere.

**A SUM in WHERE.** This fails in every database, because WHERE tests one row at a time and a SUM needs a whole group:

```sql
-- fails
SELECT customer_id, SUM(amount) AS spent
FROM mini_orders
WHERE SUM(amount) > 40
GROUP BY customer_id
```

Read the error message, then fix it by moving the condition to HAVING, which runs after GROUP BY.

## 5. Worked example

*Question:* which cities have customers who spent more than $50 in total?

1. FROM `mini_orders` joined to `mini_customers`: 5 joined rows (order 106 has no customer).
2. No WHERE.
3. GROUP BY city: Toronto (orders 101, 102, 104, 105), Ottawa (103).
4. SUM per group: Toronto 45 + 5 + 90 + 45 = 185, Ottawa 20.
5. HAVING SUM > 50 keeps Toronto only.
6. SELECT city and the total. Answer: **Toronto, 185**.

## 6. Practice

```sql
-- exercise: Change the query so it lists each customer id with the number of orders they placed, but only customers with 2 or more orders.
-- hint: COUNT(*) counts rows in each group. A condition on a count goes in HAVING, not WHERE.
SELECT customer_id
FROM mini_orders
GROUP BY customer_id
-- answer:
SELECT customer_id, COUNT(*) AS orders
FROM mini_orders
GROUP BY customer_id
HAVING COUNT(*) >= 2
```

```sql
-- exercise: List the item and amount of every order over $30, biggest first.
-- hint: WHERE amount > 30, then ORDER BY amount DESC.
SELECT item, amount
FROM mini_orders
-- answer:
SELECT item, amount
FROM mini_orders
WHERE amount > 30
ORDER BY amount DESC
```

<div class="keypoints">

- Written order: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT.
- Running order: FROM (and JOIN), WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT.
- WHERE filters rows before grouping; HAVING filters groups after.
- A step can only use what earlier steps made: no SUM in WHERE, aliases are safe in ORDER BY.
- When a query errors, walk through it in running order.

</div>

**New words:** *logical order of execution*, *alias*, *pipeline*.
