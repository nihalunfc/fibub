---
title: "Gauge R&R and SPC for thread pitch diameter on a CNC lathe: Cpk 0.18 to 1.40"
summary: "A 2026 Metrology study paired a gauge R&R with X-bar R charts to fix a stainless-steel thread behind 57 % of scrap. Rerun both checks in your browser."
tools: [gauge-rr, control-charts, tolerance-stackup]
updated: 2026-11-10
sources:
  - "Yáñez-Contreras P, Contreras-Rojas MF, Santander-Bastida FJ, Martin del Campo-Vázquez R, Flores-Martínez NL (2026), Metrology 6(4): 81, the paper described here."
  - "Gauge R&R acceptance bands (below 10 %, 10 to 30 %, above 30 %) and ndc of 5 or more: AIAG Measurement Systems Analysis guidelines."
  - "The gauge studies and subgroups in the worked example are made up by fibub, not taken from the paper."
paper:
  title: "Integrating Measurement-System Analysis and Statistical Process Control to Assess Capability Improvement of Thread Pitch Diameter in a CNC-Turned Stainless-Steel Fitting"
  authors: "Yáñez-Contreras P, Contreras-Rojas MF, Santander-Bastida FJ, Martin del Campo-Vázquez R, Flores-Martínez NL"
  journal: "Metrology"
  year: 2026
  doi: "10.3390/metrology6040081"
  url: "https://www.mdpi.com/2673-8244/6/4/81"
  licence: "CC BY"
  reviewed: true
---

When a machined part keeps failing inspection, there are two suspects: the machine and the measurement. A small workshop in Mexico tackled both for the thread on a stainless-steel bulkhead fitting, in a paper in Metrology in November 2026. They checked the micrometer with a gauge repeatability and reproducibility (R&R) study, tracked the lathe with control charts, made four changes and measured again. This page walks through the study and shows how to run both halves of the job with the [[gauge-rr|gauge R&R calculator]] and [[control-charts]], with the [[tolerance-stackup]] calculator for the step where a tolerance band is split between parts.

## What they found

Before the changes, the thread's pitch diameter was behind 100 of 175 scrapped parts (57 %) in one month. The process was out of control, so its capability figures are only a rough guide, but within-subgroup Cpk was about 0.18 (Cpk compares the distance from the mean to the nearer specification limit with three standard deviations; 1.33 is a common target). After the changes, Cp was about 1.81 and Cpk about 1.40, and the charts showed no out-of-control points. The insert's life rose from about 572 to 1,276 parts per edge, and scrap per shift fell by about half.

The gauge was the weaker link. Before, the R&R used up roughly 65 to 89 % of the tolerance, with operators disagreeing more than the instrument repeated itself. Afterwards the operator-by-part effect disappeared, and the share fell to about 46 % of the tolerance, still too high, with fewer than 2 distinct categories.

## Why it matters

Capability indices are only as good as the measurements behind them. A gauge that spends half the tolerance on its own noise makes a good process look worse and can scrap good parts. Small shops rarely publish this kind of before-and-after record, and this one is honest about what it did and did not prove.

## How they did it

The characteristic was the pitch diameter of a 5/8-18 UNF-2A external thread on AISI 303 stainless steel, with a specification band of 0.0007 in (about 0.018 mm) that is not centred on the nominal size. It was measured with a digital thread micrometer reading to 0.00005 in. Each gauge study was crossed: 10 parts, 3 appraisers and 2 trials, analysed by both the average and range method and two-way ANOVA. The process was followed with X-bar and R charts: 6 subgroups of 3 before, 7 subgroups of 5 after. The changes were a standard deburring technique, a stainless-grade coated carbide insert, checking shop instruments against gauge blocks and rings, and logging insert life.

## Check it yourself with fibub

We use **made-up numbers** in millimetres on a thread like the paper's: 5 parts, operators A, B and C, 2 trials each, and a tolerance of 0.018 mm.

1. **Before: a biased operator.** Paste rows of part, operator, trial 1, trial 2 into the gauge R&R calculator. Ours have true sizes from 14.836 to 14.848 mm, small trial-to-trial noise, and operator C reading 0.002 to 0.006 mm high. Part 1, for example: A 14.837 and 14.835, B 14.836 and 14.838, C 14.838 and 14.841. Set **Tolerance** to 0.018 and keep 6 standard deviations.
2. **Read it.** The interaction p is 0.152, so it is pooled. %GRR is **49.5 % of study variation and 90.2 % of the tolerance**, ndc is 2, and reproducibility (40.8 %) is larger than repeatability (28.1 %). The average and range method gives a similar 47.1 %. The verdict is "needs improvement", and the cause points at people, not the instrument.
3. **After: train the operator.** Take operator C's offset away and rerun. Reproducibility drops to zero, %GRR falls to **24.6 % of study variation**, ndc rises to 5, but %tolerance is still **41.4 %**, because the micrometer's own repeatability is too coarse for an 18 µm band. That is the same pattern the paper reports: fixing method helps, but the gauge itself must change too.
4. **Chart the process.** In the control charts tool pick **X̄ and R**, each row a subgroup, and paste 6 made-up subgroups of 3, such as 14.839, 14.840, 14.838 for the first. Our set has a grand mean of 14.8398 mm, a within-subgroup σ of 0.00138 mm and no rule breaks.
5. **Capability.** With LSL 14.834 and USL 14.852 mm, Cp is **2.18** but Cpk only **1.41**, because the mean sits low in the band. The 95 % interval for Cpk runs from **0.83 to 2.00**: 18 values cannot prove 1.33. The paper makes the same caution about its post-change Cpk.
6. **Share the band.** If the thread mates with a nut, the tolerance stack-up calculator shows how much of the band each part can take.

## The fine print

- After the changes, only about one shift of data (seven subgroups) was collected, so long-term capability is not shown.
- The mean shift was not statistically significant at the subgroup level (p = 0.076).
- The gauge still failed (ndc below 2), so capability could not be corrected for measurement error.
- Four changes were made at once, so their separate effects are unknown; a change from two shifts to one also overlaps the scrap figures.
- There was no three-wire reference measurement, temperature was not logged, and insert wear was judged by operators.
- One part, one gauge and one shop: results may not carry over to other settings.
