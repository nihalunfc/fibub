---
title: A low-cost open-source stack for medium companies
summary: 'Design an open-source data platform a small team can run, size it, cost it per location, plan backups and security, and write the business case.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: Which number does a chain's finance team usually relate to best?
    choices: ['The number of CPU cores', 'Rows per day', 'Cost per location per month, and what it delivers']
    ans: 2
    why: Finance already thinks per store, per restaurant or per hotel. Translate the platform into their unit and the conversation gets much easier.
  - q: When is a managed stack that costs more the better choice?
    choices: ['When nobody in the company can own and run a self-hosted platform', 'Never', 'Only when the data is small']
    ans: 0
    why: Infrastructure nobody owns is the most expensive kind. If there is no one to patch, back up and fix it, paying three times as much for a managed service is cheaper overall.
  - q: Why keep the raw zone as Parquet files in object storage?
    choices: ['Postgres cannot store raw data', 'It is cheap, durable, readable by DuckDB, Spark and most other tools, and keeps an easy path to a bigger warehouse', 'Metabase needs it']
    ans: 1
    why: Open file formats lower both the running cost and the cost of leaving a tool later.
sources:
  - 'PostgreSQL documentation: Backup and restore (pg_dump, continuous archiving) https://www.postgresql.org/docs/current/backup.html'
  - 'Metabase documentation https://www.metabase.com/docs/latest/'
  - 'Reis, J. and Housley, M. (2022), Fundamentals of Data Engineering, O''Reilly, Chapter 4 (choosing technologies: cost, build versus buy)'
---

**Module 7 · about 35 minutes · read first: [4.1](/learn/courses/etl/where-data-lives/) and [7.3](/learn/courses/etl/choosing-tools/).** You'll be able to draw a reference platform built from open-source parts, size it from rows a day, estimate its monthly cost and its cost per location, plan security, backups, upgrades and support, and write a one-page business case.

<div class="bigidea">A medium-sized chain does not need an enterprise budget for good data: a few well-chosen open-source parts on one or two servers, run by a small team with a runbook, can deliver the same 08:00 reports for a few dollars per location a month.</div>

## 1. Why this matters

Large companies buy big platforms. Small shops use spreadsheets. In between sit **medium-sized chains**, say 20 to 500 locations with data arriving daily and one to three data people. They need professional reports but cannot justify enterprise licences. Today you design a platform for them, cost it and write the case for it.

Think of it like furnishing a flat. You do not need a designer showroom. Solid, standard pieces that fit together, that you can repair yourself and swap one at a time, will do the job for years.

## 2. The reference architecture

```text
 Sources                     Platform (1 to 2 servers)                                      Users
 ───────                     ─────────────────────────                                      ─────
 Email (IMAP / Graph) ┐
 SFTP / shared drive  ├─► dlt + Python landers ─► MinIO or Blob (raw, Parquet) ─┐
 POS / PMS APIs       ┘     (Dagster assets, sensors, partitions)                │
                                                                                ▼
                                    Postgres (warehouse, marts)  ◄── dbt Core (models, tests)
                                    DuckDB (heavy scans on Parquet, dev, CI)
                                                  │
                     ┌────────────────────────────┼──────────────────────────┐
                     ▼                            ▼                          ▼
              Metabase or Superset         Daily email and PDF        Ollama (local model):
              (dashboards, subscriptions)  (Python + Jinja)           invoice extraction, tagging
 Ops: Dagster UI, Grafana health board, Postgres backups → object storage, GitHub Actions CI
```

Every part is open source and **swappable**: Postgres for Azure SQL, Metabase for Power BI, MinIO for Azure Blob or S3. That is the **upgrade path** when the company grows or joins a Microsoft-based group. The local model piece links to the [Offline AI course](/learn/courses/offline-ai/) if you want to go deeper.

Set the failure chance and the retries, then run the pipeline several times.

<figure class="fig" data-fig="@data-dag-retry"><figcaption>Notice that a failed task blocks everything after it, and that retries rescue short faults.</figcaption></figure>


## 3. Size it, then cost it

<div class="steps">
<div class="step"><b>Rows a day.</b> A 150-restaurant chain sends about 4,000 order lines per restaurant a day: 150 × 4,000 = 600,000 rows a day.</div>
<div class="step"><b>Rows a year.</b> 600,000 × 365 = 219 million rows a year.</div>
<div class="step"><b>Bytes.</b> At about 120 bytes per raw row: 219 million × 120 ≈ 26 GB of raw data a year. In Parquet that is a few GB.</div>
<div class="step"><b>Monthly cost.</b> With example prices: server $120 + storage $10 + 8 hours of upkeep at $60 = $610 a month.</div>
<div class="step"><b>Per location.</b> $610 ÷ 150 ≈ $4.07 per restaurant per month. That is the number to put in front of finance.</div>
</div>

A typical first build for that chain:

| Part | Size |
| --- | --- |
| Platform server | 4 to 8 vCPU, 16 to 32 GB RAM, 200 to 500 GB SSD |
| Postgres | on the same server to start, or a managed Postgres instance |
| Object storage | hundreds of GB, priced in cents per GB a month |
| Local language model | a small model on CPU for low volume, or a GPU box or hosted API for bulk work |

<div class="problem" data-problem="low-cost-open-stack-storage"></div>

Now compare three stacks at 20, 150 and 500 locations: the **open stack** above; a **Microsoft stack** (Azure SQL, Data Factory or Dagster, Power BI licences per user); and a **managed modern stack** (managed connectors, a cloud warehouse, a BI tool). Look up current list prices yourself and write the date you looked each one up. Prices change often, so never copy someone else's.

<div class="problem" data-problem="low-cost-open-stack-per-location"></div>

<div class="meaning">

<dl>
<dt>Reference architecture</dt><dd>A standard drawing of which parts the platform has and how data flows between them.</dd>
<dt>Swappable part</dt><dd>A component behind a standard interface (SQL, Parquet, S3 API), so it can be replaced without rewriting the rest.</dd>
<dt>Total monthly cost</dt><dd>Infrastructure + licences + people time, compared across stacks at the same service level.</dd>
<dt>Cost per location</dt><dd>Total monthly cost ÷ number of locations: the unit a chain's finance team thinks in.</dd>
<dt>Physical meaning</dt><dd>The managing director of a 150-restaurant chain hears "about four dollars per restaurant a month, area managers get yesterday's numbers by 08:00, and the runbook means the next hire can run it". That is a decision she can make in one meeting.</dd>
</dl>

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** total cost = infrastructure + licences + people time. Compare stacks at the same service level, today and at 3× growth.

**Equation:** with infrastructure `$C_{\text{infra}}$`, tool prices `$p_t$` and units `$u_t$`, upkeep hours `$h$` at rate `$r$`, and `$L$` locations,

```math
C = C_{\text{infra}} + \sum_t p_t u_t + h\,r, \qquad \text{cost per location} = \frac{C}{L}
```

**Analogy:** comparing cars by cost per kilometre (fuel, insurance, servicing), not by the price of a full tank.

**Where it breaks:** one-off costs (migration, training) are not monthly. Spread them over 24 to 36 months and add them in.

**Try it:** server $120 + storage $10 + 8 h at $60 = $610 for 150 locations. Per location? (About $4.07.)
</details>

## 4. Running it responsibly

- **Security:** single sign-on in front of Metabase and Dagster (an identity-aware proxy such as oauth2-proxy or Authelia, or your cloud's own), least-privilege database roles, secrets in a vault, disk encryption, a firewall that allows only known addresses.
- **Backups:** nightly `pg_dump` (or continuous WAL archiving) to object storage. The raw zone is already write-once. **Test a restore every month**: a backup you have never restored is a hope, not a backup.
- **Upgrades:** pin versions; upgrade monthly in a staging copy first, with CI running against the new versions.
- **Support:** a runbook, an on-call rota (even if it is one person and a backup), and a paid support option for the most critical part if the business wants one.

<div class="myth">

**"Open source is free."** The licence is free; running it is not. Someone has to patch, back up, upgrade and answer the 07:50 phone call. That time belongs in the cost model. If there is nobody to own the platform, a managed stack at three times the price is the cheaper choice, and an honest business case says so.

</div>

Medium companies do not buy architectures. They buy **outcomes and less risk**: "area managers get yesterday's numbers by 08:00, we stop paying for the old reporting add-on, and if the data person leaves, the next one can run it from the runbook". Lead with the outcome, then the cost per location, then the risks and how you reduce them.

## 5. Try it

1. Draw the capstone's reference architecture (Excalidraw, or diagrams as code with Mermaid or D2) and commit it.
2. Write `docs/cost-model.md` (or a spreadsheet): three stacks × three sizes, with a source and a date for every price.
3. Write `docs/security-and-ops.md`: identities, secrets, backups and the monthly restore drill, upgrade policy, support.
4. Write a **one-page business case** for a fictional 150-restaurant chain: problem, outcome, options, recommendation, cost per location, risks, a 90-day plan.
5. Ask Claude Code to play the chain's sceptical finance director and challenge your case. Revise it.

**What to check:** every price has a source and a date; the cost per location is shown for all three stacks at all three sizes; you actually restored a backup into an empty database and the row counts matched. Commit as `docs: reference architecture, three-stack cost model, ops plan, business case`.

<div class="keypoints">

- Open-source parts on one or two servers can run a medium chain's daily reporting.
- Size from rows a day × bytes per row × 365, then pick the server.
- Total cost = infrastructure + licences + people time; show it per location per month.
- Plan security, tested backups, staged upgrades and support before you go live.
- If nobody can own a self-hosted platform, a managed stack is the cheaper choice.

</div>
