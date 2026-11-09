---
name: Kepler's laws orbit lab
num: 1027
shelf: learn
section: school-physics
title: "Kepler's laws simulator: launch a planet, see the ellipse, equal areas in equal times, T² = a³, escape speed and g with height and depth"
summary: "Set a planet's launch speed and watch its orbit become a circle, an ellipse or an escape; see equal areas swept in equal times, check T² = a³ against the planets, and find how g changes above and below the Earth's surface."
status: live
ads: false
order: 1027
icon: orbit
works: offline
updated: 2026-11-09
related: [two-body-orbit, orbit-elements, energy-track]
sources:
  - "Newton's law of gravitation, Kepler's three laws, escape speed √(2GM/r) and g = g₀R²/r² outside and g₀r/R inside a uniform sphere: standard school physics found in any textbook. Planet distances and periods are rounded general values; 1 AU/yr = 4.7405 km/s from the IAU astronomical unit and the Julian year."
  - "Positions from Kepler's equation were checked against an independent velocity-Verlet integration of Newton's gravity; the swept areas by summing small triangles; g and escape speed against hand-worked values."
flow:
  - { icon: pointer, label: "Launch" }
  - { icon: orbit, label: "Ellipse" }
  - { icon: chart, label: "T² = a³" }
  - { icon: target, label: "g and depth" }
---

## What it does

A planet is launched sideways at 1 AU (the Earth's distance) from a Sun-like star. Change the **launch speed** with the slider or by dragging the arrow tip, and its orbit changes in front of you: at 29.8 km/s it is a **circle** (the Earth's orbit), faster or slower it is an **ellipse** with the star at one focus, and at 42.1 km/s or more it **escapes**. The orbit is shaded in twelve slices, each swept in the same time, so you can see the **equal areas** law: short, wide slices near the star, long thin ones far away. Press Play and the planet speeds up and slows down as it should.

The **T² = a³** view puts the eight planets on log scales, where Kepler's third law is a straight line, with your launched orbit added as an extra dot. The **g above and below** view shows how gravity weakens with height (inverse square) and falls to zero at the centre of a model Earth.

It follows the school topics on gravitation: the universal law of gravitation, free fall, g and the difference between mass and weight (Class 9 Science, gravitation), and Kepler's laws, the variation of g with height and depth, escape speed and orbital energy (Class 11 Physics, gravitation). For two bodies orbiting each other see [[two-body-orbit]], for real orbital elements [[orbit-elements]], and for energy on Earth [[energy-track]].

## How to use it

1. Pick a **Level**. Class 9 keeps to the laws in words, the inverse square law and weight. Class 11 adds the line to the star, the area of each slice, the orbit's energy and the formulas for g inside and outside.
2. In **Launch a planet**, drag the arrow tip up or down, or use the slider. Tick or untick the shading. Press **Play** to watch one orbit take about six seconds.
3. In **T² = a³**, read the table: T² ÷ a³ is close to 1 for every planet.
4. In **g above and below**, slide from 6,371 km deep (the centre) to three Earth radii up.

## Worked example

Open the page: launched at **36 km/s**. The orbit is an ellipse with **e = 0.46**, closest to the star at **1 AU** (where it was launched) and farthest at **2.709 AU**. The semi-major axis is **a = 1.855 AU**, so T = a^1.5 = **2.526 years** (923 days); the page checks T² = 6.38 = a³. Each shaded slice has the same area, **0.7993 AU²**, swept in T/12 = 76.9 days.

Slow it to **25 km/s**: it is now launched at its farthest point and falls inwards to 0.544 AU; its year is 248 days.

In g above and below, one Earth radius up (**6,371 km**) the page shows **g = 2.45 m/s²**, a quarter of 9.8, and a 50 kg student weighs 122.5 N instead of 490 N. The escape speed from the surface is **11.2 km/s**.

## Tips

- A planet in an ellipse is fastest at its closest point and slowest at its farthest, because the line to the star sweeps equal areas in equal times.
- The period depends only on the semi-major axis, not on how stretched the ellipse is.
- Mass is the amount of matter and stays the same everywhere; weight is the pull of gravity, m × g, and changes.

## FAQ

**Why does the escape speed equal √2 times the circular speed?** Escape needs the kinetic energy ½mv² to match the gravitational energy GMm/r, which gives v = √(2GM/r); a circular orbit needs v = √(GM/r).

**Is the inside of the Earth really like this?** No. The model treats the Earth as a uniform ball. The real Earth has a dense core, so g actually rises a little as you go down at first.

**Is anything stored?** No. Everything is worked out in your browser.
