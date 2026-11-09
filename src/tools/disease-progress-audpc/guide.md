---
name: Disease progress (AUDPC)
num: 330
shelf: science
section: mycology-and-plant-pathology
title: "AUDPC calculator: area under the disease progress curve, AUDPS and apparent infection rate (logistic, Gompertz)"
summary: "Paste disease severity over time for one or many plots or cultivars. Get the area under the disease progress curve (AUDPC), the area under the disease progress stairs (AUDPS), their relative values, and the apparent infection rate from monomolecular, logistic and Gompertz models, with plots and CSV."
status: live
ads: true
order: 330
icon: chart
works: offline
updated: 2026-11-09
related: [trend-analyser, dose-response, lc50-probit, plot-maker, sample-size, leaf-disease-severity, epidemic-model, field-trial-designer, yield-trial-anova]
sources:
  - "AUDPC: G. Shaner and R. E. Finney, Phytopathology 67, 1051-1056 (1977). AUDPS: I. Simko and H.-P. Piepho, Phytopathology 102, 381-389 (2012). Models and transforms: C. L. Campbell and L. V. Madden, Introduction to Plant Disease Epidemiology (Wiley, 1990); J. E. Vanderplank, Plant Diseases: Epidemics and Control (1963). Formulas only."
  - "Checked in the tests against Python: numpy.trapezoid for AUDPC, the stairs definition of AUDPS, scipy.stats.linregress for the linearised rates and scipy.optimize.curve_fit for the curve fits and their standard errors (SciPy 1.18)."
  - "The example epidemics are made up."
flow:
  - { icon: table, label: "Severity" }
  - { icon: sigma, label: "AUDPC" }
  - { icon: curve, label: "Models" }
  - { icon: download, label: "Download" }
---

## What it does

When a plant disease is rated several times through a season, the ratings make a **disease progress curve**. Plant pathologists sum up the whole epidemic in one number, the **area under the disease progress curve (AUDPC)**. Breeders use it to rank cultivars for resistance, and agronomists to compare fungicide programmes. This tool works it out for any number of curves at once, and fits the classic growth models to find how fast the disease spread.

- **AUDPC** joins the ratings with straight lines and adds up the trapezoids: Σ (yᵢ + yᵢ₊₁)/2 × (tᵢ₊₁ − tᵢ).
- **AUDPS**, the area under the disease progress **stairs** (Simko and Piepho 2012), treats each rating as a bar one interval wide. AUDPC underweights the first and last ratings; AUDPS gives them their full weight: AUDPS = AUDPC + (y₁ + yₙ)/2 × (tₙ − t₁)/(n − 1).
- **Relative AUDPC and AUDPS** divide by the largest possible area, so epidemics of different lengths or rating scales can be compared on a 0 to 1 scale.
- **Monomolecular**, **logistic** and **Gompertz** models give the **apparent infection rate r**. The monomolecular model suits diseases that spread from inoculum already in the field (one cycle a season). The logistic and Gompertz models suit diseases with many cycles a season. For the logistic model, r is Vanderplank's apparent infection rate.

Score each plot's severity on the day with [[leaf-disease-severity]], and compare treatments across plots with the [[yield-trial-anova]].

## How to use it

1. Paste a table, or open a CSV, TSV, TXT or Excel file: time in the first column (days after planting, for example), then one column per plot, cultivar or treatment, with a header row of names. Blank cells are skipped.
2. **Values are**: percent (0 to 100), proportions (0 to 1), or a rating scale (give its highest value, such as 9).
3. **Time unit**: used in the labels and units, such as %-days.
4. **Curve to draw**: the best-fitting model for each curve, one model for all, or just the points joined.

## Worked example

The made-up example rates two cultivars weekly from day 0 to day 35. Cultivar A goes from 1 % to 58 %; Cultivar B from 0.5 % to 15 %. The page shows **Highest AUDPC: Cultivar A, 731.5 %-days**.

- Cultivar A: AUDPC 731.5, AUDPS 938, relative AUDPC 0.209, relative AUDPS 0.223.
- Cultivar B: AUDPC 169.8, AUDPS 224, relative AUDPC 0.0485, relative AUDPS 0.0533.

For Cultivar A, the linearised logistic rate is 0.1428 ± 0.0062 per day (R² 0.9924); the least-squares logistic rate is 0.1218. The **Gompertz** model fits best, with r = 0.07081 ± 0.0019 per day, R² 0.9989 and residual SD 0.00847. Cultivar B also follows the Gompertz model best, with a rate less than half that of A: it is clearly the more resistant cultivar.

## Tips

- Rate on the same dates for every plot; AUDPS assumes even spacing (with uneven dates it uses the average interval).
- Compare AUDPC only between curves rated over the same period, or use the relative values.
- Linearised fits leave out ratings of 0 and 100 %, which cannot be transformed; the least-squares fits use every point.
- A model with a clearly lower residual SD and no pattern in the residuals is the better description of the epidemic.

## FAQs

**AUDPC or AUDPS?** Use AUDPS when the first or last rating matters, or when some plots were rated fewer times; it ranks curves more fairly. Many papers still report AUDPC, so the tool gives both.

**Can I use incidence instead of severity?** Yes. Any measure that rises from 0 to a maximum works.

**Is my data uploaded?** No. Everything runs in your browser.
