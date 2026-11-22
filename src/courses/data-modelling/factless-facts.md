---
title: 'Factless fact tables'
seoTitle: 'Factless fact table explained with examples in SQL'
summary: 'Some fact tables have no numbers at all: the row itself is the fact. Record events like member sign-ups, and build a promotion coverage table for Northbay to find what was on offer but did not sell.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: What does a factless fact table contain?
    choices: ['Only dimension keys; each row records that something happened or was in effect', 'Only measures', 'Nothing until it is loaded']
    ans: 0
    why: There is no number to store. Counting rows is the measure.
  - q: What question needs a coverage table rather than the sales fact?
    choices: ['Which stores were on promotion but made no sale that day', 'Total sales during promotions', 'Average basket size']
    ans: 0
    why: The sales fact only has rows for sales. To see what didn't sell you need a record of what was possible, then subtract what happened.
  - q: How do you usually measure a factless event table such as sign-ups?
    choices: ['COUNT(*) of its rows, grouped by dimensions', 'SUM of a measure column', 'You cannot measure it']
    ans: 0
    why: Each row is one event, so the count of rows is the number of events. Some teams add a column fixed at 1 so BI tools have something to sum.
sources:
  - 'Kimball Group, Dimensional modeling techniques https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/'
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley, Chapter 3: Retail Sales (factless fact tables, promotion coverage)'
  - 'SQLite documentation: compound SELECT statements (UNION, INTERSECT, EXCEPT) https://www.sqlite.org/lang_select.html#compound_select_statements'
---

**Module 3 · about 25 minutes · read first: 3.1.** You'll be able to build factless fact tables for events and for coverage, count them, and combine coverage with sales to find what did not happen.

<div class="bigidea">A factless fact table has keys but no numbers: the row itself is the fact, and comparing what was possible with what happened shows what did not happen.</div>

**In everyday terms:** a class register. Each tick says "this pupil was here today"; there is no number to add. Compare the register with the timetable and you see who missed which class.

## 1. Why this matters

"Which products were on promotion but didn't sell?" "Which students were enrolled but never attended?" "Which stores were open but took no orders?" These are some of the most useful questions in retail and education, and a normal fact table can't answer them, because it only records what happened. A *factless fact table* records the events or conditions themselves, and makes "what didn't happen" a simple subtraction.

## 2. A fact table with no facts

A *factless fact table* is a fact table with dimension keys and no measures. Each row says "this combination happened" or "this combination was in effect". There are two kinds:

- An **event** table records things that happen but have nothing to measure: a member signs up, a student attends a class, a customer visits a web page.
- A **coverage** table records what was possible or in effect: which promotions ran at which stores on which days, which products were stocked.

The measure is always the same: COUNT(*).

## 3. An event table: member sign-ups

A sign-up has a when (date), a who (customer) and a where (province), but no amount. Its grain: **one row per member joining**.

```sql
-- try
-- noviz
DROP TABLE IF EXISTS fact_signup;
CREATE TABLE fact_signup AS
SELECT CAST(strftime('%Y%m%d', joined_on) AS INTEGER) AS date_key,
       customer_id AS customer_key,
       province
FROM customers;
SELECT * FROM fact_signup LIMIT 5;
```

Every question is a count:

```sql
-- try
SELECT date_key / 10000 AS year, COUNT(*) AS signups
FROM fact_signup
GROUP BY year
ORDER BY year
```

(In a full design `province` would come from a customer or geography dimension; it is kept on the row here to save a join.)

## 4. A coverage table: promotions in effect

Northbay runs a promotion at **every** store for every day of the promotion. Coverage records each (promotion, store, day) that was in effect, whether or not anybody bought anything. Its grain: **one row per store per day per promotion running**.

```sql
-- try
-- noviz
DROP TABLE IF EXISTS fact_promo_coverage;
CREATE TABLE fact_promo_coverage AS
WITH RECURSIVE days(full_date) AS (
  SELECT '2024-01-01' UNION ALL SELECT date(full_date, '+1 day') FROM days WHERE full_date < '2025-12-31'
)
SELECT CAST(strftime('%Y%m%d', d.full_date) AS INTEGER) AS date_key,
       s.store_id AS store_key,
       p.promo_id AS promo_key
FROM days d
JOIN promotions p ON d.full_date BETWEEN p.start_date AND p.end_date
CROSS JOIN stores s;
SELECT COUNT(*) AS covered_store_days FROM fact_promo_coverage;
```

912 rows: 76 promotion days across 12 stores.

How long did each promotion run, and across how many store-days?

```sql
-- try
SELECT c.promo_key, p.promo_name, COUNT(DISTINCT c.date_key) AS days, COUNT(*) AS store_days
FROM fact_promo_coverage c
JOIN promotions p ON p.promo_id = c.promo_key
GROUP BY c.promo_key, p.promo_name
ORDER BY c.promo_key
```

## 5. What was covered but didn't happen

Now the payoff. Which store-days were on promotion but made no sale? That is coverage minus sales, an anti-join (or EXCEPT):

```sql
-- try
SELECT date_key, store_key FROM fact_promo_coverage
EXCEPT
SELECT CAST(strftime('%Y%m%d', order_date) AS INTEGER), store_id
FROM orders
WHERE status = 'completed' AND promo_id IS NOT NULL
ORDER BY date_key, store_key
LIMIT 10
```

Press **Show how it runs** to watch EXCEPT remove every covered store-day that has a sale, leaving the quiet ones. Without the coverage table this question is impossible: the sales fact has no rows for days nobody bought anything.

<div class="meaning">

<dl>
<dt>Factless fact table</dt><dd>A fact table with dimension keys and no measures; COUNT(*) is the measure.</dd>
<dt>Event table</dt><dd>Records things that happen with nothing to measure, such as sign-ups or attendance.</dd>
<dt>Coverage table</dt><dd>Records what was possible or in effect, such as promotions running at stores.</dd>
<dt>EXCEPT / anti-join</dt><dd>Rows in one set that have no match in another.</dd>
<dt>Physical meaning</dt><dd>Coverage holds every (promotion, store, day) that was in effect. Taking away the store-days that appear in the sales fact leaves exactly the covered store-days with no sale.</dd>
</dl>

</div>

<div class="myth">

**"The sales table can tell me what was on promotion but did not sell."** It has no rows for days nobody bought anything. Without a coverage table that question cannot be answered.

</div>

Watch it happen, one step at a time (and press **Show how it runs** on any live SQL box in this lesson to animate the real query):

<div class="steps">
<div class="step"><b>Coverage.</b> <table class="lk-tbl"><tr><th>store</th><th>day</th></tr><tr><td>S1</td><td>Mon</td></tr><tr><td>S1</td><td>Tue</td></tr><tr><td>S2</td><td>Mon</td></tr><tr><td>S2</td><td>Tue</td></tr></table></div>
<div class="step"><b>Sales.</b> <table class="lk-tbl"><tr><th>store</th><th>day</th></tr><tr><td>S1</td><td>Mon</td></tr><tr><td>S2</td><td>Tue</td></tr></table></div>
<div class="step"><b>Coverage EXCEPT sales.</b> <table class="lk-tbl"><tr><th>store</th><th>day</th></tr><tr><td><mark>S1</mark></td><td><mark>Tue</mark></td></tr><tr><td><mark>S2</mark></td><td><mark>Mon</mark></td></tr></table> 4 − 2 = 2 quiet store-days.</div>
<div class="step"><b>Reach.</b> <table class="lk-tbl"><tr><th>covered</th><th>with a sale</th><th>share</th></tr><tr><td>4</td><td>2</td><td><mark>50%</mark></td></tr></table></div>
</div>

**Try one with fresh numbers:**

<div class="problem" data-problem="dm-coverage-quiet"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a factless fact table is a set of tuples. Coverage is the set of what was possible; the event fact is the set of what happened; "possible but didn't happen" is their difference.

**Equation:** let C ⊆ Days × Stores be the covered store-days (|C| = 76 days × 12 stores = 912) and A ⊆ Days × Stores the store-days with a promotion sale. The quiet store-days are C \ A, and |C \ A| = |C| − |C ∩ A|. The measure of a factless table is its cardinality: COUNT(*) on a slice is |{rows in the slice}|.

**Analogy:** a class register. The list of enrolled students is the coverage; the ticks are the attendance events. Absent students are the names with no tick, which you can only find because the enrolment list exists.

**Try it:** a promotion runs for 7 days at 12 stores, and 50 of those store-days had a sale. How many quiet store-days are there? (84 − 50 = 34.)
</details>

## 6. Worked example: how well did each promotion reach the stores?

*Question:* for each promotion, what share of covered store-days had at least one sale?

```sql
-- try
WITH sold AS (
  SELECT DISTINCT CAST(strftime('%Y%m%d', order_date) AS INTEGER) AS date_key, store_id AS store_key
  FROM orders
  WHERE status = 'completed'
)
SELECT p.promo_name, substr(p.start_date, 1, 4) AS year,
       COUNT(*) AS covered,
       COUNT(s.date_key) AS with_sale,
       ROUND(100.0 * COUNT(s.date_key) / COUNT(*), 1) AS pct_with_sale
FROM fact_promo_coverage c
JOIN promotions p ON p.promo_id = c.promo_key
LEFT JOIN sold s ON s.date_key = c.date_key AND s.store_key = c.store_key
GROUP BY c.promo_key, p.promo_name, year
ORDER BY pct_with_sale DESC
```

1. Start from coverage (every store-day that could sell), LEFT JOIN what sold.
2. `COUNT(*)` counts covered store-days; `COUNT(s.date_key)` counts only those with a match.
3. Boxing week 2025 reached furthest: 42 of its 72 store-days (58.3%) had a sale. Back to school 2024 reached least: 66 of 168 (39.3%). The share tells marketing how widely a promotion actually landed, not just how much it sold. A promotion with high sales but a low share may be carried by a few big stores or by the online shop.

## 7. Practice

```sql
-- exercise: Count sign-ups per province from fact_signup, most first.
-- hint: GROUP BY province, ORDER BY COUNT(*) DESC.
SELECT province
FROM fact_signup
-- answer:
SELECT province, COUNT(*) AS signups
FROM fact_signup
GROUP BY province
ORDER BY signups DESC
```

```sql
-- exercise: How many covered store-days had no sale at all, per store? Show store_key and the count of quiet store-days, most first.
-- hint: LEFT JOIN coverage to the distinct (date, store) pairs with a completed order, keep rows where the sale side is NULL, GROUP BY store_key.
SELECT store_key, COUNT(*) AS covered
FROM fact_promo_coverage
GROUP BY store_key
-- answer:
SELECT c.store_key, COUNT(*) AS quiet_store_days
FROM fact_promo_coverage c
LEFT JOIN (SELECT DISTINCT CAST(strftime('%Y%m%d', order_date) AS INTEGER) AS date_key, store_id
           FROM orders WHERE status = 'completed') s
  ON s.date_key = c.date_key AND s.store_id = c.store_key
WHERE s.date_key IS NULL
GROUP BY c.store_key
ORDER BY quiet_store_days DESC
```

```sql
-- exercise: Event counts by month: show 2025 sign-ups per month (YYYY-MM) from fact_signup, in month order.
-- hint: date_key is YYYYMMDD; date_key / 100 gives YYYYMM. Filter date_key BETWEEN 20250101 AND 20251231.
SELECT date_key / 100 AS month, COUNT(*) AS signups
FROM fact_signup
GROUP BY month
ORDER BY month
-- answer:
SELECT date_key / 100 AS month, COUNT(*) AS signups
FROM fact_signup
WHERE date_key BETWEEN 20250101 AND 20251231
GROUP BY month
ORDER BY month
```

<div class="keypoints">

- A factless fact has keys and no measures; the measure is COUNT(*).
- Event tables record happenings with nothing to measure.
- Coverage tables record what was possible or in effect.
- Coverage minus events (EXCEPT or an anti-join) shows what did not happen.
- Share = covered rows with a match ÷ covered rows.

</div>

**New words:** *factless fact table*, *event table*, *coverage table*.
