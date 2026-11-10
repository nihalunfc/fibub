---
name: Radian ruler
num: 1373
shelf: learn
section: school-maths
title: "Radian ruler: what one radian is, degrees to radians and back, arc length s = rθ and sector area"
seoTitle: "Radian ruler: degrees to radians and arc length"
summary: "See a radian as the angle whose arc is exactly one radius long: marks every radius-length round the circle show why a full turn is 2π ≈ 6.28 radians. Slide or type an angle in degrees or radians (3pi/4 works), change the radius, and read the arc length s = rθ and the sector area ½r²θ."
status: live
ads: false
order: 1373
icon: ruler
works: offline
updated: 2026-11-09
related: [unit-circle, circle-sector, compound-angle, trig-ratios]
sources:
  - "The radian, the conversion π radians = 180°, arc length s = rθ and sector area ½r²θ are standard mathematics. Wording, pictures and examples are fibub's own; no textbook text, figures or exercises are used."
  - "Checked against Python's math.radians and math.degrees, and sympy's nsimplify for the π forms of angles."
flow:
  - { icon: sliders, label: "Angle" }
  - { icon: ruler, label: "Radii" }
  - { icon: compass, label: "Arc" }
  - { icon: calculator, label: "Radians" }
---

## What it does

Degrees split a full turn into 360 parts, a number chosen thousands of years ago. A **radian** comes from the circle itself: it is the angle at the centre when the arc is exactly as long as the radius. Lay the radius along the circle like a bendy ruler and count: one radian, two, three … six, and a bit left over. A full turn is 2π ≈ 6.283 radians, so

π radians = 180°, 1 radian = 180/π ≈ 57.3°, 1° = π/180 ≈ 0.01745 radian.

Because the angle in radians counts "radii along the arc", the arc length is simply **s = r θ**, and the sector area is **½ r² θ**. That is why Class 11 maths (trigonometric functions) switches to radians, and why calculus later needs them.

For the sine, cosine and tangent of these angles, go on to the [[unit-circle]]; the [[circle-sector]] tool does arcs and sectors in degrees for Class 10, and the [[compound-angle]] proof adds two angles together.

## How to use it

1. Slide **Angle θ** from 0° to 360°, or type degrees, or type radians: a decimal such as 2.1, or with pi such as 3pi/4, π/6 or 2pi.
2. Slide the **Radius**. The picture keeps the same size, but the numbers change.
3. In the picture the arc is blue, the two radii orange, and a green mark sits every radius-length round the circle (1 to 6). The marks the arc has reached turn green, so you can read the radian measure straight off the circle.
4. **Wrap radii round the circle** sweeps θ from 0° to 360° so you see six whole radii and the 0.28 left over.
5. The box under the picture gives the angle in radians (as a multiple of π when there is one), the arc length, the number of radii along the arc and the sector area.

## Worked example

The page opens at θ = 120° with r = 3 cm. The title reads 120° = 2π/3 ≈ 2.0944 radians. The box shows:

- arc length s = r θ = 3 × 2.0944 = 6.283 cm,
- radii along the arc: 2.094 (marks 1 and 2 are green, 3 is not yet reached),
- sector area ½ r² θ = ½ × 9 × 2.0944 = 9.425 cm².

Now type 3pi/4 in the radians box: the angle becomes 135°, and with r = 3 the arc is 7.069 cm.

## Tips

- To convert degrees to radians, multiply by π/180. To convert radians to degrees, multiply by 180/π.
- Learn a few by heart: 30° = π/6, 45° = π/4, 60° = π/3, 90° = π/2, 180° = π, 360° = 2π.
- When no unit is written after an angle in maths (sin 2, θ = 1.5), it is in radians.

## FAQ

**Why is a radian not a nice whole number of degrees?** Because π is not a whole number. 180/π ≈ 57.2958° can never be written exactly as a fraction.

**Does a bigger circle have bigger radians?** No. The arc grows with the radius, but the ratio s ÷ r stays the same, so the angle in radians does not depend on the size of the circle.

**Is anything stored?** No. Everything runs in your browser. fibub is not part of NCERT; the topics follow the syllabus, but the words, pictures and examples are our own.
