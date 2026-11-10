---
title: "Peptide mass calculator: tryptic digest, m/z and b and y ions"
summary: "How an in-silico digest works, how to turn peptide masses into m/z, match measured peaks by ppm error, and read b and y fragment ions, with a worked example."
tools: [peptide-mass-calculator, protein-calculator, isotope-pattern-calculator, sequence-tools]
updated: 2026-11-10
sources:
  - "Monoisotopic residue masses, the proton mass and the carbamidomethyl shift (+57.0215 Da on cysteine): standard chemistry and mass spectrometry values."
  - "Trypsin cleavage rule (after K or R, not before P) and b and y ion definitions: standard proteomics."
  - "The protein and peaks in the worked example are made up for teaching; the protein is not a real one."
---

The peptide mass calculator cuts a protein into peptides the way an enzyme would, lists the mass of each piece, and checks which peaks in your mass spectrum fit those pieces. It also lists the fragment ions of any one peptide, so you can label an MS/MS spectrum by hand. It is for students learning proteomics, lab staff confirming a protein by peptide mass fingerprint, and anyone checking a vendor's report. For the whole protein's size and charge, use the [[protein-calculator]]; to see the isotope peaks around one mass, try the [[isotope-pattern-calculator]]; and to translate a gene into the protein first, the [[sequence-tools]].

## What it is

A mass spectrometer weighs ions. Whole proteins are awkward to weigh, so the usual trick is to cut the protein with an enzyme and weigh the pieces.

**Trypsin**, the most common choice, cuts after lysine (K) and arginine (R), except when the next residue is proline (P). Because the rule is fixed, you can predict every piece from the sequence alone. That is an **in-silico digest**.

A peptide's **monoisotopic mass** is the sum of its residue masses, using the most common isotope of each element, plus one water (H₂O) for the two ends. The instrument does not see the neutral peptide. It sees an ion carrying z extra protons, at

m/z = (M + z × 1.00728) ÷ z

where M is the neutral mass, z the charge and 1.00728 Da the mass of a proton.

To match a measured peak, the tool works out the **error in ppm** (parts per million): (measured − calculated) ÷ calculated × 1,000,000. A peak matches when the error is inside your tolerance. **Sequence coverage** is the share of residues found in at least one matched peptide.

Inside the instrument, a peptide can also break along its backbone. Pieces holding the start (N-terminus) are **b ions**; pieces holding the end (C-terminus) are **y ions**. **a ions** are b ions that have lost CO. The gaps between neighbouring b or y ions spell out the residues.

## How to use it

1. Paste a protein in one-letter code, or open a FASTA file. Only the first protein in a file is used. **Use the example** loads a made-up protein with peaks.
2. Choose the **Enzyme**, the number of **Missed cleavages** (0 to 3) and the **Shortest** and **Longest peptide** in residues.
3. Tick or untick the two modification boxes: alkylated cysteines (on by default) and oxidised methionines.
4. Read the peptide table: position, missed cleavages, mass, and m/z at 1+ and 2+. Download it as CSV if you need average masses or 3+ values.
5. Paste your measured m/z values, one per line, and set the **Tolerance (ppm)** and **Charges**. The tool lists matches and highlights the covered residues.
6. Tap a peptide in the table, or type one, to see its a, b and y ions at the **Fragment charge** you choose, with an option for water and ammonia losses.

## A worked example

A made-up 31-residue protein: MSTAGKLDEWRPGHEAFKNVSDCLRAYGTEK. Use trypsin, 1 missed cleavage, peptides of 4 to 40 residues, cysteines alkylated.

**Digest.** Trypsin cuts after K6, K18 and R25; K31 is already the end of the protein. The R at position 11 is followed by P, so it is not cut. That gives 7 peptides, 4 with no missed cleavage: MSTAGK, LDEWRPGHEAFK, NVSDCLR and AYGTEK.

**One peptide.** NVSDCLR (positions 19 to 25) has a neutral mass of 862.3967 Da with its alkylated cysteine. Without the alkylation, it would be 805.3752 Da, exactly 57.0215 Da less. At charge 1+:

m/z = (862.3967 + 1.00728) ÷ 1 = 863.4040

At 2+: (862.3967 + 2 × 1.00728) ÷ 2 = 432.2056.

**Matching.** Suppose you measured four peaks: 863.4031, 1484.7302, 668.3261 and 1100.5000, with 10 ppm tolerance and charges 1+ and 2+.

- 863.4031 matches NVSDCLR: (863.4031 − 863.4040) ÷ 863.4040 × 10⁶ = −1.0 ppm.
- 1484.7302 matches LDEWRPGHEAFK at +1.4 ppm.
- 668.3261 matches AYGTEK at +1.7 ppm.
- 1100.5000 matches nothing.

Three of four peaks match. Together they cover positions 7 to 31, which is 25 of 31 residues, or 80.6 % coverage.

**Fragments.** For NVSDCLR at 1+, b2 (NV) is 214.1186 and y1 (R) is 175.1190. The y2 ion (LR) is 288.2030, so y2 − y1 = 113.084, the mass of leucine (or isoleucine, which weighs the same).

## Where it is used

- **Protein identification:** peptide mass fingerprinting with MALDI-TOF, still common in teaching labs and for quick checks.
- **Quality control:** confirming that a made protein, such as an antibody or enzyme, has the expected sequence.
- **Targeted assays:** choosing peptides and their fragment ions to monitor in a triple-quadrupole method.
- **Checking modifications:** a peak shifted by a fixed amount (+15.995 Da for an oxidised methionine) points to a change on that peptide.
- **Teaching:** the same mass arithmetic underlies isotope work in chemistry and forensic drug testing.

## Common mistakes

- **Wrong cysteine setting.** If you did not alkylate, untick the box, or every Cys-containing peptide will be 57 Da too heavy.
- **Using average masses for high-resolution data.** Match monoisotopic m/z when isotope peaks are resolved.
- **Setting the tolerance too wide.** At 100 ppm, random peaks start to match. Use what your instrument really achieves.
- **Forgetting other charges.** Electrospray often gives 2+ and 3+ ions. Include them in **Charges**, or many peaks will look unmatched.
- **Reading a single match as proof.** One peptide can fit by chance. Look for several matches and good coverage.

## Questions people ask

**Why does trypsin skip K or R before P?** Proline's ring shape stops the enzyme from cutting that bond well, so the rule is built into the digest.

**Can it tell leucine from isoleucine?** No. They have the same formula and the same mass, so no mass-only method can separate them.

**What does a missed cleavage mean?** The enzyme left one site uncut, so two neighbouring peptides stay joined. Allowing one or two adds those longer pieces to the list.
