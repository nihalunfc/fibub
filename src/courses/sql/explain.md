---
title: 'How the database runs your query: EXPLAIN'
seoTitle: 'SQL EXPLAIN query plan explained for beginners'
summary: 'Ask the database how it plans to run a query, and learn to read the answer: full scans, index searches, temporary sorts and automatic indexes. Practise with EXPLAIN QUERY PLAN on Northbay.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: 'What does SCAN orders mean in a SQLite query plan?'
    choices: ['SQLite reads every row of orders', 'SQLite jumps straight to the matching rows', 'The query has an error']
    ans: 0
    why: 'A SCAN reads the whole table from start to end. SEARCH means it used an index to jump to just the rows it needs.'
  - q: 'Why does WHERE strftime(''%Y'', order_date) = ''2025'' stop an index on order_date from being searched?'
    choices: ['strftime is not allowed in WHERE', 'The index is sorted by order_date, not by the result of a function on it, so SQLite must work out the function for every row', 'Indexes only work on numbers']
    ans: 1
    why: 'An index is a sorted copy of the column. Wrap the column in a function and the sort order no longer helps. A range (order_date >= ''2025-01-01'' AND order_date < ''2026-01-01'') can use it.'
  - q: 'USE TEMP B-TREE FOR ORDER BY in a plan means...'
    choices: ['The result is already sorted', 'SQLite has to build a temporary sorted structure to do the ORDER BY', 'The query will fail on big tables']
    ans: 1
    why: 'There was no index in the right order, so SQLite sorts the rows itself. That is fine for small results but costs time on large ones.'
---

**Module 9 · about 25 minutes · read first: 1.4, 4.2.** You'll be able to ask the database for its query plan, read the main lines of it, and spot the two most common slow patterns.

## 1. Why this matters

SQL says *what* you want, not *how* to get it. A part of the database called the **query planner** (or optimiser) chooses the how: which table to read first, whether to use an index, when to sort. When a report that took 2 seconds starts taking 2 minutes, the plan is where you look. "How would you speed up a slow query?" is a standard interview question, and "I'd read the plan" is the first half of a good answer.

## 2. Asking for the plan

In SQLite, put `EXPLAIN QUERY PLAN` in front of any query. It does **not** run the query; it describes how it would run it. Read the `detail` column; the other columns are internal numbers that show how the steps nest.

```sql
-- noviz
EXPLAIN QUERY PLAN
SELECT *
FROM orders
WHERE customer_id = 42
```

The plan has one line: `SCAN orders`. A **scan** (full table scan) means SQLite reads every one of the 4,064 orders and checks each one. For 5 matching rows that is a lot of wasted reading, like reading a whole phone book to find one name.

Northbay's tables have no primary keys or indexes declared (like many warehouse tables, the keys are described, not enforced), so even a search by `order_id` scans:

```sql
-- noviz
EXPLAIN QUERY PLAN
SELECT *
FROM orders
WHERE order_id = 2000
```

## 3. Scan versus search

An **index** is a sorted copy of one or more columns with pointers back to the rows, like the index at the back of a book ([Lesson 9.2](/learn/courses/sql/indexes/) goes deeper). Make one on `customer_id` and ask again:

```sql
-- noviz
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
EXPLAIN QUERY PLAN
SELECT *
FROM orders
WHERE customer_id = 42
```

Now the plan says `SEARCH orders USING INDEX idx_orders_customer (customer_id=?)`. A **search** jumps straight to the matching rows through the index. The `?` stands for the value you are looking up.

The main words you will see in SQLite plans:

| Plan line | Meaning |
|---|---|
| SCAN t | Reads every row of t |
| SEARCH t USING INDEX i (col=?) | Jumps to matching rows through index i |
| USING COVERING INDEX | The index alone holds every column needed, so the table itself is never touched |
| USE TEMP B-TREE FOR ORDER BY / GROUP BY | Builds a temporary sorted structure to sort or group |
| AUTOMATIC COVERING INDEX | SQLite builds a throwaway index just for this query (a hint that a real one might help) |
| CO-ROUTINE / SUBQUERY | Runs a CTE or subquery as its own step |

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** relational algebra describes the answer; many different plans give the same answer. σ<sub>customer_id=42</sub>(orders) can be worked out by testing every row or by looking 42 up in a sorted index. The planner estimates the cost of each plan and picks the cheapest.

**Equation:** a scan costs about n row reads. A search in a sorted index (a B-tree) costs about log₂ n steps to find the first match, plus one read per matching row k: roughly log₂ n + k. For n = 4,064, log₂ n ≈ 12, so finding 5 rows costs about 17 reads instead of 4,064.

**Analogy:** finding a word in a dictionary. You don't read from page one; you open near the right letter and halve the search each time. That only works because the dictionary is sorted by the word, not by its last letter.

**Try it:** a table grows from 1 million to 1 billion rows. How much longer does an index search take? (log₂ goes from about 20 to about 30: only half as long again, while a scan takes 1,000 times longer.)
</details>

## 4. Joins, sorts and groups in a plan

Plans for bigger queries have several lines, one per step. Here is a join and a group:

```sql
-- noviz
EXPLAIN QUERY PLAN
SELECT s.store_name, COUNT(*) AS orders
FROM orders o
JOIN stores s ON s.store_id = o.store_id
GROUP BY s.store_name
ORDER BY orders DESC
```

Read it top to bottom: SQLite scans one table, finds matching rows in the other (building an automatic index if no real one exists), then uses temporary B-trees for the GROUP BY and for the ORDER BY. On 4,000 rows all of this takes a blink. On 400 million rows, the automatic index and the sorts are where the time goes.

## 5. The function-on-a-column trap

The most common reason an index is not used: the WHERE wraps the column in a function. An index on `order_date` is sorted by the date itself, not by `strftime('%Y', order_date)`.

```sql
-- noviz
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);
EXPLAIN QUERY PLAN
SELECT COUNT(*)
FROM orders
WHERE strftime('%Y', order_date) = '2025'
```

The plan says `SCAN orders USING COVERING INDEX idx_orders_date`: it reads the whole index (smaller than the table, but still every entry) and works out strftime for each. Rewrite the condition as a **range** on the bare column and the plan becomes a SEARCH. A condition that can use an index this way is called **sargable** (from "search argument able").

## 6. Worked example

*Question:* a dashboard tile counts December 2025 orders and is slow on the real database. What would you check?

1. Read the plan of the current query: `WHERE substr(order_date, 1, 7) = '2025-12'` gives a SCAN.
2. Rewrite as a range: `WHERE order_date >= '2025-12-01' AND order_date < '2026-01-01'`.
3. Check there is an index on `order_date`, and read the plan again: SEARCH ... (order_date>? AND order_date<?).
4. Check the answer is unchanged: both give **304** orders (cancelled ones included).

```sql
-- noviz
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);
EXPLAIN QUERY PLAN
SELECT COUNT(*)
FROM orders
WHERE order_date >= '2025-12-01' AND order_date < '2026-01-01'
```

Other databases have their own versions of this: SQL Server shows an *execution plan* (Ctrl+L in SQL Server Management Studio, or `SET SHOWPLAN_ALL ON`); PostgreSQL has `EXPLAIN` and `EXPLAIN ANALYZE` (which really runs the query and shows times); BigQuery shows an *execution graph* and the bytes a query will read, because it charges by bytes scanned. The words differ (Index Seek vs Table Scan in SQL Server, Index Scan vs Seq Scan in PostgreSQL), but the idea is the same.

## 7. Practice

```sql
-- exercise: Show the query plan for this query instead of its result. What does the first line say SQLite does with orders?
-- hint: Put EXPLAIN QUERY PLAN on the line before SELECT.
-- check: none
SELECT channel, COUNT(*) AS orders
FROM orders
GROUP BY channel
-- answer:
EXPLAIN QUERY PLAN
SELECT channel, COUNT(*) AS orders
FROM orders
GROUP BY channel
```

```sql
-- exercise: This plan scans the date index because of strftime. Rewrite the WHERE as a date range so the plan says SEARCH, keeping the same meaning (all 2025 orders).
-- hint: 2025 means order_date >= '2025-01-01' AND order_date < '2026-01-01'.
-- check: none
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);
EXPLAIN QUERY PLAN
SELECT COUNT(*)
FROM orders
WHERE strftime('%Y', order_date) = '2025'
-- answer:
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);
EXPLAIN QUERY PLAN
SELECT COUNT(*)
FROM orders
WHERE order_date >= '2025-01-01' AND order_date < '2026-01-01'
```

**Try it on your own data:** load a CSV in [[sql-playground]] and compare plans before and after you add an index.

**New words:** *query planner*, *query plan*, *full table scan*, *index search*, *covering index*, *sargable*.
