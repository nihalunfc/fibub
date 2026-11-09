---
name: Particle drift simulator
num: 953
shelf: science
section: plasma-physics
title: "Particle drift simulator: E × B, grad-B, curvature and gravity drifts with a Boris pusher animation"
summary: "Watch a proton, electron or any ion spiral in a magnetic field and drift sideways when there is an electric field, a field gradient, curved field lines or a steady force. The path is worked out step by step with the Boris method and compared with guiding-centre theory."
status: live
ads: true
order: 2
icon: orbit
works: offline
updated: 2026-11-09
related: [plasma-parameters, orbit-transfer-calculator, uncertainty-calculator]
sources:
  - "Boris, J. P. (1970), Relativistic plasma simulation: optimization of a hybrid code, Proceedings of the Fourth Conference on Numerical Simulation of Plasmas (the Boris pusher, non-relativistic form here)."
  - "Guiding-centre drift formulas: standard results, for example Chen, F. F., Introduction to Plasma Physics and Controlled Fusion, chapter 2."
  - "Checked against the drift formulas and an independent high-accuracy SciPy (DOP853) integration of the Lorentz force written for the tests. Constants are CODATA values; field values are made up."
flow:
  - { icon: sliders, label: "Fields" }
  - { icon: orbit, label: "Gyrate" }
  - { icon: pointer, label: "Drift" }
  - { icon: check, label: "Compare" }
---

## What it does

A charged particle in a magnetic field circles around the field lines. If anything else acts on it, an electric field, a change in field strength, a bend in the field lines or a steady force such as gravity, the circle does not close and the particle walks sideways. These **drifts** explain why plasmas leak out of simple magnetic bottles, how the Earth's ring current forms, and why a tokamak needs a twisted field.

This page follows a single particle step by step with the **Boris pusher**, the standard method in plasma simulation codes, and animates its path. It then measures the drift of the **guiding centre** (the centre of the circle) and compares it with the textbook formula.

## How to use it

1. Choose the **drift**: E × B, grad-B, curvature (a curved field like a tokamak's) or gravity (any steady force).
2. Choose the **particle**, or "Other…" to type a charge (with sign) and a mass in atomic mass units.
3. Set the **magnetic field** in millitesla and the value that causes the drift: the electric field E, the gradient length L, the radius of curvature R or the acceleration.
4. Give the particle's **energy across and along the field** in electronvolts.
5. Choose how many **gyrations** to follow and how many **time steps** per gyration. Use **Pause**, **Play again** and the **speed** setting for the animation.

## Worked example

The page opens on a proton in a 1 mT field with an electric field of 20 V/m and 100 eV of energy across the field. Its gyroradius is **1.445 m** and one turn takes 65.59 µs. The E × B drift from theory is E/B = **20000 m/s** down the screen (−y); the simulated guiding centre moves at **20000 m/s −y**, the same to four figures. Switch to the grad-B drift with L = 20 m: the proton drifts at **5003 m/s +y** against 5000 m/s from first-order theory (+0.06 %), the small difference being the next-order term in gyroradius ÷ L (here 0.072). Switch the particle to an electron and it drifts the other way.

## Tips

- E × B drift is the same for every charge and mass; the others flip with the sign of the charge, which is how they create currents.
- Make the gyroradius ÷ scale length larger (a shorter L or R, or more energy) and watch theory and simulation part ways.
- In the curvature case both the bend and the 1/R fall-off of the field push the particle vertically; that is why a purely toroidal field cannot hold a plasma.

## FAQ

**Why the Boris method?** It conserves the particle's speed exactly in a magnetic field, however large the time step, so orbits do not spiral in or out artificially.

**Why does the energy change in the E × B case?** The particle speeds up and slows down as it moves along and against E each turn; averaged over a turn the energy is constant.

**Is it relativistic?** No. Keep speeds well below light speed (electrons below about 10 keV).

**What is this for?** Study and teaching; it is not a substitute for a full simulation code or professional judgement.
