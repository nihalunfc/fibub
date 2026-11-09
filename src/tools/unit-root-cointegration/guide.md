---
name: Unit root and cointegration tests
num: 746
shelf: science
section: econometrics
title: "ADF, KPSS and Engle-Granger cointegration test calculator (free)"
summary: "Test a time series for a unit root with the augmented Dickey-Fuller test (lags by AIC or BIC) and KPSS, or test several series for cointegration with Engle-Granger. Critical values and p-values come from a seeded simulation in your browser."
status: live
ads: true
order: 746
icon: curve
works: offline
updated: 2026-11-09
related: [trend-analyser, plot-maker, data-cleaner, period-finder, regression-ols-iv-panel, time-series-analyser, difference-in-differences, inflation-calculator]
sources:
  - "Formulas: Dickey and Fuller (1979), Said and Dickey (1984), Kwiatkowski, Phillips, Schmidt and Shin (1992), Hobijn, Franses and Ooms (1998), Engle and Granger (1987). Critical values are simulated on the page; no published tables are used. Example data made up."
flow:
  - { icon: table, label: "Your series" }
  - { icon: sliders, label: "Pick test" }
  - { icon: sigma, label: "Simulate" }
  - { icon: check, label: "Verdict" }
---
## What it does

Before you regress one time series on another, you need to know whether each series is **stationary** (it keeps returning to a mean or trend) or has a **unit root** (it wanders, like a random walk). Regressing wandering series on each other gives "spurious" results unless they are **cointegrated**: tied together in the long run. This tool runs the three standard tests in your browser:

- **Augmented Dickey-Fuller (ADF)**: null hypothesis = unit root. The number of lagged changes is chosen by AIC or BIC, or fixed by you.
- **KPSS**: null hypothesis = stationary (around a level or a trend), the reverse of ADF. Using both gives a fuller picture.
- **Engle-Granger**: regress one series on one or more others, then run an ADF test on the residuals. Null hypothesis = no cointegration.

Look at each series' shape and seasons first in the [[time-series-analyser]], and once it is stationary, run the [[regression-ols-iv-panel|regression tool]].

## Critical values by simulation

These tests do not follow a t or normal distribution, so their critical values normally come from published tables. This tool does not use any table. Instead it **simulates** the test statistic many times under the null hypothesis, for your sample size and settings, and reads the critical values and the p-value from those draws:

- ADF: Gaussian random walks of the same length as your final ADF regression, with the same deterministic terms.
- KPSS: Gaussian white noise of your length, with the same detrending and number of lags.
- Engle-Granger: as many independent random walks as you have series, put through the same two steps.

The simulation is **seeded** (seed 1 by default), so the same data always give the same answer. Under "Simulation settings" you can change the seed or use more samples; the page shows the p-value's simulation error.

## How to use it

1. Paste your series, one column each with a header row and the oldest value first, or open a CSV or Excel file.
2. Pick **ADF**, **KPSS** or **Engle-Granger**, and the series.
3. **Deterministic terms**: use a constant for series that hover around a level, constant and trend for series that grow steadily.
4. **Lags**: AIC (default) or BIC choose the lag from 0 up to the largest lag (blank = 12 × (n/100)^¼); "Fixed" uses exactly the number you type.
5. Read the verdict, the critical-value table and the chart of the simulated distribution. Download a report or the results as CSV.

## Worked example (made-up data)

The sample has 120 months of three made-up prices. For **price_a**, ADF with a constant and AIC picks 0 lags and gives a statistic of −1.702 on 119 rows; with 10,000 simulated samples the p-value is 0.426, so a unit root cannot be rejected. **KPSS** on price_a is 1.708 with 6 lags, far beyond the simulated 1 % critical value of 0.635, so level stationarity is rejected: both tests agree that price_a wanders. For **price_b**, ADF gives −1.821 (p = 0.368).

**Engle-Granger** with price_b on price_a gives the cointegrating regression price_b = 10.06 + 0.7994·price_a and a residual ADF statistic of −3.808 with 2 lags. The simulated 5 % critical value is −3.408 and p = 0.016: the two prices are cointegrated.

## How it was checked

The test statistics, the chosen lags and the number of rows agree with statsmodels' adfuller, kpss and coint in 53 cases (all lag rules and deterministic terms) to at least nine significant figures. The simulated critical values were compared with statsmodels' values: for 117 rows with a constant, the simulation gives −3.48, −2.89 and −2.58 at 1 %, 5 % and 10 %, within simulation error of statsmodels' −3.49, −2.89 and −2.58. KPSS values match the asymptotic ones for long series; for short series with many lags the simulated ones are smaller, as they should be.

## Frequently asked questions

**ADF and KPSS disagree. What now?** That happens with short or borderline series. Look at the plot, try a trend, and report both results.

**Why does the p-value change a little with the seed?** It is estimated from random draws. More samples make it steadier; the page shows its margin of error.

**Is my data uploaded?** No. Everything runs in your browser and works offline.
