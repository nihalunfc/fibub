---
title: 'Project 1: a multi-source landing service'
summary: 'Ship one repository that lands email, folder, SFTP and API data with one command and one manifest, plus a report that shows missing files as missing.'
minutes: 60
updated: 2026-11-22
quiz:
  - q: Why does a completeness report spot a silent store better than a sales dashboard?
    choices: ['It compares received files against an expected set, so missing shows as missing instead of zero', 'It uses a heatmap', 'It ignores weekends']
    ans: 0
    why: '"Unavailable is not zero." A sales chart shows a dip; a completeness matrix shows a gap.'
  - q: A store was closed for renovation for three days. How should the completeness report treat those days?
    choices: ['As missing files', 'As not expected, so they are left out of both the expected and received counts', 'As received with zero sales']
    ans: 1
    why: Expected must come from a calendar of openings and closures. A closed store is not missing.
  - q: Which part of a README most often decides whether a reviewer keeps reading?
    choices: ['The licence', 'The one-line summary with a picture of the result at the top', 'The full list of dependencies']
    ans: 1
    why: Lead with the result. Details come after.
sources:
  - 'Reis, J. and Housley, M. (2022), Fundamentals of Data Engineering, O''Reilly Media, Chapter 7 (ingestion)'
  - 'DuckDB documentation: CSV import and generate_series https://duckdb.org/docs/'
  - 'Python Packaging User Guide: Writing your pyproject.toml (entry points and scripts) https://packaging.python.org/en/latest/guides/writing-pyproject-toml/'
---

**Module 1 project · about 60 minutes to read and plan, about 4 hours to build · read first: 1.1 to 1.6.** You'll ship `retail-ingest`, a repository that lands all four course sources with one command, proves it is safe to rerun, and produces a completeness report as your first dashboard.

<div class="bigidea">A landing service earns trust when it can answer one question every morning without anyone opening a file: "what should have arrived, what did arrive, and what is missing?"</div>

## 1. What you are shipping

One repository, `retail-ingest`, that lands **all four sources** into one raw zone, with one manifest, from one command:

```bash
uv run p2d-ingest --business-date 2026-09-14     # or --since 2026-09-01
```

Think of a warehouse receiving dock. Lorries from four suppliers arrive by different roads. The dock does not cook anything; it checks each delivery against the order sheet, signs for it, files the paperwork and puts the goods on the right shelf. At the end of the morning the dock manager can say exactly what came in and what did not. That is this project.

## 2. The brief

Four made-up businesses send data every morning, and reports are due at 08:00:

- a 12-store grocery chain emails daily sales as CSV or Excel attachments;
- an 18-restaurant fast-food group with three brands drops till exports in a shared folder;
- a 5-hotel group pushes booking files to SFTP;
- an ad agency's numbers come from a paginated API.

Your service lands all of it unchanged, keeps evidence of every file, holds back anything doubtful with a reason, and reports completeness.

## 3. Acceptance checks

| # | Requirement | How you prove it |
|---|---|---|
| 1 | Email, folder, SFTP and API sources land into `raw/<source>/business_date=…/` | A tree listing in the README |
| 2 | Rerunning the same day lands nothing new | `test_idempotent_rerun` |
| 3 | Duplicate attachments and re-sent till files are detected | A manifest query in the README |
| 4 | Half-uploaded files and unknown senders are held back with a reason | A `_rejected/` listing and a test |
| 5 | Secrets come only from the environment; `.env.example` exists | gitleaks passes in pre-commit |
| 6 | A **completeness report**: expected against received, per source per day | An HTML or Markdown file |
| 7 | A README with problem, architecture diagram, five-minute run, design decisions and next steps | Read it as a stranger would |

## 4. The completeness report: your first dashboard

Build an **expected-versus-received matrix**: one row per store (or source), one column per business date, each cell the file count or a cross. Make it from the manifest with DuckDB, then render a small HTML table with colours, or a heatmap PNG.

```sql
-- expected: every store on every date; received: from the email manifest
with dates as (
  select unnest(generate_series(date '2026-09-01', date '2026-09-30', interval 1 day))::date as d
),
stores as (select store_code from read_csv('data/reference/stores.csv')),
got as (select store, business_date, count(*) as n from email_files group by all)
select s.store_code, d.d, coalesce(g.n, 0) as files
from stores s cross join dates d
left join got g on g.store = s.store_code and g.business_date = d.d
order by 1, 2;
```

Watch the matrix tell its story:

<div class="steps">
<div class="step"><b>Define expected first.</b> 12 stores × 30 days = 360 store-days. You write this down before looking at what arrived, so the data cannot quietly change your mind.</div>
<div class="step"><b>Fill in received.</b> Count landed files per store per business date from the manifest. Most cells show 1. A few show 2: a manager pressed send twice, and the hash dedup already kept just one copy in raw.</div>
<div class="step"><b>A gap appears.</b> Store R107 has four empty cells in a row, 21 to 24 Sept. On a sales chart those days would look like a slow week. Here they are clearly missing.</div>
<div class="step"><b>Score it.</b> 356 of 360 received: completeness 98.9%. The report names the gap, and the grocery chain's operations team, not you, chases the store.</div>
</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** completeness is what you received out of what you expected, and "expected" must be defined *before* you look.

**Equation:**

```math
C = \frac{|\text{received} \cap \text{expected}|}{|\text{expected}|}
```

For 12 stores and 30 days, `$|\text{expected}| = 360$`.

**Analogy:** a teacher's register: you count who is absent against the class list, not against whoever happens to be in the room. Where it breaks: if a store was closed, it is not missing. The expected set needs a calendar of openings and closures.

**Try it:** 360 expected, R107 silent for 4 days, nothing else missing. `$C$`? *(356 ÷ 360 ≈ 98.9%.)*
</details>

<div class="problem" data-problem="proof-retail-ingest-completeness"></div>

<div class="meaning">

<dl>
<dt>Expected set</dt><dd>The list of files (or store-days) you should receive, decided in advance from a calendar.</dd>
<dt>Completeness</dt><dd>Received divided by expected. Late files count as received; lateness is a separate freshness measure.</dd>
<dt>Entry point</dt><dd>The single command that runs the whole service, declared in <code>pyproject.toml</code>.</dd>
<dt>Physical meaning</dt><dd>A "zero sales" day on a dashboard can mean a closed store, a disaster or a missing file, and those need very different responses. The completeness matrix separates them before the 08:00 meeting. It is also the single best picture for the top of your README: it shows at a glance that you think about what is missing, not only about what is there.</dd>
</dl>

</div>

<div class="myth">

**"No file means no sales."** Unavailable is not zero. A store that sent nothing may have traded normally and simply failed to email. Show missing data as missing (a cross, a grey cell, "not received"), never as a 0 that someone will add into a total.

</div>

## 5. Build checklist

1. Add a command-line entry point in `pyproject.toml`: `[project.scripts] p2d-ingest = "retail_ingest.cli:main"`, with `--business-date` and `--since` options.
2. Write one `run_all()` that calls each lander and returns a summary dictionary (files seen, landed, skipped, rejected per source). Log it as one JSON line.
3. Produce `reports/completeness.html`, and a PNG of it for the README.
4. Tests pass: `uv run pytest -q`. Lint is clean: `ruff check .`.
5. Write the README in this order:
   1. One-line summary and the completeness picture.
   2. The problem, in two sentences.
   3. An architecture diagram: sources, landers, raw zone and manifest, report.
   4. Run it: five commands at most, including the data generator.
   5. Design decisions: copy not move, content hashing, business date rules, the look-back window, and whether you used dlt and why.
   6. Tests, and what each one proves.
   7. What you would do next.
6. Ask your AI assistant to review the README **as a hiring manager with two minutes**, and fix whatever it finds unclear.
7. Keep the repository local until you decide where to publish it.

**What done looks like:** a stranger clones the repository, runs the generator and `p2d-ingest --since 2026-09-01`, opens `reports/completeness.html`, and sees R107's four-day gap and the late hotel file without reading any code. Run `p2d-ingest` a second time: the summary shows zero new files landed.

## 6. Telling the story

People remember stories with **a problem, a decision and a number**. Practise this aloud in under two minutes: *"Daily data came from four kinds of sources, and some files arrived twice or half-uploaded. I built a landing service that copies every file into an unchanging raw zone keyed by a content hash, so reruns are free and every report number traces back to a file. A completeness matrix showed one store silent for four days, which a zero-sales chart would have hidden."* Use your own numbers, and never quote one you did not measure.

## 7. Practice

1. Your summary says 72 files seen, 70 landed, 2 skipped, 1 rejected. What is wrong?
2. The hotel file for 18 Sept was late (`.partial` until 06:40). Should completeness for that day be below 100%?
3. Where in the repository do the expected-store list and the closure calendar belong?

<details>
<summary>Answers</summary>

1. 70 + 2 + 1 = 73, one more than the 72 seen. The counts do not add up, so one file is counted twice or the "seen" count is wrong. Every file seen should end as exactly one of landed, skipped or rejected.
2. No, once it arrived. It is complete but late, which is a freshness problem; report it separately (Lesson 2.6).
3. In version-controlled reference data (for example `data/reference/stores.csv` plus a closures file), so changes are reviewed and the report can be rebuilt for any past date.
</details>

**New words:** *expected set*, *completeness*, *entry point*, *acceptance check*.

<div class="keypoints">

- One command lands all four sources into one raw zone with one manifest, and a rerun lands nothing.
- Doubtful files (half-uploaded, unknown sender) are held back with a written reason, never dropped.
- Define the expected set first, from a calendar; completeness is received over expected.
- Lead the README with the result picture, then the problem, the run steps and your decisions.

</div>
