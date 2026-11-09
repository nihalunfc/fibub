---
name: Ising model playground
num: 918
shelf: science
section: thermodynamics-and-statistical-physics
title: "Ising model simulator: 2D Metropolis Monte Carlo with magnetisation, heat capacity and Onsager's exact solution"
summary: "Watch a 2D Ising magnet order and disorder as you move the temperature, then scan a range of temperatures for magnetisation, energy, heat capacity, susceptibility and the Binder cumulant with error bars, compared with Onsager's exact result."
status: live
ads: true
order: 3
icon: sliders
works: offline
updated: 2026-11-09
related: [real-gas-calculator]
sources:
  - "Ising model and the Metropolis algorithm: Metropolis, N. et al. (1953), Journal of Chemical Physics 21, 1087; standard treatment in Newman, M. E. J. and Barkema, G. T., Monte Carlo Methods in Statistical Physics."
  - "Exact infinite-lattice results: Onsager, L. (1944), Physical Review 65, 117 (energy, heat capacity, Tc) and Yang, C. N. (1952), Physical Review 85, 808 (spontaneous magnetisation)."
  - "Checked against an independent NumPy/SciPy script: exact sums over every state of 3 × 3 and 4 × 4 lattices, and the energy from Onsager's free-energy double integral. The Monte Carlo is checked against the exact 4 × 4 values."
flow:
  - { icon: sliders, label: "Temperature" }
  - { icon: table, label: "Lattice" }
  - { icon: chart, label: "Scan" }
  - { icon: check, label: "Onsager" }
---

## What it does

The **Ising model** is the simplest model of a magnet: a square grid of spins, each pointing up or down, where neighbouring spins prefer to line up. At low temperature they all agree and the magnet is **ordered**; at high temperature thermal jiggling wins and the spins are a random mix. In two dimensions the change happens sharply at the **critical temperature** Tc = 2/ln(1 + √2) ≈ 2.269 (in units of the coupling J divided by Boltzmann's constant), one of the few phase transitions solved exactly (Onsager, 1944).

This playground has two parts:

- **Live lattice.** A 16 × 16 to 128 × 128 grid of spins updated by the **Metropolis Monte Carlo** rule: pick a spin, flip it if that lowers the energy, otherwise flip it with probability e^(−ΔE/T). Move the temperature slider and watch domains grow or melt. A magnetic field h favours up spins.
- **Temperature scan.** Runs the same simulation at many temperatures and measures the mean **magnetisation** |m|, **energy**, **heat capacity** (from energy fluctuations), **susceptibility** (from magnetisation fluctuations) and the **Binder cumulant**, with error bars from block averages. With no field, the charts show **Onsager's exact curves** for an infinite lattice.

## How to use it

1. Press **Run** to animate the lattice, **10 sweeps** to step, **Reset** to start again (from random spins or all up). A sweep is one attempted flip per spin.
2. Drag the **temperature** slider: try 1.5 (ordered), 2.27 (critical: domains of every size) and 3.5 (disordered).
3. For a scan, choose the lattice size, temperature range, number of temperatures and sweeps, then **Run the scan**. It starts all up at the lowest temperature and warms the same lattice.
4. Download the scan as CSV, or the report (charts, table and a snapshot of the live lattice) as an image, PDF or Word file.

## Worked example

The scan that runs when the page opens: a 16 × 16 lattice, 41 temperatures from 1.5 to 3.5, 300 settling and 5000 measured sweeps each, seed 1. At **T = 1.5** the magnetisation is **0.9865**, matching Onsager's 0.9865; at **T = 2.0** it is 0.9062 against the exact 0.9113 (a small lattice is a little less ordered). The **heat capacity peaks at T ≈ 2.35**, a little above the exact Tc of 2.269, as finite lattices always do. Above Tc the magnetisation falls towards zero but stays near 0.165 at T = 3.0, because a lattice of only 256 spins always has some leftover imbalance. Try 32 × 32 or 48 × 48 to see the peak sharpen and move towards 2.269.

## Tips

- Near Tc the simulation slows down (**critical slowing down**): use more sweeps there.
- The **Binder cumulant** U4 is 2/3 in the ordered phase and falls towards 0 in the disordered phase; curves for different lattice sizes cross near Tc.
- The same seed gives the same scan every time.

## FAQ

**Why does |m| not reach zero above Tc?** On a finite lattice the average of |M| over random spins is about 1/√N, not zero.

**Why use |m| rather than m?** A finite lattice can flip as a whole between all-up and all-down, so m averages to zero even when ordered.

**Is this a research code?** It is a teaching tool for study and planning. Research work uses cluster algorithms (Wolff, Swendsen-Wang) and finite-size scaling.
