---
name: Drug release
num: 682
shelf: science
code: T479
section: biomedical-engineering
title: "Drug release"
summary: "Paste cumulative drug release against time and fit the six classic release models at once, with parameters and their errors, R², adjusted R², AIC, the best model and what the Korsmeyer-Peppas exponent n says about the mechanism. Also fits first-order mass loss of a degrading biomaterial, with its half-life. Release kinetics only, no doses."
status: live
ads: true
order: 682
icon: curve
works: offline
updated: 2026-11-09
related: [reaction-kinetics-fitter, enzyme-kinetics-fitter, binding-curve-fitter, plot-maker, pk-simulator, nca-pk, curve-fitter, diffusion-calculator]
sources:
  - "Model forms as reviewed by Costa, P. and Sousa Lobo, J. M. (2001), Modeling and comparison of dissolution profiles, European Journal of Pharmaceutical Sciences 13, 123 to 133; Korsmeyer et al. (1983) and the exponent limits for slab, cylinder and sphere from Ritger, P. L. and Peppas, N. A. (1987), Journal of Controlled Release 5, 23 to 36 (general model facts). AIC in the form n·ln(SSE/n) + 2k used by Zhang et al. (2010), DDSolver."
  - "Checked against scipy.optimize.curve_fit: the parameters, standard errors, SSE, R² and AIC of all six models on the example, and the degradation rate constant with the starting mass fixed and fitted; plus exact recovery of each model from noise-free curves."
  - "The example release and mass-loss data are made up by fibub; they are not from any product, paper or database."
flow:
  - { icon: table, label: "Paste data" }
  - { icon: curve, label: "Fit models" }
  - { icon: sigma, label: "Compare" }
  - { icon: download, label: "Download" }
---

## What it does

In a dissolution or release test you measure how much of a drug (or any active substance) has left a tablet, film, gel or microsphere over time. Fitting that curve to a kinetic model gives a rate constant to compare formulations and a hint about how release works. This page fits six models at once:

- **Zero order**, F = k₀·t: a constant rate, as from a reservoir or an eroding matrix.
- **First order**, F = 100·(1 − e^(−k₁·t)): the rate falls with the amount left.
- **Higuchi**, F = k_H·√t: diffusion out of a matrix.
- **Korsmeyer-Peppas**, F = k·tⁿ: fitted to the first part of the curve (up to 60 % by default). The exponent n tells Fickian diffusion from swelling or erosion, with limits that depend on the shape: 0.5 and 1.0 for a slab or film, 0.45 and 0.89 for a cylinder, 0.43 and 0.85 for a sphere.
- **Hixson-Crowell**, (100 − F)^⅓ = 100^⅓ − k·t: particles that dissolve and shrink evenly.
- **Weibull**, F = 100·(1 − e^(−(t/τ)^β)): an empirical curve; τ is the time to 63.2 % and β its shape.

Each fit gives parameters with standard errors, R², adjusted R² and AIC, and the model with the lowest AIC is marked best. A second panel fits **first-order degradation** of a biomaterial's mass, M = M₀·e^(−k·t), and gives the half-life.

Fit any other model with the [[curve-fitter|curve fitter]], and follow the released drug through the body in the [[pk-simulator|PK simulator]].

## How to use it

1. Paste time and cumulative release (%), or press **Open a file**. Choose **Fraction** if your values run from 0 to 1.
2. Choose the **shape** of the dosage form for reading n, and the **Peppas limit** if you use a different cut-off.
3. Read the table: compare AIC (lower is better) and adjusted R². The chart shows the data with every model; the best is drawn solid.
4. For degradation, paste time and mass remaining (or mass lost) in percent. Untick **Start at exactly 100 %** to fit the starting mass too.
5. Download the fits as CSV, or the report as an image, PDF or Word file.

## Worked example

The made-up release data run from 7.9 % at 0.25 h to 95.8 % at 24 h. Weibull fits best: τ = 4.968 h and β = 0.8107, R² = 0.9992, AIC 0.45. First order follows with k₁ = 0.2034 per hour (R² 0.9840, AIC 33.88); Higuchi (R² 0.9148) and zero order (R² 0.2344) fit poorly, as the curve levels off. Korsmeyer-Peppas, fitted to the 6 points up to 60 %, gives n = 0.664, which for a cylinder is anomalous (non-Fickian) transport: diffusion together with swelling or erosion.

The made-up degradation data fall from 100 % to 14.5 % over 56 days. With M₀ fixed at 100 %, k = 0.03551 per day, so the half-life is 19.5 days and R² = 0.9996.

## FAQ

**Why not fit straight lines to transformed data?** Log and square-root transforms change the weight of each point, and their R² values cannot be compared between models. Fitting the release values directly keeps them comparable.

**Is a high R² proof of the mechanism?** No. Several models can fit the same curve. Use the fits together with what you know about the formulation.

**Does this calculate doses?** No. It only describes release curves and mass loss.

**Is my data uploaded?** No. Everything runs in your browser and works offline.
