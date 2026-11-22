---
title: 'Partitioning, clustering and cost'
seoTitle: 'Data warehouse partitioning and clustering: cut query cost'
summary: 'Cloud warehouses charge for the data a query reads, so the model decides the bill. Learn how partitioning, clustering, columnar storage and summary tables cut what is scanned, see pruning work (and fail) in live SQL, and price a dashboard with a small cost calculator.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: A fact table is partitioned by order date. Which filter lets the warehouse skip partitions?
    choices: ['WHERE order_date BETWEEN ''2025-12-01'' AND ''2025-12-31''', 'WHERE substr(order_date, 1, 7) = ''2025-12''', 'Both always work the same']
    ans: 0
    why: A plain range on the partition column can be matched to partitions before reading. Wrapping the column in a function often hides that, and the engine reads everything.
  - q: In a columnar warehouse that bills by bytes read, why is SELECT * expensive?
    choices: ['It is not', 'Every column is read and billed, even ones the report never uses', 'It sorts the table']
    ans: 1
    why: Columnar storage keeps each column separately, so a query that names 4 columns reads 4 columns. SELECT * reads them all. In BigQuery, LIMIT does not reduce the bytes billed either.
  - q: What does clustering do?
    choices: ['Copies the table to another region', 'Sorts or groups rows by chosen columns inside storage blocks, so filters on those columns can skip blocks', 'Deletes old rows']
    ans: 1
    why: Clustering keeps similar values together, so the engine can skip blocks whose value range cannot match. It complements partitioning.
sources:
  - 'Google Cloud, BigQuery documentation: Introduction to partitioned tables https://cloud.google.com/bigquery/docs/partitioned-tables'
  - 'Snowflake documentation, Micro-partitions and data clustering https://docs.snowflake.com/en/user-guide/tables-clustering-micropartitions'
  - 'The Kimball Group, Dimensional Modeling Techniques https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/'
---

**Module 7 · about 25 minutes · read first: 7.4.** You'll be able to explain partitioning, pruning, clustering and columnar storage, write filters that let a warehouse skip data, and estimate what a dashboard will cost to run.

<div class="bigidea">Cloud warehouses bill for the data you scan, so store data by column, split it into partitions, and write filters that let the engine skip what it does not need.</div>

**In everyday terms:** a filing cabinet with a drawer per month. If you only need March, you open one drawer instead of carrying home the whole cabinet.

## 1. Why this matters

On a laptop a slow query costs you a coffee break. In a cloud warehouse it costs money, every time the dashboard refreshes. Teams have been surprised by four- and five-figure monthly bills from one badly designed table. The good news: a few modelling choices (how a fact table is partitioned and clustered, which columns reports read, whether a summary table exists) usually cut the bill by 90% or more. Hiring managers like candidates who think about this.

<div class="meaning">

<dl>
<dt>Columnar storage</dt><dd>Each column is stored on its own, so a query reads only the columns it names.</dd>
<dt>Partition</dt><dd>A slice of the table, usually one day or month.</dd>
<dt>Partition pruning</dt><dd>Skipping partitions the filter rules out.</dd>
<dt>Clustering</dt><dd>Sorting data inside partitions so related rows sit together.</dd>
<dt>Summary table</dt><dd>A small pre-aggregated table for common dashboard questions.</dd>
<dt>Bytes scanned</dt><dd>What the bill is based on.</dd>
<dt>Physical meaning</dt><dd>Fewer columns and fewer partitions mean fewer bytes read from disk, so lower cost and faster results. No rows are changed.</dd>
</dl>

</div>

<div class="myth">

**"SELECT * with a LIMIT is cheap."** The engine still reads every column, so the bill is the same. Name the columns you need and filter on the partition column.

</div>

## 2. Where the cost comes from

Cloud warehouses price compute in one of two ways:

- **By data scanned.** BigQuery's on-demand pricing charges per tebibyte (TiB) of data processed: $6.25 per TiB, with the first 1 TiB each month free, and a minimum of 10 MB per table referenced. You are charged for the columns you select even with an explicit LIMIT ([BigQuery pricing](https://cloud.google.com/bigquery/pricing), checked 22 Nov 2026, check the official page).
- **By compute time.** Snowflake, Databricks, Azure SQL serverless and others charge for the time a warehouse or cluster runs. Reading less data still makes queries finish sooner, so the same tricks save money.

Either way: **read less data.** Four tools do it.

<!--fig:partition-pruning-->

## 3. Columnar storage

A **columnar** warehouse stores each column separately (and compresses it), instead of storing whole rows together. A query that uses 3 columns of a 20-column fact table reads roughly 3/20 of it. BigQuery, Snowflake, Redshift, Databricks (Parquet/Delta), DuckDB and SQL Server's columnstore indexes all work this way.

Modelling consequence: name the columns you need, never `SELECT *` in a dashboard query, and keep rarely used wide text (comments, JSON) out of the main fact table.

Here is a rough picture of how the bytes in a Northbay fact table are spread over its columns, measured as the length of each value written out as text:

```sql
-- noviz
DROP TABLE IF EXISTS fact_sales;
CREATE TABLE fact_sales AS
SELECT o.order_id, o.order_date, o.store_id, COALESCE(o.customer_id, -1) AS customer_key,
       o.channel, i.product_id, i.quantity, i.unit_price, i.discount,
       ROUND(i.quantity * i.unit_price * (1 - i.discount), 2) AS sales_amount
FROM orders o JOIN order_items i ON i.order_id = o.order_id
WHERE o.status = 'completed';
SELECT COUNT(*) AS rows FROM fact_sales
```

```sql
-- try
SELECT SUM(length(order_id)) AS order_id, SUM(length(order_date)) AS order_date,
       SUM(length(store_id)) AS store_id, SUM(length(customer_key)) AS customer_key,
       SUM(length(channel)) AS channel, SUM(length(product_id)) AS product_id,
       SUM(length(quantity)) AS quantity, SUM(length(sales_amount)) AS sales_amount
FROM fact_sales
```

A query for daily sales needs only order_date and sales_amount: 102,619 of the 217,761 characters, under half. Real warehouses store a date in a few bytes rather than 10 characters of text, so the saving there is bigger still, and real fact tables have far more columns.

## 4. Partitioning and pruning

**Partitioning** splits a table into separate chunks by the value of one column, usually a date: one partition per day or month. When a query filters on that column, the engine reads only the matching partitions and skips the rest. Skipping is called **partition pruning**.

- BigQuery partitions by a date or timestamp column (daily, monthly, yearly, or hourly), by ingestion time, or by integer ranges ([partitioned tables](https://docs.cloud.google.com/bigquery/docs/partitioned-tables)).
- PostgreSQL has range, list and hash partitioning, and its planner prunes partitions that cannot match the WHERE clause ([PostgreSQL partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)).
- Snowflake divides every table automatically into **micro-partitions** of 50 to 500 MB of uncompressed data and keeps the range of values of each column per micro-partition, which it uses to prune ([Snowflake micro-partitions](https://docs.snowflake.com/en/user-guide/tables-clustering-micropartitions)).

(All checked 22 Nov 2026, check the official page.)

If fact_sales were partitioned by month, how big would each partition be?

```sql
-- try
SELECT substr(order_date, 1, 7) AS month_partition, COUNT(*) AS rows
FROM fact_sales
GROUP BY month_partition
ORDER BY month_partition DESC
LIMIT 6
```

A query for December 2025 would read 555 of the 7,112 rows, under 8% of the table. Over ten years of data, a one-month query would read under 1%.

## 5. Pruning only works if the filter lets it

SQLite has no partitions, but an index on order_date behaves the same way for this purpose: the engine can jump to the range it needs. `EXPLAIN QUERY PLAN` shows whether it does.

```sql
-- noviz
CREATE INDEX IF NOT EXISTS ix_fact_date ON fact_sales(order_date);
EXPLAIN QUERY PLAN
SELECT SUM(sales_amount) FROM fact_sales
WHERE order_date BETWEEN '2025-12-01' AND '2025-12-31'
```

`SEARCH ... USING INDEX`: only December is read. Now the same question, with the column wrapped in a function:

```sql
-- noviz
EXPLAIN QUERY PLAN
SELECT SUM(sales_amount) FROM fact_sales
WHERE substr(order_date, 1, 7) = '2025-12'
```

`SCAN fact_sales`: every row is read, because the engine can't tell which range `substr(...)` matches without computing it for each row. Warehouses behave similarly with partitions. Rule: **filter the partition column directly, with a plain range.** The same goes for joins: filter on the fact's own date key, not only through a date dimension, if you want pruning to be reliable.

## 6. Clustering and summary tables

**Clustering** (Snowflake clustering keys, BigQuery clustered tables, Delta's Z-ordering, SQL Server's clustered indexes) keeps rows with similar values of chosen columns together inside storage blocks. A filter on a clustered column can skip blocks whose value range can't match. Typical choice: partition by date, cluster by the next most common filter (store, customer or product).

A **summary table** (aggregate table, or a materialised view) answers common questions from far fewer rows. A daily sales summary for Northbay:

```sql
-- try
SELECT COUNT(*) AS summary_rows, (SELECT COUNT(*) FROM fact_sales) AS fact_rows
FROM (SELECT order_date, store_id, SUM(sales_amount) AS sales
      FROM fact_sales GROUP BY order_date, store_id)
```

3,036 summary rows instead of 7,112, less than half. Northbay is tiny; a real chain sells hundreds of lines per store per day, so the summary is hundreds of times smaller than its fact. A dashboard of daily sales by store reads the summary, not the fact. Keep the fact for drilling down.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** bytes scanned ≈ table size × (fraction of columns read) × (fraction of partitions read). The two fractions multiply, so combining column choice and pruning cuts cost far more than either alone.

**Equation:** B = S × c × p. Monthly cost on scan-priced compute = max(0, B × runs − free allowance) × price per TiB. For S = 2 TiB, c = 0.2, p = 30 ÷ 3,650: B ≈ 2 × 0.2 × 0.0082 ≈ 0.0033 TiB per run.

**Analogy:** finding a receipt. Searching every drawer in the house (full scan), only the drawer for receipts (columns), only the folder for December (partition). Each step multiplies the saving.

**Try it:** a 1 TiB table, a query reading half the columns and one of 100 equal partitions. How much does one run scan? (1 × 0.5 × 0.01 = 0.005 TiB, about 5 GiB.)
</details>

Watch it happen, one step at a time (any live box below has a **Show how it runs** button that animates the real query):

<div class="steps">
<div class="step"><b>The table.</b> 365 daily partitions, four columns.</div>
<div class="step"><b>Query 1.</b> <code>SELECT * FROM fact</code> reads every column of every partition: 100%.</div>
<div class="step"><b>Name columns.</b> Read three of four columns. The wide comment column is skipped.</div>
<div class="step"><b>Filter the partition column.</b> <code>WHERE order_date &gt;= ...</code> over the last 7 days keeps <mark>7 of 365</mark> partitions.</div>
<div class="step"><b>Wrap it and lose it.</b> <code>WHERE YEAR(order_date) = 2026</code> can stop pruning. Compare the column directly.</div>
</div>

<div class="problem" data-problem="dm-scan-cost"></div>

## 7. Worked example: pricing a dashboard

Imagine Northbay at the scale of a national retail chain: a 2 TiB, 20-column fact table holding 10 years of sales. A dashboard sends 20 queries per refresh and refreshes once a day: 600 queries a month. Each query uses 4 columns and the last 30 days. Using BigQuery's on-demand prices above:

```sql
-- try
WITH designs(design, tib_per_run) AS (
  VALUES ('1. SELECT *, no partitions',           2.0),
         ('2. 4 of 20 columns, no partitions',    2.0 * 4 / 20),
         ('3. 4 columns + daily partitions',      2.0 * 4 / 20 * 30 / 3650)
)
SELECT design,
       ROUND(tib_per_run * 600, 2) AS tib_per_month,
       ROUND(MAX(tib_per_run * 600 - 1, 0) * 6.25, 2) AS usd_per_month
FROM designs
ORDER BY design
```

1. Reading every column of every row: 1,200 TiB a month, about $7,494.
2. Naming only 4 columns: 240 TiB, about $1,494.
3. Adding daily partitions and filtering on the last 30 days: under 2 TiB a month, about $6.

Same dashboard, same numbers on screen. A summary table would take design 3 under the free 1 TiB. (Real columns differ in width, so treat these as estimates; the warehouse's query plan shows the real bytes before you run.)

## 8. Practice

```sql
-- exercise: How many fact rows would a query for the whole of 2025 read if fact_sales were partitioned by month? Return the count of rows whose order_date is in 2025.
-- hint: A plain range on order_date: BETWEEN '2025-01-01' AND '2025-12-31'.
SELECT COUNT(*) AS rows_read
FROM fact_sales
-- answer:
SELECT COUNT(*) AS rows_read
FROM fact_sales
WHERE order_date BETWEEN '2025-01-01' AND '2025-12-31'
```

```sql
-- exercise: Change the calculator so the dashboard refreshes every hour, 24 times a day, for design 3 only (20 queries per refresh, 30 days: 14,400 queries a month). Return tib_per_month and usd_per_month.
-- hint: tib_per_run is 2.0 * 4 / 20 * 30 / 3650; multiply by 14400 instead of 600.
SELECT ROUND(2.0 * 4 / 20 * 30 / 3650 * 600, 2) AS tib_per_month
-- answer:
SELECT ROUND(2.0 * 4 / 20 * 30 / 3650 * 14400, 2) AS tib_per_month,
       ROUND(MAX(2.0 * 4 / 20 * 30 / 3650 * 14400 - 1, 0) * 6.25, 2) AS usd_per_month
```

```sql
-- exercise: Build a monthly summary by store: one row per month (YYYY-MM) and store_id with total sales. Return how many rows it has.
-- hint: GROUP BY substr(order_date, 1, 7), store_id inside a subquery, then COUNT(*) outside.
SELECT COUNT(*) AS rows
FROM fact_sales
-- answer:
SELECT COUNT(*) AS rows
FROM (SELECT substr(order_date, 1, 7) AS month, store_id, SUM(sales_amount) AS sales
      FROM fact_sales
      GROUP BY month, store_id)
```

<div class="keypoints">

- Billing follows bytes scanned.
- Columnar storage: name only the columns you need.
- Partition by the column most queries filter on, usually date.
- Do not wrap the partition column in a function.
- Summary tables answer common dashboard questions cheaply.

</div>

**New words:** *columnar storage*, *partition*, *partition pruning*, *micro-partition*, *clustering*, *summary table*, *materialised view*, *bytes scanned*.
