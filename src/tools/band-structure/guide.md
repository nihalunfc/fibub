---
name: Band structure explorer
num: 962
shelf: science
code: T697
section: condensed-matter-physics
title: "Band structure explorer: tight-binding chain, square lattice, graphene and Kronig-Penney bands with density of states"
summary: "See how electron bands form in the classic toy models of solid state physics: a tight-binding chain, a diatomic chain with a gap, the square lattice, graphene's Dirac cones and the Kronig-Penney row of square wells. Get band edges, gaps, the Fermi level for any filling, effective mass, Fermi velocity and the density of states, with charts and CSV downloads."
status: live
ads: true
order: 6
icon: curve
works: offline
updated: 2026-11-09
related: [altermagnet-bands, chiral-magnon-bands, plot-maker, brillouin-zone, carrier-concentration, hall-effect, heat-capacity-fitter]
sources:
  - "Tight-binding bands of the chain, diatomic chain, square lattice and honeycomb lattice, the Kronig-Penney condition and the density of states: standard textbook results, for example Ashcroft, N. W. and Mermin, N. D., Solid State Physics (1976), and Kittel, C., Introduction to Solid State Physics."
  - "Exact square-lattice density of states with the complete elliptic integral K: a standard closed form; K is computed with the arithmetic-geometric mean."
  - "Checked by fibub against an independent plane-wave expansion of the Kronig-Penney potential (NumPy/SciPy, 401 plane waves), SciPy's ellipk, and NumPy diagonalisation of the 2 × 2 Bloch Hamiltonians. ħ²/2mₑ is the CODATA value, rounded."
  - "Graphene's t ≈ 2.7 eV and C–C distance 0.142 nm are rounded textbook values; every other number is made up and editable."
flow:
  - { icon: sliders, label: "Model" }
  - { icon: curve, label: "Bands" }
  - { icon: chart, label: "DOS" }
  - { icon: target, label: "Fermi level" }
---

## What it does

In a crystal, the energy levels of electrons on single atoms spread out into **bands**, separated by **gaps** where no electron states exist. Whether a material is a metal or an insulator depends on whether its highest occupied band is full or only partly filled. This explorer shows how bands come about in five simple models that every solid state course uses:

- **1D chain**: one orbital per atom and a hopping energy t between neighbours. The band is E = −2t cos ka, 4t wide.
- **Diatomic chain**: two different atoms per cell. Their orbital energies differ by Δ, and a gap of exactly Δ opens at the zone edge.
- **Square lattice**: the 2D version, whose flat regions near the X points give a sharp **van Hove** peak in the density of states.
- **Graphene**: the honeycomb lattice of carbon, with two bands that touch at the **K points** (Dirac cones). A difference Δ between the two atoms (as in boron nitride) opens a gap.
- **Kronig-Penney**: free electrons in a row of square wells, solved exactly. It shows how a periodic potential cuts the free-electron parabola into bands.

For each model you get the band energies along a path through the Brillouin zone, the **density of states** (how many states there are per unit energy), the band edges and gaps, the **Fermi level** for the number of electrons you choose, and the **effective mass** at the band bottom or graphene's **Fermi velocity**.

Find the high-symmetry points the bands run between with the [[brillouin-zone|Brillouin zone viewer]], and turn a band gap into electron and hole numbers with the [[carrier-concentration|carrier concentration calculator]].

## How to use it

1. Pick a **model**. The fields change to suit it and sensible example values are filled in.
2. For the lattice models, set the **hopping t** (how strongly neighbouring orbitals overlap; bigger t, wider band), optional **t′** to next-nearest neighbours, **Δ** for two-atom cells, the **lattice constant** (only used for the effective mass and Fermi velocity), and the **electrons per cell** (2 fills one band, counting both spins).
3. For Kronig-Penney, give the **barrier height V₀**, the **well and barrier widths** in nm, the **effective mass** of the electron and how many bands to find.
4. Read the result, then download the bands or the density of states as CSV, or the whole report as an image, PDF or Word file.

## Worked example

Start with the 1D chain as it opens: t = 1 eV, a = 0.3 nm, one electron per cell. The band runs from −2 to 2 eV, so the page shows **Bandwidth 4 eV, E_F = 0 eV: metal**. The effective mass at the bottom is ħ²/(2ta²) = **0.423 mₑ**, and the density of states at the Fermi level is about **0.159 per eV**, which is 1/(2πt), as the exact formula 1/(π√(4t² − E²)) says.

Switch to the diatomic chain with Δ = 1 eV and two electrons per cell: the lower band is full and the page shows **Gap 1 eV**, an insulator. Graphene with t = 2.7 eV and two electrons per cell puts the Fermi level at the Dirac point, with a Fermi velocity of **8.74 × 10⁵ m/s**.

In the Kronig-Penney model with V₀ = 0.5 eV, wells 0.5 nm and barriers 0.2 nm wide, the lowest band runs from **0.132 to 0.785 eV** and the first gap is **0.242 eV**. Setting V₀ to 0 closes every gap and leaves the free-electron parabola.

## Tips

- Make t negative to flip a band upside down, as for holes.
- A positive t′ on the square lattice moves the van Hove peak and makes the Fermi surface less square, as in cuprate models.
- In Kronig-Penney, make the barriers thick and high to see narrow bands near the levels of a single well (the tight-binding limit), or thin and low to see nearly free electrons with small gaps at the zone edges.

## FAQ

**Why is the density of states per spin?** Each band holds two electrons per cell, one of each spin. Double the numbers for both spins.

**Why does the density of states look slightly jagged?** For the lattice models it is counted from a grid of k-points (20,000 in 1D, 300 × 300 in 2D). Where an exact formula exists, it is drawn dashed on top so you can compare.

**Is this a real material calculation?** No. These are teaching models with one orbital per site. Real band structures need methods such as density functional theory. Use it for study and intuition.
