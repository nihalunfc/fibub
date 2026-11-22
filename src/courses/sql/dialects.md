---
title: 'SQLite, SQL Server, PostgreSQL and BigQuery: what changes'
seoTitle: 'SQL Server vs PostgreSQL vs BigQuery vs SQLite syntax'
summary: 'The core of SQL is the same everywhere, but a handful of things change between databases: TOP or LIMIT, date functions, joining text, case-insensitive search, QUALIFY, ISNULL or COALESCE, and auto-numbered ids. One table with sources, and live examples.'
minutes: 25
updated: 2026-11-22
quiz:
  - q: How do you get the first 10 rows in SQL Server?
    choices: ['SELECT ... LIMIT 10', 'SELECT TOP (10) ...', 'SELECT FIRST 10 ...']
    ans: 1
    why: 'SQL Server uses TOP after SELECT (or OFFSET ... FETCH after ORDER BY). SQLite, PostgreSQL and BigQuery use LIMIT at the end.'
  - q: Which NULL function works in all four databases?
    choices: ['ISNULL', 'IFNULL', 'COALESCE']
    ans: 2
    why: 'COALESCE is standard SQL and works everywhere. ISNULL is SQL Server''s own two-argument version, and IFNULL exists in SQLite and BigQuery.'
  - q: 'What does 7 / 2 return in SQLite, SQL Server and PostgreSQL when both numbers are integers?'
    choices: ['3.5', '3', 'An error']
    ans: 1
    why: 'Integer divided by integer gives an integer, dropping the fraction. BigQuery is the odd one out: its / always returns a decimal (3.5).'
---

**Module 9 · about 25 minutes · read first: 7.1, 7.2.** You'll be able to move a query between SQLite, SQL Server (T-SQL), PostgreSQL and BigQuery by changing the few things that differ.

## 1. Why this matters

Each SQL database speaks its own **dialect**: standard SQL plus its own extras and spellings. Job adverts name one ("T-SQL", "BigQuery", "Postgres"), and interview tests are often run in that one. The good news: SELECT, WHERE, JOIN, GROUP BY, window functions and CTEs are the same in all four. Learn the short list of differences below and you can work in any of them in a day.

## 2. The four, in one line each

- **SQLite**: a small database in one file, built into phones and browsers. This course runs on it. Forgiving with types.
- **SQL Server**: Microsoft's database. Its dialect is called **T-SQL** (Transact-SQL). Common in companies that use Power BI and Azure.
- **PostgreSQL** (Postgres): a free, open-source database known for following the standard closely. Common in tech companies.
- **BigQuery**: Google's cloud data warehouse. Built for huge tables; charges by the amount of data a query reads.

## 3. The differences that come up every week

| Task | SQLite | SQL Server (T-SQL) | PostgreSQL | BigQuery |
|---|---|---|---|---|
| First 10 rows | `LIMIT 10` | `SELECT TOP (10) ...` or `OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY` | `LIMIT 10` | `LIMIT 10` |
| Join text | `a \|\| b` | `a + b` or `CONCAT(a, b)`; `\|\|` only in SQL Server 2025 and Azure SQL | `a \|\| b` or `CONCAT(a, b)` | `a \|\| b` or `CONCAT(a, b)` |
| Replace NULL | `COALESCE(x, 0)` or `IFNULL(x, 0)` | `COALESCE(x, 0)` or `ISNULL(x, 0)` | `COALESCE(x, 0)` | `COALESCE(x, 0)` or `IFNULL(x, 0)` |
| Case-insensitive match | `LIKE` already ignores case (for A–Z) | Depends on the collation; usually case-insensitive by default | `ILIKE`, or `LOWER(x) LIKE ...` | `LOWER(x) LIKE ...` |
| Filter on a window function | No `QUALIFY`: use a CTE | No `QUALIFY`: use a CTE | No `QUALIFY`: use a CTE | `QUALIFY ROW_NUMBER() OVER (...) = 1` |
| Start of month | `date(d, 'start of month')` | `DATETRUNC(month, d)` (2022+) or `DATEFROMPARTS(YEAR(d), MONTH(d), 1)` | `date_trunc('month', d)` | `DATE_TRUNC(d, MONTH)` |
| Add 7 days | `date(d, '+7 days')` | `DATEADD(day, 7, d)` | `d + INTERVAL '7 days'` | `DATE_ADD(d, INTERVAL 7 DAY)` |
| Days between | `julianday(b) - julianday(a)` | `DATEDIFF(day, a, b)` | `b - a` (for DATE columns) | `DATE_DIFF(b, a, DAY)` |
| Today | `date('now')` | `CAST(GETDATE() AS date)` | `CURRENT_DATE` | `CURRENT_DATE()` |
| Auto-numbered id | `INTEGER PRIMARY KEY` | `INT IDENTITY(1,1)` | `GENERATED ALWAYS AS IDENTITY` (or older `SERIAL`) | None; use `GENERATE_UUID()` or `ROW_NUMBER()` |
| 7 / 2 | `3` | `3` | `3` | `3.5` (use `DIV(7, 2)` for 3) |
| List values in a group | `GROUP_CONCAT(x, ', ')` or `string_agg` | `STRING_AGG(x, ', ')` | `string_agg(x, ', ')` | `STRING_AGG(x, ', ')` |
| Quote a column name | `"order date"` | `[order date]` | `"order date"` | `` `order date` `` |

**Sources** (checked 22 Nov 2026; features change between versions, so check the official page for yours):

- SQLite: [SELECT and LIMIT](https://www.sqlite.org/lang_select.html), [date and time functions](https://www.sqlite.org/lang_datefunc.html), [core functions](https://www.sqlite.org/lang_corefunc.html), [aggregate functions](https://www.sqlite.org/lang_aggfunc.html), [ROWID and INTEGER PRIMARY KEY](https://www.sqlite.org/lang_createtable.html#rowid).
- SQL Server (Microsoft Learn): [TOP](https://learn.microsoft.com/en-us/sql/t-sql/queries/top-transact-sql), [+ string concatenation](https://learn.microsoft.com/en-us/sql/t-sql/language-elements/string-concatenation-transact-sql), [\|\| string concatenation](https://learn.microsoft.com/en-us/sql/t-sql/language-elements/string-concatenation-pipes-transact-sql) (applies to SQL Server 2025 and Azure SQL), [ISNULL](https://learn.microsoft.com/en-us/sql/t-sql/functions/isnull-transact-sql), [DATETRUNC](https://learn.microsoft.com/en-us/sql/t-sql/functions/datetrunc-transact-sql), [DATEADD](https://learn.microsoft.com/en-us/sql/t-sql/functions/dateadd-transact-sql), [IDENTITY](https://learn.microsoft.com/en-us/sql/t-sql/statements/create-table-transact-sql-identity-property).
- PostgreSQL (current manual): [LIMIT and OFFSET](https://www.postgresql.org/docs/current/queries-limit.html), [pattern matching and ILIKE](https://www.postgresql.org/docs/current/functions-matching.html), [date/time functions](https://www.postgresql.org/docs/current/functions-datetime.html), [COALESCE](https://www.postgresql.org/docs/current/functions-conditional.html), [identity columns](https://www.postgresql.org/docs/current/ddl-identity-columns.html). PostgreSQL has no QUALIFY clause; it has been proposed on the developers' mailing list but is not in a release.
- BigQuery (Google Cloud docs): [query syntax, including LIMIT and QUALIFY](https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax), [date functions](https://cloud.google.com/bigquery/docs/reference/standard-sql/date_functions), [string functions](https://cloud.google.com/bigquery/docs/reference/standard-sql/string_functions), [conditional expressions](https://cloud.google.com/bigquery/docs/reference/standard-sql/conditional_expressions), [mathematical functions (DIV)](https://cloud.google.com/bigquery/docs/reference/standard-sql/mathematical_functions).

## 4. Seeing the SQLite column live

Every row of the SQLite column runs here. Joining text, replacing NULL and LIMIT:

```sql
-- try
SELECT first_name || ' ' || last_name AS full_name,
       COALESCE(email, '(no email)') AS email,
       COALESCE(loyalty_tier, 'None') AS tier
FROM customers
WHERE email IS NULL
ORDER BY customer_id
LIMIT 5
```

In T-SQL the same query starts `SELECT TOP (5) first_name + ' ' + last_name AS full_name, ISNULL(email, '(no email)') ...` and drops the LIMIT. One trap: in T-SQL `'a' + NULL` is NULL, and so is `'a' || NULL` in SQLite, but `CONCAT('a', NULL)` gives `'a'` in SQLite, SQL Server and PostgreSQL, which skip NULL parts. (BigQuery is the exception: its CONCAT returns NULL if any part is NULL.) Or wrap the risky part in COALESCE.

Dates, which differ the most:

```sql
-- try
SELECT order_date,
       date(order_date, 'start of month') AS month_start,
       date(order_date, '+7 days') AS week_later,
       julianday('2025-12-31') - julianday(order_date) AS days_to_year_end
FROM orders
WHERE order_id = 2000
```

Integer division, and case in LIKE:

```sql
-- try
SELECT 7 / 2 AS int_division,
       7 / 2.0 AS real_division,
       'Northbay' LIKE 'north%' AS like_ignores_case
```

SQLite's LIKE ignores case for plain A–Z letters, so `like_ignores_case` is 1. In PostgreSQL, the same LIKE is false and you would write `ILIKE`.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** dialects differ in *syntax*, not in *meaning*. The relational algebra underneath, σ, π, ⋈, γ, is the same in all four, so a query translates line by line. When you move a query, the result table should be identical; if it isn't, a type rule changed (integer division, text vs date, NULL in a concatenation).

**Equation:** in SQLite, SQL Server and PostgreSQL, int ÷ int = ⌊a ÷ b⌋ for positive numbers (they truncate towards zero), so 7 / 2 = 3 and the share 45 / 100 = 0. Multiply by 1.0 or CAST first: 1.0 × 45 / 100 = 0.45. In BigQuery, / always returns FLOAT64.

**Analogy:** British and American English. "Colour" and "color", "lift" and "elevator": different words, same thing. Grammar (the algebra) doesn't change.

**Try it:** what does `SELECT 45 / 100 * 100` give in SQLite? (0, because 45 / 100 is already 0. Write `100.0 * 45 / 100` to get 45.0.)
</details>

## 5. QUALIFY, and the portable way

BigQuery (and some other warehouses, such as Snowflake) let you filter on a window function directly with `QUALIFY`. SQLite, SQL Server and PostgreSQL don't, so this fails here:

```sql
-- fails
SELECT customer_id, order_id, order_date
FROM orders
WHERE customer_id IS NOT NULL
QUALIFY ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) = 1
```

The portable version works everywhere: number the rows in a CTE, then filter with WHERE ([Lesson 6.3](/learn/courses/sql/top-n-per-group/)).

```sql
-- try
WITH numbered AS (
  SELECT customer_id, order_id, order_date,
         ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC, order_id DESC) AS rn
  FROM orders
  WHERE customer_id IS NOT NULL
)
SELECT customer_id, order_id, order_date
FROM numbered
WHERE rn = 1
ORDER BY customer_id
LIMIT 5
```

## 6. Auto-numbered ids

Each database has its own way to number new rows automatically. In SQLite, a column declared `INTEGER PRIMARY KEY` fills itself in:

```sql
-- noviz
DROP TABLE IF EXISTS notes;
CREATE TABLE notes (note_id INTEGER PRIMARY KEY, body TEXT);
INSERT INTO notes (body) VALUES ('first'), ('second'), ('third');
SELECT * FROM notes
```

The same table in T-SQL is `note_id INT IDENTITY(1,1) PRIMARY KEY`, and in PostgreSQL `note_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY`. BigQuery has no auto-numbering, because it is built for loading data in bulk, not row by row.

## 7. Worked example

*Question:* translate "the 3 most recent online orders, with the store name and order month" from SQLite to T-SQL.

SQLite:

```sql
-- try
SELECT o.order_id, s.store_name,
       date(o.order_date, 'start of month') AS order_month
FROM orders o
JOIN stores s ON s.store_id = o.store_id
WHERE o.channel = 'online'
ORDER BY o.order_date DESC, o.order_id DESC
LIMIT 3
```

T-SQL (shown, not run): move the limit to `SELECT TOP (3)` and change the date function. The FROM, JOIN, WHERE and ORDER BY lines stay exactly the same.

```
SELECT TOP (3) o.order_id, s.store_name,
       DATETRUNC(month, o.order_date) AS order_month
FROM orders o
JOIN stores s ON s.store_id = o.store_id
WHERE o.channel = 'online'
ORDER BY o.order_date DESC, o.order_id DESC;
```

Three lines changed out of seven. That is typical.

## 8. Practice

```sql
-- exercise: Show each store's name joined to its city in one column, like 'Northbay Downtown (Toronto)'. The online shop has no city: show 'Northbay Online (online)' for it.
-- hint: Join text with ||. Replace the missing city with COALESCE(city, 'online').
SELECT store_name, city
FROM stores
-- answer:
SELECT store_name || ' (' || COALESCE(city, 'online') || ')' AS label
FROM stores
```

```sql
-- exercise: For each order on 2025-12-24, show the order_id, the order date and the date 30 days later (the last day to return it).
-- hint: In SQLite: date(order_date, '+30 days'). (T-SQL would be DATEADD(day, 30, order_date).)
SELECT order_id, order_date
FROM orders
WHERE order_date = '2025-12-24'
-- answer:
SELECT order_id, order_date, date(order_date, '+30 days') AS return_by
FROM orders
WHERE order_date = '2025-12-24'
```

**Try it on your own data:** [[sql-playground]] runs SQLite, so use the SQLite column of the table there.

**New words:** *dialect*, *T-SQL*, *collation*, *QUALIFY*, *identity column*.
