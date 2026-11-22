---
title: Choosing tools with a written rationale
summary: 'Compare orchestrators, ingestion and transformation tools, port a pipeline to a second orchestrator, then decide with a weighted matrix and an ADR.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: You ported a pipeline from Dagster to Prefect and changed only the orchestration file. What made that possible?
    choices: ['The business logic lived in a plain Python package, not inside orchestrator code', 'Prefect can read Dagster files', 'Both tools use YAML']
    ans: 0
    why: Keep the orchestration layer thin. When the real work is in ordinary functions, switching tools means rewriting a few dozen lines of wiring.
  - q: A company has 300 Airflow DAGs and a team that knows Airflow well. What is the best recommendation?
    choices: ['Migrate everything to Dagster now', 'Stay on Airflow, modernise it, and keep business logic portable', 'Rewrite it all as cron jobs']
    ans: 1
    why: Migration cost and team skills outweigh feature differences. Modernise in place and keep logic in plain Python and dbt so a later move stays cheap.
  - q: In a sensitivity check, the winner flips when one weight moves by 0.1. What do you report?
    choices: ['Nothing; keep the first winner', 'The decision is close and hinges on that criterion, so the people who own it should confirm its weight', 'Remove that criterion']
    ans: 1
    why: Make the hinge visible. A close decision is fine, as long as everyone knows which belief it rests on.
sources:
  - 'Apache Airflow documentation: TaskFlow API and assets https://airflow.apache.org/docs/'
  - 'Prefect documentation: Flows and tasks https://docs.prefect.io/'
  - 'Dagster documentation: Assets and partitions https://docs.dagster.io/'
  - 'Nygard, M. (2011), Documenting Architecture Decisions (the original ADR article) https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions'
---

**Module 7 · about 35 minutes · read first: [3.1](/learn/courses/etl/what-orchestrators-do/) and [3.2](/learn/courses/etl/dagster-assets/).** You'll be able to compare orchestrators, ingestion tools and transformation tools on the criteria that matter, port a pipeline to a second orchestrator, and turn a tool choice into a weighted matrix, a sensitivity check and an ADR anyone can argue with.

<div class="bigidea">Tools change from job to job, but the ideas underneath do not: learn the shared ideas, see how each tool spells them, and write down why you chose one so others can check your reasoning.</div>

## 1. Why this matters

Job ads name different tools: Airflow here, Azure Data Factory there, Prefect somewhere else. Nobody masters all of them. What you can master is the set of **shared ideas** from Modules 1 to 6: idempotent landing, business dates, partitions, retries, checks, upserts. Every orchestrator expresses the same ideas in its own words, the way every car has a steering wheel and brakes even if the buttons move. Someone who knows the ideas can switch tools in a week.

## 2. Orchestrators side by side

| | Dagster | Airflow | Prefect | Mage | Kestra | Azure Data Factory / Fabric |
| --- | --- | --- | --- | --- | --- | --- |
| Thinks in | assets (data first) | tasks in DAGs; assets added in Airflow 3 | Python flows and tasks | blocks in a notebook-like UI | YAML flows, event driven | low-code pipelines |
| Local dev and tests | strong | heavier | very easy | easy | easy (Docker) | in the portal |
| Partitions and backfills | built in | data intervals | your own patterns | basic | good | tumbling windows |
| Lineage | built in, with dbt | through OpenLineage | limited | basic | basic | through Purview |
| Hosting | open source or paid cloud | open source or several managed services | open source or paid cloud | open source or paid | open source or paid | pay per use in Azure |

This is a starting point, not a verdict: features move every release, so check each tool's docs for what is current. In job ads, Airflow is still the most requested, Dagster keeps growing in newer stacks, and Data Factory is everywhere in Microsoft-based companies.

### The same hotel pipeline in Airflow

```python
from airflow.sdk import dag, task          # Airflow 3; Airflow 2 used: from airflow.decorators import dag, task
import pendulum

@dag(schedule="15 6 * * *", start_date=pendulum.datetime(2026, 9, 1, tz="America/Toronto"), catchup=True)
def hotel_daily():
    @task(retries=3)
    def land(ds=None):           # ds = the run's logical date, YYYY-MM-DD: our business date
        return pms.land_day(ds)

    @task
    def stage(path: str):
        return pms.stage(path)

    stage(land())

hotel_daily()
```

### And in Prefect

```python
from prefect import flow, task

@task(retries=3, retry_delay_seconds=30)
def land(bdate: str) -> str:
    return pms.land_day(bdate)

@flow
def hotel_daily(bdate: str):
    pms.stage(land(bdate))
```

Look at what did **not** change: the `pms` module, where the real work lives. That is the payoff of the rule from [Lesson 3.2](/learn/courses/etl/dagster-assets/): keep business logic in plain functions and let the orchestrator only call them.

## 3. Ingestion and transformation tools

- **dlt:** a Python library, code first, runs inside any orchestrator, cheap. Good for APIs and files.
- **Airbyte:** hundreds of ready connectors with a UI; self-host (it needs some infrastructure) or use its cloud.
- **Meltano:** Singer taps and targets driven by a command line and config files; open source.
- **Managed connectors** (Fivetran, Data Factory copy, Fabric): the fastest start and the highest bill at scale, priced by volume or activity.

For transformation, **dbt** is the default ([Lesson 5.4](/learn/courses/etl/dbt-basics/)): dbt Core is open source, and dbt Cloud adds a hosted editor and scheduler. **SQLMesh** is the strongest alternative, with virtual environments and a plan-then-apply workflow. Stored procedures are still common in SQL Server shops.

## 4. Deciding on paper: the weighted matrix

A **weighted decision matrix** lists the criteria, gives each a weight (all weights add to 1), scores each option from 1 to 5, and adds up weight × score. It is like a judge's scorecard: the rules are written before the contest, so anyone can check the result.

<div class="steps">
<div class="step"><b>Weights.</b> A 40-store retail chain cares about running cost (0.4), fit with the team's skills (0.4) and features (0.2).</div>
<div class="step"><b>Scores.</b> Tool A scores 3, 5, 4. Tool B scores 5, 2, 5. B is cheaper and richer; A is what the team already knows.</div>
<div class="step"><b>Totals.</b> A = 0.4 × 3 + 0.4 × 5 + 0.2 × 4 = 4.0. B = 0.4 × 5 + 0.4 × 2 + 0.2 × 5 = 3.8. A wins, narrowly.</div>
<div class="step"><b>Sensitivity check.</b> Move 0.1 from skills to cost (0.5, 0.3, 0.2). A = 1.5 + 1.5 + 0.8 = 3.8. B = 2.5 + 0.6 + 1.0 = 4.1. B wins now.</div>
<div class="step"><b>Report the hinge.</b> "A wins if team skills matter as much as cost; if cost matters more, B wins. Finance and the team lead should agree that weight."</div>
</div>

<div class="problem" data-problem="choosing-tools-matrix"></div>

<div class="meaning">

<dl>
<dt>Weighted matrix</dt><dd>Criteria with weights that add to 1, a 1-to-5 score per option, total = sum of weight × score.</dd>
<dt>Sensitivity check</dt><dd>Move each weight by about 0.1 and see whether the winner changes.</dd>
<dt>ADR</dt><dd>Architecture decision record: a one-page note of the context, options, decision and consequences, kept in the repo.</dd>
<dt>Thin orchestration</dt><dd>The orchestrator only calls plain functions, so switching tools rewrites wiring, not logic.</dd>
<dt>Physical meaning</dt><dd>Two years later a new head of data asks "why are we on Dagster?" Instead of a shrug, there is ADR-002 with the matrix, the hinge and what would make you revisit it. She can agree, or change one weight and see the new answer.</dd>
</dl>

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a weighted matrix makes trade-offs explicit, so people argue about the weights (their real disagreement) instead of the answer.

**Equation:** for option `$j$` with scores `$s_{ij}$` from 1 to 5 and weights `$w_i$`,

```math
\text{score}_j = \sum_i w_i\, s_{ij}, \qquad \sum_i w_i = 1
```

**Analogy:** a school report where maths counts double: the weights say what matters, written down before the marks come in.

**Where it breaks:** criteria that measure the same thing ("easy to learn" and "fast onboarding") count it twice. Merge them first.

**Try it:** weights cost 0.4, skills 0.4, features 0.2. Tool A scores 3, 5, 4; Tool B scores 5, 2, 5. Winner? (A: 4.0; B: 3.8. A, narrowly.)
</details>

<div class="myth">

**"The tool with the most features wins."** Features you will not use are free on the scorecard but cost money and training in real life. For most teams, migration cost and the skills already in the room outweigh a longer feature list. A company with 300 Airflow DAGs and an Airflow-skilled team should usually stay on Airflow, adopt its asset features and OpenLineage, and keep its logic in plain Python and dbt.

</div>

In interviews, "why Dagster and not Airflow?" tests whether you can argue both sides. A good answer: "Dagster's assets, partitions and local testing suited a small team building something new. In a company with hundreds of Airflow DAGs and an Airflow team, I would stay on Airflow and keep the logic portable."

## 5. Try it

1. Port the hotel pipeline (land → stage → on-the-books) to **Airflow** (the official Docker Compose setup, or the Astro CLI) or to **Prefect** (`pip install prefect`, then `prefect server start`). Keep the core module unchanged.
2. Run a backfill in that tool and note how its intervals or parameters compare with Dagster partitions.
3. Re-build the ads ingest with **dlt**. If your machine allows, try **Airbyte** open source with a Postgres destination.
4. Fill in a decision matrix for three company profiles: a 40-store retail chain on Microsoft 365; a 300-restaurant chain on Google Workspace; a 5-hotel group with no IT team. Do the sensitivity check for each. Start from the [decision matrix CSV](/learn-kit/etl/templates/decision-matrix.csv).
5. Write ADR-002 (orchestrator) and ADR-003 (ingestion) for the capstone, using the [ADR template](/learn-kit/etl/templates/adr.md).

**What to check:** the diff of your port touches only orchestration files; each matrix states whether the winner flips under a 0.1 weight change; each ADR says what would make you revisit it. Commit as `docs+feat: Airflow or Prefect port, dlt trial, decision matrices, ADR-002 and ADR-003`.

<div class="keypoints">

- Every orchestrator expresses the same ideas (business dates, partitions, retries, checks) in its own words.
- Keep business logic in plain functions; then a port changes only the wiring.
- Score options with a weighted matrix written before you look at the answer.
- Always run a sensitivity check and report the criterion the decision hinges on.
- Record the choice in an ADR: context, options, decision, consequences and when to revisit.

</div>
