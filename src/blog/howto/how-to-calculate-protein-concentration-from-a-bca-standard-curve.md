---
title: "How to calculate protein concentration from a BCA standard curve"
summary: "Subtract the blank, fit a line through your BSA standards, solve it for each sample and multiply by the dilution. A worked BCA example with loading volumes for a gel."
tools: [protein-assay, calibration-curve, protein-calculator]
updated: 2026-11-10
sources:
  - "BCA assay principle (protein reduces Cu²⁺ to Cu⁺, which forms a purple complex with bicinchoninic acid, read near 562 nm): standard biochemistry."
  - "Least-squares straight line and quadratic fits: standard statistics."
  - "Worked example absorbances: made up for this article, not taken from any kit insert."
---

Take the blank reading away from every absorbance, fit a straight line (or a gentle curve) through your BSA standards, solve that line for each sample's absorbance, and multiply by the sample's dilution factor. The [[protein-assay]] page does all four steps from a pasted table, and also tells you how many µL to load for a set amount of protein.

## What you need

- **Standards of known concentration**, usually BSA (bovine serum albumin), for example 0, 125, 250, 500, 750, 1000 and 1500 µg/mL, made up in the same buffer as your samples.
- **Absorbance readings at about 562 nm** for every standard and sample, ideally in duplicate or triplicate.
- **The dilution factor of each sample.** A lysate diluted 1 part in 5 has a factor of 5; an undiluted sample has 1.

## Step by step

The colour in a BCA assay rises almost in proportion to protein over the usual range, so a straight line is the starting point:

**net A = intercept + slope × c**

where net A is the absorbance after the blank is taken away and c is the protein concentration. Rearranged for a sample:

**c in the assay = (net A − intercept) ÷ slope**

**c in the original sample = c in the assay × dilution factor**

At high concentrations the curve bends slightly downwards, so if the top standards fall below the line a quadratic fits better.

With the tool:

1. In **Standards**, type or paste one standard per line: concentration first, then each absorbance, separated by commas or tabs.
2. Pick the **Concentration unit** (µg/mL or mg/mL), the **Curve** (Straight line, Quadratic or Point to point) and the **Blank**. "The 0 standard" uses the mean of your zero standard.
3. In **Samples**, type one line per sample: a name, the dilution factor, then each absorbance.
4. Optionally fill in **Protein to load (µg)** and **Final volume (µL)**.
5. Read the curve's R² and equation, then the **Samples** and **Standards read back** tables.

## A worked example

A BCA plate gives these duplicate readings at 562 nm (made-up numbers):

| BSA (µg/mL) | 0 | 125 | 250 | 500 | 750 | 1000 | 1500 |
|---|---|---|---|---|---|---|---|
| A562 | 0.098, 0.102 | 0.198, 0.206 | 0.301, 0.293 | 0.497, 0.509 | 0.688, 0.676 | 0.861, 0.873 | 1.189, 1.201 |

A cell lysate, diluted 1 in 5, reads 0.612 and 0.624.

**Blank.** The zero standard averages 0.100, so 0.100 comes off every reading. The lysate's mean of 0.618 becomes a net absorbance of 0.518.

**Line.** With Straight line chosen, the page fits net A = 0.01669 + 0.0007343 c, with R² 0.99796.

**Solve.** (0.518 − 0.01669) ÷ 0.0007343 = about **683 µg/mL** in the assay well. Times the dilution of 5, the lysate holds about **3,413 µg/mL**, or 3.41 mg/mL.

**Load.** With 30 µg to load and a 20 µL final volume, the table gives **8.79 µL** of lysate topped up with 11.2 µL of buffer.

The **Standards read back** table puts each standard's own mean through the line. Here every one lands within 10 % of its true value (the 125 µg/mL standard reads 116, or 93 %), so the line is acceptable. Switch the curve to Quadratic and R² rises to 0.99972, every standard reads back within 3 %, and the lysate comes out at 3,292 µg/mL, about 3.5 % lower. Both pass; the quadratic follows the slight bend at the top better.

## Check your answer

- **The sample should sit inside the standards.** 683 µg/mL in the well lies between the 500 and 750 standards, the reliable middle of the curve. The table flags any sample above the top standard or below the lowest one.
- **Do a rough read by eye.** A net absorbance of 0.518 lies between the 750 standard (net 0.582) and the 500 standard (net 0.403), a little nearer 750. An answer around 650 to 700 µg/mL is what you would expect.
- **Remember the dilution, once.** Forgetting it gives 683 instead of 3,413; applying a 1 in 5 dilution twice gives five times too much.

For a straight-line fit with a detection limit and quantitation limit, try the [[calibration-curve]] tool. To see how far a purified protein's colour per µg may differ from BSA, look up its sequence-based extinction coefficient with the [[protein-calculator]].

## Questions people ask

**Should I use a straight line or a curve for BCA?** Start with the straight line, then look at the standards read back. If the top or bottom standards miss by more than about 10 %, use the quadratic, or leave out the highest standard.

**Why is my blank so high?** BCA reagent has some colour of its own, and reducing agents such as DTT or chelators such as EDTA in the buffer raise it further. That is why the standards should be made in the same buffer as your samples.

**Can I read my samples with a Bradford standard curve instead?** No. Each assay needs its own standards read on the same plate at the same time, because the colour changes with reagent batch, temperature and incubation time.
