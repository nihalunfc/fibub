---
title: Month-over-month and year-over-year growth
seoTitle: 'SQL month over month growth and YoY, with examples'
summary: 'Turn orders into a monthly revenue table, then use LAG to work out month-over-month and year-over-year growth, without the traps of missing months and integer division.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'Revenue was $4,000 last month and $5,000 this month. What is the month-over-month growth?'
    choices: ['20%', '25%', '125%']
    ans: 1
    why: 'Growth = (new − old) / old = (5,000 − 4,000) / 4,000 = 0.25, so 25%. Always divide by the older number.'
  - q: 'In a table with one row per month, which gives the same month last year?'
    choices: ['LAG(revenue, 1) OVER (ORDER BY month)', 'LAG(revenue, 12) OVER (ORDER BY month)', 'LEAD(revenue, 12) OVER (ORDER BY month)']
    ans: 1
    why: 'LAG looks back. Twelve rows back is twelve months back, but only if no month is missing.'
  - q: Why join a full calendar of months before using LAG?
    choices: ['LAG only works on dates', 'A month with no sales has no row, so LAG would skip it and compare the wrong months', 'It makes the query faster']
    ans: 1
    why: 'LAG counts rows, not months. A missing row makes "the row before" a month that is two or more months back.'
---

**Module 8 · about 30 minutes · read first: 6.4, 7.1.** You'll be able to build a monthly revenue table and add month-over-month (MoM) and year-over-year (YoY) growth columns that are correct even when months are missing.

## 1. Why this matters

"How did we do compared with last month, and compared with last year?" is the first question in almost every sales meeting. The query behind it is one of the most-written queries in analyst jobs, and it turns up in interviews all the time. It mixes three skills you already have: grouping by month, window functions and careful arithmetic.

## 2. Step one: one row per month

Growth compares a number with an earlier number of the *same kind*. So first make a table with exactly one row per month. On Northbay, revenue is the value of the lines in completed orders: quantity × unit price × (1 − discount).

```sql
-- try
SELECT strftime('%Y-%m', o.order_date) AS month,
       ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS revenue
FROM orders o
JOIN order_items i ON i.order_id = o.order_id
WHERE o.status = 'completed'
GROUP BY month
ORDER BY month
```

You get 24 rows, January 2024 to December 2025. `strftime('%Y-%m', ...)` turns a date into its month, like `2025-12`. (SQL Server: `FORMAT(order_date, 'yyyy-MM')` or `DATETRUNC(month, order_date)`; PostgreSQL: `date_trunc('month', order_date)`.)

## 3. Month-over-month growth with LAG

**Month-over-month growth** is the change since the month before, as a share of the month before. `LAG(revenue)` fetches the previous row's revenue ([Lesson 6.4](/learn/courses/sql/lag-lead/)), so put the monthly table in a CTE and add the window on top.

```sql
-- try
WITH monthly AS (
  SELECT strftime('%Y-%m', o.order_date) AS month,
         SUM(i.quantity * i.unit_price * (1 - i.discount)) AS revenue
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed'
  GROUP BY month
)
SELECT month,
       ROUND(revenue, 2) AS revenue,
       ROUND(LAG(revenue) OVER (ORDER BY month), 2) AS prev_month,
       ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
             / LAG(revenue) OVER (ORDER BY month), 1) AS mom_pct
FROM monthly
ORDER BY month
```

The first month has no month before it, so `prev_month` and `mom_pct` are NULL. That is correct: there is nothing to compare with. Notice the swings: February 2024 is down 31.9% (a short, quiet month after the January sale), and November 2024 is up 40.1% (Black Friday).

Two habits keep this arithmetic safe:

- Write `100.0`, not `100`. In SQLite, SQL Server and PostgreSQL, an integer divided by an integer drops the fraction, so a 25% rise can come out as 0.
- Wrap the divisor in `NULLIF(x, 0)`. If last month was 0, you get NULL instead of an error or a meaningless infinity.

## 4. Year-over-year growth

Monthly numbers swing with the seasons: December is always busy. **Year-over-year growth** compares a month with the same month a year earlier, which cancels out the season. In a table with one row per month, a year earlier is 12 rows back: `LAG(revenue, 12)`.

```sql
-- try
WITH monthly AS (
  SELECT strftime('%Y-%m', o.order_date) AS month,
         SUM(i.quantity * i.unit_price * (1 - i.discount)) AS revenue
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed'
  GROUP BY month
)
SELECT month,
       ROUND(revenue, 2) AS revenue,
       ROUND(LAG(revenue, 12) OVER (ORDER BY month), 2) AS same_month_last_year,
       ROUND(100.0 * (revenue - LAG(revenue, 12) OVER (ORDER BY month))
             / NULLIF(LAG(revenue, 12) OVER (ORDER BY month), 0), 1) AS yoy_pct
FROM monthly
ORDER BY month
```

All of 2024 shows NULL for YoY, because the data starts in January 2024. Every month of 2025 grew on the year before, from +8.3% in September to +94.2% in February.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** growth is a ratio of two values of the same measure at two times. Before you can take the ratio, the data must be indexed by time with exactly one value per period.

**Equation:** g(t) = (x(t) − x(t−k)) / x(t−k), with k = 1 for MoM and k = 12 for YoY on monthly data. In relational algebra the monthly table is γ<sub>month; SUM(value)</sub>(σ<sub>status='completed'</sub>(orders ⋈ order_items)). LAG then reads x(t−k) by position in the ordered result, so it is only right if position = time, which needs every month present.

**Analogy:** comparing your height with your height "two lines up" on a growth chart. If someone skipped a year on the chart, two lines up is no longer two years ago.

**Try it:** growth compounds. Two months of +10% is 1.1 × 1.1 = 1.21, so +21%, not +20%. What do +50% then −50% give? (1.5 × 0.5 = 0.75: a 25% fall.)
</details>

## 5. The missing-month trap

Company revenue has a row for every month, but smaller slices often do not. Northbay sold no duvets in April or May 2024, so in a per-product monthly table, the row before June 2024 is March 2024. `LAG` would quietly call that "last month".

```sql
-- try
SELECT strftime('%Y-%m', o.order_date) AS month,
       SUM(i.quantity) AS duvets
FROM orders o
JOIN order_items i ON i.order_id = o.order_id
WHERE o.status = 'completed' AND i.product_id = 43
GROUP BY month
ORDER BY month
```

Only 17 rows instead of 24. The fix: build a calendar of every month with a recursive CTE ([Lesson 5.5](/learn/courses/sql/recursive-cte/)), LEFT JOIN the sales onto it and turn missing sales into 0.

```sql
-- try
WITH RECURSIVE months(m) AS (
  SELECT '2024-01-01'
  UNION ALL
  SELECT date(m, '+1 month') FROM months WHERE m < '2025-12-01'
),
duvets AS (
  SELECT strftime('%Y-%m', o.order_date) AS month, SUM(i.quantity) AS sold
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed' AND i.product_id = 43
  GROUP BY month
)
SELECT strftime('%Y-%m', months.m) AS month,
       COALESCE(d.sold, 0) AS sold,
       LAG(COALESCE(d.sold, 0)) OVER (ORDER BY months.m) AS prev_month
FROM months
LEFT JOIN duvets d ON d.month = strftime('%Y-%m', months.m)
ORDER BY month
```

Now June 2024 is compared with May 2024 (0 sold), as it should be. Growth from 0 is undefined, which is exactly why you use `NULLIF` in the divisor.

## 6. Worked example

*Question:* how did December 2025 do?

1. Monthly table (section 2): December 2025 revenue = **$9,136.83**.
2. Month before: November 2025 = $7,039.58. MoM = (9,136.83 − 7,039.58) / 7,039.58 = **+29.8%**.
3. Same month last year: December 2024 = $6,378.04. YoY = (9,136.83 − 6,378.04) / 6,378.04 = **+43.3%**.
4. For the whole year, group by year instead: 2025 = $72,594.52, 2024 = $53,985.46, so **+34.5%**.

The one-line insight for a manager: "December was our best month ever, up 43% on last December; the whole year grew 34.5%." Notice that the MoM figure on its own (+29.8%) mostly reflects the holiday season, which is why YoY is the fairer headline.

## 7. Practice

```sql
-- exercise: Show each month with its number of completed orders and the month-over-month change in orders as a percentage (1 decimal place), in month order.
-- hint: Count orders per month in a CTE, then use LAG(orders) OVER (ORDER BY month). Remember 100.0.
SELECT strftime('%Y-%m', order_date) AS month, COUNT(*) AS orders
FROM orders
WHERE status = 'completed'
GROUP BY month
ORDER BY month
-- answer:
WITH m AS (
  SELECT strftime('%Y-%m', order_date) AS month, COUNT(*) AS orders
  FROM orders
  WHERE status = 'completed'
  GROUP BY month
)
SELECT month, orders,
       ROUND(100.0 * (orders - LAG(orders) OVER (ORDER BY month))
             / LAG(orders) OVER (ORDER BY month), 1) AS mom_pct
FROM m
ORDER BY month
```

```sql
-- exercise: Work out year-over-year revenue growth for each channel (store and online): one row per channel with 2024 revenue, 2025 revenue and growth in % to 1 decimal place.
-- hint: Use SUM(CASE WHEN strftime('%Y', o.order_date) = '2024' THEN ... END) for each year, grouped by channel.
SELECT o.channel,
       ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS revenue
FROM orders o
JOIN order_items i ON i.order_id = o.order_id
WHERE o.status = 'completed'
GROUP BY o.channel
-- answer:
WITH y AS (
  SELECT o.channel,
         SUM(CASE WHEN strftime('%Y', o.order_date) = '2024' THEN i.quantity * i.unit_price * (1 - i.discount) END) AS rev_2024,
         SUM(CASE WHEN strftime('%Y', o.order_date) = '2025' THEN i.quantity * i.unit_price * (1 - i.discount) END) AS rev_2025
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed'
  GROUP BY o.channel
)
SELECT channel, ROUND(rev_2024, 2) AS rev_2024, ROUND(rev_2025, 2) AS rev_2025,
       ROUND(100.0 * (rev_2025 - rev_2024) / rev_2024, 1) AS growth_pct
FROM y
```

Online grew 77.3% and stores 22.5%: the online shop is where the growth is.

```sql
-- exercise: Which month had the biggest month-over-month fall in revenue? Return that one month and its MoM % (1 decimal place).
-- hint: Work out mom_pct in a second CTE, then ORDER BY mom_pct and LIMIT 1. NULLs sort first in SQLite, so filter them out.
WITH monthly AS (
  SELECT strftime('%Y-%m', o.order_date) AS month,
         SUM(i.quantity * i.unit_price * (1 - i.discount)) AS revenue
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed'
  GROUP BY month
)
SELECT month, ROUND(revenue, 2) AS revenue
FROM monthly
-- answer:
WITH monthly AS (
  SELECT strftime('%Y-%m', o.order_date) AS month,
         SUM(i.quantity * i.unit_price * (1 - i.discount)) AS revenue
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed'
  GROUP BY month
),
g AS (
  SELECT month,
         100.0 * (revenue - LAG(revenue) OVER (ORDER BY month)) / LAG(revenue) OVER (ORDER BY month) AS mom_pct
  FROM monthly
)
SELECT month, ROUND(mom_pct, 1) AS mom_pct
FROM g
WHERE mom_pct IS NOT NULL
ORDER BY mom_pct
LIMIT 1
```

**Try it on your own data:** export a monthly table and chart it with [[plot-maker]], or run your own CSV through these queries in [[sql-playground]].

**New words:** *month-over-month (MoM) growth*, *year-over-year (YoY) growth*, *seasonality*, *calendar table*.
