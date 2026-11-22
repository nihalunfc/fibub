---
title: 'Project 3: a self-running hotel pipeline'
summary: 'Ship hotel-dagster: partitioned assets, a file sensor, retries, blocking checks, a recorded backfill and an on-the-books dashboard, all running in Docker.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'H1 sold 50 room nights for $10,000 and H2 sold 150 for $22,500. What is the group ADR?'
    choices: ['$175.00', '$162.50', '$150.00']
    ans: 1
    why: 'ADR is a ratio: total revenue ÷ total nights = 32,500 ÷ 200 = $162.50. The average of the two hotel ADRs ($200 and $150) ignores that H2 sold three times as many nights.'
  - q: What is the strongest evidence in a README that your pipeline is ready for real use?
    choices: ['A recorded backfill after a rule change, with the time taken and no manual steps', 'A long list of libraries used', 'Lots of code comments']
    ans: 0
    why: Concrete evidence of operating the pipeline beats any list of features.
  - q: RevPAR (revenue per available room) equals which of these?
    choices: ['Occupancy × ADR', 'ADR ÷ occupancy', 'Room nights × rooms']
    ans: 0
    why: RevPAR = revenue ÷ rooms available = (nights sold ÷ rooms available) × (revenue ÷ nights sold) = occupancy × ADR.
sources:
  - 'Dagster documentation: Partitions, sensors, asset checks and deployment https://docs.dagster.io/'
  - 'Hayes, D. K. and Miller, A. A. (2011), Revenue Management for the Hospitality Industry, Wiley (occupancy, ADR, RevPAR and pace)'
  - 'Kimball, R. and Ross, M. (2013), The Data Warehouse Toolkit, 3rd edition, Wiley, Chapter 1 (additive and non-additive facts)'
---

**Module 3 project · about 45 minutes to read, a day to build · read first: Lessons [3.1](/learn/courses/etl/what-orchestrators-do/) to [3.6](/learn/courses/etl/asset-checks-deploy/).** You'll ship a Dagster project that runs itself every morning, survives late and repeated files, stops bad data, and feeds a hotel dashboard, with the evidence in the README.

<div class="bigidea">A pipeline is ready for real use when it runs without you: files arrive, the right days rebuild, bad data stops at a gate, and you can prove it with a recorded backfill.</div>

## 1. What you are shipping

`hotel-dagster`, for a group of five hotels:

```text
SFTP (or folder) ──► raw ──► stg_bookings (latest version) ──► fct_bookings_daily (by created date)
                                    │
hotels (reference) ─────────────────┴──► otb_by_stay_date ──► pace ──► dashboard
```

All of it in Dagster, with a schedule, a file sensor, retries, asset checks and Docker Compose. The data is synthetic (from the course generator in Module 1); the hotel group is fictional.

## 2. The hotel numbers you will show

Hotel managers use a small set of measures. Learn them once and you can talk to any hotel team.

- **On the books (OTB):** confirmed room nights for a future stay date, as of today.
- **Occupancy OTB** = OTB room nights ÷ rooms available.
- **Pace:** OTB today against OTB at the same lead time last year. With only 60 days of synthetic history, compare with 28 days ago instead, and say so on the chart.
- **ADR** (average daily rate) = room revenue ÷ room nights sold. (In Module 4, ADR also means "architecture decision record". Context tells you which.)
- **RevPAR** (revenue per available room) = room revenue ÷ rooms available = occupancy × ADR.
- **Cancellation rate by channel** = cancelled ÷ created, by created date.

All of these are **ratios**, and ratios do not add up. You never average them across hotels; you add up the top and the bottom first, then divide.

<div class="steps">
<div class="step"><b>Two hotels.</b> H1 sold 100 nights for $20,000 (ADR $200). H2 sold 300 nights for $45,000 (ADR $150).</div>
<div class="step"><b>The tempting answer.</b> Average the ADRs: (200 + 150) ÷ 2 = $175. This treats H1's 100 nights as if they counted as much as H2's 300.</div>
<div class="step"><b>Add the tops.</b> Revenue: 20,000 + 45,000 = $65,000.</div>
<div class="step"><b>Add the bottoms.</b> Nights: 100 + 300 = 400.</div>
<div class="step"><b>Divide once.</b> Group ADR = 65,000 ÷ 400 = $162.50. Every group figure on your dashboard is built this way.</div>
</div>

<div class="problem" data-problem="proof-hotel-dagster-adr"></div>

<div class="problem" data-problem="proof-hotel-dagster-occupancy"></div>

<div class="meaning">

<dl>
<dt>Occupancy</dt><dd>The share of rooms that are sold for a night. 150 of 200 rooms = 75 %.</dd>
<dt>ADR</dt><dd>Average price paid per room night sold.</dd>
<dt>RevPAR</dt><dd>Revenue per room the hotel has, sold or not: occupancy × ADR. It rewards both filling rooms and charging well.</dd>
<dt>Pace</dt><dd>Are we ahead of or behind where we were at this point last time? The early warning for a weak month.</dd>
<dt>Physical meaning</dt><dd>Three weeks before a holiday weekend, the dashboard shows H3's occupancy on the books at 41 % against 58 % at the same lead time last year. The revenue manager opens a promotion that afternoon, instead of finding out on the weekend itself.</dd>
</dl>

</div>

<div class="myth">

**"The group's ADR is the average of the hotels' ADRs."** Only if every hotel sold exactly the same number of nights. Group figures come from sums: total revenue ÷ total nights. The same rule holds for occupancy, cancellation rate and every other ratio.

</div>

## 3. Acceptance checks

| # | Requirement | Proof in the repo |
| --- | --- | --- |
| 1 | Asset graph with groups, owners and descriptions | screenshot in README |
| 2 | Daily partitions by business date; every write replaces its partition | a test that runs a partition twice and compares row counts |
| 3 | File sensor with run keys; `.partial` files ignored | demo video |
| 4 | Retry policy on the transient sources only | run log screenshot |
| 5 | At least 5 asset checks, at least 2 blocking | screenshot of a blocked run |
| 6 | Backfill story: rule change, then a 60-day backfill, with time and cost recorded | README section |
| 7 | Dashboard: occupancy on the books for the next 90 days, pace, cancellations by channel | screenshot |
| 8 | Docker Compose with Postgres storage, started by one command | README |

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** ratios are non-additive. Compute them from sums at the level you report, never by averaging ratios.

**Equation:** for hotels `$h$` with revenue `$R_h$` and nights `$N_h$`:

```math
\text{ADR}_{\text{group}} = \frac{\sum_h R_h}{\sum_h N_h} = \sum_h \frac{N_h}{\sum_k N_k}\,\text{ADR}_h \;\neq\; \frac{1}{H}\sum_h \text{ADR}_h
```

The group ADR is a weighted average, with each hotel weighted by its share of nights. The plain average is right only if every hotel sold the same number of nights.

**Analogy:** average speed over a trip is total distance ÷ total time, not the average of the speeds on each leg.

**Where it breaks:** nowhere. This one always holds.

**Try it:** H1 sold 100 nights for $20,000; H2 sold 300 nights for $45,000. Group ADR? (65,000 ÷ 400 = $162.50, not $175.)
</details>

## 4. Build checklist

1. **Finish the graph.** Add `fct_bookings_daily` (partitioned by created date), keep `otb_by_stay_date` unpartitioned, and add a `pace` asset comparing today's OTB curve with the one 28 days ago.
2. **Wire the automation.** 06:15 schedule, the file sensor with run keys, retries on SFTP and the fake API, a failure sensor writing to `data/alerts.log`.
3. **Guard it.** Five checks from Lesson 3.6, two or more blocking.
4. **Record a backfill.** Change the cancellation rule (for example, treat a cancellation within 24 hours of arrival as a no-show), backfill 60 days, and write down the number of runs, the concurrency and the minutes taken.
5. **Dashboard.** A small Streamlit (or Evidence) app reading the marts: occupancy on the books for the next 90 stay dates, pace, cancellation rate by channel. Power BI comes in Module 6 and will reuse these tables.
6. **Demo video.** Two minutes: drop a file, the sensor fires, the run goes green, a check passes, the dashboard updates. Link it from the README.
7. **README.** In this order: a one-paragraph summary with the asset-graph screenshot, the problem, the architecture, "run it in 5 minutes", design decisions (partitions, sensors, checks, replace-only writes), the backfill story, tests, next steps.

**Your story** (for the README and interviews, with your own numbers): "Five hotels push booking extracts to SFTP overnight, sometimes late or half-uploaded. Bookings change status after the fact, so each file is a change feed, not a snapshot. I modelled it in Dagster as assets partitioned by business date, with a sensor keyed on file names, blocking checks on duplicate bookings, and replace-only writes. When I changed the cancellation rule I backfilled 60 days in N minutes with no manual steps."

**What done looks like:** a stranger can clone the repo, run one command, open `localhost:3000`, see green assets and a dashboard, and read in the README exactly how the pipeline behaves when a file is late, repeated or wrong. Every line of the acceptance table has its proof. Commit the final state as `feat: project 3 hotel-dagster`.

<div class="keypoints">

- The project proves operation, not just code: late files, repeated files and bad data are all handled without you.
- Occupancy, ADR, RevPAR and cancellation rate are ratios: add up tops and bottoms first, then divide.
- RevPAR = occupancy × ADR; pace compares today's bookings with the same lead time before.
- A recorded backfill (runs, concurrency, minutes) is the strongest single piece of evidence in the README.

</div>
