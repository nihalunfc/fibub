---
name: Vector adder
num: 1331
shelf: learn
section: school-physics
title: "Vector addition: triangle and parallelogram law, components and resultant, with Lami's theorem for three forces"
summary: "Drag two arrows and watch their resultant drawn by the triangle law, the parallelogram law or by components, with its size and direction worked out. Then hang a weight from two strings and see Lami's theorem give each tension."
status: live
ads: false
order: 1331
icon: compass
works: offline
updated: 2026-11-09
related: [vector-lab-3d, equations-of-motion, friction-ramp, newtons-laws]
sources:
  - "Vector addition by components, the law of cosines R² = A² + B² + 2AB cos θ, tan α = B sin θ / (A + B cos θ) and Lami's theorem for three concurrent forces in equilibrium: standard school physics found in any textbook."
  - "Checked against an independent component sum on 1000 random pairs of vectors, and Lami's tensions against a direct horizontal and vertical force balance on 1000 random string angles."
flow:
  - { icon: pointer, label: "Drag A, B" }
  - { icon: compass, label: "Add" }
  - { icon: ruler, label: "Size, angle" }
  - { icon: check, label: "Balance" }
---

## What it does

A **vector** has a size and a direction: a force, a velocity, a walk across a field. Two vectors do not add like ordinary numbers; 3 steps east and 4 steps north take you only 5 steps from where you started. This tool lets you drag two arrows, **A** (blue) and **B** (orange), and draws their sum, the **resultant R** (red), in three ways:

- **Triangle**: B starts where A ends; R joins the start of A to the end of B.
- **Parallelogram**: A and B start at the same point; R is the diagonal of the parallelogram they make.
- **Components**: each arrow is split into a part along x and a part along y; the parts simply add.

All three give the same arrow. Below the picture you get the size and direction of R from the law of cosines and from components, with your numbers filled in. A second card hangs a weight from two strings and uses **Lami's theorem** to find the tension in each string, which is three forces in balance.

It follows Class 11 Physics, motion in a plane (scalars and vectors, adding and subtracting vectors, resolving a vector into components) and the equilibrium of concurrent forces from the laws of motion. Before this, [[equations-of-motion]] covers motion along a line; after it, the same adding splits the forces on a block in [[friction-ramp]], and [[vector-lab-3d]] takes vectors into three dimensions.

## How to use it

1. Drag the round handle at the tip of A or of B, or use the size and direction sliders. Directions are measured anticlockwise from the right (east), as on a maths graph.
2. Pick **Triangle**, **Parallelogram** or **Components** to change how the sum is drawn.
3. Tick **Also show A − B** to see the difference as a dashed arrow. Subtracting B is the same as adding B turned round.
4. In the lower card, set the **weight** and the **angle of each string** to the ceiling. The arrows show the two tensions and the weight; their sizes are worked out with Lami's theorem and checked by balancing the forces across and up.

## Worked example

Open the page: **A = 6 at 0°** and **B = 4 at 60°**, so the angle between them is θ = 60°. The law of cosines gives R = √(36 + 16 + 2 × 6 × 4 × 0.5) = √76 = **8.72**. By components, A = (6, 0) and B = (2, 3.46), so R = (8, 3.46), which also has size 8.72 and points **23.4°** above A.

In the Lami card a **100 N** weight hangs from strings at **30°** and **60°** to the ceiling. The strings are then 90° apart, and Lami's theorem gives T₁ = 100 × sin 150° ÷ sin 90° = **50 N** and T₂ = 100 × sin 120° ÷ sin 90° = **86.6 N**. Check: across, 50 cos 30° = 43.3 N and 86.6 cos 60° = 43.3 N cancel; up, 25 + 75 = 100 N holds the weight.

## Tips

- The resultant of A and B is at most A + B (same direction) and at least |A − B| (opposite directions).
- When A and B are at 90°, the law of cosines becomes Pythagoras' theorem, because cos 90° = 0.
- In Lami's theorem each force goes with the sine of the angle between the **other two** forces. A steeper string carries more of the load.

## FAQ

**Why does the triangle law give the same answer as the parallelogram law?** The far side of the parallelogram is just B moved, without turning it, to start at the tip of A. Moving a vector without turning it does not change it.

**Can I add three or more vectors?** Yes: add the x parts, add the y parts, and the resultant is made from those two totals. That is what the Components view shows for two.

**Is anything stored?** No. The questions are made in your browser and nothing is saved or sent.
