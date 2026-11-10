---
name: Point group
num: 110
shelf: science
section: inorganic-and-coordination-chemistry
title: "Point group"
summary: "Paste a molecule's XYZ coordinates or open an .xyz file to get its point group (C₂ᵥ, D₃h, T_d, O_h, I_h and the rest), every symmetry element, the group order, and whether the molecule can be chiral or polar. No coordinates? Answer the flowchart questions instead. 23 example molecules."
status: live
ads: true
order: 3
icon: compass
works: offline
updated: 2026-11-08
related: [crystal-field-calculator, electron-count-calculator, huckel-mo-calculator, ir-band-finder]
sources:
  - "Method: the standard point-group flowchart of molecular symmetry, as taught in inorganic chemistry courses."
  - "Example molecules: idealised geometries built by fibub from typical bond lengths and angles, not copied from a structure database."
  - "Atomic weights (for the centre of mass): IUPAC/CIAAW standard atomic weights."
flow:
  - { icon: table, label: "XYZ" }
  - { icon: compass, label: "Symmetry" }
  - { icon: check, label: "Point group" }
---

## What it does

The point group of a molecule is the set of symmetry operations that leave it looking the same: rotations about axes (Cₙ), reflections in mirror planes (σ), inversion through the centre (i) and improper rotations (Sₙ). The point group decides which vibrations show in the IR and Raman spectra, how orbitals combine, and whether the molecule can be chiral or have a dipole moment.

The first card **finds the point group from coordinates**. It places the centre of mass at the origin and works out the moments of inertia to tell linear, symmetric and spherical molecules apart. It then tests candidate axes through atoms and through midpoints between like atoms, and checks every rotation, mirror plane, inversion and improper axis by moving each atom and looking for an atom of the same element at the new position. Finally it follows the flowchart:

1. Linear molecules are D∞h or C∞v.
2. Molecules with several high-order axes are T_d, O_h, I_h or one of their relatives.
3. Otherwise, the main axis and any C₂ axes at right angles to it decide between the D and C groups.
4. Mirror planes, inversion and S₂ₙ settle the rest.

For each molecule you get:

- the symmetry elements found
- the order of the group
- whether the molecule can be chiral (no improper operation) and whether it can have a dipole moment (only C₁, Cₛ, Cₙ and Cₙᵥ)
- a drawing looking down the main axis or from the side

The second card is the **flowchart on its own**: answer the questions from a model or a sketch.

For how ligands split the d-orbitals, use the [[crystal-field-calculator]]; for the bands a molecule's symmetry allows, the [[ir-band-finder]].

## How to use it

1. Pick an example, or paste coordinates in ångströms as "element x y z", one atom per line. You can also open an .xyz file exported from a drawing or modelling program. The usual first two lines (the atom count and a title) are skipped.
2. Leave the tolerance at 0.1 Å for clean, symmetrised coordinates. Raise it to 0.2 or 0.3 Å for coordinates from an X-ray structure or a quick force-field model, which are never perfectly symmetrical.
3. Read the point group and the elements. If a molecule comes out lower than you expect, the coordinates are probably slightly distorted, so raise the tolerance.

## Worked examples

- **BF₃ (trigonal planar):** a C₃ axis, three C₂ axes at right angles to it, a horizontal mirror plane and three vertical planes give **D₃h**, order 12. The molecule is not chiral and has no dipole.
- **Water:** C₂ᵥ.
- **Ammonia:** C₃ᵥ.
- **Methane:** T_d.
- **SF₆:** O_h.
- **Staggered ethane:** D₃d. Eclipsed ethane is D₃h.
- **Allene:** D₂d.
- **Hydrogen peroxide:** C₂, which is chiral, so its two twisted forms are mirror images.
- **CHFClBr:** C₁, the simplest chiral molecule in the list.

## Questions

**Does it work for big molecules?** Up to 500 atoms. Large flexible molecules usually have little or no symmetry (C₁) unless the coordinates were symmetrised.

**Why does my structure from a crystal give C₁?** Packing in the crystal and measurement error break the ideal symmetry by a few hundredths of an ångström. Raise the tolerance.

**Are my coordinates sent anywhere?** No. Everything runs in your browser, and the page works offline once loaded.
