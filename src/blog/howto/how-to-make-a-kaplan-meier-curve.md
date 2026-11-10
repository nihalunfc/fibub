---
title: "How to make a Kaplan-Meier survival curve (and read it)"
summary: "List each subject's time and whether the event happened, then multiply the survival fraction down at every event time. A worked example by hand, the log-rank test, and what censoring means."
tools: [survival-analysis, sample-size, plot-maker]
updated: 2026-11-10
sources:
  - "Kaplan and Meier (1958), Journal of the American Statistical Association 53: 457-481, for the product-limit estimate; Greenwood (1926) for its variance; Mantel (1966), Cancer Chemotherapy Reports 50: 163-170, for the log-rank test."
  - "The relapse times in the example are made up for this article."
---

A Kaplan-Meier curve starts at 1 (everyone event-free) and steps down at each time an event happens, by the fraction of people still being followed who had the event then; people who drop out early leave the count without pulling the curve down. Paste one row per subject into [[survival-analysis]] and it draws the curves, gives the median time and tests whether groups differ. For general study and teaching only, not medical advice.

## What you need

- **A time for every subject**, counted from the same starting point for all of them (diagnosis, joining the study, planting, switching on a machine).
- **An event flag**: 1 if the event happened at that time, 0 if the subject was *censored*. Censored means you stopped watching them before anything happened: they left, the study ended, or they were lost to follow-up. You know only that their time was at least that long.
- **A group label** if you want to compare groups, such as two treatments.

## Step by step

1. Open [[survival-analysis]]. It starts with a made-up example of 40 people; clear the box.
2. Paste your data: time, event, group, one subject per row, with an optional header row. Yes/no or dead/alive work in place of 1/0.
3. Leave **Column 3 is** on *The group*. Type your **Time unit** so the tables are labelled.
4. Choose the **Interval** type (log-log is the default) and its **Level**. Tick **Show confidence bands** to draw them around each curve.
5. Read the median survival line, the **Number at risk** table under the chart, the **Median survival** table and the **Log-rank test** table. Each × on the curve is a censored subject.
6. Optionally fit the **Cox proportional hazards model** below for a hazard ratio, and download the life table as CSV or the full report.

The rule behind each step of the curve, at event time tᵢ:

- S(tᵢ) = S(tᵢ₋₁) × (1 − dᵢ ÷ nᵢ)

Here dᵢ is the number of events at that time and nᵢ the number still at risk just before it (not yet had the event and not yet censored). The median survival time is the first time S drops to 0.5 or below.

## A worked example

A made-up pilot study follows 16 people for up to 26 weeks after treatment and records when each relapses. Censored times are marked (c).

- **Standard care:** 3, 5, 5 (c), 8, 10, 12 (c), 15, 20 (c) weeks
- **New programme:** 6, 9 (c), 11, 14 (c), 18, 22 (c), 24 (c), 26 (c) weeks

Paste it as three columns, for example `3  1  Standard` and `5  0  Standard` for the censored 5.

By hand for standard care:

| Week | At risk | Relapses | Survival |
|---|---|---|---|
| 3 | 8 | 1 | 1 × 7/8 = 0.875 |
| 5 | 7 | 1 | 0.875 × 6/7 = 0.750 |
| 8 | 5 | 1 | 0.750 × 4/5 = 0.600 |
| 10 | 4 | 1 | 0.600 × 3/4 = 0.450 |
| 15 | 2 | 1 | 0.450 × 1/2 = 0.225 |

At week 8 only 5 are at risk, not 6, because the person censored at week 5 has left. The curve first falls below 0.5 at week 10, so the median is **10 weeks**. The tool gives the same steps and the same median.

For the new programme the curve ends at 0.547 at week 18 and never reaches 0.5, so its median is **not reached**: more than half were still relapse-free when follow-up stopped.

The log-rank test compares observed with expected relapses: standard care had 5 against 3.03 expected, the new programme 3 against 4.97. That gives **χ² = 2.119 on 1 df, p = 0.146**. The curves look different, but with 16 people and 8 relapses the gap could still be chance. A bigger study is needed, and the [[sample-size|sample size calculator]] can help plan it.

## Check your answer

- **The curve never rises**, and it only drops at event times. A drop at a censored time means a 0 was typed as 1.
- **No censoring, simple fraction.** If nobody were censored, S at any time would just be the share still event-free. Our first two steps (7/8, then 6/8 = 0.75) show this before the first censoring.
- **Observed totals.** The observed events in the log-rank table add up to the number of 1s in your data (5 + 3 = 8), and the expected values add up to the same total.

## Questions people ask

**Why not just take the average time?** Censored people have unknown true times, so an average would treat "at least 12 weeks" as exactly 12 and come out too short. The Kaplan-Meier method uses what is known about them without guessing the rest.

**What does "number at risk" tell me?** How many subjects the curve rests on at each time. Late in follow-up it is often small, so steep late drops can be one person; read them with care.

**Can I style the chart for a poster?** Save the report image from the survival page directly, or download the life table as CSV and plot the survival column against time in [[plot-maker]] for a journal-sized figure.
