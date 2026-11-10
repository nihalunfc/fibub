---
name: Parabolic dish
num: 1380
shelf: learn
code: L238
section: school-maths
title: "Parabolic dish and reflector: why rays meet at the focus of a parabola, compared with a circle mirror"
summary: "Shine parallel rays into a dish shaped like the parabola x² = 4ay and watch every one reflect through the focus, while a circle-shaped mirror blurs them. Light from the focus comes out as a straight beam, and a real dish's focus is found from its width and depth."
status: live
ads: false
order: 1380
icon: target
works: offline
updated: 2026-11-09
related: [conic-explorer, mirror-ray-diagram, line-forms]
sources:
  - "Standard results on the parabola x² = 4ay (focus (0, a), directrix y = −a, latus rectum 4a, the reflection property) and on spherical mirrors (a ray at height h crosses the axis R − R/(2 cos θ) from the vertex, sin θ = h/R). Written for fibub."
  - "Checked with the law of reflection on 300 random rays (each parabola ray passes through the focus; circle-mirror crossings match the formula), and by hand: a 60 cm dish 6 cm deep has its focus 37.5 cm above the centre."
flow:
  - { icon: sliders, label: "Shape dish" }
  - { icon: eye, label: "Watch rays" }
  - { icon: target, label: "Find focus" }
  - { icon: check, label: "Practise" }
---

## What it does

Satellite dishes, solar cookers, torches and car headlights all use the same trick: a mirror shaped like a **parabola**. This page shows why.

- Rays come in **parallel to the axis** (orange), as light from a far-away satellite or the Sun does. Each one bounces off the dish by the law of reflection (blue) and **every one passes through the focus F**, however far from the centre it hits.
- Switch to **Circle** to compare a mirror shaped like part of a circle with the same focus for rays near the axis. Rays near the rim now cross the axis below F (red): a circle mirror only focuses well when it is shallow. This is called spherical aberration.
- Tick **Light starts at the focus** to run it backwards: a bulb at F sends light out as a straight, parallel beam.
- The numbers card gives the equation x² = 4ay (the textbook form y² = 4ax turned on its side), the focus, the directrix, the latus rectum and the depth of the dish, and explains the reflection with the focus–directrix property.
- **Where does the receiver go?** Measure a real dish across the rim (D) and its depth at the centre (d): the focus is D²/(16 d) above the centre.

It follows the Class 11 chapter *conic sections* (the parabola) and links to Class 10 and 12 work on mirrors.

The other conics, and where they come from on a cone, are in [[conic-explorer]]; ordinary curved mirrors and their images are in [[mirror-ray-diagram]], and the tangent lines at work here are straight lines from [[line-forms]].

## How to use it

1. Pick **Parabola**, **Circle** or **Both**.
2. Set **a** (the focal length, from the bottom of the dish to F) and **w** (half the width of the dish).
3. Tick the torch box to send light out from F instead.
4. Type the width and depth of a real dish to find where its receiver should sit.

## A worked example

The page starts with a = 2 and w = 4, so the dish is x² = 8y, 8 wide.

- Focus F = (0, 2), directrix y = −2, latus rectum 4a = 8.
- Depth at the rim = 4²/8 = 2, so F is level with the rim.
- The outermost ray hits at (3.8, 1.805). Its distance to F is 3.805, and its height above the directrix is 1.805 + 2 = 3.805: the same, as for every point on a parabola.
- Switch to **Both**: on the circle of radius 2a = 4, the ray at 3.8 crosses the axis at about −2.41, which is 4.41 below F.

A 60 cm dish that is 6 cm deep has a = 60²/(16 × 6) = 3600/96 = **37.5 cm**.

## Tips

- A smaller a makes a deeper dish with the focus closer to it.
- A shallow circle mirror is almost a parabola near its centre, which is why school mirror formulas use small, near-axis rays.

## Check yourself

Four fresh questions: the focus of x² = 4ay, the latus rectum of y² = 4ax, the focus of a real dish from its size, and the distance of a point on the parabola from the focus. Nothing is saved.

## FAQ

**Does the unit matter?** No. Use centimetres, metres or grid squares; the answers come out in the same unit.

**Is this from the NCERT book?** It covers the same topics with fibub's own examples. fibub is not part of NCERT.
