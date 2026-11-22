---
title: 'LAG and LEAD: comparing with the row before'
seoTitle: 'SQL LAG and LEAD functions explained with examples'
summary: 'LAG reaches back to the previous row and LEAD reaches forward to the next, so you can work out change since last quarter or days between orders. Watch the arrow move row by row.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: What does LAG(sales) OVER (ORDER BY quarter) give on the first quarter?
    choices: ['0', 'NULL', 'The last quarter''s sales']
    ans: 1
    why: The first row has no row before it, so LAG returns NULL. Give a third argument, such as LAG(sales, 1, 0), if you want a default instead.
  - q: 'Quarterly rows, ordered by quarter. Which gives the same quarter last year?'
    choices: ['LAG(sales, 1)', 'LAG(sales, 4)', 'LEAD(sales, 4)']
    ans: 1
    why: The second argument is how many rows back to look. Four quarters back is the same quarter a year ago, as long as no quarter is missing.
  - q: 'You want the number of days until each customer''s next order. What do you need?'
    choices: ['LEAD(order_date) OVER (PARTITION BY customer_id ORDER BY order_date)', 'LAG(order_date) OVER (ORDER BY customer_id)', 'MAX(order_date) OVER ()']
    ans: 0
    why: LEAD looks forward one row. Partition by customer so it never reaches into another customer's orders, and order by date so the next row is the next order.
sources:
  - 'SQLite documentation, Window functions: lag() and lead() https://www.sqlite.org/windowfunctions.html#builtins'
  - 'Microsoft Learn, LAG (Transact-SQL) https://learn.microsoft.com/en-us/sql/t-sql/functions/lag-transact-sql'
  - 'PostgreSQL documentation, Window functions https://www.postgresql.org/docs/current/functions-window.html'
---

**Module 6 · about 25 minutes · read first: 6.1.** You'll be able to compare each row with the one before or after it using LAG and LEAD, work out change and percentage change, and measure the gap between events per customer.

<div class="bigidea">LAG copies a value from the row before onto this row, and LEAD from the row after, so you can compare neighbours with simple arithmetic.</div>

**In everyday terms:** a weekly weigh-in diary where each line also shows last week's weight in pencil. Now "how much did I lose?" is one subtraction on the same line.

## 1. Why this matters

"How did sales change since last quarter?", "how many days between a customer's orders?", "did the price go up?": all of these compare a row with its neighbour. Before window functions this needed a self-join on "the previous period", which is easy to get wrong. LAG and LEAD do it in one line, and interviewers love asking for period-over-period change.

## 2. LAG looks back, LEAD looks forward

- *LAG(column)* gives the value from the row **before** this one.
- *LEAD(column)* gives the value from the row **after** this one.

"Before" and "after" come from the ORDER BY inside OVER, so it is required. Here is Northbay's completed sales per quarter: 8 rows, one per quarter of 2024 and 2025.

```sql
-- try
WITH q AS (
  SELECT substr(o.order_date, 1, 4) || '-Q' || ((CAST(substr(o.order_date, 6, 2) AS INTEGER) + 2) / 3) AS quarter,
         ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS sales
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed'
  GROUP BY quarter
)
SELECT quarter, sales,
       LAG(sales) OVER (ORDER BY quarter) AS prev_sales
FROM q
```

Press **Show how it runs** and step to **OVER**. What to watch: for each row, the window covers just this row and the one above, and the value from the upper row drops into `prev_sales`. On the first row there is nothing above, so it gets NULL.

(The CTE builds a label like `2024-Q3` from the month: months 7, 8 and 9 give (7+2)/3 = 3 with whole-number division. [Lesson 7.1](/learn/courses/sql/dates/) covers dates properly.)

Press Play so the current row moves along, then change the function and the frame size. Open the RANK types view for ties.

<figure class="fig" data-fig="@data-window-frame"><figcaption>Notice that the frame (shaded) decides what each row may see, and that every input row keeps its own result line.</figcaption></figure>


## 3. Change and percentage change

Once the previous value sits on the same row, change is plain arithmetic:

```sql
-- try
WITH q AS (
  SELECT substr(o.order_date, 1, 4) || '-Q' || ((CAST(substr(o.order_date, 6, 2) AS INTEGER) + 2) / 3) AS quarter,
         ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS sales
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed'
  GROUP BY quarter
)
SELECT quarter, sales,
       LAG(sales) OVER (ORDER BY quarter) AS prev_sales,
       ROUND(sales - LAG(sales) OVER (ORDER BY quarter), 2) AS change,
       ROUND(100.0 * (sales - LAG(sales) OVER (ORDER BY quarter)) / LAG(sales) OVER (ORDER BY quarter), 1) AS pct_change
FROM q
```

Two details to copy:

- `100.0`, not `100`, so the division is not whole-number division (see [Lesson 7.3](/learn/courses/sql/types-casting/)).
- Divide by the **previous** value: change ÷ old.

## 4. Offset and default

LAG and LEAD take two optional extra arguments: `LAG(column, offset, default)`. The *offset* is how many rows to move (1 if left out). The default replaces the NULL where there is no such row. With quarterly rows, `LAG(sales, 4)` is the same quarter last year, the usual way to remove seasonality.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** within an ordered partition, rows have positions 1, 2, ..., n. LAG and LEAD are a shift of that sequence.

**Equation:** if x₁, x₂, ..., xₙ are the values in order, LAG(x, k) at position i is x₍ᵢ₋ₖ₎ when i > k, otherwise NULL (or the default). LEAD(x, k) at i is x₍ᵢ₊ₖ₎ when i + k ≤ n. Change is the first difference Δxᵢ = xᵢ − xᵢ₋₁, and percentage change is 100 · Δxᵢ / xᵢ₋₁.

**Analogy:** reading a bank statement line by line with a ruler under the line above, so you can see yesterday's balance next to today's. It breaks down a little because SQL's "line above" is only defined by ORDER BY: without it, there is no "previous".

**Try it:** values 10, 12, 9 in order. What is LAG at position 1, and the change at position 3? (NULL, then 9 − 12 = −3.)
</details>

## 5. Gaps between events per customer

Add PARTITION BY so LAG never reaches into another group. Here are customer 17's four orders, with the days since the previous one. `julianday()` turns a date into a day number, so subtracting two gives days.

```sql
-- try
SELECT order_id, order_date,
       LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS prev_date,
       julianday(order_date) - julianday(LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date)) AS days_since
FROM orders
WHERE customer_id = 17
```

Customer 17 waited 105 days, then 227, then just 28. In SQL Server write `DATEDIFF(day, prev_date, order_date)`; in PostgreSQL subtract the two dates.

A trap: if you forget PARTITION BY on a table with many customers, the first order of customer 18 is compared with the last order of customer 17. Always partition by the thing you are following.

<div class="meaning">

<dl>
<dt>LAG(x)</dt><dd>The value of x on the row before this one, in the ORDER BY inside OVER.</dd>
<dt>LEAD(x)</dt><dd>The value of x on the row after this one.</dd>
<dt>Offset</dt><dd>How many rows to look back or ahead: <code>LAG(x, 4)</code> is four rows back (same quarter last year).</dd>
<dt>Default</dt><dd>The third argument: what to show instead of NULL when there is no such row.</dd>
<dt>Percentage change</dt><dd>(new − old) ÷ old × 100. Divide by the previous value.</dd>
<dt>Physical meaning</dt><dd>No rows are added or removed. Each row gets one new column holding a neighbour's value; the first row (for LAG) or last row (for LEAD) gets NULL.</dd>
</dl>

</div>

<div class="myth">

**"Percentage change is (new − old) ÷ new."** Change is always measured against where you started: divide by the old value. From 200 to 250 is +25%, not +20%. And write `100.0`, or whole-number division turns small changes into 0.

</div>

Watch it happen, one step at a time (any live box's **Show how it runs** button animates the real query on Northbay):

<div class="steps">
<div class="step"><b>Monthly sales, in order.</b> <table class="lk-tbl"><tr><th>month</th><th>sales</th></tr><tr><td>Jan</td><td>200</td></tr><tr><td>Feb</td><td>250</td></tr><tr><td>Mar</td><td>225</td></tr></table></div>
<div class="step"><b>LAG(sales).</b> Each row copies the value from the row above. <table class="lk-tbl"><tr><th>month</th><th>sales</th><th>prev</th></tr><tr><td>Jan</td><td>200</td><td><mark>NULL</mark></td></tr><tr><td>Feb</td><td>250</td><td><mark>200</mark></td></tr><tr><td>Mar</td><td>225</td><td><mark>250</mark></td></tr></table></div>
<div class="step"><b>Change.</b> sales − prev: Jan NULL, Feb <mark>+50</mark>, Mar <mark>−25</mark>.</div>
<div class="step"><b>Percentage change.</b> Feb: 50 ÷ 200 × 100 = <mark>25%</mark>. Mar: −25 ÷ 250 × 100 = <mark>−10%</mark>.</div>
</div>

<div class="problem" data-problem="sql-lag-pct"></div>

## 6. Worked example

*Question:* how did each 2025 quarter compare with the same quarter of 2024?

```sql
-- try
WITH q AS (
  SELECT substr(o.order_date, 1, 4) || '-Q' || ((CAST(substr(o.order_date, 6, 2) AS INTEGER) + 2) / 3) AS quarter,
         ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS sales
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed'
  GROUP BY quarter
)
SELECT quarter, sales,
       LAG(sales, 4) OVER (ORDER BY quarter) AS same_q_last_year,
       ROUND(100.0 * (sales / LAG(sales, 4) OVER (ORDER BY quarter) - 1), 1) AS yoy_pct
FROM q
```

1. The CTE gives 8 quarterly rows.
2. `LAG(sales, 4)` reaches 4 rows back. The 2024 rows have nothing 4 rows back, so NULL.
3. 2025-Q1: 15,192.20 against 10,187.18, so 15,192.20 ÷ 10,187.18 − 1 = **+49.1%**.
4. The other 2025 quarters grew 31.2%, 34.1% and 28.4%.

Compare with quarter-on-quarter: 2025-Q1 was **down 9.6%** on 2024-Q4, but that is the usual drop after December, not bad news. Year-over-year shows the real trend. [Lesson 8.1](/learn/courses/sql/growth/) builds on this.

## 7. Practice

```sql
-- exercise: For mini_orders in order_id order, show each order's amount and the amount of the next order, in a column next_amount.
-- hint: LEAD(amount) OVER (ORDER BY order_id).
SELECT order_id, amount
FROM mini_orders
-- answer:
SELECT order_id, amount,
       LEAD(amount) OVER (ORDER BY order_id) AS next_amount
FROM mini_orders
```

```sql
-- exercise: For customer 142's orders, show order_id, order_date, the date of their next order (next_date) and the days until it (days_to_next).
-- hint: LEAD(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) gives next_date; julianday(that) - julianday(order_date) gives the days.
SELECT order_id, order_date
FROM orders
WHERE customer_id = 142
-- answer:
SELECT order_id, order_date,
       LEAD(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) AS next_date,
       julianday(LEAD(order_date) OVER (PARTITION BY customer_id ORDER BY order_date)) - julianday(order_date) AS days_to_next
FROM orders
WHERE customer_id = 142
```

```sql
-- exercise: For mini_orders, show order_id, customer_id, amount and the customer's previous amount (ordered by order_id), using 0 when there is none.
-- hint: LAG(amount, 1, 0) OVER (PARTITION BY customer_id ORDER BY order_id).
SELECT order_id, customer_id, amount,
       LAG(amount) OVER (ORDER BY order_id) AS prev_amount
FROM mini_orders
-- answer:
SELECT order_id, customer_id, amount,
       LAG(amount, 1, 0) OVER (PARTITION BY customer_id ORDER BY order_id) AS prev_amount
FROM mini_orders
```

<div class="keypoints">

- LAG looks at the row before, LEAD at the row after; ORDER BY inside OVER defines before and after.
- The first row has no previous row, so LAG gives NULL (or the default you pass).
- Percentage change = (new − old) ÷ old × 100; use 100.0.
- LAG(x, 4) on quarters compares with the same quarter last year.
- Add PARTITION BY to compare only within one customer or store.

</div>

**New words:** *LAG*, *LEAD*, *offset*, *first difference*, *year-over-year*.
