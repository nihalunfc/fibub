---
name: Astronomy time converter
shelf: science
section: research
title: "Julian Date, MJD and sidereal time converter (with BJD and HJD)"
summary: "Convert any moment between UTC, your local time, Julian Date, Modified Julian Date and Unix time, and see sidereal time, ΔT and light-time corrected BJD for a star."
status: live
ads: true
order: 70
icon: clock
works: offline
updated: 2026-11-07
related: [sky-coordinates, polar-alignment, observing-log]
flow:
  - { icon: clock, label: "Pick a time" }
  - { icon: convert, label: "Convert" }
  - { icon: star, label: "Add a star" }
  - { icon: copy, label: "Copy result" }
---

## What this converter does

Astronomers use several clocks at once. Observing logs and variable-star reports use the **Julian Date (JD)**, a running count of days. Catalogues and satellites often use the **Modified Julian Date (MJD)**, which is the JD minus 2,400,000.5, so the numbers are shorter and each day starts at midnight. Telescope mounts need **sidereal time**, which tracks the stars rather than the Sun. Timing an eclipsing binary or an exoplanet transit needs the **barycentric Julian Date (BJD)**, which removes the minutes that light takes to cross Earth's orbit. This page shows all of them for one moment, side by side.

## How to use it

1. **Set your place** at the top. Local sidereal time and your local clock depend on your longitude and time zone. Pick a city, type your latitude and longitude, or press **Use my location**. Your location stays on your device.
2. **Choose the moment.** **Now** gives a live clock that updates every second. **Date and time** reads your local time (tick **This is UTC** to type UTC instead). You can also paste a **JD**, **MJD** or **Unix** time to convert it back.
3. **Read the results.** Every value updates as you type.
4. Open **Heliocentric and barycentric Julian Date** and type a star's J2000 position, or pick an object such as M13, to get the BJD (TDB) and HJD for that star.
5. Download the results as an image, PDF or Word file for your notes.

## What each result means

- **Julian Date (UT):** days since noon on 1 January 4713 BC, on the UTC timescale.
- **Julian Date (TT):** the same count on Terrestrial Time, the smooth timescale that ephemerides use. It runs about 69 seconds ahead of UTC, and that gap is shown as **ΔT**.
- **Greenwich and local sidereal time:** the right ascension that is crossing the meridian right now. An object is highest in the sky when the local sidereal time equals its RA.
- **BJD (TDB):** the time the light would have reached the Solar System's centre of mass. This is the standard for exoplanet and pulsar timing.
- **HJD:** the older correction to the Sun's centre. It is still used in many variable-star papers.

## Worked example

Suppose you observe Algol from Toronto at 22:00 local time on 7 November 2026. That is 03:00 UTC on 8 November, JD 2461352.625. Type Algol's position (03h 08m 10s, +40° 57′ 20″) and the page shows a light-time correction of a few minutes. Add that to the JD (TT) and you get the BJD to report.

## Questions

**How accurate is it?** Sidereal time and Julian Dates are exact to the second. The BJD correction uses the full planetary positions from astronomy-engine and matches professional tools to well under a second. That is plenty for amateur timing work, but check against a research tool for millisecond pulsar work.

**Does it need the internet?** No. Once the page has loaded, it keeps working offline.
