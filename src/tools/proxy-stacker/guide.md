---
name: Proxy record stacker
num: 508
shelf: science
code: T359
section: paleoclimatology
title: "Palaeoclimate proxy stacker: common age grid, z-scores, stack with envelope, correlations and lag scan"
summary: "Open several proxy records (age and value, CSV or Excel), put them on one age grid, turn them into z-scores over a window you choose, flip the ones that run the other way, and stack them (mean or median with a ±1 SD or bootstrap envelope). Compare records with correlations corrected for autocorrelation and a lag scan."
status: live
ads: false
order: 508
icon: chart
works: offline
updated: 2026-11-09
related: [trend-analyser, radiocarbon-calibration, time-series-analyser, dendro-crossdating, age-depth-model, insolation-calculator, isotope-delta-converter, data-cleaner]
sources:
  - "Effective sample size for correlating two autocorrelated series: Bretherton, C. S., Widmann, M., Dymnikov, V. P., Wallace, J. M. and Bladé, I. (1999), Journal of Climate 12, 1990 to 2009, equation 31."
  - "Interpolation, z-scores, stacks, the bootstrap, correlations, lag-1 autocorrelations and the lag scan are written by fibub and checked in the tests against numpy, pandas and scipy on the example."
  - "The four example records are made up by fibub from one invented signal with noise; they are not real data."
flow:
  - { icon: table, label: "Records" }
  - { icon: ruler, label: "Age grid" }
  - { icon: chart, label: "Stack" }
  - { icon: sigma, label: "Correlate" }
---

## What it does

A single lake core, cave stalagmite or marine record is noisy, has its own dating errors and responds to local as well as regional climate. Palaeoclimatologists therefore **stack** several records: put them on one age scale, put them on one unit-free scale, and average them, so the shared signal stands out and the noise of each record shrinks. This page does the whole routine in your browser:

- **Common age grid.** Each record is linearly interpolated to the same ages. *Auto* chooses the ages that every record covers and a step close to the coarsest record's typical sample spacing. You can type your own grid and stop the page from bridging long gaps between samples.
- **z-scores.** Each record has its mean taken away and is divided by its standard deviation, both measured over a **window** of ages you pick (for example a reference period). Records in ‰, °C and percent can then be averaged.
- **Sign flip.** Tick *Flip* for a proxy that falls when the others rise, such as δ¹⁸O against temperature.
- **Stack.** The mean or median of the records at each age, using only ages with at least the number of records you set. The envelope is either **±1 SD** of the records or a **bootstrap 95 %** band: whole records are drawn with replacement 1,000 times, restacked, and the 2.5 and 97.5 percentiles kept.
- **Correlations.** Pearson r for every pair over their shared ages, with the **effective sample size** of Bretherton et al. (1999), n_eff = n (1 − r₁r₁′) / (1 + r₁r₁′), where r₁ and r₁′ are the lag-1 autocorrelations. The p-value uses n_eff − 2 degrees of freedom; the plain p-value is shown beside it for comparison.
- **Lag scan.** r between record A at each age and record B at that age plus a lag, over a range of lags, to spot an age offset.

Put each core on an age scale first with the [[age-depth-model]], and compare the stack with orbital forcing in the [[insolation-calculator]].

## How to use it

1. **Records.** Paste three columns (record name, age, value), or age and value columns in pairs. Or tap *Open files* and pick one CSV or Excel file per record; the file name becomes the record's name.
2. **Use and Flip.** Untick a record to leave it out; tick *Flip* where a proxy runs the other way.
3. **Age grid.** Leave it on auto, or type the start, end and step. Set the z-score window and the stack method.
4. **Read and download.** Read the stack, the correlation table and the lag scan, then download the stack and correlations as CSV, or the whole report as an image, PDF or Word file.

## Worked example

The example holds four **made-up** records drawn from one invented signal with noise: a lake δ¹⁸O record that runs the other way (flipped), a cave δ¹³C record, a sea-surface temperature record whose ages were shifted 150 years too young, and a coarse pollen index. Auto picks **53 ages from 500 to 5700 years BP, step 100**, and the mean stack follows the shared wiggles.

The lake and cave records correlate with **r = 0.926** over 53 ages. Both are strongly autocorrelated (r₁ = 0.73 and 0.74), so n_eff is only **15.8**, and p is **3.1 × 10⁻⁷** rather than the 2.9 × 10⁻²³ a plain test would claim. The lag scan of the lake against the SST record peaks at **+100 years** (r 0.89 against 0.69 at zero lag): the 150-year offset shows up at the nearest grid step.

## Tips

- Correct each record's own age model first (for radiocarbon dates, calibrate them). Stacking cannot fix dating errors; the lag scan only hints at them.
- Do not choose a grid step much finer than the coarsest record: interpolation then invents points and makes the records look more alike than they are.
- A z-score window where every record has data keeps the records on the same footing.
- For a regional stack, check the correlation table first. A record that does not correlate with the others may be recording something else.

## FAQ

**Why is n_eff so much smaller than n?** Neighbouring ages in climate records are alike (and interpolation adds to that), so 53 ages carry far less independent information than 53 separate samples. Bretherton's formula estimates how many independent values the correlation really rests on.

**Mean or median?** The mean uses all the information; the median resists one odd record. Try both: if they differ a lot, look at why.

**Which envelope should I use?** ±1 SD shows how far the records spread. The bootstrap band shows how much the stack itself would move if you had a different set of records, which is usually what a reader wants.

**Is anything uploaded?** No. Files are read on the page and nothing leaves your device.
