---
name: eGFR calculator
num: 479
shelf: science
code: T330
section: clinical-calculators
title: "eGFR calculator"
summary: "Estimate kidney function from serum creatinine (mg/dL or µmol/L) and optional cystatin C: race-free CKD-EPI 2021 eGFR, CKD-EPI 2012 cystatin C, MDRD for comparison, Cockcroft-Gault creatinine clearance with actual, ideal and adjusted weight, and the KDIGO G stage."
status: live
ads: false
order: 19
icon: flask
works: offline
updated: 2026-11-09
related: [body-measures, solution-calculator, uncertainty-calculator, method-validation, dose-response]
sources:
  - "Cockcroft-Gault: D. W. Cockcroft and M. H. Gault, Nephron 16:31 (1976). CKD-EPI 2021 creatinine and creatinine-cystatin C equations: L. A. Inker et al., N Engl J Med 385:1737 (2021). CKD-EPI 2012 cystatin C: L. A. Inker et al., N Engl J Med 367:20 (2012). MDRD 4-variable, IDMS-traceable (175): A. S. Levey et al., Ann Intern Med 145:247 (2006). Equations only."
  - "GFR categories G1 to G5: KDIGO 2012 Clinical Practice Guideline for the Evaluation and Management of CKD, Kidney Int Suppl 3:1 (2013) (checked 2026-11-09; check the official source)."
  - "Ideal body weight (Devine 1974) and adjusted body weight as on the body measures page. Checked in the tests against an independent Python implementation of the published equations on 15 adults, and against the rounded values common calculators show."
flow:
  - { icon: flask, label: "Creatinine" }
  - { icon: calculator, label: "Equations" }
  - { icon: target, label: "eGFR, stage" }
  - { icon: download, label: "Report" }
---

## What it does

Kidney function is usually described by the **glomerular filtration rate (GFR)**: how much blood plasma the kidneys filter each minute. It is rarely measured directly. Instead it is estimated from blood tests, mainly **serum creatinine** and sometimes **cystatin C**, with equations fitted on people whose GFR was measured. This page works out the main teaching equations side by side, shows the **KDIGO G stage**, and draws how eGFR falls as creatinine rises for the person's age and sex. It is for study and teaching, not medical advice.

Body surface area for the indexed result comes from the [[body-measures|body measures calculator]]; to convert creatinine between units, use the [[lab-unit-converter]].

## How to use it

1. Type the **age** (18 or over: these are adult equations) and choose the **sex**.
2. Type the **serum creatinine** and choose its unit. Switching between mg/dL and µmol/L converts the number in the box (1 mg/dL = 88.42 µmol/L).
3. Optionally add **cystatin C** in mg/L. The page then adds the combined creatinine-cystatin C equation and uses it for the stage, because it is the more accurate estimate.
4. Optionally add **weight** for the Cockcroft-Gault creatinine clearance, and **height** to get it with the ideal and adjusted weight too. The **adjusted-weight factor** (usually 0.4) is the share of weight above ideal that is counted.
5. Download the results as an image, PDF or Word file.

## The equations

- **CKD-EPI 2021, creatinine** (Inker et al. 2021): 142 × min(Scr/κ, 1)^α × max(Scr/κ, 1)^−1.200 × 0.9938^age, × 1.012 for women; κ = 0.7 (women) or 0.9 (men), α = −0.241 or −0.302. It has no race term.
- **CKD-EPI 2021, creatinine and cystatin C**: 135 × min(Scr/κ, 1)^α × max(Scr/κ, 1)^−0.544 × min(Scys/0.8, 1)^−0.323 × max(Scys/0.8, 1)^−0.778 × 0.9961^age, × 0.963 for women; α = −0.219 or −0.144.
- **CKD-EPI 2012, cystatin C** (Inker et al. 2012): 133 × min(Scys/0.8, 1)^−0.499 × max(Scys/0.8, 1)^−1.328 × 0.996^age, × 0.932 for women.
- **MDRD 4-variable** (Levey et al. 2006): 175 × Scr^−1.154 × age^−0.203, × 0.742 for women. Shown only for comparison, without its original race coefficient; it underestimates GFR above about 60.
- **Cockcroft-Gault** (1976): (140 − age) × weight ÷ (72 × Scr), × 0.85 for women, in mL/min (not scaled to body size).
- **KDIGO G stages**: G1 ≥ 90, G2 60 to 89, G3a 45 to 59, G3b 30 to 44, G4 15 to 29, G5 under 15 mL/min/1.73 m².

## Worked example

The page opens with a 70-year-old man, creatinine 1.4 mg/dL, cystatin C 1.3 mg/L, 95 kg and 175 cm. CKD-EPI 2021 gives **54** from creatinine and **55** from creatinine with cystatin C, so the stage is **G3a: mildly to moderately decreased**. Cystatin C alone gives 53 and MDRD 50. Cockcroft-Gault gives 66 mL/min with his actual weight, 49 with his ideal weight (70.5 kg) and 56 with his adjusted weight (80.3 kg). Because he weighs more than 130 % of his ideal weight, the page notes that the actual-weight figure overestimates.

## Tips

- One eGFR is a snapshot. Chronic kidney disease needs a low GFR, or other signs of kidney damage, lasting more than three months.
- Creatinine depends on muscle mass, so very muscular or very frail people can be misjudged; cystatin C helps there.

## FAQ

**Why is there no race option?** The 2021 CKD-EPI equations were refitted without race, and are now the recommended creatinine equations in many countries.

**Why do Cockcroft-Gault and eGFR differ?** They estimate different things in different units (mL/min for this body against mL/min per 1.73 m²), from different groups of people.

**Is anything sent or saved?** No. Everything is worked out in your browser.
