---
title: Schedules, sensors, retries and alerts
summary: 'Schedules handle the predictable, sensors the unpredictable, retries the flaky and alerts the rest. Build a 06:15 schedule, a file sensor that never runs twice, and alerts that say what to do.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: What stops a sensor from launching two runs for the same file?
    choices: ['A RunRequest run_key equal to the file name', 'minimum_interval_seconds', 'The retry policy']
    ans: 0
    why: Dagster never launches two runs with the same run_key for a sensor, even if the sensor sees the file twice.
  - q: 'An asset fails with "column qty not found". Should it retry 3 times?'
    choices: ['Yes, always retry', 'No. It fails the same way every time (schema drift): fail fast and alert', 'Yes, with exponential backoff']
    ans: 1
    why: Retries help only with temporary failures. A missing column will still be missing in 30 seconds.
  - q: At 06:15 on 15 September, build_schedule_from_partitioned_job targets which daily partition?
    choices: ['2026-09-14', '2026-09-15', 'All partitions']
    ans: 0
    why: It targets the last complete partition. The 15th is not over yet, so the run is for the 14th.
sources:
  - 'Dagster documentation: Schedules, sensors, run status sensors and retry policies https://docs.dagster.io/'
  - 'Google, Site Reliability Engineering (2016), O''Reilly, Chapter 22 (cascading failures, retries and backoff) https://sre.google/sre-book/table-of-contents/'
  - 'Kleppmann, M. (2017), Designing Data-Intensive Applications, O''Reilly, Chapter 8 (faults, timeouts and retries)'
---

**Module 3 · about 35 minutes · read first: [3.4](/learn/courses/etl/partitions-backfills/).** You'll be able to schedule a partitioned job for the right day, write a file sensor that never runs twice for the same file, choose what to retry and how many times, and send alerts someone can act on.

<div class="bigidea">Schedules are the alarm clock, sensors are the doorbell, retries are knocking again when nobody answers, and alerts are the phone call when knocking does not work.</div>

## 1. Why this matters

Here is a real morning for the hotel group. Booking files arrive "around 04:00, sometimes late". Supplier emails arrive from 06:00. The revenue report is due at 08:00. Each part needs a different tool:

- **Schedules** handle the predictable: run at 06:15 every day.
- **Sensors** handle the unpredictable: run when the late file finally lands.
- **Retries** handle the flaky: the API timed out, try again in 30 seconds.
- **Alerts** handle the rest: tell a person what broke and what to do.

## 2. Schedules

First group the assets into a **job** (a named selection of assets to run together), then schedule it:

```python
hotel_job = dg.define_asset_job("hotel_daily", selection=dg.AssetSelection.groups("hotel"), partitions_def=daily)

# runs at 06:15 Toronto time (the partitions' time zone) for yesterday's partition
hotel_schedule = dg.build_schedule_from_partitioned_job(hotel_job, hour_of_day=6, minute_of_hour=15)
```

`build_schedule_from_partitioned_job` targets the **last complete** partition. The 06:15 run on 15 September processes 14 September. That is the two-clocks idea from [Lesson 3.1](/learn/courses/etl/what-orchestrators-do/), built in.

Set the failure chance and the retries, then run the pipeline several times.

<figure class="fig" data-fig="@data-dag-retry"><figcaption>Notice that a failed task blocks everything after it, and that retries rescue short faults.</figcaption></figure>


## 3. Sensors

A **sensor** is a small function Dagster's daemon (its background worker) calls every 30 seconds or so. It looks at the world and returns run requests. Like a doorbell: nothing happens until someone presses it.

```python
import json
from datetime import datetime

@dg.sensor(job=hotel_job, minimum_interval_seconds=120)
def pms_file_sensor(context: dg.SensorEvaluationContext, sftp: SftpSource):
    seen = set(json.loads(context.cursor or "[]"))
    ready = [f for f in sftp.list_ready() if f not in seen]       # .partial files are not "ready"
    for f in ready:
        bdate = datetime.strptime(f.split("_")[-1][:8], "%Y%m%d").date().isoformat()
        yield dg.RunRequest(run_key=f, partition_key=bdate, tags={"source_file": f})
    context.update_cursor(json.dumps(sorted(seen | set(ready))[-500:]))
```

Two ideas keep it safe:

- **`run_key`** makes the sensor idempotent. Dagster never launches two runs with the same key for this sensor, even if it sees the file twice.
- The **cursor** is a small piece of text the sensor keeps between checks: here, the names it has already seen. It saves work; the run key is the real guarantee.

For email, the pattern is the same: list messages received after the cursor's high-water mark ([Lesson 1.4](/learn/courses/etl/email-extraction/)) and request one run per business date.

<div class="steps" data-fig="schedules-sensors-timeline">
<div class="step"><b>04:00.</b> Files from hotels H1, H2, H4 and H5 land on the SFTP server. H3's is missing.</div>
<div class="step"><b>06:15, the schedule.</b> The job runs for partition 2026-09-14 with the four files that are there. The report job will know H3 is missing.</div>
<div class="step"><b>07:40, the sensor.</b> <code>H3_20260914.txt</code> lands. The sensor sees a new name and yields <code>RunRequest(run_key="H3_20260914.txt", partition_key="2026-09-14")</code>. Partition 14 September is rebuilt with all five hotels.</div>
<div class="step"><b>07:42, a second look.</b> The cursor was not saved because of a restart, so the sensor sees the file again. Same run key: Dagster skips it. No double run.</div>
<div class="step"><b>07:55, the report.</b> The data is fresh for all five hotels, so the report goes out complete before the 08:00 deadline.</div>
</div>

## 4. Retries

```python
@dg.asset(retry_policy=dg.RetryPolicy(max_retries=3, delay=30,
                                      backoff=dg.Backoff.EXPONENTIAL, jitter=dg.Jitter.PLUS_MINUS))
def raw_ads(...): ...
```

`delay=30` with exponential backoff waits about 30 s, then 60 s, then 120 s. **Jitter** adds a little randomness so a hundred failed runs do not all retry at the same second.

Retry **transient** failures: timeouts, server errors (HTTP 5xx), a locked file. Do **not** retry **deterministic** failures: a missing column, wrong credentials, a bug. They fail the same way every time, so retrying only delays the alert and can hammer the source. Catch transient errors inside your API client first ([Lesson 1.6](/learn/courses/etl/apis-databases/)); the asset-level retry is the last line of defence.

<div class="problem" data-problem="schedules-sensors-retries"></div>

## 5. Alerts that help

```python
@dg.run_failure_sensor(monitored_jobs=[hotel_job])
def notify_on_failure(context: dg.RunFailureSensorContext):
    run = context.dagster_run
    msg = (f"FAILED {run.job_name} for partition {run.tags.get('dagster/partition')}: "
           f"{context.failure_event.message[:300]}\n"
           f"Runbook: docs/runbooks/hotel.md#failures")
    send_to_chat(msg)        # your function: a Teams or Slack webhook, or email
```

A good alert names the **job**, the **partition**, the **first line of the error**, and a **runbook link** (a page that says what to check first). An alert that just says "pipeline failed" at 06:20 makes someone spend twenty minutes finding out which one. Dagster has integrations for Slack, Microsoft Teams, email and PagerDuty; check the integrations page for current package names.

<div class="meaning">

<dl>
<dt>Schedule</dt><dd>Runs a job at a fixed time, for the right business date.</dd>
<dt>Sensor</dt><dd>A small check that runs every few seconds and requests runs when something happens, such as a file landing.</dd>
<dt>run_key</dt><dd>A unique name for a requested run. The same key never launches twice, so the sensor is safe to repeat.</dd>
<dt>Retry policy</dt><dd>How many times to try again, and how long to wait, for temporary failures only.</dd>
<dt>Physical meaning</dt><dd>One hotel's file is late three mornings a month. Nobody gets up early to rerun anything: the sensor rebuilds that day when the file lands, and the 07:55 report either includes the hotel or says clearly that it is missing.</dd>
</dl>

</div>

<div class="myth">

**"More retries make a pipeline more reliable."** Only for failures that come and go. If the failure is the same every time (a schema change, a bad password), every retry fails too and just delays the alert. With independent failures, 3 attempts at 10 % failure succeed 99.9 % of the time; with a deterministic failure, 100 attempts succeed 0 % of the time.

</div>

**Design for the late file.** The 06:15 schedule runs with whatever arrived. The sensor reprocesses the day when the late file lands. The report job at 07:55 checks freshness: if a hotel is still missing, it sends the report with a clear banner, "Hotel H3 data not yet received; figures exclude H3", instead of silently showing low occupancy. Agree that banner with the business **before** the first incident.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** retries raise the chance of success quickly when failures are independent, and not at all when they are not.

**Equation:** with an independent failure chance `$p$` per attempt, the chance of success within `$n$` attempts is

```math
P = 1 - p^{\,n}
```

For `$p = 0.1$`, three attempts give `$1 - 0.001 = 0.999$`. If the failure is deterministic, `$p = 1$` and `$P = 0$` for every `$n$`.

**Analogy:** flipping a fair coin until you get heads (a few flips will do) versus flipping a two-headed coin until you get tails (never).

**Where it breaks:** a source that is down for an hour makes failures correlated in time. Backoff spreads attempts out so the later ones land after it recovers.

**Try it:** `$p = 0.2$`. How many attempts for at least 99.9 % success? (5 attempts: `$1 - 0.2^5 = 0.99968$`.)
</details>

## 6. Try it

1. Build `hotel_job` and its 06:15 schedule. Turn it on in the UI and use the schedule's test button to see which partition it targets.
2. Write `pms_file_sensor` with run keys and a cursor. Drop a new file into the local folder and watch a run start. Drop the same file again: no new run. Rename a `.partial` file to `.txt`: it triggers.
3. Add a retry policy to the SFTP and API assets. Make the fake API fail half the time and watch the retries in the run log.
4. Add a run-failure sensor that writes alerts to `data/alerts.log` (and to a Slack or Teams webhook if you have a free workspace).
5. Write `docs/runbooks/hotel.md`: for each alert, what it means and the first three things to check.

**What to check:** the same file dropped twice gives exactly one run; a deliberate schema error fails once with no retries and produces an alert that names the partition; the runbook link in the alert opens the right section. Commit as `feat(dagster): schedule, file sensor, retries, failure alerts, runbook`.

<div class="keypoints">

- A schedule built from a partitioned job runs for the last complete partition: 06:15 on the 15th processes the 14th.
- A sensor checks the world every few seconds; a run_key per file means a file seen twice still runs once.
- Retry only transient failures (timeouts, 5xx, locks), with backoff and jitter; fail fast on deterministic ones.
- Success within n independent attempts is 1 − pⁿ; a deterministic failure never succeeds.
- An alert names the job, the partition, the first error line and a runbook link.

</div>
