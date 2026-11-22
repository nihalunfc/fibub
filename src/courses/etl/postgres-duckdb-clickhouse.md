---
title: Postgres, DuckDB and ClickHouse side by side
summary: 'Load the same ad data into three open-source databases, upsert the way each one expects, benchmark them fairly, and hide the differences behind one Warehouse resource.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: What is the fast path for bulk-loading Postgres from Python?
    choices: ['COPY FROM STDIN into a staging table, then INSERT … ON CONFLICT', 'One INSERT statement per row', 'pg_dump']
    ans: 0
    why: COPY streams rows in bulk; the upsert then runs set-based inside the database.
  - q: A ClickHouse ReplacingMergeTree query returns two versions of the same campaign-day. Why?
    choices: ['Background merges have not run yet; use FINAL or argMax for exact answers', 'The data is corrupted', 'ClickHouse cannot store updates at all']
    ans: 0
    why: Replacing happens eventually, during background merges. Until then both versions exist on disk.
  - q: Warm medians on a laptop are DuckDB 0.31 s and Postgres 0.36 s. A fair conclusion?
    choices: ['The difference is within noise on this test; other factors should drive the choice', 'DuckDB is 16 % faster in general', 'Postgres is broken']
    ans: 0
    why: One machine, one query, a gap under about 20 %. That is not evidence of anything general.
sources:
  - 'PostgreSQL documentation: COPY and INSERT … ON CONFLICT https://www.postgresql.org/docs/current/sql-copy.html'
  - 'DuckDB documentation: INSERT (INSERT OR REPLACE) and the PostgreSQL extension https://duckdb.org/docs/'
  - 'ClickHouse documentation: ReplacingMergeTree https://clickhouse.com/docs/en/engines/table-engines/mergetree-family/replacingmergetree'
  - 'Kleppmann, M. (2017), Designing Data-Intensive Applications, O''Reilly, Chapter 3 (storage engines: B-trees and LSM-style merges)'
---

**Module 4 · about 40 minutes · read first: [4.3](/learn/courses/etl/loading-patterns/).** You'll be able to bulk-load and upsert into Postgres, DuckDB and ClickHouse, explain ClickHouse's unusual update rules, run a fair benchmark, and write one Warehouse resource that targets any of them.

<div class="bigidea">Three open-source databases are three kinds of kitchen: Postgres is the reliable all-rounder, DuckDB is the fast home kitchen, ClickHouse is the high-volume production line; one recipe card (your Warehouse resource) works in all three.</div>

## 1. Why this matters

Low-cost data stacks for medium-sized companies are built on open-source databases. To recommend one honestly you need to know them **by hand**, not by blog post. In this lesson you load the same ad table into three of them, upsert it the way each expects, and measure.

## 2. Postgres

Start it in Docker:

```bash
docker run -d --name pg -e POSTGRES_PASSWORD=pg -p 5432:5432 postgres:16
```

**COPY** is Postgres's bulk-load command: it streams many rows in one go, the way `fast_executemany` did for SQL Server. Then `insert ... on conflict` upserts:

```python
import io, psycopg
with psycopg.connect("postgresql://postgres:pg@localhost:5432/postgres") as con, con.cursor() as cur:
    cur.execute("create table if not exists stg_ads_load (like fct_ads_daily including defaults)")
    cur.execute("truncate stg_ads_load")
    buf = io.StringIO(); df.write_csv(buf); buf.seek(0)          # df: a Polars DataFrame
    with cur.copy("copy stg_ads_load from stdin with (format csv, header true)") as cp:
        cp.write(buf.read())                                       # COPY: the fast path
    cur.execute("""
      insert into fct_ads_daily select * from stg_ads_load
      on conflict (ad_date, campaign_id) do update set
        spend = excluded.spend, clicks = excluded.clicks, conversions = excluded.conversions, updated_at = now()
      where (fct_ads_daily.spend, fct_ads_daily.clicks, fct_ads_daily.conversions)
            is distinct from (excluded.spend, excluded.clicks, excluded.conversions)""")
```

`on conflict` needs a primary key or unique constraint on `(ad_date, campaign_id)`. `excluded` means "the row you tried to insert". `is distinct from` is a null-safe "not equal", so unchanged rows are skipped. (Keep the column order of the staging table and target the same, or list the columns.)

## 3. DuckDB

DuckDB runs inside your Python process: no server, one file.

```python
import duckdb
con = duckdb.connect("data/wh.duckdb")
con.sql("""create table if not exists fct_ads_daily (
  ad_date date, campaign_id varchar, spend decimal(18,2), clicks integer, impressions bigint,
  conversions integer, conversion_value decimal(18,2), updated_at timestamp,
  primary key (ad_date, campaign_id))""")
con.sql("""insert or replace into fct_ads_daily        -- upsert: needs the primary key above
  select ad_date, campaign_id, spend, clicks, impressions, conversions, conversion_value, now()
  from 'data/staging/ads/*.parquet'""")
```

DuckDB reads Parquet files directly in `from`, and it can **attach** a Postgres database (`attach 'postgresql://…' as pg (type postgres)`) to read or write it, which is handy for heavy scans over a Postgres warehouse.

## 4. ClickHouse

```bash
docker run -d --name ch -p 8123:8123 -p 9000:9000 -e CLICKHOUSE_PASSWORD=ch clickhouse/clickhouse-server
```

```sql
create table fct_ads_daily (
  ad_date Date, campaign_id LowCardinality(String), spend Decimal(18,2), clicks UInt32,
  impressions UInt64, conversions UInt32, conversion_value Decimal(18,2), updated_at DateTime64(3)
) engine = ReplacingMergeTree(updated_at)
order by (campaign_id, ad_date);
```

ClickHouse does not update rows in place. You **insert** the new version, and a `ReplacingMergeTree` keeps the row with the latest `updated_at` for each sort key, **eventually**, when background merges run. Until then, both versions exist.

<div class="steps">
<div class="step"><b>Day 1.</b> Insert campaign C1 on 09-14 with spend 80 (<code>updated_at</code> 06:00). One row.</div>
<div class="step"><b>Day 2.</b> Late conversions arrive: insert C1 09-14 again with spend 95 (<code>updated_at</code> 06:00 next day). Now two rows sit in two separate parts on disk.</div>
<div class="step"><b>Query right away.</b> <code>select sum(spend)</code> returns 175: both versions counted. Wrong.</div>
<div class="step"><b>Ask for the final answer.</b> <code>select sum(spend) from fct_ads_daily final</code> merges at read time and returns 95. Or use <code>argMax(spend, updated_at)</code> per key.</div>
<div class="step"><b>Later.</b> A background merge combines the parts and drops the older row. After that even the plain query says 95, but you cannot know exactly when.</div>
</div>

```python
import clickhouse_connect
ch = clickhouse_connect.get_client(host="localhost", username="default", password="ch")
ch.insert_df("fct_ads_daily", df.to_pandas())
ch.query("select campaign_id, sum(spend) from fct_ads_daily final group by campaign_id")
```

That is ClickHouse's trade-off: extremely fast scans and inserts, unusual update rules.

## 5. Benchmark fairly

Benchmarks lie easily. Same data, same query, several runs, and report the **cold** run (data read from disk) separately from the **warm** ones (data already in memory). Report the **median** of the warm runs and the spread. A difference under about 20 % on a laptop is usually noise.

<div class="problem" data-problem="postgres-duckdb-clickhouse-median"></div>

## 6. One interface, many warehouses

Hide the differences behind one Dagster resource ([Lesson 3.3](/learn/courses/etl/dagster-resources-config/)):

```python
class Warehouse(dg.ConfigurableResource):
    def upsert(self, table: str, df: pl.DataFrame, keys: list[str]) -> dict: ...
    def replace_partition(self, table: str, df: pl.DataFrame, col: str, value) -> dict: ...
    def query(self, sql: str) -> pl.DataFrame: ...

class AzureSqlWarehouse(Warehouse): ...   # Lessons 4.2 and 4.3: staging + MERGE
class PostgresWarehouse(Warehouse): ...   # COPY + ON CONFLICT
class DuckDBWarehouse(Warehouse): ...     # INSERT OR REPLACE
```

The asset calls `warehouse.upsert(...)`; the environment chooses which class it gets. Each returns a dict of counts for the audit table.

SQL dialects differ in details that bite: `MERGE` versus `ON CONFLICT`; `datetime2` versus `timestamptz`; `top` versus `limit`; string joining; quoting of names; and case (Postgres turns unquoted names to lower case). Keep warehouse-specific SQL inside the resource classes and, from Module 5, in dbt adapters. **SQLGlot**, a Python library, can translate simple queries between dialects, which helps with migrations.

<div class="meaning">

<dl>
<dt>COPY</dt><dd>Postgres's bulk-load command: streams many rows at once instead of one insert each.</dd>
<dt>ON CONFLICT</dt><dd>Postgres's upsert: if the key exists, update instead of failing.</dd>
<dt>ReplacingMergeTree</dt><dd>A ClickHouse table that keeps the newest version per key, but only after background merges; use FINAL for exact answers now.</dd>
<dt>Warm median</dt><dd>The middle timing of repeated runs once the data is in memory, the fair number to compare.</dd>
<dt>Physical meaning</dt><dd>A client asks "should we move from Postgres to ClickHouse for speed?" You can answer with your own numbers on their queries, and with the catch: their daily corrections would need FINAL or argMax everywhere, which their analysts would have to learn.</dd>
</dl>

</div>

<div class="myth">

**"The fastest database in a benchmark is the best choice."** Speed is one input. A 15 % difference on a laptop is noise, and even a real 3× gap may not matter if the dashboard already answers in half a second. Ecosystem, skills, update rules and cost usually decide (see [Lesson 4.1](/learn/courses/etl/where-data-lives/)).

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** benchmark fairly: same data, same query, cold and warm runs reported apart, the median of several warm runs.

**Equation:** for warm timings `$t_1, \dots, t_k$`, report

```math
\tilde t = \operatorname{median}(t_1, \dots, t_k), \qquad \text{speed-up} = \frac{\tilde t_A}{\tilde t_B}
```

with the spread (fastest to slowest). The median ignores one unlucky run; the mean does not.

**Analogy:** weighing yourself several times and taking the middle reading, not the first one taken with your coat on.

**Where it breaks:** caches. The first run reads from disk; later runs hit memory. Comparing one database's cold run with another's warm run is meaningless.

**Try it:** runs of 2.1, 0.40, 0.42, 0.39 and 0.41 s. Cold time and warm median? (Cold 2.1 s; warm median (0.40 + 0.41) ÷ 2 = 0.405 s.)
</details>

## 7. Try it

1. Implement `PostgresWarehouse` and `DuckDBWarehouse` with `upsert` and `replace_partition`. Reuse Lessons 4.2 and 4.3 for `AzureSqlWarehouse`.
2. Load 120 days of ads and restaurant data into all three (and into ClickHouse by hand). Time the loads.
3. Run the same four queries everywhere: total spend by channel, daily trend, top 10 campaigns by ROAS (return on ad spend: conversion value ÷ spend), and a 7-day rolling sum with a window function. Cold, then warm, median of 5.
4. Put the results table and a short, honest interpretation in the README. Note every query that needed a dialect change.
5. Wire the resource into Dagster with `P2D_WAREHOUSE=duckdb|postgres|azuresql`.

**What to check:** every warehouse returns the same totals for the same query (to the cent); rerunning the upsert gives zero inserts everywhere; ClickHouse without FINAL shows the double count right after a correction, and with FINAL does not. Commit as `feat(warehouse): swappable Postgres/DuckDB/Azure SQL resource and benchmark`.

<div class="keypoints">

- Postgres: bulk-load with COPY into staging, then INSERT … ON CONFLICT to upsert.
- DuckDB: INSERT OR REPLACE with a primary key; it reads Parquet directly and can attach Postgres.
- ClickHouse: inserts new versions; ReplacingMergeTree removes old ones eventually, so use FINAL or argMax for exact answers.
- Benchmark fairly: cold and warm apart, median of several runs; differences under about 20 % are noise.
- One Warehouse resource with upsert, replace_partition and query keeps assets identical across databases.

</div>
