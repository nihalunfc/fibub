---
name: Wave packet tunnelling
num: 924
shelf: science
section: quantum-mechanics
title: "Wave packet animator: tunnelling, reflection and transmission through barriers"
summary: "Send a Gaussian wave packet at a rectangular barrier, double barrier, step, well or smooth barrier and watch it split into reflected and transmitted parts. The time evolution runs in your browser by the split-step Fourier method, and the reflection and transmission it finds are compared with the exact stationary transmission averaged over the packet's energies."
status: live
ads: true
order: 2
icon: curve
works: offline
updated: 2026-11-09
related: [schrodinger-solver, wave-calculator, plot-maker, fourier-visualiser, hydrogen-orbitals, operator-algebra]
sources:
  - "Split-step Fourier method (Strang splitting) for the time-dependent Schrödinger equation: Feit, M. D., Fleck, J. A. and Steiger, A. (1982), Journal of Computational Physics 47, 412 to 433; the standard textbook method."
  - "Transmission through piecewise-constant potentials by transfer matrices, and the closed-form rectangular-barrier and step results: standard textbook formulas, for example Griffiths, D. J., Introduction to Quantum Mechanics."
  - "ħ, ħc and the electron rest energy: CODATA 2018 values, rounded."
  - "Checked against an independent NumPy split-step simulation, SciPy solve_ivp integration of the stationary equation and SciPy quad for the packet average, written for the tests."
  - "All example barriers and packets are made up."
flow:
  - { icon: sliders, label: "Barrier" }
  - { icon: curve, label: "Packet" }
  - { icon: clock, label: "Evolve" }
  - { icon: chart, label: "R and T" }
---

## What it does

A quantum particle is not a little ball but a wave packet: a bump of probability that moves and spreads. When it meets a barrier higher than its energy, a classical ball would always bounce back. The packet does something else: part of it **tunnels** through and part is **reflected**. Even a barrier lower than the energy reflects some of the wave, and a well can too.

This tool sets up a Gaussian packet on the left, moving right, and solves the time-dependent Schrödinger equation iħ ∂ψ/∂t = −(ħ²/2m) ∂²ψ/∂x² + V(x) ψ by the **split-step Fourier method**: each small time step applies half the potential, then the kinetic energy exactly in momentum space (via a fast Fourier transform), then the other half of the potential. You can play the result as an animation and scrub through time.

At the end it adds up how much probability went left (**R**) and right (**T**), and compares T with the **stationary** answer: the exact plane-wave transmission T(E) from the transfer-matrix method, averaged over the range of energies the packet contains.

Find the bound states of a potential with the [[schrodinger-solver|1D Schrödinger solver]], and see how a packet is built from waves in the [[fourier-visualiser]].

## How to use it

1. Choose **natural units** (ħ = m = 1) or **electron units** (nm, eV and fs, with the electron's mass).
2. Pick the **potential**: a rectangular barrier, a double barrier (two barriers with a gap, which shows resonant tunnelling), a step, a square well or a smooth Gaussian barrier. Set its height or depth and width.
3. Set the packet's **energy E₀**, its **width σ** and its **start position**. A wide packet has a narrow spread of energies, so it behaves more like a single plane wave.
4. The **window** and **grid points** set the simulation box; the outer 12 % on each side absorbs the wave so nothing wraps round. Leave **run time** blank for an automatic time that lets the packet clear the barrier.
5. Press **Play**, or drag the time slider.

## Worked example

The page opens with natural units, a rectangular barrier of height V₀ = 1.25 and width 1.5, and a packet of energy E₀ = 1.125, width σ = 4, starting at x = −20. The energy is below the top of the barrier, yet the result is **R = 64.4 %, T = 35.6 %**: over a third of the packet tunnels through. The stationary transmission averaged over the packet's energies is 0.3560, against 0.3562 from the simulation, while the plane-wave value at exactly E₀ is 0.3474; the difference comes from the higher-energy part of the packet, which tunnels more easily. Switch to the **double barrier** with a gap of 3: T(E) now has sharp resonance peaks, and the transmission is 26.2 %, with some of the packet lingering between the barriers before it leaks out.

## Tips

- If the simulation and stationary T differ by more than a few parts in a thousand, use more grid points or a wider window, or lengthen the run.
- The **T(E)** chart shows the whole stationary transmission curve, with the packet's energy spread as a dashed bump: the simulation's T is roughly the curve averaged under the bump.
- Electron units give real-world sizes: a 0.2 eV electron through a 1 nm, 0.3 eV barrier transmits about 13 %.

## FAQ

**Why does the packet reflect from a well?** Any sudden change in potential reflects some of a wave, just as light partly reflects from glass.

**Is the simulation exact?** It is accurate to second order in the time step, and the grid is fine enough to resolve the waves; the tests check it against an independent NumPy implementation and the exact stationary result. It is for study and planning, not a substitute for professional judgement.

**Does anything get uploaded?** No. Everything is computed in your browser.
