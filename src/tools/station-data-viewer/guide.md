---
name: Weather station data viewer
num: 897
shelf: science
section: meteorology
title: "Weather station data viewer: wind rose, daily and monthly summaries, gaps and charts from a CSV"
summary: "Open a weather station or data logger CSV with time, temperature, humidity, pressure, wind speed and direction, and rain. Get the recording step, a gaps report, a chart of each variable, a 16-sector wind rose with speed classes and calms, and daily and monthly min, mean, max and rain totals, all as CSV."
status: live
ads: false
order: 897
icon: chart
works: offline
updated: 2026-11-09
related: [wind-chill-heat-index, density-altitude, walter-lieth, psychrometric-calculator, weather-log, rain-gauge-average, et0-calculator, trend-analyser, data-cleaner]
sources:
  - "Methods (written by fibub): calendar-day and calendar-month summaries, gaps from the most common time step, wind rose with sectors centred on north and calms counted apart, vector-mean wind direction."
  - "Checked 2026-11-09 against pandas 3.1 (resample, diff) and the windrose Python package (sector and speed-class binning)."
  - "The example data are made up by fibub; they are not from a real station."
flow:
  - { icon: file, label: "Open CSV" }
  - { icon: search, label: "Gaps" }
  - { icon: compass, label: "Wind rose" }
  - { icon: table, label: "Summaries" }
---

## What it does

Home weather stations, school stations, farm sensors and research data loggers all save the same kind of file: one line per reading, with the time and a few measurements. This page turns that file into the things you usually want to know:

- **Overview**: how many records, from when to when, the usual **time step** (for example 10 minutes or 1 hour), how complete the record is, and how many values are blank.
- **Gaps report**: every place where the next record comes more than 1.5 steps after the one before, with how long the gap is and how many records are missing. Download it as CSV.
- **Charts** of temperature, humidity, pressure and wind speed against time, and the running rain total. Lines break at gaps, so a logger outage is not drawn as a straight line.
- **Wind rose**: 16 (or 8 or 36) direction sectors centred on north, stacked by speed class. Calms (speeds below the limit you set) have no direction and are shown as the percentage in the centre. The table and CSV give the share of every sector and class.
- **Daily and monthly summaries**: records, completeness, the minimum, mean and maximum temperature, humidity and pressure, mean and highest wind speed, the vector-mean wind direction and the rain total.

The file never leaves your device: it is read and worked on in your browser.

Keep your daily notes alongside it in the [[weather-log]], and draw a yearly climate chart with the [[walter-lieth]] tool.

## How to use it

1. **Open a file** (CSV, TSV, TXT or Excel), drop it on the box, or paste the table. The first row must hold the column names.
2. Check the **Columns**. The page guesses them from names such as "Time", "Temp", "RH", "Pressure", "Wind speed", "Wind dir" and "Rain"; it skips gusts and dew points. If your file has a date column and a separate time column, choose both.
3. Set how **dates are written** (year first, day first or month first) and the **units**. Units only label the results; nothing is converted.
4. If the rain column is a **running total** (as many loggers keep), choose that: each record's rain becomes the rise since the one before, and a drop counts as a counter reset.
5. For the wind rose, set the number of sectors, the **calm limit** and the **speed classes**.
6. Download the summaries, gaps or wind rose as CSV, the wind rose as SVG, or everything as an image, PDF or Word report.

## Worked example

Press **Use the example** for two months of made-up hourly data starting 2026-03-01. The page finds:

- **1,428 records** with a usual step of **1 h**, from 2026-03-01 00:00 to 2026-04-30 23:00.
- **One gap** of 37 h, from 2026-03-20 23:00 to 2026-03-22 12:00, with **36 records missing**, and **6 blank** temperatures.
- On 2026-03-01: temperature 0.3 to 9.1 °C, mean 4.8 °C, rain 4.7 mm.
- March: mean 7.9 °C, rain 114.4 mm, 95 % complete. April: mean 11.4 °C, rain 127.6 mm.
- Wind rose: **6.2 % calm**, and the most common direction **W** (19.3 % of records).

## Tips

- Means are of the records present. On a day with a gap, the mean can lean towards the hours that are there: check the Complete column.
- Wind direction 360 is read as north; a direction outside 0 to 360 is dropped.
- Times are used as written. A file that jumps an hour for daylight saving shows a gap or a repeated time; repeated times keep the first record.

## FAQ

**Why are calms not in any sector?** A calm has no meaningful direction, so wind roses count calms apart. The wedge sizes and the calm percentage add up to 100 %.

**Which sector does 11.25° go in?** The one clockwise of the boundary (NNE), the same as the windrose Python package.

**How big a file can it take?** Up to 20 MB and 200,000 rows, such as several years of 10-minute data.
