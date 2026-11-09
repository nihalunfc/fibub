---
name: Margin of exposure calculator
num: 476
shelf: science
section: toxicology
title: "Margin of exposure (MOE) calculator: NOAEL or BMDL ÷ estimated daily exposure, with scenarios and uncertainty factors"
summary: "Work out the margin of exposure for several exposure scenarios: dose from concentration × intake ÷ body weight, MOE = point of departure (NOAEL, LOAEL or BMDL) ÷ dose, compared with a target built from your own uncertainty factors, with a bar chart and the concentration that would just meet the target."
status: live
ads: false
order: 16
icon: target
works: offline
updated: 2026-11-09
related: [dose-response, lc50-probit, species-sensitivity, bioaccumulation-factor, uncertainty-calculator, solution-calculator, air-quality-calculator, body-measures]
sources:
  - "Margin of exposure approach and the 10 × 10 default factor for threshold effects: WHO IPCS, Principles and Methods for the Risk Assessment of Chemicals in Food, Environmental Health Criteria 240 (2009). MOE of 10 000 from a BMDL10 for genotoxic carcinogens: EFSA Scientific Committee, EFSA Journal 282:1 (2005). Both checked 2026-11-09 and given only as editable defaults; check the official source."
  - "Dose = concentration × intake ÷ body weight, MOE = point of departure ÷ dose: standard formulas. The example substance and all its numbers are made up. Checked in the tests by hand and against an independent Python calculation on 40 random cases with mixed units."
flow:
  - { icon: flask, label: "POD" }
  - { icon: table, label: "Scenarios" }
  - { icon: calculator, label: "Dose" }
  - { icon: target, label: "MOE" }
---

## What it does

The **margin of exposure (MOE)** compares the dose at which a substance starts to cause an effect in a study with the dose people actually take in. It is the **point of departure** (a NOAEL, LOAEL or benchmark dose lower limit such as the BMDL10) divided by the **estimated exposure**, both in mg per kg of body weight per day. A larger MOE means a wider safety margin. This page works out the exposure and the MOE for as many scenarios as you like (average and high consumers, adults and children), compares each with a **target MOE** built from uncertainty factors you list yourself, and draws them on a bar chart. It is for study and teaching, not medical advice or a regulatory assessment.

Get the point of departure from your own data with the [[dose-response|dose-response fitter]], and work out a worker's dose with the [[exposure-twa|exposure TWA calculator]].

## How to use it

1. Enter the **point of departure**: its type, value and unit. Name the substance if you like; it appears in the report.
2. List the **scenarios**, one per line: a name, the concentration in the food, drink or medium, the daily intake and the body weight in kg. Paste them from a spreadsheet or open a CSV or Excel file. Choose the **concentration unit** (mg/kg, µg/kg, ng/g, mg/L or µg/L) and the **intake unit** (g, kg, mL or L per day).
3. List the **uncertainty factors**, one per line, with a name and a number. The target MOE is their product. The two buttons fill in two commonly used conventions; change them to whatever your guidance uses.
4. Read the table: the exposure, the MOE, whether it meets the target, and the highest concentration at which that scenario would still meet it. Download the table as CSV or the whole report as an image, PDF or Word file.

## The formulas

- Exposure (dose) = concentration × intake ÷ body weight, converted to the unit of the point of departure.
- MOE = point of departure ÷ exposure.
- Target MOE = product of the uncertainty factors.
- Exposure giving the target = point of departure ÷ target.
- Concentration meeting the target = (point of departure ÷ target) × body weight ÷ intake.

## Worked example

The page opens with a made-up substance X with a BMDL10 of 0.3 mg/kg bw/day, found at 50 µg/kg in a food. An average adult eats 200 g a day and weighs 70 kg, so the exposure is 0.05 mg/kg × 0.2 kg ÷ 70 kg = 0.000143 mg/kg bw/day and the **MOE is 2100**. A high-consuming adult (600 g a day) has an MOE of 700, and a high-consuming child (300 g a day, 20 kg) has the **lowest MOE, 400**. With the 10 × 10 = 100 target all three are above it; the child would reach the target at 200 µg/kg. Press **Use 10 000** and none of the scenarios meets that target.

## Tips

- Keep units consistent: the page converts concentration and intake, but the body weight is always in kg.
- Uncertainty factors depend on the data (for example extra factors for a LOAEL instead of a NOAEL, or for a short study). Name each one so the report shows the reasoning.
- A name that contains a comma is fine when the columns are separated by tabs, as when you paste from a spreadsheet.

## FAQ

**Is a high MOE "safe"?** It means a wide margin under the assumptions used. Interpretation depends on the substance, the data and official guidance; check the official source.

**Is anything uploaded?** No. Files you open are read in your browser, and nothing is sent or stored.
