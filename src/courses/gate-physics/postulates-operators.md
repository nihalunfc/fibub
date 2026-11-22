---
title: 'Postulates, operators and expectation values'
summary: 'The rules quantum mechanics runs on, written the GATE way: kets and bras, Hermitian and unitary operators, what a measurement can give and with what probability, collapse (including degenerate levels), expectation values and spreads, and how states and averages move in time.'
minutes: 45
updated: 2026-11-22
quiz:
  - q: 'An observable has eigenvalues 1, 2 and 3. The system is in a state where the probabilities are 0.5, 0.25 and 0.25. A single measurement gives'
    choices: ['1, 2 or 3, never anything else', 'always 1.75', 'always 1, the most likely value', 'any number between 1 and 3']
    ans: 0
    why: 'A single measurement always gives an eigenvalue. 1.75 is the expectation value, the average over many identical copies, and it is not a possible result here.'
  - q: 'Which statement about a Hermitian operator is always true?'
    choices: ['Its eigenvalues are real and eigenvectors with different eigenvalues are orthogonal', 'Its eigenvalues are positive', 'It commutes with every other operator', 'Its eigenvalues have modulus 1']
    ans: 0
    why: 'Hermitian means A = A†, which forces real eigenvalues and orthogonal eigenvectors. Modulus 1 belongs to unitary operators; positivity needs more (for example A = B†B).'
  - q: 'A system is in an energy eigenstate. Which quantity changes with time?'
    choices: ['Only the overall phase of the state', 'The probability density', 'The expectation value of position', 'The probabilities of momentum values']
    ans: 0
    why: 'A stationary state evolves as e^(−iEt/ħ)|E⟩. A global phase cancels in every probability and expectation value, so nothing measurable changes.'
sources:
  - 'D. J. Griffiths and D. F. Schroeter, Introduction to Quantum Mechanics, 3rd ed. (2018), chapter 3: formalism'
  - 'R. Shankar, Principles of Quantum Mechanics, 2nd ed. (1994), chapters 1 and 4'
  - 'J. J. Sakurai and J. Napolitano, Modern Quantum Mechanics, 3rd ed. (2021), chapter 1'
  - 'GATE Physics (PH) syllabus, quantum mechanics section, published by the organising institute each year'
---

**Module 4 · about 45 minutes.** By the end you will be able to work in Dirac notation without fear, test whether an operator is Hermitian or unitary, predict the results and probabilities of any measurement (also when levels are degenerate), compute expectation values and spreads, and follow a state and its averages in time. The wave mechanics of [IIT JAM lesson 6.3](/learn/courses/iit-jam-physics/schrodinger-equation/) is assumed; here we put it on the footing GATE questions use.

<div class="bigidea">A quantum state is a vector. Every measurable quantity is a Hermitian operator, its possible results are that operator's eigenvalues, and the probability of each is the squared length of the state's shadow on the matching eigenvector.</div>

## 1. States are vectors: kets, bras and inner products

Write the state of a system as a **ket** `$|\psi\rangle$`, a vector in a complex vector space with an inner product (a Hilbert space). Pick an orthonormal basis `$\{|n\rangle\}$`, with `$\langle m|n\rangle = \delta_{mn}$`. Then

```math
|\psi\rangle = \sum_n c_n|n\rangle, \qquad c_n = \langle n|\psi\rangle, \qquad \langle\psi| = \sum_n c_n^*\langle n|
```

The **bra** `$\langle\psi|$` is the conjugate transpose: the column of numbers `$c_n$` becomes a row of `$c_n^*$`. The inner product of two states is `$\langle\phi|\psi\rangle = \sum_n b_n^*c_n$`, and `$\langle\psi|\phi\rangle = \langle\phi|\psi\rangle^*$`. A physical state is normalised, `$\langle\psi|\psi\rangle = \sum|c_n|^2 = 1$`, and multiplying it by a constant phase `$e^{i\theta}$` changes nothing measurable.

The wavefunction is just the set of components in the position basis: `$\psi(x) = \langle x|\psi\rangle$`, and then `$\langle\phi|\psi\rangle = \int\phi^*(x)\psi(x)\,dx$`. The sum over a discrete basis becomes an integral, and `$\langle x|x'\rangle = \delta(x - x')$`.

Because `$|\psi\rangle = \sum_n|n\rangle\langle n|\psi\rangle$` for every state, the bracket `$\sum_n|n\rangle\langle n|$` is the identity. This **completeness relation** is the most useful trick in the subject: you can insert it anywhere.

```math
\sum_n |n\rangle\langle n| = \hat 1, \qquad \int |x\rangle\langle x|\,dx = \hat 1
```

**Worked example.** Normalise `$|\psi\rangle = 3|1\rangle + 4i|2\rangle$` and find `$\langle\phi|\psi\rangle$` for `$|\phi\rangle = |1\rangle + |2\rangle$` (unnormalised).

1. `$\langle\psi|\psi\rangle = 3\cdot3 + (-4i)(4i) = 25$`, so the normalised state is `$\tfrac15(3|1\rangle + 4i|2\rangle)$`.
2. `$\langle\phi|\psi\rangle = 1\cdot3 + 1\cdot4i = 3 + 4i$` (the bra of `$|\phi\rangle$` has coefficients `$1^* = 1$`).

## 2. Operators, adjoints and Hermitian operators

A linear operator maps kets to kets, `$\hat A(c_1|\psi_1\rangle + c_2|\psi_2\rangle) = c_1\hat A|\psi_1\rangle + c_2\hat A|\psi_2\rangle$`. In a basis it is a matrix, `$A_{mn} = \langle m|\hat A|n\rangle$`, and the identity lets you write `$\hat A = \sum_{m,n}|m\rangle A_{mn}\langle n|$`.

The **adjoint** `$\hat A^\dagger$` is defined by `$\langle\phi|\hat A\psi\rangle = \langle\hat A^\dagger\phi|\psi\rangle$` for all states. Its matrix is the conjugate transpose, and

```math
(c\hat A)^\dagger = c^*\hat A^\dagger, \qquad (\hat A\hat B)^\dagger = \hat B^\dagger\hat A^\dagger, \qquad (|\psi\rangle\langle\phi|)^\dagger = |\phi\rangle\langle\psi|
```

Three kinds of operator matter most:

- **Hermitian**, `$\hat A^\dagger = \hat A$`: the observables. Examples: `$\hat x$`, `$\hat p = -i\hbar\,d/dx$`, `$\hat H$`, the Pauli matrices.
- **Unitary**, `$\hat U^\dagger\hat U = \hat 1$`: they preserve inner products, so they describe time evolution, rotations and translations. Eigenvalues lie on the unit circle, `$e^{i\theta}$`.
- **Projectors**, `$\hat P = |\phi\rangle\langle\phi|$` (normalised `$\phi$`): `$\hat P^2 = \hat P$`, eigenvalues 0 and 1. A projector onto a subspace is the sum of `$|k\rangle\langle k|$` over an orthonormal basis of it.

<div class="meaning">

<dl>
<dt>|ψ⟩</dt><dd>the state: a column of complex amplitudes in any basis you choose</dd>
<dt>⟨φ|ψ⟩</dt><dd>the overlap of two states, a complex number; its squared modulus is a probability</dd>
<dt>Â† = Â</dt><dd>Hermitian: the matrix equals its own conjugate transpose, real on the diagonal</dd>
<dt>|n⟩⟨n|</dt><dd>the projector that keeps only the part of a state along |n⟩</dd>
<dt>Physical meaning</dt><dd>A Hermitian operator is a measuring device described by its possible readings (eigenvalues) and the states that give each reading with certainty (eigenvectors).</dd>
</dl>

</div>

Why Hermitian? Because then measurement results are real and distinct results come from perfectly distinguishable states. Watch the proof.

<div class="steps">
<div class="step">

**Take two eigenvectors.** `$\hat A|a\rangle = a|a\rangle$` and `$\hat A|b\rangle = b|b\rangle$`, with `$\hat A^\dagger = \hat A$`.

</div>
<div class="step">

**Sandwich both ways.** `$\langle b|\hat A|a\rangle = a\langle b|a\rangle$`. Letting `$\hat A$` act to the left instead (allowed because `$\hat A^\dagger = \hat A$`): `$\langle b|\hat A|a\rangle = b^*\langle b|a\rangle$`.

</div>
<div class="step">

**Subtract.** `$(a - b^*)\langle b|a\rangle = 0$`.

</div>
<div class="step">

**Same vector** (`$b = a$`): `$\langle a|a\rangle > 0$`, so `$a = a^*$`. Eigenvalues are real.

</div>
<div class="step">

**Different eigenvalues:** now `$b^* = b \ne a$`, so `$\langle b|a\rangle = 0$`. Eigenvectors with different eigenvalues are orthogonal; inside a degenerate level we can choose them orthogonal. Together they form a complete orthonormal basis (in finite dimensions this is the spectral theorem).

</div>
</div>

**Worked example.** Is `$\hat p = -i\hbar\,d/dx$` Hermitian? For functions that vanish at infinity, integrate by parts: `$\int\phi^*(-i\hbar\psi')dx = [-i\hbar\phi^*\psi] + i\hbar\int(\phi^*)'\psi\,dx = \int(-i\hbar\phi')^*\psi\,dx$`. So `$\langle\phi|\hat p\psi\rangle = \langle\hat p\phi|\psi\rangle$`: yes. Without the `$i$`, `$d/dx$` alone is anti-Hermitian, and `$x\,d/dx$` is not Hermitian at all, since `$(\hat x\hat p)^\dagger = \hat p\hat x \ne \hat x\hat p$`.

Functions of an operator act on its eigenvalues. If `$\hat A = \sum_a a|a\rangle\langle a|$` (the spectral decomposition), then `$f(\hat A) = \sum_a f(a)|a\rangle\langle a|$`. So `$e^{\hat A}$` for `$\hat A = \begin{pmatrix}1&1\\1&1\end{pmatrix}$` has eigenvalues `$e^0$` and `$e^2$`, and its trace is `$1 + e^2$`, not the sum of `$e^{A_{ij}}$` entries.

## 3. The postulates

Every GATE quantum question rests on five rules.

1. **States.** The state of an isolated system is a normalised ket `$|\psi\rangle$`, defined up to a global phase.
2. **Observables.** Each measurable quantity is a Hermitian operator. (Classical `$x$` and `$p$` become `$\hat x$`, `$\hat p$` with `$[\hat x, \hat p] = i\hbar$`, the subject of [lesson 4.2](/learn/courses/gate-physics/commutators-uncertainty/).)
3. **Results.** A measurement of `$\hat A$` gives one of its eigenvalues `$a$`, never anything else.
4. **Probabilities and collapse (Born rule).** The probability of `$a$` is `$P(a) = \langle\psi|\hat P_a|\psi\rangle$`, where `$\hat P_a$` projects onto the eigenspace of `$a$`. For a non-degenerate `$a$` this is `$|\langle a|\psi\rangle|^2$`. Right after the measurement the state is `$\hat P_a|\psi\rangle$`, normalised.
5. **Time evolution.** Between measurements, `$i\hbar\,\dfrac{d}{dt}|\psi\rangle = \hat H|\psi\rangle$`.

Rule 4 is where most marks are lost. With **degeneracy**, the probability is the sum over an orthonormal basis of the eigenspace, and the state collapses onto the projection into that whole eigenspace, not onto one basis vector you happen to like.

**Worked example (degenerate collapse).** `$\hat A = \begin{pmatrix}2&0&0\\0&1&1\\0&1&1\end{pmatrix}$` and `$|\psi\rangle = (1, 1, 0)^T/\sqrt2$`.

1. Eigenvalues: `$2$` from the first entry; the lower block has `$2$` and `$0$`. So `$2$` is doubly degenerate, with eigenspace spanned by `$e_1 = (1,0,0)$` and `$f = (0,1,1)/\sqrt2$`.
2. `$P(2) = |\langle e_1|\psi\rangle|^2 + |\langle f|\psi\rangle|^2 = \tfrac12 + \tfrac14 = \tfrac34$`.
3. After getting `$2$`: `$\hat P_2|\psi\rangle = \tfrac{1}{\sqrt2}e_1 + \tfrac12 f = \tfrac{1}{2\sqrt2}(2, 1, 1)$`; normalised, `$(2, 1, 1)^T/\sqrt6$`.

Repeat the measurement at once and you get `$2$` again with certainty. Measure a second observable `$\hat B$` that does not commute with `$\hat A$` in between, and the next `$\hat A$` result is random again.

## 4. Expectation values and spreads

The average of many measurements on identically prepared systems is the **expectation value**, and its spread is the standard deviation:

```math
\langle A\rangle = \langle\psi|\hat A|\psi\rangle = \sum_a a\,P(a), \qquad (\Delta A)^2 = \langle A^2\rangle - \langle A\rangle^2
```

For an unnormalised ket divide by `$\langle\psi|\psi\rangle$`. In position space, `$\langle A\rangle = \int\psi^*\hat A\psi\,dx$`; for momentum it is safest to use `$\langle p^2\rangle = \hbar^2\int|\psi'|^2dx$`, which never misses the delta functions hidden in `$\psi''$` at a cusp.

**Worked example.** Energy levels `$E_1 = 1$`, `$E_2 = 3$`, `$E_3 = 5$` eV and `$|\psi\rangle = \tfrac13(2|1\rangle - |2\rangle + 2i|3\rangle)$`.

1. Probabilities `$\tfrac49, \tfrac19, \tfrac49$` (phases and signs drop out).
2. `$\langle E\rangle = (4 + 3 + 20)/9 = 3$` eV.
3. `$\langle E^2\rangle = (4 + 9 + 100)/9 = 12.56$` eV², so `$\Delta E = \sqrt{12.56 - 9} = 1.89$` eV.

<div class="problem" data-problem="energy-spread"></div>

## 5. Time evolution

For a time-independent `$\hat H$`, the Schrödinger equation is solved by the unitary operator `$\hat U(t) = e^{-i\hat Ht/\hbar}$`. Expand the initial state in energy eigenstates and each component just turns its phase:

```math
|\psi(t)\rangle = \sum_n c_n\,e^{-iE_nt/\hbar}|E_n\rangle
```

So `$|c_n|^2$`, the energy probabilities, never change, while other observables oscillate at the **Bohr frequencies** `$(E_m - E_n)/\hbar$`. A single energy eigenstate is stationary: nothing measurable moves.

**Worked example (two-level oscillation).** `$\hat H = \begin{pmatrix}3&1\\1&3\end{pmatrix}$` eV, starting in `$|1\rangle = (1,0)^T$`.

1. Eigenvalues `$4$` and `$2$` eV, eigenvectors `$(1, \pm1)/\sqrt2$`, so `$|1\rangle = (|+\rangle + |-\rangle)/\sqrt2$`.
2. `$P_2(t) = \sin^2\!\left(\dfrac{(E_+ - E_-)t}{2\hbar}\right) = \sin^2(t\cdot1\text{ eV}/\hbar)$`.
3. Full transfer first at `$t = \pi\hbar/(2\text{ eV}) = 1.03$` fs (with `$\hbar = 0.658$` eV fs). This is how a molecule's electron hops between two equivalent sites, and how a qubit is flipped.

Averages obey the **Ehrenfest theorem**: for any `$\hat Q$` without explicit time dependence,

```math
\frac{d\langle Q\rangle}{dt} = \frac{i}{\hbar}\langle[\hat H, \hat Q]\rangle \quad\Rightarrow\quad \frac{d\langle x\rangle}{dt} = \frac{\langle p\rangle}{m}, \qquad \frac{d\langle p\rangle}{dt} = -\left\langle\frac{dV}{dx}\right\rangle
```

So an observable that commutes with `$\hat H$` is conserved in every state. Applied to `$\hat Q = \hat x\hat p$` in a stationary state it gives the **virial theorem**, `$2\langle T\rangle = \langle x\,dV/dx\rangle$`: for `$V \propto x^n$`, `$\langle T\rangle = \tfrac n2\langle V\rangle$`.

The same physics can be put in the operators instead (the **Heisenberg picture**): `$\hat A_H(t) = \hat U^\dagger\hat A\hat U$` obeys `$d\hat A_H/dt = \tfrac{i}{\hbar}[\hat H, \hat A_H]$`, while the state stays fixed. Both pictures give identical predictions.

<div class="myth">

**"The result of a measurement is the expectation value."** No. Each result is an eigenvalue; `$\langle A\rangle$` is the average of many results and need not be a possible result at all. A spin-half particle with `$\langle S_z\rangle = 0$` always gives `$+\hbar/2$` or `$-\hbar/2$`.

**"After measuring a degenerate eigenvalue, the state jumps to one eigenvector."** It jumps to the projection of the old state onto the whole eigenspace. Information about the components inside that eigenspace survives the measurement.

</div>

<div class="keypoints">

- Kets `$|\psi\rangle = \sum c_n|n\rangle$`, bras with `$c_n^*$`; `$\psi(x) = \langle x|\psi\rangle$`; completeness `$\sum|n\rangle\langle n| = \hat 1$`.
- Hermitian `$\hat A = \hat A^\dagger$`: real eigenvalues, orthogonal eigenvectors, the observables. Unitary `$\hat U^\dagger\hat U = 1$`: eigenvalues `$e^{i\theta}$`, evolution and symmetries. `$(\hat A\hat B)^\dagger = \hat B^\dagger\hat A^\dagger$`.
- Results are eigenvalues; `$P(a) = \langle\psi|\hat P_a|\psi\rangle$`; collapse onto `$\hat P_a|\psi\rangle$` (whole eigenspace if degenerate).
- `$\langle A\rangle = \langle\psi|\hat A|\psi\rangle/\langle\psi|\psi\rangle$`, `$\Delta A^2 = \langle A^2\rangle - \langle A\rangle^2$`; use `$\langle p^2\rangle = \hbar^2\int|\psi'|^2$`.
- `$|\psi(t)\rangle = \sum c_ne^{-iE_nt/\hbar}|E_n\rangle$`: energy probabilities fixed, others oscillate at `$(E_m - E_n)/\hbar$`.
- Ehrenfest: `$d\langle Q\rangle/dt = \tfrac{i}{\hbar}\langle[H, Q]\rangle$`; virial `$\langle T\rangle = \tfrac n2\langle V\rangle$` for `$V \propto x^n$`.

</div>

## Practise: GATE questions on this lesson

They start easy and climb to top-rank level. Check each answer, then read the full solution. There are more on the [postulates practice page](/learn/courses/gate-physics/practice/postulates-operators/), and every topic is on the [GATE Physics practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="postulates-operators" data-exam="gate" data-n="10"></div>

**Next:** [lesson 4.2](/learn/courses/gate-physics/commutators-uncertainty/) turns `$[\hat x, \hat p] = i\hbar$` into the general uncertainty relation. For two-level systems in action, the [Quantum circuit simulator](/science/quantum-circuit/) lets you apply unitary gates to qubits and watch the probabilities. Back to the [GATE Physics course](/learn/courses/gate-physics/).
