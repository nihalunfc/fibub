---
title: Matrices
seoTitle: 'Matrices Class 12 notes: operations and transpose'
summary: 'Class 12 Matrices with animations: types, addition, row-by-column multiplication, transpose, symmetric and skew-symmetric matrices, and invertible matrices.'
minutes: 80
updated: 2026-11-22
quiz:
  - q: 'A is a 2 × 3 matrix and B is a 3 × 4 matrix. The order of AB is:'
    choices: ['2 × 4', '3 × 3', '4 × 2', 'AB is not defined']
    ans: 0
    why: 'The inner numbers (3 and 3) match, so AB exists. The outer numbers give its order, 2 × 4.'
  - q: 'The diagonal entries of a skew-symmetric matrix are:'
    choices: ['all zero', 'all equal to 1', 'any numbers', 'all equal to each other']
    ans: 0
    why: 'Skew-symmetric means Aᵀ = −A, so a_ii = −a_ii, which forces a_ii = 0.'
  - q: 'If A = [[1, 1], [0, 1]] and B = [[1, 0], [1, 1]], then AB equals:'
    choices: ['[[2, 1], [1, 1]]', '[[1, 1], [1, 2]]', '[[1, 0], [0, 1]]', '[[2, 0], [0, 2]]']
    ans: 0
    why: 'Row by column: (1·1 + 1·1, 1·0 + 1·1) = (2, 1) and (0·1 + 1·1, 0·0 + 1·1) = (1, 1). The matrix [[1, 1], [1, 2]] is BA, so AB ≠ BA.'
sources:
  - 'NCERT Class 12 Mathematics, Chapter 3 “Matrices” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Standard definitions and rules of matrix algebra (see e.g. Strang, G., Introduction to Linear Algebra, Wellesley-Cambridge Press, chapters 1 and 2); every numerical example was recomputed in code.'
---

**Maths · Class 12 · Chapter 3 · about 80 minutes.** By the end you will be able to read a matrix and name its type, add and scale matrices, multiply them row by column and know when the product exists, take transposes, split a square matrix into symmetric and skew-symmetric parts, and find the inverse of a 2 × 2 matrix.

<div class="bigidea">A matrix is a rectangular table of numbers that is treated as one object. Adding is done entry by entry, but multiplying is done row by column, and that is what makes matrices powerful: one matrix can describe a whole transformation of the plane, a shop's bills or a system of equations. The price is that order matters: AB is usually not BA.</div>

## 1. What is a matrix?

A shop at a railway station records, for two families, how many chai, samosas and vada pav each bought. Written as a table with the family names and item names removed, you get

```math
Q = \begin{pmatrix} 4 & 2 & 3 \\ 2 & 5 & 1 \end{pmatrix}
```

That is a **matrix**: numbers (called **entries** or elements) arranged in rows and columns inside brackets. Its **order** is *rows × columns*, so `$Q$` is a `$2 \times 3$` matrix. The entry in row `$i$` and column `$j$` is `$a_{ij}$`: here `$a_{12} = 2$` and `$a_{23} = 1$`. A matrix of order `$m \times n$` has `$mn$` entries. Two matrices are **equal** when they have the same order and every pair of matching entries is equal.

<div class="meaning">
<dl>
<dt>`$A = [a_{ij}]_{m \times n}$`</dt><dd>`$m$` rows, `$n$` columns, `$a_{ij}$` is in row `$i$`, column `$j$` (row first, then column).</dd>
<dt>Order</dt><dd>`$m \times n$`, read "m by n". A `$2 \times 3$` matrix is not the same shape as a `$3 \times 2$` one.</dd>
<dt>Entries</dt><dd>real numbers in this chapter.</dd>
</dl>
</div>

<div class="problem" data-problem="c12m-mat-orders"></div>

## 2. Types of matrices

Some shapes and patterns have names. Choose each type below and tap an entry to read its position. The figure also tells you every type the matrix belongs to (a matrix can be several at once).

<figure class="fig" data-fig="c12m-mat-grid"><figcaption>Eleven types of matrix. Tap an entry to see its position a(i, j). A matrix can belong to several types: an identity matrix is also diagonal, scalar, symmetric and square.</figcaption></figure>

- **Row matrix:** one row (`$1 \times n$`). **Column matrix:** one column (`$m \times 1$`).
- **Square matrix:** `$m = n$`. The entries `$a_{11}, a_{22}, \dots$` form the **main diagonal**.
- **Diagonal matrix:** square, with every entry off the diagonal equal to 0.
- **Scalar matrix:** a diagonal matrix whose diagonal entries are all equal.
- **Identity matrix** `$I$`: scalar with diagonal entries 1. It plays the role of the number 1.
- **Zero matrix** `$O$`: every entry is 0.
- **Upper (lower) triangular:** square, all entries below (above) the diagonal are 0.

## 3. Operations on matrices

### 3.1 Addition and scalar multiplication

You can add two matrices only if they have the **same order**: add the entries in matching places. A **scalar** multiple `$kA$` multiplies every entry by `$k$`. Together: `$kA + mB$` is built entry by entry. Tap an entry of the answer below to see the two entries it came from, or switch B to a different order and watch addition fail.

<figure class="fig" data-fig="c12m-mat-addscale"><figcaption>C = kA + mB entry by entry. Each entry of C uses only the entries in the same position of A and B. If the orders differ, the sum is not defined.</figcaption></figure>

Rules (for matrices of the same order): `$A + B = B + A$`; `$(A + B) + C = A + (B + C)$`; `$A + O = A$`; `$A + (-A) = O$`; `$k(A + B) = kA + kB$`; `$(k + l)A = kA + lA$`. They are exactly the rules of ordinary numbers, because each entry is just a number.

### 3.2 Multiplying two matrices

The product `$AB$` exists only when the number of **columns of A equals the number of rows of B**. If `$A$` is `$m \times n$` and `$B$` is `$n \times q$`, then `$AB$` is `$m \times q$`. Set the two orders below and see when the inner numbers match.

<figure class="fig" data-fig="c12m-mat-orders"><figcaption>AB exists only if the inner numbers match, and its order is the outer numbers. Compare with BA: both, one or neither may exist.</figcaption></figure>

The entry in row `$i$`, column `$j$` of `$AB$` is the **row `$i$` of `$A$` times column `$j$` of `$B$`**: multiply matching entries and add:

```math
(AB)_{ij} = a_{i1}b_{1j} + a_{i2}b_{2j} + \cdots + a_{in}b_{nj}
```

The tea-stall bill is exactly this. If `$Q$` holds quantities and `$p$` is the column of prices, each family's bill is a row of `$Q$` times the price column. Move the price sliders.

<figure class="fig" data-fig="c12m-mat-bill"><figcaption>Bill = Q × p. Each bill is (one row of quantities) times (the price column): multiply matching entries and add.</figcaption></figure>

Now the step-by-step player for a full product of a `$2 \times 3$` and a `$3 \times 2$` matrix:

<div class="steps" data-fig="c12m-mat-mult">
<div class="step">A is 2 × 3 and B is 3 × 2. The inner numbers match, so AB exists and has order 2 × 2.</div>
<div class="step">Entry (1,1): row 1 of A with column 1 of B: 1×7 + 2×9 + 3×11 = 58.</div>
<div class="step">Entry (1,2): row 1 of A with column 2 of B: 1×8 + 2×10 + 3×12 = 64.</div>
<div class="step">Entry (2,1): row 2 of A with column 1 of B: 4×7 + 5×9 + 6×11 = 139.</div>
<div class="step">Entry (2,2): row 2 of A with column 2 of B: 4×8 + 5×10 + 6×12 = 154.</div>
<div class="step">AB is the 2 × 2 matrix [[58, 64], [139, 154]]. BA would be 3 × 3, a different size entirely.</div>
</div>

<div class="problem" data-problem="c12m-mat-entry"></div>

<div class="myth">

**"AB = BA."** Matrix multiplication is **not commutative**. Take `$A = \begin{pmatrix}1&1\\0&1\end{pmatrix}$` and `$B = \begin{pmatrix}1&0\\1&1\end{pmatrix}$`. Then `$AB = \begin{pmatrix}2&1\\1&1\end{pmatrix}$` but `$BA = \begin{pmatrix}1&1\\1&2\end{pmatrix}$`. Even when both products exist and have the same order they usually differ. A cousin mistake: `$(A+B)^2 = A^2 + 2AB + B^2$` is false in general; the correct expansion is `$A^2 + AB + BA + B^2$`.

</div>

Other facts:

- Multiplication is associative `$(AB)C = A(BC)$` and distributive `$A(B + C) = AB + AC$`.
- `$AI = IA = A$` for a square `$A$` and the identity `$I$` of the same order.
- **Two non-zero matrices can multiply to the zero matrix.** For `$A = \begin{pmatrix}0&1\\0&0\end{pmatrix}$`, `$A^2 = O$` although `$A \ne O$`. So from `$AB = O$` you cannot conclude `$A = O$` or `$B = O$`, unlike with numbers.
- `$A^2 = A \cdot A$` and so on, for square matrices.

<div class="problem" data-problem="c12m-mat-square"></div>

<div class="problem" data-problem="c12m-mat-power"></div>

### 3.3 A matrix moves the plane

A `$2 \times 2$` matrix does more than store numbers: it moves every point `$(x, y)$` of the plane. Its two columns say where the points `$(1, 0)$` and `$(0, 1)$` land, so the unit square becomes a parallelogram. Drag the two dots. The **determinant** `$ad - bc$` tells you by what factor areas are scaled (negative means the picture is flipped), and a determinant of 0 flattens the square, which is why such matrices cannot be undone.

<figure class="fig" data-fig="c12m-mat-square"><figcaption>Drag the images of (1,0) and (0,1): they are the columns of the matrix. The unit square becomes a parallelogram of area |ad − bc|. The letter F shows whether the picture is turned over.</figcaption></figure>

<!--fig:tool matrix-transform-->

Multiplying two matrices means doing one transformation after the other, which is why `$AB \ne BA$`: turning then stretching is different from stretching then turning.

<figure class="fig" data-fig="@math-matrix-compose"><figcaption>Two matrix transformations applied in turn to the unit square. Swap the order and the final picture changes: matrix multiplication is not commutative.</figcaption></figure>

## 4. Transpose of a matrix

The **transpose** `$A^T$` (or `$A'$`) swaps rows and columns: entry `$(i, j)$` of `$A$` becomes entry `$(j, i)$`. A `$2 \times 3$` matrix becomes `$3 \times 2$`. Slide the figure to flip the entries over the main diagonal.

<figure class="fig" data-fig="c12m-mat-transpose"><figcaption>The transpose flips the matrix over its main diagonal. Choose a symmetric or a skew-symmetric matrix and watch what happens.</figcaption></figure>

Rules, for matrices where the operations are defined:

```math
(A^T)^T = A,\quad (A + B)^T = A^T + B^T,\quad (kA)^T = kA^T,\quad (AB)^T = B^T A^T
```

Notice the reversal in the last one: `$(AB)^T = B^TA^T$`. Check the orders: if `$A$` is `$m \times n$` and `$B$` is `$n \times q$`, `$AB$` is `$m \times q$`, so `$(AB)^T$` is `$q \times m$`. And `$B^T$` is `$q \times n$`, `$A^T$` is `$n \times m$`, so `$B^TA^T$` is `$q \times m$`, which matches. (`$A^TB^T$` would usually not even exist.)

## 5. Symmetric and skew-symmetric matrices

A square matrix `$A$` is

- **symmetric** if `$A^T = A$`, that is `$a_{ij} = a_{ji}$`: mirror images across the diagonal (a distance table between cities is symmetric);
- **skew-symmetric** if `$A^T = -A$`, that is `$a_{ji} = -a_{ij}$`. Put `$i = j$`: `$a_{ii} = -a_{ii}$`, so every diagonal entry is 0.

A matrix that is both is the zero matrix. For any square `$A$`, `$A + A^T$` is symmetric and `$A - A^T$` is skew-symmetric, which leads to a neat fact: **every square matrix is the sum of a symmetric and a skew-symmetric matrix**:

```math
A = \underbrace{\tfrac12(A + A^T)}_{\text{symmetric}} + \underbrace{\tfrac12(A - A^T)}_{\text{skew-symmetric}}
```

<div class="steps" data-fig="c12m-mat-symskew">
<div class="step">Start with any square matrix A, here 3 × 3.</div>
<div class="step">Flip it over the diagonal to get Aᵀ.</div>
<div class="step">P = ½(A + Aᵀ): add matching entries and halve. The result mirrors across the diagonal, so P is symmetric.</div>
<div class="step">Q = ½(A − Aᵀ): subtract and halve. Mirrored entries have opposite signs and the diagonal is 0, so Q is skew-symmetric.</div>
<div class="step">Add them: P + Q = A. Every square matrix splits this way, and in only one way.</div>
</div>

<div class="problem" data-problem="c12m-mat-skew"></div>

## 6. Invertible matrices

For a square matrix `$A$`, a matrix `$B$` of the same order with `$AB = BA = I$` is called the **inverse** of `$A$`, written `$A^{-1}$`; then `$A$` is **invertible**. Like dividing by a number, an inverse "undoes" `$A$`. In the picture of Section 3.3, `$A^{-1}$` moves the parallelogram back to the unit square. Press play, and try the singular matrix: when the square is squashed flat no matrix can bring it back.

<figure class="fig" data-fig="c12m-mat-undo"><figcaption>The unit square is moved by A and then back by A⁻¹, ending where it started. For the singular choice the square is flattened to a line, and information is lost for good.</figcaption></figure>

Facts:

- **The inverse is unique.** If `$B$` and `$C$` are both inverses of `$A$`, then `$B = BI = B(AC) = (BA)C = IC = C$`.
- `$(A^{-1})^{-1} = A$` and `$(AB)^{-1} = B^{-1}A^{-1}$` (again, the order reverses).
- Not every non-zero square matrix is invertible. `$\begin{pmatrix}1&2\\2&4\end{pmatrix}$` has no inverse: its second row is twice the first and it flattens the plane onto a line.
- For `$A = \begin{pmatrix}a&b\\c&d\end{pmatrix}$` with determinant `$D = ad - bc \ne 0$`:

```math
A^{-1} = \frac{1}{ad - bc}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}
```

  Swap the two diagonal entries, change the signs of the other two, and divide by `$D$`. Multiply to check: `$A\begin{pmatrix}d&-b\\-c&a\end{pmatrix} = \begin{pmatrix}ad-bc & 0\\0 & ad-bc\end{pmatrix} = DI$`.

Example: `$A = \begin{pmatrix}2&1\\5&3\end{pmatrix}$` has `$D = 6 - 5 = 1$`, so `$A^{-1} = \begin{pmatrix}3&-1\\-5&2\end{pmatrix}$`. Determinants of larger matrices and the adjoint method come in [the next chapter, Determinants](/learn/courses/ncert-class-12-maths/determinants/).

<div class="problem" data-problem="c12m-mat-inverse"></div>

Try your own matrices in the calculator: multiply, transpose and invert, and check your hand answers. See also the [Matrix Calculator](/science/matrix-calculator/).

<!--fig:tool matrix-calculator-->

<div class="myth">

**Beyond the syllabus.** The rationalised book finds inverses with the adjoint (next chapter). A second way, **elementary row operations**, is useful to know: write `$[A \mid I]$` and apply the *same* row operations to both halves until the left half becomes `$I$`; the right half is then `$A^{-1}$`. A row of zeros on the left means no inverse. Watch it on `$A = \begin{pmatrix}1&2\\3&7\end{pmatrix}$`.

</div>

<div class="steps" data-fig="c12m-mat-inverse">
<div class="step">Write A next to the identity: the augmented matrix [A | I].</div>
<div class="step">R₂ → R₂ − 3R₁ clears the 3 below the diagonal; do the same to the right half.</div>
<div class="step">R₁ → R₁ − 2R₂ clears the 2 above the diagonal. The left half is now I.</div>
<div class="step">Read the right half: A⁻¹ = [[7, −2], [−3, 1]]. Check that A·A⁻¹ = I.</div>
<div class="step">If a whole row on the left becomes zero, stop: the matrix is singular and has no inverse.</div>
</div>

<div class="history">

- **1850:** James Joseph Sylvester first uses the word "matrix" (Latin for "womb", the thing that produces determinants).
- **1858:** Arthur Cayley publishes the algebra of matrices: addition, multiplication and the inverse.
- **1925:** Werner Heisenberg's quantum mechanics is rewritten with matrices, where `$AB \ne BA$` is physics.
- **Today:** every image filter, 3D game and neural network is a chain of matrix multiplications.

</div>

<div class="keypoints">

- A matrix has order m × n (rows first); a(i,j) is in row i, column j.
- Add and scale entry by entry; adding needs the same order.
- AB exists only if columns of A = rows of B; its order is (rows of A) × (columns of B); each entry is a row times a column.
- AB ≠ BA in general; AB = O does not force A = O or B = O; (A + B)² = A² + AB + BA + B².
- (Aᵀ)ᵀ = A, (A + B)ᵀ = Aᵀ + Bᵀ, (AB)ᵀ = BᵀAᵀ.
- Symmetric: Aᵀ = A. Skew-symmetric: Aᵀ = −A, with zero diagonal. Every square matrix = symmetric part + skew part.
- A⁻¹ is unique; (AB)⁻¹ = B⁻¹A⁻¹; for a 2 × 2 matrix A⁻¹ = (1/(ad − bc)) [[d, −b], [−c, a]] when ad − bc ≠ 0.

</div>

Going further for JEE/NEET: [Matrices and determinants](/learn/courses/engineering-entrance/matrices-determinants/) has the exam-level work on powers of matrices, adjoints and solving systems.
