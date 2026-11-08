---
name: Mars time
num: 53
shelf: science
section: planetary-science
title: "Mars time: sol, Mars Sol Date, MTC and local solar time at Perseverance and Curiosity"
summary: "See the time on Mars now or at any Earth date: Mars Sol Date, Coordinated Mars Time, local mean and true solar time, the rovers' mission sols, the season and the dates of this Mars year's equinoxes and solstices."
status: live
ads: true
order: 10
icon: clock
works: offline
updated: 2026-11-08
related: [astro-time, orbit-transfer-calculator, habitable-zone-calculator, sky-events-calendar]
sources:
  - "Mars time: the published algorithm of Allison and McEwen (2000), as used by NASA's Mars24."
  - "Landing sites and times: NASA mission facts."
flow:
  - { icon: calendar, label: "Earth time" }
  - { icon: compass, label: "Place" }
  - { icon: clock, label: "Mars time" }
---

## What it does

A day on Mars, called a sol, lasts 24 hours 39 minutes 35 seconds, and its year runs 687 Earth days. Rover teams live on Mars time, NASA posts images by sol, and scientists describe the season by solar longitude, Ls. This tool turns any Earth moment into all of these. It gives the Mars Sol Date, Coordinated Mars Time on the prime meridian, the local mean and true solar time at a rover or any longitude, the mission sol, the season and Mars Year. It also shows how far Mars is from the Sun and from Earth, and the dates of this Mars year's equinoxes, solstices, perihelion and aphelion.

## How to use it

1. Choose **Now** for a live clock, **Earth date** to convert a moment on your own clock, or **Mission sol** to find when a rover's sol happened.
2. Choose **where on Mars**: Perseverance at Jezero crater, Curiosity at Gale crater, InSight at Elysium Planitia, the prime meridian, or any longitude east.
3. For a mission sol, type the sol number. The results show that sol's local noon, and when the sol began on your clock.

## What each time means

- **Mars Sol Date (MSD)**: a running count of sols, the Martian version of the Julian date.
- **Coordinated Mars Time (MTC)**: mean solar time on the prime meridian through Airy-0 crater, the Martian version of UTC.
- **Local mean solar time (LMST)**: the clock a rover team keeps. Noon is when an average Sun would be highest.
- **Local true solar time (LTST)**: sundial time. Mars's elliptical, tilted orbit makes the real Sun run up to 50 minutes ahead of or behind the mean Sun.
- **Solar longitude (Ls)**: the season, from 0° at the northern spring equinox through 90°, 180° and 270°. Dust storms are most common from Ls 180° to 330°, around perihelion.

## Worked example

On 2000 January 6 at 00:00 UTC, the worked example of Allison and McEwen (2000), the Mars Sol Date is 44795.99976, Coordinated Mars Time is 23:59:39 and Ls is 277.19°, northern winter in Mars Year 24. The equation of time is −5.19°, so a sundial ran almost 21 minutes behind the mean clock. Curiosity's sol 1000 began on 2015 May 30 at about 01:37 UTC, and Mars Year 39 began on 2026 September 30.

## Frequently asked questions

**How accurate is it?** It uses the Mars24 algorithm of Allison and McEwen (2000) as published by NASA's Goddard Institute for Space Studies. The results match its worked example to a fraction of a second.

**Why does sol 0 start before the landing?** Missions count the landing sol as sol 0, from the local midnight before touchdown. Curiosity landed in the mid-afternoon of sol 0.

**Which longitude convention is used?** Degrees east, as NASA has used since 2002. Older maps give longitudes west: subtract them from 360.

**Is anything sent anywhere?** No. Everything runs in your browser and works offline.
