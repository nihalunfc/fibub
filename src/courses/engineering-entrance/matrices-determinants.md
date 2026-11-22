---
title: Matrices and determinants
seoTitle: 'Matrices and determinants: JEE maths'
summary: 'Matrix types and operations, transpose, symmetric and skew-symmetric parts, special matrices (idempotent, nilpotent, involutory, orthogonal), determinants as signed area with their properties, minors, cofactors, adjoint and inverse, the rules for |kA| and |adj A|, Cayley-Hamilton, and systems of equations with consistency and parameters.'
minutes: 36
updated: 2026-11-22
quiz:
  - q: 'A is a 3 × 3 matrix with |A| = 4. What is |2A|?'
    choices: ['8', '16', '32', '64']
    ans: 2
    why: 'Multiplying a matrix by 2 multiplies each of its 3 rows by 2, so |2A| = 2³ × 4 = 32.'
  - q: 'The diagonal entries of a skew-symmetric matrix are:'
    choices: ['all 1', 'all 0', 'any real numbers', 'equal to each other but not zero']
    ans: 1
    why: 'Skew-symmetric means aᵢⱼ = −aⱼᵢ. On the diagonal i = j, so aᵢᵢ = −aᵢᵢ, which forces aᵢᵢ = 0.'
  - q: 'A 3 × 3 matrix A has |A| = 5. What is |adj A|?'
    choices: ['5', '15', '25', '125']
    ans: 2
    why: '|adj A| = |A|ⁿ⁻¹ = 5² = 25 for n = 3.'
sources:
  - 'NCERT Mathematics Class 12 (Matrices; Determinants): topics followed, no text copied'
  - 'JEE Main and JEE Advanced 2026 syllabi: Matrices and determinants'
---

**Maths · Class 12 · about 36 minutes.** By the end you will be able to multiply and transpose matrices with confidence, recognise the special matrices JEE likes, evaluate determinants quickly with row operations, find adjoints and inverses, use the rules for |kA| and |adj A|, apply Cayley-Hamilton, and decide whether a system of equations has one, many or no solutions.

<div class="bigidea">A matrix is a machine that moves points of space. Its determinant is the factor by which it stretches areas (or volumes), with a minus sign if it flips space over. A determinant of zero means space is squashed flat, information is lost, and the machine cannot be run backwards: no inverse, and a system of equations without a unique answer.</div>

## 1. Matrices and their types

An m × n matrix has m rows and n columns; aᵢⱼ is the entry in row i, column j. Types: row, column, square, diagonal (zeros off the diagonal), scalar (diagonal with equal entries), identity I, zero matrix, upper or lower triangular.

**Counting matrices.** A 2 × 2 matrix with entries from {0, 1} can be made in 2⁴ = 16 ways; an m × n matrix with entries from k values in kᵐⁿ ways. A matrix with 12 entries can have order 1 × 12, 2 × 6, 3 × 4, 4 × 3, 6 × 2 or 12 × 1: one order for each divisor.

## 2. Operations

- **Addition** needs equal orders. **Product** AB needs (columns of A) = (rows of B); an m × n times an n × p gives m × p, with `$(AB)_{ij} = \sum_k a_{ik}b_{kj}$` (row i of A against column j of B).
- **AB ≠ BA in general.** Matrices that do commute include any matrix with I, with itself, and with its own inverse.
- AB = O does not mean A = O or B = O. For example, two nonzero 2 × 2 matrices can multiply to zero.
- **Transpose** Aᵀ swaps rows and columns: `$(AB)^T = B^TA^T$` (order reverses).
- **Trace** = sum of diagonal entries; tr(AB) = tr(BA).

<div class="myth">

**"(A + B)² = A² + 2AB + B²."** Only if AB = BA. In general (A + B)² = A² + AB + BA + B². The same care applies to (A − B)(A + B) and to the binomial theorem for matrices.

</div>

Choose two transformations and press Apply, then press 'Swap the order' and apply them again.

<figure class="fig" data-fig="@math-matrix-compose"><figcaption>Notice that the letter F ends up in different places when the order is swapped (AB ≠ BA) and that the area is multiplied by the determinant at each stage.</figcaption></figure>

## 3. Symmetric, skew-symmetric and special matrices

A is **symmetric** if Aᵀ = A and **skew-symmetric** if Aᵀ = −A (so its diagonal is all zeros). Every square matrix splits uniquely:

```math
A = \underbrace{\tfrac12(A + A^T)}_{\text{symmetric}} + \underbrace{\tfrac12(A - A^T)}_{\text{skew-symmetric}}
```

| Name | Rule | A quick fact |
|---|---|---|
| Idempotent | A² = A | Aⁿ = A for every n ≥ 1; I − A is also idempotent |
| Nilpotent | Aᵏ = O for some k | (I − A)⁻¹ = I + A + A² + … + Aᵏ⁻¹ |
| Involutory | A² = I | A⁻¹ = A |
| Orthogonal | AAᵀ = I | A⁻¹ = Aᵀ and |A| = ±1 |

**Powers.** For Aⁿ, compute A², A³ and spot the pattern, then prove it by induction. Useful: if A = I + N with N nilpotent and N² = O, then Aⁿ = I + nN, since I and N commute.

**Counting with conditions.** An n × n symmetric matrix is fixed by its n(n + 1)/2 entries on and above the diagonal; a skew-symmetric one by the n(n − 1)/2 entries above it.

## 4. Determinants

For a 2 × 2 matrix, `$\begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc$`. Play with the figure: the columns (a, c) and (b, d) span a parallelogram, and its signed area is exactly ad − bc.

<figure class="fig" data-fig="det-area"><figcaption>The unit square and its image. Area is multiplied by |det|; a negative determinant flips the picture; a zero determinant squashes it onto a line.</figcaption></figure>

For 3 × 3, expand along any row or column using cofactors, with the sign pattern + − + / − + − / + − +. The **minor** Mᵢⱼ is the determinant left after deleting row i and column j; the **cofactor** is `$C_{ij} = (-1)^{i+j}M_{ij}$`.

**Properties** (each true for rows and columns alike):

1. |Aᵀ| = |A|.
2. Swapping two rows changes the sign.
3. Two equal (or proportional) rows give 0.
4. A common factor of a row can be taken out; so |kA| = kⁿ|A| for order n.
5. Adding a multiple of one row to another changes nothing. This is the key tool: make zeros, then expand.
6. A row that is a sum can be split into two determinants.
7. |AB| = |A||B|.
8. A triangular matrix has determinant = product of its diagonal.

Expanding along a row and using the cofactors of a **different** row always gives 0. That fact is why the adjoint formula below works.

<div class="problem" data-problem="mat-det3"></div>

## 5. Adjoint and inverse

The **adjoint** adj A is the transpose of the matrix of cofactors. It satisfies

```math
A\,(\operatorname{adj}A) = (\operatorname{adj}A)\,A = |A|\,I, \qquad A^{-1} = \frac{1}{|A|}\operatorname{adj}A \quad (|A| \neq 0)
```

<div class="meaning">
<dl>
<dt>n</dt><dd>the order of the square matrix A</dd>
<dt>|A|</dt><dd>its determinant; A is <b>singular</b> if |A| = 0 (no inverse) and non-singular otherwise</dd>
<dt>adj A</dt><dd>transpose of the cofactor matrix; for 2 × 2 just swap a and d and change the signs of b and c</dd>
<dt>Physical meaning</dt><dd>A⁻¹ undoes what A does. If A multiplies areas by |A|, its inverse must divide by |A|, which is impossible when |A| = 0.</dd>
</dl>
</div>

Rules for order n (all follow from A·adj A = |A|I and |kA| = kⁿ|A|):

| Quantity | Value |
|---|---|
| \|kA\| | kⁿ\|A\| |
| \|adj A\| | \|A\|ⁿ⁻¹ |
| adj(adj A) | \|A\|ⁿ⁻² A |
| \|adj(adj A)\| | \|A\|⁽ⁿ⁻¹⁾² |
| \|A⁻¹\| | 1/\|A\| |
| (AB)⁻¹, adj(AB) | B⁻¹A⁻¹, (adj B)(adj A) |

<div class="problem" data-problem="mat-adj"></div>

**Cayley-Hamilton.** Every square matrix satisfies its own characteristic equation |A − λI| = 0. For 2 × 2, that is `$A^2 - (\operatorname{tr}A)A + |A|\,I = O$`. Multiply by A⁻¹ to get A⁻¹ = (1/|A|)[(tr A)I − A], or use it to reduce high powers of A.

## 6. Systems of linear equations

Write the system as AX = B. If |A| ≠ 0, there is exactly one solution, X = A⁻¹B, or by **Cramer's rule** x = Δₓ/Δ, y = Δᵧ/Δ, z = Δ_z/Δ, where Δₓ has the x-column replaced by B.

<div class="problem" data-problem="mat-cramer"></div>

| Case | Result |
|---|---|
| Δ ≠ 0 | unique solution (consistent) |
| Δ = 0 and at least one of Δₓ, Δᵧ, Δ_z ≠ 0 | no solution (inconsistent) |
| Δ = 0 and Δₓ = Δᵧ = Δ_z = 0 | usually infinitely many; check by elimination, since for three equations it can still be none |

**Homogeneous systems** (B = O) always have x = y = z = 0. They have a **non-trivial** solution exactly when Δ = 0. JEE parameter questions ("find k for which the system has a non-zero solution") are solved by setting Δ = 0.

<div class="myth">

**"Δ = 0 and all Δₓ, Δᵧ, Δ_z = 0 means infinitely many solutions."** For two equations in two unknowns, yes. For three equations it can fail: three parallel planes give every Δ zero yet have no common point. Confirm with elimination.

</div>

## 7. Determinants in geometry

The area of a triangle with vertices (x₁, y₁), (x₂, y₂), (x₃, y₃) is

```math
\text{Area} = \frac12\left|\begin{vmatrix} x_1 & y_1 & 1 \\ x_2 & y_2 & 1 \\ x_3 & y_3 & 1 \end{vmatrix}\right|
```

The points are **collinear** when this determinant is 0, and the line through (x₁, y₁) and (x₂, y₂) is the equation obtained by putting (x, y) as the third point and setting the determinant to 0.

## 8. JEE Advanced level: speed tricks

- **Cyclic determinants** like rows (a, b, c), (b, c, a), (c, a, b): add all columns to the first to pull out (a + b + c); the value is −(a³ + b³ + c³ − 3abc).
- **Factor theorem**: if putting a = b makes two rows equal, then (a − b) is a factor. Find all such factors, then match the degree and one coefficient.
- **Matrix equations**: from A² − 5A + 7I = O, multiply by A⁻¹ to get A⁻¹ = (5I − A)/7.
- **Orthogonal matrices** have orthonormal rows; use AAᵀ = I to find unknown entries quickly.

Next: [Matrices and determinants: question types and traps](/learn/courses/engineering-entrance/matrices-determinants-questions/).

<div class="keypoints">

- AB needs matching inner orders; AB ≠ BA in general; (AB)ᵀ = BᵀAᵀ and (AB)⁻¹ = B⁻¹A⁻¹.
- A = symmetric part + skew part; skew-symmetric matrices have a zero diagonal.
- Idempotent A² = A, nilpotent Aᵏ = O, involutory A² = I, orthogonal AAᵀ = I.
- det is the signed area or volume factor; use row operations to make zeros, then expand.
- |kA| = kⁿ|A|, |adj A| = |A|ⁿ⁻¹, adj(adj A) = |A|ⁿ⁻²A, A⁻¹ = adj A/|A|.
- Cayley-Hamilton for 2 × 2: A² − (tr A)A + |A|I = O.
- Δ ≠ 0: unique solution; homogeneous system has a non-trivial solution only when Δ = 0.

</div>
