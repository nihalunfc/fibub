---
name: Orbit transfer calculator
num: 47
shelf: science
section: spaceflight-and-astrodynamics
title: "Hohmann transfer calculator: delta-v, transfer time and launch windows"
summary: "Delta-v, burn by burn, and transfer time between two circular orbits around Earth, the Moon, Mars, Jupiter or the Sun, with the target's lead angle, how often launch windows come round, and a bi-elliptic comparison."
status: live
ads: true
order: 20
icon: orbit
works: offline
updated: 2026-11-08
related: [rocket-equation, cosmology-calculator, sky-events-calendar]
sources:
  - "Gravitational parameters and radii: JPL and IAU values."
flow:
  - { icon: orbit, label: "Two orbits" }
  - { icon: calculator, label: "Burns" }
  - { icon: clock, label: "Timing" }
---

## What it does

A Hohmann transfer is the cheapest way, with two short engine burns, to move between two circular orbits in the same plane: one burn stretches the orbit into an ellipse that touches the target orbit, and a second burn at the far side makes it circular again. This calculator works out both burns, the total delta-v, the time the transfer takes, where the target has to be when you leave, and how often that alignment comes round. It can also compare a bi-elliptic transfer, which uses three burns and can be cheaper for very different orbits.

To see whether a rocket can deliver the delta-v, use the [[rocket-equation]]; to choose launch dates between planets, the [[porkchop-plot]].

## How to use it

1. Pick the body you are orbiting: Earth, the Moon, Mars, Venus, Jupiter or the Sun.
2. Type the start and target **altitudes** in km above the surface, or, around the Sun, the **distances in AU** (Earth is 1). The quick buttons fill in common cases such as low Earth orbit to geostationary orbit, or Earth to Mars.
3. Optionally type a **bi-elliptic apoapsis**, the far point of the intermediate orbit, to compare a three-burn transfer.
4. The diagram shows the start orbit in grey, the target in black and the transfer path in colour.

## How it works

Circular speed is v = √(μ/r). The transfer ellipse has semi-major axis a = (r₁ + r₂)/2, and the vis-viva equation v = √(μ(2/r − 1/a)) gives the speed at each end. Each burn is the difference between the circular and ellipse speeds. The transfer takes half the ellipse's period, π√(a³/μ). The lead angle is how far the target moves while the craft travels half way round, taken from 180°, and the synodic period 1/|1/T₁ − 1/T₂| is how often the two orbits line up again. Gravitational parameters μ are the standard values (Earth 398,600.4418 km³/s²; Sun 1.327 × 10¹¹ km³/s²).

## Worked example

From a 300 km low Earth orbit to geostationary orbit (35,786 km up), the first burn is 2.426 km/s and the second 1.467 km/s, 3.893 km/s in all, and the transfer takes 5.28 hours. Around the Sun, from Earth's orbit (1 AU) to Mars's (1.524 AU), the burns are 2.95 and 2.65 km/s relative to the planets' orbits, the trip takes about 259 days, Mars must be about 44° ahead of Earth at launch, and windows come round every 780 days, about 26 months.

## Frequently asked questions

**Why does a real Mars launch need more than 2.95 km/s?** The rocket must first leave Earth's gravity, and planetary orbits are slightly elliptical and tilted. Leaving low Earth orbit for Mars takes about 3.6 km/s.

**When is a bi-elliptic transfer better?** When the larger orbit is more than about 11.94 times the smaller one, and always above 15.58, though it takes much longer.

**Does anything leave my device?** No. Everything is worked out in your browser and works offline.
