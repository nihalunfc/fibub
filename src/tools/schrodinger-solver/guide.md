---
name: 1D Schrödinger solver
num: 923
shelf: science
code: T658
section: quantum-mechanics
title: "1D Schrödinger equation solver: energy levels and wavefunctions for any potential"
summary: "Choose a textbook potential, type a formula or draw your own, and get the lowest energy levels and wavefunctions of the one-dimensional Schrödinger equation by the matrix (finite-difference) method, with the exact levels alongside for the box, harmonic oscillator, finite well, Morse, linear and Pöschl–Teller potentials."
status: live
ads: true
order: 1
icon: curve
works: offline
updated: 2026-11-09
related: [huckel-mo-calculator, diatomic-spectroscopy, plot-maker, wave-packet, perturbation-theory, hydrogen-orbitals, quantum-dot-size]
sources:
  - "Finite-difference (three-point) discretisation of the Schrödinger equation and the analytic levels of the infinite well, harmonic oscillator, finite square well, Morse, linear (Airy) and Pöschl–Teller potentials: standard textbook results, for example Griffiths, D. J., Introduction to Quantum Mechanics, and Flügge, S., Practical Quantum Mechanics."
  - "Airy function zeros: asymptotic start from Abramowitz and Stegun (1964) 10.4.105, refined numerically. ħc and the electron rest energy: CODATA 2018 values, rounded."
  - "Checked against SciPy (scipy.linalg.eigh_tridiagonal on the same grid, scipy.special.ai_zeros and a brentq solution of the finite-well matching conditions) written for the tests."
  - "All example potentials and numbers are made up."
flow:
  - { icon: pencil, label: "Potential" }
  - { icon: table, label: "Matrix" }
  - { icon: chart, label: "Levels" }
  - { icon: curve, label: "Waves" }
---

## What it does

The time-independent Schrödinger equation in one dimension, −(ħ²/2m) ψ″(x) + V(x) ψ(x) = E ψ(x), has well-behaved solutions only at certain energies: the **energy levels** of a particle trapped by the potential V(x). Only a handful of potentials can be solved on paper. This tool solves any of them numerically.

It puts the particle on a grid of up to 4,000 points between two hard walls, turns the second derivative into the three-point difference (ψᵢ₋₁ − 2ψᵢ + ψᵢ₊₁)/h², and so turns the equation into a matrix eigenvalue problem. The lowest eigenvalues are the energy levels and the eigenvectors are the wavefunctions. It finds them by bisection with Sturm sequence counts (each level to full double precision for that matrix) and inverse iteration, all in your browser.

Watch a particle tunnel through a barrier with [[wave-packet|wave packet tunnelling]], and check small changes to the potential with the [[perturbation-theory|perturbation theory checker]].

## How to use it

1. Pick the **units**. Natural units set ħ = m = 1, the usual choice for exercises. Electron units measure x in nanometres and energy in electronvolts; the mass is in electron masses, so you can put in an effective mass for an electron in a semiconductor quantum well.
2. Pick a **potential** and set its numbers, or choose **Your formula** (for example `0.5*x^2 + 0.05*x^4`, with sin, exp, sqrt, abs, pi and so on) or **Draw it** and drag across the picture.
3. Set the **walls** x₀ and x₁. The wavefunctions are forced to zero there, so the window must be wide enough that the states have died away before the walls.
4. Choose the **grid points** (more is more accurate and a little slower) and how many **levels** to find (up to 30).
5. Switch the picture between the **wavefunctions ψ** and the **probability densities |ψ|²**. Each is drawn at the height of its own energy, on top of the potential, the classic textbook picture.

## What the results mean

- **Exact and Difference:** for the box, harmonic oscillator, finite well, Morse, linear and Pöschl–Teller potentials the exact levels are shown beside the numerical ones, so you can see the grid error directly.
- **Grid error ±:** the three-point formula's error shrinks as the square of the grid step, so one third of the change from a grid half as fine is a good estimate of what is left.
- **⟨x⟩ and Δx:** the mean position and its spread. **Nodes:** the number of times ψ crosses zero; the n-th level has n nodes.
- **P(E < V):** the probability of finding the particle where its energy is less than the potential, which classical physics forbids. This is tunnelling.
- A level marked **\*** lies above the potential at the window edge. It is really a state of the box made by the walls and moves when you move them. In a finite well, only the levels below zero are truly bound.

## Worked example

The page opens on the harmonic oscillator in natural units, ħω = 1, between walls at −8 and 8 with 1,000 grid points. The lowest level comes out as **E₀ = 0.499992** and the next as **E₁ = 1.49996**, against the exact 0.5 and 1.5: a difference of 8 × 10⁻⁶ and 4 × 10⁻⁵, which the grid-error column predicts. The ground state has no nodes and a spread Δx = 0.7071 = 1/√2, and the chance of finding it beyond the classical turning points is about 0.154 (exactly erfc 1 = 0.157 in the continuum limit; the coarse grid edge costs a little). Switch to the **double well** and the two lowest levels, 1.9566 and 1.9997, sit close together: the tunnelling splitting of the symmetric and antisymmetric states.

## Tips

- If the top levels change when you move the walls, widen the window.
- A sudden step in the potential (the finite well) converges more slowly than a smooth one; use 2,000 or 4,000 points.
- For a molecule, the Morse potential with a large mass gives vibrational levels whose spacing shrinks towards dissociation.

## FAQ

**Why hard walls?** A matrix needs a finite grid. Hard walls far out change bound states by an amount that falls off exponentially with distance, so they do no harm if the window is wide.

**Is this good enough for coursework?** Yes for one-dimensional problems; check the grid-error column. It is for study and planning, not a substitute for professional judgement in research or design.

**Does anything get uploaded?** No. All the arithmetic happens in your browser and nothing leaves your device.
