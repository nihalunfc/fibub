---
name: Age-depth model
num: 884
shelf: science
section: paleoclimatology
title: "Age-depth model builder for sediment and ice cores: linear, smoothing spline and Monte Carlo with 95 % envelopes"
summary: "Paste or open your dated levels (depth, age, 1σ) and get an age-depth model three ways: linear interpolation, a smoothing spline fitted within the errors, and a Monte Carlo model that never lets ages go backwards, with its median and 95 % envelope. See deposition time or accumulation rate down the core, ages at any depths, and dates flagged as outliers or reversals. CSV in and out; your data stays on your device."
status: live
ads: false
order: 884
icon: ruler
works: offline
updated: 2026-11-09
related: [radiocarbon-calibration, insolation-calculator, radiometric-age-calculator, dendro-crossdating, range-chart-plotter]
sources:
  - "Smoothing spline: C. H. Reinsch, 'Smoothing by spline functions', Numerische Mathematik 10 (1967), in the form of P. J. Green and B. W. Silverman, Nonparametric Regression and Generalized Linear Models (1994); written by fibub."
  - "Monte Carlo age-depth model with rejection of age reversals: the approach described for Clam by M. Blaauw, Quaternary Geochronology 5 (2010); written by fibub (it does not use Clam's code or calibration curves)."
  - "The example core is made up by fibub."
flow:
  - { icon: table, label: "Dates" }
  - { icon: sliders, label: "Settings" }
  - { icon: curve, label: "Model" }
  - { icon: download, label: "Download" }
---

## What it does

An **age-depth model** turns a handful of dated levels in a lake, peat, marine or ice core into an age for every depth. This tool builds three models side by side from your dates:

- **Linear interpolation**: straight lines between neighbouring dates, carried on above the top date and below the bottom one at the end rates.
- **Smoothing spline**: a smooth curve that does not have to pass through every date. You choose how closely it follows them with **S**, the target for Σ((age − curve)/σ)². With S equal to the number of dates (the default) the curve stays within the errors as a whole; S = 0 passes through every date.
- **Monte Carlo**: each date is drawn many times from a normal distribution with its 1σ error. Draws in which an age gets younger with depth are thrown away, and the rest are joined with straight lines. The **median** of all draws is the best age and the 2.5 % and 97.5 % ages give a **95 % envelope**, which widens between dates and beyond them.

It also shows **deposition time** (years per cm) or **accumulation rate** (cm per year) down the core, gives the ages at any depths you list, and **flags dates** that sit more than 2σ from the spline or that are significantly older than the date below them.

## How to use it

1. Paste your dates, one per line: depth, age, 1σ error and an optional label. Commas, tabs, semicolons or spaces all work, and a header line is skipped. Or press **Open a file** for a CSV, TSV or Excel file.
2. Choose the **depth unit** and **age unit**. Ice cores often use years b2k (before 2000 CE); lake cores cal yr BP (before 1950).
3. Set the **top** and **bottom** depth of the model (the default is the first and last date) and the **step** between depths.
4. Read the plot and the table of dates. A flagged date can be left out by putting **#** in front of its line; it stays on the plot as an open circle.
5. List the **depths** you need ages for (sample depths, tephra layers, pollen zones) and download them, or the whole model, as CSV. The report downloads as an image, PDF or Word file.

## Worked example

The example is a made-up lake core with ten dates between 0 and 440 cm, including a surface age of −60 cal yr BP (the year 2010). At 226 cm a bulk sediment date of 3150 ± 60 cal yr BP is younger than the curve expects. The spline with S = 10 puts that depth at about 3275 cal yr BP, so the date is 2.08σ off and is **flagged**. The Monte Carlo keeps about 6 % of its draws, because the 198 cm and 226 cm dates often swap order; at 300 cm it gives a median of about 5400 cal yr BP with a 95 % envelope of roughly 5280 to 5520. Put # in front of the 226 cm line and the Monte Carlo keeps every draw, and the deposition time between 198 and 265 cm becomes a steady 21 years per cm.

## Tips

- Calibrate radiocarbon dates first and type the calibrated age with a 1σ that covers its range. A calibrated range with several peaks is not normal, so treat this tool's envelope as a guide; Bayesian programs such as Bacon or OxCal model that properly.
- Two dates at the same depth are combined into their error-weighted mean.
- If the Monte Carlo keeps very few draws, two neighbouring dates contradict each other: one of them is probably an outlier.
- The seed fixes the random draws, so a report can be repeated exactly. More runs give smoother envelopes.

## FAQ

**Which model should I use?** The Monte Carlo median and envelope are the safest choice for ages with uncertainties, because they never go backwards and widen where dates are sparse. The spline suits cores where you expect smooth sedimentation; linear interpolation is the simplest to report.

**Why does the spline curve bend backwards?** With few dates and a small S it can overshoot. The tool warns you: raise S or use the Monte Carlo model.

**How was it checked?** Linear ages match numpy's interp, the spline matches scipy's make_smoothing_spline exactly (to 10⁻⁷ years) with the same weights and stiffness, and the stiffness found for a given S matches scipy too. The Monte Carlo was compared with an independent numpy program with 40,000 draws: medians and envelope limits agree within a few percent of the envelope width, as two random runs should.
