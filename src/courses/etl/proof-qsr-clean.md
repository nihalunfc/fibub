---
title: 'Project 2: a trustworthy cleaning pipeline'
summary: 'Ship qsr-clean: contracts, business dates, dedup, quarantine, a quality report, a row conservation test on every run, and a small sales dashboard.'
minutes: 60
updated: 2026-11-22
quiz:
  - q: 'Rows in 10,000; good 9,800; quarantined 150; duplicates removed 30. What does this mean?'
    choices: ['Everything is fine', '20 rows vanished without a trace: some step drops data silently', 'Quarantine should be 170']
    ans: 1
    why: Conservation fails by 20. Find the step that drops rows without counting them.
  - q: Which dashboard question best fits a restaurant operations manager?
    choices: ['Average order value across all brands since opening', 'When are we busy, by hour of the business day and weekday?', 'Total rows loaded per file']
    ans: 1
    why: Staffing and food prep depend on busy hours. That chart supports a real decision.
  - q: An aggregation step turns order lines into orders. What should the conservation test check there?
    choices: ['That rows in equal rows out', 'That a total such as quantity or revenue is the same before and after', 'Nothing; aggregation cannot lose data']
    ans: 1
    why: Aggregation changes the unit, so rows are no longer comparable. Conserve a sum instead.
sources:
  - 'Reis, J. and Housley, M. (2022), Fundamentals of Data Engineering, O''Reilly Media, Chapter 8 (queries, modelling and transformation)'
  - 'pandera documentation https://pandera.readthedocs.io/'
  - 'Streamlit documentation https://docs.streamlit.io/'
  - 'Few, S. (2012), Show Me the Numbers: Designing Tables and Graphs to Enlighten, 2nd edition, Analytics Press'
---

**Module 2 project · about 60 minutes to read and plan, about 4 hours to build · read first: 2.1 to 2.6.** You'll ship `qsr-clean`, a pipeline that turns raw till files into trusted staging data, proves on every run that no row went missing, and shows a first dashboard that a restaurant manager would use.

<div class="bigidea">A cleaning pipeline earns trust by keeping a ledger: every row that goes in comes out as a good row, a quarantined row with a reason, or a counted duplicate, and the books must balance on every run.</div>

## 1. What you are shipping

`qsr-clean` reads the raw till files from the 18 restaurants (from Project 1's raw zone or the landing folder), applies the contract and the cleaning rules, and writes **staging Parquet** and **quarantine**. It runs the **data quality checks** and produces two outputs: the data quality report and a small **sales dashboard**.

Think of a restaurant's back office at closing. The till drawer is counted: cash in the drawer must equal sales minus refunds plus the float. If it is short by $20, nobody goes home until the reason is found. Your pipeline counts its rows the same way.

## 2. Acceptance checks

| # | Requirement | Proof |
|---|---|---|
| 1 | A pandera contract for till lines, in strict mode | A test with a drifted file (an extra column) fails |
| 2 | Business date with a 05:00 cut-off | Tests at 04:59 and 05:00 |
| 3 | The cp1252 brand's files decode correctly | A test with `ñ` |
| 4 | Re-sent batches removed; genuine repeat lines kept | Two tests |
| 5 | Bad rows quarantined with reasons; rows in = good + quarantined + duplicates | A conservation test on every run |
| 6 | Data quality report with the five families; "unavailable" is not "pass" | Screenshot |
| 7 | Dashboard: revenue by brand and business day, channel mix, an hour-by-weekday heatmap, top items | Screenshot and how to run it |
| 8 | `docs/ai-log.md` showing how you used an AI assistant and what you rejected | The file |

## 3. The conservation test

Watch the ledger for one business day:

<div class="steps">
<div class="step"><b>Rows in.</b> The 18 restaurant files for 14 Sept hold 8,734 rows in total.</div>
<div class="step"><b>Duplicates.</b> One restaurant's till re-sent part of a batch: 23 rows are exact copies. They are removed and counted.</div>
<div class="step"><b>The gate.</b> 3 rows have the impossible time stamp <code>00/00/0000</code>; they go to quarantine with the reason <code>bad_timestamp</code>.</div>
<div class="step"><b>Good rows.</b> 8,708 rows reach staging.</div>
<div class="step"><b>Balance.</b> 8,708 + 3 + 23 = 8,734. The books balance, so the run is allowed to publish. If they did not, the run would stop before the dashboard refreshed.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** conservation of rows. Every row that enters a step must leave it as a good row, a quarantined row or a counted duplicate.

**Equation:**

```math
N_{\text{in}} = N_{\text{good}} + N_{\text{quarantine}} + N_{\text{duplicates}}
```

Test it on every run. A mismatch means some step silently dropped (or invented) rows.

**Analogy:** water in pipes: what flows into a junction must flow out (in electronics, Kirchhoff's current law). Where it breaks: aggregation changes the unit (lines become orders), so at that step conserve a *sum*, such as total quantity or revenue, instead of a row count.

**Try it:** rows in 48,210; good 47,905; quarantined 112. How many duplicates should the log show? *(193.)*
</details>

<div class="problem" data-problem="proof-qsr-clean-conservation"></div>

## 4. The dashboard

Use **Streamlit** (or Evidence, or a notebook exported to HTML) reading the staging Parquet through DuckDB. Four visuals, each answering one question a restaurant operations manager actually has:

1. **How did each brand do yesterday against the same weekday last week?** Number tiles with the % change.
2. **Which channels are growing?** A stacked bar of channel share by week.
3. **When are we busy?** A heatmap of order count by hour of the business day and weekday.
4. **What sells?** The top 10 items by revenue, with food-cost %.

One message per chart, labelled axes, no 3D, the same colour for a brand everywhere. The full BI version comes in Module 6 and in the [Power BI course](/learn/courses/power-bi/).

```python
import duckdb, streamlit as st

con = duckdb.connect()
df = con.sql("""
    select r.brand, p.business_date, sum(p.qty * p.price) as revenue
    from 'data/staging/qsr_pos/**/*.parquet' p
    join 'data/reference/restaurants.csv' r using (restaurant_id)
    group by all order by 2
""").df()
st.line_chart(df, x="business_date", y="revenue", color="brand")
```

<div class="meaning">

<dl>
<dt>Conservation test</dt><dd>Rows in must equal good + quarantined + duplicates, checked on every run.</dd>
<dt>Publish gate</dt><dd>The rule that a run only refreshes the dashboard when every blocking check passes.</dd>
<dt>Staging Parquet</dt><dd>The cleaned, typed, deduplicated table, stored by business date.</dd>
<dt>Physical meaning</dt><dd>A restaurant group's finance team reconciles the dashboard to the tills every week. When your pipeline can show, for any day, exactly how many rows came in, how many were set aside and why, and that the rest add up, that meeting takes five minutes instead of an afternoon. And moving late-night sales to the right business day can change which restaurant "won" a weekend: measure how much moves, and say so.</dd>
</dl>

</div>

<div class="myth">

**"The totals look about right, so no rows were lost."** A few lost rows in tens of thousands never show on a chart, but they show up in a store manager's own till report, and then nobody trusts any number. Count, do not eyeball: the conservation test catches a single missing row.

</div>

## 5. Build checklist

1. One command: `uv run qsr-clean --business-date 2026-09-14` (and `--since`).
2. The conservation test passes on 60 days of generated data (`--days 60`).
3. Data quality report and dashboard screenshots in `docs/img/`.
4. README sections: summary and screenshot, the problem, architecture, run in five minutes, decisions (contract, business day, dedup, quarantine), tests, AI usage, next steps.
5. Ask an AI assistant to act as a senior reviewer: "What would break if this ran unattended every day for a year?" Put the top three answers under *Next steps*; Module 3 fixes them.

**What done looks like:** a stranger runs the generator and `qsr-clean --since 2026-09-01`, every day's conservation line balances, the data quality report lists the bad time stamps and the re-sent batches, and the dashboard's heatmap shows the busy hours of the business day, with late-night orders on the night they happened.

## 6. Telling the story

*"Till exports from 18 restaurants arrived with re-sent batches, a Windows encoding on one brand, and a business day that ends at 5 a.m. I wrote a contract per source, quarantined bad rows with reasons instead of dropping them, and tested on every run that rows in equal good plus quarantined plus duplicates. Calendar-day reporting had been putting [N]% of revenue on the wrong day."* Fill in [N] from your Lesson 2.3 chart. Never quote a number you did not measure.

## 7. Practice

1. Your conservation test fails by exactly the number of rows in one file. What is the likely cause?
2. Why does the heatmap use the hour of the business day rather than the clock hour?
3. The data quality check for one restaurant is "unavailable" today. Should the dashboard still refresh?

<details>
<summary>Answers</summary>

1. A whole file was read but never reached any output: often a decoding error caught and ignored, or a glob pattern that a later step does not match. Log rows per file to find it.
2. So the night that runs from evening past midnight reads as one stretch, ending at 05:00. Clock hours would split a busy Friday night across two days.
3. Decide in advance. A common rule: refresh, but label that restaurant "data unavailable" on the dashboard rather than showing a zero.
</details>

**New words:** *conservation test*, *publish gate*, *heatmap*, *reconcile*.

<div class="keypoints">

- Rows in must equal good + quarantined + duplicates on every run; at aggregation steps, conserve a sum instead.
- A run only publishes when blocking checks pass; "unavailable" is shown as unavailable, never as zero.
- Each dashboard chart answers one real question for a named person, such as busy hours for an operations manager.
- Tell the project as a problem, a decision and a measured number.

</div>
