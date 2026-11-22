---
title: Partitions and backfills
summary: 'Split assets by business date so each run handles one day, then rerun only the days a bug touched. Learn daily partitions, backfills, look-back windows and partition counts.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: A partitioned asset appends rows on each run. It is retried once after a timeout. What happens?
    choices: ['The rows for that day are doubled', 'Nothing, Dagster removes duplicates', 'The retry is skipped']
    ans: 0
    why: Append plus retry means the day's rows go in twice. Partitioned writes must replace the partition, never append to it.
  - q: 500 stores × 1,095 days as a multi-partition. What is the problem?
    choices: ['547,500 partitions overwhelm the UI and scheduler; partition by date and loop over stores inside', 'Nothing at all', 'Dagster supports only 7 partitions']
    ans: 0
    why: Keep partition counts in the thousands, not hundreds of thousands. Let each daily run handle every store.
  - q: A 7-day rolling average downstream of daily partitions needs which mapping?
    choices: ['The same day only', 'A time-window mapping that loads the current day and the 6 before it', 'No mapping: rolling averages cannot be partitioned']
    ans: 1
    why: A multi-day calculation needs a window of upstream partitions. TimeWindowPartitionMapping(start_offset=-6, end_offset=0) gives 7 days.
sources:
  - 'Dagster documentation: Partitioning assets, backfills and partition mappings https://docs.dagster.io/'
  - 'Kleppmann, M. (2017), Designing Data-Intensive Applications, O''Reilly, Chapter 6 (partitioning) and Chapter 10 (batch processing)'
  - 'Reis, J. and Housley, M. (2022), Fundamentals of Data Engineering, O''Reilly, Chapter 8 (batch transformations and backfills)'
---

**Module 3 · about 35 minutes · read first: [3.3](/learn/courses/etl/dagster-resources-config/).** You'll be able to partition an asset by business date, run a backfill after a bug fix, work out how long it takes, read a window of days for rolling numbers, and keep the partition count sensible.

<div class="bigidea">Partitions are filing drawers, one per business day: when a rule changes you empty and refill only the drawers it touched, instead of rebuilding the whole cabinet.</div>

## 1. Why this matters

"Can you rerun last month?" is a weekly request in a real data team. A rule changed, a source re-sent its history, a bug was fixed. With partitions it is a few clicks and costs exactly the compute it needs. Without them it is a nervous one-off script run late at night.

A **partition** is one slice of an asset, usually one business date. A **backfill** is a request to materialise many partitions, typically old ones, in one go.

## 2. Daily partitions

```python
import dagster as dg

daily = dg.DailyPartitionsDefinition(start_date="2026-09-01", timezone="America/Toronto")

@dg.asset(partitions_def=daily)
def stg_qsr_pos(context: dg.AssetExecutionContext, raw: RawZone) -> dg.MaterializeResult:
    bdate = context.partition_key                      # "2026-09-14": the business date, passed in
    df = qsr.clean_day(raw, bdate)                     # plain function from core/
    path = f"data/staging/qsr_pos/business_date={bdate}/part.parquet"
    df.write_parquet(path)                             # REPLACE this day's file: safe to repeat
    return dg.MaterializeResult(metadata={"rows": len(df)})
```

Each partition is materialised and tracked on its own. The asset page shows a strip of days: green done, red failed, grey missing. `context.partition_key` is the business-time clock from [Lesson 3.1](/learn/courses/etl/what-orchestrators-do/), handed in by Dagster.

**Business day boundaries.** A quick-service restaurant chain's business day might run from 05:00 to 04:59 the next morning. Orders after midnight then belong to the previous business date, but the point-of-sale system may put them in the next day's export. So the partition for 14 September must read **both** the 14 and 15 September folders and filter by business date. Write down which raw inputs each partition reads: that is its **dependency window**.

Press Next day, then Load changes, then Re-run same load with each write mode.

<figure class="fig" data-fig="@data-watermark-load"><figcaption>Notice that the watermark limits what is copied, and that MERGE is safe to repeat while a blind APPEND makes duplicates.</figcaption></figure>


## 3. Backfills

In the UI: select the asset, click **Materialize**, pick a date range and launch a backfill. Dagster queues one run per partition (or one run for the whole range, if the asset uses `BackfillPolicy.single_run()` and reads `context.partition_key_range`).

Watch **concurrency**, the number of runs going at once. Sixty parallel runs all hitting a small SFTP server is a self-inflicted outage. Limit it with Dagster's run concurrency settings or tag-based limits. With a limit, runs go in **waves**.

<div class="steps" data-fig="partitions-backfills-grid">
<div class="step"><b>20 days, all green.</b> <code>stg_qsr_pos</code> has a partition for each of 1 to 20 September, each built by a 40-second run.</div>
<div class="step"><b>A bug.</b> The rule for refunds was wrong from 6 to 13 September. Those 8 partitions need rebuilding; the other 12 are fine.</div>
<div class="step"><b>Wave 1.</b> You backfill 6 to 13 September with at most 4 runs at once. Days 6, 7, 8 and 9 run together.</div>
<div class="step"><b>Wave 2.</b> Days 10 to 13 run. Because each run replaces its own day, nothing is doubled.</div>
<div class="step"><b>Done.</b> 8 runs in 2 waves: 2 × 40 s = 80 s. Rebuilding all 20 days would have taken 5 waves, 200 s.</div>
</div>

<div class="problem" data-problem="partitions-backfills-runtime"></div>

## 4. Look-back windows

Some calculations need several days. A 7-day rolling total of ad spend for 14 September needs 8 to 14 September. Tell Dagster with a **partition mapping**:

```python
@dg.asset(partitions_def=daily,
          ins={"stg_ads": dg.AssetIn(partition_mapping=dg.TimeWindowPartitionMapping(start_offset=-6, end_offset=0))})
def ads_rolling_7d(stg_ads: pl.DataFrame) -> pl.DataFrame:
    ...   # receives the current day plus the 6 days before it
```

Ad platforms keep adding conversions to a day for about a week after it (late attribution, from [Lesson 1.6](/learn/courses/etl/apis-databases/)). So each morning the schedule can also request the **last 7 partitions** again, so recent days catch up.

## 5. Static, dynamic and multi-partitions

- **Static:** a fixed list, `dg.StaticPartitionsDefinition(["H1", "H2", "H3", "H4", "H5"])`, for per-hotel work.
- **Dynamic:** partitions added while running, for example when a new store opens: `dg.DynamicPartitionsDefinition(name="stores")`, with new keys added by a sensor.
- **Multi:** date × hotel, `dg.MultiPartitionsDefinition({"date": daily, "hotel": hotels})`. Powerful, but the count multiplies. 5 hotels × 365 days = 1,825: fine. 500 stores × 3 years = 547,500: not fine. Partition by date and loop over stores inside each run.

<div class="problem" data-problem="partitions-backfills-count"></div>

<div class="meaning">

<dl>
<dt>Partition</dt><dd>One slice of an asset, usually one business date, materialised and tracked on its own.</dd>
<dt>Backfill</dt><dd>Materialising a range of partitions at once, usually old ones after a fix.</dd>
<dt>Dependency window</dt><dd>Exactly which raw inputs one partition reads (for a 05:00-to-04:59 business day: two folders).</dd>
<dt>Partition mapping</dt><dd>Which upstream partitions a downstream partition reads, such as "this day and the 6 before".</dd>
<dt>Physical meaning</dt><dd>Finance finds that refunds were mis-coded for eight days last month. You select those eight days, press Materialize, and 80 seconds later the dashboard is right. Nobody writes a one-off script, and the other 357 days of history are never touched.</dd>
</dl>

</div>

<div class="myth">

**"Appending is fine because each partition runs once."** Runs happen at least once. One retry after a timeout and an append-mode partition has every row twice. Make every partitioned write a **replace**: overwrite the day's folder, or delete the day's rows and insert again in one transaction ([Lesson 4.3](/learn/courses/etl/loading-patterns/)).

</div>

Partition by **business date**, not by the date the file arrived. A backfill then means "recompute what we believe about 14 September", which is the question the business actually asks.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** partitioning splits one big job into many small independent ones, so you recompute only what changed.

**Equation:** if the data splits into disjoint days `$T = \bigsqcup_d T_d$` and the transform works day by day, `$f(T) = \bigsqcup_d f(T_d)$`, then fixing a bug that touched the days `$D'$` costs

```math
\sum_{d \in D'} c(f, T_d) \quad \text{instead of} \quad c(f, T)
```

With runs of time `$t$`, at most `$k$` at once, the backfill takes `$\lceil |D'| / k \rceil \cdot t$`.

**Analogy:** marking exam papers. If one question's answer key was wrong, you remark that question on every paper, not the whole exam.

**Where it breaks:** transforms that need several days (rolling averages, "latest version" across days) are not day-by-day. They need a window of upstream partitions, or an unpartitioned asset downstream.

**Try it:** 365 partitions of 40 s each; a bug affected 20 days; 4 runs at once. Backfill time? (20 ÷ 4 = 5 waves × 40 s = 200 s.)
</details>

## 6. Try it

1. Partition `stg_qsr_pos` and `stg_hotel_bookings_daily` (bookings *created* on that business date) by day.
2. Materialise 10 days. Then change a cleaning rule (for example, flag `qty > 20` as suspicious) and backfill all 60 days. Write the time taken and the number of runs in your README.
3. Implement the 05:00 business-day window: partition 14 September reads both folders and filters by business date. Write a test for an order at 04:59 and one at 05:00.
4. Build `ads_daily` partitioned by day, plus `ads_rolling_7d` with the 7-day window above.
5. Make `otb_by_stay_date` **unpartitioned**, downstream of the partitioned staging, and explain why in `docs/run-semantics.md`. (Hint: on-the-books for a stay date depends on bookings created on many different days.)

**What to check:** rerunning one partition twice leaves the same row count; the 04:59 order lands in the previous business date; the backfill touched only the days you selected. Commit as `feat(dagster): daily partitions, backfill demo, look-back window`.

<div class="keypoints">

- A partition is one slice of an asset, usually one business date, run and tracked on its own.
- A backfill reruns a range of partitions; with k runs at once it takes ⌈days ÷ k⌉ waves.
- Every partitioned write must replace its slice, never append, because retries happen.
- Multi-day calculations read a window of upstream partitions through a partition mapping.
- Multi-partitions multiply; keep counts in the thousands by partitioning on date and looping inside.

</div>
