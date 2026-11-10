---
name: Time series
num: 566
shelf: science
section: statistics
title: "Time series"
summary: "Paste a series and split it into trend, season and remainder (STL or classical), see the ACF and PACF with confidence bands, try differencing, and fit an ARIMA(p, d, q) model by exact maximum likelihood with forecasts, 80 % and 95 % intervals and a Ljung-Box check. Matches statsmodels."
status: live
ads: false
order: 566
icon: curve
works: offline
updated: 2026-11-09
related: [trend-analyser, distribution-explorer, regression-workbench, plot-maker, period-finder, fft-workbench, unit-root-cointegration, control-charts, data-cleaner, csv-profiler]
sources:
  - "Methods: STL as in Cleveland, Cleveland, McRae and Terpenning (1990), ported line by line from their published Fortran; classical decomposition as statsmodels' seasonal_decompose; Bartlett's formula for the ACF band; Durbin–Levinson for the PACF; the Ljung–Box test; exact ARMA likelihood by the Kalman filter."
  - "Checked against statsmodels 0.15.0 (seasonal_decompose, STL, acf, pacf, acorr_ljungbox, ARIMA and SARIMAX fits, log-likelihoods and forecasts) on all three example series."
  - "The example series (shop sales, museum visitors, sensor readings) are made up for this tool."
flow:
  - { icon: pencil, label: "Paste series" }
  - { icon: chart, label: "Decompose" }
  - { icon: sliders, label: "ACF, PACF" }
  - { icon: curve, label: "Forecast" }
---

## What it does

A time series is a set of measurements in time order: monthly sales, daily visitors, hourly temperatures. This tool takes one apart and builds a forecast, in four steps you can follow on one page:

- **Decomposition** splits the series into a **trend** (the slow change), a **season** (the pattern that repeats every cycle) and a **remainder**. Choose **STL**, which lets the seasonal pattern drift slowly and can be made robust to outliers, or the **classical** moving-average method, additive or multiplicative. It also reports the strength of the trend and of the season (0 = none, 1 = everything).
- **Autocorrelation**: the ACF and PACF with their 95 % bands, after any differencing you choose, and the **Ljung–Box test** of whether the values are related to earlier ones at all.
- **ARIMA(p, d, q)**: fitted by exact maximum likelihood, with standard errors, AIC, AICc and BIC. A button tries every p and q from 0 to 3 and keeps the lowest AICc.
- **Forecasts** with 80 % and 95 % intervals, a residual ACF and a Ljung–Box check of the residuals.

Find gaps and odd values first in the [[csv-profiler]], and look for hidden cycles with the [[period-finder]] or the [[fft-workbench]].

## How to use it

1. Paste your values (one per line) or two columns: time and value. Open a CSV or Excel file if you prefer. The values must be evenly spaced with no gaps.
2. Set the **season length**: 12 for monthly data, 4 for quarterly, 7 for daily data with a weekly rhythm, or 0 for none.
3. Read the decomposition. The **seasonal window** of STL is an odd number of cycles; larger keeps the season steadier.
4. In the autocorrelation step, add differences until the ACF dies away quickly. That number is usually the **d** of the ARIMA model. A PACF that cuts off after lag p suggests AR(p); an ACF that cuts off after lag q suggests MA(q).
5. Choose p, d and q, or press **Find the best p and q**. Check that the residual ACF stays inside the band, then read the forecast.

## Worked example

The first example is eight years of made-up monthly shop sales. STL gives a strength of trend of **0.984** and of season of **0.922**: both strong. The seasonal pattern peaks in June (+10.8) and is lowest in October (−19.6). After one difference the Ljung–Box test at lag 19 gives Q = 151.5 and p = 1.15 × 10⁻²², and the ACF has spikes at lags 12 and 24, because the season is still there. ARIMA(1,1,1) gives ar.L1 = 0.27482 (SE 0.1807), ma.L1 = 0.13657 and σ² = 53.982, and the first forecast, for 2025-01, is 209.36 with an 80 % interval of 199.95 to 218.78. That simple model ignores the season, so its residuals stay autocorrelated (Ljung–Box p = 0.0053): a hint to decompose first.

The third example (made-up sensor readings with no season) is close to an ARMA process. ARIMA(2,0,1) with a mean gives ar.L1 = 0.4394, ar.L2 = −0.2201, ma.L1 = 0.6448 and AICc = 433.28, and the residual Ljung–Box p-value is 0.372: nothing left to explain.

## What it does not do

It fits non-seasonal ARIMA only (no SARIMA, no outside regressors) and up to 1,000 values. Classical decomposition leaves the first and last half-cycle without a trend, as it should. For a test of whether a trend is real, with Sen's slope and change points, use the [trend analyser](/science/trend-analyser/). For uneven sampling, use the [period finder](/science/period-finder/).

## Frequently asked questions

**Additive or multiplicative?** If the seasonal swings grow as the level grows, use multiplicative (or take logs first). Otherwise additive.

**Why did ARIMA warn about the MA part?** An MA coefficient near −1 usually means the series was differenced once too often. Try a smaller d.

**Is my data sent anywhere?** No. Everything is worked out in your browser.
