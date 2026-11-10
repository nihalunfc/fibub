---
name: Coordinate treasure hunt
num: 1272
shelf: learn
code: L153
section: school-maths
title: "Coordinate treasure hunt: plot points, read points, find hidden treasure and sink ships on a grid"
summary: "Four quick games on the coordinate plane: tap a point from its coordinates, read the coordinates of a point, hunt buried treasure using distance clues, and sink three hidden ships. Learn the quadrants, the signs of x and y, and the distance formula as you play."
status: live
ads: false
order: 1272
icon: target
works: offline
updated: 2026-11-09
related: [section-formula, pythagoras-proofs, linear-pair-solver]
sources:
  - "Standard Cartesian coordinates: quadrants I to IV anticlockwise from (+, +), points on the axes in no quadrant, and the distance formula √[(x₂ − x₁)² + (y₂ − y₁)²]. Games and questions written for fibub."
  - "Checked against hand-worked points and distances (3-4-5, 5-12-13 and 6-8-10 triangles on the grid), Python math.dist for 1,000 random grid pairs, and 10,000 random ship placements that stay on the grid and never overlap."
flow:
  - { icon: target, label: "Pick a game" }
  - { icon: pointer, label: "Tap a point" }
  - { icon: ruler, label: "Clue" }
  - { icon: check, label: "Practise" }
---

## What it does

A point on a flat grid is named by two numbers, its **coordinates** (x, y): go x across, then y up. This page turns that into four short games on a grid from −6 to 6:

- **Plot it**: you are given a point such as (−4, 3); tap it on the grid.
- **Read it**: a point P is shown; type its coordinates.
- **Treasure hunt**: treasure is buried at a hidden grid point. Each guess tells you how far away you are, worked out with the distance formula, and draws a dashed circle of every point at that distance. Use the circles to close in.
- **Ships**: three ships (4, 3 and 2 squares long) hide on the grid from −5 to 5. Fire at points by tapping or typing them; hits, misses and sunk ships are reported with their coordinates and quadrant.

It follows the Class 9 Maths chapter on coordinate geometry (using coordinates to find your way), and the distance formula in Class 10.

When you are ready for the distance and section formulas in full, try the [[section-formula]]; the distance clue is Pythagoras on the grid, as in the [[pythagoras-proofs]]; points that obey an equation make a line in the [[linear-pair-solver]].

## How to use it

1. Pick a game with the buttons at the top.
2. Tap the grid, or type a point such as `(3, -2)` or `3, -2` in the box and press **Go**. Typing works in every game.
3. **New round** starts again with a fresh point, treasure or fleet. **Show me** (or **Give up**) reveals the answer.
4. Your score for this visit is shown under the grid. Nothing is saved.

## A worked example

In the treasure hunt, suppose the treasure is at (2, −3) and you guess (−1, 1). The clue says the treasure is √25 = 5 units away, because (2 − (−1))² + (−3 − 1)² = 9 + 16 = 25. A dashed circle of radius 5 appears round (−1, 1); the treasure is a grid point on it. The clue also says it is not in the same quadrant as your guess. Guess (2, 1) next: it is √16 = 4 away, straight below or above. Only (2, −3) lies on both circles and is 4 below, so the third guess finds it.

## Tips

- Across first, then up: (3, 5) and (5, 3) are different points. The Read it game tells you if you swapped them.
- Signs tell the quadrant at once: (−, +) is always Quadrant II.
- A point with y = 0 sits on the x-axis, and one with x = 0 on the y-axis.

## Check yourself

Four fresh questions: the quadrant of a point, a distance on the grid, a point described in words, and a reflection in the x-axis. Type points as two numbers, x first. Nothing is saved.

## FAQ

**Why are the quadrants numbered that way?** They go anticlockwise from the top right, the same way angles turn in trigonometry.

**Who invented coordinates?** René Descartes and Pierre de Fermat wrote about them in the 1630s, which is why they are called Cartesian coordinates.

**Is this from the NCERT book?** It covers the same topic with fibub's own games and examples. fibub is not part of NCERT.
