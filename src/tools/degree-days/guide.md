---
name: Degree days calculator
num: 216
shelf: science
section: climatology
title: "Degree days calculator: heating, cooling and growing degree days from daily temperatures (free)"
summary: "Paste or open daily minimum and maximum temperatures and get heating, cooling and growing degree days by the mean, modified average, single sine or single triangle method, with your own bases, an upper cutoff, missing-day filling, and daily, monthly and running totals. Runs in your browser."
seoDescription: "Heating, cooling and growing degree days from daily min and max temperatures: mean, modified average, single sine or triangle, monthly totals and CSV."
status: live
ads: true
order: 216
icon: calendar
works: offline
updated: 2026-11-09
related: [insect-degree-days, et0-calculator, koppen-climate, trend-analyser, plot-maker]
sources:
  - "Single sine method: Baskerville, G. L. and Emin, P. (1969), Rapid estimation of heat accumulation from maximum and minimum temperatures, Ecology 50: 514–517 (the idea; the formulas here are worked out by fibub from the geometry of the curve)."
  - "Degree-day methods in general (mean, modified average, single triangle, horizontal cutoff): as described in agricultural and building-energy textbooks; no tables or published values are copied."
  - "The bases on the page (18 °C, about 65 °F; 10 °C and 30 °C for growing) are rounded examples, and the example year is made up by fibub."
  - "Checked against an independent Python script that samples each day's sine or triangle curve at 200,000 points (numpy)."
flow:
  - { icon: table, label: "Daily temps" }
  - { icon: sliders, label: "Bases" }
  - { icon: sigma, label: "Degree days" }
  - { icon: chart, label: "Months" }
---

## What it does

Degree days turn a run of daily temperatures into one number that tracks how much heating, cooling or plant growth the weather called for. Each day adds the number of degrees by which it was colder than a base (**heating degree days**, used for heating bills and fuel planning), warmer than a base (**cooling degree days**, for air conditioning), or warmer than a crop's base temperature (**growing degree days**, for timing planting, flowering and harvest). Over a month or a season the totals let you compare one year with another, or one place with another, fairly.

This calculator reads daily minimum and maximum temperatures (or daily means), fills or leaves out missing days, and gives all three kinds of degree days for every day, every month and as running totals, with charts and downloads. Everything is worked out in your browser and nothing is sent anywhere. To follow a pest's development from a trap catch, use the [[insect-degree-days]]; to see whether a warm trend in your totals is real, try the [[trend-analyser]].

## How to use it

1. Paste three columns, **date, minimum, maximum**, or two, **date, mean**. A header row is fine. You can also open a CSV or Excel file. A row with a date and empty temperatures counts as a missing day.
2. Pick the **unit** the data are in. Switching it converts the bases for you.
3. Set the **heating**, **cooling** and **growing bases**, and the **upper cutoff** for growing (blank for none).
4. Pick the **method**, what to do with **missing days**, and optionally a **start date** (a planting date, or the start of the heating season).

## What each option does

- **Mean**: (min + max) / 2 against each base. Simple, and what most published heating and cooling figures use.
- **Modified average**: for growing degree days, a minimum below the base is raised to the base and a maximum above the cutoff is lowered to the cutoff before averaging (the usual way for maize). Heating and cooling use the plain mean.
- **Single sine**: each day is one sine wave from the minimum to the maximum and back; the tool counts the exact area between the curve and the base. A cool day with a warm afternoon then still adds some cooling.
- **Single triangle**: the same idea with straight lines up and down. It gives a little less than the sine on days that cross the base.
- **Upper cutoff**: warmth above it counts as if it were at the cutoff, because most crops stop growing faster above a certain temperature.
- **Missing days**: fill each with a straight line between the days either side, or leave it out so it adds nothing. The page says how many were missing and warns about long gaps.

## Worked example

The page opens with a made-up year, 2025, with 14 March left out. With heating and cooling bases of 18 °C, a growing base of 10 °C, an upper cutoff of 30 °C and the single sine method, it gives **heating 3180.9, cooling 415.5 and growing 1518.4 degree days (°C)**. The missing day is filled from 13 and 15 March (−2.5 to 5.5 °C) and adds 16.5 heating degree days. With the mean method the totals are 3065.9, 300.4 and 1464.3: cooling falls the most, because the mean misses warm afternoons on days averaging below 18 °C. The single triangle gives 3142.0, 376.6 and 1501.0, and the modified average raises growing to 1569.3. Leaving the missing day out lowers sine heating to 3164.4. Month by month, January needs the most heating (602.4) and August gives the most growing degree days (348.5). Starting the count on 15 April gives 1514.9 growing degree days.

## Tips

- Use the same base as the figures you compare with: heating bases differ by country (for example 15.5 °C or 18 °C), and crops have their own growing bases.
- Degree days in °F are 1.8 times those in °C for the same weather and bases.
- Fill long gaps from a nearby station rather than with a straight line.

## Frequently asked questions

**Which method should I use?** For heating and cooling records, the mean is the common choice; for crops, use the method your crop guide uses (often the modified average or single sine).

**Why can a day have both heating and cooling degree days?** With the sine or triangle method, a day from 10 to 30 °C spends part of the time below 18 °C and part above, so it adds 2.2 heating and 4.2 cooling degree days by the sine.

**Is anything stored?** No. The data stay on this page and are gone when you close it.
