---
name: CIF viewer
num: 843
shelf: science
section: crystallography
title: "CIF viewer online: crystal structure in 3D, bond lengths, cell volume, Z and density from a CIF file"
summary: "Open a Crystallographic Information File (CIF) and see the unit cell in 3D: the symmetry operations fill the cell from the listed atoms, and the page gives bond lengths and coordination, the cell volume, the formula and formula units Z, and the density. The file never leaves your browser."
status: live
ads: false
order: 843
icon: eye
works: offline
updated: 2026-11-09
related: [miller-index-calculator, xrd-peak-calculator, electron-diffraction-indexer, point-group-finder, molar-mass-calculator, molecule-viewer, lattice-fft, brillouin-zone]
sources:
  - "The CIF reader, symmetry expansion, distances and density are written by fibub and checked in the tests against gemmi (read_small_structure) and NumPy on fibub's own example files and a made-up test CIF. No database CIF is used."
  - "The examples (rock salt, rutile, wurtzite ZnO) are textbook structures typed by fibub with rounded cell sizes and positions; the symmetry operations are the standard ones for each space group."
  - "Atomic weights for the density come from the site's element table. Element colours are fibub's own."
  - "A file you open is read on the page only. It is never uploaded or stored."
flow:
  - { icon: file, label: "CIF" }
  - { icon: convert, label: "Symmetry" }
  - { icon: eye, label: "3D cell" }
  - { icon: table, label: "Bonds" }
---

## What it does

A CIF (Crystallographic Information File) is the standard text file for a crystal structure. It gives the unit cell, the space group's symmetry operations and the positions of the atoms that are not related by symmetry (the asymmetric unit). This page reads one and shows what is inside:

- **Reading.** The cell lengths and angles (with their uncertainties in brackets), the space group name, the symmetry operations (old `_symmetry_equiv_pos_as_xyz` or new `_space_group_symop_operation_xyz` tags) and the atom sites with their occupancies. Quoted values, comments and text fields are handled.
- **Filling the cell.** Every operation, such as −x + ½, y, z + ½, is applied to every site; positions are brought back into the cell and duplicates (closer than 0.01 Å) merged.
- **3D view.** The cell drawn to scale with atoms coloured by element and bonds between atoms closer than a cut-off you set. Turn it by dragging or with the sliders, change the atom size, and show labels. Partly occupied sites are drawn partly filled.
- **Numbers.** Cell volume, atoms of each element in the cell, the formula and formula units Z, density from the atomic weights, the shortest distance, and a bond-length table with coordination numbers that includes atoms in the neighbouring cells.

Predict the powder pattern of the structure with the [[xrd-peak-calculator|XRD peak calculator]], and work out its symmetry with the [[point-group-finder|point group finder]].

## How to use it

1. **Open a CIF**, paste its text, or pick an example.
2. **Look.** Turn the cell, switch bonds and labels on or off, and change the bond cut-off. It starts 15 % above the shortest distance, which shows the nearest neighbours.
3. **Read** the bond table and the facts. Check that the density matches the one in the file or paper.
4. **Download** the atom list (fractional and Cartesian coordinates) or bond list as CSV, or a PNG, PDF or Word report with the picture.

## Worked example

The page opens on rock salt, NaCl: a = 5.64 Å, space group F m −3 m, with one Na at 0, 0, 0 and one Cl at ½, ½, ½. The 192 symmetry operations of the space group fill the cell with **8 atoms**, 4 Na and 4 Cl, so **Z = 4** formula units of ClNa (Hill order). The cell volume is 5.64³ = **179.406 Å³** and the density is 4 × (22.990 + 35.45) g/mol ÷ (Nᴀ × 179.406 Å³) = **2.164 g/cm³**.

The shortest distance is 2.82 Å (half the cell edge), so the cut-off starts at 3.25 Å and the bond table shows each Na with **6 Cl at 2.8200 Å**: the octahedral coordination of rock salt. The picture shows the familiar cube with 27 atoms, because atoms on the faces, edges and corners are drawn on every side they touch.

Pick *Rutile, TiO₂* to see a tetragonal cell (Ti with 4 O at 1.947 Å and 2 at 1.980 Å), or *Wurtzite ZnO* for a hexagonal one.

## Tips

- If the formula or density looks wrong, check the occupancies and that the file lists all symmetry operations. A CIF without operations is shown as if it were P1, with a warning.
- Hydrogen positions from X-ray work are often too short by 0.1 Å or more; that is the data, not the viewer.
- The bond cut-off is one number for all pairs. Raise it to see second neighbours or lower it to tidy a crowded picture.
- Use the cell from here in the Miller index calculator to get d-spacings, or the XRD peak calculator for 2θ.

## FAQ

**Which files work?** Small-molecule and inorganic CIFs with `_atom_site_fract_x/y/z`. Protein mmCIF files use Cartesian coordinates and are not read.

**Can I use CIFs from a database?** Yes, the file is only read on your device. Check the database's terms for anything you share afterwards.

**Is my file uploaded?** No. It is read in your browser and never sent or stored.
