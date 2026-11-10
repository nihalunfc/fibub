---
name: Radiometric age calculator
num: 121
shelf: science
code: T121
section: geochemistry-and-geochronology
title: "Radiometric age calculator: isochron (York fit, MSWD), K-Ar, Ar-Ar and U-Pb concordia ages"
summary: "Work out rock and mineral ages from isotope ratios: daughter/parent ages for Rb-Sr, Sm-Nd, Lu-Hf, Re-Os, U-Pb and Th-Pb, K-Ar and ⁴⁰Ar/³⁹Ar ages, isochrons fitted with errors in both axes (York regression, MSWD), and U-Pb ages with concordance on a concordia plot."
status: live
ads: true
order: 1
icon: mountain
works: offline
updated: 2026-11-08
related: [radiocarbon-calibration, decay-calculator, uncertainty-calculator, isotope-pattern-calculator]
sources:
  - "Age equation, isochron method and Wetherill concordia: standard geochronology, written from the equations."
  - "York regression with correlated errors: York and others (2004), American Journal of Physics; written from the published algorithm, no data copied."
  - "Decay constants: conventional values (²³⁸U and ²³⁵U, Jaffey and others 1971; ⁴⁰K and ⁸⁷Rb, Steiger and Jäger 1977, IUGS; ¹⁴⁷Sm, ¹⁷⁶Lu, ¹⁸⁷Re and ²³²Th as commonly used) and ²³⁸U/²³⁵U = 137.818. Physical constants, shown with their origin on the page."
  - "Example isochron and ratio data are made up by fibub; they are not measurements of any real rock."
flow:
  - { icon: mountain, label: "Samples" }
  - { icon: table, label: "Ratios" }
  - { icon: chart, label: "Isochron" }
  - { icon: clock, label: "Age" }
---

## What it does

Radioactive parents decay into daughters at a fixed rate, so a mineral is a clock: the more daughter it holds compared with the parent left, the older it is. For a parent with decay constant λ:

t = ln(1 + D*/P) / λ

D* is the **radiogenic** daughter, made by decay since the mineral formed, and P the parent left today. The tool has three parts.

1. **Age from a ratio**: any decay system from a D*/P ratio, a **K-Ar** age from potassium content and radiogenic argon, or a **⁴⁰Ar/³⁹Ar** age from a J factor set by a standard.
2. **Isochron**: when samples started with some daughter already, plot daughter against parent, both divided by a stable isotope of the daughter. Samples of the same age fall on a line. Its slope gives the age and its intercept the starting ratio. The tool fits the line with **York regression**, which allows for errors in both x and y and their correlation, and reports the **MSWD**.
3. **U-Pb**: the three ages from ²⁰⁶Pb/²³⁸U, ²⁰⁷Pb/²³⁵U and the ²⁰⁷Pb/²⁰⁶Pb ratio, and how **concordant** they are, plotted on a concordia diagram.

For organic material from the last 50,000 years, use [[radiocarbon-calibration]]; for stable isotope ratios, the [[isotope-delta-converter]].

## How to use it

- In **Age from a ratio**, pick the method. For a decay system, the decay constant fills in; change it if your lab uses another value. Enter the radiogenic daughter/parent atom ratio and its error.
- For **K-Ar**, enter potassium in weight percent and radiogenic ⁴⁰Ar in moles per gram.
- For **⁴⁰Ar/³⁹Ar**, enter the standard's age and measured ratio (which set J), the error on J, and the sample's ratio.
- For an **isochron**, paste or open rows of x, σx, y, σy and, if you have it, the error correlation r. Say whether errors are absolute 1σ, percent 1σ, or absolute 2σ.
- For **U-Pb**, enter the radiogenic ratios after common-lead correction.

## Reading the isochron

**MSWD** (mean square of weighted deviates) compares the scatter of points about the line with what their errors predict. Near 1 means the errors explain the scatter. Well below 1 suggests the errors are too generous. Well above 1, with a low probability of fit, means real geological scatter: the result is an "errorchron", and the tool scales the age error by √MSWD.

## Worked examples

All numbers here are made up for illustration.

- A Rb-Sr **D*/P ratio of 0.050 ± 0.0005** gives **3436 ± 34 Ma**.
- **K-Ar**: 2.5 wt % K and 4.0 × 10⁻¹⁰ mol/g of radiogenic ⁴⁰Ar give ⁴⁰Ar*/⁴⁰K = 0.00536 and an age of **89.98 Ma**.
- **⁴⁰Ar/³⁹Ar**: a 28.2 Ma standard with a ratio of 12.0 gives J = 0.0013128. A sample ratio of 30.00 ± 0.05, with J known to 0.2 %, gives **69.69 ± 0.18 Ma**.
- **Isochron**: the seven example whole-rock points give a Rb-Sr age of **1250.4 ± 3.1 Ma** with initial ⁸⁷Sr/⁸⁶Sr = 0.703474 ± 0.000050 and MSWD 0.51.
- **U-Pb**: ²⁰⁶Pb/²³⁸U = 0.300 and ²⁰⁷Pb/²³⁵U = 4.80 give 1691 Ma and 1785 Ma. Their ²⁰⁷Pb/²⁰⁶Pb age is **1896 ± 14 Ma**, so the grain is about 11 % discordant, a sign it lost lead.

## Good to know

- Ages are only as good as their assumptions: a closed system since formation, a known or shared starting ratio, and no later disturbance.
- Decay constants differ slightly between conventions; for ⁸⁷Rb the newer value is about 1.6 % lower. State which you used.
- For radiocarbon dates, use the [radiocarbon calibration](/science/radiocarbon-calibration/) tool, which corrects for changes in atmospheric ¹⁴C.

## FAQ

**Why is the ²⁰⁷Pb/²⁰⁶Pb age often the best for old zircons?** Lead loss lowers both U-Pb ratios together, which barely changes their ratio. So the ²⁰⁷Pb/²⁰⁶Pb age resists lead loss.

**Do I need the error correlation r?** For Rb-Sr and Sm-Nd it is usually small, and leaving it at 0 is common. For U-Pb isochrons it can matter.
