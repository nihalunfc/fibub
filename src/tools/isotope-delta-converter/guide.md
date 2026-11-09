---
name: Isotope delta converter
num: 122
shelf: science
section: geochemistry-and-geochronology
title: "Isotope delta converter: δ to ratio, VPDB to VSMOW, fractionation, Δ17O and mixing"
summary: "Convert stable isotope δ values (δ²H, δ¹³C, δ¹⁵N, δ¹⁷O, δ¹⁸O, δ³⁴S, δ¹¹B, δ³⁷Cl) to and from isotope ratios, move δ¹⁸O between the VPDB and VSMOW scales exactly, work out α, ε and 1000 ln α, triple-oxygen Δ′¹⁷O, and two-source mixing with different concentrations."
status: live
ads: true
order: 2
icon: percent
works: offline
updated: 2026-11-08
related: [radiometric-age-calculator, isotope-pattern-calculator, radiocarbon-calibration, uncertainty-calculator]
sources:
  - "Delta notation, scale changes, fractionation factors and Δ′17O: standard stable isotope geochemistry, written from the definitions (IUPAC recommendations on delta notation)."
  - "Reference ratios of VSMOW, VPDB, AIR, VCDT, NIST SRM 951 and SMOC, and VPDB = +30.92 ‰ on the VSMOW scale: commonly adopted reference constants, shown on the page with a note that labs differ slightly. Checked 2026-11-08."
  - "Worked examples written by fibub with made-up numbers."
flow:
  - { icon: percent, label: "δ value" }
  - { icon: convert, label: "Ratio" }
  - { icon: compass, label: "Scale" }
  - { icon: flask, label: "Mixing" }
---

## What it does

Stable isotopes are reported as **δ values** in per mil (‰): how far a sample's heavy-to-light isotope ratio sits above or below an agreed standard.

δ = (R sample ÷ R standard − 1) × 1000

A seawater-like sample is near 0 ‰ for δ¹⁸O. Rain in cold places is strongly negative, and marine limestone is around +30 ‰ on the same scale. This tool does the everyday sums around δ in five boxes.

1. **δ and ratio**: turn a δ into an absolute ratio and heavy-isotope share, or a ratio into δ, for common standards: VSMOW (water), VPDB (carbonate), AIR (nitrogen), VCDT (sulfur), NIST SRM 951 (boron) and SMOC (chlorine).
2. **Change the reference scale**: exact conversion between δ¹⁸O on VPDB and VSMOW, or between any two standards when you know one on the other's scale.
3. **Fractionation**: from two phases' δ values, the fractionation factor α, ε, 1000 ln α and the simple difference Δ.
4. **Triple oxygen**: Δ′¹⁷O from δ¹⁷O and δ¹⁸O with your choice of reference slope λ.
5. **Mixing**: the δ of a mixture of two sources that carry different amounts of the element, and the fraction needed for a target δ, with the mixing curve.

To unmix samples into their sources using these values, use the [[mixing-model-calculator]]; for ages from radioactive isotopes, the [[radiometric-age-calculator]].

## How to use it

- Pick the isotope and standard, then type either δ or the sample ratio; the other fills in. Choose "Other" and type the standard's ratio for anything not listed.
- For a scale change, pick the direction and enter δ on the old scale. For "Any", also give the old standard's δ on the new scale.
- For fractionation, use the same isotope and scale for both phases.
- For mixing, give each source's δ and how concentrated the element is in it, then the fraction of source A.

## Worked examples

All numbers here are made up for illustration.

- δ¹⁸O = **−8.50 ‰ vs VSMOW** is a ¹⁸O/¹⁶O ratio of **0.0019881558**, so about 0.198 % of the oxygen (counting only ¹⁶O and ¹⁸O) is ¹⁸O.
- A calcite with δ¹⁸O = **−5.20 ‰ vs VPDB** is **+25.56 ‰ vs VSMOW**. Just adding 30.92 would give 25.72, off by 0.16 ‰.
- Calcite at +25.0 ‰ and water at −5.0 ‰: **α = 1.030151**, ε = +30.15 ‰ and 1000 ln α = +29.71 ‰.
- δ¹⁷O = 5.30 ‰ and δ¹⁸O = 10.10 ‰ with λ = 0.528 give **Δ′¹⁷O = −20 per meg**.
- Mixing 60 % of source A (−28 ‰, concentration 1) with 40 % of source B (−12 ‰, concentration 3) gives **−17.33 ‰**. Only a third of the element comes from A. Reaching −18 ‰ needs **64.3 %** of A.

## Good to know

- Labs report δ against reference materials measured alongside samples, so you rarely need absolute ratios. When you do, check which standard ratio your field uses; for example δ¹³C work sometimes uses an older VPDB ratio.
- ε and Δ are close only when δ values are small. For large differences use α or 1000 ln α, which are what temperature equations use.
- The mixing box uses the standard δ mass balance. It is accurate to a few hundredths of a per mil for ordinary δ values.

## FAQ

**Why can't I just add 30.92 to go from VPDB to VSMOW?** δ values multiply, not add: (1 + δ₁)(1 + δ₂). Adding is close only for values near zero.

**What is a per meg?** One thousandth of a per mil. Triple oxygen differences are tiny, so they are often quoted in per meg.
