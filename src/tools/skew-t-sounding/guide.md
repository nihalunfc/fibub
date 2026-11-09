---
name: Skew-T sounding plotter
num: 136
shelf: science
section: meteorology
title: "Skew-T log-P plotter: CAPE, CIN, LCL, LFC and stability indices from a weather balloon sounding"
summary: "Paste a radiosonde sounding (or the University of Wyoming text list) and get a skew-T log-P diagram with the lifted parcel, CAPE and CIN shading, LCL, LFC and EL, lifted index, Showalter, K index, total totals, precipitable water, freezing level, wind barbs and bulk shear."
status: live
ads: true
order: 2
icon: chart
works: offline
updated: 2026-11-08
related: [psychrometric-calculator, gaussian-plume-calculator, gps-track-analyser, plot-maker]
sources:
  - "Saturation vapour pressure and equivalent potential temperature: Bolton, D. (1980), The computation of equivalent potential temperature, Monthly Weather Review 108, 1046 to 1053 (published equations)."
  - "Moist adiabat, CAPE and CIN method and the physical constants (Rd, cp, Lv, epsilon) follow the open-source MetPy library (BSD licence), used only to check fibub's own code; no data is copied."
  - "Lifted index, Showalter index, K index and total totals: standard textbook definitions (for example Wallace and Hobbs, Atmospheric Science, 2nd edition, 2006)."
  - "University of Wyoming upper-air text format: read from the format as it appears on the public archive; no data is bundled."
  - "The example sounding is made up by fibub for illustration; it is not a real station or date."
flow:
  - { icon: table, label: "Sounding" }
  - { icon: target, label: "Parcel" }
  - { icon: chart, label: "Skew-T" }
  - { icon: download, label: "Download" }
---

## What it does

Twice a day, weather services around the world launch balloons that carry a **radiosonde** up through the atmosphere. It reports the pressure, temperature, dew point and wind every few seconds. Forecasters plot that **sounding** on a **skew-T log-P diagram**, then imagine lifting a small bubble of air (a **parcel**) from near the ground to see whether it would keep rising on its own, which is how thunderstorms grow.

This tool draws the diagram, lifts the parcel for you, and works out the numbers forecasters look at first: **CAPE**, **CIN**, the **LCL**, **LFC** and **EL**, the classic stability indices, precipitable water, the freezing level and wind shear. It all runs in your browser; the sounding never leaves your device.

For moist air at the surface, use the [[psychrometric-calculator]]; to see how a plume spreads in the same air, the [[gaussian-plume-calculator]].

## How to use it

1. **Paste the sounding.** The easiest form is a table with a header row: pressure (hPa), temperature (°C), dew point (°C), and if you have them, height (m), wind direction (degrees) and wind speed (knots, or m/s if the header says so). Columns can be separated by tabs, commas or spaces. You can also paste the **text list from the University of Wyoming upper-air archive** exactly as it appears, with its fixed-width columns (PRES, HGHT, TEMP, DWPT, ... DRCT, SKNT); missing values at the top are handled.
2. Or press **Open a file** (TXT, CSV or TSV, up to 2 MB and 5,000 levels).
3. **Choose the parcel.** *Surface-based* lifts the lowest level. *Mixed layer* averages the potential temperature and moisture of the lowest 100 hPa, which is often more realistic in the afternoon. *Most unstable* picks the level in the lowest 300 hPa with the highest equivalent potential temperature, which finds **elevated** instability above a cold surface layer.
4. **Buoyancy from:** virtual temperature is the standard (moist air is slightly lighter than dry air at the same temperature). Plain temperature gives the older, slightly smaller numbers.
5. **Station height** is used only when the sounding has no height column; heights are then worked out with the hypsometric equation. Results are given **above the ground**.

## Reading the diagram

Temperature lines (**isotherms**) slope up to the right, which is the "skew". Pressure falls upward on a log scale, roughly like height. The red line is the measured temperature, the green line the dew point; where they are close, the air is nearly saturated (cloud). The black dashed line is the parcel: it cools along a **dry adiabat** until the **LCL** (about cloud base), then along a **moist adiabat**. Where the parcel is warmer than the air around it, the area is shaded red: that is **CAPE**. The grey area below is **CIN**, the "lid" the parcel must be pushed through first.

## What the numbers mean (rough guide only)

- **CAPE** under about 1,000 J/kg is modest, 1,000 to 2,500 moderate, and above 2,500 large. **CIN** beyond about −50 J/kg is a strong lid.
- **Lifted index** below 0 °C is unstable; below −6 °C very unstable.
- **K index** above about 30 and **total totals** above about 50 favour thunderstorms.
- **0–6 km bulk shear** above about 40 kt favours organised storms such as supercells.

These are rules of thumb from textbooks, not a forecast. Storms also need something to lift the air (a front, hills, sea breeze). For warnings, always follow your national weather service.

## Worked example

The made-up example starts at 985 hPa with 30.0 °C and a dew point of 20.0 °C. The surface-based parcel reaches its **LCL at 852 hPa**, about 1,270 m above the ground, at 17.7 °C. With the virtual temperature correction it becomes warmer than its surroundings just above that (LFC about 838 hPa) and stays warmer until the **EL near 188 hPa**. **SBCAPE is about 2,890 J/kg**, CIN 0, lifted index −7.5 °C, K index 32.4, total totals 52.8 and precipitable water 36.7 mm: a very unstable, moist air mass. The 0–6 km shear of about 52 kt means storms that form could become organised.

## How it is calculated

Saturation vapour pressure uses Bolton's formula. The parcel follows the dry adiabat (θ conserved, κ = Rd/cp) to the LCL, found by iteration, then the pseudo-adiabatic lapse rate integrated with fourth-order Runge-Kutta steps of 2 hPa or less. Buoyancy (parcel minus environment, virtual temperatures by default) is integrated against ln p: CAPE from the LFC to the EL (or the top of the sounding), CIN from the start to the LFC, set to zero if positive. Zero crossings are found by interpolation in ln p. fibub checked these numbers against the open-source MetPy library: CAPE agrees within about 2 %, the LCL within 1 hPa and the indices within 0.1 °C. Small differences come from the vapour pressure formula and, for the mixed layer, from MetPy dropping the levels inside the mixed layer.

## FAQ

**Where do I get a sounding?** National weather services and the University of Wyoming upper-air archive publish them. Copy the text list for your station and paste it here.

**Can I use model forecast soundings?** Yes, any table of pressure, temperature and dew point works.

**Why is my CAPE different from another website?** Parcel choice, the virtual temperature correction, the vapour pressure formula and how the mixed layer is built all change CAPE by a few percent or more. Compare like with like.
