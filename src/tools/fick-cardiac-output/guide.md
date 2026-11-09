---
name: Fick cardiac output calculator
num: 343
shelf: science
section: physiology
title: "Fick principle cardiac output calculator, with O2 content, Fick's law of diffusion and Poiseuille blood flow"
summary: "Cardiac output from oxygen uptake and the arterial and mixed venous O₂ content (from haemoglobin, saturation and PO₂), with stroke volume, O₂ delivery and extraction. Plus two teaching calculators: Fick's law of diffusion across a membrane and Poiseuille flow in a tube. For study and teaching, not for clinical use."
status: live
ads: true
order: 343
icon: calculator
works: offline
updated: 2026-11-09
related: [gas-law-calculator, darcy-flow-calculator, uncertainty-calculator, colligative-properties]
sources:
  - "Fick principle: A. Fick (1870). O₂ content = 1.34 × Hb × SaO₂ + 0.0031 × PO₂ is the standard textbook form (Hüfner factor 1.34 to 1.39 mL O₂/g Hb; O₂ solubility 0.003 mL/dL/mmHg); see any physiology text, e.g. West's Respiratory Physiology. Formulas only."
  - "Fick's first law of diffusion: A. Fick (1855). Poiseuille's law: J. L. M. Poiseuille (1840s) and G. Hagen (1839). Pressure units: 1 mmHg = 133.322 Pa (NIST)."
  - "Checked in the tests against a Python rewrite of the formulas, and Poiseuille flow against SciPy numerical integration of the parabolic velocity profile. The example values are illustrative textbook-style numbers, made up and rounded."
flow:
  - { icon: flask, label: "Blood O2" }
  - { icon: sliders, label: "VO2" }
  - { icon: calculator, label: "Fick" }
  - { icon: chart, label: "Output" }
---

## What it does

The **Fick principle** says that the oxygen the body takes up each minute must be carried away from the lungs by the blood. Each 100 mL of blood leaving the lungs holds more O₂ (arterial content, CaO₂) than the blood coming back (mixed venous content, CvO₂). So:

**cardiac output = V̇O₂ ÷ (CaO₂ − CvO₂)**

with V̇O₂ in mL/min and the contents in mL O₂ per litre of blood (the calculator multiplies mL/dL by 10). It is the classic way physiology students meet cardiac output, and the same idea underlies indicator-dilution methods.

The page also has two short calculators that go with it in a physiology course: **Fick's law of diffusion** (how fast a gas or solute crosses a membrane) and **Poiseuille's law** (how pressure, radius, length and viscosity set the flow through a tube).

For study and teaching, not for clinical use.

## How to use it

1. Type the **O₂ uptake**, for example from a spirometer or the respirometry calculator.
2. Type **haemoglobin**, the **arterial and mixed venous saturations** and the two **PO₂** values. Choose mmHg or kPa; switching converts the numbers you typed.
3. **Hüfner factor**: the mL of O₂ one gram of fully saturated haemoglobin binds. 1.34 is the usual textbook value, 1.39 the theoretical maximum, 1.36 a common compromise.
4. **Heart rate** and **body surface area** are optional and add stroke volume and cardiac index.

The diffusion and Poiseuille calculators work on their own. Each result explains in one line what it means.

## Worked example

The illustrative example is a resting adult: V̇O₂ 250 mL/min, Hb 15 g/dL, SaO₂ 98 % at PO₂ 95 mmHg, SvO₂ 75 % at PO₂ 40 mmHg, heart rate 70.

- CaO₂ = 1.34 × 15 × 0.98 + 0.0031 × 95 = **19.99 mL/dL**; CvO₂ = **15.20 mL/dL**.
- The a–v difference is 4.79 mL/dL, so **cardiac output = 5.22 L/min** and stroke volume 74.5 mL.
- O₂ delivery is 1043 mL/min and extraction 24 %.

Diffusion: with D = 2 × 10⁻⁵ cm²/s across 1 cm² of a 1 µm sheet and a 0.1 mmol/L difference, the rate is **20 nmol/s**, and the time scale to cross is 0.250 ms.

Poiseuille: a 10 mmHg drop along 10 cm of a 1.5 mm radius tube with a viscosity of 3.5 mPa·s gives **7.573 mL/s** (454.4 mL/min), a mean velocity of 107.1 cm/s and a Reynolds number of 973.4 (laminar).

## Tips

- The dissolved O₂ is small at normal PO₂ (about 0.3 mL/dL), which is why saturation matters far more than PO₂.
- Radius enters Poiseuille's law to the fourth power: a vessel 19 % wider carries twice the flow.
- Blood is not a simple liquid: its viscosity falls in small vessels and at high shear, so Poiseuille is a teaching model.

## FAQ

**Why mixed venous blood?** The Fick principle needs the average of all blood returning to the lungs, which is only found in the pulmonary artery.

**Does anything leave my device?** No. Everything is worked out in your browser.
