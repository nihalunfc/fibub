---
title: "Matrices as transformations: what a 2 × 2 matrix does to the plane"
summary: "See a 2 × 2 matrix bend the grid, read the determinant as an area scale, compare AB with BA, and solve a 3 × 3 system with the adjoint in exact fractions."
tools: [matrix-transform, matrix-calculator, unit-circle, argand-plane]
updated: 2026-11-10
sources:
  - "Matrices as linear maps, the determinant as signed area scale, matrix products as composition, cofactors, the adjoint and A⁻¹ = adj A / |A|: standard linear algebra."
---

The matrix transform page turns a grid of numbers into a picture. Type four numbers, or pick a ready-made rotation, shear or reflection, and watch the whole plane move. It is built for Class 12 students meeting matrices and determinants, and for teachers,. For larger matrices and plain arithmetic, move on to the [[matrix-calculator]]; to see where cos θ and sin θ come from, open the [[unit-circle]]; and for the same turns and stretches done with complex numbers, try the [[argand-plane]].

## What it is

A 2 × 2 matrix [a b; c d] is a rule for moving points. A point (x, y) is sent to a new point:

(x, y) → (ax + by, cx + dy)

Here a, b, c and d are the four entries of the matrix, read row by row. Straight lines stay straight, parallel lines stay parallel and the origin stays put, so a square grid becomes a grid of identical parallelograms.

Two ideas make this easy to read:

- **The columns tell you everything.** The first column (a, c) is where the point (1, 0) lands. The second column (b, d) is where (0, 1) lands.
- **The determinant is an area scale.** The number det A = ad − bc tells you how many times bigger every shape becomes. A negative determinant means the plane has also been flipped, like a mirror image. A determinant of 0 means the plane has been squashed flat onto a line, and no matrix can undo that, so there is no inverse.

When you do one transformation and then another, the single matrix that does both is a product. If A acts first and B second, the product is BA, because the matrix nearest the point acts first.

For a set of three equations in x, y and z, the page writes the system as AX = B and solves it with X = A⁻¹B, where A⁻¹ = adj A ÷ |A| (adj A is the adjoint, the transpose of the matrix of cofactors).

## How to use it

1. Choose a mode at the top: **2 × 2 transform**, **One, then another**, or **Solve 3 × 3**.
2. In the first mode, pick a preset from the menu or type into the four boxes (each between −10 and 10). For a rotation, a θ slider appears, from −180° to 180°.
3. Drag the **Morph from the identity** slider from 0 % to 100 % to watch the grid travel from its starting place to its final shape. Read the facts below: det A, the area scale, whether the picture is kept or flipped, where the two basis points go, and the inverse.
4. In **One, then another**, choose a preset for A (done first) and one for B (done second). The orange shape is after A, the blue one after both. The facts list BA, AB and det(BA).
5. In **Solve 3 × 3**, type whole-number coefficients and right-hand sides, or press **Example 1**, **No solution** or **Many solutions**. The numbered steps give |A|, the cofactors, adj A, A⁻¹ in fractions, the answer and a check.

## A worked example

Take A = [3 1; 1 2].

- (1, 0) goes to (3, 1) and (0, 1) goes to (1, 2), the two columns.
- det A = 3 × 2 − 1 × 1 = 5. The unit square becomes a parallelogram of area 5 square units, and the letter F is not flipped.
- The inverse is (1/5)[2 −1; −1 3] = [0.4 −0.2; −0.2 0.6].

Now try order. In **One, then another**, set A to **Shear along x** [1 1; 0 1] and B to **Rotation by θ**, which this mode uses at 90°, so B = [0 −1; 1 0]. Then BA = [0 −1; 1 1] but AB = [1 −1; 1 0]. Different matrices, so the two orders really do land the F in different places.

Finally, a 3 × 3 system:

- 2x + y − z = 3
- x + 3y + 2z = 13
- 3x − y + z = 4

The page finds |A| = 25 and (adj A)B = (35, 60, 55). Dividing by 25 gives x = 7/5, y = 12/5 and z = 11/5. Check the first equation: 2 × 1.4 + 2.4 − 2.2 = 3.

## Where it is used

- **Computer graphics and games.** Every rotation, zoom and skew of a sprite or a 3D model is a matrix. Chaining moves is multiplying matrices, and getting the order wrong is a classic bug.
- **Engineering and physics.** Stress, strain and rotations of rigid bodies are written as matrices. The determinant says whether a change of coordinates squashes space.
- **Data science.** Principal component analysis rotates and stretches data clouds.

## Common mistakes

- **Multiplying in the wrong order.** "A then B" is BA. Say it aloud before you write it, and check against the orange and blue shapes.
- **Mixing up rows and columns.** The images of (1, 0) and (0, 1) are the columns, not the rows. Read down, not across.
- **Forgetting the sign of the determinant.** An area can't be negative, so the area scale is |det A|. The sign only tells you about flipping.
- **Dividing by zero.** If |A| = 0, there is no A⁻¹. The page then checks (adj A)B to say whether there is no solution or infinitely many. Don't force a division.

## Questions people ask

**Does a rotation change area?** No. A rotation by any angle has determinant cos²θ + sin²θ = 1, so shapes keep their size.

**Can two different matrices give the same picture?** Not for the whole grid. If two matrices send (1, 0) and (0, 1) to the same places, they are the same matrix.

**Why does the morph slider pass through odd shapes?** It blends each entry from the identity towards your matrix, so midway you see a halfway matrix, not a halfway rotation. A rotation on the way can look stretched for a moment.

