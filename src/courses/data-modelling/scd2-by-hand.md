---
title: 'SCD type 2 in SQL, by hand'
seoTitle: 'SCD type 2 in SQL: a step-by-step example'
summary: 'Load a type 2 customer dimension yourself: compare a staging change set with the current rows, expire the old versions with UPDATE, insert the new ones, and check the result. Then load facts against the right version.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: In what order does a type 2 load run?
    choices: ['Insert the new versions, then expire the old ones', 'Expire the changed current rows, then insert a new current row for every staged customer that has none', 'Delete the old rows, then insert']
    ans: 1
    why: Expiring first means every changed customer is left with no current row. The insert then adds one for exactly those customers, plus brand-new ones, using one simple NOT EXISTS test.
  - q: 'Why compare with IS NOT instead of <> when looking for changes?'
    choices: ['IS NOT is faster', 'NULL <> ''Bronze'' is not true, so a tier going from NULL to Bronze would be missed', 'They are the same']
    ans: 1
    why: Any comparison with NULL using <> gives NULL, which WHERE treats as false. IS NOT (IS DISTINCT FROM in PostgreSQL and SQL Server 2022) treats NULL as a value.
  - q: 'You run the same type 2 load twice by accident. With the design in this lesson, what happens the second time?'
    choices: ['Every changed customer gets a duplicate version', 'Nothing: no current row differs from staging, and every staged customer already has a current row', 'The load fails']
    ans: 1
    why: The load is idempotent. After the first run the current rows match staging, so the UPDATE finds nothing to expire and the INSERT finds nobody without a current row.
sources:
  - 'PostgreSQL documentation, Comparison functions and operators (IS DISTINCT FROM) https://www.postgresql.org/docs/current/functions-comparison.html'
  - 'SQLite documentation, Expressions (IS DISTINCT FROM) https://www.sqlite.org/lang_expr.html'
  - 'The Kimball Group, Dimensional Modeling Techniques https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/'
---

**Module 5 · about 35 minutes · read first: 5.1.** You'll be able to write a complete type 2 load in plain SQL, make it safe to run twice, check it for gaps and overlaps, and look up the right version when loading facts.

<div class="bigidea">A type 2 load is three steps in SQL: find the rows that changed, close their old versions, insert the new versions.</div>

**In everyday terms:** a school register. When a pupil changes class, you do not rub out the old line. You write the end date on it, then add a new line for the new class.

## 1. Why this matters

Tools like dbt snapshots and SQL Server's `MERGE` can maintain a type 2 dimension for you, but they all run the same few steps underneath. When one of them produces duplicate "current" rows or loses a change, you need to know those steps to find out why. Writing one by hand, once, is the best way to understand what your tools are doing, and it is a favourite take-home task in data engineering interviews.

<div class="meaning">

<dl>
<dt>Staging table</dt><dd>Tonight's copy of the source data, waiting to be compared.</dd>
<dt>Change set</dt><dd>The staging rows that differ from the current dimension rows, or that are new.</dd>
<dt>Expire</dt><dd>Set valid_to and is_current on the old row. The row stays.</dd>
<dt>IS DISTINCT FROM</dt><dd>A comparison that treats NULL as a value, so NULL vs NULL is "same".</dd>
<dt>Idempotent</dt><dd>Running it twice gives the same result as running it once.</dd>
<dt>Physical meaning</dt><dd>Each changed customer costs one UPDATE (the old row closes) and one INSERT (the new row opens). The table only grows, and old rows never disappear.</dd>
</dl>

</div>

<div class="myth">

**"If the data has not changed the load is harmless, so it does not matter if it runs twice."** If the load only inserts, a second run adds a duplicate version for every customer. The "changed" test must compare staging with the <b>current</b> row, so a second run finds nothing to do.

</div>

## 2. The starting dimension

First, the dimension as it looked after its first load: every customer with one current version, plus the unknown member from [Lesson 4.1](/learn/courses/data-modelling/surrogate-keys/). The first versions start on `1900-01-01`, meaning "true since before our data begins".

```sql
-- noviz
DROP TABLE IF EXISTS dim_customer;
CREATE TABLE dim_customer AS
SELECT ROW_NUMBER() OVER (ORDER BY customer_id) AS customer_key,
       customer_id,
       first_name || ' ' || last_name AS customer_name,
       TRIM(city) AS city,
       loyalty_tier,
       '1900-01-01' AS valid_from,
       '9999-12-31' AS valid_to,
       1 AS is_current
FROM customers;
INSERT INTO dim_customer VALUES (-1, NULL, 'Guest / unknown', 'Unknown', 'Unknown', '1900-01-01', '9999-12-31', 1);

SELECT COUNT(*) AS rows_now FROM dim_customer;
```

604 rows. We track `city` and `loyalty_tier` as type 2. (The name could be type 1; we leave it alone to keep the lesson short.)

## 3. The staging change set

On 1 June 2025 the source sends the customers that changed or are new. Loads normally land data in a **staging table** first, cleaned but not yet merged into the warehouse:

```sql
-- noviz
DROP TABLE IF EXISTS stg_customers;
CREATE TABLE stg_customers (load_date TEXT, customer_id INTEGER, customer_name TEXT, city TEXT, loyalty_tier TEXT);
INSERT INTO stg_customers VALUES
  ('2025-06-01',   3, 'Gurpreet Fraser', 'Winnipeg ',   'Gold'),
  ('2025-06-01',   4, 'Ines Lam',        'Calgary',     'Bronze'),
  ('2025-06-01',   6, 'Tanvi Campbell',  'Edmonton',    'Silver'),
  ('2025-06-01',   7, 'Isaac Kumar',     'Toronto',     'Gold'),
  ('2025-06-01',   8, 'Gurpreet Wilson', 'Mississauga', 'Silver'),
  ('2025-06-01',  11, 'Maya Gagnon',     'Edmonton',    'Bronze'),
  ('2025-06-01', 604, 'Lena Okafor',     'Hamilton',    'Bronze');
UPDATE stg_customers SET city = TRIM(city);
```

The last line matters more than it looks. Customer 3's city arrives as `'Winnipeg '` with a trailing space. Untrimmed, it would differ from the dimension's `'Winnipeg'` and create a fake new version every single night. Clean staging the same way the dimension was cleaned **before** comparing.

## 4. Step 1: find what changed

Compare each staged row with the customer's **current** version. A LEFT JOIN keeps brand-new customers (no current row at all):

```sql
-- try
SELECT s.customer_id,
       d.city AS old_city, s.city AS new_city,
       d.loyalty_tier AS old_tier, s.loyalty_tier AS new_tier,
       CASE WHEN d.customer_id IS NULL THEN 'new'
            WHEN s.city IS NOT d.city OR s.loyalty_tier IS NOT d.loyalty_tier THEN 'changed'
            ELSE 'same' END AS action
FROM stg_customers s
LEFT JOIN dim_customer d ON d.customer_id = s.customer_id AND d.is_current = 1
```

Four changed (4 moved, 6 and 11 changed tier, 7 did both), two the same (3 and 8), one new (604). Notice the comparison uses `IS NOT`, not `<>`. Here is why:

```sql
-- try
SELECT s.customer_id
FROM stg_customers s
JOIN dim_customer d ON d.customer_id = s.customer_id AND d.is_current = 1
WHERE s.city <> d.city OR s.loyalty_tier <> d.loyalty_tier
```

Only 3 customers. Maya Gagnon (11) went from no tier (NULL) to Bronze, and `NULL <> 'Bronze'` is NULL, not true, so the change is silently lost. In SQLite `IS NOT` treats NULLs as equal to each other and different from everything else; PostgreSQL and SQL Server 2022 spell it `IS DISTINCT FROM`. On older SQL Server, wrap both sides in `COALESCE(x, '~')`.

## 5. Step 2: expire the old versions

For each changed customer, close the current row: set `valid_to` to the load date and `is_current` to 0. With half-open ranges ([Lesson 5.1](/learn/courses/data-modelling/scd-types/)) the old version ends on the very day the new one starts.

```sql
-- noviz
UPDATE dim_customer
SET valid_to = (SELECT s.load_date FROM stg_customers s WHERE s.customer_id = dim_customer.customer_id),
    is_current = 0
WHERE is_current = 1
  AND EXISTS (
    SELECT 1 FROM stg_customers s
    WHERE s.customer_id = dim_customer.customer_id
      AND (s.city IS NOT dim_customer.city OR s.loyalty_tier IS NOT dim_customer.loyalty_tier)
  );
```

Run it: 4 rows changed. Customers 3 and 8 were not touched, because nothing about them differs.

## 6. Step 3: insert the new versions

After step 2, every changed customer has **no** current row, and neither does the brand-new one. So one rule covers both: insert a current row for every staged customer that doesn't have one. New surrogate keys continue from the highest key so far.

```sql
-- noviz
INSERT INTO dim_customer
SELECT (SELECT MAX(customer_key) FROM dim_customer) + ROW_NUMBER() OVER (ORDER BY s.customer_id),
       s.customer_id, s.customer_name, s.city, s.loyalty_tier,
       s.load_date, '9999-12-31', 1
FROM stg_customers s
WHERE NOT EXISTS (
  SELECT 1 FROM dim_customer d WHERE d.customer_id = s.customer_id AND d.is_current = 1
);
```

5 rows inserted: four new versions and one new customer. Look at the result:

```sql
-- try
SELECT customer_key, customer_id, customer_name, city, loyalty_tier, valid_from, valid_to, is_current
FROM dim_customer
WHERE customer_id IN (3, 4, 6, 7, 8, 11, 604)
ORDER BY customer_id, valid_from
```

Ines Lam (4) now has key 4 for Vancouver up to 2025-06-01 and key 604 for Calgary from that day. Don't confuse **customer_key** 604 (Ines's new version) with **customer_id** 604 (Lena, the new customer, who got key 608). That confusion is exactly why the natural key and the surrogate key have different names.

## 7. Safe to run twice

Loads fail halfway and get rerun. Run steps 2 and 3 again now, unchanged:

```sql
-- noviz
UPDATE dim_customer
SET valid_to = (SELECT s.load_date FROM stg_customers s WHERE s.customer_id = dim_customer.customer_id),
    is_current = 0
WHERE is_current = 1
  AND EXISTS (SELECT 1 FROM stg_customers s
              WHERE s.customer_id = dim_customer.customer_id
                AND (s.city IS NOT dim_customer.city OR s.loyalty_tier IS NOT dim_customer.loyalty_tier));
INSERT INTO dim_customer
SELECT (SELECT MAX(customer_key) FROM dim_customer) + ROW_NUMBER() OVER (ORDER BY s.customer_id),
       s.customer_id, s.customer_name, s.city, s.loyalty_tier, s.load_date, '9999-12-31', 1
FROM stg_customers s
WHERE NOT EXISTS (SELECT 1 FROM dim_customer d WHERE d.customer_id = s.customer_id AND d.is_current = 1);
SELECT COUNT(*) AS rows_now, SUM(is_current) AS current_rows FROM dim_customer;
```

Still 609 rows, 605 current. Nothing changed, because the current rows now match staging and everyone staged has a current row. A load you can rerun without harm is called **idempotent** ([Lesson 7.3](/learn/courses/data-modelling/audit-columns/) goes further).

## 8. The next load

On 1 October 2025 Isaac Kumar moves again, to Ottawa, and Lena Okafor reaches Silver. Same two statements, new staging:

```sql
-- noviz
DELETE FROM stg_customers;
INSERT INTO stg_customers VALUES
  ('2025-10-01',   7, 'Isaac Kumar', 'Ottawa',   'Gold'),
  ('2025-10-01', 604, 'Lena Okafor', 'Hamilton', 'Silver');

UPDATE dim_customer
SET valid_to = (SELECT s.load_date FROM stg_customers s WHERE s.customer_id = dim_customer.customer_id),
    is_current = 0
WHERE is_current = 1
  AND EXISTS (SELECT 1 FROM stg_customers s
              WHERE s.customer_id = dim_customer.customer_id
                AND (s.city IS NOT dim_customer.city OR s.loyalty_tier IS NOT dim_customer.loyalty_tier));
INSERT INTO dim_customer
SELECT (SELECT MAX(customer_key) FROM dim_customer) + ROW_NUMBER() OVER (ORDER BY s.customer_id),
       s.customer_id, s.customer_name, s.city, s.loyalty_tier, s.load_date, '9999-12-31', 1
FROM stg_customers s
WHERE NOT EXISTS (SELECT 1 FROM dim_customer d WHERE d.customer_id = s.customer_id AND d.is_current = 1);

SELECT customer_key, customer_id, city, loyalty_tier, valid_from, valid_to, is_current
FROM dim_customer WHERE customer_id = 7 ORDER BY valid_from;
```

Isaac now has three versions: Edmonton Bronze (key 7), Toronto Gold (606) and Ottawa Gold (609), with ranges that meet end to start.

## 9. Check the dimension

Two checks belong after every type 2 load. Both should return nothing (or 0):

```sql
-- try
SELECT customer_id, COUNT(*) AS current_rows
FROM dim_customer
WHERE is_current = 1
GROUP BY customer_id
HAVING COUNT(*) > 1
```

```sql
-- try
SELECT COUNT(*) AS overlapping_pairs
FROM dim_customer a
JOIN dim_customer b
  ON a.customer_id = b.customer_id
 AND a.customer_key < b.customer_key
 AND a.valid_from < b.valid_to
 AND b.valid_from < a.valid_to
```

No customer has two current rows, and no two versions of one customer overlap. Two ranges [a₁, a₂) and [b₁, b₂) overlap exactly when a₁ < b₂ and b₁ < a₂; that is the whole test.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a type 2 load keeps one invariant: for each customer, the versions' ranges partition the time line, and exactly one is open. Each load cuts the open range in two at the load date.

**Equation:** before a change, the open version covers [f, ∞). The load replaces it with [f, L) and [L, ∞), where L is the load date. The pieces still don't overlap and still cover everything, so for any day t exactly one version satisfies valid_from ≤ t < valid_to. The two checks test the two halves of the invariant: "at most one open row" (|current| ≤ 1) and "no overlaps" (no pair with a₁ < b₂ ∧ b₁ < a₂).

**Analogy:** a ruler marked with a pen. Each change is a new tick at today's date; the ruler is never cut into overlapping pieces, and the last piece always runs off the end.

**Try it:** Isaac's versions are [1900-01-01, 2025-06-01), [2025-06-01, 2025-10-01) and [2025-10-01, 9999-12-31). Which covers 2025-06-01 itself? (The second: the first ends before that day, because valid_to is excluded.)
</details>

Watch it happen, one step at a time (any live box below has a **Show how it runs** button that animates the real query):

<div class="steps">
<div class="step"><b>Dimension before the load.</b> <table class="lk-tbl"><tr><th>key</th><th>cust</th><th>city</th><th>current</th></tr><tr><td>1</td><td>Asha</td><td>Toronto</td><td>1</td></tr><tr><td>2</td><td>Ben</td><td>Halifax</td><td>1</td></tr></table></div>
<div class="step"><b>Staging tonight.</b> <table class="lk-tbl"><tr><th>cust</th><th>city</th></tr><tr><td>Asha</td><td>Ottawa</td></tr><tr><td>Ben</td><td>Halifax</td></tr><tr><td>Chloe</td><td>Calgary</td></tr></table></div>
<div class="step"><b>Step 1: find changes.</b> Asha changed. Ben is the same. Chloe is new.</div>
<div class="step"><b>Step 2: expire.</b> <table class="lk-tbl"><tr><th>key</th><th>cust</th><th>city</th><th>current</th></tr><tr><td><mark>1</mark></td><td>Asha</td><td>Toronto</td><td><mark>0</mark></td></tr><tr><td>2</td><td>Ben</td><td>Halifax</td><td>1</td></tr></table></div>
<div class="step"><b>Step 3: insert.</b> <table class="lk-tbl"><tr><th>key</th><th>cust</th><th>city</th><th>current</th></tr><tr><td>1</td><td>Asha</td><td>Toronto</td><td>0</td></tr><tr><td>2</td><td>Ben</td><td>Halifax</td><td>1</td></tr><tr><td><mark>3</mark></td><td>Asha</td><td>Ottawa</td><td>1</td></tr><tr><td><mark>4</mark></td><td>Chloe</td><td>Calgary</td><td>1</td></tr></table> Run it again and the change set is empty.</div>
</div>

<div class="problem" data-problem="dm-scd2-load"></div>

## 10. Worked example: loading facts against the right version

A fact must get the key of the version that was true **on the fact's date**, so the lookup adds a date range to the natural key:

```sql
-- noviz
DROP TABLE IF EXISTS fact_sales;
CREATE TABLE fact_sales AS
SELECT oi.order_id, o.order_date,
       COALESCE(d.customer_key, -1) AS customer_key,
       ROUND(oi.quantity * oi.unit_price * (1 - oi.discount), 2) AS sales_amount
FROM order_items oi
JOIN orders o ON o.order_id = oi.order_id
LEFT JOIN dim_customer d
  ON d.customer_id = o.customer_id
 AND o.order_date >= d.valid_from
 AND o.order_date <  d.valid_to;

SELECT COUNT(*) AS fact_rows, SUM(customer_key = -1) AS guest_rows FROM fact_sales;
```

Still 7,310 lines, 874 of them guests: the range lookup found exactly one version for every known customer's line. If it had found two (an overlap), the count would be higher; that is another reason to run the checks first.

Now Isaac Kumar's sales, per version:

```sql
-- try
SELECT d.customer_key, d.city, d.loyalty_tier, d.valid_from, d.valid_to,
       COUNT(DISTINCT f.order_id) AS orders,
       ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_customer d ON d.customer_key = f.customer_key
WHERE d.customer_id = 7
GROUP BY d.customer_key, d.city, d.loyalty_tier, d.valid_from, d.valid_to
```

As it was: 6 orders ($178.70) as an Edmonton Bronze member, 4 ($73.26) as Toronto Gold, 2 ($56.64) as Ottawa Gold. A type 1 dimension would have filed all 12 orders, $308.60, under Ottawa Gold. [Lesson 5.4](/learn/courses/data-modelling/point-in-time/) shows how to answer both ways on purpose.

## 11. Practice

```sql
-- exercise: List every customer who has more than one version, with the number of versions, most first.
-- hint: GROUP BY customer_id on dim_customer, HAVING COUNT(*) > 1, ORDER BY the count DESC, then customer_id.
SELECT customer_id, COUNT(*) AS versions
FROM dim_customer
GROUP BY customer_id
-- answer:
SELECT customer_id, COUNT(*) AS versions
FROM dim_customer
GROUP BY customer_id
HAVING COUNT(*) > 1
ORDER BY versions DESC, customer_id
```

```sql
-- exercise: Which customer_key, city and tier did Isaac Kumar (customer_id 7) have on 2025-08-15?
-- hint: Filter customer_id = 7 and test the date with valid_from <= date AND date < valid_to.
SELECT customer_key, city, loyalty_tier
FROM dim_customer
WHERE customer_id = 7 AND is_current = 1
-- answer:
SELECT customer_key, city, loyalty_tier
FROM dim_customer
WHERE customer_id = 7
  AND valid_from <= '2025-08-15' AND '2025-08-15' < valid_to
```

```sql
-- exercise: Show Ines Lam's (customer_id 4) sales by the city she lived in at the time of each order.
-- hint: Join fact_sales to dim_customer on customer_key, filter d.customer_id = 4, GROUP BY d.city.
SELECT d.city, ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_customer d ON d.customer_id = 4 AND d.is_current = 1
GROUP BY d.city
-- answer:
SELECT d.city, ROUND(SUM(f.sales_amount), 2) AS sales
FROM fact_sales f
JOIN dim_customer d ON d.customer_key = f.customer_key
WHERE d.customer_id = 4
GROUP BY d.city
```

<div class="keypoints">

- Compare staging with the current rows only.
- Expire first (UPDATE), then insert (INSERT).
- Use IS DISTINCT FROM so NULLs compare correctly.
- A second run must find an empty change set.
- Check afterwards: one current row per customer, no gaps or overlaps in dates.

</div>

**New words:** *staging table*, *change set*, *expire*, *IS DISTINCT FROM*, *idempotent*, *overlap check*.
