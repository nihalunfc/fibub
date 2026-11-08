---
name: Exoplanet mass calculator
num: 57
shelf: science
section: exoplanets
title: "Exoplanet mass calculator: planet mass from radial velocity K, and density from the transit"
summary: "Turn a star's radial velocity wobble into the planet's minimum mass (m sin i), or a planet mass into the wobble it causes; add a transit depth for the radius, density and gravity, with the velocity curve drawn."
status: live
ads: true
order: 12
icon: orbit
works: offline
updated: 2026-11-08
related: [transit-planner, habitable-zone-calculator, period-finder, blackbody-calculator]
flow:
  - { icon: curve, label: "Wobble K" }
  - { icon: star, label: "Star mass" }
  - { icon: orbit, label: "Planet mass" }
---

## What it does

A planet and its star both orbit their shared centre of mass, so the star moves towards and away from us. Spectrographs see that as a tiny Doppler shift, measured as the velocity semi-amplitude K. Together with the period and the star's mass, K gives the planet's mass. This calculator does that, or the reverse: how big a wobble a planet of a given mass would cause, to see whether an instrument could find it. If the planet also transits, the transit depth gives its radius, so you also get its density and surface gravity, which hint at what it is made of. The star's velocity curve over one orbit is drawn for any eccentricity.

## How to use it

1. Choose **Mass from the wobble** or **Wobble from the mass**.
2. Type the **star mass**, the **orbital period** in days and the **eccentricity** (0 for a circular orbit).
3. Type **K** in metres per second, or the **planet mass** in Jupiter or Earth masses.
4. If you know the **inclination**, type it: 90° is edge-on, as for a transiting planet. Leave it blank and the result is the minimum mass, m sin i.
5. Optionally type the **argument of periastron ω** to shape the velocity curve of an eccentric orbit, and the **transit depth** and **star radius** for the radius and density.

## How it is worked out

The mass function f = P K³ (1 − e²)^1.5 / (2πG) equals (m sin i)³ / (M* + m)². The calculator solves it exactly by iteration, so heavy planets and low-mass stars come out right too. The orbit size comes from Kepler's third law. The radius is R* × √depth, which ignores limb darkening and grazing transits. Fitting the full light curve refines it by a few percent.

## Worked example

51 Pegasi b, the first planet found round a Sun-like star, makes its star swing by K = 55.94 m/s every 4.2308 days. With a star of 1.11 solar masses, the minimum mass is 0.477 Jupiter masses (152 Earths) at 0.0530 AU. Jupiter pulls the Sun by 12.47 m/s over 11.86 years, and the Sun circles a point 1.07 solar radii from its centre, just outside its surface. A 1.01 % transit of a Sun-like star gives a Jupiter-sized planet with a density of 1.33 g/cm³. Earth moves the Sun by only 9 cm/s, below what today's best spectrographs can measure.

## Frequently asked questions

**Why only a minimum mass?** The Doppler shift only sees motion along our line of sight. A tilted orbit hides some of the motion, so the true mass is m / sin i, larger by 15 % on average.

**What K can be measured?** About 1 m/s with the best spectrographs on quiet stars, and 0.3 m/s or better with the newest. Active stars add several m/s of noise.

**Is anything sent anywhere?** No. Everything runs in your browser and works offline.
