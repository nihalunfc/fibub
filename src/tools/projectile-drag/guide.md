---
name: Projectile drag
num: 901
shelf: science
code: T636
section: classical-mechanics
title: "Projectile drag"
summary: "Launch a ball at any speed, angle and height and see its real path through the air: quadratic drag from its size, mass and drag coefficient, a head- or tailwind, the range, highest point, time of flight, landing speed, the best angle for distance and how much the air costs compared with a vacuum."
status: live
ads: true
order: 1
icon: curve
works: offline
updated: 2026-11-09
related: [rocket-equation, uncertainty-calculator, plot-maker, graph-digitizer, video-motion-tracker, collision-calculator, model-rocket-simulator, dimensionless-numbers]
sources:
  - "Newton's second law with quadratic drag F = ½ ρ Cd A v² and the fourth-order Runge-Kutta method: standard results in any classical mechanics or numerical methods text."
  - "Checked against an independent SciPy solve_ivp integration (relative tolerance 10⁻¹²) with event detection for landing and the highest point, and against the closed-form no-drag formulas."
  - "Air density 1.225 kg/m³ and standard gravity 9.80665 m/s² are rounded general values. The three example objects are made up."
flow:
  - { icon: sliders, label: "Launch" }
  - { icon: curve, label: "Path" }
  - { icon: ruler, label: "Range" }
  - { icon: target, label: "Best angle" }
---

## What it does

In a school textbook a thrown ball follows a perfect parabola and goes furthest at 45°. In real air it does not: drag slows it all the way, the path comes down more steeply than it went up, and the best angle is usually lower. This simulator works out the real path of a ball (or any roughly round object) with **air drag that grows with the square of the speed**, a **steady wind** along the direction of the throw, and a launch from any **height**.

It gives the **range**, the **highest point** and where it happens, the **time of flight**, the **landing speed and angle**, the path **without air** for comparison, the **launch angle that gives the longest range** with your drag and wind, and the **terminal speed** (the fastest the object could ever fall). It draws the path and the speed against time, and you can download the whole path as a CSV file for your own plots.

To check a real throw against the model, film it and track it with the [[video-motion-tracker]], and for a launch with thrust try the [[model-rocket-simulator]].

## How to use it

1. Pick an **object** to fill in its mass, size and drag coefficient, or type your own (the list switches to Custom).
2. Type the **launch speed** and **angle** above level. A negative angle throws downwards (only from a height).
3. **Launch height** is how far above the landing ground it leaves the hand or launcher.
4. **Mass** and **diameter** set how much the air matters: a light, large object slows quickly; a heavy, small one hardly notices.
5. **Cd** is the drag coefficient. Smooth spheres are roughly 0.1 to 0.5 depending on speed and surface. Set it to 0 to switch drag off and get the textbook parabola.
6. **Wind**: positive is a tailwind (pushing the object along), negative a headwind.
7. **Air density** (thinner air at altitude means less drag) and **gravity** (try 1.62 for the Moon).

## How it works

The drag force is ½ ρ Cd A |v − w|² and points against the velocity relative to the air (v − w), where A is the frontal area from the diameter. Dividing by the mass gives the drag constant k = ρ Cd A / 2m: the slowing is k times the square of the air speed. The equations of motion have no closed-form solution, so the page steps them forward in time with the **fourth-order Runge-Kutta** method in 2,000 steps, and pins down the landing and the highest point exactly by bisection within the last step. The best angle is found by a golden-section search between 0.5° and 89.5°.

## Worked example

The made-up small ball (145 g, 7.4 cm across, Cd 0.35) is thrown at **40 m/s at 35°** from **1 m** up in still air at sea level. The page shows a range of **94.85 m**, a highest point of **21.25 m** reached 51.75 m out after 1.91 s, and **4.102 s** in the air. It lands at 24.8 m/s, 47.7° below level, much steeper than it was thrown. Without air the same throw would go **154.7 m** and reach 27.84 m, so drag takes **38.7 %** off the range. The best angle with this drag is **40.6°**, giving 96.28 m. The terminal speed is 39.3 m/s, about the launch speed, which is why drag matters so much here. Type −5 in the wind box (a 5 m/s headwind) and the range drops to 84.41 m.

## Tips

- If the **terminal speed** is far above the launch speed, drag is small and the no-drag answer is close. If it is near or below the launch speed, drag dominates.
- Real balls spin, and spin adds lift (the Magnus effect) that this model leaves out; golf and table-tennis balls are strongly affected.
- To compare with a video of a real throw, measure the path with a video or graph-digitising tool and overlay it on the downloaded CSV.

## FAQ

**Why is the best angle below 45°?** Drag punishes long, high flights, so a flatter, faster path wins. A launch height also lowers the best angle, even without air.

**Why does the ball come down steeper than it went up?** It has lost horizontal speed to drag by the time it falls, so the descending path is more vertical.

**Is the drag coefficient fixed?** Here, yes. In reality Cd changes with speed (a sharp drop called the drag crisis for balls near 20 to 40 m/s, depending on roughness). Use a value suited to your speed range.

**Is this accurate enough for sport or engineering?** It is a sound physics model for study and planning, not a substitute for professional judgement or for measurements.
