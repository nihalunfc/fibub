---
name: Quantum statistics plotter
num: 921
shelf: science
section: thermodynamics-and-statistical-physics
title: "Fermi-Dirac, Bose-Einstein and Maxwell-Boltzmann distributions: plotter and ideal quantum gas calculator"
summary: "Plot the Maxwell-Boltzmann, Fermi-Dirac and Bose-Einstein occupation numbers for any temperature and chemical potential, then solve an ideal quantum gas: chemical potential from density, Fermi energy, Bose-Einstein condensation temperature and condensate fraction, mean energy and pressure."
status: live
ads: true
order: 6
icon: chart
works: offline
updated: 2026-11-09
related: [partition-function, ising-model, blackbody-calculator, band-structure, carrier-concentration, superconductor-calculator, heat-capacity-fitter, real-gas-calculator]
sources:
  - "Fermi-Dirac and Bose-Einstein statistics, the ideal Fermi and Bose gases, the Fermi energy and the condensation temperature: standard results, for example Pathria, R. K. and Beale, P. D., Statistical Mechanics."
  - "Constants: CODATA 2018 exact values of h, kB and e; electron mass and unified atomic mass unit from CODATA; atomic masses of ³He, ⁴He and ⁸⁷Rb rounded."
  - "The conduction-electron density of copper (about 8.5 × 10²⁸ per m³) is a rounded general value."
  - "Checked against mpmath at 30 digits: complete Fermi-Dirac integrals as −Li(−e^η), Bose-Einstein integrals as polylogarithms, and the chemical potential by root finding."
flow:
  - { icon: sliders, label: "T and μ" }
  - { icon: chart, label: "f(E)" }
  - { icon: flask, label: "Gas" }
  - { icon: calculator, label: "μ, EF, Tc" }
---

## What it does

In a system at temperature T, the average number of particles in a quantum state of energy E depends on what kind of particle it is:

- **Maxwell-Boltzmann** (classical particles): f = e^(−(E−μ)/kT).
- **Fermi-Dirac** (fermions: electrons, protons, ³He): f = 1/(e^((E−μ)/kT) + 1). Never more than one particle per state (the Pauli principle), giving a sharp step at μ when T is low.
- **Bose-Einstein** (bosons: photons, ⁴He, ⁸⁷Rb): f = 1/(e^((E−μ)/kT) − 1). Bosons crowd into the lowest states; f grows without limit as E approaches μ.

The **chemical potential** μ is the energy at which a state is half full for fermions. The top half of the page plots the three curves for any T and μ and reads them off at one energy. The bottom half solves an **ideal quantum gas**: from the particles' mass, spin degeneracy, number density and temperature it finds μ, the **thermal wavelength**, the **degeneracy** nλ³/g (above about 1 quantum effects dominate), the mean energy, the pressure, and the **Fermi energy** for fermions or the **Bose-Einstein condensation temperature** and condensate fraction for bosons.

Use the Fermi-Dirac result for semiconductors in the [[carrier-concentration|carrier concentration calculator]], and see Planck's law for light in the [[blackbody-calculator]].

## How to use it

1. Set the **temperature**, **μ** and the **energy range** (in eV or meV), and an energy E to read off. Untick any distribution to hide it.
2. For the gas, pick **particles** (electrons, helium-3, helium-4, rubidium-87, or any mass in u), the **statistics**, the **number density** per m³ and the **temperature**.
3. Download the occupancies as CSV, or the report as an image, PDF or Word file.

## Worked example

At **300 K**, kT = 0.02585 eV (25.85 meV). With μ = 0, at E = 0.05 eV (1.934 kT above μ), the occupation is 0.1446 for Maxwell-Boltzmann, 0.1263 for Fermi-Dirac and 0.1690 for Bose-Einstein: fermions sit below and bosons above the classical value.

For the **conduction electrons of copper** (8.5 × 10²⁸ per m³, rounded) at 300 K, the thermal wavelength is 4.303 nm, far longer than the 0.2274 nm spacing, so the degeneracy is 3387 and the gas is strongly quantum. The calculator finds **μ = 7.049 eV** (272.7 kT), the Fermi energy 7.049 eV and the Fermi temperature 81,804 K. The mean energy per electron is 4.230 eV, not the classical 0.039 eV, and the electron pressure is 3.84 × 10¹⁰ Pa.

Switch to **rubidium-87** at 10²⁰ per m³ and 2e-7 K (200 nK): the condensation temperature is 398.3 nK and **64.4 %** of the atoms are in the condensate.

## Tips

- When E − μ is several kT, all three distributions agree: that is the classical limit.
- For a Fermi gas well below TF, μ ≈ EF and the mean energy approaches 3/5 EF.
- A Bose gas cannot have μ above its lowest energy (0 here); when the density passes ζ(3/2) = 2.612 per λ³ the extra atoms condense.

## FAQ

**Why can a Bose-Einstein value exceed 1?** Any number of bosons may share a state.

**Are interactions included?** No. Real metals have band structure and real atom clouds have interactions and traps; this is the ideal gas, for study and planning.

**What does g mean?** The number of spin states per momentum state: 2 for spin-½ particles, 1 for spin 0.
