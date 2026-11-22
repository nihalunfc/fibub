---
title: 'Loading with MERGE and upserts'
seoTitle: 'SQL MERGE and upsert (INSERT ON CONFLICT) explained'
summary: 'An upsert inserts new rows and updates changed ones in a single statement. Load a Northbay product dimension with INSERT ... ON CONFLICT DO UPDATE, load facts incrementally without duplicates, and see the same load written as a SQL Server MERGE.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: What does an upsert do with a row whose key already exists in the target?
    choices: ['Always inserts a second copy', 'Updates the existing row (or skips it, if told to do nothing)', 'Deletes the table']
    ans: 1
    why: Upsert = update if the key exists, insert if it does not. ON CONFLICT DO NOTHING skips instead of updating.
  - q: What must exist on the target table for SQLite's ON CONFLICT (product_id) to work?
    choices: ['An index on any column', 'A PRIMARY KEY or UNIQUE constraint on product_id', 'Nothing']
    ans: 1
    why: The database needs a constraint to know what counts as "the same row". Without one, SQLite reports an error.
  - q: Why add a WHERE to the DO UPDATE part (only update when a value differs)?
    choices: ['It is required syntax', 'So unchanged rows are not rewritten, which keeps audit columns and change counts honest', 'To make inserts faster']
    ans: 1
    why: Without it every matching row is "updated" even when nothing changed, which bumps updated_at and hides what really changed.
sources:
  - 'PostgreSQL documentation, INSERT (ON CONFLICT) https://www.postgresql.org/docs/current/sql-insert.html'
  - 'SQLite documentation, UPSERT https://www.sqlite.org/lang_upsert.html'
  - 'Microsoft Learn, MERGE (Transact-SQL) https://learn.microsoft.com/en-us/sql/t-sql/statements/merge-transact-sql'
---

**Module 7 · about 30 minutes · read first: 7.1.** You'll be able to load a dimension with an upsert, load a fact table incrementally without duplicates, preview a load before running it, and read the same logic as a SQL Server MERGE.

<div class="bigidea">An upsert updates the rows that already exist and inserts the ones that do not, so loading a batch never creates duplicates.</div>

**In everyday terms:** updating a contact list from a new file. If the person is already there, fix their number. If not, add them.

## 1. Why this matters

Rebuilding every table from scratch each night works while the data is small. Soon it takes too long, or it loses history. Real warehouses load **incrementally**: insert what is new, update what changed, leave the rest alone. That one statement, MERGE in SQL Server, Snowflake and BigQuery, or INSERT ... ON CONFLICT in PostgreSQL and SQLite, is in almost every load job you will read or write.

<div class="meaning">

<dl>
<dt>Full reload</dt><dd>Empty the target and load everything again.</dd>
<dt>Incremental load</dt><dd>Load only what is new or changed.</dd>
<dt>Upsert</dt><dd>Update if the key exists, otherwise insert.</dd>
<dt>Conflict target</dt><dd>The key column the upsert checks for an existing row.</dd>
<dt>MERGE</dt><dd>The SQL Server / standard form of an upsert.</dd>
<dt>Soft delete</dt><dd>Mark a row as deleted instead of removing it.</dd>
<dt>Physical meaning</dt><dd>Existing rows are changed in place and missing rows are added. The row count grows only by the number of new keys.</dd>
</dl>

</div>

<div class="myth">

**"To load a batch I can just INSERT it."** Plain INSERT of a key that already exists either fails or creates a duplicate. Use an upsert keyed on the business key.

</div>

## 2. Full reload or incremental?

- A **full reload** empties the target and inserts everything again. Simple and always correct, but slow on big tables, and any history stored only in the target is lost.
- An **incremental load** compares a fresh **source** batch (usually a staging table) with the **target** and applies only the differences.

An **upsert** ("update or insert") is the core of an incremental load: for each source row, if its key already exists in the target, update it; otherwise insert it. MERGE is the general form, which can also delete.

Press Next day, then Load changes, then Re-run same load with each write mode.

<figure class="fig" data-fig="@data-watermark-load"><figcaption>Notice that the watermark limits what is copied, and that MERGE is safe to repeat while a blind APPEND makes duplicates.</figcaption></figure>


## 3. Set up a target and a new batch

The target is dim_product, loaded yesterday. It has a primary key on product_id, which an upsert needs.

```sql
-- noviz
DROP TABLE IF EXISTS dim_product;
CREATE TABLE dim_product (
  product_id INTEGER PRIMARY KEY, product_name TEXT, brand TEXT,
  unit_price REAL, unit_cost REAL, updated_at TEXT);
INSERT INTO dim_product
SELECT product_id, product_name, brand, unit_price, unit_cost, '2025-12-30'
FROM products;
SELECT COUNT(*) AS products FROM dim_product
```

Today's batch arrives in staging: the same 61 products, but coffee beans and avocados have new prices, and two new products launched.

```sql
-- noviz
DROP TABLE IF EXISTS stg_products;
CREATE TABLE stg_products AS
SELECT product_id, product_name, brand, unit_price, unit_cost FROM products;
UPDATE stg_products SET unit_price = 21.99, unit_cost = 13.95 WHERE product_id = 28;
UPDATE stg_products SET unit_price = 6.49 WHERE product_id = 4;
INSERT INTO stg_products VALUES
  (62, 'Oat milk 1.75 L', 'Green Field', 4.79, 2.90),
  (63, 'Air fryer', 'Hearth & Co', 99.99, 58.00);
SELECT COUNT(*) AS staged FROM stg_products
```

## 4. Preview the load

Before changing a table, look at what will happen. A LEFT JOIN from source to target sorts every staged row into new, changed or unchanged:

```sql
-- try
SELECT CASE WHEN t.product_id IS NULL THEN 'new'
            WHEN s.unit_price <> t.unit_price OR s.unit_cost <> t.unit_cost THEN 'changed'
            ELSE 'unchanged' END AS action,
       COUNT(*) AS products
FROM stg_products s
LEFT JOIN dim_product t ON t.product_id = s.product_id
GROUP BY action
ORDER BY action
```

2 changed, 2 new, 59 unchanged. That is what the load should do, and it is the first thing to check if a load looks wrong. Look at the changes side by side before applying them:

```sql
-- try
SELECT s.product_id, s.product_name, t.unit_price AS old_price, s.unit_price AS new_price
FROM stg_products s
JOIN dim_product t ON t.product_id = s.product_id
WHERE s.unit_price <> t.unit_price OR s.unit_cost <> t.unit_cost
```

## 5. The upsert

SQLite (and PostgreSQL) write it as an INSERT with an `ON CONFLICT` clause. `excluded` means "the row I tried to insert":

```sql
-- noviz
INSERT INTO dim_product (product_id, product_name, brand, unit_price, unit_cost, updated_at)
SELECT product_id, product_name, brand, unit_price, unit_cost, '2025-12-31'
FROM stg_products
WHERE true
ON CONFLICT (product_id) DO UPDATE SET
  product_name = excluded.product_name,
  brand        = excluded.brand,
  unit_price   = excluded.unit_price,
  unit_cost    = excluded.unit_cost,
  updated_at   = excluded.updated_at
WHERE dim_product.unit_price <> excluded.unit_price
   OR dim_product.unit_cost  <> excluded.unit_cost
   OR dim_product.product_name <> excluded.product_name
```

The message says 4 rows changed: 2 inserted, 2 updated. Three details:

- `WHERE true` after the SELECT looks odd but is needed in SQLite: without it, the parser can't tell whether `ON` starts a join condition or the conflict clause.
- The `WHERE` on the DO UPDATE means unchanged rows are not touched, so their `updated_at` stays honest.
- Run it again: 0 rows changed. A load you can safely re-run is **idempotent** ([Lesson 7.3](/learn/courses/data-modelling/audit-columns/)).

```sql
-- try
SELECT product_id, product_name, unit_price, unit_cost, updated_at
FROM dim_product
WHERE updated_at = '2025-12-31'
ORDER BY product_id
```

The conflict target must be a primary key or unique column. Pointing it at another column fails:

```sql
-- fails
INSERT INTO dim_product (product_id, product_name, brand, unit_price, unit_cost, updated_at)
SELECT product_id, product_name, brand, unit_price, unit_cost, '2025-12-31'
FROM stg_products WHERE true
ON CONFLICT (product_name) DO NOTHING
```

## 6. The same load as MERGE

SQL Server, Azure SQL, Snowflake, BigQuery and PostgreSQL 15+ have MERGE. Here is the load above in T-SQL (it does not run in this page's SQLite):

```tsql
MERGE dbo.dim_product AS t
USING stg.products AS s
   ON t.product_id = s.product_id
WHEN MATCHED AND (t.unit_price <> s.unit_price
              OR t.unit_cost  <> s.unit_cost
              OR t.product_name <> s.product_name) THEN
    UPDATE SET product_name = s.product_name, brand = s.brand,
               unit_price = s.unit_price, unit_cost = s.unit_cost,
               updated_at = SYSUTCDATETIME()
WHEN NOT MATCHED BY TARGET THEN
    INSERT (product_id, product_name, brand, unit_price, unit_cost, updated_at)
    VALUES (s.product_id, s.product_name, s.brand, s.unit_price, s.unit_cost, SYSUTCDATETIME())
WHEN NOT MATCHED BY SOURCE THEN
    UPDATE SET is_deleted = 1;   -- soft delete: the product vanished from the source
```

Read it as three cases: matched and changed → update; in source only → insert; in target only → here, flag as deleted. In SQLite you write the third case as a separate UPDATE or DELETE. Two warnings that catch everyone:

- If the source has **two rows with the same key**, MERGE fails ("attempted to UPDATE or DELETE the same row more than once"). SQLite's upsert silently lets the last one win. De-duplicate staging first.
- MERGE in T-SQL must end with a semicolon.

References: [MERGE (Transact-SQL)](https://learn.microsoft.com/en-us/sql/t-sql/statements/merge-transact-sql) and [SQLite UPSERT](https://www.sqlite.org/lang_upsert.html) (checked 22 Nov 2026, check the official page).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** an upsert splits the source S into two disjoint sets by key: keys already in the target T, and keys that are not. Matched rows are updated, the rest inserted, so afterwards every source key appears in T exactly once.

**Equation:** with K(·) the set of keys, new = K(S) \ K(T), matched = K(S) ∩ K(T). After the load, K(T′) = K(T) ∪ K(S). Here |K(T)| = 61, |K(S)| = 63, |new| = 2, so |K(T′)| = 63. The update is **idempotent**: applying the same S twice leaves T′ unchanged, f(f(T)) = f(T).

**Analogy:** updating your phone's contacts from a list. Names you already have get their numbers refreshed; names you don't have get added; nobody is listed twice.

**Try it:** the target has 100 keys, the batch has 30 keys, 25 of which already exist. How many rows after the upsert? (105.)
</details>

Watch it happen, one step at a time (any live box below has a **Show how it runs** button that animates the real query):

<div class="steps">
<div class="step"><b>Target.</b> <table class="lk-tbl"><tr><th>id</th><th>city</th></tr><tr><td>1</td><td>Toronto</td></tr><tr><td>2</td><td>Halifax</td></tr></table></div>
<div class="step"><b>New batch.</b> <table class="lk-tbl"><tr><th>id</th><th>city</th></tr><tr><td>2</td><td>Ottawa</td></tr><tr><td>3</td><td>Calgary</td></tr></table> Id 2 exists; id 3 is new.</div>
<div class="step"><b>Update id 2.</b> <table class="lk-tbl"><tr><th>id</th><th>city</th></tr><tr><td>1</td><td>Toronto</td></tr><tr><td>2</td><td><mark>Ottawa</mark></td></tr></table></div>
<div class="step"><b>Insert id 3.</b> <table class="lk-tbl"><tr><th>id</th><th>city</th></tr><tr><td>1</td><td>Toronto</td></tr><tr><td>2</td><td>Ottawa</td></tr><tr><td><mark>3</mark></td><td><mark>Calgary</mark></td></tr></table></div>
<div class="step"><b>Re-run.</b> The same batch changes nothing, so the load is safe to repeat.</div>
</div>

<div class="problem" data-problem="dm-merge-rows"></div>

<div class="problem" data-problem="dm-hwm-load"></div>

## 7. Worked example: an incremental fact load

Facts usually only gain rows. The safe pattern: give the fact table a key at its grain (here order and product, one row per order line), load a batch that **overlaps** the last load a little, and skip lines you already have. Overlap protects you from late or re-sent rows.

```sql
-- noviz
DROP TABLE IF EXISTS fact_order_lines;
CREATE TABLE fact_order_lines (order_id INTEGER, product_id INTEGER, order_date TEXT,
  quantity INTEGER, sales_amount REAL, PRIMARY KEY (order_id, product_id));
-- yesterday's load: everything up to 30 December
INSERT INTO fact_order_lines
SELECT o.order_id, i.product_id, o.order_date, i.quantity,
       ROUND(i.quantity * i.unit_price * (1 - i.discount), 2)
FROM orders o JOIN order_items i ON i.order_id = o.order_id
WHERE o.order_date <= '2025-12-30';
SELECT COUNT(*) AS lines_after_day_1 FROM fact_order_lines
```

1. Yesterday's load holds 7,290 lines.
2. Today's batch covers 30 and 31 December: 32 lines already loaded plus 20 new ones, 52 in all.
3. With `ON CONFLICT DO NOTHING` the 32 repeats are skipped and only 20 are inserted:

```sql
-- noviz
INSERT INTO fact_order_lines
SELECT o.order_id, i.product_id, o.order_date, i.quantity,
       ROUND(i.quantity * i.unit_price * (1 - i.discount), 2)
FROM orders o JOIN order_items i ON i.order_id = o.order_id
WHERE o.order_date >= '2025-12-30'
ON CONFLICT (order_id, product_id) DO NOTHING;
SELECT COUNT(*) AS lines_after_day_2 FROM fact_order_lines
```

7,310 lines: exactly the number in order_items. Without the primary key, those 32 lines would have been loaded twice and December sales overstated.

## 8. Practice

```sql
-- exercise: Show the products in dim_product whose price is higher than in the original products table, with the old and new price.
-- hint: JOIN dim_product to products on product_id and compare unit_price.
SELECT d.product_id, d.unit_price
FROM dim_product d
-- answer:
SELECT d.product_id, d.product_name, p.unit_price AS old_price, d.unit_price AS new_price
FROM dim_product d
JOIN products p ON p.product_id = d.product_id
WHERE d.unit_price > p.unit_price
```

```sql
-- exercise: Upsert a price change: product 38 (Kettle) now costs 49.99. Write an INSERT ... ON CONFLICT that updates unit_price and sets updated_at to '2026-01-02', then show product 38.
-- hint: INSERT INTO dim_product (product_id, unit_price, updated_at) VALUES (38, 49.99, '2026-01-02') ON CONFLICT (product_id) DO UPDATE SET unit_price = excluded.unit_price, updated_at = excluded.updated_at; then SELECT it.
SELECT product_id, product_name, unit_price, updated_at
FROM dim_product
WHERE product_id = 38
-- answer:
INSERT INTO dim_product (product_id, unit_price, updated_at)
VALUES (38, 49.99, '2026-01-02')
ON CONFLICT (product_id) DO UPDATE SET
  unit_price = excluded.unit_price,
  updated_at = excluded.updated_at;
SELECT product_id, product_name, unit_price, updated_at
FROM dim_product
WHERE product_id = 38
```

```sql
-- exercise: Check the incremental fact load: count the lines in fact_order_lines for each of the last two days of 2025.
-- hint: WHERE order_date >= '2025-12-30', GROUP BY order_date.
SELECT order_date
FROM fact_order_lines
WHERE order_date >= '2025-12-30'
-- answer:
SELECT order_date, COUNT(*) AS lines
FROM fact_order_lines
WHERE order_date >= '2025-12-30'
GROUP BY order_date
```

<div class="keypoints">

- Upsert = update existing keys, insert new ones.
- Use incremental loads with a high-water mark for big tables.
- Preview a load with a SELECT before running it.
- MERGE and ON CONFLICT do the same job in different dialects.

</div>

**New words:** *full reload*, *incremental load*, *upsert*, *MERGE*, *conflict target*, *excluded*, *soft delete*.
