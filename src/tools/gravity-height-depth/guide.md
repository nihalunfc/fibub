---
name: g with height, depth and satellites
num: 1339
shelf: learn
section: school-physics
title: "g with height and depth: how gravity changes above and below the Earth, satellite speed, period, escape speed and the geostationary orbit"
summary: "Slide a point from the centre of the Earth, Mars or the Moon out into space and watch g change: in a straight line inside, as 1/r² outside. Read your weight there, the speed and period of a satellite at that height, the escape speed and the height of the geostationary orbit."
status: live
ads: false
order: 1339
icon: orbit
works: offline
updated: 2026-11-09
related: [kepler-orbits, two-body-orbit, orbit-transfer-calculator, newtons-laws]
sources:
  - "Newton's law of gravitation, g = GM/r² outside a planet and g₀(1 − d/R) inside a planet of even density (shell theorem), circular orbit speed √(GM/r), period 2πr/v, escape speed √(2GM/r) and orbital energy −GMm/2r: standard school physics found in any textbook. G = 6.6743 × 10⁻¹¹ N m²/kg² (CODATA 2018)."
  - "GM, mean and equatorial radii and sidereal rotation periods of the Earth, Mars and the Moon: NASA planetary fact sheets (public domain), rounded."
  - "Checked against known values: the geostationary height of 35 786 km, the Space Station's 7.67 km/s at 400 km, the Earth's escape speed 11.19 km/s and Mars' stationary orbit near 17 030 km."
flow:
  - { icon: pointer, label: "Pick height" }
  - { icon: curve, label: "g graph" }
  - { icon: orbit, label: "Satellite" }
  - { icon: check, label: "Check" }
---

## What it does

Gravity gets weaker as you go up, but it also gets weaker as you go **down** a deep mine. This tool shows both on one graph. Slide a point from the centre of the Earth (or Mars, or the Moon) out to seven times its radius and watch **g**, the pull on each kilogram, change: it rises in a straight line from zero at the centre to its surface value, then falls as 1/r² out in space.

At any height above the surface it also treats the point as a **satellite** going round in a circle and gives its speed, the time for one orbit, the escape speed from there and its energy. The "Stationary orbit" button finds the height at which a satellite goes round once per turn of the planet, so it hangs over one place: the **geostationary orbit** used for TV and weather satellites.

It follows the school topics on gravitation: g and how it changes with height and depth, escape speed and Earth satellites (Class 11 Physics, gravitation), and the mass and weight ideas from Class 9. For the shape of orbits and Kepler's laws see [[kepler-orbits]], for two bodies pulling on each other [[two-body-orbit]], and for moving from one orbit to another [[orbit-transfer-calculator]].

## How to use it

1. Pick the **planet**: Earth, Mars or the Moon.
2. Drag the **slider**, or drag along the graph, to move the point. Minus heights are depths below the surface. You can also type an exact height in kilometres.
3. Type **your mass** to see your weight there. The mass never changes; the weight does.
4. Tap a preset: the surface, halfway down to the centre, the Space Station's height (400 km) or the stationary orbit.

The dashed line near the surface is the school short cut g(1 − 2h/R). It is good for heights much smaller than the radius and goes wrong further up.

## Worked example

Open the page: the Earth, **400 km** up, a 50 kg student. The Earth's GM is 3.986 × 10¹⁴ m³/s² and its mean radius 6371 km, so at the surface g = 3.986 × 10¹⁴ ÷ 6 371 000² = **9.820 m/s²** (school books round it to 9.8). At 400 km, r = 6771 km and g = 3.986 × 10¹⁴ ÷ 6 771 000² = **8.694 m/s²**, which is **88.5 %** of the surface value. The student weighs 434.7 N instead of 491.0 N. Astronauts float not because gravity is gone but because they are falling round the Earth with their station.

A satellite at that height moves at √(GM/r) = **7.673 km/s** and goes round in **92.4 min**. The escape speed from there is **10.851 km/s**, √2 times as much. Each kilogram has kinetic energy 29.43 MJ and potential energy −58.87 MJ, so its total energy is −29.43 MJ.

Tap **Halfway down**: at a depth of 3185 km, about half the radius, g = 9.820 × (1 − 3185 ÷ 6371) = **4.911 m/s²**, half the surface value. Tap **Stationary orbit**: **35 786 km** above the equator.

## Tips

- Going up one radius quarters g; going halfway down only halves it.
- The orbit speed does not depend on the satellite's mass.
- A higher orbit is slower and takes longer, but has more total energy.

## FAQ

**Is g really zero at the centre?** Yes: the planet pulls equally in every direction there.

**Why does the real Earth differ inside?** The Earth's core is much denser than its rocks, so g actually rises a little going down before falling. The even-density model is what the school books use.

**Why no stationary orbit for the Moon?** The Moon turns once in 27.3 days, so the orbit would be about 88 000 km up, where the Earth's pull is stronger than the Moon's.

**Is anything stored?** No. It all runs in your browser.
