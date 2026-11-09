---
name: CPUE trend calculator
num: 339
shelf: science
section: fisheries-science
title: "CPUE calculator: catch per unit effort by year, standardised CPUE index (log-linear GLM) and stock trend"
summary: "Work out catch per unit effort (CPUE) from catch and effort records: nominal CPUE by year, a standardised index from a log-linear model with year plus factors such as vessel, area or gear, 95 % intervals, factor effects and the yearly trend, with a chart. Paste records or open a CSV or Excel file."
status: live
ads: true
order: 339
icon: chart
works: offline
updated: 2026-11-09
related: [trend-analyser, sample-size, biodiversity-indices, yield-per-recruit, von-bertalanffy-fitter, time-series-analyser]
sources:
  - "CPUE standardisation with a lognormal GLM (ln CPUE = year + factors), predictions at reference levels with the exp(s²/2) back-transform: M. N. Maunder and A. E. Punt (2004), Standardizing catch and effort data: a review of recent approaches, Fisheries Research 70: 141-159; N. C. H. Lo, L. D. Jacobson and J. L. Squire (1992), Canadian Journal of Fisheries and Aquatic Sciences 49: 2515-2526. Method only."
  - "Checked in the tests against statsmodels 0.14 (ordinary least squares on log CPUE with categorical year, vessel and area, and its prediction intervals for the mean). The example records are made up."
flow:
  - { icon: table, label: "Records" }
  - { icon: sigma, label: "Model" }
  - { icon: curve, label: "Index" }
  - { icon: chart, label: "Trend" }
---

## What it does

**Catch per unit effort (CPUE)**, catch divided by fishing effort, is the most common index of how a fish stock is changing: if there are fewer fish, each hour of trawling or each hundred hooks catches less. But raw ("nominal") CPUE also changes when the fleet moves to richer grounds, switches gear or when better vessels join, so scientists **standardise** it.

This tool:

- works out **nominal CPUE** for each year as total catch ÷ total effort;
- fits a **log-linear model** (a lognormal GLM), ln(CPUE) = year + vessel + area + …, by least squares, and takes each year's predicted CPUE at the most common vessel, area and so on as the **standardised index**, with a **95 % interval**;
- shows how much each factor level multiplies CPUE compared with its reference level;
- fits a straight line through the logarithm of the index to give the **trend in % per year**, with its interval;
- draws both indices, each scaled to a mean of 1, so their shapes can be compared.

## How to use it

1. Paste or open one row per trip, set or haul: **year, catch, effort**, then any **factors** as extra columns (vessel, area, gear, month, depth band…). A header row names them.
2. Tick the **factors** to include. A factor that is perfectly tied to the year (for example a vessel that fished only in one year) cannot be separated from it; the tool says so.
3. Choose what to do with **zero catches**: leave them out, or keep them by adding 10 % of the mean CPUE to every record before taking logs. Many zeros call for a delta (two-part) model, which this tool does not fit.

## Worked example (made-up records)

120 trips from 2015 to 2024 by three vessels in two areas, 5 of them with no catch. Leaving out the zeros, the model ln(CPUE) = year + vessel + area explains 61 % of the variation (residual SD 0.338). Vessel Bravo catches 1.43 times as much per hour as Alpha, Comet 0.73 times, and the North area 0.72 times the South. The standardised index (kg per hour for Alpha in the South) falls from 2.96 in 2015 to 1.75 in 2024, **−40.9 %**, against −37.3 % for nominal CPUE. **Standardised CPUE fell 5.4 % a year**, with a 95 % interval of −8.0 % to −2.8 %.

Keeping the zeros with a constant added gives a noisier index and a trend of −4.1 % a year whose interval now includes zero.

## Tips

- CPUE tracks abundance only if catchability stays the same. Better gear, fish finders or fish crowding into a shrinking area can keep CPUE high while the stock falls ("hyperstability").
- Use the effort unit that best matches how fishing works (hook-hours, trawl hours, soak days).
- Look at the factor effects: a big area or vessel effect is the reason standardisation matters for your data.

## FAQs

**Why predict at reference levels?** The index then means "CPUE for a typical vessel in a typical area". Any other choice moves the whole index up or down by the same factor, so the trend does not change.

**Why the exp(s²/2) term?** Back-transforming a mean of logs gives the median, not the mean; multiplying by exp(s²/2) corrects that for lognormal errors.

**Is my data uploaded?** No. Everything runs in your browser.
