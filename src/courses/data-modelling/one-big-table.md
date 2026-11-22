---
title: 'One big table and wide tables'
seoTitle: 'One big table (OBT) vs star schema: pros and cons'
summary: 'A one big table (OBT) joins the star into one wide, flat table so nobody has to join. Build one from a Northbay star, measure what it costs in repeated text, see the double-counting trap, and learn when wide tables are the right call.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: What is a one big table (OBT)?
    choices: ['A fact table with no dimensions at all', 'A fact table with every dimension column already joined on, so queries need no joins', 'A table that holds every source system']
    ans: 1
    why: An OBT is the star "pre-joined". Each row is still one fact (here one order line), but it carries the product, store, customer and date columns with it.
  - q: A customer's loyalty tier changes. What has to change in an OBT?
    choices: ['One row in a dimension', 'Every row for that customer, in the whole table (or a rebuild)', 'Nothing, tiers never change']
    ans: 1
    why: In an OBT the tier is copied onto every one of that customer's fact rows, so all of them must be rewritten. In a star it is one row in dim_customer.
  - q: Someone adds order_total (the whole order's value) to each order-line row of an OBT. What goes wrong?
    choices: ['Nothing', 'SUM(order_total) counts each order once per line, so totals come out too high', 'The table becomes narrower']
    ans: 1
    why: A value at order grain repeated on line-grain rows is not additive across lines. Summing it multiplies each order by its number of lines.
---

**Module 6 · about 25 minutes · read first: 2.4.** You'll be able to build a one big table from a star schema, explain what it gains and what it costs, avoid the double-counting trap, and decide when a wide table is the right design.

## 1. Why this matters

In cloud warehouses such as BigQuery, Snowflake and Databricks, many teams publish wide, flat tables for analysts and for tools that cannot join well (spreadsheets, some notebook users, machine learning features). You will be asked to build them, and to say when a star is better. Knowing both, and the traps in between, is what makes a modeller trusted.

## 2. The star, pre-joined

A **one big table** (OBT, also called a **wide table** or **flat table**) is a fact table with every dimension attribute already joined on. The grain does not change: one row per order line stays one row per order line. What changes is that the descriptions travel with each row.

First build a small Northbay star to start from: four dimensions and fact_sales at order-line grain, completed orders only, guests mapped to customer key -1.

```sql
-- noviz
DROP TABLE IF EXISTS fact_sales;
DROP TABLE IF EXISTS dim_date;
DROP TABLE IF EXISTS dim_product;
DROP TABLE IF EXISTS dim_store;
DROP TABLE IF EXISTS dim_customer;
CREATE TABLE dim_date AS
SELECT DISTINCT CAST(replace(order_date, '-', '') AS INTEGER) AS date_key, order_date AS full_date,
       CAST(substr(order_date, 1, 4) AS INTEGER) AS year, CAST(substr(order_date, 6, 2) AS INTEGER) AS month,
       CASE strftime('%w', order_date) WHEN '0' THEN 'Sun' WHEN '6' THEN 'Sat' ELSE 'Weekday' END AS day_type
FROM orders;
CREATE TABLE dim_product AS
SELECT p.product_id AS product_key, p.product_name, p.brand, c.category_name, c.department
FROM products p JOIN categories c ON c.category_id = p.category_id;
CREATE TABLE dim_store AS
SELECT s.store_id AS store_key, s.store_name, COALESCE(s.city, 'Online') AS city,
       COALESCE(s.province, 'Online') AS province, COALESCE(r.region_name, 'Online') AS region
FROM stores s LEFT JOIN regions r ON r.region_id = s.region_id;
CREATE TABLE dim_customer AS
SELECT -1 AS customer_key, 'Guest' AS customer_name, 'Unknown' AS city, 'Unknown' AS loyalty_tier
UNION ALL
SELECT customer_id, first_name || ' ' || last_name, trim(city), COALESCE(loyalty_tier, 'None') FROM customers;
CREATE TABLE fact_sales AS
SELECT o.order_id, CAST(replace(o.order_date, '-', '') AS INTEGER) AS date_key,
       oi.product_id AS product_key, o.store_id AS store_key, COALESCE(o.customer_id, -1) AS customer_key,
       oi.quantity, ROUND(oi.quantity * oi.unit_price * (1 - oi.discount), 2) AS sales_amount
FROM orders o JOIN order_items oi ON oi.order_id = o.order_id
WHERE o.status = 'completed';
SELECT COUNT(*) AS fact_rows, ROUND(SUM(sales_amount), 2) AS sales FROM fact_sales
```

7,112 fact rows worth $126,579.09. Now flatten it. Every join is done once, at build time:

```sql
-- noviz
DROP TABLE IF EXISTS obt_sales;
CREATE TABLE obt_sales AS
SELECT f.order_id, d.full_date, d.year, d.month, d.day_type,
       p.product_name, p.brand, p.category_name, p.department,
       s.store_name, s.city AS store_city, s.province, s.region,
       f.customer_key, c.customer_name, c.city AS customer_city, c.loyalty_tier,
       f.quantity, f.sales_amount
FROM fact_sales f
JOIN dim_date d     ON d.date_key = f.date_key
JOIN dim_product p  ON p.product_key = f.product_key
JOIN dim_store s    ON s.store_key = f.store_key
JOIN dim_customer c ON c.customer_key = f.customer_key;
SELECT COUNT(*) AS obt_rows FROM obt_sales
```

Still 7,112 rows: the joins are all many-to-one, so no row is lost or doubled. Always check that count; if it moves, a dimension had a duplicate key ([fan-out](/learn/courses/sql/fan-out/)).

## 3. What you gain: no joins

The same question, two ways. On the star:

```sql
-- try
SELECT p.department, ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_product p ON p.product_key = f.product_key
JOIN dim_date d    ON d.date_key = f.date_key
WHERE d.year = 2025
GROUP BY p.department
ORDER BY sales DESC
```

On the OBT:

```sql
-- try
SELECT department, ROUND(SUM(sales_amount), 2) AS sales
FROM obt_sales
WHERE year = 2025
GROUP BY department
ORDER BY sales DESC
```

Same answer (Grocery $27,875.79 first), no joins. For people who don't know SQL well, for spreadsheet exports and for machine learning features, that simplicity is real value. In **columnar** warehouses (which store each column separately and compress repeated values well), reading one wide table can also be faster than joining.

## 4. What it costs

**Repeated text.** Every product name, store name and customer name is copied onto every line. Count the characters of descriptive text each design stores:

```sql
-- try
SELECT
  (SELECT SUM(length(product_name) + length(brand) + length(category_name) + length(department)
            + length(store_name) + length(store_city) + length(province) + length(region)
            + length(customer_name) + length(customer_city) + length(loyalty_tier)
            + length(day_type) + length(full_date)) FROM obt_sales) AS obt_text_chars,
  (SELECT SUM(length(product_name) + length(brand) + length(category_name) + length(department)) FROM dim_product)
  + (SELECT SUM(length(store_name) + length(city) + length(province) + length(region)) FROM dim_store)
  + (SELECT SUM(length(customer_name) + length(city) + length(loyalty_tier)) FROM dim_customer)
  + (SELECT SUM(length(day_type) + length(full_date)) FROM dim_date) AS star_text_chars
```

824,084 characters in the OBT against 29,436 in the star's dimensions, about 28 times as much. Columnar compression shrinks the gap a lot on disk, but in memory, in exports and in row-based databases you pay it.

**Changes are expensive.** Customer 135 moves from Silver to Gold. In the star that is one row. In the OBT:

```sql
-- noviz
UPDATE obt_sales SET loyalty_tier = 'Gold' WHERE customer_key = 135
```

The message says 20 rows changed, one per order line that customer ever bought. With millions of customers and a daily rebuild, that is why OBTs are usually **rebuilt** from the star rather than updated.

**History is frozen at build time.** If the OBT copies the tier when the row is built, it shows the tier "as it was"; if it is rebuilt nightly from the current dimension, it shows "as it is" ([Lesson 5.4](/learn/courses/data-modelling/point-in-time/)). Decide which, and write it in the table's description.

## 5. The double-counting trap

Wide tables invite people to add columns from a different grain. Suppose someone adds each order's total to every line:

```sql
-- try
WITH obt_plus AS (
  SELECT order_id, sales_amount,
         SUM(sales_amount) OVER (PARTITION BY order_id) AS order_total
  FROM obt_sales
)
SELECT ROUND(SUM(sales_amount), 2) AS right_total,
       ROUND(SUM(order_total), 2) AS wrong_total
FROM obt_plus
```

$126,579.09 is right. $301,183.62 is wrong: each order's total was counted once per line, and orders average almost two lines. Rule: **every measure in an OBT must be at the table's grain**. Order-level numbers belong in their own table, or are counted with `COUNT(DISTINCT order_id)`.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a star is a **factorisation** of the OBT. Each dimension column in the OBT is a function of a key: tier = g(customer_key). Storing g once (the dimension) and the key per row (the fact) is enough to rebuild every row, so the OBT = fact ⋈ dimensions. Nothing is lost either way; the trade is storage and update cost against join cost.

**Equation:** with n fact rows, m customers and an attribute of width w, the OBT stores n·w for it and the star m·w + n·k, where k is a small key. Here n = 7,112 and m = 604, so the OBT copy is about 12 times bigger for each customer column before compression.

**Analogy:** a printed phone book where every page repeats the whole street directory versus one directory at the back. Easier to read, much heavier to reprint when one person moves.

**Try it:** an OBT has 10 million rows and 50,000 products. Roughly how many times is each product name stored? (About 200, on average.)
</details>

## 6. Worked example: should Northbay publish an OBT?

*Request:* the marketing team wants a file of every 2025 order line with customer tier and department, to load into a spreadsheet model each Monday.

1. **Size:** `SELECT COUNT(*) FROM obt_sales WHERE year = 2025` gives 4,032 rows. That fits a spreadsheet easily.
2. **Grain:** one row per order line; only line-level measures (quantity, sales_amount). No order totals copied onto lines.
3. **History:** marketing asks "what tier were they when they bought?", so build it from an SCD2 customer dimension, joined on the surrogate key that was current at order time.
4. **Ownership:** build it as a view or table *on top of* the star, rebuilt each night. The star stays the source of truth; the OBT is one more mart.

Verdict: yes, as a mart over the star. Not instead of it.

## 7. Practice

```sql
-- exercise: Using only obt_sales, show 2024 sales by region, highest first.
-- hint: WHERE year = 2024, GROUP BY region.
SELECT region, sales_amount
FROM obt_sales
-- answer:
SELECT region, ROUND(SUM(sales_amount), 2) AS sales
FROM obt_sales
WHERE year = 2024
GROUP BY region
ORDER BY sales DESC
```

```sql
-- exercise: Count orders (not lines) and sales by loyalty_tier from obt_sales, biggest sales first.
-- hint: An order spans several rows, so use COUNT(DISTINCT order_id).
SELECT loyalty_tier, COUNT(*) AS orders
FROM obt_sales
GROUP BY loyalty_tier
-- answer:
SELECT loyalty_tier, COUNT(DISTINCT order_id) AS orders, ROUND(SUM(sales_amount), 2) AS sales
FROM obt_sales
GROUP BY loyalty_tier
ORDER BY sales DESC
```

```sql
-- exercise: Check the OBT against the star: return one row with the fact table's total sales and the OBT's total sales, both rounded to 2 decimals.
-- hint: Two scalar subqueries in one SELECT.
SELECT ROUND(SUM(sales_amount), 2) AS obt_sales
FROM obt_sales
-- answer:
SELECT (SELECT ROUND(SUM(sales_amount), 2) FROM fact_sales) AS star_sales,
       (SELECT ROUND(SUM(sales_amount), 2) FROM obt_sales) AS obt_sales
```

**New words:** *one big table (OBT)*, *wide table*, *columnar storage*, *factorisation*.
