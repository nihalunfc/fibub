---
title: 'Moving averages'
seoTitle: 'SQL moving average (rolling average) with window frames'
summary: 'A moving average smooths noisy daily numbers by averaging each day with the days before it. Watch a 3-row frame slide down the table, then fix the trap of missing days.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'Which frame gives a 3-day moving average on daily rows with no missing days?'
    choices: ['ROWS BETWEEN 3 PRECEDING AND CURRENT ROW', 'ROWS BETWEEN 2 PRECEDING AND CURRENT ROW', 'ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW']
    ans: 1
    why: Two rows before plus the current row makes three rows. 3 PRECEDING would average four days.
  - q: What does a 3-row moving average show on the very first row?
    choices: ['NULL', 'The first value itself, because the frame holds only one row', 'An error']
    ans: 1
    why: There are no earlier rows, so the frame holds just the first row and AVG of one value is that value. Count the rows in the frame if you want to hide short windows.
  - q: 'A store has no sales on some days, so those days have no row. What goes wrong with ROWS BETWEEN 2 PRECEDING?'
    choices: ['Nothing', 'The "3 days" can stretch over a week, because ROWS counts rows, not days', 'The query fails']
    ans: 1
    why: ROWS counts the rows that exist. Fill in the missing days first, or use RANGE on a day number so the frame covers calendar days.
sources:
  - 'SQLite documentation, Window functions: frame specifications https://www.sqlite.org/windowfunctions.html#frame_specifications'
  - 'Microsoft Learn, SELECT - OVER clause (moving averages) https://learn.microsoft.com/en-us/sql/t-sql/queries/select-over-clause-transact-sql'
  - 'NIST/SEMATECH e-Handbook of Statistical Methods, 6.4.2 Moving average https://www.itl.nist.gov/div898/handbook/pmc/section4/pmc42.htm'
---

**Module 6 · about 25 minutes · read first: 6.5.** You'll be able to write a moving average with a ROWS frame, spot the short windows at the start, choose trailing or centred, and handle days with no data.

<div class="bigidea">A moving average is AVG over a frame of fixed size that slides down the rows, smoothing out day-to-day noise so the trend shows.</div>

**In everyday terms:** looking at countryside from a train window. You always see the same width of land; as the train moves, one field slides out at the back and a new one slides in at the front.

## 1. Why this matters

Daily sales jump around: weekends, promotions, the weather. A *moving average* (also called a rolling average) replaces each day with the average of a few days around it, so the trend shows through the noise. A 7-day average is on almost every operations dashboard, and "write a 7-day rolling average" is a favourite interview task.

## 2. A frame that slides

A moving average is AVG with a frame of fixed size. `ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` means "this row and the two before it", so 3 rows. Here is the first week of December 2024:

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
       AVG(sales) OVER (ORDER BY day ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS avg_3day
FROM daily
```

Press **Show how it runs** and step through **OVER**. What to watch:

- On 1 December the window holds only itself: average 150.87.
- On 2 December it holds two rows: (150.87 + 356.18) / 2 = 253.53.
- From 3 December on, the window is always 3 rows tall and slides down one row at a time. Its top edge leaves an old day behind as its bottom edge picks up a new one.

The jump to 356.18 on Monday 2 December is softened, and Saturday 7 December's 285.05 lifts the average only to 172.81.

Press Play so the current row moves along, then change the function and the frame size. Open the RANK types view for ties.

<figure class="fig" data-fig="@data-window-frame"><figcaption>Notice that the frame (shaded) decides what each row may see, and that every input row keeps its own result line.</figcaption></figure>


## 3. Short windows at the start

The first rows average fewer days than the rest, so they are not comparable. Count the rows in each frame and hide the short ones:

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
       COUNT(*) OVER (ORDER BY day ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS days_in_window,
       CASE WHEN COUNT(*) OVER (ORDER BY day ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) = 3
            THEN ROUND(AVG(sales) OVER (ORDER BY day ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) END AS avg_3day
FROM daily
```

Watch `days_in_window` go 1, 2, 3, 3, ... in the animation. In a real report, start the query a few days earlier than the period you show, so even the first day you show has a full window.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a moving average is a running total with a fixed-width frame, divided by the width. It is a low-pass filter: quick wobbles cancel out, slow trends stay.

**Equation:** a trailing k-row average at position i is mᵢ = (xᵢ₋ₖ₊₁ + ... + xᵢ) / k. Using running totals S, mᵢ = (Sᵢ − Sᵢ₋ₖ) / k. Each step adds the new value and drops the oldest: mᵢ = mᵢ₋₁ + (xᵢ − xᵢ₋ₖ) / k. The first k − 1 rows have fewer terms, so the divisor is i, not k.

**Analogy:** a window on a train. You always see the same width of countryside, and as the train moves, one field slides out at the back while a new one slides in at the front. It breaks down a little because a train moves through every metre of ground, while ROWS jumps over days that have no row.

**Try it:** values 6, 9, 3, 12. What is the 3-row trailing average on the last row? ((9 + 3 + 12) / 3 = 8.)
</details>

## 4. Trailing or centred

- *Trailing*: `ROWS BETWEEN 6 PRECEDING AND CURRENT ROW`. Uses only past days, so you can compute today's value today. Standard on dashboards.
- *Centred*: `ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING`. Each day sits in the middle of its window, so the curve does not lag behind the data, but the latest day has no "after" yet. Good for analysing the past.

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
       AVG(sales) OVER (ORDER BY day ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING) AS avg_centred
FROM daily
```

In the animation the window now reaches one row **below** the current row as well as one above.

## 5. Missing days: ROWS counts rows, not days

Northbay Downtown (store 1) has days with no sales, and those days have **no row**. Look at its first two weeks of January 2024:

```sql
-- noviz
WITH daily AS (
  SELECT o.order_date AS day,
         ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS sales
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed' AND o.store_id = 1
    AND o.order_date BETWEEN '2024-01-01' AND '2024-01-13'
  GROUP BY o.order_date
)
SELECT day, sales,
       ROUND(AVG(sales) OVER (ORDER BY day ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS by_rows,
       ROUND(SUM(sales) OVER (ORDER BY julianday(day) RANGE BETWEEN 2 PRECEDING AND CURRENT ROW) / 3.0, 2) AS by_calendar
FROM daily
```

Only 5 days have sales. On 10 January, `by_rows` averages 4, 8 and 10 January (35.20), a "3-day" average stretched over 7 days. `by_calendar` uses *RANGE* on the day number from `julianday()`, so its frame is the calendar days 8, 9 and 10, and dividing the sum by 3 counts the empty 9th as zero: (73.75 + 0 + 9.88) / 3 = **27.88**.

The other fix is to build a full calendar with a recursive CTE ([Lesson 5.5](/learn/courses/sql/recursive-cte/)), LEFT JOIN the sales to it with `COALESCE(sales, 0)`, and then use ROWS as normal. SQL Server does not allow a number with RANGE, so there the calendar is the way. (No animation here: the picture draws ROWS frames only.)

<div class="meaning">

<dl>
<dt>Moving average</dt><dd>The average of this row and a fixed number of neighbours. Also called a rolling average.</dd>
<dt>ROWS BETWEEN 2 PRECEDING AND CURRENT ROW</dt><dd>This row and the 2 before it: a 3-row trailing frame.</dd>
<dt>Trailing</dt><dd>Uses only past rows, so today's value can be worked out today. Standard on dashboards.</dd>
<dt>Centred</dt><dd>Uses rows on both sides (1 PRECEDING AND 1 FOLLOWING); it does not lag behind, but the newest day is not final yet.</dd>
<dt>Short window</dt><dd>At the start there are fewer rows than the frame size, and AVG divides by how many are really there.</dd>
<dt>Physical meaning</dt><dd>Every row stays and gets one smoothed number. A big spike is shared among the rows near it, so peaks get lower and dips get higher.</dd>
</dl>

</div>

<div class="myth">

**"ROWS BETWEEN 6 PRECEDING always means 7 days."** It means 7 rows. If some days have no sales, they have no row, and the frame stretches over more calendar days. Fill the gaps with a date spine (COALESCE to 0) first, or use RANGE on a day number.

</div>

Watch it happen, one step at a time (any live box's **Show how it runs** button animates the real query on Northbay):

<div class="steps">
<div class="step"><b>Daily sales.</b> <table class="lk-tbl"><tr><th>day</th><th>sales</th></tr><tr><td>1</td><td>90</td></tr><tr><td>2</td><td>150</td></tr><tr><td>3</td><td>60</td></tr><tr><td>4</td><td>120</td></tr><tr><td>5</td><td>30</td></tr></table></div>
<div class="step"><b>Day 1.</b> Frame = day 1 only: <mark>90</mark> (a short window).</div>
<div class="step"><b>Day 2.</b> Frame = days 1-2: (90 + 150) ÷ 2 = <mark>120</mark> (still short).</div>
<div class="step"><b>Day 3.</b> Full frame, days 1-3: (90 + 150 + 60) ÷ 3 = <mark>100</mark>.</div>
<div class="step"><b>Days 4 and 5.</b> The frame slides: days 2-4 give (150 + 60 + 120) ÷ 3 = <mark>110</mark>; days 3-5 give (60 + 120 + 30) ÷ 3 = <mark>70</mark>. The jumps of the raw data are softened.</div>
</div>

<div class="problem" data-problem="sql-moving-avg"></div>

## 6. Worked example

*Question:* what was the 7-day trailing average of sales over December 2024, and when did it peak?

```sql
-- noviz
WITH daily AS (
  SELECT o.order_date AS day,
         ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS sales
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed'
    AND o.order_date BETWEEN '2024-12-01' AND '2024-12-31'
  GROUP BY o.order_date
)
SELECT day, sales,
       ROUND(AVG(sales) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW), 2) AS avg_7day
FROM daily
ORDER BY day
```

1. Every December day has sales, so ROWS is safe here: 31 rows.
2. From 7 December the frame is a full week. The average sits between about 150 and 210 until 22 December.
3. The pre-Christmas rush (489.17 on 23 December) pushes it to its December high of **252.10** on 24 December.
4. The single days jump from 67.54 to 489.17; the 7-day line moves far less, which is the point.

**Try it on your own data:** copy the result into [[plot-maker]] to chart the daily sales and the 7-day line together.

## 7. Practice

```sql
-- exercise: For mini_orders in order_id order, show order_id, amount and the average of this order and the one before it (avg_2).
-- hint: AVG(amount) OVER (ORDER BY order_id ROWS BETWEEN 1 PRECEDING AND CURRENT ROW).
SELECT order_id, amount,
       AVG(amount) OVER (ORDER BY order_id) AS avg_2
FROM mini_orders
-- answer:
SELECT order_id, amount,
       AVG(amount) OVER (ORDER BY order_id ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) AS avg_2
FROM mini_orders
```

```sql
-- exercise: For mini_orders in order_id order, show order_id, amount and a centred 3-order average (the order before, this one and the one after).
-- hint: ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING.
SELECT order_id, amount
FROM mini_orders
-- answer:
SELECT order_id, amount,
       AVG(amount) OVER (ORDER BY order_id ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING) AS avg_centred
FROM mini_orders
```

```sql
-- exercise: For mini_orders in order_id order, show order_id, amount and the biggest amount among this order and the two before it (max_3).
-- hint: Frames work with MAX too: MAX(amount) OVER (ORDER BY order_id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW).
SELECT order_id, amount,
       MAX(amount) OVER () AS max_3
FROM mini_orders
-- answer:
SELECT order_id, amount,
       MAX(amount) OVER (ORDER BY order_id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS max_3
FROM mini_orders
```

<div class="keypoints">

- A moving average is AVG(x) OVER (ORDER BY day ROWS BETWEEN k PRECEDING AND CURRENT ROW).
- The first rows have short windows; hide them or start the data earlier.
- Trailing uses only the past; centred uses both sides.
- ROWS counts rows, not days: fill missing days first.

</div>

**New words:** *moving average*, *trailing*, *centred*, *low-pass filter*.
