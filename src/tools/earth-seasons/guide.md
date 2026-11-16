---
name: Earth's seasons
num: 2235
shelf: learn
code: L335
section: school-earth
title: "Earth's seasons: tilt, day length and the noon Sun"
summary: "Pick a latitude, a day of the year and a tilt for Earth's axis, and see how many hours of daylight there are and how high the Sun gets at noon. Set the tilt to zero to see why the seasons vanish."
status: live
ads: false
order: 2235
icon: orbit
works: offline
updated: 2026-11-16
related: [moon-phase-simulator, earth-energy-budget, sun-position-calculator]
sources:
  - "Day length and noon Sun height follow from the Sun's declination, about 23.44° × sin(360° × (day − 80) ÷ 365), and standard spherical astronomy (NGSS MS-ESS1-1). This simple model ignores the Sun's size and atmospheric refraction, so day lengths can differ by a few minutes from almanacs. Checked in tests/sci.mjs."
flow:
  - { icon: sliders, label: "Place, day" }
  - { icon: orbit, label: "Tilt" }
  - { icon: curve, label: "Day length" }
  - { icon: check, label: "Quiz" }
---

## What it does

The seasons are not caused by Earth being closer to the Sun in summer. They come from the **tilt** of Earth's axis, about 23.4°. When your hemisphere leans toward the Sun the days are longer and the Sun climbs higher, so the ground gets more heat. Half a year later the same place leans away and it is winter.

This page graphs the hours of daylight through the year for the latitude you choose, marks your chosen day, and gives the noon Sun height. Change the tilt to see a world with no seasons (0°) or extreme ones. For the Moon's changes see [[moon-phase-simulator]], for what happens to the heat see [[earth-energy-budget]], and for the real Sun position on any day use [[sun-position-calculator]].

## How to use it

1. Set the latitude. Positive is north, negative is south.
2. Slide the day of the year, or press a button such as "June solstice".
3. Read the daylight hours and the noon Sun height under the graph.
4. Change the tilt of the axis and watch the curve flatten or steepen.
5. Answer the quiz about the Sun's height at noon.

## What each setting does

- **Latitude:** how far north or south of the equator you are.
- **Day of the year:** 1 is 1 January, 172 is about 21 June.
- **Tilt of the axis:** Earth's real tilt is about 23.4°.
- **Buttons:** jump to the equinoxes and solstices.

## Worked example

At 43°N on the June solstice (day 172) the Sun's declination is 23.44°, so the noon height is 90 − (43 − 23.44) = 70.4° and the day is about 15 hours long. On the December solstice the noon Sun is only 90 − (43 + 23.44) = 23.6° high.

## FAQs

**Why is day length 12 hours at the equator all year?** The Sun's path is always centred over the horizon there, whatever the tilt.

**What happens at 80° latitude?** Near the pole the Sun can stay up all day (midnight Sun) or never rise (polar night).

**Is Earth closest to the Sun in summer?** For the northern hemisphere it is actually closest in early January.
