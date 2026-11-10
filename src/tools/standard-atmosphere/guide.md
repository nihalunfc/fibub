---
name: Standard atmosphere calculator
num: 667
shelf: science
code: T464
section: aerospace-engineering
title: "Standard atmosphere calculator (ISA, US 1976): temperature, pressure, density, speed of sound and density altitude to 86 km"
summary: "Get the temperature, pressure, density, speed of sound, viscosity and gravity of the 1976 US Standard Atmosphere (the ISA) at any height from −5 to 86 km, with an ISA deviation, the pressure altitude for a pressure, the density altitude at an airfield, and a table and plots you can download."
status: live
ads: true
order: 667
icon: mountain
works: offline
updated: 2026-11-09
related: [psychrometric-calculator, rocket-equation, uncertainty-calculator, aircraft-performance, density-altitude, propeller-thrust, model-rocket-simulator, airfoil-calculator, drone-flight-time]
sources:
  - "U.S. Standard Atmosphere, 1976 (NOAA, NASA and the US Air Force; a US government publication): the defining constants (sea-level temperature and pressure, gas constant, molar mass of air, standard gravity, Earth radius for geopotential height) and the seven layers' base heights and lapse rates. Everything else is calculated from these with the hydrostatic equation and the ideal gas law; no tables are copied."
  - "Sutherland's law for the viscosity of air, with the constants given in the 1976 standard (β = 1.458 × 10⁻⁶ kg/(m·s·K^½), S = 110.4 K)."
  - "ICAO Standard Atmosphere (Doc 7488): uses the same definitions as the 1976 standard up to 32 km."
  - "Checked against an independent Python calculation that integrates the hydrostatic equation numerically with SciPy, and against the well-known values at the layer boundaries (for example 216.65 K and 22,632 Pa at 11 km geopotential). The example airfield is made up."
flow:
  - { icon: mountain, label: "Altitude" }
  - { icon: calculator, label: "Properties" }
  - { icon: target, label: "Density alt" }
  - { icon: chart, label: "Table" }
---

## What it does

The **standard atmosphere** is an agreed, average model of how the air changes with height. Engineers use it to compare aircraft and rocket performance, calibrate altimeters and airspeed indicators, and set test conditions. This calculator builds the **1976 US Standard Atmosphere** (the same as the ICAO **International Standard Atmosphere, ISA**, in the lower 32 km) from its defining numbers: sea level at 15 °C and 101,325 Pa, and seven layers in which the temperature changes in a straight line with height (falling 6.5 °C per km up to 11 km, then constant, then rising, and so on).

From those, the hydrostatic equation and the ideal gas law give at any height from −5 km to 86 km:

- **temperature, pressure and density**, and their ratios to sea level (θ, δ and σ);
- **speed of sound**, **dynamic and kinematic viscosity** (Sutherland's law), **gravity**, pressure scale height, mean free path;
- the **pressure altitude** for any pressure, and the **density altitude** at an airfield from its elevation, the altimeter setting (QNH) and the outside temperature;
- a **table** at any step, with plots and a CSV download.

Use the density it gives in the [[aircraft-performance|aircraft performance calculator]] or the [[propeller-thrust]] tool, and compare it with today's weather in the [[density-altitude|density altitude calculator]].

## How to use it

1. Pick **metric** (metres) or **imperial** (feet). Values you have typed are converted.
2. Type the **altitude**. Choose **geometric** (real height) or **geopotential** (the height measure the standard is defined in).
3. Leave the **ISA deviation** at 0 for a standard day, or type, say, 15 for a day 15 °C warmer than standard at every height. The pressure stays the standard pressure, so your altitude is then a pressure altitude, and the tool also shows the density altitude.
4. Below, type a **pressure** to get the pressure altitude, or an airfield's **elevation, QNH and temperature** for its density altitude.
5. Set the **range and step** of the table. Download it as CSV, or the whole report as PNG, PDF or Word.

## Worked example

At **11,000 m geometric** (the default), the page shows **216.77 K (−56.38 °C), 22,700 Pa and 0.3648 kg/m³**, still just inside the troposphere: the tropopause starts at 11,000 m *geopotential*, which is 11,019 m geometric. The speed of sound there is 295.15 m/s and the density is 29.78 % of sea level. Switch to geopotential and the page gives the familiar 216.65 K and 22,632 Pa.

A made-up airfield at **1,500 m** with QNH **1010 hPa** and **30 °C**: the station pressure is 842.88 hPa, the pressure altitude 1,526 m and the standard temperature there 5.08 °C, so the day is **ISA +24.9 °C**. The air density is 0.9686 kg/m³ (79.1 % of sea level), and the **density altitude is 2,380 m**: an aircraft takes off and climbs as if it were 880 m higher than the field.

A pressure of **700 hPa** is a pressure altitude of **3,012 m**.

## Tips

- **Density altitude** is what wings, propellers and engines feel. Hot, high and humid days raise it and lengthen take-off runs. This tool assumes dry air.
- **Speed of sound** depends only on temperature, so it is constant from 11 to 20 km.
- Above 80 km the 1976 standard lowers the temperature very slightly as oxygen molecules split; the tool reports the molecular-scale temperature, which differs by under 0.1 K.

## FAQ

**Is the ISA the same as the 1976 US Standard Atmosphere?** Yes up to 32 km, and they share their definitions above that; for most engineering work they are interchangeable.

**Why does the real air differ?** The standard is a yearly, mid-latitude average. The tropics are warmer with a higher tropopause, polar winters colder. Use the ISA deviation to model a warm or cold day.

**Is this for flight planning?** It is for study and planning. Use your aircraft's flight manual and official weather and planning tools for real flights.
