---
name: Molecule viewer
num: 838
shelf: science
section: computational-chemistry
title: "Molecule viewer"
summary: "Open an XYZ, MOL or SDF file and turn the molecule in 3D with your finger or mouse: ball and stick, sticks or space-filling, with or without hydrogens and labels. Bonds come from the file or are guessed from distances. Tap atoms for distances, angles and dihedrals; get the formula, molar mass and centre of mass, every bond length as a CSV, a PNG picture and the coordinates as XYZ. Nothing is uploaded."
status: live
ads: false
order: 838
icon: eye
works: offline
updated: 2026-11-09
related: [pdb-viewer, qc-output-parser, point-group-finder, unsaturation-calculator, periodic-table, cif-viewer, molar-mass-calculator, huckel-mo-calculator]
sources:
  - "File reading (XYZ, MOL and SDF V2000 layouts), the bond guess, the measurements and the 3D drawing are written by fibub. The covalent radii for guessing bonds are rounded values chosen by fibub; atom colours follow the usual CPK convention."
  - "Molar mass from IUPAC/CIAAW standard atomic weights."
  - "Checked in the tests against RDKit 2026.09 (MOL and XYZ files it wrote for 161 molecules: atoms, coordinates, charges, bonds and orders, its own bond perception, distances, angles and dihedrals, centre of mass) and Open Babel 3 (bond perception)."
  - "The example structures are built by fibub from SMILES with RDKit and a force field; they are not experimental or database structures."
flow:
  - { icon: file, label: "Open file" }
  - { icon: eye, label: "Turn in 3D" }
  - { icon: ruler, label: "Measure" }
  - { icon: download, label: "PNG, XYZ" }
---

## What it does

Chemists pass small molecules around as **XYZ** files (an atom count, a comment line and one line of coordinates per atom, as written by most quantum chemistry programs) and **MOL** or **SDF** files (with bonds, bond orders and charges, as written by drawing programs, RDKit and Open Babel; an SDF can hold many molecules). This page reads them in your browser and draws the molecule in 3D with its own small renderer.

- **Three styles**: ball and stick (double and triple bonds drawn as two or three lines, aromatic bonds with a dashed line), sticks, and space-filling.
- **Turn and zoom**: drag to turn, pinch or scroll to zoom, or use the arrow keys and the + and − buttons. **Reset view** lays the longest side of the molecule across the screen.
- **Hydrogens** on or off, **labels** by element or atom number.
- **Measure**: tap two atoms for the distance in ångström, three for the angle, four for the dihedral (torsion) angle. You can also type the atom numbers.
- **Bonds**: from the file, or, for XYZ files, guessed from the distances: two atoms are bonded when they are closer than their covalent radii added up plus 0.45 Å.
- **Facts**: formula, charge, molar mass, centre of mass and centroid, any SD data fields, and every bond with its length (CSV).
- **Downloads**: a PNG picture of the current view on white, and the coordinates as XYZ.

For proteins, DNA and other PDB or mmCIF files, use the [PDB structure viewer](/science/pdb-viewer/), which draws cartoons and finds contacts.

Get a geometry from a calculation with the [[qc-output-parser|quantum chemistry output parser]], and find the molecule's symmetry with the [[point-group-finder|point group finder]].

## How to use it

1. Press **Open a file** (or drop it on the box, or paste the text). For an SDF or a multi-frame XYZ file, choose the molecule from the list.
2. Turn the molecule and pick a style.
3. Tap atoms to measure. A fifth tap starts again; tapping a picked atom un-picks it. **Clear** removes the picks.
4. Download the picture, the coordinates or the bond list.

## Worked example

Press **Caffeine (MOL)**. The page reads 24 atoms and 25 bonds from the file: C₈H₁₀N₄O₂, molar mass 194.194 g/mol. Type **1 2** in the measure box: the distance between the methyl carbon C1 and the ring nitrogen N2 is 1.441 Å, a normal C–N single bond. Type **1 2 3** for the angle at N2, and **1 2 3 4** for the dihedral. Switch on **Number** labels to see which atom is which. Press **Ethanol (XYZ)**: the file has no bonds, so the page guesses 8 bonds from the distances.

## How the measurements work

Distance is the straight-line length between two atom centres. The angle a–b–c is the angle at b between the lines to a and to c. The dihedral a–b–c–d is the angle between the plane a–b–c and the plane b–c–d, from −180° to 180°; it is positive when, looking along b→c, the front bond must turn clockwise to cover the back one (the IUPAC convention).

## Tips

- MOL and SDF files must be in the V2000 layout; most programs can save it. V3000 files get a message.
- The bond guess can miss long bonds to metals or add short contacts in strained or crowded structures; a MOL file with bonds is more reliable.
- Space-filling sizes are the covalent radius plus 0.8 Å, a rough stand-in for van der Waals size.

## FAQ

**Is my structure uploaded?** No. The file is read and drawn on this page only.

**Why are some atoms pink?** Elements without a usual colour in this viewer are drawn pink; the formula and labels still give the element.
