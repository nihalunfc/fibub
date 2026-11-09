---
name: Weather observer's log
num: 899
shelf: science
section: meteorology
title: "Weather log for home observers: daily max/min temperature, rain, snow, wind, pressure and cloud, with monthly summaries and records"
summary: "Keep a daily weather diary in your browser: maximum and minimum temperature, rain, snow, wind, pressure, cloud and notes. See each month's averages, totals, rain days and frost days, charts, and your all-time records, and import or export it all as CSV. Your log never leaves this device."
status: live
ads: false
order: 899
icon: calendar
works: offline
updated: 2026-11-09
related: [station-data-viewer, rain-gauge-average, wind-chill-heat-index, walter-lieth, psychrometric-calculator, observing-log, koppen-climate]
sources:
  - "Methods (written by fibub): calendar-month means, totals and counts of the days logged; daily mean as (max + min) ÷ 2; rain days at or above a threshold you choose; frost days with a minimum below freezing; cloud in oktas (eighths of the sky)."
  - "Checked 2026-11-09 against pandas (monthly groupby means, sums, counts and records with ties) on 630 random days with gaps."
  - "The example log is made up by fibub; it is not from a real station."
flow:
  - { icon: pencil, label: "Log a day" }
  - { icon: table, label: "Months" }
  - { icon: chart, label: "Charts" }
  - { icon: star, label: "Records" }
---

## What it does

Many people read a thermometer and a rain gauge every morning: gardeners, farmers, schools, weather clubs and volunteer observers. This page is a simple **daily weather diary** that does the sums for you:

- **Log a day**: maximum and minimum temperature, rain, new snow, wind speed and direction, sea-level pressure, cloud cover in oktas (eighths of the sky) and a note. Leave out anything you did not measure.
- **Days**: the days of any month (or all of them) in a table, with **charts** of the daily maximum and minimum and of the daily rain, and quick totals: mean maximum and minimum, highest and lowest, rain and rain days, snow and frost days. Each day can be edited or deleted (with Undo).
- **Monthly summary**: one row per month with mean max, mean min, mean, extremes, rain total, rain days, snow, frost days, mean wind and most common direction, mean pressure and mean cloud. Download it as CSV.
- **Records**: your highest and lowest maximum and minimum, wettest day, most snow, windiest day, and highest and lowest pressure, with every date it happened.
- **Import and export**: download the whole log as CSV for a backup or a spreadsheet; paste or open a CSV to add days or to move your log to another device.

**Privacy**: nothing is kept until you tick **Remember my log in this browser**. Ticked, your log stays only in this browser's storage (localStorage), so it is there when you come back; untick it to remove the saved copy. It is never sent anywhere. **Delete my log** removes it, as does clearing your browser data. Keep a CSV backup.

Read a station's own readings with the [[station-data-viewer]], and average rainfall over an area with the [[rain-gauge-average]] tool.

## How to use it

1. Choose your **units** (°C or °F, mm or inches, km/h, mph, m/s or knots, hPa or inHg). Changing a unit later converts every saved day.
2. Each day, pick the **date**, fill in what you measured, and press **Save day**. Saving a date that is already in the log replaces it. After saving, the form moves on to the next day.
3. Pick a month under **Days** to see it, or **All days**.
4. Use **Download my log (CSV)** now and then. To bring days in from a spreadsheet, paste or open the CSV and press **Add to my log** (or **Replace my log**).

To look around first, press **Load a made-up example**: three invented months, August to October 2026. Delete it when you start your own log.

## Worked example

The example log covers 1 August to 31 October 2026, with two days missed in September (90 days). Picking **October 2026** shows 31 days logged, a mean maximum and minimum of **11.0 / 3.2 °C** (mean 7.1 °C), a highest of **16.7 °C** and a lowest of **−2.5 °C**, **45.2 mm** of rain on **7 rain days** (1 mm or more) and **5 frost days**. In the monthly summary, September was the wettest month (103.9 mm on 11 rain days). The records table shows the highest maximum, **27.6 °C on 2026-08-08**, the lowest minimum, **−2.5 °C on 2026-10-29**, and the windiest day, **33 km/h**, which happened on three dates, so all three are listed.

## Tips

- Read your instruments at the same time each day, for example 09:00, and log the maximum and minimum for the 24 hours before.
- A day with "a trace" of rain can be typed as 0 or as **tr** in an imported CSV; it then does not count as a rain day.
- Wind direction is where the wind blows **from**. In a CSV it can be a compass point (NE) or degrees (45).

## FAQ

**Can other people see my log?** No. Nothing is uploaded; it lives only in this browser on this device.

**I changed browser and my log is gone.** Each browser keeps its own storage. Download the CSV in the old one and import it in the new one.

**Why are my monthly averages different from the weather service's?** Normals use complete months over 30 years and fixed observing rules; your summary uses the days you logged.
