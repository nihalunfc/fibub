---
name: TCID50 and plaque assay calculator
num: 198
shelf: science
section: virology-and-immunology
title: "TCID50 calculator (Reed–Muench and Spearman–Kärber) and plaque assay titre: TCID50/mL, PFU/mL and confidence intervals"
summary: "Type the infected wells at each dilution and get the 50 % endpoint by Reed–Muench and Spearman–Kärber (with its standard error and interval), the TCID50/mL for your inoculum and a rough PFU/mL. Type plaque counts and get the PFU/mL pooled over the countable plates, with an exact Poisson interval, plots, a CSV and a report."
status: live
ads: true
order: 1
icon: calculator
works: offline
updated: 2026-11-09
related: [lc50-probit, dose-response, hemocytometer, solution-calculator, plate-layout, moi-calculator, antibody-dilution, counting-statistics]
sources:
  - "Reed–Muench: L. J. Reed and H. Muench (1938). Spearman–Kärber: C. Spearman (1908) and G. Kärber (1931), with the standard error as given by D. J. Finney. Exact Poisson interval: F. Garwood (1936). The PFU ≈ 0.69 × TCID50 rule follows from the Poisson zero term (e^−m = 0.5, so m = ln 2). Methods only; no tables are copied."
  - "Written by fibub. Checked in the tests against an independent NumPy script (Reed–Muench table form, the even-step Kärber formula and its standard error, and Poisson intervals found by summing probabilities) on the example and five random series, and against hand working."
  - "The example wells and plaque counts are made up for this tool. The countable range of 10 to 100 plaques is a round starting value, not a standard; change it."
flow:
  - { icon: table, label: "Wells" }
  - { icon: calculator, label: "Endpoint" }
  - { icon: target, label: "Plaques" }
  - { icon: chart, label: "Titre" }
---

## What it does

A virus stock is titrated by diluting it step by step and seeing how far it can be diluted and still infect. This page handles the two usual read-outs:

- **Endpoint dilution (TCID50).** Each dilution goes into several wells of cells, and each well is scored as infected (cytopathic effect, or a positive stain) or not. The **50 % tissue culture infectious dose** is the dilution that would infect half the wells. The page finds it two ways. **Reed–Muench** adds up infected wells from the weakest dilution upwards and uninfected wells from the strongest downwards, then interpolates where the cumulative percentage crosses 50 %. **Spearman–Kärber** starts at the weakest dilution where every well is infected and adds up the fraction infected at each step: endpoint = that dilution − step/2 + step × the sum. It also gives a **standard error**, so you get an interval.
- **Plaque assay (PFU/mL).** Each dilution is spread on plates and the plaques are counted. Plates with too few plaques are noisy and plates with too many merge, so only dilutions whose average count is in the **countable range** are used. Those plates are pooled: titre = all their plaques ÷ the volume of original stock they held. The **interval** is the exact Poisson interval for the total count.

TCID50 per inoculum becomes **TCID50/mL** by dividing by the volume put in each well. Because one TCID50 infects half the wells, each well got on average ln 2 ≈ 0.69 infectious particles, so **PFU/mL ≈ 0.69 × TCID50/mL**. That is a Poisson approximation, and only holds when one particle is enough to infect a well and to make a plaque.

Turn the titre into an infection plan with the [[moi-calculator|MOI calculator]], and count the cells to infect with the [[hemocytometer]].

## How to use it

1. **Wells.** Type each dilution (1:1000, 10^-3 or 0.001), the wells that are infected and the wells in all. *Make a dilution series* fills in the dilutions for you from the strongest one, the fold and the number of wells. You can also paste a table.
2. **Inoculum per well** is the volume of each dilution in one well, in mL. *Main result from* chooses which method's answer is shown big; *Interval* sets the level for Spearman–Kärber and the plaque titre.
3. **Plaques.** Type each dilution and the count on each of its plates, separated by commas. Write TNTC for a plate with too many to count. Set the volume per plate and the countable range.
4. Read the titres, check the warnings and the plots, and download the CSVs or a PNG, PDF or Word report.

## Worked example

The made-up endpoint example runs from 10⁻¹ to 10⁻⁸ in 8 wells each, with 0.1 mL per well. The first four dilutions infect all 8 wells, then 6, 3, 1 and 0. Spearman–Kärber: 4 − 0.5 + (1 + 0.75 + 0.375 + 0.125) = 5.75, so the endpoint is the 10⁻⁵·⁷⁵ dilution, which is 10⁶·⁷⁵ = **5.62 × 10⁶ TCID50/mL**, with a standard error of 0.28 log₁₀ and a 95 % interval of 1.62 × 10⁶ to 1.95 × 10⁷ /mL. Reed–Muench gives cumulative 83.3 % at 10⁻⁵ and 36.4 % at 10⁻⁶, a proportionate distance of 0.71, an endpoint of 10⁻⁵·⁷¹ and **5.12 × 10⁶ TCID50/mL**: only 0.04 log₁₀ apart. The rough PFU/mL is 3.9 × 10⁶.

The plaque example has triplicate plates of 0.1 mL: TNTC at 10⁻⁴, 88, 97 and 79 at 10⁻⁵, 11, 7 and 9 at 10⁻⁶. With the range 10 to 100 only 10⁻⁵ is used: 264 plaques ÷ (3 × 0.1 mL × 10⁻⁵) = **8.8 × 10⁷ PFU/mL**, 95 % interval 7.77 × 10⁷ to 9.93 × 10⁷. Lower *Countable from* to 5 and 10⁻⁶ joins in: 291 ÷ 3.3 × 10⁻⁶ mL = 8.82 × 10⁷.

## Tips

- Bracket the endpoint: Spearman–Kärber needs a dilution with every well infected and the weakest with none.
- More wells per dilution narrow the interval much more than more dilutions do.
- Count plaques on every plate of a dilution, and use the same range for a whole study.

## FAQ

**Which method should I report?** Spearman–Kärber is the more accurate and comes with an interval; Reed–Muench is the older, still common one. Say which you used.

**Why is my titre a bit different from a spreadsheet?** Spreadsheets differ in rounding and in which wells they start from. The table under the plot shows every step.

**Is anything uploaded?** No. Everything is worked out on this page, and nothing is stored.
