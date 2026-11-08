---
name: Sun position calculator
num: 61
shelf: science
section: solar-physics
title: "Sun position calculator: altitude, azimuth, shadow length, sunrise, sunset and sun path"
summary: "Find where the Sun is at any place and moment: its altitude and azimuth, how long shadows are, sunrise, sunset, solar noon, twilight, a sun path diagram and a year of day lengths."
status: live
ads: true
order: 10
icon: compass
works: offline
updated: 2026-11-08
related: [sky-tonight, object-altitude, dark-sky-calendar, astro-time, time-zone-planner, sky-events-calendar]
flow:
  - { icon: compass, label: "Your place" }
  - { icon: clock, label: "Date, time" }
  - { icon: target, label: "Sun's place" }
---

## What it does

This calculator tells you where the Sun is in the sky from any place on Earth at any moment from the year 1700 to 2300. It gives the Sun's **altitude** (height above the horizon) and **azimuth** (compass direction), how long the shadow of a person, pole or building is and which way it points, and the Sun's position among the stars. For the whole day it lists sunrise and sunset with their compass directions, solar noon and the Sun's greatest height, the three kinds of twilight, the day length and how it is changing, and the equation of time.

Three pictures help with planning. The first shows the Sun's height through the day. The second is a **sun path diagram**, the kind architects, gardeners and solar panel installers use: a map of the sky seen from above, with the Sun's track on your date and on the longest and shortest days. The third shows the day length through the year. A table gives sunrise, sunset and noon height on the 21st of every month, and another lists the equinoxes and solstices. Everything is worked out in your browser; your place never leaves your device.

## How to use it

1. Set your **place** in the bar at the top: pick a city, type latitude and longitude, or use your device's location. "Times in" picks the clock every time is shown on.
2. Choose the **date** and **time**, or press **Now**. The time is read on the clock chosen in "Times in".
3. Optionally change the **object height** to get the shadow of something other than a 1 m stick.
4. Read the results. Tap **Every day of the year** for a CSV of sunrise, noon, sunset, day length, noon height and the equation of time for all 365 days, in UTC so it opens cleanly in any spreadsheet. The download buttons save the whole page as a PNG, PDF or Word file.

## What each result means

- **Altitude** is the angle above the horizon, including the normal bending of light by the air (refraction), which lifts the Sun by about half a degree at the horizon. Negative means below the horizon.
- **Azimuth** is the compass bearing, measured from true north through east: 90° is east, 180° south, 270° west. Magnetic compasses differ by the local magnetic declination.
- **Shadow** length is the object height divided by the tangent of the altitude, and the shadow points directly away from the Sun.
- **Sunrise and sunset** are the moments the top edge of the Sun meets a flat horizon, as almanacs give them.
- **Solar noon** is when the Sun crosses the meridian and stands highest. It is rarely 12:00 on the clock, because of time zones, summer time and the equation of time.
- **Civil, nautical and astronomical twilight** start and end when the Sun is 6°, 12° and 18° below the horizon. Between the astronomical times the sky is fully dark.
- **Equation of time** is how far apparent solar time (a sundial) is ahead of mean solar time. It swings between about −14 minutes in February and +16 minutes in early November, because Earth's orbit is an ellipse and its axis is tilted.

## How it is worked out

Positions come from astronomy-engine, an open-source library that follows the VSOP87 planetary theory and the IAU precession and nutation models. Its Sun positions agree with the US Naval Observatory to within an arcminute or so, and rise and set times to within about a minute. The day for sunrise and sunset is the calendar date at your longitude, so a place far from its time zone's centre still gets the right day.

## Worked example

Toronto (43.65° N, 79.38° W) on the June solstice, 21 June 2026, with times in Toronto's own zone (EDT):

- Sunrise at 05:36, azimuth 56° (north-east); sunset at 21:02, azimuth 304° (north-west).
- Solar noon at 13:19, with the Sun 69.8° high. Day length: 15 h 27 min.
- At 15:00 the Sun is 61.1° high at azimuth 234° (south-west). A 1.8 m person casts a shadow about 0.99 m long pointing north-east.
- On 21 December the day lasts only 8 h 56 min and the noon Sun reaches 23° (sunrise 07:47, sunset 16:43).

These agree with the US Naval Observatory's tables for Toronto to within a minute; the calculator shows whole minutes without rounding up.

## Frequently asked questions

**Why is solar noon not at 12:00?** Clocks keep the same time across a whole zone, often an hour ahead in summer. Toronto lies west of the centre of its zone, and summer time adds an hour, so noon falls around 13:15 in June.

**Which way should a solar panel face?** In the northern hemisphere, towards true south (azimuth 180°); in the southern, towards true north. The sun path diagram shows when nearby trees or buildings would block the Sun at different times of year.

**Why does the shortest day not have the latest sunrise?** The equation of time shifts solar noon later through December, so in the northern hemisphere the earliest sunset comes before the solstice and the latest sunrise after it.

**Does it work offline?** Yes. Once the page has loaded, every calculation runs in your browser with no internet connection.
