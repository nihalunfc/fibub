---
name: qPCR analyser
num: 165
shelf: science
section: molecular-biology
title: "qPCR analyser: ΔΔCq fold change, efficiency-corrected (Pfaffl) expression with several reference genes, and standard curves"
summary: "Paste sample, gene and Cq for every well. Get fold changes against a control sample with 2^−ΔΔCq or efficiency correction, normalised to one or more reference genes, with replicate checks and a bar chart. Fit standard curves for slope, efficiency and R², and read unknown quantities off them."
status: live
ads: true
order: 13
icon: chart
works: offline
updated: 2026-11-09
related: [pcr-master-mix, nucleic-acid-concentration, sequence-tools, calibration-curve]
sources:
  - "Livak and Schmittgen (2001), 2^−ΔΔCT method, and Pfaffl (2001), efficiency-corrected ratio, cited for the methods only; several reference genes combined by their geometric mean as in Vandesompele et al. (2002). Written by fibub."
  - "Efficiency = 10^(−1/slope) − 1 from a least-squares standard curve. The 90–110 %, R² 0.98, 0.5-cycle and 35-cycle checks are common rules of thumb, not a standard."
  - "Checked in the tests against scipy.stats.linregress and an independent NumPy calculation. The example wells and curves are made up."
flow:
  - { icon: table, label: "Wells" }
  - { icon: target, label: "References" }
  - { icon: curve, label: "Efficiency" }
  - { icon: chart, label: "Fold change" }
---

## What it does

Real-time PCR gives a Cq (or Ct) for each well: the cycle where the signal crosses a threshold. Lower Cq means more starting template. This page turns a plate's worth of Cq values into the numbers you report:

- **Relative expression.** For each target gene and sample, the fold change against a control sample, normalised to one or more reference (housekeeping) genes. With 100 % efficiency this is the classic **2^−ΔΔCq** method; with efficiencies from standard curves it is the **efficiency-corrected (Pfaffl)** ratio. Several reference genes are combined by their geometric mean.
- **Replicate checks.** Technical replicates are averaged; groups that spread more than 0.5 cycles, Cq values above 35, and reference genes that drift by more than a cycle across samples are flagged.
- **Standard curves.** For each gene's dilution series: slope, intercept, R² and efficiency with a ± 1 SE range, a plot, and the quantity of any unknowns.

Set up the reactions with the [[pcr-master-mix]], and check the primers with the [[primer-checker]].

## How to use it

1. **Wells.** One row per well: sample, gene, Cq. Paste from your instrument's export or open a CSV or spreadsheet. "Undetermined" wells are skipped and counted.
2. **References and control.** Type the reference gene names, separated by commas, and pick the control sample (its fold change is 1).
3. **Efficiencies.** Keep 100 % for ΔΔCq, or choose *From the standard curves* and paste each gene's dilution series below (gene, quantity, Cq). Leave the quantity blank to quantify an unknown.
4. **Read the results.** The bar chart is on a log scale: bars above the 1× line are up-regulated, below are down. Whiskers show ± 1 SD from the replicates.

## Worked example

The made-up example has three samples (Control, Drug A, Drug B), two targets (GeneX, GeneY) and two references (Ref1, Ref2), in triplicate. In Drug A, GeneX averages 22.13 against 24.20 in the control, while the references barely move, so ΔΔCq is about −2.17 and **GeneX is up 4.49×**. GeneY goes the other way, down about 2.1×. One Drug B GeneX well (24.3) is 0.9 cycles from its partners, so that group is flagged.

The GeneX standard curve has a slope of −3.37 (R² 0.9997), which is **98.0 % efficiency**; an unknown at Cq 20.0 reads as about 37,100 copies.

## Good to know

- The fold-change range uses the sample's replicate SDs, as in the ΔΔCq method; for significance, run a test on the ΔCq values of biological replicates.
- Efficiency correction matters most when target and reference efficiencies differ, and when the change is large.
- Reference genes should not respond to your treatment. Check the "Reference genes" line.

## FAQ

**Ct or Cq?** Same thing. Cq is the name used in the MIQE guidelines.

**Can I use biological replicates?** Give each one its own sample name, or average them first. Wells with the same sample and gene are treated as technical replicates.

**Is my data uploaded?** No. Everything runs in your browser.
