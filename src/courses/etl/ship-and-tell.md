---
title: Ship it and tell the story
summary: 'Finish the course: a portfolio README and demo, honest resume lines, a structured answer to the platform design question, and your next 90 days.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: What is the first step in a data-platform system-design interview?
    choices: ['Name your favourite tools', 'Clarify the sources, volumes, users, deadline, budget and team', 'Draw a Kubernetes cluster']
    ans: 1
    why: Requirements first; tools follow. A design for a 3-person team with Microsoft licences looks nothing like one for a 40-person team on Google Cloud.
  - q: How should you describe your experience with this stack?
    choices: ['As years of production work', 'Honestly: built end to end on synthetic data, with the repos as proof', 'Describe a former employer''s systems in detail']
    ans: 1
    why: Accurate, confident and backed by public evidence. Interviewers check, and the repos already show more than a claim could.
  - q: A rubric has 8 areas worth up to 2 points each. Which plan scores more?
    choices: ['Go deep on 3 areas and skip the rest (6 points)', 'Cover all 8 at 1 point, then deepen the 2 they ask about (10 points)', 'They score the same']
    ans: 1
    why: Breadth first, then depth where they probe. Covering every area also shows judgement about what matters.
sources:
  - 'Kleppmann, M. (2017), Designing Data-Intensive Applications, O''Reilly, Chapter 1 (reliable, scalable and maintainable applications)'
  - 'Reis, J. and Housley, M. (2022), Fundamentals of Data Engineering, O''Reilly, Chapter 3 (designing good data architecture)'
  - 'Microsoft Learn: Credentials and certifications for data and AI roles https://learn.microsoft.com/en-us/credentials/'
---

**Module 7 · the last lesson · about 35 minutes · read first: [7.6](/learn/courses/etl/capstone-build/).** You'll publish the capstone so a stranger understands it in two minutes, turn seven projects into honest resume lines and one good article, answer "design a data platform" with a clear structure, and plan what to learn next.

<div class="bigidea">Work nobody can see or understand does not get you hired: a clear README, a short demo and an honest story turn seven weeks of building into proof anyone can check.</div>

## 1. Why this matters

A busy reviewer often gives a portfolio repository only a couple of minutes before deciding whether to read more. Think of an estate agent's listing: the best house in town does not sell if the photos are dark and the address is wrong. Today is about the listing. The house is already built.

## 2. Look back: what you built

At the start of this course you had a folder of messy files. Here is what you can now show, project by project:

| Module | Project | What it proves |
| --- | --- | --- |
| 1 | [A multi-source landing service](/learn/courses/etl/proof-retail-ingest/) | files from email, drives, SFTP and APIs land once, with a manifest |
| 2 | [A trustworthy cleaning pipeline](/learn/courses/etl/proof-qsr-clean/) | contracts, quarantine and a data quality report |
| 3 | [A self-running hotel pipeline](/learn/courses/etl/proof-hotel-dagster/) | Dagster assets, partitions, sensors and checks |
| 4 | [One pipeline, any warehouse](/learn/courses/etl/proof-ads-warehouse/) | upserts that rerun for free, audit, security, cost |
| 5 | [A tested star schema](/learn/courses/etl/proof-restaurant-dbt/) | Kimball modelling, SCD2 and dbt tests |
| 6 | [BI people can trust](/learn/courses/etl/proof-chain-dashboards/) | fast models, correct DAX, reconciliation |
| 7 | [The daily data platform](/learn/courses/etl/capstone-build/) | all of it together, observable, tested and costed |

## 3. The capstone README

1. **Title and one sentence**, with the health board or architecture picture right under it.
2. **What it does** in 5 bullets with numbers: sources, rows a day, run time, cost a month.
3. **Demo video**, 2 to 3 minutes: the demo morning.
4. **Architecture diagram** and a stack table with *why* for each choice (link the ADRs).
5. **Run it in 5 minutes:** `just demo`.
6. **Design decisions:** idempotency, business dates, quarantine, partitions, upserts, SCD2, the metric dictionary, missing is not zero.
7. **Reliability:** SLOs, checks, triage reports, the incident review.
8. **Cost** per location per month for three stacks.
9. **What I would do next.**
10. **Links** to the six project repos.

## 4. Resume lines and one good article

Fill in **your own measured numbers**. Interviewers ask "how did you measure that?", so every number must be one you can show.

- Built an end-to-end daily data platform (Python, Dagster, dbt, Azure SQL or Postgres, Power BI) that ingests email, SFTP, shared-drive and API sources for four synthetic businesses; reruns are idempotent and every report figure traces back to source files.
- Designed Kimball star schemas with SCD2 dimensions and [N] dbt tests, including a revenue reconciliation check on every build.
- Cut full-pipeline run time from [A] to [B] by making every layer incremental and compacting Parquet files.
- Costed three platform options at 20 to 500 locations; the open-source stack came to about $[X] per location per month.

Then write **one article** about **one hard problem**, not the whole course: "Missing is not zero: how a completeness matrix caught a silent store", or "Why my revenue doubled: fan-out and the grain sentence". Short, specific, one chart. People share posts like that; nobody shares "I finished a course".

<div class="myth">

**"Say it was production work; everyone exaggerates."** It is easy to check and it ends interviews. Say exactly what is true, with confidence: "I built the full stack from scratch on synthetic data to understand every layer, from email and SFTP ingestion through Dagster, a warehouse and dbt to Power BI, with open-source options costed. The repos show every decision and test." Keep any current or former employer, its systems and its data out of it.

</div>

## 5. The system-design question

"Design a data platform for a 200-restaurant chain that wants daily sales dashboards by 8 a.m." Answer in this order, in about ten minutes:

<div class="steps">
<div class="step"><b>Clarify.</b> How does data arrive (POS exports? an API?), how much, who reads it, by when, what budget, what team, what licences are already paid for? Write the answers down.</div>
<div class="step"><b>Size it.</b> 200 restaurants × about 3,000 order lines = 600,000 rows a day, about 220 million a year. One good server handles that; say so.</div>
<div class="step"><b>Draw the flow and pick tools.</b> Ingest → raw → clean → warehouse → model → BI, plus ops. One tool per box with a reason and one alternative ("Dagster, or Airflow if they already run it").</div>
<div class="step"><b>Correctness and reliability.</b> Idempotent loads, business dates, late data, dedup, reconciliation; checks, an 08:00 SLO with an error budget, alerts and a runbook.</div>
<div class="step"><b>Security and cost.</b> Sign-in through the company's identity provider, row-level security by region, and a cost per restaurant per month.</div>
<div class="step"><b>Evolution.</b> What changes at 10 times the volume: incremental everything first, then a columnstore or cloud warehouse, then streaming only if the business needs minutes.</div>
</div>

<div class="problem" data-problem="ship-and-tell-rubric"></div>

<div class="meaning">

<dl>
<dt>Portfolio README</dt><dd>The front page of your repo: what it does, why, how to run it in 5 minutes, and links to proof.</dd>
<dt>Measured number</dt><dd>A figure you can reproduce from the repo (run time, rows, cost), never a guess.</dd>
<dt>Structured answer</dt><dd>Clarify, size, flow and tools, correctness, reliability, security and cost, evolution: in that order.</dd>
<dt>Breadth first</dt><dd>Touch every area at a basic level, then go deep where the interviewer asks.</dd>
<dt>Physical meaning</dt><dd>A hiring manager at a restaurant group opens your repo between meetings, watches the demo morning, sees "store 107 not received" in the banner and thinks "this person already knows our Monday problems". That is the whole point of today.</dd>
</dl>

</div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** structured answers beat brilliant fragments, because interviewers score against a rubric with many areas.

**Equation:** with `$k$` areas scored 0 to 2, going deep on `$m$` areas scores `$2m$`; touching all `$k$` at 1 and deepening `$j$` of them scores

```math
k + j \quad\text{versus}\quad 2m
```

so breadth wins whenever `$k + j > 2m$`, which it nearly always does in ten minutes.

**Analogy:** painting a room: one coat on every wall first, then a second coat where it shows. Never three coats on one wall and bare plaster on the rest.

**Where it breaks:** if the interviewer says "go deep on ingestion", go deep on ingestion.

**Try it:** 8 areas. Deep on 3 and skip 5? (6 of 16.) All 8 at 1 point and 2 of them at 2? (10 of 16.)
</details>

## 6. Your next 90 days

You can now run a daily platform on one or two servers. The natural next step is what happens when the data, the team or the speed outgrows that: [**Data at Scale**](/learn/courses/data-at-scale/) covers Spark, cloud warehouses such as BigQuery, lakehouse table formats and streaming with Kafka. It starts exactly where Lesson 7.5's "when to change gear" ends.

Other fibub courses that fit next to this one: [Power BI](/learn/courses/power-bi/) to go deeper on DAX and models, [Statistics](/learn/courses/statistics/) for the numbers behind forecasting and tests, [pandas](/learn/courses/pandas/), [ML foundations](/learn/courses/ml-foundations/) when the business asks for predictions, and [Offline AI](/learn/courses/offline-ai/) for local language models. If a certificate matters for the jobs you want, look at Microsoft's Power BI data analyst and Fabric data engineer certifications (PL-300 and DP-700 at the time of writing; check the current names on Microsoft Learn).

## 7. Try it

1. Polish the capstone README to the 10-point list and record the video.
2. Update your GitHub profile README with the seven projects, one line each, linked.
3. Write your resume lines with your real numbers.
4. Draft the article and a short post that links to it.
5. Answer the system-design question aloud twice, recorded. Watch it back once, and note which of the six steps you skipped.
6. Write `docs/next-90-days.md`: one deeper topic a month (for example the first three modules of Data at Scale, advanced DAX, ML in production) and one certification to consider.

**What to check:** a friend who has never seen the repo can run `just demo` from the README alone; every number in your resume lines has a link to where it was measured; your recorded answer touches all six steps inside ten minutes. Commit as `docs: capstone README, demo video, next 90 days`. That is the course. Well done.

<div class="keypoints">

- Seven projects are proof only if a stranger can understand and run them in minutes: README, demo, links.
- Every resume number must be one you measured and can show.
- Describe the work honestly: built end to end on synthetic data, with the repos as proof.
- Answer design questions in order: clarify, size, flow and tools, correctness and reliability, security and cost, evolution.
- Next: Data at Scale, for when the data, the team or the speed outgrows one server.

</div>
