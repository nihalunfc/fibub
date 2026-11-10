---
name: Conic explorer
num: 1188
shelf: learn
code: L91
section: school-maths
title: "Conic sections explorer: ellipse, parabola and hyperbola with foci, directrix, eccentricity and latus rectum"
summary: "Slide the numbers in the equation of a circle, ellipse, parabola or hyperbola and watch the curve change, with its foci, directrices, eccentricity and latus rectum marked. Move a point P to see the focus distances that define each curve, and tilt a plane through a double cone to see where all four come from."
status: live
ads: false
order: 1188
icon: orbit
works: offline
updated: 2026-11-09
related: [function-grapher, unit-circle, argand-plane]
sources:
  - "Standard coordinate geometry: the standard equations of the circle, ellipse, parabola and hyperbola, their foci, directrices, eccentricity and latus rectum, and the cone section e = cos β / cos α. Written for fibub; no textbook text, figures or exercises are used."
  - "Checked with NumPy: points sampled from each equation satisfy the focus–directrix property PF = e·PD and the two-focus sum or difference 2a, and the cone-slice eccentricity agrees with a conic fitted to points cut from a double cone."
flow:
  - { icon: orbit, label: "Pick conic" }
  - { icon: sliders, label: "a and b" }
  - { icon: target, label: "Foci" }
  - { icon: ruler, label: "e, latus" }
---

## What it shows

The four conic sections (circle, ellipse, parabola and hyperbola) are the curves you get when a flat plane cuts a double cone. They can also be described by one rule: a point P moves so that its distance to a fixed point, the **focus** F, is always **e** times its distance to a fixed line, the **directrix**. The number e is the **eccentricity**: e = 0 for a circle, between 0 and 1 for an ellipse, exactly 1 for a parabola, and more than 1 for a hyperbola.

This page draws each curve from its standard equation and marks the foci (red dots), directrices (dashed orange lines) and latus rectum (the green chord through a focus, square to the axis). A point P moves along the curve so you can check the defining distances yourself.

It follows conic sections in Class 11 maths. The [[unit-circle]] page covers circles centred at the origin and their angles; the [[argand-plane]] page uses the same plane for complex numbers; and the [[function-grapher]] can draw any curve you type, conics included.

## How to use it

1. **Pick a conic**: Circle, Ellipse, Parabola, Hyperbola, or Slice a cone.
2. **Slide the numbers.** Circle: centre (h, k) and radius r. Ellipse and hyperbola: a and b (for an ellipse, whichever is bigger lies along the major axis). Parabola: the focus distance a and which way it opens. A hyperbola can open left–right or up–down.
3. **Move P** along the curve with the bottom slider. The line under the picture gives the distances: PF₁ + PF₂ for an ellipse, PF₁ − PF₂ for a hyperbola, PF and PD for a parabola.
4. **Slice a cone**: set the cone's half-angle α and tilt the plane to angle β from the axis. The lower picture shows the curve that is cut.

## Formulas used

- **Ellipse** x²/a² + y²/b² = 1 with a > b: c² = a² − b², foci (±c, 0), e = c/a, directrices x = ±a/e, latus rectum 2b²/a.
- **Hyperbola** x²/a² − y²/b² = 1: c² = a² + b², foci (±c, 0), e = c/a, directrices x = ±a/e, latus rectum 2b²/a, asymptotes y = ±(b/a)x (dashed grey).
- **Parabola** y² = 4ax: focus (a, 0), directrix x = −a, latus rectum 4a, e = 1.
- **Circle** (x − h)² + (y − k)² = r²: centre (h, k), radius r.
- **Cone slice**: β = 90° gives a circle, β > α an ellipse, β = α a parabola and β < α a hyperbola, with e = cos β / cos α.

## Worked example

For x²/25 + y²/9 = 1, a = 5 and b = 3, so c = √(25 − 9) = 4. The foci are (±4, 0), e = 4/5 = **0.8**, the directrices are x = ±5/0.8 = **±6.25** and the latus rectum is 2 × 9/5 = **3.6**. Wherever P is, PF₁ + PF₂ = 10 = 2a.

For x²/9 − y²/16 = 1, c = √(9 + 16) = 5, e = **5/3**, the directrices are x = ±1.8 and the latus rectum is 2 × 16/3 ≈ **10.667**.

## Check yourself

Five questions with fresh numbers: an ellipse's eccentricity, a parabola's focus, a hyperbola's latus rectum, a circle's radius from its general equation, and which conic a plane parallel to the cone's side cuts. Nothing is saved.

## FAQ

**Why is a circle an ellipse?** When a = b, c = 0: both foci sit at the centre and e = 0.

**Why are there two branches of a hyperbola?** The plane is steep enough to cut both halves of the double cone.

**Is this from my textbook?** It covers the standard school topic with its own examples and pictures. It is an independent study aid.
