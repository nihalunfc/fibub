---
name: Target altitude planner
shelf: science
section: observing
title: "Object altitude and airmass chart for tonight, with your own horizon"
summary: "Plot how high your targets climb through the night, against your own trees and roofs. Get meridian (pier flip) times, the hours above a useful height, airmass and parallactic angle for one target or a whole list."
status: live
ads: true
order: 12
icon: chart
works: offline
updated: 2026-11-07
related: [sky-tonight, sky-coordinates, observing-log, sky-events-calendar]
flow:
  - { icon: target, label: "Add targets" }
  - { icon: mountain, label: "Your horizon" }
  - { icon: chart, label: "See heights" }
  - { icon: download, label: "Take it out" }
---

## When is each target worth observing?

A target is best when it is high. Up there you look through the least air, the image is steadier, and light pollution near the horizon matters less. Most planetarium apps assume a perfectly flat horizon, but real gardens have trees, houses and streetlights. This planner draws the height of every target through the night over the sky's colour, so you can see day, twilight and true dark. It also checks each target against a horizon you draw yourself.

## How to use it

1. **Set your place and the night** at the top. Your location stays on your device.
2. **Add targets.** Type a catalogue name (M31, NGC 7000, IC 434), a common name (Andromeda, Orion Nebula), or a planet or the Moon. For anything else, type `name, RA, Dec` in J2000. To add a whole observing list at once, open **Paste a list**.
3. Choose your **lowest useful height**. 30° is a common choice: below it you look through twice as much air as overhead (airmass 2).
4. Read the chart. A dashed line marks your lowest height. Where a target's line turns dotted, your horizon hides it.
5. The **summary** gives, for each target, the hours it is above your height while it's dark, when it crosses the meridian, its best moment, its lowest airmass, and how long your horizon hides it.
6. Open **Hour by hour** for height, airmass and parallactic angle every hour. That's what you need to schedule a long imaging run or line up a spectrograph slit.
7. **Your horizon:** tap or drag on the strip to draw obstacles in each direction, in degrees. Save it as a small file to reuse next time, or open a saved one.

## Terms explained

- **Meridian (pier flip):** the moment a target crosses due south (or north in the southern hemisphere) and is highest. German equatorial mounts usually have to "flip" around this time, so plan a pause in your imaging sequence.
- **Airmass:** how much air you look through compared with straight up. 1.0 is overhead, 1.15 is 60°, 1.55 is 40° and 2 is 30°. Many observers stop imaging above airmass 1.5 to 2.
- **Parallactic angle:** the angle between the direction to the celestial pole and straight up, at the target. Spectroscopists line their slit up with it to reduce colour smearing from the atmosphere.

## Worked example

From Toronto on 7 November 2026, M31 is above 30° from the end of twilight (18:40) until 03:30, which is almost 9 hours of good dark time. It crosses the meridian at 21:52, 88° up, almost overhead. The Pleiades (M45) rise later and are highest just before 1 am. Draw a 35° tree line to the east and the summary shows how many minutes the Pleiades lose behind it.

## Questions

**Is my list or horizon kept?** Your targets and horizon are kept for this tab only, so they stay while you switch between astronomy tools. To keep your horizon for good, use **Save horizon file**. Nothing is uploaded.

**How accurate are the times?** Within a minute or so. Positions come from astronomy-engine and include normal atmospheric refraction.
