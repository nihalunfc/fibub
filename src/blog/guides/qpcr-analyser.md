---
title: "ΔΔCq and Pfaffl fold change explained, with standard curves"
summary: "How qPCR Cq values become fold changes: the 2^−ΔΔCq method, when to correct for efficiency, how a standard curve gives efficiency and copy numbers, and which checks to trust."
tools: [qpcr-analyser, pcr-master-mix, primer-checker, nucleic-acid-concentration, calibration-curve]
updated: 2026-11-10
sources:
  - "Livak and Schmittgen (2001), Methods 25: 402-408 (the 2^−ΔΔCT method); Pfaffl (2001), Nucleic Acids Res. 29: e45 (efficiency-corrected ratio); Vandesompele et al. (2002), Genome Biol. 3: research0034 (geometric mean of reference genes). Methods only, explained in fibub's own words."
  - "The worked example wells and dilution series are made up."
---

A real-time PCR machine hands you a column of Cq values, one per well. The [[qpcr-analyser]] turns that column into the answer you actually want: how much more or less of a gene's message a treated sample has than the control. It averages replicates, normalises to one or more reference genes, can correct for each gene's own efficiency, and fits standard curves. Before the run, set up your reactions with the [[pcr-master-mix]] calculator and check your primers with the [[primer-checker]].

## What it is

In each PCR cycle the target roughly doubles. The **Cq** (quantification cycle, also called Ct) is the cycle at which the glowing signal crosses a set threshold. More starting template means the threshold is reached sooner, so a **lower Cq means more template**. One cycle earlier means about twice as much.

Raw Cq values cannot be compared directly, because one sample may have had more RNA loaded. So each target is compared with a **reference gene** (a "housekeeping" gene whose level should not change with treatment):

- **ΔCq** = Cq of the target − Cq of the reference, within one sample.
- **ΔΔCq** = ΔCq of the sample − ΔCq of the control.
- **Fold change** = 2^−ΔΔCq.

That last step assumes **100 % efficiency**: an exact doubling every cycle. Real reactions are often less efficient. The **amplification factor** E is how many times the product grows per cycle (2 means perfect). The **Pfaffl** ratio uses each gene's own E:

ratio = E_target^(Cq control − Cq sample, target) ÷ E_ref^(Cq control − Cq sample, reference)

Efficiency comes from a **standard curve**: a dilution series of known amounts. Plot Cq against log₁₀(quantity) and fit a straight line. With slope s, efficiency = 10^(−1/s) − 1. A slope of about −3.32 is 100 %. The same line turns the Cq of an unknown into a quantity.

With several reference genes, the tool combines them by their geometric mean, which is steadier than relying on one.

## How to use it

1. Paste your wells into **Wells**, one per row: sample, gene, Cq. You can also open a CSV or spreadsheet. Wells marked "Undetermined", "N/A" or left blank are skipped and counted.
2. Type the reference gene names, separated by commas, in **Reference gene(s)**.
3. Choose the **Control sample**. Its fold change is set to 1.
4. Leave **Efficiencies** at *100 % for every gene (ΔΔCq)*, or choose *From the standard curves below*.
5. If you use curves, paste each dilution series into **Standard curves**: gene, quantity, Cq. Leave the quantity blank on a row to read an unknown off its gene's curve.
6. Read the headline, the facts (method, replicate spread, reference gene steadiness, late Cq warnings), the bar chart and the table. Open **Replicates** to see each group's mean and spread.
7. Save with **Download results (CSV)** or the report downloads.

## A worked example

A made-up experiment asks whether a heat shock raises a gene called HspA. Actin is the reference. Each well is run in duplicate.

| Sample | Gene | Cq |
|---|---|---|
| Control | HspA | 26.0, 26.2 |
| Control | Actin | 17.0, 17.2 |
| Heat | HspA | 22.9, 23.1 |
| Heat | Actin | 17.3, 17.1 |

**Means:** Control HspA 26.1, Control Actin 17.1, Heat HspA 23.0, Heat Actin 17.2 cycles.

**ΔCq:** Control 26.1 − 17.1 = **9.0**; Heat 23.0 − 17.2 = **5.8** cycles.

**ΔΔCq:** 5.8 − 9.0 = **−3.2** cycles.

**Fold change:** 2^3.2 = **9.19×**. The range from the replicate spread is about **8 to 10.6×**.

Now add standard curves. Five tenfold dilutions, from 100,000 down to 10 copies, give these Cq values:

- HspA: 17.55, 21.22, 24.83, 28.36, 32.04
- Actin: 15.02, 18.31, 21.58, 24.93, 28.19

The HspA line has a slope of **−3.612** (R² 0.99996), so its efficiency is 10^(1/3.612) − 1 = **89.2 %** (E = 1.892). Actin's slope is **−3.296**, about **101 %** (E = 2.011).

Switch **Efficiencies** to *From the standard curves*. The Pfaffl ratio is 1.892^3.1 ÷ 2.011^(−0.1) = 7.215 ÷ 0.9325 = **7.74×**. Correcting for HspA's lower efficiency brings the answer down by about a sixth. Add a row "HspA,,25.0" and the tool reads that unknown as about **880 copies**.

## Where it is used

- **Gene expression studies.** Comparing treated and untreated cells, tissues or plants.
- **Diagnostics research.** Measuring how much of a virus or bacterium is in a sample against a standard curve.
- **Food and environmental testing.** Counting copies of a marker gene, for example to detect a species in water.

The standard curve maths is the same straight line used in any lab assay. The [[calibration-curve]] tool covers that for absorbance and other readings.

## Common mistakes

- **Using a reference gene that responds to the treatment.** Check the "Reference genes" fact. If one moves by more than a cycle across samples, pick another or add a second.
- **Treating technical replicates as biological ones.** Wells with the same sample and gene are averaged as technical repeats. Give each biological replicate its own sample name.
- **Ignoring efficiency.** If target and reference efficiencies differ by more than a few per cent, ΔΔCq will be off, and more so for big changes.
- **Reading unknowns outside the curve.** A Cq beyond your lowest or highest standard is a guess. The tool marks it "outside the curve".
- **Trusting very late Cq values.** Above about 35 cycles the signal is noisy.

## Questions people ask

**Why does a fold change of 0.5 show as "down 2×"?** Half as much message is a twofold drop. The tool reports drops this way so up and down changes read on the same scale.

**What R² is good enough for a standard curve?** A common rule of thumb is 0.98 or higher. The tool flags curves below that, and efficiencies outside 90 to 110 %.

**Is the fold-change range a significance test?** No. It reflects the spread of the replicates. For a p-value, run a statistical test on the ΔCq values of biological replicates.
