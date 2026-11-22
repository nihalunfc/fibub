---
title: Group theory for physicists
summary: 'Groups, subgroups, classes and Lagrange''s theorem; the symmetric and dihedral groups; representations, characters and the orthogonality theorem; reducing a representation with a character table; Lie groups SO(N), SU(N) and their generators; SU(2) addition of angular momenta and SU(3) multiplets, at CSIR NET Part C level.'
minutes: 55
updated: 2026-11-22
quiz:
  - q: 'A group has 10 elements and 4 conjugacy classes. The dimensions of its irreducible representations are'
    choices: ['1, 1, 2, 2', '1, 1, 1, 1', '1, 3', '2, 2, 1, 1, 1, 1']
    ans: 0
    why: 'Four classes means four irreps, and their squared dimensions add to 10: 1 + 1 + 4 + 4 = 10. This is the dihedral group of the pentagon.'
  - q: 'How many generators does SU(3) have?'
    choices: ['3', '6', '8', '9']
    ans: 2
    why: 'SU(N) has N² − 1 generators: 9 − 1 = 8, the Gell-Mann matrices.'
  - q: 'The product 1 ⊗ 1 of two spin-1 representations of SU(2) decomposes as'
    choices: ['0 ⊕ 1 ⊕ 2', '1 ⊕ 1 ⊕ 1', '0 ⊕ 2', '2 ⊕ 2']
    ans: 0
    why: 'Total J runs from |1 − 1| = 0 to 1 + 1 = 2, each once. Dimensions 1 + 3 + 5 = 9 = 3 × 3.'
sources:
  - 'M. Tinkham, Group Theory and Quantum Mechanics (1964; Dover 2003), chapters 1 to 4'
  - 'H. Georgi, Lie Algebras in Particle Physics, 2nd ed. (1999), chapters 1 to 7'
  - 'G. B. Arfken, H. J. Weber and F. E. Harris, Mathematical Methods for Physicists, 7th ed. (2013), chapter 17'
  - 'CSIR-UGC NET Physical Sciences syllabus, Part B and C, Mathematical Methods of Physics'
---

**Module 2 · about 55 minutes.** By the end you will be able to check the group axioms, find orders, subgroups and conjugacy classes, read and use a character table to reduce any representation, count the generators of the classical Lie groups, and decompose products of SU(2) and SU(3) representations. NET asks this in Part C almost every year, usually as one or two quick but tricky questions.

You should be comfortable with matrices, eigenvalues and unitary transformations ([GATE lesson on Hermitian and unitary matrices](/learn/courses/gate-physics/matrices-eigenvalues/), [linear vector spaces](/learn/courses/gate-physics/linear-vector-spaces/)) and with angular momentum addition ([GATE angular momentum](/learn/courses/gate-physics/angular-momentum/)).

<div class="bigidea">A symmetry is something you can do to a system that leaves it looking the same. The set of all such operations always forms a group, and the group alone fixes the degeneracies, selection rules and multiplets of the physics, before you solve any equation.</div>

## 1. What a group is

A **group** is a set `$G$` with a product that obeys four rules:

| Rule | Meaning |
|---|---|
| closure | `$a, b \in G \Rightarrow ab \in G$` |
| associativity | `$(ab)c = a(bc)$` |
| identity | there is an `$e$` with `$ea = ae = a$` |
| inverse | every `$a$` has an `$a^{-1}$` with `$aa^{-1} = e$` |

The product need not commute. If `$ab = ba$` for all elements the group is **abelian**. The number of elements is the **order** `$|G|$`; the **order of an element** `$g$` is the smallest `$n$` with `$g^n = e$`.

Examples you will meet: the integers under addition (infinite, abelian); `$\mathbb Z_n$`, the integers mod `$n$` (cyclic, abelian); the **symmetric group** `$S_n$` of all `$n!$` permutations; the **dihedral group** `$D_n$` of `$2n$` symmetries of a regular `$n$`-gon; rotation groups `$SO(3)$`, `$SU(2)$`.

**Worked example.** In `$\mathbb Z_{12}$` the element 8 has order `$12/\gcd(8, 12) = 3$`: `$8, 16 \equiv 4, 24 \equiv 0$`. The integers under multiplication are not a group: 2 has no integer inverse.

<div class="problem" data-problem="su2-product"></div>

## 2. Subgroups, cosets and Lagrange's theorem

A **subgroup** `$H$` is a subset that is itself a group. Its left cosets `$gH$` split `$G$` into pieces of equal size, which proves **Lagrange's theorem**:

```math
|H| \text{ divides } |G|
```

So a group of prime order has no subgroups except `$\{e\}$` and itself, and is cyclic. The order of every element divides `$|G|$`. Careful: the converse fails; `$A_4$` (order 12) has no subgroup of order 6.

**Conjugacy classes.** Elements `$a$` and `$b$` are conjugate if `$b = gag^{-1}$` for some `$g$`. Conjugate elements are "the same kind of operation seen from a different angle": all rotations by `$120°$` in a triangle, all reflections. In an abelian group every element is its own class. In `$S_n$` the classes are exactly the cycle types.

A subgroup made of whole classes is **normal**; then the cosets form a group of their own, the quotient `$G/H$`. A **homomorphism** `$\phi: G \to G'$` keeps products, `$\phi(ab) = \phi(a)\phi(b)$`; its kernel is a normal subgroup and `$|G|/|\ker\phi| = |\mathrm{image}|$`.

<figure class="fig" data-fig="triangle-symmetry"><figcaption>The six symmetry operations of an equilateral triangle form the group C<sub>3v</sub>, the same as S<sub>3</sub>. Choose h, then g: the triangle shows where each corner ends up after doing h first and g second, and the multiplication table highlights the product. Try two different mirrors in both orders: the answers differ, so the group is not abelian.</figcaption></figure>

**Worked example: the classes of `$C_{3v}$`.** Elements: `$E$`, rotations `$C_3, C_3^2$`, mirrors `$\sigma_1, \sigma_2, \sigma_3$`. A mirror conjugates `$C_3$` into `$C_3^2$` (it reverses the sense of rotation), and a rotation carries one mirror line onto another. So the classes are `$\{E\}$`, `$\{C_3, C_3^2\}$`, `$\{\sigma_1, \sigma_2, \sigma_3\}$`: three classes of sizes 1, 2, 3.

## 3. Representations and characters

A **representation** assigns a matrix `$D(g)$` to each element so that `$D(g)D(h) = D(gh)$`. It is **reducible** if a change of basis puts all the matrices in the same block-diagonal form; otherwise it is **irreducible** (an irrep). The **character** is the trace, `$\chi(g) = \mathrm{tr}\,D(g)$`. Since the trace does not change under `$D \to SDS^{-1}$`, all elements of a class share a character.

For a finite group, the great orthogonality theorem gives four facts that answer most exam questions:

```math
\#\text{irreps} = \#\text{classes}, \qquad \sum_i d_i^2 = |G|, \qquad d_i \mid |G|, \qquad \frac{1}{|G|}\sum_k N_k\,\chi_i(C_k)^*\chi_j(C_k) = \delta_{ij}
```

where `$N_k$` is the number of elements in class `$C_k$`.

<div class="meaning">

<dl>
<dt>d<sub>i</sub></dt><dd>the dimension of irrep i: the degeneracy of a level that transforms like it</dd>
<dt>χ<sub>i</sub>(C<sub>k</sub>)</dt><dd>the character of irrep i on class k; χ(E) = d<sub>i</sub></dd>
<dt>N<sub>k</sub></dt><dd>the number of elements in class k (weight it in every sum over classes)</dd>
<dt>n<sub>i</sub></dt><dd>how many times irrep i appears in a reducible representation</dd>
<dt>Physical meaning</dt><dd>If a Hamiltonian is unchanged by a group, its eigenstates fall into irreps: each energy level is d<sub>i</sub>-fold degenerate (unless an accident happens). Breaking the symmetry splits levels according to how the irreps of the big group break into irreps of the smaller one.</dd>
</dl>

</div>

The character table of `$C_{3v}$`:

| | `$E$` | `$2C_3$` | `$3\sigma_v$` |
|---|---|---|---|
| `$A_1$` | 1 | 1 | 1 |
| `$A_2$` | 1 | 1 | `$-1$` |
| `$E$` | 2 | `$-1$` | 0 |

Check: three classes, three irreps, `$1 + 1 + 4 = 6$`. The 2-dimensional irrep is the plane itself: a rotation by `$120°$` has trace `$2\cos120° = -1$`, a mirror has eigenvalues `$\pm1$` and trace 0.

## 4. Reducing a representation

The orthogonality relation gives the number of times irrep `$i$` appears in a representation with characters `$\chi$`:

```math
n_i = \frac{1}{|G|}\sum_k N_k\,\chi(C_k)\,\chi_i(C_k)^*
```

**Worked example.** The three corners of a triangle are permuted by `$C_{3v}$`. A permutation matrix has trace equal to the number of points left in place: `$\chi = (3, 0, 1)$`. Then

<div class="steps">
<div class="step"><p><b>A₁.</b> n = (1/6)(1·3·1 + 2·0·1 + 3·1·1) = 6/6 = 1.</p></div>
<div class="step"><p><b>A₂.</b> n = (1/6)(3 + 0 − 3) = 0.</p></div>
<div class="step"><p><b>E.</b> n = (1/6)(1·3·2 + 2·0·(−1) + 3·1·0) = 6/6 = 1.</p></div>
<div class="step"><p><b>Answer.</b> Γ = A₁ ⊕ E. Dimension check: 1 + 2 = 3. Three equivalent orbitals on a triangle give one symmetric combination and a degenerate pair.</p></div>
</div>

Products of representations have characters that multiply: `$\chi_{E\otimes E} = (4, 1, 0)$`, which reduces to `$A_1\oplus A_2\oplus E$`. This is how selection rules are found: a matrix element `$\langle f|\hat O|i\rangle$` can be non-zero only if `$\Gamma_f\otimes\Gamma_O\otimes\Gamma_i$` contains `$A_1$`.

<div class="problem" data-problem="c3v-reduce"></div>

<div class="myth">

**"The character table tells you the group."** It does not. The dihedral group `$D_4$` and the quaternion group `$Q_8$` have identical character tables (five classes, irreps 1, 1, 1, 1, 2) but different structure: `$Q_8$` has one element of order 2, `$D_4$` has five. Another trap: weighting every class equally when you reduce a representation. Forgetting the class sizes `$N_k$` almost always gives a fraction, which is a useful alarm.

</div>

## 5. Lie groups and generators

Continuous groups such as rotations are **Lie groups**. Near the identity every element is `$e^{-i\theta_aT_a}$`, with Hermitian **generators** `$T_a$` closing under commutators,

```math
[T_a, T_b] = if_{abc}T_c
```

with structure constants `$f_{abc}$`. The number of generators is the dimension of the group; the number that commute with each other is its **rank**.

| Group | Matrices | Generators | Rank |
|---|---|---|---|
| `$U(N)$` | unitary | `$N^2$` | `$N$` |
| `$SU(N)$` | unitary, det 1 | `$N^2 - 1$` | `$N - 1$` |
| `$SO(N)$` | real orthogonal, det 1 | `$N(N-1)/2$` | `$\lfloor N/2\rfloor$` |
| Lorentz `$SO(3,1)$` | | 6 (3 rotations, 3 boosts) | 2 |
| Poincaré | | 10 (adds 4 translations) | |

`$SU(2)$` and `$SO(3)$` have the same algebra, `$[J_i, J_j] = i\epsilon_{ijk}J_k$`, but `$SU(2)$` covers `$SO(3)$` twice: `$U$` and `$-U$` give the same rotation. So half-integer spins are honest representations of `$SU(2)$` but change sign under a `$2\pi$` rotation in `$SO(3)$`. The centre of `$SU(N)$` is `$\mathbb Z_N$`.

**Worked example.** With `$T_a = \sigma_a/2$`: `$\sigma_1\sigma_2 = i\sigma_3$`, so `$[T_1, T_2] = \tfrac14\cdot2i\sigma_3 = iT_3$`. In the vector representation, `$(J_k)_{ij} = -i\epsilon_{kij}$` and `$J^2 = 2I = j(j+1)I$` with `$j = 1$`.

## 6. Multiplets: SU(2) and SU(3)

Irreps of `$SU(2)$` are labelled by `$j = 0, \tfrac12, 1, \dots$` with dimension `$2j + 1$`. Products decompose as

```math
j_1\otimes j_2 = |j_1 - j_2| \oplus (|j_1 - j_2| + 1) \oplus \dots \oplus (j_1 + j_2)
```

with `$2\min(j_1, j_2) + 1$` pieces. Always check that the dimensions add up to `$(2j_1 + 1)(2j_2 + 1)$`.

For `$SU(3)$` (quark flavour or colour), the fundamental `$3$` and its conjugate `$\bar3$` combine as

```math
3\otimes\bar3 = 8\oplus1, \qquad 3\otimes3 = 6\oplus\bar3, \qquad 3\otimes3\otimes3 = 10\oplus8\oplus8\oplus1
```

Mesons fill the octet and singlet; baryons the decuplet and octets. A general irrep with Dynkin labels `$(p, q)$` has dimension `$\tfrac12(p+1)(q+1)(p+q+2)$`.

**Worked example.** Three spin-1 particles: `$1\otimes1 = 0\oplus1\oplus2$`, and combining each with the third spin-1 gives one `$j = 0$`, three `$j = 1$`, two `$j = 2$` and one `$j = 3$`. Check: `$1 + 9 + 10 + 7 = 27 = 3^3$`.

<div class="keypoints">

- Group axioms: closure, associativity, identity, inverses. Abelian means all products commute.
- Lagrange: subgroup orders divide `$|G|$`; prime order means cyclic. Order of `$k$` in `$\mathbb Z_N$` is `$N/\gcd(k, N)$`.
- Classes: conjugate elements; in `$S_n$`, cycle types; in `$D_n$`, `$(n+3)/2$` classes for odd `$n$`, `$(n+6)/2$` for even `$n$`.
- Irreps: number = number of classes; `$\sum d_i^2 = |G|$`; `$d_i$` divides `$|G|$`.
- Reduce with `$n_i = \frac{1}{|G|}\sum_k N_k\chi(C_k)\chi_i(C_k)^*$`; product characters multiply.
- `$SU(N)$`: `$N^2 - 1$` generators, rank `$N - 1$`; `$SO(N)$`: `$N(N-1)/2$`. `$SU(2)$` double-covers `$SO(3)$`.
- `$j_1\otimes j_2$`: `$j$` from `$|j_1 - j_2|$` to `$j_1 + j_2$`. `$3\otimes\bar3 = 8\oplus1$`, `$3\otimes3 = 6\oplus\bar3$`.

</div>

## Practise: exam questions on this lesson

They start easy and climb to top-rank level, in NET style. More on the [practice page](/learn/courses/csir-net-physics/practice/).

<div class="qbank" data-bank="physics" data-topics="group-theory" data-exam="net" data-n="10"></div>

**Next:** lesson 2.3, [random variables and probability distributions](/learn/courses/csir-net-physics/probability-distributions/). For angular momentum in quantum mechanics, see the [GATE angular momentum lesson](/learn/courses/gate-physics/angular-momentum/) and [LS and jj coupling](/learn/courses/gate-physics/ls-jj-coupling/).
