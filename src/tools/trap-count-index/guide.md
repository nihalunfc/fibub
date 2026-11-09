---
name: Trap count index
num: 320
shelf: science
section: entomology
title: "Insect trap count calculator: catch per trap per day, flight peaks and thresholds (free)"
summary: "Paste insect trap checks (date, site, traps, count) and get catch per trap per day, a moving average, flight peaks, site and week comparisons and flags at a threshold you set. Runs in your browser."
status: live
ads: true
order: 320
icon: chart
works: offline
updated: 2026-11-09
related: [biodiversity-indices, field-sampling-planner, trend-analyser, plot-maker]
sources:
  - "Catch per unit effort (catch per trap per day) and centred moving averages: standard monitoring arithmetic, as described in general entomology and pest-monitoring texts."
  - "ISO 8601 week numbers."
  - "Checked against an independent pandas implementation (date gaps, rolling centred means, ISO weeks) on the page's example."
flow:
  - { icon: table, label: "Paste checks" }
  - { icon: calculator, label: "Per trap-day" }
  - { icon: chart, label: "Peaks" }
  - { icon: flag, label: "Flags" }
---

## What it does

Pheromone traps, light traps, sticky cards and pitfall traps are checked again and again through a season, but raw counts are hard to compare: a trap left out for ten days catches more than one left out for seven, and a site with four traps catches more than a site with two. This tool turns trap checks into a **population index**, the catch per trap per day (or per night, or per week), so every check, site and week can be compared fairly. It smooths the series, finds the flight peaks, compares sites and weeks side by side, and flags checks at or above a level you choose. Everything is worked out in your browser.

## How to use it

1. Paste one row per check: **date, site, traps, count**, and optionally **days** the traps were out. With a header row naming the columns they can be in any order. Three columns (date, traps, count) are read as one site. You can also open a CSV or Excel file.
2. Pick the **index** unit and the other options below. The page updates as you type.
3. Download the checks or the week table as CSV, or the full report as an image, PDF or Word file.

## What each option does

- **Index**: catch ÷ (traps × days). "Per trap per night" is the same number with a different label, for light traps; "per trap per week" multiplies by 7.
- **Days before the first check**: when there is no days column, the days for each check are the gap since that site's previous check, and the first check uses this number.
- **Moving average**: the mean of the index over 3 or 5 checks centred on each check, which evens out weather and counting noise.
- **Flag at or above**: checks whose index reaches this level are flagged. The 5 on the page is only an example; use the action threshold for your pest and crop from your local advisory service, and check the official source.
- **Peak must reach**: a flight peak is a check where the smoothed index is higher than the check before, at least as high as the check after, and at least this share of the site's highest smoothed value. Raise it to ignore small bumps.

## Worked example

The made-up example has 14 weekly checks in two orchards, three traps in North (two in mid-June after one was lost) and two in South. The season index is **3.98 insects per trap per day in North and 2.89 in South**. North's highest check is 9.67 on 29 June, and the 3-check moving average shows two flights, peaking on 25 May and 29 June; South's flights peak on 26 May and 14 July. With the example flag level of 5, North is first flagged on 25 May and South on 26 May, with four flagged checks each. The mid-June North check caught 62 insects in 2 traps over 7 days, an index of 4.43; without the correction for the lost trap it would look like a drop.

## Tips

- Count every check, including zeros: a missing zero makes the next gap longer and lowers that check's index.
- Use the same trap type and lure across sites, or the index compares lures rather than populations.
- The week table pools all checks dated in the same ISO week, which helps when sites are checked on different days.

## Frequently asked questions

**Why is the season index different from the mean of checks?** The season index pools all insects over all trap-days, so long checks and checks with more traps weigh more. The mean of checks treats every check equally.

**Can I use it for several species?** Run each species separately, or put the species in the site name (for example "North, moth A").

**Is my data sent anywhere?** No. It stays in your browser, and the page works offline once loaded.
