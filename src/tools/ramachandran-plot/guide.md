---
name: Ramachandran plot
num: 186
shelf: science
section: structural-biology
title: "Ramachandran plot generator: phi and psi angles from a PDB or mmCIF file, in your browser"
summary: "Open a protein structure (PDB or mmCIF) and get every residue's backbone phi, psi and omega angles, plotted on a Ramachandran plot with glycine and proline marked, broad guide regions for helix and sheet, a list of residues outside them and of cis peptides, and CSV, image, PDF or Word downloads. The file is never uploaded."
status: live
ads: false
order: 2
icon: chart
works: offline
updated: 2026-11-09
related: [protein-calculator, peptide-mass-calculator, sequence-tools, sequence-alignment, pdb-viewer, cryo-em-calculator, hydropathy-plot]
sources:
  - "The PDB and mmCIF readers, the dihedral angle maths and the guide regions are written by fibub. The angles are checked in the tests against Biopython (Bio.PDB internal coordinates and MMCIFParser) and an independent NumPy dihedral on the example and on a noisy copy with a chain break, an insertion code and alternative locations, to 0.001°."
  - "The guide regions are broad ovals drawn by fibub around the textbook helix, sheet and left-handed helix areas. They are not published contour data and can be changed on the page."
  - "The example structure is made up: its coordinates are built from chosen angles with standard textbook bond lengths and angles. It is not a real protein."
  - "A file you open is read on the page only. It is never uploaded or stored."
flow:
  - { icon: file, label: "Open file" }
  - { icon: compass, label: "Angles" }
  - { icon: chart, label: "Plot" }
  - { icon: table, label: "Residues" }
---

## What it does

A protein's backbone can only twist in two places per residue: about the N–CA bond (the angle **φ**, phi) and about the CA–C bond (the angle **ψ**, psi). The peptide bond in between (**ω**, omega) is flat, nearly always trans at about 180°. Plotting ψ against φ for every residue gives a **Ramachandran plot**: helices gather in one area, β-strands in another, and residues in strained, unusual places stand out. It is one of the first checks people make on a new structure or model.

This page reads a structure file in your browser and:

- finds the backbone N, CA and C atoms of every residue in the first model (PDB or mmCIF, with insertion codes and alternative locations handled);
- works out φ, ψ and ω for each residue, leaving them blank at the ends of chains and at chain breaks (a C–N gap longer than 2.0 Å, which you can change);
- plots ψ against φ from −180° to 180°, with **glycine as triangles** and **proline as squares**, since both behave differently from other residues;
- shades three broad **guide regions** (right-handed helix α, β-sheet and extended, left-handed helix αL) and lists every residue that falls outside them, plus any **cis peptides** (ω near 0°);
- gives a table of all residues, a CSV of the angles, and an image, PDF or Word report.

To turn the structure in 3D, use the [[pdb-viewer]]; for the sequence's parameters, the [[protein-calculator|protein parameter calculator]].

## How to use it

1. **Open a file.** Tap *Open a PDB or mmCIF file*, or paste the text of a PDB file. Both the old fixed-column PDB format and the newer mmCIF format work. Unzip `.gz` files first.
2. **Pick a chain** if the structure has several, or keep *All chains*.
3. **Read the plot.** Tap a point to see which residue it is. Points outside the guides are drawn in red and named.
4. **Check the list** of residues outside the guides and of cis peptides, then download the CSV or a report.

### What the settings do

- **Longest C–N peptide bond** sets how far apart two residues can be and still count as joined. A real peptide bond is about 1.33 Å; anything much longer is a gap in the model.
- **Draw the guide regions** turns the shaded ovals on and off.
- **Name the residues outside the guides** writes their names next to the red points.
- **Guide regions** (under the table) lets you change, add or remove the ovals: one per line with a name, a short label, the φ and ψ centre, and the half-widths in degrees. The ovals wrap around the edges of the plot, because −180° and 180° are the same angle.

## Worked example

The example is a made-up protein with two chains (33 residues), built from chosen angles. Chain A has a helix, a glycine turn, a proline after a cis peptide, a β-strand and one residue placed somewhere strange on purpose; chain B is a short strand.

The page reports **29 residues plotted: 44.8 % α, 44.8 % β, 3.4 % αL, 6.9 % outside the guides**. Four residues have no point, because the first residue of each chain has no φ and the last has no ψ. A typical helix residue, A LEU 6, sits at φ −66.8°, ψ −41.3°. The glycine A GLY 14 is in the left-handed region at φ 78.4°, ψ 21.7°.

Two residues fall outside the guides: **A ASP 23** at φ 62.5°, ψ −118.4°, a place that is very strained for any residue with a side chain, and **B GLY 4** at φ 101.7°, ψ −168.4°, which is fine for glycine because it has no side chain. The list also shows a **cis peptide** at A THR 15 (ω −4.5°), the bond just before proline 16, which is where cis peptides are most often found.

## Tips

- Look at every residue outside the guides in the electron density or the model before deciding it is wrong: some strained residues are real and important for function.
- Glycine and proline have their own shapes on a full Ramachandran analysis. Treat glycine outside the guides as normal, and expect proline near φ −65°.
- For NMR ensembles, the page uses the first model only. Save other models as separate files to compare them.
- For a formal validation report, use a structure-validation service with published contour maps; this page is for a quick, private look.

## FAQ

**Are the shaded areas the "allowed" and "favoured" regions?** No. They are rough ovals that fibub drew around the usual areas, not the published contour maps. They are good for seeing the overall shape and spotting odd residues, not for a percentage to put in a paper.

**Why are some residues missing from the plot?** The first residue of a chain has no φ and the last has no ψ, and residues next to a gap in the chain lose one angle. Residues without N, CA and C atoms (ligands, missing atoms) are left out.

**Which alternative location is used?** The first one in the file, usually A, as Biopython and DSSP do.

**Is my file uploaded?** No. The file is read by your browser and never leaves your device, and the page works offline once it has loaded.
