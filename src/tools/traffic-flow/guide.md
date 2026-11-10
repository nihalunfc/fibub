---
name: Traffic flow fundamentals
num: 683
shelf: science
code: T480
section: transportation-engineering
title: "Traffic flow calculator: Greenshields, Greenberg and Underwood models, capacity and fundamental diagrams"
summary: "Paste speed and density (or flow) observations and fit the Greenshields, Greenberg and Underwood models: free-flow speed, jam density, capacity, the speed-density, flow-density and speed-flow diagrams, and an operating point with level of service from density limits you enter. For study and planning."
status: live
ads: true
order: 683
icon: chart
works: offline
updated: 2026-11-09
related: [gps-track-analyser, plot-maker, signal-timing, queueing-calculator, road-curve-design, curve-fitter, vehicle-routing]
sources:
  - "Models and their regressions as given in transportation engineering textbooks: Greenshields (1935) linear speed-density, Greenberg (1959) logarithmic, Underwood (1961) exponential; q = k·v and the capacity of each model follow from the formulas (general traffic flow theory)."
  - "Checked against NumPy (numpy.polyfit for all three regressions and their R²), SciPy (scipy.optimize.brentq for the two densities that carry a given flow) and a hand-worked Greenshields example (v_f = 100 km/h, k_j = 120 veh/km gives 3000 veh/h at 60 veh/km)."
  - "The example observations and the level-of-service density limits are made up by fibub; they are not taken from any manual, agency or data set."
flow:
  - { icon: table, label: "Data" }
  - { icon: curve, label: "Fit models" }
  - { icon: chart, label: "Diagrams" }
  - { icon: target, label: "LOS" }
---

## What it does

Traffic on a road can be described by three numbers: **flow** q (vehicles per hour), **density** k (vehicles per kilometre or mile of lane) and **space-mean speed** v, tied together by q = k·v. The way speed falls as density rises is the key to capacity. This page fits three classic speed-density models to your observations:

- **Greenshields**: speed falls in a straight line from the free-flow speed v_f to zero at the jam density k_j. Capacity is v_f·k_j/4, at half the jam density and half the free-flow speed.
- **Greenberg**: v = v_m·ln(k_j/k). It fits congested traffic well, but speed grows without limit at very low density. Capacity is v_m·k_j/e at density k_j/e.
- **Underwood**: v = v_f·e^(−k/k_m). It fits light traffic well, but speed never reaches zero. Capacity is v_f·k_m/e at density k_m.

You get each model's free-flow speed, jam density, optimum density, speed at capacity and capacity, how well it fits, and the three **fundamental diagrams** (speed-density, flow-density and speed-flow). An **operating point** panel gives speed, flow, spacing and headway for a density, flow or speed, and a **level of service** letter from density limits you enter.

Time the lights at a junction with [[signal-timing|Webster's method]], and model a single queue with the [[queueing-calculator]].

## How to use it

1. Choose the units and which two columns you have: density and speed, flow and speed, or density and flow. Paste the observations or press **Open a file**.
2. Read the table. Compare **R² speed** and RMSE to judge the models; "R² fit" belongs to each model's own straight-line regression.
3. Pick the model for the diagrams, or enter **your own Greenshields values**.
4. In the operating point panel, give a density, flow or speed. A flow below capacity can be carried in two ways, uncongested and congested, and both are shown.
5. Enter the **level-of-service limits** from the manual you use. The numbers already there are made-up examples, not official limits.

## Worked example

The made-up example has 14 per-lane observations from 8 to 105 veh/km. Greenshields fits best (R² speed 0.9908): free-flow speed 96.3 km/h, jam density 121.4 veh/km, and a capacity of 2,923 veh/h at 60.7 veh/km and 48.2 km/h. Greenberg gives 2,713 veh/h and Underwood 2,539 veh/h.

At the default density of 25 veh/km, Greenshields gives 76.5 km/h and 1,912 veh/h (65.4 % of capacity), uncongested, with vehicles 40 m apart and 1.88 s headway. With the made-up example limits (D up to 26 veh/km) that is level D; enter your manual's limits to get a real answer. For a flow of 2,000 veh/h the two states are 26.6 veh/km at 75.2 km/h (uncongested) and 94.8 veh/km at 21.1 km/h (congested).

## FAQ

**Which speed should I use?** The space-mean speed (the harmonic mean of spot speeds), because q = k·v only holds for it.

**Why do the models disagree on capacity?** They assume different shapes, and data rarely cover both light and heavy traffic evenly. Look at which model follows your points near the top of the flow-density curve.

**Can I use this for design?** It is for study and planning. Check your local design manual and a qualified engineer.

**Is my data uploaded?** No. Everything runs in your browser and works offline.
