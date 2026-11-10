---
title: "Race-free CKD-EPI 2021 vs EKFC eGFR against measured iohexol GFR"
summary: "A 2025 open-access study in a large US hospital found the race-free 2021 CKD-EPI eGFR closest to measured kidney function, and saw many people move up a CKD stage. Here is how to explore it."
tools: [kidney-function, bland-altman, lab-unit-converter]
updated: 2026-11-10
sources:
  - "Ilori EO, Cai CR, Sahor F et al. (2025), Performance of the 2021 Estimated Glomerular Filtration Rate CKD-EPI Refit and the European Kidney Function Consortium (EKFC) Formulas, Diagnostics 15(8): 1047, published 21 April 2025. Open access under CC BY 4.0, as stated on the publisher's article page, checked 2026-11-10."
  - "Inker LA et al. (2021), New creatinine- and cystatin C-based equations to estimate GFR without race, N Engl J Med 385: 1737-1749 (the 2021 CKD-EPI equations)."
  - "KDIGO 2012 Clinical Practice Guideline for the Evaluation and Management of CKD (the G1 to G5 categories)."
paper:
  title: "Performance of the 2021 Estimated Glomerular Filtration Rate CKD-EPI Refit and the European Kidney Function Consortium (EKFC) Formulas"
  authors: "Ilori EO, Cai CR, Sahor F, Wilson B, Veeramachaneni T, Parikh SM, Hashim IA"
  journal: "Diagnostics"
  year: 2025
  doi: "10.3390/diagnostics15081047"
  url: "https://www.mdpi.com/2075-4418/15/8/1047"
  licence: "CC BY 4.0"
  reviewed: true
---

Doctors rarely measure kidney function directly. Instead, they estimate the glomerular filtration rate (GFR), the volume of blood the kidneys clean each minute, from a blood test for creatinine plus age and sex. In 2021 the most widely used US equation was refitted without a race term. A 2025 open-access paper in *Diagnostics* tested that race-free version, and a European alternative, against measured GFR in patients at a large US public hospital. It found the race-free 2021 equation the closest of the three. The [[kidney-function]] calculator runs the 2021 equation in your browser, so you can see how a single creatinine result turns into an estimate and a stage.

## What they found

The team compared three equations: the older race-based CKD-EPI equation, the 2021 race-free refit (which the paper calls REFIT), and the formula from the European Kidney Function Consortium (EKFC). They applied all three to records from 75,442 Black and White adults, and checked them against measured GFR in 171 people.

The race-free 2021 equation had the smallest typical error in both groups. The authors report that about 92% of its estimates in Black patients and 93% in White patients fell within 30% of the measured value, a standard yardstick called P30. The older equation reached only about 67% and 62%. EKFC came close to the 2021 equation, and the difference between those two was not statistically significant.

Changing equations also changes labels. Moving from the old equation to the 2021 one put about 80% of Black patients and 61% of White patients into a higher (worse) stage of chronic kidney disease (CKD) in this hospital's records.

## Why it matters

The stage of CKD affects referrals, drug doses and, for transplant lists, waiting time. Dropping race from the equation was meant to remove a correction that had no clear biological basis. This paper adds evidence from a diverse US population that the race-free equation is also accurate, and it shows the practical side: when the equation changes, a large share of people get a new stage on paper even though their kidneys have not changed.

## How they did it

The large data set came from electronic health records of adults seen at one county hospital between 2019 and 2020. For accuracy, the team needed a true reference, so they used iohexol clearance in a smaller group. Iohexol is a contrast agent that the kidneys clear almost entirely by filtration, so timing how fast it leaves the blood gives a measured GFR.

They then worked out the median bias (measured minus estimated GFR), the P30, and the share of people whose stage changed between equations. Stages followed the KDIGO categories, from G1 (normal or high) to G5 (kidney failure).

## Check it yourself with fibub

Everything below uses **our own made-up values**, not the paper's data.

**Step 1: one estimate.** Open the eGFR calculator. Enter age 60, sex female, creatinine 1.1 with the unit mg/dL, and leave cystatin C blank for now. The 2021 creatinine equation gives about **57.5 mL/min/1.73 m²**, which is stage **G3a** (45 to 59). MDRD, shown for comparison, gives about 50.7. Switch the unit to µmol/L and type 97: the estimate barely moves (57.7), because 97 µmol/L is almost the same as 1.1 mg/dL. The [[lab-unit-converter]] does that conversion for other lab values.

**Step 2: the cut-off effect.** Add a cystatin C of 1.4 mg/L. The combined 2021 equation now reads about 52.0, still G3a. Change cystatin C to 1.0 and it jumps to about 67.6, stage G2. One extra test can move a person across a stage line, which is the same effect the paper saw when it swapped whole equations.

**Step 3: P30 by hand.** Suppose ten invented people had both an estimate and a measured GFR (estimate first, in mL/min/1.73 m²): 58 and 50, 72 and 95, 40 and 38, 90 and 70, 65 and 60, 30 and 44, 105 and 98, 50 and 52, 80 and 61, 47 and 45. Divide each gap by the measured value. Only two miss by more than 30% (30 vs 44 is 31.8% off, 80 vs 61 is 31.1% off), so P30 is **8 out of 10, or 80%**. The median of measured minus estimated is **−3.5**, a small overestimate.

**Step 4: agreement.** Paste the same ten pairs into the [[bland-altman]] tool with the *Percentage difference* scale. It gives the average gap and the range most gaps fall in, a fuller picture than P30 alone.

## The fine print

- Measured GFR was available for only 171 people, so the accuracy figures rest on a small group.
- All data came from one hospital in one US city, and only Black and White patients were included.
- Iohexol clearance is itself a measurement with its own error.
- The stage shifts describe records, not health: no patient was followed to see whether outcomes changed.
- EKFC and the 2021 equation were close, and the paper says their accuracy difference was not significant. The fibub calculator does not include EKFC.
- This is general education, not medical advice. Kidney results should be read by a qualified professional, and rules on which equation to use differ by country, so check the official source.
