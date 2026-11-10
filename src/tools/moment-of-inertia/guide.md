---
name: Moment of inertia
num: 904
shelf: science
code: T639
section: classical-mechanics
title: "Moment of inertia"
summary: "Build a body from simple uniform parts (rod, disc or cylinder, tube, ring, sphere, shell, box, point mass, and holes), place each one relative to the axis, and get the total moment of inertia with every step shown, the radius of gyration, the centre of mass, the moment about it and the spin energy at any rpm."
status: live
ads: true
order: 4
icon: compass
works: offline
updated: 2026-11-09
related: [pendulum-analyser, two-body-orbit, projectile-drag, uncertainty-calculator, collision-calculator, lagrangian-helper, unit-converter]
sources:
  - "Moments of inertia of uniform rods, cylinders, tubes, rings, spheres, shells and boxes, and the parallel-axis (Huygens-Steiner) theorem: standard classical mechanics results."
  - "Every shape formula was re-derived by integrating a uniform density in SymPy for the tests, and two composite examples were checked with exact rational arithmetic."
  - "The example parts are made up."
flow:
  - { icon: table, label: "Parts" }
  - { icon: ruler, label: "Place them" }
  - { icon: sigma, label: "Add up" }
  - { icon: target, label: "Total I" }
---

## What it does

The moment of inertia, I, is to turning what mass is to moving in a straight line: it says how hard an object is to spin up or slow down about a particular axis. It depends not just on the mass but on **how far the mass sits from the axis**, squared. That is why a figure skater spins faster with arms pulled in, and why flywheels put their mass in a heavy rim.

Real objects are rarely a single textbook shape, but most can be built from a few. This builder lets you **add parts** (thin rod, solid cylinder or disc, thick tube, thin ring, solid sphere, thin spherical shell, thick hollow sphere, box or plate, point mass), say **where each part's centre is** relative to the axis, and **subtract holes**. It applies the formula for each part about its own centre, moves it to the axis with the **parallel-axis theorem** I = I_centre + m d², and adds everything up, showing each step.

Use the result to predict a physical pendulum's period in the [[pendulum-analyser|pendulum lab analyser]], or to set up the equations of motion in the [[lagrangian-helper]].

## How to use it

1. Pick a **starting example** or the single point mass, then change it.
2. Pick the **units**: metres, centimetres or millimetres (with grams).
3. For each part choose its **shape** and type its **mass** and **sizes**. For rods, cylinders, tubes and rings, choose whether the axis runs **along** the part (a wheel on its axle) or **across** it (a rod swung end over end).
4. Type the part's centre **x and y**, measured across the axis, which sits at (0, 0). A part centred on the axis has x = y = 0.
5. Tick **Hole** to subtract a part, giving the mass of material removed.
6. Optionally give a **spin speed** in rpm to get the rotational energy and angular momentum.

## What the results mean

- **Moment of inertia** about your axis, in kg·m².
- **Radius of gyration** √(I/M): the distance at which the whole mass, concentrated in a ring, would give the same I.
- **Centre of mass** and **I about the centre of mass**: the smallest moment for any axis parallel to yours. Any other parallel axis adds M d².
- The **table** and the **steps** show each part's own-centre value, its m d² term and its share of the total.

## Worked example

The made-up **rod and ball pendulum** has a 0.5 kg rod 1 m long, swinging about one end (so its centre is at x = 0.5 m and the axis is across it), with a 1 kg solid ball of radius 5 cm on the end (centre at x = 1.05 m). The rod gives 0.5 × 1²/12 = 0.04167 about its centre plus 0.5 × 0.5² = 0.125; the ball gives 2/5 × 1 × 0.05² = 0.001 plus 1 × 1.05² = 1.1025. The page shows **I = 1.270 kg·m²** about the pivot, a total mass of 1.500 kg, a radius of gyration of **0.9202 m**, the centre of mass at 0.8667 m and I = **0.1435 kg·m²** about the centre of mass. At 60 rpm it would hold 25.07 J of spin energy. The **plate with a hole** example (a 2 kg, 40 × 30 cm plate with a 0.2 kg disc removed 10 cm off centre) gives 0.03942 kg·m², and the shift of the centre of mass to x = −0.01111 m.

## Tips

- Thin parts: a rod's thickness and a ring's width are ignored. If they matter, use a cylinder or a tube instead.
- A plate turning about an axis in its own plane is a box with one side across the axis set to the thickness (or 0).
- Real parts are rarely uniform. Treat this as a good first estimate, for study and planning, not a substitute for professional judgement.

## FAQ

**Why does the distance count so much?** Each bit of mass contributes m r², so doubling its distance quadruples its effect.

**Can the axis pass outside the object?** Yes. The parallel-axis theorem works for any axis parallel to the one through a part's centre.

**Why is there a "smallest" moment?** Moving the axis away from the centre of mass always adds M d², so the centre-of-mass axis gives the minimum.
