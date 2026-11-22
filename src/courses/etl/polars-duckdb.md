---
title: Transforming with Polars and DuckDB
summary: 'Write lazy Polars pipelines and DuckDB SQL straight on files, save partitioned Parquet, and learn why reading by column makes queries hundreds of times lighter.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: What does "lazy" mean in Polars?
    choices: ['It runs on one thread to save power', 'It builds and optimises a query plan, and only runs it when you call collect()', 'It skips bad rows']
    ans: 1
    why: Because Polars sees the whole plan first, it can read only the columns you use, push filters into the file scan and run in parallel.
  - q: Why keep metric logic in SQL rather than Polars when the data will later live in a warehouse?
    choices: ['SQL is always faster', 'SQL moves to the warehouse and dbt nearly unchanged; Polars code must be rewritten', 'Polars cannot add up columns']
    ans: 1
    why: Business logic you can carry from laptop to warehouse is worth more than a few seconds of speed.
  - q: A query needs 2 of 40 columns. Which format reads the least data?
    choices: ['CSV', 'JSON lines', 'Parquet']
    ans: 2
    why: Parquet stores each column separately, so it reads only the two columns' blocks.
sources:
  - 'Polars user guide: lazy API and query optimisation https://docs.pola.rs/'
  - 'DuckDB documentation: reading CSV and Parquet files, partitioned writes https://duckdb.org/docs/'
  - 'Apache Parquet documentation: file format and row groups https://parquet.apache.org/docs/'
  - 'Abadi, D., Madden, S. and Hachem, N. (2008), Column-Stores vs. Row-Stores: How Different Are They Really?, Proceedings of ACM SIGMOD 2008, 967-980 https://doi.org/10.1145/1376616.1376712'
---

**Module 2 · about 35 minutes · read first: 2.1.** You'll be able to write a lazy Polars pipeline, query CSV and Parquet files directly with DuckDB, write Parquet split into folders, and choose between pandas, Polars and DuckDB for a job.

<div class="bigidea">Reading a CSV is photocopying every page of a ledger to find one column; Parquet files the ledger by column with a label on every drawer, so a query opens only the two drawers it needs.</div>

## 1. Why this matters

pandas taught a generation to analyse data, but for pipelines it is slow and hungry for memory. **Polars** (written in Rust, multi-threaded, lazy) and **DuckDB** (an analytical SQL database that runs inside your Python process, with no server) are now the standard open-source tools for one-machine ETL. With them a laptop handles hundreds of millions of rows, and many medium-sized companies never need a cluster at all. When yours does, [Data at Scale](/learn/courses/data-at-scale/) picks up where this lesson stops; for pandas itself, see the [pandas course](/learn/courses/pandas/).

## 2. Polars: expressions and laziness

```python
import polars as pl

lf = (
    pl.scan_csv("data/landing/shared_drive/qsr/*/pos_*.csv", include_file_paths="src_file",
                schema_overrides={"order_ts": pl.Utf8}, encoding="utf8-lossy")
      .with_columns(
          pl.col("order_ts").str.strptime(pl.Datetime, "%Y-%m-%d %H:%M:%S", strict=False),
          (pl.col("qty") * pl.col("price")).alias("line_total"),
      )
      .filter(pl.col("order_ts").is_not_null())
)
daily = (lf.group_by("restaurant_id", pl.col("order_ts").dt.date().alias("cal_date"))
           .agg(pl.len().alias("lines"), pl.col("line_total").sum().alias("revenue")))
print(daily.explain())        # the optimised plan
df = daily.collect()          # only now is anything read
```

An **expression** (`pl.col("qty") * pl.col("price")`) describes a calculation on whole columns. **Lazy** means `scan_csv` reads nothing yet: Polars collects the steps into a plan, improves it, and runs it on `collect()`. It reads only the columns you use (**projection pushdown**), applies filters while reading (**predicate pushdown**), and uses every core. Polars renames things between versions, so pin its version and check its docs if a name is refused.

## 3. DuckDB: SQL on files

```python
import duckdb
con = duckdb.connect("data/warehouse.duckdb")
con.sql("""
  create or replace table stg_pos as
  select * replace (try_strptime(order_ts, '%Y-%m-%d %H:%M:%S') as order_ts)
  from read_csv('data/landing/shared_drive/qsr/*/pos_*.csv',
                union_by_name=true, filename=true, all_varchar=true)
""")
con.sql("copy stg_pos to 'data/staging/qsr_pos' (format parquet, partition_by (restaurant_id), overwrite_or_ignore)")
```

`all_varchar=true` reads everything as text first, so a bad value cannot crash the load; `try_strptime` then turns bad time stamps into NULL instead of an error. `partition_by` writes one folder per restaurant (`restaurant_id=Q204/…`), so a query for one restaurant opens one folder.

DuckDB and Polars share data without copying through **Apache Arrow**, a standard in-memory column format: `con.sql("…").pl()` returns a Polars frame, and `con.sql("select * from df")` queries a Polars frame called `df` in place.

## 4. Why Parquet

**Parquet** is a file format that stores data **by column**, compressed, in chunks called **row groups**, each with the smallest and largest value of every column written in its header. A query for `sum(price) where date = '2026-09-14'` reads two columns and skips every row group whose date range cannot contain the 14th.

<div class="steps" data-fig="polars-duckdb-columns">
<div class="step"><b>CSV.</b> A month of till lines: 8 columns, 6 row groups of five days each. A CSV has no columns on disk and no statistics, so even "one day, one total" reads all 48 blocks.</div>
<div class="step"><b>Columns.</b> Parquet keeps each column apart. The query needs only <code>ts</code> and <code>price</code>: 12 of 48 blocks.</div>
<div class="step"><b>Skipping.</b> Each row group's header says its dates run, say, 1 to 5 Sept. Only the 11 to 15 Sept group can hold the 14th, so the other five are skipped without being read.</div>
<div class="step"><b>Result.</b> 2 of 48 blocks, about 4%, and those blocks are compressed too. That is why the same query can feel instant on Parquet and slow on CSV.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** column storage cuts the bytes read in proportion to the share of columns and row groups a query needs.

**Equation:**

```math
\text{bytes read} \approx N \cdot \sum_{c \in Q} w_c \cdot s
```

where `$N$` is the number of rows, `$Q$` the columns the query uses, `$w_c$` the compressed width of column `$c$`, and `$s$` the share of row groups not skipped. A row store reads `$N \cdot \sum_{\text{all } c} w_c$`.

**Analogy:** reading one column of a printed spreadsheet instead of photocopying every page. Where it breaks: fetching a few whole rows by id (`select * where id = 42`) suits row stores, which is why the databases behind tills and booking systems store rows.

**Try it:** 20 equal columns; the query uses 3; the date filter keeps 1 row group in 30. What share of the bytes does it read, compared with a CSV? *(3/20 × 1/30 = 0.5%, before compression helps further.)*
</details>

<div class="problem" data-problem="polars-duckdb-bytes"></div>

## 5. Which tool when

| Job | Pick | Why |
|---|---|---|
| Reading messy files, odd row-by-row logic | Polars (pandas for unusual formats) | Expressions, with an escape hatch to plain Python |
| Joins, totals, window functions | DuckDB SQL | Readable, and it moves to the warehouse later |
| Exploring in a notebook with charts | pandas or Polars | The plotting ecosystem |
| Data bigger than memory on one machine | DuckDB, or Polars streaming | They can work through data in pieces |
| Many terabytes, many machines | Spark or Databricks, or the warehouse itself | Then the extra machinery pays for itself |

<div class="meaning">

<dl>
<dt>Lazy evaluation</dt><dd>Writing down the steps first and running them all at once, so the engine can plan the cheapest way.</dd>
<dt>Pushdown</dt><dd>Doing the filter or column choice while reading the file, so unneeded data is never loaded.</dd>
<dt>Parquet</dt><dd>A compressed file format that stores each column separately, in row groups with min/max statistics.</dd>
<dt>Partitioning</dt><dd>Splitting files into folders by a column (date, restaurant) so a query opens only the folders it needs.</dd>
<dt>Physical meaning</dt><dd>A useful rule: business logic in SQL, plumbing in Python. Joins and metrics written in SQL move to Azure SQL and dbt in Modules 4 and 5 nearly unchanged; the same logic in Polars would need rewriting. Keep Polars for parsing, typing and shaping raw files. And storing staging as Parquet often turns a nightly job from minutes into seconds on the same laptop, and later cuts the bill on a warehouse that charges per byte scanned.</dd>
</dl>

</div>

<div class="myth">

**"Big data needs Spark."** Most company datasets fit on one modern machine, and DuckDB or Polars process them faster than a small cluster, with far less setup. Reach for Spark when the data or the team truly outgrows one machine, not before.

</div>

## 6. Try it

1. Load all the till files with pandas, lazy Polars and DuckDB. Time each with `time.perf_counter()` and note peak memory (`/usr/bin/time -v` on Linux, Task Manager on Windows). Put the table in the README.
2. Build `stg_qsr_pos` in Polars: parse time stamps (bad ones become null), add `line_total`, `src_file` and `loaded_at`.
3. Write it to Parquet split by date folder (calendar date for now; Lesson 2.3 fixes the business day).
4. In DuckDB, query the Parquet for revenue by brand and channel over one week. Run `explain analyze` and check that only the needed date folders are read.
5. Generate 120 days (`--days 120`) and repeat the timings. Which tool grew best on your machine?

Commit: `feat(clean): staging POS in Polars, Parquet partitions, benchmark table`.

**What to check:** the row count of `stg_qsr_pos` plus the rows with bad time stamps equals the total rows in the CSVs. Nothing should vanish between the two.

## 7. Practice

1. You add `.filter(pl.col("restaurant_id") == "Q204")` after `scan_csv`. Does Polars read the other restaurants' rows into memory?
2. Why read every column as text first in DuckDB?
3. Your Parquet folder is split by restaurant, but most queries filter by date. What would you change?

<details>
<summary>Answers</summary>

1. It still has to scan the CSV text (CSV has no statistics), but it drops non-matching rows while reading instead of building them all in memory first. On Parquet split by restaurant, it would skip the other folders entirely.
2. So one bad value (a date written `00/00/0000`) cannot stop the whole load. You convert with `try_` functions and catch the failures as NULLs to quarantine.
3. Split by business date instead (or by both), so date filters skip whole folders. Choose the split from how the data is queried.
</details>

**New words:** *Polars*, *DuckDB*, *expression*, *lazy evaluation*, *projection and predicate pushdown*, *Apache Arrow*, *Parquet*, *row group*, *partitioning*.

<div class="keypoints">

- Polars is lazy: it plans the whole job, reads only what it needs and runs in parallel on `collect()`.
- DuckDB runs SQL straight on CSV and Parquet files, and shares data with Polars through Arrow without copying.
- Parquet stores columns separately with min/max statistics, so queries read a tiny share of the bytes.
- Write business logic in SQL so it moves to the warehouse; keep Python for parsing and plumbing.

</div>
