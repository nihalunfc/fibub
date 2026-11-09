---
name: Overlapping peptide library and pool designer
num: 201
shelf: science
section: virology-and-immunology
title: "Overlapping peptide library designer for epitope mapping: peptide masses, synthesis flags, matrix pools and deconvolution"
summary: "Paste a protein and cut it into overlapping peptides of any length and overlap, with their masses and flags for peptides that are often hard to make. Lay them out in matrix pools so each peptide is in two pools, then tap the positive pools to see which peptides could explain them. Download an order list as CSV. Nothing is uploaded."
status: live
ads: false
order: 4
icon: scissors
works: offline
updated: 2026-11-09
related: [peptide-mass-calculator, protein-calculator, hydropathy-plot, sequence-tools, antibody-dilution, plate-layout, sample-label-maker]
sources:
  - "Overlapping peptide tiling and matrix (row and column) pooling are general lab methods described in many immunology textbooks; the sums are fibub's own."
  - "Peptide masses come from fibub's peptide mass calculator (residue formulas with exact isotope masses and IUPAC conventional atomic weights)."
  - "The flag rules (share of water-repelling residues, cysteines, DP and NG motifs, N-terminal Q or E, length) are common rules of thumb written by fibub, with rounded editable settings; they are not taken from any supplier's guide."
  - "Checked in the tests against an independent Python version on the example and five random proteins: peptide spans, monoisotopic masses (pyteomics, to 0.000002 Da), average masses (pyteomics composition with conventional weights, and within 0.05 Da of pyteomics and Biopython), flags, the longest guaranteed stretch and the pool layout by brute force, and pool deconvolution."
  - "The example protein is made up for this tool; it is not a real protein."
flow:
  - { icon: pencil, label: "Paste" }
  - { icon: scissors, label: "Tile" }
  - { icon: table, label: "Pools" }
  - { icon: search, label: "Deconvolve" }
---

## What it does

To find which part of a protein an antibody or a T cell recognises (its epitope), labs often test a set of short peptides that walk along the protein and overlap each other. This page designs that set for you:

- **Peptide library**: cuts your protein into peptides of a set length that overlap by a set number of residues, names them (P001, P002 ...), and lists each one's position, sequence, monoisotopic and average mass.
- **Flags**: marks peptides that are often hard to make, dissolve or keep, so you can ask your supplier about them or shift them a little.
- **Matrix pools**: puts the peptides in a grid. Every row is one pool and every column another, so each peptide is in exactly two pools and you need far fewer tests than one per peptide.
- **Deconvolution**: tap the pools that gave a response and see the peptides where a positive row meets a positive column.
- **Order list**: a CSV with every peptide, its masses, flags and pools, ready to send to a peptide supplier.

Check each peptide's mass with the [[peptide-mass-calculator]], and plan the pools on a plate with the [[plate-layout]].

## How to use it

1. Paste a protein sequence (plain letters or FASTA) or open a FASTA file. Only the first protein is used.
2. Set the **peptide length** and either the **overlap** (residues shared with the next peptide) or the **offset** (how far apart the peptides start). Overlap = length − offset.
3. Keep **Add a last peptide that ends at the C-terminus** ticked unless your protein length fits the pattern exactly; without it the last few residues may be in no peptide.
4. Open **Flags for hard-to-make peptides** to change any rule: which letters count as water-repelling and above what share, from how many cysteines to flag (0 turns it off), which motifs, which first letters, and the longest length you are happy with.
5. Under **Matrix pools**, leave Rows empty for a near-square grid, or type a number of rows.
6. After your assay, tap the positive row and column pools (R1, C1 ...). Candidates are shaded in the grid and listed below.

The line **Every stretch of ... amino acids lies wholly in at least one peptide** tells you the longest linear epitope the design is sure to catch whole. For an even design it is the overlap plus one.

## Worked example

Press **Use the example**. It loads a made-up protein of 119 amino acids and designs 15-mers overlapping by 11 (a new one every 4). That gives **27 peptides**, 405 residues to make (3.40 × the protein), and every stretch of 12 amino acids lies wholly in at least one peptide. The last regular peptide, P027 (105–119), already ends at the C-terminus, so no extra one is needed.

16 of the 27 peptides are flagged. P014 (53–67, HGFLIVALLFAGIVM) is 80 % water-repelling; P003 to P005 have 2 Cys; P007 (ENGVKPLDPSQTIRY) has DP, NG and an N-terminal E. P014's monoisotopic mass is 1599.9211 and its average mass 1601.03.

The pools are **6 rows × 5 columns = 11 pools, up to 6 peptides in each**. Suppose pools R3, C4 and C5 respond. Tap them: the candidates are **P014 and P015**. They are neighbours, so a single epitope that lights up both would sit in the residues they share, 57–67 (IVALLFAGIVM). Test those two peptides on their own to confirm.

## Tips

- Overlapping neighbours share a row, so an epitope in an overlap usually shows as one row and two neighbouring columns, which this page reads as one stretch.
- Several positive rows and columns give many candidates. Smaller pools, or a second layout with a different number of rows, narrow them down.
- Masses are for the plain peptide with a free amine and acid. Add end groups (such as an acetylated N-terminus or amidated C-terminus) when you order if you want them.

## FAQ

**What length and overlap should I use?** 15-mers overlapping by 11 are common for T-cell (CD4 and CD8) work; 20-mers overlapping by 10 are cheaper. Check what your own field and assay use.

**Why is a peptide flagged as long?** Its length is above the "Flag peptides longer than" setting (20 by default). Long peptides are harder and dearer to make.

**Is my sequence uploaded?** No. Everything runs in your browser and the page works offline once loaded.
