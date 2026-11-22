---
title: Matrices, determinants and eigenvalues
seoTitle: Matrices and eigenvalues for IIT JAM Physics
summary: 'Matrix algebra, determinants, inverse and rank, then eigenvalues and eigenvectors with the trace and determinant shortcuts, Hermitian, unitary and orthogonal matrices, Cayley-Hamilton and functions of matrices, the way JAM tests them.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: A 3 × 3 matrix has eigenvalues 2, −1 and 3. What is its determinant?
    choices: ['−6', '4', '6', '0']
    ans: 0
    why: The determinant is the product of the eigenvalues, 2 × (−1) × 3 = −6. Their sum, 4, is the trace.
  - q: Which kind of matrix always has real eigenvalues?
    choices: ['Hermitian', 'Unitary', 'Orthogonal', 'Any invertible matrix']
    ans: 0
    why: Hermitian matrices (H† = H) have real eigenvalues. Unitary and orthogonal matrices have eigenvalues of modulus 1, which can be complex, like e^(±iθ) for a rotation.
  - q: "If A has eigenvalue λ with eigenvector v, what is an eigenvalue of A² + 3A?"
    choices: ['λ² + 3λ', '(λ + 3)²', 'λ² + 3', '2λ + 3']
    ans: 0
    why: "A²v = λ²v and 3Av = 3λv, so (A² + 3A)v = (λ² + 3λ)v with the same eigenvector."
sources:
  - 'M. L. Boas, Mathematical Methods in the Physical Sciences, 3rd ed. (2006), chapter 3'
  - 'G. Strang, Introduction to Linear Algebra, 5th ed. (2016), chapters 5 and 6'
  - 'G. B. Arfken, H. J. Weber and F. E. Harris, Mathematical Methods for Physicists, 7th ed. (2013), chapter 6'
  - 'IIT JAM Physics syllabus (Mathematical Methods section), published by the organising IIT each year'
---

**Module 1 · about 45 minutes.** By the end you will be able to find eigenvalues of small matrices in your head, use the trace and determinant to skip whole calculations, recognise Hermitian, unitary and orthogonal matrices and what their eigenvalues must be, and compute powers and exponentials of matrices the quick way.

<div class="bigidea">A matrix is a machine that moves vectors. Its eigenvectors are the special directions it only stretches, and its eigenvalues are how much: know those, and you know everything the matrix does.</div>

## 1. Matrices as machines

A `$2\times2$` matrix takes a vector and returns another:

```math
\begin{pmatrix} a & b \\ c & d \end{pmatrix}\begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} ax + by \\ cx + dy \end{pmatrix}
```

Multiplying two matrices means doing one machine after the other, which is why **order matters**: in general `$AB \ne BA$`. The rules that follow from "one after the other":

- `$(AB)^T = B^TA^T$` and `$(AB)^{-1} = B^{-1}A^{-1}$`: undoing reverses the order, like taking off socks and shoes.
- `$\det(AB) = \det A\,\det B$`, and for an `$n\times n$` matrix `$\det(kA) = k^n\det A$` (every one of the `$n$` rows gets the factor `$k$`).
- The **trace** (sum of the diagonal) obeys `$\text{tr}(AB) = \text{tr}(BA)$`.

## 2. Determinant, inverse and rank

The determinant measures how much the machine scales areas (in 2D) or volumes (in 3D). If it is zero, the machine squashes space flat, and nothing can undo that: the matrix has **no inverse** (it is *singular*).

```math
\det\begin{pmatrix} a & b \\ c & d \end{pmatrix} = ad - bc, \qquad \begin{pmatrix} a & b \\ c & d \end{pmatrix}^{-1} = \frac{1}{ad - bc}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}
```

For the `$2\times2$` inverse: **swap the diagonal, negate the off-diagonal, divide by the determinant.** Do not swap the off-diagonal entries (that gives the transpose of the right answer, a favourite wrong option).

Useful facts for `$3\times3$` and bigger:

- A **triangular** matrix has determinant equal to the product of its diagonal.
- Swapping two rows flips the sign; adding a multiple of one row to another changes nothing.
- The **rank** is the number of independent rows. A square matrix has full rank exactly when its determinant is not zero. A system `$A\vec x = \vec b$` has a unique solution exactly when `$\det A \ne 0$`.

## 3. Eigenvalues and eigenvectors

Most vectors change direction when a matrix acts on them. A few special ones do not: they come out along the same line, just stretched by a number `$\lambda$`.

```math
A\vec v = \lambda\vec v \qquad (\vec v \ne \vec 0)
```

Watch it happen. The grey arrow is a unit vector `$\vec v$` going round the circle; the coloured arrow is `$A\vec v$`. They line up only along the dashed eigenvector lines:

<figure class="fig" data-fig="eigen-map"><figcaption>The unit circle (dashed) is sent to an ellipse (solid). Along each eigenvector, Av is parallel to v. The rotation has no real eigenvectors; the shear has only one.</figcaption></figure>

**How to find them.** `$A\vec v = \lambda\vec v$` means `$(A - \lambda I)\vec v = 0$` has a non-zero solution, so `$A - \lambda I$` must be singular:

```math
\det(A - \lambda I) = 0
```

For a `$2\times2$` matrix this is always

```math
\lambda^2 - (\text{tr}\,A)\,\lambda + \det A = 0
```

and for any size:

```math
\lambda_1 + \lambda_2 + \dots + \lambda_n = \text{tr}\,A, \qquad \lambda_1\lambda_2\cdots\lambda_n = \det A
```

These two lines are the biggest time-savers in the whole topic. "Sum of eigenvalues" is just the trace; "product" is just the determinant; "is 0 an eigenvalue?" is just "is the determinant 0?".

<div class="meaning">

<dl>
<dt>Eigenvector v</dt><dd>a direction the matrix does not turn, only stretches (or flips)</dd>
<dt>Eigenvalue λ</dt><dd>the stretch factor along that direction; negative means flipped</dd>
<dt>tr A</dt><dd>the sum of all eigenvalues</dd>
<dt>det A</dt><dd>the product of all eigenvalues; zero means some direction is squashed to nothing</dd>
<dt>Physical meaning</dt><dd>Normal modes of coupled oscillators, principal axes of a spinning body, and the allowed energies of a quantum system are all eigenvalue problems.</dd>
</dl>

</div>

**Worked example.** Find the eigenvalues and eigenvectors of `$A = \begin{pmatrix} 2 & 1 \\ 1 & 2 \end{pmatrix}$`.

1. Trace 4, determinant 3, so `$\lambda^2 - 4\lambda + 3 = 0$`: `$\lambda = 1$` or `$3$`.
2. For `$\lambda = 3$`: `$(A - 3I)\vec v = \begin{pmatrix} -1 & 1 \\ 1 & -1 \end{pmatrix}\vec v = 0$` gives `$v_1 = v_2$`, so `$\vec v = (1, 1)$`.
3. For `$\lambda = 1$`: `$v_1 = -v_2$`, so `$\vec v = (1, -1)$`.
4. Check: `$1 + 3 = 4$` (trace) and `$1\times3 = 3$` (determinant) ✓. The two eigenvectors are perpendicular, as they always are for a real symmetric matrix.

Two special cases to spot at once: a **triangular** matrix has its eigenvalues on the diagonal, and a **block-diagonal** matrix has the eigenvalues of its blocks.

<div class="problem" data-problem="eigen-2x2"></div>

### Not every matrix has enough eigenvectors

A repeated eigenvalue may come with only one eigenvector. The shear `$\begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix}$` has eigenvalue 1 twice, but `$A - I = \begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix}$` has rank 1, so there is only one eigenvector, `$(1, 0)$`. Such a matrix **cannot be diagonalised**. Count eigenvectors for an eigenvalue `$\lambda$` as `$n - \text{rank}(A - \lambda I)$`.

When there *are* `$n$` independent eigenvectors, put them as the columns of `$P$`; then `$P^{-1}AP = D$` is diagonal with the eigenvalues on its diagonal. Matrices related this way (**similar** matrices) share eigenvalues, trace and determinant, but not eigenvectors.

## 4. The special matrices of physics

| Matrix | Definition | Eigenvalues | Eigenvectors |
|---|---|---|---|
| real symmetric | `$A^T = A$` | real | can be chosen orthonormal |
| Hermitian | `$H^\dagger = H$` (`$\dagger$` = conjugate transpose) | real | orthogonal for different `$\lambda$` |
| real antisymmetric | `$A^T = -A$` | `$0$` or purely imaginary `$\pm i\omega$` | |
| orthogonal | `$R^TR = I$` | modulus 1 (`$\det R = \pm1$`) | |
| unitary | `$U^\dagger U = I$` | modulus 1 (`$\lvert\det U\rvert = 1$`) | orthogonal |
| projection | `$P^2 = P$` | 0 or 1 | |

Why Hermitian eigenvalues are real, in one line: if `$H\vec v = \lambda\vec v$`, then `$\lambda\,\vec v^\dagger\vec v = \vec v^\dagger H\vec v = (H\vec v)^\dagger\vec v = \bar\lambda\,\vec v^\dagger\vec v$`, so `$\lambda = \bar\lambda$`. That is why quantum mechanics represents measurable quantities by Hermitian matrices: measurements give real numbers.

A rotation by `$\theta$` in the plane has eigenvalues `$e^{\pm i\theta}$`: modulus 1, but complex, which is why the rotation in the figure has no real eigenvector. A rotation in 3D has eigenvalues `$1, e^{i\theta}, e^{-i\theta}$` (the 1 belongs to the axis), so its trace is `$1 + 2\cos\theta$`.

The **Pauli matrices** are the standard Hermitian, unitary, traceless examples:

```math
\sigma_x = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}, \quad \sigma_y = \begin{pmatrix} 0 & -i \\ i & 0 \end{pmatrix}, \quad \sigma_z = \begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix}
```

Each has eigenvalues `$\pm1$`, each squares to `$I$`, and `$\sigma_x\sigma_y = i\sigma_z$` (cyclic). For a real vector `$\vec a$`, `$(\vec a\cdot\vec\sigma)^2 = |\vec a|^2I$`, so `$\vec a\cdot\vec\sigma$` has eigenvalues `$\pm|\vec a|$`.

<div class="myth">

**"The eigenvalues of A + B are the eigenvalues of A plus those of B."** Only if `$A$` and `$B$` share eigenvectors (for example, if they commute). `$\sigma_x$`, `$\sigma_y$` and `$\sigma_z$` each have eigenvalues `$\pm1$`, but `$\sigma_x + \sigma_y + \sigma_z$` has eigenvalues `$\pm\sqrt3$`, not `$\pm3$`. What always adds is the trace: `$\text{tr}(A + B) = \text{tr}A + \text{tr}B$`.

</div>

## 5. Functions of a matrix and Cayley-Hamilton

If `$A\vec v = \lambda\vec v$`, then `$A^2\vec v = \lambda^2\vec v$`, `$A^{-1}\vec v = \lambda^{-1}\vec v$`, and for any polynomial or power series `$f$`:

```math
f(A)\,\vec v = f(\lambda)\,\vec v
```

So **the eigenvalues of `$f(A)$` are `$f(\lambda_i)$`**, with the same eigenvectors. This turns many "compute this big matrix" questions into arithmetic:

**Worked example.** A `$3\times3$` matrix has eigenvalues 1, 2, 3. Find `$\det(A^2 + I)$` and `$\text{tr}(A^{-1})$`.

1. Eigenvalues of `$A^2 + I$`: `$2, 5, 10$`. Determinant: `$2\times5\times10 = 100$`.
2. Eigenvalues of `$A^{-1}$`: `$1, \tfrac12, \tfrac13$`. Trace: `$\tfrac{11}{6}$`.

Two famous consequences: `$\det(e^A) = e^{\text{tr}A}$` for every square matrix, and `$e^{\theta J} = I\cos\theta + J\sin\theta$` when `$J^2 = -I$` (the rotation matrix comes out of the exponential, just as `$e^{i\theta} = \cos\theta + i\sin\theta$`).

**Cayley-Hamilton theorem:** every matrix satisfies its own characteristic equation. For a `$2\times2$` matrix,

```math
A^2 - (\text{tr}A)\,A + (\det A)\,I = 0
```

so any power of `$A$` can be reduced to a combination of `$A$` and `$I$`. For `$A = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}$` (trace 5, det `$-2$`): `$A^2 = 5A + 2I$`, and then `$A^3 = 5A^2 + 2A = 27A + 10I$`.

Two more shortcuts for powers: a **nilpotent** part stops the series early (`$\begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix}^{10} = \begin{pmatrix} 1 & 10 \\ 0 & 1 \end{pmatrix}$` because `$N^2 = 0$`), and a diagonalisable matrix gives `$A^n = PD^nP^{-1}$`.

**Physics example: normal modes.** Two equal masses between three equal springs obey `$m\ddot{\vec x} = -k\begin{pmatrix} 2 & -1 \\ -1 & 2 \end{pmatrix}\vec x$`. The eigenvectors `$(1, 1)$` and `$(1, -1)$` are the two normal modes (moving together, moving opposite); the eigenvalues 1 and 3 give `$\omega^2 = k/m$` and `$3k/m$`. See it move in fibub's [coupled oscillators tool](/science/coupled-oscillators/), and check any matrix with the [matrix calculator](/science/matrix-calculator/) or the [matrix transform tool](/learn/matrix-transform/).

<div class="keypoints">

- `$(AB)^T = B^TA^T$`, `$(AB)^{-1} = B^{-1}A^{-1}$`, `$\det(kA) = k^n\det A$`. A matrix is invertible exactly when its determinant is non-zero.
- Eigenvalues solve `$\det(A - \lambda I) = 0$`; for `$2\times2$`, `$\lambda^2 - (\text{tr}A)\lambda + \det A = 0$`. Their sum is the trace and their product the determinant.
- Triangular: eigenvalues on the diagonal. A repeated eigenvalue may have only one eigenvector (then no diagonalisation).
- Hermitian and real symmetric: real eigenvalues, orthogonal eigenvectors. Unitary and orthogonal: eigenvalues of modulus 1. Antisymmetric: 0 or imaginary. Projection: 0 or 1.
- The eigenvalues of `$f(A)$` are `$f(\lambda)$`; `$\det e^A = e^{\text{tr}A}$`. Cayley-Hamilton: `$A^2 = (\text{tr}A)A - (\det A)I$` for `$2\times2$`.
- Eigenvalues of a sum do not add (unless the matrices commute); traces always do.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. More on the [matrices practice page](/learn/courses/iit-jam-physics/practice/matrices/).

<div class="qbank" data-bank="physics" data-topics="matrices" data-exam="jam" data-n="10"></div>

**Before this:** [lesson 1.7, differential equations](/learn/courses/iit-jam-physics/differential-equations/). **Next:** [lesson 1.9, complex numbers](/learn/courses/iit-jam-physics/complex-numbers/). Eigenvalues come back in coupled oscillations, rigid-body rotation and all of quantum mechanics. For GATE and CSIR NET, continue with [Hermitian and unitary matrices and diagonalisation](/learn/courses/gate-physics/) in the GATE Physics course.
