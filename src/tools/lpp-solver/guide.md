---
name: LPP graphical solver
num: 1475
shelf: learn
code: L310
section: school-maths
title: "Linear programming graphical method: feasible region, corner points and the objective line (LPP solver)"
summary: "Type Z = px + qy and up to five constraints (or pick a production, diet or farming story) and see the feasible region shaded, every corner point with its value of Z, and the objective line sliding to the best corner. Unbounded regions, problems with no maximum, ties along an edge and impossible constraints are all spotted and explained."
status: live
ads: false
order: 1475
icon: target
works: offline
updated: 2026-11-09
related: [lp-solver, linear-pair-solver, function-type, transportation-assignment]
sources:
  - "Standard school mathematics: linear programming problems in two variables solved by the graphical (corner point) method, including the half-plane test for unbounded regions. Written for fibub; no textbook text, figures or exercises are used, and the story numbers are made up."
  - "Checked against scipy.optimize.linprog (HiGHS) for seven problems: bounded maximum, unbounded region with a minimum, unbounded maximum, a tie along an edge, an infeasible pair and a three-constraint problem minimised and maximised."
flow:
  - { icon: pencil, label: "Constraints" }
  - { icon: chart, label: "Region" }
  - { icon: table, label: "Corners" }
  - { icon: target, label: "Best Z" }
---

## What it shows

A **linear programming problem** asks for the largest (or smallest) value of a linear **objective** Z = px + qy, when x and y must obey a few linear **constraints** such as 2x + y ≤ 20, and x, y ≥ 0. Every point that obeys all the constraints together makes the **feasible region**, a polygon. The **corner point theorem** says that if Z has a best value on the region, it is reached at a corner. So you draw the region, list its corners, and work out Z at each one.

This page does all of that live: it shades the region, labels the corners A, B, C … in a table with x, y and Z, highlights the best one, and lets you slide the dashed **objective line** Z = k across the region to see why the best point is a corner. It also spots an **unbounded** region, a problem with **no maximum**, **ties** along an edge, and constraints that **cannot all be met**.

It follows linear programming in Class 12 maths (the graphical method), and builds on drawing straight lines and solving pairs of equations, which the [[linear-pair-solver]] covers. For more than two variables, whole-number answers, shadow prices and the simplex method, go on to the [[lp-solver]]; the [[transportation-assignment]] tool solves a classic special case.

## How to use it

1. Pick a **story**, or *My own*. The stories are making tables and chairs, a cheapest diet, planting two crops, a tie, and a problem with no feasible point.
2. Choose **Maximise** or **Minimise** and type the numbers in Z = p x + q y.
3. Edit the **constraints**: the x and y coefficients, ≤ or ≥, and the right side. **Add a constraint** (up to five) or remove one with ✕. x ≥ 0 and y ≥ 0 always apply.
4. Read the picture: each constraint line is numbered, the shaded area is the feasible region, and green dots mark the best corner.
5. Move the **objective line** slider, or press **Slide to the best**, to watch Z = k leave the region at the optimum.
6. The table and the sentence under it give the answer.

## Worked example

The tables and chairs story: maximise Z = 50x + 30y with 2x + y ≤ 20 (machine hours), x + 2y ≤ 16 (finishing hours), x, y ≥ 0. The corners are (0, 0), (10, 0), (8, 4) and (0, 8), with Z = 0, 500, **520** and 240. The page shows **Maximum Z = 520** at x = 8 tables and y = 4 chairs.

The diet story: minimise Z = 4x + 6y with 2x + y ≥ 8 and x + 3y ≥ 9. The region is unbounded, with corners (0, 8), (3, 2) and (9, 0) giving Z = 48, **24** and 36. The page shows **Minimum Z = 24** at (3, 2) and explains that the half-plane 4x + 6y < 24 has no point in the region, so 24 really is the minimum. Switch to Maximise and the page says **No maximum**.

## How it works

The region is built by starting with a huge square in the first quadrant and cutting it down with each constraint's half-plane. Corners that land on the far edges of that square show the region goes on for ever. If the best Z is at one of those far corners, Z keeps improving without limit, so there is no maximum (or minimum). Otherwise the best real corner is the answer, and two best corners side by side mean every point on the edge between them is optimal.

## Check yourself

Five fresh questions: where a line cuts an axis, Z at a corner, a full small problem, the unbounded-region rule and whether a point is feasible. Nothing is saved.

## FAQ

**What about equality constraints?** Write x + y = 5 as two constraints, x + y ≤ 5 and x + y ≥ 5; the region becomes a segment.

**Why must x and y be at least 0?** In real problems they count things such as tables or kilograms, which cannot be negative.

**Is this from my textbook?** It covers the standard school topic with its own examples. It is an independent study aid and is not part of NCERT.
