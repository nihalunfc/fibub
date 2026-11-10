---
name: Experiment design
num: 567
shelf: science
code: T395
section: statistics
title: "Experiment design"
summary: "Plan an experiment: full factorial, 2^(k−p) fractional factorial with its alias table, Plackett-Burman screening, central composite or Box-Behnken response-surface designs. Get a randomised run sheet (seeded, so you can repeat it) as CSV, then paste your results to see which factors matter."
status: live
ads: true
order: 567
icon: table
works: offline
updated: 2026-11-09
related: [sample-size, regression-workbench, distribution-explorer, plot-maker, hypothesis-tests, field-trial-designer, randomisation-list, yield-trial-anova, effect-size-converter]
sources:
  - "Methods: 2^(k−p) fractions by minimum aberration (Fries and Hunter, 1980), searched exhaustively here; Plackett and Burman (1946) designs from the Paley construction and Sylvester doubling; central composite designs (Box and Wilson, 1951) with rotatable and orthogonal-block α; Box–Behnken designs (1960); Lenth's pseudo standard error (1989) for unreplicated designs."
  - "Checked against independent Python implementations: exhaustive minimum-aberration word-length patterns, Lenth's method, and statsmodels OLS and ANOVA fits for factorial, central composite and Box–Behnken analyses. Plackett–Burman generating rows for 12, 20 and 24 runs checked against the published ones."
  - "The example factors and made-up responses are invented for this tool."
flow:
  - { icon: sliders, label: "Pick design" }
  - { icon: table, label: "Run sheet" }
  - { icon: flask, label: "Do the runs" }
  - { icon: chart, label: "Effects" }
---

## What it does

Design of experiments (DOE) plans which combinations of settings to try, so that a few runs tell you which factors matter and how they work together. Changing one factor at a time takes more runs and misses interactions. This tool builds the plan, gives you a run sheet to work through, and analyses the results you measure.

- **Full factorial**: every combination of every level, 2 to 6 levels per factor, numbers or names.
- **Fractional factorial 2^(k−p)**: a balanced part of the 2-level design. The tool picks the generators with **minimum aberration** (the fewest short aliases), or you type your own, and it shows the defining relation, the word-length pattern, the **resolution** and an alias table.
- **Plackett–Burman**: screening up to 25 factors in 8, 12, 16, 20, 24 … runs. The spare columns become dummy factors that show the size of the noise.
- **Central composite (CCD)** and **Box–Behnken (BBD)**: response-surface designs for fitting a curved (quadratic) model and finding an optimum.

Work out how many runs you can afford with the [[sample-size|sample size calculator]], then analyse the results in the [[regression-workbench]].

## How to use it

1. Choose the design type and the number of factors **k**. Name each factor and give its low and high settings (−1 and +1 in coded units).
2. Set the options. **Fraction** halves the runs each step down; **Replicates** repeats the whole design; **Centre runs** add runs at the middle of every factor, which estimate the noise and test for curvature. For a CCD, **α** sets how far the axial (star) points go: *rotatable* gives the same precision in every direction, *orthogonal blocks* lets the factorial part and the axial part be run on different days, and *on the faces* keeps every setting inside the low–high range.
3. The **seed** fixes the random run order, so the same seed gives the same sheet. Do the runs in the order shown; randomising protects against drift (warm-up, wear, the weather). Save the sheet as CSV.
4. Paste the measured responses, one per run, in run order (or switch to standard order). Unreplicated 2-level designs are judged by **Lenth's method**; with replicates or centre runs the tool gives t tests, a standard error for every effect and a curvature test. Multi-level factorials get a main-effects ANOVA; CCD and BBD get a full quadratic fit with its stationary point.

## Worked example

The page opens with five made-up chemistry factors (temperature 150 to 180, time 30 to 60, pressure 1 to 2, catalyst 0.5 to 1.5, stirring 200 to 400). The best half fraction is a **2^(5−1) design of 16 runs, resolution V**, with generator E = ABCD and defining relation I = ABCDE, so main effects and two-factor interactions are all kept apart. With seed 1 the first run is standard run 13: temperature 150, time 30, pressure 2, catalyst 1.5, stirring 400.

Press **Fill made-up example responses** and the analysis finds **4 of 15 effects** beyond Lenth's margin of error of **1.123** (pseudo standard error 0.4369): temperature (A) 12.004, the temperature × pressure interaction (AC = BDE) 7.5662, time (B) −6.5862 and catalyst (D) 4.6987. Everything else is smaller than 1.04, which is noise. Add 4 centre runs and fill again: now there are 3 residual degrees of freedom for t tests, and the curvature estimate of 3.739 (p = 0.0024) says the response bends, so a central composite design is the next step.

## What it does not do

It does not build D-optimal or mixture designs, blocks only the CCD, and for 6 or more factors its Box–Behnken designs use every pair of factors, so they have more runs than Box and Behnken's original tables. Up to 4,096 runs. For how many replicates you need, use the [sample size calculator](/science/sample-size/); for any other model of your results, the [regression workbench](/science/regression-workbench/).

## Frequently asked questions

**What does resolution mean?** Resolution III mixes main effects with two-factor interactions; IV keeps main effects clear but mixes two-factor interactions with each other; V keeps both clear.

**Why randomise?** Anything that drifts during the day would otherwise look like the effect of whichever factor changed along with it.

**Is my data sent anywhere?** No. Everything is worked out in your browser.
