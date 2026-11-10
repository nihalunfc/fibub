---
title: "Forecasting sunspot numbers for solar cycles 25 and 26 with Prophet"
summary: "A 2026 Scientific Reports paper uses the Prophet time-series model on 276 years of sunspot counts to forecast cycles 25 and 26. Compare its forecast with the record yourself."
tools: [solar-cycle-fitter, period-finder, sunspot-counter]
updated: 2026-11-10
sources:
  - "Abdel Rahman, H. I. and Badawy, W. A. (2026), Forecasting the number of sunspots for solar cycle 25 utilizing the facebook prophet model, Scientific Reports 16, 2066, published 15 January 2026. CC BY 4.0, checked on the publisher's page, 2026-11-10."
  - "Solar cycle 25 maximum: SILSO, Royal Observatory of Belgium, as reported by the Solar-Terrestrial Centre of Excellence (13-month smoothed sunspot number 161 in October 2024), checked 2026-11-10."
paper:
  title: "Forecasting the number of sunspots for solar cycle 25 utilizing the facebook prophet model"
  authors: "Abdel Rahman HI, Badawy WA"
  journal: "Scientific Reports"
  year: 2026
  doi: "10.1038/s41598-025-33819-5"
  url: "https://www.nature.com/articles/s41598-025-33819-5"
  licence: "CC BY 4.0"
  reviewed: true
---

How strong will the next solar cycle be, and when will it peak? A January 2026 paper in *Scientific Reports* by H. I. Abdel Rahman and W. A. Badawy tries a general-purpose forecasting tool, Prophet, on the sunspot record that runs from 1749 to 2025. It forecasts the rest of cycle 25 and the start of cycle 26. Sunspot forecasts are easy to check against the record, and the [[solar-cycle-fitter]] does the standard analysis on any monthly series you paste in. The [[period-finder]] looks for the cycle length in the same numbers. The paper is open access under CC BY 4.0.

## What they found

The model places the cycle 25 peak in early 2025, at a smoothed sunspot number of about 115 in the main text (the abstract gives about 118). For cycle 26 it forecasts a peak of about 118 around mid-2034, with a range of roughly 105 to 131. The authors report that the model explains about 89 % of the variation in the historical monthly series, with a root-mean-square error of about 53 sunspots.

That forecast can be compared with what the Sun actually did. The World Data Center for sunspots, SILSO in Brussels, reports that cycle 25's 13-month smoothed maximum was about 161, in October 2024. So the paper's cycle 25 peak is lower and later than the record. The authors themselves note that their peak sits below other estimates.

## Why it matters

Solar maximum brings more flares and storms that affect satellites, radio and power grids, so agencies plan around forecasts years ahead. Physics-based forecasts use the Sun's magnetic field at the previous minimum. Purely statistical ones, like this, learn the shape of past cycles. Testing an off-the-shelf method on a 276-year series shows both its reach and its limits. A forecast that misses a peak already in the record is a useful warning for the next one.

## How they did it

The data are the version 2.0 monthly mean sunspot numbers from SILSO, January 1749 to March 2025: 3,315 months. Prophet, developed for business data, breaks a series into a slowly changing trend plus repeating patterns. The authors added an 11-year repeating term on top of the usual yearly one. They also treated the 67 months with no sunspots at all as special days, the way Prophet handles holidays. That term lowered the error by about 4 %. They timed the cycle maxima and minima on the 13-month smoothed series, the same convention the fibub tool uses.

## Check it yourself with fibub

**Step 1: the 13-month mean by hand.** Take 13 made-up monthly counts: 140, 150, 165, 130, 160, 175, 155, 170, 180, 145, 160, 150 and 136. The smoothed value for the middle month gives the first and last months half weight: (140 + 136 + 2 × 1740) ÷ 24 = **156.5**, where 1740 is the sum of the 11 inner months. A plain average of all 13 would give 155.1. Paste these 13 lines into the [[solar-cycle-fitter]] (one month and value per line, such as `2024-01, 140`). Thirteen months are far too few for the page to find a cycle, but this is the same sum it runs on every month of a long series, which is why the smoothed curve always stops six months short of your data.

**Step 2: when does a cycle peak?** The tool fits each cycle with the shape a (t − t₀)³ / (exp((t − t₀)²/b²) − c), with c fixed at 0.7 by default. For that c, the curve peaks 1.084 × b years after the start t₀. A made-up cycle with b = 4 years therefore peaks 4.34 years after its minimum, and one with b = 3.5 years after 3.80 years. Faster rises go with taller cycles in many past cycles, so b is worth comparing between cycles.

**Step 3: test the forecast.** Download the monthly sunspot numbers from SILSO yourself and open the file with **Open a file** in the solar cycle fitter. It reads the `year;month;decimal year;value` lines SILSO uses. Set *Number of the first full cycle* so the numbering matches, and read cycle 25's maximum and its date from the table. Then cut the series off at an earlier month, say early 2022. Choose *Shape from past cycles* and see where the forecast band puts the peak, and how far it is from what came next. Repeat with the free fit. This is the same test any forecast should face.

**Step 4: the cycle length.** Paste the same series into the [[period-finder]]. The strongest peak should land near 11 years, with weaker ones at other periods. The paper's 11-year term is built on that peak. To make your own counts, the [[sunspot-counter]] turns a white-light photo of the Sun into a relative sunspot number.

## The fine print

- **Purely statistical.** The model assumes the future repeats the past and knows nothing about the Sun's magnetic field, as the authors say.
- **Wide bands.** At long range the stated 95 % intervals are about ±100 sunspots, nearly as large as a whole cycle.
- **A yearly term with no solar cause.** The 12-month pattern is a model setting, not something the Sun is known to do.
- **Some inconsistencies.** The paper gives slightly different cycle 25 and 26 peak values and years in different places; the numbers above are the main ones it states.
- **Benchmarks are forecasts too.** Part of the error is measured against official forecasts rather than observations. All worked numbers in this article are made up, apart from the paper's and SILSO's headline values.
