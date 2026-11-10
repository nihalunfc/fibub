---
name: Crystal field
num: 93
shelf: science
code: T93
section: inorganic-and-coordination-chemistry
title: "Crystal field"
summary: "Pick a d-block metal ion and a geometry (octahedral, tetrahedral, square planar, square pyramidal), give Δ and the pairing energy or an absorption band, and get the d-orbital diagram, high or low spin, CFSE, unpaired electrons, spin-only moment and the Jahn–Teller tendency."
status: live
ads: true
order: 1
icon: flask
works: offline
updated: 2026-11-08
related: [huckel-mo-calculator, beer-lambert-calculator, molar-mass-calculator, equilibrium-solver]
sources:
  - "Spectrochemical series and pairing behaviour: standard textbook order (Shriver and Atkins; Housecroft and Sharpe)."
flow:
  - { icon: flask, label: "Metal ion" }
  - { icon: sliders, label: "Δ and P" }
  - { icon: chart, label: "d orbitals" }
  - { icon: check, label: "Spin state" }
---

## What it does

In a coordination complex the ligands push the five d orbitals of the metal apart in energy. How far apart (the splitting, Δ) compared with the cost of putting two electrons in one orbital (the pairing energy, P) decides whether the ion is high spin or low spin. That in turn sets its colour, magnetism, size and reactivity. This tool works it out for you.

- **d electron count** from the metal and its oxidation state: the group number minus the charge (Fe²⁺ is d⁶, Cu²⁺ d⁹).
- **Four geometries**: octahedral (t2g below eg), tetrahedral (e below t2, with Δt about 4/9 of Δo), square planar and square pyramidal (from the standard Dq tables).
- **The lowest-energy arrangement.** Every possible way of placing the electrons is compared, counting the crystal field energy and P for each pair, so the answer is right for any geometry, not only the textbook d⁴ to d⁷ octahedral cases.
- **CFSE** in units of Δ and in cm⁻¹ or kJ/mol.
- **Unpaired electrons and the spin-only magnetic moment**, μ = √(n(n + 2)) BM.
- **How close the decision is.** If the other spin state is only a little higher, the tool warns that spin crossover is possible.
- **Jahn–Teller distortion** for octahedral ions: strong for an odd number of eg electrons (Cu²⁺, high-spin Mn³⁺, low-spin Co²⁺), weak for unevenly filled t2g.
- **Δ from a spectrum.** Give the wavelength of the d–d band and the tool converts it to cm⁻¹ and kJ/mol and names the colour you see.

To check whether the same complex follows the 18-electron rule, use the [[electron-count-calculator]]; to find its symmetry from coordinates, the [[point-group-finder]].

## How to use it

1. Choose the metal and type its oxidation state. The d count fills in; you can type over it.
2. Choose the geometry.
3. Type Δ and P in cm⁻¹ or kJ/mol, or type a band wavelength instead of Δ.
4. Read the diagram, the spin state and the comparison table. Open the spectrochemical series to judge whether your ligands give a small or large Δ.

## Worked example

Fe²⁺ is d⁶. With water, Δo is about 10,400 cm⁻¹, below a pairing energy of about 17,600 cm⁻¹, so [Fe(H₂O)₆]²⁺ is high spin: t2g⁴ eg², four unpaired electrons, μ = 4.90 BM, CFSE −0.4Δo. With cyanide Δo rises to about 33,000 cm⁻¹, above P, and [Fe(CN)₆]⁴⁻ is low spin t2g⁶: diamagnetic, CFSE −2.4Δo.

[Ti(H₂O)₆]³⁺ (d¹) absorbs at 493 nm: Δo = 20,300 cm⁻¹ = 243 kJ/mol. Blue-green light is absorbed, so the solution looks red to purple (it is purple in the bottle, because the band is broad).

## Questions

**Why is the pairing energy not built in?** It varies with the metal, its charge and the ligands, and published values differ. Typical values are 15,000 to 25,000 cm⁻¹ for 3d ions.

**Why is my measured moment higher than the spin-only value?** Orbital angular momentum adds to it in some ions, especially high-spin Co²⁺ and Fe²⁺ in octahedral fields.

**Is anything sent anywhere?** No. Everything is worked out in your browser.
