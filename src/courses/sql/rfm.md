---
title: 'RFM: segmenting customers'
seoTitle: 'RFM analysis in SQL with NTILE, step by step'
summary: 'Score every customer 1 to 5 on recency, frequency and money spent with NTILE, then turn the scores into segments a marketing team can act on: champions, at risk, lapsed.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: What do the three letters in RFM stand for?
    choices: ['Revenue, forecast, margin', 'Recency, frequency, monetary', 'Region, format, market']
    ans: 1
    why: 'Recency is how long since the last purchase, frequency how many purchases, monetary how much was spent.'
  - q: 'With NTILE(5) OVER (ORDER BY last_order), which customers get a recency score of 5?'
    choices: ['Those who bought longest ago', 'Those who bought most recently', 'A random fifth']
    ans: 1
    why: 'NTILE numbers the buckets in the sort order, so the latest dates land in bucket 5. Recent buyers are the best, so a high score is good.'
  - q: 'Many customers have exactly 6 orders. What can NTILE do with them?'
    choices: ['Always put them in the same bucket', 'Split them across two buckets, because NTILE cuts by row count, not by value', 'Leave them out']
    ans: 1
    why: 'NTILE makes buckets of (nearly) equal size, so a block of ties can be cut in two. Add a tie-breaker like customer_id so the cut is at least repeatable.'
sources:
  - 'SQLite documentation: Window Functions (NTILE) https://www.sqlite.org/windowfunctions.html'
  - 'Microsoft Learn: NTILE (Transact-SQL) https://learn.microsoft.com/en-us/sql/t-sql/functions/ntile-transact-sql'
  - 'Hughes, A. M. (2012), Strategic Database Marketing, 4th edition, McGraw-Hill, chapter on RFM analysis'
  - 'SQLite documentation: CASE expression https://www.sqlite.org/lang_expr.html#the_case_expression'
---

**Module 8 · about 30 minutes · read first: 6.7, 2.6.** You'll be able to score customers on recency, frequency and monetary value with NTILE, and group them into segments with CASE.

<div class="bigidea">RFM gives every customer three scores from 1 to 5, for how recently, how often and how much they buy, and turns those scores into a few named groups with a plan each.</div>

**In everyday terms:** a shop owner who knows the regulars. "Came in last week, comes every week, spends a lot" is a champion; "used to come every week but hasn't been in for months" is someone to phone.

## 1. Why this matters

Marketing teams don't want 600 customers; they want five groups with a plan for each. **RFM** is the oldest and most trusted way to make those groups, and it needs nothing but an orders table. Analysts in retail, e-commerce and banking build it all the time, and it is a good portfolio piece because the business meaning is so clear.

## 2. Three numbers per customer

For each customer, work out:

- **Recency**: how long since their last purchase. Lower is better.
- **Frequency**: how many purchases. Higher is better.
- **Monetary**: how much they spent in total. Higher is better.

Northbay's data ends on 31 December 2025, so measure recency from 1 January 2026. One `GROUP BY` gives all three.

```sql
-- try
SELECT o.customer_id,
       MAX(o.order_date) AS last_order,
       CAST(julianday('2026-01-01') - julianday(MAX(o.order_date)) AS INTEGER) AS recency_days,
       COUNT(DISTINCT o.order_id) AS frequency,
       ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS monetary
FROM orders o
JOIN order_items i ON i.order_id = o.order_id
WHERE o.status = 'completed' AND o.customer_id IS NOT NULL
GROUP BY o.customer_id
ORDER BY o.customer_id
LIMIT 10
```

Note `COUNT(DISTINCT o.order_id)`: the join to order_items gives one row per line, so a plain `COUNT(*)` would count lines, not orders. This is the fan-out trap from [Lesson 4.5](/learn/courses/sql/fan-out/).

Step through the four stages, then change the aggregate and raise the HAVING bar.

<div class="steps" data-fig="@data-groupby-buckets">
<div class="step">Start with the plain table: ten rows, each with a region and an amount.</div>
<div class="step">Split: every row slides into the bucket for its region.</div>
<div class="step">Apply: the aggregate is worked out inside each bucket on its own.</div>
<div class="step">Combine: each bucket collapses to one result row. HAVING now removes whole groups.</div>
</div>


## 3. Scores from 1 to 5 with NTILE

Raw numbers are on different scales: days, counts and dollars. RFM turns each one into a score from 1 to 5 by splitting customers into five equal-sized groups, called **quintiles**. `NTILE(5) OVER (ORDER BY x)` does exactly that ([Lesson 6.7](/learn/courses/sql/share-of-total/)): the first fifth in the sort order gets 1, the last fifth gets 5.

Sort so that **better means higher**: the latest last order, the most orders and the most money get 5.

```sql
-- try
WITH base AS (
  SELECT o.customer_id,
         MAX(o.order_date) AS last_order,
         COUNT(DISTINCT o.order_id) AS frequency,
         SUM(i.quantity * i.unit_price * (1 - i.discount)) AS monetary
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed' AND o.customer_id IS NOT NULL
  GROUP BY o.customer_id
)
SELECT customer_id, last_order, frequency, ROUND(monetary, 2) AS monetary,
       NTILE(5) OVER (ORDER BY last_order, customer_id) AS r,
       NTILE(5) OVER (ORDER BY frequency, customer_id) AS f,
       NTILE(5) OVER (ORDER BY monetary, customer_id) AS m
FROM base
ORDER BY customer_id
LIMIT 10
```

Customer 1 scores R = 5, F = 3, M = 5: shopped six days before the end of the data, an average number of orders, and among the top fifth for spend. People often glue the scores into a code, "535".

**About ties.** NTILE cuts by row count, not by value. Lots of customers have 4, 5 or 6 orders, so customers with the *same* frequency can land in different buckets. The `customer_id` at the end of each ORDER BY is a **tie-breaker**: it doesn't make the cut fairer, but it makes it the same every time you run it. If ties matter, score with fixed thresholds in a CASE instead (for example, `CASE WHEN frequency >= 10 THEN 5 ...`).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** NTILE turns a value into its rank-based bucket, so it only cares about order, not distance. That makes the three scores comparable even though one is in days and another in dollars.

**Equation:** with n rows sorted and k buckets, row i (from 1) goes to bucket ⌈i·k / n⌉ when k divides n; otherwise the first n mod k buckets get one extra row. For Northbay, n = 598 and k = 5, so the buckets have 120, 120, 120, 119 and 119 customers. The RFM code is a map from customers to the set {1..5}³, which has 125 possible cells.

**Analogy:** marking on a curve. The top fifth of the class gets an A whatever the raw marks were, so an A in maths and an A in art mean the same thing: top fifth.

**Try it:** 10 customers, NTILE(4). How big is each bucket? (10 = 4 × 2 + 2, so 3, 3, 2, 2.)
</details>

<div class="meaning">

<dl>
<dt>Recency</dt><dd>Days since the last purchase. Fewer days is better.</dd>
<dt>Frequency</dt><dd>Number of orders: COUNT(DISTINCT order_id), not lines.</dd>
<dt>Monetary</dt><dd>Total spend in the period.</dd>
<dt>NTILE(5) OVER (ORDER BY x)</dt><dd>Sorts the rows and cuts them into 5 groups as equal in size as possible, numbered 1 to 5.</dd>
<dt>Tie-breaker</dt><dd>An extra sort column (customer_id) so the cut is the same on every run.</dd>
<dt>Segment</dt><dd>A named group of score codes, made with CASE; the first matching WHEN wins.</dd>
<dt>Physical meaning</dt><dd>One GROUP BY squashes each customer's orders into three numbers. NTILE then replaces each number by its fifth of the ranking, so days, counts and dollars all become 1–5 and can be compared and combined.</dd>
</dl>

</div>

<div class="myth">

**"NTILE splits by value, so equal values get equal scores."** NTILE splits by row count. If 200 customers all have 5 orders, some of them can get F = 2 and others F = 3. Add a tie-breaker so the result is at least repeatable, or use fixed thresholds in CASE when ties matter.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>Three numbers per customer.</b> <table class="lk-tbl"><tr><th>customer</th><th>last_order</th><th>orders</th><th>spend</th></tr><tr><td>A</td><td>2025-12-20</td><td>9</td><td>640</td></tr><tr><td>B</td><td>2025-03-02</td><td>8</td><td>510</td></tr><tr><td>C</td><td>2025-12-01</td><td>2</td><td>90</td></tr><tr><td>D</td><td>2025-02-11</td><td>1</td><td>40</td></tr></table></div>
<div class="step"><b>Sort and cut into quarters</b> (NTILE(4) on 4 customers: one each). Later last order = higher R. <table class="lk-tbl"><tr><th>customer</th><th>R</th><th>F</th><th>M</th></tr><tr><td>A</td><td><mark>4</mark></td><td><mark>4</mark></td><td><mark>4</mark></td></tr><tr><td>B</td><td><mark>2</mark></td><td><mark>3</mark></td><td><mark>3</mark></td></tr><tr><td>C</td><td><mark>3</mark></td><td><mark>2</mark></td><td><mark>2</mark></td></tr><tr><td>D</td><td><mark>1</mark></td><td><mark>1</mark></td><td><mark>1</mark></td></tr></table></div>
<div class="step"><b>CASE turns scores into segments.</b> The first WHEN that matches wins. <table class="lk-tbl"><tr><th>customer</th><th>code</th><th>segment</th></tr><tr><td>A</td><td>444</td><td><mark>Champion</mark></td></tr><tr><td>B</td><td>233</td><td><mark>At risk</mark></td></tr><tr><td>C</td><td>322</td><td><mark>New or occasional</mark></td></tr><tr><td>D</td><td>111</td><td><mark>Lapsed</mark></td></tr></table></div>
<div class="step"><b>Group by segment.</b> Count customers and add up spend: now marketing has a to-do list, not 600 names.</div>
</div>

Any live box with a SELECT has a **Show how it runs** button that animates the real query on Northbay, row by row.

<div class="problem" data-problem="sql-ntile-score"></div>

## 4. From scores to segments

125 codes are too many for a marketing plan. Group them into a few named **segments** with CASE ([Lesson 2.6](/learn/courses/sql/case/)). There is no single official list; this simple one works well:

| Segment | Rule | What to do |
|---|---|---|
| Champions | R ≥ 4, F ≥ 4, M ≥ 4 | Thank them; early access |
| At risk | R ≤ 2, F ≥ 4 | Used to buy a lot, gone quiet: win-back offer |
| New or occasional | R ≥ 4, F ≤ 2 | Recent but few orders: nudge a second visit |
| Lapsed | R ≤ 2, F ≤ 2 | Low priority |
| Steady | everything else | Keep in the regular newsletter |

The order of the WHEN lines matters: CASE stops at the first match.

```sql
-- try
WITH base AS (
  SELECT o.customer_id,
         MAX(o.order_date) AS last_order,
         COUNT(DISTINCT o.order_id) AS frequency,
         SUM(i.quantity * i.unit_price * (1 - i.discount)) AS monetary
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed' AND o.customer_id IS NOT NULL
  GROUP BY o.customer_id
),
scored AS (
  SELECT customer_id, monetary,
         NTILE(5) OVER (ORDER BY last_order, customer_id) AS r,
         NTILE(5) OVER (ORDER BY frequency, customer_id) AS f,
         NTILE(5) OVER (ORDER BY monetary, customer_id) AS m
  FROM base
)
SELECT CASE
         WHEN r >= 4 AND f >= 4 AND m >= 4 THEN 'Champions'
         WHEN r <= 2 AND f >= 4 THEN 'At risk'
         WHEN r >= 4 AND f <= 2 THEN 'New or occasional'
         WHEN r <= 2 AND f <= 2 THEN 'Lapsed'
         ELSE 'Steady'
       END AS segment,
       COUNT(*) AS customers,
       ROUND(SUM(monetary), 2) AS revenue,
       ROUND(AVG(monetary), 2) AS avg_spend
FROM scored
GROUP BY segment
ORDER BY customers DESC
```

## 5. Worked example

*Question:* who should the marketing team focus on?

1. 598 customers have at least one completed order; together they spent $111,317.51.
2. **Champions**: 90 customers (15% of customers) spent $29,757.52, which is **26.7%** of member revenue, at $330.64 each on average.
3. **At risk**: 69 customers averaging $248.01 each, $17,112.90 in all. They were good customers but have not been back for months.
4. **Lapsed**: 123 customers averaging $114.22.

Insight: "A win-back campaign aimed at 69 at-risk customers reaches $17k of past spend; the 123 lapsed customers are worth less than the 69 at-risk ones put together." That one sentence is why RFM is popular: it turns a table into a to-do list.

## 6. Practice

```sql
-- exercise: Show, for each frequency score f from 1 to 5, the number of customers and the smallest and largest number of orders in that bucket.
-- hint: Build base and add NTILE(5) OVER (ORDER BY frequency, customer_id) AS f in a second CTE, then GROUP BY f with COUNT, MIN and MAX.
SELECT o.customer_id, COUNT(DISTINCT o.order_id) AS frequency
FROM orders o
WHERE o.status = 'completed' AND o.customer_id IS NOT NULL
GROUP BY o.customer_id
-- answer:
WITH base AS (
  SELECT customer_id, COUNT(*) AS frequency
  FROM orders
  WHERE status = 'completed' AND customer_id IS NOT NULL
  GROUP BY customer_id
),
scored AS (
  SELECT customer_id, frequency,
         NTILE(5) OVER (ORDER BY frequency, customer_id) AS f
  FROM base
)
SELECT f, COUNT(*) AS customers, MIN(frequency) AS min_orders, MAX(frequency) AS max_orders
FROM scored
GROUP BY f
ORDER BY f
```

Look at the edges: 4 orders appears in buckets 1 and 2, 5 in buckets 2 and 3. That is NTILE splitting ties.

```sql
-- exercise: Build the win-back list: the 5 at-risk customers (R ≤ 2 and F ≥ 4) who spent the most. Show customer_id, first_name, last_name and spend rounded to 2 decimals, biggest first.
-- hint: Reuse base and scored from section 4, keep r <= 2 AND f >= 4, join customers for the names, ORDER BY spend DESC LIMIT 5.
SELECT customer_id, first_name, last_name
FROM customers
LIMIT 5
-- answer:
WITH base AS (
  SELECT o.customer_id,
         MAX(o.order_date) AS last_order,
         COUNT(DISTINCT o.order_id) AS frequency,
         SUM(i.quantity * i.unit_price * (1 - i.discount)) AS monetary
  FROM orders o
  JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed' AND o.customer_id IS NOT NULL
  GROUP BY o.customer_id
),
scored AS (
  SELECT customer_id, monetary,
         NTILE(5) OVER (ORDER BY last_order, customer_id) AS r,
         NTILE(5) OVER (ORDER BY frequency, customer_id) AS f
  FROM base
)
SELECT c.customer_id, c.first_name, c.last_name, ROUND(s.monetary, 2) AS spend
FROM scored s
JOIN customers c ON c.customer_id = s.customer_id
WHERE s.r <= 2 AND s.f >= 4
ORDER BY spend DESC
LIMIT 5
```

**Try it on your own data:** profile your customer export first with [[csv-profiler]], then score it in [[sql-playground]].

<div class="keypoints">

- RFM = recency, frequency and monetary value, one GROUP BY per customer.
- Count orders with COUNT(DISTINCT order_id), because the join to order_items fans out.
- NTILE(5) turns each number into a 1–5 score by rank; sort so that better means higher.
- NTILE cuts by row count, so ties can split; add a tie-breaker to make it repeatable.
- CASE groups the 125 possible codes into a few segments; the order of the WHEN lines matters.

</div>

**New words:** *RFM*, *recency*, *frequency*, *monetary*, *quintile*, *tie-breaker*, *segment*.
