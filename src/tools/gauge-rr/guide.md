---
name: Gauge R&R study
num: 689
shelf: science
code: T485
section: metrology-and-quality
title: "Gauge R&R calculator: crossed study by ANOVA and average and range method, %GRR, % contribution and ndc"
summary: "Paste or open a crossed gauge study (parts × operators × trials) and get repeatability, reproducibility, %GRR of study variation and tolerance, % contribution and the number of distinct categories by the ANOVA method and the average and range method, with the ANOVA table and R, X-bar and interaction charts."
status: live
ads: true
order: 689
icon: ruler
works: offline
updated: 2026-11-09
related: [uncertainty-calculator, method-validation, reliability-analysis, calibration-curve, control-charts, calibration-drift, tolerance-stackup, bland-altman, westgard-qc]
sources:
  - "ANOVA gauge R&R: two-way random-effects analysis of variance with interaction (Montgomery, D. C., Design and Analysis of Experiments; Burdick, Borror and Montgomery (2005), Design and Analysis of Gauge R&R Studies), with the interaction pooled when not significant."
  - "Average and range method and the acceptance guidelines as described in the AIAG Measurement Systems Analysis reference manual; the K1, K2 and K3 constants are computed by fibub from d2 and d3 (integrals of the normal distribution of the range, Tippett 1925) and Patnaik's d2* approximation, not copied from tables."
  - "Checked against NumPy and scipy.stats (F distribution) and SciPy numerical integration; no code copied. The example study is made up by fibub."
flow:
  - { icon: table, label: "Study" }
  - { icon: sigma, label: "ANOVA" }
  - { icon: percent, label: "%GRR" }
  - { icon: chart, label: "Charts" }
---

## What it does

Before you trust a gauge, caliper, CMM or lab instrument to accept or reject parts, you need to know how much of the variation you see comes from the **measurement system** rather than the parts. A **gauge R&R** (repeatability and reproducibility) study answers that: several operators measure the same set of parts several times each, in random order, without knowing which part is which.

This tool analyses a **crossed** study (every operator measures every part the same number of times) in two ways:

- **ANOVA method**: a two-way analysis of variance with parts, operators and their interaction, turned into variance components for repeatability (equipment variation), reproducibility (operator and part × operator) and part-to-part variation. If the interaction is not significant it is pooled into repeatability.
- **Average and range method** (the classic form from the AIAG MSA manual): EV from the average range, AV from the spread of operator averages, PV from the range of part averages. Its K1, K2 and K3 factors are worked out from d2 and d3, which this tool computes by numerical integration of the normal distribution rather than reading a table.

For both it reports **%GRR** of the study variation and of the tolerance, **% contribution** (share of the variance), and the **number of distinct categories (ndc)**, with an R chart, an X̄ chart and an interaction plot.

Once the gauge is good enough, watch the process with [[control-charts|control charts]], and follow the instrument over time with the [[calibration-drift|calibration drift tracker]].

## How to use it

1. **Paste or open your study.** Each row: part, operator, then the trials (or one row per measurement). Names or numbers both work.
2. **Tolerance** (upper minus lower specification) gives %tolerance, the usual measure when the gauge is used to accept parts. Leave it empty if there is none.
3. **Study variation**: 6 standard deviations is standard now; 5.15 matches older reports.
4. **Remove interaction when p is above**: 0.05 is common; 0.25 keeps the interaction more often; "never" always keeps it.

## Worked example

The made-up study has 10 parts measured 3 times by 3 operators (90 values in mm, tolerance 1 mm). The part × operator interaction has p = 0.668, so it is pooled. The ANOVA gives a repeatability standard deviation of 0.02257 mm and a reproducibility of 0.02168 mm, so **%GRR is 27.51 % of the study variation** and **18.78 % of the tolerance**, with a % contribution of 7.57 %. That is in the marginal band, and **ndc is 4**, just below the usual minimum of 5. The average and range method gives a similar %GRR of 29.16 % (EV 0.02359, AV 0.02245, PV 0.1068), using K1 = 0.5908, K2 = 0.5231 and K3 = 0.3146.

## Tips

- Choose parts that cover the real process range. Parts that are too alike make %study variation and ndc look worse than they are.
- Randomise the measuring order and hide the part numbers from the operators.
- If reproducibility dominates, train operators or fix the method; if repeatability dominates, look at the gauge, fixture or environment.

## FAQ

**Why does % contribution look smaller than % study variation?** % contribution compares variances; % study variation compares standard deviations, which are square roots, so small shares look larger.

**Is this the same as measurement uncertainty?** No. Gauge R&R looks at precision on real parts; an uncertainty budget (see the uncertainty calculator) also includes calibration, bias and other sources.

**Is my data sent anywhere?** No. It all runs in your browser and works offline.
