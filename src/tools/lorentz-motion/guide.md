---
name: Lorentz motion
num: 1408
shelf: learn
code: L249
section: school-physics
title: "Lorentz motion"
summary: "Fire a proton, electron, alpha particle or deuteron into a magnetic field and watch it circle or spiral, with its radius, period and pitch. Add an electric field at right angles to make a velocity selector, or spin it up in a cyclotron and see its frequency, final energy and number of turns."
status: live
ads: false
order: 1408
icon: orbit
works: offline
updated: 2026-11-09
related: [magnetic-field-mapper, fleming-rule, particle-drifts]
sources:
  - "Lorentz force F = q (E + v × B) and its exact solutions: r = m v sin θ / (q B), T = 2π m / (q B), pitch v cos θ T, crossed-field drift v = E / B with a cycloid, cyclotron frequency q B / (2π m) and K = q² B² R² / (2 m): standard physics results."
  - "e = 1.602176634 × 10⁻¹⁹ C (exact); proton, electron, alpha particle and deuteron masses: CODATA 2022 recommended values."
  - "Checked against an independent Python calculation (proton at 10⁶ m/s in 0.1 T: r = 10.44 cm, T = 655.9 ns; 1 T, R = 0.5 m: f = 15.25 MHz, K = 11.97 MeV) and a fourth-order Runge–Kutta integration of the equation of motion in the tests."
flow:
  - { icon: sliders, label: "Set fields" }
  - { icon: orbit, label: "Watch path" }
  - { icon: calculator, label: "Radius" }
  - { icon: check, label: "Check" }
---

## What it does

A magnetic field pushes on a moving charge at right angles to both the field and the velocity: F = q v B sin θ. Because the push is always sideways, it bends the path but never speeds the particle up or slows it down. This page shows what that does in three situations:

- **Magnetic field:** the particle goes round in a **circle** of radius r = m v / (q B) when it moves at right angles to B, and in a **helix** when it also has some speed along B.
- **Velocity selector:** an electric field and a magnetic field at right angles push in opposite directions. Only particles with v = E / B feel no net force and go straight through the slit.
- **Cyclotron:** two hollow D-shaped boxes in a magnetic field, with an alternating voltage across the gap. The particle gains energy at each crossing and spirals outwards until it leaves at the edge.

The path is drawn from the exact solution of the equation of motion and animated, with the formula and your numbers below it. It follows the Class 12 Physics chapter on moving charges and magnetism (the Lorentz force, motion in a magnetic field, the velocity selector and the cyclotron). See the field lines themselves with the [[magnetic-field-mapper]], find the force direction with [[fleming-rule]], and for drifts in non-uniform fields try [[particle-drifts]].

## How to use it

1. Choose **Magnetic field**, **Velocity selector** or **Cyclotron**.
2. Pick the particle. Electrons have a negative charge, so they turn the other way.
3. Slide the speed (in millions of metres per second), the field B in tesla and, for the first mode, the angle between the velocity and B. The selector adds the electric field E; the cyclotron adds the radius of the dees and the voltage across the gap.
4. **Pause**, **Play** and **Start again** control the animation.

## Worked example

A proton (m = 1.67 × 10⁻²⁷ kg, q = 1.60 × 10⁻¹⁹ C) moves at 1 × 10⁶ m/s at right angles to a 0.1 T field. Then r = m v / (q B) = 1.67 × 10⁻²⁷ × 10⁶ / (1.60 × 10⁻¹⁹ × 0.1) = **10.4 cm**, and one turn takes T = 2π m / (q B) = **656 ns**, a frequency of 1.52 MHz. Set the angle to 60°: the particle now also moves 0.328 m along the field each turn (the pitch).

In the velocity selector with E = 100 kV/m and B = 0.1 T, the speed that passes is E / B = 10⁶ m/s. In the cyclotron with B = 1 T and dees of radius 0.5 m, a proton needs a 15.2 MHz voltage and leaves with K = q² B² R² / (2 m) = **12.0 MeV**; with 50 kV across the gap that takes 240 crossings, or 120 turns.

## Tips

- The time for one turn does not depend on the speed: faster particles go round bigger circles in the same time. That is why a cyclotron can use a fixed frequency.
- The magnetic force does no work, so the kinetic energy in the magnetic-field mode never changes.
- The selector works for any charge and mass: only the speed matters.

## FAQ

**Why does the electron's circle look the same size?** The picture scales itself; read the scale bar. An electron's circle is about 1840 times smaller than a proton's at the same speed.

**Why can't a cyclotron speed up electrons?** They soon get close to the speed of light; their period then grows and they fall out of step with the voltage. The page says so if the simple formula gives a speed faster than light.

**Is this an official NCERT resource?** No. fibub is independent; the page follows the topics in the syllabus in its own words.
