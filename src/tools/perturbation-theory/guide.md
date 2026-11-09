---
name: Perturbation theory checker
num: 928
shelf: science
section: quantum-mechanics
title: "Perturbation theory checker: first, second and third order corrections against exact diagonalisation"
summary: "Type or paste a Hamiltonian H₀ and a perturbation V as matrices (real or complex, up to 40 × 40), choose λ, and get every level's first, second and third order corrections, degenerate levels included, side by side with the exact eigenvalues of H₀ + λV, a convergence warning and a plot of the exact levels against the second-order curves."
status: live
ads: true
order: 6
icon: sigma
works: offline
updated: 2026-11-09
related: [schrodinger-solver, huckel-mo-calculator, quantum-circuit]
sources:
  - "Rayleigh–Schrödinger perturbation theory, non-degenerate (to third order) and degenerate (first order and the second-order effective Hamiltonian): standard textbook results, for example Sakurai, J. J. and Napolitano, J., Modern Quantum Mechanics, and Griffiths, D. J., Introduction to Quantum Mechanics."
  - "Anharmonic oscillator series 1/2 + 3λ/4 − 21λ²/8 + 333λ³/16: Bender, C. M. and Wu, T. T. (1969), Physical Review 184, 1231 (a textbook result, used only as a check)."
  - "Checked against NumPy (numpy.linalg.eigvalsh, eigvals, direct sums and polynomial fits of exact eigenvalues) written for the tests."
  - "The example matrices are made up, except the oscillator, which is built from x = (a + a†)/√2."
flow:
  - { icon: table, label: "H₀ and V" }
  - { icon: sigma, label: "Orders" }
  - { icon: calculator, label: "Exact" }
  - { icon: chart, label: "Compare" }
---

## What it does

Perturbation theory is the workhorse approximation of quantum mechanics: when a Hamiltonian is a solvable part H₀ plus a small extra piece λV, the energies can be written as a series E = E⁽⁰⁾ + λE⁽¹⁾ + λ²E⁽²⁾ + λ³E⁽³⁾ + … . Homework and exams ask for the first and second order terms; this tool computes them for any matrices, and shows how good they are by diagonalising H₀ + λV exactly.

For a non-degenerate level n (in the eigenbasis of H₀):

- **First order:** E⁽¹⁾ = V_nn, the average of the perturbation in the unperturbed state.
- **Second order:** E⁽²⁾ = Σ_m |V_mn|² / (E_n − E_m), which always pushes the lowest level down.
- **Third order:** E⁽³⁾ = Σ_k,m V_nk V_km V_mn / ((E_n − E_k)(E_n − E_m)) − V_nn Σ_m |V_mn|² / (E_n − E_m)².

When several levels of H₀ are equal (**degenerate**), these formulas divide by zero. The tool then diagonalises V inside the degenerate set: its eigenvalues are the first-order shifts and its eigenvectors the "good" states for second order. If V does not split the set at first order, it diagonalises the second-order effective Hamiltonian instead.

## How to use it

1. Pick an example or type your own **H₀** and **V**, one row per line, numbers separated by spaces, commas or tabs. Complex entries are written 1+2i. You can also open a CSV, TSV, text or Excel file for each.
2. Set **λ**.
3. Read the table: each level's corrections, the sums to first, second and third order, the exact value and the error. The **coupling ÷ gap** figure warns when λ is too big for the series.
4. The plot shows the exact levels (solid) from λ = 0 to 1.5λ with the second-order parabolas (dashed): where they part company, perturbation theory stops working.

## Worked example

The page opens with three made-up levels, H₀ = diag(0, 1, 2.5), a symmetric V and λ = 0.2. For the lowest level, E⁽¹⁾ = 0.2 and E⁽²⁾ = −0.094, so second order gives 0 + 0.2 × 0.2 − 0.04 × 0.094 = **0.03624**, against the **exact 0.03609767**; adding third order (E⁽³⁾ = −0.01724) brings it to 0.03610, within 5 × 10⁻⁶. Choose the **anharmonic oscillator** with λ = 0.01: the ground state comes out as 1/2 + 3λ/4 − 21λ²/8 + 333λ³/16, the famous series, and the exact value 0.5072562 sits between second and third order.

## FAQ

**Why do I get a different order of levels from my textbook?** Rows are numbered by the unperturbed energies, lowest first. Each row's exact value is followed continuously from λ = 0, so it stays with its own level even through crossings.

**Is the truncated oscillator exact?** Only approximately: 20 states are kept, which is plenty for the lowest levels at small λ but not for the top ones.

**Can I rely on it for research?** It is for study and planning, not a substitute for professional judgement. Nothing you type leaves your device.
