---
name: Model rocket flight simulator
num: 670
shelf: science
section: aerospace-engineering
title: "Model rocket simulator: apogee, top speed and best ejection delay from a thrust curve"
summary: "Paste or open a motor thrust curve (or pick a made-up shape), give the rocket's mass, diameter and drag coefficient, and get a straight-up flight: apogee, top speed and Mach number, speed off the rod, burnout, the best ejection delay, and plots of altitude, velocity and thrust."
status: live
ads: true
order: 670
icon: flag
works: offline
updated: 2026-11-09
related: [rocket-equation, standard-atmosphere, aircraft-performance, projectile-drag, video-motion-tracker, propeller-thrust]
sources:
  - "Equation of motion of a rocket in vertical flight (thrust, quadratic drag, gravity, mass falling as propellant burns) integrated with the classical fourth-order Runge-Kutta method: standard rocketry and numerical methods texts (equations only)."
  - "Air density from the 1976 US Standard Atmosphere (US government, public domain), shifted to the temperature you give."
  - "Motor impulse classes (A up to 2.5 N·s, each letter doubling): the common hobby-rocketry convention."
  - "Checked against an independent SciPy solve_ivp (adaptive Runge-Kutta, tight tolerances) calculation with its own atmosphere and impulse integration. The example rocket and thrust curve are made up and are not a real motor."
flow:
  - { icon: table, label: "Thrust" }
  - { icon: sliders, label: "Rocket" }
  - { icon: curve, label: "Flight" }
  - { icon: target, label: "Delay" }
---

## What it does

This simulator flies a model rocket **straight up** and tells you how high it goes. At every millisecond it works out the forces on the rocket:

- **thrust** from the motor's thrust curve (straight lines between the points you give);
- **drag** = ½ ρ v² Cd A, with the air density ρ falling with height as in the standard atmosphere;
- **weight**, with the mass falling as propellant burns, in step with the impulse delivered.

It steps the motion forward with the fourth-order **Runge-Kutta** method until after apogee and the ejection charge. The rocket waits on the pad until the thrust exceeds its weight.

You get the **apogee** and when it happens, the **top speed** and Mach number, peak acceleration, the **speed off the launch rod**, the burnout height and speed, the **best ejection delay** and what happens with the delay you chose, with plots and a CSV of the whole flight.

For bigger rockets the [[rocket-equation]] gives the ideal speed change, and the [[projectile-drag]] tool shows how air slows any launched object.

## How to use it

1. Type the rocket's **lift-off mass** including the motor, the **propellant mass** (from the motor's data sheet), the **body diameter** and a **drag coefficient**.
2. Paste the motor's **thrust curve** as time and thrust pairs, or open a CSV or text file. The numbers in a RASP .eng file paste as they are. Or choose a **made-up shape** with a total impulse and burn time to explore.
3. Give the **ejection delay** printed on the motor, the launch rod length, the site elevation and the temperature.

## Worked example

The made-up example: a 120 g rocket, 25 mm across, Cd 0.75, on a made-up 8.3 N·s curve (a C-class impulse) with 10.8 g of propellant. The page shows **apogee 163 m at 6.25 s**. The rocket leaves a 1 m rod at 12.8 m/s (a little slow: the page suggests a longer rod), reaches a **top speed of 51.8 m/s** at burnout, 56.5 m up, then coasts for 4.5 s. So the **best delay is 4.5 s**; with a 4 s delay the ejection comes at 5.75 s, 0.5 s before apogee, at 162 m and 4.9 m/s, which is fine.

## Tips

- **Pick the delay** nearest the best delay. Too short and the parachute opens while the rocket is still fast; too long and it opens on the way down, fast.
- **Drag matters a lot** for small, fast rockets. Halving Cd can add a third to the apogee.
- **Hot or high sites** have thinner air, so rockets go a little higher.

## FAQ

**Why do real flights go lower?** Wind makes rockets turn into it (weathercocking), launch angles, a rough finish and motor-to-motor spread all cost height. Treat the result as an upper estimate.

**Where do I get a thrust curve?** From the motor maker's data sheet or certification data. The example here is made up.

**Is this a safety tool?** It is for study and planning. Always follow your national rocketry safety code and the motor maker's instructions.
