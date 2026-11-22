---
title: 'Capstone part 3: put it in a cloud warehouse'
seoTitle: 'Data warehouse portfolio project: Azure SQL, DuckDB, GitHub'
summary: 'Move the Northbay warehouse out of the browser: export the source data, translate the scripts for Azure SQL Database (free offer), PostgreSQL or DuckDB, run the tests there, and publish a GitHub repo and portfolio page that show employers what you built.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: SQLite's INTEGER PRIMARY KEY numbers new rows by itself. What do you write in SQL Server or Azure SQL?
    choices: ['INTEGER PRIMARY KEY works the same', 'INT IDENTITY(1,1) PRIMARY KEY', 'AUTONUMBER']
    ans: 1
    why: SQL Server uses the IDENTITY property. PostgreSQL uses GENERATED ALWAYS AS IDENTITY, and DuckDB uses a sequence with nextval().
  - q: What should the README of a warehouse portfolio repo show first?
    choices: ['Every line of SQL', 'The business question, the model (ERD), how to run it, and proof it works (test results and a few answers)', 'A list of tools used']
    ans: 1
    why: A reviewer spends a minute or two. Lead with the problem and the design, then show it runs and is tested. The code is there for those who want it.
  - q: What happens on the Azure SQL Database free offer when a database uses its monthly free allowance and was set to auto-pause?
    choices: ['It keeps running and bills you', 'It pauses until the allowance resets next month', 'It is deleted']
    ans: 1
    why: Microsoft's page says the auto-pause choice stops charges, and the database can't be used until the allowance resets at the start of the next calendar month.
sources:
  - 'Microsoft Learn, Azure SQL Database free offer https://learn.microsoft.com/en-us/azure/azure-sql/database/free-offer'
  - 'PostgreSQL documentation, COPY https://www.postgresql.org/docs/current/sql-copy.html'
  - 'DuckDB documentation https://duckdb.org/docs/'
---

**Module 8 · about 30 minutes · read first: 8.2.** You'll be able to export Northbay from the browser, translate the build scripts for SQL Server/Azure SQL, PostgreSQL or DuckDB, run the tests on a real database, and publish the project as a GitHub repo and a portfolio page. This is part 3 of the **Northbay warehouse** project.

<div class="bigidea">Move the finished warehouse to a real database: export the data, translate the scripts for that dialect, run the tests, and publish the result.</div>

**In everyday terms:** moving house. You pack the boxes (export), check the new house has the same plug sockets (dialect), and count every box on arrival (tests).

## 1. Why this matters

"It works in a browser tutorial" is good practice; "it runs on Azure SQL, here is the repo and the test results" is a portfolio piece. Moving the project to a real database also teaches the small dialect differences that trip people up in their first week on a job. This lesson covers the database side; for loading pipelines, scheduling and dbt, follow the ETL course: [Module 4 loads into Azure SQL, Module 5 rebuilds the models in dbt](/learn/courses/etl/azure-sql-hands-on/).

<div class="meaning">

<dl>
<dt>Free offer</dt><dd>A cloud database tier that costs nothing within limits.</dd>
<dt>Auto-pause</dt><dd>The database sleeps when idle and wakes on first use.</dd>
<dt>IDENTITY</dt><dd>SQL Server's way of generating surrogate keys.</dd>
<dt>Dialect translation</dt><dd>Changing syntax so the same design runs on another database.</dd>
<dt>Physical meaning</dt><dd>The tables hold the same rows in a different engine. Row counts and test results must match the browser version.</dd>
</dl>

</div>

<div class="myth">

**"If the scripts ran in the browser, they will run unchanged in the cloud."** Types, auto-numbering, date functions and quoting differ. Translate each script, then re-run the tests.

</div>

## 2. Pick a home

Three good options, all free for this project:

| Option | Good for | Notes |
|---|---|---|
| **Azure SQL Database free offer** | Jobs that use Microsoft tools and Power BI | Real cloud database; T-SQL; connects straight to Power BI |
| **PostgreSQL** on your computer | Open-source roles, any cloud later | Very close to SQLite for upserts (`ON CONFLICT`) |
| **DuckDB** on your computer | The quickest start; analytics roles | One file, no server; reads CSV and Parquet directly |

**Azure SQL Database free offer.** Microsoft's page says each Azure subscription can create up to 10 free General Purpose databases, and each gets 100,000 vCore seconds of compute, 32 GB of data and 32 GB of backup storage free per month for the lifetime of the subscription. When a database uses up its monthly allowance you choose in advance: **auto-pause** until next month (no charges, but the database can't be used until the allowance resets), or **continue** and pay standard serverless rates for the extra, a choice you can't switch back from ([Deploy Azure SQL Database for free](https://learn.microsoft.com/en-us/azure/azure-sql/database/free-offer), checked 22 Nov 2026, check the official page). Pick auto-pause for a portfolio project. 100,000 vCore seconds is about 28 vCore hours a month; the whole Northbay build takes seconds.

**PostgreSQL** ([download](https://www.postgresql.org/download/)) and **DuckDB** ([installation](https://duckdb.org/docs/installation/)) are free and open source. (Checked 22 Nov 2026, check the official page.)

## 3. Export the source data

Northbay is generated in your browser, so first get it out as CSV files. Run `SELECT * FROM <table>` for each source table and press **Download CSV** under the result: the file is made on your device. Start with stores:

```sql
-- noviz
SELECT * FROM stores
```

Then orders (4,064 rows) and the rest the same way:

```sql
-- noviz
SELECT * FROM orders
```

Empty fields become NULL when you import. Text containing a comma is wrapped in double quotes, the standard CSV rule that Azure SQL, PostgreSQL and DuckDB all read. Repeat for the other source tables (regions, categories, products, customers, order_items, promotions, returns) by changing the column list. Check each file's row count against this:

```sql
-- try
SELECT 'orders' AS source_table, COUNT(*) AS rows FROM orders
UNION ALL SELECT 'order_items', COUNT(*) FROM order_items
UNION ALL SELECT 'customers', COUNT(*) FROM customers
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'returns', COUNT(*) FROM returns
```

Commit these CSV files to the repo's `data/` folder, with a note that Northbay is fictional data from fibub's free courses.

## 4. Translate the scripts

The design doesn't change; only the spelling does. The differences you will meet:

| In this course (SQLite) | SQL Server / Azure SQL | PostgreSQL | DuckDB |
|---|---|---|---|
| `INTEGER PRIMARY KEY` (auto-numbered) | `INT IDENTITY(1,1) PRIMARY KEY` | `INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY` | `INTEGER PRIMARY KEY DEFAULT nextval('seq')` |
| `REAL` for money | `DECIMAL(12,2)` | `NUMERIC(12,2)` | `DECIMAL(12,2)` |
| dates as `TEXT` | `DATE` | `DATE` | `DATE` |
| `a \|\| b` | `CONCAT(a, b)` | `a \|\| b` | `a \|\| b` |
| `WITH RECURSIVE` date list | `GENERATE_SERIES` (Azure SQL, SQL Server 2022) or a recursive CTE | `generate_series(date, date, interval)` | `generate_series(TIMESTAMP '2024-01-01', TIMESTAMP '2025-12-31', INTERVAL 1 DAY)` |
| `INSERT ... ON CONFLICT DO UPDATE` | `MERGE` ([Lesson 7.2](/learn/courses/data-modelling/merge-loads/)) | `ON CONFLICT` (same) or `MERGE` | `ON CONFLICT` or `INSERT OR REPLACE` |
| `changes()` | `@@ROWCOUNT` | `GET DIAGNOSTICS n = ROW_COUNT` (in PL/pgSQL) | the row count a statement returns |
| `strftime('%Y', d)` | `YEAR(d)` | `EXTRACT(YEAR FROM d)` | `year(d)` |

Here is the customer dimension and the date dimension in T-SQL for Azure SQL Database (it does not run in this page's SQLite):

```tsql
CREATE TABLE dbo.dim_customer (
    customer_key   INT IDENTITY(1,1) PRIMARY KEY,
    customer_id    INT NULL,
    customer_name  NVARCHAR(100) NOT NULL,
    city           NVARCHAR(60)  NOT NULL,
    province       NVARCHAR(20)  NOT NULL,
    loyalty_tier   NVARCHAR(10)  NOT NULL,
    party_email    NVARCHAR(200) NULL,
    valid_from     DATE NOT NULL,
    valid_to       DATE NOT NULL,
    is_current     BIT  NOT NULL,
    CONSTRAINT uq_dim_customer UNIQUE (customer_id, valid_from)
);
SET IDENTITY_INSERT dbo.dim_customer ON;
INSERT INTO dbo.dim_customer (customer_key, customer_id, customer_name, city, province, loyalty_tier,
                              party_email, valid_from, valid_to, is_current)
VALUES (-1, NULL, N'Guest', N'Unknown', N'Unknown', N'Unknown', NULL, '1900-01-01', '9999-12-31', 1);
SET IDENTITY_INSERT dbo.dim_customer OFF;

INSERT INTO dbo.dim_date (date_key, full_date, [year], [quarter], [month], month_name, day_name, is_weekend)
SELECT CONVERT(INT, FORMAT(d, 'yyyyMMdd')), d, YEAR(d), DATEPART(QUARTER, d), MONTH(d),
       FORMAT(d, 'MMM'), FORMAT(d, 'ddd'),
       CASE WHEN DATENAME(WEEKDAY, d) IN ('Saturday', 'Sunday') THEN 1 ELSE 0 END
FROM (SELECT DATEADD(DAY, value, CAST('2024-01-01' AS DATE)) AS d
      FROM GENERATE_SERIES(0, 730)) AS days;
```

Two things to notice: inserting the -1 row into an identity column needs `SET IDENTITY_INSERT ... ON`, and `GENERATE_SERIES` returns a column called `value` (it needs database compatibility level 160 or higher; [GENERATE_SERIES](https://learn.microsoft.com/en-us/sql/t-sql/functions/generate-series-transact-sql), checked 22 Nov 2026, check the official page). The day-name check assumes an English language setting.

In DuckDB, loading a CSV is one line, and most of the course's SQL runs as it is:

```text
CREATE TABLE orders AS SELECT * FROM read_csv('data/orders.csv');
```

To load CSVs into Azure SQL Database, use the Import Flat File wizard in SQL Server Management Studio, the mssql extension for VS Code, or a short Python script; [Module 4 of the ETL course](/learn/courses/etl/azure-sql-hands-on/) walks through a scripted load.

## 5. Prove it works there

Run the same test view on the cloud database. The numbers must match the browser build exactly; if a count differs, a type or a date function changed meaning in translation. These are the figures to expect, straight from the source:

```sql
-- try
SELECT (SELECT COUNT(*) FROM order_items i JOIN orders o ON o.order_id = i.order_id
        WHERE o.status = 'completed') AS fact_sales_rows,
       (SELECT ROUND(SUM(ROUND(i.quantity * i.unit_price * (1 - i.discount), 2)), 2)
        FROM order_items i JOIN orders o ON o.order_id = i.order_id
        WHERE o.status = 'completed') AS total_sales,
       (SELECT COUNT(*) FROM returns) AS fact_returns_rows,
       12 * 731 AS fact_store_daily_rows
```

7,112 sales lines worth $126,579.09, 204 returns and 8,772 store-days. Save the test results as `results/test_results.csv` in the repo.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** translating between dialects should be a **homomorphism**: the structure of the result is kept exactly, whatever the spelling. If f translates a query and run() executes it, you want run_T-SQL(f(q)) = run_SQLite(q) for every query in your project. The test suite is how you check that equation on real data instead of trusting it.

**Equation:** money is where it most often breaks. REAL is binary floating point, so 0.1 + 0.2 = 0.30000000000000004; DECIMAL(12,2) stores exact cents. Summing 7,112 values rounded to cents in DECIMAL gives exactly 126,579.09; in floating point the sum can be off in the last digits, which is why the course rounds the total.

**Analogy:** translating a recipe from cups to grams. The cake must come out the same; you check by tasting (the tests), not by admiring the translation.

**Try it:** a table has 3 rows of 0.10 in a REAL column. What might SUM show before rounding? (Something like 0.30000000000000004; in DECIMAL it is exactly 0.30.)
</details>

Watch it happen, one step at a time (any live box below has a **Show how it runs** button that animates the real query):

<div class="steps">
<div class="step"><b>Export.</b> Each table to a CSV file.</div>
<div class="step"><b>Translate.</b> <table class="lk-tbl"><tr><th>browser</th><th>SQL Server</th></tr><tr><td>INTEGER PRIMARY KEY</td><td><mark>INT IDENTITY(1,1)</mark></td></tr><tr><td>date('now')</td><td><mark>GETDATE()</mark></td></tr></table></div>
<div class="step"><b>Load.</b> Create the tables and import each CSV.</div>
<div class="step"><b>Reconcile.</b> <table class="lk-tbl"><tr><th>table</th><th>source</th><th>cloud</th></tr><tr><td>orders</td><td>1200</td><td>1200</td></tr><tr><td>customers</td><td>300</td><td><mark>295</mark></td></tr></table> A mismatch to investigate.</div>
<div class="step"><b>Publish.</b> Push scripts and a README to GitHub, then link it from your portfolio page.</div>
</div>

<div class="problem" data-problem="dm-export-recon"></div>

## 6. Worked example: the GitHub repo

A layout that reviewers find easy to read:

```text
northbay-warehouse/
├── README.md              problem, ERD, how to run, results
├── docs/
│   ├── bus-matrix.md
│   ├── grain.md           one sentence per fact table
│   ├── decisions.md       numbered design decisions
│   └── data-dictionary.md
├── data/                  source CSVs (fictional Northbay data)
├── sql/
│   ├── sqlite/            01_ddl.sql … 06_tests.sql (from part 2)
│   └── tsql/              the Azure SQL versions
├── results/
│   ├── test_results.csv
│   └── questions.md       5 business questions, each with query, answer and one-line insight
└── powerbi/               optional: screenshots of a report on the star
```

The README, in this order:

1. **One paragraph** on the problem: "A fictional 12-store retailer needs sales, returns and store performance reporting with customer history as it was at the time of sale."
2. **The ERD** (Mermaid in the README draws on GitHub) and the bus matrix.
3. **Three numbers that prove scale and care:** "3 fact tables, 6 dimensions; SCD type 2 on customers (34 changes tracked); 11 automated tests, all passing."
4. **How to run it** in 3 to 5 steps, for SQLite or DuckDB on a laptop and for Azure SQL.
5. **What you would do next** (incremental loads, a promotion coverage fact, dbt), which shows judgement.

Generate the data dictionary skeleton from the database and paste it into `docs/data-dictionary.md`, then fill in the meaning column:

```sql
-- try
SELECT '| ' || m.name || ' | ' || p.name || ' | ' || p.type || ' |  |' AS markdown_row
FROM sqlite_master m
JOIN pragma_table_info(m.name) p
WHERE m.name IN ('orders', 'order_items')
ORDER BY m.name, p.cid
```

## 7. The portfolio page

Your portfolio page links to the repo and tells the story in under a minute of reading: the business problem; a picture of the star; two or three decisions and why (grain at order line; SCD2 on tier because marketing asks "tier at time of sale"; guests as -1); proof (tests, a Power BI screenshot); and what you learned. Say plainly that the data is fictional and generated by fibub's free course, and that the design, scripts and tests are your own work.

## 8. Practice

```sql
-- exercise: Build the CSV text for the promotions table: a header line, then one line per promotion with promo_id, promo_name, start_date, end_date and discount, joined by commas.
-- hint: 'promo_id,promo_name,start_date,end_date,discount' || char(10) || group_concat(promo_id || ',' || promo_name || ',' || ... , char(10)).
SELECT promo_id, promo_name, start_date, end_date, discount
FROM promotions
-- answer:
SELECT 'promo_id,promo_name,start_date,end_date,discount' || char(10) ||
       group_concat(promo_id || ',' || promo_name || ',' || start_date || ',' || end_date || ',' || discount, char(10)) AS promotions_csv
FROM promotions
```

```sql
-- exercise: Write the README's headline numbers in one query: total completed orders, distinct customers who ordered, and the first and last order dates.
-- hint: Filter status = 'completed'; COUNT(*), COUNT(DISTINCT customer_id), MIN(order_date), MAX(order_date).
SELECT COUNT(*) AS orders
FROM orders
-- answer:
SELECT COUNT(*) AS completed_orders,
       COUNT(DISTINCT customer_id) AS customers,
       MIN(order_date) AS first_order,
       MAX(order_date) AS last_order
FROM orders
WHERE status = 'completed'
```

<div class="keypoints">

- Export, translate, load, reconcile, publish.
- Dialects differ in types, keys and date functions.
- Row counts must match after the move.
- Use a free tier and watch auto-pause.

</div>

**New words:** *free offer*, *auto-pause*, *IDENTITY*, *dialect translation*, *homomorphism*.
