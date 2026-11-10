---
title: "Point-of-care HbA1c, lipids and CRP vs central lab: Bland-Altman agreement"
summary: "A 2025 open-access study compared a primary care testing platform with a hospital lab on 100 samples. Here is how to read its bias and limits of agreement for yourself."
tools: [bland-altman, lab-unit-converter, westgard-qc]
updated: 2026-11-10
sources:
  - "Moretti G, Alcaro FD, Colacicco L, Urbani A (2025), Comprehensive Evaluation of a Point-of-Care Testing Platform for Decentralized Primary Healthcare: Ensuring Analytical Quality Through Central Laboratory Oversight, Diagnostics 15: 2977. Open access under the Creative Commons Attribution (CC BY) license, as stated in the published article, checked 2026-11-10."
  - "Bland JM and Altman DG (1986), Statistical methods for assessing agreement between two methods of clinical measurement, The Lancet 327: 307-310."
  - "HbA1c units: the IFCC-NGSP master equation, NGSP % = 0.09148 × IFCC (mmol/mol) + 2.152."
paper:
  title: "Comprehensive Evaluation of a Point-of-Care Testing Platform for Decentralized Primary Healthcare: Ensuring Analytical Quality Through Central Laboratory Oversight"
  authors: "Moretti G, Alcaro FD, Colacicco L, Urbani A"
  journal: "Diagnostics"
  year: 2025
  doi: "10.3390/diagnostics15232977"
  url: "https://doi.org/10.3390/diagnostics15232977"
  licence: "CC BY"
  reviewed: true
---

Point-of-care testing means running a blood test next to the patient, for example in a family doctor's room or a pharmacy, instead of sending the sample to a hospital laboratory. It is quick, but the result is only useful if it agrees with the laboratory closely enough. A 2025 open-access paper in *Diagnostics* tested one small benchtop system for seven common tests against a university hospital's central analysers. The way it reports agreement, with a mean bias and limits of agreement, is exactly what the [[bland-altman]] tool works out from paired results, and the [[lab-unit-converter]] helps when the two sides report different units.

## What they found

The team ran 100 leftover patient samples on both the point-of-care system and the hospital's reference methods. The tests were HbA1c (a marker of average blood sugar over about three months), glucose, total cholesterol, HDL cholesterol, triglycerides, creatinine and C-reactive protein (CRP, a marker of inflammation).

All seven tests correlated strongly with the laboratory. Agreement in level was mixed. The authors report that the point-of-care HbA1c read on average about 2.6 mmol/mol higher than the laboratory method, total cholesterol about 14 mg/dL higher, and triglycerides about 37 mg/dL lower. Glucose and HDL cholesterol had very small average differences. They conclude the system can be used in primary care as long as a central laboratory oversees its quality.

## Why it matters

Moving tests out of hospitals can shorten waits and save trips, especially for people with diabetes or heart risk who need regular checks. But a steady offset matters when a result sits close to a decision line. HbA1c of 48 mmol/mol (6.5%) is a widely used threshold for diagnosing diabetes, so a device that reads a few units high could move some people across it. That is why the paper argues for laboratory oversight rather than leaving devices to run on their own.

## How they did it

The samples came from routine work at a hospital in Rome and were tested on both systems. The point-of-care side used venous whole blood; the laboratory used plasma, or whole blood for HbA1c, measured by high-performance liquid chromatography (HPLC). Trained laboratory staff did all the testing. For each test, the team drew a Bland-Altman plot (the difference between the two methods against their average) and fitted a Deming regression line, which allows for measurement error in both methods.

## Check it yourself with fibub

The ten pairs below are **our own invented HbA1c values** in mmol/mol, not the paper's data. Paste them into the Bland-Altman tool, one pair per line, point-of-care first (method A), laboratory second (method B):

`41 38`, `44 42`, `51 47`, `52 50`, `56 53`, `62 58`, `66 64`, `73 70`, `82 78`, `93 90`

**Step 1: bias and limits.** Keep the scale on *Difference (A − B)* and the limits at 95%. The tool reports a mean bias of **+3.0 mmol/mol** (95% interval 2.4 to 3.6) and limits of agreement from **1.4 to 4.6 mmol/mol**. In plain words: the invented device reads about 3 units high, and for most samples the gap will be between 1.4 and 4.6. None of the ten points falls outside the limits.

**Step 2: why correlation is not enough.** Look at the lower part of the results. Pearson's r is **0.9989**, almost perfect, yet every single pair differs. Lin's concordance correlation coefficient (CCC), which also penalises a shift in level, is lower at **0.981**. A strong correlation only shows the two methods rise and fall together, not that they give the same number.

**Step 3: proportional bias.** The tool fits a line through the differences. Here the slope is close to zero (p about 0.49), so the offset is about the same at low and high values. If the slope were clearly not zero, switching the scale to *Percentage difference* would be the fairer summary; for these pairs it gives a bias of about **+5.2%**.

**Step 4: the decision line.** Open the lab unit converter, choose HbA1c, and convert 48 mmol/mol to %: it gives **6.54%**. Now convert 51 mmol/mol, the same sample read 3 units high: **6.82%**. A 3-unit bias is about 0.27 percentage points at this level, enough to move a borderline result across the line.

**Step 5: unit check.** The paper reports cholesterol in mg/dL. In the converter, choose total cholesterol and change 14 mg/dL to mmol/L: about **0.36 mmol/L**, the unit used in many countries.

For the day-to-day oversight the authors recommend, the [[westgard-qc]] tool checks control-sample results run by run against the standard quality-control rules.

## The fine print

- The samples were venous blood handled by trained laboratory staff. Finger-prick samples and busy clinic staff could give wider differences.
- 100 samples is a reasonable size for a method comparison, but the paper does not report imprecision (repeatability) or set allowable error limits in advance.
- The authors' main yes-or-no criterion was a correlation above 0.95, which, as Step 2 shows, can hide a steady bias.
- Some percentage biases quoted in the discussion do not appear in the results tables, so read the tables for the figures.
- Only one brand of device and one hospital laboratory were compared.
- This is general education, not medical advice. Diagnostic thresholds and testing rules differ by country, so check the official source and ask a qualified professional about any result.
