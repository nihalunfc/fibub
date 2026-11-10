---
name: SAR table builder
num: 213
shelf: science
code: T212
section: medicinal-chemistry
title: "SAR table builder: R-group potency matrix, matched pairs, pIC50, ligand efficiency and LLE"
summary: "Paste a compound series with R-group columns and IC50, Ki or EC50 values. Get pIC50 for every compound, an R1 × R2 potency heatmap, matched pairs with the average effect of each substituent change, the best and worst group at each position, and ligand efficiency and LLE when you add heavy atoms and logP. Nothing is uploaded."
status: live
ads: false
order: 213
icon: table
works: offline
updated: 2026-11-09
related: [dose-response, binding-curve-fitter, drug-synergy, molecule-viewer, enzyme-kinetics-fitter]
sources:
  - "Formulas only (general medicinal chemistry): pIC50 = −log10(IC50 in mol/L); ligand efficiency LE = 2.303RT × pIC50 / heavy atoms with the usual rounded factor 1.37 kcal/mol (A. L. Hopkins, C. R. Groom and A. Alex, Drug Discov. Today 9 (2004) 430); lipophilic ligand efficiency LLE = pIC50 − logP (P. D. Leeson and B. Springthorpe, Nat. Rev. Drug Discov. 6 (2007) 881); matched pairs as compounds that differ at one position. No data or tables copied."
  - "Calculations written by fibub. Checked in the tests against an independent NumPy implementation on the example and six random made-up series (2 or 3 positions, repeats, < and > limits): every p value, LE, LLE, matched-pair change, group score and matrix cell agrees to 1e-9."
  - "The example series (IDs SAR-01 to SAR-25, groups, IC50s, heavy atom counts and cLogP) is made up for this tool and is not a real compound series."
flow:
  - { icon: table, label: "Series" }
  - { icon: calculator, label: "pIC50" }
  - { icon: chart, label: "Matrix" }
  - { icon: target, label: "Pairs" }
---

## What it does

A structure-activity relationship (SAR) table lists a compound series built on one core, with the groups that change at each position (R1, R2, ...) and how active each compound is. This page turns such a table into the views a medicinal chemist uses to decide what to make next:

- **p values.** IC50, Ki, EC50 or Kd in pM, nM, µM, mM or M become pIC50 (pKi, pEC50...) = −log<sub>10</sub>(value in mol/L), so 100 nM is 7.00, 10 nM is 8.00, and higher means more potent. Values typed as limits such as >10000 stay limits.
- **Potency matrix.** Pick one position for the rows and one for the columns. Each cell is the mean p value of the compounds with that pair of groups, shaded darker for more potent. Empty cells are combinations nobody has made yet.
- **Matched pairs.** Two compounds that differ at exactly one position form a matched pair. The change in potency (Δ) for that swap, with everything else the same, is the cleanest SAR evidence you have. The page lists every change (for example H → 4-Cl at R1) with the number of pairs, mean Δ, SD and range.
- **Best and worst groups.** For each position, every group gets a score: the mean Δ when it replaces any other group at that position, all else equal.
- **Ligand efficiency and LLE.** Add a heavy atom column (HA) and you get LE = 1.37 × pIC50 ÷ HA in kcal/mol per heavy atom. The 1.37 is 2.303RT near room temperature (1.364 at 298 K, 1.372 at 300 K); it is the rounded value used in most papers. Add logP or cLogP and you get LLE = pIC50 − logP.

It does not read structures: R groups are just labels, so names (4-Cl, morpholino) or SMILES fragments ([*]Cl) both work. Fit each compound's IC50 first with the [[dose-response|dose-response curve fitter]] or the [[binding-curve-fitter|binding curve fitter]], and look at a structure in the [[molecule-viewer|molecule viewer]].

## How to use it

1. **Series.** Paste your table from a spreadsheet or open a CSV or Excel file. The first row is the column names: an ID column, one column per R position, the activity with its unit in the header (for example `IC50 (nM)`, `Ki uM` or `pIC50`), and optionally `HA` and `logP` or `cLogP`. Any other column is treated as an R group. If the header has no unit, pick it under *Units of the activity*.
2. **pIC50.** Check the summary: the most potent compound, the p range and how many matched pairs were found.
3. **Matrix.** Choose the positions for rows and columns and whether to keep your order or put the most potent groups first.
4. **Pairs.** Pick a position to see its best and worst groups and every change between groups. Tap any column in the compound table to sort it. Download the table or the matched pairs as CSV, or the whole report as an image, PDF or Word file.

## Worked example

The example is a made-up series of 25 compounds with six aryl groups at R1 and five amines at R2, IC50 in nM, heavy atoms and cLogP. One compound, SAR-24, was only tested to 10 µM and is typed as >10000.

The summary reads **Most potent: SAR-12 (4-Cl, morpholino), pIC50 8.25 (5.6 nM)**. The page finds **87 matched pairs** covering **25 different substituent changes**. At R1 the best group is **4-Cl** (mean Δ +0.65 against the other groups) and the worst is **4-CN** (−0.52); at R2 the best is **morpholino** (+0.62) and the worst **NMe2** (−0.78). The change H → 4-Cl at R1 adds **+0.90** on average over 4 pairs, roughly an 8-fold gain in potency.

The change NHMe → morpholino at R2 averages **+0.59** over 6 pairs, but its pairs range from +0.11 to +1.43, and the biggest jump is with 4-Cl at R1. When a change helps much more in one context than another, the two groups are not simply adding up, and the matrix shows it as one cell that stands out. SAR-12 also has the best ligand efficiency, **0.45**, and the best LLE, **5.65**, so its gain does not come only from extra size or greasiness.

## Tips

- Use one assay and one unit for the whole series. Mixing an enzyme assay and a cell assay hides the SAR.
- A mean Δ from one or two pairs is a hint, not a rule. Look at the SD and the range before you trust it.
- Matched pairs ignore compounds that are only known as limits (>10 µM), because their real Δ is unknown.
- Repeat measurements of the same compound are averaged on the p scale, which is the geometric mean of the IC50s.

## FAQ

**Does it draw the molecules?** No. It works from your R-group labels, so it cannot check that a SMILES fragment is valid. Keep the labels consistent: "4-Cl" and "4-chloro" count as two groups.

**What LE value is good?** Many teams aim for about 0.3 kcal/mol per heavy atom or more, but targets differ. Compare compounds within the series rather than against a fixed line.

**Can I use more than two R positions?** Yes, up to eight. The matrix shows any two of them, averaged over the others, and matched pairs need every other position to match.

**Is anything sent anywhere?** No. The table is read and worked out in your browser and never leaves your device.
