---
title: "Rule-based audiogram algorithm for noise-induced hearing loss in workers"
summary: "A 2025 PeerJ study built a spreadsheet algorithm that reads workers' audiograms and checked it against ten occupational health doctors. Here is how to test that kind of agreement yourself."
tools: [audiogram, diagnostic-test-calculator, confusion-matrix]
updated: 2026-11-10
sources:
  - "Yew and Raja Pathmanathan (2025), Development and validation of the AUDEXCEL algorithm as a diagnostic tool for occupational noise-related hearing disorder, PeerJ 13: e20149. Open access under the Creative Commons Attribution License, as stated on the publisher's article page, checked 2026-11-10."
  - "World Health Organization (2021), World Report on Hearing (grades of hearing loss by the better-ear average of 0.5, 1, 2 and 4 kHz)."
  - "Cohen J (1960), Educational and Psychological Measurement 20: 37-46 (Cohen's kappa)."
paper:
  title: "Development and validation of the AUDEXCEL algorithm as a diagnostic tool for occupational noise-related hearing disorder"
  authors: "Yew and Raja Pathmanathan (names as in the paper's copyright line)"
  journal: "PeerJ"
  year: 2025
  doi: "10.7717/peerj.20149"
  url: "https://peerj.com/articles/20149"
  licence: "CC BY"
  reviewed: true
---

Reading hearing test charts for hundreds of factory and site workers takes doctors a lot of time, and two readers do not always agree. A 2025 study in *PeerJ* built a set of rules inside an ordinary spreadsheet, called AUDEXCEL, that sorts workers' audiograms into categories such as normal hearing, hearing loss and noise-induced hearing loss. On a test set it matched the doctors' verdicts almost perfectly for most categories and a little less well for noise-induced loss. The paper is open access under a Creative Commons Attribution licence. You can plot a practice chart with the [[audiogram]] plotter and score agreement with the [[diagnostic-test-calculator]], both in your browser.

## What they found

The team took 320 audiograms of workers from one occupational health clinic in Kuala Lumpur, Malaysia. Ten experienced occupational health doctors decided what each chart showed, and their agreed answer served as the reference. The algorithm then read the same charts.

On the held-back testing data the authors report:

- **Normal hearing, hearing loss, and two kinds of threshold shift**: complete agreement, with sensitivity, specificity and Cohen's kappa all at their maximum.
- **Hearing impairment**: sensitivity 100%, specificity 99.5% and kappa 0.994.
- **Noise-induced hearing loss (NIHL)**: sensitivity 90.3%, specificity 98.0% and kappa 0.922. In other words, the rules missed about one in ten of the cases the doctors called NIHL, and wrongly flagged a small share of the rest.

## Why it matters

In many countries, employers must test the hearing of workers exposed to loud noise and report work-related hearing loss. Rules on exposure limits and reporting vary by country, so check the official source. A free, transparent rule set in a spreadsheet could help small clinics screen charts consistently and spot workers who need a closer look. The authors stress that it should support a doctor's judgement, not replace it, because a diagnosis also needs the worker's noise history and an ear examination. This article is general education, not a hearing assessment.

## How they did it

An audiogram records the quietest tone a person can hear at each frequency, in decibels hearing level (dB HL); bigger numbers mean worse hearing. Noise damage typically shows as a dip, or "notch", around 3 to 6 kHz, with better hearing again at 8 kHz.

AUDEXCEL holds six rule-based checks. They compare each worker's thresholds with fixed limits and with the worker's earlier baseline test, and apply published notch criteria for NIHL. The team checked the rules with five-fold cross-validation (the 320 charts split into five groups of 64, each taking a turn as the test set), measured sensitivity, specificity and predictive values, and used Cohen's kappa for agreement beyond chance.

## Check it yourself with fibub

**Part 1: plot a chart.** These are **made-up thresholds for one imaginary worker**, not data from the study.

```
Hz	Right air	Left air
250	10	10
500	10	15
1000	15	15
2000	20	25
3000	40	45
4000	50	55
6000	35	40
8000	20	25
```

1. Paste the lines into the audiogram plotter. Leave the degree scheme on WHO 2021 and the average on PTA4 (0.5, 1, 2 and 4 kHz).
2. The right ear's PTA4 comes out at **23.75 dB HL** and the left at **27.5 dB HL**, so both fall in the WHO "Mild" band (20 to under 35 dB HL). The page reports the better ear, the right, as mild.
3. Switch the average to PTA3 (0.5, 1 and 2 kHz). The right ear drops to **15 dB HL** and the left to about **18.3 dB HL**, both under the 20 dB limit. The speech frequencies look fine; the damage sits higher up.
4. Look at the plot. Both ears dip to their worst at 4 kHz and recover by 8 kHz. That shape is the notch an NIHL rule looks for. The plotter does not name a notch itself; you judge it by eye.

**Part 2: score a rule against the doctors.** Imagine **made-up counts** from 200 charts: the doctors called 60 of them NIHL. A rule caught 54 of those, missed 6, and wrongly flagged 2 of the other 140.

1. In the diagnostic test calculator, choose **2 × 2 table** and type 54 true positives, 2 false positives, 6 false negatives and 138 true negatives.
2. Sensitivity is **90.0%** (exact 95% CI 79.5 to 96.2%), specificity **98.6%**, positive predictive value **96.4%** and negative predictive value **95.8%**.
3. For agreement beyond chance, type the same four counts into the [[confusion-matrix]] tool (TP 54, FN 6, FP 2, TN 138). Cohen's kappa is **0.903** (95% CI 0.837 to 0.969).

Notice how a few missed cases pull sensitivity down far more than they move kappa. That is the same pattern the paper reports for NIHL.

## The fine print

- All charts came from one clinic in one city, and there was no outside test set. The rules might do less well elsewhere.
- The same pool of charts was used to build and to check the rules, so the scores may be a little optimistic.
- The algorithm gives yes-or-no answers and does not grade how bad the loss is.
- It does not use noise exposure, hearing protection or the worker's history, which doctors weigh in a real diagnosis.
- The paper's abstract and tables give slightly different figures for some training-set results; check the full text before quoting them.
