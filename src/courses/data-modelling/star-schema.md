---
title: 'The star schema'
seoTitle: 'Star schema explained: build one in SQL step by step'
summary: 'Build Northbay''s first star schema in your browser: a date, product, store and customer dimension, and a fact_sales table at order-line grain, all with CREATE TABLE AS SELECT. Then answer questions with one join per dimension.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: What sits in the middle of a star schema?
    choices: ['A fact table with one foreign key per dimension and the measures', 'The biggest dimension', 'A view of every table joined']
    ans: 0
    why: The fact table holds the numbers at the declared grain and a key to each dimension around it.
  - q: Why does dim_customer get an extra row with customer_key 0 for guests?
    choices: ['So every fact row finds a customer and inner joins never drop guest sales', 'To make the table bigger', 'Because keys must start at 0']
    ans: 0
    why: A fact row with a missing key would vanish from inner joins. An "unknown" or "guest" member row keeps every sale in every report.
  - q: How many joins does a star-schema query need to use four dimensions?
    choices: ['Four, one from the fact table to each dimension', 'Ten', 'None']
    ans: 0
    why: Each dimension is one hop from the fact table. Snowflaked designs need more hops; the star keeps it to one each.
sources:
  - 'Microsoft Learn, Power BI guidance: Understand star schema and the importance for Power BI https://learn.microsoft.com/en-us/power-bi/guidance/star-schema'
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley, Chapter 3: Retail Sales'
  - 'Kimball Group, Dimensional modeling techniques https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/'
---

**Module 2 · about 35 minutes · read first: 2.3.** You'll be able to build dimension and fact tables from normalised sources with CREATE TABLE AS SELECT, add an unknown-member row, check the star for orphans, and query it with one join per dimension.

<div class="bigidea">A star schema keeps the numbers in one long fact table and the descriptions in a few wide dimension tables, each one join away.</div>

**In everyday terms:** a sports league table and the team cards. The league table is a list of matches with just team numbers and scores; each team card says the team's name, city and colours. To make a report you look up each number on its card.

## 1. Why this matters

The star schema is the shape behind most BI tools. Power BI's own guidance recommends it, dbt projects end in it, and interviewers ask you to sketch one. It sits between the 3NF source (many joins) and one wide table (lots of repetition): the numbers live in one long, narrow fact table, and the words live in a few wide dimension tables, each one join away.

## 2. The design

Following the four steps from [Lesson 2.1](/learn/courses/data-modelling/business-process/): process *selling*; grain *one row per product on a completed order*; dimensions *date, product, store, customer*; facts *quantity, sales amount, cost amount*.

<!--fig:star-schema-->

Every lesson's boxes share one database, so run the blocks below in order. Each starts with `DROP TABLE IF EXISTS`, so you can run them again safely.

## 3. The date dimension

Dates get their own dimension so reports can group by month, quarter, weekday or holiday without date functions. We need one row per calendar day, even days with no sales, so we generate the days with a recursive CTE rather than taking them from `orders`.

```sql
-- try
-- noviz
DROP TABLE IF EXISTS dim_date;
CREATE TABLE dim_date AS
WITH RECURSIVE days(full_date) AS (
  SELECT '2024-01-01'
  UNION ALL
  SELECT date(full_date, '+1 day') FROM days WHERE full_date < '2025-12-31'
)
SELECT CAST(strftime('%Y%m%d', full_date) AS INTEGER) AS date_key,
       full_date,
       CAST(strftime('%Y', full_date) AS INTEGER) AS year,
       (CAST(strftime('%m', full_date) AS INTEGER) + 2) / 3 AS quarter,
       CAST(strftime('%m', full_date) AS INTEGER) AS month,
       substr('JanFebMarAprMayJunJulAugSepOctNovDec', 3 * CAST(strftime('%m', full_date) AS INTEGER) - 2, 3) AS month_name,
       substr('SunMonTueWedThuFriSat', 3 * CAST(strftime('%w', full_date) AS INTEGER) + 1, 3) AS day_name,
       CASE WHEN strftime('%w', full_date) IN ('0', '6') THEN 1 ELSE 0 END AS is_weekend
FROM days;
SELECT * FROM dim_date WHERE full_date BETWEEN '2024-12-23' AND '2024-12-29';
```

The key `date_key` is the date written as a number, 20241225 for Christmas Day. It's readable and sorts correctly. [Lesson 4.2](/learn/courses/data-modelling/date-dimension/) adds holidays, fiscal years and more.

## 4. The product and store dimensions

Each dimension flattens its little 3NF family into one wide table. Product takes its category and department along; store takes its region, and the online store's blanks are filled in once, here, for everyone.

```sql
-- try
-- noviz
DROP TABLE IF EXISTS dim_product;
CREATE TABLE dim_product AS
SELECT p.product_id AS product_key, p.product_name, p.brand,
       c.category_name AS category, c.department
FROM products p
JOIN categories c ON c.category_id = p.category_id;
DROP TABLE IF EXISTS dim_store;
CREATE TABLE dim_store AS
SELECT s.store_id AS store_key, s.store_name,
       COALESCE(s.city, 'Online') AS city,
       COALESCE(s.province, 'n/a') AS province,
       COALESCE(r.region_name, 'Online') AS region,
       CASE WHEN s.store_id = 12 THEN 'online' ELSE 'store' END AS channel
FROM stores s
LEFT JOIN regions r ON r.region_id = s.region_id;
SELECT * FROM dim_store;
```

(Here the dimension keys simply reuse the source ids. Real warehouses give dimensions their own *surrogate keys*; [Lesson 4.1](/learn/courses/data-modelling/surrogate-keys/) explains why.)

## 5. The customer dimension, with a row for guests

482 orders have no customer. If fact rows carried a NULL customer key, every inner join to the customer dimension would silently drop them. The fix is an *unknown member*: one extra dimension row, here key 0, labelled "Guest". The source's stray spaces in city and blank tiers are cleaned on the way in.

```sql
-- try
-- noviz
DROP TABLE IF EXISTS dim_customer;
CREATE TABLE dim_customer AS
SELECT customer_id AS customer_key,
       first_name || ' ' || last_name AS full_name,
       TRIM(city) AS city, province,
       COALESCE(loyalty_tier, 'Unknown') AS loyalty_tier,
       joined_on
FROM customers
UNION ALL
SELECT 0, 'Guest', 'Unknown', 'n/a', 'Guest', NULL;
SELECT * FROM dim_customer WHERE customer_key IN (0, 1, 2);
```

## 6. The fact table

Now the middle of the star: one row per completed order line, a key to each dimension, the order number as a label, and three additive facts.

```sql
-- try
-- noviz
DROP TABLE IF EXISTS fact_sales;
CREATE TABLE fact_sales AS
SELECT CAST(strftime('%Y%m%d', o.order_date) AS INTEGER) AS date_key,
       i.product_id AS product_key,
       o.store_id AS store_key,
       COALESCE(o.customer_id, 0) AS customer_key,
       i.order_id,
       i.quantity,
       ROUND(i.quantity * i.unit_price * (1 - i.discount), 2) AS sales_amount,
       ROUND(i.quantity * p.unit_cost, 2) AS cost_amount
FROM order_items i
JOIN orders o ON o.order_id = i.order_id
JOIN products p ON p.product_id = i.product_id
WHERE o.status = 'completed';
SELECT COUNT(*) AS fact_rows, ROUND(SUM(sales_amount), 2) AS sales FROM fact_sales;
```

7,112 rows worth $126,579.09: one per completed order line, as the grain promised.

## 7. Check the star

Two checks every load should pass. First, the grain: one row per order line. Second, no *orphans*: every foreign key in the fact table finds its dimension row.

```sql
-- try
SELECT
  (SELECT COUNT(*) FROM (SELECT order_id, product_key FROM fact_sales GROUP BY order_id, product_key HAVING COUNT(*) > 1)) AS grain_breaks,
  (SELECT COUNT(*) FROM fact_sales f LEFT JOIN dim_date d ON d.date_key = f.date_key WHERE d.date_key IS NULL) AS no_date,
  (SELECT COUNT(*) FROM fact_sales f LEFT JOIN dim_product p ON p.product_key = f.product_key WHERE p.product_key IS NULL) AS no_product,
  (SELECT COUNT(*) FROM fact_sales f LEFT JOIN dim_store s ON s.store_key = f.store_key WHERE s.store_key IS NULL) AS no_store,
  (SELECT COUNT(*) FROM fact_sales f LEFT JOIN dim_customer c ON c.customer_key = f.customer_key WHERE c.customer_key IS NULL) AS no_customer
```

All zeros. Thanks to the Guest row, even the guest sales have a customer.

## 8. Query the star

Every question now has the same shape: start at the fact table, join the dimensions you need, filter and group by their words, sum the facts. Press **Show how it runs** to watch the four joins, each one a simple lookup that keeps the row count.

```sql
-- try
SELECT d.year, s.region, p.department, ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_date d ON d.date_key = f.date_key
JOIN dim_store s ON s.store_key = f.store_key
JOIN dim_product p ON p.product_key = f.product_key
JOIN dim_customer c ON c.customer_key = f.customer_key
WHERE c.loyalty_tier = 'Gold'
GROUP BY d.year, s.region, p.department
ORDER BY d.year, sales DESC
LIMIT 10
```

<div class="meaning">

<dl>
<dt>Fact table</dt><dd>The middle of the star: one row per event, a key to each dimension, and the measures.</dd>
<dt>Dimension table</dt><dd>A point of the star: one row per date, product, store or customer, with its descriptive words.</dd>
<dt>Unknown member</dt><dd>An extra dimension row (here key 0, "Guest") for facts with no real partner.</dd>
<dt>Orphan</dt><dd>A fact row whose key finds no dimension row.</dd>
<dt>Physical meaning</dt><dd>The load flattens each little 3NF family (product, category, department) into one dimension row and writes one fact row per event with keys pointing at those rows. A query joins each needed dimension once, as a lookup.</dd>
</dl>

</div>

<div class="myth">

**"Leave guest sales with a NULL customer key."** Every inner join to the customer dimension then drops them without an error. Give them an unknown-member row so every fact finds a partner.

</div>

Watch it happen, one step at a time (and press **Show how it runs** on any live SQL box in this lesson to animate the real query):

<div class="steps">
<div class="step"><b>dim_store.</b> <table class="lk-tbl"><tr><th>store_key</th><th>city</th><th>region</th></tr><tr><td>4</td><td>Ottawa</td><td>Ontario South</td></tr><tr><td>12</td><td>(online)</td><td>Online</td></tr></table></div>
<div class="step"><b>fact_sales.</b> <table class="lk-tbl"><tr><th>date_key</th><th>store_key</th><th>customer_key</th><th>sales</th></tr><tr><td>20241221</td><td>4</td><td>10</td><td>12</td></tr><tr><td>20241221</td><td>12</td><td>0</td><td>30</td></tr></table></div>
<div class="step"><b>Join the store.</b> <table class="lk-tbl"><tr><th>store_key</th><th>region</th><th>sales</th></tr><tr><td>4</td><td><mark>Ontario South</mark></td><td>12</td></tr><tr><td>12</td><td><mark>Online</mark></td><td>30</td></tr></table> Rows stay 2.</div>
<div class="step"><b>Guests still count.</b> Key 0 finds "Guest" in dim_customer: <table class="lk-tbl"><tr><th>customer</th><th>sales</th></tr><tr><td>Uma</td><td>12</td></tr><tr><td><mark>Guest</mark></td><td>30</td></tr></table></div>
<div class="step"><b>Group and sum.</b> <table class="lk-tbl"><tr><th>region</th><th>sales</th></tr><tr><td>Ontario South</td><td>12</td></tr><tr><td>Online</td><td>30</td></tr></table></div>
</div>

**Try one with fresh numbers:**

<div class="problem" data-problem="dm-star-region"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** each foreign key in the fact table is a function into a dimension, and a star query composes those functions with the attribute you group by.

**Equation:** let f_s: facts → stores be the store key and region: stores → regions. Grouping sales by region sums the facts over each set f_s⁻¹(region⁻¹(r)): the facts whose store lies in region r. Because f_s is a total function (no orphans), the groups partition the facts and the regional totals add back to the grand total. A fact row is a point (date, product, store, customer) in the *cube* D × P × S × C, and the fact table stores only the points where something happened, so it is a sparse cube.

**Analogy:** a wheel hub and spokes. The hub (facts) carries the load; each spoke leads to one rim section (dimension). You never travel rim to rim.

**Try it:** the cube has 731 × 61 × 12 × 601 cells. Is fact_sales anywhere near that many rows? (No: about 7 thousand rows of over 300 million cells, so the cube is almost empty.)
</details>

## 9. Worked example: weekend sales by region

*Question:* what share of each region's 2025 sales happens on weekends?

```sql
-- try
SELECT s.region,
       ROUND(SUM(CASE WHEN d.is_weekend = 1 THEN f.sales_amount ELSE 0 END), 2) AS weekend_sales,
       ROUND(SUM(f.sales_amount), 2) AS all_sales,
       ROUND(100.0 * SUM(CASE WHEN d.is_weekend = 1 THEN f.sales_amount ELSE 0 END) / SUM(f.sales_amount), 1) AS weekend_pct
FROM fact_sales f
JOIN dim_date d ON d.date_key = f.date_key
JOIN dim_store s ON s.store_key = f.store_key
WHERE d.year = 2025
GROUP BY s.region
ORDER BY weekend_pct DESC
```

1. Two joins: date for `year` and `is_weekend`, store for `region`. No date functions, no LEFT JOIN worries about the online store.
2. Weekends are 2 of 7 days, about 28.6% of the calendar. The Prairies (38.9%) and both Ontario regions (about 38%) lean hard on weekends; the online store (30.2%) is close to the calendar; the single Vancouver store (17.7%) sells mostly on weekdays.
3. In the 3NF source the same query needs `strftime('%w', ...)`, a LEFT JOIN to regions and a COALESCE. The star did that work once, at load time.

## 10. Practice

```sql
-- exercise: Show 2025 sales by month name and month number from the star, in calendar order.
-- hint: JOIN dim_date, filter year = 2025, GROUP BY month, month_name, ORDER BY month.
SELECT f.date_key, f.sales_amount
FROM fact_sales f
LIMIT 12
-- answer:
SELECT d.month, d.month_name, ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_date d ON d.date_key = f.date_key
WHERE d.year = 2025
GROUP BY d.month, d.month_name
ORDER BY d.month
```

```sql
-- exercise: Show sales and number of orders by loyalty tier (Guest included) for all years, biggest sales first.
-- hint: JOIN dim_customer; orders = COUNT(DISTINCT f.order_id).
SELECT f.customer_key, SUM(f.sales_amount) AS sales
FROM fact_sales f
GROUP BY f.customer_key
-- answer:
SELECT c.loyalty_tier, ROUND(SUM(f.sales_amount), 2) AS sales, COUNT(DISTINCT f.order_id) AS orders
FROM fact_sales f
JOIN dim_customer c ON c.customer_key = f.customer_key
GROUP BY c.loyalty_tier
ORDER BY sales DESC
```

```sql
-- exercise: Which 3 brands sold the most in the West Coast region in 2025? Show brand and sales, biggest first.
-- hint: Three joins: dim_date (year), dim_store (region), dim_product (brand). LIMIT 3.
SELECT p.brand, ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_product p ON p.product_key = f.product_key
GROUP BY p.brand
ORDER BY sales DESC
LIMIT 3
-- answer:
SELECT p.brand, ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_date d ON d.date_key = f.date_key
JOIN dim_store s ON s.store_key = f.store_key
JOIN dim_product p ON p.product_key = f.product_key
WHERE d.year = 2025 AND s.region = 'West Coast'
GROUP BY p.brand
ORDER BY sales DESC
LIMIT 3
```

**Try it on your own data:** load your own CSVs into [[sql-playground]] and build a small star with the same CREATE TABLE AS SELECT pattern.

<div class="keypoints">

- Fact table in the middle: keys plus additive measures, one row per event.
- Dimension tables around it: one wide table per date, product, store, customer.
- Every query: start at the fact, join the dimensions you need, group by their words, sum the facts.
- An unknown member keeps facts with no partner from being dropped.
- Check every load: one row per grain, and no orphans.

</div>

**New words:** *star schema*, *fact table*, *dimension table*, *unknown member*, *orphan*, *cube*.
