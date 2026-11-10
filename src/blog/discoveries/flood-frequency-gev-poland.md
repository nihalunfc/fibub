---
title: "Which distribution fits annual peak flows? GEV versus dual gamma GEV in Poland"
summary: "A 2025 HESS study fitted four distributions to annual peak flows at 678 Polish gauges. See what it found, and how to compare GEV, log-Pearson III and Gumbel on your own record."
tools: [flood-frequency, trend-analyser, rating-curve]
updated: 2026-11-10
sources:
  - "Gruss Ł, Willems P, Tomczyk P, Pollert J Jr, Pollert J Sr, Märtner C, Czaban S, Wiatkowski M (2025), Hydrology and Earth System Sciences 29: 5165-5184, CC BY 4.0, the paper described here."
  - "Chance of at least one T-year flood in N years, 1 − (1 − 1/T)^N: standard hydrology."
  - "The 30-year flow record in the worked example is made up by fibub."
paper:
  title: "Evaluation of the Dual Gamma Generalized Extreme Value distribution for flood events in Poland"
  authors: "Gruss Ł, Willems P, Tomczyk P, Pollert J Jr, Pollert J Sr, Märtner C, Czaban S, Wiatkowski M"
  journal: "Hydrology and Earth System Sciences"
  year: 2025
  doi: "10.5194/hess-29-5165-2025"
  url: "https://hess.copernicus.org/articles/29/5165/2025/"
  licence: "CC BY 4.0"
  reviewed: true
---

Every bridge, levee and flood map rests on a guess about rare floods, such as the "100-year flood" that has a 1 % chance of being reached in any year. That guess comes from fitting a probability curve to the biggest flow of each year at a river gauge. But which curve? A team of hydrologists tested four of them on almost seven hundred Polish rivers, and published the results in Hydrology and Earth System Sciences in October 2025. This page explains the study in plain words and shows how to run the same kind of comparison on your own record with the [[flood-frequency|flood frequency tool]], after testing it for a trend in the [[trend-analyser]].

## What they found

The team started with 1,070 gauges and kept 678 on 340 rivers, each with 30 to 70 years of annual peaks. They compared:

- the **GEV** (generalised extreme value) distribution, with three parameters for location, spread and shape;
- the **dual gamma GEV** (GGEV), a newer cousin with a fourth parameter that lets the curve bend more freely;
- the three-parameter **log-normal** and **Pearson type III** distributions.

GGEV came out as the best fit most often, and GEV second. This held whether a station had no trend, a falling trend or a rising one. The authors suggest GEV for small and medium catchments, and GGEV for larger catchments whose flows are drifting over time. Using a Mann-Kendall test, they found that 446 records had no trend, 200 were falling and only 32 were rising.

## Why it matters

The choice of curve matters most where we have least data: far beyond the length of the record. Two curves can match 40 years of floods equally well and still disagree by tens of per cent on the 500-year flood. Many countries name an official distribution (log-Pearson III in the United States, GEV or similar in much of Europe), and studies like this test whether those choices still hold as rivers change.

## How they did it

For each gauge the team fitted every distribution. GEV, log-normal and Pearson III were fitted by maximum likelihood. GGEV was fitted by a Bayesian method that samples many possible parameter sets, with the fourth parameter found by searching a grid. They scored the fits by how far the fitted values fell from the recorded ones, used information criteria that penalise extra parameters, and checked for overfitting with Kolmogorov-Smirnov tests, quantile plots and five-fold cross-validation. A final step linked the fitted parameters to catchment size, landscape (lowland, highland, mountain), trend and the shape of each record.

## Check it yourself with fibub

fibub does not offer the dual gamma GEV, but the flood frequency tool fits GEV, log-Pearson III and Gumbel side by side, which is enough to see why the choice matters. The record below is made up: 30 annual peaks in m³/s for an imaginary small river, from 1995 to 2024.

148, 96, 121, 210, 88, 135, 175, 102, 119, 260, 140, 92, 113, 186, 130, 98, 154, 125, 82, 171, 109, 143, 95, 198, 118, 87, 131, 160, 104, 122

1. **Look for a trend first.** Paste the years and peaks into the trend analyser and choose Mann-Kendall. This record gives a Sen's slope of about −0.43 m³/s a year and a p-value of about 0.67, so there is no sign of a trend. A fixed, unchanging curve is a fair starting point.
2. **Paste into the flood tool.** Put the same two columns in **Annual peak flows** and type m³/s as the unit. The mean is about 134 m³/s and the largest peak 260 m³/s. The L-skewness (a measure of lopsidedness) is about 0.24, more lopsided than a Gumbel curve allows.
3. **Read the 100-year flood.** With **Flood for a return period of** set to 100, the GEV gives about **289 m³/s**, log-Pearson III about **279 m³/s** and Gumbel by L-moments about **265 m³/s**. The 10-year floods all sit near 188 m³/s. The curves agree where the data are, and part company beyond them.
4. **Check one flow.** Type 200 into **Return period of a flow of**. The GEV puts it at about 13.5 years, log-Pearson III at about 13.9 and Gumbel at about 14.0.
5. **Think about a lifetime.** Set **Chance over a span of** to 50 years: a 100-year flood has about a 39 % chance of happening at least once.
6. **Split the record.** Paste only the first 15 years, then only the last 15. The GEV 100-year flood is about 344 m³/s for the first half and about 237 m³/s for the second, even though the whole record shows no trend. One big year (260 m³/s) moves the answer a lot. That is why the bootstrap range on the page matters.

To turn a design flow into a water level at the gauge, fit the station's gaugings in the [[rating-curve]] tool.

## The fine print

- The paper did not let the distribution parameters change over time, so its point that GGEV suits changing rivers is a suggestion, not a tested result.
- The fourth GGEV parameter was found by a grid search rather than estimated in full with the others.
- Only 32 records had a rising trend, so conclusions for that group are weak.
- The paper's conclusions are not fully consistent with its results section in places, so read both.
- Flood estimates for design must follow the official method in your country, checked by a qualified engineer.
