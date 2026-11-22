---
title: Indexes
seoTitle: 'SQL indexes explained: when and how to create one'
summary: 'What an index is, how to create one, why column order matters in a composite index, what a covering index is, and what indexes cost. Check every change with EXPLAIN QUERY PLAN on Northbay.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: 'You have an index on (store_id, order_date). Which WHERE can search it?'
    choices: ['WHERE order_date >= ''2025-12-01'' only', 'WHERE store_id = 12, or store_id = 12 AND a date condition', 'Neither; composite indexes need both columns with =']
    ans: 1
    why: 'A composite index is sorted by its first column, then by the second within each first value. It helps when the query fixes the leading column; a condition on the second column alone cannot use the order.'
  - q: What is the main cost of adding an index?
    choices: ['Queries return different answers', 'Every INSERT, UPDATE and DELETE must update the index too, and it takes disk space', 'Nothing; indexes are free']
    ans: 1
    why: 'An index is a second sorted copy of data. Reading gets faster, but every write has to keep the copy in step.'
  - q: What makes an index covering for a query?
    choices: ['It is on the primary key', 'It contains every column the query needs, so the table itself is never read', 'It covers every row in the table']
    ans: 1
    why: 'If the index holds all the columns the query uses, the database answers from the index alone and skips the trip to the table.'
sources:
  - 'SQLite documentation: CREATE INDEX https://www.sqlite.org/lang_createindex.html'
  - 'SQLite documentation: Query Planning (how indexes are used) https://www.sqlite.org/queryplanner.html'
  - 'PostgreSQL documentation: Multicolumn Indexes https://www.postgresql.org/docs/current/indexes-multicolumn.html'
  - 'Microsoft Learn: Create indexes with included columns https://learn.microsoft.com/en-us/sql/relational-databases/indexes/create-indexes-with-included-columns'
---

**Module 9 · about 30 minutes · read first: 9.1.** You'll be able to create, list and drop indexes, choose the column order of a composite index, and say when an index is not worth it.

<div class="bigidea">An index is a sorted copy of some columns with pointers back to the rows, and a composite index only helps queries that fix its first column.</div>

**In everyday terms:** a phone book sorted by last name, then first name. Finding "Patel, Priya" is quick; finding everyone called "Priya" means reading the whole book.

## 1. Why this matters

Most analysts don't design databases, but they do hit slow queries, and the fix is often "ask for an index on that column". Knowing which index to ask for, and why, makes you the person data engineers like working with. Indexes are also a standard interview topic for analyst and BI roles.

## 2. What an index is

An **index** is a separate, sorted copy of one or more columns, each entry pointing back to its row. Databases usually store it as a **B-tree**, a sorted tree that is quick to search and stays sorted as rows are added. Because it is sorted, the database can jump to a value instead of reading the whole table, as [Lesson 9.1](/learn/courses/sql/explain/) showed.

Create one with `CREATE INDEX name ON table(columns)`. Northbay starts with none, so let's add one to order_items, which has 7,310 rows:

```sql
-- noviz
DROP INDEX IF EXISTS idx_items_product;
EXPLAIN QUERY PLAN
SELECT * FROM order_items WHERE product_id = 43
```

```sql
-- noviz
CREATE INDEX IF NOT EXISTS idx_items_product ON order_items(product_id);
EXPLAIN QUERY PLAN
SELECT * FROM order_items WHERE product_id = 43
```

The first plan says SCAN order_items; the second says SEARCH order_items USING INDEX idx_items_product (product_id=?). Same answer, much less reading.

To see which indexes exist, query SQLite's catalogue table. (SQL Server: `sys.indexes`; PostgreSQL: the `pg_indexes` view.)

```sql
-- noviz
SELECT name, tbl_name, sql
FROM sqlite_master
WHERE type = 'index'
```

Drag the table size up to 100 million rows, then press Look up a new id.

<figure class="fig" data-fig="@data-index-lookup"><figcaption>Notice that the scan grows with the table while the index needs only a few page reads.</figcaption></figure>


## 3. Composite indexes: column order matters

A **composite index** covers several columns. It is sorted by the first column, then by the second inside each value of the first, like a phone book sorted by last name, then first name. That order decides which queries it can help.

```sql
-- noviz
CREATE INDEX IF NOT EXISTS idx_orders_store_date ON orders(store_id, order_date);
EXPLAIN QUERY PLAN
SELECT * FROM orders
WHERE store_id = 12 AND order_date >= '2025-12-01'
```

SEARCH ... (store_id=? AND order_date>?): the index finds store 12, then the dates from 1 December inside it. A query on `store_id` alone can use it too. But a query on `order_date` alone cannot, just as a phone book sorted by last name can't find everyone called "Priya":

```sql
-- noviz
CREATE INDEX IF NOT EXISTS idx_orders_store_date ON orders(store_id, order_date);
EXPLAIN QUERY PLAN
SELECT * FROM orders
WHERE order_date >= '2025-12-01'
```

SCAN orders. This is the **leftmost prefix rule**: a composite index helps queries that fix its first column (or first few). A good habit is to put the column you test with `=` first and the one you test with a range (`>=`, `BETWEEN`) last.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a composite index is sorted in **lexicographic order** on the tuple (store_id, order_date), the way words are sorted letter by letter. Rows with the same store_id sit together, sorted by date. Rows with the same date are scattered across every store.

**Equation:** (a₁, b₁) < (a₂, b₂) if a₁ < a₂, or a₁ = a₂ and b₁ < b₂. The rows matching store_id = 12 AND order_date ≥ d form one unbroken block in this order, so finding them costs about log₂ n + k. The rows matching only order_date ≥ d form 12 separate blocks (one per store) or, in general, no single block at all.

**Analogy:** a dictionary sorted by first letter, then second. Words starting "ca" are together; words whose second letter is "a" (bat, cat, hat) are spread over the whole book.

**Try it:** an index on (city, last_name). Can it help `WHERE last_name = 'Patel'`? (No: Patels are spread across every city.) `WHERE city = 'Ottawa' ORDER BY last_name`? (Yes: within Ottawa they are already in order, so no sort is needed.)
</details>

<div class="meaning">

<dl>
<dt>Index</dt><dd>A separate sorted copy of one or more columns, each entry pointing to its row.</dd>
<dt>B-tree</dt><dd>The sorted tree most databases use for indexes: quick to search, stays sorted as rows arrive.</dd>
<dt>Composite index</dt><dd>An index on several columns, sorted by the first, then the second inside it.</dd>
<dt>Leftmost prefix rule</dt><dd>A composite index helps only when the query fixes its first column (or first few).</dd>
<dt>Covering index</dt><dd>Holds every column the query needs, so the table itself is never read.</dd>
<dt>Unique index</dt><dd>Also refuses duplicate values, which makes it a data-quality guard.</dd>
<dt>Physical meaning</dt><dd>Creating an index writes a new, sorted structure next to the table; the table rows don't move. Queries that match its sort order read one small, unbroken block of it. Every INSERT, UPDATE and DELETE must now update that structure too.</dd>
</dl>

</div>

<div class="myth">

**"An index on (store_id, order_date) helps any query on either column."** It is sorted by store first, so rows for one date are scattered across every store. A query on order_date alone can't use it. Put the column you test with = first and the range column last.

</div>

Watch it happen, one step at a time:

<div class="steps">
<div class="step"><b>The table, in arrival order.</b> <table class="lk-tbl"><tr><th>row</th><th>store_id</th><th>day</th></tr><tr><td>1</td><td>2</td><td>14</td></tr><tr><td>2</td><td>1</td><td>3</td></tr><tr><td>3</td><td>2</td><td>2</td></tr><tr><td>4</td><td>1</td><td>20</td></tr></table></div>
<div class="step"><b>CREATE INDEX ON orders(store_id, day).</b> Sorted by store, then day. <table class="lk-tbl"><tr><th>store_id</th><th>day</th><th>row</th></tr><tr><td>1</td><td>3</td><td>2</td></tr><tr><td>1</td><td>20</td><td>4</td></tr><tr><td>2</td><td>2</td><td>3</td></tr><tr><td>2</td><td>14</td><td>1</td></tr></table></div>
<div class="step"><b>store_id = 2 AND day &gt;= 10.</b> One unbroken block. <table class="lk-tbl"><tr><th>store_id</th><th>day</th><th>row</th></tr><tr><td>1</td><td>3</td><td>2</td></tr><tr><td>1</td><td>20</td><td>4</td></tr><tr><td>2</td><td>2</td><td>3</td></tr><tr><td><mark>2</mark></td><td><mark>14</mark></td><td><mark>1</mark></td></tr></table></div>
<div class="step"><b>day &gt;= 10 alone.</b> The matches are in two places, one per store, so the database scans instead. <table class="lk-tbl"><tr><th>store_id</th><th>day</th><th>row</th></tr><tr><td>1</td><td>3</td><td>2</td></tr><tr><td><mark>1</mark></td><td><mark>20</mark></td><td><mark>4</mark></td></tr><tr><td>2</td><td>2</td><td>3</td></tr><tr><td><mark>2</mark></td><td><mark>14</mark></td><td><mark>1</mark></td></tr></table></div>
</div>

The plan boxes in this lesson describe rather than run, so they have no animation; in other lessons any live box with a SELECT has a **Show how it runs** button that animates the real query.

<div class="problem" data-problem="sql-leftmost-prefix"></div>

## 4. Covering indexes

If an index holds every column a query needs, the database never visits the table: it answers from the index alone. That is a **covering index**, and SQLite says so in the plan.

```sql
-- noviz
CREATE INDEX IF NOT EXISTS idx_orders_store_date ON orders(store_id, order_date);
EXPLAIN QUERY PLAN
SELECT order_date FROM orders
WHERE store_id = 12 AND order_date >= '2025-12-01'
```

USING COVERING INDEX: the query only needs store_id and order_date, and both are in the index. Ask for `SELECT *` and the database must fetch each row from the table as well. (SQL Server and PostgreSQL let you add extra columns to an index just for covering, with `INCLUDE (...)`.)

## 5. Indexes on expressions, and unique indexes

You saw that `WHERE lower(email) = ...` can't use an index on `email`. Most databases let you index the expression itself. A **unique index** also refuses duplicate values, which makes it a data-quality check. Northbay has three customers who signed up twice with the same email in capitals ([Lesson 7.4](/learn/courses/sql/duplicates/)), so this fails on purpose:

```sql
-- fails
CREATE UNIQUE INDEX ux_customers_email ON customers(lower(email))
```

The error names the index: some lower-cased emails appear twice. Clean the duplicates first, and the unique index then stops new ones arriving.

## 6. What indexes cost, and when to skip them

Indexes are not free:

- **Writes get slower.** Every INSERT, UPDATE and DELETE must update each index on the table.
- **They take space.** Each index is another copy of its columns.
- **Some don't help.** On a tiny table (Northbay's 12 stores), a scan is already instant. On a column with few distinct values, such as `channel` (store or online), an index narrows 4,064 rows to about 3,000; jumping back and forth for that many rows can be slower than one straight scan.

Rules of thumb for which columns to index: those you **join on** (foreign keys like customer_id), those you **filter on** with selective conditions (dates, ids), and those you often **sort or group** by. Then confirm with the plan, never by guessing. In cloud warehouses like BigQuery there are no ordinary indexes at all; you get the same effect with *partitioning* (for example by date) and *clustering*.

To remove an index: `DROP INDEX idx_name`.

## 7. Worked example

*Question:* a report shows December 2025 sales for the online shop and runs slowly. Which index would you ask for?

1. The WHERE is `store_id = 12 AND order_date BETWEEN '2025-12-01' AND '2025-12-31'`: one `=` and one range.
2. So: an index on `(store_id, order_date)`, equality column first.
3. The plan changes from SCAN to SEARCH ... (store_id=? AND order_date>? AND order_date<?).
4. The answer does not change: 90 orders (all statuses) from online on or after 1 December 2025.

## 8. Practice

```sql
-- exercise: This query looks up all returns of one order. Add an index so the plan says SEARCH instead of SCAN, and show the plan.
-- hint: CREATE INDEX IF NOT EXISTS idx_returns_order ON returns(order_id); then the EXPLAIN QUERY PLAN line.
-- check: none
EXPLAIN QUERY PLAN
SELECT * FROM returns WHERE order_id = 1500
-- answer:
CREATE INDEX IF NOT EXISTS idx_returns_order ON returns(order_id);
EXPLAIN QUERY PLAN
SELECT * FROM returns WHERE order_id = 1500
```

```sql
-- exercise: Make this query covered by an index, so the plan says USING COVERING INDEX. It needs customer_id and order_date.
-- hint: Put the = column first: CREATE INDEX ... ON orders(customer_id, order_date).
-- check: none
EXPLAIN QUERY PLAN
SELECT order_date FROM orders WHERE customer_id = 7
-- answer:
CREATE INDEX IF NOT EXISTS idx_orders_cust_date ON orders(customer_id, order_date);
EXPLAIN QUERY PLAN
SELECT order_date FROM orders WHERE customer_id = 7
```

**Try it on your own data:** load a large CSV in [[sql-playground]], time a query, add an index and time it again.

<div class="keypoints">

- An index is a sorted copy of columns with pointers back to the rows; CREATE INDEX name ON t(cols).
- A composite index is sorted by its first column, then the next: the leftmost prefix rule.
- Put equality columns first and the range column last.
- A covering index answers the query without touching the table.
- Indexes slow down writes and take space: index join, filter and sort columns, then check the plan.

</div>

**New words:** *index*, *B-tree*, *composite index*, *leftmost prefix rule*, *covering index*, *unique index*, *expression index*.
