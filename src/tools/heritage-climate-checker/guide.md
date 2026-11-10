---
name: Heritage climate
num: 420
shelf: science
code: T308
section: heritage-conservation
title: "Heritage climate"
summary: "Open a data-logger file (time, temperature, RH) and see the dew point, hours outside your RH and temperature limits, daily RH swings, the longest spell at mould-risk humidity, and a time-weighted preservation index from an Arrhenius rate with your own activation energy, with charts. Nothing is uploaded."
status: live
ads: false
order: 420
icon: chart
works: offline
updated: 2026-11-09
related: [psychrometric-calculator, light-exposure-budget, colour-difference-calculator, trend-analyser, station-data-viewer]
sources:
  - "Dew point: Magnus formula with b = 17.62 and c = 243.12 °C over water (Sonntag 1990, as in the WMO Guide to Instruments and Methods of Observation). Decay rate: the Arrhenius equation, with a user-set activation energy and humidity exponent; the time-weighted index is the time-weighted harmonic mean of the point indices (general chemical kinetics)."
  - "Checked against an independent pandas/NumPy script on the example log and on a random irregular log with gaps, comma decimals and separate date and time columns: means, dew points, hours over each limit, longest damp spell, daily swings and the Arrhenius rate all agree to 10⁻⁹."
  - "The example log, limits, activation energy and reference conditions are made-up or rounded examples, not recommendations; the user enters the targets their institution sets."
flow:
  - { icon: file, label: "Logger file" }
  - { icon: sliders, label: "Limits" }
  - { icon: calculator, label: "Hours" }
  - { icon: chart, label: "Charts" }
---

## What it does

Museums, archives, libraries and historic houses log temperature and relative humidity (RH) to protect their collections. Damp air lets mould grow and metals corrode; fast RH swings make wood, ivory and paint swell and shrink until they crack; warmth speeds up the chemical decay of paper, film and plastics. This checker reads a logger's export and turns thousands of readings into the numbers a conservator needs:

- **Dew point** of every reading (Magnus formula), to see where cold walls or cases might get condensation.
- **Hours** above and below your RH and temperature limits, and the share of the time.
- **Mould risk**: hours at or above the RH you set, and the **longest unbroken spell** at that level, with its start and end. A long spell matters more than scattered hours.
- **Daily RH swings**: the range in each calendar day, the mean, the largest, and the days over your swing limit.
- **Preservation index**: a time-weighted measure of chemical decay. The rate at each reading is exp(−Ea/RT) × RH<sup>n</sup>, relative to the reference temperature and RH. An index of 0.86 means objects decay as if they had 0.86 times the life they would have at the reference.

For a single reading of air (wet bulb, humidity ratio, enthalpy), use the [psychrometric calculator](/science/psychrometric-calculator/).

Look at a logger file first in the [[station-data-viewer|weather station data viewer]], and plan the light side of a display with the [[light-exposure-budget|light exposure budget]].

## How to use it

1. Export the logger's readings as CSV, TSV or Excel and press **Open a file**, or paste them. The page finds the time, temperature and RH columns from the header; change them if needed. Pick the **date order** if your dates are day/month/year or month/day/year, and **°F** if needed.
2. Set **your limits**. The values on the page are examples only: use the targets your institution or loan agreement sets.
3. For the preservation index, set the **activation energy** for the material (the example is 100 kJ/mol) and the reference conditions.

## Worked example

The page opens with a made-up month of hourly readings (720 readings over 30.0 days) from a room with a daily cycle and a damp spell in the middle. With the example limits it reports **91.0 h (3.8 days) at or above 70 % RH**, all in one spell from 2026-06-13 16:00 to 2026-06-17 11:00. RH ran from 47.9 to 83.0 % (mean 55.8 %); it was above 65 % for 98.0 h (13.6 % of the time). The temperature averaged 20.2 °C and was above 22 °C for 73.0 h. The dew point averaged 10.9 °C. The mean daily swing was 8.9 % RH; the largest was 27.6 % RH on 2026-06-17, and 2 days were over the 10 % limit. Being warmer and damper than 20 °C and 50 % on average, the room's decay rate is 1.16 × the reference and the preservation index is 0.864.

## Tips

- Each reading counts for the time until the next one. A gap of more than three usual steps (a flat battery, a download) counts as one step and breaks a damp spell, and the page reports how many gaps there were.
- Check the logger's clock and calibration; an RH sensor that drifts by a few % can move hours across a limit.
- Download the readings with dew point and relative decay rate to plot them with other data.

## FAQ

**Which activation energy should I use?** It depends on the material and the reaction; values found in the literature for paper and film are often given in the region of 100 kJ/mol. Treat the index as a way to compare rooms and seasons, not as a lifetime forecast.

**Does it predict mould?** No. It shows when the air was damp enough, for long enough, to need attention. Mould also depends on the surface, dust, air movement and the temperature.

**Is my data uploaded?** No. The file is read in your browser and the page works offline.
