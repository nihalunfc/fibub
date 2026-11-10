---
name: Solar cycle fitter
num: 215
shelf: science
code: T214
section: solar-physics
title: "Solar cycle fitter: 13-month smoothing, cycle minima and maxima, shape fits and a forecast from your own sunspot numbers"
summary: "Paste or open monthly sunspot numbers and get the 13-month running mean, every cycle's minimum and maximum, its length, rise time and size, a shape function fitted to each cycle by least squares, and the current cycle carried on with an uncertainty band. CSV and report downloads; your numbers stay in your browser."
status: live
ads: false
order: 215
icon: curve
works: offline
updated: 2026-11-09
related: [sunspot-counter, period-finder, time-series-analyser, curve-fitter, sun-position-calculator]
sources:
  - "The 13-month running mean, the minimum and maximum finder, the least-squares shape fits, the Monte Carlo band and the file reader are written by fibub and checked in the tests against NumPy and SciPy (convolve, argrelmin, curve_fit, an independent random-draw band)."
  - "The shape a(t − t0)³ / (exp((t − t0)²/b²) − c) is a general asymmetric cycle profile used in solar cycle studies (Hathaway, Wilson and Reichmann, 1994); only the formula is used. The default c = 0.7 is a rounded value you can change."
  - "The example series is made up by the page (six invented cycles added together, plus random noise). It is not real sunspot data."
  - "Numbers you paste or open are read on the page only. They are never uploaded or stored."
flow:
  - { icon: table, label: "Months" }
  - { icon: curve, label: "Smooth" }
  - { icon: sigma, label: "Fit cycles" }
  - { icon: chart, label: "Forecast" }
---

## What it does

The Sun's activity rises and falls in a cycle of about eleven years, and sunspot counts are the longest record of it. This page takes a monthly series, such as the counts you keep yourself, an index from a club, or a public record you have downloaded, and does the standard analysis in your browser:

- **13-month running mean.** Monthly counts jump about a lot, so cycles are timed on the classic smoothed curve: R̄ₙ = (Rₙ₋₆ + 2(Rₙ₋₅ + … + Rₙ₊₅) + Rₙ₊₆) / 24. The two end months get half weight, so the mean covers exactly one year centred on the month. The first and last six months have no smoothed value.
- **Minima and maxima.** A cycle minimum is the lowest smoothed month within half the *shortest time between minima* on each side (7 years by default, so a minimum is the lowest point in about 3.5 years either way). Each maximum is the highest smoothed month between two minima.
- **Cycle facts.** For every cycle: the start (minimum), the maximum, the rise time from minimum to maximum, the length from one minimum to the next, and the peak height (amplitude).
- **Shape fits.** Each complete cycle is fitted by least squares with f(t) = a (t − t₀)³ / (exp((t − t₀)²/b²) − c), zero before t₀. It rises steeply and falls slowly, like real cycles. a sets the size, b the rise time in years, t₀ the start, and c how lopsided it is.
- **The current cycle carried on.** The cycle in progress is fitted the same way, and the curve is drawn forward with a band showing where it could go, from the scatter of the parameters.

To count spots on your own photo of the Sun first, use the [[sunspot-counter]]; to look for other periods in a series, the [[period-finder]] or the [[time-series-analyser]].

## How to use it

1. **Months.** Paste one month per line: `2024-03, 120.5`, `2024 3 120.5`, a decimal year (`2024.208 120.5`), or lines of `year;month;decimal year;value;…` as many public files use. Or tap *Open a file* for a CSV, TXT or Excel file. Missing months can be left out or given as blank, NaN or −1.
2. **Settings.** Check the *shortest time between minima*: lower it if a minimum is missed, raise it if a dip inside a cycle is taken as a minimum. Set the number of the first full cycle if you want the usual numbering.
3. **Fits.** Choose whether each cycle is fitted to the monthly values (the default; every month counts the same) or to the 13-month mean.
4. **Forecast.** *Shape from past cycles* keeps b at the mean of the complete cycles and fits only a and t₀, which works early in a cycle. *Free fit* fits all three and needs at least two years since the minimum. *Automatic* picks the past shape when two or more cycles have been fitted.
5. Read the chart, the facts and the table, and download the months or the cycles as CSV, or the whole report as PNG, PDF or Word.

## Worked example

The page opens with a **made-up** series, January 1976 to October 2026, built from six invented cycles plus noise. It is not real sunspot data. With the default settings the page finds minima in 1978-02, 1988-12, 2000-02, 2011-06 and 2022-11, so four cycles are complete. They are 10.83, 11.17, 11.33 and 11.42 years long (mean 11.2 ± 0.3 years), and their smoothed peaks are 132.0, 168.5, 121.2 and 95.2, reached 3.58, 3.92, 4.58 and 4.17 years after each minimum. The fitted shapes peak at 133.1, 172.5, 112.1 and 93.5, within 4 % of the heights the series was built with (135, 170, 115 and 90).

The fifth cycle started in 2022-11 (smoothed minimum 2.6). With the shape from past cycles (b = 3.82 years), its fitted peak is **120.3 in 2026-12**, with a 95 % band of 110.0 to 134.6 for the height and 2026-06 to 2027-06 for the time. The next minimum is due about 2034-01. Switch to the free fit and the peak height becomes 118.5 in 2026-10, but its band runs from 73.4 to 125.6: the band is much wider, because b is no longer pinned by the earlier cycles and the cycle is only just at its peak.

## Tips

- Use a long series: each cycle needs about 3.5 years of data on both sides of its minimum before it is found.
- A forecast made early in a cycle is uncertain. Watch the band shrink as months are added.
- Raw counts from one observer drift with seeing and equipment. Compare like with like, and read the shape, not single months.
- The band comes from the fit only. It does not cover a sudden change in the Sun's behaviour, so treat it as a guide.

## FAQ

**Why does the 13-month mean stop six months before my last month?** It needs six months on each side. The last smoothed month is always half a year behind the data, which is why the current cycle's peak is only confirmed months later.

**What is c, and why 0.7?** c changes how lopsided the shape is: 0 gives a nearly symmetric hump, values near 1 a sharper rise and a longer tail. It is held fixed so that a, b and t₀ can be fitted well; 0.7 is a rounded value that suits typical cycles. Try other values and compare the RMS in the table.

**Can I use other activity indices?** Yes. Any monthly index that follows the cycle works, such as sunspot areas or a radio flux. Change *What the numbers are* so the charts are labelled correctly.

**Is the next minimum predicted?** Only roughly: the page adds the mean cycle length to the current cycle's start and shows the spread between cycles.
