---
name: Paleostress inversion
num: 869
shelf: science
code: T605
section: structural-geology
title: "Paleostress inversion"
summary: "Find the principal stress directions σ1, σ2, σ3 and the stress ratio from faults with striations by Michael's linear least-squares method, with bootstrap confidence, the misfit of every fault, P and T axes and a stereonet."
status: live
ads: true
order: 869
icon: compass
works: offline
updated: 2026-11-09
related: [stereonet, apparent-dip, phone-clinometer, earthquake-locator, bootstrap-permutation]
sources:
  - "Method: Michael, A. J. (1984), Determination of stress from slip data: faults and folds, Journal of Geophysical Research 89, B13, 11517-11526 (the method is described in words and formulas, no data copied)."
  - "Rake convention: Aki and Richards. Bootstrap: resampling faults with replacement (Efron)."
  - "Example: 24 synthetic faults made by fibub from a known stress tensor with a few degrees of noise."
flow:
  - { icon: table, label: "Faults" }
  - { icon: sigma, label: "Inversion" }
  - { icon: compass, label: "Stereonet" }
  - { icon: download, label: "Report" }
---

## What it does

Faults with striations (slickenlines) record how rock slid. If many faults moved under one uniform stress, the directions they slid in tell you that stress. This tool finds the **directions of the three principal stresses** (σ1 the most compressive, σ3 the least) and the **stress ratio**, which says whether σ2 is closer to σ1 or to σ3. It uses **Michael's (1984) linear least-squares method**, gives **bootstrap confidence** for every answer, the **misfit** of each fault, the **P and T axes**, and draws it all on a stereonet.

Collect fault and striation readings in the field with the [[phone-clinometer]], and plot them on the [[stereonet]] to check them before you invert.

## How to use it

1. Pick how each line is written:
   - **Strike, dip, rake**: rake in the Aki and Richards convention, measured in the fault plane from the strike direction: positive for reverse, negative for normal, 0 for left-lateral and ±180 for right-lateral.
   - **Strike, dip, striation trend and plunge, sense**: sense is N (normal), R (reverse or thrust), D (dextral) or S (sinistral). A striation a few degrees off the plane is projected onto it; more than 20° off, the line is skipped.
2. Choose strike (right-hand rule) or dip direction for the planes, then paste or type the faults, or open a CSV or Excel file.
3. Pick the number of **bootstrap resamples** and the **confidence**. Show or hide planes, slip lines, P and T axes, and the bootstrap cloud.
4. Read the axes, the stress ratio and the misfits, and download the report (image, PDF or Word) or the tables as CSV.

## How it works

Every fault gives three linear equations: the shear traction of the stress tensor on the plane should point along the slip and have length 1. That "same shear stress on every fault" assumption is what makes the problem linear. The five unknowns of the deviatoric tensor (trace zero) are solved by least squares, and the eigenvectors of the tensor are the principal axes. The stress ratio is shown both ways round: **Φ = (σ2 − σ3)/(σ1 − σ3)** and **R = 1 − Φ = (σ1 − σ2)/(σ1 − σ3)**. The bootstrap repeats the inversion on resampled sets of faults (seed 1, so the numbers do not change between visits) and reports the angle within which the chosen share of resampled axes falls.

## Worked example

The example holds 24 synthetic faults made from a known stress with σ1 plunging 10° towards 040 and Φ = 0.4, plus a few degrees of noise. The inversion gives **σ1 11° → 037**, **σ2 2° → 128**, **σ3 78° → 227** and **Φ = 0.44** (R = 0.56): reverse or thrust faulting, close to the stress that made the data. The mean misfit is 4.3°. With 1000 resamples, 95 % of the bootstrap σ1 axes fall within 5.2° of the best fit and Φ ranges from 0.37 to 0.49.

## Tips

- Use at least 10 faults with a good spread of orientations. Faults that all strike one way leave part of the stress unknown.
- Large misfits often mean a wrong sense of slip, a fault from another event, or a typing slip. Look at those rows first; if the data hold two events, split them and invert each set.
- The P and T axes of single faults are a quick check that does not assume one stress for all faults.

## Frequently asked questions

**Is this the full Michael method?** It is his linear inversion with bootstrap resampling. It does not choose between a fault plane and its auxiliary plane: it uses the planes you give.

**Why is my answer different from a grid-search method?** Methods weigh misfits differently; small differences within the confidence cones are normal.

**Is my data uploaded?** No. Everything runs in your browser and nothing leaves your device; the page works offline once loaded.
