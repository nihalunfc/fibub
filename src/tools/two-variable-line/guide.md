---
name: Line solutions
num: 1289
shelf: learn
code: L157
section: school-maths
title: "Line solutions"
summary: "Set a, b and c in ax + by = c and watch its line move. Whole-number solutions show as dots; tap any grid point or type one to test it, with the sum worked out. A table of solutions, where the line crosses the axes, and lines parallel to the axes. Ends with fresh practice questions."
status: live
ads: false
order: 1289
icon: curve
works: offline
updated: 2026-11-09
related: [linear-pair-solver, section-formula, polynomial-zeros]
sources:
  - "Linear equations in two variables and their graphs are standard school algebra. Wording, pictures and examples are fibub's own."
  - "Checked against Python with fractions.Fraction (exact solutions, intercepts and whole-number solutions) for 400 random equations."
flow:
  - { icon: sliders, label: "Set a, b, c" }
  - { icon: curve, label: "Line" }
  - { icon: pointer, label: "Tap a point" }
  - { icon: check, label: "Solution?" }
---

## What it does

An equation like **2x + 3y = 12** has two unknowns, so one equation cannot pin them down: x = 0, y = 4 works, so does x = 3, y = 2, so does x = 1.5, y = 3. It has **infinitely many solutions**, and when you plot them all as points (x, y) they fall on one straight line. That line is the graph of the equation.

On this page you set a, b and c with sliders or boxes, and the graph shows:

- the **line** of all solutions,
- a **dot** at every whole-number solution on the −10 to 10 grid,
- a **green or red marker** for every point you test, with the sum a × x + b × y worked out so you can see why it does or does not equal c.

Below the graph is a table of solutions for x = −2 to 3 (as exact fractions), where the line crosses the axes, and the equation rearranged as y = mx + k. Setting a = 0 or b = 0 gives lines parallel to the axes, such as y = −3 or x = 4.

It fits the Class 9 mathematics chapter on linear equations in two variables (solutions as points, the graph as a straight line, and lines parallel to the axes). Two lines at once, and where they meet, is the next step in [[linear-pair-solver]]; plotting points on the coordinate plane is practised in [[section-formula]].

## How to use it

1. Drag the **a**, **b** and **c** sliders, type whole numbers from −50 to 50 in the boxes, or tap a quick example.
2. Tap any point where grid lines cross. It turns green if it is a solution, red if not, and the line under the graph shows the working.
3. To test a point with fractions or decimals, type x and y in the boxes and press **Test this point**. **Clear dots** removes your markers.
4. Read the table, the axis crossings and the rearranged form under the graph.

## A worked example

The page starts with 2x + 3y = 12.

- Put x = 0: 3y = 12, so y = 4. The line crosses the y-axis at (0, 4). Put y = 0: 2x = 12, so x = 6. It crosses the x-axis at (6, 0).
- Rearranged: y = (12 − 2x) ÷ 3 = −2/3 x + 4.
- The table gives y = 16/3, 14/3, 4, 10/3, 8/3 and 2 for x = −2, −1, 0, 1, 2 and 3.
- On the grid there are 7 whole-number solutions: (−9, 10), (−6, 8), (−3, 6), (0, 4), (3, 2), (6, 0) and (9, −2). They are 3 apart in x because y only stays whole when x is a multiple of 3.
- Test (1.5, 3): 2 × 1.5 + 3 × 3 = 3 + 9 = 12, so it is a solution even though it is not a dot. Test (2, 3): 4 + 9 = 13 ≠ 12, so it is not.

## Check yourself

Four fresh questions each time: y for a given x, the x-axis and y-axis crossings, and the value of k that makes a given point a solution. Nothing is saved.

## FAQ

**Is y = 3 an equation in two variables?** Yes, if you think of it as 0 × x + 1 × y = 3. Every point with y = 3 solves it, whatever x is, so its graph is a line parallel to the x-axis.

**Why does doubling a, b and c not move the line?** 4x + 6y = 24 is the same condition as 2x + 3y = 12 (divide both sides by 2), so it has exactly the same solutions.

**Is this from the NCERT book?** It covers the same topic with fibub's own pictures and examples. fibub is not part of NCERT.
