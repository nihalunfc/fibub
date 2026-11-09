---
name: Solar PV yield estimator
num: 672
shelf: science
section: energy-and-power-systems
title: "Solar PV yield estimator: clear-sky yearly and monthly energy, best tilt and capacity factor for solar panels"
summary: "Give a place, the panels' tilt and direction, the system size and losses, and get an hour-by-hour clear-sky year (sun position, Haurwitz clear sky, Erbs split, isotropic sky on the tilted panels), scaled by your own sunshine estimate: yearly and monthly energy, specific yield, capacity factor and the best tilt."
status: live
ads: true
order: 672
icon: chart
works: offline
updated: 2026-11-09
related: [sun-position-calculator, standard-atmosphere, uncertainty-calculator, wind-energy-yield, home-battery-sizing, lcoe-calculator, battery-solar-sizing, solar-cell-iv, insolation-calculator, carbon-footprint]
sources:
  - "Sun position: the NOAA solar calculator equations, after Meeus, J., Astronomical Algorithms (equations only)."
  - "Clear-sky global irradiance: Haurwitz, B. (1945), 'Insolation in relation to cloudiness and cloud density', Journal of Meteorology 2 (formula only)."
  - "Diffuse fraction: Erbs, D. G., Klein, S. A. and Duffie, J. A. (1982), Solar Energy 28 (formula only); extraterrestrial irradiance with Spencer's (1971) Earth-Sun distance series and a solar constant of 1366.1 W/m²."
  - "Isotropic-sky transposition (Liu and Jordan) onto a tilted plane: as in Duffie, J. A. and Beckman, W. A., Solar Engineering of Thermal Processes (equations only)."
  - "Checked against an independent calculation with pvlib-python (NREL SPA sun position, pvlib's Haurwitz, Erbs and isotropic models) for places in both hemispheres. The example place, system, losses and sunshine factor are made up."
flow:
  - { icon: compass, label: "Place" }
  - { icon: sliders, label: "Panels" }
  - { icon: clock, label: "Each hour" }
  - { icon: chart, label: "kWh" }
---

## What it does

This estimator builds a **clear-sky year**, hour by hour, for any place between 66° south and 66° north:

1. The **Sun's position** every hour (NOAA's equations, accurate to about 0.01°).
2. The **clear-sky sunlight** on flat ground from the Haurwitz formula, GHI = 1098 cos Z e^(−0.059 / cos Z) W/m², where Z is the Sun's zenith angle.
3. The **Erbs** split of that light into direct beam and diffuse sky light.
4. The light on your **tilted panels**: the direct beam at its angle of incidence, the sky as a uniform dome (isotropic) and light reflected from the ground.

It adds up the energy for each month, multiplies by your **sunshine factor** (how much of the clear-sky light your climate really gets), your **system size** and **(1 − losses)**, and also searches every tilt from 0° to 90° for the best one for your panel direction.

**Clear sky is an upper bound.** On cloudless days a place cannot get much more than this; clouds take a share away. The sunshine factor is your own estimate: from long-term weather records, a local installer, or comparing with a neighbour's system.

Size a battery to store the extra power with the [[home-battery-sizing|home battery calculator]], and work out the cost per kWh with the [[lcoe-calculator|LCOE calculator]].

## How to use it

1. Type the **latitude and longitude** (north and east positive).
2. Give the panels' **tilt** and **azimuth** (180 = south, 0 = north, 90 = east).
3. Give the **system size** in kWp (the panels' total rated power), the **losses** (10 to 20 % is typical) and the ground **albedo**.
4. Give a **sunshine** percentage for the whole year, or 12 monthly values.
5. Read the yearly and monthly energy, the best tilt and the capacity factor. Download the months or every hour as CSV, or the whole report.

## Worked example

A made-up 5 kWp system at 43.7° N, 79.4° W, tilted 35° to the south, 14 % losses, albedo 0.2 and 65 % sunshine all year. The clear-sky year puts 2,340 kWh/m² on the panels, an upper bound of **10,063 kWh**. With 65 % sunshine the page shows **6,541 kWh a year (1,308 kWh per kWp)**, a capacity factor of 14.9 %. July is the best month (696 kWh) and December the worst (323 kWh). The best tilt facing south is 36.4°, only a hair better than 35°: the yearly total changes little within 10° of the best tilt.

## Tips

- In the northern hemisphere face the panels **south** (180°), in the southern **north** (0°). East or west costs perhaps 15 to 20 %.
- The best year-round tilt is usually a little less than the latitude. Steeper favours winter; flatter favours summer.
- For a real decision use measured or satellite weather data for the place; this tool is for learning and quick comparisons.

## FAQ

**Why is my real system lower?** Clouds are only one reason. Shading, snow, dust, panel heat on summer days and inverter clipping all cost energy. Put your best estimate into the losses.

**Why only up to 66°?** Beyond the polar circles the Sun can stay up or down all day, and the simple clear-sky formula is weakest with the Sun low all day.

**Is this a design tool?** It is for study and planning. Ask a qualified installer for a proper design.
