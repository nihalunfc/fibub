---
name: UV index estimator
num: 504
shelf: science
section: atmospheric-chemistry-and-air-quality
title: "UV index estimator: clear-sky UV index from Sun angle and ozone, daily curve, peak time and time to an erythemal dose"
summary: "Estimate the clear-sky UV index for any place, date and time from the Sun's zenith angle and the ozone column, with factors for height, snow or sand and cloud. See the curve through the day, the peak at solar noon, the hours above each UV band and how long a chosen erythemal dose takes. An estimate: check your local UV forecast."
status: live
ads: true
order: 504
icon: star
works: offline
updated: 2026-11-09
related: [sun-position-calculator, air-quality-calculator, psychrometric-calculator, light-exposure-budget, insolation-calculator, weather-log]
sources:
  - "Madronich, S. (2007) Analytic formula for the clear-sky UV index. Photochemistry and Photobiology 83(6), 1537–1538 (the formula UVI = 12.5 μ^2.42 (Ω/300)^−1.23; editable on the page)."
  - "Sun position from the NOAA solar calculator equations after Meeus, J. (1998) Astronomical Algorithms, 2nd ed. (checked against Meeus examples 25.a and 28.b and against pvlib's NREL SPA)."
  - "UV index bands and the 0.025 W/m² per index unit follow the WHO/WMO/UNEP Global Solar UV Index guide (2002); 1 SED = 100 J/m² follows the CIE standard erythemal dose. Height, ground and cloud factors are simple editable multipliers with rounded example values written by fibub."
flow:
  - { icon: compass, label: "Place" }
  - { icon: clock, label: "Time" }
  - { icon: sliders, label: "Ozone" }
  - { icon: chart, label: "UV index" }
---

## What it does

The **UV index** tells you how strongly sunlight can redden skin. It depends mostly on how high the Sun is and how much ozone is overhead. This page works it out for a clear sky from first principles, so you can see why UV peaks around solar noon, why it is higher in summer, on mountains and on snow, and how fast it falls off in the afternoon.

- The **Sun's zenith angle** (its angle from straight overhead) is worked out for your latitude, longitude, date and clock time with the NOAA solar equations.
- The **clear-sky UV index** comes from Madronich's (2007) formula: UVI = 12.5 · μ^2.42 · (Ω/300)^−1.23, where μ is the cosine of the zenith angle and Ω the total ozone in Dobson units. All three numbers can be changed under *Formula settings*.
- **Height, ground and cloud** then multiply the result: a rise per km of height, a ground-reflection factor 1/(1 − albedo × sky reflectance), and a cloud factor you choose. An optional Earth–Sun distance term adds about ±3 % through the year.
- The **day curve** is drawn minute by minute, with the **peak at solar noon**, the times the index is 3, 6, 8 and 11 or more, and the whole-day erythemal dose.
- **Time to a dose**: for a dose you choose in standard erythemal doses (SED), the minutes to receive it from a start time, following the day's curve, as general information only.

It is an estimate. **Check your local UV forecast**, which allows for the day's clouds, haze and ozone.

Find the sun's height for your place and time with the [[sun-position-calculator]], and check the day's air with the [[air-quality-calculator]].

## How to use it

1. Type the latitude and longitude (north and east positive), the height above sea level, the date, the clock time and the clock's offset from UTC. *Now, on this device's clock* fills in the date, time and offset.
2. Set the ozone column. 300 DU is a typical value; satellite services publish the day's value, often between 250 and 450 DU.
3. Choose the ground (fresh snow reflects most of the UV that reaches it; grass very little) and a cloud factor (1 for a clear sky).
4. Read the UV index at your time, the peak, and the band times. Download the report or the curve as CSV.
5. Optionally set a dose and start time to see how long it takes to receive it.

## Worked example

Toronto (43.65° N, 79.38° W) at sea level, 21 June 2026, clock UTC−4, ozone 300 DU, clear sky:

- Solar noon is at **13:19**, when the Sun is 20.2° from overhead. The peak UV index is **10.4 (Very high)**.
- At 13:00 the estimate is **10.3**. The index is 3 or more from **09:02 to 17:37** and 8 or more from about 11:15 to 15:24.
- The whole-day dose is about **63 SED** on a flat surface.
- 1 SED from 13:00 takes about **6 minutes**; from 11:00 it takes about 9 minutes.

Change the ground to *Fresh snow (about 0.85)* and the index rises by about a third, which is why skiers burn easily. Lowering the ozone to 270 DU raises it by about 14 %.

## Tips

- In the tropics and at high altitude the clear-sky index can pass 11 (Extreme).
- The formula is for a horizontal surface. Faces and arms tilted towards a low Sun can receive more than the index suggests; shade and clothing receive far less.
- If your clock uses summer time, include it in the UTC offset.

## FAQ

**How accurate is it?** The formula is a fit to detailed radiative-transfer calculations for clean, cloud-free air. It is good for a quick estimate, but real readings can differ from it by 10 % or more. Haze, smoke and pollution lower real UV; clouds can lower it a lot or, at their edges, raise it briefly.

**Where does 0.025 come from?** One unit of the UV index is defined as 25 mW/m² of erythemally weighted sunlight, so a UV index of 4 gives 0.1 W/m², or 1 SED (100 J/m²) in about 17 minutes.

**Is the dose time a safe-exposure time?** No. It is arithmetic on an estimate. How skin reacts differs widely between people. Follow your local health advice and UV forecast.

**Why is there no UV at night or in polar winter?** When the Sun is below the horizon, μ is zero or negative and the formula gives zero.
