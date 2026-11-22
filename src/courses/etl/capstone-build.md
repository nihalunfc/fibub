---
title: 'Capstone: a daily data platform'
summary: 'Combine the six module projects into one platform that runs from one command, survives a late file and a bad file, and proves every report number.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: You are behind schedule on the capstone. What is the best move?
    choices: ['Stay up and add every business', 'Ship the core path end to end with excellent docs, and list the rest as linked next steps', 'Skip the tests to save time']
    ans: 1
    why: A finished, honest, well-documented platform beats an unfinished ambitious one every time. Hotels and ads can link to Projects 3 and 4 as next steps.
  - q: In the demo, store R107 sent nothing. What should the morning email show?
    choices: ['R107 with $0 sales', 'A banner: R107 not received, left out of the totals', 'Yesterday''s R107 numbers']
    ans: 1
    why: Missing is not zero. A zero tells a manager the store had a disastrous day; a banner tells them the truth.
  - q: What should the last asset check before the email prove?
    choices: ['That the email template renders', 'That the report total equals the arrived files minus duplicates and quarantined rows, plus any explained changes', 'That Dagster is running']
    ans: 1
    why: An end-to-end reconciliation closes the loop. If the numbers do not add up, the email waits until someone explains the gap.
sources:
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley, Chapter 19 (ETL subsystems) and Chapter 20 (ETL system design)'
  - 'Dagster documentation: Sensors, partitions and asset checks https://docs.dagster.io/'
  - 'Reis, J. and Housley, M. (2022), Fundamentals of Data Engineering, O''Reilly, Chapter 2 (the data engineering lifecycle and its undercurrents)'
---

**Module 7 capstone · about 45 minutes to read, several days to build · read first: the six projects ([1.7](/learn/courses/etl/proof-retail-ingest/), [2.7](/learn/courses/etl/proof-qsr-clean/), [3.7](/learn/courses/etl/proof-hotel-dagster/), [4.7](/learn/courses/etl/proof-ads-warehouse/), [5.7](/learn/courses/etl/proof-restaurant-dbt/), [6.7](/learn/courses/etl/proof-chain-dashboards/)) and Lessons 7.1 to 7.5.** You'll combine everything into one platform that starts from one command, handles a messy morning on its own, and proves that every number on every report comes from the files that arrived.

<div class="bigidea">The capstone is one building made from the six rooms you already built: the test is not any single room, but whether a whole messy morning flows through the house and the right report reaches the right person by 08:00.</div>

## 1. The brief

You are the first data hire at a fictional **holding company** that owns:

- a **12-store grocery chain** (sales by email, one file per store),
- an **18-restaurant quick-service group** with three brands (point-of-sale exports on a shared drive),
- a **5-hotel group** (property-system files over SFTP),
- an **in-house marketing agency** running ads for all three (an ads API).

Every morning the data arrives by email, shared drive, SFTP and API. Managers want their reports by 08:00. The owner wants to know what it all costs. All data comes from the [course generator](/learn-kit/etl/starter/generate_data.py), with faults planted on purpose.

## 2. Target architecture

```text
generate_data.py ──► landing/ (email, shared drive, SFTP, API)
                       │
Dagster ─ sensors ─► land_* assets ─► raw zone (Parquet + manifest, MinIO or a folder)
         schedules     │
                       ├─► clean_* assets (contracts, quarantine, data quality checks)
                       ├─► load to warehouse (Postgres | Azure SQL | DuckDB, chosen by a resource)
                       ├─► dbt models (staging → marts; tests as asset checks; partitions)
                       ├─► reports: email + PDF, Power BI refresh trigger
                       └─► ops: load_audit, dq_results, report_sent, SLOs
BI: Power BI (PBIP) + Metabase on Postgres · Health: ops board · CI: GitHub Actions
```

Every box is something you built in Modules 1 to 7. The capstone is mostly **wiring and proving**, not new ideas.

Set the failure chance and the retries, then run the pipeline several times.

<figure class="fig" data-fig="@data-dag-retry"><figcaption>Notice that a failed task blocks everything after it, and that retries rescue short faults.</figcaption></figure>


## 3. The demo morning

Script a morning you can replay on camera. It shows every safety net working at once.

<div class="steps" data-fig="capstone-build-morning">
<div class="step"><b>04:00.</b> Hotel files land. H5's file is still being written (<code>.partial</code>), so the landing sensor leaves it alone.</div>
<div class="step"><b>06:00.</b> Grocery emails arrive. Store 107 sent nothing, store 103 sent the same file twice, and store 110's file has renamed columns.</div>
<div class="step"><b>06:15.</b> The schedule runs. The duplicate is dropped by its hash, store 110 is quarantined with a blocker for that store only, and 107 shows as <i>missing</i>, not zero.</div>
<div class="step"><b>07:40.</b> H5's file finishes. The sensor sees it and reruns that one hotel partition; nothing else is touched.</div>
<div class="step"><b>07:55.</b> The email goes out with a banner naming 107 and 110. Dashboards say "data as of 07:52".</div>
</div>

<div class="meaning">

<dl>
<dt>End-to-end run</dt><dd>One command takes data from landing to the email and dashboards, with no hand steps.</dd>
<dt>Missing is not zero</dt><dd>A source that sent nothing is shown as missing and left out of totals, never counted as zero sales.</dd>
<dt>Reconciliation check</dt><dd>The last asset check: report total = arrived files − duplicates − quarantined ± explained changes.</dd>
<dt>Acceptance criteria</dt><dd>The list of things that must be true, each with a link to proof in the repo.</dd>
<dt>Physical meaning</dt><dd>At 07:55 the grocery chain's operations manager opens the email, sees "store 107 not received" at the top, and calls that store before her 08:30 meeting, instead of discovering at noon that the chain total was quietly short.</dd>
</dl>

</div>

## 4. Closing the loop: reconciliation

Each step can be right on its own and the whole can still leak. The final asset check before the email ties the report back to the files, like [Lesson 6.6](/learn/courses/etl/reconciliation/) but automated.

```python
@dg.asset_check(asset="qsr_daily_email_data", blocking=True)
def report_reconciles(context, warehouse: Warehouse) -> dg.AssetCheckResult:
    bdate = latest_business_date(warehouse)   # or the partition key, if your Dagster version supports partitioned checks
    raw  = warehouse.scalar("select sum(amount) from ops.raw_totals where business_date = ?", bdate)
    dups = warehouse.scalar("select sum(amount) from ops.dedup_log where business_date = ?", bdate)
    held = warehouse.scalar("select sum(amount) from ops.quarantine where business_date = ?", bdate)
    shown = warehouse.scalar("select sum(net_sales) from mart.fct_store_daily where business_date = ?", bdate)
    gap = round(shown - (raw - dups - held), 2)
    return dg.AssetCheckResult(passed=abs(gap) < 0.01, metadata={"gap": gap})
```

The exact table names follow your own projects; the shape is what matters. A blocking check stops the email until someone explains the gap.

<div class="problem" data-problem="capstone-build-reconcile"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** an end-to-end check closes the loop: the number on the report must be derivable from the files that arrived.

**Equation:** for each source `$s$` and business date `$d$`,

```math
\text{report}_{s,d} = \sum \text{raw}_{s,d} - \text{dups}_{s,d} - \text{quarantine}_{s,d} \pm \text{explained changes}_{s,d}
```

**Analogy:** balancing a till at closing time: cash at the start plus sales minus refunds must equal the cash in the drawer. If it does not, you count again before going home.

**Where it breaks:** sources with no control totals. Then compare with the source's own row counts or file sums.

**Try it:** grocery raw $120,400 for a day, duplicates $3,100, nothing quarantined, refunds of $900 shown on their own line. Gross sales on the report? ($120,400 − $3,100 = $117,300, with refunds of $900 as a separate line.)
</details>

## 5. Acceptance criteria

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | `just demo` generates data, starts the stack (Docker Compose) and materialises everything | README, video |
| 2 | Four sources land idempotently with a manifest and a completeness report | screenshot, test |
| 3 | Contracts, quarantine, five data quality families, robust volume checks | quality report |
| 4 | Dagster: partitions, sensors, retries, blocking checks, a backfill | screenshots |
| 5 | Warehouse resource with at least 2 targets; merge or delete-insert; load audit | tests, audit query |
| 6 | dbt star schemas for all four businesses; SCD2; tests; docs | dbt docs |
| 7 | Metric dictionary; menu engineering; hotel pace; ROAS; grocery basket | docs, dashboards |
| 8 | Power BI (PBIP) and Metabase dashboards; row-level security; freshness banner | screenshots |
| 9 | Idempotent daily email with the partial-data rule | screenshot |
| 10 | SLOs, health board, 2 triage reports, 1 incident review ([7.1](/learn/courses/etl/observability-incidents/)) | docs |
| 11 | CI green; data diff; Dockerfile; deploy and rollback docs ([7.2](/learn/courses/etl/cicd-safe-change/)) | Actions run |
| 12 | Cost model, security and ops plan, business case, ADRs ([7.3](/learn/courses/etl/choosing-tools/), [7.4](/learn/courses/etl/low-cost-open-stack/)) | docs |

`just` is a small command runner: a `justfile` lists named recipes such as `demo`, so one short command runs the whole sequence. A Makefile works too. Download the [acceptance checklist](/learn-kit/etl/templates/capstone-acceptance.md) and keep it as `docs/acceptance.md`.

<div class="myth">

**"A bigger capstone is a better capstone."** Reviewers open the README, try the five-minute run and click two evidence links. A platform with four half-wired businesses fails all three. If you are behind, ship the **core path** (grocery and restaurants end to end, one warehouse, one BI tool) with excellent docs, and list hotels and ads as "next", linked to Projects 3 and 4.

</div>

## 6. Build checklist

1. **One repo, one command.** Bring the six projects in as packages (or one tidy monorepo). Write the `justfile`: generate data, `docker compose up -d`, materialise everything.
2. **Wire the morning.** Script the five demo events above (a small Python script that drops files at the right moments into `landing/`).
3. **Reconcile.** Add the blocking reconciliation check before the email.
4. **Tick the table.** Work down the acceptance criteria in order. Tick an item only when its evidence link works.
5. **Fresh-clone test.** Clone into an empty folder on another machine (or a clean container) and run `just demo`. Fix whatever you forgot to commit.
6. **Record the demo.** Two to three minutes: the morning from 04:00 to 07:55, then the email, a dashboard and the health board.

**What done looks like:** `just demo` on a fresh clone finishes with the email sent and the banner naming 107 and 110; rerunning it changes no row counts; the reconciliation check passes for every business date; every row of `docs/acceptance.md` is ticked with a working link. Commit as `feat: capstone daily-data-platform`.

<div class="keypoints">

- The capstone wires the six projects into one platform that runs from one command.
- A scripted demo morning shows every safety net: partial files, missing stores, duplicates, drift, late files.
- Missing is not zero: name missing sources in a banner and leave them out of totals.
- A blocking reconciliation check proves report totals come from the files that arrived.
- Finished and honest beats unfinished and ambitious: ship the core path first.

</div>
