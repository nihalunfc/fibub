---
name: Dipole torque
num: 1401
shelf: learn
code: L256
section: school-physics
title: "Dipole torque"
summary: "Turn an electric dipole in a uniform field and see the two equal and opposite forces, the torque τ = pE sin θ and the potential energy U = −pE cos θ, with your numbers and a graph of both against angle. Let it go and watch it swing about the field direction."
status: live
ads: false
order: 1401
icon: compass
works: offline
updated: 2026-11-09
related: [coulomb-forces, field-line-plotter, dipole-polarity, potential-map]
sources:
  - "Electric dipole in a uniform field: p = qd, τ = p × E (size pE sin θ), U = −p·E = −pE cos θ, work W = pE (cos θ₁ − cos θ₂). Standard physics results."
  - "Checked against an independent Python script, and the torque checked as −dU/dθ by a numerical derivative."
flow:
  - { icon: sliders, label: "Set p and E" }
  - { icon: compass, label: "Turn it" }
  - { icon: chart, label: "τ and U" }
  - { icon: check, label: "Check" }
---

## What it does

An **electric dipole** is a pair of equal and opposite charges, +q and −q, a small distance d apart. Its **dipole moment** p = q d points from the negative charge to the positive one. Molecules such as water behave like tiny dipoles.

Put a dipole in a uniform electric field and the + end is pushed along the field while the − end is pushed the other way. The two forces are the same size, so the dipole does not move along, but they turn it: the **torque** is τ = pE sin θ, where θ is the angle between p and E. The torque always turns p towards the field. The **potential energy** is U = −pE cos θ: lowest when p lines up with E, highest when it points against it.

This page draws the dipole in a field, the two forces and the turning arrow, and works out p, τ, U and the work needed to turn it, as you change the angle, the charges, the separation and the field. A graph shows τ and U for every angle with a dot at yours. Press **Let it go** and the dipole swings about the field direction like a pendulum, slowing down a little each swing.

It follows the electric charges and fields chapter of Class 12 Physics (electric dipole, dipole in a uniform external field), and the potential energy of a dipole in the next chapter. Work out the forces between single charges first in [[coulomb-forces]], see the curved field of a free dipole in the [[field-line-plotter]], and see why molecules have dipole moments in [[dipole-polarity]].

## How to use it

1. **Drag** the dipole round with your finger or mouse, or use the **angle** slider (0° to 180°).
2. Set the **charges** (1 to 10 µC), the **separation** (1 to 5 cm) and the **field** (1 × 10⁴ to 1 × 10⁵ N/C).
3. Read τ and U, the working, and the facts: the moment, the force on each charge, the largest torque, and the work to turn the dipole from 0°.
4. Press **Let it go** to release it, and **Stop** to hold it. The swing is slowed down so you can follow it.

## Worked example

The page opens with ±2 µC charges 2 cm apart, in a field of 5 × 10⁴ N/C, at θ = 30°.

- p = q d = 2 × 10⁻⁶ × 0.02 = 4 × 10⁻⁸ C m.
- τ = p E sin θ = 4 × 10⁻⁸ × 5 × 10⁴ × sin 30° = **0.001 N m**.
- U = −p E cos θ = −4 × 10⁻⁸ × 5 × 10⁴ × 0.866 = **−0.00173 J**.
- Each charge feels qE = 2 × 10⁻⁶ × 5 × 10⁴ = 0.1 N, in opposite directions.
- Turning it from 0° to 30° takes W = pE (1 − cos 30°) = 2.68 × 10⁻⁴ J.

## Tips

- θ = 0° is a stable balance (it comes back if nudged); θ = 180° is unstable (it tips over).
- The torque is the slope of the energy graph with its sign changed: τ = −dU/dθ. Where U is steepest, τ is largest.
- In a field that is not uniform, the two forces are not quite equal, so the dipole is also pulled along. This page keeps the field uniform.

## FAQ

**Why is U zero at 90°?** Only differences in energy matter, so we may choose where U = 0. The usual choice, which gives U = −pE cos θ, puts it at 90°.

**Is the swing speed real?** No. The page slows the swing down so you can see it; how fast a real dipole swings depends on its mass.

**Is anything saved?** No. Everything is worked out on this page and nothing leaves your device.
