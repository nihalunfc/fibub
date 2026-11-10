---
name: Matrix transform
num: 1189
shelf: learn
section: school-maths
title: "Matrix transform"
summary: "Watch a 2 × 2 matrix move the whole grid: rotations, shears, stretches, reflections and squashes, with the determinant shown as the area scale and the sign as a flip. Do one transformation after another to see why AB ≠ BA, and solve a 3 × 3 system step by step with cofactors, the adjoint and A⁻¹ in exact fractions."
status: live
ads: false
order: 1189
icon: table
works: offline
updated: 2026-11-09
related: [matrix-calculator, argand-plane, unit-circle]
sources:
  - "Standard linear algebra: matrices as linear maps of the plane, the determinant as signed area scale, composition as a product, minors, cofactors, the adjoint, the inverse A⁻¹ = adj A / |A| and consistency of AX = B. Written for fibub; no textbook text, figures or exercises are used, and the example systems are made up."
  - "Checked against sympy 1.14: determinants, adjugates, inverses, ranks and solutions of four 3 × 3 systems (unique, none, many), and 2 × 2 products and inverses."
flow:
  - { icon: table, label: "Matrix" }
  - { icon: sliders, label: "Morph" }
  - { icon: target, label: "det = area" }
  - { icon: calculator, label: "Solve" }
---

## What it shows

A 2 × 2 matrix is a machine that moves every point of the plane: the point (x, y) goes to (ax + by, cx + dy). Straight lines stay straight and the origin stays put, so the whole square grid turns into a grid of parallelograms. The page draws that: the grey grid is where you started, the blue grid is where the matrix sends it, and the shaded parallelogram is where the unit square lands.

Two things fall out of the picture. The **columns** of the matrix are where (1, 0) and (0, 1) go (the two arrows). And the **determinant** ad − bc is how much every area is scaled; if it is negative, the picture is flipped like a mirror image (watch the letter F), and if it is 0, the plane is squashed onto a line and nothing can undo it, so there is no inverse.

It follows matrices and determinants in Class 12 maths. For plain number crunching on bigger matrices, use the [[matrix-calculator]]; the [[unit-circle]] page explains the cos θ and sin θ inside a rotation matrix, and the [[argand-plane]] shows multiplication by a complex number as the same kind of turn and stretch.

## How to use it

1. **2 × 2 transform.** Pick a preset (rotation by θ, shear, stretch, reflections, a squash, the identity) or type your own four numbers. Slide **Morph** from 0 % to 100 % to watch the grid move from where it was to where the matrix sends it.
2. Read the facts: det A with the numbers filled in, the area scale, whether the picture is flipped, where (1, 0) and (0, 1) go, and the inverse matrix when there is one.
3. **One, then another.** Choose A (done first) and B (done second). Orange shows the picture after A, blue after A and then B. The product that does both is **BA**, with the first one on the right; the facts also give AB so you can compare.
4. **Solve 3 × 3.** Type the coefficients of x, y and z and the right-hand side of three equations. The steps give |A| by expanding along the first row, the cofactors, the adjoint, A⁻¹ in fractions and X = A⁻¹B, with a check. If |A| = 0, it says whether the system has no solution or infinitely many.

## Worked example

The shear [2 1; 0 1] sends (1, 0) to (2, 0) and (0, 1) to (1, 1). Its determinant is 2 × 1 − 1 × 0 = **2**, so the unit square becomes a parallelogram of area 2, and the F is not flipped. The inverse is (1/2)[1 −1; 0 2] = [0.5 −0.5; 0 1].

For the system x + y + z = 6, 2y + 5z = −4, 2x + 5y − z = 27, |A| = **−21** and adj A = [−27 6 3; 10 −3 −5; −4 −3 2]. Then (adj A)B = (−105, −63, 42), and dividing by −21 gives **x = 5, y = 3, z = −2**.

## Check yourself

Five questions with fresh numbers: a 2 × 2 determinant, an area after a transformation, an entry of a product, an entry of an inverse and a 3 × 3 determinant. Nothing is saved.

## FAQ

**Why is the product BA and not AB?** Matrices act on the vector to their right, so B(Ax) = (BA)x: A acts first.

**Why does det = 0 mean no inverse?** The plane is squashed onto a line, so different points land on the same spot and you cannot tell where they came from.

**Is this from my textbook?** It covers the standard school topics with its own examples. It is an independent study aid.
