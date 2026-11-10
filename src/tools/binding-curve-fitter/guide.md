---
name: Binding curve fitter
num: 114
shelf: science
code: T114
section: biochemistry
title: "Binding curve fitter: Kd and Bmax from saturation binding, Hill, two sites, Scatchard and Cheng–Prusoff Ki"
summary: "Paste ligand concentrations with total and non-specific binding, or a titration signal, and fit one site, one site with non-specific binding, two sites, Hill or tight binding with ligand depletion. Get Kd, Bmax and the Hill coefficient with errors, a model comparison by AICc, the Scatchard plot and an IC50 to Ki converter."
status: live
ads: true
order: 3
icon: curve
works: offline
updated: 2026-11-08
related: [enzyme-kinetics-fitter, dose-response, buffer-recipe-calculator, calibration-curve]
sources:
  - "Binding equations: the standard one-site, two-site, Hill and quadratic (ligand depletion) binding equations of receptor pharmacology and biophysics textbooks."
  - "IC50 to Ki: the Cheng–Prusoff relation, a standard formula (credited by name)."
  - "Model comparison: the small-sample Akaike information criterion (AICc), standard statistics."
  - "Example data: simulated by fibub (Bmax 1200, Kd 2.5, non-specific slope 15)."
flow:
  - { icon: table, label: "Binding" }
  - { icon: curve, label: "Fit" }
  - { icon: sigma, label: "Compare" }
  - { icon: calculator, label: "Ki" }
---

## What it does

A binding experiment measures how much ligand is bound to a receptor, protein or DNA as the ligand concentration rises. The curve levels off at **Bmax**, the number of sites. The concentration that fills half the sites is the **dissociation constant Kd**, where a lower Kd means tighter binding. This tool fits those numbers directly by non-linear least squares.

It fits five models:

- **One site:** B = Bmax·L / (Kd + L).
- **One site + non-specific:** adds a straight line, NS·L, for total binding measured without a separate blank.
- **Two sites:** a high-affinity and a low-affinity class of site, each with its own Kd and Bmax.
- **Hill:** a sigmoid for cooperative binding. A Hill coefficient h above 1 means binding at one site helps the next.
- **Tight binding:** the exact quadratic for when the receptor concentration is close to Kd or above it, so binding uses up a noticeable part of the ligand. The first column is then the total ligand added, and the second is any signal (fluorescence, anisotropy, heat) that changes in step with binding.

The best model is chosen as the simplest one within 2 AICc units of the lowest score whose values are all well defined. The comparison table shows how strongly the data support each one.

For enzyme rates rather than binding, use the [[enzyme-kinetics-fitter]]; for a four-parameter curve with an IC50, the [[dose-response|dose-response fitter]].

## How to use it

1. Paste two columns (ligand, bound) or three (ligand, total, non-specific), or open a CSV, TSV or Excel file. With three columns, specific binding is total minus non-specific.
2. Type your units. They only label the results.
3. Leave the model on **Best**, or pick one. For a tight-binding titration, choose that model and enter the receptor concentration.
4. Check the facts: the ligand needed to fill 90 % and 99 % of sites, any warning that the ligand range stops too low, and the Scatchard line for comparison.
5. If you measured a competitor's IC50 against a labelled ligand, enter it in the **IC50 to Ki** box. The Kd comes from your fit.

## Worked example

The example is a simulated radioligand saturation study with 9 concentrations from 0.1 to 32 nM, total and non-specific binding, and about 3 % noise. The tool fits the specific binding with one site, giving **Kd 2.51 nM and Bmax 1204 fmol/mg**. Two sites and Hill add nothing. Half the sites are filled at 2.51 nM, 90 % at 22.6 nM and 99 % at 249 nM. The Scatchard line gives a similar Kd of 2.59 nM and Bmax of 1214 fmol/mg.

If you paste only the first two columns, which hold total binding, the one site + non-specific model wins clearly. It recovers Kd 2.53 nM and a non-specific slope of 14 fmol/mg per nM.

For a competitor with an IC50 of 40 nM measured at 2 nM labelled ligand, Ki = 40 / (1 + 2/2.51) = 22.3 nM.

## Questions

**Why not just use the Scatchard plot?** Dividing bound by free magnifies the errors of the lowest points and puts the measured value on both axes. The straight line is still a useful check: if it curves, you may have two sites, cooperativity or leftover non-specific binding. Report the non-linear fit.

**My Bmax has a huge error.** The highest ligand concentration is probably below about 5 × Kd, so the curve never levels off. The tool warns when this happens.

**When do I need tight binding?** When the receptor concentration is above about a tenth of Kd. Then the free ligand is noticeably less than the total you added, and the simple models give a Kd that is too high.

**Is anything sent anywhere?** No. Your data stays in your browser, and the page works offline once loaded.
