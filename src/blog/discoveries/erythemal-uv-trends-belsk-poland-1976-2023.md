---
title: "Erythemal UV trends at Belsk, Poland, 1976 to 2023: ozone, aerosols and clouds"
summary: "A 2025 ACP study rebuilt 48 years of sunburning UV measurements in central Poland and split the rise between ozone, aerosols and clouds. See how ozone moves the UV index yourself."
tools: [uv-index-estimator, trend-analyser]
updated: 2026-11-10
sources:
  - "Czerwińska A, Krzyścin J, Jarosławski J, Sobolewski PS, Pietruczuk A (2025), Atmospheric Chemistry and Physics 25: 12497-12512, CC BY 4.0, the paper described here."
  - "Clear-sky UV index formula used by the tool: Madronich S (2007), Photochemistry and Photobiology 83: 1537-1538."
  - "UV index 1 = 25 mW/m² of erythemally weighted irradiance; 1 SED = 100 J/m²: WHO/WMO/UNEP and CIE definitions."
  - "The place, ozone values and the 20-year exposure series in the worked example are made up by fibub."
paper:
  title: "Trends in the erythemal radiant exposure from re-evaluated measurements (1976–2023) with biometers in Belsk, Poland, and their sources from corresponding ozone, aerosol, and cloud observations"
  authors: "Czerwińska A, Krzyścin J, Jarosławski J, Sobolewski PS, Pietruczuk A"
  journal: "Atmospheric Chemistry and Physics"
  year: 2025
  doi: "10.5194/acp-25-12497-2025"
  url: "https://acp.copernicus.org/articles/25/12497/2025/"
  licence: "CC BY 4.0"
  reviewed: true
---

How much more sunburning ultraviolet light reaches the ground in Europe now than fifty years ago, and why? At Belsk, a rural geophysical observatory in central Poland, broadband UV meters have run almost without a break since the mid-1970s. A team of atmospheric scientists went back over the whole record, corrected it for changes of instrument, and split the rise into the parts caused by ozone, aerosols and clouds. Daily erythemal exposure grew fastest before 2000, while ozone was thinning; after that only the summer kept rising, and clouds took over as the driver. This page explains the study in plain words and shows how to see the ozone effect yourself with the [[uv-index-estimator|UV index estimator]], then test a series of yearly totals with the [[trend-analyser]].

## What they found

- **Erythemal radiant exposure** (ERE) is the day's total of UV weighted by how strongly each wavelength reddens skin. At Belsk, yearly ERE rose by about 7 % per decade from 1976 to 1999, a significant trend. (The paper's abstract and main text give slightly different values for this period, so check its tables before quoting a number.)
- From 2000 to 2023 only the **summer** trend was significant, about 3.1 % per decade.
- The 2014–2023 average was about 14 % above the 1976–1985 average for the whole year, and more in April and June.
- Under clear skies, a **1 % drop in total ozone** raised warm-season exposure by roughly 1 %. Aerosols mattered about ten times less.
- Clear-sky effects levelled off after the mid-1990s, as ozone stopped falling. Cloud effects levelled off after 2005, then pushed UV up again after about 2015, as sunshine increased.

## Why it matters

The ozone layer is slowly recovering under the Montreal Protocol, so one might expect UV to fall. This record says that, in central Europe, fewer clouds can more than make up for it. That matters for skin cancer prevention, for UV forecasts, and for crops and materials that age in sunlight. Long, carefully checked series like Belsk's are rare, which makes each one valuable for testing satellite and model estimates.

## How they did it

Over five decades the station used three generations of broadband meter. The team recalibrated the older records against clear-sky noon values from a radiative transfer model, with help from a Brewer spectrophotometer, so the whole series could be compared fairly. Ozone came from a Dobson instrument at the site, aerosol optical depth from older turbidity readings and later from a sun photometer network, and cloudiness from sunshine recorders and global solar radiation. They fitted straight-line trends, tested where a change of slope fitted best, ran the model with one factor changed at a time to see what each one contributed, and built a machine-learning model of all-sky exposure.

## Check it yourself with fibub

The UV index estimator works out the clear-sky UV index from the Sun's height and the ozone column, with Madronich's formula. It cannot see real clouds, so it shows the clear-sky part of the story. The place and values below are **made up by fibub** for a teaching example, not the paper's data.

1. **Set an imaginary site.** Type latitude 52, longitude 21, height 0 m, date 21 June 2026, and **Clock is UTC +** 2. Under **Ground**, choose *Grass or soil (about 0.03)*; the paper used the same low albedo for a snow-free grass surface. Leave **Cloud factor** at 1.
2. **Start with 340 DU of ozone.** Solar noon falls at about 12:38, with the Sun 28.6° from overhead. The peak UV index is about **7.6** (High), the index is 3 or more from about 08:38 to 16:38, and the whole-day dose is about **49 SED**, or about 4.9 kJ/m².
3. **Thin the ozone by 5 %**, to 323 DU. The peak climbs to about **8.2** and the day's dose to about 52 SED. Both rise by about 6.5 %, so 1 % less ozone gives about 1.3 % more UV in this formula, set by its ozone power of −1.23 (shown under **Formula settings**). The paper's measured figure of about 1 % per 1 % is a little lower, a reminder that a formula fitted to models is not a measurement.
4. **Try April.** On 15 April at 340 DU the peak is only about 5.2 and the day's dose about 29 SED, because the Sun is lower. This is why spring ozone losses matter so much for UV.
5. **Test a trend.** Paste these made-up yearly exposures in kJ/m² for 2004 to 2023 into the trend analyser: 392, 410, 381, 405, 418, 389, 401, 430, 412, 398, 426, 415, 438, 409, 423, 445, 420, 434, 452, 429. Choose Mann-Kendall and report the slope per decade. S is 102, p is about 0.001, and Sen's slope is about **+24.7 kJ/m² per decade** (95 % interval about +12.5 to +35.1). Divide by the mean, about 416 kJ/m², for a trend of about **5.9 % per decade**, the unit the paper uses.
6. **Allow for persistence.** Sunny years can cluster. Try the Hamed-Rao option and see whether the trend stays significant.

## The fine print

- The record comes from one rural site; cities, mountains and coasts can behave differently.
- Older aerosol and cloud data came from different methods than recent ones, and part of the early cloud record was filled from reanalysis with a bias correction.
- Some months are missing or filled with long-term means.
- The model runs used fixed aerosol properties and surface albedo.
- The UV index estimator shows clear-sky values only. Check your local UV forecast, and follow your local health advice on sun protection.
