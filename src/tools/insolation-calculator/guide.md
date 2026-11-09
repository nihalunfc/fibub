---
name: Insolation calculator
num: 840
shelf: science
section: paleoclimatology
title: "Insolation calculator: daily and instantaneous sunlight at the top of the atmosphere for any orbit (Milankovitch forcing)"
summary: "Type an orbit (eccentricity, obliquity, longitude of perihelion, solar constant) and get the daily-mean and instantaneous insolation at any latitude and day of year or true solar longitude, with the seasonal cycle, latitude profiles, a latitude-by-season map, Milankovitch's caloric summer and winter half-years and summer energy above a threshold. Compare two orbits, such as a glacial and an interglacial setting. Download CSV, PNG, PDF or Word."
status: live
ads: true
order: 840
icon: orbit
works: offline
updated: 2026-11-09
related: [sun-position-calculator, koppen-climate, proxy-stacker, age-depth-model, energy-balance-model, glacier-ice]
sources:
  - "Daily and instantaneous insolation: A. Berger, 'Long-term variations of daily insolation and Quaternary climatic changes', Journal of the Atmospheric Sciences 35 (1978); formulas written by fibub, with Kepler's equation solved exactly."
  - "Caloric half-years: M. Milankovitch, Kanon der Erdbestrahlung (1941), as described in later literature; summer energy above a threshold: P. Huybers, Science 313 (2006). Written by fibub."
  - "Today's orbit (e = 0.016708, ε = 23.439°, ϖ = 102.937°, J2000) and the 365.2422-day tropical year: general astronomical facts. The solar constant 1361 W/m² is a rounded present-day value."
  - "No orbital solution tables (Berger and Loutre, Laskar) are included; orbit B's values are made up."
flow:
  - { icon: orbit, label: "Orbit" }
  - { icon: sliders, label: "Place, day" }
  - { icon: chart, label: "Insolation" }
  - { icon: download, label: "Download" }
---

## What it does

**Insolation** is the sunlight arriving at the top of the atmosphere, in watts per square metre. How much a place gets on a given day depends on three things about Earth's orbit that change slowly over tens of thousands of years: the **eccentricity** e (how oval the orbit is), the **obliquity** ε (the tilt of Earth's axis) and the **longitude of perihelion** ϖ (where in the seasons Earth is closest to the Sun). These are the Milankovitch cycles that pace the ice ages.

This tool works out, for an orbit you type in:

- the **daily-mean insolation** at any latitude, on a calendar day or at a true solar longitude λ;
- the **instantaneous insolation** at a local solar time, with the declination, Earth–Sun distance and day length;
- the **seasonal cycle** at your latitude and a **latitude profile** (chosen day, annual mean, caloric summer or winter, or summer energy);
- a **latitude by season map**, for either orbit or the difference between them;
- **Milankovitch's caloric half-years**: the half of the year (182.6 days) in which the place gets the most sunlight, and the other half, as means and totals;
- the **summer energy** over the days whose daily mean is at or above a threshold (Huybers 2006), and how many days that is.

Everything is computed in your browser from Berger's (1978) formulas. The Sun's position on any calendar day is found by solving Kepler's equation exactly, so very eccentric orbits are handled too.

Set your records side by side with the [[proxy-stacker]], and see what a change in sunlight does to temperature with the [[energy-balance-model]].

## How to use it

1. **Orbit A** starts at today's orbit. For a past time, type e, ε and ϖ for that age from an orbital solution you trust (for example the Berger and Loutre 1991 or Laskar et al. 2004 tables). None are built in.
2. Tick **Orbit B** to compare a second orbit, such as a glacial inception setting against today. Its starting values are made up.
3. Check **ϖ is measured as**. Most published tables give ϖ seen from the Sun (today about 102.9°). Some software, such as climlab, uses the Sun's longitude at perihelion instead (today about 282.9°). Switching keeps the same orbits and adds or takes off 180° in both boxes.
4. Type a **latitude** and the time of year, as a **calendar day** (the March equinox is fixed on day 80, 21 March) or as a **true solar longitude** λ (0° March equinox, 90° June solstice).
5. Read the table, the three figures and download a CSV of the map grid or of a latitude table, or a report as an image, PDF or Word file.

## Calendar day or solar longitude?

When the orbit changes, the seasons change length: the half of the orbit near perihelion is passed more quickly. So 21 June on one orbit is not at the same point of the orbit as 21 June on another. Paleoclimate studies often compare insolation at the same **λ** (for example the June solstice, λ = 90°) rather than the same date. The table shows both the λ and the calendar day for each orbit, so you can see the difference.

## Worked example

With the starting values, at **65° N on day 172 (21 June)**, today's orbit gives a daily mean of **477.9 W/m²** at λ = 89.28°, a declination of 23.44° and 21.12 hours of daylight; at local noon the Sun delivers 986.1 W/m². Orbit B (e = 0.04, ε = 22.5°, ϖ = 100°) gives **442.5 W/m²**, 35.5 W/m² less, because the axis is less tilted and Earth is farther from the Sun in northern summer (1.0389 against 1.0162 times the mean distance). The caloric summer at 65° N averages 366.0 W/m² today (5.775 GJ/m², 22 March to 21 September) and 351.8 W/m² with orbit B. The annual mean there hardly changes (213.7 against 211.1 W/m²): obliquity moves sunlight between latitudes, while precession mostly moves it between seasons.

## Tips

- The famous "65° N June insolation" curve is the daily mean at latitude 65 with λ = 90°: choose **True solar longitude** and type 90.
- The global annual mean is S₀ / (4√(1 − e²)), so eccentricity changes the total only by about 0.1 %.
- The precession index e sin ϖ is shown for each orbit: northern summers are strongest when it is most negative... with ϖ in the tables' convention, a large positive index means perihelion in northern winter and weak northern summers.

## FAQ

**Is this the sunlight at the ground?** No. It is at the top of the atmosphere, before clouds, gases and the surface reflect or absorb any of it.

**Which solar constant should I use?** Recent satellite measurements give about 1361 W/m²; older studies used 1365 to 1368. The insolation scales directly with it, so match the study you compare with.

**How accurate is it?** Checked against an independent numpy and scipy code (the Sun's longitude by integrating Kepler's second law, the daily mean by integrating over the hour angle) and against climlab's daily_insolation: daily means agree to better than 0.000001 W/m² at the same λ. By calendar day, climlab differs by up to 0.03 W/m² at e = 0.07 because it uses a short series for λ, where this tool solves Kepler's equation exactly.

**Can it give insolation for a past age directly?** Not by itself: type the orbital elements for that age. This keeps the tool free of copied tables and lets you use whichever orbital solution your study uses.
