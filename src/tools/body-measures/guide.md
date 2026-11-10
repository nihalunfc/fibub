---
name: BMI calculator
num: 478
shelf: science
section: clinical-calculators
title: "BMI calculator"
summary: "Work out body mass index with the WHO adult class, body surface area by the Mosteller, DuBois, Haycock and Gehan-George formulas, ideal body weight by Devine, Robinson and Miller, adjusted body weight and Janmahasatian lean body weight, in metric or US units."
status: live
ads: false
order: 18
icon: ruler
works: offline
updated: 2026-11-09
related: [sample-size, uncertainty-calculator, interval-tools, dose-response]
sources:
  - "BMI classes: World Health Organization, Obesity: preventing and managing the global epidemic, WHO Technical Report Series 894 (2000), adult cut points 16, 17, 18.5, 25, 30, 35 and 40 kg/m² (checked 2026-11-09; check the official source)."
  - "Body surface area: R. D. Mosteller, N Engl J Med 317:1098 (1987); D. DuBois and E. F. DuBois, Arch Intern Med 17:863 (1916); G. B. Haycock, G. J. Schwartz and D. H. Wisotsky, J Pediatr 93:62 (1978); E. A. Gehan and S. L. George, Cancer Chemother Rep 54:225 (1970). Formulas only."
  - "Ideal body weight: B. J. Devine, Drug Intell Clin Pharm 8:650 (1974); J. D. Robinson et al., Am J Hosp Pharm 40:1016 (1983); D. R. Miller et al., Am J Hosp Pharm 40:1622 (1983). Adjusted body weight with the 0.4 factor as used in clinical pharmacokinetics texts (e.g. L. A. Bauer, Applied Clinical Pharmacokinetics). Lean body weight: S. Janmahasatian et al., Clin Pharmacokinet 44:1051 (2005). Formulas only."
  - "Checked in the tests against an independent Python implementation of the same formulas on ten adults, and by hand (6 ft man: Devine 77.6 kg)."
flow:
  - { icon: ruler, label: "Height" }
  - { icon: calculator, label: "Formulas" }
  - { icon: target, label: "BMI, BSA" }
  - { icon: download, label: "Report" }
---

## What it does

Clinical teaching uses a handful of body size measures again and again: **body mass index (BMI)**, **body surface area (BSA)**, **ideal body weight (IBW)**, **adjusted body weight (ABW)** and **lean body weight (LBW)**. Each has more than one published formula, and the formulas give slightly different answers. This page works them all out side by side from one height and weight, shows each formula next to its result, and places the person on a weight-for-height chart with the WHO BMI lines. It is for study and teaching, not medical advice.

Body surface area and weight feed into the [[kidney-function|kidney function calculator]] and the [[energy-needs]] calculator.

## How to use it

1. Choose **Metric** (cm and kg) or **US** (feet, inches and pounds). Switching carries your numbers across.
2. Choose the **sex**. BMI and BSA do not use it, but the ideal and lean weight formulas were fitted separately for men and women.
3. Type the **height** and **weight**. Results update as you type.
4. The **adjusted-weight factor** is the share of the weight above ideal that counts towards the adjusted weight. 0.4 is the value most texts use; some use 0.3 or 0.5.
5. Download the results as an image, PDF or Word file.

## The formulas

- **BMI** = weight (kg) ÷ height (m)². The WHO adult classes (WHO 2000) are under 18.5 underweight (split at 16 and 17 into severe, moderate and mild thinness), 18.5 to under 25 normal range, 25 to under 30 pre-obese, and 30, 35 and 40 for obese classes I, II and III. They are for adults only; children use BMI-for-age charts, and some countries use lower cut points for some groups.
- **BSA (m²)**: Mosteller (1987) √(height cm × weight kg ÷ 3600); DuBois and DuBois (1916) 0.007184 × W^0.425 × H^0.725; Haycock (1978) 0.024265 × W^0.5378 × H^0.3964; Gehan and George (1970) 0.0235 × W^0.51456 × H^0.42246.
- **IBW**: Devine (1974) 50 kg for men or 45.5 kg for women plus 2.3 kg per inch over 5 feet; Robinson (1983) 52 + 1.9 (men) or 49 + 1.7 (women); Miller (1983) 56.2 + 1.41 (men) or 53.1 + 1.36 (women). Below 5 feet they are extrapolated, and the page warns you.
- **ABW** = Devine IBW + factor × (actual weight − IBW).
- **LBW** (Janmahasatian 2005) = 9270 × W ÷ (6680 + 216 × BMI) for men, or 9270 × W ÷ (8780 + 244 × BMI) for women.

## Worked example

The page opens with a man 180 cm tall weighing 100 kg. His **BMI is 30.9 kg/m²**, WHO class *Obese class I*. BSA is 2.24 m² (Mosteller), 2.20 (DuBois), 2.26 (Haycock) and 2.25 (Gehan and George). Ideal body weight is 75.0 kg (Devine), 72.6 (Robinson) and 71.5 (Miller). His actual weight is 133 % of the Devine IBW, so the adjusted weight, 75.0 + 0.4 × (100 − 75.0), is 85.0 kg, and the lean body weight is 69.5 kg.

## Tips

- The four BSA formulas agree within a few per cent for average adults and drift apart for very large or very small people. That spread is a useful reminder that BSA is an estimate.
- Ideal body weight depends only on height and sex, never on the actual weight.
- These numbers feed other formulas, such as the Cockcroft-Gault creatinine clearance. They are not instructions for treatment.

## FAQ

**Which BSA formula is right?** None is exact. Mosteller is the simplest and very widely taught; DuBois is the oldest; Haycock was fitted on children as well as adults.

**Why does my BMI class differ from another chart?** Some countries and groups use different cut points, and BMI-for-age is used for children. Check the official source for your setting.

**Is anything sent or saved?** No. Everything is worked out in your browser and nothing about you is stored.
