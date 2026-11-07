---
name: Sky coordinate converter
num: 23
shelf: science
section: research
title: "RA/Dec converter: J2000, JNow, galactic, ecliptic and alt/az (batch list too)"
summary: "Convert a sky position, or a whole target list, between J2000, JNow, galactic and ecliptic coordinates, and see where it is in your sky right now."
status: live
ads: true
order: 72
icon: target
works: offline
updated: 2026-11-07
related: [object-altitude, astro-time, telescope-calculator]
flow:
  - { icon: target, label: "Type it in" }
  - { icon: convert, label: "Convert" }
  - { icon: table, label: "See all" }
  - { icon: download, label: "Save CSV" }
---

## Why positions come in so many forms

The same star can be written several ways. Catalogues and papers use **J2000** right ascension and declination, which are fixed to the sky as it was at the start of 2000. Many telescope mounts point using **JNow**, the position "of date". JNow drifts from J2000 by about 50 arcseconds a year because Earth's axis slowly wobbles (precession). Radio astronomers and anyone mapping the Milky Way use **galactic** longitude and latitude. Planetary scientists use **ecliptic** coordinates, measured from the plane of Earth's orbit. And at the eyepiece, what matters is **altitude and azimuth**: how high the object is and in which direction. This converter shows all of them together.

## How to use it

1. **Set your place** at the top. Your place is only needed for altitude, azimuth and hour angle.
2. **Type an object** such as M42, NGC 7000, Andromeda or Jupiter, and its position fills in. Or choose which system your numbers are in and type them yourself.
3. Angles can be typed any common way: `05 35 17.3`, `5h35m17s`, `-5:23:28`, `-05° 23′ 28″`, or decimal degrees such as `83.82`. A single decimal number for right ascension is read as degrees, the way catalogues such as SIMBAD print it.
4. **At** sets the moment for JNow, altitude and azimuth. It starts at the current time.
5. For many targets, paste a list into **A whole list**, one per line as `name, RA, Dec`, and press **Convert the list**. You can also type just a catalogue name (such as `M13`) on a line. **Download CSV** gives a spreadsheet with every system as columns.

## What each result means

- **RA, Dec J2000:** catalogue position, shown in hours and degrees and in decimal degrees.
- **RA, Dec of date (JNow):** precessed and nutated to the moment you chose. Use it if your mount or app asks for JNow.
- **Galactic l, b:** l = 0 points to the centre of the Milky Way in Sagittarius, and b = 0 is the galaxy's mid-plane.
- **Ecliptic λ, β:** measured along and from the plane of the planets' orbits, using the J2000 ecliptic.
- **Altitude, azimuth and airmass:** altitude includes normal atmospheric refraction. Azimuth is measured from north through east. Airmass is how much air you look through (1.0 overhead, about 2 at 30°).
- **Hour angle:** time since the object crossed your meridian. A negative value means it is still rising.

## Worked example

Type **M42**. It fills in as RA 05h 35m 16.5s, Dec −05° 23′ 23″ (J2000). In November 2026 the JNow position is about 05h 36m 36s, −05° 22′ 19″. The galactic coordinates are about l = 209.01°, b = −19.38°, which puts the nebula well below the plane of the Milky Way, toward the galaxy's outer edge.

## Questions

**How accurate is it?** The conversions use the IAU rotation matrices in astronomy-engine and agree with professional tools to well under an arcsecond. That's more than enough for pointing and planning.

**Is my list uploaded?** No. Everything is worked out on your device, and the page keeps working offline once it has loaded.
