---
title: "How to work out a protein's mass, pI and extinction coefficient"
seoTitle: "Protein mass, pI and extinction coefficient | fibub"
summary: "What molecular weight, isoelectric point, net charge and the 280 nm extinction coefficient mean, and how to get them from a sequence in your browser."
tools: [protein-calculator, peptide-mass-calculator, beer-lambert-calculator, buffer-recipe-calculator]
updated: 2026-11-10
sources:
  - "Residue formulas, IUPAC standard atomic weights and the per-residue 280 nm values for Trp (5,500), Tyr (1,490) and cystine (125 M⁻¹ cm⁻¹) are general chemistry and laboratory facts, as used by the tool."
  - "The pKa values in the example are the tool's own rounded default set, which differs a little from other programs."
  - "The 26-residue peptide in the worked example is made up for this article; it is not a real protein."
---

The Protein parameter calculator turns a sequence of one-letter amino acid codes into the numbers you need at the bench: how heavy the protein is, which pH leaves it with no charge, how strongly it absorbs light at 280 nm, and what concentration a spectrophotometer reading means. It is for students, lab technicians and anyone planning a purification, a gel or a mass spectrometry run. Once you have its numbers, cut the protein into peptides with the [[peptide-mass-calculator]], make the buffer you chose with the [[buffer-recipe-calculator]], or check any absorbance sum with the [[beer-lambert-calculator]].

## What it is

A protein is a chain of amino acids. When two amino acids join, a water molecule leaves, so each link in the chain is a **residue**: the amino acid minus one water. Add up the formulas of all the residues, add one water back for the two ends, and you have the protein's chemical formula. From that formula come two masses:

- **Average mass** uses each element's normal mix of isotopes. It is measured in daltons (Da; 1 Da is about the mass of one hydrogen atom).
- **Monoisotopic mass** uses only the lightest isotope of each element (carbon-12, nitrogen-14 and so on). It is the first peak a mass spectrometer shows.

**Charge** comes from groups that gain or lose a proton: the two chain ends and the side chains of Asp, Glu, His, Cys, Tyr, Lys and Arg. Each group has a **pKa**, the pH at which half of that group carries its proton. For a group that turns positive, the share charged at a given pH is 1 ÷ (1 + 10^(pH − pKa)); for one that turns negative it is 1 ÷ (1 + 10^(pKa − pH)). Adding these up gives the **net charge**. The **isoelectric point (pI)** is the pH where the net charge is exactly zero.

**Extinction coefficient (ε)** says how strongly the protein absorbs 280 nm ultraviolet light. Almost all of it comes from tryptophan, tyrosine and cystines (pairs of cysteines joined by a disulfide bond):

ε = (number of Trp × 5,500) + (number of Tyr × 1,490) + (number of cystines × 125), in M⁻¹ cm⁻¹.

Then the Beer-Lambert law, A = ε × c × l, turns a reading into a concentration: A is the absorbance (no unit), c the molar concentration and l the path length in cm.

## How to use it

1. Paste your sequence in the box, or press **Open a FASTA file**. Headers, spaces and numbers are ignored. If the file holds several proteins, pick one from **Protein in the file**.
2. Set **pH for the charge** to the pH of your buffer.
3. Set **Disulfide bonds** to how many cysteine pairs are joined. Use 0 for a protein in reducing sample buffer.
4. Read the **Parameters**: masses, formula, pI, net charge, ε and the absorbance of a 1 mg/mL solution.
5. Look at the **Charge against pH** curve to see how quickly the charge changes near the pI.
6. Under **Concentration from A280**, type your blank-corrected **Absorbance at 280 nm** and **Path length (cm)** to get µM and mg/mL. **Download composition (CSV)** saves the amino acid counts.

To match another program, type its values under **pKa values and extinction coefficients**.

## A worked example

Take a made-up peptide of 26 residues:

MASKWEYLGHRCDTPVYKAECLNGSW

It has 2 Trp, 2 Tyr and 2 Cys. Paste it with pH 7 and 0 disulfide bonds. The calculator reports:

- **Formula:** C135H198N36O39S3. **Average mass:** 3,045.46 Da. **Monoisotopic mass:** 3,043.378 Da.
- **ε (reduced):** 2 × 5,500 + 2 × 1,490 = 13,980 M⁻¹ cm⁻¹.
- **A280 of 1 mg/mL:** 13,980 ÷ 3,045.46 = 4.590 in a 1 cm cell.
- **pI:** 7.16, and the net charge at pH 7 is +0.08. On the curve the charge is about +1.31 at pH 5 and −2.31 at pH 9.

Now say your sample reads A280 = 0.35 in a 1 cm cuvette. The concentration is 0.35 ÷ (13,980 × 1) = 2.504 × 10⁻⁵ M, which is **25.04 µM**. Multiply by the mass: 2.504 × 10⁻⁵ mol/L × 3,045.46 g/mol = **0.0762 mg/mL**.

Set disulfide bonds to 1 and three things move: the formula loses two hydrogens (C135H196N36O39S3, 3,043.45 Da), ε rises to 14,105 M⁻¹ cm⁻¹, and with no free cysteines left to lose a proton, the pI rises to 7.61.

## Where it is used

- **Protein purification.** Ion exchange columns bind proteins by charge. Knowing the pI tells you whether to use a cation exchanger (buffer below the pI, protein positive) or an anion exchanger (buffer above it).
- **Measuring concentration.** A280 with the right ε is the quickest way to measure a pure protein without a dye. For mixtures, use a dye method such as the [[protein-assay]].
- **Mass spectrometry.** The monoisotopic mass is what you compare with the first peak of an intact protein or a peptide.
- **Gels.** The average mass in kDa is the band position you expect on SDS-PAGE, before any modifications.

## Common mistakes

- **Leaving the signal peptide or a tag in.** If your protein is made with a His-tag or has a leader that is cut off, the sequence you paste must match the protein in the tube. Remove or add those residues first.
- **Using the oxidised ε for a reduced protein.** In buffer with DTT or another reducing agent, set disulfide bonds to 0. The difference is small but adds up for proteins with many cystines.
- **Forgetting the blank.** The absorbance you type should be your sample minus the buffer alone. Dilute readings above about 1.5.
- **Treating pI as exact.** Different pKa sets move the pI by a few tenths, and folding changes real pKa values. Use it to choose a buffer range, not to two decimal places.

## Questions people ask

**Why does my protein run at a different size on a gel?** Gels measure how a protein moves, not its mass. Very acidic proteins, glycosylated proteins and some membrane proteins run higher or lower than their true mass.

**Can I use it for a short peptide?** Yes. The sums are the same. For peptides with no Trp or Tyr, ε is zero and A280 cannot give a concentration; measure at 205 nm or use another method.
