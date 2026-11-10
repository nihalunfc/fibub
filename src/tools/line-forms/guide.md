---
name: Line forms converter
num: 1378
shelf: learn
code: L236
section: school-maths
title: "Equation of a straight line in every form: drag two points, plus angle between lines and distance from a point"
summary: "Drag two points and see the slope and every form of the line's equation update together: two-point, point-slope, slope-intercept, intercept, general and normal form. Add a second line and a point for the angle between lines and the perpendicular distance, drawn."
status: live
ads: false
order: 1378
icon: ruler
works: offline
updated: 2026-11-09
related: [section-formula, linear-pair-solver, conic-explorer, trig-ratios]
sources:
  - "Standard coordinate geometry of the straight line: slope, inclination, the two-point, point-slope, slope-intercept, intercept, general and normal forms, tan θ = |(m₁ − m₂)/(1 + m₁m₂)| and the distance |Ax₀ + By₀ + C|/√(A² + B²). Written for fibub."
  - "Checked on hand-worked examples (computed again in Python) and on 300 random lines: both points satisfy the equation, the foot of the perpendicular lies on the line at the stated distance, and the normal form holds."
flow:
  - { icon: pointer, label: "Drag A, B" }
  - { icon: ruler, label: "Slope" }
  - { icon: convert, label: "All forms" }
  - { icon: check, label: "Practise" }
---

## What it does

A straight line can be written in several ways, and textbooks switch between them all the time. On this page you drag two points A and B on a grid and see **one line written every way at once**:

- the **slope** m = (y₂ − y₁)/(x₂ − x₁) as a fraction, and the **inclination** θ with tan θ = m;
- **two-point form** and **point-slope form**, y − y₁ = m(x − x₁);
- **slope-intercept form**, y = mx + c;
- **intercept form**, x/a + y/b = 1, where the line cuts the axes (green dots);
- **general form**, Ax + By + C = 0, with whole numbers and no common factor;
- **normal form**, x cos ω + y sin ω = p, where p is how far the line is from the origin.

Special cases are explained rather than hidden: a vertical line has no slope, a horizontal line has no x-intercept, and a line through the origin has no intercept form.

Tick the box to add a **second line CD** and a **point P**. The page then works out the angle between the two lines, says when they are parallel or perpendicular, finds where they meet, and draws the perpendicular from P to AB with its length and its foot F.

It follows the Class 11 chapter *straight lines*, building on Class 10 coordinate geometry.

The distance and section formulas come first in [[section-formula]]; two lines meeting is a pair of linear equations in [[linear-pair-solver]], and curves come next in [[conic-explorer]].

## How to use it

1. Drag **A** and **B**. They snap to whole numbers from −10 to 10, so every equation has whole numbers or simple fractions.
2. Read the forms card: each line shows the general formula, then your numbers.
3. Tick **Add a second line CD and a point P** and drag C, D (orange) and P (red).

## A worked example

The page starts with A(−4, −1) and B(2, 3).

- Slope m = (3 − (−1))/(2 − (−4)) = 4/6 = 2/3; inclination 33.69°.
- Point-slope form: y + 1 = (2/3)(x + 4). Slope-intercept form: y = (2/3)x + 5/3.
- Intercept form: x/(−5/2) + y/(5/3) = 1. General form: 2x − 3y + 5 = 0.
- Normal form: x cos 123.69° + y sin 123.69° = 1.3868, and 5/√13 ≈ 1.3868.

With the extra part on, CD from C(−6, 6) to D(6, 0) is x + 2y − 6 = 0 with slope −1/2. tan θ = |(2/3 + 1/2)/(1 − 1/3)| = 7/4, so θ ≈ 60.26°; the lines meet at (8/7, 17/7) ≈ (1.143, 2.429). P(5, −5) is |2×5 − 3×(−5) + 5|/√13 = 30/√13 ≈ 8.3205 from AB.

## Tips

- Parallel lines have equal slopes; perpendicular lines have slopes that multiply to −1 (unless one is vertical).
- To go from general form to slope-intercept form, solve for y: m = −A/B and c = −C/B.
- The distance formula's top line, Ax₀ + By₀ + C, is 0 exactly when P is on the line.

## Check yourself

Five fresh questions: a slope from two points, a y-intercept, a distance from a point to a line, a perpendicular slope and an x-intercept from the general form. Nothing is saved.

## FAQ

**Is normal form still taught?** Some syllabuses dropped it; it is shown for anyone who needs it and can be skipped.

**Is this from the NCERT book?** It covers the same topics with fibub's own examples. fibub is not part of NCERT.
