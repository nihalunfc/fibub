---
title: "Bladder cancer urine test cut-offs: sensitivity, precision and predictive values"
summary: "A 2025 open-access paper reads 1,243 used rapid urine test cassettes with a photometer and asks which cut-off balances sensitivity against precision. Here is how to rework that trade-off in your browser."
tools: [diagnostic-test-calculator, roc-curve]
updated: 2026-11-10
sources:
  - "Oehr P (2025), Interrelationships Among Sensitivity, Precision, Accuracy, Specificity and Predictive Values in Bioassays, Represented as Combined ROC Curves with Integrated Cutoff Distribution Curves and Novel Index Values, Diagnostics 15(4): 410. Open access under CC BY 4.0, as stated on the publisher's article page, checked 2026-11-10."
  - "Youden WJ (1950), Cancer 3: 32-35 (Youden's index)."
  - "Fagan TJ (1975), N Engl J Med 293: 257 (the nomogram)."
paper:
  title: "Interrelationships Among Sensitivity, Precision, Accuracy, Specificity and Predictive Values in Bioassays, Represented as Combined ROC Curves with Integrated Cutoff Distribution Curves and Novel Index Values"
  authors: "Oehr P"
  journal: "Diagnostics"
  year: 2025
  doi: "10.3390/diagnostics15040410"
  url: "https://www.mdpi.com/2075-4418/15/4/410"
  licence: "CC BY"
  reviewed: true
---

Every lab test with a number behind it needs a line: above it the result counts as positive, below it negative. Move the line and you trade missed cases against false alarms. A 2025 paper in *Diagnostics* takes a rapid urine test for bladder cancer and argues that the usual way of picking that line, the cut-off with the best Youden's index, can leave too many false positives when the disease is uncommon. It is open access under a CC BY licence. You can rework the same trade-off with the [[diagnostic-test-calculator]], which turns four counts into sensitivity, specificity and predictive values, and the [[roc-curve]] tool, which tries every cut-off at once.

## What they found

The study looked at 1,243 urine samples tested in routine care with a point-of-care cassette (UBC Rapid) that detects fragments of cytokeratin-8 and cytokeratin-18 proteins, which bladder tumours tend to release. Of these, 91 came from people with confirmed bladder cancer and 1,152 from people with no sign of it, so about 7% had the disease (91 of 1,243).

Using a reader to measure the strength of the test line, the author could set the cut-off wherever he liked, in micrograms per litre. The best Youden's index came at a low cut-off of 10 µg/L, where the paper reports a specificity of about 76%. With only 7% of people having cancer, a specificity of 76% means a lot of false positives among the positives. The author instead proposes a common cut-off near 40 µg/L, where several of the curves meet. There, sensitivity is roughly 38% and specificity about 94%.

## Why it matters

Sensitivity and specificity describe the test. The question a patient or a clinic asks is different: if my result is positive, how likely is it real? That is the **positive predictive value** (PPV), also called **precision**, and it depends heavily on how common the disease is in the group tested. A test that looks good on a curve can still give mostly false alarms when the condition is rare. The paper's point is that choosing a cut-off by one index alone hides this, and that precision and accuracy deserve a place on the chart too.

## How they did it

The cassettes had already been used in urology clinics. Instead of reading them by eye, the author measured each test line with a small photometer, which gave a number for every sample. With a number, the same data can be split at many cut-offs. At each one the author counted true and false positives and negatives and worked out sensitivity, specificity, precision, accuracy and negative predictive value.

These were then drawn together on combined receiver operating characteristic (ROC) charts, with extra curves showing how each measure moves as the cut-off changes, plus a set of new summary indices. The paper argues that the usual area under the curve does not suit some of these new curves, because they can cross the diagonal, and suggests a different area measure.

## Check it yourself with fibub

Here is a **made-up example** with round numbers of our own, not the paper's data and not its disease rate. Picture 1,000 people tested for an imaginary condition that 50 of them (5%) really have, with a test read at two cut-offs.

| Cut-off | True positives | False positives | False negatives | True negatives |
|---|---|---|---|---|
| Low | 40 | 285 | 10 | 665 |
| High | 25 | 76 | 25 | 874 |

1. Open the Diagnostic test calculator and stay on the **2 × 2 table** tab.
2. Type the low cut-off counts into the four boxes: 40, 285, 10 and 665. Leave the intervals on *Exact (Clopper-Pearson)* and 95%.
3. Read the table. Sensitivity is **80.0%** (95% CI 66.3 to 90.0%) and specificity **70.0%**. But the PPV is only **12.3%**: about one in eight positives really has the condition. The NPV is 98.5%.
4. Now type the high cut-off counts: 25, 76, 25 and 874. Sensitivity drops to **50.0%**, specificity rises to **92.0%**, and the PPV doubles to **24.8%**. Accuracy goes from 70.5% to 89.9%, mostly because the many healthy people are now classed correctly.
5. Compare Youden's index (sensitivity + specificity − 1): 0.50 at the low cut-off and 0.42 at the high one. Youden picks the low cut-off, yet the high one gives far fewer false alarms. That is exactly the tension the paper is about.
6. Use the pre-test box for a different setting. Type 20 for a clinic where one person in five has the condition. A positive at the low cut-off then lifts the probability to **40.0%**, and at the high cut-off to **61.0%**.

If you have the raw measured values rather than counts, paste them with the true outcome into the ROC curve tool: it lists sensitivity, specificity, PPV and NPV at every cut-off and marks the Youden point, so you can see the whole trade-off at once.

## The fine print

- The samples are used cassettes from routine care, chosen after the fact, not a planned trial with every person tested in the same way.
- About 7% prevalence is specific to these clinics. Predictive values in another setting will differ, sometimes a lot.
- The new indices and area measure are the author's own proposal and have not yet been widely tested by others.
- A sensitivity near 38% means most cancers would be missed at the higher cut-off, so the paper's suggested line is a trade-off, not a free gain.
- This is general education about test statistics, not medical advice. Check with a qualified professional, and read the paper itself for its exact values.
