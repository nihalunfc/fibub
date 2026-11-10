---
title: "3D vectors explained: sum, dot product, cross product and skew lines"
summary: "What adding vectors, the dot product and the cross product mean in pictures, and how to find the angle and shortest distance between two lines in space."
tools: [vector-lab-3d, matrix-transform, argand-plane, matrix-calculator]
updated: 2026-11-10
sources:
  - "Standard vector algebra and three-dimensional coordinate geometry (components, magnitude, direction cosines, dot and cross products, vector equation of a line, shortest distance between lines)."
---

The 3D vector lab draws vectors as arrows in a box you can spin round, and works out what school vector algebra asks of them: the sum, the dot product, the cross product, and the angle and shortest distance between two lines in space. It is for Class 12 students who find three dimensions hard to picture on a flat page. If you want the flat version first, the [[argand-plane]] adds arrows in two dimensions and [[matrix-transform]] shows how a determinant measures area; for larger calculations, use the [[matrix-calculator]].

## What it is

A **vector** has a size and a direction. In space we write it with three parts, a = (a₁, a₂, a₃): how far it goes along x, along y and along z. Its length, or **magnitude**, comes from Pythagoras twice:

|a| = √(a₁² + a₂² + a₃²)

Dividing each part by the length gives the **direction cosines**, the cosines of the angles the arrow makes with each axis.

**Adding** two vectors means walking along one and then the other. The parts simply add.

The **dot product** a · b = a₁b₁ + a₂b₂ + a₃b₃ is a single number. It also equals |a||b| cos θ, where θ is the angle between the arrows. So it is positive when they point roughly the same way, zero when they are at right angles, and negative when they point apart. Divide it by |a| and you get the length of b's shadow on a, called the **projection**.

The **cross product** a × b is a new vector, at right angles to both a and b:

a × b = (a₂b₃ − a₃b₂, a₃b₁ − a₁b₃, a₁b₂ − a₂b₁)

Its length is the area of the parallelogram with sides a and b. Its direction follows the right-hand rule: curl your fingers from a towards b and your thumb points along a × b.

A **line in space** is written r = p + s d: start at a point p and move any amount s along a direction d. Two lines can meet, be parallel, or be **skew**: not parallel and never meeting, like a road passing over a railway on a bridge. For skew lines the shortest gap is

distance = |(p₂ − p₁) · (d₁ × d₂)| / |d₁ × d₂|

because d₁ × d₂ points straight across from one line to the other.

## How to use it

1. Choose a view at the top: **a + b**, **a · b**, **a × b** or **Lines in space**.
2. Type the x, y and z parts of vector a and vector b. For lines, type a point and a direction for each line.
3. Drag the picture to turn it. **Tilted view**, **From above** and **From the front** jump to a fixed angle.
4. Read the working line, which fills your own numbers into the formula, and the facts underneath.
5. Work through the **Try this** ideas and the quiz to check you have the idea.

## A worked example

Take a = (1, 2, 2) and b = (3, 0, 4).

- **Lengths:** |a| = √(1 + 4 + 4) = **3** and |b| = √(9 + 0 + 16) = **5**.
- **Direction cosines of a:** (1/3, 2/3, 2/3).
- **Sum:** a + b = **(4, 2, 6)**.
- **Dot product:** 1 × 3 + 2 × 0 + 2 × 4 = **11**. So cos θ = 11 ÷ (3 × 5) = 0.7333 and θ ≈ **42.83°**.
- **Projection of b on a:** 11 ÷ 3 ≈ **3.667** units.
- **Cross product:** (2 × 4 − 2 × 0, 2 × 3 − 1 × 4, 1 × 0 − 2 × 3) = **(8, 2, −6)**.
- **Area of the parallelogram:** √(64 + 4 + 36) = √104 ≈ **10.198** square units, so the triangle with sides a and b has area about 5.099.

Now two lines. Line 1 passes through (1, 0, 2) along (1, 1, 0); line 2 through (0, 3, 1) along (0, 1, 2).

- d₁ × d₂ = (1 × 2 − 0 × 1, 0 × 0 − 1 × 2, 1 × 1 − 1 × 0) = **(2, −2, 1)**, with length **3**. It is not zero, so the lines are not parallel.
- p₂ − p₁ = (−1, 3, −1), and its dot product with (2, −2, 1) is −2 − 6 − 1 = −9.
- **Shortest distance:** |−9| ÷ 3 = **3 units**. It is not zero, so the lines are skew.
- **Angle between the lines:** cos θ = (d₁ · d₂) ÷ (|d₁||d₂|) = 1 ÷ (√2 × √5) ≈ 0.3162, so θ ≈ **71.57°**.

The closest points are (2, 1, 2) on line 1 and (0, 3, 1) on line 2. Their gap is (−2, 2, −1), whose length is 3, as it should be.

## Where it is used

- **Physics.** Work done is a dot product of force and displacement; torque and magnetic force are cross products.
- **Computer graphics and games.** The dot product decides how brightly a surface is lit; the cross product gives the direction a surface faces.
- **Engineering and architecture.** Checking clearance between pipes, cables or beams that pass each other is a shortest-distance problem between skew lines.

## Common mistakes

- **Mixing up the middle part of the cross product.** It is a₃b₁ − a₁b₃, not a₁b₃ − a₃b₁. Check your answer by dotting it with a and b: both must give 0.
- **Swapping the order.** b × a = −(a × b). The size is the same but the direction flips.
- **Forgetting the absolute value in the distance.** A distance cannot be negative; the sign of the dot product only tells you which side.
- **Using the skew formula for parallel lines.** If d₁ × d₂ = 0 you would divide by zero. Use |(p₂ − p₁) × d₁| ÷ |d₁| instead.

## Questions people ask

**Can I take a cross product in two dimensions?** Not as a vector. Put a 0 for z, and the answer points straight along z with size a₁b₂ − a₂b₁, which is the 2D determinant.

**Why does a zero cross product mean parallel?** The parallelogram is flat when the vectors point along the same line, so its area, and the cross product's length, is zero.
