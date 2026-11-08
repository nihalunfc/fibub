---
name: Hückel MO calculator
num: 92
shelf: science
section: computational-chemistry
title: "Hückel MO calculator: π orbital energies, coefficients, delocalisation energy and bond orders"
summary: "Hückel molecular orbitals for any conjugated π system, from 17 presets (butadiene, benzene, naphthalene, pyridine and more) or your own atoms, bonds, heteroatoms and charge: energy diagram, coefficients, π energy, delocalisation energy, charges, bond orders and free valence."
status: live
ads: true
order: 1
icon: sigma
works: offline
updated: 2026-11-08
related: [molar-mass-calculator, equilibrium-solver, beer-lambert-calculator, isotope-pattern-calculator]
flow:
  - { icon: pencil, label: "Molecule" }
  - { icon: table, label: "Matrix" }
  - { icon: chart, label: "Orbitals" }
  - { icon: check, label: "Properties" }
---

## What it does

Hückel theory is the simplest quantum chemistry: it treats only the π electrons of a flat conjugated molecule, and every carbon and every bond the same way. The energies come out as E = α + xβ, where α is the energy of an electron on an isolated carbon p orbital and β is the interaction between neighbours. Both are negative, so a larger x is a lower, more stable orbital. Despite its simplicity it explains aromaticity, why allyl ions are stable, where substitution happens on naphthalene, and much more.

The tool builds the Hückel matrix, diagonalises it exactly and reports:

- **An orbital diagram** with the electrons in place, HOMO and LUMO marked. Degenerate orbitals sit side by side, and electrons are shared between them evenly (Hund's rule).
- **Energies and coefficients** of every molecular orbital.
- **Total π energy** and the **delocalisation energy**, compared with isolated ethylene double bonds (for all-carbon systems).
- **HOMO–LUMO gap** in units of |β|, with a rough value in eV.
- **π charges, π bond orders and free valences** for each atom and bond.
- **The Hückel rule** for single rings: 4n + 2 π electrons is aromatic, 4n is antiaromatic.

Heteroatoms use Streitwieser's parameters: α_X = α + hβ and β_CX = kβ. Pyridine-like N, pyrrole-like N, carbonyl O and furan O are built in, and you can give any h, k and electron count.

## How to use it

1. Choose a molecule, or **My own**.
2. For your own: give the number of π atoms, list the bonds (1-2 2-3 ...) and the net charge. A cation has charge 1, an anion −1.
3. List any heteroatoms, such as `1 N` for pyridine's nitrogen.
4. Read the diagram and tables, and download them as a PNG, PDF or Word file.

## Worked example

**Butadiene** gives x = ±1.618 and ±0.618. Four electrons fill the two bonding orbitals: Eπ = 4α + 4.472β, so the delocalisation energy is 0.472β. The bond orders are 0.894 for the outer bonds and 0.447 for the middle one, and the free valence is highest on the end carbons (0.838), where butadiene reacts.

**Benzene** gives 2, 1, 1, −1, −1, −2: Eπ = 6α + 8β and a delocalisation energy of 2β, the classic result. **Cyclobutadiene** puts two electrons into a degenerate pair at x = 0: a diradical with no delocalisation energy, the textbook antiaromatic case. **Naphthalene** has a delocalisation energy of 3.683β, and C1–C2 (0.725) has more double-bond character than C2–C3 (0.603).

## Questions

**How big is β?** It depends on what you compare with: about −75 kJ/mol from heats of hydrogenation, about −2.4 eV from UV spectra. Hückel numbers are best used to compare related molecules.

**Why are the heteroatom charges only rough?** Simple Hückel ignores electron repulsion, so charges are exaggerated. They still show the right trends, such as the electron-poor 2- and 4-positions of pyridine.

**Is anything sent anywhere?** No. Everything is worked out in your browser.
