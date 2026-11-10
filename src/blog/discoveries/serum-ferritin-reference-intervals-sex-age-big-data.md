---
title: "Serum ferritin reference intervals by sex and age from real-world big data"
summary: "A 2026 study used nearly 30,000 health check-ups to set new ferritin reference intervals for men, women up to 50 and older women. Here is how such limits are found, and how to try the method yourself."
tools: [reference-interval, lab-unit-converter]
updated: 2026-11-10
sources:
  - "Xu Y, Wu X, Zhang J et al. (2026), Establishment and Validation of Serum Ferritin Reference Intervals Based on Real-World Big Data and Multi-Strategy Partitioning Algorithms, Journal of Clinical Medicine 15(3): 976. Open access under a CC BY licence, as stated on the publisher's article page, checked 2026-11-10."
  - "CLSI (2010), EP28-A3c, Defining, Establishing, and Verifying Reference Intervals in the Clinical Laboratory (central 95% interval, 120 reference people, rank method)."
  - "Harris EK and Boyd JC (1990), Clinical Chemistry 36: 265-270 (when subgroups need their own intervals)."
paper:
  title: "Establishment and Validation of Serum Ferritin Reference Intervals Based on Real-World Big Data and Multi-Strategy Partitioning Algorithms"
  authors: "Xu Y, Wu X, Zhang J et al."
  journal: "Journal of Clinical Medicine"
  year: 2026
  doi: "10.3390/jcm15030976"
  url: "https://www.mdpi.com/2077-0383/15/3/976"
  licence: "CC BY"
  reviewed: true
---

Where does the "normal range" printed on a blood test come from? For serum ferritin, the protein that stores iron, a 2026 study in the *Journal of Clinical Medicine* built new ranges from almost 30,000 routine health check-ups at one large hospital. It found that men, women aged 50 or under, and older women each need their own range, and that the ranges supplied with the test kit fitted local people poorly. The [[reference-interval]] tool runs the same core steps on your own results: outlier screening, the central 95% interval with confidence limits, and the Harris-Boyd test for splitting by subgroup.

## What they found

The authors report these central 95% reference intervals: about **98 to 998 µg/L** for men, **10 to 300 µg/L** for women aged 50 or under, and **37 to 507 µg/L** for women over 50. Ferritin rose with age in women (correlation 0.47) but not in men, which fits the loss of iron through menstruation before menopause.

They then tested the new ranges on a fresh group of about 2,500 people seen in early 2025. Around 94% of them fell inside the new ranges. Only 57% of men and 37% of women over 50 fell inside the manufacturer's ranges. A common rule says a range is valid when no more than 10% of healthy people fall outside it.

## Why it matters

Low ferritin is one of the main signs of iron deficiency, and high ferritin can point to iron overload or inflammation. If a range is set too high or too low, healthy people get flagged and people who need follow-up can be missed. Building ranges from records a laboratory already holds, an *indirect* method, is cheaper than recruiting hundreds of carefully screened volunteers, but it needs careful cleaning of the data.

## How they did it

The team took results from apparently healthy adults who came for check-ups between 2020 and 2024, all measured on one immunoassay analyser. They kept only each person's first result and removed anyone with signs of liver, kidney or blood disease, cancer, recent surgery or infection.

Ferritin results are strongly skewed: most are low to middling, with a long tail of high values. So they first applied a **Box-Cox transformation**, a power curve that makes skewed data look more like a bell curve, and then removed outliers with **Tukey fences** (points far outside the middle half of the data) until none were left. To decide how to split the population, they used a decision tree to find a likely age cut-off and checked each split with the **Harris-Boyd** rule, which compares the gap between two groups' means with a critical value that grows with sample size. Finally, the limits were the **2.5th and 97.5th percentiles** of each group, with 90% confidence intervals from bootstrap resampling.

## Check it yourself with fibub

To try the method you need about 120 results per group. Here is a way to make a tidy, **invented** practice set in any spreadsheet. These are not the paper's data.

1. In rows 1 to 120 of column A, put `=ROUND(EXP(LN(300)+0.6*NORM.S.INV((ROW()-0.5)/120)),0)` and the letter `M` in column B. This gives 120 skewed "male" values with a middle of 300 µg/L.
2. In the next 120 rows, make "female" values with `=ROUND(EXP(LN(70)+0.8*NORM.S.INV((ROW()-120.5)/120)),0)` and the letter `F`.
3. Paste both columns into the tool, type `µg/L` as the unit, and keep the *Log* scale, *Central 95%* and *Tukey fences*. No results are flagged.
4. Read the combined interval: the nonparametric limits come out near **18 to 824 µg/L**. The 90% confidence interval of the lower limit runs from **12 to 24 µg/L**, a reminder of how uncertain the edges are.
5. Look at the *Subgroups (Harris-Boyd)* card. On the log scale z is about **15.9**, far above the critical z* of **3.0**, so the tool says M and F need separate intervals.
6. Paste each group alone. Men give roughly **88 to 1016 µg/L** and women **14 to 356 µg/L** by the rank method. With 120 results, each lower limit sits between the 3rd and 4th smallest values (at rank 0.025 × 121 = 3.025), and its 90% interval runs from the smallest to the 7th smallest.
7. Switch the scale to *Box-Cox* for the combined set. The parametric interval shifts from about 20 to 1058 µg/L (log) to about 16 to 885 µg/L, showing that the choice of transformation matters most in the long upper tail.

If your laboratory reports ferritin in ng/mL, the numbers are the same (1 ng/mL = 1 µg/L); the [[lab-unit-converter]] handles unit changes for other tests.

## The fine print

- All data came from one hospital and one analyser, so the ranges may not carry over to other methods or populations.
- The records held nothing on diet, iron tablets, alcohol or other illnesses.
- Ferritin rises with inflammation and fatty liver, so some "healthy" people may have had raised values, which could push the upper limits up, especially for older women.
- Finer age bands, such as by decade, were not supported by the splitting rules they used.
- A reference interval describes healthy people; it is not the same as a cut-off for diagnosing iron deficiency. This is general education, not medical advice; for exact values read the paper and check with a qualified professional.
