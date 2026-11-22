---
title: Performance, scale and when to change gear
summary: 'Profile before fixing, make every layer incremental, compact small Parquet files, know when Iceberg or Delta help, and spot when a bigger engine is justified.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: A pipeline takes a little longer every month. What is the most likely cause?
    choices: ['Some step reprocesses all history instead of only the new partitions', 'The server is getting old', 'Python slows down over time']
    ans: 0
    why: Run time that grows in a straight line with time is the fingerprint of full reprocessing. Find the step and make it incremental.
  - q: A lake holds 40,000 Parquet files of 50 KB each. What is the problem and the fix?
    choices: ['No problem at all', 'Per-file overhead dominates; compact them into far fewer files of roughly 100 MB to 1 GB', 'Convert them to CSV']
    ans: 1
    why: Every file costs an open, a metadata read and often a network call. With tiny files that overhead costs more than reading the data.
  - q: When would you introduce Iceberg or Delta Lake?
    choices: ['Always, from day one', 'When several engines read and write the lake and you need transactions, schema changes or time travel', 'Never with DuckDB']
    ans: 1
    why: Table formats solve multi-writer, multi-engine problems. A single daily writer is usually fine with partitioned Parquet and a manifest.
sources:
  - 'Polars user guide: Lazy API and query profiling https://docs.pola.rs/'
  - 'DuckDB documentation: Profiling and Parquet https://duckdb.org/docs/'
  - 'Apache Iceberg documentation https://iceberg.apache.org/docs/latest/'
  - 'Kleppmann, M. (2017), Designing Data-Intensive Applications, O''Reilly, Chapter 3 (storage and column-oriented storage) and Chapter 10 (batch processing)'
---

**Module 7 · about 35 minutes · read first: [3.4](/learn/courses/etl/partitions-backfills/) and [4.3](/learn/courses/etl/loading-patterns/).** You'll be able to profile a pipeline to find where the time really goes, make every layer incremental and measure the saving, size and sort Parquet files, decide when an open table format helps, and say with numbers when a platform needs a bigger engine.

<div class="bigidea">Most slow pipelines are not short of power; they redo yesterday's work every day. Measure first, process only what changed, and change engine only when the numbers still say so.</div>

## 1. Why this matters

At 18 restaurants everything is fast. At 500 restaurants with three years of history, the same code can take hours. Imagine a shop that counts every item on every shelf each night to know today's sales, instead of reading today's till rolls. It works while the shop is small. It falls apart as the shelves fill up.

A senior engineer knows **where the time goes**, fixes the right thing, and can say with numbers when the platform really needs a bigger engine.

## 2. Profile before you optimise

**Profiling** means measuring where time is spent instead of guessing. Start wide, then zoom in:

1. **Each asset's duration:** the Dagster UI shows it per run. Find the slowest asset and its trend.
2. **Inside the slow asset:** wrap steps with `time.perf_counter()`; run `py-spy record -o profile.svg -- python job.py` for a picture of where Python spends time.
3. **SQL:** `EXPLAIN ANALYZE` (Postgres and DuckDB both have it) runs the query and shows each step of the plan with its time.
4. **Polars:** `lf.profile()` on a lazy query returns the result and a table of how long each node took.

```python
import time
t0 = time.perf_counter()
df = read_day(bdate)
t1 = time.perf_counter()
out = clean(df)
t2 = time.perf_counter()
log.info("read %.1fs, clean %.1fs", t1 - t0, t2 - t1)
```

The usual findings, roughly in order: re-reading all history on every run; row-by-row Python loops; SQL filters that cannot use an index (such as `where year(order_date) = 2026`, see [Lesson 4.5](/learn/courses/etl/tsql-for-warehouses/)); many small network round trips; thousands of tiny files.

## 3. Incremental everything

| Layer | Full approach | Incremental approach |
| --- | --- | --- |
| Landing | list and hash every file | manifest, hash only names or sizes not seen before |
| Staging | re-clean every file | partition by business date, process only new partitions |
| Load | truncate and reload | merge or delete-insert by partition |
| dbt | `table` | `incremental` with a look-back, or microbatch |
| BI | full refresh | incremental refresh of the last N days |

<div class="steps" data-fig="performance-scale-incremental">
<div class="step"><b>Day 30.</b> A 150-restaurant chain adds about 0.6 million rows a day. A full rebuild reads 18 million rows; an incremental run with a 7-day look-back reads 8 days: 4.8 million.</div>
<div class="step"><b>Day 365.</b> The full rebuild now reads 219 million rows every night. The incremental run still reads 4.8 million.</div>
<div class="step"><b>Day 1,095.</b> Three years in, the full rebuild reads 657 million rows. The incremental run has not changed.</div>
<div class="step"><b>The speed-up.</b> 1,095 days ÷ 8 days per run ≈ 137 times less work, and the gap keeps growing every day.</div>
</div>

<div class="problem" data-problem="performance-scale-incremental"></div>

<div class="meaning">

<dl>
<dt>Profiling</dt><dd>Measuring where time goes, step by step, before changing anything.</dd>
<dt>Incremental</dt><dd>Processing only new or changed partitions (plus a short look-back), not the whole history.</dd>
<dt>Look-back</dt><dd>A few recent days reprocessed each run so late-arriving data is caught.</dd>
<dt>Small files problem</dt><dd>Thousands of tiny files, where the cost of opening each one outweighs reading the data.</dd>
<dt>Physical meaning</dt><dd>The overnight run that took 3 hours and pushed the 08:00 email to 09:30 now takes 4 minutes, and it will still take 4 minutes next year. Nobody bought a bigger server.</dd>
</dl>

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** incremental processing makes the cost follow the size of the change, not the size of the history.

**Equation:** with `$\bar n$` rows a day, after `$D$` days a full run reads about `$D\bar n$` rows (growing every day), while an incremental run with a look-back of `$L$` days reads `$(1 + L)\bar n$` (constant). So

```math
\text{speed-up} \approx \frac{D\,\bar n}{(1 + L)\,\bar n} = \frac{D}{1 + L}
```

**Analogy:** keeping a running total in a notebook and adding today's number, instead of re-adding every receipt since the shop opened.

**Where it breaks:** logic that truly needs all history (an all-time count of distinct customers, a full SCD2 rebuild) needs smarter saved state, such as per-customer running aggregates.

**Try it:** 3 years of daily partitions, 7-day look-back. Speed-up? (1,095 ÷ 8 ≈ 137 times.)
</details>

## 4. Files: size and layout

- Aim for Parquet files of roughly **100 MB to 1 GB**. Thousands of tiny files are slow in every engine. Compact daily partitions into monthly files for older history.
- **Sort** within files by the columns people filter on (date, location). Parquet keeps the min and max of each column per chunk of rows (a **row group**), so a sorted file lets the engine skip whole chunks. It is like a phone book: because it is sorted, you never read the A to L pages to find "Patel".

```sql
-- DuckDB: compact one month into one sorted file
copy (
  select * from read_parquet('data/staging/qsr_pos/business_date=2026-09-*/*.parquet')
  order by business_date, restaurant_id
) to 'data/history/qsr_pos/2026-09.parquet' (format parquet);
```

<div class="problem" data-problem="performance-scale-compaction"></div>

**Open table formats** (Apache **Iceberg**, **Delta Lake**) add transactions, schema changes, time travel and safe simultaneous writes on top of Parquet in object storage. DuckDB, Spark, Trino, ClickHouse and several cloud warehouses can read them (check each engine's docs for what it supports). Use them when several engines write to or read from the lake. For one daily writer, partitioned Parquet plus a manifest is often enough.

## 5. When to change gear

Move beyond one Postgres server plus DuckDB only when **several** of these are true **and** the incremental work is done:

- Daily windows are still missed with incremental runs on a reasonably sized machine.
- Facts reach **billions** of rows and dashboards need sub-second totals over them → ClickHouse or a cloud warehouse.
- Many teams run many heavy queries at once → an elastic cloud warehouse (BigQuery, Snowflake, Fabric, Databricks SQL).
- Data science or ML features on very large data → Spark or Databricks.
- Answers needed in minutes, not days → Kafka or Redpanda plus a streaming engine.

Each of those is a lesson in [Data at Scale](/learn/courses/data-at-scale/), the next course after this one.

<div class="myth">

**"We need Spark."** At medium companies this usually ends with "we needed incremental loads and a columnstore". Before proposing a bigger engine, show the profile, the incremental redesign and its measured effect. If that is still not enough, you now have the numbers that justify the spend, and finance will approve it because the cheap fix was tried first.

</div>

## 6. Try it

1. Generate a big dataset: `python generate_data.py --days 365 --out data_big` with the reference widened to 150 restaurants (or loop the generator with different seeds into separate folders). Time the full pipeline.
2. Profile it and record the three slowest steps with their times.
3. Close the incremental gaps in landing, staging, load and dbt. Record the new times.
4. Compact one month of daily Parquet into one sorted file with the query above. Time a DuckDB query for one restaurant and one week, before and after.
5. Optional: write staging as an Iceberg or Delta table (the `pyiceberg` or `deltalake` Python packages) and query it from DuckDB.
6. Write `docs/performance.md`: before and after numbers, and your "when to change gear" judgement for this chain.

**What to check:** the incremental run's time stays flat when you add another month of data; the compacted query reads fewer bytes (DuckDB's profile shows it); `docs/performance.md` has measured numbers, not guesses. Commit as `perf: profiling, incremental gaps closed, compaction; before and after numbers`.

<div class="keypoints">

- Profile first: asset durations, then timers, py-spy, EXPLAIN ANALYZE or Polars profile inside the slow one.
- Incremental runs cost (1 + look-back) days of work, so the speed-up is about D ÷ (1 + L) and keeps growing.
- Aim for Parquet files of about 100 MB to 1 GB, sorted by common filters; compact small files.
- Use Iceberg or Delta when several engines share the lake; one writer rarely needs them.
- Change engine only when several signals hold after the incremental work, with numbers to prove it.

</div>
