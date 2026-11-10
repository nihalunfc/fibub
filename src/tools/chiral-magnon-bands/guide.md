---
name: Chiral magnon bands
num: 148
shelf: science
code: T148
section: condensed-matter-physics
title: "Chiral magnon bands: split spin waves of left- and right-handed chirality in an altermagnet (linear spin-wave theory)"
summary: "See how the two kinds of spin wave in an altermagnet, which turn the spins in opposite senses, get different energies in a d-wave pattern. A toy spin model with couplings you set, solved by linear spin-wave theory. It shows the magnon bands along Y–Γ–X–M–Γ, a map of the chirality splitting over the zone, the gap at Γ, and a stability check."
status: live
ads: true
order: 5
icon: curve
works: offline
updated: 2026-11-08
related: [altermagnet-bands, altermagnet-checker, spin-splitter-conductivity, anomalous-hall-checker, band-structure, brillouin-zone]
sources:
  - "Method: linear spin-wave theory with Holstein–Primakoff bosons and a Bogoliubov transformation for a collinear two-sublattice magnet (standard textbook treatment). The closed-form energies are worked out by fibub for this model."
  - "Model: a made-up square-checkerboard Heisenberg model in which same-sublattice couplings are anisotropic in opposite ways on the two sublattices, the simplest way to make an altermagnet. The idea that altermagnet magnons are chirality-split comes from the literature since 2023 and is cited for the concept only; no paper's parameters or figures are used."
  - "Checked in the tests against NumPy eigenvalues of the paraunitary (σ3·H) magnon matrix."
flow:
  - { icon: sliders, label: "Couplings" }
  - { icon: calculator, label: "Spin waves" }
  - { icon: curve, label: "Bands" }
  - { icon: chart, label: "Split map" }
---

## What it does

A **magnon** is a quantum of spin wave, a ripple in the direction of the spins. A two-sublattice antiferromagnet has two kinds. One turns the spins clockwise and the other anticlockwise: they carry opposite **chirality** and opposite spin (−1 and +1 in units of ħ). In an ordinary antiferromagnet the two always have the same energy, so their effects cancel.

In an **altermagnet** they do not. Their energies split, and the splitting changes sign around the Brillouin zone, just like the spin splitting of the electron bands (d-wave in this model). A temperature gradient along x can then carry a net spin current made of magnons, which could be useful for low-power spintronics.

This tool solves the simplest spin model that shows this, using linear spin-wave theory.

The electron side of the same material is in the [[altermagnet-bands|altermagnet band explorer]], and the symmetry check is in the [[altermagnet-checker]].

## The model

Spins of length S sit on a square checkerboard with two sublattices: A (up) and B (down).

- **J1** couples every atom to its four nearest neighbours on the other sublattice and favours opposite spins. It must be positive.
- **Ja and Jb** couple atoms of the same sublattice one cell apart and favour parallel spins. On A, Ja acts along x and Jb along y. On B it is the other way round. This is what makes the magnet an altermagnet: only a 90° rotation turns A into B. Set Ja = Jb and you have a plain antiferromagnet.
- **K** is an easy-axis anisotropy that holds the spins along their axis. It opens a gap at Γ.

All energies are in whatever unit you give the couplings.

## What each result means

- **Largest splitting ωα − ωβ**: how far apart the two chiralities get, and where. For this model it is 4S|Ja − Jb|, at the X and Y points with opposite signs. Along the diagonals kx = ±ky the two stay degenerate.
- **Gap at Γ**: 2S√(K(4J1 + K)). Without anisotropy the magnons are gapless.
- **Top of the bands**: the highest magnon energy on the path.
- **Net thermal spin**: always 0. A 90° rotation turns one chirality into the other, so equal numbers of each are excited and the magnet stays compensated. Only a current or gradient that picks a direction shows the splitting.
- **Bands chart**: α (solid) and β (dashed) along Y–Γ–X–M–Γ.
- **Map**: where α is higher and where β is higher.

If the couplings make the up-down order unstable, for example with a negative K or same-sublattice couplings that are too antiferromagnetic, a magnon energy goes negative or imaginary. The tool then says so instead of drawing bands, because linear spin-wave theory only applies to a stable state.

## Worked example

Use the default made-up couplings: J1 = 1, Ja = 0.3, Jb = 0.05, K = 0.02 and S = 1.

- **Gap at Γ:** 2√(0.02 × 4.02) = **0.567**.
- **At X:** the α magnon sits at 5.24 and the β magnon at 4.24, a splitting of **+1.0**.
- **At Y:** the order reverses, so the splitting is −1.0.
- **At M and along the diagonals:** the two are degenerate (5.44 at M).
- **Largest splitting:** 4 × 1 × |0.3 − 0.05| = **1.0** in size. The tool reports it as −1 at the Y point, which is the same size as +1 at X.

Now set Jb = 0.3 so that Ja = Jb. The splitting disappears everywhere and the bands of a plain antiferromagnet come back.

## FAQs

**Which mode is which?** α lowers the total spin by one unit and lives mostly on the spin-up sublattice. β raises it and lives mostly on the spin-down sublattice. They precess in opposite senses.

**Is linear spin-wave theory exact?** No. It is the first step, valid at low temperature where few magnons are excited. Interactions between magnons shift and broaden the bands at higher energy.

**Does it model a real material?** No. It is a toy model with made-up couplings, chosen to show the effect clearly.

**Is anything sent anywhere?** No. Everything runs in your browser.
