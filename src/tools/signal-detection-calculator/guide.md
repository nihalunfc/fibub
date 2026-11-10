---
name: Signal detection calculator
num: 721
shelf: science
code: T489
section: psychology-and-psychometrics
title: "d′ calculator: signal detection theory d prime, criterion c, beta and ROC curve (free)"
summary: "Work out d′, criterion c, β, A′ and B″ from hits, misses, false alarms and correct rejections, for one table or a whole study, with log-linear or 1/2N corrections. Fit an ROC curve to confidence ratings and get Az and the z-ROC slope."
status: live
ads: true
order: 721
icon: target
works: offline
updated: 2026-11-09
related: [reliability-analysis, sample-size, plot-maker, uncertainty-calculator, reaction-time-experiments, staircase-threshold-fitter, roc-curve, memory-attention-tasks, effect-size-converter]
sources:
  - "Formulas: Green and Swets (1966); Macmillan and Creelman, Detection Theory: A User's Guide; Grier (1971) for A′ and B″; Hautus (1995) and Macmillan and Kaplan (1985) for corrections; Gourevitch and Galanter (1967) for the variance of d′; Dorfman and Alf (1969) for the maximum likelihood ROC fit."
  - "All example numbers are made up."
flow:
  - { icon: table, label: "Counts" }
  - { icon: sigma, label: "d′ and c" }
  - { icon: curve, label: "ROC curve" }
  - { icon: download, label: "Report" }
---

## What it does

Signal detection theory separates two things that plain percent correct mixes together: how well someone can tell a signal from noise (**sensitivity, d′**) and how willing they are to say "yes" (**bias, c and β**). It is used in perception and memory experiments, in recognition tests, in radiology reading studies and anywhere people make yes/no decisions under uncertainty. This calculator gives all the usual measures from your counts, works on a whole class or study at once, and fits a full ROC curve when you have confidence ratings. Everything runs in your browser; nothing is uploaded.

Collect hits and false alarms with the [[memory-attention-tasks|memory and attention tasks]], and find a detection threshold with the [[staircase-threshold-fitter|staircase threshold fitter]].

## How to use it

1. Pick **One table**, **Many people** or **Ratings (ROC)**.
2. **One table:** type the number of hits (said "yes" when the signal was there), misses, false alarms (said "yes" to noise) and correct rejections.
3. **Many people:** paste one row per person with a name and the same four counts, or open a CSV or Excel file. The table gives d′, c, β and A′ for each row, and the CSV download has every measure for your statistics package.
4. **Ratings (ROC):** paste one row per confidence rating with the number of signal and noise trials that got that rating. Say whether the first row is the surest "signal" or the surest "noise".
5. Choose how to handle **rates of 0 or 1**. A perfect hit rate gives an infinite d′, so it has to be pulled in. **1/2N** changes only the rates that need it, by half a trial. **Log-linear** adds 0.5 to every count before working out the rates; it is less biased and treats everyone the same, so use it when comparing people. **No correction** leaves the rates as they are.
6. Download the result as CSV, or as an image, PDF or Word report.

## What the numbers mean

- **d′** = z(hit rate) − z(false-alarm rate): the distance between the signal and noise distributions in standard deviations. 0 is guessing, 1 is modest, 2 is good, above 3 is excellent. The 95 % interval uses the large-sample variance of d′, so treat it as rough with fewer than about 50 trials of each kind.
- **c** = −(z(H) + z(F)) / 2: where the criterion sits. Positive c is cautious (more "no"), negative c is liberal (more "yes"). **β** is the likelihood ratio at the criterion; 1 is neutral. **c′** is c divided by d′.
- **A′** and **B″** are versions of sensitivity and bias that do not assume normal distributions (Grier's formulas).
- **Az** is the area under the ROC curve. From one table it can only be estimated by assuming equal variances (Φ(d′/√2)); with ratings, the tool fits the curve and also gives the **z-ROC slope**. A slope well below 1 means the signal distribution is wider than the noise distribution, which is common in memory research, and then **da** or Az is a better sensitivity measure than d′.

## Worked example

The one-table example has 42 hits, 8 misses, 12 false alarms and 38 correct rejections (made-up numbers). The hit rate is 84.0 % and the false-alarm rate 24.0 %, so z(H) = 0.994 and z(F) = −0.706. That gives **d′ = 1.701** (95 % interval 1.136 to 2.266), **c = −0.144** (about neutral, slightly liberal), β = 0.783 and A′ = 0.876.

In the "Many people" example, P04 had 50 hits out of 50. With the 1/2N rule the hit rate becomes 99.0 % and d′ = 3.242; the rate is marked so you can see it was corrected.

The ratings example uses a 6-point scale with 100 signal and 100 noise trials. The maximum likelihood fit gives **Az = 0.814 ± 0.030**, a z-ROC slope of 0.818 and G² = 0.240 on 3 degrees of freedom (p = 0.971), so the normal model fits well. The least squares line through the z-points agrees closely (Az 0.814), and the area under the straight lines joining the points is 0.805.

## Tips

- Decide on the correction before looking at results, and use the same one for everyone in a study.
- With ratings, use at least 4 categories and spread them so every category gets some answers.
- d′ assumes the two distributions are normal with equal spread. If your ratings ROC has a slope far from 1, report da or Az.

## Frequently asked questions

**Why is d′ infinite?** A hit rate of 100 % or a false-alarm rate of 0 % has an infinite z score. Choose one of the corrections.

**Is β or c better for bias?** c is usually preferred because it does not depend on d′ (Macmillan and Creelman). Both are shown.

**Was this checked?** Yes. Every measure was compared with SciPy's normal distribution functions, and the ROC fit with the same likelihood maximised by scipy.optimize, to at least five decimal places.

**Is my data sent anywhere?** No. It stays in this page and the page works offline.
