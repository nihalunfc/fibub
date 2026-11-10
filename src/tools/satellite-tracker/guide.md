---
name: Satellite tracker
num: 66
shelf: science
section: spaceflight-and-astrodynamics
title: "Satellite tracker"
summary: "Paste a satellite's TLE or design an orbit to see its ground track on a world map, its period, speeds and how Earth's bulge turns it, and the times it passes over your place."
status: live
ads: true
order: 30
icon: orbit
works: offline
updated: 2026-11-08
related: [orbit-transfer-calculator, link-budget-calculator, rocket-equation, porkchop-plot, sky-tonight, object-altitude]
sources:
  - "World map: Natural Earth land outlines (public domain)."
  - "Earth constants: WGS 84 and the J2 term used by NORAD two-line elements."
  - "Orbit data: the two-line element set you paste."
flow:
  - { icon: orbit, label: "Orbit" }
  - { icon: compass, label: "Map track" }
  - { icon: clock, label: "Passes" }
---

## What it does

This tool shows where a satellite flies over the Earth and when it passes over you. Give it an orbit, either the two-line element set (TLE) that tracking agencies publish for every satellite or the heights and tilt of an orbit you design. It draws the **ground track** on a world map, solid where the satellite is in sunlight and dashed where it is in Earth's shadow, with the circle of ground that can see it right now. It gives the orbit's **period**, **speeds**, how fast **Earth's equatorial bulge** turns the orbit plane and the perigee, whether the orbit is **sun-synchronous**, and a table of **passes** over your place with rise, highest point and set times and compass directions. Passes when the satellite is sunlit and your sky is dark are marked **Visible**: those are the ones you can see with your own eyes.

For the radio link during a pass, use the [[link-budget-calculator]]; to change the orbit, the [[orbit-transfer-calculator]].

## How to use it

1. Set your **place** at the top. Times show on the clock chosen in "Times in".
2. Choose **Design an orbit** and pick an example, or type your own perigee and apogee heights, inclination, ascending node and argument of perigee. A designed orbit starts at its perigee at this moment.
3. Or choose **Paste a TLE** and paste the three lines (name, line 1, line 2) from CelesTrak or Space-Track. The checksums are checked, so a mistyped digit is caught.
4. Choose how much track to draw, how many days of passes to list, and the lowest pass height to include.
5. Download the track as a CSV (time, latitude, longitude, height, sunlit), or the page as a PNG, PDF or Word file.

## What each number means

- **Perigee and apogee** are the lowest and highest points of the orbit, measured above the equator's radius.
- **Inclination** is the tilt of the orbit to the equator. The track reaches that latitude north and south. Above 90° the satellite moves westward, against Earth's spin.
- **Orbit plane turns**: Earth's bulge (the J2 term) makes the orbit plane swing round. When it turns 0.9856° a day eastward, once a year, the orbit is **sun-synchronous** and passes over each place at the same local time, which is what Earth-imaging satellites want.
- **Perigee moves**: the bulge also turns the orbit within its own plane, except at the critical inclination of 63.4°, which Molniya orbits use to keep their high point over the north.
- **Visible**: sunlit while your Sun is more than 6° below the horizon and the satellite at least 10° up.

## How it is worked out

Positions use Kepler's equation with the long-term J2 rates of the node, perigee and mean motion, plus the TLE's mean-motion change for drag. Positions are turned into map coordinates with Greenwich sidereal time and the WGS-84 ellipsoid. This is not the full SGP4 model that TLEs are made for, so pass times drift by seconds to a minute over a few days. Map outlines are from Natural Earth, which is in the public domain.

## Worked example

The space station example (415 × 422 km at 51.64°) circles the Earth every **92.9 minutes** at about **7.66 km/s**. Earth's bulge turns its plane **−4.950° a day**, westward, so the time of its passes shifts from night to night. Its perigee moves **+3.69° a day**. At 10° above the horizon it can be seen up to about 1,400 km from the point below it.

The Sun-synchronous example at 700 km needs an inclination of **98.19°**. The tool shows its plane turning +0.986° a day, matching Earth's yearly trip round the Sun. The Molniya example's perigee moves only 0.0004° a day, and the geostationary example's track is a single dot that stays put over the equator.

## Frequently asked questions

**Where do I get a TLE?** CelesTrak (celestrak.org) lists current TLEs for thousands of satellites; search for the name or the catalogue number (25544 is the ISS). This tool never fetches anything, so paste it in.

**How old can a TLE be?** For low satellites, a day or two for accurate pass times. Drag changes their orbits quickly, so after a week the times can be several minutes off.

**Why are some passes not visible?** In daylight the satellite is lost in the bright sky, and late at night it is usually in Earth's shadow. The best passes come in the hour or two after dusk and before dawn.

**Does it work offline?** Yes. Everything runs in your browser, and your TLE and place stay on your device.
