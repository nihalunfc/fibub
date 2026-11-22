---
title: Hermitian and unitary matrices, diagonalisation
seoTitle: Hermitian and unitary matrices for GATE Physics
summary: 'Hermitian, anti-Hermitian, unitary and normal matrices and where their eigenvalues live, unitary diagonalisation and the spectral theorem, commuting matrices, functions of matrices from Pauli exponentials to Jordan blocks, Cayley-Hamilton, and the trace and determinant tricks that save minutes in GATE.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: Where do the eigenvalues of a unitary matrix lie in the complex plane?
    choices: ['On the unit circle', 'On the real axis', 'On the imaginary axis', 'Anywhere']
    ans: 0
    why: A unitary matrix preserves lengths, so ‖Uv‖ = |λ|‖v‖ = ‖v‖ and |λ| = 1. Hermitian eigenvalues lie on the real axis and anti-Hermitian ones on the imaginary axis.
  - q: When can two Hermitian matrices be diagonalised by the same unitary matrix?
    choices: ['Exactly when they commute', 'Whenever they have the same trace', 'Only if one is a multiple of the other', 'Always']
    ans: 0
    why: Commuting Hermitian matrices share a complete orthonormal set of eigenvectors; conversely, two matrices diagonal in the same basis always commute.
  - q: "For A = [[1, 1], [0, 1]], what is the top-right entry of the square root of A that has eigenvalues +1?"
    choices: ['1/2', '1', '0', '2']
    ans: 0
    why: "A = I + N with N² = 0, so f(A) = f(1)I + f′(1)N. With f = √, f′(1) = 1/2. Check: [[1, 1/2], [0, 1]]² = [[1, 1], [0, 1]]."
sources:
  - 'G. Strang, Introduction to Linear Algebra, 5th ed. (2016), chapters 6 and 7'
  - 'R. A. Horn and C. R. Johnson, Matrix Analysis, 2nd ed. (2013), chapters 1, 2 and 4'
  - 'G. B. Arfken, H. J. Weber and F. E. Harris, Mathematical Methods for Physicists, 7th ed. (2013), chapter 6'
  - 'H. Goldstein, C. Poole and J. Safko, Classical Mechanics, 3rd ed. (2002), chapter 6 (small oscillations)'
  - 'GATE Physics (PH) syllabus, Mathematical Physics section, published by the organising institute each year'
---

**Module 1 · about 55 minutes.** By the end you will be able to say at a glance where the eigenvalues of a special matrix must lie, diagonalise Hermitian and normal matrices with a unitary change of basis, decide when two matrices can be diagonalised together, compute functions of matrices (exponentials, square roots, powers) without long multiplication, and use the Cayley-Hamilton theorem and trace and determinant tricks under exam time pressure. The basics (characteristic equation, 2 × 2 eigenvalues, inverse, rank) are in the IIT JAM lesson on [matrices and eigenvalues](/learn/courses/iit-jam-physics/matrices/); here we go one level deeper. The language of the [previous lesson on vector spaces and Dirac notation](/learn/courses/gate-physics/linear-vector-spaces/) is used throughout.

<div class="bigidea">Every Hermitian or unitary matrix is a diagonal matrix seen in a rotated basis. Find that basis, and powers, exponentials, square roots and inverses all act on the eigenvalues one at a time.</div>

## 1. The family and where its eigenvalues live

For a complex square matrix, `$A^\dagger$` is the conjugate transpose. Four kinds matter in physics:

| Kind | Definition | Eigenvalues |
|---|---|---|
| Hermitian | `$H^\dagger = H$` | real |
| anti-Hermitian | `$A^\dagger = -A$` | purely imaginary (or 0) |
| unitary | `$U^\dagger U = I$` | modulus 1 (on the unit circle) |
| normal | `$AA^\dagger = A^\dagger A$` | anywhere |

Choose two transformations and press Apply, then press 'Swap the order' and apply them again.

<figure class="fig" data-fig="@math-matrix-compose"><figcaption>Notice that the letter F ends up in different places when the order is swapped (AB ≠ BA) and that the area is multiplied by the determinant at each stage.</figcaption></figure>

All three special kinds are **normal**, and normality is exactly the condition for being diagonalised by a unitary matrix. The eigenvalue facts take one line each:

- Hermitian: `$\lambda\langle v|v\rangle = \langle v|Hv\rangle = \langle Hv|v\rangle = \lambda^*\langle v|v\rangle$`, so `$\lambda$` is real.
- Anti-Hermitian: `$iA$` is Hermitian, so `$\lambda = -i\times(\text{real})$` is imaginary. Real antisymmetric matrices are the real case: eigenvalues `$0, \pm i\omega$`, determinant `$\ge 0$`, and `$\text{tr}A^2 = -\sum A_{ij}^2 \le 0$`.
- Unitary: `$\lVert Uv\rVert = \lvert\lambda\rvert\,\lVert v\rVert = \lVert v\rVert$`, so `$\lvert\lambda\rvert = 1$`. A real orthogonal `$2\times2$` with determinant `$-1$` is a reflection with eigenvalues `$+1$` and `$-1$`.

Careful with complex matrices: **symmetric is not Hermitian.** `$A = \begin{pmatrix} 1 & i \\ i & 1 \end{pmatrix}$` is symmetric, but `$A^\dagger \ne A$`. In fact `$AA^\dagger = 2I$`, so `$A/\sqrt2$` is unitary, with eigenvalues `$(1 \pm i)/\sqrt2$` on the unit circle.

<div class="meaning">

<dl>
<dt>Hermitian H</dt><dd>an observable: its eigenvalues are the possible results of a measurement</dd>
<dt>Unitary U</dt><dd>a change of basis or a time evolution that keeps all probabilities and overlaps</dd>
<dt>U†HU</dt><dd>the same observable written in another orthonormal basis: same eigenvalues, different matrix</dd>
<dt>[A, B] = 0</dt><dd>A and B can be measured together: they have a common eigenbasis</dd>
<dt>Physical meaning</dt><dd>Diagonalising H means finding the states with definite values (energies, spins, normal-mode frequencies); every other state is a superposition of these.</dd>
</dl>

</div>

## 2. Unitary diagonalisation and the spectral theorem

If `$A$` is normal, its normalised eigenvectors are orthonormal and can be put as the columns of a unitary `$U$`:

```math
A = UDU^\dagger, \qquad D = \text{diag}(\lambda_1, \dots, \lambda_n), \qquad A = \sum_k \lambda_k P_k \ \text{ with } P_k = |k\rangle\langle k|
```

Turn the axes with the θ slider and change σx, σy and τ.

<figure class="fig" data-fig="@math-mohr-tensor"><figcaption>Notice that the components change as the axes turn but the trace does not, and that the point on the Mohr circle meets the horizontal axis at the principal (eigen) values.</figcaption></figure>

The second form, the **spectral decomposition**, is the most useful: the projectors `$P_k$` satisfy `$P_jP_k = \delta_{jk}P_k$` and `$\sum P_k = I$`, so any function acts eigenvalue by eigenvalue:

```math
f(A) = \sum_k f(\lambda_k)\,P_k
```

**Worked example.** `$\sigma_x$` has eigenvectors `$(1, 1)/\sqrt2$` and `$(1, -1)/\sqrt2$`, so the Hadamard matrix `$U = \frac{1}{\sqrt2}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}$` gives `$U^\dagger\sigma_xU = \sigma_z$`. Now take `$H = 2P_1 + 5P_2$` with `$P_1 = \tfrac12\begin{pmatrix} 1 & 1 \\ 1 & 1 \end{pmatrix}$` and `$P_2 = \tfrac12\begin{pmatrix} 1 & -1 \\ -1 & 1 \end{pmatrix}$`. The positive square root is `$\sqrt H = \sqrt2P_1 + \sqrt5P_2$`, whose top-right entry is `$\tfrac12(\sqrt2 - \sqrt5) \approx -0.411$`. Taking square roots of the entries of `$H$` would be nonsense.

**Quadratic forms and principal axes.** A real symmetric `$A$` is diagonalised by a rotation, so the curve `$\vec x^TA\vec x = 1$` becomes `$\lambda_1X^2 + \lambda_2Y^2 = 1$` in the eigenvector axes: an ellipse if both eigenvalues are positive, a hyperbola if they have opposite signs, empty if both are negative. The off-diagonal entry tilts the axes and decides the shape: `$x^2 + 4xy + y^2 = 1$` has eigenvalues 3 and `$-1$`, a hyperbola.

<figure class="fig" data-fig="principal-axes"><figcaption>The curve xᵀAx = 1 for a symmetric 2 × 2 matrix, with its two perpendicular eigenvector axes. Slide the off-diagonal entry b: the axes turn, and when det A changes sign the ellipse breaks into a hyperbola.</figcaption></figure>

The same idea solves **small oscillations** with unequal masses: `$M\ddot{\vec x} = -K\vec x$` with trial solution `$\vec a\cos\omega t$` gives the generalised eigenvalue problem

```math
\det(K - \omega^2M) = 0
```

For `$M = \text{diag}(1, 2)$` and `$K = \begin{pmatrix} 3 & -1 \\ -1 & 2 \end{pmatrix}$` this is `$2\omega^4 - 8\omega^2 + 5 = 0$`, so `$\omega^2 = 2 \pm \sqrt6/2$`. Diagonalising `$K$` alone would ignore the masses. For a refresher on normal modes with equal masses, see the JAM lesson on [superposition and coupled oscillators](/learn/courses/iit-jam-physics/superposition-coupled/).

## 3. Commuting matrices

**Theorem.** Two diagonalisable matrices can be diagonalised by the same similarity transformation exactly when they commute. For Hermitian matrices the common transformation is unitary.

One direction is immediate: diagonal matrices commute. For the other, if `$AB = BA$` and `$A\vec v = a\vec v$`, then `$A(B\vec v) = a(B\vec v)$`, so `$B$` maps each eigenspace of `$A$` into itself.

- If every eigenvalue of `$A$` is **non-degenerate**, each eigenspace is a line, so every eigenvector of `$A$` is an eigenvector of `$B$`: `$B$` is diagonal in `$A$`'s eigenbasis (in fact a polynomial in `$A$`).
- If `$A$` is **degenerate**, `$B$` only has to be block-diagonal: inside a degenerate eigenspace you must diagonalise `$B$` separately. That is how quantum mechanics labels states with several quantum numbers (energy, then `$L^2$`, then `$L_z$`).

**Quick test.** `$A = \begin{pmatrix} 2 & 1 \\ 1 & 2 \end{pmatrix}$` has distinct eigenvalues with eigenvectors `$(1, \pm1)$`, so the matrices that commute with it are exactly `$\begin{pmatrix} a & b \\ b & a \end{pmatrix}$`; `$\begin{pmatrix} 3 & -1 \\ -1 & 3 \end{pmatrix}$` qualifies and `$\begin{pmatrix} 1 & 0 \\ 0 & 2 \end{pmatrix}$` does not.

## 4. Functions of matrices

Define `$f(A)$` by the power series of `$f$`. Four methods cover every GATE question:

1. **Diagonalise:** `$f(A) = Uf(D)U^\dagger$`, eigenvalue by eigenvalue. Eigenvalues of `$f(A)$` are `$f(\lambda_k)$`, so `$\text{tr}f(A) = \sum f(\lambda_k)$` and `$\det f(A) = \prod f(\lambda_k)$`. For `$A = \begin{pmatrix} 0 & \ln2 \\ \ln2 & 0 \end{pmatrix}$`, `$\text{tr}\,e^{A} = e^{\ln2} + e^{-\ln2} = 2.5$`.
2. **A matrix that squares to itself or to the identity.** If `$(\hat n\cdot\vec\sigma)^2 = I$` (any unit vector `$\hat n$`), the series splits into even and odd parts:

   ```math
   e^{i\theta\,\hat n\cdot\vec\sigma} = I\cos\theta + i\,(\hat n\cdot\vec\sigma)\sin\theta
   ```

   So `$\exp(i\pi\sigma_x/2) = i\sigma_x$` and `$\text{tr}\,e^{i\theta\hat n\cdot\vec\sigma} = 2\cos\theta$`. If `$A^2 = cA$` (as for any rank-one matrix with trace `$c$`), then `$A^n = c^{n-1}A$` and `$e^A = I + \frac{e^c - 1}{c}A$`.
3. **Jordan blocks (not diagonalisable).** For `$A = \lambda I + N$` with `$N^2 = 0$`, Taylor expansion stops after one term: `$f(A) = f(\lambda)I + f'(\lambda)N$`. So `$\sqrt{\begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix}} = \begin{pmatrix} 1 & 1/2 \\ 0 & 1 \end{pmatrix}$` and `$e^{tA} = e^{\lambda t}(I + tN)$`.
4. **Cayley-Hamilton** reduces any power series to a polynomial of degree `$n - 1$` (next section).

Two identities to know by heart: `$\det e^{A} = e^{\text{tr}A}$` for every square matrix, and `$e^{iH}$` is unitary whenever `$H$` is Hermitian (which is why time evolution `$e^{-iHt/\hbar}$` conserves probability). But **`$e^{A}e^{B} \ne e^{A+B}$`** unless `$A$` and `$B$` commute. When `$[A, B]$` commutes with both, `$e^{A}e^{B} = e^{A + B + \frac12[A, B]}$` (the simplest Baker-Campbell-Hausdorff formula, used for `$\hat x$` and `$\hat p$`).

<div class="problem" data-problem="mev-hermitian"></div>

## 5. Cayley-Hamilton at GATE level

Every square matrix satisfies its own characteristic equation `$p(\lambda) = \det(\lambda I - A) = 0$`. Uses beyond the `$2\times2$` reduction you saw in JAM:

- **Inverses without row reduction.** If `$p(\lambda) = \lambda^3 - 6\lambda^2 + 11\lambda - 6$`, then `$A^3 - 6A^2 + 11A - 6I = 0$`, so `$A^{-1} = \tfrac16(A^2 - 6A + 11I)$`.
- **High powers.** Divide `$\lambda^N$` by `$p(\lambda)$`; only the remainder (degree below `$n$`) survives. For `$2\times2$` with distinct eigenvalues, `$A^N = \alpha A + \beta I$` where `$\lambda_i^N = \alpha\lambda_i + \beta$` for both eigenvalues. The Fibonacci matrix `$\begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}$` gives `$A^n = \begin{pmatrix} F_{n+1} & F_n \\ F_n & F_{n-1} \end{pmatrix}$`, with `$F_n = (\varphi^n - \psi^n)/\sqrt5$` from its eigenvalues `$(1 \pm \sqrt5)/2$`.
- **Adjugate.** `$\text{adj}A = (\det A)A^{-1}$` has eigenvalues `$\det A/\lambda_k$`; for `$3\times3$`, `$\text{tr}\,\text{adj}A = \lambda_1\lambda_2 + \lambda_2\lambda_3 + \lambda_3\lambda_1$`.

## 6. Trace and determinant tricks

**Worked example (rank one).** Find `$\det(I + A)$` for `$A = \begin{pmatrix} 1 & 1 & 1 \\ 2 & 2 & 2 \\ 3 & 3 & 3 \end{pmatrix}$`.

1. Every row is a multiple of `$(1, 1, 1)$`: `$A = \vec u\vec v^T$` with `$\vec u = (1, 2, 3)^T$`, `$\vec v = (1, 1, 1)^T$`.
2. `$A\vec u = \vec u(\vec v^T\vec u) = 6\vec u$`, and anything orthogonal to `$\vec v$` is sent to zero: eigenvalues `$6, 0, 0$`.
3. `$I + A$` has eigenvalues `$7, 1, 1$`, so `$\det(I + A) = 7 = 1 + \vec v^T\vec u$`.

More shortcuts that GATE rewards:

- **Spectrum fixed by an equation.** `$H^2 = I$` forces eigenvalues `$\pm1$`; the trace then counts them. A `$4\times4$` Hermitian `$H$` with `$H^2 = I$` and trace 2 has eigenvalues `$1, 1, 1, -1$` and `$\det H = -1$`. A real `$4\times4$` with `$A^2 = -I$` has eigenvalues `$i, i, -i, -i$` (complex roots of a real polynomial pair up) and `$\det A = 1$`.
- **Equality in the triangle inequality.** A `$3\times3$` unitary with trace 3 has three unit-modulus eigenvalues adding to 3, so all equal 1; being normal it is diagonalisable, hence `$U = I$`.
- **Circulants and permutations.** A matrix whose rows are cyclic shifts has eigenvectors built from roots of unity; the row sum is always an eigenvalue (eigenvector `$(1, 1, \dots, 1)$`). The cyclic permutation of three objects has eigenvalues `$1, \omega, \omega^2$`.
- **Kronecker products.** `$A\otimes B$` has eigenvalues `$a_ib_j$`: `$\text{tr}(A\otimes B) = \text{tr}A\,\text{tr}B$` and `$\det(A\otimes B) = (\det A)^m(\det B)^n$` for `$A$` of size `$n$` and `$B$` of size `$m$`.
- **Positive definite** Hermitian matrices: all eigenvalues positive, equivalently `$v^\dagger Hv > 0$` for all `$v \ne 0$`, equivalently `$H = B^\dagger B$` with `$B$` invertible. Positive diagonal entries are necessary but not sufficient.
- **Nilpotent:** if `$N^2 = 0$` then the image of `$N$` lies in its kernel, so `$\text{rank}N \le n/2$`.

<div class="myth">

**"If all the eigenvalues of a matrix equal 1, the matrix is the identity."** Only if the matrix is diagonalisable. The shear `$\begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix}$` has eigenvalue 1 twice but only one eigenvector, and it is certainly not `$I$`. For normal matrices (Hermitian, unitary, anti-Hermitian) the conclusion is safe, because they are always diagonalisable: `$U = VIV^\dagger = I$`. Before reading off a matrix from its eigenvalues, ask whether it is normal.

</div>

Check your diagonalisations in fibub's [matrix calculator](/science/matrix-calculator/), and watch a matrix act on vectors with the [matrix transform tool](/learn/matrix-transform/).

<div class="keypoints">

- Hermitian: real eigenvalues. Anti-Hermitian: imaginary. Unitary: modulus 1. All three are normal, and normal matrices are exactly the unitarily diagonalisable ones. Complex symmetric is not Hermitian.
- Spectral decomposition `$A = \sum\lambda_kP_k$` gives `$f(A) = \sum f(\lambda_k)P_k$`; `$\text{tr}f(A) = \sum f(\lambda_k)$`, `$\det f(A) = \prod f(\lambda_k)$`, `$\det e^A = e^{\text{tr}A}$`.
- `$e^{i\theta\hat n\cdot\vec\sigma} = I\cos\theta + i\hat n\cdot\vec\sigma\sin\theta$`; for a Jordan block `$f(\lambda I + N) = f(\lambda)I + f'(\lambda)N$`; `$e^Ae^B = e^{A+B}$` only if they commute.
- Commuting diagonalisable matrices share an eigenbasis; with degeneracy, diagonalise the second matrix inside each eigenspace.
- Small oscillations: `$\det(K - \omega^2M) = 0$`. Quadratic forms: the signs of the eigenvalues decide ellipse or hyperbola.
- Cayley-Hamilton gives inverses and high powers; `$\text{tr}\,\text{adj}A$` is the sum of pairwise eigenvalue products; `$\det(I + \vec u\vec v^T) = 1 + \vec v^T\vec u$`.

</div>

## Practise: exam questions on this lesson

From warm-up to top-rank level, with full solutions. For the BSc-level basics, the [JAM matrices questions](/learn/courses/iit-jam-physics/practice/matrices/) are a good warm-up. More on the [GATE practice page for this topic](/learn/courses/gate-physics/practice/matrices-eigenvalues/).

<div class="qbank" data-bank="physics" data-topics="matrices-eigenvalues" data-exam="gate" data-n="10"></div>

**Before this:** [lesson 1.1, linear vector spaces and Dirac notation](/learn/courses/gate-physics/linear-vector-spaces/). **Next:** [lesson 1.3, analytic functions and Cauchy's theorem](/learn/courses/gate-physics/complex-analysis/). Back to the [GATE Physics course home](/learn/courses/gate-physics/).

**Going on to CSIR NET?** [Group theory for physicists](/learn/courses/csir-net-physics/group-theory/) shows how unitary matrices like these form groups such as SU(2).
