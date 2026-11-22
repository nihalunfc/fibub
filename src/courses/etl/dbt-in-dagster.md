---
title: dbt inside Dagster, and the alternatives
summary: 'Load dbt models as Dagster assets, link them to Python assets, backfill dbt by business date, and compare dbt with SQLMesh and stored procedures.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: What happens to dbt data tests when you load a project with @dbt_assets?
    choices: ['They are ignored', 'They appear as Dagster asset checks on the models they guard', 'They only run in dbt Cloud']
    ans: 1
    why: A failing unique test shows red on the model's asset, next to everything else Dagster checks.
  - q: How does a partitioned Dagster run tell dbt which dates to build?
    choices: ['dbt reads Dagster''s database', 'The partition''s time window is passed as --vars, and the models filter on var()', 'dbt guesses from the clock']
    ans: 1
    why: Vars carry the partition into the SQL, so a 30-day backfill runs dbt for exactly those 30 days.
  - q: You inherit 80 stored procedures. What is the safest first step?
    choices: ['Rewrite them all in dbt over a weekend', 'Run them as they are from the orchestrator with checks and lineage, then move the riskiest to dbt one at a time with reconciliation tests', 'Delete the ones that look unused']
    ans: 1
    why: Make the old system visible first, then change it in small proven steps.
sources:
  - 'Dagster documentation: dbt integration (dagster-dbt) https://docs.dagster.io/'
  - 'dbt documentation: project variables (var) https://docs.getdbt.com/docs/build/project-variables'
  - 'SQLMesh documentation https://sqlmesh.readthedocs.io/'
---

**Module 5 · about 35 minutes, plus the lab · read first: [3.2](/learn/courses/etl/dagster-assets/), [3.4](/learn/courses/etl/partitions-backfills/), [5.4](/learn/courses/etl/dbt-basics/).** You'll be able to load a dbt project into Dagster so every model is an asset, link your Python ingest and report assets to it, backfill dbt by business date, and explain when SQLMesh or stored procedures are the better fit.

<div class="bigidea">Put dbt inside the orchestrator and the whole chain, from email attachment to morning report, becomes one graph with one schedule, one set of checks and one place to look when something breaks.</div>

## 1. Why this matters

In Module 3 Dagster ran your Python: landing files, cleaning, loading. In the last lesson dbt ran your SQL models. Run separately, they need two schedules that must line up ("dbt starts at 06:30, hopefully after the load"), and a failure in one is invisible to the other.

With the `dagster-dbt` integration, every dbt model becomes a Dagster asset. The chain is one graph: `raw_pos → stg_pos_parquet → stg_pos__order_lines → fct_order_lines → fct_restaurant_daily → daily_report`. One sensor or schedule starts it, dbt tests show up as asset checks, and a failed check stops the report.

Think of a relay race. Running dbt on its own clock is like the second runner starting when a stopwatch says so, whether or not the baton has arrived. Inside Dagster, the second runner starts when the baton is in their hand.

## 2. dbt models as assets

```python
# src/restaurant/defs/dbt.py
from pathlib import Path
import dagster as dg
from dagster_dbt import DbtCliResource, DbtProject, dbt_assets

dbt_project = DbtProject(project_dir=Path(__file__).parents[3] / "restaurant_dbt")
dbt_project.prepare_if_dev()              # builds manifest.json while you run `dagster dev`

@dbt_assets(manifest=dbt_project.manifest_path)
def restaurant_models(context: dg.AssetExecutionContext, dbt: DbtCliResource):
    yield from dbt.cli(["build"], context=context).stream()

defs = dg.Definitions(
    assets=[restaurant_models],
    resources={"dbt": DbtCliResource(project_dir=dbt_project)},
)
```

`dbt build` runs, and each model that finishes is reported as an asset materialisation. dbt `data_tests` become Dagster **asset checks** on the model they test. Class and function names change between versions: follow the Dagster docs for the version you install.

## 3. Wiring Python and dbt together

- **Upstream:** a dbt `source` maps to a Dagster asset key. Name your Python asset to match the source, or set the key in `_sources.yml`:

```yaml
sources:
  - name: pos
    tables:
      - name: order_lines
        meta:
          dagster:
            asset_key: ["stg_pos_parquet"]     # the Python asset that writes this table
```

- **Downstream:** a Python asset that sends the report depends on the dbt model's key:

```python
@dg.asset(deps=[dg.AssetKey(["fct_restaurant_daily"])])
def daily_report(context): ...
```

Now the lineage is continuous from the landed file to the email. When the report looks wrong, one click shows every step that fed it.

## 4. Partitioned dbt runs

Your Python assets are already partitioned by business date ([Lesson 3.4](/learn/courses/etl/partitions-backfills/)). Make dbt follow the same partitions:

```python
import json

daily = dg.DailyPartitionsDefinition(start_date="2026-08-01")

@dbt_assets(manifest=dbt_project.manifest_path, partitions_def=daily, select="tag:daily")
def daily_models(context: dg.AssetExecutionContext, dbt: DbtCliResource):
    start, end = context.partition_time_window
    dbt_vars = {"min_date": start.strftime("%Y-%m-%d"), "max_date": end.strftime("%Y-%m-%d")}
    yield from dbt.cli(["build", "--vars", json.dumps(dbt_vars)], context=context).stream()
```

The models read the window in their filter:

```sql
where business_date >= '{{ var("min_date") }}' and business_date < '{{ var("max_date") }}'
```

<div class="steps">
<div class="step"><b>A rule changes.</b> Finance decides delivery-platform fees come off net sales from 1 August. You change one line in <code>int_order_lines_priced</code>.</div>
<div class="step"><b>Pick the range.</b> In the Dagster UI you select <code>daily_models</code> and launch a backfill for 1 to 30 August: 30 partitions.</div>
<div class="step"><b>Each run gets its window.</b> Partition 2026-08-14 runs <code>dbt build --vars '{"min_date": "2026-08-14", "max_date": "2026-08-15"}'</code>. Only that day's rows are replaced.</div>
<div class="step"><b>Checks run per day.</b> The unique test fails on 2026-08-22 (a duplicate batch). That partition goes red; the other 29 succeed and stay published.</div>
<div class="step"><b>Fix one day.</b> Fix the duplicate and rerun only 2026-08-22. The report for August is now complete, and nothing else was touched.</div>
</div>

<div class="problem" data-problem="dbt-in-dagster-backfill"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** joining two graphs at shared nodes gives one graph, and it stays a valid pipeline as long as no loop appears.

**Equation:** with Python nodes `$V_{py}$`, dbt nodes `$V_{dbt}$` and bridge edges `$E_{bridge}$` (from Python assets to dbt sources),

```math
G = (V_{py} \cup V_{dbt},\; E_{py} \cup E_{dbt} \cup E_{bridge})
```

`$G$` has no loop as long as no dbt model feeds a Python asset that writes back into that model's own sources.

**Analogy:** joining two lengths of pipe. Water still flows one way, unless you connect the outlet back to the inlet.

**Try it:** Python `raw_pos` → dbt `stg` → dbt `fct` → Python `report`. You add a Python `fix_pos` that reads `fct` and writes to `raw_pos`. Is there a loop? (Yes: raw_pos → stg → fct → fix_pos → raw_pos.)
</details>

## 5. The alternatives

- **SQLMesh** (open source): SQL models with built-in virtual environments, column-level lineage, and a "plan then apply" workflow. It understands time ranges for incremental models natively. Strong on correctness and on cheap development environments.
- **Stored procedures plus a scheduler** (SQL Agent, Elastic Jobs): still common in Microsoft shops. It works, but testing and lineage are weak. You will meet it, so learn to read and migrate it ([Lesson 4.5](/learn/courses/etl/tsql-for-warehouses/)).
- **Dataform** (Google Cloud, for BigQuery) and **Fabric notebooks and dataflows** (Microsoft) fill the same role inside those platforms. The [Data at Scale course](/learn/courses/data-at-scale/) covers BigQuery and Airflow, the next step up in size.

When you inherit a pile of stored procedures, do not rewrite everything. First wrap each procedure as a Dagster asset (an asset that runs `exec mart.usp_load_sales @d`), add checks and lineage, then move the riskiest or most-changed ones to dbt one at a time, each with a **reconciliation test** that compares the old and new outputs for the same days.

<div class="meaning">

<dl>
<dt>dagster-dbt</dt><dd>The integration that reads dbt's manifest and turns each model into a Dagster asset.</dd>
<dt>Asset check</dt><dd>A test attached to an asset; dbt tests become these automatically.</dd>
<dt>--vars</dt><dd>Values passed into dbt at run time; here, the partition's start and end dates.</dd>
<dt>Bridge edge</dt><dd>The link from a Python asset to the dbt source it writes, which makes lineage continuous.</dd>
<dt>Physical meaning</dt><dd>At 06:20 the hotel file is late. With dbt on its own 06:30 clock, it would build on yesterday's raw data and the report would show a fake drop. With dbt inside Dagster, the models wait for the file, and the report runs when the data is really there.</dd>
</dl>

</div>

<div class="myth">

**"Putting dbt in Dagster means rewriting the dbt project."** The dbt project does not change at all. Dagster reads its manifest and calls `dbt build` for you. You can still run `dbt build` by hand from the same folder.

</div>

## 6. Try it

1. Add `dagster-dbt` to the `restaurant-dbt` repo and load the dbt models as assets.
2. Map the dbt sources to your Python ingest and clean assets so lineage is continuous. Take a screenshot of the whole graph.
3. Partition the daily models by business date and backfill 30 days from the UI. Write down the number of runs, the concurrency and the minutes taken.
4. Inject a duplicate row on purpose. Watch the dbt test go red as an asset check and block the report asset.
5. Optional: port two models to SQLMesh and write ten lines comparing the experience.

**What to check:** the graph runs from the landed file to the report with no gaps; a backfill rebuilds only the chosen days; a failing dbt test stops the report. Commit as `feat(orchestration): dbt models as Dagster assets with partitions and checks`.

**New words:** *dagster-dbt*, *manifest*, *asset check*, *dbt vars*, *partitioned dbt run*, *SQLMesh*, *reconciliation test*.

<div class="keypoints">

- dagster-dbt turns every dbt model into an asset and every dbt test into an asset check.
- Map dbt sources to Python assets and make reports depend on dbt models, so lineage runs end to end.
- Pass the partition window as --vars so backfills rebuild exactly the chosen days.
- Inherited stored procedures: orchestrate and check them first, then migrate one at a time with reconciliation tests.

</div>
