---
title: "How to calculate DNA concentration from A260 absorbance"
summary: "Turn an A260 reading into ng/µL, check purity with 260/280 and 260/230, and get nM, copies per µL and a dilution, with a worked plasmid example."
tools: [nucleic-acid-concentration, solution-calculator, beer-lambert-calculator]
updated: 2026-11-10
sources:
  - "Conversion factors of 50 µg/mL (double-stranded DNA), 33 µg/mL (single-stranded DNA) and 40 µg/mL (RNA) per A260 unit over 1 cm, and the purity rules of thumb (260/280 near 1.8 for DNA, 260/230 near 2.0 to 2.2): general laboratory facts."
  - "Avogadro constant 6.02214076 × 10²³ mol⁻¹ (exact SI value)."
  - "The readings in the example are made up."
---

DNA concentration in ng/µL is the background-corrected A260 reading times 50 for double-stranded DNA, times any dilution, divided by the path length in cm. The [[nucleic-acid-concentration|nucleic acid concentration calculator]] does that for one sample or a whole batch, and adds the purity ratios, molarity, copy number and the volumes for a dilution.

## What you need

- Absorbance at 260 nm (A260) and 280 nm (A280). A230 and A320 make the result better if your instrument gives them.
- What you measured: double-stranded DNA, single-stranded DNA or RNA. Each has its own factor.
- Any dilution you made before reading, and the path length. Microvolume readers usually report values already scaled to 1 cm.
- For molarity or copies, the length of the DNA in base pairs and whether it is linear or a circular plasmid.

## Step by step

1. **Pick the sample type.** On the tool, choose double-stranded DNA. The factor box fills in 50 (33 for single-stranded DNA, 40 for RNA). Change it only if you have a better factor, such as the one on an oligo's data sheet.
2. **Set the dilution and path.** Type how many times you diluted the sample before reading, and the path length in cm.
3. **Enter the readings.** One row per sample: a name, A260, A280, then A230 and A320 if you have them. You can paste rows from a spreadsheet or open a CSV file.
4. **Give the size.** Type the length in bp and choose linear or circular. If you paste the exact sequence instead, its own mass is used.
5. **Set a dilution target (optional).** Choose a target in ng/µL, nM or copies/µL, and a final volume. The table then lists the stock and diluent volumes for each sample.

The maths the tool runs is the Beer–Lambert law with a fixed factor:

c (ng/µL) = (A260 − A320) × factor × dilution ÷ path length (cm)

Purity ratios use the same background correction: 260/280 = (A260 − A320) ÷ (A280 − A320), and likewise for 260/230. Then:

nM = c (ng/µL) ÷ molar mass (g/mol) × 10⁶
copies/µL = c × 10⁻⁹ × 6.022 × 10²³ ÷ molar mass

To make a working dilution by hand, the [[solution-calculator|dilution calculator]] uses the same C₁V₁ = C₂V₂ rule. For any other molecule, the [[beer-lambert-calculator]] handles absorbance with your own extinction coefficient.

## A worked example

You diluted a plasmid miniprep 1 in 5 and read it in a 1 cm cuvette: A260 0.620, A280 0.335, A230 0.300 and A320 0.012. The plasmid is 5,400 bp and circular.

Background-corrected A260 = 0.620 − 0.012 = 0.608.
Concentration = 0.608 × 50 × 5 ÷ 1 = **152 ng/µL**.

Purity:
- 260/280 = 0.608 ÷ (0.335 − 0.012) = 0.608 ÷ 0.323 = **1.88**
- 260/230 = 0.608 ÷ (0.300 − 0.012) = 0.608 ÷ 0.288 = **2.11**

Both sit in the usual range for clean DNA, so the tool leaves the note as OK.

For a 5,400 bp circle, the tool's molar mass from the average base pair mass is about 3,336,655 g/mol. So:

- Molarity = 152 ÷ 3,336,655 × 10⁶ ≈ **45.6 nM**
- Copies = 152 × 10⁻⁹ × 6.022 × 10²³ ÷ 3,336,655 ≈ **2.74 × 10¹⁰ copies/µL**

To make 50 µL at 20 ng/µL, you need 20 × 50 ÷ 152 = **6.58 µL** of stock plus **43.4 µL** of water or buffer.

## Check your answer

- One A260 unit of double-stranded DNA is about 50 ng/µL, so an A260 of 0.6 in a 1 in 5 dilution should give a stock of roughly 0.6 × 50 × 5 = 150 ng/µL. If your number is ten times off, look at the dilution factor first.
- Readings below about 0.02 absorbance units are too faint to trust; readings far above the instrument's linear range should be diluted and read again.
- A 260/280 well below 1.7 hints at protein or phenol; a 260/230 below 1.8 hints at salt or guanidine from the kit. A ratio above 2.0 for DNA can mean RNA is present.

## Questions people ask

**Why is the factor 50 for DNA but 40 for RNA?** The strands absorb differently. Paired bases in a double helix absorb less than free single strands, so double-stranded DNA needs more mass to reach one absorbance unit.

**Can I trust A260 for a PCR product?** It counts all nucleic acid, including leftover primers and free nucleotides. Clean the product up first, or use a dye-based assay that only sees double-stranded DNA.

**Do I need A320 at all?** No, but it removes background from bubbles, dust or a cloudy sample. Without it, the tool assumes zero background.
