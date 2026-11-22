---
title: The shape of a data platform
summary: 'Every data platform has the same six stages, from ingest to dashboard. Learn what each stage does, ETL versus ELT, and why raw data is never edited.'
minutes: 30
updated: 2026-11-22
quiz:
  - q: A vendor API keeps only 30 days of history, and your cleaning code had a bug for 45 days. What design would have saved you?
    choices: ['Running the pipeline more often', 'Landing every API response unchanged in a raw layer that is never edited', 'Using ETL instead of ELT']
    ans: 1
    why: With the raw responses stored, you rerun the clean and model steps over them. The 30-day API window no longer matters.
  - q: Which job belongs in Python rather than SQL in a typical ELT design?
    choices: ['Joining sales to the store table', 'Pulling a CSV attachment out of an email', 'Adding up revenue per store per day']
    ans: 1
    why: SQL is great at logic on tables. Parsing emails, Excel files and APIs is Python's job.
  - q: The hotel extract shows the same booking_id again with a new status. What is its grain?
    choices: ['One row per hotel per day', 'One row per version of a booking', 'One row per guest']
    ans: 1
    why: A booking can reappear each time it changes, so each row is one version of one booking. That is a change feed, which you will keep the latest of in Module 2.
sources:
  - 'Reis, J. and Housley, M. (2022), Fundamentals of Data Engineering, O''Reilly Media, Chapters 1 to 3 (the data engineering lifecycle)'
  - 'Kleppmann, M. (2017), Designing Data-Intensive Applications, O''Reilly Media, Chapter 10 (batch processing and immutable inputs)'
  - 'Dagster documentation: Software-defined assets https://docs.dagster.io/'
---

**Module 1 · about 30 minutes · the first lesson.** You'll be able to draw the six stages of a data pipeline, name a tool for each, explain ETL and ELT, and say why the raw layer is never edited. You'll also generate the course data you will use for the next seven modules.

<div class="bigidea">A data platform is a kitchen: deliveries arrive (ingest), get washed and cut (clean), are cooked on a timetable (orchestrate), stored in a pantry (load), plated (model) and served (deliver), and you always keep the original receipts.</div>

## 1. Why this matters

When someone asks "walk me through a pipeline you built", they are not asking for a list of tools. They want to hear that you know **where data comes from, what can go wrong at each step, and how you would notice**. This lesson draws that map. Everything else in the course hangs on it.

Think of a restaurant kitchen. Food arrives from many suppliers at different times. Some boxes are damaged. Some suppliers are late. The chef still has to serve lunch at noon. A data team is the same: files and API answers arrive from many places every morning, some are broken or late, and the reports are due at 08:00.

## 2. The six stages

| Stage | The question it answers | Tool in this course | Others you will meet |
|---|---|---|---|
| **Ingest** | What arrived, from where, and when? | Python (email, folders, SFTP, APIs) | dlt, Airbyte, rclone |
| **Clean** | Is it typed, valid and free of duplicates? | Polars, DuckDB, pandera | pandas, Great Expectations, Soda |
| **Orchestrate** | What runs when, in what order, and what happens on failure? | Dagster | Airflow, Prefect, cron |
| **Load** | Where does the data live for good? | Azure SQL Database | Postgres, DuckDB, ClickHouse, BigQuery |
| **Model** | What shape makes questions easy and answers consistent? | SQL and dbt | SQLMesh, plain views |
| **Deliver** | Who sees what, how and how often? | Power BI | Metabase, Superset, emailed PDFs |

Two things run **across** all six stages:

- **Observability:** logs, row counts, freshness checks and lineage (which file fed which number). It is how you know the pipeline is healthy.
- **Governance:** who may see what, where passwords live, and how changes are reviewed.

## 3. ETL and ELT

**ETL** means Extract, Transform, Load: you clean the data in Python first, then write finished tables to the warehouse. **ELT** means Extract, Load, Transform: you load the raw data first, then clean and shape it inside the warehouse with SQL.

Most modern teams do **ELT with a Python edge**. Python does what SQL is bad at: reading emails, Excel files, odd text encodings and APIs. It loads lightly typed raw tables. Then SQL (often with dbt) does the business logic, where it is visible, testable and fast. In the kitchen, Python is the person unpacking the delivery boxes; SQL is the chef working at a clean bench.

## 4. Layers: raw, staging and marts

- **Raw** (also called bronze or landing): an exact copy of what arrived, plus a note of where it came from, when it arrived and a fingerprint of its bytes. You only ever add to it. You never edit it.
- **Staging** (silver): one cleaned, typed table per source thing (sales lines, bookings, ad stats). Column names are tidy, duplicates removed, bad rows set aside.
- **Marts** (gold): tables shaped for questions, such as `fct_sales`, `dim_store` and `dim_date`. These feed the dashboards.

Here is one fact, one store's sales for one day, travelling through the layers:

<div class="steps" data-fig="platform-shape-flow">
<div class="step"><b>Source.</b> At 06:12 store R104 emails <code>sales_R104.csv</code>. Inside, the date is written day first and the amount has a comma: <code>R104,14/09/2026,"1,234.50"</code>.</div>
<div class="step"><b>Raw.</b> The file is copied byte for byte into <code>raw/retail_email/business_date=2026-09-14/</code>, and its fingerprint (a hash) goes in a manifest. Nobody edits this copy, ever.</div>
<div class="step"><b>Staging.</b> Python and SQL read the raw copy: the date becomes a real date (2026-09-14), the amount a number (1234.50), the store code is trimmed, and duplicate rows are removed.</div>
<div class="step"><b>Mart.</b> The cleaned line joins the store table and the date table, so it now knows R104 is in London, Ontario and that 14 Sept 2026 was a Monday.</div>
<div class="step"><b>Dashboard.</b> A tile shows R104 at $1,234.50, up 3% on last Monday, with "data as of 07:40". If finance doubts it, you can trace the number back to the exact email.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** a pipeline is a chain of steps, and each step should give the same output for the same input, so any step can be rerun safely.

**Equation:**

```math
\text{mart} = M\big(S\big(R(\text{source}, t)\big)\big)
```

where `$R$` lands raw data at time `$t$`, `$S$` standardises it and `$M$` models it. If what `$R$` produced is kept unchanged, you can recompute `$S$` and `$M$` at any time without going back to the source.

**Analogy:** a scientist keeps the raw readings from an instrument and reruns the calibration when a better constant is found. The readings are never overwritten. Where it breaks: some sources only show the current state (today's price list). Unless you save a copy each day, yesterday's prices are gone.

**Try it:** a bug in `$S$` was live for 10 days. With raw kept, how many times must you ask the source to send data again? *(Zero. Rerun `$S$` and `$M$` over the 10 days of raw.)*
</details>

Keeping everything sounds expensive. Work it out:

<div class="problem" data-problem="platform-shape-raw-cost"></div>

<div class="meaning">

<dl>
<dt>Pipeline</dt><dd>The chain of steps that moves data from where it is born to where people use it.</dd>
<dt>ETL / ELT</dt><dd>Transform before loading, or load raw first and transform inside the warehouse.</dd>
<dt>Raw layer</dt><dd>An untouched copy of everything that arrived, with where and when it came from.</dd>
<dt>Grain</dt><dd>What one row means: one sale line, one booking version, one store-day.</dd>
<dt>Physical meaning</dt><dd>When the finance team says "your dashboard said $41,200 for a store, but the store says $43,900", the raw layer is your evidence: the exact files you received, when, and what was in them. Teams without it end up arguing from memory. It is also your safety net, because some sources (email, API history windows) cannot be asked again after 30 to 90 days.</dd>
</dl>

</div>

<div class="myth">

**"Raw data is messy, so we should clean it as we save it."** Clean a copy, never the original. If you fix the data on the way in and your fix has a bug, the original is gone and the bug is permanent. Keep raw exactly as it arrived; put the cleaning in staging, where it can be rerun.

</div>

## 5. What a morning looks like

At 06:00 the sales emails start arriving. At 06:30 the restaurant tills (POS, point-of-sale systems) sync their exports to a shared drive. The hotel booking system (PMS, property management system) pushes its file to an SFTP server at about 04:00, but some days the upload is still running at 06:00. The ad platform's numbers for yesterday keep changing until about noon, as late sales are credited to ads. Reports must be in managers' inboxes by 08:00.

That timeline is the real design brief. It decides when jobs run, what they wait for, which freshness checks you need, and the "data as of" label on every report. You will build each piece in Modules 1 to 3. The dashboard end is covered in depth in the [Power BI course](/learn/courses/power-bi/), and when your data outgrows one machine, [Data at Scale](/learn/courses/data-at-scale/) is the next step after this course.

## 6. Try it: generate and explore the course data

All the data in this course is made up by one script, with faults planted on purpose. Download [generate_data.py](/learn-kit/etl/starter/generate_data.py), then:

```bash
mkdir ~/p2d && cd ~/p2d          # put generate_data.py here
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install pandas numpy openpyxl
python generate_data.py --start 2026-09-01 --days 30 --out ./data
```

It creates four landing areas for four made-up businesses: a 12-store grocery chain (sales emails), an 18-restaurant fast-food group with three brands (till exports on a shared drive), a 5-hotel group (booking files on SFTP) and an ad agency (paginated JSON, like an API). Explore them and fill in this table in `notes/sources.md`:

| Source | Path | Format | Grain (one row = ?) | Arrives | Faults you can spot |
|---|---|---|---|---|---|
| Grocery sales | `landing/email_inbox` | .eml with CSV/XLSX | ? | ? | ? |
| Restaurant tills | `landing/shared_drive/qsr/<date>` | CSV | ? | ? | ? |
| Hotel bookings | `landing/sftp/hotel` | pipe-delimited text | ? | ? | ? |
| Ads | `landing/api/ads` | paginated JSON | ? | ? | ? |

Then open one `.eml` file in a text editor and find the headers, the MIME boundary (the line that separates parts) and the base64 attachment. Finally, draw the six stages for these businesses on paper and photograph it into `notes/`. Commit both: `git init`, then `git commit -m "docs: map sources and pipeline stages"`.

**What to check:** every row of your table has a grain. If you wrote "one row per booking" for the hotel file, look again: search for a booking_id that appears twice.

## 7. Practice

1. Put these in pipeline order: model, ingest, deliver, clean, load.
2. A store's sales file had a typo that you fixed in staging last week. The store now sends a corrected file. Which layers change?
3. Name one job that belongs in Python and one that belongs in SQL.

<details>
<summary>Answers</summary>

1. Ingest, clean, load, model, deliver (with orchestration running the whole chain).
2. Raw gains a new file (the old one stays). Staging and the marts are rebuilt from raw and now use the corrected file.
3. Python: reading an email attachment or an Excel file. SQL: joining sales to stores, or totals per day.
</details>

**New words:** *pipeline*, *ingest*, *orchestrate*, *ETL*, *ELT*, *raw / staging / mart*, *grain*, *observability*, *governance*.

<div class="keypoints">

- Every platform has six stages: ingest, clean, orchestrate, load, model, deliver, with observability and governance across all of them.
- Most teams do ELT with a Python edge: Python for awkward inputs, SQL for business logic.
- Raw is an untouched copy of everything that arrived. Never edit it; rebuild staging and marts from it.
- The morning timeline (who sends what, when) is the real design brief for schedules and freshness checks.

</div>
