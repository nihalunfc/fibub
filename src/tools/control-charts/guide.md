---
name: Control charts
num: 690
shelf: science
section: metrology-and-quality
title: "Control charts"
summary: "Paste or open process data and draw X̄-R, X̄-S, I-MR, p, np, c or u control charts with limits from your data, Western Electric or Nelson rule flags, and process capability (Cp, Cpk, Pp, Ppk with confidence intervals, expected ppm) with a histogram and normal fit."
status: live
ads: true
order: 690
icon: chart
works: offline
updated: 2026-11-09
related: [gauge-rr, trend-analyser, method-validation, uncertainty-calculator, calibration-drift, westgard-qc, tolerance-stackup, time-series-analyser]
sources:
  - "Shewhart control charts and limits as in Montgomery, D. C., Introduction to Statistical Quality Control; the d2, d3 and c4 constants are computed by fibub from the normal distribution (Tippett 1925 for the range, the gamma function for c4), not copied from tables."
  - "Western Electric Statistical Quality Control Handbook (1956) rules and Nelson, L. S. (1984), The Shewhart control chart: tests for special causes, Journal of Quality Technology 16(4); rule wording by fibub."
  - "Capability indices with chi-square intervals for Cp and Pp and Bissell, A. F. (1990), How reliable is your capability index?, Applied Statistics 39(3), for Cpk and Ppk."
  - "Checked against an independent NumPy/SciPy script; no code copied. All example data are made up by fibub."
flow:
  - { icon: table, label: "Data" }
  - { icon: chart, label: "Chart" }
  - { icon: flag, label: "Rules" }
  - { icon: percent, label: "Capability" }
---

## What it does

A **control chart** tells you whether a process is stable: whether its ups and downs are the ordinary noise of the process (common causes), or whether something has changed (a special cause) that you should find and fix. This tool draws the classic Shewhart charts from your data:

- **X̄ and R** or **X̄ and S** for measurements taken in small subgroups (for example 5 parts every hour).
- **I-MR** (individuals and moving range) for one measurement at a time.
- **p** and **np** for the proportion or number of defective items in each sample.
- **c** and **u** for the number of defects in each sample or per unit inspected.

Limits are the centre line ± 3 sigma, estimated from your data. Points are checked against the **Western Electric** rules (4 rules) or the eight **Nelson** rules, such as 2 of 3 points beyond 2 sigma or 9 points in a row on one side. For measurement charts, add specification limits to get **process capability**: Cp, Cpk, Pp and Ppk with confidence intervals, the expected parts per million out of specification, and a histogram with normal curves.

Check the measurement system first with a [[gauge-rr|gauge R&R study]], and set tolerances the process can meet with the [[tolerance-stackup|tolerance stack-up]].

## How to use it

1. **Choose the chart.** The data box shows what it expects; press **Use the example for this chart** to see a made-up data set in the right shape.
2. **Paste or open your data.** For X̄ charts, each row is a subgroup, or choose "one column" and give the subgroup size. Text such as a header or a date column is skipped.
3. **Pick the rules.** Western Electric is a good default; Nelson adds trend and pattern tests and gives more false alarms.
4. **Enter LSL and USL** (one is enough for a one-sided specification) to see capability.

## Worked example

The made-up example has 25 subgroups of 5 fill weights (g), with a small upward shift near the end. The X̄-R chart has a centre line of 500.24 g, limits 499.64 and 500.83 g, and R̄ = 1.0320 g (UCL 2.1822, using d2 = 2.3259 and d3 = 0.8641 for n = 5). The within-subgroup σ = R̄/d2 = 0.44369 g. With the Western Electric rules, subgroups 21 and 22 are beyond the limits, 21 to 24 break the 2-of-3 and 4-of-5 rules, and subgroup 8 completes a run of 8 below the centre line.

With specification limits of 498.5 and 501.5 g: **Cp = 1.127** (95 % CI 0.971 to 1.283), **Cpk = 0.949**, Pp = 0.920 and Ppk = 0.775, so about 10,730 ppm out of specification is expected from the overall spread. The process is not in control, so these numbers describe its past, not its future.

## Tips

- Use 20 to 25 subgroups to set limits, then keep the limits fixed while you monitor new data.
- Keep subgroups rational: items made close together, so the variation within a subgroup is only the short-term noise.
- A p chart allows a different sample size each time; its limits step in and out. Use np only when the sample size never changes.

## FAQ

**Where do the constants come from?** d2 and d3 are the mean and standard deviation of the range of n normal values and c4 is the mean of the sample standard deviation; this tool computes them from their definitions instead of a printed table.

**Why do Cp and Pp differ?** Cp uses the short-term, within-subgroup spread; Pp uses the spread of all values, which also includes drifts and shifts between subgroups.

**Is my data uploaded?** No. Everything runs in your browser and works offline.
