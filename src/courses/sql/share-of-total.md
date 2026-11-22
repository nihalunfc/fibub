---
title: 'Share of total, NTILE and percentiles'
seoTitle: 'SQL percent of total, NTILE and median with window functions'
summary: 'Divide each row by SUM() OVER () to get its share of the total, split rows into equal buckets with NTILE, and find medians and percentiles in SQL.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'amount is an INTEGER column. What does amount / SUM(amount) OVER () give in SQLite or SQL Server?'
    choices: ['The share as a decimal, such as 0.34', 'Mostly 0, because whole numbers divide to whole numbers', 'An error']
    ans: 1
    why: Integer divided by integer is whole-number division, so 90 / 265 is 0. Multiply by 100.0 (or CAST to REAL) first.
  - q: What does NTILE(4) OVER (ORDER BY spend DESC) do?
    choices: ['Keeps the top 4 rows', 'Splits the rows into 4 groups of (almost) equal size and numbers them 1 to 4', 'Rounds spend to 4 places']
    ans: 1
    why: NTILE deals rows out into the given number of buckets in order, so bucket 1 is the top quarter. If the rows do not divide evenly, the first buckets get one extra.
  - q: Why is the median often a better "typical customer" than the average?
    choices: ['It is faster to compute', 'A few very big spenders pull the average up, but not the median', 'The average ignores NULLs']
    ans: 1
    why: The median is the middle value, so it does not care how far the top values stretch. Spending data usually has a long tail of big spenders.
sources:
  - 'SQLite documentation, Window functions: ntile, percent_rank, cume_dist https://www.sqlite.org/windowfunctions.html#builtins'
  - 'Microsoft Learn, NTILE (Transact-SQL) https://learn.microsoft.com/en-us/sql/t-sql/functions/ntile-transact-sql'
  - 'PostgreSQL documentation, Aggregate functions: percentile_cont https://www.postgresql.org/docs/current/functions-aggregate.html'
---

**Module 6 · about 30 minutes · read first: 6.2.** You'll be able to work out each row's share of a total or of its group, split rows into quartiles with NTILE, and find a median or percentile with window functions.

<div class="bigidea">A share is a row's value divided by the total of its window; NTILE and percentiles say where a row stands among all the others.</div>

**In everyday terms:** slicing a pizza. Each slice is a share, and all the slices of one pizza make exactly one whole. NTILE is dealing a pile of cards into equal hands.

## 1. Why this matters

"What share of sales is Grocery?", "how much do our top 25% of customers bring in?", "what does a typical customer spend?" These three questions are behind most pie charts, Pareto charts and customer segments a BI team builds. All of them come from one row compared with the whole, which is exactly what window functions do.

## 2. Share of total

Put the grand total next to each row with `SUM() OVER ()` and divide. Watch out for one trap first: `amount` in `mini_orders` is a whole number, and whole number ÷ whole number is whole-number division in SQLite and SQL Server.

```sql
-- try
SELECT order_id, amount,
       SUM(amount) OVER () AS total,
       amount / SUM(amount) OVER () AS wrong_share,
       ROUND(100.0 * amount / SUM(amount) OVER (), 1) AS pct
FROM mini_orders
```

`wrong_share` is 0 on every row; `pct` is right: the $90 duvet is 34% of the $265. Writing `100.0` makes the sum a decimal before dividing. (PostgreSQL also divides integers to an integer; MySQL does not.)

Press **Show how it runs**: the OVER step draws `total`, a window that covers all 6 rows for every row.

Press Play so the current row moves along, then change the function and the frame size. Open the RANK types view for ties.

<figure class="fig" data-fig="@data-window-frame"><figcaption>Notice that the frame (shaded) decides what each row may see, and that every input row keeps its own result line.</figcaption></figure>


## 3. Share within a group

Change `OVER ()` to `OVER (PARTITION BY ...)` and the share is of the group, not of everything. Here is the online share of each year's sales:

```sql
-- try
WITH c AS (
  SELECT substr(o.order_date, 1, 4) AS yr, o.channel,
         ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS sales
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed'
  GROUP BY yr, o.channel
)
SELECT yr, channel, sales,
       SUM(sales) OVER (PARTITION BY yr) AS year_total,
       ROUND(100.0 * sales / SUM(sales) OVER (PARTITION BY yr), 1) AS pct_of_year
FROM c
```

In the animation, the 2024 rows share one window and the 2025 rows another. Online grew from **21.8%** of sales in 2024 to **28.8%** in 2025. Each year's shares add up to 100, which is a good check.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a share is a row's value divided by the sum over its partition. Shares inside a partition always add to 1 (or 100%).

**Equation:** shareᵢ = xᵢ / Σⱼ∈P(i) xⱼ, so Σᵢ∈P shareᵢ = 1. NTILE(k) on n ordered rows gives bucket ⌈i · k / n⌉ roughly: the first n mod k buckets get ⌊n/k⌋ + 1 rows, the rest ⌊n/k⌋. PERCENT_RANK = (RANK − 1) / (n − 1), in [0, 1]. CUME_DIST = (rows with value ≤ mine) / n. The median is the value at position (n + 1) / 2, or the mean of the two middle values when n is even.

**Analogy:** cutting a pizza. Shares are the slice sizes, and they always make one whole pizza. NTILE is dealing cards: 598 customers dealt into 4 piles, the first two piles get one extra. It breaks down a little because cards are dealt round the table, while NTILE fills pile 1 completely before pile 2.

**Try it:** 6 rows, NTILE(4). How many rows in each bucket? (2, 2, 1, 1.)
</details>

## 4. NTILE: equal-sized buckets

`NTILE(n) OVER (ORDER BY ...)` deals the rows, in order, into n buckets of nearly equal size and gives each row its bucket number. NTILE(4) gives *quartiles*, NTILE(10) *deciles*.

```sql
-- try
SELECT order_id, amount,
       NTILE(3) OVER (ORDER BY amount DESC) AS bucket
FROM mini_orders
```

Six orders into 3 buckets: 2 per bucket. Note that the two $45 orders land in the same bucket here only by luck. NTILE cuts by position, so tied values can be split across buckets.

## 5. Percentiles and the median

- *PERCENT_RANK()*: 0 for the lowest row, 1 for the highest.
- *CUME_DIST()*: the fraction of rows with a value less than or equal to this one.

```sql
-- try
SELECT order_id, amount,
       CUME_DIST() OVER (ORDER BY amount) AS cume,
       PERCENT_RANK() OVER (ORDER BY amount) AS pct_rank
FROM mini_orders
```

Order 106 ($60) has CUME_DIST 0.83: 5 of the 6 orders are $60 or less.

The *median* is the middle value. SQL Server, PostgreSQL and BigQuery have `PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY x)` (BigQuery spells it `PERCENTILE_CONT(x, 0.5) OVER ()`). SQLite does not, so number the rows and average the middle one or two:

```sql
-- try
WITH r AS (
  SELECT amount,
         ROW_NUMBER() OVER (ORDER BY amount) AS rn,
         COUNT(*) OVER () AS n
  FROM mini_orders
)
SELECT AVG(amount) AS median
FROM r
WHERE rn IN ((n + 1) / 2, (n + 2) / 2)
```

With n = 6, `(n + 1) / 2` = 3 and `(n + 2) / 2` = 4 (whole-number division), so it averages rows 3 and 4: (45 + 45) / 2 = 45. With an odd n both give the same row.

<div class="meaning">

<dl>
<dt>Share of total</dt><dd><code>100.0 * x / SUM(x) OVER ()</code>: this row as a percentage of all rows.</dd>
<dt>Share of group</dt><dd>The same with <code>OVER (PARTITION BY g)</code>: the shares of each group add to 100.</dd>
<dt>NTILE(k)</dt><dd>Deals the ordered rows into k buckets of nearly equal size; the first buckets get one extra row when it does not divide evenly.</dd>
<dt>PERCENT_RANK / CUME_DIST</dt><dd>Where a row stands from 0 to 1: rank-based, or the fraction of rows less than or equal to it.</dd>
<dt>Median</dt><dd>The middle value: half the rows are below it, half above.</dd>
<dt>Physical meaning</dt><dd>No rows are lost. Each row gets a total from its window and one new number from it; summing a group's shares gives back 100%.</dd>
</dl>

</div>

<div class="myth">

**"amount / SUM(amount) OVER () gives the share."** With whole numbers in SQLite, SQL Server or PostgreSQL, that is whole-number division and every share comes out 0. Write `100.0 * amount / SUM(amount) OVER ()`.

</div>

Watch it happen, one step at a time (any live box's **Show how it runs** button animates the real query on Northbay):

<div class="steps">
<div class="step"><b>Sales by year and channel.</b> <table class="lk-tbl"><tr><th>yr</th><th>channel</th><th>sales</th></tr><tr><td>2024</td><td>online</td><td>200</td></tr><tr><td>2024</td><td>store</td><td>600</td></tr><tr><td>2025</td><td>online</td><td>300</td></tr><tr><td>2025</td><td>store</td><td>700</td></tr></table></div>
<div class="step"><b>Window total.</b> <code>SUM(sales) OVER (PARTITION BY yr)</code> <table class="lk-tbl"><tr><th>yr</th><th>channel</th><th>sales</th><th>year_total</th></tr><tr><td>2024</td><td>online</td><td>200</td><td><mark>800</mark></td></tr><tr><td>2024</td><td>store</td><td>600</td><td><mark>800</mark></td></tr><tr><td>2025</td><td>online</td><td>300</td><td><mark>1000</mark></td></tr><tr><td>2025</td><td>store</td><td>700</td><td><mark>1000</mark></td></tr></table></div>
<div class="step"><b>Divide.</b> 2024 online: 200 ÷ 800 = <mark>25%</mark>; store 75%. 2025 online: 300 ÷ 1000 = <mark>30%</mark>; store 70%.</div>
<div class="step"><b>Check.</b> Each year adds up to 100%. If it does not, a filter or a NULL is hiding rows.</div>
</div>

<div class="problem" data-problem="sql-share-of-group"></div>

<div class="problem" data-problem="sql-ntile-size"></div>

## 6. Worked example

*Question:* how much of the money from known customers comes from the top 25% of spenders, and what does a typical customer spend?

```sql
-- try
WITH spend AS (
  SELECT o.customer_id, SUM(i.quantity * i.unit_price * (1 - i.discount)) AS spend
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed' AND o.customer_id IS NOT NULL
  GROUP BY o.customer_id
),
q AS (
  SELECT spend, NTILE(4) OVER (ORDER BY spend DESC) AS quartile
  FROM spend
)
SELECT quartile, COUNT(*) AS customers,
       ROUND(SUM(spend), 2) AS total_spend,
       ROUND(100.0 * SUM(spend) / (SELECT SUM(spend) FROM spend), 1) AS pct_of_spend
FROM q
GROUP BY quartile
ORDER BY quartile
```

1. 598 customers placed a completed order (guests are left out).
2. NTILE(4) deals them into 150, 150, 149 and 149.
3. The top quartile spent 53,770.74, **48.3%** of all customer spend; the bottom quartile just 7.3%.
4. The average customer spent 186.15, but the median (same method as above) is 160.10: a few big spenders pull the average up.

That "top quarter brings in about half" is a classic Pareto shape, and the starting point for RFM segments in [Lesson 8.5](/learn/courses/sql/rfm/).

## 7. Practice

```sql
-- exercise: For each Electronics product (category_id = 10), show product_name, unit_price and its price as a percentage of the category's total price, to 1 decimal place (pct).
-- hint: ROUND(100.0 * unit_price / SUM(unit_price) OVER (), 1).
-- noviz
SELECT product_name, unit_price
FROM products
WHERE category_id = 10
-- answer:
SELECT product_name, unit_price,
       ROUND(100.0 * unit_price / SUM(unit_price) OVER (), 1) AS pct
FROM products
WHERE category_id = 10
```

```sql
-- exercise: For mini_orders, show order_id, customer_id, amount and each order's percentage of its own customer's spend (pct_of_customer), to 1 decimal place.
-- hint: Divide by SUM(amount) OVER (PARTITION BY customer_id), and use 100.0.
-- noviz
SELECT order_id, customer_id, amount,
       ROUND(100 * amount / SUM(amount) OVER (), 1) AS pct_of_customer
FROM mini_orders
-- answer:
SELECT order_id, customer_id, amount,
       ROUND(100.0 * amount / SUM(amount) OVER (PARTITION BY customer_id), 1) AS pct_of_customer
FROM mini_orders
```

```sql
-- exercise: Split the 11 physical stores (store_id 1 to 11) into 3 size bands by size_sqft, biggest first: show store_name, size_sqft and band (1 = biggest).
-- hint: NTILE(3) OVER (ORDER BY size_sqft DESC), after WHERE store_id <= 11.
SELECT store_name, size_sqft
FROM stores
WHERE store_id <= 11
-- answer:
SELECT store_name, size_sqft,
       NTILE(3) OVER (ORDER BY size_sqft DESC) AS band
FROM stores
WHERE store_id <= 11
```

<div class="keypoints">

- Share = 100.0 * x / SUM(x) OVER (...); PARTITION BY gives a share of each group.
- Shares within one window add up to 100%.
- NTILE(k) makes k nearly equal buckets by position; ties can be split.
- SQLite has no PERCENTILE_CONT: number the rows and average the middle one or two for a median.

</div>

**New words:** *share of total*, *NTILE*, *quartile*, *PERCENT_RANK*, *CUME_DIST*, *median*.
