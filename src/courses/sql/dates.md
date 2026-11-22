---
title: 'Working with dates'
seoTitle: 'SQL date functions: group by month, add days, differences'
summary: 'Pull the year, month or weekday out of a date, round dates down to the month, add days and count the days between two dates, with the SQL Server and PostgreSQL versions alongside.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'In SQLite, which turns 2025-03-30 into 2025-03 so you can group by month?'
    choices: ["strftime('%Y-%m', order_date)", "strftime('%m', order_date)", "date(order_date, '+1 month')"]
    ans: 0
    why: "strftime('%Y-%m', ...) keeps the year and month. '%m' alone would put March 2024 and March 2025 in the same group."
  - q: 'How do you get the number of days between order_date and return_date in SQLite?'
    choices: ['return_date - order_date', 'julianday(return_date) - julianday(order_date)', "strftime('%d', return_date) - strftime('%d', order_date)"]
    ans: 1
    why: julianday turns each date into a day number, and the difference of day numbers is the number of days. Subtracting the text directly only uses the year, and the day-of-month trick breaks across months.
  - q: Why do dates stored as 'YYYY-MM-DD' text sort correctly?
    choices: ['SQLite sorts text by date automatically', 'Year, month and day are written biggest unit first with fixed widths, so text order equals date order', 'They do not sort correctly']
    ans: 1
    why: "Fixed-width, biggest-first text sorts the same way as the dates it stands for. '03/30/2025' style text would not."
sources:
  - 'SQLite documentation, Date and time functions https://www.sqlite.org/lang_datefunc.html'
  - 'PostgreSQL documentation, Date/time functions and operators https://www.postgresql.org/docs/current/functions-datetime.html'
  - 'Microsoft Learn, DATEDIFF (Transact-SQL) https://learn.microsoft.com/en-us/sql/t-sql/functions/datediff-transact-sql'
  - 'ISO 8601 date and time format, overview https://www.iso.org/iso-8601-date-and-time-format.html'
---

**Module 7 · about 30 minutes · read first: 3.2.** You'll be able to pull parts out of a date, group by month or weekday, add and subtract days, and count the days between two dates, in SQLite and in the dialects you will meet at work.

<div class="bigidea">Treat dates as points on a number line: pull out parts, round down to the month, move by days, and subtract to get a distance.</div>

**In everyday terms:** house numbers on a long street. 140 minus 128 is 12 houses apart, and 128 plus 12 is house 140. But 128 plus 140 is nobody's house.

## 1. Why this matters

Almost every business question has a time in it: sales by month, orders by weekday, days to return, customers who have not bought in 90 days. Date functions are also where SQL dialects differ most, so knowing the ideas (extract, truncate, add, difference) matters more than memorising one database's spelling.

## 2. Dates in this course are text

SQLite has no separate date type. Northbay stores dates as text in the ISO format `'YYYY-MM-DD'`, for example `'2025-03-30'`. Because the biggest unit comes first and every part has a fixed width, text order is date order, so plain comparisons work:

```sql
-- try
SELECT order_id, order_date
FROM orders
WHERE customer_id = 17
  AND order_date >= '2025-01-01'
```

Two habits keep you safe in every database:

- Write dates as `'YYYY-MM-DD'` in queries.
- When a column has a time as well (a *timestamp*), `BETWEEN '2025-01-01' AND '2025-01-31'` misses the last day after midnight. Use `>= '2025-01-01' AND < '2025-02-01'` instead.

## 3. Pulling out a part

`strftime(format, date)` writes a date in the format you ask for. The most useful codes:

- `%Y` year, `%m` month (01 to 12), `%d` day of month
- `%w` weekday, 0 = Sunday to 6 = Saturday
- `%Y-%m` year and month together, for grouping

```sql
-- try
SELECT order_id, order_date,
       strftime('%Y', order_date) AS yr,
       strftime('%m', order_date) AS mon,
       strftime('%w', order_date) AS weekday,
       date(order_date, 'start of month') AS month_start
FROM orders
WHERE customer_id = 17
```

Press **Show how it runs** and watch the SELECT step make four new columns from one. Notice the results are text: `mon` is `'03'`, not 3 ([Lesson 7.3](/learn/courses/sql/types-casting/) shows why that matters).

## 4. Rounding down to the month

To group by month, turn every date into the same value for its whole month. This is called *truncating* the date. Either keep `'YYYY-MM'` or use the first day of the month:

```sql
-- try
SELECT strftime('%Y-%m', order_date) AS month,
       COUNT(*) AS orders
FROM orders
WHERE status = 'completed' AND order_date LIKE '2025%'
GROUP BY month
ORDER BY month
```

December 2025 was the busiest month with **294** completed orders, against 122 in February. The first-of-month version, `date(order_date, 'start of month')`, is still a real date, which charting tools like better.

## 5. Adding days and counting between dates

`date(d, modifier, ...)` moves a date. Modifiers include `'+7 days'`, `'-1 month'`, `'start of month'`, `'start of year'`, applied left to right. The last day of a month is "start of month, add a month, go back a day":

```sql
-- try
SELECT order_date,
       date(order_date, '+30 days') AS plus_30,
       date(order_date, 'start of month', '+1 month', '-1 day') AS month_end
FROM orders
WHERE order_id = 2681
```

`julianday(d)` gives a day number (days since a starting point long ago), so the difference of two is the number of days between them:

```sql
-- try
SELECT r.return_id, o.order_date, r.return_date,
       julianday(r.return_date) - julianday(o.order_date) AS days_to_return
FROM returns r
JOIN orders o ON o.order_id = r.order_id
WHERE r.return_id <= 5
```

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** dates behave like points on a number line, and durations like distances. You can subtract two points to get a distance, or add a distance to a point, but adding two points means nothing.

**Equation:** let J(d) be the day number of date d. Then days between = J(d₂) − J(d₁), and d + n days is the date whose day number is J(d) + n. Truncating to the month is a many-to-one function t(d) = first day of d's month: it maps about 30 dates to one, which is exactly what GROUP BY needs. Weekday is J(d) mod 7, shifted so Sunday is 0.

**Analogy:** house numbers on a long street. Number 140 minus number 128 is 12 houses apart; 128 plus 12 gets you to 140; but 128 plus 140 is not anyone's house. It breaks down a little because months and years are not a fixed number of days, so "+1 month" is a calendar rule, not plain addition.

**Try it:** an order on 2024-12-15 and a return 30 days later. What is the return date? (2025-01-14.)
</details>

## 6. Other databases

The same four ideas, spelled differently:

- **Extract:** SQL Server `DATEPART(month, d)` or `MONTH(d)`; PostgreSQL `EXTRACT(MONTH FROM d)`.
- **Truncate:** SQL Server `DATETRUNC(month, d)` (2022+) or `DATEFROMPARTS(YEAR(d), MONTH(d), 1)`; PostgreSQL `DATE_TRUNC('month', d)`.
- **Add:** SQL Server `DATEADD(day, 30, d)`; PostgreSQL `d + INTERVAL '30 days'`.
- **Difference:** SQL Server `DATEDIFF(day, d1, d2)`; PostgreSQL `d2 - d1` for dates.

Last day of the month: SQL Server `EOMONTH(d)`.

<div class="meaning">

<dl>
<dt>ISO date</dt><dd>Text written <code>'YYYY-MM-DD'</code>. Biggest unit first and fixed width, so text order is date order.</dd>
<dt>strftime(format, d)</dt><dd>Writes a date in a chosen format: <code>%Y</code> year, <code>%m</code> month, <code>%w</code> weekday (0 = Sunday). The result is text.</dd>
<dt>Truncate</dt><dd>Round a date down, for example to the first day of its month, so a whole month shares one value for GROUP BY.</dd>
<dt>date(d, '+7 days')</dt><dd>Moves a date. Modifiers are applied left to right.</dd>
<dt>julianday(d)</dt><dd>A day number; the difference of two is the number of days between them.</dd>
<dt>Physical meaning</dt><dd>Each date is turned into another value on the same row: a part, a rounded date or a number. Grouping by a truncated date makes many dates fall into one group.</dd>
</dl>

</div>

<div class="myth">

**"BETWEEN '2025-01-01' AND '2025-01-31' gets all of January."** It does for plain dates, but if the column holds a time too, '2025-01-31 14:00' is after '2025-01-31' and is missed. Use `>= '2025-01-01' AND < '2025-02-01'`.

</div>

Watch it happen, one step at a time (any live box's **Show how it runs** button animates the real query on Northbay):

<div class="steps">
<div class="step"><b>A date.</b> <table class="lk-tbl"><tr><th>order_date</th></tr><tr><td>2025-03-30</td></tr></table></div>
<div class="step"><b>Pull out parts.</b> <table class="lk-tbl"><tr><th>yr</th><th>mon</th><th>weekday</th></tr><tr><td><mark>'2025'</mark></td><td><mark>'03'</mark></td><td><mark>'0' (Sunday)</mark></td></tr></table> All text.</div>
<div class="step"><b>Truncate.</b> <code>date(order_date, 'start of month')</code> gives <mark>2025-03-01</mark>: every March date now shares one value.</div>
<div class="step"><b>Move.</b> <code>date(order_date, '+7 days')</code> gives <mark>2025-04-06</mark> (the calendar handles the month change).</div>
<div class="step"><b>Subtract.</b> <code>julianday('2025-04-06') - julianday('2025-03-30')</code> = <mark>7</mark> days.</div>
</div>

<div class="problem" data-problem="sql-days-between"></div>

## 7. Worked example

*Question:* are weekends busier than weekdays, per day?

```sql
-- try
SELECT CASE WHEN strftime('%w', order_date) IN ('0', '6') THEN 'weekend' ELSE 'weekday' END AS day_type,
       COUNT(*) AS orders,
       COUNT(DISTINCT order_date) AS days,
       ROUND(1.0 * COUNT(*) / COUNT(DISTINCT order_date), 2) AS orders_per_day
FROM orders
WHERE status = 'completed'
GROUP BY day_type
```

1. `strftime('%w', ...)` gives '0' for Sunday and '6' for Saturday, as text, so compare with `'0'` and `'6'`.
2. Weekdays have more orders in total (2,569 against 1,376), but there are more weekdays (523 against 208).
3. Per day: **6.62** orders on a weekend day, 4.91 on a weekday, about 35% more.
4. Comparing totals alone would have given the wrong answer. Always divide by the number of days when periods differ in length.

## 8. Practice

```sql
-- exercise: Count completed orders per month in 2024 (month as 'YYYY-MM', and the count), in month order.
-- hint: GROUP BY strftime('%Y-%m', order_date), with WHERE order_date LIKE '2024%'.
SELECT order_date, COUNT(*) AS orders
FROM orders
WHERE status = 'completed'
GROUP BY order_date
-- answer:
SELECT strftime('%Y-%m', order_date) AS month, COUNT(*) AS orders
FROM orders
WHERE status = 'completed' AND order_date LIKE '2024%'
GROUP BY month
ORDER BY month
```

```sql
-- exercise: What is the average number of days between an order and the return of a product from it? Round to 1 decimal place.
-- hint: AVG(julianday(r.return_date) - julianday(o.order_date)), joining returns to orders.
SELECT COUNT(*)
FROM returns
-- answer:
SELECT ROUND(AVG(julianday(r.return_date) - julianday(o.order_date)), 1) AS avg_days
FROM returns r
JOIN orders o ON o.order_id = r.order_id
```

```sql
-- exercise: How many orders (any status) were placed in the last 7 days of 2025, 25 to 31 December?
-- hint: order_date >= date('2025-12-31', '-6 days').
SELECT COUNT(*) AS orders
FROM orders
WHERE order_date = '2025-12-31'
-- answer:
SELECT COUNT(*) AS orders
FROM orders
WHERE order_date >= date('2025-12-31', '-6 days')
```

**Try it on your own data:** [[date-calculator]] adds days and counts between dates without any SQL.

<div class="keypoints">

- Write dates as 'YYYY-MM-DD'; then text order is date order.
- strftime pulls out parts (as text); 'start of month' truncates for grouping.
- date(d, '+n days') moves a date; julianday differences count days.
- For timestamps, use >= start AND < next start, not BETWEEN.
- Each database spells these differently, but the four ideas are the same.

</div>

**New words:** *ISO date*, *timestamp*, *strftime*, *truncate*, *julianday*.
