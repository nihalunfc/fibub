---
title: Determinants
seoTitle: 'Determinants Class 12 notes and examples'
summary: 'Class 12 Determinants with animations: signed area, 3×3 expansion, area of a triangle, minors, cofactors, adjoint, inverse and Cramer’s rule for equations.'
minutes: 85
updated: 2026-11-23
quiz:
  - q: 'The value of the determinant with rows (3, 4) and (2, 5) is:'
    choices: ['7', '23', '−7', '15']
    ans: 0
    why: '3×5 − 4×2 = 15 − 8 = 7.'
  - q: 'The area of the triangle with corners (0, 0), (6, 0) and (0, 4) is found from ½|det|. It is:'
    choices: ['12 square units', '24 square units', '10 square units', '6 square units']
    ans: 0
    why: 'Rows (0, 0, 1), (6, 0, 1), (0, 4, 1): the determinant is 24 in size, so the area is ½ × 24 = 12.'
  - q: 'A 3 × 3 matrix A has |A| = 4. Then |adj A| equals:'
    choices: ['16', '4', '12', '64']
    ans: 0
    why: 'For an n × n matrix |adj A| = |A|^(n−1), so 4² = 16.'
sources:
  - 'NCERT Class 12 Mathematics, Chapter 4 “Determinants” (topic list only; all text, figures and questions here are original fibub work)'
  - 'Cramer’s rule: Gabriel Cramer, Introduction à l’analyse des lignes courbes algébriques (Geneva, 1750); standard university linear algebra, e.g. Strang, Linear Algebra and Its Applications.'
  - 'Every worked example and live problem was recomputed a second way (Sarrus’ rule, elimination or shoelace formula).'
---

**Maths · Class 12 · Chapter 4 · about 85 minutes.** By the end you will be able to find the determinant of a 2 × 2 and a 3 × 3 matrix, use it for the area of a triangle, work with minors and cofactors, find the adjoint and inverse of a matrix, and solve equations with the inverse and with Cramer’s rule.

<div class="bigidea">A square matrix squeezes and turns the plane. Its determinant is one number that tells you how much the area changes (and whether the picture is flipped). If that number is 0 the matrix flattens everything onto a line, so it cannot be undone: it has no inverse, and the equations built from it have no single answer.</div>

## 1. What a determinant is

Every square matrix `$A$` has a number attached to it, written `$|A|$` or `$\det A$`. Only **square** matrices (same number of rows and columns) have one. Do not mix up the two notations: square brackets mean a matrix (a table), vertical bars mean its determinant (a number).

- **Order 1:** `$A = [a]$` has `$|A| = a$`. (The bars here are not “absolute value”: `$|-3| = -3$` for a determinant.)
- **Order 2:** cross-multiply, main diagonal minus the other diagonal.

```math
\begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc
```

Think of a cricket scorecard with two batters and two columns, runs and balls. The cross product of the numbers has no meaning there, but in geometry it does: the **determinant is the signed area of the parallelogram** drawn from the two rows as arrows. Drag the arrows below. Swap their order and the sign flips; push them onto one line and the area, and the determinant, becomes 0.

<figure class="fig" data-fig="c12m-det-area"><figcaption>Rows of a 2 × 2 matrix as two arrows from the origin. The parallelogram has area |ad − bc|. Counter-clockwise from a to b is positive, clockwise is negative, and on one line it is 0.</figcaption></figure>

<div class="meaning">

<dl>
<dt>`$|A|$`</dt><dd>the determinant of the square matrix A, one number.</dd>
<dt>`$ad - bc$`</dt><dd>for a 2 × 2 matrix: (top-left × bottom-right) − (top-right × bottom-left).</dd>
<dt>Physical meaning</dt><dd>`$|A|$` is the factor by which the matrix scales areas; its sign says whether the picture is flipped like a mirror image. `$|A| = 0$` means everything is flattened.</dd>
</dl>

</div>

Try the same idea on a whole grid: choose a matrix and watch the unit square become a parallelogram, with its area readout equal to the determinant.

<!--fig:tool matrix-transform-->

<div class="problem" data-problem="c12m-det-inv2"></div>

## 2. Determinant of a 3 × 3 matrix

A 3 × 3 determinant is worked out by **expanding along a row**. Take each entry of the row, multiply it by the 2 × 2 determinant left when you cross out its own row and column, and give the terms the signs `+ − +`. Watch the player expand one example.

<div class="steps" data-fig="c12m-det-expand">
<div class="step">We want the determinant of the 3 × 3 matrix with rows (2, 1, 3), (0, −1, 4), (1, 2, 5). Choose the first row to expand along.</div>
<div class="step">First entry 2 (sign +). Cross out row 1 and column 1: the 2 × 2 left has rows (−1, 4) and (2, 5), value (−1)(5) − (4)(2) = −13. Term = + 2 × (−13) = −26.</div>
<div class="step">Second entry 1 (sign −, because we are at position 1,2). Cross out row 1 and column 2: rows (0, 4) and (1, 5), value 0 − 4 = −4. Term = − 1 × (−4) = +4.</div>
<div class="step">Third entry 3 (sign +). Cross out row 1 and column 3: rows (0, −1) and (1, 2), value 0 − (−1)(1) = 1. Term = + 3 × 1 = +3.</div>
<div class="step">Add the three terms: −26 + 4 + 3 = −19. So the determinant is −19.</div>
</div>

In symbols, expanding along the first row:

```math
\begin{vmatrix} a_{1} & b_{1} & c_{1} \\ a_{2} & b_{2} & c_{2} \\ a_{3} & b_{3} & c_{3} \end{vmatrix} = a_{1}(b_{2}c_{3} - b_{3}c_{2}) - b_{1}(a_{2}c_{3} - a_{3}c_{2}) + c_{1}(a_{2}b_{3} - a_{3}b_{2})
```

<div class="problem" data-problem="c12m-det-three"></div>

### Expand along any row or column

Nothing special about the first row. You may expand along **any** row or column and the value is the same, as long as every entry carries the sign from the checkerboard

```math
\begin{matrix} + & - & + \\ - & + & - \\ + & - & + \end{matrix}
```

(the sign at row `$i$`, column `$j$` is `$(-1)^{i+j}$`). The smart choice is the line with the most zeros, because every zero kills a whole term. Click through the six choices below: the terms change, the total never does.

<figure class="fig" data-fig="c12m-det-cofactor"><figcaption>One matrix, six ways to expand. The highlighted line is the one used; the sign checkerboard shows where each sign comes from. The answer is the same every time.</figcaption></figure>

<div class="myth">

**“A determinant is a matrix with bars.”** A matrix is a table of numbers and has no single value; its determinant is one number. Also, `$|kA| \ne k|A|$` in general: for a 3 × 3 matrix, multiplying **every** entry by `$k$` multiplies the determinant by `$k^3$`, not `$k$`. (Multiplying one row by `$k$` does multiply the determinant by `$k$`.)

</div>

Tools like the [Matrix calculator](/science/matrix-calculator/) let you check a determinant with every step shown, which is a fine way to catch an arithmetic slip in your own working.

## 3. Area of a triangle

The corners `$(x_1, y_1)$`, `$(x_2, y_2)$`, `$(x_3, y_3)$` make a triangle whose area is

```math
\Delta = \frac12 \left| \begin{vmatrix} x_1 & y_1 & 1 \\ x_2 & y_2 & 1 \\ x_3 & y_3 & 1 \end{vmatrix} \right|
```

The outer bars are the “size, ignore the sign” bars, because an area cannot be negative. Imagine a triangular plot of land in a village, with three boundary stones whose positions on the village map are known: this one formula gives the area without measuring a single height.

<figure class="fig" data-fig="c12m-det-triangle"><figcaption>Drag the corners A, B, C. The readout works the 3 × 3 determinant for you. Put C on the line through A and B and the area drops to 0.</figcaption></figure>

**Three points are collinear exactly when the determinant is 0**, because then the “triangle” is flat. This also gives the equation of a line through two points: write the determinant with a general point `$(x, y)$` in the third row and set it equal to 0.

<div class="problem" data-problem="c12m-det-tri"></div>

## 4. Minors and cofactors

For an entry `$a_{ij}$` (row `$i$`, column `$j$`):

- the **minor** `$M_{ij}$` is the determinant left after you delete row `$i$` and column `$j$`;
- the **cofactor** `$A_{ij} = (-1)^{i+j} M_{ij}$` is the minor with its checkerboard sign.

So expanding along a row is just: `$|A| = a_{i1}A_{i1} + a_{i2}A_{i2} + a_{i3}A_{i3}$`.

<div class="meaning">

<dl>
<dt>`$M_{ij}$`</dt><dd>minor of the entry in row i, column j (a smaller determinant).</dd>
<dt>`$A_{ij}$`</dt><dd>cofactor: the minor times `$(-1)^{i+j}$`.</dd>
<dt>Physical meaning</dt><dd>the cofactor tells how much the whole determinant changes if that one entry is nudged by 1: it is the entry’s “weight” in `$|A|$`.</dd>
</dl>

</div>

A neat fact that the inverse depends on: if you multiply the entries of one row by the **cofactors of a different row** and add, you get 0. Row 1 entries with the row 1 cofactors give `$|A|$`; row 1 entries with the row 2 cofactors give 0. (Reason: that sum is the determinant of a matrix with two identical rows, which is flat.)

## 5. Adjoint and inverse of a matrix

A square matrix `$A$` is **singular** if `$|A| = 0$` and **non-singular** if `$|A| \ne 0$`. Only a non-singular matrix has an inverse `$A^{-1}$`, the matrix that undoes `$A$` (`$AA^{-1} = A^{-1}A = I$`).

The **adjoint** of `$A$`, written `$\operatorname{adj}A$`, is the **transpose of the cofactor matrix** (each entry replaced by its cofactor, then rows and columns swapped). The key identity is

```math
A\,(\operatorname{adj}A) = (\operatorname{adj}A)\,A = |A|\,I \qquad\Longrightarrow\qquad A^{-1} = \frac{1}{|A|}\,\operatorname{adj}A
```

For a 2 × 2 matrix there is a shortcut: swap the two diagonal entries and change the signs of the other two,

```math
A = \begin{bmatrix} a & b \\ c & d \end{bmatrix} \;\Rightarrow\; \operatorname{adj}A = \begin{bmatrix} d & -b \\ -c & a \end{bmatrix}
```

For a 3 × 3 matrix, follow the player. It finds the inverse of a matrix whose determinant is 2.

<div class="steps" data-fig="c12m-det-inverse">
<div class="step">Start with A with rows (1, 1, 0), (0, 1, 1), (1, 0, 1). Expanding along row 1: |A| = 1(1·1 − 1·0) − 1(0·1 − 1·1) + 0 = 2. It is not 0, so A⁻¹ exists.</div>
<div class="step">Find all nine cofactors, each a signed 2 × 2 determinant. For example C₁₂ = −(0·1 − 1·1) = 1. The cofactor matrix has rows (1, 1, −1), (−1, 1, 1), (1, −1, 1).</div>
<div class="step">Transpose the cofactor matrix (rows become columns) to get adj A, with rows (1, −1, 1), (1, 1, −1), (−1, 1, 1). Do not forget this transpose: it is the most common slip.</div>
<div class="step">Divide every entry of adj A by |A| = 2. That gives A⁻¹ with entries ±1/2.</div>
<div class="step">Check by multiplying: row 1 of A with column 1 of A⁻¹ gives 1/2 + 1/2 + 0 = 1, and the other products give 0, so A × A⁻¹ = I. Always do this check when you have the time.</div>
</div>

<div class="problem" data-problem="c12m-det-adj"></div>

Useful rules for `$n \times n$` matrices: `$|\operatorname{adj}A| = |A|^{\,n-1}$`; `$(AB)^{-1} = B^{-1}A^{-1}$` (the order flips, like taking off shoes then socks after putting on socks then shoes); and `$|A^{-1}| = 1/|A|$`.

<div class="myth">

**“The inverse is 1 divided by the matrix.”** You cannot divide by a matrix. The inverse is found as `$\operatorname{adj}A$` divided by the **number** `$|A|$`. And a singular matrix (`$|A| = 0$`) has no inverse at all: it would need `$1/0$`.

</div>

<div class="problem" data-problem="c12m-det-k"></div>

## 6. Solving equations with matrices and determinants

Three equations in three unknowns can be written as one matrix equation `$AX = B$`: `$A$` holds the coefficients, `$X$` the unknowns, `$B$` the constants. If `$|A| \ne 0$`, multiply both sides by `$A^{-1}$`:

```math
X = A^{-1}B
```

The solution exists and is **unique**. Think of a chai stall that sells cutting chai, regular chai and a snack, with three days of total sales known: three equations, three prices, one answer, as long as no day’s sales are just a copy of the others.

The same job done with determinants is **Cramer’s rule**. Let `$D$` be the determinant of the coefficients, and `$D_x$` the determinant with the x-column replaced by the constants (likewise for `$D_y$`, `$D_z$`). Then

```math
x = \frac{D_x}{D},\quad y = \frac{D_y}{D},\quad z = \frac{D_z}{D}
```

<div class="steps" data-fig="c12m-det-cramer">
<div class="step">The system x + y + z = 6, 2x − y + z = 3, x + 2y − z = 2. The coefficient determinant D has rows (1, 1, 1), (2, −1, 1), (1, 2, −1). Expanding: D = 1(1 − 2) − 1(−2 − 1) + 1(4 + 1) = −1 + 3 + 5 = 7.</div>
<div class="step">For Dx replace the x-column (first column) by the constants 6, 3, 2. Expanding gives Dx = 7.</div>
<div class="step">For Dy replace the second column by 6, 3, 2. Dy = 14.</div>
<div class="step">For Dz replace the third column by 6, 3, 2. Dz = 21.</div>
<div class="step">Divide each by D = 7: x = 1, y = 2, z = 3. Substituting in the second equation: 2 − 2 + 3 = 3 ✓.</div>
</div>

<div class="problem" data-problem="c12m-det-cramer"></div>

### When is the system consistent?

A system is **consistent** if it has at least one solution and **inconsistent** if it has none. For `$AX = B$`:

- `$|A| \ne 0$`: a **unique** solution (the lines or planes meet at one point).
- `$|A| = 0$` and `$(\operatorname{adj}A)B \ne 0$`: **no solution** (inconsistent), like two parallel railway tracks.
- `$|A| = 0$` and `$(\operatorname{adj}A)B = 0$`: **infinitely many solutions** (consistent), like two identical lines.

Change the second equation of a pair below. See D, Dx and Dy change with the picture: crossing lines (D ≠ 0), parallel lines (D = 0, no answer) and the same line (D = 0, Dx = Dy = 0).

<figure class="fig" data-fig="c12m-det-lines"><figcaption>The first line is 2x + y = 5. Change a₂, b₂, c₂ or use the buttons: D tells how the two lines sit, and Dx/D, Dy/D give the crossing point.</figcaption></figure>

Now check your own matrix and systems with the calculator, which shows each determinant and inverse in exact fractions.

<!--fig:tool matrix-calculator-->

For more squashing, turning and composing of matrices see [Matrix transform](/learn/matrix-transform/); the shared picture below shows two matrices applied in turn and how their determinants multiply.

<figure class="fig" data-fig="@math-matrix-compose"><figcaption>Two matrix transformations one after the other: the area scale factors multiply, so |AB| = |A||B|.</figcaption></figure>

<div class="history">

**Timeline**

<ul class="timeline">
<li><b>~200 BCE</b> Chinese mathematicians solve linear systems by arranging coefficients in a table (the Nine Chapters).</li>
<li><b>1683 and 1693</b> Seki Takakazu in Japan (1683) and Leibniz in Germany (1693) independently use determinant-like expressions.</li>
<li><b>1750</b> Gabriel Cramer publishes the rule that carries his name.</li>
<li><b>1812</b> Cauchy names the “determinant” and gives its multiplication rule.</li>
</ul>

</div>

<div class="history">

**Beyond the syllabus (not examined in the Class 12 board paper).** The detailed properties of determinants (swapping two rows changes the sign, a determinant with two equal rows is 0, adding a multiple of one row to another changes nothing, factor taking) were reduced in the rationalised book, and the Class 12 paper keeps to direct expansion. They are still very useful shortcuts, so use them if you know them, and see the JEE lesson below. Check the current CBSE syllabus for what is asked this year.

</div>

<div class="keypoints">

- 2 × 2: `$\begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc$`. It is the signed area of the parallelogram on the two rows.
- 3 × 3: expand along any row or column with signs `$+ - + / - + - / + - +$`; take the line with most zeros. Minor `$M_{ij}$`, cofactor `$A_{ij} = (-1)^{i+j}M_{ij}$`.
- Area of a triangle `$= \tfrac12|\det|$` of the rows `$(x, y, 1)$`; collinear points give 0.
- Singular: `$|A| = 0$` (no inverse). `$A^{-1} = \operatorname{adj}A / |A|$`, where adj A is the **transpose** of the cofactor matrix. `$A(\operatorname{adj}A) = |A|I$`, `$|\operatorname{adj}A| = |A|^{n-1}$`, `$(AB)^{-1} = B^{-1}A^{-1}$`.
- `$AX = B$`: if `$|A| \ne 0$`, `$X = A^{-1}B$` (unique); Cramer: `$x = D_x/D$` and so on.
- `$|A| = 0$`: no solution if `$(\operatorname{adj}A)B \ne 0$`, infinitely many if it equals 0.

</div>

Going further for JEE/NEET: properties of determinants, the rules for `$|kA|$` and `$|\operatorname{adj}A|$`, Cayley-Hamilton and systems with parameters are in [Matrices and determinants (JEE)](/learn/courses/engineering-entrance/matrices-determinants/).
