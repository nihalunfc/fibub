---
title: 'The date dimension: a calendar table for every report'
seoTitle: 'How to build a date dimension table in SQL'
summary: 'Build a full calendar table for 2024-2025 with a recursive CTE: weekday, month, quarter, weekend and promotion flags, and a fiscal year that starts in April. Then see why reports that use it never skip a day.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'Why join sales to a calendar table instead of grouping orders by order_date?'
    choices: ['Grouping by order_date is not allowed', 'Days with no sales are missing from the orders table, but present in the calendar', 'The calendar table makes queries faster in every case']
    ans: 1
    why: A day with no orders has no row in orders, so it can't appear in a GROUP BY. Starting from the calendar and LEFT JOINing sales shows it with 0.
  - q: 'Northbay''s fiscal year starts on 1 April and is named after the year it ends in. Which fiscal year is 15 May 2024 in?'
    choices: ['FY2024', 'FY2025', 'FY2023']
    ans: 1
    why: The year from 1 April 2024 to 31 March 2025 ends in 2025, so it is FY2025.
  - q: 'What is a good surrogate key for a date dimension?'
    choices: ['A random number', 'An integer like 20251129, built from the date', 'The day name']
    ans: 1
    why: Date keys are the one place where a meaningful key is normal. 20251129 is unique, sorts in date order and never changes, because a date's meaning never changes.
sources:
  - 'Kimball Group, Dimensional modeling techniques https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/'
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley, Chapter 3: Retail Sales (calendar date dimension)'
  - 'SQLite documentation: The WITH clause (recursive common table expressions) https://www.sqlite.org/lang_with.html'
  - 'SQLite documentation: Date and time functions https://www.sqlite.org/lang_datefunc.html'
---

**Module 4 · about 30 minutes · read first: 4.1.** You'll be able to build a date dimension with a recursive CTE, add the columns analysts ask for (weekday, quarter, weekend, promotion, fiscal year), and use it to report days that had no sales.

<div class="bigidea">The date dimension is a calendar table with one row per day and a column for every way people slice time, built once so every report just filters and groups.</div>

**In everyday terms:** a wall calendar with everything already marked: weekends, holidays, sale weeks, the start of the financial year. Nobody has to work out "is the 29th a Saturday?" again.

## 1. Why this matters

Almost every business question has a time in it: this month vs last, weekends vs weekdays, fiscal Q3, the Black Friday week. Working those out from a raw date in every report is slow and every analyst does it a little differently. A **date dimension** (or calendar table) works them out once, one row per day, so a report only has to filter and group. It is the first dimension built in nearly every warehouse, and the one every fact table uses.

## 2. One row per day

The date dimension has one row for every calendar day in the range you need, whether or not anything happened that day. Its columns are the ways people slice time: year, quarter, month name, weekday, weekend flag, holiday, promotion, fiscal period.

Its key is the one exception to the "keys mean nothing" rule from [Lesson 4.1](/learn/courses/data-modelling/surrogate-keys/). A date never changes its meaning, so a key like `20251129` (YYYYMMDD as an integer) is safe: it is unique, sorts correctly and is readable when you look at a fact table.

## 3. Making the days with a recursive CTE

A **recursive CTE** is a CTE that refers to itself: a starting row, then a rule to make the next row from the last one, repeated until a stop condition. ([SQL Lesson 5.5](/learn/courses/sql/recursive-cte/) covers it in depth.) Run this small one: it starts at 1 January and adds a day until 7 January.

```sql
-- try
WITH RECURSIVE days(d) AS (
  SELECT '2025-01-01'
  UNION ALL
  SELECT date(d, '+1 day') FROM days WHERE d < '2025-01-07'
)
SELECT d, strftime('%w', d) AS weekday_num
FROM days
```

`strftime('%w', d)` gives the weekday as a number, 0 for Sunday to 6 for Saturday. Every other column is worked out from the date in the same way.

## 4. The full calendar for 2024-2025

Now the real thing. Read it once top to bottom; each column is one line:

- `quarter`: months 1-3 → 1, 4-6 → 2, and so on, using whole-number division (month + 2) / 3.
- `weekday_name`: picks 3 letters out of the string 'SunMonTue...'.
- `is_weekend`: 1 on Saturday and Sunday.
- `is_promo`: 1 if any promotion in `promotions` was running that day.
- `fiscal_year` and `fiscal_quarter`: see section 5.

```sql
-- noviz
DROP TABLE IF EXISTS dim_date;
CREATE TABLE dim_date AS
WITH RECURSIVE days(d) AS (
  SELECT '2024-01-01'
  UNION ALL
  SELECT date(d, '+1 day') FROM days WHERE d < '2025-12-31'
)
SELECT CAST(strftime('%Y%m%d', d) AS INTEGER) AS date_key,
       d AS full_date,
       CAST(strftime('%Y', d) AS INTEGER) AS year,
       (CAST(strftime('%m', d) AS INTEGER) + 2) / 3 AS quarter,
       CAST(strftime('%m', d) AS INTEGER) AS month_num,
       CASE strftime('%m', d) WHEN '01' THEN 'January' WHEN '02' THEN 'February' WHEN '03' THEN 'March'
         WHEN '04' THEN 'April' WHEN '05' THEN 'May' WHEN '06' THEN 'June' WHEN '07' THEN 'July'
         WHEN '08' THEN 'August' WHEN '09' THEN 'September' WHEN '10' THEN 'October'
         WHEN '11' THEN 'November' ELSE 'December' END AS month_name,
       CAST(strftime('%w', d) AS INTEGER) AS weekday_num,
       substr('SunMonTueWedThuFriSat', 1 + 3 * CAST(strftime('%w', d) AS INTEGER), 3) AS weekday_name,
       CASE WHEN strftime('%w', d) IN ('0', '6') THEN 1 ELSE 0 END AS is_weekend,
       CASE WHEN EXISTS (SELECT 1 FROM promotions p WHERE d BETWEEN p.start_date AND p.end_date)
            THEN 1 ELSE 0 END AS is_promo,
       CAST(strftime('%Y', d) AS INTEGER) + (CAST(strftime('%m', d) AS INTEGER) >= 4) AS fiscal_year,
       ((CAST(strftime('%m', d) AS INTEGER) + 8) % 12) / 3 + 1 AS fiscal_quarter
FROM days;

SELECT COUNT(*) AS days, SUM(is_weekend) AS weekend_days, SUM(is_promo) AS promo_days FROM dim_date;
```

731 days (2024 was a leap year, so 366 + 365), 208 of them weekend days and 76 of them promotion days. Look at a few rows around the fiscal year change:

```sql
-- try
SELECT date_key, full_date, weekday_name, quarter, fiscal_year, fiscal_quarter, is_weekend, is_promo
FROM dim_date
WHERE full_date IN ('2024-03-31', '2024-04-01', '2025-11-29', '2025-12-31')
```

In SQL Server you would use `DATEPART(weekday, d)` and `DATENAME(month, d)`; in PostgreSQL, `generate_series('2024-01-01'::date, '2025-12-31', '1 day')` makes the days without recursion, and `extract(dow from d)` gives the weekday.

## 5. Fiscal years, the Canadian way

A **fiscal year** is the 12-month period an organisation uses for its budget and accounts. It often does not match the calendar. In Canada the federal government's fiscal year runs from 1 April to 31 March (check the Government of Canada's own pages for the official wording), and many public bodies, universities and companies follow the same pattern. Retailers often pick a year that ends after the January returns season instead, sometimes on the Saturday nearest the end of January.

Northbay uses April to March, and names each fiscal year after the year it **ends** in, so 1 April 2024 to 31 March 2025 is **FY2025**. Two lines do the work:

- `fiscal_year = year + (month >= 4)`: in SQLite a true comparison is 1, so April onwards moves to the next year's label.
- `fiscal_quarter = ((month + 8) % 12) / 3 + 1`: April-June → Q1, July-September → Q2, October-December → Q3, January-March → Q4.

Because our calendar starts in January 2024, FY2024 has only its last quarter (91 days) and FY2026 only its first three (275 days). Only FY2025 is complete. Retail calendars with 4-4-5 week months are built the same way, just with more columns; that is exactly why they belong in a table and not in every report.

Holidays fit the same pattern: a column `is_holiday`. Fixed ones (New Year's Day, Canada Day on 1 July, Christmas Day) can be worked out from the date; ones that move (Good Friday, Victoria Day, Thanksgiving) are easier to keep in a small table you fill in once a year and join in.

<div class="meaning">

<dl>
<dt>Date dimension (calendar table)</dt><dd>One row per calendar day in range, whether or not anything happened.</dd>
<dt>Date key</dt><dd>The date as a YYYYMMDD integer, such as 20251129: unique, sorted and readable.</dd>
<dt>Recursive CTE</dt><dd>A CTE that starts with a row and keeps adding the next one until a stop condition.</dd>
<dt>Fiscal year</dt><dd>The 12-month budget year; Northbay's runs April to March and is named after the year it ends in.</dd>
<dt>Physical meaning</dt><dd>A recursive CTE makes every day in the range; each column is a formula applied to that day and stored. Reports LEFT JOIN facts to it, so every day appears, even with zero sales.</dd>
</dl>

</div>

<div class="myth">

**"Group orders by order_date to get sales per day."** Days with no order simply disappear, so charts draw straight lines over gaps and averages divide by too few days. Start from the calendar and LEFT JOIN the orders.

</div>

Watch it happen, one step at a time (and press **Show how it runs** on any live SQL box in this lesson to animate the real query):

<div class="steps">
<div class="step"><b>Start row.</b> <table class="lk-tbl"><tr><th>d</th></tr><tr><td>2024-01-01</td></tr></table></div>
<div class="step"><b>Add a day, repeat.</b> <table class="lk-tbl"><tr><th>d</th></tr><tr><td>2024-01-01</td></tr><tr><td><mark>2024-01-02</mark></td></tr><tr><td><mark>2024-01-03</mark></td></tr></table></div>
<div class="step"><b>Add columns.</b> <table class="lk-tbl"><tr><th>date_key</th><th>weekday</th><th>is_weekend</th><th>fiscal_year</th></tr><tr><td>20240101</td><td>Mon</td><td>0</td><td>2024</td></tr><tr><td>20240406</td><td><mark>Sat</mark></td><td><mark>1</mark></td><td><mark>2025</mark></td></tr></table></div>
<div class="step"><b>Join the facts.</b> <table class="lk-tbl"><tr><th>date_key</th><th>orders</th></tr><tr><td>20251202</td><td>2</td></tr><tr><td>20251203</td><td><mark>0</mark></td></tr><tr><td>20251204</td><td><mark>0</mark></td></tr></table> The quiet days stay.</div>
</div>

**Try one with fresh numbers:**

<div class="problem" data-problem="dm-weekend-days"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the date dimension is a lookup function from a day to its attributes. Its rows are the complete **index set** of days, so any measure grouped through it is defined on every day, not just the days with data.

**Equation:** let D be the set of days in range, |D| = 731. Each column is a function f: D → values, for example quarter(d) = ⌊(month(d) + 2) / 3⌋. Sales per day is s(d) = Σ over orders on d; a LEFT JOIN from D gives s(d) for **every** d ∈ D, with s(d) = 0 where no order exists. Grouping orders alone only covers the image {order_date}, which may be smaller than D.

**Analogy:** a school register lists every pupil, every day. A pile of sick notes only tells you about the days someone was off. To count attendance properly you start from the register.

**Try it:** fiscal_quarter for month 1 (January): (1 + 8) % 12 = 9, 9 / 3 = 3, plus 1 = 4. Q4, as it should be.
</details>

## 6. Worked example: the days with no sales

Every day in 2024-2025 had at least one Northbay order somewhere, so the gap problem hides. Look at one store instead: Northbay Falls (store 3) in December 2025.

```sql
-- try
SELECT d.full_date, d.weekday_name, COUNT(o.order_id) AS orders
FROM dim_date d
LEFT JOIN orders o
  ON o.order_date = d.full_date
 AND o.store_id = 3
WHERE d.year = 2025 AND d.month_num = 12
GROUP BY d.full_date, d.weekday_name
ORDER BY d.full_date
LIMIT 10
```

3 and 4 December show **0**. Grouping `orders` by `order_date` would have skipped them entirely: store 3 had 15 orders on only 12 different days that month, so a chart built from orders alone would have 12 points and draw straight lines over 19 empty days. The store filter is in `ON`, not `WHERE`, for the reason in [SQL Lesson 4.3](/learn/courses/sql/left-join/): in WHERE it would throw away the empty days again.

The calendar also answers "do weekends matter?" in one line:

```sql
-- try
SELECT d.is_weekend,
       COUNT(DISTINCT d.date_key) AS days,
       COUNT(o.order_id) AS orders,
       ROUND(1.0 * COUNT(o.order_id) / COUNT(DISTINCT d.date_key), 2) AS orders_per_day
FROM dim_date d
LEFT JOIN orders o ON o.order_date = d.full_date
GROUP BY d.is_weekend
```

Weekdays: 2,645 orders over 523 days, 5.06 a day. Weekends: 1,419 orders over 208 days, 6.82 a day, about a third busier. Dividing by the number of **days** (from the calendar), not the number of rows, is what makes the comparison fair.

## 7. Practice

```sql
-- exercise: Count orders per fiscal year and fiscal quarter, in order. You should get 8 rows.
-- hint: Join dim_date to orders on full_date = order_date, GROUP BY fiscal_year, fiscal_quarter, ORDER BY both.
SELECT d.year, d.quarter, COUNT(*) AS orders
FROM dim_date d
JOIN orders o ON o.order_date = d.full_date
GROUP BY d.year, d.quarter
ORDER BY d.year, d.quarter
-- answer:
SELECT d.fiscal_year, d.fiscal_quarter, COUNT(*) AS orders
FROM dim_date d
JOIN orders o ON o.order_date = d.full_date
GROUP BY d.fiscal_year, d.fiscal_quarter
ORDER BY d.fiscal_year, d.fiscal_quarter
```

```sql
-- exercise: Compare promotion days with ordinary days: number of days, orders, and orders per day (2 decimal places).
-- hint: Same shape as the weekend query, but GROUP BY d.is_promo.
SELECT d.is_promo, COUNT(*) AS rows_seen
FROM dim_date d
LEFT JOIN orders o ON o.order_date = d.full_date
GROUP BY d.is_promo
-- answer:
SELECT d.is_promo,
       COUNT(DISTINCT d.date_key) AS days,
       COUNT(o.order_id) AS orders,
       ROUND(1.0 * COUNT(o.order_id) / COUNT(DISTINCT d.date_key), 2) AS orders_per_day
FROM dim_date d
LEFT JOIN orders o ON o.order_date = d.full_date
GROUP BY d.is_promo
```

```sql
-- exercise: How many days in December 2025 did Northbay Falls (store 3) have no orders? Return one number.
-- hint: Build the per-day list from the worked example (without LIMIT) in a CTE or subquery, then count the days with 0 orders.
SELECT COUNT(DISTINCT order_date) AS days_with_orders
FROM orders
WHERE store_id = 3 AND order_date LIKE '2025-12%'
-- answer:
WITH per_day AS (
  SELECT d.full_date, COUNT(o.order_id) AS orders
  FROM dim_date d
  LEFT JOIN orders o ON o.order_date = d.full_date AND o.store_id = 3
  WHERE d.year = 2025 AND d.month_num = 12
  GROUP BY d.full_date
)
SELECT COUNT(*) AS empty_days FROM per_day WHERE orders = 0
```

**Try it on your own data:** [[date-calculator]] counts days and weekdays between two dates, a handy check on your calendar columns.

<div class="keypoints">

- One row per day in range, even days with no sales.
- Its key is a readable YYYYMMDD integer, the one key that may mean something.
- Make the days with a recursive CTE (or generate_series in PostgreSQL).
- Store weekday, weekend, holiday, promotion and fiscal columns once.
- Start from the calendar and LEFT JOIN facts to see empty days and divide by the right number of days.

</div>

**New words:** *date dimension*, *calendar table*, *date key*, *recursive CTE*, *fiscal year*, *fiscal quarter*.
