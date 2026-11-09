---
name: Protein parameter calculator
num: 178
shelf: science
section: proteomics-and-protein-science
title: "Protein calculator: molecular weight, pI, extinction coefficient and charge at any pH from a sequence"
summary: "Paste a protein sequence or open a FASTA file to get its molecular weight (average and monoisotopic), formula, isoelectric point, net charge at any pH with a charge curve, extinction coefficient at 280 nm and the concentration from an A280 reading. Nothing is uploaded."
status: live
ads: false
order: 1
icon: flask
works: offline
updated: 2026-11-09
related: [sequence-tools, nucleic-acid-concentration, beer-lambert-calculator, buffer-recipe-calculator, molar-mass-calculator]
sources:
  - "Masses and formula worked out by fibub from each amino acid's chemical formula with IUPAC standard atomic weights and exact isotope masses (general chemistry facts). Checked against Biopython: monoisotopic masses agree to better than 1 part in 100 million; average masses agree to about 1 part in 100,000 (Biopython uses older atomic weights)."
  - "pKa values: fibub's own rounded, approximate values of the kind printed in biochemistry books, not copied from any one table, and editable on the page."
  - "Extinction coefficients: the conventional per-residue values for Trp, Tyr and cystine at 280 nm used across protein labs (general laboratory facts), editable on the page."
  - "The example sequence is made up for this tool; it is not a real protein."
flow:
  - { icon: pencil, label: "Paste" }
  - { icon: calculator, label: "Mass, pI" }
  - { icon: curve, label: "Charge" }
  - { icon: download, label: "Report" }
---

## What it does

Paste a protein sequence in one-letter codes (or open a FASTA file) and the calculator gives the numbers you need before an experiment:

- **Molecular weight**, both the **average** mass (what a balance or SDS-PAGE sees) and the **monoisotopic** mass (the lightest-isotope peak in mass spectrometry), plus the **chemical formula**.
- **Isoelectric point (pI)**: the pH where the protein carries no net charge. Proteins are least soluble near their pI, and ion exchange depends on which side of it your buffer is.
- **Net charge at any pH**, with a curve of charge from pH 0 to 14.
- **Extinction coefficient at 280 nm** from the tryptophans, tyrosines and cystines, and the absorbance of a 1 mg/mL solution.
- **Concentration from A280**: type your blank-corrected reading and path length to get mg/mL and µM.
- **Composition**: how many of each amino acid, and their share.

## Options

- **pH for the charge**: the pH of your buffer.
- **Disulfide bonds**: how many pairs of cysteines are joined. Each bond takes two hydrogens off the mass, adds to the extinction coefficient and removes two cysteines from the charge. Leave it at 0 for a reduced protein, such as in SDS-PAGE sample buffer with DTT.
- **pKa values and extinction coefficients**: the values used, which you can change. The default pKa values are fibub's own rounded values. Every tool uses a slightly different set, so pI values from different tools often differ by 0.1 to 0.5. Type in another tool's values to match it.

## Worked example

Press **Use the example**. It is a made-up sequence of 120 amino acids (not a real protein). The results are:

- **Average mass:** 14,139.93 Da (14.14 kDa).
- **Monoisotopic mass:** 14,130.6520 Da.
- **Formula:** C626H932N176O183S9.
- **pI:** 7.38. At pH 7.0 the net charge is +0.68.
- **Extinction coefficient:** 36,440 M⁻¹ cm⁻¹ with all four cysteines reduced, or 36,690 with them as two cystines. A 1 mg/mL solution reads A280 = 2.577 in a 1 cm cell.

Type 0.5 as the absorbance: the concentration is 0.5 ÷ 36,440 = 13.72 µM, which is 0.194 mg/mL.

## FAQ

**Why does my pI differ from another tool's?** pKa values for the same amino acid differ between books and programs. The curve near the pI is often shallow, so small changes move it. Treat the pI as a guide to within a few tenths, and check by experiment if it matters.

**Why is there no extinction coefficient?** A protein with no tryptophan or tyrosine absorbs very little at 280 nm. Use a dye assay such as Bradford or BCA instead.

**Does it include modifications?** No. Phosphorylation, glycosylation and other changes add mass and change the charge. Signal peptides that are cut off are still counted unless you remove them from the sequence.

**Is my sequence uploaded?** No. Everything is worked out in your browser and works offline.
