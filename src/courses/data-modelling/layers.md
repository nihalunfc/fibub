---
title: 'Staging, core and marts'
seoTitle: 'Data warehouse layers: staging, core and data marts'
summary: 'Most warehouses are built in three layers: staging copies and tidies each source, core holds the conformed facts and dimensions, and marts shape them for each team. Build all three for Northbay with tables and views, and check that every layer only reads from the one below.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: What should a staging model do?
    choices: ['Join many sources and calculate KPIs', 'Mirror one source table, with columns renamed, typed and tidied, but no business logic', 'Hold the dashboard numbers']
    ans: 1
    why: Staging is one model per source table, close to the source. Renaming, casting and trimming belong here; joins and business rules come later.
  - q: Which layer holds the conformed dim_customer and fact_sales?
    choices: ['Staging', 'Core', 'Mart']
    ans: 1
    why: Core (also called the warehouse or integration layer) holds the shared, conformed facts and dimensions that every mart is built from.
  - q: A mart reads straight from a staging view to save a join. Why is that a problem?
    choices: ['It is not a problem', 'The mart skips core''s keys and cleaning rules, so its numbers can disagree with every other mart', 'Views cannot read views']
    ans: 1
    why: Layers only read from the layer below. Skipping core means skipping the rules that make numbers agree, such as the unknown member and de-duplication.
sources:
  - 'dbt Labs documentation, How we structure our dbt projects https://docs.getdbt.com/best-practices/how-we-structure/1-guide-overview'
  - 'The Kimball Group, Dimensional Modeling Techniques https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/'
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley, chapter 20 (ETL system design and development)'
---

**Module 7 · about 30 minutes · read first: 2.4.** You'll be able to explain what belongs in staging, core and mart layers, build each layer for Northbay as tables and views, and check that the dependencies only point one way.

<div class="bigidea">A warehouse is built in layers (staging, core, marts) and each layer reads only from the one before it, so changes flow one way.</div>

**In everyday terms:** a restaurant kitchen. Prep tidies each raw ingredient (staging), the main line combines them into dishes (core), and the pass plates each order for its table (marts).

## 1. Why this matters

Open any real warehouse project, whether built with dbt, stored procedures or a notebook, and you will find folders or schemas called something like `staging`, `core` (or `warehouse`, `intermediate`) and `marts`. Knowing what goes where tells you where to fix a bug, where to add a new column, and where a reviewer will expect your code. It is the skeleton the rest of this module hangs on.

<div class="meaning">

<dl>
<dt>Staging</dt><dd>One tidy copy of each source table: renamed, typed, no business logic.</dd>
<dt>Core</dt><dd>The conformed star: shared dimensions and facts.</dd>
<dt>Mart</dt><dd>A set of tables or views for one audience.</dd>
<dt>Intermediate layer</dt><dd>Helper models between staging and core.</dd>
<dt>DAG</dt><dd>A graph of models where arrows point one way and never loop.</dd>
<dt>Downstream</dt><dd>Anything that reads from a given model.</dd>
<dt>Physical meaning</dt><dd>Each layer is its own tables or views. The dependencies form a one-way chain, so a change in staging can only affect what is downstream.</dd>
</dl>

</div>

<div class="myth">

**"It is fine for a mart to read straight from the source if it is quicker."** Skipping layers creates hidden dependencies and repeated logic. Every report should read from marts, and marts from core.

</div>

## 2. Three layers, one direction

<!--fig:warehouse-layers-->

- **Staging** (`stg_`): one model per source table. Rename columns to house style, cast types, trim spaces, fix case, turn blanks into NULL. No joins, no business rules. If the source changes, only its staging model changes.
- **Core** (`dim_`, `fact_`): the conformed star. Surrogate keys, the -1 unknown member, SCD2 history, de-duplication, one definition of "sales". This is the single version of the truth.
- **Marts** (`mart_`): shaped for one team or dashboard: monthly sales for finance, customer value for marketing. Usually views or small tables over core.

The one rule: **each layer reads only from the layer below it.** Staging reads sources, core reads staging, marts read core. In a lakehouse the same layers are called bronze, silver and gold ([Lesson 6.4](/learn/courses/data-modelling/lakehouse/)). Some teams add an **intermediate** layer between staging and core for reusable steps, such as order totals, that several core tables need.

## 3. Staging: tidy each source

Each staging view mirrors one Northbay table. Note what happens: renamed columns, trimmed cities, one case for emails, and a computed line value with the formula written once.

```sql
-- noviz
DROP VIEW IF EXISTS stg_customers;
DROP VIEW IF EXISTS stg_orders;
DROP VIEW IF EXISTS stg_order_items;
CREATE VIEW stg_customers AS
SELECT customer_id,
       first_name || ' ' || last_name AS customer_name,
       lower(email) AS email,
       trim(city) AS city,
       province,
       date(joined_on) AS joined_on,
       loyalty_tier
FROM customers;
CREATE VIEW stg_orders AS
SELECT order_id, customer_id, store_id, date(order_date) AS order_date, channel, lower(status) AS status
FROM orders;
CREATE VIEW stg_order_items AS
SELECT order_id, product_id, quantity, unit_price, discount,
       ROUND(quantity * unit_price * (1 - discount), 2) AS line_amount
FROM order_items;
SELECT (SELECT COUNT(*) FROM stg_customers) AS customers,
       (SELECT COUNT(*) FROM stg_orders) AS orders,
       (SELECT COUNT(*) FROM stg_order_items) AS order_lines
```

Same counts as the sources (603, 4,064, 7,310): staging never drops or adds rows. Check a tidied row:

```sql
-- try
SELECT customer_id, customer_name, city, length(city) AS city_length
FROM stg_customers
WHERE customer_id IN (3, 32, 41)
```

In the raw table those cities end in a space; here they don't.

## 4. Core: the conformed star

Core is built from staging only. dim_customer gets its own surrogate key (numbered in sign-up order) and the -1 unknown member for guests. fact_sales looks up each key through the dimension.

```sql
-- noviz
DROP TABLE IF EXISTS fact_sales;
DROP TABLE IF EXISTS dim_customer;
CREATE TABLE dim_customer (customer_key INTEGER PRIMARY KEY, customer_id INTEGER UNIQUE,
  customer_name TEXT, city TEXT, province TEXT, loyalty_tier TEXT);
INSERT INTO dim_customer VALUES (-1, NULL, 'Guest', 'Unknown', 'Unknown', 'Unknown');
INSERT INTO dim_customer (customer_id, customer_name, city, province, loyalty_tier)
SELECT customer_id, customer_name, city, province, COALESCE(loyalty_tier, 'None')
FROM stg_customers
ORDER BY joined_on, customer_id;
CREATE TABLE fact_sales AS
SELECT o.order_id,
       CAST(replace(o.order_date, '-', '') AS INTEGER) AS date_key,
       i.product_id AS product_key,
       o.store_id AS store_key,
       COALESCE(c.customer_key, -1) AS customer_key,
       i.quantity, i.line_amount AS sales_amount
FROM stg_orders o
JOIN stg_order_items i ON i.order_id = o.order_id
LEFT JOIN dim_customer c ON c.customer_id = o.customer_id
WHERE o.status = 'completed';
SELECT (SELECT COUNT(*) FROM dim_customer) AS dim_customer_rows,
       COUNT(*) AS fact_rows, ROUND(SUM(sales_amount), 2) AS sales
FROM fact_sales
```

604 customer rows (603 plus Unknown), 7,112 fact rows, $126,579.09. The surrogate key is not the customer number any more: look up customer 17.

```sql
-- try
SELECT customer_key, customer_id, customer_name, city
FROM dim_customer
WHERE customer_id IN (17, 601) OR customer_key = -1
```

(Product, store and date dimensions would be built the same way. To keep this lesson short, fact_sales uses the source product and store numbers as their keys.)

## 5. Marts: one per audience

Marts are views over core, named for the team that uses them:

```sql
-- noviz
DROP VIEW IF EXISTS mart_finance_monthly;
DROP VIEW IF EXISTS mart_marketing_customers;
CREATE VIEW mart_finance_monthly AS
SELECT date_key / 100 AS year_month, COUNT(DISTINCT order_id) AS orders,
       ROUND(SUM(sales_amount), 2) AS sales
FROM fact_sales
GROUP BY date_key / 100;
CREATE VIEW mart_marketing_customers AS
SELECT c.customer_key, c.customer_name, c.loyalty_tier,
       COUNT(DISTINCT f.order_id) AS orders, ROUND(SUM(f.sales_amount), 2) AS lifetime_sales
FROM dim_customer c
JOIN fact_sales f ON f.customer_key = c.customer_key
WHERE c.customer_key <> -1
GROUP BY c.customer_key, c.customer_name, c.loyalty_tier;
SELECT * FROM mart_finance_monthly ORDER BY year_month DESC LIMIT 3
```

December 2025, with 294 orders and $9,136.62, is Northbay's busiest month. Because both marts read the same fact_sales, finance's yearly total and the sum of marketing's lifetime sales plus guests always agree.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the layers form a **directed acyclic graph** (DAG): arrows point from each model to the models built from it, and no path loops back. A DAG can always be built in order (sources, then staging, then core, then marts), and a change only affects models downstream of it.

**Equation:** for a source change at node v, the models to rebuild are exactly the descendants of v. If marts read only core, a staging fix reaches every mart through core: stg → core → {mart₁, mart₂}. If a mart reads staging directly, it has two paths with possibly different rules, and the two marts can disagree.

**Analogy:** a river with tributaries. Water flows downhill only. Pollute (or clean) a stream upstream, and everything below it changes; nothing upstream does.

**Try it:** you fix the city trimming in stg_customers. Which of these change: dim_customer, mart_marketing_customers, stg_orders? (The first two. stg_orders is not downstream.)
</details>

Watch it happen, one step at a time (any live box below has a **Show how it runs** button that animates the real query):

<div class="steps">
<div class="step"><b>Sources.</b> Raw tables from the shop database.</div>
<div class="step"><b>Staging.</b> <table class="lk-tbl"><tr><th>source</th><th>stg</th></tr><tr><td>cust_tbl</td><td><mark>stg_customers</mark></td></tr><tr><td>ord_tbl</td><td><mark>stg_orders</mark></td></tr></table> Rename and cast only.</div>
<div class="step"><b>Core.</b> <table class="lk-tbl"><tr><th>model</th><th>reads</th></tr><tr><td>dim_customer</td><td>stg_customers</td></tr><tr><td>fact_sales</td><td>stg_orders</td></tr></table></div>
<div class="step"><b>Marts.</b> <table class="lk-tbl"><tr><th>model</th><th>reads</th></tr><tr><td>mart_finance</td><td>fact_sales, dim_customer</td></tr><tr><td>mart_marketing</td><td>dim_customer</td></tr></table></div>
<div class="step"><b>One direction.</b> If stg_orders changes, only fact_sales and the marts downstream need checking.</div>
</div>

<div class="problem" data-problem="dm-layers-downstream"></div>

## 6. Worked example: does every layer read the right thing?

Views store their SQL, so the database can tell you what reads what. List each object with its layer, from its name prefix:

```sql
-- try
SELECT type, name,
       CASE WHEN name LIKE 'stg_%' THEN '1 staging'
            WHEN name LIKE 'dim_%' OR name LIKE 'fact_%' THEN '2 core'
            WHEN name LIKE 'mart_%' THEN '3 mart'
       END AS layer
FROM sqlite_master
WHERE name LIKE 'stg_%' OR name LIKE 'dim_%' OR name LIKE 'fact_%' OR name LIKE 'mart_%'
ORDER BY layer, name
```

Seven objects in three layers. Then check the rule on the marts: does any mart's SQL mention a staging model?

1. `SELECT name FROM sqlite_master WHERE name LIKE 'mart_%' AND sql LIKE '%stg%'` returns no rows: both marts read only core.
2. Totals agree across layers: staging has 7,310 lines, of which 7,112 belong to completed orders; fact_sales has 7,112 rows. Nothing was lost between staging and core.
3. Finance's 24 months add up to $126,579.09, the same as fact_sales.

In dbt the same graph comes from `ref()` calls, and tools draw it for you. The ETL course covers that tooling in [Module 5 (dbt)](/learn/courses/etl/dbt-basics/); this course sticks to the ideas.

## 7. Practice

```sql
-- exercise: Check the finance mart against core: return one row with the sum of sales in mart_finance_monthly and the sum in fact_sales, both rounded to 2 decimals.
-- hint: Two scalar subqueries in one SELECT.
SELECT SUM(sales) FROM mart_finance_monthly
-- answer:
SELECT (SELECT ROUND(SUM(sales), 2) FROM mart_finance_monthly) AS mart_sales,
       (SELECT ROUND(SUM(sales_amount), 2) FROM fact_sales) AS core_sales
```

```sql
-- exercise: From mart_marketing_customers, list the top 5 customers by lifetime_sales with their tier (ties by customer_key).
-- hint: ORDER BY lifetime_sales DESC, customer_key, then LIMIT 5.
SELECT customer_name, loyalty_tier, lifetime_sales
FROM mart_marketing_customers
LIMIT 5
-- answer:
SELECT customer_name, loyalty_tier, lifetime_sales
FROM mart_marketing_customers
ORDER BY lifetime_sales DESC, customer_key
LIMIT 5
```

```sql
-- exercise: How many order lines in staging belong to cancelled orders? (These are the ones core leaves out.)
-- hint: Join stg_order_items to stg_orders and filter status = 'cancelled'.
SELECT COUNT(*) AS lines
FROM stg_order_items
-- answer:
SELECT COUNT(*) AS lines
FROM stg_order_items i
JOIN stg_orders o ON o.order_id = i.order_id
WHERE o.status = 'cancelled'
```

<div class="keypoints">

- Staging tidies, core models, marts serve.
- Dependencies point one way; no loops, no skipping layers.
- Business logic lives in core and marts, never in staging.
- Each audience gets its own mart.

</div>

**New words:** *staging*, *core*, *data mart*, *intermediate layer*, *directed acyclic graph (DAG)*, *downstream*.
