---
title: "How to find the inverse of a 3x3 matrix (with a worked example)"
summary: "Check the determinant is not 0, then either row reduce [A | I] or divide the adjugate by det A. Worked example in exact fractions, and how to check it."
tools: [matrix-calculator, matrix-transform, symbolic-algebra]
updated: 2026-11-10
sources:
  - "Gauss-Jordan elimination, cofactors, the adjugate and A⁻¹ = adj(A)/det(A): standard linear algebra, as taught in Class 12 maths and first-year university courses."
---

A 3x3 matrix A has an inverse only when its determinant is not zero, and then A⁻¹ = adj(A) / det(A), or, the same answer by a different road, you row reduce [A | I] until the left half becomes the identity. The [[matrix-calculator]] does the row-reduction method in exact fractions and lists every row operation, so you can follow it line by line.

## What you need

- **The matrix A**, all nine entries. Whole numbers, decimals and fractions such as 3/4 are all fine.
- **Its determinant.** If det A = 0, the matrix is called **singular** and there is no inverse at all, so it is worth finding this first.
- **One of the two hand methods**: cofactors and the adjugate (common in school exams), or row reduction (Gauss-Jordan, common at university and much quicker for big matrices).

A few words used below. The **identity matrix I** has 1s down the main diagonal and 0s everywhere else; multiplying by it changes nothing. The **minor** of an entry is the 2x2 determinant left when you cover that entry's row and column. The **cofactor** is the minor with a + or − sign from the chessboard pattern (+ − + / − + − / + − +). The **adjugate** is the matrix of cofactors, transposed (rows turned into columns).

## Step by step

1. **Open the matrix calculator** and choose **Inverse (with steps)** in the **Work out** list.
2. **Type A in the Matrix A box**, one row per line, entries separated by spaces or commas. You can also paste `[[2, 0, 1], [1, 1, 0], [0, 3, 1]]` straight from Python.
3. **Read the result.** If an inverse exists, the page shows A⁻¹ and det A. It also multiplies A by its answer and tells you when A × A⁻¹ comes out as I exactly. If A is singular, it says so and gives the rank.
4. **Follow the steps.** Each row operation is written out, such as R2 → R2 − 2R1, with the whole augmented matrix after it.
5. **Switch Show numbers as to Decimals** if you want the answer as decimals, and use **Download result (CSV)** to keep it.

The formula for the cofactor route:

A⁻¹ = (1 / det A) × adj(A), where adj(A) = (matrix of cofactors)ᵀ

## A worked example

Find the inverse of

A = [2 0 1; 1 1 0; 0 3 1]

(semicolons separate the rows).

**1. Determinant**, expanding along the first row:

det A = 2(1·1 − 0·3) − 0(1·1 − 0·0) + 1(1·3 − 1·0) = 2 − 0 + 3 = **5**

It is not zero, so the inverse exists.

**2. Cofactors.** Cover each entry's row and column, take the 2x2 determinant, and apply the sign pattern:

- Row 1: C₁₁ = +(1 − 0) = 1, C₁₂ = −(1 − 0) = −1, C₁₃ = +(3 − 0) = 3
- Row 2: C₂₁ = −(0 − 3) = 3, C₂₂ = +(2 − 0) = 2, C₂₃ = −(6 − 0) = −6
- Row 3: C₃₁ = +(0 − 1) = −1, C₃₂ = −(0 − 1) = 1, C₃₃ = +(2 − 0) = 2

**3. Adjugate.** Transpose the cofactor matrix, so its rows become columns:

adj(A) = [1 3 −1; −1 2 1; 3 −6 2]

**4. Divide by det A = 5:**

A⁻¹ = [1/5 3/5 −1/5; −1/5 2/5 1/5; 3/5 −6/5 2/5]

Type the same A into the calculator and it reaches this answer in six steps by row reduction. First it swaps R1 and R2 to get a 1 in the top corner. Then it clears below the pivot with R2 → R2 − 2R1 and scales R2 by −1/2. After that it clears the second column and scales R3 by 2/5. The last step clears the third column. The right half of [A | I] is then exactly the matrix above, and the page confirms det A = 5.

## Check your answer

Multiply A by your answer. Every entry of A × A⁻¹ should be 0 except the diagonal, which should be 1. A fast spot check is the first row of A times each column of adj(A), then divide by 5:

- (2, 0, 1)·(1, −1, 3) = 2 + 0 + 3 = 5, so 5/5 = 1
- (2, 0, 1)·(3, 2, −6) = 6 + 0 − 6 = 0
- (2, 0, 1)·(−1, 1, 2) = −2 + 0 + 2 = 0

That gives 1, 0, 0, the first row of I. If one of these is off, the usual culprit is a missed sign in the chessboard pattern or forgetting to transpose.

For a quick picture of what an inverse does, the [[matrix-transform]] page shows a 2x2 matrix stretching and turning the plane. The inverse is the matrix that undoes it. To keep letters instead of numbers in the entries, use [[symbolic-algebra]], because the matrix calculator takes numbers only.

## Questions people ask

**Why does a zero determinant mean no inverse?** det A = 0 means the matrix squashes space flat, losing a dimension. Nothing can stretch it back out, so no matrix undoes it.

**Can I use the inverse to solve three simultaneous equations?** Yes: if A x = b, then x = A⁻¹ b. In practice, choosing **Solve A x = B** in the calculator is quicker. It row reduces once and also handles systems with no solution or infinitely many.

**Which method should I learn?** For a 3x3 in an exam, cofactors are reliable and easy to mark. For 4x4 and up, row reduction needs far fewer sums.
