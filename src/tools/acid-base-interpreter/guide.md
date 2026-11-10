---
name: Blood gas interpreter
num: 480
shelf: science
section: clinical-calculators
title: "Blood gas interpreter"
summary: "Interpret an arterial blood gas step by step: acidaemia or alkalaemia, the primary disorder, expected compensation (Winter's formula and the acute and chronic respiratory rules), the anion gap corrected for albumin, the delta ratio, lactate and the osmolar gap, with an acid-base map."
status: live
ads: false
order: 20
icon: flask
works: offline
updated: 2026-11-09
related: [kidney-function, body-measures, buffer-recipe-calculator, titration-curve, equilibrium-solver, solution-calculator]
sources:
  - "Winter's formula: R. W. Winters et al. (Albert, Dell and Winters), Ann Intern Med 66:312 (1967). Compensation rules of thumb for metabolic alkalosis and acute and chronic respiratory disorders as taught in K. Berend, A. P. J. de Vries and R. O. B. Gans, N Engl J Med 371:1434 (2014), and standard physiology texts; sources differ slightly (for example 3.5 or 4 per 10 mmHg)."
  - "Albumin-corrected anion gap: J. Figge, A. Jabor, A. Kazda and V. Fencl, Crit Care Med 26:1807 (1998). Delta ratio bands: M. Rastegar, J Am Soc Nephrol 18:2429 (2007). Calculated osmolality 2 Na + glucose + urea (mmol/L); in mg/dL glucose ÷ 18 and BUN ÷ 2.8 (W. V. Dorwart and L. Chalmers, Clin Chem 21:190 (1975))."
  - "Normal values (pCO2 40, HCO3 24, anion gap 12, albumin 4 g/dL) are rounded teaching values, editable on the page; check your own laboratory's ranges. Checked in the tests on 15 hand-worked teaching cases and on random gases against an independent Python implementation of the same rules."
flow:
  - { icon: flask, label: "Blood gas" }
  - { icon: check, label: "Primary" }
  - { icon: calculator, label: "Gaps" }
  - { icon: target, label: "Diagnosis" }
---

## What it does

Reading an arterial blood gas is a fixed sequence of steps that students learn by repetition. This page walks through that sequence for any set of numbers and shows every step with its arithmetic: whether the numbers agree with each other, whether the blood is too acid or too alkaline, which system (metabolic or respiratory) caused it, whether the other system has compensated as much as expected, and what the anion gap, delta ratio, lactate and osmolar gap add. It ends with a list of the disorders found and an acid-base map. It is for study and teaching, not medical advice.

For the kidney side of a metabolic acidosis, use the [[kidney-function|kidney function calculator]]; to convert results between mmol/L and mg/dL, the [[lab-unit-converter]].

## How to use it

1. Type **pH, pCO2 and HCO3** from the gas, and **sodium, chloride and albumin** from the chemistry. pCO2 can be in mmHg or kPa and albumin in g/dL or g/L; switching a unit converts the number in its box.
2. Optionally add **lactate**, **glucose** and **urea** (or BUN in mg/dL) and the **measured osmolality** for the osmolar gap.
3. Open **Assumed normal values** to change the reference points to your lab's. They are rounded teaching values: pCO2 40 mmHg, HCO3 24 mmol/L, anion gap 12 (raised above 16), albumin 4 g/dL, osmolar gap raised above 10, lactate raised above 2.
4. Read the **Interpretation** list and the **Step by step** explanation, and download the report if you need it.

## The steps and rules

1. **Consistency:** pH from Henderson-Hasselbalch, 6.1 + log10(HCO3 ÷ (0.03 × pCO2)), should be within 0.05 of the measured pH.
2. **pH:** below 7.35 is acidaemia, above 7.45 alkalaemia.
3. **Primary disorder:** the value (HCO3 or pCO2) that explains the pH direction. If both do, the disorder is mixed.
4. **Compensation:** metabolic acidosis uses Winter's formula, expected pCO2 = 1.5 × HCO3 + 8 ± 2. Metabolic alkalosis: pCO2 = 40 + 0.7 × (HCO3 − 24) ± 5. Respiratory acidosis: HCO3 rises 1 per 10 mmHg acutely and 3.5 per 10 when chronic; respiratory alkalosis: HCO3 falls 2 per 10 acutely and 5 per 10 when chronic (each ± 2). A value outside the expected range means a second disorder.
5. **Anion gap** = Na − (Cl + HCO3), corrected by adding 2.5 for each g/dL of albumin below normal (Figge 1998).
6. **Delta ratio** = (AG − 12) ÷ (24 − HCO3) when the gap is high: under 0.4 normal-gap acidosis, 0.4 to 0.8 both kinds, 0.8 to 2 a pure high-gap acidosis, above 2 an added metabolic alkalosis.
7. **Lactate** and the **osmolar gap** (measured − (2 Na + glucose + urea)) point to the cause of a high gap.

## Worked example

The page opens with pH 7.32, pCO2 28 mmHg, HCO3 14, Na 140, Cl 100, albumin 3 g/dL, lactate 13, glucose 6, urea 7 and measured osmolality 297. The numbers agree (7.32). It is an acidaemia with a **primary metabolic acidosis**. Winter's formula expects pCO2 27.0 to 31.0, and 28 fits: compensation is appropriate. The anion gap is 26.0, **28.5 after albumin correction**, so it is a **high anion gap metabolic acidosis**. The delta ratio is **1.65**, a pure high-gap acidosis, and the lactate of 13 explains most of the gap. The calculated osmolality is 293.0 and the osmolar gap 4.0, not raised.

## FAQ

**Why do textbooks give slightly different rules?** The rules of thumb come from different patient groups. The differences (3.5 or 4 per 10 mmHg, ± 2 or ± 5) rarely change the conclusion, but borderline values need judgement.

**Does it use potassium?** No. Most teaching uses the gap without potassium; set the normal values to match whichever your lab reports.

**Is anything sent or saved?** No. Everything is worked out in your browser.
