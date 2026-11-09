---
name: Body condition and growth curve tracker
num: 399
shelf: science
section: animal-science
title: "Growth curve tracker: average daily gain, Gompertz, logistic and von Bertalanffy curves and body condition trend from weigh records"
summary: "Paste or open your weigh records (animal, date, weight and optional body condition score) to get the average daily gain between weighings, fit Gompertz, logistic and von Bertalanffy growth curves with mature weight and growth rate, and see the body condition trend. Nothing is uploaded."
status: live
ads: false
order: 399
icon: curve
works: offline
updated: 2026-11-09
related: [feed-ration-balancer, breeding-calendar, plot-maker, trend-analyser]
sources:
  - "Growth models: Gompertz W = A·exp(−b·e^(−kt)), logistic W = A/(1 + b·e^(−kt)) and von Bertalanffy W = A·(1 − b·e^(−kt))³, in the forms common in animal science (see for example Fitzhugh, H. A. (1976), Analysis of growth curves and strategies for altering their shape, Journal of Animal Science 42, 1036–1051). Formulas only."
  - "Fitted by Levenberg-Marquardt nonlinear least squares with standard errors from s²(JᵀJ)⁻¹; AIC = n·ln(SSE/n) + 2(p + 1)."
  - "Checked against scipy.optimize.curve_fit on the example (all three curves, pooled and per animal: the same A, b, k, standard errors and residual sums of squares) and on exact curves; the body condition slope against scipy.stats.linregress."
  - "The example weigh records are made up by fibub; they are not real animals."
flow:
  - { icon: table, label: "Weighings" }
  - { icon: calculator, label: "Daily gain" }
  - { icon: curve, label: "Fit curves" }
  - { icon: chart, label: "Condition" }
---

## What it does

Weighing animals regularly tells you whether they are growing as planned. This tracker turns a list of weighings into the numbers farmers, students and researchers use:

- **Average daily gain (ADG)** between each pair of weighings, for every animal, and over the whole period.
- **Growth curves**: the Gompertz, logistic and von Bertalanffy curves, fitted by nonlinear least squares. Each gives a **mature weight** A (the weight the curve levels off at), a growth **rate k** per day, and the **inflection point**, the day and weight at which the animal grows fastest.
- **Body condition score (BCS) trend**: if you give scores, a straight line through them shows whether condition is rising or falling, in points per 30 days.

Set the feed behind the growth with the [[feed-ration-balancer]], and the next matings with the [[breeding-calendar]].

## How to use it

1. Paste your weigh records, one weighing per line: the animal's name or tag, the date (2026-03-14) or the age in days, the weight, and if you have it, the body condition score on whatever scale you use. **Open a file** reads a CSV or Excel sheet with those columns.
2. Pick an animal, or **All animals together** to fit one curve to the group. With dates, time is counted from each animal's first weighing; with ages, the ages are used as they are, which is better for pooling animals born on different days.
3. Pick which curve to draw on the figure. The table shows all three, with the lowest AIC (the best balance between fit and number of parameters) in bold.
4. Download the gains or the fitted curves as CSV, or the whole report as an image, PDF or Word file.

## Worked example

Press **Use the example** and pick **Calf 41**: 12 made-up weighings from 42 kg on 2025-03-01 to 444 kg on 2026-08-20. Its average daily gain is **0.749 kg/day over 537 days**; the first interval (45 days, +41 kg) is 0.911 kg/day.

The von Bertalanffy curve fits best (AIC 33.8, residual standard error 3.38 kg): mature weight A = 554.7 ± 11 kg, k = 0.0038 per day, fastest growth around day 136 at 164 kg. The Gompertz curve gives A = 514.9 ± 13 kg (AIC 45.8) and the logistic curve 463.1 ± 15 kg (AIC 62.5). The three curves agree on the data but disagree on the mature weight, which is normal when weighings stop before growth levels off.

The body condition scores dip to 2.75 in winter and recover; the straight-line trend is +0.012 points per 30 days, about 3.19 now.

## Tips

- Weigh at the same time of day, before feeding, so gut fill does not swamp the gain.
- A fitted mature weight far above your heaviest animal means the data have not reached the plateau. The tool warns you when A is more than 1.5 times the heaviest weight.
- Compare animals with the same model; A and k from different models are not interchangeable.

## FAQ

**Which curve should I use?** Gompertz is common for cattle and poultry, von Bertalanffy for fish and many mammals, the logistic where growth is symmetric around its inflection. Use the AIC as a guide.

**Is my data uploaded?** No. Everything runs in your browser and works offline. This is a study and planning aid, not a substitute for advice from your vet or nutritionist.
