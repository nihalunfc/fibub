---
title: 'Project 6: BI people can trust'
summary: 'Ship chain-dashboards: Power BI in git, an open-source twin, an idempotent morning email and reconciliation evidence a manager understands in a minute.'
minutes: 40
updated: 2026-11-22
quiz:
  - q: Reviewers do not have Power BI. What is the best way to show your report?
    choices: ['Screenshots and a short video in the README, the PBIP for anyone who wants it, and optionally a live open-source version with synthetic data', 'Email them the .pbix', 'Publish to web with real company data']
    ans: 0
    why: Make it effortless to see, and never expose real data.
  - q: Which link most often breaks trust in BI?
    choices: ['The colour scheme', 'Measures that are subtly wrong in totals or comparisons', 'The number of pages']
    ans: 1
    why: That is why key measures are cross-checked against SQL on the warehouse.
  - q: 'Four links of trust at 99 %, 90 %, 97 % and 95 %. Which one should you improve first?'
    choices: ['The 99 % link', 'The 90 % link', 'Any of them, the gain is the same']
    ans: 1
    why: The chance that all four hold is their product, so raising the weakest link adds the most.
sources:
  - 'Microsoft Learn: Power BI Desktop projects (PBIP) and deployment pipelines https://learn.microsoft.com/power-bi/'
  - 'Few, S. (2013), Information Dashboard Design, 2nd edition, Analytics Press'
  - 'Dagster documentation: asset checks and schedules https://docs.dagster.io/'
---

**Module 6 project · about 40 minutes to read, a day or two to build · read first: Lessons [6.1](/learn/courses/etl/power-bi-models/) to [6.6](/learn/courses/etl/reconciliation/).** You'll ship the BI layer on top of Projects 3 to 5: a Power BI report kept in git, an open-source twin, an automated morning email, and the reconciliation evidence that proves the numbers, all explained so a non-technical manager gets it in a minute.

<div class="bigidea">A report is trusted only when every link holds at once: correct data, correct measures, fresh on time and clear to read, and the project's job is to prove each link with evidence.</div>

## 1. What you are shipping

`chain-dashboards`, on the marts from Projects 3 to 5 (the restaurant group and the hotel group, all synthetic):

- **Power BI**, as PBIP in git: a restaurant operations page, a hotel revenue page, a drill-through, 20 to 25 documented measures, RLS roles and the freshness banner.
- **An open-source twin** in Metabase (or Superset or Evidence) on Postgres, with the same numbers.
- **A daily email** from Dagster: HTML plus CSV, a partial-data banner, a sent record and a test mode.
- **Reconciliation:** the R104 bridge and a daily control-total check that blocks the report.

```text
files ─► Dagster (land, clean, load) ─► dbt marts ─► control-total check ─┬─► Power BI refresh ─► pages
                                                                         ├─► Metabase twin
                                                                         └─► 08:00 email (sent-guard)
```

## 2. The chain of trust

<div class="steps">
<div class="step"><b>Correct data.</b> The conservation test (Project 5) and the control-total check (Lesson 6.6) prove that what reached the marts is what the sources sent.</div>
<div class="step"><b>Correct measures.</b> Five key measures are cross-checked against SQL on the warehouse, including a total row and a day with no sales (Lesson 6.2).</div>
<div class="step"><b>Fresh on time.</b> The refresh is triggered by the load, and the "data as of" time comes from the audit table, with a banner for missing sources (Lessons 6.3 and 6.4).</div>
<div class="step"><b>Clear to read.</b> One page per audience, KPIs with comparisons, sorted bars, and someone who has never seen it finds yesterday's weakest restaurant in ten seconds.</div>
<div class="step"><b>Multiply.</b> At 99 %, 90 %, 97 % and 95 % the chance all four hold is about 82 %. Raise the 90 % link (measures) to 99 % and it climbs to about 90 %. Fix the weakest link first.</div>
</div>

<div class="problem" data-problem="proof-chain-dashboards-trust"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a report's credibility needs every link at once, so it behaves like a product of probabilities, and one weak link drags down the whole.

**Equation:**

```math
P(\text{trusted}) \approx P(\text{data}) \cdot P(\text{measures}) \cdot P(\text{fresh}) \cdot P(\text{clear})
```

Four links at 95 % each give `$0.95^4 \approx 81\%$`.

**Analogy:** a chain holds only as well as its weakest link, and a string of fairy lights wired in series goes dark if any one bulb fails.

**Where it breaks:** the links are not fully independent (a late file hurts both freshness and correctness). The lesson still holds: find and fix the weakest link.

**Try it:** data 99 %, measures 90 %, fresh 97 %, clear 95 %. Which improvement to 99 % helps most? (Measures: the product rises from about 0.82 to about 0.90.)
</details>

The daily control-total check is the piece that keeps the "correct data" link high without anyone watching:

<div class="problem" data-problem="proof-chain-dashboards-controls"></div>

<div class="meaning">

<dl>
<dt>PBIP</dt><dd>The Power BI project format: model and report as text files in git.</dd>
<dt>Open-source twin</dt><dd>The same pages in Metabase, Superset or Evidence, proving the logic lives upstream.</dd>
<dt>Chain of trust</dt><dd>Correct data, correct measures, fresh on time, clear to read; all four must hold.</dd>
<dt>Design notes</dt><dd>A README section listing audiences, their questions, and what you left out and why.</dd>
<dt>Physical meaning</dt><dd>A late hotel file on a Monday shows up as a banner saying "H3 not received", not as a fake 20 % drop in occupancy. The general manager reads the banner, ignores H3 for the morning, and acts on the four hotels whose numbers are real.</dd>
</dl>

</div>

<div class="myth">

**"Publish to web is the easy way to show my report."** It creates a public link anyone can open, is often switched off by company administrators, and must never be used with real company data. Use screenshots, a short video and a synthetic-data twin instead.

</div>

## 3. Acceptance checks

| # | Requirement | Proof in the repo |
|---|---|---|
| 1 | PBIP committed; every measure has a description and a display folder | repo |
| 2 | Five measures cross-checked against SQL, including a total and a blank day | `docs/measure-tests.md` |
| 3 | RLS roles tested with *View as* | screenshots |
| 4 | "Data as of" from the audit table; missing-source banner | a screenshot from a day with a missing source |
| 5 | Open-source twin with matching numbers, plus a costed tool comparison | `docs/bi-comparison.md` |
| 6 | Email report with sent record and test mode | a Dagster run and a screenshot of the received email |
| 7 | Reconciliation document, waterfall and a blocking control-total check | `docs/reconciliation/` and the check's code |
| 8 | Design notes: audiences, questions, what was left out | README |

## 4. Making it easy for reviewers

Reviewers will not install Power BI. Give them, at the top of the README: **screenshots** (PNG), a **60 to 90 second video**, the **PBIP** for anyone who wants to open it, and optionally a public **Metabase or Evidence** version with synthetic data only. Make sure no file contains credentials: connection details are parameters, and the data is synthetic.

## 5. Build checklist

1. **Tidy the pages:** consistent colours, a phone layout for the KPI page, every visual answering a listed question.
2. **Final run:** generate fresh data, run Dagster from end to end, let it trigger the refresh and the email, and record the times in the README.
3. **Break it on purpose:** delete one hotel file and record what the banner, the email and the control-total check do.
4. **Screenshots and video**, then the README: summary, the chain-of-trust evidence (one line per link with a link to its proof), design notes, how to run it, next steps.

**Your story** (fill in your own numbers): "I delivered the same restaurant and hotel marts through Power BI and Metabase. The Power BI model is in git as PBIP with [N] documented measures cross-checked against SQL, row-level security by region and brand, and a 'data as of' label from the pipeline's audit table, so a late hotel file shows as a banner instead of a fake drop in occupancy. A store challenged one month's sales; my bridge explained the gap as tax, business-day timing and refunds, with a $[x] residual traced to [y] quarantined receipts. That is why there is now a daily control-total check that blocks the report."

**What done looks like:** a manager who has never seen the project watches the video and can say what the dashboard is for; a reviewer can follow each acceptance line to its proof; breaking a source produces a visible, honest message instead of a wrong number. Commit the final state as `feat: project 6 chain-dashboards`.

From here, [Module 7](/learn/courses/etl/observability-incidents/) runs all of this in production. When your data outgrows one machine, the [Data at Scale course](/learn/courses/data-at-scale/) picks up with Spark, BigQuery and Kafka.

<div class="keypoints">

- The project proves four links of trust: correct data, correct measures, fresh on time, clear to read.
- Trust behaves like a product, so improve the weakest link first; measures are usually it.
- Show reviewers screenshots, a short video, the PBIP and an optional synthetic-data twin; never publish real data.
- A broken source must produce a visible banner and a blocked check, never a silently wrong number.

</div>
