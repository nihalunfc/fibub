---
name: Water wave calculator
num: 139
shelf: science
section: physical-oceanography
title: "Wave calculator: wavelength from period and depth, wave speed, power, shoaling, refraction and breaking depth"
summary: "From a wave's period, height and the water depth, get the wavelength (solving the dispersion relation exactly), phase and group speed, energy and power, orbital velocity at the bed, then follow the wave into shallow water with shoaling and refraction to find where and how high it breaks, and the breaker type."
status: live
ads: true
order: 1
icon: curve
works: offline
updated: 2026-11-08
related: [trend-analyser, darcy-flow-calculator, uncertainty-calculator, plot-maker]
sources:
  - "Linear (Airy) wave theory, dispersion relation, group velocity, energy flux, shoaling and Snell's law refraction: standard results, for example Dean, R. G. and Dalrymple, R. A. (1991), Water Wave Mechanics for Engineers and Scientists, and the US Army Corps of Engineers Coastal Engineering Manual (public domain)."
  - "Explicit wavelength approximation: Fenton, J. D. and McKee, W. D. (1990), Coastal Engineering 14, 499 to 513. Breaker index 0.78: McCowan (1894). Steepness limit 0.142 tanh(kh): Miche (1944). Breaker types from the Iribarren number: Battjes (1974)."
  - "Checked against an independent root-finding solution of the dispersion relation (SciPy) written for the tests; no data tables are used."
  - "The example wave is made up."
flow:
  - { icon: sliders, label: "Wave" }
  - { icon: ruler, label: "Wavelength" }
  - { icon: chart, label: "Shoaling" }
  - { icon: target, label: "Breaking" }
---

## What it does

A wave's **period** (the time between crests) hardly changes as it crosses the ocean, but its **length**, **speed** and **height** all change as the water gets shallower. In deep water a 10-second swell is 156 m long and races along at 15.6 m/s; near the beach it slows, shortens, grows taller and finally breaks.

This calculator solves the linear wave **dispersion relation**, ω² = g k tanh(k h), exactly by Newton's method for any period and depth, and gives everything that follows from it. It then carries the wave towards the shore over straight, parallel depth contours, applying **shoaling** (the slowing wave bunches its energy into a taller wave) and **refraction** (crests turn to line up with the contours), and finds where it **breaks**.

For flow in rivers and channels rather than waves, use the [[manning-weir-calculator]]; to test a record of wave heights for a trend, the [[trend-analyser]].

## How to use it

1. Choose **metres or feet**.
2. Type the **period** in seconds and the **height** (crest to trough). For a sea state, the significant wave height Hs and peak period from a buoy report give a useful approximation.
3. Give the **depth** where that height applies (a buoy's depth, or a large number such as 200 for deep water).
4. **Angle:** 0 if the crests are parallel to the shore; otherwise the angle between the crests and the depth contours.
5. **Shallower depth:** where you want to know the height, for example at a pier.
6. **Beach slope** (1 in N) for the surf zone width and the breaker type, and the **breaker index γ**, the ratio of breaking height to depth (0.78 by default).

## What the results mean

- **Wavelength and depth class:** waves "feel" the bottom once the depth is less than half a wavelength. Below a twentieth of a wavelength they are shallow-water waves and travel at √(g h).
- **Phase speed C** is how fast crests move; **group speed Cg** is how fast the energy (and a group of waves) travels. In deep water Cg is half of C.
- **Energy and power:** a regular wave carries ρ g H² / 8 joules per square metre, and its power per metre of crest is energy × Cg. For a real sea described by Hs, the power is roughly half the regular-wave value.
- **Bed orbital speed:** the peak back-and-forth water speed at the seabed, which decides whether sand moves.
- **Ursell number:** when it is large (above about 25), the wave is too steep for its depth for linear theory to be accurate.
- **Breaker type:** gentle beaches give **spilling** breakers, steeper ones **plunging** (tubes), and very steep shores **surging** waves.

## Worked example

A made-up swell of period 10 s and height 2 m in 50 m of water: the wavelength is **151 m** (h/L = 0.33, intermediate water), the phase speed 15.1 m/s and the group speed 8.55 m/s. The energy is 5.03 kJ/m² and the power about **43 kW per metre** of crest. Carried straight in to 5 m depth it shoals to **2.33 m** (Ks = 1.163). It **breaks in about 3.26 m of water at 2.54 m high**, where H reaches 0.78 times the depth. On a 1 in 50 beach that is a surf zone about 163 m wide, and the Iribarren number 0.17 (from the deep-water height of 2.09 m) means spilling breakers. Coming in at 20° instead, refraction trims the breaking height to 2.49 m in 3.19 m of water, with the crests turned to 7°.

## FAQ

**Why does the period not change?** The number of crests passing per second must be the same everywhere, or waves would pile up somewhere.

**Is this good enough for design?** It is the standard first step, but real coasts have irregular contours, currents, friction and random seas. Use proper wave models and a coastal engineer for design.
