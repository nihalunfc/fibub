---
name: Rigid motions
num: 2234
shelf: learn
code: L334
section: school-maths
title: "Rigid motions: translations, rotations, reflections and dilations"
summary: "Slide, turn, flip and resize a triangle on a grid and see which moves keep every length and angle (congruent) and which only keep angles (similar), with coordinates and area and perimeter shown for the image."
status: live
ads: false
order: 2234
icon: compass
works: offline
updated: 2026-11-16
related: [similar-triangles, tessellation-studio, matrix-transform]
sources:
  - "Translations, rotations, reflections and dilations are standard geometry (Common Core 8.G.1 to 4 and HS-G-CO.2 to 6, HS-G-SRT.1). The coordinate rules and the area and perimeter results are checked in tests/sci.mjs. The pictures and triangle are fibub's own."
flow:
  - { icon: pointer, label: "Pick move" }
  - { icon: sliders, label: "Set it" }
  - { icon: compass, label: "See image" }
  - { icon: check, label: "Quiz" }
---

## What it does

A **transformation** moves every point of a shape by a fixed rule. A **slide** (translation) moves it straight, a **turn** (rotation) spins it about the origin, a **flip** (reflection) mirrors it in a line, and a **resize** (dilation) stretches or shrinks it from the origin. The first three are **rigid motions**: the image has exactly the same side lengths and angles as the original, so it is **congruent**. A resize keeps angles but changes lengths, so the image is only **similar**.

The dark triangle is the original and the blue one is its image. The page tells you whether the move is rigid and shows the perimeter and area before and after. When you are ready for scale in more depth, try [[similar-triangles]], and for repeating patterns see [[tessellation-studio]].

## How to use it

1. Choose a move: Slide, Turn, Flip or Resize.
2. Set it with the slider or menu that appears.
3. Read the sentence under the grid: congruent or similar.
4. Check the coordinates of corner A and the perimeter and area line.
5. Try the quiz questions about coordinates and area.

## What each setting does

- **Right and Up:** how far to slide, in grid squares.
- **Turn counter-clockwise by:** the angle in degrees about the origin.
- **Mirror line:** the y-axis, the x-axis or the line y = x.
- **Scale factor:** how much to enlarge (more than 1) or shrink (less than 1).

## Worked example

Corner A is at (1, 1). Slide 3 right and 2 up and it lands on (4, 3). Turn the triangle 90° and A goes to (−1, 1). Resize by 2 and the perimeter doubles from about 6.83 to 13.66, while the area grows from 2 to 8, four times as large.

## FAQs

**Why does the area grow by the factor squared?** Both length and width are multiplied, so the area is multiplied twice.

**Is a flip really rigid even though it reverses the order of the corners?** Yes. Lengths and angles are unchanged; only the orientation is reversed.

**What about turning about another point?** This page turns about the origin to keep the rule simple.
