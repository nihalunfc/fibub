---
name: Nanoparticle calculator
num: 858
shelf: science
section: nanoscience
title: "Nanoparticle calculator: specific surface area, atoms per particle, surface atoms, magic-number clusters and particle concentration"
summary: "From a particle's diameter, density and molar mass, get the surface-to-volume ratio, specific surface area in m²/g, atoms per particle and the share of atoms on the surface. Count atoms and corner, edge and face sites in magic-number cuboctahedral and icosahedral clusters, convert a mass concentration to particles per mL and nanomolar, and find the BET-equivalent diameter."
status: live
ads: true
order: 858
icon: calculator
works: offline
updated: 2026-11-09
related: [diffusion-calculator]
sources:
  - "S/V = 6/d, specific surface area 6/(ρd), and the magic-number cluster counts N = (10n³ + 15n² + 11n + 3)/3 with 10n² + 2 surface atoms (Mackay 1962, Acta Cryst. 15, 916; Benfield 1992, J. Chem. Soc. Faraday Trans. 88, 1107) are standard closed forms. fibub's code is checked in the tests against clusters built atom by atom in NumPy."
  - "The example uses the density and molar mass of gold, rounded; the concentration and surface area are made-up round values."
  - "Nothing you type is sent or stored."
flow:
  - { icon: ruler, label: "Size" }
  - { icon: sigma, label: "Atoms" }
  - { icon: flask, label: "Conc." }
  - { icon: target, label: "BET" }
---

## What it does

Nanoparticles are small enough that a large share of their atoms sit on the surface, which is why they are such good catalysts and why their properties change with size. This page turns a particle size into the numbers you need for a paper, a dose of material in an experiment or a comparison with gas adsorption:

- **Surface to volume** S/V = 6/d, the **surface area** and **volume** of one sphere, and the **specific surface area** 6/(ρd) in m²/g.
- **Atoms per particle** (volume ÷ volume per atom, M/(ρN_A)) and the **share of atoms on the surface**: those within one atom diameter of the surface, 1 − (1 − 2a/d)³.
- **Magic-number clusters**: closed-shell cuboctahedra (cut from an fcc crystal) and Mackay icosahedra with n shells have N = (10n³ + 15n² + 11n + 3)/3 atoms (13, 55, 147, 309, 561 ...) and 10n² + 2 surface atoms. The page splits the surface into corner, edge and face atoms, which have different numbers of neighbours and so behave differently in catalysis, and lists the next sizes.
- **Concentration**: from a mass concentration (for example from ICP), the number of particles per mL, the **molar concentration of particles** (often nanomolar), the atoms per mL and the surface area per mL.
- **BET-equivalent diameter** 6/(ρ × SSA) from a measured specific surface area, and how it compares with your size.

## How to use it

1. Type the density and molar mass of the material (for a compound, of one formula unit) and the particle diameter. Leave the atom diameter blank to estimate it from the volume per atom, or type the nearest-neighbour distance.
2. For clusters, pick the shape and the number of shells. The page suggests the n that matches your diameter.
3. Type a mass concentration and a measured surface area if you have them. Download the results as an image, PDF or Word file.

## Worked example

Gold spheres 20 nm across (ρ = 19.3 g/cm³, M = 196.97 g/mol) have S/V = 0.3 /nm and a specific surface area of **15.54 m²/g**. Each atom takes 0.01695 nm³, so an atom diameter is about 0.3187 nm and each particle holds **247,171 atoms**, of which **9.26 %** (22,886) are on the surface. A particle weighs 8.084 × 10⁻¹⁷ g.

A cuboctahedron with 3 shells has **147 atoms, 92 on the surface (62.6 %)**: 12 corners, 48 edge atoms and 32 face atoms. A 20 nm particle matches about n = 31.

At 50 µg/mL of gold there are **6.185 × 10¹¹ particles per mL**, a particle concentration of **1.027 nM**. A powder of the same gold with a measured surface area of 12 m²/g has a BET-equivalent diameter of **25.91 nm**, 1.3 times the 20 nm size.

## Tips

- The surface-shell share depends on what you call an atom diameter; use the same choice when comparing sizes.
- Particle concentrations from mass assume every particle has the same size. For a spread of sizes, the mass sits mostly in the biggest particles, so the true number is higher than this estimate.
- A BET diameter much larger than the TEM size usually means the particles are stuck together.

## FAQ

**Why are 13, 55 and 147 "magic"?** Those are the numbers that complete a full shell, so the cluster has no partly filled outer layer and is especially stable.

**Do cuboctahedra and icosahedra really have the same counts?** Yes, shell by shell, but the icosahedron has only (111)-like faces and 30 edges, while the cuboctahedron has (100) and (111) faces and 24 edges.

**Is my input stored?** No, all the sums happen on this page.
