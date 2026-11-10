---
title: "Methocarbamol 1500 mg tablet bioequivalence: Cmax and AUC in a crossover trial"
summary: "A 2025 crossover trial in 31 healthy adults found one 1500 mg methocarbamol tablet matched three 500 mg tablets for Cmax and AUC. Here is how those numbers come from a blood-level curve, and how to recompute them."
tools: [nca-pk, pk-simulator]
updated: 2026-11-10
sources:
  - "Ascaso-del-Rio A, Camargo-Mamani P, Gilaberte I et al. (2025), Bioequivalence Study of Two Oral Methocarbamol Formulations in Healthy Subjects Under Fasting Conditions: A Randomized, Open-Label, Crossover Clinical Trial, Pharmaceuticals 18(3): 354. Open access under CC BY 4.0, as stated on the publisher's article page, checked 2026-11-10."
  - "European Medicines Agency (2010), Guideline on the Investigation of Bioequivalence, CPMP/EWP/QWP/1401/98 Rev. 1 (the 80.00 to 125.00% acceptance range)."
  - "Gabrielsson J and Weiner D (2012), Non-compartmental analysis, Methods in Molecular Biology 929: 377-389 (trapezoid rules and the terminal slope)."
paper:
  title: "Bioequivalence Study of Two Oral Methocarbamol Formulations in Healthy Subjects Under Fasting Conditions: A Randomized, Open-Label, Crossover Clinical Trial"
  authors: "Ascaso-del-Rio A, Camargo-Mamani P, Gilaberte I et al."
  journal: "Pharmaceuticals"
  year: 2025
  doi: "10.3390/ph18030354"
  url: "https://www.mdpi.com/1424-8247/18/3/354"
  licence: "CC BY 4.0"
  reviewed: true
---

Does one big tablet deliver a medicine the same way as three small ones? A 2025 trial in *Pharmaceuticals* compared a single 1500 mg tablet of methocarbamol, a muscle relaxant, with three 500 mg tablets of the original brand, and found the two gave matching blood levels. The verdict rests on two numbers worked out from each person's blood-level curve: the peak (Cmax) and the area under the curve (AUC). The [[nca-pk]] tool computes both, with the half-life and more, from any concentration-time table you paste in.

## What they found

The authors report that the ratio of the two products' geometric means (test over reference) was about 101.5% for Cmax and 97.8% for AUC up to the last sample. The 90% confidence intervals were roughly 92 to 112% for Cmax and 92 to 103% for AUC. Both sit well inside the 80 to 125% range that regulators accept, so the new tablet was judged bioequivalent. Levels peaked at a median of about 1 hour for both, and the half-life was close to 1.4 hours. Side effects were all mild.

## Why it matters

Bioequivalence is how a new formulation, or a generic, shows it behaves like the one already approved without repeating every large clinical trial. If blood levels match, the effect is expected to match. A single tablet instead of three is easier to take, which can help people stick to a course of treatment.

## How they did it

Thirty-two healthy volunteers were randomly split into two groups. One group took the test tablet first and the reference tablets a week later; the other did the reverse. This is a **crossover** design: everyone acts as their own comparison, which cancels out much of the difference between people. The week-long gap (the washout) lets the first dose clear the body. One volunteer spat out part of a tablet, so 31 were analysed.

Blood was sampled from just before the dose to 12 hours after, most often in the first 3 hours, and methocarbamol was measured by liquid chromatography with mass spectrometry. Then came **non-compartmental analysis**: no model of the body, just the measured points. AUC was added up with the linear trapezoid rule (straight lines between points). The terminal slope, called λz (lambda-z), came from a straight-line fit to the log of the last falling points, and it gives both the half-life (0.693 / λz) and the small extra area after the last sample.

## Check it yourself with fibub

The two profiles below are **our own invented numbers**, shaped to look like a fast-absorbed oral drug with a half-life near 1.5 hours. They are not the paper's data.

| Time (h) | Test (µg/mL) | Reference (µg/mL) |
|---|---|---|
| 0 | 0 | 0 |
| 0.25 | 11.8 | 13.6 |
| 0.5 | 20.4 | 22.9 |
| 0.75 | 26.1 | 28.4 |
| 1 | 29.5 | 30.6 |
| 1.5 | 30.8 | 29.7 |
| 2 | 27.6 | 26.1 |
| 3 | 19.9 | 19.1 |
| 4 | 12.6 | 12.4 |
| 6 | 4.9 | 4.8 |
| 8 | 1.9 | 1.8 |
| 10 | 0.74 | 0.71 |
| 12 | 0.31 | 0.29 |

1. Open the NCA PK tool and paste the time and test columns. Set the route to *Extravascular*, the concentration unit to **µg/mL**, the amount given to **1500 mg**, and the AUC method to *Linear trapezoid*, as in the study.
2. Leave the terminal phase on *Best fit*. The tool picks the six points from 3 to 12 h (adjusted R² 0.9998).
3. Read the results for the test profile: Cmax **30.8 µg/mL** at 1.5 h, AUC0-t **115.93 h·µg/mL**, AUC0-∞ **116.59 h·µg/mL**, half-life **1.49 h**, and only **0.57%** of the area extrapolated, far below the usual 20% limit. Apparent clearance is about 12.9 L/h.
4. Paste the reference column instead. Cmax is **30.6 µg/mL** at 1 h and AUC0-t is **114.74 h·µg/mL**.
5. Divide test by reference for this one invented person: 30.8 / 30.6 = **100.7%** for Cmax and 115.93 / 114.74 = **101.0%** for AUC0-t. In a real trial you would do this for every volunteer, take logs, and build a 90% interval around the mean log ratio.
6. Switch the AUC method to *Linear up, log down*. AUC0-t for the test profile falls to 113.52 h·µg/mL, about 2% lower, because straight lines overshoot a falling curve. The choice matters less for the ratio, since both products shift together, but it should always be reported.

To see how dose, absorption rate or half-life would reshape a curve like this, try the [[pk-simulator]].

## The fine print

- All volunteers were healthy white adults studied after fasting, so food effects and other groups were not tested.
- The study was funded by the company that makes both products, and several authors work for it.
- The paper does not say how many terminal points were used for λz, and the individual data are available only on request.
- The abstract and the methods disagree on the number of sampling times (19 or 20), and one concentration unit is printed inconsistently; check the tables.
- This is general education about how drug studies are analysed, not advice on any medicine. Read the paper itself for full methods and results.
