---
title: 'Testing a warehouse: counts, keys and orphans'
seoTitle: 'Data warehouse testing in SQL: keys, orphans, row counts'
summary: 'A warehouse test is a query that returns the rows that break a rule; no rows means pass. Write the five tests every star needs (unique keys, no null keys, no orphans, accepted values, reconciled totals), catch four planted bugs in a Northbay star, fix them and watch every test pass.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: How is a typical warehouse test written?
    choices: ['A query that returns the rows breaking a rule; zero rows means the test passes', 'A query that returns TRUE when the table looks nice', 'A chart someone checks by eye']
    ans: 0
    why: Returning the failing rows makes the test easy to run automatically and, when it fails, shows you exactly which rows to look at. dbt tests work this way.
  - q: What is an orphan in a star schema?
    choices: ['A dimension row no fact uses', 'A fact row whose foreign key has no matching row in the dimension', 'A table with no primary key']
    ans: 1
    why: An orphan fact row silently disappears from any report that inner-joins to the dimension, so totals come out too low.
  - q: A dimension has the same key twice. What happens to facts joined to it?
    choices: ['Nothing', 'Each matching fact row is doubled by the join (fan-out), so totals come out too high', 'The join fails with an error']
    ans: 1
    why: A join matches every copy. That is why a unique-key test on every dimension and a row-count check after every join are the first tests to write.
sources:
  - 'dbt Labs documentation, Data tests https://docs.getdbt.com/docs/build/data-tests'
  - 'The Kimball Group, Dimensional Modeling Techniques https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/'
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley, chapter 19 (ETL quality screens)'
---

**Module 7 · about 30 minutes · read first: 7.3.** You'll be able to write the five standard warehouse tests in SQL, collect them in one results view, find planted bugs with them, and know which test catches which kind of mistake.

<div class="bigidea">A warehouse test is a query that returns the bad rows; if it returns nothing, the test passes.</div>

**In everyday terms:** a till check at closing time. You count the cash against the receipts. If they match, nothing to do; if not, you go and find the mistake.

## 1. Why this matters

A dashboard that shows the wrong number is worse than no dashboard: people make decisions on it. Most warehouse errors come from a few causes (duplicate keys, missing keys, values nobody expected, rows lost or doubled in a join), and each can be caught by a short SQL query run after every load. Teams that use dbt, Great Expectations or hand-written checks all test the same few things. Being able to list them, and write them, is a standard interview question.

<div class="meaning">

<dl>
<dt>Unique test</dt><dd>No key appears more than once.</dd>
<dt>Not-null test</dt><dd>A required column is never NULL.</dd>
<dt>Relationships test</dt><dd>Every fact key matches a dimension row.</dd>
<dt>Orphan</dt><dd>A fact row whose key matches no dimension row.</dd>
<dt>Accepted values</dt><dd>A column holds only allowed values.</dd>
<dt>Reconciliation</dt><dd>Totals in the warehouse match the source.</dd>
<dt>Physical meaning</dt><dd>Tests do not change any table. Each one reads the tables and returns the rows that break a rule.</dd>
</dl>

</div>

<div class="myth">

**"If the row count looks right the data must be right."** A join that drops and duplicates the same number of rows still gives the right count. Test keys, nulls, orphans and totals separately.

</div>

## 2. A test is a query for bad rows

The convention: **a test returns the rows that break a rule.** No rows means the test passes. When it fails, the result *is* the list of rows to investigate. The five tests every star needs:

| Test | Rule | Catches |
|---|---|---|
| **Unique** | each dimension key appears once | duplicate loads, bad joins in the dimension build, fan-out later |
| **Not null** | fact foreign keys are never NULL | guests or missing lookups with no unknown member |
| **Relationships (orphans)** | every fact key exists in its dimension | dimension rows deleted or filtered out |
| **Accepted values** | a column holds only the expected values | typos, new codes, stray spaces |
| **Reconciliation** | counts and totals match the source | rows lost or doubled anywhere in the pipeline |

## 3. Build a star with four planted bugs

This build looks fine at a glance. It has four bugs, each a real mistake people make. Run it, then we test.

```sql
-- noviz
DROP TABLE IF EXISTS fact_sales;
DROP TABLE IF EXISTS dim_product;
DROP TABLE IF EXISTS dim_customer;
CREATE TABLE dim_product AS
SELECT product_id AS product_key, product_name, unit_price FROM products;
INSERT INTO dim_product                         -- bug 1: part of the load ran twice
SELECT product_id, product_name, unit_price FROM products WHERE product_id = 28;
CREATE TABLE dim_customer AS
SELECT customer_id AS customer_key,
       first_name || ' ' || last_name AS customer_name,
       city,                                    -- bug 2: city not trimmed
       COALESCE(loyalty_tier, 'None') AS loyalty_tier
FROM customers
WHERE joined_on <= '2025-12-01';                -- bug 3: a test filter left in
CREATE TABLE fact_sales AS
SELECT o.order_id, i.product_id AS product_key,
       o.customer_id AS customer_key,           -- bug 4: guests get NULL, no -1 member
       ROUND(i.quantity * i.unit_price * (1 - i.discount), 2) AS sales_amount
FROM orders o JOIN order_items i ON i.order_id = o.order_id
WHERE o.status = 'completed';
SELECT (SELECT COUNT(*) FROM dim_product) AS products, (SELECT COUNT(*) FROM dim_customer) AS customers,
       COUNT(*) AS fact_rows FROM fact_sales
```

62 products (there should be 61), 593 customers (there should be 603 plus an Unknown member) and 7,112 fact rows. Nothing errored. Only tests will tell you something is wrong.

## 4. The five tests, one at a time

**Unique.** Every dimension key once:

```sql
-- try
SELECT product_key, COUNT(*) AS copies
FROM dim_product
GROUP BY product_key
HAVING COUNT(*) > 1
```

Product 28 is there twice. Any fact row for coffee beans will be doubled when joined to dim_product.

**Not null.** Fact foreign keys should never be NULL; guests belong to the -1 member:

```sql
-- try
SELECT COUNT(*) AS null_customer_keys
FROM fact_sales
WHERE customer_key IS NULL
```

845 fact rows have no customer key. A report that inner-joins to dim_customer drops all of them without a word.

**Relationships (orphans).** Every non-null fact key must exist in the dimension. The anti-join from [SQL Lesson 4.4](/learn/courses/sql/anti-join/):

```sql
-- try
SELECT f.customer_key, COUNT(*) AS orphan_rows
FROM fact_sales f
LEFT JOIN dim_customer d ON d.customer_key = f.customer_key
WHERE f.customer_key IS NOT NULL AND d.customer_key IS NULL
GROUP BY f.customer_key
ORDER BY orphan_rows DESC
```

10 customers, with 97 fact rows between them, have no dimension row: the leftover filter threw away everyone who joined after 1 December 2025.

**Accepted values.** A column should hold only the values you expect. Here, city names must have no spaces at the ends, and tiers must be one of four:

```sql
-- try
SELECT 'city has spaces' AS problem, COUNT(*) AS bad_rows FROM dim_customer WHERE city <> trim(city)
UNION ALL
SELECT 'unknown tier', COUNT(*) FROM dim_customer
WHERE loyalty_tier NOT IN ('Bronze', 'Silver', 'Gold', 'None')
```

The tier test passes; the city test fails. A slicer in Power BI would show "Winnipeg" and "Winnipeg " as two cities.

**Reconciliation.** The fact must match the source, and joins must not change the row count:

```sql
-- try
SELECT (SELECT COUNT(*) FROM order_items i JOIN orders o ON o.order_id = i.order_id
        WHERE o.status = 'completed') AS source_lines,
       (SELECT COUNT(*) FROM fact_sales) AS fact_lines,
       (SELECT COUNT(*) FROM fact_sales f JOIN dim_product p ON p.product_key = f.product_key) AS after_product_join
```

The fact matches the source (7,112), but joining dim_product gives 7,287: the duplicate product 28 doubled its 175 lines. That is fan-out, and it is why "count before and after every join" is a habit worth keeping ([SQL Lesson 4.5](/learn/courses/sql/fan-out/)).

## 5. All tests in one view

Collect every test in one view that returns a test name, a failure count and PASS or FAIL. Run it after every load; a scheduler can stop the pipeline if any row says FAIL.

```sql
-- noviz
DROP VIEW IF EXISTS test_results;
CREATE VIEW test_results AS
WITH t AS (
  SELECT 'unique dim_product.product_key' AS test,
         (SELECT COUNT(*) FROM (SELECT product_key FROM dim_product GROUP BY product_key HAVING COUNT(*) > 1)) AS failures
  UNION ALL SELECT 'unique dim_customer.customer_key',
         (SELECT COUNT(*) FROM (SELECT customer_key FROM dim_customer GROUP BY customer_key HAVING COUNT(*) > 1))
  UNION ALL SELECT 'not null fact_sales.customer_key',
         (SELECT COUNT(*) FROM fact_sales WHERE customer_key IS NULL)
  UNION ALL SELECT 'orphans fact_sales -> dim_customer',
         (SELECT COUNT(*) FROM fact_sales f LEFT JOIN dim_customer d ON d.customer_key = f.customer_key
          WHERE f.customer_key IS NOT NULL AND d.customer_key IS NULL)
  UNION ALL SELECT 'orphans fact_sales -> dim_product',
         (SELECT COUNT(*) FROM fact_sales f LEFT JOIN dim_product d ON d.product_key = f.product_key
          WHERE d.product_key IS NULL)
  UNION ALL SELECT 'accepted dim_customer.city trimmed',
         (SELECT COUNT(*) FROM dim_customer WHERE city <> trim(city))
  UNION ALL SELECT 'reconcile fact rows = source lines',
         ABS((SELECT COUNT(*) FROM fact_sales) - (SELECT COUNT(*) FROM order_items i JOIN orders o
              ON o.order_id = i.order_id WHERE o.status = 'completed'))
  UNION ALL SELECT 'reconcile no fan-out on dim_product',
         (SELECT COUNT(*) FROM fact_sales f JOIN dim_product p ON p.product_key = f.product_key)
         - (SELECT COUNT(*) FROM fact_sales)
)
SELECT test, failures, CASE WHEN failures = 0 THEN 'PASS' ELSE 'FAIL' END AS result FROM t;
SELECT * FROM test_results
```

Five FAILs and three PASSes. Bug 1 shows up twice, as a duplicate key and as fan-out, and every other bug is caught by its own test.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** each test checks a property of a function. A dimension key must be a key: the map from key to row is a function only if each key appears once (**unique**). A foreign key must land in the dimension's key set (**referential integrity**). A join of facts to a dimension preserves the fact count exactly when every fact key matches exactly one dimension row.

**Equation:** for a fact F and dimension D joined on k, |F ⋈ D| = Σ over fact rows f of (number of rows in D with key f.k). Each term is 1 when k is unique and present, 0 for an orphan, 2 or more for a duplicate. So |F ⋈ D| = |F| − orphans + extra copies. Here 7,112 − 0 + 175 = 7,287.

**Analogy:** a cloakroom. Each ticket number must be on one coat only (unique), every ticket handed out must have a coat (no orphans), and the count of coats returned should equal the tickets handed in (reconciliation).

**Try it:** a fact has 1,000 rows, 20 are orphans, and one dimension key appears three times, used by 10 fact rows. How many rows after an inner join? (1,000 − 20 + 2 × 10 = 1,000.) The count matches, yet two bugs hide. That is why you run each test separately, not only the count.
</details>

Watch it happen, one step at a time (any live box below has a **Show how it runs** button that animates the real query):

<div class="steps">
<div class="step"><b>A small star.</b> <table class="lk-tbl"><tr><th>sale</th><th>product_key</th><th>amount</th></tr><tr><td>1</td><td>10</td><td>40</td></tr><tr><td>2</td><td>11</td><td>30</td></tr><tr><td>3</td><td><mark>99</mark></td><td>20</td></tr><tr><td>4</td><td><mark>NULL</mark></td><td>10</td></tr></table> <table class="lk-tbl"><tr><th>product_key</th></tr><tr><td>10</td></tr><tr><td>11</td></tr></table></div>
<div class="step"><b>Unique test.</b> <code>GROUP BY product_key HAVING COUNT(*) &gt; 1</code> on the dimension: no rows, pass.</div>
<div class="step"><b>Not-null test.</b> Sale 4 has no product_key: fail, 1 row.</div>
<div class="step"><b>Relationships test.</b> Sale 3 uses key 99, which the dimension lacks: fail, 1 orphan.</div>
<div class="step"><b>Fix and re-run.</b> Repair the two rows. Every test now returns zero rows.</div>
</div>

<div class="problem" data-problem="dm-orphans"></div>

## 6. Worked example: fix the bugs, re-run the tests

Fix all four bugs in the build: de-duplicate products, trim cities, drop the leftover filter, and add the -1 Unknown member for guests.

```sql
-- noviz
DROP TABLE IF EXISTS fact_sales;
DROP TABLE IF EXISTS dim_product;
DROP TABLE IF EXISTS dim_customer;
CREATE TABLE dim_product AS
SELECT product_id AS product_key, product_name, unit_price FROM products;
CREATE TABLE dim_customer AS
SELECT -1 AS customer_key, 'Guest' AS customer_name, 'Unknown' AS city, 'Unknown' AS loyalty_tier
UNION ALL
SELECT customer_id, first_name || ' ' || last_name, trim(city), COALESCE(loyalty_tier, 'None')
FROM customers;
CREATE TABLE fact_sales AS
SELECT o.order_id, i.product_id AS product_key,
       COALESCE(o.customer_id, -1) AS customer_key,
       ROUND(i.quantity * i.unit_price * (1 - i.discount), 2) AS sales_amount
FROM orders o JOIN order_items i ON i.order_id = o.order_id
WHERE o.status = 'completed';
SELECT * FROM test_results
```

1. dim_product now has 61 rows; the unique test passes and the fan-out check is 0.
2. dim_customer has 604 rows (603 plus Unknown); no orphans.
3. The 845 guest lines now point at -1, so the not-null test passes.
4. The accepted-values test on cities passes.

All eight tests say PASS. Because test_results is a view, the same tests ran against the new tables without rewriting anything.

In dbt the same tests are one line each in a YAML file (`unique`, `not_null`, `relationships`, `accepted_values`), and dbt writes these queries for you. The ETL course sets that up in [Module 5](/learn/courses/etl/dbt-basics/).

## 7. Practice

```sql
-- exercise: Write a not-null test for fact_sales.product_key: return the number of rows where it is NULL.
-- hint: COUNT(*) ... WHERE product_key IS NULL.
SELECT COUNT(*) AS null_product_keys
FROM fact_sales
WHERE customer_key = -1
-- answer:
SELECT COUNT(*) AS null_product_keys
FROM fact_sales
WHERE product_key IS NULL
```

```sql
-- exercise: Accepted values with a trap: return every store whose province is not one of ON, MB, AB or BC. The starting query looks right but returns nothing. Make NULL provinces count as failures too.
-- hint: province NOT IN (...) is NULL, not true, when province is NULL, so the row is skipped. Wrap it: COALESCE(province, '?') NOT IN (...).
SELECT store_id, store_name, province
FROM stores
WHERE province NOT IN ('ON', 'MB', 'AB', 'BC')
-- answer:
SELECT store_id, store_name, province
FROM stores
WHERE COALESCE(province, '?') NOT IN ('ON', 'MB', 'AB', 'BC')
```

```sql
-- exercise: Reconcile money, not just rows: return the total sales in fact_sales and the total completed line value in the source (quantity × unit_price × (1 − discount), rounded per line), side by side.
-- hint: Two scalar subqueries; round each line with ROUND(..., 2) before summing, as the fact does.
SELECT ROUND(SUM(sales_amount), 2) AS fact_sales
FROM fact_sales
-- answer:
SELECT (SELECT ROUND(SUM(sales_amount), 2) FROM fact_sales) AS fact_sales,
       (SELECT ROUND(SUM(ROUND(i.quantity * i.unit_price * (1 - i.discount), 2)), 2)
        FROM order_items i JOIN orders o ON o.order_id = i.order_id
        WHERE o.status = 'completed') AS source_sales
```

```sql
-- exercise: Find dimension rows no fact uses: list customer keys in dim_customer with no rows in fact_sales.
-- hint: LEFT JOIN dim_customer to fact_sales and keep rows where the fact side is NULL.
SELECT d.customer_key
FROM dim_customer d
-- answer:
SELECT d.customer_key, d.customer_name
FROM dim_customer d
LEFT JOIN fact_sales f ON f.customer_key = d.customer_key
WHERE f.customer_key IS NULL
```

<div class="keypoints">

- A test is a query that returns bad rows.
- The five basics: unique, not null, relationships, accepted values, reconciliation.
- Each test catches a different kind of mistake.
- Put all tests in one results view and run it after every load.

</div>

**New words:** *data test*, *unique test*, *not-null test*, *relationships test*, *orphan*, *referential integrity*, *accepted values*, *reconciliation*.
