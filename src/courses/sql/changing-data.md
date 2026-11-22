---
title: 'Changing data: INSERT, UPDATE, DELETE and transactions'
seoTitle: 'SQL INSERT, UPDATE, DELETE and transactions for analysts'
summary: 'Add, change and remove rows safely: the SELECT-first habit, why a missing WHERE is dangerous, and how BEGIN, COMMIT and ROLLBACK let you undo a mistake. Practise on a copy of Northbay''s price list.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'What does UPDATE price_list SET unit_price = 0 do with no WHERE?'
    choices: ['Nothing, because WHERE is required', 'Sets the price of every row to 0', 'Sets the price of the first row to 0']
    ans: 1
    why: 'Without WHERE, UPDATE and DELETE act on every row in the table. That is why you run the WHERE as a SELECT first.'
  - q: 'You ran BEGIN, then a DELETE that removed too many rows. What undoes it?'
    choices: ['COMMIT', 'ROLLBACK', 'UNDO']
    ans: 1
    why: 'ROLLBACK throws away every change since BEGIN. COMMIT would make them permanent.'
  - q: What is the SELECT-first habit?
    choices: ['Always start a script with SELECT *', 'Before an UPDATE or DELETE, run a SELECT with the same WHERE to see exactly which rows will change', 'Use SELECT instead of UPDATE']
    ans: 1
    why: 'If the SELECT shows 6 rows, the UPDATE will change those 6 rows. If it shows 6,000, you have caught a mistake before it happened.'
sources:
  - 'SQLite documentation: INSERT, UPDATE and DELETE https://www.sqlite.org/lang_insert.html'
  - 'SQLite documentation: Transactions (BEGIN, COMMIT, ROLLBACK) https://www.sqlite.org/lang_transaction.html'
  - 'SQLite documentation: UPSERT https://www.sqlite.org/lang_upsert.html'
  - 'Microsoft Learn: Transactions (Transact-SQL) https://learn.microsoft.com/en-us/sql/t-sql/language-elements/transactions-transact-sql'
---

**Module 9 · about 30 minutes · read first: 1.3, 2.2.** You'll be able to insert, update and delete rows, and wrap changes in a transaction so you can undo them.

<div class="bigidea">INSERT, UPDATE and DELETE change the data for everyone, so check the rows first with a SELECT, and wrap the change in a transaction that you can roll back.</div>

**In everyday terms:** editing a shared spreadsheet with "suggest changes" turned on. You see exactly what would change, and nothing is final until you press accept (COMMIT) or reject (ROLLBACK).

## 1. Why this matters

Analysts mostly read data, but sooner or later you will load a lookup table, fix a mislabelled category, or clear out test rows in a sandbox. These statements change data for everyone, and there is no Undo button unless you make one. This lesson is about doing it safely. Interviewers ask about transactions, and about the difference between DELETE, TRUNCATE and DROP.

## 2. Work on a copy

The SQL that changes data is called **DML** (data manipulation language): INSERT, UPDATE and DELETE. Practise on a copy, never on the real thing. `CREATE TABLE ... AS SELECT` makes a new table from a query's result. Here is a price list for the six Electronics products:

```sql
-- noviz
DROP TABLE IF EXISTS price_list;
CREATE TABLE price_list AS
SELECT product_id, product_name, unit_price
FROM products
WHERE category_id = 10;
SELECT * FROM price_list
```

Six rows, from Wireless earbuds at $79.99 down to a USB-C cable at $12.99. Everything below changes `price_list` only. (If you ever want a clean start, press **Reset database** under any editor.)

Step through the transfer, then switch the crash and the reader settings.

<div class="steps" data-fig="@data-transaction">
<div class="step">Both accounts start with 500 and 200: the total is 700.</div>
<div class="step">BEGIN: the transaction opens. Nothing is visible to others yet.</div>
<div class="step">UPDATE A: 100 leaves account A, but the transfer is half done.</div>
<div class="step">UPDATE B: 100 arrives in account B.</div>
<div class="step">COMMIT: both changes become permanent and visible together.</div>
</div>


## 3. INSERT: adding rows

`INSERT INTO table (columns) VALUES (...)` adds rows. Always list the columns: then the statement still works if someone adds a column to the table later.

```sql
-- noviz
INSERT INTO price_list (product_id, product_name, unit_price)
VALUES (62, 'Laptop stand', 29.99),
       (63, 'HDMI cable', 14.99);
SELECT * FROM price_list ORDER BY product_id
```

Run it twice and you get the two new products twice: INSERT doesn't check for duplicates unless the table has a key that forbids them. You can also insert the result of a query, which is how analysts usually fill tables: `INSERT INTO t (cols) SELECT ... FROM ...`.

If the number of values doesn't match the columns, the database refuses:

```sql
-- fails
INSERT INTO price_list (product_id, product_name, unit_price)
VALUES (64, 'Webcam')
```

## 4. UPDATE: changing rows, SELECT first

`UPDATE table SET column = value WHERE condition` changes the rows that match. The WHERE is everything: **without it, every row changes**. So build the habit of running the WHERE as a SELECT first.

Step 1, look:

```sql
-- try
SELECT product_id, product_name, unit_price
FROM price_list
WHERE unit_price < 20
```

Step 2, change exactly those rows (a 5% price rise) and check:

```sql
-- noviz
UPDATE price_list
SET unit_price = ROUND(unit_price * 1.05, 2)
WHERE unit_price < 20;
SELECT * FROM price_list ORDER BY product_id
```

Each run raises the prices again, because UPDATE uses the current value. That is another reason to look before and after.

## 5. DELETE: removing rows

`DELETE FROM table WHERE condition` removes the matching rows. Same rule: SELECT first. Here we remove the two products added in section 3:

```sql
-- noviz
DELETE FROM price_list
WHERE product_id > 61;
SELECT COUNT(*) AS products FROM price_list
```

Three similar-sounding commands, three different jobs:

- `DELETE FROM t WHERE ...` removes some rows (or all, with no WHERE). It can be rolled back.
- `TRUNCATE TABLE t` (SQL Server, PostgreSQL) empties the whole table quickly. SQLite has no TRUNCATE; a DELETE with no WHERE does the same.
- `DROP TABLE t` removes the table itself, structure and all.

## 6. Transactions: an undo button

A **transaction** groups statements so they happen all together or not at all. Start one with `BEGIN`, then either `COMMIT` (keep the changes) or `ROLLBACK` (throw them away). Until you commit, nothing is final.

```sql
-- noviz
BEGIN;
DELETE FROM price_list;
SELECT COUNT(*) AS rows_inside_transaction FROM price_list;
ROLLBACK;
SELECT COUNT(*) AS rows_after_rollback FROM price_list
```

The DELETE emptied the table (the middle SELECT would show 0), but ROLLBACK put every row back: the final count is 6. Use this when you are not sure: BEGIN, make the change, SELECT to check, then COMMIT or ROLLBACK. (SQL Server writes `BEGIN TRANSACTION` and `COMMIT TRANSACTION`; PostgreSQL accepts `BEGIN` like SQLite. BigQuery supports transactions in multi-statement queries.)

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a table is a set of rows, and each DML statement maps one set to another. A transaction makes a sequence of those maps **atomic**: the database moves from the old set to the final set in one step, or not at all.

**Equation:** DELETE with condition p gives T′ = T − σ<sub>p</sub>(T). UPDATE gives T′ = σ<sub>¬p</sub>(T) ∪ f(σ<sub>p</sub>(T)), where f changes the SET columns. INSERT gives T′ = T ∪ R (as a bag, so duplicates add up). The SELECT-first habit simply computes σ<sub>p</sub>(T) before you apply the change.

**Analogy:** a bank transfer: money leaves one account and arrives in another. If the system crashes halfway, a transaction makes sure you don't lose the money in between. The four promises are known as ACID: atomic, consistent, isolated, durable.

**Try it:** a table has 6 rows; 2 have price < 20. After `DELETE ... WHERE unit_price < 20`, how many rows are left? (6 − 2 = 4.) And after `UPDATE ... WHERE unit_price < 20`? (Still 6: UPDATE never changes the count.)
</details>

<div class="meaning">

<dl>
<dt>DML</dt><dd>Data manipulation language: INSERT, UPDATE and DELETE.</dd>
<dt>INSERT INTO t (cols) VALUES …</dt><dd>Adds rows. List the columns so the statement survives new columns.</dd>
<dt>UPDATE t SET … WHERE …</dt><dd>Changes the matching rows. With no WHERE, every row changes.</dd>
<dt>DELETE FROM t WHERE …</dt><dd>Removes the matching rows. With no WHERE, the table is emptied.</dd>
<dt>BEGIN … COMMIT / ROLLBACK</dt><dd>A transaction: all the changes happen together, or none of them do.</dd>
<dt>Upsert</dt><dd>Insert, or update if the key already exists (ON CONFLICT or MERGE).</dd>
<dt>Physical meaning</dt><dd>A SELECT only reads; these statements rewrite the stored table. DELETE takes away the rows the WHERE picks, INSERT adds rows, and UPDATE keeps the row count but rewrites columns in place. Inside a transaction the changes are held back until COMMIT, and ROLLBACK puts the table back exactly as it was.</dd>
</dl>

</div>

<div class="myth">

**"I'll just run the UPDATE; I know which rows it hits."** One forgotten or wrong WHERE changes every row, and there is no Undo. Run the WHERE as a SELECT first, count the rows, then make the change inside BEGIN … COMMIT so a mistake can be rolled back.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The table.</b> <table class="lk-tbl"><tr><th>product_id</th><th>price</th></tr><tr><td>57</td><td>79.99</td></tr><tr><td>58</td><td>24.99</td></tr><tr><td>59</td><td>19.99</td></tr><tr><td>60</td><td>12.99</td></tr></table></div>
<div class="step"><b>SELECT first.</b> <code>WHERE price &lt; 20</code> finds 2 rows. <table class="lk-tbl"><tr><th>product_id</th><th>price</th></tr><tr><td><mark>59</mark></td><td><mark>19.99</mark></td></tr><tr><td><mark>60</mark></td><td><mark>12.99</mark></td></tr></table></div>
<div class="step"><b>BEGIN; UPDATE … SET price = price × 1.05 WHERE price &lt; 20.</b> Still 4 rows; 2 changed. <table class="lk-tbl"><tr><th>product_id</th><th>price</th></tr><tr><td>57</td><td>79.99</td></tr><tr><td>58</td><td>24.99</td></tr><tr><td>59</td><td><mark>20.99</mark></td></tr><tr><td>60</td><td><mark>13.64</mark></td></tr></table></div>
<div class="step"><b>Oops: DELETE FROM price_list</b> (no WHERE). Inside the transaction the table is empty. <table class="lk-tbl"><tr><th>product_id</th><th>price</th></tr><tr><td><mark>(no rows)</mark></td><td></td></tr></table></div>
<div class="step"><b>ROLLBACK.</b> Everything since BEGIN is undone, including the price rise: all 4 rows are back as they were.</div>
</div>

The change boxes here are not animated; any live box with a SELECT has a **Show how it runs** button that animates the real query.

<div class="problem" data-problem="sql-transaction-rows"></div>

## 7. Worked example

*Task:* the buyer says "the Smart bulb and the USB-C cable go up to $21.99 and $13.99; everything else stays." Do it safely.

1. SELECT with the planned WHERE: `WHERE product_id IN (59, 60)` shows exactly 2 rows. Good.
2. BEGIN, then one UPDATE per price, using CASE so it's one statement.
3. SELECT to check: 2 rows changed, 4 untouched.
4. COMMIT.

```sql
-- noviz
BEGIN;
UPDATE price_list
SET unit_price = CASE product_id WHEN 59 THEN 21.99 WHEN 60 THEN 13.99 END
WHERE product_id IN (59, 60);
SELECT * FROM price_list ORDER BY product_id;
COMMIT
```

Notice that the CASE has no ELSE. Without the WHERE, every other product would have been set to NULL. The WHERE is doing real work.

A related pattern you will meet: **upsert** ("insert, or update if it already exists"). SQLite and PostgreSQL write it as `INSERT ... ON CONFLICT (key) DO UPDATE SET ...`; SQL Server and BigQuery use `MERGE`.

## 8. Practice

Each exercise rebuilds the price list on its first lines, so you can run it as often as you like.

```sql
-- exercise: Give every product in the price list that costs $40 or more a 10% discount (round to 2 decimals), then show the whole list ordered by product_id.
-- hint: UPDATE price_list SET unit_price = ROUND(unit_price * 0.9, 2) WHERE unit_price >= 40; then SELECT.
DROP TABLE IF EXISTS price_list;
CREATE TABLE price_list AS
SELECT product_id, product_name, unit_price FROM products WHERE category_id = 10;
SELECT * FROM price_list ORDER BY product_id
-- answer:
DROP TABLE IF EXISTS price_list;
CREATE TABLE price_list AS
SELECT product_id, product_name, unit_price FROM products WHERE category_id = 10;
UPDATE price_list SET unit_price = ROUND(unit_price * 0.9, 2) WHERE unit_price >= 40;
SELECT * FROM price_list ORDER BY product_id
```

```sql
-- exercise: Inside a transaction, delete every product under $20, check how many rows are left, then ROLLBACK and show the count again. The last result should show all 6 rows are back.
-- hint: BEGIN; DELETE ... WHERE unit_price < 20; SELECT COUNT(*) ...; ROLLBACK; SELECT COUNT(*) ...
DROP TABLE IF EXISTS price_list;
CREATE TABLE price_list AS
SELECT product_id, product_name, unit_price FROM products WHERE category_id = 10;
DELETE FROM price_list WHERE unit_price < 20;
SELECT COUNT(*) AS products FROM price_list
-- answer:
DROP TABLE IF EXISTS price_list;
CREATE TABLE price_list AS
SELECT product_id, product_name, unit_price FROM products WHERE category_id = 10;
BEGIN;
DELETE FROM price_list WHERE unit_price < 20;
SELECT COUNT(*) AS products FROM price_list;
ROLLBACK;
SELECT COUNT(*) AS products FROM price_list
```

```sql
-- exercise: Make a table called gold_members holding customer_id, first_name and last_name for every Gold-tier customer, using INSERT ... SELECT into an empty table. Then show how many rows it has.
-- hint: CREATE TABLE gold_members (customer_id INTEGER, first_name TEXT, last_name TEXT); INSERT INTO gold_members (...) SELECT ... FROM customers WHERE loyalty_tier = 'Gold';
DROP TABLE IF EXISTS gold_members;
CREATE TABLE gold_members (customer_id INTEGER, first_name TEXT, last_name TEXT);
SELECT COUNT(*) AS members FROM gold_members
-- answer:
DROP TABLE IF EXISTS gold_members;
CREATE TABLE gold_members (customer_id INTEGER, first_name TEXT, last_name TEXT);
INSERT INTO gold_members (customer_id, first_name, last_name)
SELECT customer_id, first_name, last_name FROM customers WHERE loyalty_tier = 'Gold';
SELECT COUNT(*) AS members FROM gold_members
```

**Try it on your own data:** [[sql-playground]] is a safe place to practise: it works on a copy in your browser, so nothing you change reaches the original file.

<div class="keypoints">

- INSERT adds rows, UPDATE changes them (the count stays the same), DELETE removes them.
- Run the WHERE as a SELECT first: without a WHERE, UPDATE and DELETE hit every row.
- BEGIN, change, check, then COMMIT to keep or ROLLBACK to undo.
- DELETE removes rows, TRUNCATE empties a table fast, DROP removes the table itself.
- Practise on a copy (CREATE TABLE … AS SELECT), never on the real table.

</div>

**New words:** *DML*, *INSERT*, *UPDATE*, *DELETE*, *transaction*, *COMMIT*, *ROLLBACK*, *ACID*, *upsert*.
