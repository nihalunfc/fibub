---
name: Antibody dilution and titre calculator
num: 200
shelf: science
section: virology-and-immunology
title: "Antibody dilution calculator: working dilutions, serial dilutions and ELISA endpoint titre"
summary: "Work out a working dilution from your antibody stock (as 1:N or a µg/mL target), plan a 2-fold, 3-fold or custom serial dilution for titration, read the endpoint titre of an ELISA dilution series from a blank-based or fixed cutoff, and see how much antibody a run of blots or plates needs."
status: live
ads: true
order: 3
icon: flask
works: offline
updated: 2026-11-09
related: [dose-response, solution-calculator, plate-layout, protein-assay, calibration-curve]
sources:
  - "The arithmetic (stock volume = final volume ÷ N, 1 mg/mL = 1 µg/µL, serial transfer = volume ÷ (fold − 1)) and the endpoint titre (straight-line interpolation on log10 dilution to the cutoff) are written by fibub and checked in the tests against hand working and an independent NumPy script."
  - "The example stock, dilutions, ELISA ODs and blanks are made up by fibub. They are not from any data sheet, kit insert or paper; type your own."
flow:
  - { icon: flask, label: "Stock" }
  - { icon: sliders, label: "Dilute" }
  - { icon: table, label: "Series" }
  - { icon: chart, label: "Titre" }
---

## What it does

Antibodies are used at tiny amounts, so most of the work is arithmetic: how many microlitres of stock go into a blocking buffer, how to set up a dilution series to find the best concentration, and how to read a titre off an ELISA plate. This page does four of those jobs, and everything is worked out in your browser.

1. **Working dilution.** From the stock concentration on the vial (mg/mL), make a dilution written as **1:N** or aim for a **concentration** in µg/mL. You get the stock and diluent volumes, the final concentration and the micrograms you use. When the stock volume is under 1 µL, the page suggests a 1:10 or 1:100 intermediate dilution so you never have to pipette a fraction of a microlitre.
2. **Serial dilution.** Pick the first dilution, the step (2-fold, 3-fold, 4, 5, 10-fold or any custom fold), the number of tubes and the volume each tube should end with. The table lists every tube's dilution, concentration, diluent and transfer.
3. **Titre.** Paste dilutions with their OD readings (replicates side by side) and the blank wells. The cutoff is the blank mean plus k standard deviations (3 by default), k times the blank mean, or a fixed OD. The **endpoint titre** is the highest dilution whose mean OD is above the cutoff, read more precisely by drawing a straight line, on a log scale of dilution, to the next dilution below the cutoff.
4. **Antibody for a run.** For a number of blots (mL each) or plates (wells × µL), at a dilution and with a spare margin, you get the working volume, the stock volume, the micrograms and how many blots or plates one vial covers.

Here **1:N means 1 part in N parts in total**, the way antibody data sheets use it: 1:1000 is 1 µL of antibody in 1 mL of finished dilution. Some labs write 1:N for 1 part plus N parts of diluent; for large N the difference is tiny, but for 1:2 or 1:5 it matters, so check which your protocol means.

## How to use it

1. Type the stock concentration from the vial in **mg/mL** (leave it empty if the data sheet gives only a suggested dilution).
2. Choose **A dilution 1:N** or **A concentration**, then the final volume.
3. For a titration, set the first tube, the step and the number of tubes. Put the diluent in every tube first, then add the antibody to tube 1, mix, and carry the transfer volume down the row with a fresh tip each time.
4. After the plate is read, paste the dilutions and ODs, add the blank ODs and pick the cutoff rule.
5. Download the series or the titre table as CSV, or all four parts as an image, PDF or Word file.

## Worked example

The example uses made-up numbers: a stock of **0.8 mg/mL** diluted **1:2000** in **10 mL** of blocking buffer. The page shows **5 µL of stock + 9.995 mL of diluent**, a final concentration of **400 ng/mL**, and 4 µg of antibody used.

The serial dilution starts at 1:100 and goes 2-fold over 8 tubes of 100 µL: tube 1 is 198 µL of diluent plus 2 µL of stock, and you **move 100 µL each step**, from **1:100 to 1:12,800**.

The made-up ELISA has eight 3-fold dilutions from 1:100 to 1:218,700 in duplicate, and six blank wells with a mean of 0.053 and an SD of 0.0058. The cutoff (blank mean + 3 SD) is OD **0.071**. The last dilution above it is **1:24,300** (mean 0.146); the next, 1:72,900, reads 0.066. A straight line between them on log dilution meets the cutoff at an **endpoint titre of 1:68,382** (log₁₀ 4.83). Switch to *k × blank mean* with k = 2 and the cutoff rises to 0.107, giving 1:41,850: always say which rule you used.

For **6 blots** of **10 mL** each at 1:2000 with **10 % spare**, you need 66 mL of working dilution, **33 µL of antibody** (26.4 µg), and a 100 µL vial covers **18 blots**, leaving 67 µL after this run.

## Tips

- Pipette at least 1 to 2 µL. Below that, make an intermediate dilution, as the page suggests.
- Spin the vial briefly before opening so the antibody is not lost in the cap.
- Read the titre from the straight middle part of the curve's tail: if every dilution is above the cutoff, the page tells you to dilute further; if the OD dips and rises again, check for a pipetting slip or a hook effect.
- The same cutoff rule must be used to compare titres between plates and days.

## FAQ

**Which cutoff should I use?** Blank mean + 3 SD is common for endpoint titres; 2 × or 2.1 × the blank or negative-control mean is common too. A fixed OD (for example 0.1) is simple but depends on the reader and substrate time. Use the rule your lab or protocol states.

**Should I use replicate means?** Yes. The page averages the replicates on each line and shows their SD, and the titre uses the means.

**Is the titre the same as an EC50?** No. The endpoint titre is where the signal disappears into the background. For the dilution that gives half of the maximum signal, fit the curve with the dose-response tool.

**Does anything get uploaded?** No. Everything is worked out on this page and nothing is stored or sent.
