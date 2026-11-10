---
name: Linear function explorer
num: 1273
shelf: learn
code: L141
section: school-maths
title: "Linear function explorer: y = mx + c with sliders, slope as rise over run, and the zero of the line"
summary: "Slide m and c, or drag the line itself, and see y = mx + c drawn with its slope triangle (rise over run), the point where it cuts the y-axis and the zero where it meets the x-axis, all worked with your numbers. A Class 11 level adds the angle of the line and its other forms."
status: live
ads: false
order: 1273
icon: curve
works: offline
updated: 2026-11-09
related: [polynomial-zeros, linear-pair-solver, coordinate-hunt, derivative-slope]
sources:
  - "Standard results for straight lines: slope m = rise ÷ run, y-intercept c, zero x = −c/m of the linear polynomial mx + c, angle of inclination θ = tan⁻¹ m, and the point-slope, intercept and general forms. Written for fibub."
  - "Checked against hand-worked lines (y = 2x − 3: zero 3/2, angle 63.43°; y = −x + 4: zero 4, angle 135°), Python math.atan for 1,000 random slopes, and the two-point slope for random point pairs."
flow:
  - { icon: sliders, label: "Set m and c" }
  - { icon: curve, label: "See the line" }
  - { icon: ruler, label: "Rise ÷ run" }
  - { icon: check, label: "Practise" }
---

## What it does

A **linear polynomial** such as p(x) = 2x − 3 has a graph that is a straight line. This page draws y = mx + c and shows the three things every straight line is built from:

- the **slope** m, drawn as a little triangle: go a **run** of 2 to the right and the line goes up (or down) a **rise** of 2m, so m = rise ÷ run;
- the **y-intercept** c, where the line cuts the y-axis at (0, c);
- the **zero**, where the line meets the x-axis: solve mx + c = 0 to get x = −c/m.

A table of values shows that each step of 1 in x adds m to y. It fits the Class 9 Maths chapter introducing linear polynomials, and the straight lines chapter of Class 11, where the **Class 11** level adds the angle the line makes with the x-axis and the point-slope, intercept and general forms.

Higher powers and their zeros are in [[polynomial-zeros]], two lines meeting are in the [[linear-pair-solver]], and the slope of a curve, not just a line, is the [[derivative-slope]].

## How to use it

1. Move the **m** and **c** sliders, or type values (the boxes take any number, beyond the sliders too).
2. Or drag the handles on the graph: the one on the y-axis moves the line up and down (changes c); the other one turns it (changes m).
3. Read the steps under the graph: slope, y-intercept and the zero, with your numbers.
4. Switch the **Level** to *Class 11* for the angle of inclination and the other ways of writing the same line.

## A worked example

The page starts with m = 2 and c = −3, so p(x) = 2x − 3.

- The slope triangle has run 2 and rise 4: m = 4 ÷ 2 = 2.
- The line cuts the y-axis at (0, −3).
- Zero: 2x − 3 = 0, so x = 3 ÷ 2 = 1.5. The red dot sits at (1.5, 0).
- In the Class 11 level: θ = tan⁻¹(2) = 63.43°, and the intercept form is x/1.5 + y/(−3) = 1.

## Tips

- A positive slope climbs from left to right; a negative slope falls.
- Lines with the same m are parallel; lines with the same c all pass through (0, c).
- A flat line (m = 0) has no zero unless it is the x-axis itself.

## Check yourself

Four fresh questions: the zero of a linear polynomial, the slope between two points, a y-value from the equation, and where a line in the form ax + by = c cuts the y-axis. Nothing is saved.

## FAQ

**Why m and c?** It is a convention in Indian and British books. Other countries write y = mx + b or y = ax + b; the ideas are the same.

**What about a vertical line?** x = 3 is a line, but it is not the graph of a function y = mx + c: its run is 0, so its slope is undefined.

**Is this from the NCERT book?** It covers the same topic with fibub's own examples. fibub is not part of NCERT.
