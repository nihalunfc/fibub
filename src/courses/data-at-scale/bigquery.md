---
title: 'BigQuery: the warehouse with no servers'
summary: 'How BigQuery stores data and runs queries, why on-demand cost follows bytes scanned, partitioning and clustering, nested data, and habits that keep bills small.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: On on-demand pricing, which query costs less?
    choices: ['SELECT * FROM sales LIMIT 10', 'SELECT store_id, revenue FROM sales WHERE sale_date = ''2026-11-01'' on a table partitioned by sale_date', 'They cost the same']
    ans: 1
    why: Cost follows bytes scanned. LIMIT does not reduce the bytes read; choosing fewer columns and filtering on the partition column does.
  - q: Clustering a table by store_id helps most when queries...
    choices: ['select every column', 'filter or join on store_id', 'only count rows']
    ans: 1
    why: Clustering sorts data inside each partition by the clustering columns, so BigQuery can skip blocks that don't match a filter on them.
  - q: What is a BigQuery slot?
    choices: ['A table partition', 'A unit of compute capacity used to run queries', 'A saved query']
    ans: 1
    why: Queries run on slots. On demand you share a large pool; with capacity pricing you reserve slots and pay for slot time.
sources:
  - 'Google Cloud documentation: introduction to partitioned tables https://cloud.google.com/bigquery/docs/partitioned-tables'
  - 'Google Cloud documentation: introduction to clustered tables https://cloud.google.com/bigquery/docs/clustered-tables'
  - 'Google Cloud: BigQuery pricing https://cloud.google.com/bigquery/pricing'
  - 'Melnik, S. et al. (2010), Dremel: Interactive Analysis of Web-Scale Datasets, Proceedings of the VLDB Endowment 3(1)'
---

**Module 3 · about 30 minutes · read first: [3.1](/learn/courses/data-at-scale/gcp-tour/), [3.2](/learn/courses/data-at-scale/gcs-data-lake/).** You'll be able to explain columnar storage, slots and why BigQuery charges by bytes scanned, build partitioned and clustered tables that scan less, and query nested data with UNNEST.

<div class="bigidea">BigQuery reads only the columns and partitions your query touches, and on demand you pay for exactly those bytes, so writing cheaper SQL means sending the engine to fewer pages.</div>

## 1. What makes BigQuery different

**BigQuery** is a fully managed, serverless warehouse. There is no cluster to size: you write SQL, and Google's engine (descended from its internal Dremel system) spreads the query over many machines for a few seconds. Under the hood:

- **Columnar storage:** each column is stored separately, so reading one column never touches the others.
- **Storage and compute are separate,** joined by a very fast network, so each grows on its own.
- **Slots** are units of compute. A query is broken into stages, and each stage runs on many slots in parallel.

Picture a giant library with instant helpers. You hand your question to the desk. Hundreds of helpers run to the shelves, each reads only the pages (columns) and sections (partitions) needed, and the answer comes back in seconds. You are charged for **how many pages were read**, not how long the helpers stood around. So the trick is asking questions that send them to fewer pages.

## 2. Pricing in plain words

- **Storage:** per GB per month. Data not changed for 90 days drops to a cheaper long-term rate automatically.
- **Compute, on demand:** per TiB **scanned** by each query, with a free amount each month. A query reading 50 GB costs a small fraction of the rate; one reading a 40 TB table every hour can run to thousands a month.
- **Compute, capacity (editions):** reserve slots and pay for slot-hours instead of bytes. Large companies use this for predictable bills.

Check today's prices on Google's pricing page. The shape of the bill matters more than the exact number, and it is always the same: **bytes scanned × rate**.

Step through the four stages, then change the aggregate and raise the HAVING bar.

<div class="steps" data-fig="@data-groupby-buckets">
<div class="step">Start with the plain table: ten rows, each with a region and an amount.</div>
<div class="step">Split: every row slides into the bucket for its region.</div>
<div class="step">Apply: the aggregate is worked out inside each bucket on its own.</div>
<div class="step">Combine: each bucket collapses to one result row. HAVING now removes whole groups.</div>
</div>


## 3. Partitioning and clustering

```sql
CREATE TABLE retail.sales
PARTITION BY sale_date
CLUSTER BY store_id, sku
OPTIONS (require_partition_filter = TRUE)
AS SELECT * FROM retail.sales_raw;
```

- **Partitioning** splits the table by a date or timestamp column (or ingestion time, or an integer range). Filters on it skip whole partitions, like going straight to one drawer. `require_partition_filter` stops anyone from accidentally scanning all of history.
- **Clustering** sorts the data inside each partition by up to four columns. Filters on them skip blocks, like a drawer whose folders are in alphabetical order. Order matters: put the most-filtered column first.

Watch the same sales question asked four ways on a table with two years of sales, 30 million rows a day and about 20 columns:

<div class="steps" data-fig="bigquery-bytes">
<div class="step"><b>SELECT * over all history.</b> Every column of every day: about 3.5 TB read. This is what a careless "let me just look" query costs.</div>
<div class="step"><b>Only the 2 columns you need.</b> <code>SELECT store_id, revenue</code> reads 2 of 20 columns: about 350 GB. Ten times less, from one change.</div>
<div class="step"><b>Add a filter on the partition column.</b> <code>WHERE sale_date &gt;= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)</code> reads 7 of 730 daily partitions: about 3.4 GB.</div>
<div class="step"><b>Add a filter on the cluster column.</b> <code>AND store_id = 214</code> lets BigQuery skip most blocks inside each day: well under 1 GB. The exact saving depends on block sizes, so check the bytes in the job details.</div>
</div>

Prove it yourself: before you run a query, the editor shows the bytes it will process (a free **dry run**). Compare the numbers with and without your filter.

<div class="problem" data-problem="bigquery-scan-cost"></div>

## 4. SQL you will use often

```sql
-- One row per item from a nested order table
SELECT o.order_id, item.sku, item.qty
FROM retail.orders AS o
CROSS JOIN UNNEST(o.items) AS item;

-- Approximate distinct count: much cheaper on billions of rows
SELECT campaign_id, APPROX_COUNT_DISTINCT(user_id) AS reach
FROM ads.impressions
WHERE event_date BETWEEN '2026-10-01' AND '2026-10-31'
GROUP BY campaign_id;

-- Keep the latest version of each row
SELECT * FROM retail.customers_cdc
QUALIFY ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY updated_at DESC) = 1;

-- Upsert yesterday's changes into a dimension
MERGE retail.dim_product t USING staging.product_changes s ON t.sku = s.sku
WHEN MATCHED THEN UPDATE SET t.price = s.price, t.updated_at = s.updated_at
WHEN NOT MATCHED THEN INSERT ROW;
```

**Nested and repeated fields** (an `ARRAY` of `STRUCT`s) keep an order and its items in one row, like a receipt with its lines printed on it, which saves a join. `UNNEST` unrolls the lines into rows when you need them.

## 5. The rest of the toolbox

- **Loading:** batch loads from Cloud Storage (load jobs themselves are not charged as queries), the Storage Write API for streaming, Datastream for database changes, and the Data Transfer Service for Google Ads and other sources.
- **Materialised views** keep aggregates fresh automatically; **BI Engine** caches data in memory for fast dashboards.
- **BigQuery ML:** train models with SQL (`CREATE MODEL ... OPTIONS(model_type='linear_reg')`), and call Gemini models from SQL. The [ML foundations course](/learn/courses/ml-foundations/) explains what those models do.
- **Security:** dataset and table permissions, **row-level security**, **column-level policy tags** to hide personal data, and authorised views for sharing.

Its rivals are Snowflake, Amazon Redshift, Databricks SQL and Microsoft Fabric. The SQL skills transfer almost entirely.

<div class="meaning">

<dl>
<dt>Bytes scanned</dt><dd>The total size of the columns and partitions a query reads. The on-demand bill is this times the rate.</dd>
<dt>Partition</dt><dd>A slice of a table by date (or integer range) that a filter can skip entirely.</dd>
<dt>Cluster</dt><dd>A sort order inside each partition, so filters on those columns skip blocks.</dd>
<dt>Slot</dt><dd>One unit of compute; a query runs on many at once.</dd>
<dt>UNNEST</dt><dd>Turns an array inside a row into separate rows.</dd>
<dt>Physical meaning</dt><dd>A dashboard that refreshes every 15 minutes runs its query about 2,900 times a month. If each run scans a year of history instead of a week, the bill is roughly 50 times bigger for the same picture. One partition filter is often the cheapest saving a team will ever make.</dd>
</dl>

</div>

<div class="myth">

**"Adding LIMIT 10 makes a query cheap."** LIMIT only shortens the result you see. BigQuery still reads every byte of the columns and partitions you asked for, and bills them. To look at a few rows for free, use the table's Preview tab; to cut cost, select fewer columns and filter on the partition column.

</div>

## 6. Try it

In the BigQuery sandbox, using the public dataset `bigquery-public-data.thelook_ecommerce` (a fictional online clothing shop):

1. Total revenue by month and product category from `order_items` joined to `products`. Note the bytes processed.
2. Create your own copy of `order_items` partitioned by `DATE(created_at)` and clustered by `product_id`:

```sql
CREATE TABLE mylab.order_items_p
PARTITION BY DATE(created_at)
CLUSTER BY product_id AS
SELECT * FROM `bigquery-public-data.thelook_ecommerce.order_items`;
```

3. Run the same one-month query on both tables and compare bytes processed.
4. Find each user's first order date with `QUALIFY`.

What to check: the partitioned table's one-month query processes a small fraction of the original's bytes, and step 4 returns one row per user.

**Cost habits:** never `SELECT *` on big tables; filter on the partition column; set a **maximum bytes billed** on scheduled queries; and look at `INFORMATION_SCHEMA.JOBS` weekly for the most expensive queries.

**New words:** *serverless*, *columnar*, *slot*, *on-demand pricing*, *capacity pricing*, *partitioning*, *clustering*, *dry run*, *nested and repeated fields*, *UNNEST*, *QUALIFY*, *MERGE*, *materialised view*.

<div class="keypoints">

- BigQuery is serverless and columnar: storage and compute are separate, and queries run on slots.
- On demand, cost = bytes scanned × rate. LIMIT does not reduce it; fewer columns and partition filters do.
- Partition by the date people filter on; cluster by up to four frequently filtered columns.
- Check bytes before running (dry run) and set maximum bytes billed on scheduled queries.
- Nested data with UNNEST, QUALIFY for "latest row", and MERGE for upserts cover most daily SQL.

</div>
