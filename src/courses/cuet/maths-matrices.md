---
title: 'Maths: matrices and determinants'
seoTitle: 'Matrices and determinants for CUET Maths'
summary: 'Matrix types and operations, transpose, symmetric and skew-symmetric matrices, determinants and their properties, adjoint and inverse, and solving equations with matrices, with a live 3 × 3 determinant problem.'
minutes: 22
updated: 2026-11-22
quiz:
  - q: 'If A is 2 × 3 and B is 3 × 4, then AB is:'
    choices: ['2 × 4', '3 × 3', 'not defined']
    ans: 0
    why: 'Inner sizes match (3 and 3), and the result takes the outer sizes: 2 × 4.'
  - q: 'For a 3 × 3 matrix A, |kA| equals:'
    choices: ['k³|A|', 'k|A|', '3k|A|']
    ans: 0
    why: 'Each of the three rows is multiplied by k, and each row brings a factor k out of the determinant.'
  - q: 'A system AX = B has a unique solution when:'
    choices: ['|A| ≠ 0', '|A| = 0', 'B = 0 only']
    ans: 0
    why: 'Then A⁻¹ exists and X = A⁻¹B. If |A| = 0 there are either no solutions or infinitely many.'
sources:
  - 'NCERT, Mathematics Part I (Class 12), Matrices; Determinants'
  - 'National Testing Agency, CUET (UG) Mathematics syllabus https://cuet.nta.nic.in/ (checked 2026-11-22)'
  - 'Questions: original fibub writing for this course'
---

**Module 8 · about 22 minutes.** By the end you will multiply matrices, evaluate determinants quickly, find an inverse and solve a system of equations.

<div class="bigidea">A matrix is a table of numbers that acts on other tables. Its determinant is one number that says whether that action can be undone: zero means it squashes space flat and cannot be reversed.</div>

**Everyday picture:** a shop's bill. Rows are customers, columns are items, and multiplying the quantity matrix by the price column gives each customer's total in one move.

## 1. Operations

| Idea | Rule |
|---|---|
| AB defined | columns of A = rows of B; usually AB ≠ BA |
| Transpose | (AB)ᵀ = BᵀAᵀ |
| Symmetric | Aᵀ = A |
| Skew-symmetric | Aᵀ = −A (diagonal all zero) |
| Any square matrix | A = ½(A + Aᵀ) + ½(A − Aᵀ), symmetric + skew |

## 2. Determinants

<div class="steps" data-title="Shortcuts that save time">
<div class="step"><b>Swap two rows:</b> the sign flips.</div>
<div class="step"><b>Two equal (or proportional) rows:</b> the determinant is 0.</div>
<div class="step"><b>Add a multiple of one row to another:</b> no change. Use it to make zeros before expanding.</div>
<div class="step"><b>Take a common factor</b> out of a row.</div>
<div class="step"><b>Products:</b> |AB| = |A||B|, |Aᵀ| = |A|, |kA| = kⁿ|A| for n × n.</div>
</div>

<div class="problem" data-problem="det-3x3"></div>

Area of a triangle with corners (x₁, y₁), (x₂, y₂), (x₃, y₃) = ½ |det of rows (x, y, 1)|. Zero area means the points are collinear.

## 3. Inverse and equations

```math
A^{-1} = \frac{1}{|A|}\,\operatorname{adj}A \qquad A(\operatorname{adj}A) = |A|\,I \qquad X = A^{-1}B
```

<div class="meaning">

<dl>
<dt>adj A</dt><dd>transpose of the matrix of cofactors. For 2 × 2, swap the diagonal and change the signs of the other two.</dd>
<dt>|adj A|</dt><dd>= |A|ⁿ⁻¹ for an n × n matrix.</dd>
<dt>Physical meaning</dt><dd>if |A| = 0 the equations are not independent (one is a mix of the others), so you cannot pin down a single answer.</dd>
</dl>

</div>

<div class="myth">

**"AB = 0 means A = 0 or B = 0."** Two non-zero matrices can multiply to the zero matrix. Matrix algebra breaks this rule of ordinary numbers, and also AB = AC does not let you cancel A unless A is invertible.

</div>

## 4. Practice

<div class="qbank" data-bank="entrance-maths" data-topics="matrices-determinants" data-exam="cuet" data-n="10" data-mode="practice" data-type="mcq"></div>

<div class="keypoints">

- AB needs inner sizes equal; AB ≠ BA in general; (AB)ᵀ = BᵀAᵀ.
- |kA| = kⁿ|A|, |AB| = |A||B|, |adj A| = |A|ⁿ⁻¹.
- A⁻¹ = adj A / |A|, exists only if |A| ≠ 0.
- AX = B: unique solution X = A⁻¹B when |A| ≠ 0.

</div>
