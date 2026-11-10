---
name: Density altitude calculator
num: 898
shelf: science
code: T633
section: meteorology
title: "Density altitude and pressure altitude calculator with air density (feet or metres, hPa or inHg)"
summary: "From the altimeter setting or station pressure, the elevation, the temperature and the dew point, get the pressure altitude, the density altitude (moist and dry), the air density and the standard-atmosphere temperature, with a chart and a table over a range of temperatures."
status: live
ads: true
order: 898
icon: mountain
works: offline
updated: 2026-11-09
related: [wind-chill-heat-index, psychrometric-calculator, skew-t-sounding, standard-atmosphere, aircraft-performance, station-data-viewer, propeller-thrust]
sources:
  - "Standard atmosphere: the ICAO Standard Atmosphere (identical to the US Standard Atmosphere 1976 up to 51 km): sea level 1013.25 hPa and 15 °C, g0 = 9.80665 m/s², R = 287.05287 J/(kg K) and the layer lapse rates (general constants)."
  - "Vapour pressure from the dew point: Bolton, D. (1980), The computation of equivalent potential temperature, Monthly Weather Review 108, 1046 to 1053."
  - "Checked 2026-11-09 against the ambiance Python package (ISA) and MetPy 1.7.1 (air density)."
flow:
  - { icon: sliders, label: "Air" }
  - { icon: mountain, label: "Altitude" }
  - { icon: chart, label: "Chart" }
  - { icon: table, label: "Table" }
---

## What it does

Aircraft wings, propellers, engines, drones and even long-range bullets care about how **dense** the air is, not how high the ground is. **Density altitude** turns the air density into a height: the height in the standard atmosphere where the air would be this thin. A hot, humid afternoon at a high airfield can give a density altitude thousands of feet above the field, with longer take-off runs and slower climbs.

The page works out:

- **Pressure altitude**: the height in the standard atmosphere (ISA) with the station's pressure. It is what an altimeter reads when set to 1013.25 hPa (29.92 inHg).
- **Density altitude**, for your moist air and for dry air, found exactly by inverting the ISA, layer by layer. No chart reading is needed.
- **Air density** in kg/m³ and as a percentage of the sea-level standard 1.225 kg/m³.
- The **standard temperature** at the pressure altitude, how far your air is from it (ISA deviation), the **virtual temperature**, the **vapour pressure** and mixing ratio.
- The pilot's **rule of thumb** (120 ft per °C above standard), to show how close it comes.

**Not for flight planning on its own.** Use your aircraft's performance data and official weather. This page shows the standard-atmosphere arithmetic.

See what it does to take-off and climb with the [[aircraft-performance|aircraft performance calculator]], and compare it with the [[standard-atmosphere]].

## How to use it

1. Pick the units for heights (feet or metres), pressure (hPa or inHg) and temperature (°C or °F). Switching converts what you typed.
2. Give the pressure as the **altimeter setting** (QNH, as in a METAR) with the field **elevation**, or as the **station pressure** read at the site. Switching between the two keeps the same air.
3. Type the **air temperature** and the **dew point**. Leave the dew point empty for dry air.
4. Read the result, the chart of density altitude against temperature, and the **table** for a temperature range. Download the table as CSV or the report as an image, PDF or Word file.

## Worked example

An airfield at **5,000 ft** with an altimeter setting of **1013 hPa**, **30 °C** and a dew point of **15 °C**. The page shows:

- Station pressure **842.9 hPa** and pressure altitude **5,007 ft**.
- Standard temperature there **5.08 °C**, so the air is ISA +24.9 °C.
- Air density **0.9612 kg/m³**, 78.5 % of the sea-level standard.
- **Density altitude 8,057 ft**. Dry air at the same temperature would give **7,809 ft**: the humidity adds about 250 ft.
- The rule of thumb gives 7,997 ft.

In the table, the same field at −10 °C has a density altitude of 3,199 ft, and at 45 °C, 9,607 ft.

## How it is worked out

The station pressure follows from the altimeter setting the same way an altimeter works: the pressure altitude equals the elevation plus the standard-atmosphere height of the altimeter setting below 1013.25 hPa. The vapour pressure comes from the dew point, the virtual temperature from the vapour pressure, and the density from the gas law. The density altitude is the ISA height with that density, solved exactly inside the right layer (troposphere to 11 km, then the layers above, up to 51 km).

## FAQ

**Why does humidity raise the density altitude?** A water molecule is lighter than the nitrogen and oxygen it replaces, so moist air is less dense.

**Why is my density altitude negative?** Cold, high-pressure air is denser than the sea-level standard. That is good for performance.

**Is the height geometric or geopotential?** Geopotential, as altimeters and pressure altitude use. Below 10 km the two differ by under 0.2 %.
