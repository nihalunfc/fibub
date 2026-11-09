---
name: PDB structure viewer
num: 185
shelf: science
section: structural-biology
title: "PDB viewer: see a protein structure in 3D, with secondary structure, distances and contacts, in your browser"
summary: "Open a PDB or mmCIF file and turn the structure in 3D: cartoon, backbone trace or every atom, coloured by chain, helix and strand, B-factor or position. List chains, residues and ligands, tap two atoms for a distance, and get every residue contact within a cutoff as a CSV. Nothing is uploaded."
status: live
ads: false
order: 1
icon: eye
works: offline
updated: 2026-11-09
related: [ramachandran-plot, cryo-em-calculator, protein-calculator, peptide-mass-calculator, crystallisation-screen, molecule-viewer, hydropathy-plot, cif-viewer]
sources:
  - "File reading (PDB columns and mmCIF tables), the secondary-structure guess, distances, contacts and the 3D drawing are written by fibub. The guess uses C-alpha distance windows in the style of the published P-SEA method, with ranges chosen by fibub."
  - "Checked in the tests against Biopython 1.88 on the example: atoms, residues, chains, distances, every residue contact at four settings (NeighborSearch), mmCIF tokens (MMCIF2Dict) and the same structure written as mmCIF; the principal axes against NumPy; an ideal helix worked by hand."
  - "The example structure is made up by fibub (built from chosen backbone angles, with an invented ligand and made-up B-factors). It is not an experimental structure or a Protein Data Bank entry."
  - "A file you open is read on the page only. It is never uploaded or stored."
flow:
  - { icon: file, label: "Open file" }
  - { icon: eye, label: "Turn in 3D" }
  - { icon: ruler, label: "Measure" }
  - { icon: table, label: "Contacts" }
---

## What it does

A structure file lists where every atom of a protein (or DNA, RNA and any bound molecules) sits in space. This viewer reads that file inside your browser and lets you look at it and measure it:

- **3D view.** Turn it with a finger or the mouse, pinch or scroll to zoom. Pick a **cartoon** (thick tubes for helices, arrows for strands, thin lines elsewhere), a **backbone trace** (straight lines between C-alpha atoms) or **all atoms** as sticks. Ligands are drawn as balls and sticks; water is hidden until you tick it.
- **Colours** by secondary structure, chain, B-factor (how much an atom moves or how uncertain it is: blue low, red high), position along the chain (blue at the N end to red at the C end) or element.
- **Chains, residues and ligands**: how many of each, the numbering, every chain's sequence with helix and strand letters coloured, and which residues sit within 4 Å of each ligand.
- **Distances**: tap two atoms in the view, tap two letters in a sequence, or pick two residues from the lists.
- **Contacts**: every pair of residues with any atoms closer than a cutoff, with the closest pair of atoms, as a table and a CSV.

Check the backbone angles with the [[ramachandran-plot]], and the sequence's mass and pI with the [[protein-calculator|protein parameter calculator]].

## How to use it

1. Press **Open a PDB or mmCIF file** (or drop the file on the view, or paste its text). Files ending .pdb, .ent, .cif and gzipped .gz all work.
2. Turn and zoom the view. **Reset view** brings back the starting angle, which lays the longest side of the molecule across the screen.
3. Tap an atom, then a second one, to see the distance. **Clear picks** removes the marks.
4. Set the contact **cutoff** and how many **neighbours** along the chain to skip, then download the list.

## Options

- **Secondary structure.** Most files from crystallography or cryo-EM carry HELIX and SHEET records (in mmCIF, struct_conf and struct_sheet_range) and the page uses them. When a file has none, such as a model straight out of a prediction or simulation program, the page makes a rough guess from the C-alpha atoms: five residues in a row whose C-alpha spacings fit a helix are called helix; extended stretches are called strand only when another extended stretch lies alongside within 5.6 Å. You can switch to the guess for any file to compare. It is not a full hydrogen-bond assignment such as DSSP.
- **Cutoff.** 4 Å is a common choice for side-chain contacts and hydrogen bonds, 3.5 Å keeps mostly hydrogen bonds and salt bridges, and 6 to 8 Å is used for looser residue contact maps.
- **Skip neighbours.** Residues next to each other along a chain always touch through the peptide bond, so they are left out. The default 3 skips the next two residues; raise it to see only long-range contacts.
- **Show** all contacts, only those **between chains** (an interface), or only those **with ligands and water** (a binding site). Tick **Count water** to include water, and **Count hydrogens** if your file has them and you want them counted.

## Worked example

The page opens with a made-up model: chain A has a helix, a short loop and a two-strand hairpin, chain B is a short helix lying against chain A's helix, and an invented ring compound called LIG sits by the hairpin. It is drawn from 240 atoms (only backbone and C-beta atoms, no full side chains). The page reads **2 chains, 46 residues, 1 ligand**, with **57 % helix, 26 % strand** from the file's HELIX and SHEET records.

The residue boxes start on A GLU 4 and B ALA 10: the closest atoms are **A GLU 4 O to B ALA 10 CB, 3.316 Å**, and the two C-alpha atoms are **4.468 Å** apart. At a 4 Å cutoff skipping 3 neighbours there are **64 residue pairs**; choose **Between chains only** and the list drops to **7 pairs**, the interface between the two helices. Choose **With ligands and water only** and tick **Count water**: 4 pairs are left, A TYR 29 next to LIG (3.356 Å) and three waters.

## Tips

- On a big structure the all-atoms style draws thousands of sticks; the cartoon is quicker to turn.
- Only the first model of an NMR ensemble is read, and where an atom has alternate positions only the first is kept. The page says so under the chain table.
- The contacts CSV has every pair with chain, residue name and number, closest distance, the two atoms and the number of atom pairs within the cutoff, ready for a spreadsheet.
- Download the view as a PNG on white for slides, or the whole report as an image, PDF or Word file.

## FAQ

**Is my file uploaded?** No. It is read by the page in your browser and stays on your device. Nothing is stored after you close the page.

**Why does the guess differ from the file's records?** The guess only looks at C-alpha spacing, so it often runs a helix one residue longer and trims the ends of strands next to turns. The records in a deposited file come from the depositors' own assignment.

**Can it open AlphaFold or other predicted models?** Yes, they are ordinary PDB or mmCIF files. In predicted models the B-factor column usually holds the confidence score, so colouring by B-factor shows confident parts in red and uncertain parts in blue.

**Why are some residues missing from the trace?** Gaps in the numbering or C-alpha atoms more than 4.2 Å apart break the line, because part of the chain was not seen in the experiment.
