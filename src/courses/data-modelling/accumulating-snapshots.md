---
title: 'Accumulating snapshot fact tables'
seoTitle: 'Accumulating snapshot fact table explained with SQL'
summary: 'An accumulating snapshot follows each thing through a process with a known end, one row that is updated at every milestone. Build an order-to-return lifecycle for Northbay, run a nightly update, and measure the lag between milestones.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: What makes an accumulating snapshot different from the other two fact table types?
    choices: ['Its rows are updated as each thing reaches new milestones', 'It has no dates', 'It stores one row per day']
    ans: 0
    why: Transaction and periodic snapshot rows are written once. An accumulating snapshot row is revisited each time its order line moves to the next step.
  - q: 'What is the grain of Northbay''s order-to-return lifecycle table?'
    choices: ['One row per completed order line, for its whole life', 'One row per return', 'One row per day']
    ans: 0
    why: Each order line gets one row when it is sold. The row is filled in later if the product comes back, or marked kept when the return window closes.
  - q: Which kind of measure is an accumulating snapshot especially good for?
    choices: ['Lags between milestones, such as days from order to return', 'Daily balances', 'Counts of page views']
    ans: 0
    why: Because every milestone date sits on the same row, the time between two steps is a simple subtraction.
sources:
  - 'Kimball Group, Dimensional modeling techniques https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/'
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley, Chapter 4: Inventory (accumulating snapshot fact table)'
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley, Chapter 6: Order Management (accumulating snapshot for order fulfilment pipeline)'
---

**Module 3 · about 30 minutes · read first: 3.2.** You'll be able to design an accumulating snapshot with milestone dates, load it, update it as milestones happen, and measure lags and pipeline status from it.

<div class="bigidea">An accumulating snapshot keeps one row per thing moving through a process, and fills in a date on that row as each milestone happens.</div>

**In everyday terms:** a parcel tracking page. One parcel, one page: shipped, out for delivery, delivered. The page is updated as the parcel moves, and you can see how long each step took.

## 1. Why this matters

Some questions are about how things move through a process: how long orders take to ship, how many claims are stuck at review, how quickly customers return what they bought. Answering them from transaction facts means stitching events together every time. An *accumulating snapshot* stitches them once, so "how long" and "how many are at each step" become one-line queries. Pipelines, order fulfilment and loan applications are classic uses.

## 2. One row per thing, updated at each milestone

An *accumulating snapshot fact table* has one row for each thing that goes through a process with a clear start and end: an order, a claim, an application. The row has one date column per *milestone* (each step of the process). When a thing reaches a milestone, its row is updated with that date. Its properties:

- **One row per thing**, for its whole life. The row count grows only when new things start.
- **Updated**, unlike every other fact table: blanks get filled in as milestones happen.
- **Lag measures**: days between milestones are stored or worked out on the row.

Northbay's lifecycle has three milestones per order line: **sold** (order date), **return window closes** (30 days later), and **returned** (if it comes back). An order line ends its life either returned or kept once the window closes.

## 3. Load it as of a date

Pretend tonight is 15 December 2025. The table holds every completed order line sold so far, with any return that has happened so far. Lines still inside their 30-day window are "window open".

```sql
-- try
-- noviz
DROP TABLE IF EXISTS fact_order_lifecycle;
CREATE TABLE fact_order_lifecycle AS
SELECT i.order_id, i.product_id AS product_key, o.store_id AS store_key,
       o.order_date,
       date(o.order_date, '+30 days') AS window_closes,
       r.return_date,
       ROUND(i.quantity * i.unit_price * (1 - i.discount), 2) AS sales_amount,
       CASE WHEN r.return_date IS NULL THEN 0 ELSE ROUND(i.quantity * i.unit_price * (1 - i.discount), 2) END AS returned_amount,
       CAST(julianday(r.return_date) - julianday(o.order_date) AS INTEGER) AS days_to_return,
       CASE WHEN r.return_date IS NOT NULL THEN 'returned'
            WHEN date(o.order_date, '+30 days') > '2025-12-15' THEN 'window open'
            ELSE 'kept' END AS status,
       '2025-12-15' AS as_of
FROM order_items i
JOIN orders o ON o.order_id = i.order_id
LEFT JOIN returns r ON r.order_id = i.order_id AND r.product_id = i.product_id AND r.return_date <= '2025-12-15'
WHERE o.status = 'completed' AND o.order_date <= '2025-12-15';
SELECT status, COUNT(*) AS lines, ROUND(SUM(sales_amount), 2) AS sales FROM fact_order_lifecycle GROUP BY status;
```

Of 6,819 lines, 6,156 are long since kept, 464 recent ones are still inside their window, and 199 have come back, each carrying its return date and lag. Look at one returned row: every milestone sits side by side.

```sql
-- try
SELECT order_id, product_key, order_date, window_closes, return_date, days_to_return, status
FROM fact_order_lifecycle
WHERE status = 'returned'
ORDER BY order_date DESC
LIMIT 5
```

## 4. The nightly update

Now it's 31 December. Since the last load, some open lines have come back, more windows have closed, and new orders have been placed. An accumulating snapshot handles all three with ordinary SQL:

```sql
-- try
-- noviz
-- 1. Fill in returns that happened since the last load.
UPDATE fact_order_lifecycle
SET return_date = (SELECT r.return_date FROM returns r
                   WHERE r.order_id = fact_order_lifecycle.order_id AND r.product_id = fact_order_lifecycle.product_key)
WHERE return_date IS NULL
  AND EXISTS (SELECT 1 FROM returns r
              WHERE r.order_id = fact_order_lifecycle.order_id AND r.product_id = fact_order_lifecycle.product_key
                AND r.return_date <= '2025-12-31');
UPDATE fact_order_lifecycle
SET returned_amount = sales_amount,
    days_to_return = CAST(julianday(return_date) - julianday(order_date) AS INTEGER)
WHERE return_date IS NOT NULL AND returned_amount = 0;
-- 2. Add order lines sold since the last load.
INSERT INTO fact_order_lifecycle
SELECT i.order_id, i.product_id, o.store_id, o.order_date, date(o.order_date, '+30 days'), r.return_date,
       ROUND(i.quantity * i.unit_price * (1 - i.discount), 2),
       CASE WHEN r.return_date IS NULL THEN 0 ELSE ROUND(i.quantity * i.unit_price * (1 - i.discount), 2) END,
       CAST(julianday(r.return_date) - julianday(o.order_date) AS INTEGER), NULL, NULL
FROM order_items i
JOIN orders o ON o.order_id = i.order_id
LEFT JOIN returns r ON r.order_id = i.order_id AND r.product_id = i.product_id AND r.return_date <= '2025-12-31'
WHERE o.status = 'completed' AND o.order_date > '2025-12-15' AND o.order_date <= '2025-12-31';
-- 3. Move every row's status on to tonight.
UPDATE fact_order_lifecycle
SET status = CASE WHEN return_date IS NOT NULL THEN 'returned'
                  WHEN window_closes > '2025-12-31' THEN 'window open'
                  ELSE 'kept' END,
    as_of = '2025-12-31';
SELECT status, COUNT(*) AS lines, ROUND(SUM(sales_amount), 2) AS sales FROM fact_order_lifecycle GROUP BY status;
```

Compare the two status tables. Returned went from 199 to 204, kept from 6,156 to 6,378 as windows closed, and window open from 464 to 530 as new December lines joined. The table now has 7,112 rows, one per completed line. No row was added for a return: the existing row was completed. In a real warehouse this runs every night, usually as a MERGE ([Lesson 7.2](/learn/courses/data-modelling/merge-loads/)).

<!--fig:fact-types-->

## 5. Lags: the reason to build one

With all milestones on one row, "how long between steps" is subtraction, and the pipeline's shape is one GROUP BY:

```sql
-- try
SELECT CASE WHEN days_to_return <= 7 THEN '1 to 7 days'
            WHEN days_to_return <= 14 THEN '8 to 14 days'
            WHEN days_to_return <= 21 THEN '15 to 21 days'
            ELSE '22 to 30 days' END AS returned_within,
       COUNT(*) AS returns
FROM fact_order_lifecycle
WHERE status = 'returned'
GROUP BY returned_within
ORDER BY MIN(days_to_return)
```

From transaction facts you'd have to join sales to returns every time, and remember to keep the lines that never came back.

<div class="meaning">

<dl>
<dt>Accumulating snapshot</dt><dd>One row per thing (order line, claim, application) for its whole life.</dd>
<dt>Milestone</dt><dd>A step of the process, with its own date column on the row.</dd>
<dt>Lag</dt><dd>Days between two milestones, worked out on the row.</dd>
<dt>Pipeline status</dt><dd>Where each thing is now, such as window open, returned or kept.</dd>
<dt>Physical meaning</dt><dd>The first load inserts one row per new thing with blanks for future milestones. Each night the load updates existing rows as milestones happen and inserts rows for new things; it never adds a row for a milestone.</dd>
</dl>

</div>

<div class="myth">

**"Fact tables are never updated, so add a new row when a return happens."** That is how transaction facts work. An accumulating snapshot is the one fact table that is updated: the return fills in the existing row, so lags are a simple subtraction.

</div>

Watch it happen, one step at a time (and press **Show how it runs** on any live SQL box in this lesson to animate the real query):

<div class="steps">
<div class="step"><b>Load on 15 Dec.</b> <table class="lk-tbl"><tr><th>line</th><th>sold</th><th>returned</th><th>status</th></tr><tr><td>A</td><td>1 Nov</td><td></td><td>kept</td></tr><tr><td>B</td><td>5 Dec</td><td></td><td>window open</td></tr></table></div>
<div class="step"><b>B comes back on 20 Dec.</b> The row is updated: <table class="lk-tbl"><tr><th>line</th><th>sold</th><th>returned</th><th>status</th></tr><tr><td>A</td><td>1 Nov</td><td></td><td>kept</td></tr><tr><td>B</td><td>5 Dec</td><td><mark>20 Dec</mark></td><td><mark>returned</mark></td></tr></table></div>
<div class="step"><b>A new sale.</b> A new row joins: <table class="lk-tbl"><tr><th>line</th><th>sold</th><th>returned</th><th>status</th></tr><tr><td>A</td><td>1 Nov</td><td></td><td>kept</td></tr><tr><td>B</td><td>5 Dec</td><td>20 Dec</td><td>returned</td></tr><tr><td><mark>C</mark></td><td><mark>28 Dec</mark></td><td></td><td><mark>window open</mark></td></tr></table></div>
<div class="step"><b>Lag by subtraction.</b> <table class="lk-tbl"><tr><th>line</th><th>days_to_return</th></tr><tr><td>B</td><td><mark>15</mark></td></tr></table></div>
</div>

**Try one with fresh numbers:**

<div class="problem" data-problem="dm-acc-status"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** each thing moves through an ordered list of milestones, and its row records the time it reached each one. Lags are differences of those times.

**Equation:** for an order line with milestone dates t₀ (sold) ≤ t₁ (returned), the lag is Δ = t₁ − t₀, here worked out as julianday(t₁) − julianday(t₀). Milestones not yet reached are NULL, and every aggregate over Δ must skip them; AVG does that automatically. At any date T, each row is in exactly one state (returned, window open or kept), so the states partition the rows and their counts add to the table's row count.

**Analogy:** a parcel tracking page. One parcel, one page; "dispatched", "out for delivery", "delivered" fill in as they happen. You don't get a new page for each step.

**Try it:** a line sold on 1 December and returned on 13 December. What is days_to_return? (12.)
</details>

## 6. Worked example: how fast do things come back?

*Question:* which departments are returned soonest after purchase?

```sql
-- try
SELECT c.department,
       COUNT(*) AS returns,
       ROUND(AVG(f.days_to_return), 1) AS avg_days_to_return,
       MIN(f.days_to_return) AS fastest,
       MAX(f.days_to_return) AS slowest
FROM fact_order_lifecycle f
JOIN products p ON p.product_id = f.product_key
JOIN categories c ON c.category_id = p.category_id
WHERE f.status = 'returned'
GROUP BY c.department
ORDER BY avg_days_to_return
```

1. Filter to returned lines, because the lag only exists for them.
2. AVG of `days_to_return` gives the typical lag: Grocery comes back soonest (12.2 days on average), Kids slowest (18.1). MIN and MAX show the spread; no return is later than 25 days, inside the 30-day window, as the business rule says.
3. The same table also answers "how many lines are still returnable tonight?": `WHERE status = 'window open'`. One table, both the history and the current pipeline.

## 7. Practice

```sql
-- exercise: Show the return rate by value per store: SUM(returned_amount) / SUM(sales_amount) × 100 (1 decimal), only for lines whose window has closed or that were returned, highest first.
-- hint: WHERE status IN ('returned', 'kept') leaves out lines that could still come back. GROUP BY store_key.
SELECT store_key, SUM(returned_amount) AS returned
FROM fact_order_lifecycle
GROUP BY store_key
-- answer:
SELECT store_key, ROUND(100.0 * SUM(returned_amount) / SUM(sales_amount), 1) AS return_pct
FROM fact_order_lifecycle
WHERE status IN ('returned', 'kept')
GROUP BY store_key
ORDER BY return_pct DESC
```

```sql
-- exercise: List the lines still in their return window as of 31 December 2025: count them and total their sales, per window_closes month.
-- hint: WHERE status = 'window open'; GROUP BY substr(window_closes, 1, 7).
SELECT COUNT(*) AS lines
FROM fact_order_lifecycle
-- answer:
SELECT substr(window_closes, 1, 7) AS closes_in, COUNT(*) AS lines, ROUND(SUM(sales_amount), 2) AS sales_at_risk
FROM fact_order_lifecycle
WHERE status = 'window open'
GROUP BY closes_in
```

```sql
-- exercise: Average days to return per year of the order date (only returned lines), rounded to 1 decimal.
-- hint: GROUP BY substr(order_date, 1, 4); AVG(days_to_return) WHERE status = 'returned'.
SELECT substr(order_date, 1, 4) AS year, COUNT(*) AS lines
FROM fact_order_lifecycle
GROUP BY year
-- answer:
SELECT substr(order_date, 1, 4) AS year, ROUND(AVG(days_to_return), 1) AS avg_days
FROM fact_order_lifecycle
WHERE status = 'returned'
GROUP BY year
```

**Try it on your own data:** [[date-calculator]] works out the days between two milestone dates when you want to check a lag by hand.

<div class="keypoints">

- One row per thing, for a process with a clear start and end.
- One date column per milestone, filled in as it happens.
- The only fact table that is updated (usually with MERGE).
- Lags between milestones become simple subtraction.
- At any date each row has exactly one status, so status counts add to the row count.

</div>

**New words:** *accumulating snapshot fact table*, *milestone*, *lag*, *pipeline status*.
