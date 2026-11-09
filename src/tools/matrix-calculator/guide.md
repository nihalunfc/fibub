---
name: Matrix calculator
num: 543
shelf: science
section: pure-mathematics
title: "Matrix calculator with steps: determinant, inverse, RREF, eigenvalues and eigenvectors, LU, QR, Cholesky, SVD"
summary: "Determinant, inverse, rank and row reduction with every step in exact fractions, solving A x = B, products and powers, eigenvalues and eigenvectors (complex ones too), and LU, QR, Cholesky and SVD decompositions. Checked against numpy and sympy."
status: live
ads: true
order: 543
icon: table
works: offline
updated: 2026-11-09
related: [numerical-methods, symbolic-algebra, uncertainty-calculator, plot-maker]
sources:
  - "Methods: Gauss-Jordan elimination and LU in exact fractions, the Faddeev-LeVerrier characteristic polynomial, Householder QR, shifted QR iteration for eigenvalues, one-sided Jacobi SVD (standard textbook linear algebra)."
  - "Checked against numpy, scipy and sympy on 11 matrices (square, singular, rectangular, complex eigenvalues, a Jordan block) and a random 10 × 10."
  - "The example matrices are made up for this tool."
flow:
  - { icon: table, label: "Type A" }
  - { icon: sliders, label: "Pick a job" }
  - { icon: sigma, label: "Steps" }
  - { icon: download, label: "Download" }
---

## What it does

A matrix calculator for homework, lab work and checking your own working. Type a matrix and choose what to work out:

- **Determinant**, **inverse**, **rank and reduced row echelon form (RREF)**, with every row operation shown, in exact fractions (no rounding: 1/3 stays 1/3).
- **Solve A x = B**: one solution, no solution, or infinitely many, written with free variables.
- **Products and powers**: A × B, A + B, A − B, the transpose and Aⁿ (negative n uses the inverse).
- **Eigenvalues and eigenvectors**, including complex ones, with the characteristic polynomial and each eigenvalue's algebraic and geometric multiplicity (so you can see whether A is diagonalisable).
- **Decompositions**: LU (P A = L U), QR, Cholesky (A = L Lᵀ) and the singular value decomposition (A = U Σ Vᵀ) with the rank, 2-norm and condition number.

## How to use it

1. Type matrix A with one row per line and spaces or commas between entries. Entries may be whole numbers, decimals such as 0.25 or fractions such as -3/4. You can also paste `[[1, 2], [3, 4]]` from Python, or open a CSV or Excel file.
2. Choose the job in **Work out**. Jobs with two matrices show a box for B.
3. **Show numbers as** switches between exact fractions and decimals (6 significant figures).
4. For LU, **Row swaps** chooses between swapping rows only when a pivot is zero, as you would by hand, or always moving the largest entry up (partial pivoting), which is what numpy and scipy do and is safer with decimals.
5. Download the result as CSV, or the whole working (input, result and steps) as an image, PDF or Word file.

The row reduction picks, in each column, the first row with a nonzero entry, and prefers a 1 or −1 when there is one, as people do by hand. Different but equally correct steps are possible; the final RREF is always the same.

## Worked example

The first example is the system 2x + y − z = 8, −3x − y + 2z = −11, −2x + y + 2z = −3. With **Solve A x = B** the tool shows six row-operation steps and the answer **x₁ = 2, x₂ = 3, x₃ = −1**. The same A has determinant −1.

The eigenvalue example A = [4 1; 2 3] has characteristic polynomial λ² − 7λ + 10, so its eigenvalues are 5 and 2, with eigenvectors (1, 1) and (1, −2). The complex example [1 −2; 1 3] has eigenvalues 2 + i and 2 − i, with eigenvectors (1 − i, −1) and (1 + i, −1). The Cholesky example gives L with rows (2, 0, 0), (6, 1, 0) and (−8, 5, 3).

## What is exact and what is decimal

Determinants, inverses, row reduction, solving, products, powers, LU and the characteristic polynomial are exact. Eigenvalues are found numerically, then any that are fractions (such as 3 or −1/2) or fractions plus a fraction times i (such as 2 + i) are confirmed exactly in the characteristic polynomial and shown with whole-number eigenvectors. Others, such as the roots of λ² − 2, are shown as decimals with eigenvectors of length 1. QR, Cholesky and SVD need square roots, so they are decimals; the page shows the largest error when the factors are multiplied back.

## What it does not do

It does not take symbols (like a or x) as entries; use the symbolic algebra tool for those. Square roots or π as entries are not accepted. Matrices are limited to 12 × 12 so the steps stay readable. Eigenvalues that are not fractions are not given in surd form.

## Frequently asked questions

**Why is my eigenvector different from my textbook's?** Any nonzero multiple of an eigenvector is also an eigenvector. This tool scales exact ones to the smallest whole numbers, and decimal ones to length 1.

**Why do some U and V columns of the SVD have the opposite sign to numpy?** Flipping the sign of a matching pair of columns gives an equally valid SVD.

**Is my data sent anywhere?** No. Everything is worked out on your device.

Plot your results with the [publication plot maker](/science/plot-maker/).
