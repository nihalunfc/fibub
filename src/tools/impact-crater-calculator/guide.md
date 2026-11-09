---
name: Impact crater calculator
num: 58
shelf: science
section: planetary-science
title: "Impact crater calculator: crater size and energy from an asteroid, or the asteroid from a crater"
summary: "Work out the crater an asteroid or comet would dig on the Earth, the Moon or Mars, the energy in megatons and how often such impacts happen, or work back from a crater to the size of the body that made it."
status: live
ads: true
order: 12
icon: target
works: offline
updated: 2026-11-08
related: [orbit-transfer-calculator, rocket-equation, mars-time, uncertainty-calculator]
sources:
  - "Crater scaling: the equations of Collins, Melosh and Marcus (2005), Earth Impact Effects Program."
  - "Surface gravity and crater transition sizes: typical values from NASA and textbooks, rounded."
flow:
  - { icon: star, label: "Impactor" }
  - { icon: mountain, label: "Ground" }
  - { icon: target, label: "Crater" }
---

## What it does

When a body from space hits a planet, it digs a hole far bigger than itself, typically 20 times its own diameter. This calculator works out how big the crater would be and how much energy the impact releases. Craters on the Earth, the Moon and Mars are covered. It can also work backwards from a crater you have measured, on a photo of the Moon or on a map, to the size of the impactor. It uses the scaling laws of Collins, Melosh and Marcus (2005), the same ones behind the Earth Impact Effects Program, and draws how crater size grows with impactor size.

For the impactor's path and speed before it hits, use the [[orbit-transfer-calculator]]; for the world it hits, the [[planet-data-explorer]].

## How to use it

1. Choose **Crater from impactor** or **Impactor from crater**.
2. Pick **where**: the Earth, the Moon or Mars. Gravity, and the size at which craters turn complex, change with the body.
3. Pick the **ground** and the **impactor**: ice for comets, porous or dense rock for most asteroids, iron for metal ones.
4. Type the impactor **diameter** in metres (or the crater diameter in km), the **speed** at impact and the **angle** above the ground.
5. Or tap a quick example.

## What each result means

- **Energy**: half the mass times the speed squared, in tonnes, kilotons or megatons of TNT (1 megaton is 4.184 × 10¹⁵ J).
- **Transient crater**: the bowl dug in the first seconds, D = 1.161 (ρi/ρt)^⅓ L^0.78 v^0.44 g^−0.22 sin^⅓θ.
- **Final crater**: small craters slump into a bowl 1.25 times wider. Above the transition size, 3.2 km on Earth, 7 km on Mars and about 18 km on the Moon, the walls collapse into terraces and the floor rises into a central peak.
- **How often**: on Earth, the average time between impacts of at least this energy, 109 × E^0.78 years with E in megatons.

## Worked example

A 50 m stony asteroid (3000 kg/m³) hitting sedimentary rock at 17 km/s and 45° releases 6.78 megatons, about 450 Hiroshima bombs. It digs a transient crater 1.02 km wide and 361 m deep, which settles into a simple bowl 1.28 km across. Impacts this large happen about once every 490 years on average, though most such stony bodies would break up in the air. A 1 km rock at the same speed releases about 54,000 megatons and leaves a complex crater 14.5 km wide; that happens about once in 540,000 years.

## Frequently asked questions

**How accurate is it?** Within about a factor of 1.5. Layered ground, water, porosity and the exact angle all change real craters. Lower angles make shallower, sometimes oval craters.

**Why does the atmosphere matter?** Air slows and breaks up small bodies. The 2013 Chelyabinsk meteor, about 20 m across, exploded high in the air and left no crater. The Moon has no air, so every impactor reaches the ground.

**Is anything sent anywhere?** No. Everything runs in your browser and works offline.
