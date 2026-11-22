---
title: Linear vector spaces and Dirac notation
seoTitle: Linear vector spaces and Dirac notation | GATE Physics
summary: 'Vector spaces beyond arrows: bases and dimension, inner products and Cauchy-Schwarz, Gram-Schmidt, kets and bras, outer products, projectors and completeness, change of basis, Hermitian and unitary operators, function spaces and tensor products, the way GATE and CSIR NET test them.'
minutes: 50
updated: 2026-11-22
quiz:
  - q: In Dirac notation, what is the bra that goes with the ket 3i|ψ⟩?
    choices: ['−3i⟨ψ|', '3i⟨ψ|', '3⟨ψ|', '⟨ψ|/(3i)']
    ans: 0
    why: Turning a ket into a bra takes the complex conjugate of every number in front, so 3i becomes −3i. That keeps ⟨ψ|ψ⟩ real and positive.
  - q: "{|n⟩} is an orthonormal basis. What is Σₙ |n⟩⟨n|?"
    choices: ['The identity operator', 'The number of basis vectors', 'Zero', 'A projector onto |1⟩']
    ans: 0
    why: "Every |ψ⟩ = Σₙ |n⟩⟨n|ψ⟩, so the sum of the outer products acts as the identity. This completeness relation lets you insert 1 anywhere in a calculation."
  - q: What is the dimension of the real vector space of 2 × 2 Hermitian matrices?
    choices: ['4', '8', '3', '2']
    ans: 0
    why: "Two real diagonal entries and one complex off-diagonal entry (two real numbers) make four real parameters; I, σx, σy, σz is a basis."
sources:
  - 'P. A. M. Dirac, The Principles of Quantum Mechanics, 4th ed. (1958), chapters 1 and 2'
  - 'R. Shankar, Principles of Quantum Mechanics, 2nd ed. (1994), chapter 1'
  - 'G. B. Arfken, H. J. Weber and F. E. Harris, Mathematical Methods for Physicists, 7th ed. (2013), chapters 5 and 6'
  - 'S. Axler, Linear Algebra Done Right, 3rd ed. (2015), chapters 2, 6 and 7'
  - 'GATE Physics (PH) syllabus, Mathematical Physics section, published by the organising institute each year'
---

**Module 1 · about 50 minutes.** By the end you will be able to decide whether a set is a vector space, count its dimension, use inner products and Gram-Schmidt in spaces of arrows, complex vectors and functions, and calculate fluently in Dirac notation: bras and kets, outer products, projectors, completeness and change of basis. This is the language of all of quantum mechanics. If 2 × 2 matrices and eigenvalues feel rusty, first skim the IIT JAM lesson on [matrices and eigenvalues](/learn/courses/iit-jam-physics/matrices/) and [vector algebra](/learn/courses/iit-jam-physics/vector-algebra/).

<div class="bigidea">A vector is anything you can add and scale: arrows, columns of complex numbers, wavefunctions, even matrices. An inner product adds lengths and angles, and Dirac notation lets you do all of it with one set of symbols.</div>

## 1. What makes a vector space

A **vector space** over the numbers `$\mathbb F$` (real `$\mathbb R$` or complex `$\mathbb C$`) is a set where you can add any two members and multiply any member by a number, and the result stays in the set, with the familiar rules: addition is commutative and associative, there is a zero vector, every vector has a negative, and scalars distribute (`$a(\vec u + \vec v) = a\vec u + a\vec v$`, `$(a + b)\vec v = a\vec v + b\vec v$`).

That is all. Nothing says a vector must be an arrow. Spaces you will meet in GATE:

- `$\mathbb R^n$` and `$\mathbb C^n$`: columns of numbers (spin states live in `$\mathbb C^2$`).
- Polynomials of degree at most `$n$`: adding two keeps the degree at most `$n$`.
- Square-integrable functions on an interval or on the whole line: the home of wavefunctions.
- `$m\times n$` matrices; Hermitian matrices (a real vector space, not a complex one).

**The subspace test.** A subset of a known vector space is itself a vector space exactly when it contains the zero vector and is closed under addition and scaling. That is the quickest way to answer "which of these sets is a vector space?":

- Traceless matrices: yes, because the trace is linear.
- The plane `$x + y + z = 1$`: no, it misses the origin.
- Polynomials of degree *exactly* 3: no, `$x^3 + (-x^3 + x) = x$`.
- Matrices with determinant zero: no, `$\text{diag}(1, 0) + \text{diag}(0, 1) = I$`.

## 2. Bases, dimension and components

Vectors `$\vec v_1, \dots, \vec v_k$` are **linearly independent** if `$c_1\vec v_1 + \dots + c_k\vec v_k = 0$` forces every `$c_i = 0$`. A **basis** is an independent set that spans the space; every basis has the same number of vectors, the **dimension**. Once a basis is chosen, each vector is a list of numbers, its **components**.

Drag v, b₁ and b₂, then press 'Orthonormal basis'.

<figure class="fig" data-fig="@math-basis-change"><figcaption>Notice that the same arrow v has different coordinates in different bases, and that with an orthonormal basis each coordinate is just a dot product.</figcaption></figure>

For numerical vectors, independence is a determinant (or rank) question. For functions, look for hidden relations first: `$\cosh x = \tfrac12 e^x + \tfrac12 e^{-x}$` makes `$\{e^x, e^{-x}, \cosh x\}$` dependent, and `$\{\sin^2 x, \cos^2 x, 1\}$` is dependent too. The Wronskian determinant settles harder cases.

**Counting dimensions** is a favourite NAT question. Count free real (or complex) parameters:

| Space | Dimension |
|---|---|
| polynomials of degree at most `$n$` | `$n + 1$` |
| real symmetric `$n\times n$` matrices | `$n(n+1)/2$` |
| real antisymmetric `$n\times n$` matrices | `$n(n-1)/2$` |
| complex Hermitian `$n\times n$` matrices (over `$\mathbb R$`) | `$n^2$` |
| traceless Hermitian `$n\times n$` matrices (over `$\mathbb R$`) | `$n^2 - 1$` |

The last row gives 3 for `$n = 2$` (the Pauli matrices) and 8 for `$n = 3$` (the Gell-Mann matrices).

## 3. Inner products: length and angle

An **inner product** assigns a number `$\langle u|v\rangle$` to each pair of vectors with three properties:

```math
\langle u|v\rangle = \langle v|u\rangle^*, \qquad \langle u|\,(a v + b w)\rangle = a\langle u|v\rangle + b\langle u|w\rangle, \qquad \langle v|v\rangle > 0 \text{ for } v \ne 0
```

Drag the tips of a and b, then press 'Make perpendicular'.

<figure class="fig" data-fig="@math-vec-projection"><figcaption>Notice that the shadow of a on b has length |a|cos θ, that a·b = |b| times that shadow, and that the leftover part is perpendicular to b.</figcaption></figure>

Physics puts the complex conjugate on the **left** slot: `$\langle a u|v\rangle = a^*\langle u|v\rangle$`. The standard examples are

```math
\langle u|v\rangle = \sum_k u_k^*\,v_k \ \ (\text{in } \mathbb C^n), \qquad \langle f|g\rangle = \int_a^b f^*(x)\,g(x)\,w(x)\,dx \ \ (\text{functions, weight } w > 0)
```

The **norm** is `$\lVert v\rVert = \sqrt{\langle v|v\rangle}$`. Two inequalities hold in every inner-product space:

```math
\lvert\langle u|v\rangle\rvert \le \lVert u\rVert\,\lVert v\rVert \ \ (\text{Cauchy-Schwarz}), \qquad \lVert u + v\rVert \le \lVert u\rVert + \lVert v\rVert \ \ (\text{triangle})
```

Cauchy-Schwarz becomes an equality only when one vector is a multiple of the other. In quantum mechanics it is the engine behind the uncertainty principle.

<div class="meaning">

<dl>
<dt>⟨u|v⟩</dt><dd>the overlap of two vectors: how much of v points along u (a complex number in general)</dd>
<dt>‖v‖</dt><dd>the length of v; for a wavefunction, ‖ψ‖² = 1 means total probability 1</dd>
<dt>⟨u|v⟩ = 0</dt><dd>u and v are orthogonal: completely independent directions</dd>
<dt>|⟨u|v⟩|²</dt><dd>for normalised states, the probability that a system in state v is found in state u</dd>
<dt>Physical meaning</dt><dd>The inner product is what turns a list of amplitudes into measurable probabilities. Conjugating the left slot is what makes ⟨v|v⟩ a real, positive length for complex vectors.</dd>
</dl>

</div>

**Worked example.** For `$|u\rangle = (1, i)^T$` and `$|v\rangle = (i, 1)^T$`: `$\langle u|v\rangle = 1\cdot i + (-i)\cdot1 = 0$`. Orthogonal. Without the conjugate you would get `$2i$`, and `$\langle u|u\rangle$` would come out as `$1 + i^2 = 0$` for a non-zero vector, which is nonsense. Conjugation is not optional.

Not every formula is an inner product. `$\vec u^TG\vec v$` on `$\mathbb R^2$` is one exactly when the symmetric matrix `$G$` is **positive definite**: `$\text{diag}(1, -1)$` fails (it gives `$\langle v|v\rangle = -1$` for `$(0, 1)$`), while `$\begin{pmatrix} 2 & 1 \\ 1 & 1 \end{pmatrix}$` (trace 3, determinant 1, both eigenvalues positive) works.

## 4. Gram-Schmidt: building an orthonormal basis

Any basis can be straightened into an orthonormal one. Take the vectors one at a time and remove from each its components along the ones already made:

```math
\vec u_1 = \vec v_1, \qquad \vec u_2 = \vec v_2 - \frac{\langle u_1|v_2\rangle}{\langle u_1|u_1\rangle}\,\vec u_1, \qquad \vec u_3 = \vec v_3 - \frac{\langle u_1|v_3\rangle}{\langle u_1|u_1\rangle}\vec u_1 - \frac{\langle u_2|v_3\rangle}{\langle u_2|u_2\rangle}\vec u_2
```

and finally divide each `$\vec u_k$` by its norm. Move the sliders: the part of `$\vec v_2$` along `$\vec v_1$` is the projection, and what is left, `$\vec u_2$`, is at right angles.

<figure class="fig" data-fig="gram-schmidt"><figcaption>Splitting v₂ into its projection on v₁ and the orthogonal remainder u₂, the one step Gram-Schmidt repeats. At 0° or 180° the remainder vanishes: the vectors are dependent.</figcaption></figure>

By Pythagoras, `$\lVert u_2\rVert^2 = \lVert v_2\rVert^2 - \lvert\langle u_1|v_2\rangle\rvert^2/\lVert u_1\rVert^2$`, a quick check on any calculation.

**Worked example (functions).** On `$[-1, 1]$` with `$\langle f|g\rangle = \int_{-1}^{1}fg\,dx$`, orthogonalise `$1, x, x^2$`. First `$u_1 = 1$`. Next `$\langle 1|x\rangle = 0$` (odd), so `$u_2 = x$`. Then `$\langle x|x^2\rangle = 0$` and `$\langle 1|x^2\rangle/\langle1|1\rangle = (2/3)/2 = 1/3$`, so `$u_3 = x^2 - \tfrac13$`. Up to normalisation these are the Legendre polynomials `$P_0, P_1, P_2$`: Gram-Schmidt on powers of `$x$`, with different weights and intervals, produces every classical orthogonal polynomial (Hermite with weight `$e^{-x^2}$` on the whole line, Laguerre with `$e^{-x}$` on `$[0, \infty)$`).

**A trap with subspaces.** To project onto a plane spanned by two vectors that are *not* orthogonal, you cannot add the two separate projections. Orthogonalise first, or (in `$\mathbb R^3$`) subtract the projection on the normal. For the plane spanned by `$(1, 1, 0)$` and `$(0, 1, 1)$`, the normal is `$(1, -1, 1)$`, and `$(1, 0, 0)$` has squared projection `$1 - \tfrac13 = \tfrac23$` onto the plane, not `$\tfrac12 + 0$`.

## 5. Dirac notation

Dirac's notation separates a vector from the numbers that describe it, so the same symbols work in every basis and every space.

- A **ket** `$|\psi\rangle$` is a vector (a column).
- A **bra** `$\langle\phi|$` is the linear map that sends `$|\psi\rangle$` to the number `$\langle\phi|\psi\rangle$` (a row: the conjugate transpose of `$|\phi\rangle$`).
- The bra of `$c|\psi\rangle$` is `$c^*\langle\psi|$`: the ket-to-bra map is **antilinear**.

Put a ket in front of a bra and you get an **operator**, the outer product:

```math
\big(|a\rangle\langle b|\big)|\psi\rangle = |a\rangle\,\langle b|\psi\rangle, \qquad \text{tr}\big(|a\rangle\langle b|\big) = \langle b|a\rangle, \qquad \big(|a\rangle\langle b|\big)^\dagger = |b\rangle\langle a|
```

For `$|a\rangle = (1, 0)^T$` and `$|b\rangle = (i, 1)^T$`, `$|a\rangle\langle b| = \begin{pmatrix} 1 \\ 0 \end{pmatrix}(-i,\ 1) = \begin{pmatrix} -i & 1 \\ 0 & 0 \end{pmatrix}$`.

**Orthonormal bases, completeness and projectors.** If `$\langle m|n\rangle = \delta_{mn}$` and the set is complete, every vector expands as `$|\psi\rangle = \sum_n c_n|n\rangle$` with `$c_n = \langle n|\psi\rangle$`. Since that holds for every `$|\psi\rangle$`:

```math
\sum_n |n\rangle\langle n| = \hat 1
```

This **resolution of the identity** is the most useful line in the subject: insert it anywhere. For example `$\langle\phi|\psi\rangle = \sum_n\langle\phi|n\rangle\langle n|\psi\rangle = \sum_n\phi_n^*\psi_n$`, and an operator's matrix is `$A_{mn} = \langle m|\hat A|n\rangle$`, so that `$\hat A = \sum_{mn}A_{mn}|m\rangle\langle n|$`.

Each `$\hat P_n = |n\rangle\langle n|$` is a **projector**: `$\hat P^2 = \hat P$`, `$\hat P^\dagger = \hat P$`, eigenvalues 0 and 1. Sums of projectors onto orthogonal states are projectors; differences are not (`$(\hat P_1 - \hat P_2)^2 = \hat P_1 + \hat P_2$`). The operator `$\hat 1 - 2|\psi\rangle\langle\psi|$` is a reflection: Hermitian, unitary, squares to `$\hat 1$`, and has determinant `$-1$`.

**Change of basis.** The same operator has different matrices in different bases. With `$|\pm\rangle = (|0\rangle \pm |1\rangle)/\sqrt2$`, `$\sigma_z$` swaps `$|+\rangle$` and `$|-\rangle$`, so in the `$\{|+\rangle, |-\rangle\}$` basis its matrix is `$\begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}$`. The eigenvalues (`$\pm1$`), trace and determinant do not change; only the eigenbasis makes the matrix diagonal. If `$U_{mn} = \langle m|n'\rangle$` links the bases, `$A' = U^\dagger AU$`.

**Worked example (expectation value).** `$\hat A = |1\rangle\langle1| + 2|2\rangle\langle2| + 3|3\rangle\langle3|$` and `$|\psi\rangle = \tfrac13(|1\rangle + 2i|2\rangle + 2|3\rangle)$`.

1. Norm: `$(1 + 4 + 4)/9 = 1$`, already normalised.
2. `$\hat A|\psi\rangle = \tfrac13(|1\rangle + 4i|2\rangle + 6|3\rangle)$`.
3. `$\langle\psi|\hat A|\psi\rangle = \tfrac19(1\cdot1 + (-2i)(4i) + 2\cdot6) = \tfrac19(1 + 8 + 12) = \tfrac{21}{9} \approx 2.33$`: the eigenvalues weighted by `$\lvert c_n\rvert^2$`.

<div class="problem" data-problem="lvs-expectation"></div>

## 6. Operators: adjoint, Hermitian, unitary

The **adjoint** `$\hat A^\dagger$` is defined by `$\langle\phi|\hat A\psi\rangle = \langle\hat A^\dagger\phi|\psi\rangle$`; in an orthonormal basis its matrix is the conjugate transpose. The rules `$(\hat A\hat B)^\dagger = \hat B^\dagger\hat A^\dagger$` and `$(c\hat A)^\dagger = c^*\hat A^\dagger$` settle most "is it Hermitian?" questions:

- `$\hat A\hat B + \hat B\hat A$`, `$\hat A\hat B\hat A$` and `$i[\hat A, \hat B]$` are Hermitian when `$\hat A, \hat B$` are.
- `$[\hat A, \hat B]$` itself is **anti-Hermitian**, which is why `$[\hat x, \hat p] = i\hbar$` carries an `$i$`.

**Hermitian** operators (`$\hat H^\dagger = \hat H$`) have real eigenvalues and orthogonal eigenvectors for different eigenvalues, and in finite dimensions their eigenvectors form an orthonormal basis (the spectral theorem): `$\hat H = \sum_n\lambda_n|n\rangle\langle n|$`. **Unitary** operators (`$\hat U^\dagger\hat U = \hat 1$`) preserve every inner product, map orthonormal bases to orthonormal bases, and have eigenvalues of modulus 1. Having `$\lvert\det\hat U\rvert = 1$` is *not* enough to be unitary: `$\text{diag}(2, \tfrac12)$` is a counter-example. The next lesson, [Hermitian and unitary matrices, diagonalisation](/learn/courses/gate-physics/matrices-eigenvalues/), works these out in detail.

**Commuting operators share eigenvectors.** If `$[\hat A, \hat B] = 0$` and `$\hat A|a\rangle = a|a\rangle$`, then `$\hat B|a\rangle$` is also an eigenvector of `$\hat A$` with eigenvalue `$a$`. Without degeneracy that forces `$\hat B|a\rangle \propto |a\rangle$`. With degeneracy, `$\hat B$` can be anything inside each eigenspace: the matrices commuting with `$\text{diag}(1, 1, 2)$` form a space of dimension `$2^2 + 1^2 = 5$`.

<div class="myth">

**"A bra is just the transpose of the ket."** It is the *conjugate* transpose, and the map from kets to bras is antilinear: the bra of `$c|\psi\rangle$` is `$c^*\langle\psi|$`. Forget the conjugate and inner products stop being positive (`$(1, i)$` would have "length" zero), probabilities can come out complex, and `$\hat A^\dagger\hat A$` would not be Hermitian. When a calculation in `$\mathbb C^n$` gives a complex norm, look for a missing conjugate first.

</div>

## 7. Infinite dimensions and tensor products

**Function spaces.** On `$[-\pi, \pi]$` the functions `$e_n = e^{inx}/\sqrt{2\pi}$` are orthonormal and complete: expanding in them *is* the Fourier series (see the JAM lesson on [Fourier series](/learn/courses/iit-jam-physics/fourier-series/)). Components are inner products, `$c_n = \langle e_n|f\rangle$`, and Parseval's theorem `$\sum\lvert c_n\rvert^2 = \lVert f\rVert^2$` is Pythagoras with infinitely many axes. For `$f = x$`, `$c_1 = \frac{1}{\sqrt{2\pi}}\int_{-\pi}^{\pi}xe^{-ix}dx = -i\sqrt{2\pi}$`, so `$\lvert c_1\rvert^2 = 2\pi$`.

The space `$L^2(\mathbb R)$` of square-integrable functions is a **Hilbert space**: an inner-product space in which every Cauchy sequence converges. Two warnings for GATE:

- The plane wave `$e^{ikx}$` and the delta function `$\delta(x - x_0)$` are *not* in `$L^2$`: their norms are infinite. They are generalised eigenvectors of `$\hat p$` and `$\hat x$`, normalised to delta functions, `$\langle x|x'\rangle = \delta(x - x')$`, with completeness `$\int|x\rangle\langle x|\,dx = \hat 1$`.
- Unbounded operators like `$\hat x$` have no normalisable eigenvectors at all: their spectrum is continuous.

**Tensor products.** Two systems with spaces of dimensions `$m$` and `$n$` combine into a space of dimension `$mn$` (not `$m + n$`), with basis `$|i\rangle\otimes|j\rangle = |ij\rangle$`. A state `$\sum c_{ij}|ij\rangle$` is a product state `$|a\rangle\otimes|b\rangle$` exactly when the matrix `$c_{ij}$` has rank 1; for two qubits, when `$\det c = 0$`. So `$\tfrac12(|00\rangle + |01\rangle + |10\rangle - |11\rangle)$` (determinant `$-\tfrac12$`) is entangled. You can build and inspect such states in fibub's [quantum circuit simulator](/science/quantum-circuit/), and check any matrix calculation with the [matrix calculator](/science/matrix-calculator/).

<div class="keypoints">

- A vector space needs only addition and scaling; subspace test: contains 0, closed under both. Arrows, `$\mathbb C^n$`, polynomials, functions and matrices are all vector spaces.
- Dimension = number of basis vectors. Symmetric `$n(n+1)/2$`, antisymmetric `$n(n-1)/2$`, Hermitian `$n^2$` (real), traceless Hermitian `$n^2 - 1$`.
- Inner product: conjugate on the left, `$\langle u|v\rangle = \sum u_k^*v_k$` or `$\int f^*g\,w\,dx$`. Cauchy-Schwarz is an equality only for parallel vectors.
- Gram-Schmidt subtracts projections one at a time; on `$1, x, x^2$` it gives the Legendre polynomials. Never add projections onto non-orthogonal vectors.
- Bra of `$c|\psi\rangle$` is `$c^*\langle\psi|$`; `$\text{tr}\,|a\rangle\langle b| = \langle b|a\rangle$`; `$\sum_n|n\rangle\langle n| = \hat 1$`; projectors have eigenvalues 0 and 1.
- Matrices change with the basis (`$A' = U^\dagger AU$`); eigenvalues, trace and determinant do not. Commuting operators share eigenvectors.
- Plane waves and delta functions lie outside `$L^2$`; tensor-product dimensions multiply.

</div>

## Practise: exam questions on this lesson

They climb from warm-up to top-rank level. Check each answer, then read the full solution. More on the [linear vector spaces practice page](/learn/courses/gate-physics/practice/linear-vector-spaces/), and every topic on the [GATE Physics practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="linear-vector-spaces" data-exam="gate" data-n="10"></div>

**Next:** [lesson 1.2, Hermitian and unitary matrices and diagonalisation](/learn/courses/gate-physics/matrices-eigenvalues/). Back to the [GATE Physics course home](/learn/courses/gate-physics/).
