---
title: 'Running totals and window frames'
seoTitle: 'SQL running total with SUM OVER and window frames'
summary: 'Add ORDER BY inside OVER and SUM becomes a running total. Learn the window frame (ROWS BETWEEN ...) that controls which rows are added, and the RANGE trap with ties.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'What does SUM(sales) OVER (ORDER BY day) give on the third day?'
    choices: ['Sales of day 3 only', 'Sales of days 1, 2 and 3 added up', 'Sales of all days']
    ans: 1
    why: With ORDER BY and no frame written, the window runs from the first row up to the current row, so each row gets the total so far.
  - q: How do you make a running total start again each year?
    choices: ['Add PARTITION BY year inside OVER', 'Add GROUP BY year', 'Add WHERE year = 2025']
    ans: 0
    why: PARTITION BY splits the rows into one window group per year, and the running sum restarts at the first row of each group.
  - q: 'Two rows have the same ORDER BY value. With the default frame, what happens?'
    choices: ['They get different running totals', 'They get the same running total, which includes both', 'The query fails']
    ans: 1
    why: The default frame is RANGE, which treats tied rows as one step. Write ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW (and add a tie-breaker) to add them one at a time.
---

**Module 6 · about 30 minutes · read first: 6.1.** You'll be able to build running totals and year-to-date figures with SUM OVER, write a window frame with ROWS BETWEEN, and avoid the default-frame trap when the order has ties.

## 1. Why this matters

Finance and sales teams live on running figures: month-to-date revenue, year-to-date against target, cumulative sign-ups. Dashboards often compute them in the tool, but the SQL version is faster, testable and the same in every report. Window frames are also the step from "I know OVER" to "I know window functions" in an interview.

## 2. ORDER BY turns a total into a running total

In [Lesson 6.1](/learn/courses/sql/over/), `SUM(x) OVER ()` gave every row the grand total. Put an ORDER BY inside the brackets and each row gets the total **so far** instead: a *running total*, also called a cumulative sum.

Here is Northbay's completed sales per day for the first week of December 2024:

```sql
-- try
WITH daily AS (
  SELECT o.order_date AS day,
         ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS sales
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed'
    AND o.order_date BETWEEN '2024-12-01' AND '2024-12-07'
  GROUP BY o.order_date
)
SELECT day, sales,
       SUM(sales) OVER (ORDER BY day) AS running_total
FROM daily
```

Press **Show how it runs** and step through **OVER** row by row. What to watch: the highlighted window always starts at 1 December and its bottom edge moves down one row each time, so the sum grows: 150.87, then 150.87 + 356.18 = 507.05, then 754.10, and so on to **1,439.32** on 7 December.

## 3. The window frame

The *frame* is the part of the partition that the function adds up for the current row. You can write it out:

```sql
-- try
WITH daily AS (
  SELECT o.order_date AS day,
         ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS sales
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed'
    AND o.order_date BETWEEN '2024-12-01' AND '2024-12-07'
  GROUP BY o.order_date
)
SELECT day, sales,
       SUM(sales) OVER (ORDER BY day ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM daily
```

Same answer, said in full. The pieces:

- `ROWS` counts physical rows.
- `UNBOUNDED PRECEDING`: from the first row of the partition.
- `n PRECEDING` / `n FOLLOWING`: n rows before or after this one.
- `CURRENT ROW`: this row.
- `UNBOUNDED FOLLOWING`: to the last row of the partition.

Change the frame to `ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING` and run the animation again: now the window starts at each row and reaches to the end, a "remaining total". Moving averages in [Lesson 6.6](/learn/courses/sql/moving-averages/) use `2 PRECEDING`.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a running total is a partial sum. The frame says which slice of the ordered sequence each row sums over.

**Equation:** with values x₁, ..., xₙ in order, the running total is Sᵢ = x₁ + x₂ + ... + xᵢ = Σⱼ₌₁ⁱ xⱼ. A general frame ROWS BETWEEN a PRECEDING AND b FOLLOWING gives Σ xⱼ for j from max(1, i − a) to min(n, i + b). Note Sᵢ − Sᵢ₋₁ = xᵢ: the running total undoes LAG's first difference, as an integral undoes a derivative.

**Analogy:** a car's trip meter. Each kilometre adds to the reading, and you can reset it (a new partition) at the start of each trip. It breaks down a little because a real meter has no "ties", while SQL rows can share an ORDER BY value, which is where RANGE comes in.

**Try it:** values 3, 5, 2 in order. What is the running total on the last row, and the remaining total (CURRENT ROW AND UNBOUNDED FOLLOWING) on the first? (10 and 10.)
</details>

## 4. Restart per group: year-to-date

PARTITION BY makes the running total start again in each group. With quarterly sales and `PARTITION BY year`, you get *year-to-date* (YTD):

```sql
-- try
WITH q AS (
  SELECT substr(o.order_date, 1, 4) AS yr,
         (CAST(substr(o.order_date, 6, 2) AS INTEGER) + 2) / 3 AS qtr,
         ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS sales
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed'
  GROUP BY yr, qtr
)
SELECT yr, qtr, sales,
       SUM(sales) OVER (PARTITION BY yr ORDER BY qtr) AS ytd
FROM q
```

At the OVER step, watch the window snap back to a single row when it reaches 2025 Q1: 2024 and 2025 are separate partitions.

## 5. The RANGE trap with ties

When you leave the frame out, most databases use `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`. *RANGE* treats all rows with the same ORDER BY value as one step. With unique days that is the same as ROWS. With ties it is not. `mini_orders` has two $45 orders:

```sql
-- noviz
SELECT order_id, amount,
       SUM(amount) OVER (ORDER BY amount) AS default_range,
       SUM(amount) OVER (ORDER BY amount, order_id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS with_rows
FROM mini_orders
```

Run it. Orders 101 and 105 both show **115** in `default_range` (5 + 20 + 45 + 45), because RANGE adds both $45s at once. With ROWS and a tie-breaker, 101 shows 70 and 105 shows 115. If your running total "jumps" on some rows, look for ties in the ORDER BY. (The animation draws frames row by row, so this example has no "Show how it runs".)

## 6. Worked example

*Question:* how much did Northbay sell in 2025 up to the end of each quarter?

From the YTD query above, the 2025 rows:

1. Q1: 15,192.20 (just Q1).
2. Q2: 15,192.20 + 17,001.57 = 32,193.77.
3. Q3: + 18,816.43 = 51,010.20.
4. Q4: + 21,584.32 = **72,594.52**, the full-year 2025 total.

Check it: the last YTD row of a year should equal that year's plain `SUM`. Run this to confirm.

```sql
-- try
SELECT ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS sales_2025
FROM orders o
JOIN order_items i ON i.order_id = o.order_id
WHERE o.status = 'completed' AND o.order_date LIKE '2025%'
```

## 7. Practice

```sql
-- exercise: For mini_orders in order_id order, show order_id, amount and a running total of amount (running).
-- hint: SUM(amount) OVER (ORDER BY order_id).
SELECT order_id, amount
FROM mini_orders
-- answer:
SELECT order_id, amount,
       SUM(amount) OVER (ORDER BY order_id) AS running
FROM mini_orders
```

```sql
-- exercise: Show each customer's running spend in mini_orders: order_id, customer_id, amount, and the total of that customer's orders so far (ordered by order_id).
-- hint: Add PARTITION BY customer_id before the ORDER BY.
SELECT order_id, customer_id, amount,
       SUM(amount) OVER (ORDER BY order_id) AS running
FROM mini_orders
-- answer:
SELECT order_id, customer_id, amount,
       SUM(amount) OVER (PARTITION BY customer_id ORDER BY order_id) AS running
FROM mini_orders
```

```sql
-- exercise: For mini_orders in order_id order, show order_id, amount and how much is still to come, including this order (remaining).
-- hint: ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING.
SELECT order_id, amount,
       SUM(amount) OVER (ORDER BY order_id) AS remaining
FROM mini_orders
-- answer:
SELECT order_id, amount,
       SUM(amount) OVER (ORDER BY order_id ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING) AS remaining
FROM mini_orders
```

**New words:** *running total*, *window frame*, *ROWS*, *RANGE*, *year-to-date*.
