---
title: 'Capstone part 2: build, load and test it'
seoTitle: 'Build a star schema data warehouse in SQL: full project'
summary: 'Build the whole Northbay warehouse in your browser: DDL for six dimensions and three fact tables, staging views, dimension loads, an SCD type 2 customer history, fact loads with point-in-time key lookups, a load log and a full test suite, then answer business questions from it.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: When fact_sales looks up customer_key in an SCD2 dim_customer, what must the join include besides customer_id?
    choices: ['Nothing else', 'The order date falling between the version''s valid_from and valid_to', 'is_current = 1 only']
    ans: 1
    why: Joining on is_current = 1 would give every old sale today's customer version. The date range picks the version that was true on the day of the sale.
  - q: Why does the store-day snapshot cross join every store with every date before adding sales?
    choices: ['To make the table bigger', 'So days with no sales still get a row with zeros, as a periodic snapshot promises', 'Cross joins are faster']
    ans: 1
    why: A periodic snapshot has one row per period per thing, whether or not anything happened. Missing rows would make averages per day wrong.
  - q: The test suite says the sum of fact_store_daily sales equals the sum of fact_sales. What does that prove?
    choices: ['Nothing useful', 'Two different load paths agree, so neither lost nor doubled sales', 'The dashboard is pretty']
    ans: 1
    why: Reconciling two facts built different ways is a strong check. If one load dropped or doubled rows, the totals would differ.
sources:
  - 'The Kimball Group, Dimensional Modeling Techniques https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/'
  - 'SQLite documentation, SQL language reference https://www.sqlite.org/lang.html'
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley, chapters 3 and 5 (retail star and slowly changing dimensions)'
---

**Module 8 · about 35 minutes · read first: 8.1.** You'll be able to build a complete star schema warehouse from DDL to tests, load an SCD type 2 dimension and look up its keys by date, and prove the result with a test suite. This is part 2 of the **Northbay warehouse** project; it builds what [part 1](/learn/courses/data-modelling/capstone-design/) designed.

<div class="bigidea">Build the warehouse as numbered scripts (DDL, staging, dimensions, customer history, facts, tests) that can be run again from the top.</div>

**In everyday terms:** building from a flat-pack kit. The steps are numbered, you do them in order, and a final check confirms nothing is left over.

## 1. Why this matters

Design documents show you can think; a build shows you can deliver. Everything here runs in your browser, in order, top to bottom. Each block is also the file you will put in your repo: `01_ddl.sql`, `02_staging.sql` and so on. In [part 3](/learn/courses/data-modelling/capstone-cloud/) you run the same files on a real database.

Run the blocks **in order**. If anything goes wrong, press **Reset database** and start again from the top.

<div class="meaning">

<dl>
<dt>Load script</dt><dd>A SQL file that creates or fills part of the warehouse.</dd>
<dt>Point-in-time join</dt><dd>Looking up the dimension version valid on the fact date.</dd>
<dt>Test suite</dt><dd>All the checks in one script.</dd>
<dt>Physical meaning</dt><dd>The scripts create the tables from the design, fill them, and then verify the row counts, keys and totals.</dd>
</dl>

</div>

<div class="myth">

**"Once the tables exist, the work is done."** Without tests you cannot prove the totals match the source. The last script checks them.

</div>

## 2. Step 1: DDL (01_ddl.sql)

Every table, with its keys. Dimensions get an `INTEGER PRIMARY KEY` surrogate key; facts get a primary key at their grain.

```sql
-- noviz
DROP TABLE IF EXISTS fact_sales;
DROP TABLE IF EXISTS fact_returns;
DROP TABLE IF EXISTS fact_store_daily;
DROP TABLE IF EXISTS dim_date;
DROP TABLE IF EXISTS dim_product;
DROP TABLE IF EXISTS dim_store;
DROP TABLE IF EXISTS dim_customer;
DROP TABLE IF EXISTS dim_promotion;
DROP TABLE IF EXISTS dim_return_reason;
DROP TABLE IF EXISTS load_log;
CREATE TABLE dim_date (date_key INTEGER PRIMARY KEY, full_date TEXT NOT NULL UNIQUE, year INTEGER,
  quarter INTEGER, month INTEGER, month_name TEXT, day_name TEXT, is_weekend INTEGER);
CREATE TABLE dim_product (product_key INTEGER PRIMARY KEY, product_id INTEGER UNIQUE, product_name TEXT,
  brand TEXT, category TEXT, department TEXT, list_price REAL, unit_cost REAL);
CREATE TABLE dim_store (store_key INTEGER PRIMARY KEY, store_id INTEGER UNIQUE, store_name TEXT,
  city TEXT, province TEXT, region TEXT, channel TEXT);
CREATE TABLE dim_customer (customer_key INTEGER PRIMARY KEY, customer_id INTEGER, customer_name TEXT,
  city TEXT, province TEXT, loyalty_tier TEXT, party_email TEXT,
  valid_from TEXT, valid_to TEXT, is_current INTEGER, UNIQUE (customer_id, valid_from));
CREATE TABLE dim_promotion (promotion_key INTEGER PRIMARY KEY, promo_id INTEGER UNIQUE, promo_name TEXT,
  discount REAL, start_date TEXT, end_date TEXT);
CREATE TABLE dim_return_reason (return_reason_key INTEGER PRIMARY KEY, reason TEXT UNIQUE, reason_group TEXT);
CREATE TABLE fact_sales (order_id INTEGER, date_key INTEGER, product_key INTEGER, store_key INTEGER,
  customer_key INTEGER, promotion_key INTEGER, quantity INTEGER, gross_amount REAL,
  discount_amount REAL, sales_amount REAL, cost_amount REAL, load_id INTEGER,
  PRIMARY KEY (order_id, product_key));
CREATE TABLE fact_returns (return_id INTEGER PRIMARY KEY, order_id INTEGER, order_date_key INTEGER,
  return_date_key INTEGER, product_key INTEGER, store_key INTEGER, customer_key INTEGER,
  return_reason_key INTEGER, returned_quantity INTEGER, refund_amount REAL, load_id INTEGER);
CREATE TABLE fact_store_daily (date_key INTEGER, store_key INTEGER, orders INTEGER, cancelled_orders INTEGER,
  lines INTEGER, sales_amount REAL, load_id INTEGER, PRIMARY KEY (date_key, store_key));
CREATE TABLE load_log (load_id INTEGER PRIMARY KEY, step TEXT, rows_loaded INTEGER, loaded_at TEXT);
SELECT COUNT(*) AS tables_created FROM sqlite_master
WHERE type = 'table' AND (name LIKE 'dim_%' OR name LIKE 'fact_%' OR name = 'load_log')
```

Ten tables. In SQL Server you would write `INT IDENTITY(1,1)` for the surrogate keys and `DECIMAL(12,2)` for money; in PostgreSQL `INT GENERATED ALWAYS AS IDENTITY` and `NUMERIC(12,2)`.

## 3. Step 2: staging (02_staging.sql)

One view per source table: rename, trim, fix case, handle NULLs, compute the line value once.

```sql
-- noviz
DROP VIEW IF EXISTS stg_customers;
DROP VIEW IF EXISTS stg_orders;
DROP VIEW IF EXISTS stg_order_lines;
DROP VIEW IF EXISTS stg_returns;
CREATE VIEW stg_customers AS
SELECT customer_id, first_name || ' ' || last_name AS customer_name, trim(city) AS city, province,
       COALESCE(loyalty_tier, 'None') AS loyalty_tier, lower(email) AS party_email
FROM customers;
CREATE VIEW stg_orders AS
SELECT order_id, customer_id, store_id, order_date, channel, lower(status) AS status, promo_id
FROM orders;
CREATE VIEW stg_order_lines AS
SELECT order_id, product_id, quantity, unit_price, discount,
       ROUND(quantity * unit_price, 2) AS gross_amount,
       ROUND(quantity * unit_price * (1 - discount), 2) AS line_amount
FROM order_items;
CREATE VIEW stg_returns AS
SELECT return_id, order_id, product_id, return_date, trim(reason) AS reason FROM returns;
SELECT (SELECT COUNT(*) FROM stg_customers) AS customers, (SELECT COUNT(*) FROM stg_orders) AS orders,
       (SELECT COUNT(*) FROM stg_order_lines) AS lines, (SELECT COUNT(*) FROM stg_returns) AS returns
```

## 4. Step 3: the simple dimensions (03_dimensions.sql)

Date from a recursive CTE, the rest from staging and the clean source tables. Every load writes a line to load_log, and each dimension then gets its -1 row. (Inserting the -1 row last keeps the real surrogate keys starting at 1: SQLite numbers a new row one above the current highest key.)

```sql
-- noviz
INSERT INTO dim_date
WITH RECURSIVE d(day) AS (SELECT '2024-01-01' UNION ALL SELECT date(day, '+1 day') FROM d WHERE day < '2025-12-31')
SELECT CAST(replace(day, '-', '') AS INTEGER), day,
       CAST(strftime('%Y', day) AS INTEGER),
       (CAST(strftime('%m', day) AS INTEGER) + 2) / 3,
       CAST(strftime('%m', day) AS INTEGER),
       substr('JanFebMarAprMayJunJulAugSepOctNovDec', CAST(strftime('%m', day) AS INTEGER) * 3 - 2, 3),
       substr('SunMonTueWedThuFriSat', CAST(strftime('%w', day) AS INTEGER) * 3 + 1, 3),
       CASE WHEN strftime('%w', day) IN ('0', '6') THEN 1 ELSE 0 END
FROM d;
INSERT INTO load_log (step, rows_loaded, loaded_at) VALUES ('dim_date', changes(), '2026-01-01 02:00');

INSERT INTO dim_product (product_id, product_name, brand, category, department, list_price, unit_cost)
SELECT p.product_id, p.product_name, p.brand, c.category_name, c.department, p.unit_price, p.unit_cost
FROM products p JOIN categories c ON c.category_id = p.category_id
ORDER BY c.department, c.category_name, p.product_name;
INSERT INTO load_log (step, rows_loaded, loaded_at) VALUES ('dim_product', changes(), '2026-01-01 02:00');
INSERT INTO dim_product VALUES (-1, NULL, 'Unknown', 'Unknown', 'Unknown', 'Unknown', NULL, NULL);

INSERT INTO dim_store (store_id, store_name, city, province, region, channel)
SELECT s.store_id, s.store_name, COALESCE(s.city, 'Online'), COALESCE(s.province, 'Online'),
       COALESCE(r.region_name, 'Online'), CASE WHEN s.store_id = 12 THEN 'Online' ELSE 'Store' END
FROM stores s LEFT JOIN regions r ON r.region_id = s.region_id
ORDER BY s.store_id;
INSERT INTO load_log (step, rows_loaded, loaded_at) VALUES ('dim_store', changes(), '2026-01-01 02:00');
INSERT INTO dim_store VALUES (-1, NULL, 'Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown');

INSERT INTO dim_promotion (promo_id, promo_name, discount, start_date, end_date)
SELECT promo_id, promo_name, discount, start_date, end_date FROM promotions ORDER BY promo_id;
INSERT INTO load_log (step, rows_loaded, loaded_at) VALUES ('dim_promotion', changes(), '2026-01-01 02:00');
INSERT INTO dim_promotion VALUES (-1, NULL, 'No promotion', 0, NULL, NULL);

INSERT INTO dim_return_reason (reason, reason_group)
SELECT DISTINCT reason,
       CASE WHEN reason IN ('Damaged', 'Not as described') THEN 'Product problem'
            WHEN reason = 'Arrived late' THEN 'Delivery'
            ELSE 'Customer choice' END
FROM stg_returns ORDER BY reason;
INSERT INTO load_log (step, rows_loaded, loaded_at) VALUES ('dim_return_reason', changes(), '2026-01-01 02:00');
INSERT INTO dim_return_reason VALUES (-1, 'Unknown', 'Unknown');
SELECT step, rows_loaded FROM load_log ORDER BY load_id
```

731 dates, 61 products, 12 stores, 7 promotions and 5 reasons, each plus its -1 row (added after the count was logged).

## 5. Step 4: customer history, SCD type 2 (04_dim_customer.sql)

First load: one version per customer, valid from 1900-01-01 (the profile showed 596 orders dated before the customer's sign-up date, so joined_on cannot be the start) to 9999-12-31.

```sql
-- noviz
INSERT INTO dim_customer (customer_id, customer_name, city, province, loyalty_tier, party_email, valid_from, valid_to, is_current)
SELECT customer_id, customer_name, city, province, loyalty_tier, party_email, '1900-01-01', '9999-12-31', 1
FROM stg_customers ORDER BY customer_id;
INSERT INTO load_log (step, rows_loaded, loaded_at) VALUES ('dim_customer initial', changes(), '2026-01-01 02:00');
INSERT INTO dim_customer VALUES (-1, NULL, 'Guest', 'Unknown', 'Unknown', 'Unknown', NULL, '1900-01-01', '9999-12-31', 1);
SELECT COUNT(*) AS customer_rows FROM dim_customer
```

On 1 July 2025 the CRM sends a new snapshot. Every customer whose number is a multiple of 20 moved up a tier, and six customers moved to Toronto. Make that snapshot, then apply SCD2: expire the changed current rows, then insert their new versions.

```sql
-- noviz
DROP TABLE IF EXISTS stg_customers_20250701;
CREATE TABLE stg_customers_20250701 AS SELECT * FROM stg_customers;
UPDATE stg_customers_20250701
SET loyalty_tier = CASE loyalty_tier WHEN 'Bronze' THEN 'Silver' WHEN 'Silver' THEN 'Gold'
                                     WHEN 'None' THEN 'Bronze' ELSE loyalty_tier END
WHERE customer_id % 20 = 0;
UPDATE stg_customers_20250701 SET city = 'Toronto', province = 'ON' WHERE customer_id % 97 = 0;

DROP TABLE IF EXISTS changed_customers;
CREATE TABLE changed_customers AS
SELECT s.* FROM stg_customers_20250701 s
JOIN dim_customer d ON d.customer_id = s.customer_id AND d.is_current = 1
WHERE s.city IS NOT d.city OR s.province IS NOT d.province OR s.loyalty_tier IS NOT d.loyalty_tier;

UPDATE dim_customer SET valid_to = '2025-06-30', is_current = 0
WHERE is_current = 1 AND customer_id IN (SELECT customer_id FROM changed_customers);

INSERT INTO dim_customer (customer_id, customer_name, city, province, loyalty_tier, party_email, valid_from, valid_to, is_current)
SELECT customer_id, customer_name, city, province, loyalty_tier, party_email, '2025-07-01', '9999-12-31', 1
FROM changed_customers;
INSERT INTO load_log (step, rows_loaded, loaded_at) VALUES ('dim_customer scd2 2025-07-01', changes(), '2026-01-01 02:00');
SELECT (SELECT COUNT(*) FROM changed_customers) AS changed, COUNT(*) AS customer_rows,
       SUM(is_current) AS current_rows
FROM dim_customer
```

34 customers changed (two of the multiples of 20 were already Gold, so they didn't). dim_customer now has 638 rows, of which 604 are current: one per customer plus Guest. Look at one customer's history:

```sql
-- try
SELECT customer_key, customer_id, city, loyalty_tier, valid_from, valid_to, is_current
FROM dim_customer
WHERE customer_id IN (40, 97)
ORDER BY customer_id, valid_from
```

## 6. Step 5: the fact tables (05_facts.sql)

Each fact looks up every key through its dimension. The customer lookup uses the **order date** to pick the version valid that day, and anything not found falls back to -1.

```sql
-- noviz
INSERT INTO fact_sales
SELECT o.order_id, d.date_key, p.product_key, COALESCE(s.store_key, -1), COALESCE(c.customer_key, -1),
       COALESCE(pr.promotion_key, -1), l.quantity, l.gross_amount,
       ROUND(l.gross_amount - l.line_amount, 2), l.line_amount,
       ROUND(l.quantity * p.unit_cost, 2), 1
FROM stg_orders o
JOIN stg_order_lines l   ON l.order_id = o.order_id
JOIN dim_date d          ON d.full_date = o.order_date
JOIN dim_product p       ON p.product_id = l.product_id
LEFT JOIN dim_store s    ON s.store_id = o.store_id
LEFT JOIN dim_customer c ON c.customer_id = o.customer_id
                        AND o.order_date BETWEEN c.valid_from AND c.valid_to
LEFT JOIN dim_promotion pr ON pr.promo_id = o.promo_id
WHERE o.status = 'completed';
INSERT INTO load_log (step, rows_loaded, loaded_at) VALUES ('fact_sales', changes(), '2026-01-01 02:05');

INSERT INTO fact_returns
SELECT r.return_id, r.order_id, od.date_key, rd.date_key, p.product_key, COALESCE(s.store_key, -1),
       COALESCE(c.customer_key, -1), COALESCE(rr.return_reason_key, -1), l.quantity, l.line_amount, 2
FROM stg_returns r
JOIN stg_orders o        ON o.order_id = r.order_id
JOIN stg_order_lines l   ON l.order_id = r.order_id AND l.product_id = r.product_id
JOIN dim_date od         ON od.full_date = o.order_date
JOIN dim_date rd         ON rd.full_date = r.return_date
JOIN dim_product p       ON p.product_id = r.product_id
LEFT JOIN dim_store s    ON s.store_id = o.store_id
LEFT JOIN dim_customer c ON c.customer_id = o.customer_id
                        AND o.order_date BETWEEN c.valid_from AND c.valid_to
LEFT JOIN dim_return_reason rr ON rr.reason = r.reason;
INSERT INTO load_log (step, rows_loaded, loaded_at) VALUES ('fact_returns', changes(), '2026-01-01 02:05');

INSERT INTO fact_store_daily
WITH per_order AS (
  SELECT o.order_id, o.order_date, o.store_id, o.status, COUNT(*) AS lines, SUM(l.line_amount) AS sales
  FROM stg_orders o JOIN stg_order_lines l ON l.order_id = o.order_id
  GROUP BY o.order_id, o.order_date, o.store_id, o.status
), per_day AS (
  SELECT order_date, store_id,
         SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS orders,
         SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled,
         SUM(CASE WHEN status = 'completed' THEN lines ELSE 0 END) AS lines,
         SUM(CASE WHEN status = 'completed' THEN sales ELSE 0 END) AS sales
  FROM per_order GROUP BY order_date, store_id
)
SELECT d.date_key, s.store_key, COALESCE(a.orders, 0), COALESCE(a.cancelled, 0),
       COALESCE(a.lines, 0), ROUND(COALESCE(a.sales, 0), 2), 3
FROM dim_date d
CROSS JOIN dim_store s
LEFT JOIN per_day a ON a.order_date = d.full_date AND a.store_id = s.store_id
WHERE s.store_key <> -1;
INSERT INTO load_log (step, rows_loaded, loaded_at) VALUES ('fact_store_daily', changes(), '2026-01-01 02:05');
SELECT step, rows_loaded FROM load_log WHERE step LIKE 'fact_%' ORDER BY load_id
```

7,112 sales lines, 204 returns and 8,772 store-days (12 stores × 731 days, including days with no orders).

## 7. Step 6: the test suite (06_tests.sql)

Every test from [Lesson 7.4](/learn/courses/data-modelling/testing/), plus two for SCD2: exactly one current row per customer, and no version that ends before it starts.

```sql
-- noviz
DROP VIEW IF EXISTS test_results;
CREATE VIEW test_results AS
WITH t(test, failures) AS (
  SELECT 'unique dim_product.product_id', (SELECT COUNT(*) - COUNT(DISTINCT product_id) FROM dim_product WHERE product_id IS NOT NULL)
  UNION ALL SELECT 'one current row per customer',
    (SELECT COUNT(*) FROM (SELECT customer_id FROM dim_customer WHERE is_current = 1 AND customer_id IS NOT NULL
                           GROUP BY customer_id HAVING COUNT(*) <> 1))
  UNION ALL SELECT 'scd2 valid_from <= valid_to', (SELECT COUNT(*) FROM dim_customer WHERE valid_from > valid_to)
  UNION ALL SELECT 'no null keys in fact_sales',
    (SELECT COUNT(*) FROM fact_sales WHERE date_key IS NULL OR product_key IS NULL OR store_key IS NULL
                                        OR customer_key IS NULL OR promotion_key IS NULL)
  UNION ALL SELECT 'orphans fact_sales -> dim_customer',
    (SELECT COUNT(*) FROM fact_sales f LEFT JOIN dim_customer c ON c.customer_key = f.customer_key WHERE c.customer_key IS NULL)
  UNION ALL SELECT 'orphans fact_returns -> dim_date (return)',
    (SELECT COUNT(*) FROM fact_returns f LEFT JOIN dim_date d ON d.date_key = f.return_date_key WHERE d.date_key IS NULL)
  UNION ALL SELECT 'accepted dim_customer.loyalty_tier',
    (SELECT COUNT(*) FROM dim_customer WHERE loyalty_tier NOT IN ('Bronze', 'Silver', 'Gold', 'None', 'Unknown'))
  UNION ALL SELECT 'reconcile fact_sales rows = completed lines',
    ABS((SELECT COUNT(*) FROM fact_sales) - (SELECT COUNT(*) FROM stg_order_lines l JOIN stg_orders o
         ON o.order_id = l.order_id WHERE o.status = 'completed'))
  UNION ALL SELECT 'reconcile fact_returns rows = source returns',
    ABS((SELECT COUNT(*) FROM fact_returns) - (SELECT COUNT(*) FROM returns))
  UNION ALL SELECT 'reconcile store_daily sales = fact_sales (cents)',
    ABS(ROUND(((SELECT SUM(sales_amount) FROM fact_store_daily) - (SELECT SUM(sales_amount) FROM fact_sales)) * 100))
  UNION ALL SELECT 'store_daily has every store-day',
    ABS((SELECT COUNT(*) FROM fact_store_daily) - (SELECT COUNT(*) FROM dim_date) * (SELECT COUNT(*) FROM dim_store WHERE store_key <> -1))
)
SELECT test, failures, CASE WHEN failures = 0 THEN 'PASS' ELSE 'FAIL' END AS result FROM t;
SELECT * FROM test_results
```

Eleven tests, all PASS. Keep this view in your repo: it is the first thing a reviewer will run.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** the SCD2 lookup is a **point-in-time join**. For each customer, the versions' date ranges [valid_from, valid_to] **partition** the time line: they don't overlap and leave no gaps. So for any order date there is exactly one matching version, and the join maps each fact row to one dimension row.

**Equation:** for customer c with versions v₁ = [1900-01-01, 2025-06-30] and v₂ = [2025-07-01, 9999-12-31], an order on date t matches v₁ if t ≤ 2025-06-30 and v₂ otherwise. Gaps would give 0 matches (the fact falls to -1); overlaps would give 2 (the fact is doubled). The "one current row" and "valid_from ≤ valid_to" tests guard this; a full check also compares each version's valid_to with the next version's valid_from.

**Analogy:** a passport history. On any date, exactly one passport was valid. To know which one a traveller used, you look at the date stamped in the passport, not at the one in their pocket today.

**Try it:** a customer has three versions, changing on 1 March and 1 September. An order on 15 August matches which version? (The second.)
</details>

Watch it happen, one step at a time (any live box below has a **Show how it runs** button that animates the real query):

<div class="steps">
<div class="step"><b>01_ddl.</b> Create empty dimension and fact tables with keys.</div>
<div class="step"><b>02_staging.</b> Copy the source into tidy staging tables.</div>
<div class="step"><b>03_dimensions.</b> Fill dim_product, dim_store and dim_date.</div>
<div class="step"><b>04_dim_customer.</b> <table class="lk-tbl"><tr><th>key</th><th>cust</th><th>city</th><th>from</th></tr><tr><td>1</td><td>Asha</td><td>Toronto</td><td>2024-01-01</td></tr><tr><td><mark>2</mark></td><td>Asha</td><td><mark>Ottawa</mark></td><td><mark>2025-03-01</mark></td></tr></table> Type 2 history.</div>
<div class="step"><b>05_facts and 06_tests.</b> Look up each key by date, load facts, then run the tests. All zeros means pass.</div>
</div>

<div class="problem" data-problem="dm-key-version"></div>

## 8. Worked example: questions the warehouse can answer

**As it was vs as it is.** How much did customers who are Gold *today* spend, against how much was spent *while* customers were Gold?

```sql
-- try
SELECT c.loyalty_tier AS tier_at_time_of_sale,
       ROUND(SUM(f.sales_amount), 2) AS sales_as_it_was
FROM fact_sales f
JOIN dim_customer c ON c.customer_key = f.customer_key
WHERE c.customer_key <> -1
GROUP BY c.loyalty_tier
ORDER BY c.loyalty_tier
```

Gold customers spent $11,148.56 while they were Gold. To report "as it is", go from the fact's version to the customer's current version:

```sql
-- try
SELECT cur.loyalty_tier AS tier_today,
       ROUND(SUM(f.sales_amount), 2) AS sales_as_it_is
FROM fact_sales f
JOIN dim_customer v   ON v.customer_key = f.customer_key
JOIN dim_customer cur ON cur.customer_id = v.customer_id AND cur.is_current = 1
WHERE f.customer_key <> -1
GROUP BY cur.loyalty_tier
ORDER BY cur.loyalty_tier
```

Customers who are Gold today spent $12,187.25 in total, more than that, because the customers promoted in July bring their earlier Silver-tier sales with them. The two answers differ only by the sales of the 34 customers who changed, and only for sales before July 2025. The warehouse can give either answer; the design document says which one each report uses.

**Returns rate by department**, using two facts through the conformed product dimension:

```sql
-- try
WITH sold AS (
  SELECT p.department, SUM(f.sales_amount) AS sales
  FROM fact_sales f JOIN dim_product p ON p.product_key = f.product_key
  GROUP BY p.department
), back AS (
  SELECT p.department, SUM(r.refund_amount) AS refunds
  FROM fact_returns r JOIN dim_product p ON p.product_key = r.product_key
  GROUP BY p.department
)
SELECT s.department, ROUND(s.sales, 2) AS sales, ROUND(COALESCE(b.refunds, 0), 2) AS refunds,
       ROUND(100.0 * COALESCE(b.refunds, 0) / s.sales, 1) AS refund_pct
FROM sold s LEFT JOIN back b ON b.department = s.department
ORDER BY refund_pct DESC
```

Notice the pattern: aggregate each fact to the shared dimension first, then join the summaries. Joining two facts row to row would fan out ([Lesson 4.3](/learn/courses/data-modelling/conformed-dimensions/)).

## 9. Practice

```sql
-- exercise: Using fact_store_daily and dim_store, show each store's average completed orders per day over the two years, highest first (2 decimals).
-- hint: AVG(orders) grouped by store_name. The snapshot has a row for every day, so AVG is per calendar day.
SELECT s.store_name, f.orders
FROM fact_store_daily f
JOIN dim_store s ON s.store_key = f.store_key
-- answer:
SELECT s.store_name, ROUND(AVG(f.orders), 2) AS avg_orders_per_day
FROM fact_store_daily f
JOIN dim_store s ON s.store_key = f.store_key
GROUP BY s.store_name
ORDER BY avg_orders_per_day DESC
```

```sql
-- exercise: How much was sold under each promotion? Show promo_name and sales, including 'No promotion', biggest first.
-- hint: JOIN fact_sales to dim_promotion on promotion_key and GROUP BY promo_name.
SELECT promotion_key, SUM(sales_amount) AS sales
FROM fact_sales
GROUP BY promotion_key
-- answer:
SELECT p.promo_name, ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_promotion p ON p.promotion_key = f.promotion_key
GROUP BY p.promo_name
ORDER BY sales DESC
```

```sql
-- exercise: Gross margin by department for 2025: sales, cost and margin percentage (100 × (sales − cost) ÷ sales, 1 decimal), highest margin first.
-- hint: Join dim_product and dim_date, WHERE year = 2025, then SUM(sales_amount) and SUM(cost_amount).
SELECT p.department, SUM(f.sales_amount) AS sales
FROM fact_sales f
JOIN dim_product p ON p.product_key = f.product_key
GROUP BY p.department
-- answer:
SELECT p.department, ROUND(SUM(f.sales_amount), 2) AS sales, ROUND(SUM(f.cost_amount), 2) AS cost,
       ROUND(100.0 * (SUM(f.sales_amount) - SUM(f.cost_amount)) / SUM(f.sales_amount), 1) AS margin_pct
FROM fact_sales f
JOIN dim_product p ON p.product_key = f.product_key
JOIN dim_date d ON d.date_key = f.date_key
WHERE d.year = 2025
GROUP BY p.department
ORDER BY margin_pct DESC
```

<div class="keypoints">

- One numbered script per step; run them in order.
- Customer keys are looked up by the order date.
- Tests prove the warehouse matches the source.
- Anyone should be able to rebuild from scratch.

</div>

**New words:** *point-in-time join*, *load script*, *test suite*.
