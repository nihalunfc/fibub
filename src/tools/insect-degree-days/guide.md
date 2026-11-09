---
name: Insect degree-days
num: 319
shelf: science
section: entomology
title: "Degree-day calculator for insects: single sine and average, with upper cutoff (free)"
summary: "Paste daily minimum and maximum temperatures and get degree-days by the single sine or simple average method, with lower and upper thresholds, a running total from your biofix, and the date a degree-day target is reached. Runs in your browser."
status: live
ads: true
order: 319
icon: calendar
works: offline
updated: 2026-11-09
related: [et0-calculator, koppen-climate, plot-maker, trend-analyser, trap-count-index, embryo-development-timer, station-data-viewer]
sources:
  - "Single sine method: Baskerville, G. L. and Emin, P. (1969), Ecology 50: 514–517."
  - "Cutoff methods: Zalom, F. G. et al. (1983), Degree-days: the calculation and use of heat units in pest management, University of California Division of Agriculture and Natural Resources Leaflet 21373."
  - "Checked against an independent Python implementation that integrates the daily sine curve numerically (numpy, scipy)."
flow:
  - { icon: table, label: "Paste temps" }
  - { icon: sliders, label: "Thresholds" }
  - { icon: sigma, label: "Degree-days" }
  - { icon: calendar, label: "Target date" }
---

## What it does

Insects grow faster when it is warm and hardly at all when it is cold, so their development follows accumulated heat rather than the calendar. Degree-days measure that heat: each day adds the number of degrees by which it was warmer than the insect's lower developmental threshold. Growers, extension officers and students use running totals of degree-days to time trap checks, sprays and field visits for pests such as codling moth, and to compare one season with another.

This calculator takes a list of daily minimum and maximum temperatures and gives you the degree-days for each day, the running total from the day you choose (the biofix), and the date a degree-day target is reached. If the target has not been reached yet, it gives a rough projected date. Everything is worked out in your browser and nothing is sent anywhere.

Get daily temperatures from the [[station-data-viewer|weather station data viewer]], and line the forecast up with your catches in the [[trap-count-index|trap count index]].

## How to use it

1. Paste three columns: **date, minimum, maximum**. A header row is fine; rows that cannot be read are skipped and counted. You can also open a CSV or Excel file.
2. Pick the **temperature unit**. Switching it converts the thresholds for you.
3. Set the **lower threshold** and, if your insect has one, the **upper threshold**. Leave the upper box blank for none.
4. Pick the **method** and the **cutoff**, set the **biofix** date if counting starts later than your first row, and type your **degree-day target**.

## What each option does

- **Single sine** treats each day as one sine wave from the minimum to the maximum and back, and counts the area between that curve and the lower threshold, divided by the length of the day. It still counts some heat on days whose average is below the threshold but whose maximum is above it, which is why it is the method most pest models use.
- **Simple average** is (max + min) / 2 minus the lower threshold, or zero if that is negative.
- **Horizontal cutoff**: time spent above the upper threshold counts as if it were exactly at the upper threshold. **Vertical cutoff**: time above the upper threshold counts nothing. For the simple average, horizontal sets temperatures above the upper threshold to it first; vertical gives 0 for a day whose average is above it.
- **Biofix**: the day counting starts, such as the first sustained catch in a pheromone trap.
- **Target**: the number of degree-days to an event (egg hatch, a flight peak). The 250 on the page is a made-up example; use the value published for your insect and region, and check the official source.

## Worked example

The page opens with a made-up spring from 1 April to 14 June 2026, with a lower threshold of 10 °C, an upper threshold of 30 °C, the single sine method and a horizontal cutoff. It gives **533.6 degree-days (°C)** over the 75 days, and the made-up 250 DD target is reached on **21 May 2026**. With the simple average method the total falls to 503.0 and the target is reached three days later, on 24 May, because the average misses the warm afternoons of cool days. Setting the biofix to 15 April gives 502.5 DD, with 250 DD on 24 May. Typing a target of 700 shows a projection: at the last week's pace of 13.0 DD a day, about 13 more days, so around 27 June.

## Tips

- Fill gaps in the dates first: a missing day adds nothing, and the page tells you how many are missing.
- Use the same unit for the thresholds and the target as the source you took them from. Degree-days in °F are 1.8 times those in °C.
- Air temperature from a nearby station is usual, but an insect in sun or soil may be warmer or colder.

## Frequently asked questions

**Why does single sine give more than the average?** On a day from 5 °C to 25 °C the average is exactly 15 °C, so it gives 5 DD; but in fact much of the day is above 10 °C, and the sine method counts that as 6.09 DD.

**Does the projection forecast the weather?** No. It only assumes the coming days are like the last seven. Use it to plan, then follow the real total as days are added.

**Is my data sent anywhere?** No. The calculator works in your browser and keeps working offline once the page has loaded.
