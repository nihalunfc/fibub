---
title: 'Project 5: a tested star schema'
summary: 'Ship restaurant-dbt: a documented, tested Kimball star in dbt with SCD2, incremental facts and a conservation test, run by Dagster on two warehouses.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: 'Raw revenue $80,000; duplicates $500; quarantine $200; the fact shows $79,100. What do you conclude?'
    choices: ['All is well', '$200 is unaccounted for: a transform is dropping or changing revenue', 'The duplicates were under-counted']
    ans: 1
    why: 'Expected = 80,000 − 500 − 200 = 79,300. The fact holds 79,100, so 200 must be explained before release.'
  - q: What belongs in every mart model's description?
    choices: ['The author''s name', 'A grain sentence and the key business rules, such as the business-day cut-off', 'The full SQL code']
    ans: 1
    why: The grain and rules let anyone use the table correctly without reading the code.
  - q: Why does the project run on two warehouses (DuckDB and Azure SQL)?
    choices: ['To prove the models are portable and dialect differences are handled by macros', 'Because dbt requires two targets', 'To double the test coverage automatically']
    ans: 0
    why: It shows the logic lives in dbt, not in one vendor's quirks, which is what employers with mixed stacks want to see.
sources:
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley'
  - 'dbt documentation: data tests, documentation and incremental models https://docs.getdbt.com/'
  - 'Dagster documentation: dbt integration https://docs.dagster.io/'
---

**Module 5 project · about 40 minutes to read, a day to build · read first: Lessons [5.1](/learn/courses/etl/dimensional-modelling-grain/) to [5.6](/learn/courses/etl/metrics-semantic-layer/).** You'll ship a dbt project that turns clean till files into a tested star schema, run it from Dagster on two warehouses, and present a short menu analysis a restaurant manager can act on.

<div class="bigidea">A model is ready when its totals match the source at every layer, every table says what one row means, and a stranger can rebuild it with one command.</div>

## 1. What you are shipping

`restaurant-dbt`, for a made-up group of three quick-service brands (burgers, tacos, wings) with about 18 restaurants:

```text
till files ─► Dagster: land, clean, load (Modules 1 to 4)
                 │
                 ▼
dbt: stg_pos__order_lines ─► int_order_lines_deduped ─► fct_order_lines (incremental, look-back)
                                                     ├─► fct_orders
                                                     ├─► fct_restaurant_daily
                                                     └─► fct_menu_engineering
     dim_date · dim_restaurant (is_comparable) · dim_menu_item (SCD2 snapshot) · dim_channel (seed)
                 │
                 ▼
     a dashboard and docs/analysis.md
```

All the data is synthetic, from the course generator in Module 1.

## 2. The proof that ties it together: conservation

A pipeline engineer's star schema is trusted when revenue in equals revenue out, at every layer, for every business date. Encode that as a dbt test that returns the dates where it fails.

<div class="steps">
<div class="step"><b>Raw.</b> For 14 September the landed till files sum to $52,400 over 2,180 lines.</div>
<div class="step"><b>Remove duplicates.</b> A re-sent batch worth $310 is dropped by <code>int_order_lines_deduped</code>. The manifest records it.</div>
<div class="step"><b>Quarantine.</b> Rows with bad timestamps worth $90 go to quarantine with a reason.</div>
<div class="step"><b>Expected.</b> 52,400 − 310 − 90 = $52,000 should reach staging and the fact table.</div>
<div class="step"><b>Check.</b> The test compares that with <code>sum(line_revenue)</code> in <code>fct_order_lines</code> for the date. Equal: pass. Different: the test returns the date and the gap, and the build stops before the dashboard.</div>
</div>

```sql
-- tests/assert_revenue_conserved.sql : returns the business dates where revenue went missing
with raw as (
  select business_date, sum(line_revenue) as rev from {{ source('pos', 'raw_order_lines') }} group by 1
), removed as (
  select business_date, sum(line_revenue) as rev from {{ ref('int_removed_lines') }} group by 1  -- duplicates + quarantine
), fct as (
  select business_date, sum(line_revenue) as rev from {{ ref('fct_order_lines') }} group by 1
)
select r.business_date, r.rev - coalesce(x.rev, 0) as expected, f.rev as actual
from raw r
left join removed x using (business_date)
left join fct f using (business_date)
where abs(r.rev - coalesce(x.rev, 0) - coalesce(f.rev, 0)) > 0.005
```

<div class="problem" data-problem="proof-restaurant-dbt-conservation"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a model is trustworthy when its totals reconcile to the source at every layer.

**Equation:** for each business date `$d$`, for revenue and for quantity,

```math
\sum \text{raw}_d - \text{dups}_d - \text{quarantine}_d = \sum \text{stg}_d = \sum \text{fct}_d
```

**Analogy:** double-entry bookkeeping. Every dollar that leaves one place must arrive somewhere you can name.

**Where it breaks:** legitimate transformations such as currency conversion or netting refunds. Reconcile the measure before the transformation, then check the transformation on its own.

**Try it:** raw revenue $52,400; duplicates $310; quarantine $90. Expected fact revenue? ($52,000.)
</details>

<div class="meaning">

<dl>
<dt>Conservation test</dt><dd>A dbt test that returns the dates where revenue (or quantity) in does not equal revenue out.</dd>
<dt>Grain sentence</dt><dd>One line in each model's description saying what one row stands for and which rules apply.</dd>
<dt>Version key</dt><dd>The SCD2 surrogate key stored on each fact row, resolved at load time.</dd>
<dt>Physical meaning</dt><dd>A regional manager asks why the dashboard shows $200 less than the tills for one day. You open the test history: the conservation test caught it at 05:52, the build stopped, and the cause was a new menu item missing from the dimension. The dashboard never showed the wrong number.</dd>
</dl>

</div>

<div class="myth">

**"If dbt build is green, the numbers are right."** Green means every test you wrote passed. Without a conservation test, a transform can drop $200 a day and every unique and not-null test still passes. Test the totals, not only the keys.

</div>

## 3. Acceptance checks

| # | Requirement | Proof in the repo |
|---|---|---|
| 1 | Every mart model has a description with a grain sentence | dbt docs screenshot |
| 2 | Primary-key, relationships, accepted-values and conservation tests | `dbt build` output |
| 3 | SCD2 menu dimension; facts carry the version key | a test and a query |
| 4 | Incremental fact with a look-back; backfill by Dagster partitions | demo or recorded run |
| 5 | Runs on `dbt-duckdb` and `dbt-sqlserver` (Azure SQL) | CI log or screenshot |
| 6 | `docs/metrics.md` with 20 metrics | file |
| 7 | One-page menu engineering analysis by brand, with recommendations | `docs/analysis.md` |
| 8 | Lineage graph from the source files to the report | screenshot |

## 4. Build checklist

1. **Combine.** Put the Dagster project (Modules 3 and 4) and the dbt project in one repo, or two folders in one monorepo.
2. **One command per target.** `just build-local` (DuckDB) and `just build-azure` (Azure SQL), or the same with `make`.
3. **Tests.** The conservation test above, plus the SCD2 tiling tests from Lesson 5.2.
4. **Backfill.** Change one rule, backfill 60 days through Dagster partitions, and record the runs, concurrency and minutes.
5. **Analysis.** `docs/analysis.md`: menu engineering per brand, top movers and same-store sales, with one chart per point and a recommendation per brand.
6. **README**, in this order: a summary with the lineage screenshot, the problem, the star diagram, the grain sentences, the tests, how to run it, design decisions (SCD2, incremental strategy, business day), next steps.

**Your story** (fill the brackets from your own work): "I modelled a three-brand restaurant group as a Kimball star in dbt, with the business day ending at 05:00, an SCD2 menu dimension so price changes do not rewrite history, and a conservation test that proves revenue in equals revenue out on every build. Dagster runs dbt per business date, so a 60-day backfill is one click and took [N] minutes. The menu-engineering model flagged [item] as a plowhorse; a [x] % price change would add about $[y] a month at current volume."

**What done looks like:** a stranger clones the repo, runs one command, gets a green `dbt build` on DuckDB, and can read in the README what each table means and how it is tested. Every acceptance line has its proof. Commit the final state as `feat: project 5 restaurant-dbt`.

<div class="keypoints">

- The project proves trust, not just SQL: grain sentences, SCD2, incremental loads and a conservation test on every build.
- Raw minus duplicates minus quarantine must equal the fact total for every date; encode it as a test that returns failing dates.
- Two warehouses from one project show that business logic lives in dbt, not in one vendor's dialect.
- A short analysis with recommendations turns a technical project into something a manager values.

</div>
