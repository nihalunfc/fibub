---
name: Trend analyser
num: 138
shelf: science
code: T138
section: climatology
title: "Trend analyser"
summary: "Paste or open a time series (yearly, monthly or any steps) and test for a trend with Mann-Kendall, the Hamed-Rao autocorrelation correction or the seasonal test, get Sen's slope with its confidence interval, a Pettitt change point and anomalies from a baseline period."
status: live
ads: true
order: 2
icon: chart
works: offline
updated: 2026-11-08
related: [koppen-climate, reliability-analysis, plot-maker, uncertainty-calculator]
sources:
  - "Mann-Kendall test with the tie correction: Mann (1945) and Kendall (1975), as described by Gilbert, R. O. (1987), Statistical Methods for Environmental Pollution Monitoring; Sen's slope: Sen (1968), with Gilbert's confidence interval and Conover's intercept."
  - "Autocorrelation correction: Hamed, K. H. and Rao, A. R. (1998), Journal of Hydrology 204, 182 to 196. Seasonal test: Hirsch, Slack and Smith (1982), Water Resources Research 18, 107 to 121. Change point: Pettitt, A. N. (1979), Applied Statistics 28, 126 to 135."
  - "Results checked against the open-source pyMannKendall package (MIT licence), used only for testing; no code or data copied."
  - "The example series is made up by fibub for illustration."
flow:
  - { icon: table, label: "Series" }
  - { icon: sigma, label: "Test" }
  - { icon: curve, label: "Slope" }
  - { icon: download, label: "Download" }
---

## What it does

Is a river's flow falling? Are summers getting warmer at your station? Did air pollution drop after a new rule? These are **trend** questions, and the usual tools in climate, hydrology and environmental science are the **Mann-Kendall test** and **Sen's slope**. Both use only the order of the values, not their exact size, so a few odd years or a skewed distribution do not throw them off, and they need no assumption that the trend is a straight line.

This tool runs the test, estimates how fast the values change with a confidence interval, looks for a single sudden **change point** (Pettitt test), and shows each value as an **anomaly** from a baseline period, like the warming stripes and bar charts in climate reports. Everything runs in your browser.

Classify the same station's climate with the [[koppen-climate|Köppen climate classifier]], and find how often extremes come with [[flood-frequency]].

## How to use it

1. **Paste or open your series:** a time column and a value column. Times can be years (1990), decimal years (1990.5), or dates such as 1990-07 or 1990-07-15. A single column of values works too. Gaps are fine; rows without a number are skipped.
2. **Choose the test:**
   - **Mann-Kendall** for independent values, such as annual totals.
   - **Hamed-Rao correction** when one year tends to resemble the next (persistence). It widens the uncertainty based on the autocorrelation of the detrended ranks. "First 3 lags" is the cautious version its authors suggested.
   - **Seasonal Mann-Kendall** for monthly data with a yearly cycle: each calendar month is compared only with the same month in other years.
3. **Significance level:** 5 % is usual. The slope's confidence interval uses the matching confidence (95 %).
4. **Unit and slope period:** for yearly time, per decade is the common way to report climate trends.
5. **Baseline:** the years whose mean defines zero for the anomalies (climate services use 30-year periods such as 1991–2020).

## What the results mean

- **S** counts how many later values are higher minus how many are lower. **Z** and the **p-value** say how unusual that would be with no trend. A p-value below your significance level means a significant trend.
- **Kendall's tau** scales S to between −1 and +1.
- **Sen's slope** is the median of the slopes between every pair of points. Its interval comes from the test's variance (Gilbert's method, interpolated between ranks).
- **Change point:** where the series splits into two parts with the most different levels. A significant change point and a significant trend can both describe the same data; look at the chart before deciding which story fits.

## Worked example

The made-up series has 50 annual temperatures from 1975 to 2024. Mann-Kendall gives S = 480, Var(S) = 14,288.7 (with ties), Z = 4.01 and p = 6.1 × 10⁻⁵: a significant rise. Sen's slope is **+0.152 °C per decade** (95 % interval +0.087 to +0.223), about +0.75 °C over the record. The series is persistent, so the Hamed-Rao correction multiplies Var(S) by 2.47 and the p-value rises to 0.011, still significant at 5 %. Pettitt places a change point between 2009 and 2010.

## FAQ

**How many values do I need?** At least 10 for a meaningful test; with fewer, the confidence interval cannot be computed.

**Does it handle ties?** Yes, equal values reduce the variance with the standard correction.

**Is it the same as a linear regression?** No. Regression fits a straight line by least squares and is sensitive to outliers. Sen's slope is a robust alternative and pairs naturally with Mann-Kendall.
