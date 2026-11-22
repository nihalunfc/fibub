---
title: 'Transaction fact tables'
seoTitle: 'Transaction fact table explained with SQL examples'
summary: 'The most common fact table: one row per event, written once and never changed. Build Northbay''s transaction fact, see why it is sparse, find the days when nothing happened, and fix mistakes with reversing rows instead of updates.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: When does a transaction fact table get a new row?
    choices: ['Each time an event happens, such as a product sold', 'Once a day for every product', 'Only at month end']
    ans: 0
    why: A transaction fact records events as they happen. Nothing happened means no row, which is why the table is sparse.
  - q: 'How do you find days on which a product did NOT sell, using a transaction fact?'
    choices: ['Start from the date dimension and LEFT JOIN the facts', 'Look for rows with quantity 0', 'COUNT(*) the fact table']
    ans: 0
    why: Days with no sales have no fact rows to find. The date dimension lists every day, so a LEFT JOIN shows the gaps.
  - q: A completed sale is later cancelled. What is the usual way to record that in an append-only transaction fact?
    choices: ['Insert a reversing row with negative amounts', 'Delete the original row', 'Overwrite the quantity with 0']
    ans: 0
    why: Adding a reversing row keeps history and makes the old reports reproducible, while the totals net to zero.
---

**Module 3 · about 25 minutes · read first: 2.4.** You'll be able to describe a transaction fact table, build one, explain why it is sparse, find "nothing happened" with a date dimension, and correct it with reversing rows.

## 1. Why this matters

Most fact tables you'll ever query are transaction facts: sales lines, payments, clicks, calls, shipments. They are the atomic record of what happened, and every other kind of fact table in this module can be built from them. Knowing their strengths (detail, simple loading) and their blind spot (they can't show what didn't happen) saves a lot of wrong answers.

## 2. One row per event

A *transaction fact table* holds one row for each event at the moment it happened, at the atomic grain. Its properties follow from that:

- **Sparse:** no event, no row. A product that didn't sell on Tuesday has no Tuesday row.
- **Append-only:** once an event is recorded, its row doesn't change. New events add new rows.
- **Additive:** its facts (quantity, amounts) usually add up across every dimension.
- **Big:** it is usually the largest table in the warehouse.

<!--fig:fact-types-->

Build Northbay's, with the promotion as a fifth dimension key (0 when no sale was on):

```sql
-- try
-- noviz
DROP TABLE IF EXISTS fact_sales;
CREATE TABLE fact_sales AS
SELECT CAST(strftime('%Y%m%d', o.order_date) AS INTEGER) AS date_key,
       i.product_id AS product_key, o.store_id AS store_key,
       COALESCE(o.customer_id, 0) AS customer_key, COALESCE(o.promo_id, 0) AS promo_key,
       i.order_id, i.quantity,
       ROUND(i.quantity * i.unit_price, 2) AS gross_amount,
       ROUND(i.quantity * i.unit_price * i.discount, 2) AS discount_amount,
       ROUND(i.quantity * i.unit_price * (1 - i.discount), 2) AS sales_amount
FROM order_items i
JOIN orders o ON o.order_id = i.order_id
WHERE o.status = 'completed';
SELECT * FROM fact_sales WHERE order_id = 1038;
```

## 3. How sparse is it?

There are 61 products and 731 days: 44,591 possible (product, day) pairs. How many actually have a sale?

```sql
-- try
SELECT COUNT(*) AS product_days_with_a_sale,
       61 * 731 AS possible_product_days,
       ROUND(100.0 * COUNT(*) / (61 * 731), 1) AS pct_filled
FROM (SELECT DISTINCT product_key, date_key FROM fact_sales)
```

Only about 15% of product-days have a row. That's good for storage (nothing is stored for the empty 85%), but it means "zero" never appears in the table. You have to bring it in from somewhere else.

## 4. Finding what didn't happen

To see empty days you need a list of all days, which is what the date dimension is for. Build a slim one:

```sql
-- try
-- noviz
DROP TABLE IF EXISTS dim_date;
CREATE TABLE dim_date AS
WITH RECURSIVE days(full_date) AS (
  SELECT '2024-01-01' UNION ALL SELECT date(full_date, '+1 day') FROM days WHERE full_date < '2025-12-31'
)
SELECT CAST(strftime('%Y%m%d', full_date) AS INTEGER) AS date_key, full_date,
       CAST(strftime('%Y', full_date) AS INTEGER) AS year
FROM days;
SELECT COUNT(*) AS days FROM dim_date;
```

Now start from the dates and LEFT JOIN the facts: days with no sale of Salted cashews (product 34) come back with zero.

```sql
-- try
SELECT d.year,
       COUNT(*) AS days,
       COUNT(f.date_key) AS days_with_a_sale,
       COUNT(*) - COUNT(f.date_key) AS days_without
FROM dim_date d
LEFT JOIN (SELECT DISTINCT date_key FROM fact_sales WHERE product_key = 34) f ON f.date_key = d.date_key
GROUP BY d.year
```

Salted cashews sold on 53 days of 2024 and 77 of 2025; the other 313 and 288 days have no row at all. The direction matters: dates on the left, facts on the right. Start from the facts and the empty days never appear. (Periodic snapshots, next lesson, store the zeros so readers don't need this trick.)

## 5. Mistakes are fixed by adding rows

Because the table is append-only, a correction is a new event, not an edit. Say order 1038 is refunded in full a week later. Rather than delete its rows, insert *reversing rows*: copies with the measures negated and the date of the refund.

```sql
-- try
-- noviz
INSERT INTO fact_sales
SELECT 20240117, product_key, store_key, customer_key, promo_key, order_id,
       -quantity, -gross_amount, -discount_amount, -sales_amount
FROM fact_sales
WHERE order_id = 1038 AND quantity > 0;
SELECT date_key, order_id, product_key, quantity, sales_amount FROM fact_sales WHERE order_id = 1038 ORDER BY date_key, product_key;
```

```sql
-- try
SELECT date_key, SUM(sales_amount) AS sales_that_day, SUM(SUM(sales_amount)) OVER (ORDER BY date_key) AS running_total
FROM fact_sales
WHERE order_id = 1038
GROUP BY date_key
```

The order nets to zero, January 10 still shows the sale as it was reported then, and January 17 shows the refund. Last month's report run again gives the same answer as before, which is what auditors want.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a transaction fact is a list of events, and the total of any measure is the sum over the list. Appending a row adds its value; reversing adds the negative.

**Equation:** let the events be e₁, …, eₙ with amounts a(eᵢ). Sales on any slice S is Σ a(eᵢ) for eᵢ in S. A reversal appends e′ with a(e′) = −a(e), so the total over all time is unchanged by the original-plus-reversal pair: a(e) + a(e′) = 0. The table's *fill rate* is rows ÷ (product of the dimension sizes); for product-days, 6,543 ÷ 44,591 ≈ 0.15.

**Analogy:** a bank statement. A wrong charge isn't erased; a refund line appears below it. The balance ends right, and the statement still shows what happened.

**Try it:** an order of 3 lines is refunded. How many rows does the fact table have for it afterwards? (6: three sales and three reversals.)
</details>

## 6. Worked example: promotion vs normal days

*Question:* how much of Northbay's sales happened while a promotion was running, and what did the discounts cost?

```sql
-- try
SELECT CASE WHEN promo_key = 0 THEN 'no promotion' ELSE 'promotion' END AS period,
       COUNT(DISTINCT order_id) AS orders,
       ROUND(SUM(gross_amount), 2) AS gross,
       ROUND(SUM(discount_amount), 2) AS discounts,
       ROUND(SUM(sales_amount), 2) AS sales
FROM fact_sales
GROUP BY period
```

1. Each fact row knows its promotion, so one GROUP BY splits the sales: 609 orders and $15,918.05 of sales during promotions, against 3,336 orders and $110,601.79 on normal days.
2. Discounts cost $3,010.95 during promotions and only $276.79 the rest of the time. That's a plain SUM because `discount_amount` is additive (we stored amounts, not rates).
3. The reversal rows for order 1038 are included and cancel out, so the totals reflect what was really kept. (If you ran section 5, the order count still includes 1038: COUNT DISTINCT counts it whether its lines are positive or negative. Count orders with positive sales if that matters.)

## 7. Practice

```sql
-- exercise: Average order lines per order, per year: COUNT(*) ÷ COUNT(DISTINCT order_id) from fact_sales, only rows with quantity > 0, rounded to 2 decimals.
-- hint: year is date_key / 10000; multiply by 1.0 to avoid integer division.
SELECT date_key / 10000 AS year, COUNT(*) AS lines
FROM fact_sales
GROUP BY year
-- answer:
SELECT date_key / 10000 AS year, ROUND(1.0 * COUNT(*) / COUNT(DISTINCT order_id), 2) AS lines_per_order
FROM fact_sales
WHERE quantity > 0
GROUP BY year
```

```sql
-- exercise: How many days in 2025 had no sale at all of product 46 (Dish soap)? Start from dim_date.
-- hint: dim_date LEFT JOIN the distinct date_keys of product 46, WHERE year = 2025, and count the rows where the fact side is NULL.
SELECT COUNT(DISTINCT date_key) AS days_with_sale
FROM fact_sales
WHERE product_key = 46 AND date_key / 10000 = 2025
-- answer:
SELECT COUNT(*) AS days_without_sale
FROM dim_date d
LEFT JOIN (SELECT DISTINCT date_key FROM fact_sales WHERE product_key = 46) f ON f.date_key = d.date_key
WHERE d.year = 2025 AND f.date_key IS NULL
```

```sql
-- exercise: Show each store's share of 2025 transactions: store_key and the number of order lines, busiest first.
-- hint: WHERE date_key BETWEEN 20250101 AND 20251231 AND quantity > 0; GROUP BY store_key.
SELECT store_key, COUNT(*) AS lines
FROM fact_sales
GROUP BY store_key
-- answer:
SELECT store_key, COUNT(*) AS lines
FROM fact_sales
WHERE date_key BETWEEN 20250101 AND 20251231 AND quantity > 0
GROUP BY store_key
ORDER BY lines DESC
```

**New words:** *transaction fact table*, *sparse*, *append-only*, *reversing row*, *fill rate*.
