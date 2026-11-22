---
title: 'Periodic snapshot fact tables'
seoTitle: 'Periodic snapshot fact table explained with SQL'
summary: 'A periodic snapshot stores one row per thing per period, whether anything happened or not. Build a daily store sales snapshot and a monthly membership snapshot for Northbay, and see why stored zeros make averages right.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: How many rows does a daily snapshot of 12 stores over 731 days have?
    choices: ['8,772, one per store per day', 'One per sale', 'It depends on how busy the stores were']
    ans: 0
    why: A periodic snapshot is dense. Every store gets a row every day, so the size is stores × days, known in advance.
  - q: Why does average daily sales from the snapshot differ from the same average worked out on the transaction fact?
    choices: ['The snapshot includes days with zero sales; the transaction fact has no rows for them', 'The snapshot rounds differently', 'Transaction facts cannot be averaged']
    ans: 0
    why: An average over days needs the zero days in the denominator. Only the snapshot has them as rows.
  - q: Which column of a monthly membership snapshot should NOT be summed across months?
    choices: ['members_at_month_end', 'new_members', 'month']
    ans: 0
    why: Members at month end is a level (a balance). Adding January's level to February's counts the same people twice. New members per month is a flow and adds up fine.
---

**Module 3 · about 30 minutes · read first: 3.1.** You'll be able to build a periodic snapshot from a transaction fact, explain why it is dense, use its stored zeros for correct averages, and store a level such as members on file.

## 1. Why this matters

Many business questions are about *state* over time rather than single events: stock on hand each night, account balances at month end, active members each month, daily sales per store including the quiet days. A transaction fact can answer them only with heavy queries, and easily gets them wrong. A *periodic snapshot* stores the answer, one row per period, so dashboards stay fast and correct.

## 2. One row per thing per period

A *periodic snapshot fact table* has one row for each thing (store, product, account) for each period (day, week, month), whether or not anything happened. Its properties:

- **Dense:** every store, every day. The size is known in advance: things × periods.
- **Regular:** a new set of rows is added at the end of each period, then left alone.
- **Two kinds of measure:** totals for the period (sales today: additive) and levels at the end of the period (stock tonight, members on file: semi-additive, see [Lesson 3.5](/learn/courses/data-modelling/additivity/)).

The textbook example is a nightly inventory snapshot: units on hand per product per store. Northbay's practice data has no stock table, so we'll build the same shape from sales and from membership.

## 3. Build a daily store sales snapshot

The grain: **one row per store per day**. Step one is the frame of every store-day, a CROSS JOIN of all days with all stores. Step two attaches the day's totals with a LEFT JOIN, and COALESCE turns "no sales" into 0.

```sql
-- try
-- noviz
DROP TABLE IF EXISTS snap_store_day;
CREATE TABLE snap_store_day AS
WITH RECURSIVE days(full_date) AS (
  SELECT '2024-01-01' UNION ALL SELECT date(full_date, '+1 day') FROM days WHERE full_date < '2025-12-31'
),
daily AS (
  SELECT o.store_id, o.order_date,
         COUNT(DISTINCT o.order_id) AS orders,
         SUM(i.quantity) AS units,
         ROUND(SUM(i.quantity * i.unit_price * (1 - i.discount)), 2) AS sales
  FROM orders o JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed'
  GROUP BY o.store_id, o.order_date
)
SELECT CAST(strftime('%Y%m%d', d.full_date) AS INTEGER) AS date_key,
       d.full_date, s.store_id AS store_key,
       COALESCE(x.orders, 0) AS orders,
       COALESCE(x.units, 0) AS units,
       COALESCE(x.sales, 0) AS sales_amount
FROM days d
CROSS JOIN stores s
LEFT JOIN daily x ON x.store_id = s.store_id AND x.order_date = d.full_date;
SELECT COUNT(*) AS rows, SUM(orders = 0) AS zero_days FROM snap_store_day;
```

8,772 rows: 12 stores × 731 days, exactly. 5,736 of them are zero days, because a physical Northbay store takes only a few orders a day. Look at the Ottawa store's first week:

```sql
-- try
SELECT full_date, orders, units, sales_amount
FROM snap_store_day
WHERE store_key = 4 AND full_date <= '2024-01-07'
ORDER BY full_date
```

The quiet days are rows with zeros, not missing rows. That is the whole difference from the transaction fact.

## 4. Why stored zeros matter: averages

"What are the Vancouver store's average daily sales?" Work it out both ways:

```sql
-- try
SELECT 'snapshot (all days)' AS method, ROUND(AVG(sales_amount), 2) AS avg_daily_sales, COUNT(*) AS days_counted
FROM snap_store_day WHERE store_key = 11
UNION ALL
SELECT 'transactions (days with sales)', ROUND(AVG(day_sales), 2), COUNT(*)
FROM (
  SELECT o.order_date, SUM(i.quantity * i.unit_price * (1 - i.discount)) AS day_sales
  FROM orders o JOIN order_items i ON i.order_id = o.order_id
  WHERE o.status = 'completed' AND o.store_id = 11
  GROUP BY o.order_date
)
```

The transaction version averages only over the 231 days that had a sale, so it says $35.89 a day, more than three times the true $11.34. The snapshot divides by every day, which is what "average daily sales" means.

## 5. A level: members on file each month

Snapshots shine for *levels*: amounts measured at a point in time, like a balance. Here is a monthly snapshot of Northbay's loyalty programme. `new_members` is a flow (who joined this month); `members_at_month_end` is a level (everyone who has joined so far).

```sql
-- try
-- noviz
DROP TABLE IF EXISTS snap_members_month;
CREATE TABLE snap_members_month AS
WITH RECURSIVE months(m) AS (
  SELECT '2024-01-01' UNION ALL SELECT date(m, '+1 month') FROM months WHERE m < '2025-12-01'
)
SELECT strftime('%Y-%m', m) AS month,
       (SELECT COUNT(*) FROM customers c WHERE strftime('%Y-%m', c.joined_on) = strftime('%Y-%m', m)) AS new_members,
       (SELECT COUNT(*) FROM customers c WHERE c.joined_on <= date(m, '+1 month', '-1 day')) AS members_at_month_end
FROM months;
SELECT * FROM snap_members_month LIMIT 6;
```

Summing `new_members` over 2025 gives the year's sign-ups. Summing `members_at_month_end` over 2025 gives nonsense: the same people counted twelve times. For a level, take the last period's value (or an average), never the sum.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a periodic snapshot samples a quantity at regular times, so every period has a value, including zero.

**Equation:** the snapshot is a total function F: Stores × Days → measures, defined on all of the 12 × 731 = 8,772 pairs. The transaction fact defines values only on the pairs where something happened. The mean over days is (1/n) Σ F(s, d), and n must count every day: dropping the zero days shrinks n but not the sum, so the mean grows. A level L(t) is linked to a flow by L(t) = L(t − 1) + flow(t): members at month end = last month's level + new members.

**Analogy:** a bathroom scale. Weighing yourself every morning gives a reading even on boring days. Your weight (a level) can't be added across mornings; the kilos you gained each week (a flow) can.

**Try it:** a store sells $300 over a 30-day month, all on 3 days. What are the snapshot and transaction averages? ($10 a day vs $100 a day.)
</details>

## 6. Worked example: the quietest stores

*Question:* in 2025, which store had the most days without a single sale, and does that change how we read its totals?

```sql
-- try
SELECT store_key,
       SUM(orders = 0) AS zero_days,
       SUM(orders) AS orders,
       ROUND(SUM(sales_amount), 2) AS sales,
       ROUND(AVG(sales_amount), 2) AS avg_daily_sales
FROM snap_store_day
WHERE full_date LIKE '2025%'
GROUP BY store_key
ORDER BY zero_days DESC
LIMIT 5
```

1. The Downtown store (1) had 265 days without a sale in 2025, more than any other. `orders = 0` is 1 or 0 per row, so SUM counts the zero days. With a transaction fact this needs the date-dimension LEFT JOIN trick; here it's one line.
2. `SUM(orders)` and `SUM(sales_amount)` are additive period totals, so the year is just the sum of the days.
3. `AVG(sales_amount)` is the true average day, zeros included, which is the figure a store manager would plan staff with.
4. The online store (12) is nowhere near this list: it sells nearly every day.

## 7. Practice

```sql
-- exercise: Roll the daily snapshot up to months: show store 4's orders and sales per month in 2025, in month order.
-- hint: GROUP BY substr(full_date, 1, 7) WHERE store_key = 4 AND full_date LIKE '2025%'. Daily period totals add up to monthly ones.
SELECT full_date, orders, sales_amount
FROM snap_store_day
WHERE store_key = 4
-- answer:
SELECT substr(full_date, 1, 7) AS month, SUM(orders) AS orders, ROUND(SUM(sales_amount), 2) AS sales
FROM snap_store_day
WHERE store_key = 4 AND full_date LIKE '2025%'
GROUP BY month
ORDER BY month
```

```sql
-- exercise: Show the correct average daily sales for every store over both years, highest first, rounded to 2 decimals.
-- hint: AVG over the snapshot includes the zero days. GROUP BY store_key.
SELECT store_key, ROUND(SUM(sales_amount), 2) AS sales
FROM snap_store_day
GROUP BY store_key
-- answer:
SELECT store_key, ROUND(AVG(sales_amount), 2) AS avg_daily_sales
FROM snap_store_day
GROUP BY store_key
ORDER BY avg_daily_sales DESC
```

```sql
-- exercise: From snap_members_month, show for 2025 the sign-ups for the year (a flow) and the members on file at the end of the year (a level).
-- hint: SUM(new_members) for the flow; for the level take members_at_month_end WHERE month = '2025-12'. A scalar subquery works.
SELECT SUM(new_members) AS signups, SUM(members_at_month_end) AS members
FROM snap_members_month
WHERE month LIKE '2025%'
-- answer:
SELECT SUM(new_members) AS signups,
       (SELECT members_at_month_end FROM snap_members_month WHERE month = '2025-12') AS members_at_year_end
FROM snap_members_month
WHERE month LIKE '2025%'
```

**Try it on your own data:** chart a daily snapshot exported as CSV in [[plot-maker]]: the zero days show up as dips instead of disappearing.

**New words:** *periodic snapshot fact table*, *dense*, *level*, *flow*, *frame (CROSS JOIN of dimensions)*.
