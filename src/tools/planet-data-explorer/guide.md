---
name: Planet data explorer
num: 74
shelf: science
section: planetary-science
title: "Planet and moon data explorer: compare sizes, gravity, density and orbits"
summary: "Every planet, Pluto and the large moons in one sortable table: compare any two to scale, plot any two quantities (such as Kepler's third law) and see your weight on each world."
status: live
ads: true
order: 21
icon: orbit
works: offline
updated: 2026-11-08
related: [habitable-zone-calculator, impact-crater-calculator, orbit-transfer-calculator, mars-time, jupiter-moons]
sources:
  - "Planets: NASA Planetary Fact Sheet (NSSDCA), a US government source."
  - "Moons: JPL Solar System Dynamics planetary satellite parameters (NASA)."
  - "Moon counts: confirmed moons, mid-2025."
flow:
  - { icon: table, label: "Worlds" }
  - { icon: chart, label: "Compare" }
  - { icon: orbit, label: "Explore" }
---

## What it does

The Solar System's worlds differ by factors of thousands: Jupiter is over 300 times as heavy as the Earth, Saturn would float in water, and Phobos's gravity is so weak that a good jump would throw you into orbit. This tool puts the main numbers for the eight planets, Pluto and eleven large moons in one place, from NASA's Planetary Fact Sheet and JPL's satellite tables, and lets you explore them three ways.

- **The table** lists radius, mass, density, surface gravity, escape speed, orbit size, year, day, axial tilt, mean temperature and number of moons. Tap any heading to sort by it. "R" marks a backwards (retrograde) spin or orbit, as for Venus, Uranus, Pluto and Triton.
- **Compare two worlds** draws them side by side at the same scale and gives each ratio in plain words, such as how many Earths would fit inside Jupiter.
- **Plot any two quantities** puts every world on a chart, with logarithmic axes where the range is huge. Some famous patterns show up at once. Orbit size against year traces **Kepler's third law** as a straight line for each family of orbits, and density against radius splits the rocky worlds from the icy moons and the gas giants.
- **Your weight on each world** shows what a bathroom scale would read.

To see whether a world could hold liquid water, use the [[habitable-zone-calculator]]; to plan a trip between two of them, the [[orbit-transfer-calculator]].

## How to use it

1. Choose planets, moons or both at the top. The table, the plot and the weight list follow your choice.
2. Pick any two worlds to compare, including a moon against a planet (Ganymede is bigger than Mercury, but less than half as heavy).
3. Pick the quantities for the plot's two axes.
4. Type your weight to see it everywhere. Download the full data as a CSV, or the page as a PNG, PDF or Word file.

## Where the numbers come from

Planet values are the metric NASA Planetary Fact Sheet (D. R. Williams, NSSDCA). Radii there are equatorial, and the giants' gravity is measured at the 1-bar level and includes their fast spin. Moon values are JPL Solar System Dynamics mean radii, masses (from GM) and mean orbital elements; their gravity and escape speed are worked out from mass and radius. Moon counts are the confirmed moons as of mid-2025. They change often as new small moons are found, so check the official source.

## Worked example

Compare Earth with Mars. Mars is 0.532 times as wide and 0.108 times as heavy, so the Earth could hold 6.6 worlds the size of Mars. Its surface gravity is 3.7 m/s², 38 % of Earth's, so someone who weighs 70 kg at home would read 26.4 kg on a scale there (and 11.6 kg on the Moon). Sunlight takes 12.7 minutes to reach Mars against 8.32 minutes to reach Earth. Plot orbit size against year for the planets: the points fall on a straight line of slope 3/2 on the log axes. Switch to moons and Jupiter's four big moons sit on their own parallel line, because they orbit a different, heavier body.

## Frequently asked questions

**Why is Saturn's density below 1?** Saturn is mostly hydrogen and helium. Its average density, 0.687 g/cm³, is less than water's, although its core is dense.

**Why is Jupiter's gravity 23.1 m/s² and not 24.8?** The fact sheet gives it at the equator, where the fast spin flings things outwards a little, at the 1-bar level.

**Does it work offline?** Yes. All the data are in the page.
