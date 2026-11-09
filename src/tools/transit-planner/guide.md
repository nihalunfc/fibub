---
name: Transit planner
num: 54
shelf: science
section: exoplanets
title: "Exoplanet transit planner: which transits you can see from your place, with altitude and Moon"
summary: "Type a planet's ephemeris and see every upcoming transit with ingress, middle and egress on your clock, the star's altitude, darkness, the Moon, how much you can see and how uncertain the timing is."
status: live
ads: true
order: 20
icon: telescope
works: offline
updated: 2026-11-08
related: [period-finder, object-altitude, observing-session, habitable-zone-calculator, observing-log]
sources:
  - "Sun, Moon and planet positions: astronomy-engine by Don Cross (MIT licence), accurate to about an arcminute."
  - "City coordinates and time zones: public geographic facts, typed by fibub."
flow:
  - { icon: target, label: "Planet" }
  - { icon: compass, label: "Your place" }
  - { icon: calendar, label: "Transits" }
---

## What it does

When an exoplanet crosses in front of its star, the star dims by a percent or so for an hour or a few. Amateurs with a small telescope and a camera can record it, and their timings help keep ephemerides up to date. The hard part is planning: transits happen at fixed moments, so you need the ones that fall in your night with the star high in the sky. This planner lists every transit in the coming weeks or months. Each one shows ingress, middle and egress on your clock, the star's altitude at each point, the Sun's depth and the Moon. It says whether you can see the whole event with baseline on each side, part of it, or none, and how far off the prediction could be.

To check that the target is high enough during the transit, use the [[object-altitude|target altitude planner]]; to fit the light curve you record, the [[transit-light-curve-fitter]].

## How to use it

1. Set your **place** at the top. Times show in the zone chosen there.
2. Pick a **planet**, or type your own: the star's right ascension and declination, the mid-transit time T₀ as a barycentric Julian date (BJD_TDB), the period in days and the transit duration in hours. The NASA Exoplanet Archive and ExoClock list these.
3. Optionally type the **uncertainties** of T₀ and the period. Each transit then shows its timing error, which grows with every orbit since T₀.
4. Set the **limits**: how far ahead to look, the lowest altitude you will accept, how dark the sky must be, and how much out-of-transit baseline you want on each side. Baseline lets you measure the star's normal brightness before and after.
5. Tap a row to plot that night: the star and the Sun over six hours, with ingress and egress marked. The CSV download gives every transit in UTC.

## How the times are worked out

Ephemerides are given in barycentric dynamical time, measured at the centre of mass of the solar system. Light reaches Earth up to 8.3 minutes earlier or later than it reaches that point, depending on where Earth is in its orbit. The planner removes that delay for your star's direction and converts to UTC, then to your clock. Altitudes include normal refraction. The Sun's depth uses its geometric altitude, the way twilight is defined.

## Worked example

HD 189733 b orbits every 2.21857567 days and transits for about 1.83 hours. From Toronto, the transit on the night of 2027 June 3 to 4 starts at about 02:15 EDT, peaks at 03:10 and ends at 04:05. The star climbs from 55° to 69° and the Moon is new, so the whole transit can be seen. But dawn arrives before the 30 minutes of baseline after egress, so it is marked "Transit" rather than "Full". With the published uncertainties, the timing is good to about ±0.7 minutes.

## Frequently asked questions

**Why are my times a few minutes off another planner?** Check that both use the same ephemeris. Some tools also ignore the barycentric correction or use heliocentric dates (HJD), which differ by up to a few seconds.

**Which planets suit a small telescope?** Deep transits (above 1 %) of stars brighter than magnitude 12, such as HD 189733 b and HD 209458 b, are good first targets.

**Is anything sent anywhere?** No. Everything runs in your browser and works offline.
