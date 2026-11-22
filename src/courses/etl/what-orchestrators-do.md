---
title: What an orchestrator really does
summary: 'Cron can start a script. An orchestrator knows what depends on what, retries, waits for late files and reruns last month. Learn DAGs, assets and the two clocks.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: Why must every step be safe to run twice when an orchestrator runs it?
    choices: ['Retries and restarts mean the same step can run more than once for the same data', 'Orchestrators run each step exactly once, so it does not matter', 'Steps that can run twice are faster']
    ans: 0
    why: Orchestrators deliver "at least once". A retry after a timeout, or a machine restart, repeats the step. If repeating it doubles the data, the numbers are wrong.
  - q: 'A step picks its business date with date.today() - 1. What breaks?'
    choices: ['Backfills and reruns on another day process the wrong date', 'Nothing, it is the normal way', 'Only weekend runs']
    ans: 0
    why: Business time must be passed in (the partition key), not read from the wall clock. Otherwise rerunning 1 August on 20 September processes 19 September.
  - q: What does asset-based orchestration give you over task-based?
    choices: ['The orchestrator knows which data exists, where it came from and what is out of date downstream', 'It always runs faster', 'You no longer need Python']
    ans: 0
    why: A task-based tool knows jobs. An asset-based tool knows tables and files, so it can show lineage and staleness.
sources:
  - 'Dagster documentation: Software-defined assets and the asset graph https://docs.dagster.io/'
  - 'Apache Airflow documentation: DAGs and task concepts https://airflow.apache.org/docs/'
  - 'Reis, J. and Housley, M. (2022), Fundamentals of Data Engineering, O''Reilly, Chapter 2 (orchestration as an undercurrent)'
  - 'Kleppmann, M. (2017), Designing Data-Intensive Applications, O''Reilly, Chapter 10 (batch processing and workflow schedulers)'
---

**Module 3 · about 30 minutes · read first: [2.6](/learn/courses/etl/quality-gates/).** You'll be able to draw a pipeline as a graph, find its critical path, explain why every step must be safe to repeat, and keep business dates out of the wall clock.

<div class="bigidea">An orchestrator is the head chef of your pipeline: it knows which dish needs which ingredients, starts each step when its inputs are ready, retries what burns, and keeps a record of every service.</div>

## 1. Why this matters

In Modules 1 and 2 you wrote functions that land files and clean them. Something still has to start them every morning. The simplest tool is **cron**, the Unix timer that runs a command at a set time ("run `etl.py` at 06:00").

Cron is a kitchen timer. It rings. It cannot tell you that the script failed, rerun only the part that failed, wait for a file that is late, redo last month after a bug fix, or show which dashboard depends on which file. An **orchestrator** does all of that. Using one well is one of the clearest lines between a beginner's pipeline and a team's pipeline.

## 2. The pipeline is a graph

Draw each step as a box and draw an arrow from A to B when B needs A first. You get a **DAG**, a *directed acyclic graph*:

- **directed:** each arrow points one way ("must happen before");
- **acyclic:** no loops, because a step can never need its own output.

Here is the hotel group from Module 2, five hotels sending booking files overnight:

```text
raw_hotel_files ──► stg_bookings ──► fct_bookings_daily ──► revenue_report
reference_hotels ──────────────────┘
```

Think of a recipe card. You must chop before you fry, but you can chop onions and boil water at the same time. Boxes with no path between them can run **in parallel**. The longest chain of times through the graph, called the **critical path**, is the shortest the whole run can ever take, however many workers you add.

<div class="steps" data-fig="what-orchestrators-do-dag">
<div class="step"><b>06:15, nothing has run.</b> The graph has five boxes. raw files takes 10 min, hotels 1 min, stg 9 min, fct daily 5 min, report 2 min.</div>
<div class="step"><b>Parallel start.</b> No arrow joins raw files and hotels, so the orchestrator starts both at once.</div>
<div class="step"><b>A failure.</b> stg times out reading a locked file. Because the orchestrator records it, it can retry just that step, not the whole pipeline.</div>
<div class="step"><b>Waiting for parents.</b> The retry works. fct daily needs both stg and hotels, so it starts only now.</div>
<div class="step"><b>Done.</b> The report is built. The longest path, 10 + 9 + 5 + 2 = 26 minutes, set the run time. Making hotels faster would save nothing.</div>
</div>

<div class="problem" data-problem="what-orchestrators-do-critical-path"></div>

## 3. Tasks or assets

There are two ways to describe the graph.

- **Task-based** tools (cron, Airflow, classic Prefect) describe *what to run*: "run clean.py, then run model.py".
- **Asset-based** tools (Dagster, and newer Airflow versions with their own "assets") describe *what data should exist*: "the table `stg_bookings` should exist, built from these files by this function".

The difference matters when something changes. If you fix a bug in `stg_bookings`, an asset-based tool knows that `fct_bookings_daily` and the report were built from the old version and are now **stale** (out of date). It knows the **lineage**: where each table came from. A task-based tool only knows that some jobs ran.

This course uses Dagster because its asset view matches how analysts think ("is the revenue table up to date?") and because it is easy to run and test on a laptop. The ideas carry over to any tool. If you later work with Airflow on big data, [Data at Scale](/learn/courses/data-at-scale/airflow/) covers it.

## 4. At least once means safe to repeat

Orchestrators retry failed steps. Machines restart in the middle of a run. A person clicks "rerun". So the same step can run **twice for the same day**. This is called **at-least-once** execution, and you cannot switch it off.

So every step must be **idempotent**: running it twice leaves the same result as running it once. Like pressing a lift button: pressing it again does not call a second lift. You already have the tools:

- land files by their content hash, so the same file is stored once ([Lesson 1.3](/learn/courses/etl/landing-files/));
- **replace** a whole day's data instead of appending to it (Lesson 3.4);
- **upsert** by key, so a row is updated if it exists and inserted if it doesn't ([Lesson 4.3](/learn/courses/etl/loading-patterns/));
- if a step sends an email, write a "sent" record first and check it before sending.

## 5. Two clocks

Every run has two times. Mixing them up is one of the most common pipeline bugs.

- **Scheduling time:** when the run starts. Example: 06:15 on 15 September.
- **Business time:** which data it processes. Example: business date 14 September.

Never work out business time from `now()` or `date.today()` inside a step. The orchestrator passes it in, usually as a **partition key** (a label such as `"2026-09-14"`). Then a rerun of 1 August, done in October, runs exactly the same code for exactly the same date as the original run did.

```python
# Fragile: the answer depends on the day you run it
bdate = date.today() - timedelta(days=1)

# Robust: the orchestrator says which day this run is for
bdate = context.partition_key          # "2026-09-14"
```

<div class="meaning">

<dl>
<dt>DAG</dt><dd>A directed acyclic graph: steps as boxes, "must happen before" as arrows, no loops.</dd>
<dt>Critical path</dt><dd>The longest chain of step times through the graph. No amount of parallel workers can beat it.</dd>
<dt>Idempotent</dt><dd>Safe to repeat: two runs leave the same data as one.</dd>
<dt>Business time</dt><dd>The date the data is about, passed in as a partition key. Scheduling time is just when the run happened to start.</dd>
<dt>Physical meaning</dt><dd>At 06:40 a manager asks "is yesterday's revenue right?" With an orchestrator you open one page: the run for business date 14 September, which steps ran, which retried, how many rows each produced, and which reports used them. Without one, you read log files and hope.</dd>
</dl>

</div>

<div class="myth">

**"An orchestrator is just a fancier cron."** Cron knows the time. An orchestrator knows the graph, the history of every run, which data is stale, and which day each run was for. That is why it can retry one step, wait for a late file, and rerun a month with one click.

</div>

## 6. What belongs where

Keep the orchestrator **thin**. It should start things, not contain the cleaning rules.

| In the orchestrator | In your own Python package | In the warehouse |
| --- | --- | --- |
| Schedules, sensors, retries, partitions, lineage, alerts, run history | Parsing, cleaning rules, API clients: plain functions you can test without the orchestrator | Business logic in SQL or dbt, keys and constraints |

The functions you wrote in Modules 1 and 2 should run from a plain `pytest` test with Dagster not even installed. Dagster wraps them. Teams that put logic inside orchestrator-only callbacks cannot test it, cannot run it locally, and cannot move to another tool later (moves between orchestrators happen often). In an interview, "my assets call pure functions from my own package" is a strong signal.

**Other orchestrators you will meet** (compared properly in [Lesson 7.3](/learn/courses/etl/choosing-tools/)): Airflow (the long-standing standard, huge ecosystem), Prefect (Python flows, easy start), Kestra (YAML, event-driven), Mage (notebook-like blocks), Azure Data Factory and Microsoft Fabric pipelines (low-code, Microsoft), and plain cron plus scripts (fine for three jobs, painful at thirty).

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a DAG always has at least one *topological order*, an order of the steps where every arrow points forward. If every step is pure (same inputs, same output), every valid order gives the same result.

**Equation:** for an arrow `$u \to v$`, a topological order `$\sigma$` has `$\sigma(u) < \sigma(v)$`. The shortest possible run time is the critical path:

```math
T_{\min} = \max_{\text{paths } P} \sum_{v \in P} t_v
```

**Analogy:** course prerequisites. You can take Statistics and Programming in the same term, but Machine Learning only after both.

**Where it breaks:** hidden dependencies. If two steps both write the same table but there is no arrow between them, the orchestrator may run them at the same time and corrupt the table. Make every dependency an arrow.

**Try it:** extract 10 min, three parallel cleans of 6, 9 and 4 min, then a model step of 5 min. Critical path? (10 + 9 + 5 = 24 min.)
</details>

## 7. Try it: design before code

You will build this graph in Dagster in the next lesson. First, plan it on paper.

1. Draw the asset graph for the hotel group: raw booking files, hotel reference data, staged bookings (latest version of each booking), daily on-the-books room nights by stay date, and a revenue report. Mark which boxes are split by business date.
2. For each box write: inputs, where the output is stored, how it stays safe to repeat (replace a day, upsert, or hash), expected run time, and an owner.
3. Write a one-page `docs/run-semantics.md` answering three questions: what happens if the 06:15 run fails at `stg_bookings`; what happens if one hotel's file arrives at 07:40; what happens if a cancellation bug is found 20 days later.
4. Install Dagster in a new project and open its web page:

```bash
uv init hotel-dagster && cd hotel-dagster
uv add dagster dagster-webserver
uv run dagster dev        # then open http://localhost:3000
```

Dagster's scaffolding commands change between releases, so follow the current quickstart at docs.dagster.io if a command above has moved.

**What to check:** every box in your drawing has an idempotency strategy, and every arrow is a real data dependency. Commit with a message like `docs: asset graph and run semantics for the hotel pipeline`.

<div class="keypoints">

- A pipeline is a DAG: boxes are steps or data assets, arrows mean "must happen before". The critical path sets the shortest run time.
- Asset-based orchestrators know what data exists, its lineage and what is stale; task-based ones know only jobs.
- Runs happen at least once, so every step must be idempotent: replace, upsert or hash, never blind append.
- Business time is passed in as a partition key; never compute it from today's date inside a step.
- Keep the orchestrator thin: logic lives in plain, testable functions it calls.

</div>
