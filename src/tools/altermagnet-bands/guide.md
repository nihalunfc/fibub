---
name: Altermagnet band explorer
num: 145
shelf: science
code: T145
section: condensed-matter-physics
title: "Altermagnet band explorer: spin-split bands, Fermi surfaces and d- or g-wave splitting in a tight-binding model"
summary: "Play with minimal two-dimensional tight-binding models of an altermagnet: see the spin-up and spin-down bands split along some directions and meet along others, the two spins' Fermi contours, a map of the d- or g-wave spin splitting over the Brillouin zone, and the spin-resolved density of states that shows the net moment stays zero."
status: live
ads: true
order: 2
icon: curve
works: offline
updated: 2026-11-08
related: [altermagnet-checker, crystal-field-calculator, point-group-finder]
sources:
  - "Model: a standard two-sublattice tight-binding model on a square lattice, in which the two spin sublattices have opposite hopping anisotropy and are related only by a 90° rotation, as used to introduce altermagnetism in the literature since 2022. The equations are written out and solved by fibub; no paper's figures or fitted parameters are reproduced."
  - "One-band forms cos kx − cos ky, sin kx sin ky and sin kx sin ky (cos kx − cos ky): the lowest lattice harmonics of d- and g-wave symmetry on a square lattice (textbook group theory)."
  - "All parameters are made-up model values in units of the hopping, not measured materials. Eigenvalues are checked against NumPy in the tests."
flow:
  - { icon: sliders, label: "Model" }
  - { icon: curve, label: "Bands" }
  - { icon: target, label: "Fermi lines" }
  - { icon: chart, label: "Spin map" }
---

## What it does

An **altermagnet** is a magnet whose up and down spins cancel, like an antiferromagnet, yet whose electron bands are **split by spin**, as in a ferromagnet. The splitting changes sign around the Brillouin zone: up spins sit higher for electrons moving one way and lower for electrons moving at 90° to it. The Altermagnet checker tells you whether a crystal's symmetry allows this. This explorer shows what it looks like, using the simplest models that have it.

You get four pictures:

- **Bands** along the path Y–Γ–X–M–Γ, spin up solid and spin down dashed. Along Γ–X and Γ–Y the spins split in opposite ways; along Γ–M they lie on top of each other.
- **Fermi contours**: the shape of the filled states at the Fermi level for each spin. The two shapes are rotated copies of each other.
- A **splitting map** of E↑ − E↓ over the whole zone, showing the d-wave (four lobes) or g-wave (eight lobes) pattern.
- The **spin-resolved density of states**, identical for both spins, which is why there is no net magnetisation.

Before you model the bands, the [[altermagnet-checker]] confirms that a crystal is an altermagnet at all; the [[chiral-magnon-bands]] tool shows the matching spin waves.

## How to use it

1. Pick the **two-sublattice model** (the physical picture) or the **one-band model** (the splitting form written in directly).
2. In the two-sublattice model, **ta** and **tb** set how easily each sublattice's electrons hop along x and y. Atoms on sublattice A prefer one axis and atoms on B the other. **t1** links the two sublattices.
3. **J** is the exchange splitting from the local moments; **μ** moves the Fermi level, filling more or fewer states.
4. Change one value at a time and watch the bands and contours respond.

## Things to try

- Set **ta = tb**. The sublattices become alike apart from their spins, a translation can now swap them, and the splitting vanishes: a plain antiferromagnet.
- Set **J = 0**. No magnetism, no splitting.
- In the one-band model, switch from **d-wave** to **g-wave**: the nodes (lines of zero splitting) double from two to four.
- Raise **μ** to see the Fermi contours grow and change shape.

## Worked example

With the default made-up values (t1 = 1, ta = 0.3, tb = −0.1, J = 0.8, μ = 0.2), the largest splitting is 1.6, that is 2J, at the zone edge points X and Y. At X the spin-up bands are at −1.8 and 1.4 while the spin-down bands meet near −0.2. At Γ and everywhere along kx = ±ky the two spins have the same energy. Each spin holds 1.007 electrons per cell, so the net moment is zero.

## FAQ

**Is this a real material?** No. These are teaching models with made-up numbers. Real altermagnets such as RuO₂-type rutiles or MnTe need first-principles calculations, and their measured splittings are the subject of current research.

**Why is there no spin-orbit coupling?** Altermagnetism is defined without it: the spin splitting comes from the exchange field and the crystal's symmetry alone. Spin-orbit coupling adds smaller effects such as the anomalous Hall effect.

**What does the splitting do?** It lets a current carry spin without a net magnetisation (a spin-splitter effect) and gives large magnetoresistance in tunnel junctions, which is why altermagnets are studied for fast, robust memory devices.
