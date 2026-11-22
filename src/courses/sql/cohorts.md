---
title: Cohort retention
seoTitle: 'SQL cohort retention analysis, step by step'
summary: 'Group customers by the month of their first order, then count how many come back one, two and three months later. Build the classic retention table on Northbay, one CTE at a time.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: What is a cohort in a retention analysis?
    choices: ['All orders placed on one day', 'A group of customers who started in the same period, such as the same first-order month', 'The customers with the highest spend']
    ans: 1
    why: 'A cohort is a group that shares a starting point. Following each group separately shows whether newer customers stay better or worse than older ones.'
  - q: 'A cohort has 50 customers. In month 2, 9 of them ordered. What is month-2 retention?'
    choices: ['9%', '18%', '41%']
    ans: 1
    why: 'Retention = active customers ÷ cohort size = 9 ÷ 50 = 0.18, so 18%. Always divide by the size of the cohort at month 0, not by last month.'
  - q: 'Why is Northbay''s January 2024 cohort much bigger than the others?'
    choices: ['January sales are always huge', 'The data starts in January 2024, so long-standing customers all look new that month', 'It has duplicate customers']
    ans: 1
    why: 'Customers who had been shopping for years show up with their "first" order in the first month of the data. This is called left censoring; treat the first cohort with care.'
sources:
  - 'SQLite documentation: Aggregate Functions (COUNT DISTINCT) https://www.sqlite.org/lang_aggfunc.html'
  - 'SQLite documentation: The WITH Clause https://www.sqlite.org/lang_with.html'
  - 'Microsoft Learn: DATEDIFF (Transact-SQL) https://learn.microsoft.com/en-us/sql/t-sql/functions/datediff-transact-sql'
  - 'Croll, A. and Yoskovitz, B. (2013), Lean Analytics, O''Reilly, chapter 7 (cohort analysis)'
---

**Module 8 · about 35 minutes · read first: 5.4, 7.1.** You'll be able to build a cohort retention table in SQL: one row per starting month, one column per month since the start, and read what it says.

<div class="bigidea">A cohort table follows each group of customers from the month they started and shows what share of them are still buying each month after.</div>

**In everyday terms:** a school reunion list. You follow "the class of 2024" and count how many still turn up each year, instead of counting everyone in the hall.

## 1. Why this matters

Total customers can grow while the business quietly leaks: lots of new customers who never come back look fine in a total. A **cohort** analysis follows each group of customers from the month they started, so you can see whether people stay. Subscription, retail and app companies all use it, and "write a retention query" is a favourite take-home task in analyst interviews.

## 2. The idea in three steps

A **cohort** is a group of customers who share a starting point. **Retention** is the share of a cohort that is still active some time later. Every cohort query follows the same three steps:

1. **Assign a cohort** to each customer: the month of their first completed order (or their sign-up month).
2. **Measure activity**: for every order, how many months after the cohort month it happened (the **month number**, 0 for the first month).
3. **Count and divide**: active customers per cohort and month number, divided by the cohort's size at month 0.

Keep each step in its own CTE ([Lesson 5.4](/learn/courses/sql/cte/)). It is far easier to check.

## 3. Step 1: each customer's cohort

Guests have no customer_id and cancelled orders don't count, so filter both out first.

```sql
-- try
WITH firsts AS (
  SELECT customer_id, MIN(order_date) AS first_date
  FROM orders
  WHERE status = 'completed' AND customer_id IS NOT NULL
  GROUP BY customer_id
)
SELECT strftime('%Y-%m', first_date) AS cohort, COUNT(*) AS customers
FROM firsts
GROUP BY cohort
ORDER BY cohort
```

The January 2024 cohort has 106 customers, February 63, March 78. Then the cohorts shrink fast: by 2025 only a handful of customers are new each month. Why? Northbay's loyalty members have been joining since 2021, but the orders table starts in January 2024. Anyone who was already shopping shows up with a "first" order early in 2024. This is **left censoring**: the data cuts off the start of people's history. In real work, either use the true sign-up date or say clearly that the first cohorts include older customers.

## 4. Step 2: the month number

Subtracting two dates gives days, not months. To count calendar months, turn each date into a month index (year × 12 + month) and subtract.

```sql
-- try
WITH firsts AS (
  SELECT customer_id, MIN(order_date) AS first_date
  FROM orders
  WHERE status = 'completed' AND customer_id IS NOT NULL
  GROUP BY customer_id
)
SELECT o.customer_id, f.first_date, o.order_date,
       (CAST(strftime('%Y', o.order_date) AS INTEGER) - CAST(strftime('%Y', f.first_date) AS INTEGER)) * 12
     + (CAST(strftime('%m', o.order_date) AS INTEGER) - CAST(strftime('%m', f.first_date) AS INTEGER)) AS month_number
FROM orders o
JOIN firsts f ON f.customer_id = o.customer_id
WHERE o.status = 'completed' AND o.customer_id = 42
ORDER BY o.order_date
```

Customer 42's first two orders were both in September 2024, so both are month 0. The later ones are months 10, 12 and 15. (SQL Server: `DATEDIFF(month, first_date, order_date)` counts month boundaries the same way. PostgreSQL: `(extract(year from age(...)) * 12 + ...)` or the same year × 12 + month trick.)

## 5. Step 3: count, divide and pivot

Now count **distinct** customers per cohort and month number. A customer who ordered three times in month 2 is still one retained customer. Then turn month numbers into columns with `COUNT(DISTINCT CASE ...)` (this is pivoting, [Lesson 8.6](/learn/courses/sql/pivot/)).

```sql
-- try
WITH firsts AS (
  SELECT customer_id, MIN(order_date) AS first_date
  FROM orders
  WHERE status = 'completed' AND customer_id IS NOT NULL
  GROUP BY customer_id
),
activity AS (
  SELECT DISTINCT o.customer_id,
         strftime('%Y-%m', f.first_date) AS cohort,
         (CAST(strftime('%Y', o.order_date) AS INTEGER) - CAST(strftime('%Y', f.first_date) AS INTEGER)) * 12
       + (CAST(strftime('%m', o.order_date) AS INTEGER) - CAST(strftime('%m', f.first_date) AS INTEGER)) AS month_number
  FROM orders o
  JOIN firsts f ON f.customer_id = o.customer_id
  WHERE o.status = 'completed'
)
SELECT cohort,
       COUNT(DISTINCT CASE WHEN month_number = 0 THEN customer_id END) AS size,
       ROUND(100.0 * COUNT(DISTINCT CASE WHEN month_number = 1 THEN customer_id END)
             / COUNT(DISTINCT CASE WHEN month_number = 0 THEN customer_id END), 1) AS m1_pct,
       ROUND(100.0 * COUNT(DISTINCT CASE WHEN month_number = 2 THEN customer_id END)
             / COUNT(DISTINCT CASE WHEN month_number = 0 THEN customer_id END), 1) AS m2_pct,
       ROUND(100.0 * COUNT(DISTINCT CASE WHEN month_number = 3 THEN customer_id END)
             / COUNT(DISTINCT CASE WHEN month_number = 0 THEN customer_id END), 1) AS m3_pct,
       ROUND(100.0 * COUNT(DISTINCT CASE WHEN month_number = 6 THEN customer_id END)
             / COUNT(DISTINCT CASE WHEN month_number = 0 THEN customer_id END), 1) AS m6_pct,
       ROUND(100.0 * COUNT(DISTINCT CASE WHEN month_number = 12 THEN customer_id END)
             / COUNT(DISTINCT CASE WHEN month_number = 0 THEN customer_id END), 1) AS m12_pct
FROM activity
WHERE cohort <= '2024-06'
GROUP BY cohort
ORDER BY cohort
```

This is the classic **retention table** (also called a cohort triangle, because later cohorts have fewer months to fill in). Read it across a row to follow one cohort over time, and down a column to compare cohorts at the same age.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a cohort table is a two-way grouping. Each customer gets a fixed label (the cohort) and each order gets a relative time (the month number); then you count distinct customers in every (cohort, month number) cell.

**Equation:** retention(c, k) = |{ customers in cohort c active in month k }| ÷ |{ customers in cohort c }|. In relational algebra: γ<sub>cohort, k; COUNT(DISTINCT customer_id)</sub>(orders ⋈ firsts). The cohort map is a *function*: each customer has exactly one first month, which is why MIN() is used, never a join that could give two.

**Analogy:** a school year group. You follow "the class of 2024" from Grade 9 to Grade 12 and count how many are still enrolled each year, instead of counting the whole school.

**Try it:** a cohort of 80 has 12 active customers in month 3. What is the month-3 retention? (12 ÷ 80 = 15%.)
</details>

<div class="meaning">

<dl>
<dt>Cohort</dt><dd>A group of customers who started in the same period, here the month of their first completed order.</dd>
<dt>Month number</dt><dd>How many calendar months after the cohort month an order happened. The first month is 0.</dd>
<dt>Retention</dt><dd>Customers in the cohort active in month k, divided by the cohort size at month 0.</dd>
<dt>Left censoring</dt><dd>The data starts after some customers had already started, so the first cohort looks too big.</dd>
<dt>Cumulative retention</dt><dd>Counts a customer as kept if they came back at any time up to month k. Always higher.</dd>
<dt>Physical meaning</dt><dd>Each customer gets one fixed label (their cohort) and each order gets a relative time (its month number). The query then counts distinct customers in every (cohort, month number) cell and divides by the cell in column 0.</dd>
</dl>

</div>

<div class="myth">

**"Divide by last month's active customers."** That gives a month-to-month rate that can go up and down for odd reasons. Retention always divides by the size of the cohort at month 0, so every number in a row shares the same base and the row can only be read one way.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>Orders.</b> Three customers. <table class="lk-tbl"><tr><th>customer</th><th>order_month</th></tr><tr><td>A</td><td>2025-01</td></tr><tr><td>A</td><td>2025-03</td></tr><tr><td>B</td><td>2025-01</td></tr><tr><td>C</td><td>2025-02</td></tr><tr><td>C</td><td>2025-03</td></tr></table></div>
<div class="step"><b>Step 1: cohort = first month.</b> MIN(order_date) per customer. <table class="lk-tbl"><tr><th>customer</th><th>cohort</th></tr><tr><td>A</td><td><mark>2025-01</mark></td></tr><tr><td>B</td><td><mark>2025-01</mark></td></tr><tr><td>C</td><td><mark>2025-02</mark></td></tr></table></div>
<div class="step"><b>Step 2: month number.</b> Months since the cohort month. <table class="lk-tbl"><tr><th>customer</th><th>cohort</th><th>month_no</th></tr><tr><td>A</td><td>2025-01</td><td><mark>0</mark></td></tr><tr><td>A</td><td>2025-01</td><td><mark>2</mark></td></tr><tr><td>B</td><td>2025-01</td><td><mark>0</mark></td></tr><tr><td>C</td><td>2025-02</td><td><mark>0</mark></td></tr><tr><td>C</td><td>2025-02</td><td><mark>1</mark></td></tr></table></div>
<div class="step"><b>Step 3: count distinct customers per cell.</b> <table class="lk-tbl"><tr><th>cohort</th><th>m0</th><th>m1</th><th>m2</th></tr><tr><td>2025-01</td><td>2</td><td>0</td><td><mark>1</mark></td></tr><tr><td>2025-02</td><td>1</td><td><mark>1</mark></td><td>–</td></tr></table></div>
<div class="step"><b>Divide by month 0.</b> January: 1 of 2 back in month 2 = 50 %. February: 1 of 1 back in month 1 = 100 %. <table class="lk-tbl"><tr><th>cohort</th><th>size</th><th>m1_pct</th><th>m2_pct</th></tr><tr><td>2025-01</td><td>2</td><td>0</td><td><mark>50</mark></td></tr><tr><td>2025-02</td><td>1</td><td><mark>100</mark></td><td>–</td></tr></table></div>
</div>

Any live box with a SELECT has a **Show how it runs** button that animates the real query on Northbay, row by row.

<div class="problem" data-problem="sql-cohort-retention"></div>

## 6. Worked example

*Question:* do Northbay customers come back?

1. The April 2024 cohort has **59** customers.
2. In month 1 (May), 11 of them ordered again: 11 ÷ 59 = **18.6%**.
3. In month 2, 13 ordered: **22.0%**. In month 12 (April 2025), 13 again: **22.0%**.
4. Down the month-1 column, retention rises from 10.4% (January) to 20.4% (June). Part of that is the left-censoring effect: the January cohort is padded with older customers whose "first" order was simply their January shop.

The insight: "About one in five new customers shops again in any given month, and that holds steady a year later." Steady curves like this are a good sign for a grocery chain; a curve that drops towards zero would mean customers try Northbay once and leave.

There is another common definition: **cumulative** (or "rolling") retention, which counts a customer as retained if they came back at *any* point up to month k. It is always higher. Say which one you used.

## 7. Practice

```sql
-- exercise: For each cohort from January to June 2024, show the cohort size and how many customers placed another completed order within 90 days after their first order date.
-- hint: Keep the firsts CTE. Then, per cohort, SUM(EXISTS (SELECT 1 FROM orders o WHERE ... o.order_date > f.first_date AND o.order_date <= date(f.first_date, '+90 days'))).
WITH firsts AS (
  SELECT customer_id, MIN(order_date) AS first_date
  FROM orders
  WHERE status = 'completed' AND customer_id IS NOT NULL
  GROUP BY customer_id
)
SELECT strftime('%Y-%m', first_date) AS cohort, COUNT(*) AS size
FROM firsts
WHERE first_date < '2024-07-01'
GROUP BY cohort
-- answer:
WITH firsts AS (
  SELECT customer_id, MIN(order_date) AS first_date
  FROM orders
  WHERE status = 'completed' AND customer_id IS NOT NULL
  GROUP BY customer_id
)
SELECT strftime('%Y-%m', f.first_date) AS cohort,
       COUNT(*) AS size,
       SUM(EXISTS (SELECT 1 FROM orders o
                   WHERE o.customer_id = f.customer_id
                     AND o.status = 'completed'
                     AND o.order_date > f.first_date
                     AND o.order_date <= date(f.first_date, '+90 days'))) AS back_in_90
FROM firsts f
WHERE f.first_date < '2024-07-01'
GROUP BY cohort
```

In January 2024, 40 of 106 (37.7%) came back within 90 days.

```sql
-- exercise: Use sign-up cohorts instead: for each year customers joined (joined_on), show the number of members and how many placed a completed order in 2025.
-- hint: Group customers by strftime('%Y', joined_on). Count members with COUNT(*) and active ones with SUM(EXISTS (...)) on orders from 2025-01-01.
SELECT strftime('%Y', joined_on) AS joined_year, COUNT(*) AS members
FROM customers
GROUP BY joined_year
-- answer:
SELECT strftime('%Y', c.joined_on) AS joined_year,
       COUNT(*) AS members,
       SUM(EXISTS (SELECT 1 FROM orders o
                   WHERE o.customer_id = c.customer_id
                     AND o.status = 'completed'
                     AND o.order_date >= '2025-01-01')) AS active_2025
FROM customers c
GROUP BY joined_year
```

**Try it on your own data:** put your own orders export into [[sql-playground]] and swap in your table and column names; [[plot-maker]] can draw the retention curves.

<div class="keypoints">

- A cohort is a group that shares a starting month; MIN(order_date) per customer assigns it.
- Month number = (year × 12 + month) of the order minus the same for the cohort month.
- Count DISTINCT customers per (cohort, month number), then divide by the month-0 size.
- Read a row across to follow one cohort; read a column down to compare cohorts at the same age.
- The first cohort is often padded by older customers (left censoring): say so.

</div>

**New words:** *cohort*, *retention*, *month number*, *retention table*, *left censoring*, *cumulative retention*.
