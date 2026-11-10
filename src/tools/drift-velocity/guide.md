---
name: Drift velocity
num: 1406
shelf: learn
code: L247
section: school-physics
title: "Drift velocity"
summary: "Watch free electrons dash about at random inside a copper, aluminium or silver wire and drift slowly against the field when a current flows. Change the current and the wire's thickness and get the drift speed from I = neAv_d, the time to drift a metre, and (advanced) the field, relaxation time and mobility."
status: live
ads: false
order: 1406
icon: sliders
works: offline
updated: 2026-11-09
related: [ohms-law-lab, series-parallel, wheatstone-bridge]
sources:
  - "Drift speed v_d = I / (n e A), n = z ρ N_A / M, relaxation time τ = m / (n e² ρ), mobility μ = v_d / E = e τ / m and the classical thermal speed √(3kT/m): standard results of the free-electron model."
  - "e = 1.602176634 × 10⁻¹⁹ C, N_A = 6.02214076 × 10²³ mol⁻¹ and k = 1.380649 × 10⁻²³ J/K (exact SI values); mₑ = 9.1093837139 × 10⁻³¹ kg (CODATA 2022)."
  - "Densities, molar masses and resistivities of copper, aluminium and silver are rounded general values at about 20 °C."
  - "Checked against an independent Python calculation (copper, 1 A in 1 mm²: n = 8.49 × 10²⁸ m⁻³, v_d = 7.35 × 10⁻⁵ m/s, τ = 2.49 × 10⁻¹⁴ s) and the identity e E τ / m = I / (n e A)."
flow:
  - { icon: sliders, label: "Set current" }
  - { icon: eye, label: "Watch drift" }
  - { icon: calculator, label: "Get v_d" }
  - { icon: check, label: "Check" }
---

## What it does

A metal wire is full of free electrons. Even with no battery they dash about at random, very fast, bouncing off the metal ions, but they go nowhere on average. Connect a battery and a field appears along the wire. Between collisions each electron is pushed a tiny bit towards the + end, so the whole crowd creeps along. That slow creep is the **drift velocity**, and it is what makes the current.

This page shows the crowd moving. One electron is coloured so you can follow its zig-zag path and see the slow drift hidden inside the random motion. Below the picture you get the real drift speed from **I = n e A v_d** with your numbers, how long an electron takes to drift one metre, and how its drift compares with its random speed. The **Advanced** level adds the field inside the wire (E = ρJ), the relaxation time τ (the average time between collisions) and the mobility.

It follows the Class 12 Physics chapter on current electricity (drift of electrons and the origin of resistivity, mobility). Before this, see current and resistance with the [[ohms-law-lab]]; afterwards, combine resistors with [[series-parallel]] or balance a bridge with the [[wheatstone-bridge]].

## How to use it

1. Pick **Copper**, **Aluminium** or **Silver**. The number of free electrons per cubic metre comes from the metal's density, molar mass and the free electrons each atom gives (1 for copper and silver, 3 for aluminium).
2. Slide the **current** (0 to 10 A) and the wire's **cross-section** (0.25 to 10 mm²).
3. Watch the picture. The arrows show the current and field (towards the − end) and the electrons' drift (towards the + end, the other way, because they are negative).
4. Tick or untick **Follow one electron** to show its path. **Pause** stops the animation.
5. Switch to **Advanced** for E, τ and the mobility.

The picture is not to scale: real random speeds are about a million times bigger than the drift, so the page slows the random motion down and exaggerates the drift. The numbers are the real ones.

## Worked example

A copper wire of cross-section 1 mm² carries 1 A. Copper has n = 8.49 × 10²⁸ free electrons per m³ (8.96 g/cm³ × 6.022 × 10²³ / 63.55 g/mol, one electron per atom). Then

v_d = I / (n e A) = 1 / (8.49 × 10²⁸ × 1.60 × 10⁻¹⁹ × 1 × 10⁻⁶) = 7.35 × 10⁻⁵ m/s,

which the page shows as **0.0735 mm/s**. To drift one metre takes about 13 600 s, or **3.78 hours**. With the Advanced level on, the field is E = ρJ = 1.68 × 10⁻⁸ × 10⁶ = 16.8 mV/m, the relaxation time is τ = 24.9 fs and the mobility 4.38 × 10⁻³ m²/(V s); e E τ / m gives the same drift speed again.

## Tips

- Doubling the current doubles the drift speed. Doubling the area at the same current halves it.
- The current density J = I/A is what sets the drift speed for a given metal.
- A thin wire carrying the same current as a thick one has faster electrons, not more of them.

## FAQ

**If electrons are so slow, why does a lamp light at once?** The field is set up along the whole wire at nearly the speed of light, so electrons everywhere start drifting at the same moment. The ones in the lamp's filament are already there.

**Is the random speed really 117 km/s?** That is the old classical estimate √(3kT/m) at room temperature. Quantum theory says free electrons in a metal move even faster, about 1 000 km/s. Either way the drift is tiny in comparison.

**Why does aluminium have more free electrons?** Each aluminium atom gives three, so for the same current they need to drift more slowly.

**Is this an official NCERT resource?** No. fibub is independent; the page follows the topics in the syllabus in its own words.
