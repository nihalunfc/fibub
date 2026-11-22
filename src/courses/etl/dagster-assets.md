---
title: Dagster assets and your first real project
summary: 'Turn the hotel pipeline into Dagster assets: a graph you can see, run and inspect, with row counts and previews recorded for every run, and logic kept in plain functions.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: Where should the logic that picks the latest version of each booking live?
    choices: ['In a plain function in core/, called by the asset', 'Inside the body of the @asset function', 'In the Dagster web page settings']
    ans: 0
    why: A plain function can be tested without Dagster and moved to any other orchestrator. The asset just calls it.
  - q: You change the code of stg_bookings. Which assets need materialising again?
    choices: ['Only stg_bookings', 'stg_bookings and everything downstream of it', 'Every asset in the project']
    ans: 1
    why: Staleness flows down the graph. Assets upstream (raw files, hotels) did not change, so they stay fresh.
  - q: What does MaterializeResult metadata give you?
    choices: ['A recorded history of facts about each run, such as row counts and a preview, shown in the UI', 'Automatic retries', 'Faster runs']
    ans: 0
    why: Metadata is light observability. Dagster even plots numeric values like row counts over time.
sources:
  - 'Dagster documentation: Defining assets, asset dependencies and metadata https://docs.dagster.io/'
  - 'Polars user guide https://docs.pola.rs/'
  - 'Reis, J. and Housley, M. (2022), Fundamentals of Data Engineering, O''Reilly, Chapter 8 (transformations and data lineage)'
---

**Module 3 · about 35 minutes · read first: [3.1](/learn/courses/etl/what-orchestrators-do/), [2.5](/learn/courses/etl/duplicates-entity-resolution/).** You'll be able to define Dagster assets with dependencies and metadata, run them in the Dagster UI, read a failed run, and keep your logic in plain functions Dagster only calls.

<div class="bigidea">A Dagster asset is a spreadsheet cell for a whole table: a function that says how to build it from the cells it depends on, so Dagster always knows what is fresh and what needs rebuilding.</div>

## 1. Why this matters

In the last lesson you drew the hotel graph on paper. Today it becomes a graph you can see, run and reason about in a web page. From here on, every lab in the course runs through Dagster, so the habits you set today (thin assets, generous metadata) pay off for months.

## 2. Project layout

A layout that keeps the logic separate from the orchestrator:

```text
hotel-dagster/
├── pyproject.toml
├── src/hotel_pipeline/
│   ├── core/            # plain functions: parse, clean, dedup (no dagster import)
│   │   └── pms.py
│   ├── defs/
│   │   ├── assets.py
│   │   ├── resources.py
│   │   └── checks.py
│   └── definitions.py   # the Definitions object Dagster loads
└── tests/
```

`core/` is your kitchen prep area: knives and boards, no restaurant rules. `defs/` is the order system that says which dish to prepare when. Dagster's scaffolding tool and recommended layout change between releases (recent versions use `create-dagster` and the `dg` command). Follow the current quickstart at docs.dagster.io for the scaffold; the asset code below works either way.

Set the failure chance and the retries, then run the pipeline several times.

<figure class="fig" data-fig="@data-dag-retry"><figcaption>Notice that a failed task blocks everything after it, and that retries rescue short faults.</figcaption></figure>


## 3. Your first assets

An **asset** is a Python function decorated with `@dg.asset`. Its name is the name of the table or file it produces. **Materialising** an asset means running the function once and storing what it makes.

```python
# src/hotel_pipeline/defs/assets.py
import dagster as dg
import polars as pl
from hotel_pipeline.core import pms

@dg.asset(group_name="hotel", kinds={"python", "parquet"}, owners=["team:bi"],
          description="Hotel reference data: rooms per hotel.")
def hotels() -> pl.DataFrame:
    return pl.read_csv("data/reference/hotels.csv")

@dg.asset(group_name="hotel", kinds={"polars"})
def stg_bookings(context: dg.AssetExecutionContext) -> dg.MaterializeResult:
    df = pms.read_all("data/landing/sftp/hotel")        # plain function from core/
    latest = pms.latest_version(df)                       # keep the newest row per booking
    latest.write_parquet("data/staging/hotel/stg_bookings.parquet")
    return dg.MaterializeResult(metadata={
        "rows": len(latest),
        "status_changes": df.height - latest.height,
        "preview": dg.MetadataValue.md(latest.head(5).to_pandas().to_markdown()),
    })

@dg.asset(group_name="hotel", deps=[stg_bookings, hotels])
def otb_by_stay_date() -> dg.MaterializeResult:
    """On-the-books room nights per hotel per stay date (confirmed bookings only)."""
    out = pms.on_the_books("data/staging/hotel/stg_bookings.parquet", "data/reference/hotels.csv")
    out.write_parquet("data/marts/hotel/otb_by_stay_date.parquet")
    return dg.MaterializeResult(metadata={"rows": len(out)})
```

Then tell Dagster what to load:

```python
# src/hotel_pipeline/definitions.py
import dagster as dg
from hotel_pipeline.defs import assets

defs = dg.Definitions(assets=dg.load_assets_from_modules([assets]))
```

Run `dagster dev`, open `http://localhost:3000`, find the asset graph and click **Materialize all**. Each run is recorded with its logs, metadata and duration. (The `preview` line needs `pandas` and `tabulate` installed; drop it if you prefer.)

**New words.** *On the books* (OTB) is hotel language: confirmed room nights already booked for a future stay date. *Group* puts related assets together on the graph. *Owners* says who to ask when something breaks.

## 4. Two ways to pass data between assets

1. **You write the file yourself** (as above) and list the parents with `deps=`. Explicit and easy to follow; good for big files and SQL tables.
2. **Return the value** and let an **IO manager** store it; the next asset receives it as a function argument. Less code. The next lesson covers it.

## 5. Staleness: the spreadsheet idea

Think of a spreadsheet. Change one cell and every cell that uses it recalculates. Dagster is a spreadsheet of tables that recalculates only when you ask (or when automation asks for you). When a parent asset changes, its children are marked **stale** until they are materialised again.

<div class="steps" data-fig="dagster-assets-stale">
<div class="step"><b>All fresh.</b> raw, hotels, stg, otb and report were all materialised this morning.</div>
<div class="step"><b>A code change.</b> You fix a bug in the stg code: cancelled bookings were being counted twice.</div>
<div class="step"><b>Stale downstream.</b> otb was built from the old stg, and the report from the old otb. Both are now stale. raw and hotels are not: nothing they read changed.</div>
<div class="step"><b>Rebuild in order.</b> Materialise stg first, then otb, then the report. Dagster works out the order from the arrows.</div>
<div class="step"><b>Fresh again.</b> Only three assets reran. On a real project with a hundred assets, this is the difference between minutes and hours.</div>
</div>

## 6. Metadata: answers before anyone asks

Use metadata generously: row counts, null rates, the earliest and latest business date, a preview. When someone asks "what did the 06:15 run load?", you open the asset page and the answer is there, with a chart of row counts over time. A sudden drop from 1,900 rows to 400 jumps out. That turns Dagster from a job runner into a *data* tool.

<div class="problem" data-problem="dagster-assets-latest-rows"></div>

<div class="meaning">

<dl>
<dt>Asset</dt><dd>A table or file your pipeline produces, plus the function that builds it from its parents.</dd>
<dt>Materialise</dt><dd>Run that function once and store the result. Each materialisation is recorded.</dd>
<dt>Stale</dt><dd>Built from an older version of a parent. It still exists, but it may be wrong.</dd>
<dt>Metadata</dt><dd>Facts saved with each materialisation: rows, previews, dates.</dd>
<dt>Physical meaning</dt><dd>On Monday the revenue manager says the on-the-books numbers look low. You open <code>otb_by_stay_date</code>, see it was built at 06:22 from a <code>stg_bookings</code> that had 400 rows instead of the usual 1,900, click through to that run's log, and find the half-uploaded hotel file in five minutes.</dd>
</dl>

</div>

<div class="myth">

**"The asset function is where the cleaning logic goes."** Put as little as possible there. The asset reads inputs, calls a plain function from `core/`, writes the output and records metadata. The cleaning rules live in `core/`, tested with plain `pytest`, so they work in Dagster, in a notebook, or in any other orchestrator.

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** an asset is a function of its parent assets, and a materialisation is one evaluation of that function.

**Equation:** for an asset `$v$` with parents `$u_1, \dots, u_k$`:

```math
A_v = f_v(A_{u_1}, \dots, A_{u_k})
```

If `$A_u$` or `$f_u$` changes, every asset you can reach from `$u$` along the arrows is stale until it is evaluated again.

**Analogy:** spreadsheet formulas. `=SUM(B2:B9)` updates when B5 changes.

**Where it breaks:** hidden inputs. If `$f_v$` calls an API or reads a file that is not itself an asset, Dagster cannot see it change, so it cannot mark `$v$` stale. Make important inputs into assets.

**Try it:** the graph is raw → stg → otb → report, plus hotels → otb. You fix a bug in stg. Which assets are stale? (otb and report.)
</details>

## 7. Worked example

The raw hotel file for one day has 6 rows for 4 bookings:

| booking_id | status | file_received_at |
| --- | --- | --- |
| B1 | confirmed | 09-01 |
| B1 | cancelled | 09-03 |
| B2 | confirmed | 09-01 |
| B3 | confirmed | 09-02 |
| B3 | confirmed (room change) | 09-04 |
| B4 | confirmed | 09-04 |

`latest_version` keeps the newest row per `booking_id`: B1 cancelled, B2, B3 (room change), B4. So the metadata says `rows: 4` and `status_changes: 2`. If confirmed bookings B2, B3 and B4 stay 2, 3 and 1 nights, `otb_by_stay_date` counts 6 confirmed room nights spread across their stay dates; B1 adds nothing because it is cancelled.

## 8. Try it

1. Move your hotel functions from [Lesson 2.5](/learn/courses/etl/duplicates-entity-resolution/) into `core/pms.py`, with tests that do not import Dagster.
2. Build three assets: `hotels`, `stg_bookings`, `otb_by_stay_date` (confirmed room nights per hotel per stay date: a 3-night booking adds one night to each of three dates).
3. Add a fourth asset `occupancy_forecast_input`: on-the-books room nights ÷ rooms, per hotel, for the next 90 stay dates.
4. Materialise everything in the UI and read the metadata. Then break something on purpose (a wrong path) and read the error in the run log.
5. Give every asset a `description`, `owners` and `group_name`. Take a screenshot of the asset graph for your README.

**What to check:** `pytest` passes with Dagster uninstalled from a scratch environment; the asset graph shows four assets in one group; the `rows` metadata of `stg_bookings` equals the number of distinct booking ids. Commit as `feat(dagster): hotel assets wrapping pure core functions`.

<div class="keypoints">

- An asset is a stored table or file plus the function that builds it from its parents; materialising runs it once and records the run.
- Keep assets thin: read, call a plain function from core/, write, record metadata.
- Pass data by writing files with `deps=`, or by returning values through an IO manager (next lesson).
- When a parent changes, every asset below it is stale until rebuilt; assets above it are untouched.
- Row counts, previews and date ranges as metadata answer "what did this run load?" before anyone asks.

</div>
