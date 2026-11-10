---
title: "OWAS posture rating in forestry: human raters vs a ResNet-50 model, Cohen's and Fleiss' kappa"
summary: "A 2025 Forests study found human OWAS raters agree poorly with each other and with a deep learning model. Rerun the kappa checks in your browser."
tools: [reliability-analysis, confusion-matrix]
updated: 2026-11-10
sources:
  - "Forkuo GO, Marcu MV, Kaakkurivaara N, Kaakkurivaara T, Borz SA (2025), Forests 16(5): 759, the paper described here."
  - "Kappa bands (slight, fair, moderate, substantial, almost perfect): Landis and Koch (1977), Biometrics 33: 159-174."
  - "The rating tables in the worked example are made up by fibub, not taken from the paper."
paper:
  title: "Human and Machine Reliability in Postural Assessment of Forest Operations by OWAS Method: Level of Agreement and Time Resources"
  authors: "Forkuo GO, Marcu MV, Kaakkurivaara N, Kaakkurivaara T, Borz SA"
  journal: "Forests"
  year: 2025
  doi: "10.3390/f16050759"
  url: "https://www.mdpi.com/1999-4907/16/5/759"
  licence: "CC BY"
  reviewed: true
---

Forest work is hard on the body, and ergonomists score it with OWAS, the Ovako Working posture Analysis System: each photo of a worker gets a code for the back, the arms, the legs and the load, and the codes add up to an action category that says how urgently the posture needs fixing. A 2025 study in Forests asked a simple question: if three trained people and a deep learning model rate the same 100 photos, how often do they agree? The answer, measured with Cohen's and Fleiss' kappa, was "not very". This page explains the study and shows how to run the same agreement checks with the [[reliability-analysis|reliability calculator]], plus the [[confusion-matrix]] tool to see which categories cause the trouble.

## What they found

The same person rating the same photos a month apart agreed with themselves fairly well: Cohen's kappa ranged from 0.48 to 1.00 across the body parts. Different people agreed much less, with kappa from 0.02 to 0.64. Each person against the model did worse still, from −0.03 to 0.34. Taking all four raters together, Fleiss' kappa was about 0.28 to 0.49 (the paper gives 0.26 as the low end in one section). The model, though, took about one second per image, roughly 19 to 53 times faster than the people.

## Why it matters

OWAS scores decide which jobs get redesigned first. If two trained raters disagree on a third of the photos, the ranking of risky jobs depends on who did the rating. A model that is consistent and fast is attractive, but consistency is not the same as being right, and this study did not test the model against an agreed ground truth.

## How they did it

The model was a ResNet-50 convolutional network, trained earlier by the same group on about 23,000 images. For this study, 100 photos of manual and partly mechanised forest work were picked at random from the team's collection. Three raters scored each photo twice, about a month apart. The team computed Cohen's kappa for every pair of ratings, Fleiss' kappa for the panel, plain percentage agreement and the time spent, and drew the raters on a multidimensional scaling map.

## Check it yourself with fibub

Kappa asks how much better two raters agree than they would by luck alone. If both put most photos in "back straight", they will agree often even when guessing, so kappa takes that chance agreement away: κ = (p_o − p_e) / (1 − p_e), where p_o is the share of photos they agree on and p_e the share expected by chance.

1. **Two raters.** Open the reliability calculator, press **Two raters** and keep **A table of counts**. Paste this **made-up** table of 40 photos, a person's back codes down the side and a model's across the top:

   ```
   	1	2	3	4
   1	14	2	0	0
   2	3	8	1	0
   3	0	2	5	1
   4	0	0	1	3
   ```

   They agree on 30 of 40 photos (75 %), but chance alone would give 30.5 %, so kappa is **0.640** (95 % interval 0.449 to 0.831), "substantial", but with a wide interval from only 40 photos.
2. **Weights only for ordered codes.** OWAS back codes (straight, bent, twisted, bent and twisted) are labels, not a scale, so keep **Weights** at **None**. The action categories 1 to 4 are ordered, and if this table were action categories, linear weights would give 0.767, because a one-step miss counts as half right.
3. **Many raters.** Press **Many raters** and paste one row per photo with the number of raters (out of 4) choosing each code. Our made-up 10 photos (4 0 0 0; 3 1 0 0; 0 4 0 0; 2 2 0 0; 0 1 3 0; 0 0 4 0; 1 3 0 0; 0 0 1 3; 4 0 0 0; 0 2 2 0) give Fleiss' kappa **0.526**, "moderate".
4. **Watch the chance trap.** Try a 2 × 2 table where almost every photo is "safe": 36 and 2 in the first row, 1 and 1 in the second. Agreement is 92.5 %, yet kappa is only **0.362** and the interval runs from below zero to 0.92. High agreement on a rare category is weak evidence.
5. **Find the weak class.** In the confusion matrix tool, choose **A matrix of counts** and paste the table from step 1, treating the model as "predicted". Per-class recall shows code 1 at 0.875 but code 3 at 0.625, so the disagreements pile up on twisted backs. Accuracy and kappa match the reliability calculator.

## The fine print

- The model's labels were treated as the reference, but its accuracy on these 100 photos was never measured against an expert consensus.
- One rater helped build the model and the photos came from its training collection, which may have raised that rater's agreement with it.
- 100 photos is a small sample for kappa, especially for rare postures; intervals would be wide.
- Raters improved on the second round, so familiarity affected the repeat scores.
- OWAS itself does not separate left and right limbs, which limits any method that uses it.
- This is ergonomics research, not advice on any individual's health or job.
