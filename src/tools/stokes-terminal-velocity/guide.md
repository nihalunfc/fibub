---
name: Stokes' law
num: 1343
shelf: learn
code: L192
section: school-physics
title: "Stokes' law"
summary: "Drop a steel, glass, aluminium or nylon ball through a tall jar of glycerine, castor oil, honey or water. Watch it speed up and settle at its terminal velocity, read the forces, time it between two marks like the school practical and work out the liquid's viscosity, with the Reynolds number to say when Stokes' law holds."
status: live
ads: false
order: 1343
icon: clock
works: offline
updated: 2026-11-09
related: [bernoulli-flow, capillary-rise, buoyancy-lab, projectile-drag]
sources:
  - "Stokes' law F = 6πηrv, the terminal velocity v = 2r²(ρ − σ)g/9η, the approach to it v = v_t(1 − e^(−t/τ)) with τ = 2ρr²/9η, buoyancy (Archimedes) and the Reynolds number Re = σv(2r)/η: standard school physics found in any textbook. g = 9.8 m/s²."
  - "Densities and viscosities are rounded, typical values near 20 °C (glycerine 1.4 Pa s, castor oil 1.0 Pa s, honey 10 Pa s, water 0.001 Pa s), not data for any particular sample; viscosity changes strongly with temperature."
  - "Checked by hand (1 mm steel ball in glycerine: 1.017 cm/s) and against a step-by-step solution of m dv/dt = (ρ − σ)Vg − 6πηrv; at terminal speed the weight equals buoyancy plus drag."
flow:
  - { icon: pointer, label: "Pick ball" }
  - { icon: clock, label: "Drop, time" }
  - { icon: calculator, label: "Viscosity" }
  - { icon: check, label: "Check" }
---

## What it does

Drop a marble into a jar of honey and it does not keep speeding up like a falling stone. The thick liquid drags on it, and the faster it goes the harder the drag, until the drag and the liquid's upward push (buoyancy) balance its weight. From then on it falls at a steady speed: the **terminal velocity**. For a small, slow ball the drag is given by **Stokes' law**, F = 6πηrv, where η is the liquid's **viscosity**, a measure of how thick it is.

This tool lets you drop balls of steel, glass, aluminium or nylon through glycerine, castor oil, honey or water. It draws the fall, a graph of how the speed builds up, and the forces at the end. Like the school practical, it times the ball between two marks and works the viscosity back from that speed. A **mystery oil** lets you find an unknown viscosity yourself.

It follows the school topics on viscosity, Stokes' law and terminal velocity (Class 11 Physics, mechanical properties of fluids), with the matching practical. For the push of a liquid on anything in it see [[buoyancy-lab]], for another surface effect of liquids [[capillary-rise]], and for flow without stickiness [[bernoulli-flow]].

## How to use it

1. Pick the **ball**, the **liquid** and the ball's **radius**.
2. Read the terminal velocity, how quickly the ball reaches it and the forces on it.
3. Tap **Drop the ball** and watch the stopwatch, or **Skip to the end**. The stopwatch times the ball past marks A and B, 20 cm apart, and works out the speed and the viscosity.
4. Watch the pill: if the **Reynolds number** is above 1 the flow round the ball is no longer smooth and Stokes' law gives too big a speed.

## Worked example

Open the page: a **steel** ball (7800 kg/m³) of radius **1 mm** in **glycerine** (1260 kg/m³, η = 1.4 Pa s). The terminal velocity is 2 × (10⁻³)² × (7800 − 1260) × 9.8 ÷ (9 × 1.4) = **1.017 cm/s**. The ball gets there almost at once: it reaches 99 % of it in **5.7 ms**. At that speed its weight, **0.32 mN**, is held up by buoyancy 0.0517 mN plus drag 0.268 mN. The Reynolds number is **0.018**, far below 1, so Stokes' law holds.

Drop it: the stopwatch shows A at **9.83 s** and B at **29.49 s**, so 20 cm took 19.66 s, a speed of **1.017 cm/s**, and the viscosity worked back is **1.4 Pa s**. Double the radius to 2 mm and the speed goes up four times to 4.069 cm/s.

## Tips

- In the practical, put mark A well below the surface so the ball has reached its terminal velocity before you start timing.
- Keep the jar wide compared with the ball; walls close by slow it down.
- Viscosity falls fast as a liquid warms, so note the temperature.

## FAQ

**Why is the ball in water so wrong?** In water a steel ball moves fast, the Reynolds number is in the thousands and the water swirls behind it. The drag is then far bigger than Stokes' law says, so the real ball falls much slower than the number shown.

**Does a heavier ball fall faster?** Yes: a denser or bigger ball has more weight compared with its drag.

**Is anything stored?** No. It all runs in your browser.
