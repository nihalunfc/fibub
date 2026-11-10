---
name: Linear pairs
num: 1157
shelf: learn
code: L74
section: school-maths
title: "Linear pairs"
summary: "Type two equations and see their lines cross, run parallel or lie on top of each other. The ratio test says how many solutions there are, and the substitution and elimination methods are worked step by step with exact fractions."
status: live
ads: false
order: 1157
icon: calculator
works: offline
updated: 2026-11-09
related: [polynomial-zeros, quadratic-explorer, matrix-calculator]
sources:
  - "Standard school algebra: graphs of linear equations, the ratio test a1/a2, b1/b2, c1/c2, and the substitution and elimination methods. Written for fibub."
  - "Solutions checked against numpy.linalg.solve and by putting them back into both equations for 400 random systems; the step texts are checked to end in the same values."
flow:
  - { icon: pencil, label: "Equations" }
  - { icon: chart, label: "Two lines" }
  - { icon: percent, label: "Ratio test" }
  - { icon: check, label: "Steps" }
---

## What it does

A linear equation in x and y, like 2x + 3y = 12, draws a straight line: every point on it is a solution. Two such equations together have:

- **one solution** if their lines cross,
- **no solution** if the lines are parallel,
- **infinitely many** if both equations draw the same line.

This page draws both lines, finds which case you have with the **ratio test**, and solves the pair by **substitution** and by **elimination**, showing every step with your numbers and exact fractions.

It follows the Class 10 chapter *pair of linear equations in two variables* (graphical method, consistency, substitution and elimination), and with the **Class 9** level it shows one equation, its line and a table of solutions, as in the Class 9 chapter on linear equations in two variables.

For quadratic equations, move on to the [[quadratic-explorer]]; for zeros of polynomials, the [[polynomial-zeros]] page. Bigger systems with three or more unknowns are easier with the [[matrix-calculator]].

## How to use it

1. Type the numbers for each equation in the form a x + b y = c. Use negative numbers for minus signs, for example b = −1 for x − y.
2. Or tap an example: **Cross**, **Parallel**, **Same line** or **Fractions**.
3. When the lines cross inside the window, **drag the blue crossing point**. Both lines slide so that they pass through the new point; their slopes stay the same, so only c1 and c2 change.
4. Read the ratio test, then follow either method. Both end with the same answer.
5. Switch the **Level** to Class 9 to work with a single equation.

## The ratio test

Write the equations as a1x + b1y = c1 and a2x + b2y = c2.

- If a1/a2 ≠ b1/b2, the lines have different slopes, so they cross once.
- If a1/a2 = b1/b2 ≠ c1/c2, they have the same slope but are different lines: parallel.
- If a1/a2 = b1/b2 = c1/c2, one equation is just a multiple of the other: the same line.

(Textbooks often write a1x + b1y + c1 = 0. That flips the sign of every c, which does not change c1/c2.)

## A worked example

The page starts with 2x + 3y = 12 and x − y = 1.

- Ratio test: 2/1 ≠ 3/(−1), so there is exactly one solution.
- Substitution: from (1), y = (12 − 2x)/3. Put it into (2) and multiply by 3: 5x = 15, so x = 3, then y = 2.
- Elimination: multiply (1) by 1 and (2) by 2, so both have 2x. Subtract: 5y = 10, so y = 2, then x = 3.
- On the graph the lines cross at (3, 2).

Try **Fractions** (3x − 5y = −4 and 9x + 2y = 7): the answer is x = 9/17, y = 19/17, which is hard to read off a graph but easy by elimination.

## Check yourself

Four fresh questions each time: solve a pair, find k for parallel lines, read a point on a line and a sum-and-difference word problem. Type the answer, press **Check**, and open the worked answer if you need it. Nothing is saved.

## FAQ

**Why does the graph only go from −10 to 10?** So the grid stays readable on a phone. If the lines cross outside it, the page still gives the crossing point.

**Is this from the NCERT book?** It covers the same topics with fibub's own examples. fibub is not part of NCERT.
