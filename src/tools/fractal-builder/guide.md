---
name: Fractal builder
num: 1248
shelf: learn
code: L120
section: school-maths
title: "Fractal builder: Koch snowflake and Sierpinski triangle step by step, perimeter that grows forever and area that stays finite"
summary: "Build the Koch snowflake and the Sierpinski triangle one step at a time. A live table follows the number of pieces, their size, the perimeter and the area: the snowflake's perimeter grows without end while its area never passes 8/5 of the first triangle, and the Sierpinski triangle's area shrinks to nothing."
status: live
ads: false
order: 1248
icon: star
works: offline
updated: 2026-11-09
related: [tessellation-studio, fractal-explorer, percentage-bar]
sources:
  - "The Koch snowflake (Helge von Koch, 1904) and the Sierpinski triangle (Wacław Sierpiński, 1915), with their perimeter and area formulas, are standard mathematics. Wording, pictures and examples are fibub's own."
  - "Checked by measuring the drawn shapes directly (shoelace area and summed side lengths, steps 0 to 6) against the formulas, and against the limit of 8/5 for the snowflake's area."
flow:
  - { icon: star, label: "Fractal" }
  - { icon: sliders, label: "Steps" }
  - { icon: table, label: "Table" }
  - { icon: check, label: "Practise" }
---

## What it does

A **fractal** is a shape where each small part looks like the whole. You make one by repeating a simple rule again and again. This page builds two famous ones from an equilateral triangle:

- **Koch snowflake:** cut every side into three equal parts and build a small triangle outwards on the middle part. Every side becomes four sides, each a third as long.
- **Sierpinski triangle:** join the midpoints of every filled triangle and take out the middle one. Every triangle becomes three, each half as wide.

Move the step slider and watch the picture change. A table lists every step from 0 to 6, with the number of pieces, their side, the perimeter and the area, and the formulas are shown with your numbers. The surprise: the snowflake's **perimeter grows by a third at every step, without end**, yet its **area never passes 8/5 of the first triangle**. The Sierpinski triangle keeps three quarters of its area each step, so its area shrinks towards zero.

It fits Class 8 Mathematics, exploring some geometric themes (patterns, self-similar shapes and repeated growth), and gives practice with powers and fractions. Patterns that repeat by turning and tiling are in the [[tessellation-studio]]; for the Mandelbrot set and fractals you can zoom into, go to the [[fractal-explorer]].

## How to use it

- Pick **Koch snowflake** or **Sierpinski triangle**.
- Move **n** from 0 to 6 steps. The dashed outline is the first triangle.
- Type the **side of the first triangle** in cm to change all the lengths and areas in the table.
- The highlighted row of the table is the step you are looking at.

## A worked example

Koch snowflake from a triangle with 9 cm sides:

- Step 0: 3 sides, perimeter 27 cm, area √3/4 × 81 ≈ 35.074 cm².
- Step 1: 12 sides of 3 cm, perimeter 36 cm (27 × 4/3). Three small triangles of side 3 cm are added, so the area is 35.074 × 4/3 ≈ 46.765 cm².
- Step 2: 48 sides of 1 cm, perimeter 48 cm. Area 35.074 × (1 + 3/5 × (1 − 16/81)) ≈ 51.962 cm².
- The area can never pass 8/5 × 35.074 ≈ 56.118 cm², but after 6 steps the perimeter is already 27 × (4/3)⁶ ≈ 151.7 cm, and it keeps growing.

Sierpinski triangle from 8 cm sides: after 3 steps there are 27 triangles with 1 cm sides, and the area left is (3/4)³ = 27/64 of the start.

## Check yourself

Four fresh questions each time: sides of a snowflake, a snowflake's perimeter, triangles in a Sierpinski triangle, and the fraction of area left. Type the answer and press **Check**. Nothing is saved.

## FAQ

**How can a shape have an endless edge but a limited area?** Each step adds less and less area (4/9 as much as the step before), so the total settles down. The edge is multiplied by 4/3 each time, and that never settles.

**Why stop at 6 steps?** After 6 steps the snowflake already has 12 288 sides and the pieces are too small to see on a phone. A true fractal is what you would get after endless steps.

**Is this from the NCERT book?** It covers the same topic with fibub's own pictures and examples. fibub is not part of NCERT.
