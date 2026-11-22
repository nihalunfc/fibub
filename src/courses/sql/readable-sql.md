---
title: Writing SQL other people can read
seoTitle: 'SQL style guide: how to write readable SQL'
summary: 'Layout, names, CTEs and comments that make a query easy to check, change and hand over. Clean SQL is not just neater: it makes bugs easy to see, as two Northbay examples show.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'Why prefer GROUP BY s.store_name over GROUP BY 1?'
    choices: ['GROUP BY 1 is not allowed in any database', 'The name still points at the right column when someone reorders the SELECT list', 'It runs faster']
    ans: 1
    why: 'GROUP BY 1 means "the first column in SELECT". Add a column at the front and it silently groups by something else. Names say what they mean.'
  - q: 'What does WHERE status = ''completed'' AND store_id = 1 OR store_id = 2 return?'
    choices: ['Completed orders from stores 1 and 2', 'Completed orders from store 1, plus every order from store 2', 'Nothing']
    ans: 1
    why: 'AND binds tighter than OR, so it reads (completed AND store 1) OR store 2. Use IN (1, 2), or brackets, and the meaning is clear.'
  - q: What should a comment in SQL mostly explain?
    choices: ['What each keyword does', 'Why the query does something that is not obvious, like a business rule', 'Who wrote it']
    ans: 1
    why: 'The code already says what it does. Comments earn their place by saying why: "cancelled orders are not revenue", "store 12 is online".'
sources:
  - 'Holywell, S., SQL Style Guide https://www.sqlstyle.guide/'
  - 'dbt documentation: How we style our SQL https://docs.getdbt.com/best-practices/how-we-style/2-how-we-style-our-sql'
  - 'SQLite documentation: SQL Language Expressions (operator precedence) https://www.sqlite.org/lang_expr.html'
  - 'Microsoft Learn: Operator Precedence (Transact-SQL) https://learn.microsoft.com/en-us/sql/t-sql/language-elements/operator-precedence-transact-sql'
---

**Module 9 · about 25 minutes · read first: 5.4.** You'll be able to lay out a query so that someone else (or you, in six months) can check it quickly, and you'll see how clean layout exposes bugs.

<div class="bigidea">Readable SQL puts one clause per line, names every calculated column and every step, and brackets every mix of AND and OR, so mistakes stand out instead of hiding.</div>

**In everyday terms:** a recipe written as numbered steps with exact amounts, rather than one long paragraph. Anyone can follow it, and if the cake is flat you can see which step went wrong.

## 1. Why this matters

In a real job your SQL is read far more often than it is written: by the colleague who reviews it, the analyst who takes over your dashboard, and the interviewer marking your take-home test. Messy SQL hides mistakes; clear SQL makes them stand out. A consistent style is one of the cheapest ways to look senior.

## 2. The same query, twice

Both of these count 2025 orders per store. Run both: the answers differ, and one of them is wrong.

```sql
-- try
select s.store_name,count(*) from orders o,order_items i,stores s where o.order_id=i.order_id and s.store_id=o.store_id and o.status='completed' and o.order_date>='2025-01-01' group by 1 order by 2 desc
```

```sql
-- try
-- Completed orders per store in 2025 (store 12 is the online shop).
SELECT s.store_name,
       COUNT(*) AS orders_2025
FROM orders AS o
JOIN stores AS s
  ON s.store_id = o.store_id
WHERE o.status = 'completed'
  AND o.order_date >= '2025-01-01'
GROUP BY s.store_name
ORDER BY orders_2025 DESC
```

The first one joins order_items, so it counts *lines*, not orders: 1,216 for the online shop instead of 662. In one long line, the extra table is easy to miss. Laid out one clause per line, with the joins written as JOINs, you can see at a glance which tables are involved and why. This is the fan-out problem from [Lesson 4.5](/learn/courses/sql/fan-out/), hidden by layout.

## 3. Layout rules

There is no single official style; what matters is picking one and sticking to it. These rules are common in analytics teams:

1. **Keywords in capitals**, names in lower case: `SELECT`, `FROM`, `customer_id`.
2. **One clause per line**, starting at the left edge: SELECT, FROM, JOIN, WHERE, GROUP BY, HAVING, ORDER BY.
3. **One column per line** in long SELECT lists, indented under SELECT.
4. **Explicit JOINs with ON**, never commas in FROM with the join condition in WHERE. The ON line says how two tables connect; the WHERE line says which rows you want.
5. **Each condition on its own line**, starting with AND, so you can comment one out while testing.
6. **Name your columns**: every calculated column gets an alias with `AS` (`revenue`, not `SUM(...)`).
7. **Group and sort by names**, not by position (`GROUP BY 1`). Positions break silently when the SELECT list changes.

## 4. Names that explain themselves

- **Aliases** should hint at the table: `o` for orders and `c` for customers is fine; `a`, `b`, `t1` are not.
- **Column names** in snake_case that say the unit or the period: `revenue_2025`, `days_since_last_order`, `return_rate_pct`.
- **CTE names** say what one row of the CTE is: `monthly_revenue`, `first_orders`, `customer_scores`. A reader should be able to guess the grain ([Lesson 3.5](/learn/courses/sql/grain/)) from the name.

## 5. CTEs as steps, comments as reasons

A long query reads best as a list of steps, each in a named CTE ([Lesson 5.4](/learn/courses/sql/cte/)), ending with a short final SELECT. Each step can be run and checked on its own.

```sql
-- try
-- Revenue per department in 2025.
-- Revenue = quantity × price × (1 − discount), completed orders only.
WITH completed_lines AS (
  -- one row per product line in a completed 2025 order
  SELECT i.product_id,
         i.quantity * i.unit_price * (1 - i.discount) AS line_value
  FROM order_items AS i
  JOIN orders AS o
    ON o.order_id = i.order_id
  WHERE o.status = 'completed'
    AND o.order_date >= '2025-01-01'
),
department_revenue AS (
  -- one row per department
  SELECT c.department,
         SUM(l.line_value) AS revenue
  FROM completed_lines AS l
  JOIN products AS p
    ON p.product_id = l.product_id
  JOIN categories AS c
    ON c.category_id = p.category_id
  GROUP BY c.department
)
SELECT department,
       ROUND(revenue, 2) AS revenue_2025
FROM department_revenue
ORDER BY revenue_2025 DESC
```

Comments start with `--` and run to the end of the line. Good comments say **why**, or state a business rule ("completed orders only", "store 12 is online"), or describe the grain of a CTE. Don't write comments that repeat the code ("select the department").

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a query is a composition of table-to-table functions. Writing it as named CTEs is like naming the intermediate results in a long calculation: f(g(h(x))) becomes "let a = h(x); let b = g(a); answer = f(b)". The value is the same; the reasoning becomes checkable step by step.

**Equation:** department_revenue = γ<sub>department; SUM(line_value)</sub>(completed_lines ⋈ products ⋈ categories), and completed_lines = π<sub>product_id, line_value</sub>(σ<sub>completed, 2025</sub>(order_items ⋈ orders)). Each CTE is one line of this algebra, and each has a known grain (one row per line; one row per department).

**Analogy:** showing your working in a maths exam. The final number might be right either way, but only the working lets the marker (or you) find where it went wrong.

**Try it:** in the query above, which CTE would you run alone to check that no cancelled orders slipped in? (completed_lines: its WHERE is where the status rule lives.)
</details>

## 6. Brackets with AND and OR

AND binds more tightly than OR, the way × binds more tightly than +. So `a AND b OR c` means `(a AND b) OR c`. Mixed AND/OR without brackets is one of the most common silent bugs, and good layout makes it visible.

```sql
-- try
SELECT COUNT(*) AS orders
FROM orders
WHERE status = 'completed' AND store_id = 1 OR store_id = 2
```

This counts 512 orders, including store 2's cancelled ones. With `store_id IN (1, 2)` it is 506.

<div class="meaning">

<dl>
<dt>Style guide</dt><dd>A team's agreed rules for layout and naming, so everyone's SQL looks the same.</dd>
<dt>Alias</dt><dd>A short name for a table (o for orders) or a column (AS revenue).</dd>
<dt>snake_case</dt><dd>Lower-case words joined by underscores: days_since_last_order.</dd>
<dt>Operator precedence</dt><dd>Which operator binds first. AND binds before OR, as × binds before +.</dd>
<dt>CTE as a step</dt><dd>A named intermediate result whose name says what one row of it is.</dd>
<dt>Physical meaning</dt><dd>Layout never changes the result: the database ignores spaces and line breaks. What it changes is how quickly a person can see which tables are joined, which rows are kept and what one row means, which is where most wrong numbers come from.</dd>
</dl>

</div>

<div class="myth">

**"Spacing is cosmetic, so I'll tidy up at the end."** In the one-line query above, an extra table in the FROM list doubled the count, and nobody could see it. Writing one clause per line from the start, with JOIN … ON instead of commas, is how you catch fan-out and AND/OR bugs before anyone else does.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The rows.</b> <table class="lk-tbl"><tr><th>order</th><th>store</th><th>status</th></tr><tr><td>1</td><td>1</td><td>completed</td></tr><tr><td>2</td><td>1</td><td>cancelled</td></tr><tr><td>3</td><td>2</td><td>completed</td></tr><tr><td>4</td><td>2</td><td>cancelled</td></tr></table></div>
<div class="step"><b>Without brackets.</b> <code>status = 'completed' AND store_id = 1 OR store_id = 2</code> reads as (completed AND store 1) OR store 2. <table class="lk-tbl"><tr><th>order</th><th>kept?</th></tr><tr><td>1</td><td><mark>yes</mark></td></tr><tr><td>2</td><td>no</td></tr><tr><td>3</td><td><mark>yes</mark></td></tr><tr><td>4</td><td><mark>yes (cancelled!)</mark></td></tr></table></div>
<div class="step"><b>With brackets.</b> <code>status = 'completed' AND (store_id = 1 OR store_id = 2)</code>, or <code>store_id IN (1, 2)</code>. <table class="lk-tbl"><tr><th>order</th><th>kept?</th></tr><tr><td>1</td><td><mark>yes</mark></td></tr><tr><td>2</td><td>no</td></tr><tr><td>3</td><td><mark>yes</mark></td></tr><tr><td>4</td><td>no</td></tr></table></div>
<div class="step"><b>Lay it out.</b> One condition per line, starting with AND, so a missing bracket is visible and each line can be commented out to test.</div>
</div>

Any live box with a SELECT has a **Show how it runs** button that animates the real query on Northbay, row by row.

<div class="problem" data-problem="sql-and-or"></div>

## 7. Worked example

*Task:* a colleague hands you this query for a weekly report. Make it readable and check it.

`select c.city,count(distinct o.customer_id),sum(i.quantity*i.unit_price*(1-i.discount)) from orders o join customers c on c.customer_id=o.customer_id join order_items i on i.order_id=o.order_id where o.status='completed' group by 1 order by 3 desc`

1. Break it into clauses, one per line, and name the two calculated columns: `customers`, `revenue`.
2. Replace `group by 1` with `GROUP BY c.city` and `order by 3` with `ORDER BY revenue DESC`.
3. Read it again, now that it is laid out: the join to order_items fans out rows, but `COUNT(DISTINCT ...)` protects the customer count and SUM of line values is exactly what revenue should be, so the numbers are right.
4. Notice what layout makes visible: `c.city` comes from the customers table, which has stray spaces in a few cities ([Lesson 7.2](/learn/courses/sql/text/)). Add `TRIM(c.city)` and a comment explaining why.

```sql
-- try
-- Customers and revenue by home city (completed orders).
-- TRIM: a few cities in customers have trailing spaces.
SELECT TRIM(c.city) AS city,
       COUNT(DISTINCT o.customer_id) AS customers,
       ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS revenue
FROM orders AS o
JOIN customers AS c
  ON c.customer_id = o.customer_id
JOIN order_items AS i
  ON i.order_id = o.order_id
WHERE o.status = 'completed'
GROUP BY TRIM(c.city)
ORDER BY revenue DESC
```

## 8. Practice

```sql
-- exercise: Rewrite this query in the house style (one clause per line, explicit JOIN, named columns) and fix its bug: it should count completed 2025 ORDERS per store, not order lines.
-- hint: Drop order_items, which the query doesn't need, or use COUNT(DISTINCT o.order_id). Join stores with JOIN ... ON.
select s.store_name,count(*) from orders o,order_items i,stores s where o.order_id=i.order_id and s.store_id=o.store_id and o.status='completed' and o.order_date>='2025-01-01' group by 1 order by 2 desc
-- answer:
SELECT s.store_name,
       COUNT(*) AS orders_2025
FROM orders AS o
JOIN stores AS s
  ON s.store_id = o.store_id
WHERE o.status = 'completed'
  AND o.order_date >= '2025-01-01'
GROUP BY s.store_name
ORDER BY orders_2025 DESC
```

```sql
-- exercise: This should count completed orders from stores 1 and 2. Lay it out on separate lines and fix the AND/OR bug.
-- hint: Use store_id IN (1, 2), or put brackets around the OR.
SELECT COUNT(*) AS orders FROM orders WHERE status = 'completed' AND store_id = 1 OR store_id = 2
-- answer:
SELECT COUNT(*) AS orders
FROM orders
WHERE status = 'completed'
  AND store_id IN (1, 2)
```

**Try it on your own data:** paste a query you wrote last month into [[sql-playground]] and rewrite it with these rules; see if a bug falls out.

<div class="keypoints">

- Keywords in capitals, one clause per line, one column per line in long SELECT lists.
- Use JOIN … ON, never commas in FROM; ON says how tables connect, WHERE which rows you want.
- Name every calculated column and every CTE so a reader can guess what one row means.
- AND binds before OR: always bracket a mix of the two, or use IN.
- Comments say why (a business rule, the grain), not what the code already says.

</div>

**New words:** *style guide*, *alias*, *operator precedence*, *snake_case*.
