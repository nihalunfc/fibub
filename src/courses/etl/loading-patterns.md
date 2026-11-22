---
title: Loading patterns that survive reruns
summary: 'The load step is where "ran twice" becomes "revenue doubled". Learn the four patterns teams use (MERGE, delete-insert, append-only, rebuild and swap) and the watermark and audit tables.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: A full day of till lines is re-sent with 3 rows removed (voided orders). Which pattern makes the warehouse match?
    choices: ['Append the new rows', 'Delete-insert that business date in one transaction', 'Insert only rows whose key does not exist']
    ans: 1
    why: Delete-insert treats the re-sent day as the whole truth, so rows that vanished from the source vanish from the warehouse too.
  - q: Why update the watermark in the same transaction as the data?
    choices: ['So a failed load never moves the watermark, and the next run retries the same window', 'Because it is faster', 'To lock the table for readers']
    ans: 0
    why: Data and the record of how far you got must move together. Otherwise a failed load is silently skipped forever.
  - q: Why avoid NOLOCK on report queries?
    choices: ['It can read uncommitted, half-loaded or even duplicated rows', 'It is slower', 'It blocks the loader']
    ans: 0
    why: NOLOCK reads whatever is on the page right now, including a load in progress. Use snapshot isolation (RCSI) for consistent reads that do not block.
sources:
  - 'Microsoft Learn: MERGE (Transact-SQL) https://learn.microsoft.com/en-us/sql/t-sql/statements/merge-transact-sql'
  - 'PostgreSQL documentation: INSERT, ON CONFLICT clause https://www.postgresql.org/docs/current/sql-insert.html'
  - 'Kleppmann, M. (2017), Designing Data-Intensive Applications, O''Reilly, Chapter 7 (transactions and atomicity)'
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley, Chapter 19 (ETL subsystems: change data capture and loading)'
---

**Module 4 · about 40 minutes · read first: [4.2](/learn/courses/etl/azure-sql-hands-on/).** You'll be able to upsert with a staging table and MERGE, replace a day atomically with delete-insert, choose append-only or rebuild-and-swap where they fit, and keep watermarks and an audit table honest.

<div class="bigidea">A good load is like updating a class register: every name appears once, a re-sent list replaces the old one instead of being added to it, and the change happens all at once or not at all.</div>

## 1. Why this matters

Your Dagster runs are safe to repeat up to the warehouse. The load step is where "it ran twice" turns into "revenue doubled". Production teams use four loading patterns. Choosing the right one per table, and writing it down, prevents most warehouse bugs.

## 2. Pattern 1: staging table + MERGE (upsert by key)

Use it when rows have a stable business key and can change later: ad stats inside the look-back window, bookings that change status.

**Upsert** means "update if the key exists, insert if it doesn't". First bulk-load the new rows into a staging table, then merge them into the target in one transaction:

```sql
-- 1) Python truncates stg.ads_daily_load and bulk-loads today's rows into it
-- 2) one transaction merges them
begin tran;
merge mart.fct_ads_daily with (holdlock) as t
using stg.ads_daily_load as s
   on t.ad_date = s.ad_date and t.campaign_id = s.campaign_id
when matched and (t.spend <> s.spend or t.clicks <> s.clicks or t.conversions <> s.conversions) then
  update set spend = s.spend, clicks = s.clicks, impressions = s.impressions,
             conversions = s.conversions, conversion_value = s.conversion_value, updated_at = sysutcdatetime()
when not matched by target then
  insert (ad_date, campaign_id, spend, clicks, impressions, conversions, conversion_value, updated_at)
  values (s.ad_date, s.campaign_id, s.spend, s.clicks, s.impressions, s.conversions, s.conversion_value, sysutcdatetime());
commit;
```

`with (holdlock)` avoids a known race where two merges running at once both insert the same key. Many SQL Server engineers prefer an explicit `update` followed by `insert ... where not exists`, inside one transaction: easier to read and debug, same result. (If columns can be null, compare them with a null-safe test; `<>` treats null as "unknown".) Postgres uses `insert ... on conflict (keys) do update`, shown in the next lesson.

<div class="steps" data-fig="loading-patterns-merge">
<div class="step"><b>Staging.</b> Today's look-back load puts 4 rows in <code>stg.ads_daily_load</code>: 09-14 C1 = 120, 09-14 C2 = 95, 09-15 C1 = 130, 09-15 C2 = 88 (spend in dollars).</div>
<div class="step"><b>Match on the key.</b> The target already has 09-14 C1 and 09-14 C2. The two 09-15 keys are new.</div>
<div class="step"><b>Matched rows.</b> 09-14 C1 is still 120: no change, skip it. 09-14 C2 was 80 and is now 95 (late conversions came in): update it.</div>
<div class="step"><b>Not matched.</b> Insert 09-15 C1 and 09-15 C2.</div>
<div class="step"><b>Result.</b> The target goes from 4 rows to 6. The audit row says 2 inserted, 1 updated, 0 deleted. Run the same load again: 0 inserted, 0 updated.</div>
</div>

<div class="problem" data-problem="loading-patterns-merge-count"></div>

Press Next day, then Load changes, then Re-run same load with each write mode.

<figure class="fig" data-fig="@data-watermark-load"><figcaption>Notice that the watermark limits what is copied, and that MERGE is safe to repeat while a blind APPEND makes duplicates.</figcaption></figure>


## 3. Pattern 2: delete-insert a partition

Use it when the source gives you the **complete** set for a slice: a whole business day of till lines, a full day of ad stats.

```sql
begin tran;
delete from mart.fct_qsr_lines where business_date = @d;
insert into mart.fct_qsr_lines (...) select ... from stg.qsr_lines_load where business_date = @d;
commit;
```

Simple, safe to repeat, and it handles **deletions** in the source: rows that vanish from the re-sent day vanish from the target. It is the warehouse half of "replace the partition" from [Lesson 3.4](/learn/courses/etl/partitions-backfills/). For very large tables, SQL Server **partition switching** does the same as an instant metadata change.

The transaction is not optional. Without it, a crash between the two statements leaves the day half-empty:

<div class="problem" data-problem="loading-patterns-partial"></div>

## 4. Pattern 3: append-only, deduplicate when reading

Raw tables: append every load with a `load_id` and `loaded_at`, never update. Staging views pick the latest row per key ([Lesson 2.5](/learn/courses/etl/duplicates-entity-resolution/)). Cheapest to write and keeps full history; the cost is that every reader must deduplicate.

## 5. Pattern 4: full rebuild, then swap

Small dimensions (stores, campaigns, menu items): build the new version into `mart.dim_campaign__new`, check it, then swap names in one transaction so readers see either the old table or the new one, never a half-built one.

```sql
begin tran;
exec sp_rename 'mart.dim_campaign', 'dim_campaign__old';
exec sp_rename 'mart.dim_campaign__new', 'dim_campaign';
commit;
drop table mart.dim_campaign__old;
```

In Postgres, `alter table ... rename` inside a transaction does the same, or point a view at versioned tables.

| Pattern | Use when | Handles source deletes? |
| --- | --- | --- |
| Staging + MERGE | Rows have a key and change later | No (needs extra logic) |
| Delete-insert | The source sends a complete slice | Yes, within the slice |
| Append-only | Raw history, cheap writes | Kept as history |
| Rebuild + swap | Small tables, full refresh | Yes |

<div class="meaning">

<dl>
<dt>Upsert</dt><dd>Update the row if its key exists, insert it if not. Repeating it changes nothing.</dd>
<dt>Transaction</dt><dd>A group of changes that all happen or none do. Readers never see the middle.</dd>
<dt>Watermark</dt><dd>A stored note of how far the last successful load got, such as the latest timestamp loaded.</dd>
<dt>Load audit</dt><dd>One row per load: what, which partition, rows inserted, updated and deleted, start, end, status.</dd>
<dt>Physical meaning</dt><dd>An ad platform adds late conversions to last week's numbers every day. With a 7-day look-back MERGE, the warehouse quietly corrects itself each morning, reruns cost nothing, and the audit table shows "0 inserted, 37 updated", which is exactly the shape you expect.</dd>
</dl>

</div>

<div class="myth">

**"MERGE handles everything, so use it for every table."** MERGE only sees the keys you send it. If a voided order disappears from a re-sent day, MERGE never hears about it and the old row stays forever. For complete slices, delete-insert is simpler and correct.

</div>

## 6. Watermarks and the audit table

```sql
create table ops.watermark (source sysname primary key, high_water datetime2 not null, updated_at datetime2 not null);

create table ops.load_audit (
  load_id uniqueidentifier primary key default newid(), asset sysname, partition_key varchar(32),
  rows_staged int, rows_inserted int, rows_updated int, rows_deleted int,
  started_at datetime2, finished_at datetime2, status varchar(16), error nvarchar(4000));
```

Update the watermark **in the same transaction** as the data. If the data commit fails, the watermark does not move, and the next run retries the same window.

Pick the pattern **per table** and write it in the table's description: "`fct_ads_daily`: MERGE on (ad_date, campaign_id), 7-day look-back". When something looks wrong, the first question is "how is this table loaded?", and a one-line answer saves an hour. Capture inserted, updated and deleted counts with `MERGE ... OUTPUT $action` into the audit table: a sudden spike in updates is often the first sign a source has started re-sending history.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a transaction makes a group of changes atomic: all happen, or none do.

**Equation:** for a starting state `$S$` and operations `$o_1, \dots, o_k$`, a transaction ends in either

```math
S' = o_k \circ \dots \circ o_1(S) \quad \text{or} \quad S' = S
```

and no in-between state `$o_j \circ \dots \circ o_1(S)$` with `$j < k$` is visible to other readers (at normal isolation levels).

**Analogy:** a bank transfer. Money leaves one account and arrives in the other, or neither happens. Nobody ever sees it gone from both.

**Where it breaks:** under `READ UNCOMMITTED` (or `NOLOCK` hints) readers *can* see the in-between state. Do not use `NOLOCK` on report queries; [Lesson 4.5](/learn/courses/etl/tsql-for-warehouses/) explains RCSI instead.

**Try it:** delete 40,000 rows, insert 41,200, and the insert fails at row 30,000, with no transaction. Rows left for the day? (30,000, so the report is wrong. With a transaction: the original 40,000.)
</details>

## 7. Try it

1. Create `mart.fct_ads_daily` with a primary key on `(ad_date, campaign_id)`. Load with Pattern 1. Rerun the same 7 days: zero inserts, updates only where values changed.
2. Load restaurant till lines with Pattern 2 by business date. Delete 5 rows from one day's staging and reload: the target matches.
3. Rebuild `dim_campaign` with Pattern 4.
4. Interrupt a delete-insert on purpose: add a `time.sleep(10)` between the statements in Python, then press Ctrl+C. Count the rows with and without a transaction.
5. Fill `ops.load_audit` using `MERGE ... OUTPUT $action` counts.

**What to check:** the second run of the same window shows 0 inserted; the interrupted load with a transaction leaves the original row count; every load has an audit row with a status. Commit as `feat(load): merge, delete-insert, swap patterns with audit and watermarks`.

<div class="keypoints">

- Staging + MERGE upserts by key: matched rows update (or skip), new keys insert, reruns change nothing.
- Delete-insert replaces a complete slice in one transaction and is the only simple pattern that handles source deletions.
- Append-only keeps raw history cheaply; rebuild-and-swap refreshes small tables with no half-built moment.
- Wrap multi-statement loads in a transaction, and move the watermark in that same transaction.
- Record inserted, updated and deleted counts per load; unusual counts are your early warning.

</div>
