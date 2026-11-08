---
name: Isotope pattern calculator
num: 80
shelf: science
section: analytical-chemistry
title: "MS isotope pattern and adduct calculator: exact m/z, isotope peaks and ppm error"
summary: "Exact m/z of [M+H]+, [M+Na]+, [M−H]− and other ions, the full isotope pattern at your instrument's resolving power, and a check of your measured peaks with the ppm error."
status: live
ads: true
order: 5
icon: chart
works: offline
updated: 2026-11-08
related: [molar-mass-calculator, equation-balancer, calibration-curve, spectral-line-identifier]
flow:
  - { icon: pencil, label: "Formula" }
  - { icon: target, label: "Ion" }
  - { icon: chart, label: "Pattern" }
---

## What it does

A mass spectrometer weighs ions, not molecules, and it sees every isotope separately. A molecule of morphine does not give one peak but a cluster: most molecules hold only ¹²C, some have one ¹³C, a few have two, and so on. The exact masses and the heights of those peaks are a fingerprint of the formula. This calculator works them out from the formula:

- **Exact m/z of the ion** you choose: the protonated [M+H]⁺, sodium and potassium adducts, ammonium, the radical cation of electron ionisation, water loss, doubly charged ions, dimers, and the negative ions [M−H]⁻, chloride, formate and acetate. Electron masses are included, as they should be at ppm accuracy.
- **The isotope pattern**, by nominal mass (M, M+1, M+2, …) or as **fine structure**, where you can see that ¹³C and ¹⁵N make slightly different M+1 peaks.
- **A profile spectrum** at your instrument's resolving power, so you can see what will merge into one peak.
- **A comparison with your measured peaks**: the ppm error of each, and how well the heights match.
- **Every common ion** of the molecule in one table, handy when you are hunting for your compound in a spectrum.

## How to use it

1. Type the neutral formula, such as C17H19NO3. Capitals matter; brackets, isotope labels like [13C] and D for deuterium work.
2. Choose the ion. [M+H]⁺ is the usual one in positive electrospray, [M−H]⁻ in negative.
3. Set your instrument's resolving power (m/Δm at half height).
4. Paste your measured peaks, m/z and intensity, to check the match.

## Worked example

Morphine, C17H19NO3, in positive electrospray gives [M+H]⁺ = C17H20NO3⁺. Its monoisotopic m/z is 17 × 12 + 20 × 1.007825 + 14.003074 + 3 × 15.994915 − 0.000549 = **286.14377**. The M+1 peak is 19.1 % of the main one, mostly from the 17 carbons (about 1.1 % each), and M+2 is 2.3 %.

If your spectrometer shows the main peak at 286.1436, the error is (286.1436 − 286.14377) ÷ 286.14377 × 10⁶ = −0.6 ppm, well inside the 5 ppm usually asked for in publications.

Halogens stand out. Dichloromethane's radical cation has peaks in the ratio 100 : 64 : 10 at M, M+2 and M+4, and a dibromo compound shows 51 : 100 : 49.

## Questions

**Why is the tallest peak not the monoisotopic one for my protein?** With hundreds of carbons, a molecule with at least one ¹³C is more likely than one with none. Bovine insulin's tallest peak is M+3.

**What resolving power do I need for fine structure?** Separating ¹³C from ¹⁵N at M+1 needs a mass difference of 0.0063 u to show, so around 100,000 or more at m/z 500.

**How accurate are the abundances?** The natural isotope abundances are the IUPAC representative values, packaged by the open-source chemical-elements data set (cheminfo, MIT licence). Real samples vary slightly, especially for boron, sulfur and lithium. Everything runs in your browser; nothing is uploaded.
