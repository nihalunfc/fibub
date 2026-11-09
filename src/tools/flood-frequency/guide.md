---
name: Flood frequency analysis
num: 142
shelf: science
section: hydrology-and-water-resources
title: "Flood frequency analysis: 100-year flood from annual peaks with GEV, log-Pearson III and Gumbel"
summary: "Fit GEV, log-Pearson type III and Gumbel distributions to a record of annual peak flows to estimate the 10-, 100- or any-year flood, with bootstrap ranges, the return period of a given flow, the chance of a flood over a span of years, plotting positions and a Grubbs-Beck outlier screen. Paste or open a file."
status: live
ads: true
order: 3
icon: chart
works: offline
updated: 2026-11-08
related: [runoff-calculator, manning-weir-calculator, trend-analyser, uncertainty-calculator]
sources:
  - "L-moments and the GEV fit by Hosking's (1985) approximation for the shape: Hosking, J. R. M. and Wallis, J. R. (1997), Regional Frequency Analysis: An Approach Based on L-Moments (equations only). Gumbel by moments and L-moments and the Kite standard error: standard hydrology texts such as Chow, Maidment and Mays (1988), Applied Hydrology."
  - "Log-Pearson type III by moments of the log flows, the station skew, and the Grubbs-Beck outlier screen with its approximate K_N equation: US Interagency Advisory Committee on Water Data, Bulletin 17B (1982), public domain. The newer Bulletin 17C (2019) method (expected moments and the multiple Grubbs-Beck test) is not reproduced."
  - "Plotting positions (Weibull, Gringorten, Cunnane) and the percentile bootstrap: standard statistics. The Pearson III frequency factors are computed exactly from the gamma distribution, not read from printed tables."
  - "Checked against SciPy (pearson3, gumbel_r, genextreme, gammainc) in the tests. The example record is made up, drawn at random by fibub."
flow:
  - { icon: table, label: "Peaks" }
  - { icon: curve, label: "Fit" }
  - { icon: chart, label: "Return years" }
  - { icon: target, label: "Design flood" }
---

## What it does

A "100-year flood" is the flow with a 1 % chance of being equalled or beaten in any year. It is estimated by fitting a probability distribution to the largest flow of each year at a river gauge, the **annual maximum series**, and reading off the flow for the return period you need.

This tool fits four common distributions side by side:

- **GEV** (generalised extreme value) by L-moments, used in the UK and many other countries.
- **Log-Pearson type III** on the logarithms of the flows, the long-standing US method, with the station skew or one you type (for example a regional skew).
- **Gumbel**, by L-moments and by ordinary moments, the simplest choice.

It shows the flood for any return period with a **bootstrap range**, the return period of a flow you give, and the chance of at least one such flood over a span of years.

To turn a flood flow into a water level, use the [[rating-curve]]; to test the record for a trend first, the [[trend-analyser]].

## How to use it

1. Paste a year and the year's **peak flow** per row, or open a CSV or text file. A single column of peaks also works. Use 10 to 1,000 years.
2. Type the **flow unit** for the labels.
3. Choose the **main distribution**. All four appear in the table and chart; the main one gets the range and the headline.
4. For log-Pearson III, leave the skew blank to use the record's own skew, or type a regional skew.
5. Type the **return period** you want, a **flow** to find its return period, and a **span of years** (such as a mortgage or a design life) for the chance of a flood in that time.

## What the results mean

- The **chart** has the recorded peaks at their plotting positions (the largest of n years plots at n + 1 years with Weibull) and the four fitted curves. Where the curves agree, the answer is fairly safe; where they spread apart, the choice of distribution matters.
- The **range** comes from 1,000 resampled records. A 40-year record cannot pin down a 500-year flood, and the range says so.
- **L-skewness τ3** describes the shape: about 0.17 for a Gumbel shape, higher for records with a few very large floods.
- The **Grubbs-Beck screen** flags peaks that look too large or too small for the rest; check them (a dam break, a gauge fault, a dry year) rather than deleting them blindly.
- The **chance in a span of years** is 1 − (1 − 1/T)^N: a 100-year flood has about a 26 % chance of happening at least once in 30 years.

## Worked example

The made-up record has 40 annual peaks from 1985 to 2024, averaging 484 m³/s, with a largest of 920 m³/s. L-skewness is 0.169, close to the Gumbel shape, so the GEV shape k is almost 0. The GEV gives a **100-year flood of about 1,016 m³/s**; log-Pearson III with the station skew (−0.05) gives 987 m³/s, Gumbel by L-moments 1,017 m³/s and by moments 996 m³/s. A flow of 800 m³/s has a return period of about 20 years (GEV) or 21 years (log-Pearson III). No outliers are flagged.

## FAQ

**Which distribution should I use?** Follow the guidance in your country: GEV or generalised logistic in the UK, log-Pearson III in the US, GEV or LP3 in Australia and Canada. If they disagree a lot, the record is too short to tell, and the range is the honest answer.

**Can I use daily flows?** No. Use one value per year, the largest. Taking several floods from one year breaks the independence the method assumes. Peaks-over-threshold analysis is a different method.

**Does it allow for climate change?** No. It assumes the floods come from an unchanging distribution. Check the record for a trend first (the Trend and anomaly analyser can help) and follow local guidance on climate allowances. For design, use the official method and a qualified engineer.
