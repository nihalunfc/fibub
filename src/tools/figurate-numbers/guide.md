---
name: Growing patterns and figurate numbers
num: 1280
shelf: learn
section: school-maths
title: "Growing patterns: triangle, square and pentagon numbers, difference tables and the nth term"
summary: "Watch dot patterns grow step by step (triangle, square, pentagon and hexagon numbers, and a row of matchstick squares), fill the difference table, guess the next step, then see the nth-term rule and the sum. Type any sequence and get its rule: arithmetic, square (quadratic) or geometric."
status: live
ads: false
order: 1280
icon: sigma
works: offline
updated: 2026-11-09
related: [ap-explorer, identity-tiles, polynomial-zeros, binomial-expansion]
sources:
  - "Polygonal numbers P(s, n) = ((s − 2)n² − (s − 4)n)/2, their sums, difference tables and the nested-polygon dot pictures are standard number theory, written for fibub."
  - "Checked against the OEIS lists A000217 (triangular), A000290 (squares), A000326 (pentagonal) and A000384 (hexagonal), by counting every dot in the pictures, and against brute-force sums."
flow:
  - { icon: pointer, label: "Pick pattern" }
  - { icon: sliders, label: "Grow it" }
  - { icon: table, label: "Differences" }
  - { icon: sigma, label: "nth term" }
---

## What it does

Mathematics is full of patterns that grow: a triangle of dots gets a new row, a square gets a new L-shaped layer, a row of squares made with matchsticks gets one more square. The question is always the same: **how many will step n have, without drawing it?**

This page lets you grow five patterns step by step:

- **Triangle numbers** 1, 3, 6, 10, … (each step adds a longer row),
- **Square numbers** 1, 4, 9, 16, … (each step adds an L-shape of the next odd number),
- **Pentagon numbers** 1, 5, 12, 22, … and **hexagon numbers** 1, 6, 15, 28, … drawn as nested shapes that share a corner,
- **Matchsticks** 4, 7, 10, 13, … for a row of squares.

The newest dots or sticks are coloured, so you can see what each step adds. A **difference table** shows the 1st and 2nd differences, you **guess the next step**, and then the page shows the **nth-term rule**, why it works, and the sum of the first n steps. A last box finds the rule for **any sequence you type**: arithmetic, quadratic or geometric.

It fits the Class 9 maths chapter on sequences and progressions and leads into Class 10 arithmetic progressions. For the staircase picture of an AP and its sum, go next to [[ap-explorer]]; the square and L-shape pictures connect with [[identity-tiles]], and patterns of coefficients continue in [[binomial-expansion]].

## How to use it

1. Tap a pattern: **Triangle**, **Square**, **Pentagon**, **Hexagon** or **Matchsticks**.
2. Move **n** to grow it from step 1 to step 8. The coloured part is new.
3. Read the **table** of steps 1 to 6 and their differences.
4. Type your **guess** for step 7 and press **Check**. Right guesses open the rule; or press **Show the rule**.
5. Move **k** to see any step (up to 100 on the slider, or type a bigger number), and the total of the first k steps.
6. In **Your own sequence**, type terms separated by commas. The page shows the differences, the rule and the next three terms.

## A worked example

Take the square pattern. The table shows 1, 4, 9, 16, 25, 36. The 1st differences are 3, 5, 7, 9, 11 (the odd numbers, one for each L-shape) and the 2nd differences are all 2. So the rule has an n² in it, and it is exactly n². Step 7 has 49 dots, and 1 + 3 + 5 + … + 13 = 49 too.

Now type 2, 5, 10, 17. The 1st differences are 3, 5, 7 and the 2nd differences are 2, 2, so the rule starts with 1n². Taking away n² leaves 1, 1, 1, 1, so the nth term is **n² + 1** and the next terms are 26, 37, 50.

## Tips

- Constant 1st differences: a straight-line rule an + b (an arithmetic progression).
- Constant 2nd differences: the rule starts with (half the 2nd difference) × n².
- A constant ratio (each term times the same number): a geometric progression.
- A few terms never prove a rule. 1, 2, 4, … could be doubling (8 next) or adding 1, 2, 3 (7 next).

## Check yourself

Four fresh questions each time: a far step of a growing pattern, a triangle number, the sum of the first n odd numbers, and a row of matchstick squares. Nothing is saved.

## FAQ

**Why are they called figurate numbers?** Because they count dots that make a figure (a shape). The Greeks studied them more than 2 000 years ago.

**Is this from the NCERT book?** It covers the same topic with fibub's own examples. fibub is not part of NCERT.
