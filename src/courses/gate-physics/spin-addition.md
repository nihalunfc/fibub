---
title: 'Spin and the addition of angular momenta'
summary: 'Spin ½ the GATE way: Pauli matrices and their algebra, spin states along any direction, Stern-Gerlach sequences, rotations by 2π, spin precession, then adding angular momenta: allowed j values and state counting, singlet and triplet, S₁·S₂ and L·S, Clebsch-Gordan coefficients by lowering, and the projection theorem.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'Two spin-½ particles are in |↑↓⟩. What is the probability that a measurement of the total S² gives 2ħ²?'
    choices: ['½', '1', '0', '¼']
    ans: 0
    why: '|↑↓⟩ = (|1,0⟩ + |0,0⟩)/√2, an equal mixture of the triplet (S = 1, S² = 2ħ²) and the singlet (S² = 0).'
  - q: 'What is the eigenvalue of L·S for an electron with l = 1 in the j = 3/2 state?'
    choices: ['ħ²/2', '−ħ²', '3ħ²/2', '0']
    ans: 0
    why: 'L·S = ½[j(j+1) − l(l+1) − s(s+1)]ħ² = ½[15/4 − 2 − 3/4]ħ² = ½ħ².'
  - q: 'A spin-½ particle has spin up along an axis at 90° to z. What is the chance that S_z = +ħ/2?'
    choices: ['½', '1', '0', '¼']
    ans: 0
    why: 'P = cos²(θ/2) = cos²45° = ½. Spin-½ amplitudes depend on half the angle between the axes.'
sources:
  - 'J. J. Sakurai and J. Napolitano, Modern Quantum Mechanics, 3rd ed. (2021), chapter 1 (Stern-Gerlach) and sections 3.2 and 3.8: spin ½ and addition of angular momenta'
  - 'D. J. Griffiths and D. F. Schroeter, Introduction to Quantum Mechanics, 3rd ed. (2018), section 4.4: spin'
  - 'R. Shankar, Principles of Quantum Mechanics, 2nd ed. (1994), chapters 14 and 15'
  - 'GATE Physics (PH) syllabus, quantum mechanics section, published by the organising institute each year'
---

**Module 4 · about 55 minutes.** By the end you will be able to work with Pauli matrices, write the spin state along any direction, predict Stern-Gerlach sequences, add two angular momenta (finding the allowed totals, the singlet and triplet, `$\vec S_1\cdot\vec S_2$` and `$\vec L\cdot\vec S$`), build Clebsch-Gordan coefficients by lowering, and use the projection theorem. The algebra of `$J_\pm$` is the one from [lesson 4.5](/learn/courses/gate-physics/angular-momentum/); the electron's spin in atoms appears again in [lesson 4.6](/learn/courses/gate-physics/hydrogen-atom/) (degeneracy `$2n^2$`).

<div class="bigidea">Spin is angular momentum with no orbit: the same commutation relations, but allowing half-integer j. Two angular momenta add like vectors that can only take quantised lengths, and the coupled states are fixed combinations of product states whose weights, the Clebsch-Gordan coefficients, come from lowering the top state.</div>

## 1. Spin ½ and the Pauli matrices

Spin obeys `$[S_i, S_j] = i\hbar\epsilon_{ijk}S_k$`. For `$s = \tfrac12$` the space is two-dimensional, with basis `$|{\uparrow}\rangle, |{\downarrow}\rangle$` (`$S_z = \pm\hbar/2$`), and `$\vec S = \tfrac\hbar2\vec\sigma$`:

```math
\sigma_x = \begin{pmatrix}0&1\\1&0\end{pmatrix}, \quad \sigma_y = \begin{pmatrix}0&-i\\i&0\end{pmatrix}, \quad \sigma_z = \begin{pmatrix}1&0\\0&-1\end{pmatrix}, \qquad \sigma_i\sigma_j = \delta_{ij} + i\epsilon_{ijk}\sigma_k
```

Each is Hermitian, traceless and squares to 1 (eigenvalues `$\pm1$`, determinant `$-1$`). Two consequences used constantly: `$(\vec\sigma\cdot\vec a)(\vec\sigma\cdot\vec b) = \vec a\cdot\vec b + i\vec\sigma\cdot(\vec a\times\vec b)$` and `$e^{i\alpha\,\hat n\cdot\vec\sigma} = \cos\alpha + i\,\hat n\cdot\vec\sigma\sin\alpha$`. The magnitude `$|\vec S| = \sqrt{s(s+1)}\,\hbar = \tfrac{\sqrt3}{2}\hbar$` is larger than any component.

**Spin along any direction.** The eigenstate of `$\hat n\cdot\vec\sigma$` with eigenvalue `$+1$`, for `$\hat n$` at polar angles `$(\theta, \phi)$`, is

```math
|{+}\hat n\rangle = \cos\frac\theta2\,|{\uparrow}\rangle + e^{i\phi}\sin\frac\theta2\,|{\downarrow}\rangle
```

So a spin prepared along `$\hat n$` gives `$S_z = +\hbar/2$` with probability `$\cos^2(\theta/2)$`: half angles. Every pure spin-½ state points along some direction (a point on the [Bloch sphere](/science/bloch-sphere/)), and `$\langle\vec\sigma\rangle = \hat n$`.

**Worked example.** For `$\tfrac15(3|{\uparrow}\rangle + 4|{\downarrow}\rangle)$`: `$\langle\sigma_z\rangle = \tfrac{9 - 16}{25} = -0.28$`, `$\langle\sigma_x\rangle = 2\,\mathrm{Re}(a^*b) = 0.96$`, `$\langle\sigma_y\rangle = 0$`. The vector `$(0.96, 0, -0.28)$` has length 1: a pure state pointing just below the `$x$`-axis. Replace 4 by `$4i$` and the spin turns into the `$yz$`-plane, with `$P(S_x = +\hbar/2) = |3 + 4i|^2/50 = \tfrac12$`.

**Stern-Gerlach sequences.** A filter keeps one outcome and the state collapses to it. Spin up along `$z$`, then a filter along an axis at `$60^\circ$` (passes `$\cos^230^\circ = \tfrac34$`), then a `$z$`-down filter (passes `$\sin^230^\circ = \tfrac14$`): `$\tfrac{3}{16}$` of the atoms come out, although none would without the middle filter.

**Rotations and precession.** `$e^{-i\alpha\hat n\cdot\vec S/\hbar} = \cos\tfrac\alpha2 - i\hat n\cdot\vec\sigma\sin\tfrac\alpha2$` rotates a spin state; at `$\alpha = 2\pi$` it is `$-1$`, so spinors need `$4\pi$` to come back. In a field `$B\hat z$`, an electron (`$g = 2$`) has `$H = \tfrac{eB}{m}S_z$` and its spin precesses at `$\omega = eB/m$`, 28.0 GHz per tesla.

## 2. Adding two angular momenta

Combine `$\vec J = \vec J_1 + \vec J_2$` (two spins, or `$\vec L$` and `$\vec S$`). The product basis `$|j_1m_1\rangle|j_2m_2\rangle$` diagonalises `$J_{1z}, J_{2z}$`; the coupled basis `$|j\,m\rangle$` diagonalises `$J^2$` and `$J_z$` (with `$J_1^2$`, `$J_2^2$`). Both span the same `$(2j_1 + 1)(2j_2 + 1)$`-dimensional space.

```math
j = |j_1 - j_2|, \ |j_1 - j_2| + 1, \ \dots, \ j_1 + j_2, \qquad m = m_1 + m_2, \qquad \sum_j(2j + 1) = (2j_1 + 1)(2j_2 + 1)
```

**Two spin ½.** `$\tfrac12\otimes\tfrac12 = 1\oplus0$`:

```math
|1,1\rangle = |{\uparrow\uparrow}\rangle, \quad |1,0\rangle = \frac{|{\uparrow\downarrow}\rangle + |{\downarrow\uparrow}\rangle}{\sqrt2}, \quad |1,-1\rangle = |{\downarrow\downarrow}\rangle, \qquad |0,0\rangle = \frac{|{\uparrow\downarrow}\rangle - |{\downarrow\uparrow}\rangle}{\sqrt2}
```

The triplet is symmetric under exchange, the singlet antisymmetric. Since `$\vec S_1\cdot\vec S_2 = \tfrac12(S^2 - S_1^2 - S_2^2)$`, it equals `$+\tfrac14\hbar^2$` on the triplet and `$-\tfrac34\hbar^2$` on the singlet; so `$\vec\sigma_1\cdot\vec\sigma_2 = +1$` or `$-3$`, and the exchange operator is `$\tfrac12(1 + \vec\sigma_1\cdot\vec\sigma_2)$`. A coupling `$A\vec S_1\cdot\vec S_2$` splits singlet from triplet by `$A\hbar^2$` (the hydrogen 21 cm line).

**Worked example.** Two electrons start in `$|{\uparrow\downarrow}\rangle = (|1,0\rangle + |0,0\rangle)/\sqrt2$` under `$H = J\vec\sigma_1\cdot\vec\sigma_2$` (energies `$+J$` and `$-3J$`). The relative phase grows as `$4Jt/\hbar$`, so `$P(|{\downarrow\uparrow}\rangle) = \sin^2(2Jt/\hbar)$`: the spins swap completely at `$Jt/\hbar = \pi/4$`, the exchange gate of spin qubits.

**Three spins.** `$\tfrac12\otimes\tfrac12\otimes\tfrac12 = \tfrac32\oplus\tfrac12\oplus\tfrac12$` (`$4 + 2 + 2 = 8$` states). For two equal spins `$j$`, the coupled multiplet `$J$` has exchange symmetry `$(-1)^{2j - J}$`: for two spin-1 particles `$J = 2, 0$` are symmetric and `$J = 1$` antisymmetric.

## 3. Clebsch-Gordan coefficients by lowering

The coupled states are `$|j\,m\rangle = \sum\langle j_1m_1; j_2m_2|j\,m\rangle\,|j_1m_1\rangle|j_2m_2\rangle$`. You rarely need tables: build them.

<div class="steps">
<div class="step">

**Start at the top.** Only one product state has `$m = j_1 + j_2$`, so `$|j_1 + j_2, j_1 + j_2\rangle = |j_1j_1\rangle|j_2j_2\rangle$`. For `$l = 1$`, `$s = \tfrac12$`: `$|\tfrac32, \tfrac32\rangle = |1, 1\rangle|{\uparrow}\rangle$`.

</div>
<div class="step">

**Lower both sides.** `$J_- = L_- + S_-$`. Left: `$J_-|\tfrac32,\tfrac32\rangle = \sqrt3\,\hbar|\tfrac32,\tfrac12\rangle$`. Right: `$L_-|1,1\rangle|{\uparrow}\rangle + |1,1\rangle S_-|{\uparrow}\rangle = \sqrt2\hbar|1,0\rangle|{\uparrow}\rangle + \hbar|1,1\rangle|{\downarrow}\rangle$`.

</div>
<div class="step">

**Read off.** `$|\tfrac32,\tfrac12\rangle = \sqrt{\tfrac23}\,|1,0\rangle|{\uparrow}\rangle + \sqrt{\tfrac13}\,|1,1\rangle|{\downarrow}\rangle$`. Keep lowering for `$m = -\tfrac12, -\tfrac32$`.

</div>
<div class="step">

**The other multiplet is orthogonal.** The `$j = \tfrac12$` state with the same `$m$` uses the same two product states and must be orthogonal: `$|\tfrac12,\tfrac12\rangle = \sqrt{\tfrac13}\,|1,0\rangle|{\uparrow}\rangle - \sqrt{\tfrac23}\,|1,1\rangle|{\downarrow}\rangle$` (the overall sign is a convention).

</div>
</div>

For any `$l$` with spin ½ the pattern is general:

```math
\left|l \pm \tfrac12, m\right\rangle = \pm\sqrt{\frac{l \pm m + \frac12}{2l + 1}}\,\left|m - \tfrac12\right\rangle|{\uparrow}\rangle + \sqrt{\frac{l \mp m + \frac12}{2l + 1}}\,\left|m + \tfrac12\right\rangle|{\downarrow}\rangle
```

<div class="meaning">

<dl>
<dt>m = m₁ + m₂</dt><dd>a coupled state only mixes product states with the same total z component</dd>
<dt>|CG|²</dt><dd>the probabilities of the separate values m_l and m_s when J², J_z are known</dd>
<dt>L·S = ½[j(j+1) − l(l+1) − ¾]ħ²</dt><dd>l/2 for j = l + ½ and −(l + 1)/2 for j = l − ½: the spin-orbit pattern</dd>
<dt>projection theorem</dt><dd>⟨S_z⟩ = m⟨S·J⟩/j(j+1): in a state of definite j, any vector averages to its component along J</dd>
<dt>Physical meaning</dt><dd>In the vector model L and S precess around J, which precesses around z. Only J_z is sharp; L_z and S_z have spreads, and the CG weights say how often each value turns up.</dd>
</dl>

</div>

<figure class="fig" data-fig="spin-coupling"><figcaption>Choose l, j and m. The vector model adds L and S to J on its cone; the bars are the Clebsch-Gordan probabilities of m_s = +½ and −½. Note how the j = l − ½ states have their spin mostly opposite to J.</figcaption></figure>

**Worked example.** In `$|j = \tfrac32, m = \tfrac12\rangle$` from `$l = 1$`: `$\langle S_z\rangle = \tfrac23\cdot\tfrac12 - \tfrac13\cdot\tfrac12 = \tfrac16\hbar$` and `$\langle L_z\rangle = \tfrac13\hbar$`; together `$\tfrac12\hbar = m\hbar$`. The projection theorem agrees: `$\vec S\cdot\vec J = \tfrac12(J^2 + S^2 - L^2) = \tfrac12(\tfrac{15}{4} + \tfrac34 - 2)\hbar^2 = \tfrac54\hbar^2$`, so `$\langle S_z\rangle = \tfrac12\cdot\tfrac{5/4}{15/4}\hbar = \tfrac16\hbar$`. The magnetic moment `$\langle L_z + 2S_z\rangle = \tfrac23\hbar$` gives the Landé factor `$g_j = \tfrac43$` used in the Zeeman effect (module 6).

**Worked example.** Spin-orbit coupling `$\xi\vec L\cdot\vec S$` for `$l = 2$`: `$j = \tfrac52$` moves by `$+\xi\hbar^2$` (6 states) and `$j = \tfrac32$` by `$-\tfrac32\xi\hbar^2$` (4 states). Splitting `$\tfrac52\xi\hbar^2 = \tfrac{2l + 1}{2}\xi\hbar^2$`; the weighted mean shift `$6(1) + 4(-\tfrac32) = 0$`.

<div class="problem" data-problem="cg-spin-up"></div>

<div class="myth">

**"|↑↓⟩ has total spin zero because the spins point opposite ways."** It has `$M = 0$`, but it is half triplet and half singlet. Only the antisymmetric combination is the singlet.

**"In the j = l + ½ state, m_s = +½ for sure."** Only the top state `$m = j$` is a single product state. For other `$m$` both spin values occur, with the CG weights above.

</div>

<div class="keypoints">

- `$\vec S = \tfrac\hbar2\vec\sigma$`; `$\sigma_i\sigma_j = \delta_{ij} + i\epsilon_{ijk}\sigma_k$`; `$e^{i\alpha\hat n\cdot\vec\sigma} = \cos\alpha + i\hat n\cdot\vec\sigma\sin\alpha$`; `$2\pi$` rotation gives `$-1$`.
- `$|{+}\hat n\rangle = \cos\tfrac\theta2|{\uparrow}\rangle + e^{i\phi}\sin\tfrac\theta2|{\downarrow}\rangle$`; `$\langle\sigma_x\rangle = 2\,\mathrm{Re}(a^*b)$`.
- `$j$` from `$|j_1 - j_2|$` to `$j_1 + j_2$`; `$m = m_1 + m_2$`; dimensions match.
- Triplet (symmetric) `$\vec S_1\cdot\vec S_2 = \tfrac14\hbar^2$`; singlet (antisymmetric) `$-\tfrac34\hbar^2$`; `$P_{12} = \tfrac12(1 + \vec\sigma_1\cdot\vec\sigma_2)$`.
- `$\vec L\cdot\vec S = \tfrac12[j(j+1) - l(l+1) - \tfrac34]\hbar^2$`; CG weights `$(l \pm m + \tfrac12)/(2l + 1)$` for `$j = l \pm \tfrac12$`.
- Projection theorem: `$\langle\vec V\rangle = \langle\vec V\cdot\vec J\rangle\langle\vec J\rangle/j(j+1)\hbar^2$` within one `$j$`.

</div>

## Practise: GATE questions on this lesson

They start easy and climb to top-rank level. More on the [spin addition practice page](/learn/courses/gate-physics/practice/spin-addition/) and the [GATE Physics practice page](/learn/courses/gate-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="spin-addition" data-exam="gate" data-n="10"></div>

**Next:** [lesson 4.8](/learn/courses/gate-physics/perturbation-theory/) treats small extra terms, such as spin-orbit coupling or an external field, by perturbation theory. Back to the [GATE Physics course](/learn/courses/gate-physics/).
