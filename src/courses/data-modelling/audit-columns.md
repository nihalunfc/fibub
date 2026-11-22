---
title: 'Audit columns, load logs and idempotent loads'
seoTitle: 'Idempotent ETL loads, audit columns and load logs in SQL'
summary: 'Stamp every warehouse row with the load that wrote it, record every load in a log table, and write loads that give the same result however many times they run. Build all three for Northbay in live SQL, then re-run a load and prove nothing doubled.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: What does it mean for a load to be idempotent?
    choices: ['It runs very fast', 'Running it twice with the same input leaves the table exactly as running it once', 'It never fails']
    ans: 1
    why: Loads get re-run after failures, by schedulers and by people. An idempotent load can be re-run safely; a plain INSERT cannot, because it adds the rows again.
  - q: Which pattern makes a daily fact load idempotent?
    choices: ['INSERT the batch every time', 'Delete the batch''s date window from the target, then insert the batch, in one transaction', 'Run it only once a year']
    ans: 1
    why: Delete-then-insert for the window (or an upsert on the grain key) replaces the batch instead of adding to it. Wrapping both in a transaction means a failure leaves the old rows in place.
  - q: What is a load_id audit column for?
    choices: ['Sorting the dashboard', 'Tracing every row back to the load that wrote it, so a bad load can be found, counted and removed', 'Replacing the primary key']
    ans: 1
    why: With load_id on every row and a row per load in load_log, you can answer "which load wrote this?" and undo one load without touching the others.
sources:
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley, chapter 19 (ETL subsystems: audit dimension)'
  - 'PostgreSQL documentation, Transactions (tutorial) https://www.postgresql.org/docs/current/tutorial-transactions.html'
  - 'SQLite documentation, Transaction https://www.sqlite.org/lang_transaction.html'
---

**Module 7 · about 30 minutes · read first: 7.2.** You'll be able to add audit columns to warehouse tables, keep a load log, write a daily load that is safe to re-run, and use both to answer "where did this row come from?"

<div class="bigidea">Audit columns and a load log record where each row came from, and an idempotent load can be re-run without making duplicates.</div>

**In everyday terms:** a delivery note stapled to every parcel: who sent it, when, in which van. A re-run is like the driver re-delivering the same parcel, so the shop must notice it already has it.

## 1. Why this matters

Loads fail halfway. Schedulers retry. Someone re-runs last Tuesday by hand. If a re-run doubles the numbers, the CFO's dashboard is wrong and nobody knows why. Teams that trust their warehouse stamp every row with the load that wrote it, log every load, and write loads that can run twice without harm. Interviewers for data engineering and BI roles ask about exactly this.

<div class="meaning">

<dl>
<dt>Audit column</dt><dd>A column such as batch_id or loaded_at that says how a row arrived.</dd>
<dt>Load log</dt><dd>A table with one row per load run.</dd>
<dt>Batch window</dt><dd>The slice of data one run is responsible for.</dd>
<dt>Idempotent</dt><dd>Running the same load twice leaves the same result as once.</dd>
<dt>Transaction</dt><dd>A group of changes that all succeed or all roll back.</dd>
<dt>High-water mark</dt><dd>The latest value already loaded.</dd>
<dt>Physical meaning</dt><dd>Audit columns add a few cheap columns to every table. A delete-then-insert for the window inside a transaction replaces the slice instead of adding to it.</dd>
</dl>

</div>

<div class="myth">

**"If a load fails halfway I can just run it again."** Only if it is idempotent. A load that only appends will duplicate the rows that already went in. Delete the window and insert in one transaction.

</div>

## 2. Audit columns

**Audit columns** are columns that describe the *loading* of a row, not the business:

| Column | Meaning |
|---|---|
| `load_id` | which load wrote the row (points to the load log) |
| `loaded_at` | when that load ran |
| `record_source` | which system the data came from |
| `updated_at` | when the row last changed (dimensions) |
| `row_hash` | fingerprint of the business columns, to spot changes quickly (dimensions) |

They cost a few bytes per row and answer most "what happened?" questions without digging through job logs.

## 3. A load log

A **load log** (or audit table) has one row per load run: what it loaded, the window of data, how many rows it read, deleted and inserted, and whether it finished. Build it and a fact table with audit columns:

```sql
-- noviz
DROP TABLE IF EXISTS load_log;
DROP TABLE IF EXISTS fact_order_lines;
CREATE TABLE load_log (
  load_id INTEGER PRIMARY KEY, table_name TEXT, batch_from TEXT, batch_to TEXT,
  rows_deleted INTEGER, rows_inserted INTEGER, status TEXT, started_at TEXT, finished_at TEXT);
CREATE TABLE fact_order_lines (
  order_id INTEGER, product_id INTEGER, order_date TEXT, quantity INTEGER, sales_amount REAL,
  load_id INTEGER, loaded_at TEXT, record_source TEXT,
  PRIMARY KEY (order_id, product_id));
SELECT name FROM sqlite_master WHERE name IN ('load_log', 'fact_order_lines')
```

## 4. An idempotent load: delete the window, then insert

Each load replaces one **batch window** (a range of dates) in the target: first delete whatever is already there for those dates, then insert the batch. Run it once or five times, the window ends up holding the batch exactly once. The load logs itself as it goes.

The first load brings in history up to the end of November 2025:

```sql
-- noviz
BEGIN;
INSERT INTO load_log (table_name, batch_from, batch_to, status, started_at)
VALUES ('fact_order_lines', '2024-01-01', '2025-11-30', 'running', '2025-12-01 02:00');
UPDATE load_log SET rows_deleted = (SELECT COUNT(*) FROM fact_order_lines
  WHERE order_date BETWEEN '2024-01-01' AND '2025-11-30')
WHERE load_id = (SELECT MAX(load_id) FROM load_log);
DELETE FROM fact_order_lines WHERE order_date BETWEEN '2024-01-01' AND '2025-11-30';
INSERT INTO fact_order_lines
SELECT o.order_id, i.product_id, o.order_date, i.quantity,
       ROUND(i.quantity * i.unit_price * (1 - i.discount), 2),
       (SELECT MAX(load_id) FROM load_log), '2025-12-01 02:00', 'northbay_pos'
FROM orders o JOIN order_items i ON i.order_id = o.order_id
WHERE o.status = 'completed' AND o.order_date BETWEEN '2024-01-01' AND '2025-11-30';
UPDATE load_log SET rows_inserted = changes(), status = 'succeeded', finished_at = '2025-12-01 02:01'
WHERE load_id = (SELECT MAX(load_id) FROM load_log);
COMMIT;
SELECT * FROM load_log
```

`changes()` is SQLite's count of rows changed by the statement just before, the INSERT. Load 1 inserted 6,557 lines. Now the December load. Press **Run** on it twice:

```sql
-- noviz
BEGIN;
INSERT INTO load_log (table_name, batch_from, batch_to, status, started_at)
VALUES ('fact_order_lines', '2025-12-01', '2025-12-31', 'running', '2026-01-01 02:00');
UPDATE load_log SET rows_deleted = (SELECT COUNT(*) FROM fact_order_lines
  WHERE order_date BETWEEN '2025-12-01' AND '2025-12-31')
WHERE load_id = (SELECT MAX(load_id) FROM load_log);
DELETE FROM fact_order_lines WHERE order_date BETWEEN '2025-12-01' AND '2025-12-31';
INSERT INTO fact_order_lines
SELECT o.order_id, i.product_id, o.order_date, i.quantity,
       ROUND(i.quantity * i.unit_price * (1 - i.discount), 2),
       (SELECT MAX(load_id) FROM load_log), '2026-01-01 02:00', 'northbay_pos'
FROM orders o JOIN order_items i ON i.order_id = o.order_id
WHERE o.status = 'completed' AND o.order_date BETWEEN '2025-12-01' AND '2025-12-31';
UPDATE load_log SET rows_inserted = changes(), status = 'succeeded', finished_at = '2026-01-01 02:01'
WHERE load_id = (SELECT MAX(load_id) FROM load_log);
COMMIT;
SELECT load_id, batch_from, batch_to, rows_deleted, rows_inserted, status FROM load_log
```

The first run deletes 0 and inserts 555 lines. The second run (a new load_id) deletes those 555 and inserts the same 555 again. The table still holds every completed line exactly once:

```sql
-- try
SELECT COUNT(*) AS fact_lines, ROUND(SUM(sales_amount), 2) AS sales,
       (SELECT COUNT(*) FROM order_items i JOIN orders o ON o.order_id = i.order_id
        WHERE o.status = 'completed') AS source_lines
FROM fact_order_lines
```

7,112 lines, the same as the source, however many times you ran December. **BEGIN ... COMMIT** makes the delete and insert one **transaction**: if the insert fails, the delete is undone too, and the old December rows stay.

## 5. What a non-idempotent load looks like

For contrast, a plain INSERT into a table with no key. Press **Run** two or three times and watch the count climb:

```sql
-- noviz
CREATE TABLE IF NOT EXISTS naive_fact (order_id INTEGER, product_id INTEGER, sales_amount REAL);
INSERT INTO naive_fact
SELECT o.order_id, i.product_id, ROUND(i.quantity * i.unit_price * (1 - i.discount), 2)
FROM orders o JOIN order_items i ON i.order_id = o.order_id
WHERE o.status = 'completed' AND o.order_date BETWEEN '2025-12-01' AND '2025-12-31';
SELECT COUNT(*) AS december_lines, ROUND(SUM(sales_amount), 2) AS december_sales FROM naive_fact
```

555 lines and $9,136.62 the first time; 1,110 lines and double the sales the second. This is the bug behind many "sales doubled overnight" incidents.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a load is a function L from (table, batch) to a new table. It is **idempotent** when applying it again changes nothing: L(L(T, b), b) = L(T, b). Delete-then-insert for a window W achieves it, because the result in W depends only on the batch, not on what was there before.

**Equation:** delete-then-insert: T′ = (T \ T_W) ∪ b. Apply again: (T′ \ T′_W) ∪ b = (T \ T_W) ∪ b = T′. A plain insert is T′ = T ⊎ b (bag union), and T ⊎ b ⊎ b ≠ T ⊎ b whenever b is not empty.

**Analogy:** pressing a lift's call button. Pressing it five times doesn't call five lifts. A plain insert is a doorbell that rings every time.

**Try it:** a window holds 100 rows and the batch has 110. After two runs of delete-then-insert, how many rows in the window? (110.) After two runs of plain insert on an empty window? (220.)
</details>

Watch it happen, one step at a time (any live box below has a **Show how it runs** button that animates the real query):

<div class="steps">
<div class="step"><b>Fact with audit columns.</b> <table class="lk-tbl"><tr><th>sale</th><th>amount</th><th>batch_id</th><th>loaded_at</th></tr><tr><td>1</td><td>40</td><td><mark>B7</mark></td><td><mark>Nov 20</mark></td></tr><tr><td>2</td><td>60</td><td><mark>B7</mark></td><td><mark>Nov 20</mark></td></tr></table> Every row says which load brought it.</div>
<div class="step"><b>Load log.</b> <table class="lk-tbl"><tr><th>batch_id</th><th>window</th><th>rows</th><th>status</th></tr><tr><td>B7</td><td>Nov 20</td><td>2</td><td>ok</td></tr></table></div>
<div class="step"><b>Run again, append only.</b> <table class="lk-tbl"><tr><th>sale</th><th>batch_id</th></tr><tr><td>1</td><td>B7</td></tr><tr><td>2</td><td>B7</td></tr><tr><td><mark>1</mark></td><td><mark>B8</mark></td></tr><tr><td><mark>2</mark></td><td><mark>B8</mark></td></tr></table> Duplicates.</div>
<div class="step"><b>Run again, idempotent.</b> Delete the window, then insert, in one transaction. <table class="lk-tbl"><tr><th>sale</th><th>batch_id</th></tr><tr><td>1</td><td><mark>B8</mark></td></tr><tr><td>2</td><td><mark>B8</mark></td></tr></table></div>
<div class="step"><b>Trace a bad row.</b> Its batch_id points to the log, which points to the source file.</div>
</div>

<div class="problem" data-problem="dm-rerun-dupes"></div>

## 6. Worked example: tracing a bad load

On 2 January an analyst asks why December sales look right but one line shows the wrong amount. With audit columns, the trail is three queries. First, which load wrote the row? Ask the row itself:

```sql
-- try
SELECT order_id, product_id, sales_amount, load_id, loaded_at, record_source
FROM fact_order_lines
WHERE order_id = 5050
```

It was written by the latest December load. Then:

1. What did that load do? Look it up in load_log: its window, rows deleted and inserted, and status.
2. How many rows did each load leave behind? Group the fact by load_id:

```sql
-- try
SELECT f.load_id, l.batch_from, l.batch_to, COUNT(*) AS rows_now, l.rows_inserted
FROM fact_order_lines f
JOIN load_log l ON l.load_id = f.load_id
GROUP BY f.load_id, l.batch_from, l.batch_to, l.rows_inserted
ORDER BY f.load_id
```

Load 1 still owns 6,557 rows, and the latest December load owns 555. Earlier December loads own none: their rows were replaced. If the source had sent bad data, you would fix it at source and re-run just the December window. Nothing outside it is touched.

**A note on watermarks.** Another common pattern loads "everything newer than the last thing I loaded", using a stored **high-water mark** such as `MAX(order_date)` in the target. It is efficient, but late-arriving rows with an older date are missed. Combining a watermark with a small overlap window and delete-then-insert (or an upsert, [Lesson 7.2](/learn/courses/data-modelling/merge-loads/)) gets the best of both.

The ETL course shows how to schedule and log loads like these into Azure SQL in [Module 4](/learn/courses/etl/azure-sql-hands-on/).

## 7. Practice

```sql
-- exercise: Show the most recent successful load of fact_order_lines: its load_id, window and rows inserted.
-- hint: WHERE status = 'succeeded', ORDER BY load_id DESC, LIMIT 1.
SELECT load_id, batch_from, batch_to, rows_inserted
FROM load_log
-- answer:
SELECT load_id, batch_from, batch_to, rows_inserted
FROM load_log
WHERE status = 'succeeded' AND table_name = 'fact_order_lines'
ORDER BY load_id DESC
LIMIT 1
```

```sql
-- exercise: Reconcile December: return the number of December 2025 lines in fact_order_lines and the number of completed December 2025 lines in the source, side by side.
-- hint: Two scalar subqueries. The source needs order_items joined to orders, with status = 'completed'.
SELECT COUNT(*) AS fact_december
FROM fact_order_lines
-- answer:
SELECT (SELECT COUNT(*) FROM fact_order_lines
        WHERE order_date BETWEEN '2025-12-01' AND '2025-12-31') AS fact_december,
       (SELECT COUNT(*) FROM order_items i JOIN orders o ON o.order_id = i.order_id
        WHERE o.status = 'completed' AND o.order_date BETWEEN '2025-12-01' AND '2025-12-31') AS source_december
```

```sql
-- exercise: Which record_source and loaded_at values are in the fact table, and how many rows has each?
-- hint: GROUP BY record_source, loaded_at.
SELECT record_source
FROM fact_order_lines
-- answer:
SELECT record_source, loaded_at, COUNT(*) AS rows
FROM fact_order_lines
GROUP BY record_source, loaded_at
```

<div class="keypoints">

- Every table gets batch_id and loaded_at.
- A load log records each run, its window and its result.
- Idempotent: delete the window then insert, inside a transaction.
- A bad row can be traced back through its batch.

</div>

**New words:** *audit column*, *load log*, *batch window*, *idempotent*, *transaction*, *high-water mark*.
