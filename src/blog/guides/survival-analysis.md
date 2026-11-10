---
title: "Time-to-event data explained: Kaplan-Meier, log-rank and Cox"
summary: "How the survival analysis tool handles censored times, draws Kaplan-Meier curves, compares groups with the log-rank test and fits a Cox model, with a 12-part failure example."
tools: [survival-analysis, non-detects, sample-size, meta-analysis]
updated: 2026-11-10
sources:
  - "Kaplan and Meier (1958), JASA 53: 457-481 (the product-limit estimate). Greenwood (1926) for its variance."
  - "Mantel (1966), Cancer Chemotherapy Reports 50: 163-170 (log-rank test). Cox (1972), JRSS B 34: 187-220 (proportional hazards model)."
  - "The 12 machine parts in the worked example are made up; every number comes from the tool's own code."
---

The survival analysis tool takes a list of times until something happened, or until you stopped watching, and turns it into Kaplan-Meier curves, median times, a log-rank test between groups and a Cox regression with hazard ratios. "Survival" is just the traditional name: the event can be a death, a relapse, a customer cancelling or a pump breaking down. It is for students, researchers and analysts, for study and teaching, not medical advice. The same Kaplan-Meier idea, turned around for lab results below a detection limit, powers the [[non-detects|non-detect statistics]] tool; to plan how many subjects a study needs, use the [[sample-size]] calculator; and to combine hazard ratios from several papers, open the [[meta-analysis]] tool.

## What it is

The special problem with time-to-event data is **censoring**. If a part is still working when the test ends at week 20, you do not know its failure time, only that it is more than 20 weeks.

The **Kaplan-Meier** estimate handles censoring step by step. At each time t where events happen:

S(t) = S(before t) × (1 − d ÷ n)

where d is the number of events at t and n is the number still **at risk** (not yet failed and not yet censored) just before t. A censored item makes no step; it simply leaves the risk set. **Greenwood's formula** gives the standard error of S(t), from which the tool builds a confidence band.

The **median survival** is the first time the curve falls to 0.5 or below. If it never does, the median is "not reached".

The **log-rank test** asks whether two or more groups have the same curve. At each event time it compares the events each group actually had with the number expected if the groups were alike, and sums this into a χ² statistic.

The **Cox proportional hazards model** goes further. It estimates a **hazard ratio** (HR): how many times higher or lower the event rate is in one group than a reference group, or per unit of a covariate such as age, while holding the other terms fixed. An HR of 0.5 means half the rate. It assumes that ratio stays the same over time.

## How to use it

1. In the **Data** box, paste or load one row per subject: time, event (1 = happened, 0 = censored; words such as yes/no or dead/alive also work), then group and any numeric covariates.
2. Set **Column 3 is** to the group, or to a covariate if everyone is in one group.
3. Choose the **Interval** (log-log, log or plain) and the **Level** (90 %, 95 % or 99 %).
4. Read the **Kaplan-Meier curves** card: the median line, the counts, the chart (tick **Show confidence bands** if you want them), the number-at-risk table, the median table and the log-rank test.
5. In the **Cox proportional hazards model** card, tick the terms to include and pick the **Reference group**.
6. In **Life table**, open the full step-by-step table or download it as CSV, and save the whole report as an image, PDF or Word file.

## A worked example

A workshop tests 12 drive belts, 6 from each of two made-up suppliers, North and South, for up to 20 weeks. Each row is weeks, failed (1) or still running (0), and supplier:

| North | South |
|---|---|
| 3 (failed), 5 (failed), 5 (running), 8 (failed), 12 (running), 14 (failed) | 6 (failed), 9 (failed), 11 (running), 15 (failed), 18 (running), 20 (running) |

**North's curve by hand.** At week 3, 6 belts are at risk and 1 fails: S = 1 × (1 − 1/6) = **0.833**. At week 5, 5 are at risk and 1 fails (the other belt at week 5 is censored): S = 0.833 × 4/5 = **0.667**. At week 8 only 3 are left at risk: S = 0.667 × 2/3 = **0.444**. The belt censored at week 12 makes no step. At week 14 the last belt fails and S drops to **0**.

**South** follows the same pattern later: 0.833 at week 6, 0.667 at week 9 and 0.444 at week 15, then stays there because the last two belts were still running.

**Medians.** North **8 weeks** (95 % interval 3 to 14). South **15 weeks** (6 to –, the upper end not reached).

**Log-rank test.** North had 4 failures against 2.199 expected (O/E 1.819). South had 3 against 4.801 (O/E 0.625). χ² = **2.411** on 1 df, p = **0.121**.

**Cox model** with North as reference: South vs North HR = **0.2766**, 95 % interval **0.04931 to 1.552**, p = 0.144. The tool also warns that there are only 7 events for 1 term.

So South belts seem to last longer, failing at about a quarter of North's rate, but with 12 belts the interval is wide and runs past 1. The honest summary is "promising, test more belts".

## Where it is used

- **Clinical research.** Time to death or relapse in treatment and control arms, with patients joining and leaving at different times.
- **Engineering.** Time to failure of parts, where some units are still working when the test stops.
- **Business.** Time until a customer cancels a subscription; current customers are censored.

## Common mistakes

- **Dropping the censored rows.** It makes the curve fall too fast. Keep them with event 0.
- **Mixing up start times.** Every subject's clock must start at the same kind of moment, such as installation or diagnosis.
- **Trusting one hazard ratio when curves cross.** Crossing curves mean the ratio changes over time, so the Cox summary is misleading.
- **Fitting many Cox terms with few events.** Aim for about 10 events per term, and heed the tool's warning.

## Questions people ask

**What does the × on the curve mean?** It marks a censored subject: followed until that time, with no event seen.

**Which interval should I choose?** Log-log is a safe default for small samples. Pick log if you need to match R's default output.
