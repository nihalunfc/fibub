---
title: "Tebuconazole 96 h LC50 in rainbow trout: blood and gill effects"
summary: "A 2025 study found a 96-hour LC50 of about 9 mg/L for the fungicide tebuconazole in young rainbow trout, with clear blood and gill damage. Here is how to fit an LC50 like it."
tools: [lc50-probit, species-sensitivity, dose-response]
updated: 2026-11-10
sources:
  - "Er A (2025), Toxics 13(8): 630, CC BY 4.0, the paper described here."
  - "Probit model, Abbott's correction for control deaths and Fieller (fiducial) limits: Finney, Probit Analysis (3rd ed., 1971). Method only."
paper:
  title: "Short-Term Exposure to Tebuconazole Triggers Haematological, Histological and Biochemical Disturbances in Rainbow Trout (Oncorhynchus mykiss)"
  authors: "Er A"
  journal: "Toxics"
  year: 2025
  doi: "10.3390/toxics13080630"
  url: "https://www.mdpi.com/2305-6304/13/8/630"
  licence: "CC BY 4.0"
  reviewed: true
---

Tebuconazole is one of the most widely sprayed fungicides on cereals, fruit and vegetables, and some of it washes into streams. A 2025 study in the journal Toxics exposed young rainbow trout to it for four days and reports a 96-hour LC50 of about 9 mg/L: the concentration expected to kill half the fish. At that level the fish also showed changes in their blood, liver enzymes and gills. If you have counts of dead and living animals from a test of your own, the [[lc50-probit]] tool fits the same kind of curve in your browser, and the result can then feed a [[species-sensitivity|species sensitivity distribution]] across many species.

## What they found

The study, by a single author at a fisheries faculty in Türkiye, reports a 96-hour LC50 of 9.05 mg/L, found by probit analysis. No fish died in the clean-water control or at 6 mg/L, which the paper treats as the highest level the fish tolerated without deaths.

Fish held at the LC50 for the sublethal tests had fewer red and white blood cells, less haemoglobin and a lower packed cell volume than control fish. Two liver enzymes in the blood, ALT and AST, rose, and so did creatinine, a marker linked to kidney function. Blood glucose and total protein fell. Under the microscope, the gills were damaged, and a damage score built from several kinds of gill lesion rose from about 5 in control fish to about 21 at the LC50. Fish at 6 mg/L sat in between.

## Why it matters

An LC50 is the standard first number regulators use to compare how toxic chemicals are to water life. This one says tebuconazole is moderately toxic to trout in short exposures. The blood and gill results add something an LC50 alone cannot: they show the fish were harmed at levels that did not kill them. Gills handle breathing, salt balance and waste removal, so damage there can weaken a fish long after a spray event has passed.

## How they did it

1. Juvenile trout of about 95 g were settled in tanks for two weeks, then held without food for two days.
2. Groups of 10 fish per 70-litre tank, three tanks per level, were exposed to six concentrations from 7.5 to 18 mg/L, plus a clean-water control. Deaths were counted at 24, 48, 72 and 96 hours.
3. Water oxygen, temperature, conductivity and pH were checked through the test.
4. The LC50 came from probit analysis. Separate groups were then held at the LC50 and at 6 mg/L for the blood, enzyme and gill work.
5. Group means were compared by one-way analysis of variance (ANOVA) with Tukey's follow-up test.

## Check it yourself with fibub

The [[lc50-probit]] page takes one row per concentration: the concentration, how many animals were exposed, and how many died. Here is a worked example with **our own made-up numbers**, not the paper's data.

| Concentration (mg/L) | Exposed | Dead |
|---|---|---|
| 0 (control) | 20 | 0 |
| 4 | 20 | 1 |
| 6 | 20 | 5 |
| 9 | 20 | 11 |
| 13.5 | 20 | 16 |
| 20 | 20 | 20 |

1. Paste the six rows into the box, or open them from a spreadsheet file.
2. Leave **Model** on Probit and **Response** on Death (LC).
3. Leave **Natural response** on "From the control". With no control deaths it stays at 0 %.
4. Read the result. For these numbers the tool gives an **LC50 of 8.42 mg/L**, with 95 % fiducial limits of 7.24 to 9.77 mg/L. Fiducial limits are the confidence range for a concentration read off the fitted line.
5. Look at the facts below it. The slope is 5.08 ± 0.82 probits per tenfold rise, which is steep: these made-up fish go from few deaths to all deaths over a narrow range. The Pearson χ² is 1.05 on 3 degrees of freedom (p = 0.79), so the scatter fits chance, and Finney's g is 0.10, well under 0.4, so the limits can be trusted.
6. The LC10 is 4.71 mg/L and the LC90 is 15.1 mg/L. Add other levels in "Also report".

Now suppose 2 of the 20 control fish had died. Choose "From the control" again and the tool takes a natural death rate of 10 % into the fit (Abbott's correction). At 6 mg/L, the observed 25 % becomes (0.25 − 0.10) ÷ (1 − 0.10) = 16.7 % due to the chemical, and the LC50 moves up to 9.23 mg/L. Switch the model to Logit to see how much the shape of the curve matters: with the clean control, the LC50 is 8.44 mg/L, almost the same.

If you only have a smooth measured response, such as gill score or enzyme level against concentration, the [[dose-response|dose-response fitter]] is the better choice, because the LC50 tool is built for counts.

## The fine print

- The LC50 is for one life stage of one species, in one water quality, over four days. Other fish, younger fish or longer exposures can give different values.
- The product tested was a commercial formulation that was 25 % tebuconazole. Read the paper for how the concentrations are expressed before comparing them with other studies.
- The blood and gill tests used just two exposure levels, both far above typical stream levels.
- The paper gives the LC50 with a confidence interval, but our numbers above are invented and are not meant to match it.
- This page is general science education. For regulatory work, follow the test guideline you work under and check results with validated software.
