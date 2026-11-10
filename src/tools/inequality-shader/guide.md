---
name: Inequality shader
num: 1371
shelf: learn
section: school-maths
title: "Linear inequalities: solve on a number line with interval notation, and shade half-planes in x and y"
seoTitle: "Linear inequality solver with number line and graph"
summary: "Type an inequality such as −2x + 5 ≥ 1 and see each step, the solution on a number line with open or filled dots, and its interval notation. Solve double inequalities, then shade up to three inequalities in x and y as half-planes and find where they overlap, with corner points and a tap-to-test point."
status: live
ads: false
order: 1371
icon: ruler
works: offline
updated: 2026-11-09
related: [function-gallery, linear-pair-solver, lp-solver, quadratic-explorer]
sources:
  - "Solving linear inequalities, interval notation and graphing half-planes are standard school algebra. Wording, pictures and examples are fibub's own; no textbook text, figures or exercises are used."
  - "Checked against sympy (solve and solve_univariate_inequality) for the one-variable and double inequalities, and against shapely for the area and corners of a shaded region."
flow:
  - { icon: pencil, label: "Inequality" }
  - { icon: ruler, label: "Number line" }
  - { icon: target, label: "Half-planes" }
  - { icon: check, label: "Overlap" }
---

## What it does

An **inequality** such as 3x − 4 < 11 is true for a whole range of numbers, not just one. Solving it means finding that range, and this page shows it three ways at once:

- **step by step**, with the one rule that trips everyone up made obvious: multiply or divide by a negative number and the sign turns round;
- **on a number line**, with a filled dot when the end number is included (≤ or ≥) and an open dot when it is not (< or >);
- **in interval notation**, such as (−∞, 2] or [−2, 3), and in words.

It covers the Class 11 maths chapter on linear inequalities: one variable, double inequalities such as −3 ≤ 2x + 1 < 7, and inequalities in two variables, where each one is a **half-plane** and the solution of a system is the region where the half-planes overlap. The same pictures help in Class 10 when a quadratic's sign matters.

Use the [[function-gallery]] to revise intervals as domains and ranges first, then the [[linear-pair-solver]] for the lines themselves; the overlapping regions here lead straight into linear programming with the [[lp-solver]].

## How to use it

1. **One variable.** Type a, b and c in a x + b (sign) c and choose the sign. The number line, the steps and the interval appear at once. The last box lists the whole numbers from −10 to 10 that work.
2. **Double.** A left number and sign appear in front. Both signs must point the same way (−3 ≤ … < 7). The steps do the same thing to all three parts.
3. **x and y.** Up to three rows of a x + b y (sign) c, each with its own colour. Tick a row to use it. Each half-plane is lightly shaded in its colour, and the overlap is darker. Solid boundary lines are included (≤, ≥), dashed ones are not (<, >). Tap the graph to drop a test point; the page says which inequalities it fails. Corner points where boundary lines meet inside the region are listed.

## Worked example

The page opens on −2x + 5 ≥ 1. The steps read: take 5 from both sides, −2x ≥ −4; divide both sides by −2, a negative number, so the sign turns round: x ≤ 2. The number line is shaded from 2 off to the left with a filled dot at 2, and the interval is **(−∞, 2]**: a round bracket at −∞ (infinity is never reached) and a square bracket at 2 (2 is included). The whole numbers that work run from −10 up to 2.

Switch to **Double**: it fills in −3 ≤ 2x + 1 < 7. Take 1 from all three parts (−4 ≤ 2x < 6), divide by 2 (−2 ≤ x < 3). The interval is **[−2, 3)** and the whole-number solutions are −2, −1, 0, 1 and 2.

In **x and y**, the first two rows, x + y ≤ 6 and 2x − y > 0, overlap in a wedge whose corner is at (2, 4), where the lines x + y = 6 and y = 2x cross.

## Tips

- To decide which side of a line to shade, test a point not on it, usually (0, 0): if it makes the inequality true, shade its side.
- ∞ is not a number you can reach, so it always gets a round bracket.
- A strict sign (< or >) means the boundary is left out: an open dot on a number line, a dashed line on a graph.

## FAQ

**Why does dividing by a negative number flip the sign?** Because it reverses the order of numbers: 2 < 5, but −2 > −5. Multiplying both sides by −1 mirrors the number line, so "left of" becomes "right of".

**What if a = 0?** Then x disappears, and the inequality is either always true (every real x) or never true (no solution). The page says which.

**Is anything stored?** No. Everything runs in your browser. fibub is not part of NCERT; the topics follow the syllabus, but the words, pictures and examples are our own.
