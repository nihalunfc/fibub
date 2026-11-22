---
title: Asset checks, testing and deploying Dagster
summary: 'Move your quality checks into Dagster so a failed check stops bad data flowing on, test in layers, and run Dagster for real in Docker with Postgres, with the cost worked out.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: When should an asset check be blocking?
    choices: ['When failing means the numbers downstream would be wrong, such as duplicate keys', 'For every check, always', 'Never in production']
    ans: 0
    why: Block on correctness, warn on curiosity. A blocking check that fires on harmless oddities trains people to ignore it.
  - q: Which Dagster process runs schedules and sensors?
    choices: ['The webserver', 'The daemon', 'Postgres']
    ans: 1
    why: The daemon ticks schedules, evaluates sensors and runs the queue. If it stops, nothing automatic happens, even though the UI still loads.
  - q: Why use Postgres instead of SQLite for Dagster's storage in production?
    choices: ['Several processes write run events at once, and Postgres handles that safely and is easy to back up', 'SQLite cannot store text', 'Postgres is faster for a single user']
    ans: 0
    why: The webserver, daemon and runs all write to storage at the same time. Postgres is built for many writers.
sources:
  - 'Dagster documentation: Asset checks, freshness checks, testing, and deploying with Docker https://docs.dagster.io/'
  - 'Docker documentation: Docker Compose https://docs.docker.com/compose/'
  - 'Reis, J. and Housley, M. (2022), Fundamentals of Data Engineering, O''Reilly, Chapter 2 (DataOps) and Chapter 4 (build versus buy)'
---

**Module 3 · about 35 minutes · read first: [3.5](/learn/courses/etl/schedules-sensors/), [2.6](/learn/courses/etl/quality-gates/).** You'll be able to turn quality checks into Dagster asset checks (some of them blocking), add a freshness check, test at five layers, run Dagster in Docker with Postgres, and compare self-hosting with a managed plan honestly.

<div class="bigidea">A blocking asset check is a security gate between kitchen and dining room: if the plate fails inspection, it never reaches a customer, and the head chef hears about it at once.</div>

## 1. Why this matters

In [Lesson 2.6](/learn/courses/etl/quality-gates/) you wrote quality checks that ran on their own, outside the orchestrator. Moving them into Dagster gives three things at once: a failed check can **stop bad data flowing downstream**, its result shows **next to the asset it guards**, and it alerts through the **same channel** as failed runs.

## 2. Asset checks

An **asset check** is a function that inspects one asset and returns pass or fail, with metadata.

```python
import dagster as dg
import polars as pl

@dg.asset_check(asset=stg_bookings, blocking=True, description="booking_id is unique after dedup")
def bookings_unique() -> dg.AssetCheckResult:
    df = pl.read_parquet("data/staging/hotel/stg_bookings.parquet")
    dups = df.height - df["booking_id"].n_unique()
    return dg.AssetCheckResult(passed=dups == 0, metadata={"duplicates": dups})

@dg.asset_check(asset=stg_bookings, description="nightly rate between 40 and 1,500")
def rate_in_range() -> dg.AssetCheckResult:
    df = pl.read_parquet("data/staging/hotel/stg_bookings.parquet")
    bad = df.filter((pl.col("rate_amount") < 40) | (pl.col("rate_amount") > 1500)).height
    return dg.AssetCheckResult(passed=bad / df.height < 0.001, severity=dg.AssetCheckSeverity.WARN,
                               metadata={"out_of_range": bad})
```

`blocking=True` means: if this check fails, assets downstream in the same run are not materialised. Use it when failure means "the numbers would be wrong": duplicate keys, a missing partition, broken references. Use **WARN** severity for "worth a look": a few odd rates.

<div class="steps" data-fig="asset-checks-deploy-gate">
<div class="step"><b>Build.</b> <code>stg_bookings</code> materialises: 1,903 rows.</div>
<div class="step"><b>Inspect.</b> The blocking check <code>bookings_unique</code> runs: 1,903 rows but only 1,900 distinct booking ids.</div>
<div class="step"><b>Stop.</b> 3 duplicates, so the check fails. <code>otb_by_stay_date</code> and the report are skipped, and yesterday's correct report stays in place. An alert goes out with <code>duplicates: 3</code>.</div>
<div class="step"><b>Fix.</b> A hotel re-sent a file under a new name. You fix the dedup to key on content, not file name, and rerun <code>stg_bookings</code>.</div>
<div class="step"><b>Pass.</b> 1,900 rows, 1,900 ids, 0 duplicates. The check passes and the rest of the graph is built.</div>
</div>

**Freshness checks** fail when an asset has not been updated within a window, for example "hotel staging must be updated by 07:30 every day". Dagster provides helpers such as `build_last_update_freshness_checks`, and newer freshness policies; the exact API depends on your version, so check the docs.

## 3. Testing in layers

| Layer | What you test | Tool |
| --- | --- | --- |
| Unit | Plain core functions with nasty little fixtures | pytest |
| Asset | One asset function with fake inputs | pytest, direct call |
| Graph | A few assets wired with local resources | `dg.materialize` |
| Definitions load | The project imports cleanly | `dg.Definitions.validate_loadable(defs)` in a test |
| Data | Real outputs, every run | asset checks |

The first four run in CI before code merges. The last runs in production every day. Like a car: parts are tested in the factory, the assembled car on a test track, and the driver still gets a warning light on the road.

## 4. Deploying Dagster yourself

Dagster in production has three long-running parts, plus storage:

- the **webserver**: the UI you click around in;
- the **daemon**: ticks schedules, evaluates sensors, runs the queue;
- your **code location**: a small server that loads your definitions;
- **storage** for run history: Postgres in production (SQLite is fine on a laptop).

```yaml
# docker-compose.yml (sketch: start from Dagster's maintained Docker example)
services:
  postgres:
    image: postgres:16
    environment: { POSTGRES_USER: dagster, POSTGRES_PASSWORD: "${PG_PASSWORD}", POSTGRES_DB: dagster }
    volumes: [pgdata:/var/lib/postgresql/data]
  code:
    build: .
    command: dagster code-server start -h 0.0.0.0 -p 4000 -m hotel_pipeline.definitions
    env_file: .env
  webserver:
    build: .
    command: dagster-webserver -h 0.0.0.0 -p 3000 -w workspace.yaml
    ports: ["3000:3000"]
    depends_on: [postgres, code]
  daemon:
    build: .
    command: dagster-daemon run -w workspace.yaml
    depends_on: [postgres, code]
volumes:
  pgdata:
```

`dagster.yaml` points run, event-log and schedule storage at Postgres; `workspace.yaml` points at the code server on port 4000. Keep the database password in `.env`, which is never committed.

For a medium company with one or two data people, one small virtual machine running this Compose file, with nightly backups of the Dagster database and the code in git, is a perfectly respectable production setup. Write down how to restart it, how to upgrade it, where the logs are, and who to call. Most outages in small teams are "nobody knew how to restart it".

## 5. Self-host or managed?

Dagster also sells a managed service (Dagster+), and other orchestrators have their own. The fair comparison counts people's time, not just the bill:

<div class="problem" data-problem="asset-checks-deploy-tco"></div>

<div class="meaning">

<dl>
<dt>Asset check</dt><dd>A test attached to one asset that runs with it and records pass or fail plus numbers.</dd>
<dt>Blocking</dt><dd>If the check fails, assets downstream in that run are not built, so wrong numbers never reach a report.</dd>
<dt>Daemon</dt><dd>The background process that makes schedules and sensors happen. No daemon, no automation.</dd>
<dt>TCO</dt><dd>Total cost of ownership: what you pay plus the hours people spend keeping it running.</dd>
<dt>Physical meaning</dt><dd>On a Tuesday a hotel re-sends Monday's file under a new name. Without a blocking check, the 08:00 report shows 3 % more room nights and a manager adjusts prices on it. With one, the report keeps Monday's correct figures, you get an alert saying "duplicates: 3", and the fix is in before anyone notices.</dd>
</dl>

</div>

<div class="myth">

**"Make every check blocking to be safe."** A check that blocks on harmless things (a few rates slightly out of range) stops good data too, and people soon learn to switch it off. Block on what makes numbers wrong; warn on what is merely unusual.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** total cost of ownership = infrastructure + people's time. Self-hosting trades money for time.

**Equation:** with infrastructure cost `$C_{\text{infra}}$`, upkeep `$h$` hours a month and an hourly cost `$w$`:

```math
\text{TCO}_{\text{month}} = C_{\text{infra}} + h \cdot w
```

A small VM (2 to 4 vCPU, 8 GB of memory) is typically tens of dollars a month; managed orchestration is priced by usage or seats. Check current prices and compare at **your** `$h$`.

**Analogy:** owning a car versus a car-sharing plan. The car is cheaper per month until you count the weekends spent fixing it.

**Where it breaks:** hidden hours: upgrades, security patches, and the 2 a.m. "the daemon stopped" call.

**Try it:** a VM at $40 a month with 4 hours of upkeep at $50 an hour, against a managed plan at $250 with 0.5 hours. (Self-host 40 + 200 = $240; managed 250 + 25 = $275. Close: reliability and the team's skills decide.)
</details>

## 6. Try it

1. Add five asset checks to the hotel graph: unique booking id (blocking), rate in range (warn), arrival date not null (blocking), partition row count within a band around the recent median (warn), every hotel id exists in the hotel reference (blocking).
2. Seed a fault: copy one file's rows into staging twice. Confirm the blocking check stops `otb_by_stay_date`.
3. Add a freshness check for staging. Let it go stale and watch it fail.
4. Put the testing-layers table in your README, with at least one test per layer.
5. Run the whole project with Docker Compose and Postgres storage. Restart the containers and confirm the run history survives.

**What to check:** the seeded duplicate produces a red check and a skipped downstream asset; `docker compose down && docker compose up -d` keeps every past run; turning off the daemon container stops the schedule (and turning it on again resumes it). Commit as `feat(dagster): asset checks, freshness, layered tests, docker-compose deploy`.

<div class="keypoints">

- Asset checks run with the asset they guard; blocking ones stop downstream assets so wrong numbers never reach a report.
- Block on correctness (duplicates, missing days, broken references); warn on oddities.
- Test in layers: unit, asset, graph, definitions load in CI, and data checks in production.
- Production Dagster is a webserver, a daemon, a code location and Postgres storage; one VM with Docker Compose is enough for a small team.
- Compare self-hosting and managed plans by total cost: infrastructure plus hours × hourly cost.

</div>
