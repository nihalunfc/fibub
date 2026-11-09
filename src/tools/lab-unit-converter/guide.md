---
name: Lab unit converter
num: 501
shelf: science
section: nursing-and-lab-medicine
title: "Lab unit converter: mg/dL to mmol/L and µmol/L (glucose, cholesterol, creatinine, HbA1c)"
summary: "Convert lab results between conventional and SI units for glucose, cholesterol, triglycerides, creatinine, urea and BUN, uric acid, calcium, magnesium, phosphate, bilirubin and HbA1c, with the molar mass and factor shown. Paste a column to convert many at once."
status: live
ads: false
order: 41
icon: convert
works: offline
updated: 2026-11-09
related: [molar-mass-calculator, solution-calculator, uncertainty-calculator, calibration-curve, method-validation]
sources:
  - "Atomic weights: IUPAC/CIAAW standard atomic weights (abridged values), as used by the molar mass calculator."
  - "HbA1c: the IFCC-NGSP master equation, Hoelzel W. et al. (2004), Clinical Chemistry 50(1):166-174."
flow:
  - { icon: flask, label: "Pick test" }
  - { icon: pencil, label: "Type value" }
  - { icon: convert, label: "Convert" }
  - { icon: download, label: "CSV" }
---

## What it does

Lab results come in two systems. The United States and some other countries report most blood chemistry in **conventional units**, mass per volume such as mg/dL. Canada, the UK, Europe, Australia and much of Asia use **SI units**, amount of substance per volume such as mmol/L or µmol/L. Textbooks, papers and guidelines switch between the two, so students and lab staff convert all the time.

This converter does it for glucose, total, HDL and LDL cholesterol, triglycerides, creatinine, urea, urea nitrogen (BUN), uric acid, calcium, magnesium, phosphate, bilirubin and HbA1c. It does not use a list of factors copied from somewhere: it works each factor out from the chemical formula and the standard atomic weights, and shows you the molar mass and the factor it used, so you can check it by hand.

For a blood gas, use the [[acid-base-interpreter]]; for kidney function from creatinine, the [[kidney-function|kidney function calculator]].

## How to use it

1. Choose the **test**. The usual conventional unit is picked as From and the usual SI unit as To.
2. Type the **value**. The answer appears at once, with the molar mass, the factor and why.
3. **Swap units** to go the other way. Some tests also offer mg/L, g/L or mEq/L.
4. **Round to** sets the decimals. The default shows 4 significant figures; labs usually report glucose and cholesterol to 1 decimal in mmol/L and creatinine as a whole number in µmol/L.
5. To convert many results, paste a column into **Convert a list** (or open a CSV or Excel file). Each line gives one result. Text after the number, such as "mg/dL" or a note, is ignored, a leading < or > is kept, and lines that are not numbers are marked. **Download CSV** saves the table.

## The maths

1 mg/dL is 10 mg/L. Dividing by the molar mass M (g/mol) gives mmol/L: **mmol/L = mg/dL × 10 ÷ M**. For µmol/L multiply by 1000 again. For mEq/L multiply mmol/L by the ion's charge (2 for calcium and magnesium).

Some tests are weighed as something particular. **Triglycerides** are a mixture, so they are converted as if all were triolein (885.45 g/mol). **HDL and LDL** are reported as their cholesterol. **Phosphate** is reported as the phosphorus it contains (30.974 g/mol). **BUN** weighs only the two nitrogen atoms in each urea molecule (28.014 g/mol), so BUN in mg/dL × 0.357 gives urea in mmol/L.

**HbA1c** is different: the NGSP percentage and the IFCC mmol/mol value measure different things, so they are linked by the IFCC-NGSP master equation (Hoelzel et al., 2004): NGSP % = 0.09148 × IFCC + 2.152.

## Worked example

Choose Glucose and type 100 mg/dL. The page shows **100 mg/dL = 5.551 mmol/L**, molar mass 180.156 g/mol (C₆H₁₂O₆) and factor 0.055507. The example list (72, 95, 110, 126, <40, 183 mg/dL) becomes 3.997, 5.273, 6.106, 6.994, <2.220 and 10.16 mmol/L. Creatinine 1.2 mg/dL is 106.1 µmol/L. HbA1c 7 % is 53 mmol/mol when rounded to 0 decimals.

## Tips

- Rounding the SI result and converting back will not give exactly the starting number. Keep the unrounded value if you need to go back.
- Some labs use slightly different rounded factors (for example 0.0555 or 0.0556 for glucose, 88.4 for creatinine). The difference is in the last digit.
- The reference ranges that go with a result belong to the lab that measured it. This tool converts numbers; it does not say whether they are normal.

## Frequently asked questions

**Why does my textbook give a slightly different factor?** Older books used older atomic weights or rounded the factor. The page uses the current standard atomic weights.

**Can I convert sodium or potassium?** For monovalent ions mmol/L and mEq/L are the same number, and labs report them that way everywhere, so there is nothing to convert.

**Is my data stored or sent anywhere?** No. Everything runs in your browser and nothing you type leaves your device.

For study and teaching, not medical advice. Check with a qualified professional.
