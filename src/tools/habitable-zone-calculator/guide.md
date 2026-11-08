---
name: Habitable zone calculator
num: 52
shelf: science
section: exoplanets
title: "Habitable zone calculator: Kopparapu limits, equilibrium temperature and starlight for any star"
summary: "Find the habitable zone of any star from its temperature and luminosity, and see whether a planet sits inside it, how much starlight it gets, its equilibrium temperature and its orbital period."
status: live
ads: true
order: 10
icon: orbit
works: offline
updated: 2026-11-08
related: [transit-planner, magnitude-flux-converter, orbit-transfer-calculator, period-finder]
flow:
  - { icon: star, label: "Star" }
  - { icon: orbit, label: "Planet" }
  - { icon: target, label: "Zone" }
---

## What it does

The habitable zone is the band of orbits around a star where a rocky planet with an Earth-like atmosphere could keep liquid water on its surface. This calculator works out its edges for any star from 2600 to 7200 K, using the climate model fits of Kopparapu et al. (2014), and places your planet against them. It also gives the starlight the planet receives, its equilibrium temperature and its orbital period, with a diagram and a table of every edge.

## How to use it

1. Pick a **star** or type your own temperature, luminosity and mass. If you only know the radius, leave the luminosity blank and type the radius: the luminosity comes from L = R² (T / 5772 K)⁴.
2. Pick a **planet**, or type its distance in AU, or its orbital period in days. The tool turns a period into a distance with Kepler's third law and the star's mass.
3. Set the **albedo**, the share of light the planet reflects. Rocky planets without thick clouds are usually 0.2 to 0.35.
4. Choose the **planet mass**. Heavier planets hold more air, which pushes the runaway greenhouse limit slightly closer to the star.
5. Choose the **heat spread**. A fast-spinning planet or one with thick air spreads heat round the whole globe. A tidally locked planet with no air keeps it on the day side, which is 19 % warmer.

## What the edges mean

- **Recent Venus**: Venus seems to have had no surface water for at least a billion years, so a planet getting more starlight than Venus did then is probably dry. This is the optimistic inner edge.
- **Runaway greenhouse**: oceans evaporate completely. This is the conservative inner edge.
- **Maximum greenhouse**: beyond here even a thick carbon dioxide atmosphere cannot keep the surface above freezing. This is the conservative outer edge.
- **Early Mars**: Mars had flowing water 3.8 billion years ago, when the young Sun was dimmer. This is the optimistic outer edge.

## Worked example

For the Sun, the conservative zone runs from 0.951 to 1.677 AU and the optimistic zone from 0.751 to 1.769 AU. Earth, at 1 AU with an albedo of 0.306, has an equilibrium temperature of 254 K (−19 °C); the greenhouse effect lifts its real average to about 288 K. Proxima b, at 0.0485 AU from a star of 0.00155 Suns, gets 0.659 times Earth's starlight and orbits in 11.2 days, inside the conservative zone of 0.0410 to 0.0814 AU. With an albedo of 0.3 its equilibrium temperature is 229 K, or 273 K on the day side if it is tidally locked with no air.

## Frequently asked questions

**Does being in the habitable zone mean a planet has life?** No. It only means liquid water is possible with the right atmosphere. The planet also needs to be rocky, to keep its air, and to survive its star's flares.

**Why is my star flagged as outside the range?** The fits cover stars from 2600 to 7200 K. Outside that, such as TRAPPIST-1 at 2566 K, the edges are extrapolated and less certain.

**What is the equilibrium temperature?** The temperature of a black body that absorbs the same starlight and radiates it all away. It leaves out greenhouse warming, so real planets with air are warmer.

**Is anything sent anywhere?** No. Everything runs in your browser and works offline.
