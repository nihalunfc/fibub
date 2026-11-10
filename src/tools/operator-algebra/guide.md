---
name: Operator algebra helper
num: 929
shelf: science
code: T664
section: quantum-mechanics
title: "Commutator and operator algebra helper: Pauli, spin, ladder operators, commutators and eigenvalues"
summary: "Work with quantum operators as matrices: Pauli matrices, spin-j angular momentum (Jx, Jy, Jz, J±, J²) up to j = 5, two spin-½ particles, and the truncated harmonic oscillator (a, a†, n, x, p). Type any expression with products, powers, commutators, anticommutators and daggers, and get the matrix, whether it is Hermitian or unitary, its eigenvalues, trace and determinant, and a check against what you expect."
status: live
ads: true
order: 7
icon: sigma
works: offline
updated: 2026-11-09
related: [bloch-sphere, perturbation-theory, quantum-circuit, hydrogen-orbitals, matrix-calculator, symbolic-algebra, schrodinger-solver]
sources:
  - "Angular momentum matrices (with ⟨j, m ± 1|J±|j, m⟩ = √(j(j+1) − m(m±1))), Pauli matrices and harmonic oscillator ladder operators: standard textbook results, for example Sakurai, J. J. and Napolitano, J., Modern Quantum Mechanics."
  - "Checked against NumPy (numpy.linalg.eigvals, eigvalsh, det and direct matrix products) written for the tests."
flow:
  - { icon: sliders, label: "Space" }
  - { icon: pencil, label: "Expression" }
  - { icon: table, label: "Matrix" }
  - { icon: check, label: "Check" }
---

## What it does

Much of quantum mechanics is the algebra of operators: [Jx, Jy] = iħJz, {σx, σy} = 0, [a, a†] = 1. Checking such relations by hand means multiplying matrices, which is slow and easy to get wrong. This helper builds the standard operators as matrices, evaluates any expression you type, and tells you what the result is.

Choose a **space**:

- **Spin j** from ½ to 5: Jx, Jy, Jz, Jp (J₊), Jm (J₋), J2 (J²) and the identity I, in the basis m = j, j − 1, …, −j. For spin ½ there are also the Pauli matrices X, Y, Z and the Hadamard H.
- **Two spins ½:** Pauli matrices on each spin (X1, Y1, Z1, X2, Y2, Z2), spin operators Sx1 … Sz2, the total S2 and SWAP.
- **Harmonic oscillator** cut off after N states: a, ad (a†), n, x, p and H = n + ½, with ħ = m = ω = 1.

Watch a spin-½ state move under these operators on the [[bloch-sphere|Bloch sphere]], and use your matrices as perturbations in the [[perturbation-theory|perturbation theory checker]].

## How to use it

1. Pick the space (and N for the oscillator).
2. Type an expression. Products are A*B or just A B, powers A^2, commutators [A, B], anticommutators {A, B}, the adjoint A' or dag(A). Numbers, i, pi, sqrt(…), tr(…) and det(…) work too. A number added to an operator counts as that number times the identity, as physicists write it.
3. Optionally type what you expect in **Check that it equals**, for example i*Jz.
4. Tap one of the ready-made examples to start.

## What the results mean

- The headline names the result when it is zero, a multiple of the identity, or a multiple of a named operator (so [Jx, Jy] comes out as **i Jz**).
- **Kind:** Hermitian operators are observables with real eigenvalues; anti-Hermitian ones are i times an observable (every commutator of two observables is one); unitary ones keep lengths, as time evolution and quantum gates must.
- **Eigenvalues** with their multiplicities, the trace and the determinant.
- **Check:** whether your expected answer matches, with the largest difference between entries.

## Worked example

The page opens on spin ½ with [Jx, Jy]. The result is **[Jx, Jy] = i Jz**: anti-Hermitian, eigenvalues −0.5i and 0.5i, trace 0, and the check "equal to i*Jz" passes. Switch to spin 3/2 and type J2: the headline reads **J2 = 3.75 I**, j(j + 1) = 15/4, with the eigenvalue 3.75 four times. In the oscillator with N = 6, [x, p] compared with i says **not equal**: the matrix is i on the diagonal except −5i in the last place, because cutting off the states breaks the relation at the top.

## FAQ

**Why is ħ missing?** Everything is in units with ħ = 1, the usual choice; put it back by counting powers of J.

**Are the eigenvalues exact?** To about twelve figures. For matrices that cannot be diagonalised, such as a truncated a, repeated eigenvalues are less accurate, and the page says so. It is for study and checking, not a substitute for professional judgement.

**Does anything get uploaded?** No. All the algebra happens in your browser.
