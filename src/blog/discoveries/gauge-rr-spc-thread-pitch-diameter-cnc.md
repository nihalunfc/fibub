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

The gauge was the weaker link. Before, the R&R used up about 89 % of the tolerance, with operators disagreeing more than the instrument repeated itself. Afterwards the operator-by-part effect disappeared, and the share fell to about 46 % of the tolerance, still too high, with fewer than 2 distinct categories.

## Why it matters

Capability indices are only as good as the measurements behind them. A gauge that spends half the tolerance on its own noise makes a good process look worse and can scrap good parts. Small shops rarely publish this kind of before-and-after record, and this one is honest about what it did and did not prove.

## How they did it

The characteristic was the pitch diameter of a 5/8-18 UNF-2A external thread on AISI 303 stainless steel, with a specification band of 0.0007 in (about 0.018 mm) that is not centred on the nominal size. It was measured with a digital thread micrometer reading to 0.00005 in. Each gauge study was crossed: 10 parts, 3 appraisers and 2 trials, analysed by both the average and range method and two-way ANOVA. The process was followed with X-bar and R charts: 6 subgroups of 3 before, 7 subgroups of 5 after. The changes were a standard deburring technique, a stainless-grade coated carbide insert, checking shop instruments against gauge blocks and rings, and logging insert life.

## Check it yourself with fibub

We use **made-up numbers** in millimetres on a thread like the paper's: 5 parts, operators A, B and C, 2 trials each, and a tolerance of 0.018 mm.

1. **Before: a biased operator.** In the gauge R&R calculator, paste these 15 rows (part, operator, trial 1, trial 2). Operator C reads a little high:

   ```
   1 A 14.837 14.835
   1 B 14.836 14.838
   1 C 14.838 14.841
   2 A 14.840 14.838
   2 B 14.839 14.841
   2 C 14.843 14.842
   3 A 14.843 14.841
   3 B 14.842 14.844
   3 C 14.845 14.847
   4 A 14.846 14.844
   4 B 14.845 14.847
   4 C 14.849 14.848
   5 A 14.849 14.847
   5 B 14.848 14.850
   5 C 14.852 14.851
   ```

   Set **Tolerance** to 0.018 and keep 6 standard deviations.
2. **Read it.** The part-by-operator interaction is not significant (p is about 1), so it is pooled. %GRR is **41.2 % of study variation and 71.2 % of the tolerance**, ndc is 3, and reproducibility (35.2 %) is larger than repeatability (21.4 %). The average and range method gives a similar 45.2 %. The verdict is "needs improvement", and the cause points at people, not the instrument.
3. **After: train the operator.** Subtract 0.003 from every one of operator C's readings and rerun. Reproducibility drops to 7.4 %, %GRR falls to **24.0 % of study variation**, ndc rises to 5, but %tolerance is still **38.9 %**, above the usual 30 % limit, because the micrometer's own repeatability is coarse for an 18 µm band. That is the same pattern the paper reports: fixing method helps, but the gauge itself must change too.
4. **Chart the process.** In the control charts tool pick **X̄ and R**, each row a subgroup, and paste these 6 made-up subgroups of 3, one per line: 14.839 14.840 14.838; 14.841 14.839 14.842; 14.838 14.840 14.841; 14.840 14.838 14.839; 14.841 14.840 14.838; 14.839 14.841 14.840. The mean is 14.8397 mm, the within-subgroup σ is 0.00148 mm and there are no rule breaks.
5. **Capability.** With LSL 14.834 and USL 14.852 mm, Cp is **2.03** but Cpk only **1.28**, because the mean sits low in the band. The 95 % interval for Cpk runs from **0.74 to 1.81**: 18 values cannot prove 1.33. The paper makes the same caution about its post-change Cpk.
6. **Share the band.** If the thread mates with a nut, the tolerance stack-up calculator shows how much of the band each part can take.

## The fine print

- After the changes, only about one shift of data (seven subgroups) was collected, so long-term capability is not shown.
- The mean shift was not statistically significant at the subgroup level (p = 0.076).
- The gauge still failed (ndc below 2), so capability could not be corrected for measurement error.
- Four changes were made at once, so their separate effects are unknown; a change from two shifts to one also overlaps the scrap figures.
- There was no three-wire reference measurement, temperature was not logged, and insert wear was judged by operators.
- One part, one gauge and one shop: results may not carry over to other settings.
