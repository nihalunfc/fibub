---
title: 'Control charts: is this KPI drop real?'
summary: 'Tell real changes from everyday noise in a daily or weekly KPI. Build an individuals control chart from a calm baseline, read its signals (points outside the limits, runs on one side), and stop holding meetings about noise.'
minutes: 20
updated: 2026-11-22
quiz:
  - q: 'A KPI''s control limits are 2.2 to 5.8. Today it is 5.4, the highest in two weeks. Is it a signal?'
    choices: ['Yes, it is the highest in two weeks', 'No: it is inside the limits and on its own is ordinary variation', 'Only if it is a Monday']
    ans: 1
    why: 'Points inside the limits with no unusual run are what the process normally produces. Reacting to them adds noise.'
  - q: 'Eight days in a row sit just above the centre line, all inside the limits. What does that suggest?'
    choices: ['Nothing; all points are inside', 'A likely shift in the process: eight in a row on one side happens by chance less than 1 % of the time', 'The limits are wrong']
    ans: 1
    why: 'Run rules catch small, sustained shifts that no single point reveals.'
  - q: 'Why estimate sigma from the average day-to-day change (moving range) rather than the overall SD?'
    choices: ['It is easier', 'If the process shifted during the baseline, the overall SD is inflated; the moving range reflects short-term noise only', 'It is always smaller']
    ans: 1
    why: 'The moving range is robust to shifts and trends within the baseline, so the limits stay tight enough to catch changes.'
---

**Module 8 · about 20 minutes · uses Lesson 3.4.** You'll be able to build an individuals control chart for a KPI, read its signals, and explain to a manager why most day-to-day changes need no action.

## 1. Two kinds of variation

Every process wobbles. **Common-cause variation** is the everyday noise of a stable process; **special-cause variation** is a real change: a broken machine, a new supplier, a software release. The costly mistakes are treating noise as a signal (the "why was Tuesday bad?" meeting) and missing real changes because the chart is always noisy.

A **control chart** (Shewhart, 1920s) separates the two.

<!--fig:control-chart-->

With no shift, the points wander inside the limits. Slide a shift of +1 point from day 25: a single point might not cross the limit, but a run of eight above the centre line soon gets flagged. A shift of +2.5 points is caught at once.

## 2. Building an individuals chart

1. Pick a **baseline** of 20 or more points when the process was stable (no known changes).
2. **Centre line** = the baseline mean.
3. **Sigma** = average moving range ÷ 1.128 (the moving range is the absolute change from one point to the next).
4. **Limits** = centre ± 3 sigma (lower limit at 0 if the metric can't go negative).
5. Plot new points against these fixed limits. Recompute only after a confirmed, lasting change.

## 3. Reading the signals

Common rules (Western Electric / Nelson, simplified):

- **One point outside the limits.**
- **Eight in a row on one side** of the centre line (a shift).
- **Six in a row steadily rising or falling** (a drift).
- Two of three points beyond 2 sigma on the same side.

Use a few rules, not all of them: each extra rule adds false alarms.

**For rates** (share of late orders out of varying daily volumes) a **p-chart** with limits that widen on low-volume days is better; for counts of rare events, a **c-chart**. The individuals chart is a good default for any KPI.

<details class="maths" open>
<summary>Maths and principle</summary>

**Principle:** if a stable process is roughly normal, 99.7 % of points fall within 3 sigma of its mean, so a point outside is a strong hint that something changed.

**Limits:**

```math
\text{CL} = \bar x, \qquad \hat\sigma = \frac{\overline{MR}}{1.128}, \qquad \text{UCL, LCL} = \bar x \pm 3\hat\sigma
```

1.128 is the expected range of two normal values in sigma units.

**False alarm rates:** a point beyond 3 sigma by chance: 0.27 %, about one in 370 points. Eight in a row on one side: `$2 \times 0.5^8 \approx 0.8\%$` for any given run of eight.

**Check:** baseline mean 4.0 %, average moving range 0.68: `$\hat\sigma = 0.60$`, limits 2.2 % to 5.8 % (tests/stats.mjs checks `controlLimits`).
</details>

## 4. Worked example

*Made-up warehouse:* share of orders shipped late, daily.

- Baseline: 20 calm days, mean 4.0 %, average moving range 0.68, limits **2.2 % to 5.8 %**.
- Day 23: 5.4 %. The ops manager asks for a root-cause review. The chart says: inside the limits, no run; ordinary variation. No review.
- Days 27 to 34: eight days in a row between 4.3 % and 5.5 %. Signal: a shift. Investigation finds a new courier pickup time from day 26.
- After fixing the pickup time, the series returns below the centre line. Keep the old limits until the new level has 20 stable days, then recompute.

## 5. Practice

1. Baseline mean 120 calls a day, average moving range 18. Limits?
2. Why not set limits at the target the business wants?
3. A chart has had no signals for 3 months, but the KPI is worse than the target. What does that mean?

<details>
<summary>Answers</summary>

1. Sigma = 18 ÷ 1.128 ≈ 16. Limits 120 ± 48: 72 to 168.
2. Limits describe what the process actually does (the voice of the process); targets are what you want (the voice of the customer). Mixing them hides real signals or invents false ones.
3. The process is stable but not good enough: improvement needs a change to the system (a redesign or new resources), not chasing individual bad days.
</details>

**Try it on your own data:** the [[control-charts]] tool draws individuals, X-bar and p-charts for your own numbers and flags the signals; [[normal-distribution-lab]] shows where the 3-sigma limits sit on a bell curve.

**New words:** *control chart*, *common-cause variation*, *special-cause variation*, *moving range*, *control limits*, *run rule*, *p-chart*.
