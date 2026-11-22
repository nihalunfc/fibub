---
title: T-SQL for people who run warehouses
summary: 'Know why a query is slow, why a load blocked a report and which index fixes it: clustered, nonclustered and columnstore indexes, execution plans, RCSI, partitioning and temporal tables.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: A 200-million-row fact table is used only for totals and trends. Best main storage?
    choices: ['A clustered columnstore index', 'A clustered rowstore index on order_id', 'A nonclustered index on every column']
    ans: 0
    why: Columnstore compresses the data and reads only the columns a query needs. It is built for big scans and totals.
  - q: Which filter can use an index on business_date?
    choices: ['where year(business_date) = 2026', 'where business_date >= ''2026-01-01'' and business_date < ''2027-01-01''', 'where datediff(day, business_date, getdate()) < 365']
    ans: 1
    why: Wrapping the column in a function hides it from the index (non-sargable). A plain range on the bare column can seek.
  - q: Power BI refreshes stall while the nightly load deletes rows. Which setting addresses this?
    choices: ['NOLOCK on every query', 'Read Committed Snapshot Isolation (RCSI)', 'Serializable isolation']
    ans: 1
    why: With RCSI, readers see the last committed version instead of waiting on the loader's locks. It is on by default in Azure SQL Database.
sources:
  - 'Microsoft Learn: Columnstore indexes overview https://learn.microsoft.com/en-us/sql/relational-databases/indexes/columnstore-indexes-overview'
  - 'Microsoft Learn: SET TRANSACTION ISOLATION LEVEL (read committed snapshot) https://learn.microsoft.com/en-us/sql/t-sql/statements/set-transaction-isolation-level-transact-sql'
  - 'Microsoft Learn: Temporal tables https://learn.microsoft.com/en-us/sql/relational-databases/tables/temporal-tables'
  - 'Comer, D. (1979), The Ubiquitous B-Tree, ACM Computing Surveys 11(2), 121-137 https://doi.org/10.1145/356770.356776'
---

**Module 4 · about 40 minutes · read first: [4.4](/learn/courses/etl/postgres-duckdb-clickhouse/).** You'll be able to choose the right index for fact and dimension tables, read an execution plan for the usual problems, write date filters that can use an index, explain why RCSI lets loads and reports coexist, and use partitioning and temporal tables where they pay off.

<div class="bigidea">An index is the alphabet tabs on a phone book: instead of reading every page, you jump to the right letter, then the right page, then the right line, in a handful of steps however thick the book is.</div>

## 1. Why this matters

Writing `SELECT` is the start. Someone who runs a SQL warehouse also knows **why a query is slow, why a load blocked a report, and which index fixes it**. That knowledge separates "knows SQL" from "runs a SQL warehouse". This lesson uses SQL Server and Azure SQL (their dialect is called **T-SQL**); the ideas carry over to Postgres and others. The full SQL course is coming; see the [course list](/learn/courses/).

## 2. Indexes in one table

| Index | What it stores | Best for | Typical use |
| --- | --- | --- | --- |
| **Clustered rowstore** (a B-tree) | The table itself, sorted by the key | Finding a key or a range of keys | Dimensions: `dim_store(store_key)` |
| **Nonclustered rowstore** | A sorted copy of some columns, plus a pointer to the row | Selective lookups; add `include` columns to answer queries from the index alone | `(business_date) include (revenue)` on small facts |
| **Clustered columnstore** (CCI) | The table, column by column, compressed in row groups of about a million rows | Big scans and totals | Fact tables over a few million rows |
| **Nonclustered columnstore** | A column copy on a rowstore table | Mixed day-to-day work plus reports | Operational tables also used for reporting |

```sql
create table mart.fct_qsr_lines (
  business_date date not null, restaurant_key int not null, menu_item_key int not null,
  channel varchar(12) not null, qty smallint not null, revenue decimal(12,2) not null, order_id varchar(20) not null
);
create clustered columnstore index cci_fct_qsr_lines on mart.fct_qsr_lines;
```

Load a columnstore in batches of at least 102,400 rows, so the data goes straight into compressed row groups. Small trickle inserts wait in an uncompressed "delta store" until there are enough of them.

Drag the table size up to 100 million rows, then press Look up a new id.

<figure class="fig" data-fig="@data-index-lookup"><figcaption>Notice that the scan grows with the table while the index needs only a few page reads.</figcaption></figure>


## 3. Seek or scan

A **B-tree** is a tree of pages. The top page (the root) says which page below to look in, that page says the same, and so on down to the **leaf** pages that hold the rows (or pointers to them). Each page points to hundreds of pages below it, so even a billion rows need only four or five levels.

<div class="steps" data-fig="tsql-for-warehouses-btree">
<div class="step"><b>The index.</b> A B-tree on <code>business_date</code>: one root page, three branch pages (Jan to Apr, May to Aug, Sep to Dec), nine leaf pages.</div>
<div class="step"><b>Seek, level 1.</b> Looking for 14 September: read the root. It says September lives under the third branch, Sep to Dec.</div>
<div class="step"><b>Seek, level 2.</b> Read one branch page. It points to the leaf holding mid-September.</div>
<div class="step"><b>Seek, level 3.</b> Read that leaf: found. Three page reads in all.</div>
<div class="step"><b>Scan.</b> Without a usable index, the database reads every leaf page. Here 9; on a real fact table, hundreds of thousands.</div>
</div>

<div class="problem" data-problem="tsql-for-warehouses-levels"></div>

## 4. Reading an execution plan

An **execution plan** is the database's recipe for running your query. In SSMS (SQL Server Management Studio), or VS Code with the MSSQL extension, show the **actual** plan (Ctrl+M in SSMS) and read it right to left. Look for:

- a **table or index scan** on a big table where you expected a seek;
- a **key lookup** repeated thousands of times: add `include` columns to the index;
- **estimated** and **actual** row counts far apart: stale statistics, or a filter the optimiser cannot use;
- **spills** to tempdb on sorts and hashes: the query did not get enough memory.

A filter the index cannot use is called **non-sargable** (from "search argument able"). Wrapping the column in a function hides it from the index:

```sql
-- non-sargable: the function must run on every row
where year(business_date) = 2026
-- sargable: a plain range on the bare column can seek
where business_date >= '2026-01-01' and business_date < '2027-01-01'
```

Measure, do not guess:

```sql
set statistics io, time on;
select restaurant_key, sum(revenue) from mart.fct_qsr_lines
where business_date >= '2026-09-01' and business_date < '2026-10-01'
group by restaurant_key;
```

"Logical reads" in the Messages tab is the number of pages read: the clearest single number for comparing two versions of a query.

## 5. Locks, blocking and RCSI

Under SQL Server's default `READ COMMITTED` behaviour, readers wait for writers' locks. A big `DELETE` in a nightly load can **block** Power BI's refresh queries until it commits. **Read Committed Snapshot Isolation (RCSI)** changes that: readers see the last committed version of each row instead of waiting. It is **on by default in Azure SQL Database**; on SQL Server you turn it on with `alter database ... set read_committed_snapshot on`. Like a museum that lets visitors see yesterday's display while the new one is being set up behind a screen.

## 6. Partitioning and temporal tables

**Table partitioning** (for example by month on `business_date`) lets queries skip whole months and lets you **switch** a fully loaded staging table into place instantly. It is worth it on facts with hundreds of millions of rows; below that, columnstore's own row-group skipping is usually enough.

**System-versioned temporal tables** keep history automatically: every update writes the old row to a history table with the times it was valid. Great for "what did the campaign table say on 1 September?", and as a cheap history for small dimensions (Module 5 covers history properly, as SCD2).

```sql
create table mart.dim_campaign (
  campaign_key int identity primary key, campaign_id varchar(10) not null unique,
  client varchar(50), channel varchar(20), objective varchar(20),
  valid_from datetime2 generated always as row start, valid_to datetime2 generated always as row end,
  period for system_time (valid_from, valid_to)
) with (system_versioning = on (history_table = mart.dim_campaign_history));

select * from mart.dim_campaign for system_time as of '2026-09-01';
```

<div class="meaning">

<dl>
<dt>Seek</dt><dd>Jump down the index tree to the rows you need: a few page reads.</dd>
<dt>Scan</dt><dd>Read every page. Fine for "total of everything", slow for "one day".</dd>
<dt>Sargable</dt><dd>A filter on the bare column that an index can use.</dd>
<dt>RCSI</dt><dd>Readers see the last committed version instead of waiting for writers.</dd>
<dt>Physical meaning</dt><dd>The 08:00 dashboard takes 40 seconds. You capture its query, see 1.2 million logical reads and a scan caused by <code>year(business_date) = 2026</code>, rewrite it as a date range, and it drops to 3,000 reads and under a second. No new hardware, one line changed.</dd>
</dl>

</div>

<div class="myth">

**"Add NOLOCK to report queries so they never wait."** NOLOCK reads pages mid-change: it can return rows twice, miss rows, or show a half-loaded day. Turn on RCSI instead (already on in Azure SQL Database), which gives consistent reads without waiting.

</div>

**When someone says "the dashboard is slow"**, check in this order: (1) the **model**: is Power BI in DirectQuery mode firing dozens of queries per visual? (2) **one query**: capture it, run it with `statistics io`, read the plan; (3) **contention**: is a load running at the same time? Check `sys.dm_exec_requests` for blocking; (4) **resources**: is CPU or IO at 100 % in the portal? Most of the time it is 1 or 2. Turn on Query Store and look at regressed queries weekly.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** an index turns a search through everything into a few steps down a tree; a column store turns "read every column" into "read the columns you need, compressed".

**Equation:** with fan-out `$f$` (pages pointed to by each page, often several hundred), a seek reads about

```math
L = \lceil \log_f N \rceil
```

pages, while a full scan reads a number of pages proportional to `$N$`. A columnstore scan reads roughly `$N \cdot \frac{|Q|}{|C|} \cdot \frac{1}{\text{compression}}$`, where `$|Q|$` is the number of columns the query uses and `$|C|$` the number in the table, before skipping whole row groups.

**Analogy:** a phone book: jump to the letter, then the page, then the line, instead of reading from page one.

**Where it breaks:** indexes cost writes. Every insert updates every index, so an over-indexed fact table loads slowly.

**Try it:** fan-out 400. How many levels for 64 million rows? (400³ = 64 million: about 3 levels.)
</details>

## 7. Try it

1. Load 120 days of restaurant lines into a table with no index (a heap), then add a clustered columnstore index. Compare `statistics io` logical reads and elapsed time for four report queries.
2. Write a non-sargable and a sargable version of a date filter. Compare their plans and screenshot both.
3. Create blocking on purpose. In one window: `begin tran; delete from mart.fct_qsr_lines where business_date = '2026-09-14';` (do not commit). In another, run a report query. On the local container with RCSI off it waits; turn RCSI on and try again. Then roll back the first window.
4. Turn `dim_campaign` into a temporal table. Change one campaign's objective and query `for system_time as of` before and after.
5. Write 10 practice queries on the ads mart in `sql/practice.sql`, with results: ROAS by channel, week-over-week change, top campaign per client (`rank()`), 7-day rolling spend, the first day each campaign passed $1,000 of cumulative spend, and five of your own.

**What to check:** the columnstore version reads far fewer pages for the same totals; the sargable filter shows an index seek; with RCSI on, the report query returns at once and still shows the undeleted day. Commit as `feat(sql): columnstore fact, plan comparisons, temporal dimension, practice queries`.

<div class="keypoints">

- Rowstore B-trees suit lookups and dimensions; clustered columnstore suits big fact tables used for totals.
- A seek reads about log base f of N pages; a scan reads them all. Keep filters sargable: a range on the bare column.
- Read plans right to left for scans, key lookups, bad estimates and spills, and measure with statistics io.
- RCSI lets reports read the last committed data while loads run; never use NOLOCK for reports.
- Partition only very large facts; use temporal tables for automatic history on small tables.

</div>
