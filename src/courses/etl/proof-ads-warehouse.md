---
title: 'Project 4: one pipeline, any warehouse'
summary: 'Ship ads-warehouse: one Dagster pipeline that loads DuckDB, Postgres or Azure SQL through one resource, with free reruns, an audit trail, security, a benchmark and honest marketing numbers.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'Search: spend $6,000, value $18,000. Social: spend $4,000, value $4,000. What is the total ROAS?'
    choices: ['2.0 (the mean of 3.0 and 1.0)', '2.2', '3.0']
    ans: 1
    why: Total value ÷ total spend = 22,000 ÷ 10,000 = 2.2. The plain mean ignores that more was spent on search.
  - q: Why shade the last 7 days as provisional on the dashboard?
    choices: ['Conversions are still being attributed, so recent figures will rise; nobody should act on them as final', 'Power BI requires it', 'They are forecasts']
    ans: 0
    why: Honest labelling stops people cutting a campaign whose last few days only look weak because conversions have not arrived yet.
  - q: Rerunning the last 7 days of the look-back load should insert how many rows?
    choices: ['Zero: every key already exists, so rows are updated or skipped', 'Seven days of rows again', 'It depends on the warehouse']
    ans: 0
    why: An upsert on (date, campaign) never adds a key twice. The audit table proves it.
sources:
  - 'Dagster documentation: Resources and partitions https://docs.dagster.io/'
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley, Chapter 1 (non-additive facts) and Chapter 19 (ETL subsystems)'
  - 'Google Ads Help: About conversion tracking and conversion delay https://support.google.com/google-ads/'
---

**Module 4 project · about 45 minutes to read, a day to build · read first: Lessons [4.1](/learn/courses/etl/where-data-lives/) to [4.6](/learn/courses/etl/security-cost-azure/).** You'll ship one Dagster pipeline for a marketing agency that loads any of three warehouses with the same code, reruns for free, records every load, keeps each client's data apart, and shows marketing numbers that are honest about what is still changing.

<div class="bigidea">One recipe, any kitchen: the pipeline says "upsert these rows", and a swappable warehouse resource decides whether that means DuckDB on a laptop or Azure SQL in the cloud.</div>

## 1. What you are shipping

`ads-warehouse`, for a fictional agency with 3 clients, 4 ad channels and 24 campaigns (synthetic data from the course generator):

```text
ad platform API (Lesson 1.6) ──► staging (currency fixed, micros converted) ──► Warehouse resource
                                                                                   ├─ DuckDB    (local)
                                                                                   ├─ Postgres  (docker)
                                                                                   └─ Azure SQL (cloud, Entra sign-in)
──► mart.fct_ads_daily, mart.dim_campaign (temporal), mart.dim_date ──► dashboard
```

"Micros" are how some ad APIs send money: millionths of a currency unit, so 1,250,000 means 1.25.

## 2. Marketing numbers, correctly

- **CTR** (click-through rate) = clicks ÷ impressions.
- **CPC** (cost per click) = spend ÷ clicks.
- **CPA** (cost per acquisition) = spend ÷ conversions.
- **ROAS** (return on ad spend) = conversion value ÷ spend.

All four are **ratios**, so the rule from [Project 3](/learn/courses/etl/proof-hotel-dagster/) applies: add up the tops and the bottoms at the level you report, then divide. Never average ratios.

<div class="steps">
<div class="step"><b>Two channels.</b> Search spent $8,000 with ROAS 4.0. Display spent $2,000 with ROAS 1.0.</div>
<div class="step"><b>The tempting answer.</b> (4.0 + 1.0) ÷ 2 = 2.5. This counts display's $2,000 as much as search's $8,000.</div>
<div class="step"><b>Back to values.</b> Search value = 8,000 × 4.0 = $32,000. Display value = 2,000 × 1.0 = $2,000.</div>
<div class="step"><b>Divide the totals.</b> Total ROAS = 34,000 ÷ 10,000 = 3.4. Every dollar spent brought back $3.40, not $2.50.</div>
</div>

<div class="problem" data-problem="proof-ads-warehouse-roas"></div>

**Provisional days.** Ad platforms keep adding conversions to a day for about a week (someone clicks today and buys on Friday; check each platform's own attribution settings). So the last 7 days on the dashboard are **provisional**: shade them, and say so in the legend. Your 7-day look-back upsert from [Lesson 4.3](/learn/courses/etl/loading-patterns/) is what corrects them each morning.

<div class="meaning">

<dl>
<dt>ROAS</dt><dd>Conversion value ÷ spend: dollars back per dollar spent on ads.</dd>
<dt>CPA</dt><dd>Spend ÷ conversions: what one sale or sign-up cost.</dd>
<dt>Provisional</dt><dd>A figure that will still change as late data arrives, shown as such on the chart.</dd>
<dt>Swappable warehouse</dt><dd>One resource interface (upsert, replace_partition, query) with a class per database, chosen by a setting.</dd>
<dt>Physical meaning</dt><dd>A client manager sees display ROAS at 0.6 for the last three days and wants to pause it. The shading reminds them these days are provisional; a week later the same days read 1.1. The dashboard just saved a working campaign.</dd>
</dl>

</div>

<div class="myth">

**"Zero spend means ROAS is zero."** ROAS for a channel with no spend is undefined (dividing by zero), not zero. Show "n/a", and leave the channel out of any weighting. A zero on the chart looks like a disaster that never happened.

</div>

## 3. Acceptance checks

| # | Requirement | Proof in the repo |
| --- | --- | --- |
| 1 | `P2D_WAREHOUSE` = duckdb, postgres or azuresql switches the target; assets unchanged | demo and a test per target |
| 2 | 7-day look-back upsert; a rerun inserts 0 rows | an audit-table query |
| 3 | `ops.load_audit` with inserted, updated and deleted counts | screenshot |
| 4 | USD spend converted with a dated exchange-rate table; the original amount kept | test |
| 5 | Columnstore on the fact (Azure SQL); primary key or unique constraints everywhere | DDL in the repo |
| 6 | Roles and row-level security by client; Entra and managed identity documented | `docs/security.md` |
| 7 | Benchmark table across warehouses, cold and warm medians | README |
| 8 | Dashboard: spend, ROAS and CPA by channel and client; last 7 days shaded provisional | screenshot |
| 9 | Cost note with real numbers from your Azure bill, or an estimate with its arithmetic | `docs/cost.md` |

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** combining ratios across groups needs a weighted average, with each group weighted by its share of the bottom of the ratio.

**Equation:** for channels `$c$` with spend `$S_c$` and conversion value `$V_c$`:

```math
\text{ROAS}_{\text{total}} = \frac{\sum_c V_c}{\sum_c S_c} = \sum_c w_c\,\text{ROAS}_c, \qquad w_c = \frac{S_c}{\sum_k S_k}
```

The plain mean of the ROAS values is right only if every channel spent the same.

**Analogy:** a centre of balance: positions weighted by mass. A heavy channel pulls the total towards its own ROAS.

**Where it breaks:** a channel with zero spend has no ROAS. Leave it out of the weights and show "n/a".

**Try it:** search spent $8,000 at ROAS 4.0; display spent $2,000 at ROAS 1.0. Total? ((32,000 + 2,000) ÷ 10,000 = 3.4, not 2.5.)
</details>

## 4. Build checklist

1. **Finish the pipeline.** Staging with currency and micros fixed, the Warehouse resource for three targets, `fct_ads_daily` (MERGE on date and campaign, 7-day look-back), `dim_campaign` as a temporal table, `dim_date`.
2. **Checks.** Unique (date, campaign), spend that reconciles to the API's own page totals within a cent, and an exchange rate for every USD day: all three blocking.
3. **Security.** Roles, row-level security by client, managed identity or Entra sign-in in Azure; `docs/security.md` says who can do what.
4. **Benchmark.** Your table from Lesson 4.4 in the README, with one paragraph of honest interpretation.
5. **Dashboard.** Streamlit, or Metabase on Postgres, with provisional shading. Power BI arrives in [Module 6](/learn/courses/etl/power-bi-models/) and reuses this mart.
6. **Clean up Azure.** Delete what you do not need, or confirm auto-pause and the budget alert. Note it in `docs/cost.md`.
7. **README.** Summary, an architecture diagram showing the swappable warehouse, "run it in 5 minutes" on DuckDB, design decisions, the benchmark, security, cost, next steps.

**Your story** (with your own numbers): "An agency's ad data keeps changing for a week after each day as conversions are attributed, and one client is billed in US dollars. I built one Dagster pipeline with a warehouse resource that targets DuckDB locally and Azure SQL in the cloud with managed-identity sign-in, upserting a 7-day look-back window so reruns are free. I benchmarked Postgres, DuckDB and ClickHouse on the same queries, and wrote down why Azure SQL was still the right call for a Microsoft 365 agency of this size, and what would change that."

**What done looks like:** `P2D_WAREHOUSE=duckdb` and `P2D_WAREHOUSE=postgres` give identical totals on a fresh clone; the audit table shows a rerun with 0 inserted; two client managers see only their own rows; the dashboard's last 7 days are shaded. Commit the final state as `feat: project 4 ads-warehouse`. Next, [Module 5](/learn/courses/etl/dimensional-modelling-grain/) models this data into a star schema; and when the data outgrows one machine, [Data at Scale](/learn/courses/data-at-scale/) takes over.

<div class="keypoints">

- One Warehouse resource with a class per database lets the same assets load DuckDB, Postgres or Azure SQL.
- A 7-day look-back upsert makes reruns free and lets late conversions correct recent days.
- CTR, CPC, CPA and ROAS are ratios: sum tops and bottoms first; zero spend means "n/a", not 0.
- Shade provisional days so nobody acts on numbers that are still arriving.
- Prove it: audit rows, a benchmark table, a security note and a cost note with real numbers.

</div>
