---
title: 'Lakes, lakehouses and medallion layers'
seoTitle: 'Data lake vs lakehouse and medallion architecture'
summary: 'A data lake keeps raw files cheaply, a warehouse keeps clean tables, and a lakehouse adds warehouse features to lake files. Learn the bronze, silver and gold medallion layers, then build all three for two days of Northbay orders in live SQL.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: What is the main job of the bronze layer?
    choices: ['Ready-made dashboard tables', 'Keep the raw data exactly as it arrived, with where and when it came from', 'Delete duplicates']
    ans: 1
    why: Bronze is the landing copy. Keeping it untouched means you can always rebuild silver and gold if a cleaning rule was wrong.
  - q: What does a table format such as Delta Lake or Apache Iceberg add to files in a data lake?
    choices: ['Nothing; it is just a file type like CSV', 'Transactions, schema checks and the ability to read older versions, so lake files behave like database tables', 'A dashboard']
    ans: 1
    why: Plain files can be half-written or overwritten. A table format keeps a log of changes on top of Parquet files, which gives reliable tables on cheap storage.
  - q: Where would a Kimball star schema usually sit in a medallion lakehouse?
    choices: ['Bronze', 'Silver', 'Gold']
    ans: 2
    why: Gold holds business-ready tables for reporting, which is where facts and dimensions live. Silver is cleaned and conformed but not yet shaped for a particular use.
---

**Module 6 · about 25 minutes · read first: 6.1.** You'll be able to explain the difference between a data lake, a warehouse and a lakehouse, name what goes into the bronze, silver and gold layers, and build all three for a small Northbay feed.

## 1. Why this matters

Job adverts for data engineers and BI developers now mention "lakehouse", "Databricks", "Microsoft Fabric" or "medallion architecture" as often as "data warehouse". They are not a replacement for modelling: the gold layer of a lakehouse is still made of facts and dimensions. Knowing the words, and what really changes, lets you join those teams without being lost.

## 2. Lake, warehouse, lakehouse

- A **data warehouse** stores clean tables in a database. You define the columns and types before loading (**schema-on-write**), and bad rows are rejected at the door. Fast, reliable SQL; storage costs more and unstructured data (images, logs) does not fit.
- A **data lake** stores files (CSV, JSON, Parquet, images) in cheap **object storage** such as Amazon S3, Azure Data Lake Storage or Google Cloud Storage. You decide how to read a file when you query it (**schema-on-read**). Cheap and flexible, but without care it becomes a "data swamp": nobody knows which file is current, and a half-written file can break a report.
- A **lakehouse** keeps the data in the lake but adds a **table format** on top: **Delta Lake**, **Apache Iceberg** or **Apache Hudi**. A table format keeps a log of which files make up the table, so you get transactions (no half-written tables), schema checks, updates and deletes, and **time travel** (reading the table as it was at an earlier version). Engines such as Spark, Databricks, Snowflake, Trino and DuckDB can then query those files as tables.

Sources: [Delta Lake](https://delta.io/), [Apache Iceberg](https://iceberg.apache.org/) and [Apache Hudi](https://hudi.apache.org/) project pages (checked 22 Nov 2026, check the official page for current features).

## 3. Medallion layers: bronze, silver, gold

Most lakehouses organise tables into three layers, named after medals. Databricks, which popularised the names, describes the medallion architecture as a design pattern for organising data logically, and says following it is recommended but not required ([Databricks documentation](https://docs.databricks.com/aws/en/lakehouse/medallion), checked 22 Nov 2026, check the official page).

<!--fig:medallion-->

| Layer | What it holds | Who uses it |
|---|---|---|
| **Bronze** | Raw data exactly as it arrived, plus where and when it came from. Duplicates and errors kept. | Data engineers, for reloading and audits |
| **Silver** | Cleaned, typed, de-duplicated, conformed data (one spelling per code, one row per business key). | Engineers and advanced analysts |
| **Gold** | Business-ready tables: stars, aggregates, features. | Analysts, dashboards, Power BI |

If that looks familiar, it should: it is the same idea as staging, core and marts ([Lesson 7.1](/learn/courses/data-modelling/layers/)) with different names. The Kimball star from Module 2 is a gold-layer design.

## 4. Bronze: land it as it came

The till system sends a file each night. On 31 December it re-sent the previous day's orders, and wrote the status in capitals. Bronze keeps both files untouched, every column as text, with the file name and load time:

```sql
-- noviz
DROP TABLE IF EXISTS bronze_orders;
CREATE TABLE bronze_orders (order_id TEXT, customer_id TEXT, store_id TEXT, order_date TEXT,
                            status TEXT, _source_file TEXT, _ingested_at TEXT);
INSERT INTO bronze_orders
SELECT order_id, customer_id, store_id, order_date, status, 'pos_2025-12-30.csv', '2025-12-31 02:00'
FROM orders WHERE order_date IN ('2025-12-29', '2025-12-30');
INSERT INTO bronze_orders
SELECT order_id, customer_id, store_id, order_date, upper(status), 'pos_2025-12-31.csv', '2026-01-01 02:00'
FROM orders WHERE order_date IN ('2025-12-30', '2025-12-31');
SELECT _source_file, COUNT(*) AS rows_landed FROM bronze_orders GROUP BY _source_file
```

48 rows landed, 24 from each file. But there were only 37 real orders: the 11 orders of 30 December are there twice. That is fine in bronze. Its job is to be a faithful copy, so you can always rebuild what comes after.

```sql
-- try
SELECT order_id, status, _source_file
FROM bronze_orders
WHERE order_date = '2025-12-30'
ORDER BY order_id, _source_file
LIMIT 6
```

## 5. Silver: clean, type, de-duplicate

Silver turns text into proper types, fixes spellings, and keeps one row per order (the latest one received):

```sql
-- noviz
DROP TABLE IF EXISTS silver_orders;
CREATE TABLE silver_orders AS
WITH ranked AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY _ingested_at DESC) AS rn
  FROM bronze_orders
)
SELECT CAST(order_id AS INTEGER) AS order_id,
       CAST(NULLIF(customer_id, '') AS INTEGER) AS customer_id,
       CAST(store_id AS INTEGER) AS store_id,
       date(order_date) AS order_date,
       lower(trim(status)) AS status,
       _source_file
FROM ranked
WHERE rn = 1;
SELECT COUNT(*) AS silver_rows, COUNT(DISTINCT order_id) AS distinct_orders FROM silver_orders
```

37 rows, 37 orders: one row per business key, as silver promises. Compare the status values in the two layers:

```sql
-- try
SELECT 'bronze' AS layer, status, COUNT(*) AS rows FROM bronze_orders GROUP BY status
UNION ALL
SELECT 'silver', status, COUNT(*) FROM silver_orders GROUP BY status
ORDER BY layer, status
```

Bronze has 'completed' and 'COMPLETED' (no orders were cancelled on these days); silver has one spelling, whichever file each row came from.

## 6. Gold: shaped for the question

Gold answers a business need. Here, daily completed sales for the dashboard, joining silver orders to the order lines:

```sql
-- try
SELECT s.order_date,
       COUNT(DISTINCT s.order_id) AS orders,
       ROUND(SUM(oi.quantity * oi.unit_price * (1 - oi.discount)), 2) AS sales
FROM silver_orders s
JOIN order_items oi ON oi.order_id = s.order_id
WHERE s.status = 'completed'
GROUP BY s.order_date
ORDER BY s.order_date
```

Now try the same query on `bronze_orders` instead (change `silver_orders` to `bronze_orders`). 31 December disappears completely, because its file wrote 'COMPLETED' and the WHERE no longer matches. Fix that with `lower(s.status) = 'completed'` and 30 December's sales double to $1,184.34 instead, because its orders are there twice. That is exactly why reports read gold, never bronze.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** each layer is a function of the one before: silver = clean(bronze), gold = shape(silver). Because bronze is never changed, you can fix a bug in clean() and re-run it to get a corrected silver, as many times as you like.

**Equation:** de-duplication picks one row per key. If bronze B has rows with keys k, silver is S = { the latest b ∈ B for each distinct k }, so |S| = number of distinct keys. Here |B| = 48 and |S| = 37. Re-running clean() on the same B gives the same S: clean(clean(B)) = clean(B), the property called **idempotence**.

**Analogy:** bronze is the raw footage, silver the edited film, gold the trailer. If the edit is wrong, you go back to the footage, never to the trailer.

**Try it:** a third file re-sends all 37 orders again. How many rows in bronze, and in silver? (85 in bronze; still 37 in silver.)
</details>

## 7. Worked example: where does each rule go?

Northbay's online shop starts sending clickstream events as JSON, about a million a day. Where does each piece go?

1. **Raw JSON events** → bronze, as files with source and load time. Cheap storage; nothing thrown away.
2. **Parsed events** with one row per event id, proper timestamps, bot traffic flagged → silver.
3. **fact_web_session** (one row per session) and the shared **dim_customer** and **dim_date** → gold. Sessions join to sales through the conformed dimensions, exactly as in the bus matrix.

The numbers in this lesson show the pattern on a small scale: 48 bronze rows → 37 silver rows → 3 gold rows, one per day.

## 8. Practice

```sql
-- exercise: Find the order ids that appear more than once in bronze_orders, with how many times each appears.
-- hint: GROUP BY order_id HAVING COUNT(*) > 1.
SELECT order_id
FROM bronze_orders
-- answer:
SELECT order_id, COUNT(*) AS copies
FROM bronze_orders
GROUP BY order_id
HAVING COUNT(*) > 1
```

```sql
-- exercise: Show how many silver orders came from each source file.
-- hint: GROUP BY _source_file in silver_orders.
SELECT _source_file
FROM silver_orders
-- answer:
SELECT _source_file, COUNT(*) AS orders
FROM silver_orders
GROUP BY _source_file
```

```sql
-- exercise: Build a small gold table of completed orders per store from silver_orders: store_id and orders, most orders first, ties by store_id.
-- hint: WHERE status = 'completed', GROUP BY store_id, ORDER BY orders DESC, store_id.
SELECT store_id, status
FROM silver_orders
-- answer:
SELECT store_id, COUNT(*) AS orders
FROM silver_orders
WHERE status = 'completed'
GROUP BY store_id
ORDER BY orders DESC, store_id
```

**New words:** *data lake*, *object storage*, *schema-on-write*, *schema-on-read*, *lakehouse*, *table format*, *time travel*, *medallion architecture*, *bronze*, *silver*, *gold*.
