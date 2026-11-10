---
name: Peptide mass
num: 179
shelf: science
section: proteomics-and-protein-science
title: "Peptide mass"
summary: "Digest a protein with trypsin or another enzyme, list every peptide's mass and m/z, match your measured peaks to them (peptide mass fingerprint) with sequence coverage, and get the b, y and a fragment ions of any peptide. Nothing is uploaded."
status: live
ads: false
order: 2
icon: target
works: offline
updated: 2026-11-09
related: [protein-calculator, isotope-pattern-calculator, molar-mass-calculator, sequence-tools]
sources:
  - "Residue and modification masses worked out by fibub from chemical formulas with exact isotope masses (general chemistry facts); proton mass from CODATA. Cleavage rules are the common textbook descriptions of each enzyme."
  - "Checked against pyteomics on the example and four random proteins: the trypsin, chymotrypsin and Asp-N peptide lists, all 369 monoisotopic masses (to 1 part in a billion), average masses, and the a, b and y ions."
  - "The example protein and measured peaks are made up for this tool; the protein is not a real one."
flow:
  - { icon: pencil, label: "Paste" }
  - { icon: scissors, label: "Digest" }
  - { icon: target, label: "Match peaks" }
  - { icon: table, label: "b/y ions" }
---

## What it does

Mass spectrometry identifies proteins from the masses of their pieces. This calculator does the sums you need around that, for any protein sequence:

- **In-silico digest**: cuts the protein the way an enzyme would, and lists every peptide with its position, missed cleavages, monoisotopic mass and m/z at charge 1+ and 2+.
- **Peptide mass fingerprint**: paste the m/z values you measured (for example from MALDI-TOF) and see which peaks match a peptide within your tolerance in ppm, and how much of the protein those peptides cover.
- **Fragment ions**: the b, y and a ions of any peptide at charge 1+ to 3+, with water and ammonia losses if you want them, as a table and a stick picture. Use it to read an MS/MS spectrum by hand.

For the whole protein's parameters, use the [[protein-calculator|protein parameter calculator]]; for isotope peaks of a small molecule, the [[isotope-pattern-calculator]].

## Options

- **Enzyme**: trypsin (cuts after K and R, but not before P), trypsin ignoring the P rule, Lys-C, Arg-C, Glu-C, Asp-N, chymotrypsin (after F, Y and W) and cyanogen bromide (after M).
- **Missed cleavages**: real digests often skip a site. Allowing 1 or 2 adds the longer peptides that join neighbours.
- **Shortest and longest peptide**: very short peptides are rarely seen and match too easily, so the default starts at 4 residues.
- **Carbamidomethyl cysteines**: tick this if you reduced and alkylated with iodoacetamide (adds C2H3NO, 57.0215, to every Cys). **Oxidised methionines** adds an oxygen to every Met.
- **Tolerance and charges** for matching: 10 ppm suits a modern instrument; older MALDI work often used 50 to 100 ppm.

## Worked example

Press **Use the example**. It loads a made-up protein of 136 amino acids and 13 made-up measured peaks. With trypsin, one missed cleavage and peptides of 4 to 40 residues, there are 27 peptides, 14 of them with no missed cleavage. The site in ...GHK-PTC... is not cut, because trypsin does not cut before proline.

The peptide DFSLQGECK (positions 16 to 24) has a monoisotopic mass of 1082.4703, so [M+H]⁺ is 1083.4775 and [M+2H]²⁺ is 542.2424. The measured peak 1083.4749 matches it with an error of −2.4 ppm. In total, 10 of the 13 peaks match at 10 ppm, one of them a peptide with a missed cleavage (DEYGKNHQVTSLPMCFR). The matched peptides cover 71.3 % of the sequence. The three peaks with no match stand for noise or modified peptides.

DFSLQGECK is also shown under **Fragment ions**: b2 is 263.1026 and y1 (the C-terminal K) is 147.1128.

## FAQ

**Monoisotopic or average?** Use monoisotopic masses for anything measured with isotope peaks resolved, which is most modern instruments. The average mass is in the CSV for very large peptides.

**Why doesn't my peak match?** Check the modifications (alkylation, oxidation), the charge, the enzyme's missed cleavages, and the tolerance. Phosphorylation, glycosylation and other modifications are not included.

**Is my data uploaded?** No. Everything runs in your browser and works offline.
