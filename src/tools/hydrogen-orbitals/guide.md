---
name: Hydrogen orbital viewer
num: 925
shelf: science
code: T660
section: quantum-mechanics
title: "Hydrogen orbital viewer: probability clouds, slices and radial plots for any n, l, m"
summary: "See any hydrogen-like orbital up to n = 7, real (pₓ, d_z², f_xyz ...) or complex: a slice of ψ coloured by sign, a turnable cloud of dots drawn from |ψ|², and the radial function and radial probability, with the energy, mean and most probable radius, nodes and the radius holding 90 % of the electron."
status: live
ads: true
order: 3
icon: orbit
works: offline
updated: 2026-11-09
related: [schrodinger-solver, huckel-mo-calculator, crystal-field-calculator, spectral-line-identifier, operator-algebra, periodic-table, molecule-viewer]
sources:
  - "Hydrogen-like wavefunctions (associated Laguerre radial functions and spherical harmonics with the Condon–Shortley phase), energies and the closed forms for ⟨r⟩, ⟨r²⟩ and ⟨1/r⟩: standard textbook results, for example Griffiths, D. J., Introduction to Quantum Mechanics, and Bransden, B. H. and Joachain, C. J., Physics of Atoms and Molecules."
  - "Rydberg energy and Bohr radius: CODATA 2018 values, rounded."
  - "Checked against SciPy (scipy.special.genlaguerre, sph_harm_y, quad and brentq) written for the tests."
flow:
  - { icon: sliders, label: "n, l, m" }
  - { icon: orbit, label: "Cloud" }
  - { icon: chart, label: "Radial" }
  - { icon: ruler, label: "Sizes" }
---

## What it does

The electron in a hydrogen atom does not orbit like a planet. Quantum mechanics gives it a **wavefunction** ψ(r, θ, φ), and |ψ|² is the probability of finding it at each point. Each allowed state is labelled by three numbers: the shell **n** (1, 2, 3 ...), the subshell **l** (0 to n − 1, called s, p, d, f ...) and **m** (−l to l). This tool draws any of them up to n = 7, for hydrogen or any one-electron ion (He⁺, Li²⁺ ...) with nuclear charge Z.

It shows three pictures:

- **A slice** through the nucleus (the xz, xy or yz plane), coloured by the sign of ψ: one colour where ψ is positive, another where it is negative, brighter where |ψ| is larger. The dark lines and circles between lobes are the **nodes**, where the electron is never found.
- **A probability cloud** of up to 10,000 dots, each a random position drawn from |ψ|² in three dimensions. Turn and tilt it with the sliders. The dots are the same every time you open the same orbital.
- **Radial plots** of R(r) and the radial probability r²R²(r), which says how likely the electron is to be at distance r whatever the direction.

Solve other potentials with the [[schrodinger-solver|1D Schrödinger solver]], and see how orbitals combine in molecules with the [[huckel-mo-calculator]].

## How to use it

1. Pick **n**, then **l** and **m**. The m list shows the chemistry names for real orbitals (2p x, 3d xy, 4f xyz ...).
2. Choose **real** or **complex** orbitals. Chemists use real ones because they point along axes; physicists often use complex ones with a definite m, whose |ψ|² is the same all the way round the z axis.
3. Set **Z** for an ion, the **slice plane**, the **picture size** (blank picks one holding 97 % of the electron) and the number of dots.
4. Download the pictures and facts as an image, PDF or Word file, or the radial functions as CSV.

## Worked example

The page opens on **3d z²** of hydrogen. Its energy is **E = −1.51174 eV**, a ninth of the ground state's −13.6057 eV. The mean radius is **10.5 a₀** (556 pm), the most probable radius 9 a₀, and 90 % of the electron lies within 15.8 a₀. It has no radial nodes (n − l − 1 = 0) and two angular nodes, the cones where 3cos²θ = 1. In the xz slice the two lobes along z have one colour and the ring round the middle the other. Change n to 4 and l to 0 for **4s**: three radial nodes appear as rings in the slice, at r = 1.87, 6.61 and 15.5 a₀.

## Tips

- An orbital with ψ = 0 on the whole slice plane (such as 2p z in the xy plane) shows an empty square; the legend says so. Pick another plane.
- For Z = 2 every length shrinks by half and every energy grows four times.
- The radial probability peaks at n² a₀ / Z for the largest l (1s at 1 a₀, 2p at 4 a₀, 3d at 9 a₀): Bohr's orbits come back as the most probable radii.

## FAQ

**Why do the 2s and 2p orbitals have the same energy?** In a pure Coulomb field the energy depends only on n. Fine structure, the Lamb shift and the other electrons of a bigger atom split them, but these are not included here.

**Are the dots real electron positions?** They are samples of where a measurement could find the electron, which is what |ψ|² means. It is for study and teaching, not a substitute for professional judgement.

**Does anything get uploaded?** No. Every picture is computed in your browser.
