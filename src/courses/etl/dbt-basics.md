---
title: 'dbt: SQL models with software discipline'
summary: 'Lay out a dbt project in staging, intermediate and marts; use ref, tests and docs; build incremental models and snapshots; run it on several warehouses.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: "What does {{ ref('dim_menu_item') }} do in a dbt model?"
    choices: ['Copies the table', 'Puts in the right table name for the target and records a dependency, so dbt knows the build order', 'Runs a test on the table']
    ans: 1
    why: ref is how dbt builds its graph of models. Without it, dbt cannot tell which model must run first.
  - q: A dbt data test passes when its query returns...
    choices: ['One row', 'Zero rows', 'The row count of the table']
    ans: 1
    why: A test selects the rows that break the rule. None means the rule holds.
  - q: Which incremental strategy matches "replace each business date that is reloaded"?
    choices: ['append', 'delete+insert keyed on the date (or a partition or microbatch strategy)', 'a view']
    ans: 1
    why: It deletes the slice for those dates and inserts the new version, so reruns never duplicate rows.
sources:
  - 'dbt documentation: About dbt models, ref, sources, data tests and incremental models https://docs.getdbt.com/'
  - 'dbt documentation: snapshots https://docs.getdbt.com/docs/build/snapshots'
  - 'dbt-duckdb adapter (README and configuration) https://github.com/duckdb/dbt-duckdb'
---

**Module 5 · about 40 minutes, plus a long lab · read first: [5.1](/learn/courses/etl/dimensional-modelling-grain/) to [5.3](/learn/courses/etl/senior-sql/), [4.3](/learn/courses/etl/loading-patterns/).** You'll be able to lay out a dbt project, write staging and mart models with `ref` and `source`, add tests and docs, build an incremental fact with a look-back and an SCD2 snapshot, and point the same project at DuckDB, Postgres or Azure SQL.

<div class="bigidea">dbt turns a folder of SQL files into software: each file is one table, dbt works out the order to build them, and every build runs the tests that prove the tables are still right.</div>

## 1. Why this matters

Until now your SQL lived in scripts that ran in an order you remembered. dbt (the open-source **dbt Core**) adds what software teams take for granted: version control, dependencies, tests, documentation and separate environments. It appears in a large share of analytics engineering and BI job adverts, it is free, and it works with Azure SQL, Postgres and DuckDB through **adapters**.

A dbt project is like a recipe book where each recipe names the other recipes it needs ("use the stock from page 12"). The kitchen (dbt) reads all the recipes, works out what to cook first, and tastes each dish (tests) before it goes out.

## 2. Project shape

```text
restaurant_dbt/
├── dbt_project.yml
├── profiles.yml            # connection targets; secrets come from env vars
├── models/
│   ├── staging/            # one model per source table: rename, cast, light cleaning   → views
│   │   ├── _sources.yml
│   │   └── stg_pos__order_lines.sql
│   ├── intermediate/       # joins and business rules                                 → ephemeral or views
│   └── marts/              # facts and dimensions for BI                              → tables or incremental
│       ├── fct_order_lines.sql
│       ├── dim_menu_item.sql
│       └── _marts.yml      # descriptions and tests
├── snapshots/              # SCD2 from sources that only give current state
├── seeds/                  # small CSVs: holidays, channel mapping
└── tests/                  # one-off SQL tests
```

Naming conventions make a project readable by a team: `stg_<source>__<entity>`, `int_<verb>`, `fct_` and `dim_`; one staging model per source table; no business logic in staging; every mart model has a description, a grain sentence and a primary-key test.

Set the failure chance and the retries, then run the pipeline several times.

<figure class="fig" data-fig="@data-dag-retry"><figcaption>Notice that a failed task blocks everything after it, and that retries rescue short faults.</figcaption></figure>


## 3. The basics

```sql
-- models/staging/stg_pos__order_lines.sql
with src as (select * from {{ source('pos', 'order_lines') }})
select
  restaurant_id,
  order_id,
  cast(order_ts as timestamp)                                   as order_ts,
  {{ dbt.dateadd('hour', -5, 'cast(order_ts as timestamp)') }}  as business_ts,   -- 05:00 cut-off, works on any adapter
  channel, menu_item_id, qty, price,
  qty * price                                                   as line_revenue
from src
```

```yaml
# models/marts/_marts.yml
models:
  - name: fct_order_lines
    description: "One row per till order line after removing re-sent batches. Business date uses the 05:00 cut-off."
    columns:
      - name: order_line_key
        data_tests: [unique, not_null]
      - name: menu_item_key
        data_tests:
          - relationships: { to: ref('dim_menu_item'), field: menu_item_key }
      - name: channel
        data_tests:
          - accepted_values: { values: ['counter', 'drive_thru', 'app', 'delivery'] }
```

- `{{ source('pos', 'order_lines') }}` points at a raw table you declared in `_sources.yml`.
- `{{ ref('dim_menu_item') }}` points at another model and records the dependency.
- `dbt build` runs seeds, models, snapshots and tests in graph order, and **skips everything downstream of a failure**.

(Older dbt versions call `data_tests:` simply `tests:`. Check the docs for your version.)

<div class="steps">
<div class="step"><b>Read the graph.</b> dbt parses every <code>ref</code> and <code>source</code>: seed <code>channels</code> → <code>stg_pos__order_lines</code> → <code>int_order_lines_deduped</code> → <code>fct_order_lines</code> → <code>fct_restaurant_daily</code>.</div>
<div class="step"><b>Build in order.</b> The seed loads, then staging builds as a view, then the intermediate model.</div>
<div class="step"><b>Test as it goes.</b> After <code>fct_order_lines</code> builds, its tests run. <code>unique(order_line_key)</code> returns 2 rows: a re-sent batch slipped through.</div>
<div class="step"><b>Stop the damage.</b> <code>fct_restaurant_daily</code> is skipped, so yesterday's correct table stays in place instead of being replaced by doubled numbers.</div>
<div class="step"><b>Fix and rerun.</b> Fix the dedup rule, run <code>dbt build --select fct_order_lines+</code> (the model and everything after it), and all tests pass.</div>
</div>

## 4. Incremental models

Rebuilding years of order lines every morning wastes time and money. An **incremental** model only processes recent rows and merges them in.

```sql
{{ config(materialized='incremental', unique_key='order_line_key',
          incremental_strategy='merge', on_schema_change='append_new_columns') }}

select ... from {{ ref('int_order_lines_deduped') }}
{% if is_incremental() %}
where business_date >= (select {{ dbt.dateadd('day', -3, 'max(business_date)') }} from {{ this }})  -- 3-day look-back
{% endif %}
```

The look-back reprocesses the last few days on every run, so a late file for yesterday is picked up tomorrow. Strategies depend on the adapter (`merge`, `delete+insert`, `append`, `microbatch`). For "replace each business date I reload", the pattern from [Lesson 4.3](/learn/courses/etl/loading-patterns/), use `delete+insert` with the date as the key.

<div class="problem" data-problem="dbt-basics-incremental"></div>

## 5. Snapshots: SCD2 for free

When a source only gives you the current state (a menu table that is simply overwritten), a **snapshot** keeps history for you:

```yaml
# snapshots/menu_snapshot.yml   (newer dbt versions; older ones use a .sql snapshot block)
snapshots:
  - name: menu_snapshot
    relation: source('ref', 'menu_current')
    config: { unique_key: menu_item_id, strategy: check, check_cols: [price, category] }
```

Each `dbt snapshot` compares the current table with the last snapshot and closes and opens versions in `dbt_valid_from` and `dbt_valid_to`: the SCD2 of [Lesson 5.2](/learn/courses/etl/dimensions-scd2/), maintained by dbt. Run it on a schedule; changes between two runs are invisible to it.

## 6. Adapters

| Target | Adapter | Notes |
|---|---|---|
| DuckDB | `dbt-duckdb` | Fastest for local work; can read Parquet files directly as sources |
| Postgres | `dbt-postgres` | Maintained by dbt Labs |
| Azure SQL or SQL Server | `dbt-sqlserver` (community) | Check which incremental strategies it supports |
| Microsoft Fabric warehouse | `dbt-fabric` | For Fabric shops |

Macros like `{{ dbt.dateadd(...) }}` and the `dbt_utils` package hide dialect differences, so one project can target several warehouses. Check each adapter's docs for what it supports today.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a test is a statement that a set is empty: the set of rows that break the rule.

**Equation:** `unique(c)` holds when no two rows share a value of `$c$`; `relationships(c → D.k)` holds when the fact's keys minus the dimension's keys is empty:

```math
\pi_c(F) \setminus \pi_k(D) = \varnothing
```

Here `$\pi_c(F)$` means "the set of values of column `$c$` in table `$F$`".

**Analogy:** proving "no counterexample exists" by searching for one and finding nothing.

**Where it breaks:** a test only checks the data you have today. It can pass for 60 days and fail on day 61, which is why tests run on every build.

**Try it:** write "every order line's revenue is at least 0" as a query that returns the violations. (`select * from {{ ref('fct_order_lines') }} where line_revenue < 0`; the test passes when it returns nothing.)
</details>

<div class="meaning">

<dl>
<dt>Model</dt><dd>One SQL SELECT in one file; dbt turns it into a view or a table.</dd>
<dt>ref / source</dt><dd>Pointers to other models or raw tables; they build the dependency graph.</dd>
<dt>Materialisation</dt><dd>How a model is stored: view, table, incremental or ephemeral (inlined into the next model).</dd>
<dt>Data test</dt><dd>A query that returns rule-breaking rows; zero rows means pass.</dd>
<dt>Snapshot</dt><dd>dbt's way of keeping SCD2 history for a source that overwrites itself.</dd>
<dt>Physical meaning</dt><dd>A re-sent till batch at 05:40 would have doubled one restaurant's sales on the 08:00 dashboard. Instead the unique test failed, dbt skipped the daily table, and managers saw yesterday's correct numbers with a "late" banner while you fixed the rule.</dd>
</dl>

</div>

<div class="myth">

**"dbt moves data."** It does not extract or load anything. dbt sends SQL to a warehouse that already holds the data and the warehouse does the work. Getting data in is the job of your Module 1 to 4 pipeline; running dbt on a schedule is the orchestrator's job (next lesson).

</div>

## 7. Try it

1. `uv add dbt-core dbt-duckdb`, then `dbt init restaurant_dbt` inside your `restaurant-dbt` repo.
2. Declare your Module 2 staging Parquet files (or the DuckDB warehouse) as sources.
3. Build `stg_pos__order_lines`, `int_order_lines_deduped`, `fct_order_lines` (incremental), `fct_orders`, `fct_restaurant_daily`, `dim_restaurant`, `dim_menu_item` (from a snapshot), `dim_date` (a model, or `dbt_utils.date_spine`) and `dim_channel` (a seed).
4. Tests: unique and not-null primary keys, relationships, accepted values, and a one-off test in `tests/` that returns the dates where revenue in staging differs from revenue in the fact.
5. `dbt docs generate` then `dbt docs serve`: take a screenshot of the lineage graph.
6. Add a Postgres target, then Azure SQL. Fix any dialect errors with macros, not copies of the model.

**What to check:** `dbt build` is green on DuckDB; injecting a duplicate row makes the unique test fail and skips the models downstream; the same project builds on a second target. Commit as `feat(dbt): staging, intermediate, marts, snapshots, tests, docs`.

**New words:** *model*, *ref*, *source*, *materialisation*, *incremental*, *look-back*, *snapshot*, *adapter*, *seed*, *macro*.

<div class="keypoints">

- dbt is SQL files plus a graph: ref and source tell it the build order, and dbt build runs models and tests in that order.
- Layers: staging (one per source, no business logic), intermediate (joins and rules), marts (facts and dimensions with descriptions and tests).
- A test returns the rows that break a rule; zero rows means pass, and a failure skips everything downstream.
- Incremental models with a look-back save work and still catch late files; snapshots keep SCD2 history for overwritten sources.

</div>
