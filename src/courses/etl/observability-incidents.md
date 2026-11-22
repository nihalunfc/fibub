---
title: Observability and incident response
summary: 'Turn reports into measurable promises: freshness and completeness SLOs, error budgets, a health board, an evidence ladder for triage and blameless reviews.'
minutes: 35
updated: 2026-11-22
quiz:
  - q: A freshness check says "unavailable" because the manifest database was down. What is the verdict about the data?
    choices: ['Fresh', 'Stale', 'Not yet determined: the measurement failed, so check the manifest another way']
    ans: 2
    why: '"Unavailable" is not a result. The check could not look, so you do not know yet. Get the evidence another way before you tell anyone the data is fine or broken.'
  - q: Why track the 95th percentile finish time instead of the average?
    choices: ['It is easier to compute', 'Deadlines are missed in the slow tail; a good average can hide frequent late days', 'Dagster requires it']
    ans: 1
    why: An average of 07:04 sounds safe for an 08:00 deadline, yet two days in thirty can still be late. Promises are broken in the tail, so watch the tail.
  - q: What makes a post-incident review "blameless"?
    choices: ['Nobody is told about the incident', 'It asks how the process let the failure through and what will stop it next time, not who made the mistake', 'It has no root cause']
    ans: 1
    why: People hide information when they fear blame. A review that fixes the process (a missing check, a loose test) stops the same incident coming back.
sources:
  - 'Beyer, B., Jones, C., Petoff, J. and Murphy, N. R. (2016), Site Reliability Engineering, O''Reilly, Chapter 4 (service level objectives) and Chapter 15 (postmortem culture) https://sre.google/sre-book/table-of-contents/'
  - 'Reis, J. and Housley, M. (2022), Fundamentals of Data Engineering, O''Reilly, Chapter 2 (DataOps: observability and incident response)'
  - 'Dagster documentation: Run history, asset health and alerts https://docs.dagster.io/'
---

**Module 7 · about 35 minutes · read first: [3.5](/learn/courses/etl/schedules-sensors/) and [6.6](/learn/courses/etl/reconciliation/).** You'll be able to write freshness and completeness promises for each report, measure them, work out the error budget, build a pipeline health board from tables you already have, and handle an incident from first alert to a written review.

<div class="bigidea">Once people rely on your reports, the job is keeping promises: observability tells you whether you kept them, and incident response is what you do when you did not.</div>

## 1. Why this matters

Up to now you built things. From here, half the job is **keeping promises** like "the restaurant report is in inboxes by 08:00, with every restaurant included, on 98% of days". A bus company works the same way. It does not promise every bus is on time. It promises 95% are, measures it every day, and fixes the routes that drag the number down.

**Observability** means you can see, from data the pipeline leaves behind, whether it is healthy. **Incident response** is the calm routine you follow when it is not.

## 2. Promises you can measure: SLOs

An **SLO** (service level objective) is a written, measurable promise about a report. For data, two kinds matter most:

- **Freshness:** the data is up to date by a time. "Sent by 08:00 on 98% of days."
- **Completeness:** all the expected parts are in. "At least 17 of 18 restaurants, or a banner says who is missing."

| Report | Freshness SLO | Completeness SLO | Measured from |
| --- | --- | --- | --- |
| Restaurant daily email | Sent by 08:00 on 98% of days | 17 of 18 restaurants, or a banner | `ops.report_sent`, manifest |
| Hotel revenue page | Data as of 07:30 or earlier on 95% of days | All 5 hotels | `ops.load_audit` |
| Ads dashboard | Updated by 12:00 daily | Every campaign with spend | data quality results |

The **error budget** is the number of misses the promise allows. 98% over 30 days allows 2% × 30 = 0.6 late days. That sounds odd, but it is the point: one late day already spends more than the budget. When the budget is gone, reliability work comes before new features.

<div class="steps" data-fig="observability-incidents-slo">
<div class="step"><b>Thirty mornings.</b> Each dot is the time the restaurant email went out. Most are between 06:30 and 07:30.</div>
<div class="step"><b>The average.</b> The mean finish is 07:04, almost an hour before 08:00. It looks like there is nothing to worry about.</div>
<div class="step"><b>The tail.</b> The 95th percentile (the time beaten on 95% of days) is 08:12. The slow days are past the deadline.</div>
<div class="step"><b>Count the misses.</b> Two days were late: 28 of 30 on time, which is 93.3%.</div>
<div class="step"><b>The budget.</b> A 98% promise allowed 0.6 late days. Two were used, so the budget is overspent by 1.4 days. Next sprint goes on reliability.</div>
</div>

<div class="problem" data-problem="observability-incidents-budget"></div>

<div class="meaning">

<dl>
<dt>SLO</dt><dd>A measurable promise about a report, such as "sent by 08:00 on 98% of days".</dd>
<dt>Freshness</dt><dd>How up to date the data is when someone looks at it.</dd>
<dt>Completeness</dt><dd>Whether every expected part (store, hotel, campaign) is included.</dd>
<dt>Error budget</dt><dd>The misses the promise allows: (100% − SLO) × days. Spend it, and reliability work comes first.</dd>
<dt>Physical meaning</dt><dd>A regional manager reads the restaurant email at 08:05 before a call with the owner. If it arrives at 08:12 twice a month, she stops trusting it and goes back to phoning each restaurant. The SLO is how you notice before she does.</dd>
</dl>

</div>

Set the failure chance and the retries, then run the pipeline several times.

<figure class="fig" data-fig="@data-dag-retry"><figcaption>Notice that a failed task blocks everything after it, and that retries rescue short faults.</figcaption></figure>


## 3. The health board

You do not need a new tool. Build a pipeline health dashboard from tables you already have:

- **Dagster run history** (from its GraphQL API or its Postgres storage): runs by status per day.
- **`ops.load_audit`** from [Lesson 4.3](/learn/courses/etl/loading-patterns/): rows loaded per table per day.
- **`dq_results`** from [Lesson 2.6](/learn/courses/etl/quality-gates/): failed checks by family.
- **The manifest** from [Lesson 1.3](/learn/courses/etl/landing-files/): which files arrived and when.
- **`ops.report_sent`** (new today): one row per report sent, with its time.

Panels worth having: runs by status per day; duration per asset as p50 and p95 (the middle and the slow tail); freshness per source against its SLO; quality failures by family; error budget left. Metabase or Grafana both work.

```sql
-- Freshness SLO compliance for the restaurant email, last 30 days
select
  count(*)                                               as days,
  sum(case when sent_at::time <= '08:00' then 1 else 0 end) as on_time,
  round(100.0 * sum(case when sent_at::time <= '08:00' then 1 else 0 end) / count(*), 1) as pct
from ops.report_sent
where report = 'qsr_daily' and business_date >= current_date - 30;
```

<div class="problem" data-problem="observability-incidents-compliance"></div>

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** watch the tail, not the average. A pipeline whose average finish is 07:04 can still miss 08:00 often.

**Equation:** with finish times `$t_1, \dots, t_n$` and a deadline,

```math
\text{compliance} = \frac{1}{n}\sum_{i=1}^{n} \mathbb{1}[t_i \le \text{deadline}], \qquad \text{budget left} = (1 - \text{SLO})\,n - \text{misses}
```

`$\mathbb{1}[\cdot]$` is 1 when the condition is true and 0 when it is false, so the sum just counts on-time days.

**Analogy:** a fire alarm that works 99% of the time but was off on the night of the fire failed at its only job.

**Where it breaks:** small samples. Over 30 days one miss is 3.3 percentage points, so also judge over 90 days before you panic or relax.

**Try it:** SLO 98% over 30 days, 1 miss so far. Budget left? (0.6 − 1 = −0.4: already over.)
</details>

## 4. Triage: the evidence ladder

When an alert fires or someone says "the numbers look wrong", climb from the cheapest evidence to the most expensive. Stop as soon as the evidence settles it. A doctor works the same way: temperature and questions first, scans only if needed.

1. **Is it real?** Look at the alert's own data. Maybe the check was *unavailable*, not *failed*.
2. **Where in the chain?** Manifest (did the file arrive?) → run log (did the asset run?) → load audit (were rows loaded?) → data quality (were rows quarantined?) → mart (query it) → report (when did it refresh?).
3. **What changed?** The source file's shape, a code deploy (`git log`), config, volumes.
4. **Verdict**, exactly one of: *source issue* (contact the owner), *pipeline bug* (fix plus a test), *expected behaviour* (explain, maybe label better), *transient* (a retry worked; keep watching), *not yet determined* (say what evidence would settle it).

You can ask Claude Code to run the ladder with you, in **read-only** mode, saving each piece of evidence to `triage/<date>-<slug>/report.md`. It is quick at reading logs; you stay responsible for the verdict.

<div class="myth">

**"Unavailable means failed."** If the freshness check could not reach the manifest database, it measured nothing. Reporting "stale data" sends people chasing a problem that may not exist; reporting "fresh" hides one that might. The honest verdict is *not yet determined*, followed by checking the manifest another way.

</div>

## 5. Blameless post-incident reviews

Write a short review for anything that broke a promise: a timeline, the impact (who saw what wrong number, for how long), the root cause, why it was not caught earlier, and actions with owners and dates. **Blameless** means "the process let this happen", never "Sam broke it". Teams that write these get steadily more reliable; teams that skip them have the same incident every quarter. Download the [incident review template](/learn-kit/etl/templates/incident-review.md) to start.

## 6. Try it

Start the capstone repository `daily-data-platform` today; Lessons 7.1 to 7.6 all add to it.

1. Write SLOs for your three reports in `docs/slo.md`.
2. Create `ops.report_sent` and make the email asset write one row each time it sends.
3. Run the pipeline over 30 simulated days with a backfill (`python generate_data.py --days 30 --out data --seed 7`, from the [course data generator](/learn-kit/etl/starter/generate_data.py)). Inject two late hotel files and one broken restaurant file. Compute compliance with the query above.
4. Build the health board in Metabase or Grafana.
5. Triage each injected incident with the evidence ladder and save the reports. Write one blameless review for the worst one.

**What to check:** compliance from your query matches a hand count of the late days; each triage report ends in exactly one verdict with evidence linked; the review names a process change, not a person. Commit as `docs+feat(ops): SLOs, health board, triage reports, incident review`.

<div class="keypoints">

- An SLO is a measurable promise; data needs freshness and completeness SLOs per report.
- Error budget = (100% − SLO) × days − misses; when it runs out, reliability work comes first.
- Watch p95 finish times, not the average: deadlines are missed in the tail.
- Triage cheapest evidence first, along the chain, and end with one clear verdict ("not yet determined" is allowed).
- Blameless reviews fix the process, so the same incident does not come back.

</div>
