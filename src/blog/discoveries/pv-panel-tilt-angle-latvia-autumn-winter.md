---
title: "Best tilt angle for solar panels at 56° N: a field test of six tilts in Latvia"
summary: "A 2025 Energies study measured south-facing panels at six tilts through a Latvian autumn and winter. See what it found, and compare tilts for any place in your browser."
tools: [solar-pv-yield, sun-position-calculator, home-battery-sizing]
updated: 2026-11-10
sources:
  - "Osadčuks V, Berjoza D, Lāceklis-Bertmanis J, Jurgena I (2025), Energies 18(13): 3487, the paper described here."
  - "Clear-sky irradiance (Haurwitz), Erbs diffuse split and isotropic-sky transposition: standard solar engineering, as used by the fibub tool."
  - "The 4 kWp system, its losses and the 50 % sunshine factor in the worked example are made up by fibub."
paper:
  title: "A Methodological Framework for Studying the Tilt Angle of Solar Photovoltaic Panels"
  authors: "Osadčuks V, Berjoza D, Lāceklis-Bertmanis J, Jurgena I"
  journal: "Energies"
  year: 2025
  doi: "10.3390/en18133487"
  url: "https://www.mdpi.com/1996-1073/18/13/3487"
  licence: "CC BY"
  reviewed: true
---

How steeply should solar panels lean in the far north, where the Sun stays low for half the year? Rules of thumb say "about the latitude", but those rules come mostly from models and sunnier places. A team at the Latvia University of Life Sciences and Technologies put small panels at several tilts side by side on a flat roof and measured them through an autumn and winter, publishing the method and first results in Energies in July 2025. This page explains the study and shows how to compare tilts for any place with the [[solar-pv-yield]] estimator, after checking how high the Sun climbs each month in the [[sun-position-calculator]].

## What they found

Over the measuring period, panels tilted at **50°** and **40°** collected almost the same amount of light, and both clearly beat flatter panels. A horizontal panel got about 31.9 % less than the 50° one, and a 30° panel about 4.6 % less. Month by month the winner swapped between 40° and 50°: 50° led in September, October and January, and 40° in August, November and December. The gain over a flat panel was largest in October (about 74.5 %) and smallest in December (about 16.4 %), when the sky is mostly overcast and the light comes from the whole sky rather than a low Sun. The authors stress that half a year of data cannot fix a best tilt for the whole year, though early signs pointed above 40°.

## Why it matters

At high latitudes, a large share of a year's solar energy comes in a few summer months, while winter output is small but valuable, because demand and prices are highest then. The choice of tilt trades one against the other, and also affects snow shedding and how many rows fit on a roof. A simple, cheap test rig that anyone can copy gives local evidence instead of borrowed rules, which is the paper's main aim.

## How they did it

Eighteen identical 20 W monocrystalline panels faced due south on a flat roof at about 56.7° N, three at each tilt. Instead of electrical power, the team logged each panel's short-circuit current, which rises in step with the light falling on it, every 10 seconds. A pyranometer (a light meter for sunlight) on the flat roof gave the reference. Each tilt's current was divided by that of the flat panels to give a ratio, which turned the flat-roof measurement into light on the tilted panel. Results were compared with a clear-sky model from the pvlib software and with long-term monthly averages from the European PVGIS service. The data ran from late August 2024 to late January 2025.

## Check it yourself with fibub

The solar PV yield tool builds a cloudless year hour by hour for any place, then scales it by a sunshine share you choose. The system below is **made up**: 4 kWp facing south near the paper's location, with 14 % losses, albedo 0.2 and 50 % sunshine.

1. **Place.** Latitude 56.66, longitude 23.75.
2. **Panels.** Azimuth 180 (south), tilt 40°, albedo 0.2.
3. **System.** 4 kWp, 14 % losses, sunshine 50 %.
4. **Read the year.** The page shows about **3,443 kWh a year** (861 kWh per kWp), a capacity factor of about 9.83 %. The best tilt facing south is **44.3°**, giving 3,451 kWh, only 0.23 % more. Over a whole year, anything from 40° to 50° is within a fraction of a per cent.
5. **Compare tilts month by month.** Change the tilt to 0, 30, 50 and 60 and note the Months table. Adding up September to January, our made-up system gives about 485 kWh flat, 797 kWh at 30°, 864 kWh at 40°, 909 kWh at 50° and 930 kWh at 60°. For the dark half of the year, steeper is better, and the year-round best (44.3°) sits lower because summer pulls it down.
6. **Compare with the field test.** In the model the flat panel gets about 47 % less than 50° over those months, and October's gain from tilting is about 95 %, with December's about 156 %. The paper measured 31.9 % overall, about 74.5 % in October and only 16.4 % in December. The model assumes cloudless skies scaled down evenly, so it overstates the benefit of tilting on grey days, when light is diffuse and comes from all directions. That gap is exactly why real measurements like the paper's matter.

For a more realistic year, type 12 monthly sunshine values, lower in late autumn and winter. To see how much of the summer surplus a battery could shift into the evening, carry the monthly energy into the [[home-battery-sizing]] calculator.

## The fine print

- About six months of data, with August and January incomplete and one December week dropped, cannot give a whole-year answer.
- Short-circuit current tracks light, not electrical output; panel temperature and inverter effects were not included.
- One site and one roof type (a flat bitumen roof) were used.
- Rows of full-size panels shade each other more at steep tilts, which a test of small panels side by side does not show.
- Real installations should use local weather data and follow local building and electrical rules; check the official source.
