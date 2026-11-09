---
name: Westgard rules QC checker
num: 503
shelf: science
section: nursing-and-lab-medicine
title: "Westgard rules checker with Levey-Jennings chart, CV and sigma metric (free)"
summary: "Paste quality control results for one or more control levels and check them run by run against the Westgard multirules (1-2s, 1-3s, 2-2s, R-4s, 4-1s, 10x and more), with Levey-Jennings charts, flagged runs, CV, bias and the sigma metric."
status: live
ads: false
order: 43
icon: check
works: offline
updated: 2026-11-09
related: [reference-interval, bland-altman, method-validation, calibration-curve, uncertainty-calculator, control-charts, lab-unit-converter, calibration-drift]
sources:
  - "Multirules: Westgard JO, Barry PL, Hunt MR and Groth T (1981), A multi-rule Shewhart chart for quality control in clinical chemistry, Clinical Chemistry 27:493-501."
  - "Control chart: Levey S and Jennings ER (1950), American Journal of Clinical Pathology 20:1059-1066."
  - "Sigma metric (TEa − |bias|) / CV: Westgard JO and Westgard SA (2006), American Journal of Clinical Pathology 125:343-354."
  - "Sample data and the example TEa: made up for this page."
flow:
  - { icon: table, label: "QC results" }
  - { icon: target, label: "Targets" }
  - { icon: check, label: "Rules" }
  - { icon: chart, label: "LJ chart" }
---

## What it does

Every analytical run in a clinical lab includes control samples with known values. **Westgard rules** decide, from where those control results fall against their target mean and SD, whether the run can be reported or must be rejected and investigated. This tool checks a whole series of runs at once, in your browser: it flags each run as in control, warning or rejected, names the rule that was broken, draws a **Levey-Jennings chart** for each control level, and works out the **CV**, **bias** and **sigma metric**.

See the same runs as a chart with [[control-charts]], and set up the patient ranges in the [[reference-interval|reference interval calculator]].

## How to use it

1. Paste the control results: one run per line (oldest first), one column per control level. A first column named Run, Date or Day, or holding text, becomes the run label. Blank cells are fine when a level was not run.
2. Give the target mean and SD for each level, separated by commas, or let the tool work them out from all results or from the first runs (for example the first 20, as when a new lot is set up).
3. Pick the rules. **Classic set** is 1-2s (warning), 1-3s, 2-2s, R-4s, 4-1s and 10x.
4. For the sigma metric, type the allowable total error (TEa) for the test and, if you know it, the bias from a proficiency scheme.
5. Read the flagged runs, the level table and the charts; download the runs as CSV or a report.

## The rules

All rules use z = (result − target mean) ÷ target SD; "beyond 2 SD" means more than 2 SD from the mean, on one side.

- **1-2s:** one result beyond 2 SD. A warning to look closer; used as a rejection rule it rejects about 1 run in 20 for no reason (5 % per result), so it is a warning here unless you tick the box.
- **1-3s:** one result beyond 3 SD (random error).
- **2-2s:** two results beyond 2 SD on the same side, either two levels in the same run or the same level in two runs in a row (systematic error).
- **R-4s:** in one run, one level beyond +2 SD and another beyond −2 SD (random error). Checked within a run only.
- **4-1s, 3-1s:** four (three) results in a row beyond 1 SD on the same side, within one level or across levels in time order (so two levels in two runs count for 4-1s).
- **2of3-2s:** two of the last three results beyond 2 SD on the same side, for labs with three levels.
- **10x, 6x, 8x, 9x, 12x:** that many results in a row on the same side of the mean, within a level or across levels (a shift).
- **7T:** seven results of one level in a row, each higher (or each lower) than the one before (a trend).

With **Check the other rules only after a 1-2s warning**, a run with no result beyond 2 SD is accepted without checking the rest, as in the 1981 flowchart. Modern practice usually checks every rule on every run.

## Worked example

The sample has 30 runs of two made-up control levels with targets 5.00 ± 0.20 and 15.00 ± 0.50 mmol/L. With the classic set the page shows 5 runs rejected, 1 warning, 24 in control (of 30): run 6 is a warning (Level 1 at +2.30 SD); run 9 breaks 1-3s (Level 1 at +3.40 SD); run 12 breaks 2-2s (both levels above +2 SD); run 15 breaks R-4s (+2.30 and −2.20 SD); run 18 breaks 4-1s across levels (runs 17 and 18, all four above +1 SD); and run 30 breaks 10x within Level 2, which sat above its mean from run 21 on. Level 1 has a CV of 4.16 % and a bias of 1.69 % against its target, so with a TEa of 10 % its sigma is 2; Level 2 has a CV of 2.94 %, bias 0.922 % and sigma 3.08 (NumPy gives the same). Both are poor, which is why the full multirule is needed. The 10 % TEa is only an example: check the official source for your test.

Every rule was tested on hand-made sequences (each side, boundaries, missing results, within and across levels), and the classic rules agree run by run with an independent Python version on 60 random series.

## Tips

- Set the target mean and SD from at least 20 runs of the control lot in your own lab, not from the manufacturer's range, which is usually much wider.
- Choose rules by sigma: with sigma 6 or more a single 1-3s rule is enough; below 4 use the full multirule and more controls per run.
- A rejected run means investigate and fix before repeating; do not just rerun the control until it passes.

## FAQ

**Why is 1-2s only a warning?** With two levels per run, about 1 run in 10 breaks 1-2s by chance alone.

**Is my data uploaded?** No. Everything stays in your browser, and the page works offline.
