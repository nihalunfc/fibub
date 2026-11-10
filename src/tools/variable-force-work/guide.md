---
name: Variable force work
num: 1334
shelf: learn
code: L196
section: school-physics
title: "Variable force work"
summary: "Shape a force-displacement graph with your finger, or start from a steady force, a spring or a fading push, pick where the motion starts and stops, and see the work as the shaded area, with the parts above and below the axis, the formula with your numbers, and the speed it gives a cart."
status: live
ads: false
order: 1334
icon: chart
works: offline
updated: 2026-11-09
related: [energy-track, free-body-diagram, riemann-sums, simple-machines]
sources:
  - "Work as W = F s for a steady force and W = ∫F dx, the area under the force-displacement graph, for a varying one; spring work ½kx²; the work-energy theorem W = ½mv². Standard school physics found in any textbook."
  - "Checked against ½kx², F s and triangle areas, and against an independent 200 000-strip midpoint sum on 300 random force shapes."
flow:
  - { icon: pencil, label: "Shape F" }
  - { icon: ruler, label: "From, to" }
  - { icon: chart, label: "Area" }
  - { icon: check, label: "Work" }
---

## What it does

When a steady force pushes something along, the work it does is simply **force × distance**: 10 N through 3 m is 30 J. Draw that force against distance and you get a rectangle 3 m wide and 10 N tall, whose area is also 30. That is no accident: **work is always the area under the force-displacement graph**, even when the force changes as the body moves, as it does for a spring, a rubber band or a rocket burning its fuel.

This page draws a force graph from 0 to 10 m. Start from a steady force, a spring (F = kx), a push that fades away, or a push that eases off and then pulls back, or drag the graph into any shape you like. Choose where the motion starts and stops, and the page shades the area: green where the force acts **with** the motion (positive work), red where it acts **against** it (negative work). It adds up the area exactly, shows the formula with your numbers for the standard shapes, and turns the work into the speed of a cart that started at rest, using the work-energy theorem.

It follows Class 11 Physics, work, energy and power (work done by a variable force, the work-energy theorem, the potential energy of a spring), and starts from the Class 9 Science idea of work = force × displacement. For energy changing between kinetic and potential on a track, see [[energy-track]]; for the forces that do the work, see [[free-body-diagram]]; and for areas under curves cut into strips, see [[riemann-sums]].

## How to use it

1. Pick a **Level**. Class 9 explains work as force × distance; Class 11 adds the integral W = ∫F dx. The questions change with the level.
2. Choose a **force graph**, and set the **biggest force** for it. For the spring, the spring constant is the biggest force ÷ 10 m.
3. To make your own, drag up and down on the graph: the dot at the nearest whole metre follows your finger.
4. Set **From x** and **To x**. The shaded area between the two dashed lines is the work.
5. Set the **mass of the cart** to see how fast that much work would make it go from rest on a smooth track.

## Worked example

Open the page: a **spring** whose force rises from 0 to 40 N over 10 m, so k = 4 N/m. From x = 0 to x = 6 m the area is a triangle 6 m wide and 24 N tall: W = ½ × 4 × 6² = **72 J**. Given to a 2 kg cart at rest, ½ × 2 × v² = 72, so v = √72 = **8.49 m/s**.

Now go from 0 to 3 m: the work is ½ × 4 × 9 = 18 J, only a quarter as much. Stretching a spring twice as far takes four times the work.

## Tips

- Work can be negative. Friction, or a force pulling back, takes energy out of the moving body.
- The units check: newtons times metres are joules.
- On a curved graph, cutting the area into thin strips and adding them up is exactly what an integral does.

## FAQ

**Why is spring work ½kx² and not kx²?** The force starts at zero and grows steadily to kx, so on average it is only half of kx. The area is a triangle, not a rectangle.

**What if the force is at an angle to the motion?** Only the part of the force along the motion does work: W = F s cos θ. This graph shows that part.

**Is anything stored?** No. Your graph stays in the page and is gone when you leave; nothing is saved or sent.
