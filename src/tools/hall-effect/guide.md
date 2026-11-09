---
name: Hall effect and van der Pauw analyser
num: 965
shelf: science
section: condensed-matter-physics
title: "Hall effect and van der Pauw analyser: sheet resistance, carrier type, density, mobility and resistivity from your readings"
summary: "Turn van der Pauw and Hall readings into results: sheet resistance with the exact van der Pauw correction, carrier type, sheet and bulk carrier density, Hall mobility, resistivity and Hall coefficient. Use one field with +B and −B to cancel the offset, or fit a whole field sweep. Checks the readings for consistency and downloads the results."
status: live
ads: true
order: 9
icon: calculator
works: offline
updated: 2026-11-09
related: [band-structure, uncertainty-calculator, anomalous-hall-checker, trend-analyser]
sources:
  - "Van der Pauw, L. J. (1958), A method of measuring specific resistivity and Hall effect of discs of arbitrary shape, Philips Research Reports 13, 1 to 9: the equation exp(−πR_A/R_s) + exp(−πR_B/R_s) = 1, solved here by Newton's method."
  - "Hall coefficient, carrier density and Hall mobility: standard textbook relations (for example Kittel, Introduction to Solid State Physics, and Sze, Physics of Semiconductor Devices). The measurement routine follows common practice described in NIST's public Hall effect pages."
  - "Checked by fibub against SciPy (brentq on the van der Pauw equation, scipy.constants.e, scipy.stats.linregress). The elementary charge is the exact SI value."
  - "The example readings are made up."
flow:
  - { icon: ruler, label: "Sample" }
  - { icon: sliders, label: "Readings" }
  - { icon: calculator, label: "Analyse" }
  - { icon: check, label: "n and μ" }
---

## What it does

The **Hall effect** is the sideways voltage that appears when a current flows through a conductor in a magnetic field. Its sign tells you whether the charge carriers are **electrons (n-type)** or **holes (p-type)**, and its size tells you **how many** there are. Combined with the sheet resistance from a **van der Pauw** measurement on the same sample, it gives the carriers' **mobility**: how easily they move.

This tool takes your raw readings and works out:

- the **sheet resistance** R_s in ohms per square, solving the van der Pauw equation exactly (the correction factor f matters when R_A and R_B differ);
- the **carrier type** from the sign of the Hall voltage;
- the **sheet carrier density** n_s (per cm²) and, if you give the thickness, the **bulk density** n (per cm³);
- the **Hall mobility** μ_H in cm²/(V·s);
- the **resistivity**, conductivity and Hall coefficient;
- a **reciprocity check** on repeated readings, which flags bad contacts.

## How to use it

1. Type the film **thickness**, or leave it blank for a sheet (2D) result.
2. Type the van der Pauw resistances **R_A** and **R_B** in ohms. Several readings each (current reversed, reciprocal configurations) can be separated by commas; they are averaged and the spread is shown.
3. Choose the Hall measurement. **One field, +B and −B**: give the current, field and the Hall voltage at +B and at −B; the tool takes half the difference, which cancels the offset from misaligned contacts. **Field sweep**: paste field and Hall voltage pairs (or open a file) and the tool fits a straight line.
4. Leave the **Hall factor** at 1 unless you know it for your material.
5. Check the sign convention in the help text matches your wiring.

## Worked example

A made-up 500 nm thin film gives R_A readings of 120.4 and 119.6 Ω and R_B readings of 95.2 and 94.8 Ω. The van der Pauw equation gives **R_s = 484.94 Ω/□** (f = 0.9953). With 1 mA and 0.5 T, the Hall voltage is −2.10 mV at +B and +1.90 mV at −B, so V_H = −2.00 mV with a 0.1 mV offset removed. The negative sign means electrons: the page shows **n-type: 1.56 × 10¹⁴ cm⁻², μ = 82.5 cm²/(V·s)**. With the thickness, the bulk density is **3.12 × 10¹⁸ cm⁻³** and the resistivity **0.02425 Ω·cm**. The readings agree to 0.33 %.

## Tips

- Keep contacts small and on the edge; make sure they are ohmic (straight-line current against voltage).
- Use the field sweep to see whether V_H is really linear in B. Curvature suggests two kinds of carriers.
- A large R_A/R_B ratio is allowed, but it often means an odd shape or a bad contact.

## FAQ

**My carrier type looks wrong. Why?** Sign conventions differ between labs and instruments. Check which contact is positive and which way the field points against the convention stated under the Hall inputs.

**What is the Hall factor?** The ratio of Hall mobility to drift mobility. It depends on how carriers scatter: close to 1 in metals and degenerate semiconductors, up to about 1.9 for impurity scattering.

**Can I trust this for a device report?** It is a careful calculation for study and lab work. It is no substitute for professional judgement about the sample and the measurement.
