---
name: Trig ratio explorer
num: 1153
shelf: learn
code: L70
section: school-maths
title: "Trigonometric ratios explorer: sin, cos and tan on a right triangle and the unit circle"
summary: "Drag the angle of a right triangle and see sin, cos and tan as ratios of its sides, with the exact values at 0°, 30°, 45°, 60° and 90°, the identities checked live, and the full unit circle for Class 11."
status: live
ads: false
order: 1153
icon: compass
works: offline
updated: 2026-11-16
related: [pythagoras-proofs, function-grapher]
sources:
  - "Standard trigonometry: the six ratios of a right triangle, exact values at the special angles, sin²θ + cos²θ = 1 and its two partners, complementary angles and the signs in each quadrant. Written for fibub."
  - "Exact-value table checked entry by entry against the computed ratios; identities checked at every whole degree; values checked against Python's math module."
flow:
  - { icon: pointer, label: "Drag angle" }
  - { icon: ruler, label: "Read sides" }
  - { icon: table, label: "Ratios" }
  - { icon: check, label: "Practise" }
---

## What it does

Trigonometry starts with one idea: in a right triangle, the **ratios** of the sides depend only on the angle, not on how big the triangle is. This explorer lets you drag that angle and watch the three sides and the six ratios change together:

- **sin θ** = opposite / hypotenuse, **cos θ** = adjacent / hypotenuse, **tan θ** = opposite / adjacent,
- and their upside-down partners **cosec**, **sec** and **cot**.

It covers the Class 10 chapter *introduction to trigonometry* (ratios, special angles, identities, complementary angles), and with the **Class 11** level it takes the point all the way round the unit circle, as in the Class 11 chapter on trigonometric functions: angles beyond 90°, negative angles, radians and the sign of each ratio in each quadrant.

Start from the theorem behind the identities in the [[pythagoras-proofs]] playground, and plot y = sin x and friends as curves on the [[function-grapher]].

## How to use it

1. **Drag the blue point** along the circle, or use the θ slider, or type an angle. The opposite side is drawn in green, the adjacent side in blue and the hypotenuse in black, each with its length.
2. Change **r**, the hypotenuse. The triangle grows or shrinks but every ratio stays the same.
3. Tap a **special angle** (0°, 30°, 45°, 60°, 90°). Its column lights up in the table of exact values.
4. The **identities** card puts your angle into sin²θ + cos²θ = 1, 1 + tan²θ = sec²θ, 1 + cot²θ = cosec²θ and the complementary-angle rules, so you can see them hold.
5. Switch the **Level** to Class 11 to use the full circle. The page says which quadrant the angle is in, which ratios are positive there, and the angle in radians.

## A worked example

At the start the angle is 30° and the hypotenuse is 5.

- Opposite = 5 × sin 30° = 2.5 and adjacent = 5 × cos 30° ≈ 4.33.
- sin 30° = 2.5 / 5 = 0.5, cos 30° = 4.33 / 5 ≈ 0.866, tan 30° = 2.5 / 4.33 ≈ 0.5774.
- These match the exact values 1/2, √3/2 and 1/√3.
- Identity: sin²30° + cos²30° = 0.25 + 0.75 = 1.
- Complement: sin 60° = 0.866 = cos 30°.

Now drag r to 10. Opposite becomes 5 and adjacent 8.66, but sin 30° is still 5 / 10 = 0.5.

## Tips

- At 0° the opposite side has length 0, so cot and cosec are not defined. At 90° the adjacent side is 0, so tan and sec are not defined. The table says "not defined" there.
- A handy way to remember the special values: sin 0°, 30°, 45°, 60°, 90° are √0/2, √1/2, √2/2, √3/2, √4/2. Cos runs the same list backwards.
- In the Class 11 view, "All Students Take Coffee" names the positive ratios in quadrants I to IV: all, sin, tan, cos.

## Solve my numbers

Under the triangle there is a **Solve my numbers** box for the numbers in your own question. Pick what you know:

- **An angle and one side**: give θ (in degrees or radians) and say whether the side you know is the opposite, the adjacent or the hypotenuse. You get the other two sides and the other acute angle, each with the formula and your numbers filled in, for example hypotenuse 6 at 65 gives opposite = 6 × sin 65° = 5.438.
- **Two sides**: choose which two (opposite and adjacent, opposite and hypotenuse, or adjacent and hypotenuse) and you get the third side by Pythagoras and the angle by tan⁻¹, sin⁻¹ or cos⁻¹.
- **A ratio**: for "sin θ = 0.6" type the value (a fraction like 3/5 works). You get the angle, and at Class 11 level all the angles between 0° and 360° that share that value.

The answer sits in one line at the top of the box, and a unit select (cm, m, km, ft, in) is added to the answer only. Impossible input gets a plain message: a side of 0 or less, an angle of 0° or 90° in a right triangle, a hypotenuse shorter than a leg, or sin θ above 1. Four example buttons fill in typical textbook-style problems. The button under the working draws the angle in the triangle above.

Below that, **Trigonometric table** opens a table of sin, cos and tan from 0° to 90° (every 1°, 5° or 15°) with radians, and highlights the row for your angle. The sentence at the top of the page always gives sin, cos and tan for the angle you are on.

**Common mistakes** are listed in the box: calculator in the wrong mode, naming the sides from the wrong angle, and mixing up sin and cos.

## Check yourself

Four fresh questions each time: a ratio from a triangle's sides, an expression with exact values, a complementary angle and a missing side from an angle. Type the answer and press **Check**; open the worked answer if you get stuck. Nothing is saved.

## FAQ

**Why is sin θ never more than 1?** The opposite side can never be longer than the hypotenuse.

**Degrees or radians?** The page uses degrees, like the Class 10 book. The Class 11 level also gives the angle in radians (180° = π).

**Is this part of NCERT?** No. It follows the same topics, but the pictures and questions are fibub's own.

**What is sin 30°?** It is 0.5: in a right triangle with a 30° angle, the opposite side is half the hypotenuse.

**How do I find an angle from sin, cos or tan?** Use "A ratio" in Solve my numbers, for example sin θ = 0.6 gives θ = 36.87°.

**Is there a trigonometric table here?** Yes, open "Trigonometric table" for 0° to 90° with four decimal places.
